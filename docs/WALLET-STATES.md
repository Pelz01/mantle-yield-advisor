# Wallet States

Mantle Yield Advisor categorizes every wallet into one of four states based on on-chain activity. This determines what insights we can generate and how we personalize your yield strategy.

---

## The Four States

### 1. Empty

**Definition:** No tokens or transaction history on Mantle.

**What this means:**
- Wallet has never interacted with any protocol on Mantle
- No ETH, tokens, or NFTs held
- Zero transaction count

**User experience:**
> "No tokens or transaction history found on Mantle. Bridge assets to get started."

**Action:** We provide a simple onboarding flow explaining how to bridge assets to Mantle. No yield recommendations — you need skin in the game first.

---

### 2. No Yield

**Definition:** Wallet has activity but no active yield positions.

**What this means:**
- Has transacted on Mantle (maybe bought tokens, transferred funds)
- But not providing liquidity, lending, or staking anywhere
- Money is sitting idle in the wallet

**User experience:**
- Personalized DeFi personality based on transaction patterns
- Clear breakdown of what they've done (trading, NFT purchases, transfers)
- Specific yield opportunities that match their risk profile

**Why this matters:** This is the highest-leverage state. They've shown intent to use the chain — now we show them how to put that capital to work.

---

### 3. Thin History

**Definition:** 1+ transactions OR holds tokens but not deeply integrated.

**What this means:**
- Made at least one transaction, or
- Holds tokens (maybe bought and held)
- But not actively managing positions across multiple protocols

**User experience:**
- DeFi personality based on available history
- Yield recommendations tailored to current holdings
- Warning about Impermanent Loss if they consider LPing
- Risk signals for their existing (if any) positions

**Example:** "You bought MNT and held it for 3 weeks. Consider staking for 5% APY, or explore lending for variable returns."

---

### 4. Full

**Definition:** 3+ transactions AND holds active positions (tokens, LP, lending, staking).

**What this means:**
- Active DeFi user
- Money working across one or more protocols
- Sophisticated enough to understand risks

**User experience:**
- Full DeFi personality analysis
- Complete portfolio breakdown with risk assessment
- Yield optimization suggestions (rebalancing, better rates)
- Impermanent loss alerts, incentive end dates, concentration risks

**Example:** "Your wallet shows aggressive positioning across mETH and Merchant Moe. Your risk score is 7/10. Consider reducing exposure to stablecoins or exploring yield-diversified vaults."

---

## Detection Logic

```
if (totalTxCount >= 3 && hasTokens) → full
else if (totalTxCount >= 1 || hasTokens || aaveSupplied > 0) → thin_history
else if (hasActivityButNoYield) → no_yield
else → empty
```

---

## Why This Matters

**Personalization is impossible without context.** A brand new wallet gets different advice than a DeFi veteran. By classifying wallets:

1. **We don't overwhelm beginners** with complex strategies they can't act on
2. **We don't bore veterans** with beginner-level guidance
3. **We match recommendations** to actual ability to execute
4. **We surface risks** proportional to positions held

---

## Future States

We may add more states as we understand wallet behavior better:

- **Dormant:** Had activity, stopped interacting (>90 days)
- **Whale:** Large position holder (>10K TVL)
- **Trader:** High frequency, short holding periods
- **Collector:** NFT-heavy, minimal DeFi

---

*Last updated: March 2026*
