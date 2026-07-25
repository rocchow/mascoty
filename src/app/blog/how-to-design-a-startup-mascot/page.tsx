import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Design a Startup Mascot in 7 Steps (With Examples) | Mascoty",
  description:
    "A practical 7-step process for designing a brand mascot as a startup — from personality-first briefs to shipping a full character sheet in a week.",
};

export default function HowToDesignAStartupMascot() {
  return (
    <article className="max-w-2xl mx-auto px-4 py-16 sm:px-6">
      <div className="mb-8">
        <Link href="/blog" className="text-xs text-muted hover:text-accent transition">
          &larr; Back to blog
        </Link>
      </div>

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-accent bg-accent-light px-2 py-0.5 rounded-full">
            Guide
          </span>
          <span className="text-xs text-muted">July 22, 2026</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight leading-tight">
          How to Design a Startup Mascot in 7 Steps (With Examples)
        </h1>
        <p className="mt-4 text-lg text-muted leading-relaxed">
          The exact process used by brands like Mailchimp, Duolingo, and every
          Mascoty customer who shipped a full character sheet in a week &mdash;
          adapted for founders with no design team.
        </p>
      </div>

      <div className="prose-custom space-y-6 text-[15px] leading-relaxed text-foreground/90">
        <p className="text-base">
          <strong className="text-foreground">TL;DR:</strong> Great startup
          mascots aren&apos;t designed &mdash; they&apos;re <em>briefed</em>.
          The design part is comparatively easy. This guide walks through the
          seven steps that turn a rough idea into a full character system:
          personality, form, palette, sheet, style guide, deployment, voice.
          Total time: about a week if you know what you want, one day if
          you&apos;re using an AI tool like Mascoty.
        </p>

        <p>
          This post is part of our{" "}
          <Link href="/blog/startup-mascot-guide" className="text-accent hover:underline font-medium">
            complete guide to startup mascots
          </Link>
          .
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">Step 1: Define personality before appearance</h2>
        <p>
          Every failed startup mascot skipped this step. Write down 3&ndash;5
          adjectives that describe the character&apos;s personality. Not the
          brand&apos;s marketing tagline &mdash; the character&apos;s vibe.
          Some examples:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Duo the owl: Relentless, mischievous, judgmental, sincere</li>
          <li>Freddie the chimp: Warm, cheeky, encouraging, casual</li>
          <li>Mascoty&apos;s mascot: Creative, helpful, energetic, mischievous</li>
          <li>GitHub Octocat: Playful, nerdy, quietly proud</li>
        </ul>
        <p>
          Test: show your list to a friend who doesn&apos;t know your brand.
          Ask them to describe what the character would look like. If two
          friends describe wildly different things, your list is too vague.
          Sharpen and try again.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">Step 2: Choose a form (animal, human, object, or invented)</h2>
        <p>
          The four types, in one sentence each:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            <strong className="text-foreground">Animal:</strong> Safest choice.
            Borrows pre-loaded associations (owl = wise, fox = clever). Best
            for warmth-forward brands.
          </li>
          <li>
            <strong className="text-foreground">Human:</strong> Highest risk of
            aging poorly or alienating demographics. Only pick if you have a
            <em> reason</em>.
          </li>
          <li>
            <strong className="text-foreground">Object:</strong> Great if your
            product has a distinctive physical form worth anthropomorphizing.
          </li>
          <li>
            <strong className="text-foreground">Invented creature:</strong> Best
            for tech and software. Memorable precisely because it doesn&apos;t
            exist elsewhere.
          </li>
        </ul>
        <p>
          Full taxonomy with dozens of examples:{" "}
          <Link href="/blog/what-is-a-brand-mascot" className="text-accent hover:underline font-medium">
            What Is a Brand Mascot?
          </Link>
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">Step 3: Lock the palette</h2>
        <p>
          Two to four colors, no more. Steal from your product UI &mdash; the
          mascot should feel native to the app, not like a mismatched sticker.
          Include:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>One primary color (dominant, appears in 60%+ of the character)</li>
          <li>One accent color (highlights, small details)</li>
          <li>One background/support color (skin, shadows, base)</li>
          <li>Optionally: one contrast color for expression accents</li>
        </ul>
        <p>
          Document hex codes now. You&apos;ll thank yourself when your first
          designer redraws the mascot and picks the &ldquo;wrong&rdquo; green.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">Step 4: Design a full character sheet, not just one drawing</h2>
        <p>
          This is the single biggest mistake to avoid. A single hero
          illustration is not a mascot &mdash; it&apos;s an image. A character
          sheet is a mascot. It should include:
        </p>
        <ol className="list-decimal pl-5 space-y-2">
          <li>
            <strong className="text-foreground">Turnaround views:</strong>{" "}
            front, 3/4, side, 3/4 back, back. So future designers can
            reproduce any angle.
          </li>
          <li>
            <strong className="text-foreground">5+ expressions:</strong>{" "}
            happy, surprised, thumbs-up, sleepy, apologetic. Cover the
            emotional range your product will require.
          </li>
          <li>
            <strong className="text-foreground">2&ndash;3 action poses:</strong>{" "}
            holding a product, pointing, celebrating. Whatever your marketing
            will actually need.
          </li>
          <li>
            <strong className="text-foreground">Color palette</strong> with hex
            codes.
          </li>
          <li>
            <strong className="text-foreground">Size reference</strong> next
            to a human silhouette (helps future artists get proportions
            right).
          </li>
        </ol>
        <p>
          Whether you use{" "}
          <Link href="/" className="text-accent hover:underline font-medium">
            Mascoty
          </Link>
          , an illustrator, or an agency &mdash; do not accept less than this.
          More on price/timeline tradeoffs:{" "}
          <Link href="/blog/mascot-design-cost" className="text-accent hover:underline font-medium">
            How Much Does a Brand Mascot Cost?
          </Link>
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">Step 5: Write a one-page style guide</h2>
        <p>
          The style guide is what stops your mascot from fragmenting over
          time. It should be short &mdash; one page &mdash; and cover:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong className="text-foreground">Do&apos;s:</strong> approved poses, expressions, palette, contexts</li>
          <li><strong className="text-foreground">Don&apos;ts:</strong> no palette swaps, no distortion, no unauthorized poses</li>
          <li><strong className="text-foreground">Voice:</strong> how the mascot &ldquo;speaks&rdquo; in copy (see step 7)</li>
          <li><strong className="text-foreground">Minimum sizes:</strong> below which the mascot should not appear</li>
          <li><strong className="text-foreground">Clear space:</strong> how much whitespace around it</li>
        </ul>
        <p>
          Every future designer (yours or a contractor&apos;s) reads this
          before touching the mascot. Without it, entropy wins.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">Step 6: Ship it everywhere in a week</h2>
        <p>
          A mascot only starts working when it&apos;s in the wild. Day one
          deployment target: 8+ surfaces. Landing hero, favicon, social
          avatar, empty states, welcome email, 404 page, loading spinner,
          pitch deck cover. Full list with examples:{" "}
          <Link href="/blog/where-to-use-your-brand-mascot" className="text-accent hover:underline font-medium">
            12 Places to Deploy Your Mascot
          </Link>
          .
        </p>
        <p>
          Don&apos;t wait for a &ldquo;launch.&rdquo; The mascot compounds
          only through repetition &mdash; every day it&apos;s not deployed is
          brand equity you&apos;re not earning.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">Step 7: Give the mascot a voice, not just a look</h2>
        <p>
          This is the Duolingo lesson.{" "}
          <Link href="/blog/duolingo-mascot-marketing-lessons" className="text-accent hover:underline font-medium">
            (Duo the owl case study.)
          </Link>{" "}
          A mascot with a look is a decoration. A mascot with a voice is a
          coworker. Extend the personality adjectives from step 1 into a
          copy voice:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>How does the mascot congratulate users? (&ldquo;Nice work!&rdquo; vs &ldquo;YES YES YES!&rdquo;)</li>
          <li>How does it apologize? (&ldquo;Something broke.&rdquo; vs &ldquo;I&apos;m so sorry, this is on me.&rdquo;)</li>
          <li>How does it push users? (&ldquo;Come back soon&rdquo; vs &ldquo;I&apos;m watching you&rdquo;)</li>
        </ul>
        <p>
          Rewrite your onboarding, empty states, error messages, and welcome
          email in the mascot&apos;s voice. Test the diff. You&apos;ll feel
          it.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">Common mistakes at each step</h2>
        <p>
          Every step above has a common failure mode: skipping personality
          (step 1), copying a competitor (step 2), palette drift (step 3),
          shipping only one drawing (step 4), no style guide (step 5),
          hiding the mascot (step 6), silent mascot (step 7). Full failure
          catalog and fixes:{" "}
          <Link href="/blog/startup-mascot-mistakes" className="text-accent hover:underline font-medium">
            9 Mascot Mistakes Small Brands Make
          </Link>
          .
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">The bottom line</h2>
        <p>
          A great mascot is 20% drawing and 80% brief. If you nail
          personality, form, palette, and voice, the actual generation of
          the character sheet is the easy part &mdash; and cheaper and
          faster now than it&apos;s ever been. Follow the seven steps in
          order, don&apos;t skip step 1, and you&apos;ll have a working
          brand character in a week.
        </p>

        <p className="text-sm text-muted mt-8">
          Ready to run the process? <Link href="/" className="text-accent hover:underline font-medium">Generate a full character sheet with Mascoty</Link> in about a minute &mdash; then deploy it across{" "}
          <Link href="/blog/where-to-use-your-brand-mascot" className="text-accent hover:underline font-medium">
            12 places
          </Link>
          .
        </p>
      </div>
    </article>
  );
}
