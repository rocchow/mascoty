import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { fingerprintRequest } from "@/lib/free-trial/ip";

// Read-only view of "how much free trial is left right now" for this visitor.
// Powers the Generate button label — "N left this hour · resets in Xm".
export async function GET(request: Request) {
  const supabase = createAdminClient();
  const ipHash = fingerprintRequest(request);

  const { data, error } = await supabase.rpc("get_free_trial_quota", {
    p_ip_hash: ipHash,
  });

  if (error) {
    console.error("[free-trial] quota lookup failed", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }

  const q = data as {
    remaining_hourly: number | null;
    next_slot_at: string | null;
    ip_used_today: boolean | null;
    ip_resets_at: string | null;
  } | null;

  return NextResponse.json(
    {
      remainingHourly: q?.remaining_hourly ?? 10,
      nextSlotAt: q?.next_slot_at ?? null,
      ipUsedToday: q?.ip_used_today ?? false,
      ipResetsAt: q?.ip_resets_at ?? null,
    },
    {
      headers: { "cache-control": "no-store" },
    },
  );
}
