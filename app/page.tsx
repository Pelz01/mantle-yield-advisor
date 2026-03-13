"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);

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
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
              style={{ backgroundColor: colors.accent, color: colors.accentText }}
            >
              MY
            </div>
            <span className="font-semibold">Mantle Yield</span>
          </div>
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

      {/* Main */}
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Hero - Minimal */}
          <div className="mb-12">
            <div 
              className="inline-flex px-3 py-1 rounded-full text-xs font-medium mb-6"
              style={{ backgroundColor: darkMode ? 'rgba(37,99,235,0.2)' : 'rgba(37,99,235,0.1)', color: colors.accent }}
            >
              AI-Powered Yield Intelligence
            </div>

            <h1 className="text-4xl font-semibold mb-4" style={{ color: colors.text }}>
              Smarter yield decisions<br/>
              <span style={{ color: colors.accent }}>on Mantle</span>
            </h1>

            <p className="text-lg mb-6 max-w-md" style={{ color: colors.textMuted }}>
              Analyze your wallet. Get personalized yield strategies in plain English.
            </p>

            <Link 
              href="/analyze"
              className="inline-block px-5 py-2.5 rounded-lg font-medium text-sm"
              style={{ backgroundColor: colors.accent, color: colors.accentText }}
            >
              Analyze Wallet →
            </Link>
          </div>

          {/* Use Cases - Grid */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { title: "Vault Intelligence", desc: "Monitor deposits & TVL" },
              { title: "Liquidity Analysis", desc: "Track pool depth" },
              { title: "Flow Detection", desc: "Spot whale movements" },
              { title: "AI Yield Briefs", desc: "Plain-English insights" },
            ].map((item, i) => (
              <div 
                key={i}
                className="p-4 rounded-xl"
                style={{ backgroundColor: colors.bgSecondary }}
              >
                <h3 className="font-medium text-sm mb-1">{item.title}</h3>
                <p className="text-xs" style={{ color: colors.textMuted }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-6 border-t" style={{ borderColor: darkMode ? '#27272a' : '#e5e7eb' }}>
        <div className="max-w-3xl mx-auto">
          <p className="text-sm" style={{ color: colors.textMuted }}>
            Read-only. No private keys required.
          </p>
        </div>
      </footer>
    </div>
  );
}
