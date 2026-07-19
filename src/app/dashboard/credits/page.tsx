"use client";

import { useEffect, useState, Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import { PRICING_TIERS, CREDIT_PACK } from "@/lib/constants";
import { useSearchParams } from "next/navigation";
import { clsx } from "clsx";

export default function CreditsPage() {
  return (
    <Suspense>
      <CreditsContent />
    </Suspense>
  );
}

function CreditsContent() {
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const success = searchParams.get("success");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("credits_balance")
        .eq("id", user.id)
        .single();

      setCredits(data?.credits_balance ?? 0);
    }
    load();
  }, []);

  async function handleCheckout(priceId: string, mode: "payment" | "subscription") {
    setLoading(priceId);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, mode }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setLoading(null);
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold tracking-tight mb-1">Credits</h1>
      <p className="text-sm text-muted mb-8">
        Each character sheet generation costs 1 credit.
      </p>

      {success && (
        <div className="mb-6 rounded-lg bg-green-50 dark:bg-green-950 p-3 text-sm text-green-700 dark:text-green-400">
          Payment successful! Your credits have been added.
        </div>
      )}

      {/* Current balance */}
      <div className="rounded-xl border border-border bg-card p-6 mb-8">
        <div className="text-sm text-muted">Current balance</div>
        <div className="text-4xl font-bold mt-1">
          {credits !== null ? credits : "..."}{" "}
          <span className="text-lg font-normal text-muted">credits</span>
        </div>
      </div>

      {/* Buy credits */}
      <h2 className="text-lg font-semibold mb-4">Get more credits</h2>

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        {PRICING_TIERS.filter((t) => t.price > 0).map((tier) => (
          <div
            key={tier.name}
            className={clsx(
              "rounded-xl border-2 p-5",
              tier.highlighted
                ? "border-accent bg-accent-light"
                : "border-border bg-card"
            )}
          >
            <div className="text-sm font-semibold">{tier.name}</div>
            <div className="mt-2">
              <span className="text-2xl font-bold">${tier.price}</span>
              <span className="text-sm text-muted">/{tier.period}</span>
            </div>
            <div className="text-sm text-muted mt-1">
              {tier.credits} credits / {tier.period}
            </div>
            <ul className="mt-4 space-y-1.5 text-xs text-muted">
              {tier.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-accent">&#x2713;</span> {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() =>
                handleCheckout(
                  tier.name === "Pro"
                    ? process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || ""
                    : process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID || "",
                  "subscription"
                )
              }
              disabled={loading !== null}
              className={clsx(
                "mt-4 w-full rounded-lg px-4 py-2 text-sm font-semibold transition",
                tier.highlighted
                  ? "bg-accent text-white hover:bg-accent-hover"
                  : "bg-foreground text-background hover:opacity-90"
              )}
            >
              {loading ? "..." : tier.cta}
            </button>
          </div>
        ))}
      </div>

      {/* One-time pack */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold">Credit Pack</div>
            <div className="text-xs text-muted mt-0.5">
              {CREDIT_PACK.credits} credits for ${CREDIT_PACK.price} — no
              subscription required
            </div>
          </div>
          <button
            onClick={() =>
              handleCheckout(
                process.env.NEXT_PUBLIC_STRIPE_CREDIT_PACK_PRICE_ID || "",
                "payment"
              )
            }
            disabled={loading !== null}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition hover:bg-accent-light"
          >
            Buy Pack
          </button>
        </div>
      </div>
    </div>
  );
}
