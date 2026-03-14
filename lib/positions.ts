import { utils } from 'ethers';
import { MANTLE_RPC } from './constants';

export interface WalletPositions {
  mnt: number;
  meth: number;
  cmeth: number;
  usdt: number;
  usdc: number;
  hasTokens: boolean;
}

const METH_ADDRESS = '0xcda86a272531e8640cd7f1a92c01839911b90bb0';
const CMETH_ADDRESS = '0xe6829d9a7ee3040e1276fa75293bde931859e8fa';
const USDT_ADDRESS = '0x201eba5cc46d216ce6dc03f6a759e8e766e956ae';
const USDC_ADDRESS = '0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9';

const BALANCE_OF_IFACE = new utils.Interface([
  'function balanceOf(address owner) view returns (uint256)'
]);

async function rpcCall(method: string, params: unknown[]): Promise<string> {
  const response = await fetch(MANTLE_RPC, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method,
      params,
    }),
  });

  if (!response.ok) {
    throw new Error(`Mantle RPC error: ${response.status}`);
  }

  const payload = await response.json();
  if (payload.error) {
    throw new Error(payload.error.message || 'Mantle RPC returned an error');
  }

  return payload.result;
}

async function getNativeBalance(walletAddress: string): Promise<number> {
  const rawBalance = await rpcCall('eth_getBalance', [walletAddress, 'latest']);
  return parseFloat(utils.formatEther(rawBalance));
}

async function getTokenBalance(
  tokenAddress: string,
  decimals: number,
  walletAddress: string
): Promise<number> {
  try {
    const data = BALANCE_OF_IFACE.encodeFunctionData('balanceOf', [walletAddress]);
    const rawBalance = await rpcCall('eth_call', [{ to: tokenAddress, data }, 'latest']);
    const [balance] = BALANCE_OF_IFACE.decodeFunctionResult('balanceOf', rawBalance);
    return parseFloat(utils.formatUnits(balance, decimals));
  } catch {
    return 0;
  }
}

export async function getLivePositions(address: string): Promise<WalletPositions> {
  try {
    const [mnt, meth, cmeth, usdt, usdc] = await Promise.all([
      getNativeBalance(address),
      getTokenBalance(METH_ADDRESS, 18, address),
      getTokenBalance(CMETH_ADDRESS, 18, address),
      getTokenBalance(USDT_ADDRESS, 6, address),
      getTokenBalance(USDC_ADDRESS, 6, address),
    ]);

    const hasTokens = mnt > 0.01 || meth > 0.01 || cmeth > 0.01 || usdt > 0.01 || usdc > 0.01;

    return { mnt, meth, cmeth, usdt, usdc, hasTokens };
  } catch (error) {
    console.error('Error fetching wallet positions:', error);
    return { mnt: 0, meth: 0, cmeth: 0, usdt: 0, usdc: 0, hasTokens: false };
  }
}
