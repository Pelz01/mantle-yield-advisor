"use client";

import { useState } from "react";
import WalletInput from "@/components/WalletInput";
import PersonalityCard from "@/components/PersonalityCard";
import Recommendations from "@/components/Recommendations";
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

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [walletAddress, setWalletAddress] = useState("");

  const handleAnalyze = async (address: string) => {
    setIsLoading(true);
    setWalletAddress(address);
    setResult(null);

    try {
      const [positions, history, aaveData] = await Promise.all([
        getWalletPositions(address),
        getWalletHistory(address),
        getAaveData(address),
      ]);

      const protocolAnalysis = analyzeProtocolInteractions(
        history.transactions,
        history.tokenTransfers
      );

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
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 px-4">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-500/15 rounded-full blur-[128px]" />
          <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(0,0,0,0.3)_50%,transparent_100%)] pointer-events-none" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-sm text-gray-400">AI-Powered DeFi Advisor</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-gray-400">
              Yield Strategies
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Built for You
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Enter your wallet and let AI analyze your on-chain history to find the 
            <span className="text-cyan-400"> perfect yield strategy </span> 
            on Mantle.
          </p>

          {/* CTA / Input */}
          <div className="max-w-xl mx-auto mb-16">
            <WalletInput onSubmit={handleAnalyze} isLoading={isLoading} />
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">5+</div>
              <div className="text-sm text-gray-500 uppercase tracking-wider">Protocols</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">AI</div>
              <div className="text-sm text-gray-500 uppercase tracking-wider">Personalized</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">0</div>
              <div className="text-sm text-gray-500 uppercase tracking-wider">Private Keys</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              How It Works
            </span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl blur-xl" />
              <div className="relative bg-white/5 border border-white/10 rounded-2xl p-8 h-full">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">1. Read Your History</h3>
                <p className="text-gray-400">
                  We scan your on-chain activity to understand your DeFi experience level and risk tolerance.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl blur-xl" />
              <div className="relative bg-white/5 border border-white/10 rounded-2xl p-8 h-full">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">2. AI Analysis</h3>
                <p className="text-gray-400">
                  Our AI matches your profile with live yield opportunities across mETH, cmETH, and Aave.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-b from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl blur-xl" />
              <div className="relative bg-white/5 border border-white/10 rounded-2xl p-8 h-full">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">3. Get Strategy</h3>
                <p className="text-gray-400">
                  Receive a personalized yield allocation with clear reasoning and risk warnings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Protocols */}
      <section className="py-20 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-8 text-gray-400">
            Supported Protocols
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            {['mETH Staking', 'cmETH Restaking', 'Aave V3', 'Merchant Moe', 'MI4 Fund'].map((protocol) => (
              <span 
                key={protocol}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-sm"
              >
                {protocol}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Results Section */}
      {result && walletAddress && (
        <section className="py-20 px-4 border-t border-white/5 bg-gradient-to-b from-transparent to-cyan-950/10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-cyan-400 text-sm uppercase tracking-wider">Your Results</span>
              <h2 className="text-3xl font-bold mt-2">Personalized Yield Strategy</h2>
            </div>
            
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <PersonalityCard personality={result.personality} address={walletAddress} />
              <Recommendations 
                recommendations={result.recommendations} 
                riskFlags={result.riskFlags}
                blendedAPY={result.estimatedBlendedAPY}
              />
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center text-gray-500 text-sm">
          <p>Read-only analysis. Never asks for private keys.</p>
          <p className="mt-2">Built by Elio for the Mantle ecosystem.</p>
        </div>
      </footer>
    </div>
  );
}
