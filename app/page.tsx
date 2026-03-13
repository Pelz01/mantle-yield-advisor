"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);

  const features = [
    { title: "Vault Intelligence", desc: "Monitor deposits, withdrawals, TVL changes" },
    { title: "Liquidity Analysis", desc: "Track pool depth and slippage conditions" },
    { title: "Flow Detection", desc: "Identify whale entries and rotation patterns" },
    { title: "AI Yield Briefs", desc: "Plain-English guidance you can act on" },
  ];

  const colors = darkMode 
    ? { bg: "#0a0a0a", bgSecondary: "#1a1a1a", text: "#fff", textMuted: "#888", accent: "#ff6b35", accentBg: "#ff6b35" }
    : { bg: "#fff", bgSecondary: "#f5f5f5", text: "#1a1a2e", textMuted: "#666", accent: "#ff6b35", accentBg: "#ff6b35" };

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.bg, color: colors.text }}>
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b" style={{ backgroundColor: colors.bg, borderColor: colors.bgSecondary }}>
        <div className="max-w-4xl mx-auto px-8 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded flex items-center justify-center font-bold text-white text-sm" style={{ backgroundColor: colors.text }}>MY</div>
            <span className="font-medium" style={{ fontFamily: 'DM Sans, sans-serif' }}>Mantle Yield</span>
          </Link>
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded text-lg">{darkMode ? '☀' : '☾'}</button>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero - Simple, left-aligned */}
          <div className="mb-16">
            <h1 className="text-5xl font-bold mb-6 leading-tight" style={{ fontFamily: 'DM Sans, sans-serif', color: colors.text }}>
              The AI layer for<br/>smarter yield decisions<br/>on <span style={{ color: colors.accent }}>Mantle</span>
            </h1>
            <p className="text-lg mb-8 max-w-lg" style={{ color: colors.textMuted, fontFamily: 'Varela Round, sans-serif' }}>
              Analyze vaults, liquidity, and transaction flows to find yield that is sustainable and worth trusting.
            </p>
            <div className="flex gap-3">
              <Link href="/analyze" className="px-6 py-3 rounded-lg font-medium text-white" style={{ backgroundColor: colors.accent, fontFamily: 'DM Sans, sans-serif' }}>Analyze Wallet →</Link>
              <button className="px-6 py-3 rounded-lg font-medium" style={{ border: `1px solid ${colors.bgSecondary}`, color: colors.text, fontFamily: 'DM Sans, sans-serif' }}>How It Works</button>
            </div>
          </div>

          {/* Stats - Simple row */}
          <div className="flex gap-12 mb-16">
            <div><div className="text-2xl font-bold" style={{ fontFamily: 'DM Sans, sans-serif' }}>5+</div><div className="text-sm" style={{ color: colors.textMuted, fontFamily: 'Varela Round, sans-serif' }}>Protocols</div></div>
            <div><div className="text-2xl font-bold" style={{ fontFamily: 'DM Sans, sans-serif' }}>Real-time</div><div className="text-sm" style={{ color: colors.textMuted, fontFamily: 'Varela Round, sans-serif' }}>Onchain Data</div></div>
            <div><div className="text-2xl font-bold" style={{ fontFamily: 'DM Sans, sans-serif' }}>0</div><div className="text-sm" style={{ color: colors.textMuted, fontFamily: 'Varela Round, sans-serif' }}>Private Keys</div></div>
          </div>

          {/* Features - Simple list */}
          <div className="mb-16">
            <h2 className="text-xl font-bold mb-6" style={{ fontFamily: 'DM Sans, sans-serif' }}>Features</h2>
            <div className="grid grid-cols-2 gap-4">
              {features.map((f, i) => (
                <div key={i} className="p-4 rounded-xl" style={{ backgroundColor: colors.bgSecondary }}>
                  <h3 className="font-medium mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>{f.title}</h3>
                  <p className="text-sm" style={{ color: colors.textMuted, fontFamily: 'Varela Round, sans-serif' }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Example - Simple card */}
          <div className="p-6 rounded-xl" style={{ backgroundColor: colors.bgSecondary }}>
            <div className="flex justify-between items-start mb-4">
              <div><h3 className="font-bold" style={{ fontFamily: 'DM Sans, sans-serif' }}>mUSD Stable Strategy</h3><p style={{ color: colors.textMuted, fontFamily: 'Varela Round, sans-serif' }}>Vault</p></div>
              <div className="text-right"><div className="text-3xl font-bold" style={{ color: colors.accent, fontFamily: 'DM Sans, sans-serif' }}>19.4%</div><p style={{ color: colors.textMuted, fontFamily: 'Varela Round, sans-serif' }}>APY</p></div>
            </div>
            <p style={{ color: colors.textMuted, fontFamily: 'Varela Round, sans-serif' }}>AI View: Moderately attractive. Liquidity healthy.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-8 border-t" style={{ borderColor: colors.bgSecondary }}>
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <span className="text-sm" style={{ color: colors.textMuted, fontFamily: 'Varela Round, sans-serif' }}>Mantle Yield</span>
          <span className="text-sm" style={{ color: colors.textMuted, fontFamily: 'Varela Round, sans-serif' }}>Read-only. No keys required.</span>
        </div>
      </footer>
    </div>
  );
}
