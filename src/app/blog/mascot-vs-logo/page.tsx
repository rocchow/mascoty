import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mascot vs Logo: Do You Need Both as a Startup? | Mascoty",
  description:
    "A logo is a signature. A mascot is a host. Most startups need both — here's how to decide when and why, with a clear decision framework.",
};

export default function MascotVsLogo() {
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
          Mascot vs Logo: Do You Need Both as a Startup?
        </h1>
        <p className="mt-4 text-lg text-muted leading-relaxed">
          They&apos;re not competing assets. They&apos;re different jobs.
          Here&apos;s how to think about each &mdash; and a simple framework
          for deciding whether you actually need a mascot at all.
        </p>
      </div>

      <div className="prose-custom space-y-6 text-[15px] leading-relaxed text-foreground/90">
        <p className="text-base">
          <strong className="text-foreground">Short answer:</strong> A logo is
          your <em>signature</em> &mdash; the mark that says &ldquo;this is
          us.&rdquo; A mascot is your <em>host</em> &mdash; the character that
          greets, guides, celebrates, and apologizes on your behalf. Most
          startups benefit from having both. The logo closes deals; the mascot
          opens them.
        </p>

        <p>
          This post is part of our{" "}
          <Link href="/blog/startup-mascot-guide" className="text-accent hover:underline font-medium">
            complete guide to startup mascots
          </Link>
          .
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">The core distinction</h2>
        <p>
          A logo is designed to be <em>recognized</em>. It needs to work at
          16&times;16 pixels in a favicon, in a black-and-white newspaper ad,
          on a business card. It must be simple, static, and readable in a
          fraction of a second. That&apos;s a valuable job. It&apos;s also a
          narrow one.
        </p>
        <p>
          A mascot is designed to be <em>related to</em>. It needs to convey
          personality, emotion, and warmth. It can wave, wink, cry, celebrate.
          It works because it&apos;s expressive, not because it&apos;s minimal.
          Different job, different constraints.
        </p>

        <div className="my-6 rounded-lg border border-border bg-card p-5">
          <p className="text-sm font-semibold text-foreground mb-3">Logo vs mascot at a glance</p>
          <table className="w-full text-sm">
            <thead className="text-left border-b border-border">
              <tr className="text-muted">
                <th className="py-2 pr-4 font-medium">Attribute</th>
                <th className="py-2 pr-4 font-medium">Logo</th>
                <th className="py-2 font-medium">Mascot</th>
              </tr>
            </thead>
            <tbody className="text-foreground/90">
              <tr className="border-b border-border/50">
                <td className="py-2 pr-4">Job</td>
                <td className="py-2 pr-4">Recognition</td>
                <td className="py-2">Relationship</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 pr-4">Reads in</td>
                <td className="py-2 pr-4">&lt;1 second</td>
                <td className="py-2">2&ndash;5 seconds</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 pr-4">Best size</td>
                <td className="py-2 pr-4">16px&ndash;100px</td>
                <td className="py-2">100px&ndash;full page</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 pr-4">Expresses emotion?</td>
                <td className="py-2 pr-4">No</td>
                <td className="py-2">Yes</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">Can it apologize?</td>
                <td className="py-2 pr-4">No</td>
                <td className="py-2">Absolutely</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-xl font-bold mt-8 mb-3">Where each one lives</h2>
        <p>
          <strong className="text-foreground">Logo spots:</strong> favicon,
          navbar, footer, business cards, email signatures, invoices, PDF
          headers, app icon (sometimes), any place with a strict size or
          format constraint.
        </p>
        <p>
          <strong className="text-foreground">Mascot spots:</strong> landing
          hero, onboarding flow, empty states, error screens, loading
          spinners, 404 page, welcome emails, push notifications, product
          Hunt launches, pitch deck covers, sticker packs, T-shirts. Full
          list:{" "}
          <Link href="/blog/where-to-use-your-brand-mascot" className="text-accent hover:underline font-medium">
            12 Places to Deploy Your Mascot
          </Link>
          .
        </p>
        <p>
          Notice the overlap is small. That&apos;s deliberate. Trying to make
          your logo do the mascot&apos;s job (or vice versa) breaks both.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">Real examples of the two working together</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-foreground">Mailchimp:</strong> the
            wordmark logo is what appears on invoices and in acquisition
            press releases. Freddie the chimp is what appears in-app when
            you send a campaign. Neither can do the other&apos;s job.{" "}
            <Link href="/blog/mailchimp-freddie-mascot-case-study" className="text-accent hover:underline font-medium">
              Full case study &rarr;
            </Link>
          </li>
          <li>
            <strong className="text-foreground">Duolingo:</strong> the
            wordmark is what appears in App Store listings. Duo the owl is
            what appears in TikToks, notifications, and every seasonal
            campaign.{" "}
            <Link href="/blog/duolingo-mascot-marketing-lessons" className="text-accent hover:underline font-medium">
              Full case study &rarr;
            </Link>
          </li>
          <li>
            <strong className="text-foreground">GitHub:</strong> the Invertocat
            wordmark is the corporate identity. The Octocat is the mascot
            that lives on stickers, error pages, and the loading spinner
            of a thousand PR review sessions.
          </li>
        </ul>

        <h2 className="text-xl font-bold mt-8 mb-3">Decision framework: do you need a mascot?</h2>
        <p>Answer these five questions honestly:</p>
        <ol className="list-decimal pl-5 space-y-2">
          <li>
            <strong className="text-foreground">Do you sell to humans (not just enterprise procurement)?</strong>{" "}
            If yes, a mascot compounds. If your only buyers are Fortune 500
            IT departments, maybe skip.
          </li>
          <li>
            <strong className="text-foreground">Does your product have moments of anxiety or celebration?</strong>{" "}
            Sending an email, closing a deal, saving a design, deploying
            code, reaching a streak &mdash; those are all mascot moments.
          </li>
          <li>
            <strong className="text-foreground">Is your category flooded with similar-looking wordmarks?</strong>{" "}
            SaaS logos in 2026 are basically interchangeable. A mascot is
            an immediate differentiator.
          </li>
          <li>
            <strong className="text-foreground">Do you have empty states or error screens that feel cold?</strong>{" "}
            Every empty state is a place a mascot could be earning its
            keep.
          </li>
          <li>
            <strong className="text-foreground">Do you want to be talked about on social?</strong>{" "}
            People screenshot mascots. They don&apos;t screenshot logos.
          </li>
        </ol>
        <p>
          Three or more yeses: build one. Fewer than three: fine to stay
          logo-only.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">Common mistake: making the logo <em>into</em> the mascot</h2>
        <p>
          A recurring trap is trying to smuggle personality into a logo
          &mdash; adding eyes to a letterform, giving the wordmark a wink.
          It never works. Logos are load-bearing at sizes where eyes
          disappear. You end up with a compromised logo <em>and</em> no
          real mascot.
        </p>
        <p>
          The right move is to keep them separate: clean, simple logo for
          recognition; expressive, character-driven mascot for relationship.
          More on this and other traps in{" "}
          <Link href="/blog/startup-mascot-mistakes" className="text-accent hover:underline font-medium">
            9 Mascot Mistakes Small Brands Make
          </Link>
          .
        </p>

        <h2 className="text-xl font-bold mt-8 mb-3">The bottom line</h2>
        <p>
          Don&apos;t choose between a logo and a mascot &mdash; you probably
          need both. The logo does the recognition work; the mascot does the
          relationship work. Together they form a brand system that greets,
          delights, and signs off in a consistent voice. Alone, either one
          is doing half a job.
        </p>

        <p className="text-sm text-muted mt-8">
          Got a logo but no mascot? <Link href="/" className="text-accent hover:underline font-medium">Generate a full character sheet with Mascoty</Link> in about a minute.
        </p>
      </div>
    </article>
  );
}
