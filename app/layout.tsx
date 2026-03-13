import type { Metadata } from "next";
import { Outfit, Space_Grotesk } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: "--font-outfit",
});

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: "--font-space",
});

export const metadata: Metadata = {
  title: "Mantle Yield Advisor - AI Yield Intelligence for Mantle Network",
  description: "The AI layer for smarter yield decisions on Mantle. Analyze vaults, liquidity, and transaction flows to find sustainable yield.",
  keywords: ["Mantle", "DeFi", "Yield", "AI", "Crypto", "Staking", "Ethereum", "Aave"],
  openGraph: {
    title: "Mantle Yield Advisor",
    description: "The AI layer for smarter yield decisions on Mantle",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen bg-[#0a0a0a] text-white antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
