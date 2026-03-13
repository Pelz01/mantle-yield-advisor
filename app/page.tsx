"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);

  // Agentcard-inspired: white bg, blue accent, clean
  const colors = darkMode 
    ? {
        bg: "#0a0a0a",
        bgSecondary: "#111111",
        text: "#ffffff",
        textMuted: "#9ca3af",
        border: "#27272a",
        accent: "#2563eb",
        accentText: "#ffffff",
      }
    : {
        bg: "#ffffff",
        bgSecondary: "#f9fafb",
        text: "#111827",
        textMuted: "#6b7280",
        border: "#e5e7eb",
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
          borderColor: colors.border 
        }}
      >
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
              style={{ 
                backgroundColor: colors.accent,
                color: colors.accentText
              }}
            >
              MY
            </div>
            <span className="font-semibold" style={{ color: colors.text }}>Mantle Yield</span>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg"
            style={{ 
              backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' 
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
      </nav>

      {/* Main Content */}
      <main className="pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Hero - Clean like Agentcard */}
          <div className="mb-16">
            {/* Badge */}
            <div 
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-6"
              style={{ 
                backgroundColor: darkMode ? 'rgba(37,99,235,0.2)' : 'rgba(37,99,235,0.1)',
                color: colors.accent
              }}
            >
              AI-Powered Yield Intelligence
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl font-semibold mb-4 leading-tight" style={{ color: colors.text }}>
              AI layer for smarter<br/>
              <span style={{ color: colors.accent }}>yield decisions on Mantle</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg mb-8 max-w-xl" style={{ color: colors.textMuted }}>
              Analyze your wallet to get personalized yield strategies. Understand which opportunities match your risk profile.
            </p>

            {/* CTA */}
            <Link 
              href="/analyze"
              className="inline-block px-6 py-3 rounded-lg font-medium text-sm"
              style={{ 
                backgroundColor: colors.accent, 
                color: colors.accentText 
              }}
            >
              Analyze Wallet →
            </Link>
          </div>

          {/* Stats - Simple row */}
          <div className="flex flex-wrap gap-8 mb-16">
            {[
              { value: "5+", label: "Protocols" },
              { value: "Real-time", label: "On-chain data" },
              { value: "0", label: "Private keys" },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-2xl font-semibold" style={{ color: colors.text }}>{stat.value}</div>
                <div className="text-sm" style={{ color: colors.textMuted }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Features - Clean list */}
          <div className="space-y-4 mb-16">
            {[
              { title: "Vault Intelligence", desc: "Monitor deposits, withdrawals, and TVL changes across Mantle vaults" },
              { title: "Liquidity Analysis", desc: "Track pool depth and slippage conditions behind yield assets" },
              { title: "Flow Detection", desc: "Identify whale entries, exits, and rotation patterns" },
              { title: "AI Yield Briefs", desc: "Get plain-English guidance you can actually act on" },
            ].map((feature, i) => (
              <div 
                key={i}
                className="p-4 rounded-xl border"
                style={{ 
                  backgroundColor: colors.bgSecondary,
                  borderColor: colors.border 
                }}
              >
                <h3 className="font-medium mb-1" style={{ color: colors.text }}>{feature.title}</h3>
                <p className="text-sm" style={{ color: colors.textMuted }}>{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Example Output */}
          <div 
            className="p-6 rounded-xl border"
            style={{ 
              backgroundColor: colors.bgSecondary,
              borderColor: colors.border 
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold" style={{ color: colors.text }}>mUSD Stable Strategy</h3>
                <p className="text-sm" style={{ color: colors.textMuted }}>Vault</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-semibold" style={{ color: colors.accent }}>19.4%</div>
                <p className="text-xs" style={{ color: colors.textMuted }}>Current APY</p>
              </div>
            </div>
            <div className="space-y-3 pt-3" style={{ borderColor: colors.border }}>
              <div className="flex items-start gap-2">
                <span style={{ color: colors.accent, marginTop: '2px' }}>◆</span>
                <p className="text-sm" style={{ color: colors.textMuted }}>AI View: Moderately attractive</p>
              </div>
              <div className="flex items-start gap-2">
                <span style={{ color: '#f59e0b', marginTop: '2px' }}>◆</span>
                <p className="text-sm" style={{ color: colors.textMuted }}>Watch: Part of yield from emissions</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer 
        className="py-8 px-6 border-t"
        style={{ borderColor: colors.border }}
      >
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <p className="text-sm" style={{ color: colors.textMuted }}>
            Read-only. Never asks for private keys.
          </p>
        </div>
      </footer>
    </div>
  );
}
