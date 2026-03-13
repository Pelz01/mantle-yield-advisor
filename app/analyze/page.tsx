"use client";

import { useState } from "react";
import Link from "next/link";

export default function AnalyzePage() {
  const [darkMode, setDarkMode] = useState(false);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const colors = darkMode 
    ? { bg: "#0a0a0a", bgSecondary: "#1a1a1a", text: "#fff", textMuted: "#888", accent: "#ff6b35", border: "#333" }
    : { bg: "#fff", bgSecondary: "#f5f5f5", text: "#1a1a2e", textMuted: "#666", accent: "#ff6b35", border: "#e5e5e5" };

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.bg, color: colors.text }}>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b" style={{ backgroundColor: colors.bg, borderColor: colors.border }}>
        <div className="max-w-xl mx-auto px-8 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded flex items-center justify-center font-bold text-white text-sm" style={{ backgroundColor: colors.text }}>MY</div>
            <span className="font-medium" style={{ fontFamily: 'DM Sans, sans-serif' }}>Mantle Yield</span>
          </Link>
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded text-lg">{darkMode ? '☀' : '☾'}</button>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-8">
        <div className="max-w-xl mx-auto">
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>Analyze Wallet</h1>
          <p className="text-base mb-8" style={{ color: colors.textMuted, fontFamily: 'Varela Round, sans-serif' }}>Enter address for AI yield insights</p>

          <form className="mb-8">
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="0x..."
                className="flex-1 px-4 py-3 rounded-lg text-sm"
                style={{ backgroundColor: colors.bgSecondary, color: colors.text, border: `1px solid ${colors.border}`, fontFamily: 'DM Sans, sans-serif' }}
                disabled={loading}
              />
              <button className="px-6 py-3 rounded-lg font-medium text-white text-sm" style={{ backgroundColor: colors.accent, fontFamily: 'DM Sans, sans-serif' }}>
                {loading ? '...' : 'Analyze'}
              </button>
            </div>
            <p className="text-xs" style={{ color: colors.textMuted, fontFamily: 'Varela Round, sans-serif' }}>Read-only. No private keys.</p>
          </form>
        </div>
      </main>
    </div>
  );
}
