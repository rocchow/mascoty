import Link from "next/link";
import { PLEDGE_AMOUNT_LABEL, PLEDGE_CREDIT_LABEL } from "@/lib/pledge";

export const metadata = {
  title: "Thanks for backing Mascoty",
};

export default function PledgeSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">
        <div className="text-5xl mb-4">&#x1F64C;</div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          You&apos;re officially backing us.
        </h1>
        <p className="mt-4 text-sm text-muted leading-relaxed">
          Your <span className="font-semibold text-foreground">{PLEDGE_AMOUNT_LABEL}</span> is
          safe with Stripe and we&apos;ve locked in{" "}
          <span className="font-semibold text-foreground">
            {PLEDGE_CREDIT_LABEL} of launch credit
          </span>{" "}
          for you. When Mascoty opens, it&apos;s waiting in your account.
        </p>
        <p className="mt-3 text-xs text-muted">
          Stripe just emailed you a receipt. We&apos;ll email you the moment
          early access opens.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="inline-block rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
