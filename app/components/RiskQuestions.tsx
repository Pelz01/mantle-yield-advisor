"use client";

import { useState } from "react";
import { RiskAnswers } from "@/lib/riskScore";

type RiskQuestionsProps = {
  onComplete: (answers: RiskAnswers) => void;
  walletAddress: string;
  darkMode?: boolean;
};

type StepConfig = {
  key: keyof RiskAnswers;
  question: string;
  options: { label: string; value: RiskAnswers[keyof RiskAnswers] }[];
};

const steps: StepConfig[] = [
  {
    key: "goal",
    question: "What's your goal with these funds?",
    options: [
      { label: "Keep it safe and stable", value: "safe" },
      { label: "Earn steady income", value: "income" },
      { label: "Grow as much as possible", value: "growth" },
    ],
  },
  {
    key: "horizon",
    question: "How long can you leave this untouched?",
    options: [
      { label: "Less than a month", value: "short" },
      { label: "1 to 6 months", value: "medium" },
      { label: "Over 6 months", value: "long" },
    ],
  },
  {
    key: "lossResponse",
    question: "If this dropped 20% tomorrow, what would you do?",
    options: [
      { label: "Exit immediately", value: "exit" },
      { label: "Wait and see", value: "wait" },
      { label: "Buy more", value: "buy" },
    ],
  },
];

function truncateAddress(address: string): string {
  if (!address) {
    return "";
  }

  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function RiskQuestions({ onComplete, walletAddress, darkMode = false }: RiskQuestionsProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<RiskAnswers>>({});

  const colors = darkMode
    ? {
        panel: "#141414",
        elevated: "#202020",
        border: "#333",
        text: "#fff",
        textMuted: "#888",
        accent: "#ff6b35",
        accentSoft: "rgba(255,107,53,0.14)",
        shadow: "0 18px 42px rgba(0,0,0,0.22)",
      }
    : {
        panel: "#fafafa",
        elevated: "#ffffff",
        border: "#e5e5e5",
        text: "#1a1a2e",
        textMuted: "#666",
        accent: "#ff6b35",
        accentSoft: "rgba(255,107,53,0.10)",
        shadow: "0 18px 40px rgba(0,0,0,0.05)",
      };

  const currentStep = steps[stepIndex];

  const handleSelect = (value: RiskAnswers[keyof RiskAnswers]) => {
    const nextAnswers = {
      ...answers,
      [currentStep.key]: value,
    } as Partial<RiskAnswers>;

    if (stepIndex === steps.length - 1) {
      onComplete(nextAnswers as RiskAnswers);
      return;
    }

    setAnswers(nextAnswers);
    setStepIndex((prev) => prev + 1);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div
        className="rounded-[28px] border px-6 py-8 md:px-10 md:py-10"
        style={{
          backgroundColor: colors.panel,
          borderColor: colors.border,
          boxShadow: colors.shadow,
        }}
      >
        <div className="mb-8 flex items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium" style={{ backgroundColor: colors.accentSoft, color: colors.accent, fontFamily: "DM Sans, sans-serif" }}>
            {stepIndex + 1} of 3
          </div>
          <p className="text-xs" style={{ color: colors.textMuted, fontFamily: "Varela Round, sans-serif" }}>
            Wallet: {truncateAddress(walletAddress)}
          </p>
        </div>

        <h2 className="max-w-2xl text-3xl font-bold leading-tight md:text-4xl" style={{ color: colors.text, fontFamily: "DM Sans, sans-serif" }}>
          {currentStep.question}
        </h2>

        <div className="mt-8 grid gap-4">
          {currentStep.options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className="rounded-2xl border px-5 py-5 text-left transition-transform duration-150 hover:-translate-y-0.5"
              style={{
                backgroundColor: colors.elevated,
                borderColor: colors.border,
                color: colors.text,
              }}
            >
              <span className="block text-lg font-medium" style={{ fontFamily: "DM Sans, sans-serif" }}>
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
