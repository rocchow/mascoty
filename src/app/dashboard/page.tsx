import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { MascotGrid } from "@/components/dashboard/mascot-grid";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: mascots } = await supabase
    .from("mascots")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Mascots</h1>
          <p className="text-sm text-muted mt-1">
            Your generated character sheets
          </p>
        </div>
        <Link
          href="/dashboard/create"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-hover"
        >
          + Create New
        </Link>
      </div>

      {mascots && mascots.length > 0 ? (
        <MascotGrid mascots={mascots} />
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border py-20 text-center">
          <div className="text-4xl mb-4">&#x1F43C;</div>
          <h2 className="text-lg font-semibold">No mascots yet</h2>
          <p className="text-sm text-muted mt-1 max-w-xs">
            Create your first AI-powered mascot character sheet in under a
            minute.
          </p>
          <Link
            href="/dashboard/create"
            className="mt-4 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-hover"
          >
            Create Your First Mascot
          </Link>
        </div>
      )}
    </div>
  );
}
