# Agent Integration

MantleYield IQ can be used by AI agents to provide personalized yield recommendations.

---

## API Endpoint

```
POST /api/analyze
```

### Request

```json
{
  "address": "0x..."
}
```

### Response

```json
{
  "profile": {
    "label": "Yield Explorer",
    "evidence": "14 txns · 3 protocols · 47-day max hold",
    "stats": {
      "total_transactions": 14,
      "protocols_used": 3,
      "longest_position_days": 47,
      "last_active_days_ago": 23
    }
  },
  "blended_apy": {
    "total": 7.8,
    "breakdown": [...]
  },
  "strategies": [
    {
      "protocol": "mETH",
      "action": "Stake",
      "allocation_pct": 50,
      "live_apy": 4.2,
      "why": "You've held mETH for 47 days",
      "fit_score": 8
    }
  ],
  "current_holdings": {...},
  "risks": [...],
  "confidence": {...}
}
```

---

## Use Cases for Agents

### Portfolio Management
Agents can monitor user wallets and suggest yield optimizations

### Risk Assessment
Pull risk data specific to each wallet

### Rebalancing
Use allocation recommendations to auto-rebalance portfolios

### Monitoring
Track wallet activity and alert on changes

---

## Notes

- API requires ANTHROPIC_API_KEY environment variable
- Rate limiting: TBD
- Temperature: 0 (deterministic output)

---

*Last updated: March 13, 2026*
