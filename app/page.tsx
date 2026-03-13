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
      // Fetch all data in parallel
      const [positions, history, aaveData] = await Promise.all([
        getWalletPositions(address),
        getWalletHistory(address),
        getAaveData(address),
      ]);

      const protocolAnalysis = analyzeProtocolInteractions(
        history.transactions,
        history.tokenTransfers
      );

      // Send to API for Claude analysis
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
      // Handle error state
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-mantle bg-clip-text text-transparent">MantleYield</span> IQ
          </h1>
          <p className="text-gray-400 text-lg">
            AI-powered yield advisor for Mantle Network
          </p>
        </div>

        {/* Wallet Input */}
        <div className="flex justify-center mb-12">
          <WalletInput onSubmit={handleAnalyze} isLoading={isLoading} />
        </div>

        {/* Results */}
        {result && walletAddress && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <PersonalityCard personality={result.personality} address={walletAddress} />
            <Recommendations 
              recommendations={result.recommendations} 
              riskFlags={result.riskFlags}
              blendedAPY={result.estimatedBlendedAPY}
            />
          </div>
        )}

        {/* Info */}
        {!result && !isLoading && (
          <div className="text-center text-gray-500 text-sm">
            <p>Enter your wallet address to get personalized yield strategies</p>
            <p className="mt-2">We analyze your on-chain activity to find the best opportunities</p>
          </div>
        )}
      </div>
    </div>
  );
}
