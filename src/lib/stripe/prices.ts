export const STRIPE_PRICES = {
  starter: process.env.STRIPE_STARTER_PRICE_ID || "",
  pro: process.env.STRIPE_PRO_PRICE_ID || "",
  credit_pack: process.env.STRIPE_CREDIT_PACK_PRICE_ID || "",
} as const;
