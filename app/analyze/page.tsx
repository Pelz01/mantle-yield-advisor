"use client";

import { useState } from "react";
import Link from "next/link";
import BrandMark from "@/components/BrandMark";

interface AnalysisResult {
  profile: { label: string; evidence: string; stats: { total_transactions: number; protocols_used: number; longest_position_days: number; last_active_days_ago: number } };
  blended_apy: { total: number; breakdown: { protocol: string; action: string; live_apy: number; allocation_pct: number; contribution: number }[] };
  strategies: { protocol: string; action: string; allocation_pct: number; live_apy: number; why: string; fit_score: number }[];
  current_holdings: { mnt: string; meth: string; cmeth: string; usdt: string; usdc: string; aave_supplied: string; aave_health_factor: string | null; lp_positions: number };
  risks: { risk: string; evidence: string; severity: "low" | "medium" | "high" }[];
  confidence: { level: "low" | "medium" | "high"; reason: string };
  onboarding_message: string | null;
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
}

const steps = ["Scanning wallet...", "Fetching on-chain history...", "Analyzing protocols...", "Generating insights...", "Done"];
const PROTOCOL_URLS: Record<string, string> = {
  "mETH": "https://meth.mantle.xyz",
  "cmETH": "https://www.mantle.xyz/ecosystem/cmeth",
  "Aave": "https://app.aave.com",
  "Aave V3": "https://app.aave.com",
  "Merchant Moe": "https://merchantmoe.com",
  "AGNI": "https://app.agni.finance",
  "AGNI Finance": "https://app.agni.finance",
  "INIT Capital": "https://app.init.capital",
  "Lendle": "https://lendle.xyz",
};

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

