import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: "--font-space",
});

export const metadata: Metadata = {
  title: "MantleYield IQ - AI Yield Advisor for Mantle Network",
  description: "AI-powered yield advisor that reads your on-chain history and provides personalized yield strategies across mETH, cmETH, Aave V3, and more.",
  keywords: ["Mantle", "DeFi", "Yield", "AI", "Crypto", "Staking", "Ethereum"],
  openGraph: {
    title: "MantleYield IQ - AI Yield Advisor",
    description: "Get personalized yield strategies for Mantle Network",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen bg-black text-white antialiased">
        {children}
      </body>
    </html>
  );
}
