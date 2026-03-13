# Mantle Ecosystem Yield Opportunities Research

> Research compiled: March 2026
> Focus: Real-time yield rates, verified sources, and on-chain data methods

---

## 1. mETH Staking (Liquid Staking)

### Current Yield
- **APY: ~3.78% - 5.00%** (varies based on staking rewards + liquidity buffer yield)
- The mETH Protocol displays a **7-day average APY**, net of protocol fees, assuming compounding
- mETH allocates ~30% to Aave which generates ~5.00% net APY vs ~2.0% for other LSTs

### Key Details
- **Token**: mETH (Mantle Staked Ether)
- **Vault Access**: Ethereum L1
- **Deposit Fee**: 4bps (adjustment rate as griefing mitigation)
- **Withdrawal**: FIFO queue, min 12-hour delay, no fees
- **Protocol Fee**: ~10% of rewards

### Contract Addresses
| Network | Address |
|---------|---------|
| Ethereum | `0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa` |
| Mantle | `0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa` |

### Verified Sources
- **Dashboard**: https://app.methprotocol.xyz/stats/meth/apy
- **Main Site**: https://www.methprotocol.xyz/
- **Docs**: https://docs.mantle.xyz/meth
- **CoinGecko**: https://www.coingecko.com/en/coins/mantle-staked-ether

### How to Read On-Chain
**RPC Endpoints**:
- Ethereum Mainnet: `https://eth.llamarpc.com` or `https://eth.public-rpc.com`
- Mantle: `https://mantle-rpc.publicnode.com` or `https://rpc.mantle.xyz`

**Key Contract Methods** (via `eth_call`):
```solidity
// Get current exchange rate (ETH per mETH)
function exchangeRate() view returns (uint256)

// Get pending rewards
function getPendingRewards(address _user) view returns (uint256)

// Total assets deposited
function totalAssets() view returns (uint256)
```

**APY Calculation**:
```solidity
// 7-day average APY = (exchangeRate delta over 7 days / initial exchange rate) * 52
// Or use: currentAPY = (rawAPY * 365) / days
```

---

## 2. cmETH (Restaking)

### Current Yield
- **Base APY: ~3%** (from staking rewards)
- **Restaking APY: ~4.89% - 6.84%** (including EigenLayer/Symbiotic rewards)
- Total APY can reach **6%+** with restaking rewards included

### Key Details
- **Token**: cmETH (Mantle Restaked Ether)
- **Type**: Unified receipt token for portfolio of restaking positions
- **Restaking Protocols**: EigenLayer, Symbiotic, Karak
- **Vault Access**: Ethereum L1
- **Withdrawal**: Up to ~7 day delay
- **Protocol Fee**: 20% of restaking rewards

### Contract Addresses
| Network | Address |
|---------|---------|
| Ethereum | `0xE6829d9a7eE3040e1276Fa75293Bde931859e8fA` |
| Mantle | `0xE6829d9a7eE3040e1276Fa75293Bde931859e8fA` |

### Verified Sources
- **Portfolio Dashboard**: https://app.methprotocol.xyz/portfolio
- **Pendle Integration**: https://app.pendle.finance/proTOCOL/cmeth
- **Docs**: https://docs.mantle.xyz/meth/components/architecture/restaking-cmeth

### How to Read On-Chain
```solidity
// cmETH is an ERC-20, check balance
function balanceOf(address _user) view returns (uint256)

// For restaking rewards, check the underlying mETH position
// Rewards are claimed separately from each AVS
```

**External Rewards Tracking**:
- EigenLayer points: Earned automatically
- MNT incentives: Claimable from protocol
- COOK tokens: Governance token rewards

---

## 3. Aave V3 on Mantle

### Current Rates (as of March 2026)
Aave V3 launched on Mantle in December 2025 and quickly captured ~40% of network TVL.

**Supported Assets**: wETH, USDC, USDT, GHO, FBTC, USDe, wrsETH

**Typical Lending Rates**:
| Asset | Supply APY (approx.) | Borrow APY (approx.) |
|-------|---------------------|---------------------|
| ETH/wETH | 2-4% | 4-8% |
| USDC | 3-5% | 5-8% |
| USDT | 3-5% | 5-8% |
| USDe | 4-6% | 6-10% |
| GHO | 3-4% | 5-7% |

*Note: Rates are dynamic and depend on utilization. Check dashboard for real-time rates.*

### Key Details
- **Market Size**: $575M+ within 2 weeks of launch, crossed $1B shortly after
- **Incentive Program**: 6-month MNT incentive program from Mantle treasury
- **Integration**: mETH allocated to Aave for liquidity buffer

