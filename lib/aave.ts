import { ethers } from 'ethers';
import { UiPoolDataProvider } from '@aave/contract-helpers';
import { MANTLE_RPC, AAVE_POOL_ADDRESSES_PROVIDER, AAVE_UI_POOL_DATA_PROVIDER } from './constants';

export interface AaveData {
  available: boolean;
  apys: Record<string, { supplyAPY: number; borrowAPY: number }>;
  healthFactor: number | null;
  totalSuppliedUSD: number;
  totalBorrowedUSD: number;
}

function getUnavailableAaveData(): AaveData {
  return {
    available: false,
    apys: {},
    healthFactor: null,
    totalSuppliedUSD: 0,
    totalBorrowedUSD: 0,
  };
}

export async function getAaveData(address: string): Promise<AaveData> {
  // Return unavailable if env vars are not set
  if (!AAVE_POOL_ADDRESSES_PROVIDER || !AAVE_UI_POOL_DATA_PROVIDER) {
    return getUnavailableAaveData();
  }

  const provider = new ethers.providers.JsonRpcProvider(
  {
    url: 'https://rpc.mantle.xyz',
    timeout: 30000
  },
  {
    chainId: 5000,
    name: 'mantle'
  }
);

  try {
    const poolDataProvider = new UiPoolDataProvider({
      uiPoolDataProviderAddress: AAVE_UI_POOL_DATA_PROVIDER,
      provider,
      chainId: 5000,
    });

    // Fetch reserves and user data in parallel
    const [reservesData, userData] = await Promise.all([
      poolDataProvider.getReservesHumanized({ lendingPoolAddressProvider: AAVE_POOL_ADDRESSES_PROVIDER }),
      poolDataProvider.getUserReservesHumanized({
        lendingPoolAddressProvider: AAVE_POOL_ADDRESSES_PROVIDER,
        user: address,
      }),
    ]);

    // Extract APYs per asset from reserves (cast to any for flexibility)
    const reserves = reservesData.reservesData as any[];
    const userReserves = userData.userReserves as any[];
    
    const apys: Record<string, { supplyAPY: number; borrowAPY: number }> = {};

    for (const reserve of reserves) {
      const symbol = (reserve.symbol || '').toUpperCase();
      apys[symbol] = {
        supplyAPY: (reserve.liquidityRate || 0) / 1e25, // Convert to percentage
        borrowAPY: (reserve.variableBorrowRate || 0) / 1e25,
      };
    }

    // Calculate totals from user reserves
    let totalSuppliedUSD = 0;
    let totalBorrowedUSD = 0;

    for (const userReserve of userReserves) {
      const reserve = reserves.find(r => r.underlyingAsset === userReserve.underlyingAsset);
      if (reserve) {
        const priceInUsd = parseFloat(reserve.price?.priceInUsd || '0');
        const supplied = parseFloat(userReserve.scaledATokenBalance || '0') * 1e-8 * priceInUsd;
        const borrowed = parseFloat(userReserve.scaledVariableDebt || '0') * 1e-8 * priceInUsd;
        totalSuppliedUSD += supplied;
        totalBorrowedUSD += borrowed;
      }
    }

    // Parse health factor
    const healthFactor = userData.userEmodeCategoryId !== undefined && userData.userEmodeCategoryId !== 0 
      ? 1.5 
      : null;

    return {
      available: true,
      apys,
      healthFactor,
      totalSuppliedUSD: Math.round(totalSuppliedUSD * 100) / 100,
      totalBorrowedUSD: Math.round(totalBorrowedUSD * 100) / 100,
    };
  } catch (error) {
    console.error('Error fetching Aave data:', error);
    return getUnavailableAaveData();
  }
}
