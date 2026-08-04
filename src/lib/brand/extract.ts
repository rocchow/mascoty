import { getOpenAI } from "@/lib/openai/client";
import type { MascotColor, MascotStyle } from "@/types/mascot";
import { MASCOT_STYLES } from "@/types/mascot";

export interface ExtractedBrand {
  name: string;
  role: string;
  personality: string;
  species: string;
  speciesOptions: string[];
  description: string;
  style: MascotStyle;
  colors: MascotColor[];
  sourceTitle?: string;
}

const MAX_HTML_BYTES = 500_000; // 500 KB
const FETCH_TIMEOUT_MS = 8_000;
const MAX_TEXT_CHARS = 8_000;

const STYLE_VALUES = MASCOT_STYLES.map((s) => s.value) as MascotStyle[];

function stripHtml(html: string): { title: string | null; text: string } {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim().slice(0, 200) : null;

  // Prefer meta description as a strong signal.
  const metaDesc = html.match(
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i,
  );
  const ogDesc = html.match(
    /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i,
  );
  const ogTitle = html.match(
    /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i,
  );

  const stripped = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();

  const parts = [
    ogTitle?.[1],
    metaDesc?.[1],
    ogDesc?.[1],
    stripped,
  ].filter(Boolean);

  return {
    title,
    text: parts.join("\n\n").slice(0, MAX_TEXT_CHARS),
  };
}

async function fetchPage(url: string): Promise<{ title: string | null; text: string }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; MascotyBot/1.0; +https://mascoty.ai)",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const ct = res.headers.get("content-type") ?? "";
    if (!ct.includes("html") && !ct.includes("text")) {
      throw new Error(`Unsupported content-type: ${ct}`);
    }

    const reader = res.body?.getReader();
    if (!reader) throw new Error("No response body");

    const chunks: Uint8Array[] = [];
    let received = 0;
    while (received < MAX_HTML_BYTES) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      received += value.length;
    }
    await reader.cancel().catch(() => {});

    const buf = Buffer.concat(chunks.map((c) => Buffer.from(c)));
    const html = buf.toString("utf-8");
    return stripHtml(html);
  } finally {
    clearTimeout(timeout);
  }
}

const SYSTEM_PROMPT = `You extract mascot brand briefs from website text. Return STRICT JSON matching this shape:
{
  "name": string,           // brand name — proper noun, or invented mascot name if the brand doesn't have one
  "role": string,           // one short phrase, e.g. "Charging companion for hotel guests"
  "personality": string,    // 2-4 adjectives, e.g. "Friendly, energetic, reliable"
  "speciesOptions": [string, string, string, string, string], // exactly 5 distinct creature/form ideas, best pick FIRST
  "description": string,    // 1-2 sentences describing look & vibe (matches speciesOptions[0])
  "style": one of ["3d-pixar","flat-vector","anime","watercolor","pixel-art","clay-3d","sticker","minimalist"],
  "colors": [                // 3-5 brand colors
    { "name": string, "hex": string }  // hex like "#RRGGBB"
  ]
}

SPECIES RULES — this is the highest-signal decision in the brief:
- Return exactly 5 species candidates, from DIFFERENT angles: literal brand-name reference, industry metaphor, personality-driven, culturally/regionally relevant, and unexpected-but-fitting.
- Each candidate is one short noun phrase (1–4 words). No repeats, no near-duplicates ("Owl" vs "Wise Owl" is a repeat).
- AVOID lazy clichés unless the brand explicitly evokes them:
    * Owl → wisdom / knowledge / AI / assistant / learning / productivity
    * Fox → clever / stealth
    * Panda → friendly / cute default
    * Robot → any tech company by default
    * Lion → strength / leadership
  Only use one of these when the brand is literally about that thing (e.g. Duolingo really is a language app, so an owl is on-nose — but a nutrition site or kanban tool is NOT an owl). If you catch yourself reaching for one of these, replace it with something more specific to this brand.
- Put the strongest, most distinctive pick FIRST.

Pick a style that matches the brand's tone. If the text is thin, be creative but grounded in whatever signals exist.`;

function normalizeStyle(raw: unknown): MascotStyle {
  if (typeof raw === "string" && STYLE_VALUES.includes(raw as MascotStyle)) {
    return raw as MascotStyle;
  }
  return "3d-pixar";
}

function normalizeHex(hex: unknown): string | null {
  if (typeof hex !== "string") return null;
  const m = hex.trim().match(/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
  if (!m) return null;
  const val = m[1];
  const full = val.length === 3
    ? val.split("").map((c) => c + c).join("")
    : val;
  return "#" + full.toUpperCase();
}

function normalizeColors(raw: unknown): MascotColor[] {
  if (!Array.isArray(raw)) return DEFAULT_COLORS;
  const out: MascotColor[] = [];
  for (const c of raw) {
    if (!c || typeof c !== "object") continue;
    const name = (c as { name?: unknown }).name;
    const hex = normalizeHex((c as { hex?: unknown }).hex);
    if (typeof name === "string" && hex) {
      out.push({ name: name.slice(0, 40), hex });
    }
  }
  return out.length ? out.slice(0, 6) : DEFAULT_COLORS;
}

const DEFAULT_COLORS: MascotColor[] = [
  { name: "Electric Violet", hex: "#6366F1" },
  { name: "Deep Indigo", hex: "#4F46E5" },
  { name: "Warm White", hex: "#FAFAFA" },
];

function truncate(s: unknown, n: number, fallback: string): string {
  if (typeof s !== "string" || !s.trim()) return fallback;
  return s.trim().slice(0, n);
}

export async function extractBrandFromUrl(url: string): Promise<ExtractedBrand> {
  let title: string | null = null;
  let pageText = "";

  try {
    const page = await fetchPage(url);
    title = page.title;
    pageText = page.text;
  } catch (err) {
    // Fall through: we'll still ask the LLM using just the URL as context.
    console.warn("[extract] fetch failed", url, err);
  }

  const userInput = pageText
    ? `URL: ${url}\nPAGE TITLE: ${title ?? "(none)"}\n\nPAGE TEXT (truncated):\n${pageText}`
    : `URL: ${url}\n(Could not fetch page — infer a plausible brand from the URL alone.)`;

  const completion = await getOpenAI().chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    temperature: 0.7,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userInput },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";
  let parsed: Record<string, unknown> = {};
  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = {};
  }

  const speciesOptions = normalizeSpeciesOptions(
    parsed.speciesOptions,
    parsed.species,
  );

  return {
    name: truncate(parsed.name, 60, title?.split(/[|—-]/)[0].trim() || "Mascot"),
    role: truncate(parsed.role, 120, "Brand companion"),
    personality: truncate(parsed.personality, 120, "Friendly, energetic, approachable"),
    species: speciesOptions[0] ?? truncate(parsed.species, 60, "Cute creature"),
    speciesOptions,
    description: truncate(parsed.description, 400, "A memorable mascot for the brand."),
    style: normalizeStyle(parsed.style),
    colors: normalizeColors(parsed.colors),
    sourceTitle: title ?? undefined,
  };
}

function normalizeSpeciesOptions(raw: unknown, fallbackPrimary: unknown): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  const push = (v: unknown) => {
    if (typeof v !== "string") return;
    const trimmed = v.trim().slice(0, 60);
    if (!trimmed) return;
    const key = trimmed.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    out.push(trimmed);
  };
  if (Array.isArray(raw)) raw.forEach(push);
  // If the model regressed to the old shape, at least keep its top pick.
  push(fallbackPrimary);
  return out.slice(0, 5);
}
