"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);

  const features = [
    { title: "Wallet DNA", desc: "We read your on-chain history to build your DeFi personality — then match you with yield that fits." },
    { title: "Live APY Tracking", desc: "Pulls real-time rates from every major pool on Mantle. No stale data, no guesswork." },
    { title: "Risk Signals", desc: "We flag impermanent loss, incentive ends, and concentration risk — specific to your positions." },
    { title: "One-Click Insights", desc: "Enter your address, get a personalized strategy in seconds. No sign-up, no keys." },
  ];

  const protocols = [
    { name: "mETH", type: "Liquid Staking" },
    { name: "Aave V3", type: "Lending" },
    { name: "Merchant Moe", type: "DEX / LP" },
    { name: "AGNI Finance", type: "AMM" },
    { name: "INIT Capital", type: "Lending" },
    { name: "Lendle", type: "Lending" },
  ];

  const steps = [
    { num: "01", title: "Enter your Mantle address", desc: "Type in your wallet or paste from clipboard. We read only — never ask for keys." },
    { num: "02", title: "We scan your history", desc: "Every transaction, every token, every protocol interaction. Build your DeFi profile." },
    { num: "03", title: "Get your yield strategy", desc: "Personalized recommendations based on what you've actually done — not generic templates." },
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
          <div className="flex items-center gap-4">
            <Link href="/analyze" className="text-sm font-medium" style={{ color: colors.textMuted }}>Analyze</Link>
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded text-lg">{darkMode ? '☀' : '☾'}</button>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="mb-20">
            <div className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-4" style={{ backgroundColor: colors.bgSecondary, color: colors.accent }}>
              Built for Mantle Network
            </div>
            <h1 className="text-5xl font-bold mb-6 leading-tight" style={{ fontFamily: 'DM Sans, sans-serif', color: colors.text }}>
              The AI layer for<br/>smarter yield decisions<br/>on <span style={{ color: colors.accent }}>Mantle</span>
            </h1>
            <p className="text-lg mb-8 max-w-lg" style={{ color: colors.textMuted, fontFamily: 'Varela Round, sans-serif' }}>
              We read your on-chain history to understand your DeFi personality — then recommend yield strategies that actually fit what you do.
            </p>
            <div className="flex gap-3">
              <Link href="/analyze" className="px-6 py-3 rounded-lg font-medium text-white" style={{ backgroundColor: colors.accent, fontFamily: 'DM Sans, sans-serif' }}>Analyze Wallet →</Link>
            </div>
          </div>

          {/* How It Works */}
          <div className="mb-20">
            <h2 className="text-2xl font-bold mb-8" style={{ fontFamily: 'DM Sans, sans-serif' }}>How it works</h2>
            <div className="space-y-6">
              {steps.map((step, i) => (
                <div key={i} className="flex gap-6">
                  <div className="text-4xl font-bold" style={{ color: colors.accent, fontFamily: 'DM Sans, sans-serif', width: '60px' }}>{step.num}</div>
                  <div>
                    <h3 className="font-medium mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>{step.title}</h3>
                    <p className="text-sm" style={{ color: colors.textMuted, fontFamily: 'Varela Round, sans-serif' }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Supported Protocols */}
          <div className="mb-20">
            <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>Supported Protocols</h2>
            <p className="text-sm mb-6" style={{ color: colors.textMuted, fontFamily: 'Varela Round, sans-serif' }}>We track yield across all major Mantle protocols</p>
            <div className="grid grid-cols-3 gap-3">
              {protocols.map((p, i) => (
                <div key={i} className="p-4 rounded-xl" style={{ backgroundColor: colors.bgSecondary }}>
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium" style={{ fontFamily: 'DM Sans, sans-serif' }}>{p.name}</span>
                  </div>
                  <p className="text-xs" style={{ color: colors.textMuted }}>{p.type}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="mb-20">
            <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>What you get</h2>
            <p className="text-sm mb-6" style={{ color: colors.textMuted, fontFamily: 'Varela Round, sans-serif' }}>Personalized insights, not generic advice</p>
            <div className="grid grid-cols-2 gap-4">
              {features.map((f, i) => (
                <div key={i} className="p-5 rounded-xl" style={{ backgroundColor: colors.bgSecondary }}>
                  <h3 className="font-medium mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>{f.title}</h3>
                  <p className="text-sm" style={{ color: colors.textMuted, fontFamily: 'Varela Round, sans-serif' }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Example */}
          <div className="mb-20">
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'DM Sans, sans-serif' }}>Example output</h2>
            <div className="p-6 rounded-xl" style={{ backgroundColor: colors.bgSecondary }}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg" style={{ fontFamily: 'DM Sans, sans-serif' }}>Yield Explorer</h3>
                  <p className="text-sm" style={{ color: colors.accent }}>14 txns · 3 protocols · 47-day max hold</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold" style={{ color: colors.accent, fontFamily: 'DM Sans, sans-serif' }}>7.8%</div>
                  <p className="text-xs" style={{ color: colors.textMuted }}>Blended APY</p>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm"><span>mETH Stake</span><span>50% · 4.2%</span></div>
                <div className="flex justify-between text-sm"><span>Aave Supply</span><span>30% · 8.1%</span></div>
                <div className="flex justify-between text-sm"><span>Merchant Moe LP</span><span>20% · 16.5%</span></div>
              </div>
              <p className="text-sm italic" style={{ color: colors.textMuted }}>"You've held mETH for 47 days — your longest position. You trust it."</p>
            </div>
          </div>

          {/* Privacy */}
          <div className="mb-16 p-6 rounded-xl text-center" style={{ backgroundColor: colors.bgSecondary }}>
            <h3 className="font-bold mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>🔒 Read-only. Your keys are safe.</h3>
            <p className="text-sm" style={{ color: colors.textMuted, fontFamily: 'Varela Round, sans-serif' }}>
              We never ask for your private keys. We only read public on-chain data. 
              Your wallet stays yours.
            </p>
          </div>

          {/* CTA */}
          <div className="text-center mb-16">
            <Link href="/analyze" className="inline-block px-8 py-4 rounded-lg font-medium text-white text-lg" style={{ backgroundColor: colors.accent, fontFamily: 'DM Sans, sans-serif' }}>
              Analyze Your Wallet →
            </Link>
            <p className="text-sm mt-4" style={{ color: colors.textMuted }}>Takes 10 seconds. No sign-up required.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-8 border-t" style={{ borderColor: colors.bgSecondary }}>
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <span className="text-sm" style={{ color: colors.textMuted, fontFamily: 'Varela Round, sans-serif' }}>Mantle Yield IQ</span>
          <span className="text-sm" style={{ color: colors.textMuted, fontFamily: 'Varela Round, sans-serif' }}>Read-only. No keys. No account.</span>
        </div>
      </footer>
    </div>
  );
}
