import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MantleYield IQ - AI Yield Advisor",
  description: "AI-powered yield advisor for Mantle Network",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white">
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,195,245,0.1)_0%,_transparent_50%)]" />
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}
