"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "Vault Intelligence",
      desc: "Reads Mantle vault contracts to monitor deposits, withdrawals, TVL changes, and reward behavior."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      title: "Liquidity Analysis",
      desc: "Tracks pool depth, concentration, and slippage conditions behind yield-bearing assets."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Flow Detection",
      desc: "Interprets transaction data to identify whale entries, exits, and rotation patterns."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: "AI Yield Briefs",
      desc: "Transforms onchain data into plain-English guidance you can actually act on."
    }
  ];

  const stats = [
    { value: "5+", label: "Protocols" },
    { value: "Real-time", label: "Onchain Data" },
    { value: "0", label: "Private Keys Needed" }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
              <span className="text-black font-bold text-sm">MY</span>
            </div>
            <span className="font-semibold text-lg">Mantle Yield</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/search" className="text-gray-400 hover:text-white transition-colors text-sm">
              Search
            </Link>
            <Link 
              href="/search" 
              className="px-4 py-2 rounded-lg bg-white text-black text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Analyze Wallet
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-6">
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px]" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iMC4yIj48cGF0aCBkPSJNMzAgMzBoMnYzSDI4eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Tagline */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-10">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-sm text-gray-400">AI-Powered Onchain Intelligence</span>
          </div>

          {/* Headline */}
          <h1 className="text-6xl md:text-8xl font-bold mb-8 tracking-tight leading-tight">
            <span className="block text-white">
              Yield is easy to show.
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
              Hard to trust.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Mantle Yield Advisor is an AI-powered intelligence layer that analyzes Mantle vaults, liquidity, and transaction flows to help you find yield that is <span className="text-cyan-400">sustainable</span>, <span className="text-cyan-400">liquid</span>, and worth trusting.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link 
              href="/search"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-semibold text-lg hover:opacity-90 transition-all hover:scale-105"
            >
              Analyze Wallet
            </Link>
            <button className="px-8 py-4 rounded-xl border border-white/20 text-white font-medium text-lg hover:bg-white/5 transition-all">
              See How It Works
            </button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-12">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-32 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-cyan-400 text-sm uppercase tracking-wider">The Problem</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4">Yield onchain is noisy</h2>
          </div>

          <div className="bg-gradient-to-br from-white/5 to-transparent rounded-3xl p-8 md:p-12 border border-white/10">
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              High APY alone tells you almost nothing. A vault can look attractive while hiding weak liquidity, short-lived incentives, overcrowded positioning, or unstable capital flows. Most users only see the headline number.
            </p>
            <p className="text-xl text-gray-300 leading-relaxed">
              By the time the risks become obvious, the opportunity has already changed. That&apos;s why Mantle deserves a smarter way to evaluate yield.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-cyan-400 text-sm uppercase tracking-wider">How It Works</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4">Real Mantle data.<br/>Interpreted by AI.</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <div 
                key={i}
                className="group relative bg-white/5 rounded-2xl p-8 border border-white/10 hover:border-cyan-500/30 transition-all duration-500"
                onMouseEnter={() => setHoveredFeature(i)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center mb-6 text-cyan-400">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Example Section */}
      <section className="py-32 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-cyan-400 text-sm uppercase tracking-wider">What You See</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4">Not just APY.<br/>Actual context.</h2>
          </div>

          <div className="bg-[#0f0f0f] rounded-3xl p-8 md:p-12 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold">mUSD Stable Strategy</h3>
                <p className="text-gray-400">Vault</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-cyan-400">19.4%</div>
                <p className="text-gray-500 text-sm">Current APY</p>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-white/10">
              <div className="flex items-start gap-3">
                <span className="text-cyan-400 mt-1">◆</span>
                <div>
                  <p className="text-white font-medium">AI View: Moderately attractive</p>
                  <p className="text-gray-400 text-sm">Liquidity remains healthy and recent inflows suggest growing attention from larger wallets</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-amber-400 mt-1">◆</span>
                <div>
                  <p className="text-white font-medium">What to watch</p>
                  <p className="text-gray-400 text-sm">A large share of returns currently comes from emissions rather than base strategy performance</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-400 mt-1">◆</span>
                <div>
                  <p className="text-white font-medium">Best fit</p>
                  <p className="text-gray-400 text-sm">Short- to medium-term capital deployment rather than passive long-term parking</p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-gray-500 mt-8 text-lg">
            This is the difference between seeing numbers and understanding them.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Understand the yield<br/>before you chase it.
          </h2>
          <p className="text-xl text-gray-400 mb-10">
            The AI layer for smarter yield decisions on Mantle.
          </p>
          <Link 
            href="/search"
            className="inline-block px-10 py-5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold text-lg hover:opacity-90 transition-all hover:scale-105"
          >
            Launch Mantle Yield Advisor →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
              <span className="text-black font-bold text-xs">MY</span>
            </div>
            <span className="text-gray-400 text-sm">Mantle Yield Advisor</span>
          </div>
          <p className="text-gray-500 text-sm">
            Read-only analysis. Never asks for private keys.
          </p>
        </div>
      </footer>
    </div>
  );
}
