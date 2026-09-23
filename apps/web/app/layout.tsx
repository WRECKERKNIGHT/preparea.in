import type { Metadata } from "next";
import { Newsreader, Inter } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
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

export const metadata: Metadata = {
  title: {
    default: "PrepArea — Study together. Stay accountable.",
    template: "%s · PrepArea",
  },
  description:
    "A study community for JEE, NEET, CUET and board exam aspirants. Virtual study rooms, daily check-ins, consistency challenges and mentorship.",
  metadataBase: new URL("https://preparea.in"),
  openGraph: {
    title: "PrepArea — Study together. Stay accountable.",
    description:
      "Virtual study rooms, daily check-ins, consistency challenges and practical guidance from experienced aspirants.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${newsreader.variable} ${inter.variable}`}>
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}