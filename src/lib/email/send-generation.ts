import { APP_URL, APP_NAME } from "@/lib/constants";

const FROM =
  process.env.RESEND_FROM || `${APP_NAME} <onboarding@resend.dev>`;

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export interface SendGenerationEmailArgs {
  email: string;
  shareSlug: string;
  mascotName: string;
  imageUrl: string;
}

export async function sendGenerationEmail({
  email,
  shareSlug,
  mascotName,
  imageUrl,
}: SendGenerationEmailArgs) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("[email] RESEND_API_KEY not set — skipping delivery");
    return;
  }

  const shareUrl = `${APP_URL.replace(/\/$/, "")}/s/${shareSlug}`;
  const name = escapeHtml(mascotName);
  const safeImage = escapeHtml(imageUrl);
  const safeShare = escapeHtml(shareUrl);

  const html = `<!doctype html>
<html>
  <body style="margin:0;background:#f6f5fb;font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#1a1830">
    <div style="max-width:560px;margin:0 auto;padding:32px 20px">
      <div style="text-align:center;margin-bottom:24px">
        <div style="font-size:20px;font-weight:800;letter-spacing:-.01em">
          <span style="color:#6366F1">Mascoty</span>
        </div>
      </div>

      <div style="background:#ffffff;border:1px solid #e6e4f0;border-radius:16px;padding:28px;box-shadow:0 4px 24px rgba(99,102,241,.06)">
        <h1 style="margin:0 0 6px;font-size:22px;line-height:1.25">
          ${name} is ready 🎉
        </h1>
        <p style="margin:0 0 20px;font-size:14px;color:#575468;line-height:1.5">
          Your character sheet is done. Turnaround views, expressions, poses, and palette — all on one sheet.
        </p>

        <a href="${safeShare}" style="display:block;border-radius:12px;overflow:hidden;border:1px solid #e6e4f0;margin-bottom:20px">
          <img src="${safeImage}" alt="${name} character sheet" style="display:block;width:100%;height:auto" />
        </a>

        <div style="text-align:center;margin:0 0 12px">
          <a href="${safeShare}" style="display:inline-block;background:#6366F1;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 22px;border-radius:10px">
            View & download &rarr;
          </a>
        </div>
        <div style="text-align:center">
          <a href="${safeImage}" style="font-size:12px;color:#6366F1;text-decoration:none">
            Direct PNG link
          </a>
        </div>
      </div>

      <p style="margin:24px 0 0;font-size:12px;color:#888;text-align:center;line-height:1.5">
        Made with Mascoty. Want more sheets, styles, or animated videos?<br/>
        <a href="${escapeHtml(APP_URL)}" style="color:#6366F1;text-decoration:none">See what's coming &rarr;</a>
      </p>
    </div>
  </body>
</html>`;

  const text = `${mascotName} is ready.

View & download: ${shareUrl}
Direct PNG: ${imageUrl}

— Mascoty`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to: [email],
      subject: `Your ${APP_NAME} character sheet: ${mascotName}`,
      html,
      text,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`resend ${res.status}: ${body.slice(0, 200)}`);
  }
}
