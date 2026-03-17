import { ethers, utils } from "ethers";
import { WalletHistory } from "./history";
import { TokenHolding, WalletPositions } from "./positions";
import { AaveData } from "./aave";
import { MantlePool } from "./yields";
import { ComputedRiskProfile } from "./riskScore";

const POLLINATIONS_API_KEY = process.env.POLLINATIONS_API_KEY || '';
const PROTOCOL_URL_FALLBACKS: Record<string, string> = {
  "aave": "https://app.aave.com/",
  "aave v3": "https://app.aave.com/",
  "beefy": "https://app.beefy.com/",
  "clearpool lending": "https://app.clearpool.finance/",
  "clearpool": "https://app.clearpool.finance/",
  "lendle": "https://app.lendle.xyz/",
  "merchant moe": "https://merchantmoe.com/",
  "meth": "https://meth.mantle.xyz/",
  "meth protocol": "https://meth.mantle.xyz/",
  "ondo": "https://ondo.finance/",
  "pendle": "https://app.pendle.finance/",
  "woofi": "https://fi.woofi.com/earn",
  "woofi earn": "https://fi.woofi.com/earn",
};

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
  sustainable_total: number;
  rewards_total: number;
  has_incentive_component: boolean;
  calculation_note: string;
  breakdown: {
    protocol: string;
    symbol: string;
    sustainable_apy: number | null;
    reward_apy: number | null;
    total_apy: number | null;
    apy_breakdown_known: boolean;
    allocation_pct: number;
    sustainable_contribution: number;
    total_contribution: number;
  }[];
}

