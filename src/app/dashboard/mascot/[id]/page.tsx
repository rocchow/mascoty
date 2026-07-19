"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Mascot } from "@/types/mascot";
import Link from "next/link";

export default function MascotDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [mascot, setMascot] = useState<Mascot | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const fetchMascot = useCallback(async () => {
    const res = await fetch(`/api/mascots/${id}`);
    if (!res.ok) {
      router.push("/dashboard");
      return;
    }
    const data = await res.json();
    setMascot(data);
    setLoading(false);
  }, [id, router]);

  useEffect(() => {
    fetchMascot();
  }, [fetchMascot]);

  // Poll while generating
  useEffect(() => {
    if (!mascot || mascot.status !== "generating") return;

    const interval = setInterval(async () => {
      const res = await fetch(`/api/mascots/${id}`);
      if (res.ok) {
        const data = await res.json();
        setMascot(data);
        if (data.status !== "generating" && data.status !== "pending") {
          clearInterval(interval);
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [mascot?.status, id]);

  async function handleDelete() {
    if (!confirm("Delete this mascot? This cannot be undone.")) return;
    setDeleting(true);
    await fetch(`/api/mascots/${id}`, { method: "DELETE" });
    router.push("/dashboard");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (!mascot) return null;

  const isGenerating =
    mascot.status === "generating" || mascot.status === "pending";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link
            href="/dashboard"
            className="text-xs text-muted hover:text-accent transition"
          >
            &larr; Back to library
          </Link>
          <h1 className="text-2xl font-bold tracking-tight mt-1">
            {mascot.name}
          </h1>
          {mascot.role && (
            <p className="text-sm text-muted">{mascot.role}</p>
          )}
        </div>
        <div className="flex gap-2">
          {mascot.image_url && (
            <a
              href={mascot.image_url}
              download={`${mascot.name}-character-sheet.png`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-hover"
            >
              Download PNG
            </a>
          )}
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-danger transition hover:bg-red-50 dark:hover:bg-red-950 disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>

      {isGenerating ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border py-24 text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent mb-4" />
          <h2 className="text-lg font-semibold">Generating your mascot...</h2>
          <p className="text-sm text-muted mt-1 max-w-xs">
            This usually takes 15-30 seconds. We&apos;re creating turnaround
            views, expressions, poses, and more.
          </p>
          <div className="mt-6 space-y-2 text-xs text-muted">
            <div className="animate-pulse">Designing character...</div>
          </div>
        </div>
      ) : mascot.status === "failed" ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-danger/30 py-24 text-center">
          <div className="text-4xl mb-4">&#x26A0;</div>
          <h2 className="text-lg font-semibold">Generation failed</h2>
          <p className="text-sm text-muted mt-1">
            Your credit has been refunded. Please try again.
          </p>
          <Link
            href="/dashboard/create"
            className="mt-4 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-hover"
          >
            Try Again
          </Link>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <img
            src={mascot.image_url!}
            alt={`${mascot.name} character sheet`}
            className="w-full"
          />
        </div>
      )}

      {/* Details */}
      {mascot.generation_params && (
        <div className="mt-6 rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold mb-3">Generation Details</h3>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
            <dt className="text-muted">Style</dt>
            <dd className="font-medium sm:col-span-2">
              {mascot.generation_params.style}
            </dd>
            {mascot.generation_params.personality && (
              <>
                <dt className="text-muted">Personality</dt>
                <dd className="font-medium sm:col-span-2">
                  {mascot.generation_params.personality}
                </dd>
              </>
            )}
            {mascot.generation_params.colors && (
              <>
                <dt className="text-muted">Colors</dt>
                <dd className="flex gap-2 sm:col-span-2">
                  {mascot.generation_params.colors.map((c, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span
                        className="h-4 w-4 rounded-full border border-border"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span className="text-xs text-muted">{c.name}</span>
                    </div>
                  ))}
                </dd>
              </>
            )}
          </dl>
        </div>
      )}
    </div>
  );
}
