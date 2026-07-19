import Link from "next/link";
import { PRICING_TIERS } from "@/lib/constants";
import { MASCOT_STYLES } from "@/types/mascot";
import { clsx } from "clsx";

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

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-full">
      {/* Nav */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="text-xl font-bold tracking-tight">
            <span className="text-accent">Mascoty</span>
          </Link>
          <nav className="hidden sm:flex items-center gap-6 text-sm">
            <a href="#features" className="text-muted hover:text-foreground transition">Features</a>
            <a href="#how-it-works" className="text-muted hover:text-foreground transition">How it Works</a>
            <a href="#case-studies" className="text-muted hover:text-foreground transition">Case Studies</a>
            <a href="#pricing" className="text-muted hover:text-foreground transition">Pricing</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm font-medium text-muted hover:text-foreground transition">
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-hover"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 py-20 sm:px-6 sm:py-28 text-center">
          <div className="inline-block rounded-full bg-accent-light px-3 py-1 text-xs font-semibold text-accent mb-6">
            3 free character sheets — no credit card required
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] max-w-3xl mx-auto">
            Turn any idea into a{" "}
            <span className="text-accent">complete mascot</span>{" "}
            character sheet
          </h1>
          <p className="mt-5 text-lg text-muted max-w-xl mx-auto">
            Turnaround views, expressions, poses, color palette, style guide —
            all generated in 60 seconds by AI. Production-ready.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/auth/signup"
              className="rounded-xl bg-accent px-8 py-3.5 text-base font-semibold text-white transition hover:bg-accent-hover shadow-lg shadow-accent/20"
            >
              Create Your Mascot — Free
            </Link>
            <a
              href="#how-it-works"
              className="rounded-xl border border-border px-8 py-3.5 text-base font-medium transition hover:bg-card"
            >
              See How It Works
            </a>
          </div>

          {/* Demo image placeholder */}
          <div className="mt-14 rounded-2xl border border-border bg-card shadow-xl overflow-hidden max-w-4xl mx-auto">
            <div className="aspect-[16/10] bg-gradient-to-br from-accent-light to-background flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-3">&#x1F43C;</div>
                <p className="text-sm text-muted">
                  Your panda character sheet demo image goes here
                </p>
                <p className="text-xs text-muted mt-1">
                  Place your sheet at <code className="bg-accent-light px-1.5 py-0.5 rounded">public/demo/panda-hero-sheet.png</code>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Styles */}
      <section className="border-t border-border bg-card">
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
                className="rounded-xl border border-border bg-background p-4 text-center"
              >
                <div className="text-sm font-semibold">{s.label}</div>
                <div className="text-xs text-muted mt-1">{s.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-border">
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
              <div key={f.title} className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-semibold text-sm">{f.title}</h3>
                <p className="text-xs text-muted mt-1.5 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works — AI Input */}
      <section id="how-it-works" className="border-t border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold tracking-tight">
              Describe it. We&apos;ll design it.
            </h2>
            <p className="text-sm text-muted mt-2">
              Paste your website URL or describe your brand — our AI does the rest.
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <div className="rounded-2xl border-2 border-border bg-background p-4 sm:p-5 shadow-sm transition focus-within:border-accent focus-within:shadow-lg focus-within:shadow-accent/10">
              <div className="text-sm text-muted mb-3">
                Tell us about your brand...
              </div>
              <div className="min-h-[80px] rounded-xl bg-card border border-border p-3 text-sm text-muted/50 leading-relaxed">
                e.g. &ldquo;https://www.pandacharging.com — a powerbank rental service for hospitality venues. Friendly, green, panda-themed.&rdquo;
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-3 text-xs text-muted">
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.07-9.07l4.5-4.5a4.5 4.5 0 016.364 6.364l-1.757 1.757" />
                    </svg>
                    URL
                  </span>
                  <span className="text-border">|</span>
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
                    </svg>
                    Description
                  </span>
                </div>
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-accent to-accent-hover px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 shadow-md shadow-accent/20"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                  </svg>
                  Generate
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 mt-5 text-xs text-muted">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-accent"></span>
                ~60 second generation
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-accent"></span>
                No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-accent"></span>
                3 free sheets
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section id="case-studies" className="border-t border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6">
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
              className="group rounded-xl border border-border bg-background overflow-hidden transition hover:border-accent hover:shadow-sm"
            >
              <div className="aspect-[2/1] bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 flex items-center justify-center">
                <div className="text-5xl">&#x1F43C;&#x26A1;</div>
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
              className="group rounded-xl border border-border bg-background overflow-hidden transition hover:border-accent hover:shadow-sm"
            >
              <div className="aspect-[2/1] bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 flex items-center justify-center">
                <div className="text-5xl">&#x1F30F;&#x1F4F1;</div>
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
              Start free. Upgrade when you need more.
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
                <Link
                  href="/auth/signup"
                  className={clsx(
                    "mt-5 block w-full rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition",
                    tier.highlighted
                      ? "bg-accent text-white hover:bg-accent-hover"
                      : "bg-foreground text-background hover:opacity-90"
                  )}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-accent-light">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 text-center">
          <h2 className="text-2xl font-bold tracking-tight">
            Ready to create your mascot?
          </h2>
          <p className="text-sm text-muted mt-2 max-w-md mx-auto">
            Join creators and brands already using Mascoty to build their
            character identity. Start with 3 free character sheets.
          </p>
          <Link
            href="/auth/signup"
            className="mt-6 inline-block rounded-xl bg-accent px-8 py-3.5 text-base font-semibold text-white transition hover:bg-accent-hover shadow-lg shadow-accent/20"
          >
            Get Started Free
          </Link>
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
