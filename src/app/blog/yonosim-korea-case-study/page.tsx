import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "YonoSIM Korea: From Character Sheet to Animated Video in One Day | Mascoty",
  description:
    "Case study: How YonoSIM's Korean division used Mascoty to create their mascot Yoni, produce website content, and generate animated marketing videos with Seedance 2.0.",
};

export default function YonoSIMCaseStudy() {
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
          <span className="text-xs text-muted">July 18, 2026</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight leading-tight">
          YonoSIM Korea: From Character Sheet to Animated Video in One Day
        </h1>
        <p className="mt-4 text-lg text-muted leading-relaxed">
          How a travel eSIM brand used Mascoty to generate their mascot
          &ldquo;Yoni,&rdquo; produce website content, and create an animated
          marketing video using Seedance 2.0 &mdash; all in a single day.
        </p>
      </div>

      {/* Hero image placeholder */}
      <div className="rounded-xl border border-border bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 aspect-[2/1] flex items-center justify-center mb-10">
        <div className="text-6xl">&#x1F30F;&#x1F4F1;</div>
      </div>

      {/* Content */}
      <div className="prose-custom space-y-6 text-[15px] leading-relaxed text-foreground/90">
        <h2 className="text-xl font-bold mt-8 mb-3">The brand</h2>
        <p>
          <a href="https://www.yonosim.com/ko" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline font-medium">YonoSIM</a>{" "}
          (&ldquo;You Only Need One SIM&rdquo;) is a travel eSIM provider covering 200+
          countries. Travelers buy a digital SIM online, scan a QR code, and connect
          instantly on arrival &mdash; no SIM swap, no roaming bills.
        </p>
        <p>
          Their Korean division at{" "}
          <a href="https://www.yonosim.com/ko" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline font-medium">yonosim.com/ko</a>{" "}
          targets Korean outbound travelers heading to Japan, Vietnam, Thailand, the Philippines,
          and other top destinations. The Korean market is particularly competitive &mdash;
          travelers compare dozens of eSIM providers, and brand personality is a key differentiator
          when the product itself is a commodity.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">The challenge</h2>
        <p>
          YonoSIM Korea needed a character that would resonate with Korean travelers &mdash;
          something culturally specific, not a generic globe-trotting cartoon. They wanted
          a mascot that could:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-muted">
          <li>Appear on the Korean website as a brand ambassador</li>
          <li>Work in social media ads for KakaoTalk and Naver</li>
          <li>Star in short-form video content for Korean audiences</li>
          <li>Feel distinctly Korean while fitting the global YonoSIM brand</li>
        </ul>
        <p>
          Hiring a Korean illustration studio would have cost $2,000&ndash;$3,000 and
          taken 2&ndash;3 weeks. And that would only produce static assets &mdash; video
          would be an entirely separate project.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">The Mascoty process</h2>
        <p>
          The YonoSIM Korea team generated their character sheet in Mascoty with these inputs:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-muted">
          <li><strong className="text-foreground">Name:</strong> Yoni</li>
          <li><strong className="text-foreground">Species:</strong> Travel character / humanoid mascot</li>
          <li><strong className="text-foreground">Role:</strong> Travel Companion &amp; eSIM Guide</li>
          <li><strong className="text-foreground">Personality:</strong> Cheerful, knowledgeable, adventurous</li>
          <li><strong className="text-foreground">Style:</strong> 3D Cartoon</li>
          <li><strong className="text-foreground">Colors:</strong> Red accent (brand), White, with Korean cultural elements</li>
          <li><strong className="text-foreground">Description:</strong> Features Taegeuk-patterned hair (Korean flag motif), a Wi-Fi antenna on the head symbolizing connectivity, carries a SIM pouch and red travel suitcase</li>
        </ul>
        <p>
          The generated character sheet gave them a complete design system: turnaround views
          of Yoni from every angle, expressions from &ldquo;excited to travel&rdquo; to
          &ldquo;waving goodbye,&rdquo; poses with luggage, and a style guide with exact
          hex codes matching YonoSIM&apos;s red-and-white brand palette.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">From character sheet to website</h2>
        <p>
          Within hours, the character sheet assets were deployed across yonosim.com/ko:
        </p>
        <ol className="list-decimal pl-5 space-y-2 text-muted">
          <li>
            <strong className="text-foreground">Footer mascot</strong> &mdash; Yoni&apos;s
            &ldquo;waving goodbye&rdquo; pose was placed in the site footer, sending travelers
            off with a friendly farewell.
          </li>
          <li>
            <strong className="text-foreground">Destination cards</strong> &mdash; different
            Yoni poses were paired with each destination (Japan, Vietnam, Thailand), giving each
            country page a unique personality.
          </li>
          <li>
            <strong className="text-foreground">Onboarding guide</strong> &mdash; the
            &ldquo;pointing&rdquo; and &ldquo;thumbs up&rdquo; expressions illustrated the 3-step
            eSIM installation process.
          </li>
          <li>
            <strong className="text-foreground">Social proof section</strong> &mdash; Yoni
            appeared alongside the 4.7/5 star rating badge, adding warmth to the trust signals.
          </li>
        </ol>

        <h2 className="text-xl font-bold mt-8 mb-3">The breakthrough: character sheet to video</h2>
        <p>
          This is where the workflow went beyond static images. Using the character sheet as a
          reference, the YonoSIM team fed Yoni&apos;s poses into{" "}
          <strong>Seedance 2.0</strong> &mdash; an AI video generation model &mdash; and
          produced a 15-second animated marketing clip of Yoni:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-muted">
          <li>Waving hello with a red suitcase</li>
          <li>Scanning a QR code on a phone screen</li>
          <li>Celebrating with a &ldquo;connected!&rdquo; gesture</li>
          <li>Walking through a stylized airport gate</li>
        </ul>
        <p>
          The entire video was generated, edited, and published in <strong>under 4 hours</strong>.
          No animation studio. No motion graphics freelancer. The character sheet provided the
          visual consistency that made the AI-generated video look cohesive and on-brand.
        </p>

        <div className="rounded-xl border border-border bg-accent-light p-6 mt-4">
          <div className="text-sm font-semibold mb-2">The workflow</div>
          <div className="flex flex-col sm:flex-row items-center gap-3 text-sm text-muted">
            <div className="rounded-lg bg-card border border-border px-4 py-3 text-center flex-1">
              <div className="font-semibold text-foreground">Mascoty</div>
              <div className="text-xs mt-0.5">Character sheet</div>
              <div className="text-xs">~60 seconds</div>
            </div>
            <div className="text-accent font-bold">&rarr;</div>
            <div className="rounded-lg bg-card border border-border px-4 py-3 text-center flex-1">
              <div className="font-semibold text-foreground">Website</div>
              <div className="text-xs mt-0.5">Deploy assets</div>
              <div className="text-xs">~2 hours</div>
            </div>
            <div className="text-accent font-bold">&rarr;</div>
            <div className="rounded-lg bg-card border border-border px-4 py-3 text-center flex-1">
              <div className="font-semibold text-foreground">Seedance 2.0</div>
              <div className="text-xs mt-0.5">Animated video</div>
              <div className="text-xs">~4 hours</div>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold mt-8 mb-3">The result</h2>
        <p>
          In a single day, YonoSIM Korea went from having no mascot to having:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-muted">
          <li>A complete character design system with turnaround views and expressions</li>
          <li>Website integration across all key pages</li>
          <li>A 15-second animated marketing video ready for social media</li>
          <li>A consistent visual identity that differentiates them in a crowded market</li>
        </ul>
        <p>
          Total cost: <strong>1 Mascoty credit</strong> for the character sheet +
          Seedance 2.0 video generation. Total calendar time: <strong>1 day</strong>, compared
          to the 2&ndash;3 weeks an illustration studio would have required for static assets
          alone.
        </p>

        <div className="rounded-xl border border-border bg-accent-light p-6 mt-8">
          <blockquote className="text-sm italic text-foreground/80">
            &ldquo;The character sheet was the key that unlocked everything. Once we had
            Yoni&apos;s design system &mdash; every angle, every expression, every color code
            &mdash; we could generate website assets, social content, and even video. The
            consistency was incredible because everything traced back to one source.&rdquo;
          </blockquote>
          <div className="mt-3 text-xs text-muted">
            &mdash; YonoSIM Korea team
          </div>
        </div>

        <h2 className="text-xl font-bold mt-8 mb-3">Key takeaways</h2>
        <ul className="list-disc pl-5 space-y-1 text-muted">
          <li>
            <strong className="text-foreground">Character sheets are a creative springboard.</strong>{" "}
            The sheet isn&apos;t just a reference doc &mdash; it&apos;s the input layer for every
            downstream tool, from website builders to video generators.
          </li>
          <li>
            <strong className="text-foreground">Cultural specificity matters.</strong>{" "}
            Yoni&apos;s Taegeuk-patterned hair and Korean-market positioning made the mascot
            feel native, not generic.
          </li>
          <li>
            <strong className="text-foreground">AI video is production-ready.</strong>{" "}
            Seedance 2.0 produced broadcast-quality clips from character sheet references. The
            consistency of the input (same character, same style, same colors) made the output
            reliable.
          </li>
          <li>
            <strong className="text-foreground">Speed is a competitive advantage.</strong>{" "}
            In a commodity market like eSIM, the brand that ships first with a memorable identity wins.
          </li>
        </ul>

        <div className="rounded-xl border-2 border-accent bg-accent-light p-6 mt-8">
          <div className="text-sm font-bold mb-2">Coming soon to Mascoty: Video Generation</div>
          <p className="text-sm text-foreground/80">
            Inspired by workflows like YonoSIM&apos;s, we&apos;re building video generation
            directly into Mascoty. Pro plan users will be able to select a pose from their
            character sheet and generate a short animated clip &mdash; powered by Seedance 2.0
            &mdash; without leaving the platform. Stay tuned.
          </p>
        </div>
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
          href="/blog/panda-charging-case-study"
          className="block rounded-xl border border-border bg-card p-4 transition hover:border-accent"
        >
          <div className="text-xs text-accent font-semibold">Case Study</div>
          <div className="font-medium mt-1">
            How Panda Charging Built a Brand Mascot That Keeps Guests Plugged In
          </div>
          <div className="text-xs text-muted mt-1">Read more &rarr;</div>
        </Link>
      </div>
    </article>
  );
}
