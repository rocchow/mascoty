import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe/client";
import { PLEDGE_AMOUNT_CENTS, PLEDGE_CREDIT_CENTS } from "@/lib/pledge";

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "stripe_not_configured" }, { status: 500 });
  }

  const origin =
    process.env.NEXT_PUBLIC_APP_URL ??
    request.headers.get("origin") ??
    new URL(request.url).origin;

  let intent: string | null = null;
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const body = (await request.json().catch(() => ({}))) as { intent?: unknown };
    if (typeof body.intent === "string" && body.intent.trim().length > 0) {
      intent = body.intent.trim().slice(0, 500);
    }
  } else if (contentType.includes("form")) {
    const form = await request.formData().catch(() => null);
    const raw = form?.get("intent");
    if (typeof raw === "string" && raw.trim().length > 0) {
      intent = raw.trim().slice(0, 500);
    }
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: PLEDGE_AMOUNT_CENTS,
          product_data: {
            name: "Mascoty Launch Credit",
            description: `Backs early development. Converts to $${(PLEDGE_CREDIT_CENTS / 100).toFixed(0)} of credit when Mascoty launches.`,
          },
        },
        quantity: 1,
      },
    ],
    submit_type: "pay",
    billing_address_collection: "auto",
    allow_promotion_codes: false,
    metadata: {
      kind: "pledge",
      intent: intent ?? "",
    },
    payment_intent_data: {
      metadata: {
        kind: "pledge",
        intent: intent ?? "",
      },
    },
    success_url: `${origin}/pledge/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/pledge/canceled`,
  });

  if (!session.url) {
    return NextResponse.json({ error: "no_session_url" }, { status: 500 });
  }

  return NextResponse.redirect(session.url, 303);
}
