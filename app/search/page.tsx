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

export default function SearchPage() {
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [step, setStep] = useState(0);

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
      // Simulate step progress
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

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
              <span className="text-black font-bold text-sm">MY</span>
            </div>
            <span className="font-semibold text-lg">Mantle Yield</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/search" className="text-cyan-400 text-sm font-medium">
              Search
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Analyze Wallet
            </h1>
            <p className="text-gray-400 text-lg">
              Enter any Mantle wallet address to get AI-powered yield insights
            </p>
          </div>

          {/* Input Form */}
          <form onSubmit={handleAnalyze} className="mb-12">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl" />
              <div className="relative bg-[#111] rounded-2xl p-1 border border-white/10">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="0x742d35Cc6634C0532925a3b844Bc9e7595f..."
                    className="flex-1 bg-transparent rounded-xl px-6 py-4 text-white placeholder-gray-600 focus:outline-none font-mono text-sm"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all whitespace-nowrap"
                  >
                    {isLoading ? "Analyzing..." : "Analyze"}
                  </button>
                </div>
              </div>
            </div>
            {error && (
              <p className="mt-4 text-red-400 text-sm text-center">{error}</p>
            )}
            <p className="mt-4 text-gray-500 text-xs text-center">
              🔒 Read-only. We never ask for private keys or signatures.
            </p>
          </form>

          {/* Progress Steps */}
          {isLoading && (
            <div className="mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <div 
                    key={s}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      step >= s 
                        ? "bg-cyan-400 scale-110" 
                        : "bg-gray-700"
                    }`}
                  />
                ))}
              </div>
              <div className="text-center text-gray-400 text-sm">
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
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
              {/* Personality Card */}
              <div className="relative overflow-hidden rounded-2xl">
                <div className={`absolute inset-0 bg-gradient-to-br ${
                  result.personality.riskTolerance === "conservative" 
                    ? "from-emerald-500/10 to-transparent"
                    : result.personality.riskTolerance === "moderate"
                    ? "from-amber-500/10 to-transparent"
                    : "from-rose-500/10 to-transparent"
                }`} />
                <div className="relative bg-[#111] rounded-2xl p-8 border border-white/10">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                        <span className="text-xs text-gray-400 uppercase tracking-wider">Your DeFi Profile</span>
                      </div>
                      <h2 className="text-3xl font-bold text-white mb-2">{result.personality.label}</h2>
                      <p className="text-gray-400 max-w-md">{result.personality.description}</p>
                    </div>
                    <span className={`self-start px-4 py-2 rounded-full text-sm font-medium border ${
                      result.personality.riskTolerance === "conservative"
                        ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                        : result.personality.riskTolerance === "moderate"
                        ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
                        : "text-rose-400 bg-rose-500/10 border-rose-500/20"
                    }`}>
                      {result.personality.riskTolerance.charAt(0).toUpperCase() + result.personality.riskTolerance.slice(1)} Risk
                    </span>
                  </div>
                  
                  <div className="pt-6 border-t border-white/10">
                    <p className="text-xs text-gray-500 mb-1">Analyzed Wallet</p>
                    <p className="font-mono text-sm text-cyan-400">{address.slice(0, 6)}...{address.slice(-4)}</p>
                  </div>
                </div>
              </div>

              {/* APY Summary */}
              <div className="relative overflow-hidden rounded-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10" />
                <div className="relative bg-[#111] rounded-2xl p-8 text-center border border-white/10">
                  <p className="text-gray-400 text-sm mb-2 uppercase tracking-wider">Estimated Blended APY</p>
                  <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                    {result.estimatedBlendedAPY}
                  </p>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-[#111] rounded-2xl p-8 border border-white/10">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <span className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full" />
                  Strategy Recommendations
                </h3>
                <div className="space-y-4">
                  {result.recommendations.map((rec, i) => (
                    <div 
                      key={i}
                      className="bg-[#0a0a0a] rounded-xl p-5 border border-white/5"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-semibold text-white">{rec.protocol}</span>
                          <span className={`px-2 py-1 rounded-md text-xs font-medium border ${
                            rec.action === "stake" ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" :
                            rec.action === "restake" ? "bg-purple-500/10 text-purple-400 border-purple-500/20" :
                            rec.action === "supply" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                            rec.action === "borrow" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                            "bg-gray-500/10 text-gray-400 border-gray-500/20"
                          }`}>
                            {rec.action}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-cyan-400 font-bold">{rec.allocation}</span>
                          <span className="text-gray-500 text-sm ml-2">• {rec.apy} APY</span>
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm pl-1">{rec.reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Flags */}
              <div className="bg-[#111] rounded-2xl p-8 border-l-4 border-amber-500/50">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Risk Considerations
                </h3>
                <ul className="space-y-3">
                  {result.riskFlags.map((flag, i) => (
                    <li key={i} className="text-gray-400 text-sm flex items-start gap-3">
                      <span className="text-amber-400 mt-0.5">⚠</span>
                      {flag}
                    </li>
                  ))}
                </ul>
              </div>

              {/* New Search */}
              <div className="text-center pt-4">
                <button
                  onClick={() => { setResult(null); setAddress(""); setStep(0); }}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
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
