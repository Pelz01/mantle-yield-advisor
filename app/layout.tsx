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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Varela+Round&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
