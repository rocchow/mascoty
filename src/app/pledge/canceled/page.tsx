import Link from "next/link";

export const metadata = {
  title: "Pledge canceled",
};

export default function PledgeCanceled() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">
        <h1 className="text-2xl font-bold tracking-tight">Nothing charged.</h1>
        <p className="mt-3 text-sm text-muted">
          You closed the checkout before completing the pledge. All good — come
          back whenever you&apos;re ready.
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
