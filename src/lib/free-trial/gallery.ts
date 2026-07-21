import { createAdminClient } from "@/lib/supabase/admin";

export interface GalleryItem {
  shareSlug: string;
  name: string;
  role: string | null;
  style: string;
  imageUrl: string;
  createdAt: string;
}

export async function getGalleryItems(limit = 12): Promise<GalleryItem[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || !url.startsWith("http")) {
    // Build-time or misconfigured env — render empty gallery.
    return [];
  }

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("free_trial_generations")
    .select("share_slug, name, role, style, image_url, created_at")
    .eq("status", "completed")
    .eq("gallery_opt_in", true)
    .not("image_url", "is", null)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (!data) return [];
  return data.map((r) => ({
    shareSlug: r.share_slug as string,
    name: r.name as string,
    role: (r.role as string | null) ?? null,
    style: r.style as string,
    imageUrl: r.image_url as string,
    createdAt: r.created_at as string,
  }));
}
