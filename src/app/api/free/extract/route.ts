import { NextResponse } from "next/server";
import { extractBrandFromUrl } from "@/lib/brand/extract";

function normalizeUrl(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const u = new URL(withScheme);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    // Block obviously-internal targets.
    const host = u.hostname.toLowerCase();
    if (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host.endsWith(".local") ||
      host.endsWith(".internal")
    ) {
      return null;
    }
    return u.toString();
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  let body: { url?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const rawUrl = typeof body?.url === "string" ? body.url : "";
  const url = normalizeUrl(rawUrl);
  if (!url) {
    return NextResponse.json({ error: "invalid_url" }, { status: 400 });
  }

  try {
    const brand = await extractBrandFromUrl(url);
    return NextResponse.json({ url, brand });
  } catch (err) {
    console.error("[extract] failed", err);
    return NextResponse.json(
      { error: "extract_failed", message: String(err).slice(0, 200) },
      { status: 500 },
    );
  }
}