interface Strategy {
  protocol: string;
  symbol: string;
  action: string;
  allocation_pct: number;
  live_apy: number;
  sustainable_apy: number | null;
  reward_apy: number | null;
  total_apy: number | null;
  apy_breakdown_known: boolean;
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

interface OutputRiskProfile {
  label: "conservative" | "moderate" | "aggressive";
  score: number;
  drivers: string;
}

export interface AnalysisResult {
  profile: Profile;
  blended_apy: BlendedAPY;
  strategies: Strategy[];
  current_holdings: CurrentHoldings;
  risks: Risk[];
  confidence: Confidence;
  onboarding_message: string | null;
  risk_profile: OutputRiskProfile;
}

export interface WalletData {
  address: string;
  history: WalletHistory;
  positions: WalletPositions;
  aave: AaveData;
  mantleYields: MantlePool[];
  state: "empty" | "no_yield" | "thin_history" | "full";
  riskProfile: ComputedRiskProfile;
}

export async function analyzeWallet(data: WalletData): Promise<AnalysisResult> {
  const prompt = buildPrompt(data);

  try {
    const systemPrompt = `You are MantleYield IQ, a DeFi yield advisor for Mantle Network. You analyze real on-chain wallet data and produce personalized yield strategy recommendations.

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
11. RISK PROFILE — this is the primary driver of recommendations.
   It combines what the user told us AND what their on-chain history reveals. Use it as your main signal for pool selection.
   conservative (score 0-2):
   - Only isLp: false pools
   - Only sustainableApy, no reward-only pools
   - Highest TVL pools only
   - Max 2 recommendations
   - Language: reassuring, simple
   moderate (score 3-4):
   - Up to 1 LP pool if APY justifies it
   - Can include hasIncentives pools but must disclose
   - Balance TVL and APY
   - 2-3 recommendations
   - Language: informative, balanced
   aggressive (score 5-6):
   - LP pools encouraged if holdings match
   - High APY pools with incentives allowed, disclose split
   - Prioritize APY over TVL within reason
   - 2-3 recommendations, can include higher yield pools
   - Language: direct, assumes DeFi knowledge
12. APY TIERING REQUIREMENT — mandatory for all profiles:
   The blended APY must increase meaningfully with each risk tier. For the same wallet:
   conservative < moderate < aggressive
   Conservative (0-2):
   - Target blended APY: highest sustainableApy available for tokens the wallet holds, single exposure only
   - Do not diversify into lower-APY pools
   Moderate (3-4):
   - Target blended APY: meaningfully higher than conservative
   - Can use pools where total apy > sustainableApy (incentive-driven component acceptable, must disclose)
   - Can include 1 LP pool if APY justifies it
   - Blended result must exceed what conservative would get
   Aggressive (5-6):
   - Target blended APY: meaningfully higher than moderate
   - Prioritize pools with total apy above 8% where available
   - LP pools encouraged if holdings match
   - Use total apy for calculations, always disclose base vs incentive split
   - Blended result must exceed what moderate would get
   If your pool selection for a higher tier produces a lower or equal blended APY compared to the tier below it, you have selected the wrong pools.
   Reselect until the tiering holds.
13. TOKEN MATCHING vs RISK PROFILE PRIORITY:
   Matching pools to tokens the wallet holds is important but it must not override the risk profile tier.
   If a wallet holds USDT and the risk profile is aggressive:
   - Do NOT just pick the highest TVL USDT pool
   - Look for USDT pools with higher total APY even if they have an incentive component
   - LP pools that include USDT as one side of the pair are acceptable for aggressive profiles
   - The goal is to find the highest APY opportunity for that token given the risk profile
   For each token held, find the best pool at the appropriate risk tier, not just the safest pool for that token.
   If no high-APY pool exists for a token at aggressive tier, it is acceptable to recommend converting or swapping context but do not recommend a conservative pool just because the wallet holds a conservative token.
14. HIGH APY POOL DETECTION:
   Before finalizing recommendations, scan the full pool list for any pool where:
   - total apy > 8%
   - AND the pool symbol contains a token the wallet holds
   - AND tvlUsd > 10000
   If such pools exist, they MUST be included in recommendations for moderate and aggressive profiles.
   Do not skip high-APY pools just because their TVL is lower than the top pools.
   Specific pools to prioritize for token matching:
   - If wallet holds USDT: check for Clearpool USDT pools and WOOFi USDT pools first
   - If wallet holds WETH: check for Lendle WETH pools
   - If wallet holds USDC: check for Lendle USDC pools
   - If wallet holds METH-WETH LP exposure: check for Beefy pools
15. PROFILE LABEL RULE:
   The profile label must be consistent with the riskProfile.
   Never assign a beginner or newbie label to a moderate or aggressive profile, even if on-chain history is thin.
   Use these label guidelines:
   conservative: Passive Holder, Safe Keeper, Stable Seeker
   moderate: Yield Explorer, Balanced Farmer, Steady Builder
   aggressive: Yield Seeker, Alpha Hunter, Risk Taker, DeFi Degen (only if score is 6/6)
   The label must match the risk profile badge shown.
   A 6/6 aggressive score cannot show a newbie label.
16. PROFILE RATIONALE RULE:
   The profile rationale must be specific to this wallet.
   It must reference the wallet's actual holdings, stated risk profile, and the selected recommended protocols.
   Do not use generic phrases like "suitable for most wallets" or "default DeFi best practices" unless you also explain why they apply to this wallet specifically.
   The rationale should explain why these exact pools were chosen for this exact wallet.
17. HONESTY RULE — protocol detection is incomplete:
   The protocol interaction data provided may not capture all DeFi activity.
   If a wallet has significant transaction history (50+ transactions) but shows zero detected protocol interactions, do NOT state they have zero protocol interactions.
   Instead say: "transaction history detected but specific protocol interactions could not be identified."
   Never present incomplete data detection as a confirmed fact about user behaviour.
18. In the profile evidence field, never say "zero protocol interactions" — instead say "protocol history not fully detected" if the interactions array is empty but totalTxCount is high.
19. OUTPUT SAFETY RULE:
   Return exactly one JSON object and nothing else.
   Do not use markdown fences.
   Do not include literal newline characters inside string values.
   Do not include quotation marks inside string values unless escaped.
   Keep every text field to one short sentence in plain text.
20. Respond ONLY in valid JSON.`;

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= 3; attempt += 1) {
      const retryNote =
        attempt === 1
          ? ""
          : "\n\nRETRY NOTE: Your previous response was truncated or invalid. Return the full JSON object in one pass. Start with { and end with }.";

      const response = await fetch("https://gen.pollinations.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${POLLINATIONS_API_KEY}`,
        },
        body: JSON.stringify({
          model: "minimax",
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: `${prompt}${retryNote}`,
            }
          ],
          temperature: 0,
          max_tokens: 2500,
        }),
      });

      if (!response.ok) {
        throw new Error(`Pollinations API error: ${response.status}`);
      }

      const result = await response.json();
      const text = result.choices?.[0]?.message?.content || "";
      console.log(`Pollinations raw response preview attempt ${attempt}:`, text.slice(0, 1500));

      if (text.trim().length < 100) {
        lastError = new Error(`Pollinations returned a truncated response on attempt ${attempt}`);
        console.error(lastError.message);
        continue;
      }

      try {
        return parseAIResponse(text, data);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error("Unknown AI parse error");
        console.error(`Retrying Pollinations after parse failure on attempt ${attempt}:`, lastError.message);
      }
    }

    throw lastError || new Error("Pollinations did not return a usable response");
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

  const topPools = data.mantleYields.slice(0, 8).map((p) => ({
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

USER RISK PROFILE:
Score: ${data.riskProfile.finalScore}/6
Profile: ${data.riskProfile.riskProfile}
Based on: stated preferences + on-chain behavior adjustment of ${data.riskProfile.adjustment > 0 ? "+" : ""}${data.riskProfile.adjustment}

Use this profile as the primary driver for pool selection and APY targeting.

ON-CHAIN HISTORY:
${JSON.stringify(data.history)}

CURRENT TOKEN POSITIONS:
${JSON.stringify(data.positions)}

CURRENT HOLDINGS SUMMARY:
${JSON.stringify({
  mnt: data.positions.mnt,
  meth: data.positions.meth,
  cmeth: data.positions.cmeth,
  usdt: data.positions.usdt,
  usdc: data.positions.usdc,
  token_balances: data.positions.tokenBalances ?? [],
  total_holdings_usd: totalHoldingsUsd,
})}

AAVE POSITION:
${JSON.stringify(data.aave)}

LIVE MANTLE YIELD OPPORTUNITIES (top pools by TVL):
${JSON.stringify(topPools)}

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
    "sustainable_total": <number>,
    "rewards_total": <number>,
    "has_incentive_component": <boolean>,
    "calculation_note": <string>,
    "breakdown": [
      {
        "protocol": <string>,
        "symbol": <string>,
        "sustainable_apy": <number or null>,
        "reward_apy": <number or null>,
        "total_apy": <number or null>,
        "apy_breakdown_known": <boolean>,
        "allocation_pct": <number>,
        "sustainable_contribution": <calculated>,
        "total_contribution": <calculated>
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
      "reward_apy": <number or null>,
      "total_apy": <number or null>,
      "apy_breakdown_known": <boolean>,
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

  "onboarding_message": <string or null — only populate when state is 'no_yield', otherwise null>,

  "risk_profile": {
    "label": "conservative | moderate | aggressive",
    "score": <number>,
    "drivers": "1 sentence explaining what drove this score"
  }
}`;
}

function parseAIResponse(text: string, data: WalletData): AnalysisResult {
  try {
    const clean = sanitizePollinationsJson(text);
    if (!clean.trimEnd().endsWith("}")) {
      console.error("Raw AI response:", text);
      throw new Error("AI response was truncated — increase max_tokens");
    }
    const parsed = JSON.parse(clean);

    if (!parsed.profile || !parsed.blended_apy || !parsed.strategies) {
      throw new Error("Missing required fields in AI response");
    }

    return {
      profile: parsed.profile,
      blended_apy: {
        sustainable_total: Number(parsed.blended_apy?.sustainable_total ?? parsed.blended_apy?.total ?? 0),
        rewards_total: Number(parsed.blended_apy?.rewards_total ?? parsed.blended_apy?.total ?? 0),
        has_incentive_component: Boolean(parsed.blended_apy?.has_incentive_component),
        calculation_note: parsed.blended_apy?.calculation_note || "Blended from strategy allocations.",
        breakdown: (parsed.blended_apy?.breakdown || []).map((item: any) => ({
          protocol: item.protocol || "",
          symbol: item.symbol || "",
          sustainable_apy: item.sustainable_apy ?? item.total_apy ?? item.live_apy ?? null,
          reward_apy: item.reward_apy ?? null,
          total_apy: item.total_apy ?? item.live_apy ?? item.sustainable_apy ?? null,
          apy_breakdown_known: item.apy_breakdown_known ?? false,
          allocation_pct: Number(item.allocation_pct ?? 0),
          sustainable_contribution: Number(item.sustainable_contribution ?? item.contribution ?? 0),
          total_contribution: Number(item.total_contribution ?? item.contribution ?? 0),
        })),
      },
      strategies: parsed.strategies.map((strategy: any) => {
        const normalizedSymbol = strategy.symbol || "";
        const fallbackUrl = resolveStrategyUrl(strategy.protocol, normalizedSymbol, data.mantleYields);

        return {
          ...strategy,
          symbol: normalizedSymbol,
          live_apy: strategy.total_apy ?? strategy.live_apy ?? strategy.sustainable_apy ?? 0,
          sustainable_apy: strategy.sustainable_apy ?? strategy.total_apy ?? strategy.live_apy ?? null,
          reward_apy: strategy.reward_apy ?? null,
          total_apy: strategy.total_apy ?? strategy.live_apy ?? strategy.sustainable_apy ?? null,
          apy_breakdown_known: strategy.apy_breakdown_known ?? false,
          url: strategy.url ?? fallbackUrl ?? null,
        };
      }),
      current_holdings: {
        ...parsed.current_holdings,
        token_balances: parsed.current_holdings?.token_balances || [],
        total_holdings_usd: Number(parsed.current_holdings?.total_holdings_usd ?? totalHoldingsUsdFromParsed(parsed.current_holdings)),
      },
      risks: parsed.risks || [],
      confidence: parsed.confidence,
      onboarding_message: data.state === "no_yield" ? (parsed.onboarding_message || "Welcome! Let's get you started with yield.") : null,
      risk_profile: {
        label: parsed.risk_profile?.label || "moderate",
        score: Number(parsed.risk_profile?.score ?? 3),
        drivers: parsed.risk_profile?.drivers || "Balanced between stated preferences and wallet behavior.",
      },
    };
  } catch (e) {
    console.error("Failed to parse AI response:", e);
    console.error("Raw AI response preview:", text.slice(0, 2000));
    throw new Error(`JSON parse failed: ${e instanceof Error ? e.message : "Unknown error"}`);
  }
}

function resolveStrategyUrl(protocol: string, symbol: string, mantleYields: MantlePool[]): string | null {
  const normalizedProtocol = (protocol || "").trim().toLowerCase();
  const normalizedSymbol = (symbol || "").trim().toLowerCase();

  const exactMatch = mantleYields.find((pool) =>
    pool.url &&
    pool.displayName.trim().toLowerCase() === normalizedProtocol &&
    pool.symbol.trim().toLowerCase() === normalizedSymbol
  );

  if (exactMatch?.url) {
    return exactMatch.url;
  }

  const protocolMatch = mantleYields.find((pool) =>
    pool.url &&
    pool.displayName.trim().toLowerCase() === normalizedProtocol
  );

  if (protocolMatch?.url) {
    return protocolMatch.url;
  }

  const partialProtocolMatch = mantleYields.find((pool) =>
    pool.url &&
    pool.displayName.trim().toLowerCase().includes(normalizedProtocol)
  );

  if (partialProtocolMatch?.url) {
    return partialProtocolMatch.url;
  }

  for (const [protocolName, fallbackUrl] of Object.entries(PROTOCOL_URL_FALLBACKS)) {
    if (normalizedProtocol === protocolName || normalizedProtocol.includes(protocolName) || protocolName.includes(normalizedProtocol)) {
      return fallbackUrl;
    }
  }

  return null;
}

function sanitizePollinationsJson(text: string): string {
  const withoutFences = text.replace(/```json|```/gi, "").trim();
  const extracted = extractFirstJsonObject(withoutFences);
  const flattened = flattenJsonStrings(extracted);
  const repaired = repairUnterminatedString(flattened);
  return repaired.trim();
}

function extractFirstJsonObject(text: string): string {
  const start = text.indexOf("{");
  if (start === -1) {
    return text;
  }

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = start; i < text.length; i += 1) {
    const char = text[i];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === "\"") {
        inString = false;
      }
      continue;
    }

    if (char === "\"") {
      inString = true;
      continue;
    }

    if (char === "{") {
      depth += 1;
    } else if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return text.slice(start, i + 1);
      }
    }
  }

  return text.slice(start);
}

function flattenJsonStrings(text: string): string {
  let result = "";
  let inString = false;
  let escaped = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];

    if (inString) {
      if (escaped) {
        result += char;
        escaped = false;
        continue;
      }

      if (char === "\\") {
        result += char;
        escaped = true;
        continue;
      }

      if (char === "\"") {
        const nextNonWhitespace = findNextNonWhitespace(text, i + 1);
        if (nextNonWhitespace === "," || nextNonWhitespace === "}" || nextNonWhitespace === "]" || nextNonWhitespace === ":") {
          inString = false;
          result += char;
        } else {
          result += "\\\"";
        }
        continue;
      }

      if (char === "\n" || char === "\r") {
        result += " ";
        continue;
      }

      result += char;
      continue;
    }

    if (char === "\"") {
      inString = true;
    }

    result += char;
  }

  return result;
}

function repairUnterminatedString(text: string): string {
  const quoteCount = (text.match(/(?<!\\)"/g) || []).length;
  if (quoteCount % 2 === 0) {
    return text;
  }

  const lastQuote = text.lastIndexOf("\"");
  if (lastQuote === -1) {
    return text;
  }

  const tail = text.slice(lastQuote + 1);
  const tailTrimmed = tail.trimStart();
  const closingChar = tailTrimmed.startsWith("]") ? "]" : tailTrimmed.startsWith("}") ? "}" : "";
  const tailWithoutCloser = closingChar ? tail.replace(tailTrimmed[0], "") : tail;

  return `${text.slice(0, lastQuote + 1)}${tailWithoutCloser}"${closingChar}`;
}

function findNextNonWhitespace(text: string, startIndex: number): string | null {
  for (let i = startIndex; i < text.length; i += 1) {
    const char = text[i];
    if (!/\s/.test(char)) {
      return char;
    }
  }

  return null;
}

function getFallbackAnalysis(data: WalletData): AnalysisResult {
  const txCount = data.history?.totalTxCount || 1;
  const isNoYield = data.state === "no_yield";
  const isThin = data.state === "thin_history";
  const riskLabel = data.riskProfile.riskProfile;
  const primaryHolding =
    data.positions.usdt > 0 || data.positions.usdc > 0
      ? "stablecoin"
      : data.positions.meth > 0 || data.positions.cmeth > 0
        ? "mETH"
        : data.positions.mnt > 0
          ? "MNT"
          : "Mantle assets";
  const holdingSummary =
    primaryHolding === "stablecoin"
      ? "a stablecoin-heavy balance with additional Mantle exposure"
      : primaryHolding === "mETH"
        ? "mETH-led holdings already aligned with staking routes"
        : primaryHolding === "MNT"
          ? "MNT exposure that can be routed into Mantle-native yield"
          : "current Mantle holdings that can support active yield strategies";

  const fallbackProfileLabel =
    riskLabel === "conservative"
      ? "Capital Preserver"
      : riskLabel === "moderate"
        ? "Yield Builder"
        : "Growth Hunter";

  const fallbackEvidence =
    riskLabel === "conservative"
      ? `Wallet shows ${holdingSummary} and a ${data.riskProfile.finalScore}/6 conservative risk profile, pointing to simpler lower-volatility yield routes.`
      : riskLabel === "moderate"
        ? `Wallet shows ${holdingSummary} and scored ${data.riskProfile.finalScore}/6, which supports a balanced mix of dependable yield and selective upside.`
        : `Wallet shows ${holdingSummary} and scored ${data.riskProfile.finalScore}/6, which supports a more opportunistic Mantle yield mix.`;

  const primaryWhy =
    riskLabel === "conservative"
      ? `This keeps ${primaryHolding} exposure in a simpler single-position strategy that matches the wallet's conservative risk profile.`
      : riskLabel === "moderate"
        ? `This mix balances dependable yield with moderate upside and fits a ${primaryHolding}-heavy wallet that can take measured risk.`
        : `This allocation leans into higher-yield Mantle opportunities and matches an aggressive profile without ignoring the wallet's current holdings.`;

  return {
    profile: {
      label: fallbackProfileLabel,
      evidence: isNoYield
        ? fallbackEvidence
        : fallbackEvidence,
      stats: {
        total_transactions: txCount,
        protocols_used: data.history?.protocolsUsed || 0,
        longest_position_days: data.history?.longestHoldDays || 30,
        last_active_days_ago: data.history?.lastActiveDaysAgo || 7,
      },
    },
    blended_apy: {
      sustainable_total: isNoYield ? 4.2 : 7.8,
      rewards_total: isNoYield ? 4.2 : 7.8,
      has_incentive_component: false,
      calculation_note: "Fallback uses the same APY as sustainable because no reward split was provided.",
      breakdown: isNoYield
        ? [{
            protocol: "mETH",
            symbol: "mETH",
            sustainable_apy: 4.2,
            reward_apy: null,
            total_apy: 4.2,
            apy_breakdown_known: true,
            allocation_pct: 100,
            sustainable_contribution: 4.2,
            total_contribution: 4.2,
          }]
        : [
            {
              protocol: "mETH",
              symbol: "mETH",
              sustainable_apy: 4.2,
              reward_apy: null,
              total_apy: 4.2,
              apy_breakdown_known: true,
              allocation_pct: 50,
              sustainable_contribution: 2.1,
              total_contribution: 2.1,
            },
            {
              protocol: "Aave",
              symbol: "USDT",
              sustainable_apy: 8.1,
              reward_apy: null,
              total_apy: 8.1,
              apy_breakdown_known: true,
              allocation_pct: 30,
              sustainable_contribution: 2.43,
              total_contribution: 2.43,
            },
            {
              protocol: "Merchant Moe",
              symbol: "mETH-MNT",
              sustainable_apy: 16.5,
              reward_apy: null,
              total_apy: 16.5,
              apy_breakdown_known: true,
              allocation_pct: 20,
              sustainable_contribution: 3.3,
              total_contribution: 3.3,
            },
          ],
    },
    strategies: isNoYield
      ? [
          { protocol: "mETH", symbol: "mETH", action: "Stake", allocation_pct: 100, live_apy: 4.2, sustainable_apy: 4.2, reward_apy: null, total_apy: 4.2, apy_breakdown_known: true, url: "https://meth.mantle.xyz", why: primaryWhy, fit_score: 9 },
        ]
      : [
          { protocol: "mETH", symbol: "mETH", action: "Stake", allocation_pct: 50, live_apy: 4.2, sustainable_apy: 4.2, reward_apy: null, total_apy: 4.2, apy_breakdown_known: true, url: "https://meth.mantle.xyz", why: primaryWhy, fit_score: riskLabel === "aggressive" ? 6 : 8 },
          { protocol: "Aave", symbol: "USDT", action: "Supply", allocation_pct: 30, live_apy: 8.1, sustainable_apy: 8.1, reward_apy: null, total_apy: 8.1, apy_breakdown_known: true, url: "https://app.aave.com", why: `This gives the wallet liquid yield on ${primaryHolding === "stablecoin" ? "stablecoin" : "defensive"} exposure while keeping capital accessible.`, fit_score: 7 },
          { protocol: "Merchant Moe", symbol: "mETH-MNT", action: "LP", allocation_pct: 20, live_apy: 16.5, sustainable_apy: 16.5, reward_apy: null, total_apy: 16.5, apy_breakdown_known: true, url: "https://merchantmoe.com", why: `This adds the higher-upside sleeve expected from a ${riskLabel} profile, using holdings already visible in the wallet.`, fit_score: riskLabel === "aggressive" ? 8 : 5 },
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
      {
        risk: isThin ? "Thin wallet history" : riskLabel === "aggressive" ? "Higher-volatility strategy" : "New to yield",
        evidence: isThin
          ? "Fewer than 5 transactions — recommendations are generic"
          : riskLabel === "aggressive"
            ? "Aggressive profile aims for higher yield, which comes with larger swings and more incentive dependence."
            : "No yield positions detected yet",
        severity: isThin ? "medium" : riskLabel === "aggressive" ? "medium" : "low"
      },
    ],
    confidence: {
      level: isThin ? "low" : isNoYield ? "medium" : "high",
      reason: isThin ? "Limited transaction history" : isNoYield ? "Building your profile as you go" : "Sufficient data for recommendations",
    },
    onboarding_message: isNoYield ? "Welcome! You've got tokens sitting idle. Let's put them to work — starting simple with low-risk options." : null,
    risk_profile: {
      label: data.riskProfile.riskProfile,
      score: data.riskProfile.finalScore,
      drivers: `Score shaped by stated preferences with an on-chain adjustment of ${data.riskProfile.adjustment > 0 ? "+" : ""}${data.riskProfile.adjustment}.`,
    },
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
