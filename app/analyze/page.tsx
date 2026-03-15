"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BrandMark from "@/components/BrandMark";
import RiskQuestions from "@/app/components/RiskQuestions";
import { RiskAnswers } from "@/lib/riskScore";

interface AnalysisResult {
  profile: { label: string; evidence: string; stats: { total_transactions: number; protocols_used: number; longest_position_days: number; last_active_days_ago: number } };
  blended_apy: { total: number; breakdown: { protocol: string; action: string; live_apy: number; allocation_pct: number; contribution: number }[] };
  strategies: { protocol: string; symbol: string; action: string; allocation_pct: number; live_apy: number; sustainable_apy?: number | null; url: string | null; why: string; fit_score: number }[];
  current_holdings: { mnt: string; meth: string; cmeth: string; usdt: string; usdc: string; token_balances: { symbol: string; name: string; amount: number; address: string }[]; aave_supplied: string; aave_health_factor: string | null; lp_positions: number };
  risks: { risk: string; evidence: string; severity: "low" | "medium" | "high" }[];
  confidence: { level: "low" | "medium" | "high"; reason: string };
  onboarding_message: string | null;
  risk_profile?: { label: string; score: number; drivers: string };
}

interface ApiResponse {
  state: "empty" | "no_yield" | "thin_history" | "full";
  error?: string;
  message?: string;
  profile?: AnalysisResult["profile"];
  blended_apy?: AnalysisResult["blended_apy"];
  strategies?: AnalysisResult["strategies"];
  current_holdings?: AnalysisResult["current_holdings"];
  risks?: AnalysisResult["risks"];
  confidence?: AnalysisResult["confidence"];
  onboarding_message?: string | null;
  risk_profile?: AnalysisResult["risk_profile"];
}

type AppStage = "input" | "questions" | "loading" | "results";

const steps = ["Scanning wallet...", "Fetching on-chain history...", "Analyzing protocols...", "Generating insights..."];

function formatAmount(value: string | number): string {
  const numeric = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numeric)) {
    return "0";
  }

  return numeric.toFixed(2).replace(/\.?0+$/, "");
}

function formatPercent(value: number): string {
  return formatAmount(value);
}

function formatRiskEvidence(evidence: string): string {
  const parts = evidence.split(": ");
  if (parts.length > 1) {
    const trailing = parts.slice(1).join(": ");
    if (/(history\.|positions\.|aave\.)/i.test(trailing)) {
      return parts[0];
    }
  }

  return evidence;
}

function isValidWalletAddress(value: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(value.trim());
}

