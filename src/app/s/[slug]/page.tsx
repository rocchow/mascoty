import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import type { MascotColor } from "@/types/mascot";
import { MASCOT_STYLES } from "@/types/mascot";

interface Row {
  id: string;
  share_slug: string;
  name: string;
  role: string | null;
  personality: string | null;
  species: string | null;
  description: string | null;
  style: string;
  colors: MascotColor[] | null;
  image_url: string | null;
  status: string;
  created_at: string;
}

async function loadGeneration(slug: string): Promise<Row | null> {
  if (!/^[a-z0-9]{6,20}$/i.test(slug)) return null;
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("free_trial_generations")
    .select(
      "id, share_slug, name, role, personality, species, description, style, colors, image_url, status, created_at",
    )
    .eq("share_slug", slug.toLowerCase())
    .maybeSingle<Row>();
  return data ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const row = await loadGeneration(slug);
  if (!row) return { title: "Not found — Mascoty" };
  return {
    title: `${row.name} — mascot character sheet · Mascoty`,
    description:
      row.description ??
      `A complete character sheet for ${row.name}, generated with Mascoty.`,
    openGraph: {
      title: `${row.name} — character sheet`,
      description:
        row.description ??
        `Generated with Mascoty — turnaround, expressions, poses, palette.`,
      images: row.image_url ? [row.image_url] : undefined,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${row.name} — character sheet`,
      images: row.image_url ? [row.image_url] : undefined,
    },
  };
}

const STYLE_LABEL: Record<string, string> = Object.fromEntries(
  MASCOT_STYLES.map((s) => [s.value, s.label]),
);

export default async function SharePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const row = await loadGeneration(slug);
  if (!row) notFound();

  const isDone = row.status === "completed" && row.image_url;
  const isFailed = row.status === "failed";

  return (
    <div className="flex flex-col min-h-full">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="text-xl font-bold tracking-tight">
            <span className="text-accent">Mascoty</span>
          </Link>
          <Link
            href="/#try"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-hover"
          >
            Create yours &rarr;
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-10">
        <div className="mb-6">
          <div className="text-[10px] font-bold uppercase tracking-wider text-accent">
            Character Sheet
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1">
            {row.name}
          </h1>
          {row.role && (
            <p className="text-sm text-muted mt-1">{row.role}</p>
          )}
        </div>

        {isDone ? (
          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={row.image_url!}
              alt={`${row.name} character sheet`}
              className="w-full h-auto"
            />
          </div>
        ) : isFailed ? (
          <div className="rounded-2xl border-2 border-dashed border-danger/30 p-12 text-center">
            <div className="text-4xl mb-4">&#x26A0;</div>
            <h2 className="text-lg font-semibold">Generation failed</h2>
            <p className="text-sm text-muted mt-1">
              Sorry — something went wrong. This one didn&apos;t count toward
              the hourly cap.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center">
            <div className="h-10 w-10 mx-auto animate-spin rounded-full border-2 border-accent border-t-transparent mb-4" />
            <h2 className="text-lg font-semibold">Cooking your mascot…</h2>
            <p className="text-sm text-muted mt-1 max-w-sm mx-auto">
              This page auto-updates when it&apos;s ready. We&apos;ll also email
              you a copy.
            </p>
          </div>
        )}

        {isDone && (
          <>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={row.image_url!}
                download={`${row.name}-preview-sheet.png`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover"
              >
                Download preview PNG
              </a>
              <Link
                href="/#try"
                className="rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-accent"
              >
                Make your own
              </Link>
            </div>
            <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-accent-light border border-accent/20 px-3 py-1.5 text-xs">
              <span className="font-semibold text-accent">Preview quality</span>
              <span className="text-muted">·</span>
              <Link href="/#try" className="text-accent hover:text-accent-hover">
                HD version at launch &rarr;
              </Link>
            </div>
          </>
        )}

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="text-xs font-semibold text-muted uppercase tracking-wide mb-3">
              Brief
            </div>
            <dl className="space-y-2 text-sm">
              {row.species && (
                <>
                  <dt className="text-muted text-xs">Species / form</dt>
                  <dd>{row.species}</dd>
                </>
              )}
              {row.personality && (
                <>
                  <dt className="text-muted text-xs mt-2">Personality</dt>
                  <dd>{row.personality}</dd>
                </>
              )}
              <dt className="text-muted text-xs mt-2">Style</dt>
              <dd>{STYLE_LABEL[row.style] ?? row.style}</dd>
              {row.description && (
                <>
                  <dt className="text-muted text-xs mt-2">Description</dt>
                  <dd className="text-muted leading-relaxed">
                    {row.description}
                  </dd>
                </>
              )}
            </dl>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <div className="text-xs font-semibold text-muted uppercase tracking-wide mb-3">
              Palette
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(row.colors ?? []).map((c, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-lg border border-border p-2"
                >
                  <span
                    className="h-8 w-8 rounded-md border border-border flex-shrink-0"
                    style={{ backgroundColor: c.hex }}
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-medium truncate">{c.name}</div>
                    <div className="text-[10px] text-muted font-mono">
                      {c.hex}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {!isDone && !isFailed && <PollScript slug={row.share_slug} />}
      </main>

      <footer className="mt-auto border-t border-border bg-card">
        <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6 text-center text-xs text-muted">
          Generated with{" "}
          <Link href="/" className="text-accent font-medium">
            Mascoty
          </Link>
          . Free while capacity lasts — 10 sheets per hour.
        </div>
      </footer>
    </div>
  );
}

// Lightweight client-side auto-refresh; server-rendered page uses a script tag
// to avoid pulling in a client bundle just for the poll.
function PollScript({ slug }: { slug: string }) {
  const safe = slug.replace(/[^a-z0-9]/gi, "");
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `(function(){var slug=${JSON.stringify(safe)};var t=setInterval(function(){fetch('/api/free/share/'+slug+'/status').then(function(r){return r.json();}).then(function(d){if(d&&(d.status==='completed'||d.status==='failed')){clearInterval(t);location.reload();}}).catch(function(){});},4000);})();`,
      }}
    />
  );
}
