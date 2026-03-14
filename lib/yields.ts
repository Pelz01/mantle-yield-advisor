export interface MantlePool {
  poolId: string;
  protocol: string;
  symbol: string;
  tvlUsd: number;
  apy: number | null;
  apyBase: number | null;
  apyReward: number | null;
  rewardTokens: string[] | null;
  poolMeta: string | null;
  isLp: boolean;
  hasIncentives: boolean;
  apyBreakdownKnown: boolean;
  sustainableApy: number | null;
  apyBaseBorrow: number | null;
  totalSupplyUsd: number | null;
  ltv: number | null;
}

interface LlamaPool {
  pool: string;
  chain: string;
  project: string;
  symbol: string;
  tvlUsd: number;
  apy?: number;
  apyBase?: number;
  apyReward?: number;
  rewardTokens?: string[];
  poolMeta?: string;
  apyBaseBorrow?: number;
  totalSupplyUsd?: number;
  ltv?: number;
}

export async function getMantleYields(): Promise<MantlePool[]> {
  const res = await fetch('https://yields.llama.fi/pools', {
    next: { revalidate: 3600 }
  });

  if (!res.ok) {
    throw new Error(`DefiLlama API error: ${res.status}`);
  }

  const data = await res.json();
  const pools = (data.data as LlamaPool[]) || [];

  const mantlePools = pools
    .filter((pool) => {
      return pool.chain === 'Mantle' && (pool.tvlUsd || 0) >= 10000;
    })
    .map((pool) => {
      const apy = typeof pool.apy === 'number' ? pool.apy : null;
      const apyBase = typeof pool.apyBase === 'number' ? pool.apyBase : null;
      const apyReward = typeof pool.apyReward === 'number' ? pool.apyReward : null;

      return {
        poolId: pool.pool || '',
        protocol: pool.project || '',
        symbol: pool.symbol || '',
        tvlUsd: pool.tvlUsd || 0,
        apy,
        apyBase,
        apyReward,
        rewardTokens: pool.rewardTokens || null,
        poolMeta: pool.poolMeta || null,
        isLp: (pool.symbol || '').includes('-'),
        hasIncentives: typeof apyReward === 'number' && apyReward > 0,
        apyBreakdownKnown: apyBase !== null || apyReward !== null,
        sustainableApy: apyBase !== null ? apyBase : (apy ?? null),
        apyBaseBorrow: typeof pool.apyBaseBorrow === 'number' ? pool.apyBaseBorrow : null,
        totalSupplyUsd: typeof pool.totalSupplyUsd === 'number' ? pool.totalSupplyUsd : null,
        ltv: typeof pool.ltv === 'number' ? pool.ltv : null,
      };
    })
    .sort((a, b) => b.tvlUsd - a.tvlUsd);

  return mantlePools;
}
