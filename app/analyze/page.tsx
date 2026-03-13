"use client";

import { useState } from "react";
import Link from "next/link";

export default function AnalyzePage() {
  const [darkMode, setDarkMode] = useState(false);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const colors = darkMode 
    ? { bg: "#0a0a0a", bgSecondary: "#111", text: "#fff", textMuted: "#9ca3af", accent: "#2563eb", border: "#27272a" }
    : { bg: "#fff", bgSecondary: "#f9fafb", text: "#111827", textMuted: "#6b7280", accent: "#2563eb", border: "#e5e7eb" };

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.bg, color: colors.text }}>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-xl" style={{ backgroundColor: colors.bg, borderColor: colors.border }}>
        <div className="max-w-xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm text-white" style={{ backgroundColor: colors.accent }}>MY</div>
            <span className="font-semibold">Mantle Yield</span>
          </Link>
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-lg text-sm">{darkMode ? '☀' : '☾'}</button>
        </div>
      </nav>

      <main className="pt-28 pb-16 px-6">
        <div className="max-w-xl mx-auto">
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>Analyze Wallet</h1>
          <p className="text-base mb-8" style={{ color: colors.textMuted }}>Enter any Mantle wallet address to get AI-powered yield insights</p>

          <form className="mb-8">
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="0x742d35Cc6634C0532925a3b844Bc9e7595f..."
                className="flex-1 px-4 py-3 rounded-lg text-sm font-mono"
                style={{ backgroundColor: colors.bgSecondary, color: colors.text, border: `1px solid ${colors.border}` }}
                disabled={loading}
              />
              <button className="px-6 py-3 rounded-lg font-semibold text-white text-sm" style={{ backgroundColor: colors.accent }}>
                {loading ? 'Analyzing...' : 'Analyze'}
              </button>
            </div>
            <p className="text-xs" style={{ color: colors.textMuted }}>🔒 Read-only. We never ask for private keys.</p>
          </form>
        </div>
      </main>
    </div>
  );
}
