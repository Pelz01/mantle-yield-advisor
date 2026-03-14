import { ethers, utils } from "ethers";
import { WalletHistory } from "./history";
import { WalletPositions } from "./positions";
import { AaveData } from "./aave";
import { MantlePool } from "./yields";

const POLLINATIONS_API_KEY = process.env.POLLINATIONS_API_KEY || '';

interface Profile {
  label: string;
  evidence: string;
  stats: {
    total_transactions: number;
    protocols_used: number;
    longest_position_days: number;
    last_active_days_ago: number;
  };
}

interface BlendedAPY {
  total: number;
  breakdown: {
    protocol: string;
    action: string;
    live_apy: number;
    allocation_pct: number;
    contribution: number;
  }[];
}

interface Strategy {
  protocol: string;
  action: string;
  allocation_pct: number;
  live_apy: number;
  why: string;
  fit_score: number;
}

interface CurrentHoldings {
  mnt: string;
  meth: string;
  cmeth: string;
  usdt: string;
  usdc: string;
  aave_supplied: string;
  aave_health_factor: string | null;
  lp_positions: number;
}

interface Risk {
  risk: string;
  evidence: string;
  severity: "low" | "medium" | "high";
}

interface Confidence {
  level: "low" | "medium" | "high";
  reason: string;
}

export interface AnalysisResult {
  profile: Profile;
  blended_apy: BlendedAPY;
  strategies: Strategy[];
  current_holdings: CurrentHoldings;
  risks: Risk[];
  confidence: Confidence;
  onboarding_message: string | null;
}

export interface WalletData {
  address: string;
  history: WalletHistory;
  positions: WalletPositions;
  aave: AaveData;
  mantleYields: MantlePool[];
  state: "empty" | "no_yield" | "thin_history" | "full";
}

