import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardNav } from "@/components/dashboard/nav";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("credits_balance, full_name, email")
    .eq("id", user.id)
    .single();

  return (
    <div className="flex min-h-full">
      <aside className="hidden md:flex w-60 flex-col border-r border-border bg-card px-4 py-6">
        <Link href="/" className="text-xl font-bold tracking-tight mb-8">
          <span className="text-accent">Mascoty</span>
        </Link>

        <DashboardNav />

        <div className="mt-auto pt-6 border-t border-border">
          <div className="text-xs text-muted truncate">
            {profile?.full_name || profile?.email || user.email}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold">
            <span className="inline-block h-2 w-2 rounded-full bg-accent" />
            {profile?.credits_balance ?? 0} credits
          </div>
        </div>
      </aside>

      <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
    </div>
  );
}
