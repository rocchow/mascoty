import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe/client";
import { PLEDGE_CREDIT_LABEL } from "@/lib/pledge";

const NOTIFY_TO = "roc@generatr.ca";
const NOTIFY_FROM = process.env.RESEND_FROM || "Mascoty Pledges <onboarding@resend.dev>";

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function notifyPledge(session: Stripe.Checkout.Session) {
  const email = session.customer_details?.email ?? session.customer_email ?? null;
  const name = session.customer_details?.name ?? null;
  const amount = session.amount_total ?? 0;
  const currency = (session.currency ?? "usd").toUpperCase();
  const intent =
    (typeof session.metadata?.intent === "string" && session.metadata.intent.trim().length > 0
      ? session.metadata.intent
      : null) ?? null;

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("[pledge] paid but RESEND_API_KEY missing — session", session.id);
    return;
  }

  const intentHtml = intent
    ? `<div style="margin:0 0 16px;padding:12px 14px;background:#f6f6f7;border-left:3px solid #7c3aed;border-radius:4px;font-size:14px;line-height:1.5;white-space:pre-wrap">${escapeHtml(
        intent,
      )}</div>`
    : "";

  const rows = [
    ["Email", email ?? "—"],
    ["Name", name ?? "—"],
    ["Amount", `${(amount / 100).toFixed(2)} ${currency}`],
    ["Launch credit owed", PLEDGE_CREDIT_LABEL],
    ["Session", session.id],
  ]
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#666;font-size:13px;white-space:nowrap;vertical-align:top">${escapeHtml(
          String(k),
        )}</td><td style="padding:6px 0;font-size:13px;word-break:break-word">${escapeHtml(String(v))}</td></tr>`,
    )
    .join("");

  const html = `<!doctype html><html><body style="font-family:-apple-system,Segoe UI,sans-serif;color:#111"><h2 style="margin:0 0 12px;font-size:16px">New Mascoty $1 backer</h2>${intentHtml}<table style="border-collapse:collapse">${rows}</table></body></html>`;
  const text = `New Mascoty $1 backer\n\nUse case: ${intent ?? "(not provided)"}\n\nEmail: ${email ?? "—"}\nName: ${name ?? "—"}\nAmount: ${(amount / 100).toFixed(2)} ${currency}\nLaunch credit owed: ${PLEDGE_CREDIT_LABEL}\nSession: ${session.id}\n`;

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
        reply_to: email ?? undefined,
        subject: `Mascoty $1 backer: ${email ?? session.id}`,
        html,
        text,
      }),
    });
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error("[pledge] resend failed", res.status, errText.slice(0, 500));
    }
  } catch (err) {
    console.error("[pledge] resend threw", err);
  }
}

export async function POST(request: Request) {
  const secret = process.env.STRIPE_PLEDGE_WEBHOOK_SECRET ?? process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[pledge] webhook secret not set");
    return NextResponse.json({ error: "webhook_secret_missing" }, { status: 500 });
  }

  const sig = request.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "missing_signature" }, { status: 400 });
  }

  const rawBody = await request.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(rawBody, sig, secret);
  } catch (err) {
    console.error("[pledge] signature verification failed", err);
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.metadata?.kind === "pledge" && session.payment_status === "paid") {
      console.log("[pledge] paid", session.id, session.customer_details?.email);
      await notifyPledge(session);
    }
  }

  return NextResponse.json({ received: true });
}
