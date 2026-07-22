import { NextResponse } from "next/server";
import { extractBrandFromUrl } from "@/lib/brand/extract";
import { createAdminClient } from "@/lib/supabase/admin";
import { fingerprintRequest } from "@/lib/free-trial/ip";

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

  // Import piggybacks on the same daily gate as Generate — otherwise this
  // endpoint is an unbounded gpt-4o-mini + URL-scraper for anyone with a
  // shell loop. If the caller has already burned today's slot, don't spend
  // more OpenAI credits helping them fill out a brief they can't submit.
  const supabase = createAdminClient();
  const ipHash = fingerprintRequest(request);
  const { data: quotaRaw } = await supabase.rpc("get_free_trial_quota", {
    p_ip_hash: ipHash,
  });
  const quota = quotaRaw as { ip_used_today: boolean | null } | null;
  if (quota?.ip_used_today) {
    return NextResponse.json({ error: "ip_daily_limit" }, { status: 429 });
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
