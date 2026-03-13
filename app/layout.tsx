import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mantle Yield - AI Yield Intelligence",
  description: "AI-powered yield advisor for Mantle Network",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
