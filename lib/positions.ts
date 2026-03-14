import { ethers, utils } from 'ethers';
import { MANTLE_RPC, TOKEN_ADDRESSES } from './constants';

export interface WalletPositions {
  mnt: number;
  meth: number;
  cmeth: number;
  usdt: number;
  usdc: number;
  hasTokens: boolean;
}

const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)'
];

async function getTokenBalance(
  provider: ethers.providers.JsonRpcProvider,
  tokenAddress: string,
  decimals: number,
  walletAddress: string
): Promise<number> {
  try {
    if (!tokenAddress) return 0;
    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
    const balance = await contract.balanceOf(walletAddress);
    return parseFloat(utils.formatUnits(balance, decimals));
  } catch (error) {
    return 0;
  }
}

export async function getLivePositions(address: string): Promise<WalletPositions> {
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
    // Fetch MNT (native token)
    const mntRaw = await provider.getBalance(address);
    const mnt = parseFloat(utils.formatEther(mntRaw));

    // Fetch all token balances in parallel
    const [meth, cmeth, usdt, usdc] = await Promise.all([
      getTokenBalance(provider, TOKEN_ADDRESSES['0xcda86a272531e8640cd7f1a92c01839911b90bb0'], 18, address),
      getTokenBalance(provider, TOKEN_ADDRESSES['0xe6829d9a7ee3040e1276fa75293bde931859e8fa'], 18, address),
      getTokenBalance(provider, TOKEN_ADDRESSES['0x201eba5cc46d216ce6dc03f6a759e8e766e956ae'], 6, address),
      getTokenBalance(provider, TOKEN_ADDRESSES['0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9'], 6, address),
    ]);

    const hasTokens = mnt > 0.01 || meth > 0.01 || cmeth > 0.01 || usdt > 0.01 || usdc > 0.01;

    return { mnt, meth, cmeth, usdt, usdc, hasTokens };
  } catch (error) {
    console.error('Error fetching wallet positions:', error);
    return { mnt: 0, meth: 0, cmeth: 0, usdt: 0, usdc: 0, hasTokens: false };
  }
}
