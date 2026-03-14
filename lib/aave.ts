import { ethers } from 'ethers';
import { UiPoolDataProvider } from '@aave/contract-helpers';
import { formatReserves, formatUserSummary } from '@aave/math-utils';
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

  const provider = new ethers.providers.JsonRpcProvider(MANTLE_RPC);

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

    // Format reserves
    const reserves = formatReserves({
      reserves: reservesData.reservesData,
      currentTimestamp: Math.floor(Date.now() / 1000),
      marketReferenceCurrencyDecimals: 8,
      marketReferencePriceInUsd: reservesData.baseCurrencyData.marketReferenceCurrencyPriceInUsd,
    });

    // Format user summary
    const userSummary = formatUserSummary({
      userReserves: userData.userReserves,
      reserves,
      marketReferenceCurrencyDecimals: 8,
      marketReferencePriceInUsd: reservesData.baseCurrencyData.marketReferenceCurrencyPriceInUsd,
      userEmodeCategoryId: userData.userEmodeCategoryId,
    });

    // Extract APYs per asset
    const apys: Record<string, { supplyAPY: number; borrowAPY: number }> = {};

    for (const reserve of reserves) {
      const symbol = reserve.symbol.toUpperCase();
      apys[symbol] = {
        supplyAPY: (reserve.supplyAPY || 0) * 100,
        borrowAPY: (reserve.borrowAPY || 0) * 100,
      };
    }

    // Parse health factor
    const healthFactor = userSummary.healthFactor !== undefined && isFinite(userSummary.healthFactor)
      ? userSummary.healthFactor
      : null;

    return {
      available: true,
      apys,
      healthFactor,
      totalSuppliedUSD: Math.round((userSummary.totalSupplyUSD || 0) * 100) / 100,
      totalBorrowedUSD: Math.round((userSummary.totalBorrowsUSD || 0) * 100) / 100,
    };
  } catch (error) {
    console.error('Error fetching Aave data:', error);
    return getUnavailableAaveData();
  }
}
