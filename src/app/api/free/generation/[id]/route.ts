import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!/^[0-9a-f-]{20,}$/i.test(id)) {
    return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("free_trial_generations")
    .select("id, share_slug, status, image_url, name, style, created_at")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({
    id: data.id,
    shareSlug: data.share_slug,
    status: data.status,
    imageUrl: data.image_url,
    name: data.name,
    style: data.style,
    createdAt: data.created_at,
  });
}
