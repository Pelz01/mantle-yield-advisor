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

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? "bg-[#0a0a0a] text-white" : "bg-[#fafafa] text-[#1a1a1a]"
    }`}>
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 border-b transition-colors duration-300 ${
        darkMode ? "border-white/5 bg-[#0a0a0a]/80" : "border-black/10 bg-[#fafafa]/80"
      } backdrop-blur-xl`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              darkMode ? "bg-black border border-white/20" : "bg-white border border-black/10"
            }`}>
              <span className={`font-bold text-sm ${darkMode ? "text-white" : "text-black"}`}>MY</span>
            </div>
            <span className={`font-semibold text-lg ${darkMode ? "text-white" : "text-black"}`}>Mantle Yield</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/search" className={`text-sm font-medium ${darkMode ? "text-[#00C3F5]" : "text-black"}`}>
              Search
            </Link>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg transition-colors ${
                darkMode ? "bg-white/5 hover:bg-white/10" : "bg-black/5 hover:bg-black/10"
              }`}
            >
              {darkMode ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${darkMode ? "text-white" : "text-black"}`}>
              Analyze Wallet
            </h1>
            <p className={darkMode ? "text-gray-400 text-lg" : "text-gray-600 text-lg"}>
              Enter any Mantle wallet address to get AI-powered yield insights
            </p>
          </div>

          {/* Input Form */}
          <form onSubmit={handleAnalyze} className="mb-12">
            <div className={`rounded-2xl p-1 border transition-colors ${
              darkMode ? "border-white/10" : "border-black/10"
            }`}>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="0x742d35Cc6634C0532925a3b844Bc9e7595f..."
                  className={`flex-1 rounded-xl px-6 py-4 font-mono text-sm transition-colors ${
                    darkMode 
                      ? "bg-transparent text-white placeholder-gray-600" 
                      : "bg-transparent text-black placeholder-gray-400"
                  }`}
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-8 py-4 rounded-xl font-semibold transition-all ${
                    darkMode 
                      ? "bg-[#00C3F5] text-black hover:opacity-90" 
                      : "bg-black text-white hover:bg-gray-800"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isLoading ? "Analyzing..." : "Analyze"}
                </button>
              </div>
            </div>
            {error && (
              <p className="mt-4 text-red-500 text-sm text-center">{error}</p>
            )}
            <p className={`mt-4 text-xs text-center ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
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
                        ? darkMode ? "bg-[#00C3F5]" : "bg-black"
                        : darkMode ? "bg-gray-700" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
              <div className={`text-center text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
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
              <div className={`rounded-2xl p-8 border transition-colors ${
                darkMode ? "bg-[#111] border-white/10" : "bg-white border-black/10"
              }`}>
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                  <div>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 text-xs uppercase tracking-wider ${
                      darkMode ? "bg-white/5 text-gray-400" : "bg-black/5 text-gray-500"
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${darkMode ? "bg-[#00C3F5]" : "bg-black"}`} />
                      Your DeFi Profile
                    </div>
                    <h2 className={`text-3xl font-bold mb-2 ${darkMode ? "text-white" : "text-black"}`}>{result.personality.label}</h2>
                    <p className={darkMode ? "text-gray-400 max-w-md" : "text-gray-600 max-w-md"}>{result.personality.description}</p>
                  </div>
                  <span className={`self-start px-4 py-2 rounded-full text-sm font-medium border ${
                    result.personality.riskTolerance === "conservative"
                      ? darkMode ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : "text-emerald-600 bg-emerald-100 border-emerald-200"
                      : result.personality.riskTolerance === "moderate"
                      ? darkMode ? "text-amber-400 bg-amber-500/10 border-amber-500/20" : "text-amber-600 bg-amber-100 border-amber-200"
                      : darkMode ? "text-rose-400 bg-rose-500/10 border-rose-500/20" : "text-rose-600 bg-rose-100 border-rose-200"
                  }`}>
                    {result.personality.riskTolerance.charAt(0).toUpperCase() + result.personality.riskTolerance.slice(1)} Risk
                  </span>
                </div>
                
                <div className={`pt-6 border-t ${darkMode ? "border-white/10" : "border-black/10"}`}>
                  <p className={`text-xs mb-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Analyzed Wallet</p>
                  <p className={`font-mono text-sm ${darkMode ? "text-[#00C3F5]" : "text-black"}`}>{address.slice(0, 6)}...{address.slice(-4)}</p>
                </div>
              </div>

              {/* APY Summary */}
              <div className={`rounded-2xl p-8 text-center border transition-colors ${
                darkMode ? "bg-[#111] border-white/10" : "bg-white border-black/10"
              }`}>
                <p className={`text-sm mb-2 uppercase tracking-wider ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Estimated Blended APY</p>
                <p className={`text-5xl font-bold ${darkMode ? "text-[#00C3F5]" : "text-black"}`}>
                  {result.estimatedBlendedAPY}
                </p>
              </div>

              {/* Recommendations */}
              <div className={`rounded-2xl p-8 border transition-colors ${
                darkMode ? "bg-[#111] border-white/10" : "bg-white border-black/10"
              }`}>
                <h3 className={`text-xl font-semibold mb-6 flex items-center gap-2 ${darkMode ? "text-white" : "text-black"}`}>
                  <span className={`w-1 h-6 rounded-full ${darkMode ? "bg-[#00C3F5]" : "bg-black"}`} />
                  Strategy Recommendations
                </h3>
                <div className="space-y-4">
                  {result.recommendations.map((rec, i) => (
                    <div 
                      key={i}
                      className={`rounded-xl p-5 border transition-colors ${
                        darkMode ? "bg-[#0a0a0a] border-white/5" : "bg-[#fafafa] border-black/10"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className={`text-lg font-semibold ${darkMode ? "text-white" : "text-black"}`}>{rec.protocol}</span>
                          <span className={`px-2 py-1 rounded-md text-xs font-medium border ${
                            rec.action === "stake" ? darkMode ? "bg-[#00C3F5]/10 text-[#00C3F5] border-[#00C3F5]/20" : "bg-black/10 text-black border-black/20" :
                            rec.action === "restake" ? darkMode ? "bg-purple-500/10 text-purple-400 border-purple-500/20" : "bg-purple-100 text-purple-600 border-purple-200" :
                            rec.action === "supply" ? darkMode ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-emerald-100 text-emerald-600 border-emerald-200" :
                            rec.action === "borrow" ? darkMode ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-amber-100 text-amber-600 border-amber-200" :
                            darkMode ? "bg-gray-500/10 text-gray-400 border-gray-500/20" : "bg-gray-100 text-gray-600 border-gray-200"
                          }`}>
                            {rec.action}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className={darkMode ? "text-[#00C3F5] font-bold" : "text-black font-bold"}>{rec.allocation}</span>
                          <span className={`text-sm ml-2 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>• {rec.apy} APY</span>
                        </div>
                      </div>
                      <p className={darkMode ? "text-gray-400 text-sm pl-1" : "text-gray-600 text-sm pl-1"}>{rec.reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Flags */}
              <div className={`rounded-2xl p-8 border-l-4 transition-colors ${
                darkMode ? "border-l-amber-500/50" : "border-l-amber-500"
              }`}>
                <h3 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${darkMode ? "text-white" : "text-black"}`}>
                  <svg className={`w-5 h-5 ${darkMode ? "text-amber-400" : "text-amber-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Risk Considerations
                </h3>
                <ul className="space-y-3">
                  {result.riskFlags.map((flag, i) => (
                    <li key={i} className={`text-sm flex items-start gap-3 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                      <span className={darkMode ? "text-amber-400 mt-0.5" : "text-amber-500 mt-0.5"}>⚠</span>
                      {flag}
                    </li>
                  ))}
                </ul>
              </div>

              {/* New Search */}
              <div className="text-center pt-4">
                <button
                  onClick={() => { setResult(null); setAddress(""); setStep(0); }}
                  className={darkMode ? "text-[#00C3F5] hover:text-[#00d4ff] transition-colors" : "text-black hover:text-gray-700 transition-colors"}
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
