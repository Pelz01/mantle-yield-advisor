# Mantle Yield IQ

Mantle Yield IQ is an AI-guided wallet analysis tool for Mantle Network.

It reads a Mantle wallet's balances, transaction history, and available yield opportunities, then turns that data into a personalized yield strategy with:

- a wallet profile
- a risk-aware recommendation set
- blended APY analysis
- clear strategy-level rationale
- shareable profile links

The product is designed for a simple flow:

`enter wallet -> answer 3 questions -> analyze on-chain data -> get tailored Mantle yield recommendations`

For agent-specific operating instructions, see [AGENTS.md](C:\Users\faley\Documents\Playground\mantle-yield-advisor\AGENTS.md).

## Why this exists

Most yield tools tell users what is available.
Mantle Yield IQ tries to tell users what fits.

The app combines:

- live Mantle wallet balances
- Mantle transaction and behavior signals
- current Mantle yield pool data
- a short user preference flow

That lets the recommendation engine use both:

- what the wallet has done on-chain
- what the user says they actually want

## Core product flow

1. User enters a Mantle wallet address.
2. The app asks three short questions about goals, time horizon, and loss tolerance.
3. The API reads the wallet's balances and transaction history.
4. The app computes a bounded risk profile from:
   - stated answers
   - on-chain behavior adjustment
5. The AI layer matches the wallet's holdings and risk tier to live Mantle yield opportunities.
6. The UI presents:
   - wallet profile
   - current holdings
   - blended APY
   - recommended strategies
   - risks
   - confidence

## Features

- Mantle wallet analysis from a simple pasted address
- dynamic holdings surfacing for major Mantle assets
- wallet-state handling for:
  - `empty`
  - `no_yield`
  - `full`
- 3-step risk questionnaire before analysis
- bounded risk scoring:
  - conservative
  - moderate
  - aggressive
- strategy recommendations matched to wallet holdings
- APY transparency:
  - sustainable APY
  - rewards-inclusive APY where relevant
  - strategy-level APY breakdown
- fallback protection when upstream AI returns malformed JSON
- shareable public profile page per wallet

## Tech stack

- [Next.js 14](https://nextjs.org/)
- React 18
- TypeScript
- Tailwind CSS
- Ethers.js
- DefiLlama yields API
- Pollinations chat completions API
- Aave helper libraries

## Project structure

```text
app/
  analyze/                Main analysis experience
  api/analyze/            Server-side wallet analysis route
  components/             App-specific UI components
  profile/[address]/      Shareable wallet profile page
  layout.tsx              Root app layout
  page.tsx                Landing page

components/
  BrandMark.tsx           Shared product mark

lib/
  aave.ts                 Aave position helpers
  claude.ts               AI recommendation prompt + parsing
  history.ts              Mantle wallet history analysis
  positions.ts            Wallet balance and token detection
  riskScore.ts            User answers + on-chain risk scoring
  yields.ts               Mantle pool ingestion from DefiLlama

docs/
  YIELD-RESEARCH.md       Yield landscape notes
```

## How risk profiling works

The app asks three questions:

1. Goal
2. Time horizon
3. Reaction to a 20% drawdown

Those answers create a base score from `0` to `6`.

On-chain behavior then adjusts that score by at most `+1` or `-1`.
That adjustment can refine the user profile, but it cannot completely flip the user's stated intent.

Final tiers:

- `0-2` -> conservative
- `3-4` -> moderate
- `5-6` -> aggressive

## Data sources

### Wallet balances and activity

The app reads Mantle wallet balances and transaction history through on-chain RPC and explorer-compatible sources used by the backend helpers in:

- [positions.ts](C:\Users\faley\Documents\Playground\mantle-yield-advisor\lib\positions.ts)
- [history.ts](C:\Users\faley\Documents\Playground\mantle-yield-advisor\lib\history.ts)

### Yield opportunities

Live yield pools come from DefiLlama and are filtered to Mantle pools in:

- [yields.ts](C:\Users\faley\Documents\Playground\mantle-yield-advisor\lib\yields.ts)

The pool ranking is tuned to balance:

- APY
- TVL

so lower-TVL but still relevant higher-yield Mantle pools are not buried.

### AI recommendation layer

The AI generation step lives in:

- [claude.ts](C:\Users\faley\Documents\Playground\mantle-yield-advisor\lib\claude.ts)

It is responsible for:

- prompt construction
- recommendation rules
- JSON parsing
- fallback behavior when model output is malformed or truncated

## Environment variables

Create a `.env.local` file for local development with:

```env
POLLINATIONS_API_KEY=your_pollinations_key
ETHERSCAN_API_KEY=your_key_if_used
AAVE_POOL_ADDRESSES_PROVIDER=optional
AAVE_UI_POOL_DATA_PROVIDER=optional
```

Notes:

- `POLLINATIONS_API_KEY` is the main required variable for AI generation.
- Aave variables are optional depending on how fully you want Aave enrichment to work.
- Explorer/API availability can change over time, so production behavior may depend on the reliability of upstream providers.

## Local development

If you are working with a coding agent or automation, also read [AGENTS.md](C:\Users\faley\Documents\Playground\mantle-yield-advisor\AGENTS.md) for startup, verification, and debugging guidance.

Install dependencies:

```bash
npm install
```

Run the dev server:

```bash
npm run dev
```

Open:

- [http://localhost:3000](http://localhost:3000)

Production build:

```bash
npm run build
```

Start production server locally:

```bash
npm run start
```

## Deployment

This app is structured for Vercel deployment.

Recommended steps:

1. Import the repo into Vercel.
2. Add the required environment variables.
3. Deploy from `main`.

Because the analysis route is server-side, all AI and wallet-analysis secrets must remain server-only.

## UX states

The analysis flow distinguishes between different wallet conditions so the UI does not overclaim certainty.

### Empty

Used when the wallet has no visible Mantle activity or holdings.

### No yield

Used when the wallet has tokens but no meaningful yield participation yet.

### Full

Used when the wallet has enough signal to produce a fuller personalized profile.

## Important implementation notes

### AI output hardening

Pollinations responses can occasionally be malformed or truncated.

To reduce user-facing failures, the app includes:

- stricter prompt rules for JSON output
- response preview logging
- sanitization before parsing
- retry attempts before fallback
- fallback analysis as a final guardrail

### APY handling

The UI distinguishes between:

- sustainable APY
- rewards-inclusive APY

This is important because some pools rely on incentive emissions that may not persist.

### Recommendation honesty

The prompt contains explicit rules to prevent:

- beginner labels for aggressive wallets
- generic rationale not tied to the actual wallet
- pretending protocol detection is complete when it is not

## Current limitations

- protocol interaction detection is still incomplete in edge cases
- upstream explorer and AI providers can be inconsistent
- some Mantle pools may require conversion steps not yet fully surfaced in UI copy
- recommendation quality depends on both live pool data and current model behavior

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Submission framing

Mantle Yield IQ is best understood as:

- a wallet intelligence layer for Mantle
- a personalized yield recommendation engine
- a bridge between raw on-chain behavior and actionable DeFi decisions

The goal is not to show every yield pool.
The goal is to show the right next move for a specific wallet.

## License

This project is open source under the MIT License.
See [LICENSE](C:\Users\faley\Documents\Playground\mantle-yield-advisor\LICENSE).
