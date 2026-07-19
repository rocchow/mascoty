import { createAdminClient } from "./supabase/admin";

export async function deductCredit(userId: string, referenceId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("deduct_credit", {
    p_user_id: userId,
    p_reference_id: referenceId,
  });

  if (error) throw error;
  return data as boolean;
}

export async function addCredits(
  userId: string,
  amount: number,
  reason: string,
  referenceId?: string
) {
  const supabase = createAdminClient();

  const { error: txError } = await supabase
    .from("credit_transactions")
    .insert({
      user_id: userId,
      amount,
      reason,
      reference_id: referenceId,
    });

  if (txError) throw txError;

  const { error: profileError } = await supabase.rpc("add_credits", {
    p_user_id: userId,
    p_amount: amount,
  });

  if (profileError) throw profileError;
}

export async function getCreditsBalance(userId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("credits_balance")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data.credits_balance;
}
