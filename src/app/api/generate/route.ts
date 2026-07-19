import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { deductCredit } from "@/lib/credits";
import { generateMascot } from "@/lib/openai/generate-mascot";
import { MascotParams } from "@/types/mascot";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params: MascotParams = await request.json();

  if (!params.name || !params.style || !params.species) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // Create mascot record first
  const { data: mascot, error: insertError } = await supabase
    .from("mascots")
    .insert({
      user_id: user.id,
      name: params.name,
      role: params.role,
      personality: params.personality,
      style: params.style,
      colors: params.colors,
      description: params.description,
      generation_params: params,
      status: "pending",
    })
    .select("id")
    .single();

  if (insertError || !mascot) {
    return NextResponse.json(
      { error: "Failed to create mascot record" },
      { status: 500 }
    );
  }

  // Deduct credit
  const credited = await deductCredit(user.id, mascot.id);
  if (!credited) {
    await supabase.from("mascots").delete().eq("id", mascot.id);
    return NextResponse.json(
      { error: "Insufficient credits" },
      { status: 402 }
    );
  }

  // Fire off generation in the background (don't await)
  generateMascot(params, user.id, mascot.id).catch(console.error);

  return NextResponse.json({ mascotId: mascot.id });
}
