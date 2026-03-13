import { ethers } from "ethers";

const MANTLE_RPC = process.env.MANTLE_RPC || "https://rpc.mantle.xyz";
const provider = new ethers.JsonRpcProvider(MANTLE_RPC);

export const MNT_ADDRESS = "0xdeaddeaddeaddeaddeaddeaddeaddeaddead0000";
export const METH_ADDRESS = "0xDA5F6d1a4C8b7e5E6e8F1a2b3c4d5e6f7a8b9c0d";
export const CMETH_ADDRESS = "0xEaC5E3d4d8f2F2a2b1c0d9e8f7a6b5c4d3e2f1a0";

export async function getMNTBalance(address: string): Promise<string> {
  const balance = await provider.getBalance(address);
  return ethers.formatEther(balance);
}

export async function getERC20Balance(
  tokenAddress: string,
  walletAddress: string
): Promise<string> {
  const abi = [
    "function balanceOf(address owner) view returns (uint256)",
  ];
  const contract = new ethers.Contract(tokenAddress, abi, provider);
  const balance = await contract.balanceOf(walletAddress);
  return ethers.formatEther(balance);
}

export async function getWalletPositions(walletAddress: string) {
  try {
    const [mntBalance, mEthBalance, cmEthBalance] = await Promise.all([
      getMNTBalance(walletAddress),
      getERC20Balance(METH_ADDRESS, walletAddress),
      getERC20Balance(CMETH_ADDRESS, walletAddress),
    ]);

    return {
      mnt: mntBalance,
      mEth: mEthBalance,
      cmEth: cmEthBalance,
    };
  } catch (error) {
    console.error("Error fetching positions:", error);
    return { mnt: "0", mEth: "0", cmEth: "0" };
  }
}

export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}
