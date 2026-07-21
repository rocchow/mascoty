"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { MascotColor, MascotStyle } from "@/types/mascot";
import { MASCOT_STYLES } from "@/types/mascot";

type Stage =
  | "url-input"
  | "extracting"
  | "edit-brief"
  | "generating"
  | "done"
  | "rate-limited-ip"
  | "rate-limited-global"
  | "error";

interface ExtractedBrand {
  name: string;
  role: string;
  personality: string;
  species: string;
  description: string;
  style: MascotStyle;
  colors: MascotColor[];
}

interface Quota {
  remainingHourly: number;
  nextSlotAt: string | null;
  ipUsedToday: boolean;
  ipResetsAt: string | null;
}

const EMPTY_BRAND: ExtractedBrand = {
  name: "",
  role: "",
  personality: "",
  species: "",
  description: "",
  style: "3d-pixar",
  colors: [
    { name: "Electric Violet", hex: "#6366F1" },
    { name: "Deep Indigo", hex: "#4F46E5" },
    { name: "Warm White", hex: "#FAFAFA" },
  ],
};

function ChromeWrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="rounded-2xl border-2 border-border bg-white dark:bg-[#1a1830] shadow-xl overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-border dark:from-[#1e1b3a] dark:to-[#252240]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 text-center">
            <span className="text-xs text-muted font-mono">mascoty.ai</span>
          </div>
        </div>
        <div className="p-6 md:p-10">{children}</div>
      </div>
    </div>
  );
}

