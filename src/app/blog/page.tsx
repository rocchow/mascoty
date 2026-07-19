import Link from "next/link";

const posts = [
  {
    slug: "panda-charging-case-study",
    title: "How Panda Charging Built a Brand Mascot That Keeps Guests Plugged In",
    excerpt:
      "From a single character sheet to a fully branded kiosk network — how a powerbank rental company created \"Panda the Charging Hero\" and deployed it across every customer touchpoint.",
    date: "July 15, 2026",
    tag: "Case Study",
    gradient: "from-green-50 to-green-100 dark:from-green-950 dark:to-green-900",
    emoji: "\u{1F43C}⚡",
  },
  {
    slug: "yonosim-korea-case-study",
    title: "YonoSIM Korea: From Character Sheet to Animated Video in One Day",
    excerpt:
      "How a travel eSIM brand used Mascoty to generate their mascot \"Yoni,\" produce website content, and create an animated marketing video using Seedance 2.0 — all in a single day.",
    date: "July 18, 2026",
    tag: "Case Study",
    gradient: "from-red-50 to-red-100 dark:from-red-950 dark:to-red-900",
    emoji: "\u{1F30F}\u{1F4F1}",
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
            <div
              className={`aspect-[3/1] bg-gradient-to-br ${post.gradient} flex items-center justify-center`}
            >
              <div className="text-5xl">{post.emoji}</div>
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
