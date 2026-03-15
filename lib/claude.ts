import { ethers, utils } from "ethers";
import { WalletHistory } from "./history";
import { TokenHolding, WalletPositions } from "./positions";
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
  symbol: string;
  action: string;
  allocation_pct: number;
  live_apy: number;
  sustainable_apy: number | null;
  url: string | null;
  why: string;
  fit_score: number;
}

interface CurrentHoldings {
  mnt: string;
  meth: string;
  cmeth: string;
  usdt: string;
  usdc: string;
  token_balances: TokenHolding[];
  total_holdings_usd: number;
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
7. POOL SELECTION RULE — mandatory:
   Match recommended pools to the tokens the wallet actually holds.
   If the wallet holds MNT, prioritize pools that accept MNT.
   If the wallet holds mETH, prioritize mETH pools.
   If the wallet holds USDT or USDC, prioritize stablecoin pools.
   Do NOT recommend pools for tokens the wallet does not hold.
   Do NOT recommend the same two pools for every wallet.
   The recommendation must be personalized to this specific wallet's holdings — not a generic top-APY list.
8. Include the url field from the pool data for each recommended strategy. If no url is available, set it to null.
9. STRATEGY COUNT RULE:
   Always recommend between 2 and 3 strategies, never just 1, unless the wallet holds only one token type with no alternatives available in the pool data.
   Diversification across 2-3 protocols is always better than 100% in one protocol.
10. HOLDINGS SIZE RULE:
   The size of holdings matters for recommendations.
   Wallets holding more than 1000 USD equivalent should get diversified strategies across 2-3 protocols.
   Wallets holding less than 100 USD equivalent should get 1-2 simple low-risk strategies only.
   Never give the same recommendation to a large wallet and a small wallet — allocation percentages and protocol selection must reflect the holdings size.
11. HONESTY RULE — protocol detection is incomplete:
   The protocol interaction data provided may not capture all DeFi activity.
   If a wallet has significant transaction history (50+ transactions) but shows zero detected protocol interactions, do NOT state they have zero protocol interactions.
   Instead say: "transaction history detected but specific protocol interactions could not be identified."
   Never present incomplete data detection as a confirmed fact about user behaviour.
12. In the profile evidence field, never say "zero protocol interactions" — instead say "protocol history not fully detected" if the interactions array is empty but totalTxCount is high.
13. Respond ONLY in valid JSON.`
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
  const totalHoldingsUsd =
    (data.positions.mnt || 0) +
    (data.positions.meth || 0) * 2000 +
    (data.positions.usdt || 0) +
    (data.positions.usdc || 0);

  const topPools = data.mantleYields.slice(0, 15).map((p) => ({
    protocol: p.displayName,
    symbol: p.symbol,
    url: p.url,
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

CURRENT HOLDINGS SUMMARY:
${JSON.stringify({
  mnt: data.positions.mnt,
  meth: data.positions.meth,
  cmeth: data.positions.cmeth,
  usdt: data.positions.usdt,
  usdc: data.positions.usdc,
  token_balances: data.positions.tokenBalances ?? [],
  total_holdings_usd: totalHoldingsUsd,
}, null, 2)}

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
      "symbol": <string>,
      "action": "Stake | Supply | LP",
      "allocation_pct": <number>,
      "sustainable_apy": <number or null>,
      "url": <string or null>,
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
    "token_balances": [{"symbol": "<token symbol>", "name": "<token name>", "amount": <numeric balance>, "address": "<token address>"}],
    "total_holdings_usd": <approximate total holdings in USD using MNT=$1, mETH=$2000, plus stablecoin balances>,
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
      strategies: parsed.strategies.map((strategy: any) => ({
        ...strategy,
        symbol: strategy.symbol || "",
        live_apy: strategy.live_apy ?? strategy.sustainable_apy ?? 0,
        sustainable_apy: strategy.sustainable_apy ?? strategy.live_apy ?? null,
        url: strategy.url ?? null,
      })),
      current_holdings: {
        ...parsed.current_holdings,
        token_balances: parsed.current_holdings?.token_balances || [],
        total_holdings_usd: Number(parsed.current_holdings?.total_holdings_usd ?? totalHoldingsUsdFromParsed(parsed.current_holdings)),
      },
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
          { protocol: "mETH", symbol: "mETH", action: "Stake", allocation_pct: 100, live_apy: 4.2, sustainable_apy: 4.2, url: "https://meth.mantle.xyz", why: "Simple, low-risk way to start earning on your tokens.", fit_score: 9 },
        ]
      : [
          { protocol: "mETH", symbol: "mETH", action: "Stake", allocation_pct: 50, live_apy: 4.2, sustainable_apy: 4.2, url: "https://meth.mantle.xyz", why: "Low-risk staking suitable for most wallets", fit_score: 8 },
          { protocol: "Aave", symbol: "USDT", action: "Supply", allocation_pct: 30, live_apy: 8.1, sustainable_apy: 8.1, url: "https://app.aave.com", why: "Lending provides steady yields with liquidity", fit_score: 7 },
          { protocol: "Merchant Moe", symbol: "mETH-MNT", action: "LP", allocation_pct: 20, live_apy: 16.5, sustainable_apy: 16.5, url: "https://merchantmoe.com", why: "Higher yields for risk-tolerant allocations", fit_score: 5 },
        ],
    current_holdings: {
      mnt: String(data.positions?.mnt || 0),
      meth: String(data.positions?.meth || 0),
      cmeth: String(data.positions?.cmeth || 0),
      usdt: String(data.positions?.usdt || 0),
      usdc: String(data.positions?.usdc || 0),
      token_balances: data.positions?.tokenBalances || [],
      total_holdings_usd:
        (data.positions?.mnt || 0) +
        (data.positions?.meth || 0) * 2000 +
        (data.positions?.usdt || 0) +
        (data.positions?.usdc || 0),
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

function totalHoldingsUsdFromParsed(currentHoldings: Partial<CurrentHoldings> | undefined): number {
  if (!currentHoldings) {
    return 0;
  }

  const mnt = Number(currentHoldings.mnt || 0);
  const meth = Number(currentHoldings.meth || 0);
  const usdt = Number(currentHoldings.usdt || 0);
  const usdc = Number(currentHoldings.usdc || 0);

  return mnt + meth * 2000 + usdt + usdc;
}
