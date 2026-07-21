import Link from "next/link";
import Image from "next/image";
import { PRICING_TIERS } from "@/lib/constants";
import { MASCOT_STYLES } from "@/types/mascot";
import { clsx } from "clsx";
import FreeTrialGenerator from "./components/FreeTrialGenerator";
import { PLEDGE_AMOUNT_LABEL, PLEDGE_CREDIT_LABEL } from "@/lib/pledge";
import { getGalleryItems } from "@/lib/free-trial/gallery";

const FEATURES = [
  {
    title: "Turnaround Views",
    desc: "Front, 3/4, side, 3/4 back, and back — all consistent in one sheet.",
  },
  {
    title: "Expressions",
    desc: "Happy, excited, wink, thumbs up, surprised — ready for any context.",
  },
  {
    title: "Action Poses",
    desc: "Multiple dynamic poses tailored to your mascot's role and personality.",
  },
  {
    title: "Color Palette",
    desc: "Organized swatches with hex codes your team can reference instantly.",
  },
  {
    title: "Style Guide",
    desc: "Styling notes, usage examples, and size reference built right in.",
  },
  {
    title: "Production Ready",
    desc: "High-res PNG download with commercial license. Use it anywhere.",
  },
  {
    title: "Video Clips",
    desc: "Turn your mascot into short animated videos with Seedance 2.0. Pro plan.",
  },
];

export const revalidate = 60;

