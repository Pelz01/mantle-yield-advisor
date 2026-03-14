"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface AnalysisResult {
  profile: {
    label: string;
    evidence: string;
    stats: {
      total_transactions: number;
      protocols_used: number;
      longest_position_days: number;
      last_active_days_ago: number;
    };
  };
  blended_apy: {
    total: number;
    breakdown: {
      protocol: string;
      action: string;
      live_apy: number;
      allocation_pct: number;
      contribution: number;
    }[];
  };
  strategies: {
    protocol: string;
    action: string;
    allocation_pct: number;
    live_apy: number;
    why: string;
    fit_score: number;
  }[];
  current_holdings: {
    mnt: string;
    meth: string;
    cmeth: string;
    usdt: string;
    usdc: string;
    aave_supplied: string;
    aave_health_factor: string | null;
    lp_positions: number;
  };
  risks: {
    risk: string;
    evidence: string;
    severity: "low" | "medium" | "high";
  }[];
  confidence: {
    level: "low" | "medium" | "high";
    reason: string;
  };
  onboarding_message: string | null;
}

interface ApiResponse extends AnalysisResult {
  state: "empty" | "no_yield" | "thin_history" | "full";
  error?: string;
  message?: string;
}

export default function ProfilePage() {
  const params = useParams();
  const address = params?.address as string;
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const colors = darkMode
    ? { bg: "#0a0a0a", bgSecondary: "#1a1a1a", text: "#fff", textMuted: "#888", accent: "#ff6b35", border: "#333" }
    : { bg: "#fff", bgSecondary: "#f5f5f5", text: "#1a1a2e", textMuted: "#666", accent: "#ff6b35", border: "#e5e5e5" };

  useEffect(() => {
    if (!address) {
      setError("Wallet address is missing.");
      setLoading(false);
      return;
    }

    const run = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address }),
        });

        const data: ApiResponse = await res.json();

        if (!res.ok || data.error) {
          throw new Error(data.error || "Unable to analyze this wallet right now.");
        }

        if (data.state === "empty") {
          throw new Error(data.message || "No Mantle activity found for this wallet yet.");
        }

        setResult({
          profile: data.profile,
          blended_apy: data.blended_apy,
          strategies: data.strategies,
          current_holdings: data.current_holdings,
          risks: data.risks || [],
          confidence: data.confidence,
          onboarding_message: data.onboarding_message || null,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to analyze this wallet right now.");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [address]);

  const visibleHoldings = result
    ? [
        result.current_holdings.mnt !== "0" ? `${result.current_holdings.mnt} MNT` : null,
        result.current_holdings.meth !== "0" ? `${result.current_holdings.meth} mETH` : null,
        result.current_holdings.cmeth !== "0" ? `${result.current_holdings.cmeth} cmETH` : null,
        result.current_holdings.usdt !== "0" ? `${result.current_holdings.usdt} USDT` : null,
        result.current_holdings.usdc !== "0" ? `${result.current_holdings.usdc} USDC` : null,
      ].filter(Boolean)
    : [];

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.bg, color: colors.text, overflowY: "auto" }}>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b" style={{ backgroundColor: colors.bg, borderColor: colors.border }}>
        <div className="max-w-xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded flex items-center justify-center font-bold text-white text-sm" style={{ backgroundColor: colors.text }}>
              MY
            </div>
            <span className="font-medium" style={{ fontFamily: "DM Sans, sans-serif" }}>
              Mantle Yield
            </span>
          </Link>
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded">
            {darkMode ? "☀" : "☾"}
          </button>
        </div>
      </nav>

      <main className="pt-28 pb-12 px-6">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6">
            <p className="text-xs mb-2" style={{ color: colors.textMuted }}>
              Shared Profile
            </p>
            <p className="font-mono text-sm" style={{ color: colors.textMuted }}>
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </p>
          </div>

          {loading && (
            <div className="p-6 rounded-xl text-center" style={{ backgroundColor: colors.bgSecondary }}>
              <p className="text-lg font-medium mb-2" style={{ fontFamily: "DM Sans, sans-serif" }}>
                Reading wallet history...
              </p>
              <p className="text-sm" style={{ color: colors.textMuted }}>
                Rebuilding this Mantle profile from live on-chain data.
              </p>
            </div>
          )}

          {error && !loading && (
            <div className="p-5 rounded-xl text-center" style={{ backgroundColor: colors.bgSecondary, border: `1px solid ${colors.accent}` }}>
              <p className="text-sm mb-4" style={{ color: colors.accent }}>
                {error}
              </p>
              <Link href="/analyze" className="block w-full py-3 rounded-lg text-center font-medium" style={{ backgroundColor: colors.accent, color: "#fff" }}>
                Analyze Another Wallet
              </Link>
            </div>
          )}

          {result && !loading && (
            <>
              {result.onboarding_message && (
                <div className="p-4 rounded-xl mb-6" style={{ backgroundColor: colors.accent, color: "#fff" }}>
                  <p className="text-sm">{result.onboarding_message}</p>
                </div>
              )}

              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "DM Sans, sans-serif", color: colors.text }}>
                  {result.profile.label}
                </h1>
                <p className="text-sm" style={{ color: colors.accent }}>
                  {result.profile.evidence}
                </p>
              </div>

              <div className="p-6 rounded-xl text-center mb-6" style={{ backgroundColor: colors.accent, color: "#fff" }}>
                <p className="text-xs opacity-80 mb-1">Blended APY</p>
                <p className="text-5xl font-bold">{result.blended_apy.total}%</p>
                <p className="text-xs opacity-80 mt-2">
                  Confidence: {result.confidence.level} · {result.confidence.reason}
                </p>
              </div>

              <div className="p-5 rounded-xl mb-6" style={{ backgroundColor: colors.bgSecondary }}>
                <p className="text-xs mb-4" style={{ color: colors.textMuted }}>
                  Recommended strategy
                </p>
                <div className="space-y-3">
                  {result.strategies.map((rec, index) => (
                    <div key={`${rec.protocol}-${index}`} className="p-3 rounded-lg" style={{ backgroundColor: colors.bg }}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-sm font-medium">{rec.protocol}</p>
                          <p className="text-xs" style={{ color: colors.textMuted }}>
                            {rec.action}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold" style={{ color: colors.accent }}>
                            {rec.allocation_pct}%
                          </p>
                          <p className="text-xs" style={{ color: colors.textMuted }}>
                            {rec.live_apy}% APY
                          </p>
                        </div>
                      </div>
                      <div className="h-2 rounded-full mb-2" style={{ backgroundColor: colors.border }}>
                        <div className="h-full rounded-full" style={{ width: `${rec.allocation_pct}%`, backgroundColor: colors.accent }} />
                      </div>
                      <p className="text-xs" style={{ color: colors.textMuted }}>
                        {rec.why}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-xl mb-6" style={{ backgroundColor: colors.bgSecondary }}>
                <p className="text-xs mb-3" style={{ color: colors.textMuted }}>
                  Wallet snapshot
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {visibleHoldings.length > 0 ? (
                    visibleHoldings.map((holding) => (
                      <span key={holding} className="px-2 py-1 rounded text-xs" style={{ backgroundColor: colors.bg }}>
                        {holding}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs" style={{ color: colors.textMuted }}>
                      No token balances detected right now.
                    </span>
                  )}
                </div>
                <p className="text-xs" style={{ color: colors.textMuted }}>
                  {result.profile.stats.total_transactions} txns · {result.profile.stats.protocols_used} protocols · {result.profile.stats.longest_position_days} day longest hold
                </p>
              </div>

              <div className="p-5 rounded-xl mb-6" style={{ backgroundColor: colors.bgSecondary }}>
                <p className="text-xs mb-3" style={{ color: colors.textMuted }}>
                  Risks tied to this wallet
                </p>
                <div className="space-y-2">
                  {result.risks.length > 0 ? (
                    result.risks.map((risk, index) => (
                      <div key={`${risk.risk}-${index}`} className="text-sm">
                        <span style={{ color: colors.accent }}>{risk.risk}:</span> {risk.evidence}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm" style={{ color: colors.textMuted }}>
                      No material wallet-specific risks were flagged.
                    </p>
                  )}
                </div>
              </div>

              <div className="p-5 rounded-xl mb-6" style={{ backgroundColor: colors.bgSecondary }}>
                <p className="text-center text-lg font-medium mb-4" style={{ fontFamily: "DM Sans, sans-serif" }}>
                  What&apos;s your DeFi personality?
                </p>
                <Link href="/analyze" className="block w-full py-3 rounded-lg text-center font-medium" style={{ backgroundColor: colors.accent, color: "#fff" }}>
                  Analyze Your Wallet
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
