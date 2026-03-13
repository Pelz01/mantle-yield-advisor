"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [darkMode, setDarkMode] = useState(true);

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

  const theme = darkMode ? "dark" : "light";

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? "bg-[#0a0a0a] text-white" : "bg-[#fafafa] text-[#1a1a1a]"
    }`}>
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 border-b transition-colors duration-300 ${
        darkMode ? "border-white/5 bg-[#0a0a0a]/80" : "border-black/10 bg-[#fafafa]/80"
      } backdrop-blur-xl`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              darkMode ? "bg-black border border-white/20" : "bg-white border border-black/10"
            }`}>
              <span className={`font-bold text-sm ${darkMode ? "text-white" : "text-black"}`}>MY</span>
            </div>
            <span className={`font-semibold text-lg ${darkMode ? "text-white" : "text-black"}`}>Mantle Yield</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/search" className={`text-sm transition-colors ${
              darkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-black"
            }`}>
              Search
            </Link>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg transition-colors ${
                darkMode ? "bg-white/5 hover:bg-white/10" : "bg-black/5 hover:bg-black/10"
              }`}
            >
              {darkMode ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <Link 
              href="/search" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                darkMode 
                  ? "bg-white text-black hover:bg-gray-200" 
                  : "bg-black text-white hover:bg-gray-800"
              }`}
            >
              Analyze Wallet
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-6">
        <div className="relative max-w-4xl mx-auto text-center">
          {/* Tagline */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-10 transition-colors ${
            darkMode ? "bg-white/5 border border-white/10" : "bg-black/5 border border-black/10"
          }`}>
            <span className={`w-2 h-2 rounded-full ${darkMode ? "bg-cyan-400" : "bg-black"}`} />
            <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>AI-Powered Onchain Intelligence</span>
          </div>

          {/* Headline */}
          <h1 className="text-6xl md:text-8xl font-bold mb-8 tracking-tight leading-tight">
            <span className="block">
              The AI layer for smarter
            </span>
            <span className={`block ${darkMode ? "text-[#00C3F5]" : "text-black"}`}>
              yield decisions on Mantle
            </span>
          </h1>

          {/* Subheadline */}
          <p className={`text-xl md:text-2xl max-w-2xl mx-auto mb-12 leading-relaxed ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}>
            Analyze Mantle vaults, liquidity, and transaction flows to find yield that is <span className={darkMode ? "text-[#00C3F5]" : "text-black"}>sustainable</span>, <span className={darkMode ? "text-[#00C3F5]" : "text-black"}>liquid</span>, and worth trusting.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link 
              href="/search"
              className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 ${
                darkMode 
                  ? "bg-[#00C3F5] text-black hover:opacity-90" 
                  : "bg-black text-white hover:bg-gray-800"
              }`}
            >
              Analyze Wallet
            </Link>
            <button className={`px-8 py-4 rounded-xl font-medium text-lg transition-colors ${
              darkMode 
                ? "border border-white/20 text-white hover:bg-white/5" 
                : "border border-black/20 text-black hover:bg-black/5"
            }`}>
              See How It Works
            </button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-12">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className={`text-3xl md:text-4xl font-bold mb-1 ${darkMode ? "text-white" : "text-black"}`}>{stat.value}</div>
                <div className={`text-sm uppercase tracking-wider ${darkMode ? "text-gray-500" : "text-gray-400"}`}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className={`py-32 px-6 border-t transition-colors ${
        darkMode ? "border-white/5" : "border-black/10"
      }`}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className={`text-sm uppercase tracking-wider ${darkMode ? "text-[#00C3F5]" : "text-black"}`}>The Problem</span>
            <h2 className={`text-4xl md:text-5xl font-bold mt-4 ${darkMode ? "text-white" : "text-black"}`}>Yield onchain is noisy</h2>
          </div>

          <div className={`rounded-3xl p-8 md:p-12 border transition-colors ${
            darkMode ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"
          }`}>
            <p className={`text-xl leading-relaxed mb-8 ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}>
              High APY alone tells you almost nothing. A vault can look attractive while hiding weak liquidity, short-lived incentives, overcrowded positioning, or unstable capital flows. Most users only see the headline number.
            </p>
            <p className={`text-xl leading-relaxed ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}>
              By the time the risks become obvious, the opportunity has already changed. That&apos;s why Mantle deserves a smarter way to evaluate yield.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-32 px-6 border-t transition-colors ${
        darkMode ? "border-white/5" : "border-black/10"
      }`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <span className={`text-sm uppercase tracking-wider ${darkMode ? "text-[#00C3F5]" : "text-black"}`}>How It Works</span>
            <h2 className={`text-4xl md:text-5xl font-bold mt-4 ${darkMode ? "text-white" : "text-black"}`}>Real Mantle data.<br/>Interpreted by AI.</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <div 
                key={i}
                className={`rounded-2xl p-8 border transition-colors duration-500 ${
                  darkMode 
                    ? "bg-white/5 border-white/10 hover:border-[#00C3F5]/30" 
                    : "bg-black/5 border-black/10 hover:border-black/30"
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
                  darkMode ? "bg-[#00C3F5]/10 text-[#00C3F5]" : "bg-black/10 text-black"
                }`}>
                  {feature.icon}
                </div>
                <h3 className={`text-xl font-semibold mb-3 ${darkMode ? "text-white" : "text-black"}`}>{feature.title}</h3>
                <p className={`leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Example Section */}
      <section className={`py-32 px-6 border-t transition-colors ${
        darkMode ? "border-white/5" : "border-black/10"
      }`}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className={`text-sm uppercase tracking-wider ${darkMode ? "text-[#00C3F5]" : "text-black"}`}>What You See</span>
            <h2 className={`text-4xl md:text-5xl font-bold mt-4 ${darkMode ? "text-white" : "text-black"}`}>Not just APY.<br/>Actual context.</h2>
          </div>

          <div className={`rounded-3xl p-8 md:p-12 border transition-colors ${
            darkMode ? "bg-[#0f0f0f] border-white/10" : "bg-white border-black/10"
          }`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-black"}`}>mUSD Stable Strategy</h3>
                <p className={darkMode ? "text-gray-400" : "text-gray-500"}>Vault</p>
              </div>
              <div className="text-right">
                <div className={`text-4xl font-bold ${darkMode ? "text-[#00C3F5]" : "text-black"}`}>19.4%</div>
                <p className={darkMode ? "text-gray-500 text-sm" : "text-gray-400 text-sm"}>Current APY</p>
              </div>
            </div>

            <div className={`space-y-4 pt-6 border-t ${darkMode ? "border-white/10" : "border-black/10"}`}>
              <div className="flex items-start gap-3">
                <span className={darkMode ? "text-[#00C3F5] mt-1" : "text-black mt-1"}>◆</span>
                <div>
                  <p className={`font-medium ${darkMode ? "text-white" : "text-black"}`}>AI View: Moderately attractive</p>
                  <p className={darkMode ? "text-gray-400 text-sm" : "text-gray-600 text-sm"}>Liquidity remains healthy and recent inflows suggest growing attention from larger wallets</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-amber-400 mt-1">◆</span>
                <div>
                  <p className={`font-medium ${darkMode ? "text-white" : "text-black"}`}>What to watch</p>
                  <p className={darkMode ? "text-gray-400 text-sm" : "text-gray-600 text-sm"}>A large share of returns currently comes from emissions rather than base strategy performance</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className={darkMode ? "text-blue-400 mt-1" : "text-black mt-1"}>◆</span>
                <div>
                  <p className={`font-medium ${darkMode ? "text-white" : "text-black"}`}>Best fit</p>
                  <p className={darkMode ? "text-gray-400 text-sm" : "text-gray-600 text-sm"}>Short- to medium-term capital deployment rather than passive long-term parking</p>
                </div>
              </div>
            </div>
          </div>

          <p className={`text-center mt-8 text-lg ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
            This is the difference between seeing numbers and understanding them.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-32 px-6 border-t transition-colors ${
        darkMode ? "border-white/5" : "border-black/10"
      }`}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${darkMode ? "text-white" : "text-black"}`}>
            Understand the yield<br/>before you chase it.
          </h2>
          <p className={`text-xl mb-10 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            The AI layer for smarter yield decisions on Mantle.
          </p>
          <Link 
            href="/search"
            className={`inline-block px-10 py-5 rounded-xl font-bold text-lg transition-all hover:scale-105 ${
              darkMode 
                ? "bg-[#00C3F5] text-black hover:opacity-90" 
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            Launch Mantle Yield Advisor →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 px-6 border-t transition-colors ${
        darkMode ? "border-white/5" : "border-black/10"
      }`}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded flex items-center justify-center ${
              darkMode ? "bg-black border border-white/20" : "bg-white border border-black/10"
            }`}>
              <span className={`font-bold text-xs ${darkMode ? "text-white" : "text-black"}`}>MY</span>
            </div>
            <span className={darkMode ? "text-gray-400 text-sm" : "text-gray-500 text-sm"}>Mantle Yield Advisor</span>
          </div>
          <p className={darkMode ? "text-gray-500 text-sm" : "text-gray-400 text-sm"}>
            Read-only analysis. Never asks for private keys.
          </p>
        </div>
      </footer>
    </div>
  );
}
