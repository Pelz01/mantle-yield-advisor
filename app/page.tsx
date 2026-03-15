"use client";

import Link from "next/link";
import { useState } from "react";
import BrandMark from "@/components/BrandMark";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);

  const colors = darkMode
    ? {
        bg: "#0a0a0a",
        panel: "#1a1a1a",
        panelSoft: "#141414",
        text: "#fff",
        textMuted: "#888",
        border: "#333",
        accent: "#ff6b35",
        accentSoft: "rgba(255,107,53,0.14)",
      }
    : {
        bg: "#fff",
        panel: "#f5f5f5",
        panelSoft: "#fff",
        text: "#1a1a2e",
        textMuted: "#666",
        border: "#e5e5e5",
        accent: "#ff6b35",
        accentSoft: "rgba(255,107,53,0.12)",
      };

  const steps = [
    {
      num: "01",
      title: "Paste a Mantle wallet",
      desc: "No login, no extension, no private key prompts. Just a wallet address and a read-only scan.",
    },
    {
      num: "02",
      title: "We read live on-chain context",
      desc: "Balances, history, and active Mantle yield opportunities are pulled in real time before analysis.",
    },
    {
      num: "03",
      title: "Get a strategy that fits",
      desc: "Recommendations are matched to wallet behavior and holdings, not a recycled top-APY list.",
    },
  ];

  const betterPoints = [
    {
      title: "History-first intelligence",
      desc: "The product starts from wallet behavior and only then maps into suitable Mantle yield routes.",
    },
    {
      title: "Holdings-aware recommendations",
      desc: "If a wallet holds MNT, mETH, or stablecoins, the strategy is expected to follow those assets.",
    },
    {
      title: "Beginner-safe fallback states",
      desc: "Empty wallets, new wallets, and active wallets each get a different tone and level of guidance.",
    },
  ];

  const features = [
    {
      title: "Wallet DNA",
      desc: "Profile labels, evidence, and recommendations are generated from real wallet activity instead of generic personas.",
    },
    {
      title: "Live APY context",
      desc: "Yield opportunities are pulled from current Mantle pools so the result feels timely and relevant.",
    },
    {
      title: "Risk signals",
      desc: "The app calls out concentration, LP, and incomplete-history risks in plain language a real user can act on.",
    },
    {
      title: "Shareable output",
      desc: "Every analysis can become a simple profile page that is easy to share across communities and conversations.",
    },
  ];

  const protocols = [
    { name: "mETH", type: "Liquid staking" },
    { name: "Aave V3", type: "Lending" },
    { name: "Merchant Moe", type: "DEX and LP" },
    { name: "AGNI", type: "AMM" },
    { name: "INIT Capital", type: "Credit markets" },
    { name: "Lendle", type: "Lending" },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.bg, color: colors.text }}>
      <nav className="fixed left-0 right-0 top-0 z-50 border-b" style={{ backgroundColor: colors.bg, borderColor: colors.border }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <BrandMark accent={colors.accent} />
            <span className="font-medium" style={{ fontFamily: "DM Sans, sans-serif" }}>
              Mantle Yield
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/analyze" className="text-sm font-medium" style={{ color: colors.textMuted }}>
              Analyze
            </Link>
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded text-lg" aria-label="Toggle theme">
              {darkMode ? "☀" : "☾"}
            </button>
          </div>
        </div>
      </nav>

      <main className="px-6 pb-24 pt-28 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <section className="relative overflow-hidden rounded-[28px] border p-8 lg:p-10" style={{ backgroundColor: colors.panel, borderColor: colors.border }}>
            <div
              className="absolute inset-x-0 top-0 h-56"
              style={{
                background:
                  darkMode
                    ? "radial-gradient(circle at 18% 8%, rgba(255,107,53,0.16), transparent 38%), radial-gradient(circle at 78% 14%, rgba(255,107,53,0.1), transparent 32%)"
                    : "radial-gradient(circle at 18% 8%, rgba(255,107,53,0.12), transparent 38%), radial-gradient(circle at 78% 14%, rgba(255,107,53,0.08), transparent 32%)",
              }}
            />
            <div className="relative">
              <div className="max-w-2xl">
                <div
                  className="mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
                  style={{ backgroundColor: colors.accentSoft, color: colors.accent, fontFamily: "DM Sans, sans-serif" }}
                >
                  Built for Mantle Network
                </div>
                <h1 className="mb-5 text-5xl font-bold leading-tight lg:text-6xl" style={{ fontFamily: "DM Sans, sans-serif" }}>
                  The AI layer for smarter yield decisions on <span style={{ color: colors.accent }}>Mantle</span>
                </h1>
                <p className="mb-8 max-w-xl text-lg leading-8" style={{ color: colors.textMuted, fontFamily: "Varela Round, sans-serif" }}>
                  We read your on-chain history to understand your DeFi personality — then recommend yield strategies that actually fit what you do.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <Link
                    href="/analyze"
                    className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-medium text-white"
                    style={{ backgroundColor: colors.accent, fontFamily: "DM Sans, sans-serif" }}
                  >
                    Analyze Wallet
                  </Link>
                  <p className="text-sm" style={{ color: colors.textMuted, fontFamily: "Varela Round, sans-serif" }}>
                    Read-only. No keys. No account.
                  </p>
                </div>
              </div>

            </div>
          </section>

          <section className="mt-12 grid gap-4 lg:grid-cols-3">
            {betterPoints.map((point) => (
              <div key={point.title} className="rounded-xl border p-6" style={{ backgroundColor: colors.panel, borderColor: colors.border }}>
                <p className="mb-3 text-xs uppercase tracking-[0.18em]" style={{ color: colors.accent, fontFamily: "DM Sans, sans-serif" }}>
                  What makes it better
                </p>
                <h2 className="mb-2 text-xl font-semibold" style={{ fontFamily: "DM Sans, sans-serif" }}>
                  {point.title}
                </h2>
                <p className="text-sm leading-7" style={{ color: colors.textMuted, fontFamily: "Varela Round, sans-serif" }}>
                  {point.desc}
                </p>
              </div>
            ))}
          </section>

          <section className="mt-16">
            <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em]" style={{ color: colors.accent, fontFamily: "DM Sans, sans-serif" }}>
                  Workflow
                </p>
                <h2 className="mt-2 text-3xl font-bold" style={{ fontFamily: "DM Sans, sans-serif" }}>
                  How the analysis works
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-7" style={{ color: colors.textMuted, fontFamily: "Varela Round, sans-serif" }}>
                The flow is deliberately simple on the surface, but grounded in live on-chain context underneath.
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              {steps.map((step) => (
                <div key={step.num} className="rounded-xl border p-6" style={{ backgroundColor: colors.panel, borderColor: colors.border }}>
                  <p className="mb-5 text-4xl font-bold" style={{ color: colors.accent, fontFamily: "DM Sans, sans-serif" }}>
                    {step.num}
                  </p>
                  <h3 className="mb-2 text-xl font-semibold" style={{ fontFamily: "DM Sans, sans-serif" }}>
                    {step.title}
                  </h3>
                  <p className="text-sm leading-7" style={{ color: colors.textMuted, fontFamily: "Varela Round, sans-serif" }}>
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-16 grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <div className="rounded-xl border p-7" style={{ backgroundColor: colors.panel, borderColor: colors.border }}>
              <p className="text-xs uppercase tracking-[0.18em]" style={{ color: colors.accent, fontFamily: "DM Sans, sans-serif" }}>
                Example output
              </p>
              <div className="mt-5 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold" style={{ fontFamily: "DM Sans, sans-serif" }}>
                    Yield Explorer
                  </h3>
                  <p className="mt-2 text-sm" style={{ color: colors.textMuted, fontFamily: "Varela Round, sans-serif" }}>
                    14 transactions, 3 detected protocol signals, 47-day max hold
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-bold" style={{ color: colors.accent, fontFamily: "DM Sans, sans-serif" }}>
                    7.8%
                  </p>
                  <p className="text-xs uppercase tracking-[0.16em]" style={{ color: colors.textMuted }}>
                    Blended APY
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {[
                  { name: "mETH stake", info: "50% allocation", apy: "4.2%" },
                  { name: "Aave supply", info: "30% allocation", apy: "8.1%" },
                  { name: "Merchant Moe LP", info: "20% allocation", apy: "16.5%" },
                ].map((row) => (
                  <div key={row.name} className="flex items-center justify-between rounded-xl border px-4 py-4" style={{ borderColor: colors.border }}>
                    <div>
                      <p className="font-medium" style={{ fontFamily: "DM Sans, sans-serif" }}>
                        {row.name}
                      </p>
                      <p className="text-sm" style={{ color: colors.textMuted }}>
                        {row.info}
                      </p>
                    </div>
                    <p className="text-lg font-semibold" style={{ color: colors.accent, fontFamily: "DM Sans, sans-serif" }}>
                        {row.apy}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-xl p-4" style={{ backgroundColor: colors.accentSoft }}>
                <p className="text-sm italic leading-7" style={{ color: colors.text, fontFamily: "Varela Round, sans-serif" }}>
                  “You have a clear history with mETH and stable assets, so the strategy blends conservative yield with one higher-upside allocation.”
                </p>
              </div>
            </div>

            <div className="grid gap-6">
              <div className="rounded-xl border p-7" style={{ backgroundColor: colors.panel, borderColor: colors.border }}>
                <p className="text-xs uppercase tracking-[0.18em]" style={{ color: colors.accent, fontFamily: "DM Sans, sans-serif" }}>
                  Supported protocols
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {protocols.map((protocol) => (
                    <div key={protocol.name} className="rounded-xl border px-4 py-4" style={{ borderColor: colors.border }}>
                      <p className="font-medium" style={{ fontFamily: "DM Sans, sans-serif" }}>
                        {protocol.name}
                      </p>
                      <p className="mt-1 text-sm" style={{ color: colors.textMuted }}>
                        {protocol.type}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border p-7" style={{ backgroundColor: colors.panel, borderColor: colors.border }}>
                <p className="text-xs uppercase tracking-[0.18em]" style={{ color: colors.accent, fontFamily: "DM Sans, sans-serif" }}>
                  What you get
                </p>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {features.map((feature) => (
                    <div key={feature.title} className="rounded-xl border p-4" style={{ borderColor: colors.border }}>
                      <h3 className="mb-2 font-semibold" style={{ fontFamily: "DM Sans, sans-serif" }}>
                        {feature.title}
                      </h3>
                      <p className="text-sm leading-7" style={{ color: colors.textMuted, fontFamily: "Varela Round, sans-serif" }}>
                        {feature.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="mt-16 rounded-xl border px-8 py-10 text-center" style={{ backgroundColor: colors.panel, borderColor: colors.border }}>
            <p className="text-xs uppercase tracking-[0.2em]" style={{ color: colors.accent, fontFamily: "DM Sans, sans-serif" }}>
              Read-only by design
            </p>
            <h2 className="mt-3 text-3xl font-bold" style={{ fontFamily: "DM Sans, sans-serif" }}>
              No wallet connection required
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7" style={{ color: colors.textMuted, fontFamily: "Varela Round, sans-serif" }}>
              Mantle Yield IQ only reads public on-chain data. No private keys, no transaction signing, and no account setup required.
            </p>
            <div className="mt-8">
              <Link
                href="/analyze"
                className="inline-flex items-center justify-center rounded-lg px-8 py-4 text-lg font-medium text-white"
                style={{ backgroundColor: colors.accent, fontFamily: "DM Sans, sans-serif" }}
              >
                Analyze Your Wallet
              </Link>
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t px-6 py-12 lg:px-8" style={{ borderColor: colors.border, backgroundColor: colors.panel }}>
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1.2fr)_repeat(3,minmax(0,0.6fr))]">
          <div>
            <div className="flex items-center gap-3">
              <BrandMark accent={colors.accent} />
              <div>
                <p className="text-base font-semibold" style={{ fontFamily: "DM Sans, sans-serif" }}>
                  Mantle Yield IQ
                </p>
                <p className="text-sm" style={{ color: colors.textMuted, fontFamily: "Varela Round, sans-serif" }}>
                  AI-guided yield strategy for Mantle wallets.
                </p>
              </div>
            </div>
            <p className="mt-5 max-w-md text-sm leading-7" style={{ color: colors.textMuted, fontFamily: "Varela Round, sans-serif" }}>
              Built to make wallet analysis understandable, credible, and useful for real Mantle users and curious first-time farmers.
            </p>
          </div>

          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.18em]" style={{ color: colors.accent, fontFamily: "DM Sans, sans-serif" }}>
              Product
            </p>
            <div className="space-y-3 text-sm" style={{ color: colors.textMuted, fontFamily: "Varela Round, sans-serif" }}>
              <Link href="/" className="block">Home</Link>
              <Link href="/analyze" className="block">Analyze wallet</Link>
            </div>
          </div>

          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.18em]" style={{ color: colors.accent, fontFamily: "DM Sans, sans-serif" }}>
              Trust
            </p>
            <div className="space-y-3 text-sm" style={{ color: colors.textMuted, fontFamily: "Varela Round, sans-serif" }}>
              <p>Read-only wallet checks</p>
              <p>No keys collected</p>
              <p>No account required</p>
            </div>
          </div>

          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.18em]" style={{ color: colors.accent, fontFamily: "DM Sans, sans-serif" }}>
              Built for
            </p>
            <div className="space-y-3 text-sm" style={{ color: colors.textMuted, fontFamily: "Varela Round, sans-serif" }}>
              <p>Mantle users</p>
              <p>DeFi newcomers</p>
              <p>On-chain research</p>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-10 flex max-w-6xl flex-col gap-3 border-t pt-6 text-sm md:flex-row md:items-center md:justify-between" style={{ borderColor: colors.border, color: colors.textMuted, fontFamily: "Varela Round, sans-serif" }}>
          <p>Professional, read-only wallet intelligence for Mantle.</p>
          <p>Built for clear recommendations, not generic APY noise.</p>
        </div>
      </footer>
    </div>
  );
}
