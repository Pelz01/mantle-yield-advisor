# MantleYield IQ — Full Concept Writeup

**Topic 2: Design an AI Tool on Mantle**
**Mantle Squad Bounty: When AI Meets Mantle**

---

## Name + One-Liner

**MantleYield IQ**

An AI yield advisor that reads your on-chain history on Mantle, builds your real DeFi personality from your actual behaviour, and recommends yield strategies that actually fit who you are — not who you hope to be.

**Mantle integrations:** mETH · cmETH · Aave V3 · Merchant Moe
**Status:** Buildable today · No wallet signature required

---

## Problem Statement

Mantle has quietly become one of the richest yield ecosystems in crypto — mETH staking, cmETH restaking, Aave V3 with $1B+ TVL, Merchant Moe liquidity pools, FBTC vaults, USDY, USDe, MI4. Every one of these products offers a different return with a different risk profile.

The problem is that none of them know who you are. You land on the Mantle ecosystem and every protocol shows you the same APY number — whether you're a careful first-timer who's never touched leverage, or an experienced LP who's rotated through 12 protocols. The information doesn't care about you. You're left to figure it out yourself.

I know this feeling personally. I'm interested in yield farming but I never know which option actually fits my experience. I've seen APYs that look attractive, clicked in, and realized halfway through that the mechanics were completely outside my comfort zone. The problem isn't lack of information — it's that no tool has ever read my history and told me which yield strategy is actually right for me.

> "The question isn't which protocol has the best APY. It's which protocol has the best APY for someone with your specific experience and risk tolerance."

---

## Target User

**PRIMARY:**
Curious yield farmers on Mantle — people who hold MNT, mETH, or stablecoins and want to put them to work, but feel overwhelmed by the breadth of options. They're not protocol experts. They may have tried one or two things before. They need a trusted voice that understands their history before making a recommendation.

**SECONDARY:**
New Mantle users bridging from other chains who have on-chain history elsewhere and want to start on the right foot.

---

## How It Works — 5 Steps

### Step 1 — Wallet Input
You enter your wallet address. No signature. No connection. Read-only — your address is your only input.

### Step 2 — On-Chain History Scan
MantleYield IQ scans your full on-chain history via MantleScan API — every transaction, every token transfer, every protocol interaction. It detects which DeFi protocols you've touched, how long you stayed, and what you did.

### Step 3 — DeFi Personality Building (AI)
The AI builds your DeFi personality. Are you a passive staker? An active LP? A yield newbie? Someone who tried lending but pulled out quickly? Your actual behaviour is a more honest risk profile than any questionnaire.

**Examples of detected profiles:**
- "Conservative passive staker" → stayed in mETH for 6+ months
- "Active LP optimizer" → frequent adds/removes on Merchant Moe
- "Yield newbie" → little to no DeFi interaction history
- "Risk-tolerant rotator" → moved between 5+ protocols quickly
- "IL-sensitive" → withdrew from LP positions during volatility

### Step 4 — Live Position + Rate Scan
The tool reads your current live positions on Mantle — balances, Aave health factor, mETH/cmETH holdings — and pulls live APYs from Aave V3's UiPoolDataProvider and the mETH staking contract.

### Step 5 — Personalized Recommendation (AI Output)
The AI outputs a personalized yield strategy — not a generic APY table, but a plain-English recommendation: which protocol fits your history, what percentage allocation makes sense, what the estimated blended APY is, and what risks to watch for given your specific experience level.

**Example output for a "conservative passive staker":**
> "Based on your history, you've preferred set-and-forget positions with low maintenance. mETH staking (current APY: ~4.2%) and a small Aave V3 supply position in USDT (~8.1%) match your pattern well. Avoid LP positions for now — your history shows you've exited these quickly, suggesting the complexity isn't worth it for you yet."

---

## Mantle Integration — What It Reads On-Chain

### mETH Protocol
- Live staking rate via Staking contract
- mETHToETH() exchange rate for accumulated yield
- mETH balance detection on Mantle L2

### cmETH Restaking
- cmETH ERC-20 balance on Mantle
- Restaking exposure detection from tx history

### Aave V3 on Mantle
- UiPoolDataProvider contract → live APYs for all assets
- getUserReserveData() → health factor, supply, borrow positions
- Assets covered: mETH, cmETH, MNT, USDT, WETH

### Merchant Moe
- LP interaction history from transaction log
- Liquidity provision and removal event detection
- Impermanent loss exposure inference

### MantleScan API
- Full transaction history (txlist endpoint)
- ERC-20 token transfer history (tokentx endpoint)
- Protocol interaction decoding from contract addresses

### Mantle RPC (rpc.mantle.xyz)
- Live MNT balance
- ERC-20 token balances via balanceOf()
- eth_call for contract reads

---

## Technical Stack — Confirmed Buildable

