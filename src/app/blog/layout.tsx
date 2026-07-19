import Link from "next/link";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-full">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="text-xl font-bold tracking-tight">
            <span className="text-accent">Mascoty</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/blog" className="text-muted hover:text-foreground transition">
              Blog
            </Link>
            <Link
              href="/auth/signup"
              className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-hover"
            >
              Get Started Free
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 text-center">
          <div className="text-xs text-muted">
            &copy; 2026 Mascoty. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
