"use client";

import { useState } from "react";
import { clsx } from "clsx";

type Status = "idle" | "submitting" | "success" | "error";

type Props = {
  source?: string;
  className?: string;
  buttonLabel?: string;
  placeholder?: string;
  intentPlaceholder?: string;
};

export default function IntentForm({
  source = "landing",
  className,
  buttonLabel = "Join the waitlist",
  placeholder = "you@company.com",
  intentPlaceholder = "e.g. Mascot for our SaaS onboarding, kids' book character, Twitch stream avatar…",
}: Props) {
  const [email, setEmail] = useState("");
  const [intent, setIntent] = useState("");
  const [showIntent, setShowIntent] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    setError(null);
    try {
      const res = await fetch("/api/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source,
          intent: intent.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setError(body?.error === "invalid_email" ? "Please enter a valid email." : "Something went wrong. Try again.");
        setStatus("error");
        return;
      }
      setStatus("success");
      setEmail("");
      setIntent("");
    } catch {
      setError("Network error. Try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        className={clsx(
          "rounded-xl border border-accent bg-accent-light px-5 py-4 text-sm text-foreground max-w-md mx-auto",
          className,
        )}
      >
        <div className="font-semibold text-accent">You&apos;re on the list.</div>
        <div className="text-muted mt-0.5">
          We&apos;ll email you the moment early access opens up.
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className={clsx("w-full max-w-md mx-auto space-y-2", className)}
      noValidate
    >
      <div className="flex flex-col sm:flex-row gap-2 rounded-xl border border-border bg-background p-1.5 shadow-sm transition focus-within:border-accent focus-within:shadow-lg focus-within:shadow-accent/10">
        <input
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          value={email}
          onFocus={() => setShowIntent(true)}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") {
              setStatus("idle");
              setError(null);
            }
          }}
          placeholder={placeholder}
          aria-label="Email address"
          className="flex-1 bg-transparent rounded-lg outline-none text-foreground placeholder:text-muted/60 px-4 py-3 text-base"
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="rounded-lg bg-accent font-semibold text-white transition hover:bg-accent-hover disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-accent/20 px-6 py-3 text-base"
        >
          {status === "submitting" ? "Joining…" : buttonLabel}
        </button>
      </div>

      {(showIntent || intent) && (
        <div className="rounded-xl border border-border bg-background p-3 shadow-sm transition focus-within:border-accent focus-within:shadow-lg focus-within:shadow-accent/10 text-left">
          <label
            htmlFor={`intent-${source}`}
            className="block text-xs font-medium text-muted mb-1.5"
          >
            What are you hoping to use it for?{" "}
            <span className="text-muted/60 font-normal">(optional)</span>
          </label>
          <textarea
            id={`intent-${source}`}
            value={intent}
            onChange={(e) => setIntent(e.target.value.slice(0, 500))}
            placeholder={intentPlaceholder}
            rows={2}
            className="w-full bg-transparent outline-none text-sm text-foreground placeholder:text-muted/60 resize-none"
          />
          <div className="text-[10px] text-muted/60 text-right">
            {intent.length}/500
          </div>
        </div>
      )}

      {error && (
        <div className="text-xs text-red-500 text-center" role="alert">
          {error}
        </div>
      )}
    </form>
  );
}
