"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);

  const features = [
    { title: "Vault Intelligence", desc: "Reads Mantle vault contracts to monitor deposits, withdrawals, TVL changes, and reward behavior." },
    { title: "Liquidity Analysis", desc: "Tracks pool depth, concentration, and slippage conditions behind yield-bearing assets." },
    { title: "Flow Detection", desc: "Interprets transaction data to identify whale entries, exits, and rotation patterns." },
    { title: "AI Yield Briefs", desc: "Transforms onchain data into plain-English guidance you can actually act on." },
  ];

  const colors = darkMode 
    ? { bg: "#0a0a0a", bgSecondary: "#111", text: "#fff", textMuted: "#9ca3af", accent: "#2563eb", border: "#27272a" }
    : { bg: "#fff", bgSecondary: "#f9fafb", text: "#111827", textMuted: "#6b7280", accent: "#2563eb", border: "#e5e7eb" };

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.bg, color: colors.text }}>
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-xl" style={{ backgroundColor: darkMode ? 'rgba(10,10,10,0.95)' : 'rgba(255,255,255,0.95)', borderColor: colors.border }}>
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm text-white" style={{ backgroundColor: colors.accent }}>MY</div>
            <span className="font-semibold">Mantle Yield</span>
          </Link>
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-lg" style={{ backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}>
            {darkMode ? <span>☀</span> : <span>☾</span>}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6" style={{ backgroundColor: darkMode ? 'rgba(37,99,235,0.2)' : 'rgba(37,99,235,0.1)' }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.accent }} />
            <span className="text-sm" style={{ color: colors.textMuted }}>AI-Powered Onchain Intelligence</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
            <span className="block mb-2" style={{ color: colors.text }}>The AI layer for smarter</span>
            <span style={{ color: colors.accent }}>yield decisions on Mantle</span>
          </h1>

          <p className="text-xl max-w-2xl mb-8" style={{ color: colors.textMuted }}>
            Analyze Mantle vaults, liquidity, and transaction flows to find yield that is <span style={{ color: colors.accent }}>sustainable</span>, <span style={{ color: colors.accent }}>liquid</span>, and worth trusting.
          </p>

          <div className="flex flex-wrap gap-3 mb-10">
            <Link href="/analyze" className="px-6 py-3 rounded-lg font-semibold text-white" style={{ backgroundColor: colors.accent }}>Analyze Wallet →</Link>
            <button className="px-6 py-3 rounded-lg font-medium" style={{ border: `1px solid ${colors.border}`, color: colors.text }}>See How It Works</button>
          </div>

          <div className="flex gap-10">
            <div><div className="text-2xl font-bold">5+</div><div className="text-xs uppercase tracking-wider" style={{ color: colors.textMuted }}>Protocols</div></div>
            <div><div className="text-2xl font-bold">Real-time</div><div className="text-xs uppercase tracking-wider" style={{ color: colors.textMuted }}>Onchain Data</div></div>
            <div><div className="text-2xl font-bold">0</div><div className="text-xs uppercase tracking-wider" style={{ color: colors.textMuted }}>Private Keys</div></div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-14 px-6 border-t" style={{ borderColor: colors.border }}>
        <div className="max-w-4xl mx-auto">
          <span className="text-xs uppercase tracking-wider" style={{ color: colors.accent }}>The Problem</span>
          <h2 className="text-3xl font-bold mt-3 mb-6" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>Yield onchain is noisy</h2>
          <div className="rounded-2xl p-6 border" style={{ backgroundColor: colors.bgSecondary, borderColor: colors.border }}>
            <p className="text-lg mb-4" style={{ color: colors.textMuted }}>High APY alone tells you almost nothing. A vault can look attractive while hiding weak liquidity, short-lived incentives, or unstable capital flows.</p>
            <p className="text-lg" style={{ color: colors.textMuted }}>By the time the risks become obvious, the opportunity has already changed. That's why Mantle deserves a smarter way to evaluate yield.</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-14 px-6 border-t" style={{ borderColor: colors.border }}>
        <div className="max-w-4xl mx-auto">
          <span className="text-xs uppercase tracking-wider" style={{ color: colors.accent }}>How It Works</span>
          <h2 className="text-3xl font-bold mt-3 mb-8" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>Real Mantle data.<br/>Interpreted by AI.</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {features.map((f, i) => (
              <div key={i} className="p-5 rounded-xl border" style={{ backgroundColor: colors.bgSecondary, borderColor: colors.border }}>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm" style={{ color: colors.textMuted }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Example */}
      <section className="py-14 px-6 border-t" style={{ borderColor: colors.border }}>
        <div className="max-w-4xl mx-auto">
          <span className="text-xs uppercase tracking-wider" style={{ color: colors.accent }}>What You See</span>
          <h2 className="text-3xl font-bold mt-3 mb-6" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>Not just APY.<br/>Actual context.</h2>
          <div className="rounded-2xl p-6 border" style={{ backgroundColor: colors.bgSecondary, borderColor: colors.border }}>
            <div className="flex justify-between items-start mb-4">
              <div><h3 className="font-bold text-lg">mUSD Stable Strategy</h3><p style={{ color: colors.textMuted }}>Vault</p></div>
              <div className="text-right"><div className="text-3xl font-bold" style={{ color: colors.accent }}>19.4%</div><p style={{ color: colors.textMuted }}>Current APY</p></div>
            </div>
            <div className="space-y-3 pt-4" style={{ borderColor: colors.border }}>
              <div className="flex gap-2"><span style={{ color: colors.accent }}>◆</span><div><p className="font-medium text-sm">AI View: Moderately attractive</p><p className="text-xs" style={{ color: colors.textMuted }}>Liquidity healthy, inflows from larger wallets</p></div></div>
              <div className="flex gap-2"><span style={{ color: '#f59e0b' }}>◆</span><div><p className="font-medium text-sm">What to watch</p><p className="text-xs" style={{ color: colors.textMuted }}>Part of yield from emissions, not base strategy</p></div></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 px-6 border-t" style={{ borderColor: colors.border }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>Understand the yield<br/>before you chase it.</h2>
          <p className="text-lg mb-8" style={{ color: colors.textMuted }}>The AI layer for smarter yield decisions on Mantle.</p>
          <Link href="/analyze" className="inline-block px-8 py-4 rounded-lg font-bold text-white" style={{ backgroundColor: colors.accent }}>Launch Mantle Yield Advisor →</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t" style={{ borderColor: colors.border }}>
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold text-white" style={{ backgroundColor: colors.accent }}>MY</div>
            <span className="text-sm" style={{ color: colors.textMuted }}>Mantle Yield Advisor</span>
          </div>
          <p className="text-sm" style={{ color: colors.textMuted }}>Read-only. Never asks for private keys.</p>
        </div>
      </footer>
    </div>
  );
}
