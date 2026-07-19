import { MascotParams } from "@/types/mascot";

const STYLE_MAP: Record<string, string> = {
  "3d-pixar": "Soft, rounded 3D Pixar/Disney-style with smooth shading and gentle lighting",
  "flat-vector": "Clean flat vector illustration with bold geometric shapes and solid colors",
  "anime": "Japanese anime/manga style with expressive features and dynamic poses",
  "watercolor": "Soft watercolor illustration with gentle textures and organic edges",
  "pixel-art": "Retro pixel art / 8-bit style with chunky pixels and limited palette",
  "clay-3d": "Matte clay/vinyl toy figure with soft rounded forms and subtle shadows",
  "sticker": "Cute sticker style with thick dark outlines and vibrant fills",
  "minimalist": "Minimal line art / geometric logomark style with clean simple shapes",
};

export function buildCharacterSheetPrompt(params: MascotParams): string {
  const style = STYLE_MAP[params.style] || params.style;
  const colorList = params.colors
    .map((c) => `${c.name}: ${c.hex}`)
    .join(", ");

  return `Create a professional character design reference sheet for a brand mascot.

CHARACTER DETAILS:
- Name: ${params.name}
- Role: ${params.role}
- Personality: ${params.personality}
- Species/Form: ${params.species}
- Description: ${params.description}

VISUAL STYLE: ${style}
COLOR PALETTE: ${colorList}

The character sheet MUST include ALL of these sections, clearly labeled with section headers, arranged in an organized grid layout on a clean white background:

1. TOP: "TURNAROUND" — Show the full character from 5 angles in a horizontal row: FRONT, 3/4 FRONT, SIDE, 3/4 BACK, BACK. Each angle labeled below.

2. TOP-RIGHT: Character info card showing Name, Role, Personality, and a "COLOR PALETTE" section with colored circles and their hex codes.

3. MIDDLE-LEFT: "EXPRESSIONS" — Show 5 head/face close-ups in a row: HAPPY, EXCITED, WINK, THUMBS UP, SURPRISED. Each labeled.

4. MIDDLE-RIGHT: "POSES" — Show 3-4 full-body action poses relevant to the character's role.

5. BOTTOM-LEFT: "STYLING NOTES" — 3-4 bullet points about the character's visual design rules.

6. BOTTOM-CENTER: "USAGE EXAMPLES" — Small thumbnails showing the character as: APP ICON, AD/PROMO, STICKER. Each labeled.

7. BOTTOM-RIGHT: "SIZE REFERENCE" — The character standing next to a human silhouette with height markers (60cm, 90cm, 120cm).

8. RIGHT SIDE: "DETAILS" — Close-up callouts of 2-3 distinctive design elements (eyes, logo/emblem, costume detail).

LAYOUT RULES:
- Clean white background
- Professional typography for all labels and headers
- The character name and tagline at the top-left as a logo
- Organized grid sections with clear visual hierarchy
- This should look like a production-ready character design sheet used by professional illustrators and brand teams`;
}
