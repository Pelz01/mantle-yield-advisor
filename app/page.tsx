"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [darkMode, setDarkMode] = useState(true);

  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "Vault Intelligence",
      desc: "Reads Mantle vault contracts to monitor deposits, withdrawals, TVL changes, and reward behavior."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      title: "Liquidity Analysis",
      desc: "Tracks pool depth, concentration, and slippage conditions behind yield-bearing assets."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Flow Detection",
      desc: "Interprets transaction data to identify whale entries, exits, and rotation patterns."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: "AI Yield Briefs",
      desc: "Transforms onchain data into plain-English guidance you can actually act on."
    }
  ];

  // Colors
  const colors = darkMode 
    ? {
        bg: "#0a0a0a",
        bgSecondary: "#111111",
        text: "#ffffff",
        textMuted: "#a1a1aa",
        border: "#27272a",
        accent: "#00C3F5",
        accentBg: "rgba(0, 195, 245, 0.1)",
      }
    : {
        bg: "#f4f4f5",
        bgSecondary: "#ffffff",
        text: "#18181b",
        textMuted: "#52525b",
        border: "#e4e4e7",
        accent: "#0891b2",
        accentBg: "rgba(8, 145, 178, 0.1)",
      };

  return (
    <div 
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      {/* Navigation */}
      <nav 
        className="fixed top-0 left-0 right-0 z-50 border-b transition-colors duration-300 backdrop-blur-xl"
        style={{ 
          backgroundColor: darkMode ? 'rgba(10,10,10,0.95)' : 'rgba(244,244,245,0.95)',
          borderColor: colors.border 
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
              style={{ 
                backgroundColor: darkMode ? '#18181b' : '#ffffff',
                border: `1px solid ${colors.border}`,
                color: colors.text
              }}
            >
              MY
            </div>
            <span className="font-semibold text-lg" style={{ color: colors.text }}>Mantle Yield</span>
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg transition-colors"
              style={{ 
                backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' 
              }}
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
        </div>
      </nav>

      {/* Hero Section - Left Aligned */}
      <section className="pt-24 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Tagline */}
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
            style={{ backgroundColor: colors.accentBg }}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.accent }} />
            <span className="text-sm" style={{ color: colors.textMuted }}>AI-Powered Onchain Intelligence</span>
          </div>

          {/* Headline - Left Aligned */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4" style={{ color: colors.text }}>
              The AI layer for smarter
            </h1>
            <h1 className="text-4xl md:text-6xl font-bold" style={{ color: colors.accent }}>
              yield decisions on Mantle
            </h1>
          </div>

          {/* Subheadline - Left Aligned */}
          <p className="text-xl md:text-2xl max-w-2xl mb-10 leading-relaxed" style={{ color: colors.textMuted }}>
            Analyze Mantle vaults, liquidity, and transaction flows to find yield that is <span style={{ color: colors.accent }}>sustainable</span>, <span style={{ color: colors.accent }}>liquid</span>, and worth trusting.
          </p>

          {/* CTAs - Left Aligned */}
          <div className="flex flex-wrap gap-4 mb-16">
            <Link 
              href="/analyze"
              className="px-8 py-4 rounded-xl font-semibold text-lg transition-transform hover:scale-105"
              style={{ 
                backgroundColor: colors.accent, 
                color: darkMode ? '#000000' : '#ffffff' 
              }}
            >
              Analyze Wallet
            </Link>
            <button 
              className="px-8 py-4 rounded-xl font-medium text-lg transition-colors"
              style={{ 
                border: `1px solid ${colors.border}`,
                color: colors.text 
              }}
            >
              See How It Works
            </button>
          </div>

          {/* Stats - Left Aligned */}
          <div className="flex flex-wrap gap-12">
            {stats.map((stat, i) => (
              <div key={i}>
                <div className="text-3xl md:text-4xl font-bold mb-1" style={{ color: colors.text }}>{stat.value}</div>
                <div className="text-sm uppercase tracking-wider" style={{ color: colors.textMuted }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section 
        className="py-24 px-6 border-t"
        style={{ borderColor: colors.border }}
      >
        <div className="max-w-4xl mx-auto">
          <span className="text-sm uppercase tracking-wider" style={{ color: colors.accent }}>The Problem</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-8" style={{ color: colors.text }}>Yield onchain is noisy</h2>

          <div 
            className="rounded-3xl p-8 md:p-12 border"
            style={{ 
              backgroundColor: colors.bgSecondary,
              borderColor: colors.border 
            }}
          >
            <p className="text-xl leading-relaxed mb-6" style={{ color: colors.textMuted }}>
              High APY alone tells you almost nothing. A vault can look attractive while hiding weak liquidity, short-lived incentives, overcrowded positioning, or unstable capital flows. Most users only see the headline number.
            </p>
            <p className="text-xl leading-relaxed" style={{ color: colors.textMuted }}>
              By the time the risks become obvious, the opportunity has already changed. That&apos;s why Mantle deserves a smarter way to evaluate yield.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section 
        className="py-24 px-6 border-t"
        style={{ borderColor: colors.border }}
      >
        <div className="max-w-4xl mx-auto">
          <span className="text-sm uppercase tracking-wider" style={{ color: colors.accent }}>How It Works</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-12" style={{ color: colors.text }}>Real Mantle data.<br/>Interpreted by AI.</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <div 
                key={i}
                className="rounded-2xl p-8 border"
                style={{ 
                  backgroundColor: colors.bgSecondary,
                  borderColor: colors.border 
                }}
              >
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                  style={{ 
                    backgroundColor: colors.accentBg,
                    color: colors.accent
                  }}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="leading-relaxed" style={{ color: colors.textMuted }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Example Section */}
      <section 
        className="py-24 px-6 border-t"
        style={{ borderColor: colors.border }}
      >
        <div className="max-w-4xl mx-auto">
          <span className="text-sm uppercase tracking-wider" style={{ color: colors.accent }}>What You See</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-8" style={{ color: colors.text }}>Not just APY.<br/>Actual context.</h2>

          <div 
            className="rounded-3xl p-8 md:p-12 border"
            style={{ 
              backgroundColor: colors.bgSecondary,
              borderColor: colors.border 
            }}
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

            <div className="space-y-4 pt-6" style={{ borderColor: colors.border }}>
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
      <section 
        className="py-24 px-6 border-t"
        style={{ borderColor: colors.border }}
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: colors.text }}>
            Understand the yield<br/>before you chase it.
          </h2>
          <p className="text-xl mb-10" style={{ color: colors.textMuted }}>
            The AI layer for smarter yield decisions on Mantle.
          </p>
          <Link 
            href="/analyze"
            className="inline-block px-10 py-5 rounded-xl font-bold text-lg transition-transform hover:scale-105"
            style={{ 
              backgroundColor: colors.accent, 
              color: darkMode ? '#000000' : '#ffffff' 
            }}
          >
            Launch Mantle Yield Advisor →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer 
        className="py-12 px-6 border-t"
        style={{ borderColor: colors.border }}
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div 
              className="w-6 h-6 rounded flex items-center justify-center font-bold text-xs"
              style={{ 
                backgroundColor: darkMode ? '#18181b' : '#ffffff',
                border: `1px solid ${colors.border}`,
                color: colors.text
              }}
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

const stats = [
  { value: "5+", label: "Protocols" },
  { value: "Real-time", label: "Onchain Data" },
  { value: "0", label: "Private Keys Needed" }
];
