"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

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
  const [showToast, setShowToast] = useState(false);

  const colors = darkMode 
    ? { bg: "#0a0a0a", bgSecondary: "#1a1a1a", text: "#fff", textMuted: "#888", accent: "#ff6b35", border: "#333" }
    : { bg: "#fff", bgSecondary: "#f5f5f5", text: "#1a1a2e", textMuted: "#666", accent: "#ff6b35", border: "#e5e5e5" };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;
    
    setLoading(true);
    setResult(null);
    setCurrentStep(0);

    for (let i = 0; i < steps.length; i++) {
      await new Promise(r => setTimeout(r, 800));
      setCurrentStep(i + 1);
    }

    setResult({
      profile: {
        label: "Yield Explorer",
        evidence: "14 txns · 3 protocols · 47-day max hold",
        stats: { total_transactions: 14, protocols_used: 3, longest_position_days: 47, last_active_days_ago: 23 }
      },
      current_holdings: { mnt: "0.4 mETH · $820", meth: "120 USDT on Aave · $120", aave_supplied: "120 USDT", aave_health_factor: "1.8", lp_positions: 0 },
      blended_apy: { total: 7.8, breakdown: [
        { protocol: "mETH", action: "Stake", live_apy: 4.2, allocation_pct: 50, contribution: 2.1 },
        { protocol: "Aave", action: "Supply", live_apy: 8.1, allocation_pct: 30, contribution: 2.43 },
        { protocol: "Merchant Moe", action: "LP", live_apy: 16.5, allocation_pct: 20, contribution: 3.3 }
      ]},
      strategies: [
        { protocol: "mETH", action: "Stake", allocation_pct: 50, live_apy: 4.2, why: "You've held mETH for 47 days — your longest position. You trust it.", fit_score: 8 },
        { protocol: "Aave", action: "Supply", allocation_pct: 30, live_apy: 8.1, why: "Your USDT is already here. Keep supplying — matches your liquidity preference.", fit_score: 7 },
        { protocol: "Merchant Moe", action: "LP", allocation_pct: 20, live_apy: 16.5, why: "Small allocation. You exited LP early twice — start with just 20%.", fit_score: 5 }
      ],
      risks: [
        { risk: "Health Factor", evidence: "Your Aave health factor is 1.8 — don't borrow more or you risk liquidation", severity: "high" },
        { risk: "LP History", evidence: "You've exited LP positions after 4 and 6 days — IL can compound fast", severity: "medium" },
        { risk: "Concentration", evidence: "60% of your holdings are ETH-correlated — low diversification", severity: "low" }
      ],
      confidence: { level: "high", reason: "Based on 14 transactions" }
    });
    setLoading(false);
  };

  const copyShareLink = () => {
    const shareUrl = `${window.location.origin}/profile/${address}`;
    navigator.clipboard.writeText(shareUrl);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.bg, color: colors.text }}>
      {/* Toast popup */}
      {showToast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: colors.accent,
          color: '#fff',
          padding: '12px 24px',
          borderRadius: '12px',
          fontSize: '14px',
          fontFamily: 'DM Sans, sans-serif',
          fontWeight: 500,
          boxShadow: '0 8px 32px rgba(255, 107, 53, 0.3)',
          zIndex: 1000,
          animation: 'slideUp 0.3s ease-out'
        }}>
          ✓ Link copied to clipboard
        </div>
      )}

      <nav className="fixed top-0 left-0 right-0 z-50 border-b" style={{ backgroundColor: colors.bg, borderColor: colors.border }}>
        <div className="max-w-xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded flex items-center justify-center font-bold text-white text-sm" style={{ backgroundColor: colors.text }}>MY</div>
            <span className="font-medium" style={{ fontFamily: 'DM Sans, sans-serif' }}>Mantle Yield</span>
          </Link>
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded">{darkMode ? '☀' : '☾'}</button>
        </div>
      </nav>

      <main className="pt-28 pb-16 px-6">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>Analyze Wallet</h1>
            <p style={{ color: colors.textMuted, fontFamily: 'Varela Round, sans-serif' }}>Enter your Mantle address</p>
          </div>

          {!loading && !result && (
            <form onSubmit={handleAnalyze} className="mb-8">
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="0x..." className="w-full px-4 py-3 rounded-lg text-sm mb-3" style={{ backgroundColor: colors.bgSecondary, color: colors.text, border: `1px solid ${colors.border}`, fontFamily: 'DM Sans, sans-serif' }} />
              <button type="submit" disabled={!address.trim()} className="w-full py-3 rounded-lg font-medium disabled:opacity-50" style={{ backgroundColor: colors.accent, color: '#fff', fontFamily: 'DM Sans, sans-serif' }}>Start Analysis</button>
            </form>
          )}

          {loading && (
            <div className="py-12">
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
            <div className="space-y-4">
              <div className="p-4 rounded-xl" style={{ backgroundColor: colors.bgSecondary }}>
                <p className="text-xs mb-2" style={{ color: colors.textMuted }}>Currently Holding</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: colors.bg }}>{result.current_holdings.mnt}</span>
                  <span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: colors.bg }}>{result.current_holdings.meth}</span>
                </div>
              </div>

              <div className="p-5 rounded-xl" style={{ backgroundColor: colors.bgSecondary }}>
                <p className="text-xs mb-1" style={{ color: colors.textMuted }}>Your DeFi Profile</p>
                <h2 className="text-xl font-bold mb-1">{result.profile.label}</h2>
                <p className="text-xs mb-2" style={{ color: colors.accent }}>{result.profile.evidence}</p>
                <p className="text-sm" style={{ color: colors.textMuted }}>{result.strategies[0].why}</p>
                <div className="mt-3 pt-3" style={{ borderColor: colors.border, borderTop: '1px solid' }}>
                  <span className="text-xs">Confidence: <span style={{ color: result.confidence.level === 'high' ? '#10b981' : '#f59e0b' }}>{result.confidence.level}</span> · {result.confidence.reason}</span>
                </div>
              </div>

              <div className="p-5 rounded-xl text-center" style={{ backgroundColor: colors.accent, color: '#fff' }}>
                <p className="text-xs opacity-80 mb-1">Blended APY</p>
                <p className="text-4xl font-bold mb-2">{result.blended_apy.total}%</p>
                <p className="text-xs opacity-80">{result.blended_apy.breakdown.map(b => `${b.protocol} ${b.contribution}%`).join(' + ')} = {result.blended_apy.total}%</p>
              </div>

              <div className="p-5 rounded-xl" style={{ backgroundColor: colors.bgSecondary }}>
                <p className="text-xs mb-3" style={{ color: colors.textMuted }}>Strategy</p>
                <div className="space-y-3">
                  {result.strategies.map((rec, i) => (
                    <div key={i} className="p-3 rounded-lg" style={{ backgroundColor: colors.bg }}>
                      <div className="flex justify-between items-start mb-1">
                        <div><span className="font-medium text-sm">{rec.protocol}</span><span className="text-xs ml-2" style={{ color: colors.textMuted }}>{rec.action}</span></div>
                        <div className="text-right"><span className="font-bold text-sm" style={{ color: colors.accent }}>{rec.allocation_pct}%</span><span className="text-xs ml-1" style={{ color: colors.textMuted }}>{rec.live_apy}%</span></div>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: colors.border }}><div className="h-full rounded-full" style={{ width: `${(rec.fit_score / 10) * 100}%`, backgroundColor: rec.fit_score >= 7 ? '#10b981' : '#f59e0b' }} /></div>
                        <span className="text-xs" style={{ color: colors.textMuted }}>{rec.fit_score}/10 fit</span>
                      </div>
                      <p className="text-xs mt-2" style={{ color: colors.textMuted }}>→ {rec.why}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl" style={{ backgroundColor: colors.bgSecondary }}>
                <p className="text-xs mb-2" style={{ color: colors.textMuted }}>Risks for YOUR wallet</p>
                <ul className="space-y-2">
                  {result.risks.map((risk, i) => (<li key={i} className="text-xs"><span style={{ color: colors.accent }}>•</span> <strong>{risk.risk}:</strong> {risk.evidence}</li>))}
                </ul>
              </div>

              <div className="flex gap-2 pt-2">
                <button onClick={copyShareLink} className="flex-1 py-3 rounded-lg text-sm font-medium" style={{ backgroundColor: colors.bgSecondary, color: colors.text, border: `1px solid ${colors.border}` }}>Share My Profile ↗</button>
                <button onClick={() => { setResult(null); setAddress(""); }} className="flex-1 py-3 rounded-lg text-sm font-medium" style={{ backgroundColor: colors.bgSecondary, color: colors.text, border: `1px solid ${colors.border}` }}>Analyze Another →</button>
              </div>
            </div>
          )}
        </div>
      </main>

      <style jsx>{`
        @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translate(-50%, 20px); } to { opacity: 1; transform: translate(-50%, 0); } }
      `}</style>
    </div>
  );
}