export default function AnalyzePage() {
  const [darkMode, setDarkMode] = useState(false);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletState, setWalletState] = useState<string | null>(null);
  const [emptyMessage, setEmptyMessage] = useState<string | null>(null);

  const colors = darkMode 
    ? { bg: "#0a0a0a", bgSecondary: "#1a1a1a", text: "#fff", textMuted: "#888", accent: "#ff6b35", border: "#333" }
    : { bg: "#fff", bgSecondary: "#f5f5f5", text: "#1a1a2e", textMuted: "#666", accent: "#ff6b35", border: "#e5e5e5" };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;
    
    setLoading(true);
    setResult(null);
    setError(null);
    setWalletState(null);
    setEmptyMessage(null);
    setCurrentStep(0);

    // Start animation loop
    const animationPromise = (async () => {
      for (let i = 0; i < steps.length; i++) {
        await new Promise(r => setTimeout(r, 800));
        setCurrentStep(i + 1);
      }
    })();

    // Start API call in parallel
    const apiPromise = fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: address.trim() })
    }).then(async (res) => {
      if (!res.ok) {
        throw new Error('Analysis failed. Please try again.');
      }
      const data: ApiResponse = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      return data;
    });

    // Wait for both animation AND API
    const [_, apiResponse] = await Promise.all([animationPromise, apiPromise]);
    
    setLoading(false);

    // Handle states
    if (apiResponse.state === 'empty') {
      setWalletState('empty');
      setEmptyMessage(apiResponse.message || "This address has no tokens or activity on Mantle. Bridge assets from Ethereum to get started.");
      return;
    }

    if (apiResponse.state === 'no_yield' || apiResponse.state === 'thin_history' || apiResponse.state === 'full') {
      setWalletState(apiResponse.state);
      setResult({
        profile: apiResponse.profile!,
        blended_apy: apiResponse.blended_apy!,
        strategies: apiResponse.strategies!,
        current_holdings: apiResponse.current_holdings!,
        risks: apiResponse.risks || [],
        confidence: apiResponse.confidence!,
        onboarding_message: apiResponse.onboarding_message || null,
      });
    }
  };

  const copyShareLink = () => {
    const shareUrl = `${window.location.origin}/profile/${address}`;
    navigator.clipboard.writeText(shareUrl);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const isNoYield = walletState === "no_yield";
  const isThinHistory = walletState === "thin_history";
  const profileLabel = isNoYield ? "First-time Farmer" : result?.profile.label;
  const profileEvidence = isNoYield && result
    ? `${formatAmount(result.current_holdings.mnt)} MNT · ${formatAmount(result.current_holdings.meth)} mETH detected · no yield history`
    : result?.profile.evidence;
  const primaryStrategyUrl = result?.strategies?.[0]
    ? PROTOCOL_URLS[result.strategies[0].protocol] || "/analyze"
    : "/analyze";

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.bg, color: colors.text, overflowY: 'auto' }}>
      {showToast && (
        <div style={{ position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)', backgroundColor: colors.accent, color: '#fff', padding: '12px 24px', borderRadius: '12px', fontSize: '14px', fontFamily: 'DM Sans, sans-serif', fontWeight: 500, boxShadow: '0 8px 32px rgba(255, 107, 53, 0.3)', zIndex: 1000 }}>
          ✓ Link copied to clipboard
        </div>
      )}

      <nav className="fixed top-0 left-0 right-0 z-50 border-b" style={{ backgroundColor: colors.bg, borderColor: colors.border }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <BrandMark accent={colors.accent} />
            <span className="font-medium" style={{ fontFamily: 'DM Sans, sans-serif' }}>Mantle Yield</span>
          </Link>
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded">{darkMode ? '☀' : '☾'}</button>
        </div>
      </nav>

      <main className="pt-28 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          {!result && !error && (
            <>
              {walletState === "empty" && (
                <div className="max-w-xl mx-auto p-6 rounded-2xl text-center mb-8" style={{ backgroundColor: colors.bgSecondary, border: `1px solid ${colors.border}` }}>
                  <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl" style={{ backgroundColor: colors.bg, color: colors.accent }}>
                    ↗
                  </div>
                  <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'DM Sans, sans-serif' }}>Nothing on Mantle yet</h2>
                  <p className="text-sm mb-5" style={{ color: colors.textMuted, fontFamily: 'Varela Round, sans-serif' }}>
                    {emptyMessage || "This address has no tokens or activity on Mantle. Bridge assets from Ethereum to get started."}
                  </p>
                  <div className="space-y-3">
                    <a
                      href="https://bridge.mantle.xyz"
                      target="_blank"
                      rel="noreferrer"
                      className="block w-full py-3 rounded-lg font-medium text-white"
                      style={{ backgroundColor: colors.accent, fontFamily: 'DM Sans, sans-serif' }}
                    >
                      Bridge to Mantle →
                    </a>
                    <button
                      onClick={() => { setAddress(""); setWalletState(null); setEmptyMessage(null); }}
                      className="w-full py-3 rounded-lg text-sm font-medium"
                      style={{ backgroundColor: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}
                    >
                      Try another address
                    </button>
                  </div>
                </div>
              )}

              {walletState !== "empty" && (
            <div className="text-center mb-8 max-w-xl mx-auto">
              <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>Analyze Wallet</h1>
              <p style={{ color: colors.textMuted, fontFamily: 'Varela Round, sans-serif' }}>Enter your Mantle address</p>
            </div>
              )}
            </>
          )}

          {error && walletState !== "empty" && (
            <div className="max-w-xl mx-auto p-4 rounded-xl mb-6" style={{ backgroundColor: colors.bgSecondary, border: `1px solid ${colors.border}` }}>
              <p className="text-sm text-center" style={{ color: colors.text }}>{error}</p>
              <button onClick={() => { setError(null); setResult(null); setWalletState(null); setEmptyMessage(null); }} className="block w-full mt-3 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: colors.text, color: colors.bg }}>Try Again</button>
            </div>
          )}

          {!loading && !result && !error && walletState !== "empty" && (
            <form onSubmit={handleAnalyze} className="mb-8 max-w-xl mx-auto">
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="0x..." className="w-full px-4 py-3 rounded-lg text-sm mb-3" style={{ backgroundColor: colors.bgSecondary, color: colors.text, border: `1px solid ${colors.border}`, fontFamily: 'DM Sans, sans-serif' }} />
              <button type="submit" disabled={!address.trim()} className="w-full py-3 rounded-lg font-medium disabled:opacity-50" style={{ backgroundColor: colors.accent, color: '#fff', fontFamily: 'DM Sans, sans-serif' }}>Start Analysis</button>
            </form>
          )}

          {loading && (
            <div className="py-12 max-w-xl mx-auto">
              <div className="flex justify-center gap-3 mb-8">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-3 h-3 rounded-full transition-all duration-300" style={{ backgroundColor: currentStep > i ? colors.accent : colors.border, transform: currentStep === i ? 'scale(1.3)' : 'scale(1)' }} />
                ))}
              </div>
              <div className="text-center">
                <p className="text-lg font-medium animate-pulse" style={{ color: colors.text, fontFamily: 'Varela Round, sans-serif' }}>{steps[currentStep - 1] || "Starting..."}</p>
              </div>
              {address && <div className="mt-8 text-center"><p className="text-xs mb-2" style={{ color: colors.textMuted }}>Scanning</p><p className="font-mono text-sm" style={{ color: colors.textMuted }}>{address.slice(0, 6)}...{address.slice(-4)}</p></div>}
            </div>
          )}

          {result && !loading && (
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.9fr)] lg:items-start">
              <div className="space-y-4">
              {isThinHistory && (
                <div className="p-4 rounded-xl" style={{ backgroundColor: colors.bgSecondary, border: `1px solid ${colors.border}` }}>
                  <p className="text-sm font-medium" style={{ fontFamily: 'DM Sans, sans-serif' }}>Early profile · Based on limited activity</p>
                  <p className="text-xs mt-1" style={{ color: colors.textMuted }}>Your recommendations will improve as you interact more with Mantle.</p>
                </div>
              )}

              {isNoYield && result.onboarding_message && (
                <div className="p-4 rounded-xl" style={{ backgroundColor: colors.bgSecondary, border: `1px solid ${colors.border}` }}>
                  <p className="text-sm">{result.onboarding_message}</p>
                </div>
              )}

              <div className="p-4 rounded-xl" style={{ backgroundColor: colors.bgSecondary }}>
                <p className="text-xs mb-2" style={{ color: colors.textMuted }}>Currently Holding</p>
                <div className="flex flex-wrap gap-2">
                  {result.current_holdings.mnt !== "0" && <span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: colors.bg }}>{formatAmount(result.current_holdings.mnt)} MNT</span>}
                  {result.current_holdings.meth !== "0" && <span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: colors.bg }}>{formatAmount(result.current_holdings.meth)} mETH</span>}
                  {result.current_holdings.cmeth !== "0" && <span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: colors.bg }}>{formatAmount(result.current_holdings.cmeth)} cmETH</span>}
                  {result.current_holdings.usdt !== "0" && <span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: colors.bg }}>{formatAmount(result.current_holdings.usdt)} USDT</span>}
                  {result.current_holdings.usdc !== "0" && <span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: colors.bg }}>{formatAmount(result.current_holdings.usdc)} USDC</span>}
                </div>
              </div>

              <div className="p-5 rounded-xl" style={{ backgroundColor: colors.bgSecondary }}>
                <p className="text-xs mb-1" style={{ color: colors.textMuted }}>Your DeFi Profile</p>
                <h2 className="text-xl font-bold mb-1">{profileLabel}</h2>
                <p className="text-xs mb-2" style={{ color: colors.accent }}>{profileEvidence}</p>
                <p className="text-sm" style={{ color: colors.textMuted }}>{result.strategies[0]?.why}</p>
                {!isNoYield && (
                  <div className="mt-3 pt-3" style={{ borderColor: colors.border, borderTop: '1px solid' }}>
                    <span className="text-xs">Confidence: <span style={{ color: result.confidence.level === 'high' ? '#10b981' : '#f59e0b' }}>{result.confidence.level}</span> · {result.confidence.reason}</span>
                  </div>
                )}
              </div>

              <div className="p-5 rounded-xl text-center" style={{ backgroundColor: colors.accent, color: '#fff' }}>
                <p className="text-xs opacity-80 mb-1">Blended APY</p>
                <p className="text-4xl font-bold mb-2">{formatPercent(result.blended_apy.total)}%</p>
                <p className="text-xs opacity-80">{result.blended_apy.breakdown.map((b) => `${b.protocol} ${formatPercent(b.contribution)}%`).join(' + ')} = {formatPercent(result.blended_apy.total)}%</p>
              </div>

              <div className="p-5 rounded-xl" style={{ backgroundColor: colors.bgSecondary }}>
                <p className="text-xs mb-3" style={{ color: colors.textMuted }}>Strategy</p>
                <div className="space-y-3">
                  {result.strategies.slice(0, isNoYield ? 2 : result.strategies.length).map((rec, i) => (
                    <div key={i} className="p-3 rounded-lg" style={{ backgroundColor: colors.bg }}>
                      <div className="flex justify-between items-start mb-1">
                        <div><span className="font-medium text-sm">{rec.protocol}</span><span className="text-xs ml-2" style={{ color: colors.textMuted }}>{rec.action}</span></div>
                        <div className="text-right"><span className="font-bold text-sm" style={{ color: colors.accent }}>{formatPercent(rec.allocation_pct)}%</span><span className="text-xs ml-1" style={{ color: colors.textMuted }}>{formatPercent(rec.live_apy)}%</span></div>
                      </div>
                      {!isNoYield && (
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: colors.border }}><div className="h-full rounded-full" style={{ width: `${(rec.fit_score / 10) * 100}%`, backgroundColor: rec.fit_score >= 7 ? '#10b981' : '#f59e0b' }} /></div>
                          <span className="text-xs" style={{ color: colors.textMuted }}>{rec.fit_score}/10 fit</span>
                        </div>
                      )}
                      <p className="text-xs mt-2" style={{ color: colors.textMuted }}>→ {rec.why}</p>
                    </div>
                  ))}
                </div>
              </div>
              </div>

              <div className="space-y-4 lg:sticky lg:top-28">
                <div className="p-4 rounded-xl" style={{ backgroundColor: colors.bgSecondary }}>
                  <p className="text-xs mb-3" style={{ color: colors.textMuted }}>Risks for your wallet</p>
                  <div className="space-y-3">
                    {result.risks.slice(0, isNoYield ? 2 : result.risks.length).map((risk, i) => (
                      <div key={i} className="p-3 rounded-lg" style={{ backgroundColor: colors.bg }}>
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <p className="text-sm font-medium">{risk.risk}</p>
                          <span
                            className="px-2 py-1 rounded text-[10px] uppercase tracking-wide"
                            style={{
                              backgroundColor: risk.severity === "high" ? "#fee2e2" : risk.severity === "medium" ? "#fef3c7" : "#dcfce7",
                              color: risk.severity === "high" ? "#b91c1c" : risk.severity === "medium" ? "#b45309" : "#15803d"
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

                <div className="flex flex-col gap-2 pt-2">
                  {isNoYield ? (
                    <a href={primaryStrategyUrl} target="_blank" rel="noreferrer" className="w-full py-3 rounded-lg text-sm font-medium text-center" style={{ backgroundColor: colors.accent, color: '#fff' }}>Start Earning →</a>
                  ) : (
                    <button onClick={copyShareLink} className="w-full py-3 rounded-lg text-sm font-medium" style={{ backgroundColor: colors.bgSecondary, color: colors.text, border: `1px solid ${colors.border}` }}>Share My Profile ↗</button>
                  )}
                  <button onClick={() => { setResult(null); setAddress(""); setError(null); setWalletState(null); }} className="w-full py-3 rounded-lg text-sm font-medium" style={{ backgroundColor: colors.bgSecondary, color: colors.text, border: `1px solid ${colors.border}` }}>Analyze Another →</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <style jsx>{`
        @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
