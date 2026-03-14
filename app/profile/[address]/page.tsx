"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ProfilePage() {
  const params = useParams();
  const address = params?.address as string;
  const [darkMode, setDarkMode] = useState(false);

  const colors = darkMode 
    ? { bg: "#0a0a0a", bgSecondary: "#1a1a1a", text: "#fff", textMuted: "#888", accent: "#ff6b35", border: "#333" }
    : { bg: "#fff", bgSecondary: "#f5f5f5", text: "#1a1a2e", textMuted: "#666", accent: "#ff6b35", border: "#e5e5e5" };

  // For demo, show mock data based on address
  // In production, this would fetch from a database
  const mockResult = {
    profile: {
      label: "Yield Explorer",
      evidence: "14 txns · 3 protocols · 47-day max hold",
    },
    blended_apy: { total: 7.8 },
    strategies: [
      { protocol: "mETH", action: "Stake", allocation_pct: 50, live_apy: 4.2, fit_score: 8, why: "You've held mETH for 47 days" },
      { protocol: "Aave", action: "Supply", allocation_pct: 30, live_apy: 8.1, fit_score: 7, why: "Your USDT is already here" },
      { protocol: "Merchant Moe", action: "LP", allocation_pct: 20, live_apy: 16.5, fit_score: 5, why: "Small allocation to start" },
    ],
    confidence: { level: "high" as const, reason: "Based on 14 transactions" },
    risks: [
      { risk: "Health Factor", evidence: "Aave health factor is 1.8" },
      { risk: "LP History", evidence: "You've exited LP positions early" },
      { risk: "Concentration", evidence: "60% ETH-correlated" },
    ]
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.bg, color: colors.text }}>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b" style={{ backgroundColor: colors.bg, borderColor: colors.border }}>
        <div className="max-w-xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded flex items-center justify-center font-bold text-white text-sm" style={{ backgroundColor: colors.text }}>MY</div>
            <span className="font-medium" style={{ fontFamily: 'DM Sans, sans-serif' }}>Mantle Yield</span>
          </Link>
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded">{darkMode ? '☀' : '☾'}</button>
        </div>
      </nav>

      <main className="pt-28 pb-16 px-6">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <p className="text-xs mb-2" style={{ color: colors.textMuted, fontFamily: 'Varela Round, sans-serif' }}>Shared Profile</p>
            <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>{mockResult.profile.label}</h1>
            <p className="text-sm" style={{ color: colors.accent, fontFamily: 'DM Sans, sans-serif' }}>{mockResult.profile.evidence}</p>
          </div>

          {/* APY */}
          <div 
            className="p-6 rounded-xl text-center mb-4"
            style={{ backgroundColor: colors.accent, color: '#fff' }}
          >
            <p className="text-xs opacity-80 mb-1" style={{ fontFamily: 'Varela Round, sans-serif' }}>Blended APY</p>
            <p className="text-5xl font-bold" style={{ fontFamily: 'DM Sans, sans-serif' }}>{mockResult.blended_apy.total}%</p>
          </div>

          {/* Wallet */}
          <div className="text-center mb-6">
            <p className="text-xs" style={{ color: colors.textMuted, fontFamily: 'Varela Round, sans-serif' }}>Wallet</p>
            <p className="font-mono text-sm" style={{ fontFamily: 'DM Sans, sans-serif' }}>{address?.slice(0, 6)}...{address?.slice(-4)}</p>
          </div>

          {/* CTA */}
          <Link 
            href="/analyze"
            className="block w-full py-3 rounded-lg text-center font-medium"
            style={{ backgroundColor: colors.accent, color: '#fff', fontFamily: 'DM Sans, sans-serif' }}
          >
            Analyze Your Wallet →
          </Link>

          <p className="text-center text-xs mt-4" style={{ color: colors.textMuted, fontFamily: 'Varela Round, sans-serif' }}>
            Built with Mantle Yield AI
          </p>
        </div>
      </main>
    </div>
  );
}
