import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  if (!/^[a-z0-9]{6,20}$/i.test(slug)) {
    return NextResponse.json({ error: "invalid_slug" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("free_trial_generations")
    .select("status, image_url")
    .eq("share_slug", slug.toLowerCase())
    .maybeSingle();

  if (!data) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({
    status: data.status,
    imageUrl: data.image_url,
  });
}
