import type React from "react";
import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { AccessibilityControls } from "@/components/accessibility-controls";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/providers/query-provider";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title:
    "Kingdom Missions Center International | A Centre of Transformation, Mission, and Hope",
  description:
    "KMCI is dedicated to discipling communities and transforming lives for Christ's service through ministry, missions, and development.",
  keywords: [
    "Kingdom Missions",
    "KMCI",
    "Christian Ministry",
    "Missions",
    "Discipleship",
    "Kenya Church",
    "Kinoo Church",
  ],
  authors: [{ name: "Kingdom Missions Center International" }],
  openGraph: {
    title: "Kingdom Missions Center International",
    description: "A Centre of Transformation, Mission, and Hope",
    type: "website",
    locale: "en_US",
  },
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">
        <QueryProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-gold focus:text-navy focus:rounded-lg focus:shadow-premium"
          >
            Skip to main content
          </a>
          <Suspense fallback={null}>{children}</Suspense>
          <AccessibilityControls />
          {/* Analytics component removed due to import errors */}
          <SonnerToaster position="top-right" richColors closeButton />
        </QueryProvider>
      </body>
    </html>
  );
}
