import { getOpenAI } from "./client";
import { buildCharacterSheetPrompt } from "./prompts";
import { createAdminClient } from "../supabase/admin";
import { MascotParams } from "@/types/mascot";

export async function generateMascot(
  params: MascotParams,
  userId: string,
  mascotId: string
) {
  const supabase = createAdminClient();

  try {
    await supabase
      .from("mascots")
      .update({ status: "generating" })
      .eq("id", mascotId);

    const prompt = buildCharacterSheetPrompt(params);

    const response = await getOpenAI().images.generate({
      model: "gpt-image-1",
      prompt,
      n: 1,
      size: "1536x1024",
      quality: "high",
    });

    const imageData = response.data?.[0];
    if (!imageData?.b64_json) {
      throw new Error("No image data returned from OpenAI");
    }

    const buffer = Buffer.from(imageData.b64_json, "base64");
    const storagePath = `mascots/${userId}/${mascotId}.png`;

    const { error: uploadError } = await supabase.storage
      .from("mascot-sheets")
      .upload(storagePath, buffer, {
        contentType: "image/png",
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
      .from("mascot-sheets")
      .getPublicUrl(storagePath);

    await supabase
      .from("mascots")
      .update({
        status: "completed",
        image_url: urlData.publicUrl,
        image_path: storagePath,
      })
      .eq("id", mascotId);

    return { success: true, imageUrl: urlData.publicUrl };
  } catch (error) {
    console.error("Generation failed:", error);

    await supabase
      .from("mascots")
      .update({ status: "failed" })
      .eq("id", mascotId);

    // Refund the credit
    await supabase.rpc("refund_credit", {
      p_user_id: userId,
      p_reference_id: mascotId,
    });

    return { success: false, error: String(error) };
  }
}
