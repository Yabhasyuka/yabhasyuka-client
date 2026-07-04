import type { Metadata } from "next";
import { Marcellus, Figtree } from "next/font/google";
import "./globals.css";

const marcellus = Marcellus({
  variable: "--font-marcellus",
  weight: "400",
  subsets: ["latin"],
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yabhasyuka — Elevated Beauty Wellness Spa · Bali",
  description:
    "An elevated beauty wellness spa in Denpasar, Bali. Deep relaxation, sculpting rituals for face, head and body, and refined aesthetic care.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${marcellus.variable} ${figtree.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
