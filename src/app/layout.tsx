import type { Metadata } from "next";
import { Outfit, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import PageLoader from "@/components/effects/PageLoader";
import PageTransition from "@/components/effects/PageTransition";
import Toasts from "@/components/ui/Toasts";

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

export const metadata: Metadata = {
  // Without this, Next cannot resolve Open Graph / Twitter image URLs to
  // absolute ones and warns on every build.
  metadataBase: new URL("https://kavishkadeshan.me"),
  // Tells search engines which URL is authoritative, so ?utm= and similar
  // variants do not get indexed as separate pages.
  alternates: { canonical: "/" },
  title: "Kavishka Deshan | Fullstack Developer",
  description:
    "Fullstack developer building mobile and web applications end to end, from database design and API integration through to the user interface.",
  keywords: [
    "Fullstack Developer",
    "Flutter",
    "React",
    "Next.js",
    "Firebase",
    "Supabase",
    "Node.js",
  ],
  authors: [{ name: "Kavishka Deshan" }],
  openGraph: {
    title: "Kavishka Deshan | Fullstack Developer",
    description:
      "Fullstack developer building mobile and web applications end to end, from database design and API integration through to the user interface.",
    type: "website",
    url: "https://kavishkadeshan.me",
    siteName: "Kavishka Deshan",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Kavishka Deshan — Fullstack Developer",
      },
    ],
  },
  // LinkedIn, WhatsApp and Slack read Open Graph; X/Twitter needs its own card.
  twitter: {
    card: "summary_large_image",
    title: "Kavishka Deshan | Fullstack Developer",
    description:
      "Fullstack developer building mobile and web applications end to end.",
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
        <ThemeProvider>
          <PageLoader />
          <PageTransition>{children}</PageTransition>
          <Toasts />
        </ThemeProvider>
      </body>
    </html>
  );
}
