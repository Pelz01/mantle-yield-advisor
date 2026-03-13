# MantleYield IQ — Structured Output API Specification

## The Prompt Strategy

Every output must be **impossible to generate without reading that specific wallet**. If the output could apply to any wallet, it's not good enough.

---

## System Prompt

```
You are MantleYield IQ, a DeFi yield advisor for Mantle Network. You analyze real on-chain wallet data and produce personalized yield strategy recommendations.

RULES — enforce every single one:
1. Every claim must reference specific data from the wallet history provided. If you cannot point to evidence, do not make the claim.
2. Risk warnings must be specific to THIS wallet. Never output generic risks like "smart contract risk" or "market volatility" — those apply to everyone and add zero value.
3. Allocation percentages must be justified by observed behaviour patterns, not invented.
4. If wallet history is thin (fewer than 5 transactions), say so honestly and reduce confidence in recommendations.
5. APY figures must use only the live rates provided in the data. Never invent or estimate APY numbers.
6. Respond ONLY in valid JSON. No preamble, no explanation outside the JSON object.
```

---

## User Prompt Structure

```typescript
const userPrompt = `Analyze this Mantle wallet and return a yield strategy recommendation.

WALLET ADDRESS: ${wallet}

ON-CHAIN HISTORY:
${JSON.stringify(historyData, null, 2)}
// Contains: protocols touched, dates, duration held, exit behaviour

CURRENT POSITIONS:
${JSON.stringify(positionsData, null, 2)}
// Contains: MNT balance, mETH balance, Aave positions, health factor

LIVE APYs ON MANTLE RIGHT NOW:
${JSON.stringify(apyData, null, 2)}
// Contains: mETH staking rate, Aave supply rates per asset, Merchant Moe pool APYs

Return this exact JSON structure:`
```

---

## Required JSON Output Structure

```json
{
  "profile": {
    "label": "2-word label e.g. Yield Explorer",
    "evidence": "1 sentence citing specific wallet facts that justify this label",
    "stats": {
      "total_transactions": <number>,
      "protocols_used": <number>,
      "longest_position_days": <number>,
      "last_active_days_ago": <number>
    }
  },

  "blended_apy": {
    "total": <number — calculated from allocations × live rates>,
    "breakdown": [
      {
        "protocol": "mETH",
        "action": "Stake",
        "live_apy": <number from apyData>,
        "allocation_pct": <number>,
        "contribution": <allocation × live_apy / 100>
      }
    ]
  },

  "strategies": [
    {
      "protocol": "mETH | Aave | Merchant Moe",
      "action": "Stake | Supply | LP",
      "allocation_pct": <number>,
      "live_apy": <number>,
      "why": "1 sentence rooted in wallet history",
      "fit_score": <1-10 based on history match>
    }
  ],

  "current_holdings": {
    "mnt": <balance>,
    "meth": <balance>,
    "aave_supplied": <total USD value>,
    "aave_health_factor": <number or null>,
    "lp_positions": <number of active LP positions>
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
    "reason": "e.g. only 3 transactions found — limited history to build profile from"
  }
}
```

---

## Field Requirements

| Field | What it prevents |
|-------|------------------|
| `profile.evidence` | Horoscope-style personality labels |
| `stats` | Generic descriptions without counting real data |
| `blended_apy.breakdown` | Magic numbers without math transparency |
| `strategies[].why` | Generic allocation reasoning |
| `strategies[].fit_score` | No signal for sorting/highlighting |
| `risks[].evidence` | Generic risks like "market volatility" |
| `confidence` | Overconfident recommendations on thin data |
| `current_holdings` | Ignoring what user already has |

---

## API Configuration

```typescript
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-20250514',
  max_tokens: 2000,
  temperature: 0,  // ← deterministic, not creative
  system: systemPrompt,
  messages: [{ role: 'user', content: userPrompt }]
})
```

---

## Parsing Safely

```typescript
const content = response.content[0].text

// Strip any accidental markdown fences
const clean = content.replace(/```json|```/g, '').trim()

try {
  const result = JSON.parse(clean)
  return Response.json(result)
} catch (e) {
  return Response.json({ error: 'Analysis failed', raw: content }, { status: 500 })
}
```

---

## Live Data Sources

The API must fetch real-time data from:

1. **Mantle RPC** (`rpc.mantle.xyz`)
   - Wallet MNT balance
   - Token balances (mETH, cmETH)

2. **MantleScan API**
   - Transaction history
   - Token transfer history

3. **Aave V3 UiPoolDataProvider (Mantle)**
   - Live supply/borrow rates
   - User health factor
   - Positions

4. **mETH Staking Contract**
   - Current staking APY
   - Exchange rate

5. **Merchant Moe / Bybit Vault / MI4**
   - Pool APYs (from contracts or indexers)

---

*Last updated: March 13, 2026*
