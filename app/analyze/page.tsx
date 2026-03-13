"use client";

import { useState } from "react";
import Link from "next/link";

interface AnalysisResult {
  personality: {
    label: string;
    description: string;
    riskTolerance: "conservative" | "moderate" | "aggressive";
  };
  recommendations: {
    protocol: string;
    action: string;
    allocation: string;
    apy: string;
    reason: string;
  }[];
  riskFlags: string[];
  estimatedBlendedAPY: string;
}

const steps = [
  "Scanning wallet...",
  "Fetching on-chain history...",
  "Analyzing protocols...",
  "Generating insights...",
  "Done"
];

export default function AnalyzePage() {
  const [darkMode, setDarkMode] = useState(false);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const colors = darkMode 
    ? { bg: "#0a0a0a", bgSecondary: "#1a1a1a", text: "#fff", textMuted: "#888", accent: "#ff6b35", border: "#333" }
    : { bg: "#fff", bgSecondary: "#f5f5f5", text: "#1a1a2e", textMuted: "#666", accent: "#ff6b35", border: "#e5e5e5" };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;
    
    setLoading(true);
    setResult(null);
    setCurrentStep(0);

    // Simulate steps
    for (let i = 0; i < steps.length; i++) {
      await new Promise(r => setTimeout(r, 800));
      setCurrentStep(i + 1);
    }

    // Mock result (in real app, this comes from API)
    setResult({
      personality: {
        label: "Yield Explorer",
        description: "You've tried multiple DeFi strategies and prefer steady returns over high-risk plays.",
        riskTolerance: "moderate"
      },
      recommendations: [
        { protocol: "mETH", action: "Stake", allocation: "50%", apy: "~4.2%", reason: "Steady staking rewards match your profile" },
        { protocol: "Aave", action: "Supply", allocation: "30%", apy: "~8%", reason: "Lend stablecoins for passive yield" },
        { protocol: "Merchant Moe", action: "LP", allocation: "20%", apy: "~15%", reason: "Small LP position for extra returns" }
      ],
      riskFlags: ["Impermanent loss risk on LP", "Smart contract risk", "Market volatility"],
      estimatedBlendedAPY: "7.8%"
    });

    setLoading(false);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.bg, color: colors.text }}>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b" style={{ backgroundColor: colors.bg, borderColor: colors.border }}>
        <div className="max-w-xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded flex items-center justify-center font-bold text-white text-sm" style={{ backgroundColor: colors.text }}>MY</div>
            <span className="font-medium">Mantle Yield</span>
          </Link>
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded">{darkMode ? '☀' : '☾'}</button>
        </div>
      </nav>

      <main className="pt-28 pb-16 px-6">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Analyze Wallet</h1>
            <p style={{ color: colors.textMuted }}>Enter your Mantle address</p>
          </div>

          {/* Input */}
          {!loading && !result && (
            <form onSubmit={handleAnalyze} className="mb-8">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="0x..."
                className="w-full px-4 py-3 rounded-lg text-sm mb-3"
                style={{ backgroundColor: colors.bgSecondary, color: colors.text, border: `1px solid ${colors.border}` }}
              />
              <button 
                type="submit"
                disabled={!address.trim()}
                className="w-full py-3 rounded-lg font-medium text-white disabled:opacity-50"
                style={{ backgroundColor: colors.accent }}
              >
                Start Analysis
              </button>
            </form>
          )}

          {/* Scanning Animation */}
          {loading && (
            <div className="py-12">
              {/* Animated dots */}
              <div className="flex justify-center gap-3 mb-8">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-3 h-3 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: currentStep > i ? colors.accent : colors.border,
                      transform: currentStep === i ? 'scale(1.3)' : 'scale(1)',
                    }}
                  />
                ))}
              </div>

              {/* Step text */}
              <div className="text-center">
                <p className="text-lg font-medium animate-pulse" style={{ color: colors.text }}>
                  {steps[currentStep - 1] || "Starting..."}
                </p>
              </div>

              {/* Address being scanned */}
              {address && (
                <div className="mt-8 text-center">
                  <p className="text-xs mb-2" style={{ color: colors.textMuted }}>Scanning</p>
                  <p className="font-mono text-sm" style={{ color: colors.textMuted }}>
                    {address.slice(0, 6)}...{address.slice(-4)}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Results - Cards that flip in */}
          {result && !loading && (
            <div className="space-y-4">
              {/* Personality Card */}
              <div 
                className="p-5 rounded-xl"
                style={{ backgroundColor: colors.bgSecondary, animation: 'slideIn 0.5s ease-out' }}
              >
                <p className="text-xs mb-2" style={{ color: colors.textMuted }}>Your DeFi Profile</p>
                <h2 className="text-xl font-bold mb-1">{result.personality.label}</h2>
                <p className="text-sm" style={{ color: colors.textMuted }}>{result.personality.description}</p>
              </div>

              {/* APY Card */}
              <div 
                className="p-5 rounded-xl text-center"
                style={{ backgroundColor: colors.accent, color: '#fff', animation: 'slideIn 0.5s ease-out 0.2s both' }}
              >
                <p className="text-xs opacity-80 mb-1">Blended APY</p>
                <p className="text-4xl font-bold">{result.estimatedBlendedAPY}</p>
              </div>

              {/* Recommendations */}
              <div 
                className="p-5 rounded-xl"
                style={{ backgroundColor: colors.bgSecondary, animation: 'slideIn 0.5s ease-out 0.4s both' }}
              >
                <p className="text-xs mb-3" style={{ color: colors.textMuted }}>Strategy</p>
                <div className="space-y-3">
                  {result.recommendations.map((rec, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <div>
                        <span className="font-medium text-sm">{rec.protocol}</span>
                        <span className="text-xs ml-2" style={{ color: colors.textMuted }}>{rec.action}</span>
                      </div>
                      <span className="font-bold text-sm" style={{ color: colors.accent }}>{rec.allocation}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk */}
              <div 
                className="p-4 rounded-xl"
                style={{ backgroundColor: colors.bgSecondary, animation: 'slideIn 0.5s ease-out 0.6s both' }}
              >
                <p className="text-xs mb-2" style={{ color: colors.textMuted }}>Risks to watch</p>
                <ul className="space-y-1">
                  {result.riskFlags.map((risk, i) => (
                    <li key={i} className="text-xs" style={{ color: colors.textMuted }}>• {risk}</li>
                  ))}
                </ul>
              </div>

              {/* Another button */}
              <button
                onClick={() => { setResult(null); setAddress(""); }}
                className="w-full py-3 rounded-lg text-sm font-medium"
                style={{ border: `1px solid ${colors.border}`, color: colors.text }}
              >
                Analyze Another →
              </button>
            </div>
          )}
        </div>
      </main>

      <style jsx>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