### Contract Addresses
Aave V3 uses a proxy pattern. Main addresses:
- **Pool Address**: `0x...` (check Aave governance)
- **Aave Protocol Data Provider**: `0x...`

### Verified Sources
- **Markets Dashboard**: https://app.aave.com/markets/
- **Aavescan**: https://aavescan.com/
- **Governance Proposal**: https://governance.aave.com/t/direct-to-aip-aave-v3-mantle-collateral-enablement-emode-expansion-and-isolation-updates-usdt0-usde-eth-xaut/24153

### How to Read On-Chain
```solidity
// Aave V3 Pool interface
function getReserveData(address asset) view returns (
    uint256 availableLiquidity,
    uint256 totalStableDebt,
    uint256 totalVariableDebt,
    uint256 liquidityRate,
    uint256 variableBorrowRate,
    uint256 stableBorrowRate,
    uint256 averageStableBorrowRate,
    uint256 liquidityIndex,
    uint256 variableBorrowIndex,
    uint40 lastUpdateTimestamp,
    address aTokenAddress,
    address stableDebtTokenAddress,
    address variableDebtTokenAddress,
    address interestRateStrategyAddress,
    uint256 accruedToTreasury,
    uint256 totalSupply,
    uint256 totalDebt
)
```

**Rate Calculation**:
- Supply APY = `liquidityRate / 1e27` (Ray math)
- Borrow APY = `variableBorrowRate / 1e27`

---

## 4. Merchant Moe Pools

### Current Yield
Merchant Moe is Mantle's leading DEX with Liquidity Book (Trader Joe) and concentrated liquidity pools.

**LP Pool APYs** (example):
| Pool | APR |
|------|-----|
| cmETH/MNT | Up to 406% (incentivized) |
| cmETH/USDT | Up to 34% |
| cmETH/USDe | Up to 7.6% |
| mETH/USDT | 40x Powder points (highly incentivized) |
| cmETH ETH | Up to 6.15% (Equilibria) |

*Note: APRs vary significantly based on trading volume and incentive programs. Check dashboard for real-time rates.*

### Key Details
- **Type**: DEX with Liquidity Book (concentrated liquidity)
- **Features**: Yield Farming, Yield Boosting, Voting
- **Token**: MOE (governance)
- **Incentives**: Powder points, MOE emissions

### Verified Sources
- **Pools**: https://merchantmoe.com/pool
- **Docs**: https://docs.merchantmoe.com
- **Farming**: https://docs.merchantmoe.com/dex-features/farming

### How to Read On-Chain
```solidity
// Liquidity Book pairs use different architecture
// Check LP token balances and reward accrual via:

// Get pool reserves (for fee calculation)
function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)

// For farmed rewards, check the MasterChef/MoeRouter
function pendingMOE(uint256 pid, address user) view returns (uint256)
```

---

## 5. MI4 Fund (Mantle Index Four)

### Current Yield
- **Target APY: ~6.84%** (from yield-generating assets)
- **Management Fee: 1%**
- Mi4 generates yield through staking instruments: mETH, bbSOL, sUSDe

### Key Details
- **Type**: Institutional-grade crypto index fund
- **Structure**: BVI Limited Partnership
- **Tokenization**: Securitize
- **Anchor Investor**: Mantle Treasury ($400M commitment)
- **Manager**: Mantle Guard Limited

### Asset Allocation
The fund holds a diversified portfolio:
- mETH (ETH staking)
- bbSOL (Solana staking)
- sUSDe (Ethena staking)
- Other yield-bearing assets

### Contract Addresses
- **Fund Token**: Check Securitize / RWA.xyz
- **Manager**: Mantle Guard

### Verified Sources
- **Launch Announcement**: https://www.businesswire.com/news/home/20250424178524/
- **RWA.xyz**: https://app.rwa.xyz/assets/MI4
- **Mantle Guard**: https://mantleguard.com/

### How to Read On-Chain
```solidity
// MI4 is a regulated fund - on-chain data limited
// Check token holdings via:
// - Securitize token (ERC-1404)
- Fund NAV updates through off-chain reporting
// Yield accrual: quarterly statements
```

---

## 6. Bybit Mantle Vault

### Current Yield
- **Target APY: 7-12%** (USDT/USDC)
- **Market Conditions**:
  - Bear market: 5-10% APR
  - Bull market: 10-25% APR

### Key Details
- **Partners**: Bybit, Mantle, CIAN
- **Strategy**: Market-neutral stablecoin strategies
- **Underlying Protocols**: Aave V3 (initially)
- **AUM**: $150M+ (as of Feb 2026)
- **Launch**: December 2025

### How It Works
1. Deposit USDC/USDT via Bybit Earn
2. Assets auto-routed to Mantle-native DeFi strategies
3. Deployed into protocols like Aave V3
4. Yield from interest + fees + incentives

