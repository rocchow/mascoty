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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

export default function FreeTrialGenerator() {
  const [stage, setStage] = useState<Stage>("url-input");
  const [url, setUrl] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [brand, setBrand] = useState<ExtractedBrand>(EMPTY_BRAND);
  const [email, setEmail] = useState("");
  const [galleryOptIn, setGalleryOptIn] = useState(false);
  const [generationId, setGenerationId] = useState<string | null>(null);
  const [shareSlug, setShareSlug] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const briefRef = useRef<HTMLDivElement>(null);

  const shareUrl = useMemo(
    () => (shareSlug ? `/s/${shareSlug}` : null),
    [shareSlug],
  );

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
    if (!email || !EMAIL_RE.test(email)) {
      setErrorMsg("Enter a valid email — we'll send you a copy.");
      return;
    }
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
          email,
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
        setErrorMsg(
          body?.error === "invalid_email"
            ? "Enter a valid email."
            : "Something went wrong. Please try again.",
        );
        return;
      }
      setGenerationId(body.id);
      setShareSlug(body.shareSlug);
    } catch {
      setStage("edit-brief");
      setErrorMsg("Network error. Try again.");
    }
  }, [email, brand, url, galleryOptIn]);

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
    setEmail("");
    setGalleryOptIn(false);
    setGenerationId(null);
    setShareSlug(null);
    setImageUrl(null);
    setErrorMsg(null);
  };

  // ---------- Renders per stage ----------

  if (stage === "done" && imageUrl && shareUrl) {
    return (
      <ChromeWrap>
        <div className="text-center mb-4">
          <div className="inline-block rounded-full bg-accent-light px-3 py-1 text-xs font-semibold text-accent">
            Character sheet ready 🎉
          </div>
          <h3 className="text-2xl font-bold mt-3">{brand.name}</h3>
          <p className="text-sm text-muted mt-1">
            We just emailed you a copy. Share this link:{" "}
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
        <div className="mt-6 mx-auto max-w-md rounded-xl border border-accent/30 bg-accent-light p-4 text-left">
          <div className="text-xs font-semibold text-accent uppercase tracking-wide mb-1">
            This is preview quality
          </div>
          <p className="text-xs text-muted">
            Want HD (sharp lines, print-ready)? We&apos;re unlocking that at
            launch — leave your email above to get notified, or{" "}
            <button
              onClick={resetAll}
              className="underline text-accent hover:text-accent-hover"
            >
              start over
            </button>
            .
          </p>
        </div>
      </ChromeWrap>
    );
  }

  if (stage === "rate-limited-ip") {
    return (
      <ChromeWrap>
        <div className="text-center py-6">
          <div className="text-5xl mb-3">🎨</div>
          <h3 className="text-xl font-bold">You already got your free preview today</h3>
          <p className="text-sm text-muted mt-2 max-w-md mx-auto">
            The free trial is <strong>1 sheet per visitor per day</strong>.
            Come back tomorrow for another — or skip the line with a $1 pledge
            and get $5 of launch credit toward HD & unlimited when they land.
          </p>
          <div className="mt-6 max-w-md mx-auto rounded-xl border border-accent/30 bg-accent-light p-4 text-left">
            <div className="text-xs font-semibold text-accent uppercase tracking-wide mb-1">
              Skip the line · $5 launch credit
            </div>
            <p className="text-xs text-muted mb-3">
              Pledge $1 now → $5 of credit at launch + priority when HD flips on.
              Stripe collects your email at checkout.
            </p>
            <form action="/api/pledge" method="post">
              <button
                type="submit"
                className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover"
              >
                Pledge $1 → Get Early Access
              </button>
            </form>
          </div>
          <button
            onClick={resetAll}
            className="mt-4 text-xs text-muted underline hover:text-foreground"
          >
            or start over
          </button>
        </div>
      </ChromeWrap>
    );
  }

  if (stage === "rate-limited-global") {
    return (
      <ChromeWrap>
        <div className="text-center py-6">
          <div className="text-5xl mb-3">⏳</div>
          <h3 className="text-xl font-bold">Free trial is busy right now</h3>
          <p className="text-sm text-muted mt-2 max-w-md mx-auto">
            A lot of people are trying it at once. Give it a few minutes and
            try again — or skip the queue with a $1 pledge and lock in $5 of
            launch credit.
          </p>
          <div className="mt-6 max-w-md mx-auto">
            <form action="/api/pledge" method="post">
              <button
                type="submit"
                className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover"
              >
                Pledge $1 → Skip the queue
              </button>
            </form>
          </div>
          <button
            onClick={resetAll}
            className="mt-4 text-xs text-muted underline hover:text-foreground"
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
            email={email}
            onEmailChange={setEmail}
            galleryOptIn={galleryOptIn}
            onGalleryChange={setGalleryOptIn}
            onGenerate={handleGenerate}
            busy={stage === "generating"}
          />
          {stage === "generating" && (
            <div className="mt-6 rounded-xl bg-accent-light border border-accent/10 p-5 text-center">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent mb-2" />
              <div className="text-sm font-medium text-accent-hover">
                Painting {brand.name || "your mascot"}… ~60 seconds
              </div>
              <div className="text-xs text-muted mt-1">
                We&apos;ll email you a copy the moment it&apos;s done.
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
          HD coming soon
        </span>
      </div>
    </ChromeWrap>
  );
}

// ---------- Brief editor ----------

interface BriefEditorProps {
  brand: ExtractedBrand;
  onChange: (b: ExtractedBrand) => void;
  email: string;
  onEmailChange: (e: string) => void;
  galleryOptIn: boolean;
  onGalleryChange: (v: boolean) => void;
  onGenerate: () => void;
  busy: boolean;
}

function BriefEditor({
  brand,
  onChange,
  email,
  onEmailChange,
  galleryOptIn,
  onGalleryChange,
  onGenerate,
  busy,
}: BriefEditorProps) {
  const setField = <K extends keyof ExtractedBrand>(
    key: K,
    value: ExtractedBrand[K],
  ) => onChange({ ...brand, [key]: value });

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

      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <Field label="Your email (we'll send you a copy)">
          <input
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            disabled={busy}
            placeholder="you@company.com"
            required
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </Field>
        <label className="flex items-start gap-2 text-xs text-muted cursor-pointer">
          <input
            type="checkbox"
            checked={galleryOptIn}
            disabled={busy}
            onChange={(e) => onGalleryChange(e.target.checked)}
            className="mt-0.5 accent-[color:var(--accent,#6366F1)]"
          />
          <span>
            Show my mascot in the public gallery. Off by default — your sheet
            stays unlisted unless you check this.
          </span>
        </label>
      </div>

      <button
        type="button"
        onClick={onGenerate}
        disabled={busy}
        className="w-full rounded-xl bg-gradient-to-r from-accent to-accent-hover text-white font-semibold py-3.5 text-sm shadow-md shadow-accent/20 hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition"
      >
        {busy ? "Generating…" : "✨ Generate my character sheet"}
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
