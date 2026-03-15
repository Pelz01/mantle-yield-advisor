import { WalletHistory } from "./history";

export type RiskAnswers = {
  goal: "safe" | "income" | "growth";
  horizon: "short" | "medium" | "long";
  lossResponse: "exit" | "wait" | "buy";
};

export type ComputedRiskProfile = {
  baseScore: number;
  adjustment: number;
  finalScore: number;
  riskProfile: "conservative" | "moderate" | "aggressive";
};

const goalScores: Record<RiskAnswers["goal"], number> = {
  safe: 0,
  income: 1,
  growth: 2,
};

const horizonScores: Record<RiskAnswers["horizon"], number> = {
  short: 0,
  medium: 1,
  long: 2,
};

const lossResponseScores: Record<RiskAnswers["lossResponse"], number> = {
  exit: 0,
  wait: 1,
  buy: 2,
};

export function computeRiskProfile(answers: RiskAnswers, history: WalletHistory): ComputedRiskProfile {
  const baseScore =
    goalScores[answers.goal] +
    horizonScores[answers.horizon] +
    lossResponseScores[answers.lossResponse];

  let adjustment = 0;

  if (history.hasBorrowHistory && history.earlyLpExits === 0 && history.protocolsUsed >= 3) {
    adjustment = 1;
  } else if (history.earlyLpExits >= 2 || (history.totalTxCount < 5 && !history.hasLpHistory)) {
    adjustment = -1;
  }

  const finalScore = Math.min(6, Math.max(0, baseScore + adjustment));

  let riskProfile: ComputedRiskProfile["riskProfile"];
  if (finalScore <= 2) {
    riskProfile = "conservative";
  } else if (finalScore <= 4) {
    riskProfile = "moderate";
  } else {
    riskProfile = "aggressive";
  }

  return {
    baseScore,
    adjustment,
    finalScore,
    riskProfile,
  };
}
