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
  const [darkMode, setDarkMode] = useState(true);

  const isValidAddress = (addr: string) => /^0x[a-fA-F0-9]{40}$/.test(addr);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!address.trim()) {
      setError("Please enter a wallet address");
      return;
    }

    if (!isValidAddress(address.trim())) {
      setError("Invalid Ethereum address. Must be 0x followed by 40 hex characters.");
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
      setError("Failed to analyze wallet. Please check the address and try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
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
      </nav>

      {/* Main Content - Left Aligned */}
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Header - Left Aligned */}
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ color: colors.text }}>
              Analyze Wallet
            </h1>
            <p className="text-lg" style={{ color: colors.textMuted }}>
              Enter any Mantle wallet address to get AI-powered yield insights
            </p>
          </div>

          {/* Input Form - Left Aligned */}
          <form onSubmit={handleAnalyze} className="mb-10">
            <div 
              className="rounded-2xl p-1 border"
              style={{ borderColor: colors.border }}
            >
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="0x742d35Cc6634C0532925a3b844Bc9e7595f..."
                  className="w-full rounded-xl px-6 py-4 font-mono text-sm"
                  style={{ 
                    backgroundColor: colors.bgSecondary,
                    color: colors.text,
                    border: 'none'
                  }}
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-8 py-4 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ 
                    backgroundColor: colors.accent, 
                    color: darkMode ? '#000000' : '#ffffff' 
                  }}
                >
                  {isLoading ? "Analyzing..." : "Analyze"}
                </button>
              </div>
            </div>
            {error && (
              <p className="mt-4 text-red-500 text-sm">{error}</p>
            )}
            <p className="mt-4 text-xs" style={{ color: colors.textMuted }}>
              🔒 Read-only. We never ask for private keys or signatures.
            </p>
          </form>

          {/* Progress Steps */}
          {isLoading && (
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-3">
                {[1, 2, 3, 4, 5].map((s) => (
                  <div 
                    key={s}
                    className="flex-1 h-1 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: step >= s ? colors.accent : (darkMode ? '#3f3f46' : '#d4d4d8'),
                    }}
                  />
                ))}
              </div>
              <div className="text-sm" style={{ color: colors.textMuted }}>
                {step === 1 && "Reading wallet positions..."}
                {step === 2 && "Fetching on-chain history..."}
                {step === 3 && "Analyzing protocol interactions..."}
                {step === 4 && "Generating AI insights..."}
                {step === 5 && "Complete!"}
              </div>
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="space-y-6 animate-in">
              {/* Personality Card */}
              <div 
                className="rounded-2xl p-8 border"
                style={{ 
                  backgroundColor: colors.bgSecondary,
                  borderColor: colors.border 
                }}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                  <div className="flex-1">
                    <div 
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 text-xs uppercase tracking-wider"
                      style={{ 
                        backgroundColor: colors.accentBg,
                        color: colors.textMuted
                      }}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.accent }} />
                      Your DeFi Profile
                    </div>
                    <h2 className="text-3xl font-bold mb-2">{result.personality.label}</h2>
                    <p style={{ color: colors.textMuted }}>{result.personality.description}</p>
                  </div>
                  <span 
                    className="self-start px-4 py-2 rounded-full text-sm font-medium border whitespace-nowrap"
                    style={{
                      backgroundColor: result.personality.riskTolerance === "conservative" 
                        ? (darkMode ? 'rgba(16,185,129,0.1)' : 'rgba(5,150,105,0.1)')
                        : result.personality.riskTolerance === "moderate"
                        ? (darkMode ? 'rgba(245,158,11,0.1)' : 'rgba(217,119,6,0.1)')
                        : (darkMode ? 'rgba(244,63,94,0.1)' : 'rgba(190,18,60,0.1)'),
                      borderColor: result.personality.riskTolerance === "conservative" 
                        ? (darkMode ? 'rgba(16,185,129,0.2)' : 'rgba(5,150,105,0.2)')
                        : result.personality.riskTolerance === "moderate"
                        ? (darkMode ? 'rgba(245,158,11,0.2)' : 'rgba(217,119,6,0.2)')
                        : (darkMode ? 'rgba(244,63,94,0.2)' : 'rgba(190,18,60,0.2)'),
                      color: result.personality.riskTolerance === "conservative" 
                        ? '#34d399' : result.personality.riskTolerance === "moderate" 
                        ? '#fbbf24' : '#fb7185'
                    }}
                  >
                    {result.personality.riskTolerance.charAt(0).toUpperCase() + result.personality.riskTolerance.slice(1)} Risk
                  </span>
                </div>
                
                <div className="pt-4" style={{ borderColor: colors.border }}>
                  <p className="text-xs mb-1" style={{ color: colors.textMuted }}>Analyzed Wallet</p>
                  <p className="font-mono text-sm" style={{ color: colors.accent }}>{address.slice(0, 6)}...{address.slice(-4)}</p>
                </div>
              </div>

              {/* APY Summary */}
              <div 
                className="rounded-2xl p-8 border"
                style={{ 
                  backgroundColor: colors.bgSecondary,
                  borderColor: colors.border 
                }}
              >
                <p className="text-sm mb-2 uppercase tracking-wider" style={{ color: colors.textMuted }}>Estimated Blended APY</p>
                <p className="text-5xl font-bold" style={{ color: colors.accent }}>
                  {result.estimatedBlendedAPY}
                </p>
              </div>

              {/* Recommendations */}
              <div 
                className="rounded-2xl p-8 border"
                style={{ 
                  backgroundColor: colors.bgSecondary,
                  borderColor: colors.border 
                }}
              >
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <span className="w-1 h-6 rounded-full" style={{ backgroundColor: colors.accent }} />
                  Strategy Recommendations
                </h3>
                <div className="space-y-4">
                  {result.recommendations.map((rec, i) => (
                    <div 
                      key={i}
                      className="rounded-xl p-5 border"
                      style={{ 
                        backgroundColor: colors.bg,
                        borderColor: colors.border 
                      }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-semibold">{rec.protocol}</span>
                          <span 
                            className="px-2 py-1 rounded-md text-xs font-medium"
                            style={{
                              backgroundColor: colors.accentBg,
                              color: colors.accent,
                            }}
                          >
                            {rec.action}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold" style={{ color: colors.accent }}>{rec.allocation}</span>
                          <span className="text-sm ml-2" style={{ color: colors.textMuted }}>• {rec.apy} APY</span>
                        </div>
                      </div>
                      <p className="text-sm" style={{ color: colors.textMuted }}>{rec.reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Flags */}
              <div 
                className="rounded-2xl p-8 border-l-4"
                style={{ 
                  backgroundColor: colors.bgSecondary,
                  borderColor: colors.border,
                  borderLeftColor: '#f59e0b'
                }}
              >
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" style={{ color: '#f59e0b' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Risk Considerations
                </h3>
                <ul className="space-y-3">
                  {result.riskFlags.map((flag, i) => (
                    <li key={i} className="text-sm flex items-start gap-3" style={{ color: colors.textMuted }}>
                      <span style={{ color: '#f59e0b', marginTop: '2px' }}>⚠</span>
                      {flag}
                    </li>
                  ))}
                </ul>
              </div>

              {/* New Search */}
              <div className="pt-4">
                <button
                  onClick={() => { setResult(null); setAddress(""); setStep(0); }}
                  className="transition-colors"
                  style={{ color: colors.accent }}
                >
                  Analyze another wallet →
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