export default function AnalyzePage() {
  const [darkMode, setDarkMode] = useState(false);
  const [address, setAddress] = useState("");
  const [appStage, setAppStage] = useState<AppStage>("input");
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [riskAnswers, setRiskAnswers] = useState<RiskAnswers | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletState, setWalletState] = useState<string | null>(null);
  const [emptyMessage, setEmptyMessage] = useState<string | null>(null);

  const colors = darkMode
    ? {
        bg: "#0a0a0a",
        bgSecondary: "#1a1a1a",
        panel: "#141414",
        elevated: "#202020",
        text: "#fff",
        textMuted: "#888",
        accent: "#ff6b35",
        accentSoft: "rgba(255,107,53,0.14)",
        border: "#333",
      }
    : {
        bg: "#fff",
        bgSecondary: "#f5f5f5",
        panel: "#fafafa",
        elevated: "#ffffff",
        text: "#1a1a2e",
        textMuted: "#666",
        accent: "#ff6b35",
        accentSoft: "rgba(255,107,53,0.10)",
        border: "#e5e5e5",
      };

  useEffect(() => {
    if (!loading) {
      return;
    }

    const interval = window.setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 900);

    return () => window.clearInterval(interval);
  }, [loading]);

  const startAnalysis = async (walletAddress: string, answers: RiskAnswers) => {
    setLoading(true);
    setAppStage("loading");
    setResult(null);
    setError(null);
    setWalletState(null);
    setEmptyMessage(null);
    setCurrentStep(0);

    const apiResponse = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address: walletAddress, riskAnswers: answers }),
    });

    let data: ApiResponse;
    try {
      if (!apiResponse.ok) {
        throw new Error("Analysis failed. Please try again.");
      }
      data = await apiResponse.json();
      if (data.error) {
        throw new Error(data.error);
      }
    } catch (err) {
      setLoading(false);
      setAppStage("input");
      setError(err instanceof Error ? err.message : "Analysis failed. Please try again.");
      return;
    }

    setLoading(false);

    if (data.state === "empty") {
      setWalletState("empty");
      setEmptyMessage(data.message || "This address has no tokens or activity on Mantle. Bridge assets from Ethereum to get started.");
      setAppStage("input");
      return;
    }

    if (data.state === "no_yield" || data.state === "thin_history" || data.state === "full") {
      setWalletState(data.state);
      setResult({
        profile: data.profile!,
        blended_apy: data.blended_apy!,
        strategies: data.strategies!,
        current_holdings: data.current_holdings!,
        risks: data.risks || [],
        confidence: data.confidence!,
        onboarding_message: data.onboarding_message || null,
        risk_profile: data.risk_profile,
      });
      setAppStage("results");
    }
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedAddress = address.trim();
    if (!trimmedAddress) {
      return;
    }

    if (!isValidWalletAddress(trimmedAddress)) {
      setError("Enter a valid wallet address.");
      setResult(null);
      setWalletState(null);
      setEmptyMessage(null);
      setAppStage("input");
      return;
    }

    setError(null);
    setResult(null);
    setWalletState(null);
    setEmptyMessage(null);
    setRiskAnswers(null);
    setAppStage("questions");
  };

  const handleQuestionsComplete = async (answers: RiskAnswers) => {
    const trimmedAddress = address.trim();
    setRiskAnswers(answers);
    await startAnalysis(trimmedAddress, answers);
  };

  const copyShareLink = () => {
    const shareUrl = `${window.location.origin}/profile/${address}`;
    navigator.clipboard.writeText(shareUrl);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const resetToInput = () => {
    setAppStage("input");
    setLoading(false);
    setResult(null);
    setError(null);
    setWalletState(null);
    setEmptyMessage(null);
    setRiskAnswers(null);
  };

  const isNoYield = walletState === "no_yield";
  const isThinHistory = walletState === "thin_history";
  const profileLabel = isNoYield ? "First-time Farmer" : result?.profile.label;
  const profileEvidence = isNoYield && result
    ? `${formatAmount(result.current_holdings.mnt)} MNT · ${formatAmount(result.current_holdings.meth)} mETH detected · no yield history`
    : result?.profile.evidence;
  const primaryStrategyUrl = result?.strategies?.[0]
    ? result.strategies[0].url || "/analyze"
    : "/analyze";
  const visibleTokenBalances = result
    ? result.current_holdings.token_balances.filter((token) => token.amount > 0)
    : [];
  const namedHoldings = result
    ? [
        { symbol: "MNT", amount: Number(result.current_holdings.mnt || 0) },
        { symbol: "mETH", amount: Number(result.current_holdings.meth || 0) },
        { symbol: "cmETH", amount: Number(result.current_holdings.cmeth || 0) },
        { symbol: "USDT", amount: Number(result.current_holdings.usdt || 0) },
        { symbol: "USDC", amount: Number(result.current_holdings.usdc || 0) },
      ].filter((holding) => holding.amount > 0)
    : [];
  const namedHoldingSymbols = new Set(namedHoldings.map((holding) => holding.symbol.toUpperCase()));
  const extraTokenBalances = visibleTokenBalances.filter((token) => !namedHoldingSymbols.has(token.symbol.toUpperCase()));

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.bg, color: colors.text }}>
      {showToast && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: colors.accent,
            color: "#fff",
            padding: "12px 24px",
            borderRadius: "14px",
            fontSize: "14px",
            fontFamily: "DM Sans, sans-serif",
            fontWeight: 500,
            boxShadow: "0 12px 32px rgba(255, 107, 53, 0.25)",
            zIndex: 1000,
          }}
        >
          ✓ Link copied to clipboard
        </div>
      )}

      <nav className="fixed top-0 left-0 right-0 z-50 border-b" style={{ backgroundColor: colors.bg, borderColor: colors.border }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <BrandMark accent={colors.accent} />
            <span className="font-medium" style={{ fontFamily: "DM Sans, sans-serif" }}>Mantle Yield</span>
          </Link>
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded">{darkMode ? "☀" : "☾"}</button>
        </div>
      </nav>

      <main className="pt-28 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {!result && !error && appStage === "input" && (
            <>
              {walletState === "empty" && (
                <div
                  className="max-w-xl mx-auto p-8 rounded-[28px] text-center mb-8"
                  style={{
                    backgroundColor: colors.panel,
                    border: `1px solid ${colors.border}`,
                    boxShadow: darkMode ? "0 16px 40px rgba(0,0,0,0.22)" : "0 18px 40px rgba(0,0,0,0.06)",
                  }}
                >
                  <div className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center text-2xl" style={{ backgroundColor: colors.bgSecondary, color: colors.accent }}>
                    ↗
                  </div>
                  <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: "DM Sans, sans-serif" }}>Nothing on Mantle yet</h2>
                  <p className="text-sm leading-7 mb-6" style={{ color: colors.textMuted, fontFamily: "Varela Round, sans-serif" }}>
                    {emptyMessage || "This address has no tokens or activity on Mantle. Bridge assets from Ethereum to get started."}
                  </p>
                  <div className="space-y-3">
                    <a
                      href="https://bridge.mantle.xyz"
                      target="_blank"
                      rel="noreferrer"
                      className="block w-full py-3 rounded-lg font-medium text-white"
                      style={{ backgroundColor: colors.accent, fontFamily: "DM Sans, sans-serif" }}
                    >
                      Bridge to Mantle →
                    </a>
                    <button
                      onClick={() => { setAddress(""); setWalletState(null); setEmptyMessage(null); }}
                      className="w-full py-3 rounded-lg text-sm font-medium"
                      style={{ backgroundColor: colors.elevated, color: colors.text, border: `1px solid ${colors.border}` }}
                    >
                      Try another address
                    </button>
                  </div>
                </div>
              )}

              {walletState !== "empty" && (
                <div className="max-w-4xl mx-auto mb-10 text-center">
                  <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-4 text-xs font-medium" style={{ backgroundColor: colors.accentSoft, color: colors.accent, fontFamily: "DM Sans, sans-serif" }}>
                    Mantle wallet intelligence
                  </div>
                  <h1 className="text-4xl font-bold mb-3" style={{ fontFamily: "DM Sans, sans-serif" }}>Analyze a Mantle wallet</h1>
                  <p className="max-w-2xl mx-auto text-sm leading-7" style={{ color: colors.textMuted, fontFamily: "Varela Round, sans-serif" }}>
                    See live holdings, wallet behavior, suggested yield routes, and the reasoning behind each recommendation.
                  </p>
                </div>
              )}
            </>
          )}

          {error && appStage === "input" && walletState !== "empty" && (
            <div className="max-w-xl mx-auto p-5 rounded-2xl mb-6" style={{ backgroundColor: colors.panel, border: `1px solid ${colors.border}` }}>
              <p className="text-sm text-center" style={{ color: colors.text }}>{error}</p>
              <button
                onClick={resetToInput}
                className="block w-full mt-4 py-3 rounded-lg text-sm font-medium"
                style={{ backgroundColor: colors.text, color: colors.bg }}
              >
                Try Again
              </button>
            </div>
          )}

          {appStage === "input" && !loading && !result && walletState !== "empty" && (
            <div className="max-w-4xl mx-auto">
              <div
                className="rounded-[28px] border p-5 md:p-6"
                style={{
                  backgroundColor: colors.panel,
                  borderColor: colors.border,
                  boxShadow: darkMode ? "0 18px 42px rgba(0,0,0,0.22)" : "0 18px 40px rgba(0,0,0,0.05)",
                }}
              >
                <form onSubmit={handleAddressSubmit} className="grid gap-3 md:grid-cols-[minmax(0,1fr)_180px] md:items-center">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Paste a Mantle address — 0x..."
                    className="w-full px-4 py-4 rounded-xl text-sm"
                    style={{ backgroundColor: colors.elevated, color: colors.text, border: `1px solid ${colors.border}`, fontFamily: "DM Sans, sans-serif" }}
                  />
                  <button
                    type="submit"
                    disabled={!address.trim()}
                    className="w-full py-4 rounded-xl font-medium disabled:opacity-50"
                    style={{ backgroundColor: colors.accent, color: "#fff", fontFamily: "DM Sans, sans-serif" }}
                  >
                    Start Analysis
                  </button>
                </form>
                <p className="mt-3 text-xs" style={{ color: colors.textMuted, fontFamily: "Varela Round, sans-serif" }}>
                  Read-only scan. No wallet connection or private keys required.
                </p>
              </div>
            </div>
          )}

          {appStage === "questions" && (
            <RiskQuestions walletAddress={address.trim()} onComplete={handleQuestionsComplete} darkMode={darkMode} />
          )}

          {loading && appStage === "loading" && (
            <div className="py-10 max-w-3xl mx-auto">
              <div
                className="rounded-[28px] border p-8 md:p-10 text-center"
                style={{
                  backgroundColor: colors.panel,
                  borderColor: colors.border,
                  boxShadow: darkMode ? "0 18px 42px rgba(0,0,0,0.22)" : "0 18px 40px rgba(0,0,0,0.05)",
                }}
              >
                <div className="flex justify-center gap-3 mb-8">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-3 h-3 rounded-full transition-all duration-300" style={{ backgroundColor: currentStep > i ? colors.accent : colors.border, transform: currentStep === i ? "scale(1.3)" : "scale(1)" }} />
                  ))}
                </div>
                <p className="text-xs uppercase tracking-[0.18em] mb-3" style={{ color: colors.accent, fontFamily: "DM Sans, sans-serif" }}>Analysis in progress</p>
                <p className="text-2xl font-medium animate-pulse" style={{ color: colors.text, fontFamily: "DM Sans, sans-serif" }}>
                  {steps[currentStep - 1] || "Starting..."}
                </p>
                {address && (
                  <div className="mt-8 text-center">
                    <p className="text-xs mb-2" style={{ color: colors.textMuted }}>Scanning wallet</p>
                    <p className="font-mono text-sm" style={{ color: colors.textMuted }}>{address.slice(0, 6)}...{address.slice(-4)}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {result && !loading && appStage === "results" && (
            <div className="space-y-5">
              <div className="rounded-[28px] border p-6 md:p-7" style={{ backgroundColor: colors.panel, borderColor: colors.border }}>
                <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] mb-3" style={{ color: colors.accent, fontFamily: "DM Sans, sans-serif" }}>Wallet analysis</p>
                    <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: "DM Sans, sans-serif" }}>{profileLabel}</h1>
                    <p className="text-sm leading-7 max-w-2xl" style={{ color: colors.textMuted, fontFamily: "Varela Round, sans-serif" }}>
                      {profileEvidence}
                    </p>
                    {result.risk_profile && (
                      <div className="mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs" style={{ backgroundColor: colors.accentSoft, color: colors.accent }}>
                        {result.risk_profile.label} · {result.risk_profile.score}/6
                      </div>
                    )}
                  </div>
                  <div className="rounded-2xl p-5 text-center" style={{ backgroundColor: colors.accent, color: "#fff" }}>
                    <p className="text-xs uppercase tracking-[0.18em] opacity-80 mb-2">Blended APY</p>
                    <p className="text-5xl font-bold mb-3" style={{ fontFamily: "DM Sans, sans-serif" }}>{formatPercent(result.blended_apy.total)}%</p>
                    <p className="text-xs leading-5 opacity-80">
                      {result.blended_apy.breakdown.map((b) => `${b.protocol} ${formatPercent(b.contribution)}%`).join(" + ")} = {formatPercent(result.blended_apy.total)}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.92fr)] lg:items-start">
                <div className="space-y-5">
                  {isThinHistory && (
                    <div className="p-4 rounded-2xl" style={{ backgroundColor: colors.panel, border: `1px solid ${colors.border}` }}>
                      <p className="text-sm font-medium" style={{ fontFamily: "DM Sans, sans-serif" }}>Early profile · Based on limited activity</p>
                      <p className="text-xs mt-1" style={{ color: colors.textMuted }}>Your recommendations will improve as you interact more with Mantle.</p>
                    </div>
                  )}

                  {isNoYield && result.onboarding_message && (
                    <div className="p-4 rounded-2xl" style={{ backgroundColor: colors.panel, border: `1px solid ${colors.border}` }}>
                      <p className="text-sm">{result.onboarding_message}</p>
                    </div>
                  )}

                  <div className="p-5 rounded-[24px]" style={{ backgroundColor: colors.panel, border: `1px solid ${colors.border}` }}>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <p className="text-xs uppercase tracking-[0.18em]" style={{ color: colors.textMuted, fontFamily: "DM Sans, sans-serif" }}>Current holdings</p>
                      <span className="text-xs" style={{ color: colors.textMuted }}>
                        {namedHoldings.length + extraTokenBalances.length} assets surfaced
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      {namedHoldings.map((holding) => (
                        <span key={holding.symbol} className="px-2.5 py-1.5 rounded-lg text-xs" style={{ backgroundColor: colors.elevated, border: `1px solid ${colors.border}` }}>
                          {formatAmount(holding.amount)} {holding.symbol}
                        </span>
                      ))}
                      {extraTokenBalances.map((token) => (
                        <span key={token.address} className="px-2.5 py-1.5 rounded-lg text-xs" style={{ backgroundColor: colors.elevated, border: `1px solid ${colors.border}` }}>
                          {formatAmount(token.amount)} {token.symbol}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 rounded-[24px]" style={{ backgroundColor: colors.panel, border: `1px solid ${colors.border}` }}>
                    <p className="text-xs uppercase tracking-[0.18em] mb-2" style={{ color: colors.textMuted, fontFamily: "DM Sans, sans-serif" }}>Profile rationale</p>
                    <p className="text-sm leading-7" style={{ color: colors.textMuted }}>{result.strategies[0]?.why}</p>
                    {!isNoYield && (
                      <div className="mt-4 pt-4" style={{ borderColor: colors.border, borderTop: "1px solid" }}>
                        <span className="text-xs">
                          Confidence:{" "}
                          <span style={{ color: result.confidence.level === "high" ? "#10b981" : "#f59e0b", textTransform: "capitalize" }}>
                            {result.confidence.level}
                          </span>
                          {" "}· {result.confidence.reason}
                        </span>
                      </div>
                    )}
                    {result.risk_profile && (
                      <div className="mt-4 pt-4" style={{ borderColor: colors.border, borderTop: "1px solid" }}>
                        <span className="text-xs">
                          Risk profile: <span style={{ color: colors.accent, textTransform: "capitalize" }}>{result.risk_profile.label}</span> · {result.risk_profile.drivers}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-6 rounded-[24px]" style={{ backgroundColor: colors.panel, border: `1px solid ${colors.border}` }}>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <p className="text-xs uppercase tracking-[0.18em]" style={{ color: colors.textMuted, fontFamily: "DM Sans, sans-serif" }}>Recommended strategy</p>
                      <span className="text-xs" style={{ color: colors.textMuted }}>{isNoYield ? "Up to 2 options" : `${result.strategies.length} options`}</span>
                    </div>
                    <div className="space-y-3">
                      {result.strategies.slice(0, isNoYield ? 2 : result.strategies.length).map((rec, i) => (
                        <div key={i} className="p-4 rounded-2xl" style={{ backgroundColor: colors.elevated, border: `1px solid ${colors.border}` }}>
                          <div className="flex justify-between items-start gap-4 mb-2">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-medium text-sm" style={{ fontFamily: "DM Sans, sans-serif" }}>{rec.protocol}</span>
                                <span className="px-2 py-1 rounded-full text-[10px]" style={{ backgroundColor: colors.accentSoft, color: colors.accent }}>{rec.action}</span>
                              </div>
                              <p className="text-xs mt-1" style={{ color: colors.textMuted }}>{rec.symbol}</p>
                            </div>
                            <div className="text-right">
                              <span className="block font-bold text-sm" style={{ color: colors.accent }}>{formatPercent(rec.allocation_pct)}%</span>
                              <span className="text-xs" style={{ color: colors.textMuted }}>{formatPercent(rec.live_apy)}% live APY</span>
                            </div>
                          </div>
                          {!isNoYield && (
                            <div className="flex items-center gap-2 mt-2">
                              <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: colors.border }}>
                                <div className="h-full rounded-full" style={{ width: `${(rec.fit_score / 10) * 100}%`, backgroundColor: rec.fit_score >= 7 ? "#10b981" : "#f59e0b" }} />
                              </div>
                              <span className="text-xs" style={{ color: colors.textMuted }}>{rec.fit_score}/10 fit</span>
                            </div>
                          )}
                          <p className="text-xs mt-3 leading-6" style={{ color: colors.textMuted }}>{rec.why}</p>
                          {rec.url && (
                            <div className="mt-3 text-right">
                              <a href={rec.url} target="_blank" rel="noreferrer" className="font-medium" style={{ color: colors.accent, fontSize: "12px" }}>
                                Start earning →
                              </a>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-5 lg:sticky lg:top-28">
                  <div className="p-5 rounded-[24px]" style={{ backgroundColor: colors.panel, border: `1px solid ${colors.border}` }}>
                    <p className="text-xs uppercase tracking-[0.18em] mb-4" style={{ color: colors.textMuted, fontFamily: "DM Sans, sans-serif" }}>Risks for your wallet</p>
                    <div className="space-y-3">
                      {result.risks.slice(0, isNoYield ? 2 : result.risks.length).map((risk, i) => (
                        <div key={i} className="p-4 rounded-2xl" style={{ backgroundColor: colors.elevated, border: `1px solid ${colors.border}` }}>
                          <div className="flex items-center justify-between gap-3 mb-2">
                            <p className="text-sm font-medium">{risk.risk}</p>
                            <span
                              className="px-2 py-1 rounded text-[10px] uppercase tracking-wide"
                              style={{
                                backgroundColor: risk.severity === "high" ? "#fee2e2" : risk.severity === "medium" ? "#fef3c7" : "#dcfce7",
                                color: risk.severity === "high" ? "#b91c1c" : risk.severity === "medium" ? "#b45309" : "#15803d",
                              }}
                            >
                              {risk.severity}
                            </span>
                          </div>
                          <p className="text-xs leading-5" style={{ color: colors.textMuted }}>
                            {formatRiskEvidence(risk.evidence)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 rounded-[24px]" style={{ backgroundColor: colors.panel, border: `1px solid ${colors.border}` }}>
                    <div className="flex flex-col gap-3">
                      {isNoYield ? (
                        <a href={primaryStrategyUrl} target="_blank" rel="noreferrer" className="w-full py-3.5 rounded-xl text-sm font-medium text-center" style={{ backgroundColor: colors.accent, color: "#fff" }}>
                          Start Earning →
                        </a>
                      ) : (
                        <button onClick={copyShareLink} className="w-full py-3.5 rounded-xl text-sm font-medium" style={{ backgroundColor: colors.elevated, color: colors.text, border: `1px solid ${colors.border}` }}>
                          Share My Profile ↗
                        </button>
                      )}
                      <button onClick={() => { resetToInput(); setAddress(""); }} className="w-full py-3.5 rounded-xl text-sm font-medium" style={{ backgroundColor: colors.elevated, color: colors.text, border: `1px solid ${colors.border}` }}>
                        Analyze Another →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
