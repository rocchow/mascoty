import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateShareSlug } from "@/lib/free-trial/slug";
import { runFreeTrialGeneration } from "@/lib/free-trial/generate";
import { getRequestIp, hashIp } from "@/lib/free-trial/ip";
import type { MascotColor, MascotParams, MascotStyle } from "@/types/mascot";
import { MASCOT_STYLES } from "@/types/mascot";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STYLE_VALUES = MASCOT_STYLES.map((s) => s.value) as MascotStyle[];

function s(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

function normalizeColors(raw: unknown): MascotColor[] {
  if (!Array.isArray(raw)) return [];
  const out: MascotColor[] = [];
  for (const c of raw) {
    if (!c || typeof c !== "object") continue;
    const name = (c as { name?: unknown }).name;
    const hex = (c as { hex?: unknown }).hex;
    if (
      typeof name === "string" &&
      typeof hex === "string" &&
      /^#?[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(hex.trim())
    ) {
      const cleanHex = hex.trim().startsWith("#") ? hex.trim() : `#${hex.trim()}`;
      out.push({ name: name.slice(0, 40), hex: cleanHex.toUpperCase() });
    }
  }
  return out.slice(0, 6);
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const email = s(body.email, 254).toLowerCase();
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const name = s(body.name, 60);
  if (!name) {
    return NextResponse.json({ error: "missing_name" }, { status: 400 });
  }
  const role = s(body.role, 120);
  const personality = s(body.personality, 120);
  const species = s(body.species, 60);
  const description = s(body.description, 400);

  const style = STYLE_VALUES.includes(body.style as MascotStyle)
    ? (body.style as MascotStyle)
    : "3d-pixar";

  const colors = normalizeColors(body.colors);
  if (colors.length === 0) {
    return NextResponse.json({ error: "missing_colors" }, { status: 400 });
  }

  const url = typeof body.url === "string" ? body.url.slice(0, 500) : null;
  const galleryOptIn = body.galleryOptIn === true;

  const supabase = createAdminClient();

  const ipHash = hashIp(getRequestIp(request));

  // Reserve a slot atomically (advisory-lock + per-IP + global count).
  const shareSlug = generateShareSlug(10);
  const { data: reserveResult, error: reserveError } = await supabase.rpc(
    "reserve_free_trial_slot",
    {
      p_share_slug: shareSlug,
      p_email: email,
      p_ip_hash: ipHash,
      p_url: url,
      p_name: name,
      p_role: role || null,
      p_personality: personality || null,
      p_species: species || null,
      p_description: description || null,
      p_style: style,
      p_colors: colors,
      p_gallery_opt_in: galleryOptIn,
    },
  );

  if (reserveError) {
    console.error("[free-trial] reserve failed", reserveError);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }

  const result = reserveResult as { id: string | null; reason: string } | null;
  if (!result || !result.id) {
    const reason = result?.reason ?? "rate_limited";
    return NextResponse.json({ error: reason }, { status: 429 });
  }

  const generationId = result.id;
  const params: MascotParams = {
    name,
    role,
    personality,
    species,
    description,
    style,
    colors,
  };

  // Kick off in the background; don't await.
  runFreeTrialGeneration(generationId, shareSlug, email, params).catch(
    (err) => console.error("[free-trial] background failed", err),
  );

  return NextResponse.json({
    id: generationId,
    shareSlug,
    status: "pending",
  });
}