| Component | Details |
|-----------|---------|
| Chain access | rpc.mantle.xyz — free, public, no API key. Chain ID: 5000 |
| History scan | api.mantlescan.xyz — Etherscan-compatible txlist + tokentx endpoints |
| Aave data | Aave V3 UiPoolDataProvider on Mantle mainnet — single call returns all reserve APYs + user data |
| mETH rate | mETH Staking contract — mETHToETH() method. Open source on GitHub (mantle-lsp/contracts) |
| AI analysis | Claude API (claude-sonnet-4-20250514) — on-chain data passed as structured context, returns strategy recommendation in plain English |
| Libraries | ethers.js, @aave/contract-helpers + @aave/math-utils, @mantleio/sdk |
| No wallet needed | Read-only — address input only, zero permissions or signatures required |
| Build time | Working MVP buildable in a weekend |

---

## Technical Architecture (Flow)

```
User Input: wallet address
       |
       v
[LAYER 1 — HISTORY SCAN]
MantleScan API
  → txlist: all normal transactions
  → tokentx: all ERC-20 transfers
  → Decode: which protocols touched, duration, outcomes
       |
       v
[LAYER 2 — LIVE POSITION SCAN]
Mantle RPC (rpc.mantle.xyz)
  → MNT balance
  → mETH / cmETH balances (balanceOf)
Aave V3 UiPoolDataProvider
  → Live supply APYs for all assets
  → User health factor + current positions
mETH Staking Contract
  → mETHToETH() → current staking rate
       |
       v
[LAYER 3 — AI ANALYSIS (Claude API)]
Input: formatted on-chain history + live positions
Task 1: Build DeFi personality from behaviour patterns
Task 2: Match personality to live yield opportunities
Task 3: Generate plain-English strategy with reasoning
       |
       v
[OUTPUT]
→ DeFi personality label + explanation
→ Protocol recommendations ranked by fit
→ % allocation suggestion
→ Estimated blended APY
→ Risk flags relevant to your history
```

---

## Why This Doesn't Exist Yet

Yield aggregators exist on other chains. Generic DeFi dashboards exist. But none of them are personalized to your history — and none of them are specific to Mantle's ecosystem. Most tools show you a table of APYs and leave the decision entirely to you.

MantleYield IQ flips this: instead of asking "which protocol has the highest APY?", it asks "which protocol has the right APY for someone with your experience?" That's a fundamentally different product — and one that Mantle's growing, diverse ecosystem is uniquely suited for.

The "history-first" approach means the tool gets smarter as you use Mantle more. Your first scan might show limited data. Six months later, it knows exactly what kind of yield farmer you are.

---

## Judging Criteria — How This Submission Addresses Each One

### 1. Mantle Integration ✓
Reads mETH staking contract, cmETH positions, Aave V3 UiPoolDataProvider, Merchant Moe LP history, and MantleScan transaction data — all natively on Mantle Network (Chain ID 5000). Not a generic tool that happens to mention Mantle — the entire product is built around Mantle's specific protocol stack.

### 2. Practical Value ✓
Solves a real, daily problem: yield paralysis. Anyone with assets on Mantle can input their address and walk away with a strategy they actually understand and trust. Zero technical knowledge required.

### 3. Originality ✓
No existing tool reads your on-chain history to build a DeFi personality before recommending yield. The "history-first" approach is the fresh angle that makes this different from every APY aggregator that already exists.

### 4. Clarity & Depth ✓
5-step flow is easy to follow. Technical stack is specific and confirmed. Every claim about buildability is backed by actual contract methods, API endpoints, and library names. Complex ideas (on-chain history decoding, AI personalization) are made accessible without losing substance.

### 5. Your Voice, Your Work ✓
Born from a real personal frustration — not knowing which yield fits my own experience. The "history-first" insight is my own framing of a problem I've felt directly. The design decisions (read-only access, plain-English output, Mantle-specific scope) are mine. AI was used as a research tool, not the author.

### 6. Engagement & Reach ✓
"What's your DeFi personality?" is a shareable hook. Anyone who's felt yield confusion will immediately relate — and will want to tag someone who needs this. The personal story in the problem statement gives readers an entry point.

### 7. Transparency ✓
See transparency note below.

---

## Transparency Note — AI's Role in This Submission

**Claude was used to:**
- Research Mantle's public APIs and confirm which endpoints exist
- Verify which smart contract methods are available on-chain
- Structure and format the concept writeup

**The submitter's contributions:**
- The core insight: a yield tool should read your HISTORY instead of asking you to self-assess your risk tolerance
- The personal problem statement (real experience with yield paralysis as a yield farming newcomer)
- The decision to scope this specifically to Mantle's ecosystem rather than building a generic multi-chain aggregator
- The product design decisions: read-only access, plain-English output, DeFi personality labeling system
- Directing the AI to validate buildability before committing to the concept — ensuring this isn't just a wishlist

AI was a research and structuring tool. The problem, the angle, and the product vision are human.

---

## Submission Checklist

- [x] Fully developed concept with design and strategy
- [x] Name + one-liner
- [x] Problem statement + target user
- [x] Mantle integration explained (smart contracts, APIs, data)
- [x] Technical stack confirmed buildable
- [x] All 7 judging criteria addressed
- [x] Transparency about AI's role documented
- [ ] Tag @Mantle_Official on X post
- [ ] Post on X (text/thread/article format)
- [ ] Fill out participation form
- [ ] Include visuals/mockups/flow diagrams (next deliverable)

---

*MantleYield IQ — @Mantle_Official*