// "12m", "1h 03m", "34s" — for compact countdown on the Generate button.
function formatEta(target: Date, now: Date): string {
  const ms = target.getTime() - now.getTime();
  if (ms <= 0) return "now";
  const totalSec = Math.ceil(ms / 1000);
  if (totalSec < 60) return `${totalSec}s`;
  const totalMin = Math.ceil(totalSec / 60);
  if (totalMin < 60) return `${totalMin}m`;
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${h}h ${m.toString().padStart(2, "0")}m`;
}

export default function FreeTrialGenerator() {
  const [stage, setStage] = useState<Stage>("url-input");
  const [url, setUrl] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [brand, setBrand] = useState<ExtractedBrand>(EMPTY_BRAND);
  // Free trial defaults to public gallery — the user gets an explicit
  // "your sheet will be public, ok?" prompt right above Generate to opt out.
  const [galleryOptIn, setGalleryOptIn] = useState(true);
  const [generationId, setGenerationId] = useState<string | null>(null);
  const [shareSlug, setShareSlug] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [quota, setQuota] = useState<Quota | null>(null);
  const [nowTick, setNowTick] = useState(() => Date.now());
  const briefRef = useRef<HTMLDivElement>(null);

  const shareUrl = useMemo(
    () => (shareSlug ? `/s/${shareSlug}` : null),
    [shareSlug],
  );

  // Poll quota so the Generate button label stays fresh. Cheap DB read.
  useEffect(() => {
    let stopped = false;
    const fetchQuota = async () => {
      try {
        const res = await fetch("/api/free/quota", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as Quota;
        if (!stopped) setQuota(data);
      } catch {
        /* ignore */
      }
    };
    fetchQuota();
    const id = setInterval(fetchQuota, 30_000);
    return () => {
      stopped = true;
      clearInterval(id);
    };
  }, []);

  // 1s ticker so countdowns actually count down.
  useEffect(() => {
    const id = setInterval(() => setNowTick(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const handleImport = useCallback(async () => {
    setErrorMsg(null);
    if (!url.trim()) {
      setErrorMsg("Paste a URL first.");
      return;
    }
    setStage("extracting");
    try {
      const res = await fetch("/api/free/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const body = await res.json();
      if (!res.ok) {
        setStage("url-input");
        setErrorMsg(
          body?.error === "invalid_url"
            ? "That URL doesn't look right."
            : "Couldn't read that page. Try another URL.",
        );
        return;
      }
      setBrand({
        name: body.brand.name || "",
        role: body.brand.role || "",
        personality: body.brand.personality || "",
        species: body.brand.species || "",
        description: body.brand.description || "",
        style: body.brand.style || "3d-pixar",
        colors: Array.isArray(body.brand.colors) && body.brand.colors.length > 0
          ? body.brand.colors
          : EMPTY_BRAND.colors,
      });
      setStage("edit-brief");
      setTimeout(
        () =>
          briefRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
        50,
      );
    } catch {
      setStage("url-input");
      setErrorMsg("Network error. Try again.");
    }
  }, [url]);

  const handleSkipUrl = useCallback(() => {
    setBrand(EMPTY_BRAND);
    setStage("edit-brief");
  }, []);

  const handleGenerate = useCallback(async () => {
    setErrorMsg(null);
    if (!brand.name.trim()) {
      setErrorMsg("Give your mascot a name.");
      return;
    }

    setStage("generating");
    try {
      const res = await fetch("/api/free/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: url || null,
          galleryOptIn,
          ...brand,
        }),
      });
      const body = await res.json();
      if (res.status === 429) {
        if (body?.error === "ip_daily_limit") {
          setStage("rate-limited-ip");
        } else {
          setStage("rate-limited-global");
        }
        return;
      }
      if (!res.ok || !body?.id) {
        setStage("edit-brief");
        setErrorMsg("Something went wrong. Please try again.");
        return;
      }
      setGenerationId(body.id);
      setShareSlug(body.shareSlug);
    } catch {
      setStage("edit-brief");
      setErrorMsg("Network error. Try again.");
    }
  }, [brand, url, galleryOptIn]);

  // Poll for completion.
  useEffect(() => {
    if (stage !== "generating" || !generationId) return;
    let stopped = false;
    const tick = async () => {
      try {
        const res = await fetch(`/api/free/generation/${generationId}`);
        if (!res.ok) return;
        const data = await res.json();
        if (stopped) return;
        if (data.status === "completed" && data.imageUrl) {
          setImageUrl(data.imageUrl);
          setStage("done");
        } else if (data.status === "failed") {
          setStage("error");
          setErrorMsg("Generation failed. Please try again — no slot was used.");
        }
      } catch {
        // swallow, next tick will retry
      }
    };
    const interval = setInterval(tick, 3000);
    tick();
    return () => {
      stopped = true;
      clearInterval(interval);
    };
  }, [stage, generationId]);

  const resetAll = () => {
    setStage("url-input");
    setUrl("");
    setBrand(EMPTY_BRAND);
    setGalleryOptIn(true);
    setGenerationId(null);
    setShareSlug(null);
    setImageUrl(null);
    setErrorMsg(null);
  };

  // ---------- Renders per stage ----------

  if (stage === "done" && imageUrl && shareUrl) {
    // "keep this asset" → push them to signup with the slug in the redirect,
    // dashboard can hoover it up on landing once the claim endpoint ships.
    const signupHref = `/auth/signup?claim=${shareSlug}&redirect=/dashboard%3Fclaim=${shareSlug}`;
    return (
      <ChromeWrap>
        <div className="text-center mb-4">
          <div className="inline-block rounded-full bg-accent-light px-3 py-1 text-xs font-semibold text-accent">
            Character sheet ready 🎉
          </div>
          <h3 className="text-2xl font-bold mt-3">{brand.name}</h3>
          <p className="text-sm text-muted mt-1">
            Share this link:{" "}
            <Link href={shareUrl} className="text-accent underline">
              {typeof window !== "undefined"
                ? `${window.location.origin}${shareUrl}`
                : shareUrl}
            </Link>
          </p>
        </div>
        <div className="rounded-xl overflow-hidden border border-border shadow-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={`${brand.name} character sheet`}
            className="w-full h-auto"
          />
        </div>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <a
            href={imageUrl}
            download={`${brand.name}-preview-sheet.png`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover"
          >
            Download preview PNG
          </a>
          <Link
            href={shareUrl}
            className="rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-accent"
          >
            Open share page
          </Link>
        </div>

        <div className="mt-6 mx-auto max-w-lg rounded-xl border border-accent/30 bg-accent-light p-5 text-left">
          <div className="text-xs font-semibold text-accent uppercase tracking-wide mb-1">
            Sign in to keep this
          </div>
          <p className="text-sm text-muted mb-3">
            Save <strong>{brand.name}</strong> to your library, generate more,
            and unlock HD when it launches. Free trial is 1 sheet per day —
            signed-in accounts get more.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href={signupHref}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-hover"
            >
              Sign up &amp; keep {brand.name}
            </Link>
            <Link
              href={`/auth/login?redirect=/dashboard%3Fclaim=${shareSlug}`}
              className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:border-accent"
            >
              I already have an account
            </Link>
          </div>
          <button
            onClick={resetAll}
            className="mt-3 text-xs text-muted underline hover:text-foreground"
          >
            or come back tomorrow for another free one
          </button>
        </div>
      </ChromeWrap>
    );
  }

  if (stage === "rate-limited-ip") {
    const resetsAt = quota?.ipResetsAt ? new Date(quota.ipResetsAt) : null;
    const eta = resetsAt ? formatEta(resetsAt, new Date(nowTick)) : null;
    return (
      <ChromeWrap>
        <div className="text-center py-6">
          <div className="text-5xl mb-3">🎨</div>
          <h3 className="text-xl font-bold">You already got your free trial today</h3>
          <p className="text-sm text-muted mt-2 max-w-md mx-auto">
            The free trial is <strong>1 sheet per visitor per day</strong>
            {eta ? (
              <>
                {" — resets in "}
                <strong className="text-foreground">{eta}</strong>.
              </>
            ) : (
              "."
            )}
          </p>

          <div className="mt-6 max-w-md mx-auto rounded-xl border border-accent/30 bg-accent-light p-5 text-left">
            <div className="text-xs font-semibold text-accent uppercase tracking-wide mb-1">
              Keep your asset · Generate more
            </div>
            <p className="text-sm text-muted mb-3">
              Sign in to save what you just made to your library and pay for
              more generations — no waiting until tomorrow.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/auth/signup"
                className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-hover"
              >
                Sign up &amp; generate more
              </Link>
              <Link
                href="/auth/login?redirect=/dashboard"
                className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:border-accent"
              >
                Log in
              </Link>
            </div>
          </div>

          <p className="mt-5 text-xs text-muted">
            …or come back tomorrow for another free trial.
          </p>
        </div>
      </ChromeWrap>
    );
  }

  if (stage === "rate-limited-global") {
    const nextAt = quota?.nextSlotAt ? new Date(quota.nextSlotAt) : null;
    const eta = nextAt ? formatEta(nextAt, new Date(nowTick)) : null;
    return (
      <ChromeWrap>
        <div className="text-center py-6">
          <div className="text-5xl mb-3">⏳</div>
          <h3 className="text-xl font-bold">Free trial is at capacity right now</h3>
          <p className="text-sm text-muted mt-2 max-w-md mx-auto">
            We cap the free trial at 10 sheets per hour so nobody waits forever.
            {eta ? (
              <>
                {" A slot opens in "}
                <strong className="text-foreground">{eta}</strong>.
              </>
            ) : (
              " Try again in a bit."
            )}
          </p>

          <div className="mt-6 max-w-md mx-auto rounded-xl border border-accent/30 bg-accent-light p-5 text-left">
            <div className="text-xs font-semibold text-accent uppercase tracking-wide mb-1">
              Skip the queue
            </div>
            <p className="text-sm text-muted mb-3">
              Sign in and generate on the paid tier — no hourly cap.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/auth/signup"
                className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-hover"
              >
                Sign up
              </Link>
              <Link
                href="/auth/login?redirect=/dashboard"
                className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:border-accent"
              >
                Log in
              </Link>
            </div>
          </div>

          <button
            onClick={resetAll}
            className="mt-5 text-xs text-muted underline hover:text-foreground"
          >
            or start over
          </button>
        </div>
      </ChromeWrap>
    );
  }

  return (
    <ChromeWrap>
      {/* URL input row (always visible) */}
      <div
        className={`rounded-xl border-2 transition-all duration-300 ${
          stage === "url-input"
            ? "border-accent shadow-md shadow-accent/10"
            : "border-border"
        } bg-card px-4 py-3 mb-6`}
      >
        <div className="flex items-center gap-3">
          <svg
            className="w-5 h-5 text-accent flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.07-9.07l4.5-4.5a4.5 4.5 0 016.364 6.364l-1.757 1.757"
            />
          </svg>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste your website URL — e.g. https://yourcompany.com"
            disabled={stage !== "url-input"}
            className="flex-1 bg-transparent outline-none text-base placeholder:text-muted/60 min-w-0"
            onKeyDown={(e) => {
              if (e.key === "Enter" && stage === "url-input") handleImport();
            }}
          />
          {stage === "url-input" && (
            <>
              <button
                onClick={handleImport}
                disabled={!url.trim()}
                className="rounded-lg bg-accent text-white text-sm font-semibold px-4 py-2 hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Import
              </button>
              <button
                onClick={handleSkipUrl}
                className="text-xs text-muted hover:text-foreground transition whitespace-nowrap"
              >
                Skip
              </button>
            </>
          )}
        </div>
      </div>

      {stage === "extracting" && (
        <div className="rounded-xl bg-accent-light border border-accent/10 p-6 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent mb-3" />
          <div className="text-sm font-medium text-accent-hover">
            Reading your site and drafting a brief…
          </div>
        </div>
      )}

      {(stage === "edit-brief" ||
        stage === "generating" ||
        stage === "error") && (
        <div ref={briefRef}>
          <BriefEditor
            brand={brand}
            onChange={setBrand}
            galleryOptIn={galleryOptIn}
            onGalleryChange={setGalleryOptIn}
            onGenerate={handleGenerate}
            busy={stage === "generating"}
            quota={quota}
            now={new Date(nowTick)}
          />
          {stage === "generating" && (
            <div className="mt-6 rounded-xl bg-accent-light border border-accent/10 p-5 text-center">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent mb-2" />
              <div className="text-sm font-medium text-accent-hover">
                Painting {brand.name || "your mascot"}… ~60 seconds
              </div>
              <div className="text-xs text-muted mt-1">
                Stay on this page — we&apos;ll drop it in as soon as it&apos;s done.
              </div>
            </div>
          )}
        </div>
      )}

      {errorMsg && (
        <div className="mt-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 px-4 py-2 text-sm text-red-700 dark:text-red-300">
          {errorMsg}
        </div>
      )}

      <div className="mt-6 flex items-center justify-center gap-4 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Free preview
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          1 per day
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          No signup
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          HD available on paid plans
        </span>
      </div>
    </ChromeWrap>
  );
}

// ---------- Brief editor ----------

interface BriefEditorProps {
  brand: ExtractedBrand;
  onChange: (b: ExtractedBrand) => void;
  galleryOptIn: boolean;
  onGalleryChange: (v: boolean) => void;
  onGenerate: () => void;
  busy: boolean;
  quota: Quota | null;
  now: Date;
}

function BriefEditor({
  brand,
  onChange,
  galleryOptIn,
  onGalleryChange,
  onGenerate,
  busy,
  quota,
  now,
}: BriefEditorProps) {
  const setField = <K extends keyof ExtractedBrand>(
    key: K,
    value: ExtractedBrand[K],
  ) => onChange({ ...brand, [key]: value });

  const remaining = quota?.remainingHourly ?? null;
  const outOfSlots = remaining !== null && remaining <= 0;
  const nextSlotEta =
    outOfSlots && quota?.nextSlotAt
      ? formatEta(new Date(quota.nextSlotAt), now)
      : null;

  const btnLabel = busy
    ? "Generating…"
    : outOfSlots
      ? nextSlotEta
        ? `Free tier full · next slot in ${nextSlotEta}`
        : "Free tier full · try again shortly"
      : remaining !== null
        ? `✨ Generate my character sheet · ${remaining} of 10 left this hour`
        : "✨ Generate my character sheet";

  return (
    <div className="space-y-4 text-left">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Mascot name">
          <input
            type="text"
            value={brand.name}
            onChange={(e) => setField("name", e.target.value)}
            maxLength={60}
            disabled={busy}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </Field>
        <Field label="Species / form">
          <input
            type="text"
            value={brand.species}
            onChange={(e) => setField("species", e.target.value)}
            maxLength={60}
            disabled={busy}
            placeholder="e.g. Panda, Cloud spirit, Robot"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </Field>
        <Field label="Role">
          <input
            type="text"
            value={brand.role}
            onChange={(e) => setField("role", e.target.value)}
            maxLength={120}
            disabled={busy}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </Field>
        <Field label="Personality">
          <input
            type="text"
            value={brand.personality}
            onChange={(e) => setField("personality", e.target.value)}
            maxLength={120}
            disabled={busy}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </Field>
      </div>

      <Field label="Description">
        <textarea
          value={brand.description}
          onChange={(e) => setField("description", e.target.value.slice(0, 400))}
          disabled={busy}
          rows={2}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent resize-none"
        />
      </Field>

      <div className="grid gap-3 sm:grid-cols-[1fr_2fr]">
        <Field label="Style">
          <select
            value={brand.style}
            onChange={(e) => setField("style", e.target.value as MascotStyle)}
            disabled={busy}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          >
            {MASCOT_STYLES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Colors">
          <div className="flex flex-wrap gap-2">
            {brand.colors.map((c, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-2 py-1.5"
              >
                <input
                  type="color"
                  value={c.hex}
                  disabled={busy}
                  onChange={(e) => {
                    const next = [...brand.colors];
                    next[i] = { ...c, hex: e.target.value.toUpperCase() };
                    setField("colors", next);
                  }}
                  className="h-6 w-6 rounded border-0 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={c.name}
                  disabled={busy}
                  onChange={(e) => {
                    const next = [...brand.colors];
                    next[i] = { ...c, name: e.target.value.slice(0, 40) };
                    setField("colors", next);
                  }}
                  className="w-24 bg-transparent text-xs outline-none"
                />
                {brand.colors.length > 1 && !busy && (
                  <button
                    type="button"
                    onClick={() =>
                      setField(
                        "colors",
                        brand.colors.filter((_, j) => j !== i),
                      )
                    }
                    className="text-muted hover:text-danger text-xs px-1"
                    aria-label="Remove color"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            {brand.colors.length < 6 && !busy && (
              <button
                type="button"
                onClick={() =>
                  setField("colors", [
                    ...brand.colors,
                    { name: "New", hex: "#888888" },
                  ])
                }
                className="rounded-lg border border-dashed border-border px-3 py-1.5 text-xs text-muted hover:border-accent hover:text-accent"
              >
                + Add
              </button>
            )}
          </div>
        </Field>
      </div>

      <label
        className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition ${
          galleryOptIn
            ? "border-accent/30 bg-accent-light"
            : "border-border bg-card"
        }`}
      >
        <input
          type="checkbox"
          checked={galleryOptIn}
          disabled={busy}
          onChange={(e) => onGalleryChange(e.target.checked)}
          className="mt-0.5 h-4 w-4 accent-[color:var(--accent,#6366F1)]"
        />
        <span className="text-xs leading-relaxed">
          <span className="font-semibold text-foreground">
            Share {brand.name?.trim() || "my mascot"} in the public gallery
          </span>
          <span className="text-muted">
            {" — "}on by default for the free trial so the community can see
            what you made. Uncheck to keep this sheet unlisted.
          </span>
        </span>
      </label>

      <button
        type="button"
        onClick={onGenerate}
        disabled={busy || outOfSlots}
        className="w-full rounded-xl bg-gradient-to-r from-accent to-accent-hover text-white font-semibold py-3.5 text-sm shadow-md shadow-accent/20 hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition"
      >
        {btnLabel}
      </button>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-[11px] font-semibold text-muted uppercase tracking-wide mb-1">
        {label}
      </div>
      {children}
    </div>
  );
}
