import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/client";
import { addCredits } from "@/lib/credits";
import { createAdminClient } from "@/lib/supabase/admin";
import { CREDIT_PACK } from "@/lib/constants";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createAdminClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const userId = session.metadata?.supabase_user_id;
      if (!userId) break;

      if (session.mode === "payment") {
        await addCredits(
          userId,
          CREDIT_PACK.credits,
          "purchase",
          session.payment_intent as string
        );
      } else if (session.mode === "subscription") {
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );
        const priceId = subscription.items.data[0]?.price.id;

        const tier = priceId === process.env.STRIPE_PRO_PRICE_ID ? "pro" : "starter";
        const credits = tier === "pro" ? 30 : 10;

        await supabase
          .from("profiles")
          .update({
            subscription_status: "active",
            subscription_tier: tier,
          })
          .eq("id", userId);

        await addCredits(userId, credits, "subscription_renewal", session.subscription as string);
      }
      break;
    }

    case "invoice.paid": {
      const invoice = event.data.object as { subscription?: string; customer: string; billing_reason?: string };
      if (!invoice.subscription) break;

      const subscription = await stripe.subscriptions.retrieve(
        invoice.subscription
      );
      const customerId = invoice.customer;

      const { data: profile } = await supabase
        .from("profiles")
        .select("id, subscription_tier")
        .eq("stripe_customer_id", customerId)
        .single();

      if (profile && invoice.billing_reason === "subscription_cycle") {
        const credits = profile.subscription_tier === "pro" ? 30 : 10;
        await addCredits(profile.id, credits, "subscription_renewal", subscription.id);
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      const customerId = subscription.customer as string;

      await supabase
        .from("profiles")
        .update({
          subscription_status: "canceled",
          subscription_tier: null,
        })
        .eq("stripe_customer_id", customerId);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
