# AGENTS.md

## Purpose

This repository is a Next.js application for analyzing Mantle wallets and recommending yield strategies.

The core product flow is:

`enter wallet -> answer 3 questions -> analyze -> review strategy`

Agents working in this repo should optimize for:

- keeping the app runnable locally
- preserving truthful recommendation behavior
- not breaking the analysis API contract
- not degrading the wallet-questionnaire flow

## Quick start

From the repository root:

```bash
npm install
npm run dev
```

Local URL:

- `http://localhost:3000`

Important routes:

- `/`
- `/analyze`
- `/profile/[address]`
- `/api/analyze`

Build verification:

```bash
npm run build
```

Use `npm run build` as the main verification command after backend, prompt, or UI changes.

## Environment variables

Expected local environment variables:

```env
POLLINATIONS_API_KEY=...
ETHERSCAN_API_KEY=...
AAVE_POOL_ADDRESSES_PROVIDER=...
AAVE_UI_POOL_DATA_PROVIDER=...
```

Notes:

- `POLLINATIONS_API_KEY` is the key variable for AI generation.
- Aave variables are optional depending on how much Aave enrichment is needed.
- Missing upstream credentials can reduce data quality without fully breaking the app.

## Key files

### App UI

- `app/page.tsx`
  - landing page
- `app/analyze/page.tsx`
  - main analysis experience
- `app/profile/[address]/page.tsx`
  - shareable analysis page
- `app/components/RiskQuestions.tsx`
  - 3-step question flow before analysis

### API and logic

- `app/api/analyze/route.ts`
  - main server route
  - reads wallet address and risk answers
  - computes wallet state
  - assembles data for AI analysis

- `lib/riskScore.ts`
  - bounded scoring from user answers plus on-chain adjustment

- `lib/history.ts`
  - transaction history analysis
  - protocol usage heuristics

- `lib/positions.ts`
  - native balance and token detection

- `lib/yields.ts`
  - Mantle pool ingestion from DefiLlama
  - pool ordering logic

- `lib/claude.ts`
  - AI prompt rules
  - Pollinations request handling
  - JSON parsing, retries, fallback behavior

## Architecture notes

### Analysis pipeline

1. User enters wallet address.
2. User answers 3 risk questions.
3. `/api/analyze` reads:
   - balances
   - transaction history
   - yield pools
   - optional Aave data
4. Risk profile is computed from:
   - user answers
   - bounded on-chain adjustment
5. AI returns:
   - profile
   - blended APY
   - strategies
   - risks
   - confidence
   - risk profile summary
6. UI renders the result cards.

### Wallet states

Current important states:

- `empty`
- `no_yield`
- `full`

The frontend still has some support for `thin_history`, but current classifier behavior is primarily built around the three states above.

## Guardrails

### Do not casually change these behaviors

- Risk scoring tiers:
  - `0-2` conservative
  - `3-4` moderate
  - `5-6` aggressive
- Recommendations should remain:
  - token-aware
  - risk-tier-aware
  - APY-honest
- The analysis page should keep:
  - sustainable APY vs rewards-inclusive APY distinction
  - strategy-level APY breakdown

### AI behavior expectations

`lib/claude.ts` contains important business rules.

Agents should preserve these themes:

- match recommendations to wallet holdings
- do not let token matching completely override risk tier
- prefer higher-APY matching pools for moderate/aggressive users
- keep profile labels consistent with the computed risk profile
- avoid generic rationale
- disclose incentive dependence when relevant

## Known failure modes

### Pollinations JSON truncation

The AI provider can return malformed or truncated JSON.

Current defenses include:

- strict prompt instructions
- raw response preview logging
- sanitization before parsing
- retries before fallback
- fallback analysis when parsing fails

If users report strange generic copy, check whether the app hit fallback behavior in `lib/claude.ts`.

### Stale local Next cache

If local dev shows missing chunk/module errors, clear `.next` and restart:

```bash
Remove-Item -Recurse -Force .next
npm run dev
```

### Explorer or upstream data instability

Some balance/history issues may come from explorer/API instability rather than UI bugs.

Before changing product logic, confirm whether:

- balances are being fetched
- yield pool list is current
- AI response is valid

## Testing checklist

Minimum useful test pass:

1. Homepage loads.
2. Analyze page loads.
3. Valid wallet address opens question flow.
4. Back and next work in the questionnaire.
5. API returns a result without crashing.
6. Build passes.

Good manual wallet checks:

- wallet with holdings but no yield
- wallet with 5+ transactions
- wallet with stablecoins
- wallet with mETH or WETH exposure

## Editing guidance

- Prefer targeted changes.
- Do not rewrite prompt logic casually if a smaller rule addition will solve the issue.
- When touching `lib/claude.ts`, always run a production build afterward.
- When changing recommendation logic, keep user-facing honesty higher than hype.

## Deployment note

This project is deployed on Vercel.

If production behavior differs from local:

- compare environment variables
- inspect Vercel function logs
- check whether Pollinations output was truncated
