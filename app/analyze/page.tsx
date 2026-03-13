"use client";

import { useState } from "react";
import Link from "next/link";
import { getWalletPositions } from "@/lib/mantle";
import { getWalletHistory, analyzeProtocolInteractions } from "@/lib/mantlescan";
import { getAaveData } from "@/lib/aave";

interface AnalysisResult {
  personality: {
    label: string;
    description: string;
    riskTolerance: "conservative" | "moderate" | "aggressive";
  };
  recommendations: {
    protocol: string;
    action: "stake" | "restake" | "supply" | "borrow" | "hold";
    allocation: string;
    apy: string;
    reason: string;
  }[];
  riskFlags: string[];
  estimatedBlendedAPY: string;
}

export default function AnalyzePage() {
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [step, setStep] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  const isValidAddress = (addr: string) => /^0x[a-fA-F0-9]{40}$/.test(addr);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!address.trim()) {
      setError("Please enter a wallet address");
      return;
    }

    if (!isValidAddress(address.trim())) {
      setError("Invalid Ethereum address");
      return;
    }

    setIsLoading(true);
    setStep(1);

    try {
      await new Promise(r => setTimeout(r, 800));
      setStep(2);
      
      const [positions, history, aaveData] = await Promise.all([
        getWalletPositions(address),
        getWalletHistory(address),
        getAaveData(address),
      ]);

      setStep(3);
      await new Promise(r => setTimeout(r, 600));

      const protocolAnalysis = analyzeProtocolInteractions(
        history.transactions,
        history.tokenTransfers
      );

      setStep(4);

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address,
          positions,
          aavePosition: aaveData.position,
          history: protocolAnalysis,
        }),
      });

      const analysis = await response.json();
      setResult(analysis);
      setStep(5);
    } catch (err) {
      console.error("Analysis failed:", err);
      setError("Failed to analyze wallet");
    } finally {
      setIsLoading(false);
    }
  };

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
          <Link href="/" className="flex items-center gap-2">
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
          </Link>
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
        <div className="max-w-xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-semibold mb-2" style={{ color: colors.text }}>
              Analyze Wallet
            </h1>
            <p className="text-base" style={{ color: colors.textMuted }}>
              Enter your Mantle address for AI-powered yield insights
            </p>
          </div>

          {/* Input */}
          <form onSubmit={handleAnalyze} className="mb-8">
            <div 
              className="flex rounded-lg border overflow-hidden"
              style={{ borderColor: colors.border }}
            >
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="0x..."
                className="flex-1 px-4 py-3 text-sm font-mono"
                style={{ 
                  backgroundColor: colors.bgSecondary,
                  color: colors.text,
                }}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 font-medium text-sm"
                style={{ 
                  backgroundColor: colors.accent, 
                  color: colors.accentText 
                }}
              >
                {isLoading ? "Analyzing..." : "Analyze"}
              </button>
            </div>
            {error && (
              <p className="mt-3 text-red-500 text-sm">{error}</p>
            )}
            <p className="mt-3 text-xs" style={{ color: colors.textMuted }}>
              Read-only. No private keys required.
            </p>
          </form>

          {/* Progress */}
          {isLoading && (
            <div className="mb-8">
              <div className="flex gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <div 
                    key={s}
                    className="flex-1 h-1 rounded-full"
                    style={{
                      backgroundColor: step >= s ? colors.accent : colors.border,
                    }}
                  />
                ))}
              </div>
              <p className="text-xs" style={{ color: colors.textMuted }}>
                {step === 1 && "Reading positions..."}
                {step === 2 && "Fetching history..."}
                {step === 3 && "Analyzing..."}
                {step === 4 && "Generating insights..."}
                {step === 5 && "Done"}
              </p>
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="space-y-4">
              {/* Personality */}
              <div 
                className="p-5 rounded-xl border"
                style={{ 
                  backgroundColor: colors.bgSecondary,
                  borderColor: colors.border 
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium" style={{ color: colors.textMuted }}>
                    Your DeFi Profile
                  </span>
                  <span 
                    className="px-2 py-1 rounded text-xs font-medium"
                    style={{
                      backgroundColor: result.personality.riskTolerance === "conservative" 
                        ? 'rgba(16,185,129,0.1)' : result.personality.riskTolerance === "moderate"
                        ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
                      color: result.personality.riskTolerance === "conservative" 
                        ? '#10b981' : result.personality.riskTolerance === "moderate" 
                        ? '#f59e0b' : '#ef4444'
                    }}
                  >
                    {result.personality.riskTolerance}
                  </span>
                </div>
                <h2 className="text-xl font-semibold mb-1">{result.personality.label}</h2>
                <p className="text-sm" style={{ color: colors.textMuted }}>{result.personality.description}</p>
              </div>

              {/* APY */}
              <div 
                className="p-5 rounded-xl border text-center"
                style={{ 
                  backgroundColor: colors.bgSecondary,
                  borderColor: colors.border 
                }}
              >
                <p className="text-xs mb-1" style={{ color: colors.textMuted }}>Blended APY</p>
                <p className="text-4xl font-semibold" style={{ color: colors.accent }}>
                  {result.estimatedBlendedAPY}
                </p>
              </div>

              {/* Recommendations */}
              <div 
                className="p-5 rounded-xl border"
                style={{ 
                  backgroundColor: colors.bgSecondary,
                  borderColor: colors.border 
                }}
              >
                <h3 className="font-medium mb-4">Strategy</h3>
                <div className="space-y-3">
                  {result.recommendations.map((rec, i) => (
                    <div 
                      key={i}
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: colors.bg }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{rec.protocol}</span>
                        <span className="text-sm" style={{ color: colors.accent }}>{rec.allocation}</span>
                      </div>
                      <p className="text-xs" style={{ color: colors.textMuted }}>{rec.reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk */}
              <div 
                className="p-5 rounded-xl border"
                style={{ 
                  backgroundColor: colors.bgSecondary,
                  borderColor: colors.border 
                }}
              >
                <h3 className="font-medium mb-3 text-amber-600">Risk Notes</h3>
                <ul className="space-y-2">
                  {result.riskFlags.map((flag, i) => (
                    <li key={i} className="text-sm" style={{ color: colors.textMuted }}>
                      • {flag}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Another */}
              <button
                onClick={() => { setResult(null); setAddress(""); setStep(0); }}
                className="w-full py-3 text-sm font-medium"
                style={{ color: colors.accent }}
              >
                Analyze another →
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
