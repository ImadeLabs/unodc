import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Urban Risk Intelligence Dashboard – Nigeria",
  description:
    "Data-driven dashboard for urban risk assessment, policy intelligence, and socio-economic analysis.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body
        style={{
          margin: 0,
          backgroundColor: "#0b1220",
          color: "#ffffff",
          fontFamily: "var(--font-geist-sans), Arial, sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  );
}