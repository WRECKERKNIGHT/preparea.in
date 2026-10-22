import type { Metadata } from "next";
import { Newsreader, Inter, Fraunces, Outfit } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Stars } from "@/components/fx/stars";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

// Modern, clean sans-serif for better readability
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "PrepArea — Study Smarter, Not Harder",
    template: "%s · PrepArea",
  },
  description:
    "The all-in-one study community for JEE, NEET, and board exam aspirants. Track progress, join live rooms, and achieve your dream rank.",
  metadataBase: new URL("https://preparea.in"),
  icons: {
    icon: "/brand-logo.jpg",
    apple: "/brand-logo.jpg",
  },
  openGraph: {
    title: "PrepArea — Study Smarter, Not Harder",
    description: "The all-in-one study community for JEE, NEET, and board exam aspirants.",
    type: "website",
    images: ["/brand-og.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "PrepArea — Study Smarter, Not Harder",
    description: "The all-in-one study community for JEE, NEET, and board exam aspirants.",
    images: ["/brand-og.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${newsreader.variable} ${inter.variable} ${fraunces.variable} ${outfit.variable}`}>
      <body className="min-h-full flex flex-col bg-paper">
        <Stars />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
