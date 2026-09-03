import type { Metadata } from "next";
import { Outfit, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import PageLoader from "@/components/effects/PageLoader";
import PageTransition from "@/components/effects/PageTransition";
import Toasts from "@/components/ui/Toasts";
import StructuredData from "./StructuredData";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-logo",
  subsets: ["latin"],
  weight: ["700"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const SITE_URL = "https://kavishkadeshan.dev";
const FULL_NAME = "Kavishka Deshan";
const ROLE = "Software Engineering Undergraduate & Developer";
const DESCRIPTION =
  "Kavishka Deshan is a Software Engineering undergraduate at NIBM, Sri Lanka, and a fullstack developer " +
  "building mobile and web applications end to end with React, Next.js, TypeScript, Flutter, Node.js, " +
  "Firebase and Supabase.";

export const metadata: Metadata = {
  // Without this, Next cannot resolve Open Graph / Twitter image URLs to
  // absolute ones and warns on every build.
  metadataBase: new URL(SITE_URL),
  // Tells search engines which URL is authoritative, so ?utm= and similar
  // variants do not get indexed as separate pages. Written absolute with the
  // trailing slash so it matches the sitemap <loc> and the URL actually served.
  alternates: { canonical: `${SITE_URL}/` },
  title: `${FULL_NAME} | ${ROLE}`,
  description: DESCRIPTION,
  applicationName: `${FULL_NAME} — Portfolio`,
  authors: [{ name: FULL_NAME, url: SITE_URL }],
  creator: FULL_NAME,
  publisher: FULL_NAME,
  keywords: [
    "Kavishka Deshan",
    "Kavishka Deshan portfolio",
    "Software Engineering Undergraduate",
    "Fullstack Developer Sri Lanka",
    "NIBM Sri Lanka",
    "React",
    "Next.js",
    "TypeScript",
    "Flutter",
    "Firebase",
  ],
  // Explicit so there is never any doubt the page is indexable.
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: `${FULL_NAME} | ${ROLE}`,
    description: DESCRIPTION,
    type: "profile",
    firstName: "Kavishka",
    lastName: "Deshan",
    url: SITE_URL,
    siteName: `${FULL_NAME} — Portfolio`,
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${FULL_NAME} — ${ROLE}`,
      },
    ],
  },
  // LinkedIn, WhatsApp and Slack read Open Graph; X/Twitter needs its own card.
  twitter: {
    card: "summary_large_image",
    title: `${FULL_NAME} | ${ROLE}`,
    description: DESCRIPTION,
    images: ["/og-image.png"],
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/*
        suppressHydrationWarning does NOT cascade to descendants -- it only
        covers the element it sits on. Browser extensions (a Bitdefender one,
        id eppiocemhmnlbhjplcgkofciie..., in this case) stamp attributes such as
        bis_register and __processed_<uuid>__ onto <body> before React
        hydrates, so <body> needs its own.
      */}
      <body
        suppressHydrationWarning
        className={`${outfit.variable} ${jetbrains.variable} ${spaceGrotesk.variable} font-sans bg-bg text-text antialiased`}
      >
        <StructuredData />
        <ThemeProvider>
          <PageLoader />
          <PageTransition>{children}</PageTransition>
          <Toasts />
        </ThemeProvider>
      </body>
    </html>
  );
}
