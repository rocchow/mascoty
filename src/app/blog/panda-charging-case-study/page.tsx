import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How Panda Charging Built a Brand Mascot That Keeps Guests Plugged In | Mascoty",
  description:
    "Case study: How Panda Charging used Mascoty to create a full character sheet for their brand mascot and deploy it across kiosks, marketing, and social media.",
};

export default function PandaChargingCaseStudy() {
  return (
    <article className="max-w-2xl mx-auto px-4 py-16 sm:px-6">
      {/* Breadcrumb */}
      <div className="mb-8">
        <Link href="/blog" className="text-xs text-muted hover:text-accent transition">
          &larr; Back to blog
        </Link>
      </div>

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-accent bg-accent-light px-2 py-0.5 rounded-full">
            Case Study
          </span>
          <span className="text-xs text-muted">July 15, 2026</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight leading-tight">
          How Panda Charging Built a Brand Mascot That Keeps Guests Plugged In
        </h1>
        <p className="mt-4 text-lg text-muted leading-relaxed">
          From a single character sheet to a fully branded kiosk network &mdash;
          how a powerbank rental company created &ldquo;Panda the Charging
          Hero&rdquo; and deployed it across every customer touchpoint.
        </p>
      </div>

      {/* Character sheet */}
      <div className="rounded-xl border border-border overflow-hidden mb-10">
        <Image
          src="/panda/panda.png"
          alt="Panda the Charging Hero — full character sheet"
          width={1400}
          height={900}
          className="w-full h-auto"
        />
      </div>

      {/* Content */}
      <div className="prose-custom space-y-6 text-[15px] leading-relaxed text-foreground/90">
        <h2 className="text-xl font-bold mt-8 mb-3">The brand</h2>
        <p>
          <a href="https://www.pandacharging.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline font-medium">Panda Charging</a>{" "}
          is a premium powerbank rental service for hospitality venues. They install
          sleek charging kiosks in day spas, wellness clinics, hotels, KTV lounges,
          hotpot restaurants, and bubble tea cafes &mdash; anywhere guests spend hours
          and their phone batteries don&apos;t last.
        </p>
        <p>
          Their pitch is simple: <em>&ldquo;Give your guests a charge &mdash; and a reason
          to stay longer.&rdquo;</em> Unlike competitors plastered with ads, Panda
          Charging offers clean, ad-free kiosks that blend into premium interiors.
          Venues can choose an amenity model (venue pays, guests charge free) or a
          revenue-share model (free installation, guests pay per use).
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">The challenge</h2>
        <p>
          Panda Charging had the product and the name, but no visual identity to match.
          The word &ldquo;Panda&rdquo; evoked a generic image. They needed a distinctive
          character that could live on kiosk screens, marketing materials, social media,
          and partner-facing pitch decks &mdash; and they needed it fast. A design agency
          quoted $5,000+ and 4&ndash;6 weeks. As a lean startup, that wasn&apos;t an option.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">The Mascoty process</h2>
        <p>
          Using Mascoty, the team described their mascot in under two minutes:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-muted">
          <li><strong className="text-foreground">Name:</strong> Panda</li>
          <li><strong className="text-foreground">Species:</strong> Panda bear</li>
          <li><strong className="text-foreground">Role:</strong> The Charging Hero</li>
          <li><strong className="text-foreground">Personality:</strong> Friendly, Helpful, Reliable</li>
          <li><strong className="text-foreground">Style:</strong> 3D Cartoon (Pixar-style)</li>
          <li><strong className="text-foreground">Colors:</strong> Panda Green (#32B44A), Black (#111111), White (#FFFFFF)</li>
          <li><strong className="text-foreground">Description:</strong> Wears a black outfit with a lightning bolt emblem and a green cape that represents energy and sustainability</li>
        </ul>
        <p>
          60 seconds later, Mascoty generated a complete character sheet with:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-muted">
          <li><strong className="text-foreground">Turnaround views</strong> &mdash; front, 3/4, side, 3/4 back, and back angles</li>
          <li><strong className="text-foreground">5 expressions</strong> &mdash; happy, excited, wink, thumbs up, surprised</li>
          <li><strong className="text-foreground">Action poses</strong> &mdash; holding a powerbank, pointing at a phone, flying with cape</li>
          <li><strong className="text-foreground">Color palette</strong> &mdash; with hex codes for the design team</li>
          <li><strong className="text-foreground">Usage examples</strong> &mdash; app icon, ad promo, sticker, campaign mockups</li>
          <li><strong className="text-foreground">Styling notes</strong> &mdash; rules for consistent reproduction</li>
          <li><strong className="text-foreground">Size reference</strong> &mdash; character height relative to a human figure</li>
        </ul>

        <h2 className="text-xl font-bold mt-8 mb-3">What they built from the character sheet</h2>
        <p>
          The character sheet became the single source of truth for Panda Charging&apos;s
          entire visual identity. Within a week, the team produced:
        </p>
        <ol className="list-decimal pl-5 space-y-2 text-muted">
          <li>
            <strong className="text-foreground">Kiosk screen animations</strong> &mdash; the
            &ldquo;happy&rdquo; and &ldquo;wink&rdquo; expressions were adapted into idle-screen
            loops on the charging stations, giving the kiosks a friendly, approachable personality.
          </li>
          <li>
            <strong className="text-foreground">Partner pitch deck</strong> &mdash; the turnaround
            views and usage examples went directly into sales materials for onboarding new venues.
          </li>
          <li>
            <strong className="text-foreground">Social media content</strong> &mdash; sticker-style
            assets for Instagram and WeChat, featuring the &ldquo;thumbs up&rdquo; and
            &ldquo;surprised&rdquo; expressions.
          </li>
          <li>
            <strong className="text-foreground">Website hero imagery</strong> &mdash; the front-facing
            pose with the green cape became the brand&apos;s primary visual on pandacharging.com.
          </li>
          <li>
            <strong className="text-foreground">Branded stickers and tent cards</strong> &mdash;
            placed at venue tables to direct guests to the kiosks.
          </li>
        </ol>

        {/* Marketing materials created from the character sheet */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <div className="rounded-xl border border-border overflow-hidden">
            <Image
              src="/panda/claim_a_kiosk_EN.png"
              alt="Panda Charging venue acquisition poster"
              width={700}
              height={700}
              className="w-full h-auto"
            />
          </div>
          <div className="rounded-xl border border-border overflow-hidden">
            <Image
              src="/panda/noDeposit_EN.png"
              alt="Panda Charging no-deposit feature poster"
              width={700}
              height={700}
              className="w-full h-auto"
            />
          </div>
        </div>

        <h2 className="text-xl font-bold mt-8 mb-3">The result</h2>
        <p>
          Panda the Charging Hero gave the brand an instant personality. Venue partners
          reported that the character made the kiosks feel less &ldquo;techy&rdquo; and more
          like a natural part of the hospitality experience. The mascot unified all
          touchpoints &mdash; kiosk screens, website, pitch decks, and social &mdash; under
          one consistent visual language.
        </p>
        <p>
          Total cost: <strong>1 Mascoty credit</strong>. Total time to first character sheet:
          <strong> 60 seconds</strong>. Total time from character sheet to full brand rollout:
          <strong> 5 days</strong>.
        </p>

        <div className="rounded-xl border border-border bg-accent-light p-6 mt-8">
          <blockquote className="text-sm italic text-foreground/80">
            &ldquo;We went from having a name to having a complete character system in
            under a minute. The character sheet gave our designers everything they needed
            &mdash; angles, expressions, color codes, sizing. What would have cost us
            $5,000 and a month of back-and-forth took one generation.&rdquo;
          </blockquote>
          <div className="mt-3 text-xs text-muted">
            &mdash; Panda Charging team
          </div>
        </div>

        <h2 className="text-xl font-bold mt-8 mb-3">Key takeaways</h2>
        <ul className="list-disc pl-5 space-y-1 text-muted">
          <li><strong className="text-foreground">One sheet, infinite assets.</strong> The character sheet isn&apos;t the end product &mdash; it&apos;s the blueprint that makes every downstream asset consistent.</li>
          <li><strong className="text-foreground">Speed matters for startups.</strong> When you&apos;re pitching venue partners, having a polished brand identity on day one changes the conversation.</li>
          <li><strong className="text-foreground">Hospitality loves characters.</strong> In high-dwell venues, a friendly mascot turns functional hardware into a branded experience.</li>
        </ul>
      </div>

      {/* CTA */}
      <div className="mt-12 rounded-xl border border-border bg-card p-8 text-center">
        <h3 className="text-lg font-bold">Ready to build your brand mascot?</h3>
        <p className="text-sm text-muted mt-2">
          Create your first character sheet free &mdash; no credit card required.
        </p>
        <Link
          href="/auth/signup"
          className="mt-4 inline-block rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover"
        >
          Get Started Free
        </Link>
      </div>

      {/* Related */}
      <div className="mt-10 pt-8 border-t border-border">
        <h3 className="text-sm font-semibold mb-4">More case studies</h3>
        <Link
          href="/blog/yonosim-korea-case-study"
          className="block rounded-xl border border-border bg-card p-4 transition hover:border-accent"
        >
          <div className="text-xs text-accent font-semibold">Case Study</div>
          <div className="font-medium mt-1">
            YonoSIM Korea: From Character Sheet to Animated Video in One Day
          </div>
          <div className="text-xs text-muted mt-1">Read more &rarr;</div>
        </Link>
      </div>
    </article>
  );
}
