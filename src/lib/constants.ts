export const APP_NAME = "Mascoty";
export const APP_DESCRIPTION = "Turn any idea into a complete mascot character sheet in 60 seconds";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const FREE_CREDITS = 3;
export const CREDITS_PER_GENERATION = 1;

export const PRICING_TIERS = [
  {
    name: "Free",
    price: 0,
    credits: 3,
    period: "one-time",
    features: [
      "3 character sheets",
      "High-res PNG download",
      "Commercial license",
    ],
    cta: "Get Started Free",
    highlighted: false,
  },
  {
    name: "Starter",
    price: 19,
    credits: 10,
    period: "month",
    features: [
      "10 character sheets / month",
      "High-res PNG download",
      "Commercial license",
      "Priority generation",
    ],
    cta: "Start Creating",
    highlighted: false,
  },
  {
    name: "Pro",
    price: 49,
    credits: 30,
    period: "month",
    features: [
      "30 character sheets / month",
      "High-res PNG download",
      "Commercial license",
      "Priority generation",
      "Mascot video clips (Seedance 2.0)",
      "Style locking (coming soon)",
      "SVG export (coming soon)",
    ],
    cta: "Go Pro",
    highlighted: true,
  },
  {
    name: "Credit Pack",
    price: 5,
    credits: 3,
    period: "one-time",
    features: [
      "3 character sheets",
      "High-res PNG download",
      "Commercial license",
      "No subscription required",
    ],
    cta: "Buy Credits",
    highlighted: false,
  },
] as const;

export const CREDIT_PACK = {
  credits: 3,
  price: 5,
} as const;
