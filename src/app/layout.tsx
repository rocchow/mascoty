import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mascoty.ai"),
  title: "Mascoty — AI Mascot Character Sheet Generator",
  description:
    "Turn any idea into a complete mascot character sheet in 60 seconds. Turnaround views, expressions, poses, color palette — all in one image.",
  openGraph: {
    title: "Mascoty — AI Mascot Character Sheet Generator",
    description:
      "Turn any idea into a complete mascot character sheet in 60 seconds.",
    url: "https://mascoty.ai",
    siteName: "Mascoty",
    type: "website",
    images: [
      {
        url: "/mascoty_website_preview.png",
        width: 1536,
        height: 1024,
        alt: "Mascoty — waving purple mascot in front of the app dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mascoty — AI Mascot Character Sheet Generator",
    description:
      "Turn any idea into a complete mascot character sheet in 60 seconds.",
    images: ["/mascoty_website_preview.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
      <GoogleAnalytics gaId="G-T824YXSRKD" />
    </html>
  );
}