export default async function LandingPage() {
  const gallery = await getGalleryItems(12);

  return (
    <div className="flex flex-col min-h-full">
      {/* Nav */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="text-xl font-bold tracking-tight">
            <span className="text-accent">Mascoty</span>
          </Link>
          <nav className="hidden sm:flex items-center gap-6 text-sm">
            <a href="#try" className="text-muted hover:text-foreground transition">Try it</a>
            <a href="#gallery" className="text-muted hover:text-foreground transition">Gallery</a>
            <a href="#features" className="text-muted hover:text-foreground transition">Features</a>
            <a href="#case-studies" className="text-muted hover:text-foreground transition">Case Studies</a>
            <a href="#pricing" className="text-muted hover:text-foreground transition">Pricing</a>
          </nav>
          <div className="flex items-center gap-3">
            <a
              href="#try"
              className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-hover"
            >
              Try Free
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="max-w-6xl mx-auto px-4 py-20 sm:px-6 sm:py-28 text-center">
          <div className="inline-block rounded-full bg-accent-light px-3 py-1 text-xs font-semibold text-accent mb-6">
            Free preview · 1 sheet per day, no signup
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] max-w-3xl mx-auto">
            Turn any idea into a{" "}
            <span className="text-accent">complete mascot</span>{" "}
            character sheet
          </h1>
          <p className="mt-5 text-lg text-muted max-w-xl mx-auto">
            Paste your URL, we&apos;ll draft your brand brief, and generate a
            full character sheet in ~60 seconds. No signup required.
          </p>

          {/* Real generator */}
          <div id="try" className="mt-10 scroll-mt-24">
            <FreeTrialGenerator />
          </div>

          {/* Case Studies */}
          <div id="case-studies" className="mt-16">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold tracking-tight">
                Real brands. Real results.
              </h2>
              <p className="text-sm text-muted mt-2">
                See how companies use Mascoty to build their brand identity.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 max-w-4xl mx-auto">
              <Link
                href="/blog/panda-charging-case-study"
                className="group rounded-xl border border-border bg-card overflow-hidden transition hover:border-accent hover:shadow-sm text-left"
              >
                <div className="aspect-[2/1] relative overflow-hidden">
                  <Image
                    src="/panda/panda.png"
                    alt="Panda the Charging Hero character sheet"
                    width={1400}
                    height={900}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="p-5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-accent mb-2">Case Study</div>
                  <h3 className="font-semibold group-hover:text-accent transition">
                    How Panda Charging built a brand mascot that keeps guests plugged in
                  </h3>
                  <p className="text-xs text-muted mt-2 leading-relaxed">
                    From character sheet to kiosk branding — how a powerbank rental company used Mascoty to create &ldquo;Panda the Charging Hero&rdquo; across all touchpoints.
                  </p>
                  <div className="mt-3 text-xs font-medium text-accent">Read case study &rarr;</div>
                </div>
              </Link>

              <Link
                href="/blog/yonosim-korea-case-study"
                className="group rounded-xl border border-border bg-card overflow-hidden transition hover:border-accent hover:shadow-sm text-left"
              >
                <div className="aspect-[2/1] relative overflow-hidden">
                  <Image
                    src="/yoni/yoni.png"
                    alt="Yoni — Travel Signal Spirit character sheet"
                    width={1400}
                    height={900}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="p-5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-accent mb-2">Case Study</div>
                  <h3 className="font-semibold group-hover:text-accent transition">
                    YonoSIM Korea: from character sheet to animated video in one day
                  </h3>
                  <p className="text-xs text-muted mt-2 leading-relaxed">
                    How a travel eSIM brand used Mascoty to generate their mascot &ldquo;Yoni,&rdquo; produce website content, and create animated marketing videos with Seedance 2.0.
                  </p>
                  <div className="mt-3 text-xs font-medium text-accent">Read case study &rarr;</div>
                </div>
              </Link>
            </div>

            {/* Early-access pledge (from main) */}
            <div id="early-access" className="mt-14 scroll-mt-24">
              <form
                action="/api/pledge"
                method="post"
                className="w-full max-w-md mx-auto rounded-2xl border border-border bg-background p-4 shadow-sm text-left space-y-3"
              >
                <div>
                  <label
                    htmlFor="intent-hero"
                    className="block text-xs font-medium text-muted mb-1.5"
                  >
                    What are you hoping to use it for?{" "}
                    <span className="text-muted/60 font-normal">(optional)</span>
                  </label>
                  <textarea
                    id="intent-hero"
                    name="intent"
                    rows={2}
                    maxLength={500}
                    placeholder="e.g. Mascot for our SaaS onboarding, kids' book character, Twitch stream avatar…"
                    className="w-full rounded-lg border border-border bg-card p-2.5 text-sm text-foreground placeholder:text-muted/60 outline-none resize-none transition focus:border-accent"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-accent px-6 py-3 text-base font-semibold text-white transition hover:bg-accent-hover shadow-md shadow-accent/20"
                >
                  Pledge {PLEDGE_AMOUNT_LABEL} &rarr; Get Early Access
                </button>
                <p className="text-xs text-muted text-center leading-relaxed">
                  Locks in <span className="font-semibold text-foreground">{PLEDGE_CREDIT_LABEL} of launch credit</span>{" "}
                  + priority access. Stripe collects your email at checkout.
                </p>
              </form>

              <p className="mt-4 text-xs text-muted max-w-md mx-auto italic">
                Honest note: the free preview is real; HD, unlimited generations,
                and video are what your {PLEDGE_AMOUNT_LABEL} helps us ship.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="border-t border-border bg-card scroll-mt-24">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold tracking-tight">
              Fresh from the community
            </h2>
            <p className="text-sm text-muted mt-2">
              Character sheets generated in the last little while, shared by
              their makers.
            </p>
          </div>
          {gallery.length === 0 ? (
            <div className="max-w-md mx-auto rounded-xl border-2 border-dashed border-border p-8 text-center">
              <div className="text-4xl mb-2">🎨</div>
              <div className="text-sm text-muted">
                No public sheets yet — be the first to opt into the gallery
                when you generate.
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {gallery.map((item) => (
                <Link
                  key={item.shareSlug}
                  href={`/s/${item.shareSlug}`}
                  className="group rounded-xl border border-border bg-background overflow-hidden hover:border-accent hover:shadow-md transition"
                >
                  <div className="aspect-[3/2] relative overflow-hidden bg-card">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imageUrl}
                      alt={`${item.name} character sheet`}
                      className="w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-3">
                    <div className="text-sm font-semibold truncate group-hover:text-accent transition">
                      {item.name}
                    </div>
                    {item.role && (
                      <div className="text-[11px] text-muted truncate">
                        {item.role}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Styles */}
      <section className="border-t border-border">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold tracking-tight">
              8 styles to match any brand
            </h2>
            <p className="text-sm text-muted mt-2">
              From 3D Pixar to pixel art — pick the look that fits.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {MASCOT_STYLES.map((s) => (
              <div
                key={s.value}
                className="rounded-xl border border-border bg-card p-4 text-center"
              >
                <div className="text-sm font-semibold">{s.label}</div>
                <div className="text-xs text-muted mt-1">{s.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold tracking-tight">
              Everything in one sheet
            </h2>
            <p className="text-sm text-muted mt-2">
              Not just a single image — a complete character system.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-xl border border-border bg-background p-5">
                <h3 className="font-semibold text-sm">{f.title}</h3>
                <p className="text-xs text-muted mt-1.5 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-border">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold tracking-tight">
              Simple pricing
            </h2>
            <p className="text-sm text-muted mt-2">
              Free preview today. Full pricing at launch.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
            {PRICING_TIERS.map((tier) => (
              <div
                key={tier.name}
                className={clsx(
                  "rounded-xl border-2 p-6",
                  tier.highlighted
                    ? "border-accent bg-accent-light relative"
                    : "border-border bg-card"
                )}
              >
                {tier.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-0.5 text-[10px] font-bold text-white uppercase tracking-wide">
                    Most Popular
                  </div>
                )}
                <div className="text-sm font-semibold">{tier.name}</div>
                <div className="mt-3">
                  <span className="text-3xl font-bold">
                    {tier.price === 0 ? "Free" : `$${tier.price}`}
                  </span>
                  {tier.price > 0 && tier.period !== "one-time" && (
                    <span className="text-sm text-muted">/{tier.period}</span>
                  )}
                </div>
                <div className="text-xs text-muted mt-1">
                  {tier.credits} character sheet{tier.credits > 1 ? "s" : ""}{" "}
                  {tier.price === 0 ? "to start" : tier.period === "one-time" ? "" : `/ ${tier.period}`}
                </div>
                <ul className="mt-5 space-y-2 text-xs text-muted">
                  {tier.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className="text-accent flex-shrink-0">&#x2713;</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href={tier.price === 0 ? "#try" : "#early-access"}
                  className={clsx(
                    "mt-5 block w-full rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition",
                    tier.highlighted
                      ? "bg-accent text-white hover:bg-accent-hover"
                      : "bg-foreground text-background hover:opacity-90"
                  )}
                >
                  {tier.price === 0 ? "Try Free" : "Get Early Access"}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-accent-light">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 text-center">
          <h2 className="text-2xl font-bold tracking-tight">
            Try it now — no signup, no cost.
          </h2>
          <p className="text-sm text-muted mt-2 max-w-md mx-auto">
            One free preview per day. Paste your URL and go — HD version
            unlocks after launch.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#try"
              className="rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover shadow-md shadow-accent/20"
            >
              ✨ Generate my character sheet
            </a>
            <form action="/api/pledge" method="post" className="inline">
              <button
                type="submit"
                className="rounded-lg border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition hover:border-accent"
              >
                or pledge {PLEDGE_AMOUNT_LABEL} → {PLEDGE_CREDIT_LABEL} launch credit
              </button>
            </form>
          </div>
          <p className="mt-3 text-xs text-muted">
            Stripe collects your email at checkout. Your {PLEDGE_AMOUNT_LABEL}{" "}
            converts to {PLEDGE_CREDIT_LABEL} of credit at launch.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm font-bold">
              <span className="text-accent">Mascoty</span>
            </div>
            <div className="flex gap-6 text-xs text-muted">
              <Link href="/pricing" className="hover:text-foreground transition">Pricing</Link>
              <a href="mailto:roc.chow1988@gmail.com" className="hover:text-foreground transition">Contact</a>
            </div>
            <div className="text-xs text-muted">
              &copy; 2026 Mascoty. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
