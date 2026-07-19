"use client";

import { Mascot } from "@/types/mascot";
import Link from "next/link";

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    completed: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
    generating: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400",
    pending: "bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-400",
    failed: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
  };

  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${styles[status] || styles.pending}`}
    >
      {status}
    </span>
  );
}

export function MascotGrid({ mascots }: { mascots: Mascot[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {mascots.map((mascot) => (
        <Link
          key={mascot.id}
          href={`/dashboard/mascot/${mascot.id}`}
          className="group rounded-xl border border-border bg-card overflow-hidden transition hover:border-accent hover:shadow-sm"
        >
          <div className="aspect-[3/2] bg-accent-light/30 relative">
            {mascot.image_url ? (
              <img
                src={mascot.image_url}
                alt={mascot.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-3xl">
                {mascot.status === "generating" ? (
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                ) : (
                  "&#x1F43C;"
                )}
              </div>
            )}
          </div>
          <div className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-sm group-hover:text-accent transition">
                  {mascot.name}
                </h3>
                {mascot.role && (
                  <p className="text-xs text-muted mt-0.5">{mascot.role}</p>
                )}
              </div>
              <StatusBadge status={mascot.status} />
            </div>
            <p className="text-[11px] text-muted mt-2">
              {new Date(mascot.created_at).toLocaleDateString()}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