export async function analyzeWallet(data: WalletData): Promise<AnalysisResult> {
  const prompt = buildPrompt(data);

  try {
    const response = await fetch("https://gen.pollinations.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${POLLINATIONS_API_KEY}`,
      },
      body: JSON.stringify({
        model: "minimax",
        messages: [
          {
            role: "system",
            content: `You are MantleYield IQ, a DeFi yield advisor for Mantle Network. You analyze real on-chain wallet data and produce personalized yield strategy recommendations.

RULES (all mandatory):
1. Every claim must cite specific evidence from wallet data provided.
2. APY honesty — three cases:
   a) apyBreakdownKnown=true, hasIncentives=false: present sustainableApy directly
   b) apyBreakdownKnown=true, hasIncentives=true: disclose reward APY may end
   c) apyBreakdownKnown=false: say you cannot separate sustainable from incentivized
3. isLp=true pools carry IL risk — flag if wallet has early LP exits in history.
4. Never recommend borrowing to wallets with no borrow history.
5. If state is 'no_yield': only recommend single-exposure pools (isLp=false), max 2 recommendations, use encouraging plain language.
6. If state is 'thin_history': set confidence to low and explain why.
7. Respond ONLY in valid JSON.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Pollinations API error: ${response.status}`);
    }

    const result = await response.json();
    const text = result.choices?.[0]?.message?.content || '';
    return parseAIResponse(text, data.state);
  } catch (error) {
    console.error("Error calling AI API:", error);
    return getFallbackAnalysis(data);
  }
}

function buildPrompt(data: WalletData): string {
  const topPools = data.mantleYields.slice(0, 15).map((p) => ({
    protocol: p.displayName,
    symbol: p.symbol,
    tvl: p.tvlUsd,
    apy: p.apy,
    sustainableApy: p.sustainableApy,
    isLp: p.isLp,
    hasIncentives: p.hasIncentives,
    apyBreakdownKnown: p.apyBreakdownKnown,
  }));

  return `Analyze this Mantle wallet and return a yield strategy recommendation.

WALLET ADDRESS: ${data.address}

DETECTED STATE: ${data.state}

ON-CHAIN HISTORY:
${JSON.stringify(data.history, null, 2)}

CURRENT TOKEN POSITIONS:
${JSON.stringify(data.positions, null, 2)}

AAVE POSITION:
${JSON.stringify(data.aave, null, 2)}

LIVE MANTLE YIELD OPPORTUNITIES (top pools by TVL):
${JSON.stringify(topPools, null, 2)}

Return this exact JSON structure:

{
  "profile": {
    "label": "2-word label e.g. Yield Explorer",
    "evidence": "1 sentence citing specific wallet facts that justify this label",
    "stats": {
      "total_transactions": <number from history.totalTxCount>,
      "protocols_used": <number from history.protocolsUsed>,
      "longest_position_days": <number from history.longestHoldDays>,
      "last_active_days_ago": <number from history.lastActiveDaysAgo or 0>
    }
  },

  "blended_apy": {
    "total": <number>,
    "breakdown": [
      {
        "protocol": <string>,
        "action": "Stake | Supply | LP",
        "live_apy": <number from mantleYields>,
        "allocation_pct": <number>,
        "contribution": <calculated>
      }
    ]
  },

  "strategies": [
    {
      "protocol": <string>,
      "action": "Stake | Supply | LP",
      "allocation_pct": <number>,
      "live_apy": <number>,
      "why": "1 sentence rooted in wallet history",
      "fit_score": <1-10>
    }
  ],

  "current_holdings": {
    "mnt": "<balance from positions.mnt>",
    "meth": "<balance from positions.meth>",
    "cmeth": "<balance from positions.cmeth>",
    "usdt": "<balance from positions.usdt>",
    "usdc": "<balance from positions.usdc>",
    "aave_supplied": "<totalSuppliedUSD from aave>",
    "aave_health_factor": "<healthFactor from aave or null>",
    "lp_positions": <number>
  },

  "risks": [
    {
      "risk": "specific risk tied to THIS wallet",
      "evidence": "what in the wallet data triggers this warning",
      "severity": "low | medium | high"
    }
  ],

  "confidence": {
    "level": "low | medium | high",
    "reason": "based on transaction count and data quality"
  },

  "onboarding_message": <string or null — only populate when state is 'no_yield', otherwise null>
}`;
}

function parseAIResponse(text: string, state: string): AnalysisResult {
  try {
    // Strip markdown fences
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    if (!parsed.profile || !parsed.blended_apy || !parsed.strategies) {
      throw new Error("Missing required fields in AI response");
    }

    return {
      profile: parsed.profile,
      blended_apy: parsed.blended_apy,
      strategies: parsed.strategies,
      current_holdings: parsed.current_holdings,
      risks: parsed.risks || [],
      confidence: parsed.confidence,
      onboarding_message: state === "no_yield" ? (parsed.onboarding_message || "Welcome! Let's get you started with yield.") : null,
    };
  } catch (e) {
    console.error("Failed to parse AI response:", e);
    throw new Error(`JSON parse failed: ${e instanceof Error ? e.message : "Unknown error"}`);
  }
}

function getFallbackAnalysis(data: WalletData): AnalysisResult {
  const txCount = data.history?.totalTxCount || 1;
  const isNoYield = data.state === "no_yield";
  const isThin = data.state === "thin_history";

  return {
    profile: {
      label: "Yield Newbie",
      evidence: isNoYield
        ? "You have tokens but haven't put them to work yet. Everyone starts somewhere!"
        : "Limited wallet history detected — recommendations are based on default DeFi best practices.",
      stats: {
        total_transactions: txCount,
        protocols_used: data.history?.protocolsUsed || 0,
        longest_position_days: data.history?.longestHoldDays || 30,
        last_active_days_ago: data.history?.lastActiveDaysAgo || 7,
      },
    },
    blended_apy: {
      total: isNoYield ? 4.2 : 7.8,
      breakdown: isNoYield
        ? [{ protocol: "mETH", action: "Stake", live_apy: 4.2, allocation_pct: 100, contribution: 4.2 }]
        : [
            { protocol: "mETH", action: "Stake", live_apy: 4.2, allocation_pct: 50, contribution: 2.1 },
            { protocol: "Aave", action: "Supply", live_apy: 8.1, allocation_pct: 30, contribution: 2.43 },
            { protocol: "Merchant Moe", action: "LP", live_apy: 16.5, allocation_pct: 20, contribution: 3.3 },
          ],
    },
    strategies: isNoYield
      ? [
          { protocol: "mETH", action: "Stake", allocation_pct: 100, live_apy: 4.2, why: "Simple, low-risk way to start earning on your tokens.", fit_score: 9 },
        ]
      : [
          { protocol: "mETH", action: "Stake", allocation_pct: 50, live_apy: 4.2, why: "Low-risk staking suitable for most wallets", fit_score: 8 },
          { protocol: "Aave", action: "Supply", allocation_pct: 30, live_apy: 8.1, why: "Lending provides steady yields with liquidity", fit_score: 7 },
          { protocol: "Merchant Moe", action: "LP", allocation_pct: 20, live_apy: 16.5, why: "Higher yields for risk-tolerant allocations", fit_score: 5 },
        ],
    current_holdings: {
      mnt: String(data.positions?.mnt || 0),
      meth: String(data.positions?.meth || 0),
      cmeth: String(data.positions?.cmeth || 0),
      usdt: String(data.positions?.usdt || 0),
      usdc: String(data.positions?.usdc || 0),
      aave_supplied: String(data.aave?.totalSuppliedUSD || 0),
      aave_health_factor: data.aave?.healthFactor ? String(data.aave.healthFactor) : null,
      lp_positions: data.history?.hasLpHistory ? 1 : 0,
    },
    risks: [
      { risk: isThin ? "Thin wallet history" : "New to yield", evidence: isThin ? "Fewer than 5 transactions — recommendations are generic" : "No yield positions detected yet", severity: isThin ? "medium" : "low" },
    ],
    confidence: {
      level: isThin ? "low" : isNoYield ? "medium" : "high",
      reason: isThin ? "Limited transaction history" : isNoYield ? "Building your profile as you go" : "Sufficient data for recommendations",
    },
    onboarding_message: isNoYield ? "Welcome! You've got tokens sitting idle. Let's put them to work — starting simple with low-risk options." : null,
  };
}
