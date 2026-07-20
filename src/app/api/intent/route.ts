import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const NOTIFY_TO = "roc@generatr.ca";
const NOTIFY_FROM = process.env.RESEND_FROM || "Mascoty Waitlist <onboarding@resend.dev>";

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function notifyByEmail(record: {
  ts: string;
  email: string;
  source: string;
  intent: string | null;
  ua: string | null;
  ref: string | null;
}) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("[intent] RESEND_API_KEY not set — skipping email");
    return;
  }

  const intentHtml = record.intent
    ? `<div style="margin:0 0 16px;padding:12px 14px;background:#f6f6f7;border-left:3px solid #7c3aed;border-radius:4px;font-size:14px;line-height:1.5;white-space:pre-wrap">${escapeHtml(
        record.intent,
      )}</div>`
    : `<div style="margin:0 0 16px;padding:12px 14px;background:#f6f6f7;border-radius:4px;font-size:13px;color:#888;font-style:italic">No use case provided</div>`;

  const rows = [
    ["Email", record.email],
    ["Source", record.source],
    ["Time", record.ts],
    ["Referer", record.ref ?? "—"],
    ["User-Agent", record.ua ?? "—"],
  ]
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#666;font-size:13px;white-space:nowrap;vertical-align:top">${escapeHtml(
          String(k),
        )}</td><td style="padding:6px 0;font-size:13px;word-break:break-word">${escapeHtml(String(v))}</td></tr>`,
    )
    .join("");

  const html = `<!doctype html><html><body style="font-family:-apple-system,Segoe UI,sans-serif;color:#111"><h2 style="margin:0 0 12px;font-size:16px">New Mascoty waitlist signup</h2><div style="font-size:12px;color:#888;text-transform:uppercase;letter-spacing:.05em;margin:0 0 6px">Use case</div>${intentHtml}<table style="border-collapse:collapse">${rows}</table></body></html>`;
  const text = `New Mascoty waitlist signup\n\nUse case: ${record.intent ?? "(not provided)"}\n\nEmail: ${record.email}\nSource: ${record.source}\nTime: ${record.ts}\nReferer: ${record.ref ?? "—"}\nUser-Agent: ${record.ua ?? "—"}\n`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: NOTIFY_FROM,
        to: [NOTIFY_TO],
        reply_to: record.email,
        subject: `Mascoty waitlist: ${record.email}`,
        html,
        text,
      }),
    });
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error("[intent] resend failed", res.status, errText.slice(0, 500));
    }
  } catch (err) {
    console.error("[intent] resend threw", err);
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const email =
    typeof (body as { email?: unknown })?.email === "string"
      ? ((body as { email: string }).email).trim().toLowerCase()
      : "";

  if (!email || !EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const source =
    typeof (body as { source?: unknown })?.source === "string"
      ? (body as { source: string }).source.slice(0, 64)
      : "landing";

  const rawIntent = (body as { intent?: unknown })?.intent;
  const intent =
    typeof rawIntent === "string" && rawIntent.trim().length > 0
      ? rawIntent.trim().slice(0, 500)
      : null;

  const record = {
    ts: new Date().toISOString(),
    email,
    source,
    intent,
    ua: request.headers.get("user-agent")?.slice(0, 200) ?? null,
    ref: request.headers.get("referer") ?? null,
  };

  console.log("[intent]", JSON.stringify(record));

  await notifyByEmail(record);

  return NextResponse.json({ ok: true });
}
