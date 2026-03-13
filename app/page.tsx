"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);

  const features = [
    {
      title: "Vault Intelligence",
      desc: "Reads Mantle vault contracts to monitor deposits, withdrawals, TVL changes, and reward behavior."
    },
    {
      title: "Liquidity Analysis", 
      desc: "Tracks pool depth, concentration, and slippage conditions behind yield-bearing assets."
    },
    {
      title: "Flow Detection",
      desc: "Interprets transaction data to identify whale entries, exits, and rotation patterns."
    },
    {
      title: "AI Yield Briefs",
      desc: "Transforms onchain data into plain-English guidance you can actually act on."
    }
  ];

  const colors = darkMode 
    ? {
        bg: "#0a0a0a",
        bgSecondary: "#111111",
        text: "#ffffff",
        textMuted: "#9ca3af",
        accent: "#2563eb",
        accentText: "#ffffff",
      }
    : {
        bg: "#ffffff",
        bgSecondary: "#f9fafb",
        text: "#111827",
        textMuted: "#6b7280",
        accent: "#2563eb",
        accentText: "#ffffff",
      };

  return (
    <div 
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      {/* Navigation */}
      <nav 
        className="fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-xl"
        style={{ 
          backgroundColor: darkMode ? 'rgba(10,10,10,0.95)' : 'rgba(255,255,255,0.95)',
          borderColor: darkMode ? '#27272a' : '#e5e7eb'
        }}
      >
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
              style={{ backgroundColor: colors.accent, color: colors.accentText }}
            >
              MY
            </div>
            <span className="font-semibold">Mantle Yield</span>
          </Link>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg"
            style={{ backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}
          >
            {darkMode ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke={colors.text}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke={colors.text}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Tagline */}
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
            style={{ backgroundColor: darkMode ? 'rgba(37,99,235,0.2)' : 'rgba(37,99,235,0.1)' }}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.accent }} />
            <span className="text-sm" style={{ color: colors.textMuted }}>AI-Powered Onchain Intelligence</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="block mb-2" style={{ color: colors.text }}>
              The AI layer for smarter
            </span>
            <span style={{ color: colors.accent }}>
              yield decisions on Mantle
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl max-w-2xl mb-8" style={{ color: colors.textMuted }}>
            Analyze Mantle vaults, liquidity, and transaction flows to find yield that is <span style={{ color: colors.accent }}>sustainable</span>, <span style={{ color: colors.accent }}>liquid</span>, and worth trusting.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 mb-12">
            <Link 
              href="/analyze"
              className="px-8 py-4 rounded-xl font-semibold text-lg"
              style={{ backgroundColor: colors.accent, color: colors.accentText }}
            >
              Analyze Wallet
            </Link>
            <button 
              className="px-8 py-4 rounded-xl font-medium text-lg"
              style={{ border: `1px solid ${darkMode ? '#27272a' : '#e5e7eb'}`, color: colors.text }}
            >
              See How It Works
            </button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-12">
            <div>
              <div className="text-3xl font-bold" style={{ color: colors.text }}>5+</div>
              <div className="text-sm uppercase tracking-wider" style={{ color: colors.textMuted }}>Protocols</div>
            </div>
            <div>
              <div className="text-3xl font-bold" style={{ color: colors.text }}>Real-time</div>
              <div className="text-sm uppercase tracking-wider" style={{ color: colors.textMuted }}>Onchain Data</div>
            </div>
            <div>
              <div className="text-3xl font-bold" style={{ color: colors.text }}>0</div>
              <div className="text-sm uppercase tracking-wider" style={{ color: colors.textMuted }}>Private Keys Needed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-6 border-t" style={{ borderColor: darkMode ? '#27272a' : '#e5e7eb' }}>
        <div className="max-w-4xl mx-auto">
          <span className="text-sm uppercase tracking-wider" style={{ color: colors.accent }}>The Problem</span>
          <h2 className="text-4xl font-bold mt-4 mb-8" style={{ color: colors.text }}>Yield onchain is noisy</h2>

          <div 
            className="rounded-3xl p-8 md:p-12 border"
            style={{ backgroundColor: colors.bgSecondary, borderColor: darkMode ? '#27272a' : '#e5e7eb' }}
          >
            <p className="text-xl mb-6" style={{ color: colors.textMuted }}>
              High APY alone tells you almost nothing. A vault can look attractive while hiding weak liquidity, short-lived incentives, overcrowded positioning, or unstable capital flows. Most users only see the headline number.
            </p>
            <p className="text-xl" style={{ color: colors.textMuted }}>
              By the time the risks become obvious, the opportunity has already changed. That&apos;s why Mantle deserves a smarter way to evaluate yield.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 border-t" style={{ borderColor: darkMode ? '#27272a' : '#e5e7eb' }}>
        <div className="max-w-4xl mx-auto">
          <span className="text-sm uppercase tracking-wider" style={{ color: colors.accent }}>How It Works</span>
          <h2 className="text-4xl font-bold mt-4 mb-12" style={{ color: colors.text }}>Real Mantle data.<br/>Interpreted by AI.</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <div 
                key={i}
                className="rounded-2xl p-8 border"
                style={{ backgroundColor: colors.bgSecondary, borderColor: darkMode ? '#27272a' : '#e5e7eb' }}
              >
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: darkMode ? 'rgba(37,99,235,0.2)' : 'rgba(37,99,235,0.1)', color: colors.accent }}
                >
                  <span className="text-xl font-bold">{i + 1}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p style={{ color: colors.textMuted }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Example Section */}
      <section className="py-20 px-6 border-t" style={{ borderColor: darkMode ? '#27272a' : '#e5e7eb' }}>
        <div className="max-w-4xl mx-auto">
          <span className="text-sm uppercase tracking-wider" style={{ color: colors.accent }}>What You See</span>
          <h2 className="text-4xl font-bold mt-4 mb-8" style={{ color: colors.text }}>Not just APY.<br/>Actual context.</h2>

          <div 
            className="rounded-3xl p-8 md:p-12 border"
            style={{ backgroundColor: colors.bgSecondary, borderColor: darkMode ? '#27272a' : '#e5e7eb' }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold">mUSD Stable Strategy</h3>
                <p style={{ color: colors.textMuted }}>Vault</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold" style={{ color: colors.accent }}>19.4%</div>
                <p style={{ color: colors.textMuted }}>Current APY</p>
              </div>
            </div>

            <div className="space-y-4 pt-6" style={{ borderColor: darkMode ? '#27272a' : '#e5e7eb' }}>
              <div className="flex items-start gap-3">
                <span style={{ color: colors.accent, marginTop: '4px' }}>◆</span>
                <div>
                  <p className="font-medium">AI View: Moderately attractive</p>
                  <p style={{ color: colors.textMuted }}>Liquidity remains healthy and recent inflows suggest growing attention from larger wallets</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span style={{ color: '#f59e0b', marginTop: '4px' }}>◆</span>
                <div>
                  <p className="font-medium">What to watch</p>
                  <p style={{ color: colors.textMuted }}>A large share of returns currently comes from emissions rather than base strategy performance</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span style={{ color: '#3b82f6', marginTop: '4px' }}>◆</span>
                <div>
                  <p className="font-medium">Best fit</p>
                  <p style={{ color: colors.textMuted }}>Short- to medium-term capital deployment rather than passive long-term parking</p>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-6 text-lg" style={{ color: colors.textMuted }}>
            This is the difference between seeing numbers and understanding them.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 border-t" style={{ borderColor: darkMode ? '#27272a' : '#e5e7eb' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-4" style={{ color: colors.text }}>
            Understand the yield<br/>before you chase it.
          </h2>
          <p className="text-xl mb-10" style={{ color: colors.textMuted }}>
            The AI layer for smarter yield decisions on Mantle.
          </p>
          <Link 
            href="/analyze"
            className="inline-block px-10 py-5 rounded-xl font-bold text-lg"
            style={{ backgroundColor: colors.accent, color: colors.accentText }}
          >
            Launch Mantle Yield Advisor →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t" style={{ borderColor: darkMode ? '#27272a' : '#e5e7eb' }}>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div 
              className="w-6 h-6 rounded flex items-center justify-center font-bold text-xs"
              style={{ backgroundColor: colors.accent, color: colors.accentText }}
            >
              MY
            </div>
            <span style={{ color: colors.textMuted }} className="text-sm">Mantle Yield Advisor</span>
          </div>
          <p style={{ color: colors.textMuted }} className="text-sm">
            Read-only analysis. Never asks for private keys.
          </p>
        </div>
      </footer>
    </div>
  );
}
