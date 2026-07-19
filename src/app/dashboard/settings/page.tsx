"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setEmail(user.email || "");

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

      setName(profile?.full_name || "");
    }
    load();
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold tracking-tight mb-1">Settings</h1>
      <p className="text-sm text-muted mb-8">Manage your account</p>

      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              value={name}
              disabled
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm opacity-60"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              value={email}
              disabled
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm opacity-60"
            />
          </div>
        </div>

        <div className="rounded-xl border border-danger/30 bg-card p-5">
          <h3 className="text-sm font-semibold mb-2">Sign out</h3>
          <p className="text-xs text-muted mb-3">
            You can always sign back in with the same account.
          </p>
          <button
            onClick={handleSignOut}
            className="rounded-lg border border-danger/30 px-4 py-2 text-sm font-medium text-danger transition hover:bg-red-50 dark:hover:bg-red-950"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