### Verified Sources
- **Bybit Earn**: https://www.bybit.com/en/earn/mantle-vault/
- **Announcement**: https://www.prnewswire.com/apac/news-releases/mantle-vault-launches-powered-by-mantle-in-partnership-with-bybit-and-cian-302648026.html
- **Bybit Learn**: https://learn.bybit.com/en/bybit-guide/mantle-vault-guide

### How to Read On-Chain
```solidity
// CIAN vault contracts
// Check strategy performance via:
function getTotalValue() view returns (uint256)
function getYield() view returns (uint256)

// Aave underlying (for collateral rates)
```

---

## 7. USDY / USDe

### USDY (Ondo)
- **APY: ~5%**
- **Type**: Tokenized note backed by short-term US Treasuries
- **Deployments**: Ethereum, Solana, Aptos, Sui, Arbitrum, Mantle
- **On Mantle**: First Mantle Showcase project

### USDe / sUSDe (Ethena)
- **APY: ~9-11%** (variable, market-dependent)
- **Historical Average**: 17.5% (since Feb 2024)
- **2025 Range**: ~4-15% APY
- **How it works**: Delta-neutral strategy using ETH/BTC + short futures

### Key Details
- **USDe**: Synthetic dollar stablecoin
- **sUSDe**: Staked USDe (accrues yield)
- **On Mantle**: Integrated with Aave V3, Mantle Vault

### Verified Sources
- **Ethena**: https://ethena.fi/
- **sUSDe APY**: https://app.pendle.finance/protocol/susde
- **CoinGecko**: https://www.coingecko.com/en/coins/ethena-staked-usde

### How to Read On-Chain
```solidity
// USDe / sUSDe on Ethereum
// Check exchange rate for sUSDe
function exchangeRate() view returns (uint256)

// Or via Aave (on Mantle)
function getReserveData(address asset) view returns (...)
```

---

## 8. FBTC Vaults

### Overview
- **FBTC**: Function Bitcoin - omnichain BTC asset for yield
- **TVL**: $1.5B+ (across chains)
- **Mantle Integration**: April 2025

### Yield Sources
- BTC staking/liquid staking
- Lending protocols
- Leverage strategies

### Key Partners
- Bybit On-Chain Earn
- CIAN Yield Layer
- Various DeFi protocols

### Verified Sources
- **Function/FBTC**: https://fbtc.com/earn
- **Mantle Announcement**: https://www.mantle.xyz/blog/community/monthly-mantle-moments-april
- **CoinGecko**: https://www.coingecko.com/en/coins/function-fbtc

### Contract Addresses
- **FBTC (Mantle)**: `0x...` (check explorer)
- **Check**: https://mantlescan.xyz/

---

## Summary Table

| Protocol | Type | Approx. APY | Risk Level |
|----------|------|-------------|------------|
| mETH | LST | 3.78-5% | Low |
| cmETH | LRT | 5-7% | Medium |
| Aave V3 (USDC/USDT) | Lending | 3-5% | Low-Medium |
| Aave V3 (ETH) | Lending | 2-4% | Low |
| Merchant Moe (stable) | LP | 7-34% | Medium |
| Merchant Moe (volatile) | LP | Up to 400% | High |
| MI4 Fund | Index | ~6.84% | Medium |
| Mantle Vault | Yield Vault | 7-12% | Low-Medium |
| USDY | RWA | ~5% | Low |
| USDe/sUSDe | Stablecoin | 9-11% | Medium |

---

## RPC & API References

### Mantle Network RPCs
```
Mainnet: https://rpc.mantle.xyz
Archive: https://mantle-rpc.publicnode.com
WebSocket: wss://mantle-rpc.publicnode.com
```

### Block Explorers
- **Mantlescan**: https://mantlescan.xyz/
- **Etherscan (ETH)**: https://etherscan.io/

### Useful APIs
- **DefiLlama**: https://defillama.com/yields
- **Aavescan**: https://aavescan.com/
- **CoinGecko**: https://www.coingecko.com/

---

## Notes

1. **APYs are dynamic**: Most rates fluctuate based on market conditions, utilization, and incentive programs.

2. **Incentive programs**: Many Mantle protocols have temporary incentive programs (MNT emissions) that boost effective yields.

3. **Smart contract risk**: Always audit contracts and understand the underlying collateral before depositing.

4. **Impermanent loss**: LP positions are subject to IL, especially in volatile asset pairs.

5. **Regulatory**: Some products (MI4, USDY) may have regulatory considerations. Do your own research.

---

*This document is for research purposes. Always verify rates on official dashboards before making investment decisions.*
