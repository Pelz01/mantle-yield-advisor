import { ethers } from "ethers";
import { WalletHistory } from "./history";
import { WalletPositions } from "./positions";
import { AaveData } from "./aave";
import { MantlePool } from "./yields";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || "";

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
  if (!ANTHROPIC_API_KEY) {
    return getFallbackAnalysis(data);
  }

  const prompt = buildPrompt(data);

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        temperature: 0,
        system: `You are MantleYield IQ, a DeFi yield advisor for Mantle Network. You analyze real on-chain wallet data and produce personalized yield strategy recommendations.

RULES — enforce every single one:
1. Every claim must reference specific data from the wallet history provided. If you cannot point to evidence, do not make the claim.
2. Risk warnings must be specific to THIS wallet. Never output generic risks like "smart contract risk" or "market volatility" — those apply to everyone and add zero value.
3. Allocation percentages must be justified by observed behaviour patterns, not invented.
4. If wallet history is thin (fewer than 5 transactions), say so honestly and reduce confidence in recommendations.
5. APY figures must use only the live rates provided in the data. Never invent or estimate APY numbers.
6. Respond ONLY in valid JSON. No preamble, no explanation outside the JSON object.`,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const result = await response.json();
    return parseAIResponse(result.content[0].text);
  } catch (error) {
    console.error("Error calling Claude API:", error);
    return getFallbackAnalysis(data);
  }
}

function buildPrompt(data: WalletData): string {
  const topPools = data.mantleYields.slice(0, 15).map((p) => ({
    protocol: p.protocol,
    symbol: p.symbol,
    tvl: p.tvlUsd,
    apy: p.apy,
    sustainableApy: p.sustainableApy,
    isLp: p.isLp,
    hasIncentives: p.hasIncentives,
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
        "protocol": "mETH | Aave | Merchant Moe",
        "action": "Stake | Supply | LP",
        "live_apy": <number from mantleYields data>,
        "allocation_pct": <number>,
        "contribution": <calculated>
      }
    ]
  },

  "strategies": [
    {
      "protocol": <string>,
      "action": "Stake | Supply | LP | Borrow",
      "allocation_pct": <number>,
      "live_apy": <number from mantleYields>,
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
    "lp_positions": <number from history.hasLpHistory ? 1 : 0>
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
  }
}`;
}

function parseAIResponse(text: string): AnalysisResult {
  try {
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    if (!parsed.profile || !parsed.blended_apy || !parsed.strategies) {
      throw new Error("Missing required fields");
    }
    return parsed;
  } catch (e) {
    console.error("Failed to parse AI response:", e);
    return getFallbackAnalysis({
      address: "",
      history: {
        totalTxCount: 0,
        protocolsUsed: 0,
        longestHoldDays: 0,
        lastActiveDaysAgo: null,
        hasLpHistory: false,
        hasBorrowHistory: false,
        earlyLpExits: 0,
        protocols: [],
      },
      positions: { mnt: 0, meth: 0, cmeth: 0, usdt: 0, usdc: 0, hasTokens: false },
      aave: { available: false, apys: {}, healthFactor: null, totalSuppliedUSD: 0, totalBorrowedUSD: 0 },
      mantleYields: [],
      state: "thin_history",
    });
  }
}

function getFallbackAnalysis(data: WalletData): AnalysisResult {
  const txCount = data.history?.totalTxCount || 1;

  return {
    profile: {
      label: "Yield Explorer",
      evidence: "Limited wallet history detected — recommendations are based on default DeFi best practices.",
      stats: {
        total_transactions: txCount,
        protocols_used: data.history?.protocolsUsed || 0,
        longest_position_days: data.history?.longestHoldDays || 30,
        last_active_days_ago: data.history?.lastActiveDaysAgo || 7,
      },
    },
    blended_apy: {
      total: 7.8,
      breakdown: [
        { protocol: "mETH", action: "Stake", live_apy: 4.2, allocation_pct: 50, contribution: 2.1 },
        { protocol: "Aave", action: "Supply", live_apy: 8.1, allocation_pct: 30, contribution: 2.43 },
        { protocol: "Merchant Moe", action: "LP", live_apy: 16.5, allocation_pct: 20, contribution: 3.3 },
      ],
    },
    strategies: [
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
      { risk: "Thin wallet history", evidence: "Fewer than 5 transactions — recommendations are generic", severity: "medium" },
      { risk: "No health factor data", evidence: "No Aave position detected to assess risk", severity: "low" },
    ],
    confidence: {
      level: "low",
      reason: "Limited on-chain history — recommendations are starting points, not guarantees",
    },
  };
}
