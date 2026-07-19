export interface MascotColor {
  name: string;
  hex: string;
}

export interface MascotParams {
  name: string;
  role: string;
  personality: string;
  species: string;
  description: string;
  style: MascotStyle;
  colors: MascotColor[];
}

export type MascotStyle =
  | "3d-pixar"
  | "flat-vector"
  | "anime"
  | "watercolor"
  | "pixel-art"
  | "clay-3d"
  | "sticker"
  | "minimalist";

export const MASCOT_STYLES: { value: MascotStyle; label: string; description: string }[] = [
  { value: "3d-pixar", label: "3D Cartoon", description: "Soft, rounded Pixar-style with smooth shading" },
  { value: "flat-vector", label: "Flat Vector", description: "Clean geometric shapes, bold colors" },
  { value: "anime", label: "Anime", description: "Japanese animation style with expressive features" },
  { value: "watercolor", label: "Watercolor", description: "Soft, painterly look with gentle textures" },
  { value: "pixel-art", label: "Pixel Art", description: "Retro 8-bit style with chunky pixels" },
  { value: "clay-3d", label: "Clay / Vinyl", description: "Matte clay toy or vinyl figure aesthetic" },
  { value: "sticker", label: "Sticker", description: "Cute sticker-style with thick outlines" },
  { value: "minimalist", label: "Minimalist", description: "Simple lines and shapes, logomark-ready" },
];

export type MascotStatus = "pending" | "generating" | "completed" | "failed";

export interface Mascot {
  id: string;
  user_id: string;
  name: string;
  role: string | null;
  personality: string | null;
  style: string;
  colors: MascotColor[] | null;
  description: string | null;
  image_url: string | null;
  image_path: string | null;
  thumbnail_url: string | null;
  generation_params: MascotParams | null;
  status: MascotStatus;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  credits_balance: number;
  stripe_customer_id: string | null;
  subscription_status: string;
  subscription_tier: string | null;
  created_at: string;
  updated_at: string;
}
