import { ethers } from "ethers";

const MANTLE_RPC = process.env.MANTLE_RPC || "https://rpc.mantle.xyz";

// Aave V3 addresses on Mantle (placeholder - would need actual addresses)
const AAVE_POOL_ADDRESS = "0x10eDC663d9718f8C1926f13eC4a4B7cD8Cb0D15";
const AAVE_UI_POOL_DATA_PROVIDER = "0x1a31dD467A3aD0f5d5166cDb26dDc097d1F1C9D4";

interface AavePosition {
  totalCollateralBase: string;
  totalDebtBase: string;
  availableBorrowsBase: string;
  currentLiquidationThreshold: string;
  ltv: string;
  healthFactor: string;
}

interface ReserveData {
  symbol: string;
  liquidityRate: string;
  stableBorrowRate: string;
  variableBorrowRate: string;
  aTokenAddress: string;
  stableDebtTokenAddress: string;
  variableDebtTokenAddress: string;
}

interface AaveData {
  position: AavePosition | null;
  reserves: ReserveData[];
}

const AAVE_ABI = {
  UiPoolDataProvider: [
    "function getUserReservesData(address provider, address user) view returns (tuple(address underlyingAsset, uint256 scaledATokenBalance, uint256 stableTokenDebt, uint256 variableTokenDebt, uint256 stableTokenLastUpdateTimestamp, uint256 principalStableTokenDebt, uint256 scaledVariableTokenDebt, uint256 stableBorrowRate, uint256 liquidityIndex, uint256 variableBorrowIndex, uint40 lastUpdateTimestamp)[])",
    "function getUserAccountData(address provider, address user) view returns (uint256 totalCollateralBase, uint256 totalDebtBase, uint256 availableBorrowsBase, uint256 currentLiquidationThreshold, uint256 ltv, uint256 healthFactor)",
  ],
  Pool: [
    "function getReserveData(address asset) view returns (tuple(uint256 unbacked, uint256 accruedToTreasuryScaled, uint256 totalAToken, uint256 totalStableDebt, uint256 totalVariableDebt, uint256 liquidityRate, uint256 stableBorrowRate, uint256 variableBorrowRate, uint40 lastUpdateTimestamp, address aTokenAddress, address stableDebtTokenAddress, address variableDebtTokenAddress, address interestRateStrategyAddress))",
  ],
};

export async function getAavePosition(walletAddress: string): Promise<AavePosition | null> {
  try {
    const provider = new ethers.JsonRpcProvider(MANTLE_RPC);
    const uiPoolContract = new ethers.Contract(
      AAVE_UI_POOL_DATA_PROVIDER,
      AAVE_ABI.UiPoolDataProvider,
      provider
    );

    const data = await uiPoolContract.getUserAccountData(
      "0x949178AC3D63253bA64f2E6b7B06D57C4D5Eb3b9", // provider address
      walletAddress
    );

    return {
      totalCollateralBase: data[0].toString(),
      totalDebtBase: data[1].toString(),
      availableBorrowsBase: data[2].toString(),
      currentLiquidationThreshold: data[3].toString(),
      ltv: data[4].toString(),
      healthFactor: data[5].toString(),
    };
  } catch (error) {
    console.error("Error fetching Aave position:", error);
    return null;
  }
}

export async function getAaveReserves(): Promise<ReserveData[]> {
  try {
    const provider = new ethers.JsonRpcProvider(MANTLE_RPC);
    const poolContract = new ethers.Contract(
      AAVE_POOL_ADDRESS,
      AAVE_ABI.Pool,
      provider
    );

    // Common assets on Mantle
    const assets = [
      "0xdeaddeaddeaddeaddeaddeaddeaddeaddead0000", // MNT
      "0x09bc4eb0b3f6eab4d7e17e8f7e2b4a1b2c3d4e5f", // USDC placeholder
      "0x8b9e2e3d4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c", // USDT placeholder
    ];

    const reserves: ReserveData[] = [];

    for (const asset of assets) {
      try {
        const data = await poolContract.getReserveData(asset);
        reserves.push({
          symbol: "MNT",
          liquidityRate: data.liquidityRate.toString(),
          stableBorrowRate: data.stableBorrowRate.toString(),
          variableBorrowRate: data.variableBorrowRate.toString(),
          aTokenAddress: data.aTokenAddress,
          stableDebtTokenAddress: data.stableDebtTokenAddress,
          variableDebtTokenAddress: data.variableDebtTokenAddress,
        });
      } catch {
        // Skip failed assets
      }
    }

    return reserves;
  } catch (error) {
    console.error("Error fetching Aave reserves:", error);
    return [];
  }
}

export async function getAaveData(walletAddress: string): Promise<AaveData> {
  const [position, reserves] = await Promise.all([
    getAavePosition(walletAddress),
    getAaveReserves(),
  ]);

  return { position, reserves };
}

export function calculateAPY(rate: string): string {
  if (!rate || rate === "0") return "0%";
  // Convert ray to APY (rough approximation)
  const apy = (parseFloat(ethers.formatEther(rate)) * 100).toFixed(2);
  return `${apy}%`;
}
