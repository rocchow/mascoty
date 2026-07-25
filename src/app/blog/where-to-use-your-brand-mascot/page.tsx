import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "12 Places to Deploy Your Mascot: From Landing Page to Loading States | Mascoty",
  description:
    "A brand mascot only compounds when it appears everywhere. 12 concrete places to deploy your mascot on day one — with examples from Duolingo, Mailchimp, and more.",
};

export default function WhereToUseYourBrandMascot() {
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
          12 Places to Deploy Your Mascot: From Landing Page to Loading States
        </h1>
        <p className="mt-4 text-lg text-muted leading-relaxed">
          A mascot on your About page is a decoration. A mascot in 12 places
          across your product is a brand asset. Here&apos;s the exact
          deployment checklist &mdash; with why each spot matters.
        </p>
      </div>

      <div className="prose-custom space-y-6 text-[15px] leading-relaxed text-foreground/90">
        <p className="text-base">
          <strong className="text-foreground">Short answer:</strong> The
          compounding value of a mascot comes from{" "}
          <em>repeated exposure at the right moments</em>. Aim to deploy in
          8+ of the 12 places below on day one. Every one you skip is brand
          equity you&apos;re leaving on the table.
        </p>

        <p>
          This post is part of our{" "}
          <Link href="/blog/startup-mascot-guide" className="text-accent hover:underline font-medium">
            complete guide to startup mascots
          </Link>
          .
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">1. Landing page hero</h2>
        <p>
          The most obvious placement, and the one everyone gets right. The
          mascot on the hero should be doing something &mdash; waving,
          holding a product, gesturing at the CTA. A static portrait works,
          but an active pose works better.
        </p>
        <p>
          <strong className="text-foreground">Why it matters:</strong>{" "}
          First-time visitors have 3 seconds. A face gives them a reason to
          stay for the fourth.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">2. Favicon</h2>
        <p>
          A cropped, high-contrast version of the mascot&apos;s face. If your
          mascot doesn&apos;t work at 32&times;32, consider a simplified
          alternate (like the &ldquo;M&rdquo; short mark that Mascoty uses
          alongside its full mascot). This is prime tab-real-estate that
          gets shown every time a user hits ⌘T.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">3. Social media avatars</h2>
        <p>
          Twitter/X, LinkedIn, TikTok, Instagram, YouTube. Same character,
          same expression across all of them. When someone sees your mascot
          on a retweet, they should already know it&apos;s you before they
          read the handle.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">4. Empty states</h2>
        <p>
          The single most under-used surface in most SaaS products. When a
          user has zero data in their dashboard, an inbox, or a project
          list, they&apos;re at peak &ldquo;is this worth it?&rdquo; anxiety.
          A mascot with a gently encouraging expression (&ldquo;Nothing here
          yet &mdash; let&apos;s make something&rdquo;) is worth more than
          another CTA button.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">5. Loading states / spinners</h2>
        <p>
          Instead of a generic spinner, an animated mascot. Google Chrome&apos;s
          dinosaur when the internet is down is the canonical example.
          Anything longer than 800ms is a chance to inject personality
          instead of frustration.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">6. 404 and error pages</h2>
        <p>
          An error page is a rare moment where users are stuck and slightly
          annoyed. A mascot expressing an apology (&ldquo;Oops &mdash; that
          page ran away&rdquo;) turns the moment from friction into
          brand-building. GitHub&apos;s Octocat 404 is a rare page anyone
          screenshots on purpose.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">7. Welcome email (and every subsequent email)</h2>
        <p>
          The mascot goes in the header of every transactional email. Users
          open dozens of these a week. This is where brand recall gets
          hammered in without any additional design effort. Bonus: the
          mascot can adopt different expressions for different email types
          (welcome, receipt, apology for downtime, milestone congrats).
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">8. Push notifications and in-app messages</h2>
        <p>
          This is Duolingo&apos;s territory.{" "}
          <Link href="/blog/duolingo-mascot-marketing-lessons" className="text-accent hover:underline font-medium">
            (Full Duo case study.)
          </Link>{" "}
          Push notifications with a mascot avatar get higher open rates
          than logo-only pushes. The character can also give the copy
          permission to be more personal (&ldquo;I miss you&rdquo; reads
          fine from Duo; it would read weird from an anonymous SaaS
          brand).
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">9. Pitch deck cover and section dividers</h2>
        <p>
          Investors see dozens of decks a week; they all look the same.
          The mascot on your cover slide (and as section markers throughout)
          makes the deck immediately memorable. Founders using Mascoty have
          reported investors referencing &ldquo;the deck with the
          [character]&rdquo; weeks later.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">10. Invoices, receipts, and legal docs</h2>
        <p>
          Nobody puts personality in invoices, which is precisely why doing
          so stands out. A small mascot in the header of a receipt turns a
          transactional artifact into a brand touchpoint. Cost: nothing.
          Payoff: your billing emails are the one thing people actually
          save.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">11. App Store / marketplace screenshots</h2>
        <p>
          If you have an app, the mascot goes on the cover screenshot &mdash;
          both because it visually differentiates you from every other app
          in the category, and because App Store algorithms increasingly
          weight visual distinctiveness. Same principle for Chrome extension
          stores, Slack directories, Product Hunt, etc.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">12. Merchandise and stickers</h2>
        <p>
          The single highest-leverage marketing spend in early stage:
          $50&ndash;$500 for a batch of vinyl stickers featuring your
          mascot. They end up on laptops at conferences, in customer
          Slack backgrounds, and on the back of MacBooks in coffee shops.
          Every one is a compounding brand impression.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">Bonus surfaces (once you&apos;ve nailed the 12)</h2>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Blog post headers / author avatars</li>
          <li>Onboarding tour tooltips (the mascot as a guide)</li>
          <li>Confetti moments (product milestones, celebrations)</li>
          <li>Slack / Discord community avatar</li>
          <li>Physical kiosks or hardware (see the{" "}
            <Link href="/blog/panda-charging-case-study" className="text-accent hover:underline font-medium">
              Panda Charging case study
            </Link>
          )</li>
          <li>Onboarding video (see the{" "}
            <Link href="/blog/yonosim-korea-case-study" className="text-accent hover:underline font-medium">
              YonoSIM case study
            </Link>
          )</li>
        </ul>

        <h2 className="text-xl font-bold mt-8 mb-3">Deployment checklist for your first week</h2>
        <div className="rounded-lg border border-border bg-card p-5 my-4">
          <ul className="space-y-2 text-sm text-foreground/90">
            <li>☐ Landing page hero (mascot in an active pose)</li>
            <li>☐ Favicon (cropped head, high contrast)</li>
            <li>☐ Twitter/X, LinkedIn, and product profile avatars</li>
            <li>☐ 1 empty state in your product</li>
            <li>☐ 404 page</li>
            <li>☐ Welcome email header</li>
            <li>☐ 1 push notification or in-app message</li>
            <li>☐ Pitch deck cover slide</li>
          </ul>
        </div>
        <p>
          That&apos;s 8 of the 12. If you can also swing loading states,
          receipts, App Store screenshots, and a first sticker order in
          the same week &mdash; you&apos;ve done more brand work in a week
          than most companies do in a year.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">The bottom line</h2>
        <p>
          Every place your mascot doesn&apos;t appear is a place your brand
          is invisible. The mascot compounds through repetition, and the
          repetition is free once you have the character sheet. Deploy
          aggressively, deploy in the moments that matter (onboarding,
          success, apology), and don&apos;t save the mascot for &ldquo;the
          right moment.&rdquo; Every moment is the right moment.
        </p>

        <p className="text-sm text-muted mt-8">
          Don&apos;t have a mascot yet? <Link href="/" className="text-accent hover:underline font-medium">Generate a full character sheet with Mascoty</Link> in about a minute, then work down this list.
        </p>
      </div>
    </article>
  );
}
