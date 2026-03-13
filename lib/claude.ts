import { ethers } from "ethers";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || "";

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

interface WalletData {
  address: string;
  positions: {
    mnt: string;
    mEth: string;
    cmEth: string;
  };
  aavePosition: {
    totalCollateralBase: string;
    totalDebtBase: string;
    availableBorrowsBase: string;
    healthFactor: string;
  } | null;
  history: {
    protocols: string[];
    activity: string;
    defiExperience: "none" | "beginner" | "intermediate" | "advanced";
  };
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
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
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
  return `You are MantleYield IQ, an AI yield advisor specializing in Mantle Network DeFi strategies.

Given this wallet's on-chain data:
- Address: ${data.address}
- Current Positions: ${data.positions.mnt} MNT, ${data.positions.mEth} mETH, ${data.positions.cmEth} cmETH
- Aave Position: ${data.aavePosition ? `Collateral: ${data.aavePosition.totalCollateralBase}, Debt: ${data.aavePosition.totalDebtBase}, Health Factor: ${data.aavePosition.healthFactor}` : "No active Aave position"}
- DeFi History: ${data.history.activity}
- Protocols Used: ${data.history.protocols.length > 0 ? data.history.protocols.join(", ") : "None detected"}
- Experience Level: ${data.history.defiExperience}

Analyze this wallet and provide a personalized yield strategy.

Consider these Mantle yield opportunities:
1. mETH staking - Stake MNT to earn staking rewards (~5-8% APY)
2. cmETH restaking - Reinvest earned rewards for compound yields (~8-12% APY)
3. Aave V3 - Supply assets for lending APY or borrow for leverage (~3-15% APY depending on asset)

Output your response in this exact JSON format (no other text):
{
  "personality": {
    "label": "one-word personality type",
    "description": "2-sentence description of their DeFi style",
    "riskTolerance": "conservative" | "moderate" | "aggressive"
  },
  "recommendations": [
    {
      "protocol": "protocol name",
      "action": "stake" | "restake" | "supply" | "borrow" | "hold",
      "allocation": "percentage of portfolio",
      "apy": "estimated APY range",
      "reason": "brief reason for recommendation"
    }
  ],
  "riskFlags": ["list of specific risk considerations"],
  "estimatedBlendedAPY": "X% - Y% APY"
}

Focus on practical, actionable advice. Consider their experience level when recommending complex strategies.`;
}

function parseAIResponse(text: string): AnalysisResult {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error("No JSON found");
  } catch {
    return getFallbackAnalysis({ address: "", positions: { mnt: "0", mEth: "0", cmEth: "0" }, aavePosition: null, history: { protocols: [], activity: "", defiExperience: "none" } });
  }
}

function getFallbackAnalysis(data: WalletData): AnalysisResult {
  const totalValue = parseFloat(data.positions.mnt) + parseFloat(data.positions.mEth) + parseFloat(data.positions.cmEth);
  
  let personality: {
    label: string;
    description: string;
    riskTolerance: "conservative" | "moderate" | "aggressive";
  }, riskTolerance;
  
  if (data.history.defiExperience === "none" || totalValue < 1) {
    personality = { label: "Newbie", description: "You're just getting started with DeFi. Focus on learning the basics before diving into complex strategies.", riskTolerance: "conservative" };
    riskTolerance = "conservative";
  } else if (data.history.defiExperience === "beginner") {
    personality = { label: "Explorer", description: "You've started your DeFi journey. You're curious but cautious, looking for steady yields.", riskTolerance: "moderate" };
    riskTolerance = "moderate";
  } else if (data.history.defiExperience === "intermediate") {
    personality = { label: "Yield Hunter", description: "You know your way around DeFi protocols. You're comfortable taking calculated risks for better returns.", riskTolerance: "moderate" };
    riskTolerance = "moderate";
  } else {
    personality = { label: "DeFi Veteran", description: "You've been around the block. You understand risks and know how to maximize yields across multiple strategies.", riskTolerance: "aggressive" };
    riskTolerance = "aggressive";
  }

  const recommendations = [];
  
  if (parseFloat(data.positions.mnt) > 0) {
    recommendations.push({
      protocol: "mETH",
      action: "stake" as const,
      allocation: "60%",
      apy: "5-8%",
      reason: "Stake your MNT to earn native staking rewards with minimal risk",
    });
  }
  
  if (parseFloat(data.positions.mEth) > 0 || riskTolerance !== "conservative") {
    recommendations.push({
      protocol: "cmETH",
      action: "restake" as const,
      allocation: "30%",
      apy: "8-12%",
      reason: "Compound your earnings through restaking for accelerated growth",
    });
  }
  
  if (data.aavePosition && parseFloat(data.aavePosition.totalCollateralBase) > 0) {
    recommendations.push({
      protocol: "Aave V3",
      action: "supply" as const,
      allocation: "10%",
      apy: "3-5%",
      reason: "Supply your assets to earn lending rewards while maintaining liquidity",
    });
  }

  const riskFlags = [
    "Smart contract risk exists with all DeFi protocols",
    "Mantle Network is still relatively new - higher network risk",
    "Impermanent loss possible when providing liquidity",
    "Always keep some MNT for gas fees",
  ];

  if (riskTolerance === "aggressive") {
    riskFlags.push("Consider diversifying across multiple protocols");
  }

  return {
    personality,
    recommendations,
    riskFlags,
    estimatedBlendedAPY: "5-12%",
  };
}
