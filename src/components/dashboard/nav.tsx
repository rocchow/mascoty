"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

const links = [
  { href: "/dashboard", label: "My Mascots" },
  { href: "/dashboard/create", label: "Create New" },
  { href: "/dashboard/credits", label: "Credits" },
  { href: "/dashboard/settings", label: "Settings" },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={clsx(
            "block rounded-lg px-3 py-2 text-sm font-medium transition",
            pathname === link.href
              ? "bg-accent-light text-accent"
              : "text-muted hover:bg-accent-light hover:text-foreground"
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
