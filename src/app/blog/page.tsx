import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Brand Mascot Guides, Case Studies & Startup Playbooks | Mascoty",
  description:
    "Educational guides on brand mascots for startups — pillar guide, Duolingo and Mailchimp case studies, mascot design cost, deployment playbook, and more.",
};

const posts = [
  {
    slug: "startup-mascot-guide",
    title: "Why Every Startup Needs a Brand Mascot: The Complete Guide (2026)",
    excerpt:
      "Duolingo's owl is worth billions. Mailchimp's chimp built a $12B brand. The complete pillar guide to why startups benefit from a mascot — with cost, design steps, and deployment playbook.",
    date: "July 22, 2026",
    tag: "Pillar Guide",
    image: "/mascoty.png",
    imageAlt: "Mascoty — brand mascot pillar guide",
  },
  {
    slug: "duolingo-mascot-marketing-lessons",
    title: "Duo the Owl: How Duolingo Turned a Mascot Into a $2B Growth Engine",
    excerpt:
      "How Duolingo made Duo the owl the face, voice, and TikTok persona of the brand — and the exact playbook a startup with 1% of the budget can copy.",
    date: "July 22, 2026",
    tag: "Case Study",
    image: "/mascoty.png",
    imageAlt: "Duolingo mascot case study",
  },
  {
    slug: "mailchimp-freddie-mascot-case-study",
    title: "Mailchimp's Freddie: The Winking Chimp That Built a Brand Empire",
    excerpt:
      "How a cartoon chimp with a hat helped turn a small email tool into a $12B business — and the three transferable moves any startup can steal.",
    date: "July 22, 2026",
    tag: "Case Study",
    image: "/mascoty.png",
    imageAlt: "Mailchimp Freddie case study",
  },
  {
    slug: "what-is-a-brand-mascot",
    title: "What Is a Brand Mascot? Types, Examples & Why They Work",
    excerpt:
      "The definitional guide: what qualifies as a brand mascot, the four main types (animal, human, object, invented), examples of each, and the psychology behind why they beat logo-only branding.",
    date: "July 22, 2026",
    tag: "Guide",
    image: "/mascoty.png",
    imageAlt: "What is a brand mascot",
  },
  {
    slug: "mascot-vs-logo",
    title: "Mascot vs Logo: Do You Need Both as a Startup?",
    excerpt:
      "A logo is a signature. A mascot is a host. Here's how each earns its keep, plus a 5-question framework for deciding whether your startup needs a mascot at all.",
    date: "July 22, 2026",
    tag: "Guide",
    image: "/mascoty.png",
    imageAlt: "Mascot vs logo comparison",
  },
  {
    slug: "psychology-of-brand-mascots",
    title: "The Psychology of Mascots: Why Faces Beat Logos in Brand Recall",
    excerpt:
      "The neuroscience of the fusiform face area, anthropomorphism, and character-driven memory — plus data from System1, Kantar, and Ehrenberg-Bass on why mascots consistently outperform logos.",
    date: "July 22, 2026",
    tag: "Guide",
    image: "/mascoty.png",
    imageAlt: "Psychology of brand mascots",
  },
  {
    slug: "mascot-design-cost",
    title: "How Much Does a Brand Mascot Cost? DIY vs Agency vs AI (2026)",
    excerpt:
      "The complete 2026 cost breakdown: in-house doodles, Fiverr commissions, freelance illustrators, brand agencies, and AI generators — with realistic price ranges, timelines, and when each is right.",
    date: "July 22, 2026",
    tag: "Guide",
    image: "/mascoty.png",
    imageAlt: "Brand mascot cost breakdown",
  },
  {
    slug: "how-to-design-a-startup-mascot",
    title: "How to Design a Startup Mascot in 7 Steps (With Examples)",
    excerpt:
      "The exact process: personality → form → palette → character sheet → style guide → deployment → voice. Ship a full mascot system in a week — even without a design team.",
    date: "July 22, 2026",
    tag: "Guide",
    image: "/mascoty.png",
    imageAlt: "How to design a startup mascot",
  },
  {
    slug: "where-to-use-your-brand-mascot",
    title: "12 Places to Deploy Your Mascot: From Landing Page to Loading States",
    excerpt:
      "A mascot on your About page is a decoration. A mascot in 12 places is a brand asset. The full deployment checklist with why each surface matters and examples from Duolingo, Mailchimp, and GitHub.",
    date: "July 22, 2026",
    tag: "Guide",
    image: "/mascoty.png",
    imageAlt: "Where to deploy your mascot",
  },
  {
    slug: "startup-mascot-mistakes",
    title: "9 Mascot Mistakes Small Brands Make (And How to Avoid Them)",
    excerpt:
      "The failure pattern of dead startup mascots is remarkably consistent. Here are the nine mistakes that kill 90% of them — and a one-sentence fix for each.",
    date: "July 22, 2026",
    tag: "Guide",
    image: "/mascoty.png",
    imageAlt: "Mascot mistakes to avoid",
  },
  {
    slug: "panda-charging-case-study",
    title: "How Panda Charging Built a Brand Mascot That Keeps Guests Plugged In",
    excerpt:
      "From a single character sheet to a fully branded kiosk network — how a powerbank rental company created \"Panda the Charging Hero\" and deployed it across every customer touchpoint.",
    date: "July 15, 2026",
    tag: "Case Study",
    image: "/panda/panda.png",
    imageAlt: "Panda the Charging Hero character sheet",
  },
  {
    slug: "yonosim-korea-case-study",
    title: "YonoSIM Korea: From Character Sheet to Animated Video in One Day",
    excerpt:
      "How a travel eSIM brand used Mascoty to generate their mascot \"Yoni,\" produce website content, and create an animated marketing video using Seedance 2.0 — all in a single day.",
    date: "July 18, 2026",
    tag: "Case Study",
    image: "/yoni/yoni.png",
    imageAlt: "Yoni — Travel Signal Spirit character sheet",
  },
];

export default function BlogIndexPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Blog</h1>
      <p className="text-muted mb-10">
        Case studies, tutorials, and updates from the Mascoty team.
      </p>

      <div className="space-y-6">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block rounded-xl border border-border bg-card overflow-hidden transition hover:border-accent hover:shadow-sm"
          >
            <div className="aspect-[3/1] relative overflow-hidden bg-card">
              <Image
                src={post.image}
                alt={post.imageAlt}
                width={1400}
                height={900}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-accent">
                  {post.tag}
                </span>
                <span className="text-[10px] text-muted">{post.date}</span>
              </div>
              <h2 className="text-lg font-semibold group-hover:text-accent transition leading-snug">
                {post.title}
              </h2>
              <p className="text-sm text-muted mt-2 leading-relaxed">
                {post.excerpt}
              </p>
              <div className="mt-4 text-sm font-medium text-accent">
                Read more &rarr;
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
