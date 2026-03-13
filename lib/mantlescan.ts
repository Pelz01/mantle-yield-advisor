const MANTLESCAN_API = process.env.MANTLESCAN_API || "";
const API_BASE = "https://api.mantlescan.xyz/api";

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: string;
  methodId?: string;
}

interface TokenTransfer {
  hash: string;
  from: string;
  to: string;
  value: string;
  tokenSymbol: string;
  timestamp: string;
}

interface WalletHistory {
  transactions: Transaction[];
  tokenTransfers: TokenTransfer[];
}

export async function getWalletHistory(walletAddress: string): Promise<WalletHistory> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (MANTLESCAN_API) {
    headers["x-api-key"] = MANTLESCAN_API;
  }

  try {
    const [txRes, tokenRes] = await Promise.allSettled([
      fetch(`${API_BASE}/transactionlist?address=${walletAddress}&page=1&limit=50`, { headers }),
      fetch(`${API_BASE}/tokentx?address=${walletAddress}&page=1&limit=50`, { headers }),
    ]);

    const transactions: Transaction[] = txRes.status === "fulfilled" 
      ? await txRes.value.json().then(d => d.result?.slice(0, 20) || [])
      : [];
      
    const tokenTransfers: TokenTransfer[] = tokenRes.status === "fulfilled"
      ? await tokenRes.value.json().then(d => d.result?.slice(0, 20) || [])
      : [];

    return { transactions, tokenTransfers };
  } catch (error) {
    console.error("Error fetching wallet history:", error);
    return { transactions: [], tokenTransfers: [] };
  }
}

export function analyzeProtocolInteractions(
  transactions: Transaction[],
  tokenTransfers: TokenTransfer[]
): {
  protocols: string[];
  activity: string;
  defiExperience: "none" | "beginner" | "intermediate" | "advanced";
} {
  const allAddresses = [
    ...transactions.map(t => t.to.toLowerCase()),
    ...tokenTransfers.map(t => t.to.toLowerCase()),
    ...tokenTransfers.map(t => t.from.toLowerCase()),
  ];
  
  const uniqueAddresses = [...new Set(allAddresses)];
  
  const aaveAddresses = [
    "0x2d4d7f0e2f1a8b9c0d1e2f3a4b5c6d7e8f9a0b1",
    "0x11fea3c5e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b",
  ];
  
  const uniAddresses = [
    "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
    "0x7a250d5630b4cf539739df2c5dacb4c659f2488d",
  ];
  
  const protocols: string[] = [];
  let hasAave = false;
  let hasUni = false;
  
  for (const addr of uniqueAddresses) {
    if (aaveAddresses.some(a => addr.includes(a.slice(2, 42)))) {
      hasAave = true;
      protocols.push("Aave");
    }
    if (uniAddresses.some(a => addr.includes(a.slice(2, 42)))) {
      hasUni = true;
      protocols.push("Uniswap");
    }
  }
  
  const totalActivity = transactions.length + tokenTransfers.length;
  let defiExperience: "none" | "beginner" | "intermediate" | "advanced" = "none";
  
  if (totalActivity > 50) defiExperience = "advanced";
  else if (totalActivity > 20) defiExperience = "intermediate";
  else if (totalActivity > 5) defiExperience = "beginner";
  
  return {
    protocols: [...new Set(protocols)],
    activity: `Performed ${transactions.length} transactions and ${tokenTransfers.length} token transfers`,
    defiExperience,
  };
}
