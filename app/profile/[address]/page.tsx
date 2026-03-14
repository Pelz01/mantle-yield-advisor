"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ProfilePage() {
  const params = useParams();
  const address = params?.address as string;
  const [darkMode, setDarkMode] = useState(false);

  const colors = darkMode 
    ? { bg: "#0a0a0a", bgSecondary: "#1a1a1a", text: "#fff", textMuted: "#888", accent: "#ff6b35", border: "#333" }
    : { bg: "#fff", bgSecondary: "#f5f5f5", text: "#1a1a2e", textMuted: "#666", accent: "#ff6b35", border: "#e5e5e5" };

  const mockResult = {
    profile: {
      label: "Yield Explorer",
      evidence: "14 txns · 3 protocols · 47-day max hold",
      description: "You've exited LP positions early twice — suggests you value simplicity over max yield."
    },
    blended_apy: { total: 7.8 },
    strategies: [
      { protocol: "mETH", action: "Stake", allocation_pct: 50, fit_score: 8 },
      { protocol: "Aave", action: "Supply", allocation_pct: 30, fit_score: 7 },
      { protocol: "Merchant Moe", action: "LP", allocation_pct: 20, fit_score: 5 },
    ],
    confidence: { level: "high" as const, reason: "Based on 14 transactions" },
    risks: [
      { risk: "Health Factor", evidence: "Aave health factor is 1.8" },
      { risk: "LP History", evidence: "You've exited LP positions early" },
      { risk: "Concentration", evidence: "60% ETH-correlated" },
    ]
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.bg, color: colors.text, overflowY: 'auto' }}>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b" style={{ backgroundColor: colors.bg, borderColor: colors.border }}>
        <div className="max-w-xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded flex items-center justify-center font-bold text-white text-sm" style={{ backgroundColor: colors.text }}>MY</div>
            <span className="font-medium" style={{ fontFamily: 'DM Sans, sans-serif' }}>Mantle Yield</span>
          </Link>
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded">{darkMode ? '☀' : '☾'}</button>
        </div>
      </nav>

      <main className="pt-28 pb-12 px-6">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <p className="text-xs mb-2" style={{ color: colors.textMuted }}>Shared Profile</p>
            <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'DM Sans, sans-serif', color: colors.text }}>
              {mockResult.profile.label}
            </h1>
            <p className="text-sm" style={{ color: colors.accent }}>{mockResult.profile.evidence}</p>
          </div>

          {/* APY */}
          <div className="p-6 rounded-xl text-center mb-6" style={{ backgroundColor: colors.accent, color: '#fff' }}>
            <p className="text-xs opacity-80 mb-1">Blended APY</p>
            <p className="text-5xl font-bold">{mockResult.blended_apy.total}%</p>
          </div>

          {/* Strategy Bars */}
          <div className="p-5 rounded-xl mb-6" style={{ backgroundColor: colors.bgSecondary }}>
            <p className="text-xs mb-4" style={{ color: colors.textMuted }}>Strategy</p>
            <div className="space-y-3">
              {mockResult.strategies.map((rec, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">{rec.protocol}</span>
                    <span className="text-sm font-bold" style={{ color: colors.accent }}>{rec.allocation_pct}%</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ backgroundColor: colors.border }}>
                    <div className="h-full rounded-full" style={{ width: `${rec.allocation_pct}%`, backgroundColor: colors.accent }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Profile description */}
          <div className="text-center mb-6">
            <p className="text-sm italic" style={{ color: colors.textMuted }}>
              "{mockResult.profile.description}"
            </p>
          </div>

          {/* Wallet */}
          <div className="text-center mb-6">
            <p className="text-xs" style={{ color: colors.textMuted }}>Wallet</p>
            <p className="font-mono text-sm">{address?.slice(0, 6)}...{address?.slice(-4)}</p>
          </div>

          {/* What's your personality teaser */}
          <div className="p-5 rounded-xl mb-6" style={{ backgroundColor: colors.bgSecondary }}>
            <p className="text-center text-lg font-medium mb-4" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              What's your DeFi personality?
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {['Yield Explorer', 'Conservative Staker', 'Active Rotator', 'LP Optimizer', 'Yield Newbie'].map((type, i) => (
                <span 
                  key={i} 
                  className="px-2 py-1 rounded text-xs"
                  style={{ 
                    backgroundColor: i === 0 ? colors.accent : colors.bg,
                    color: i === 0 ? '#fff' : colors.textMuted,
                  }}
                >
                  {type}
                </span>
              ))}
            </div>
            <Link href="/analyze" className="block w-full py-3 rounded-lg text-center font-medium" style={{ backgroundColor: colors.accent, color: '#fff' }}>
              Find out in 10 seconds →
            </Link>
          </div>

          {/* CTA */}
          <Link href="/analyze" className="block w-full py-3 rounded-lg text-center font-medium" style={{ backgroundColor: colors.text, color: colors.bg }}>
            Analyze Your Wallet →
          </Link>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs" style={{ color: colors.textMuted }}>Powered by Mantle Network</p>
          </div>
        </div>
      </main>
    </div>
  );
}
