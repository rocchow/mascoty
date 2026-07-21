import { getOpenAI } from "@/lib/openai/client";
import { buildCharacterSheetPrompt } from "@/lib/openai/prompts";
import { createAdminClient } from "@/lib/supabase/admin";
import type { MascotParams } from "@/types/mascot";
import { sendGenerationEmail } from "@/lib/email/send-generation";

export async function runFreeTrialGeneration(
  generationId: string,
  shareSlug: string,
  email: string,
  params: MascotParams,
) {
  const supabase = createAdminClient();

  try {
    await supabase
      .from("free_trial_generations")
      .update({ status: "generating" })
      .eq("id", generationId);

    const prompt = buildCharacterSheetPrompt(params);

    // Preview quality: ~$0.016 per generation. HD tier (quality: "high") is
    // ~$0.25 and reserved for the paid upgrade path.
    const response = await getOpenAI().images.generate({
      model: "gpt-image-1",
      prompt,
      n: 1,
      size: "1536x1024",
      quality: "low",
    });

    const imageData = response.data?.[0];
    if (!imageData?.b64_json) {
      throw new Error("No image data returned from OpenAI");
    }

    const buffer = Buffer.from(imageData.b64_json, "base64");
    const storagePath = `free-trial/${generationId}.png`;

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
      .from("free_trial_generations")
      .update({
        status: "completed",
        image_url: urlData.publicUrl,
        image_path: storagePath,
        completed_at: new Date().toISOString(),
      })
      .eq("id", generationId);

    // Fire-and-forget email delivery.
    sendGenerationEmail({
      email,
      shareSlug,
      mascotName: params.name,
      imageUrl: urlData.publicUrl,
    })
      .then(async () => {
        await supabase
          .from("free_trial_generations")
          .update({ email_sent_at: new Date().toISOString() })
          .eq("id", generationId);
      })
      .catch((err) => {
        console.error("[free-trial] email send failed", err);
      });

    return { success: true, imageUrl: urlData.publicUrl };
  } catch (error) {
    console.error("[free-trial] generation failed", error);
    await supabase
      .from("free_trial_generations")
      .update({
        status: "failed",
        error: String(error).slice(0, 500),
      })
      .eq("id", generationId);
    return { success: false, error: String(error) };
  }
}
