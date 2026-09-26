import type { Metadata } from "next";
import { Newsreader, Inter, Fraunces } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Stars } from "@/components/fx/stars";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
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

export const metadata: Metadata = {
  title: {
    default: "PrepArea — Study together. Stay accountable.",
    template: "%s · PrepArea",
  },
  description:
    "A study community for JEE, NEET, CUET and board exam aspirants. Virtual study rooms, daily check-ins, consistency challenges and mentorship.",
  metadataBase: new URL("https://preparea.in"),
  icons: {
    icon: "/brand-logo.jpg",
    apple: "/brand-logo.jpg",
  },
  openGraph: {
    title: "PrepArea — Study together. Stay accountable.",
    description:
      "Virtual study rooms, daily check-ins, consistency challenges and practical guidance from experienced aspirants.",
    type: "website",
    images: ["/brand-og.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "PrepArea — Study together. Stay accountable.",
    description:
      "Virtual study rooms, daily check-ins, consistency challenges and practical guidance from experienced aspirants.",
    images: ["/brand-og.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${newsreader.variable} ${inter.variable} ${fraunces.variable}`}>
      <body className="min-h-full flex flex-col pt-16">
        <Stars />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}