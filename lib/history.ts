import { ethers } from "ethers";
import { PROTOCOL_CONTRACTS } from './constants';

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || '';
const MANTLE_CHAIN_ID = 5000;

export interface ProtocolSummary {
  name: string;
  txCount: number;
  firstSeen: string;
  lastSeen: string;
  daysActive: number;
}

export interface WalletHistory {
  totalTxCount: number;
  protocolsUsed: number;
  longestHoldDays: number;
  lastActiveDaysAgo: number | null;
  hasLpHistory: boolean;
  hasBorrowHistory: boolean;
  earlyLpExits: number;
  protocols: ProtocolSummary[];
}

const LP_PROTOCOLS = ['Merchant Moe', 'AGNI', 'Lendle'];
const BORROW_PROTOCOLS = ['Aave V3', 'INIT Capital', 'Lendle'];

function detectProtocol(address: string): string | null {
  const lower = address.toLowerCase();
  return PROTOCOL_CONTRACTS[lower] || null;
}

function parseDate(dateStr: string): Date | null {
  try {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
}

export async function getWalletHistory(address: string): Promise<WalletHistory> {
  const baseParams = `module=account&address=${address}&page=1&offset=200&sort=desc&chainid=${MANTLE_CHAIN_ID}`;
  const apiKeyParam = ETHERSCAN_API_KEY ? `&apikey=${ETHERSCAN_API_KEY}` : '';
  
  const query1 = `https://api.etherscan.io/api?${baseParams}&action=txlist${apiKeyParam}`;
  const query2 = `https://api.etherscan.io/api?${baseParams}&action=tokentx${apiKeyParam}`;

  try {
    const [txRes, tokenRes] = await Promise.all([
      fetch(query1),
      fetch(query2)
    ]);

    const txData = await txRes.json();
    const tokenData = await tokenRes.json();

    const txs = (txData.result as any[]) || [];
    const tokens = (tokenData.result as any[]) || [];

    if (txData.status !== "1" || txs.length === 0) {
      return {
        totalTxCount: 0,
        protocolsUsed: 0,
        longestHoldDays: 0,
        lastActiveDaysAgo: null,
        hasLpHistory: false,
        hasBorrowHistory: false,
        earlyLpExits: 0,
        protocols: []
      };
    }

    // Analyze transactions
    const now = new Date();
    const protocolMap = new Map<string, ProtocolSummary>();
    let longestHold = 0;
    let lastActive: Date | null = null;
    let lpTxns: { to: string; time: Date }[] = [];
    let borrowTxns: { to: string; time: Date }[] = [];

    for (const tx of txs) {
      const txDate = parseDate(tx.timeStamp);
      if (!txDate) continue;

      if (!lastActive || txDate < lastActive) {
        lastActive = txDate;
      }

      const protocol = detectProtocol(tx.to);
      if (protocol) {
        if (!protocolMap.has(protocol)) {
          protocolMap.set(protocol, {
            name: protocol,
            txCount: 0,
            firstSeen: tx.timeStamp,
            lastSeen: tx.timeStamp,
            daysActive: 0
          });
        }
        const p = protocolMap.get(protocol)!;
        p.txCount++;
        p.lastSeen = tx.timeStamp;
        
        const firstDate = parseDate(p.firstSeen);
        const lastDate = parseDate(p.lastSeen);
        if (firstDate && lastDate) {
          p.daysActive = Math.floor((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24));
        }

        if (LP_PROTOCOLS.includes(protocol)) {
          lpTxns.push({ to: tx.to, time: txDate });
        }
        if (BORROW_PROTOCOLS.includes(protocol)) {
          borrowTxns.push({ to: tx.to, time: txDate });
        }

        const holdDays = Math.floor((now.getTime() - txDate.getTime()) / (1000 * 60 * 60 * 24));
        if (holdDays > longestHold) {
          longestHold = holdDays;
        }
      }
    }

    // Check for early LP exits (LP position opened and closed within 7 days)
    let earlyExits = 0;
    const lpEntries = new Map<string, Date>();
    for (const tx of txs) {
      const protocol = detectProtocol(tx.to);
      if (protocol && LP_PROTOCOLS.includes(protocol)) {
        const txDate = parseDate(tx.timeStamp);
        if (!txDate) continue;

        const key = `${tx.to}_${tx.hash?.slice(0, 10)}`;
        if (tx.method === 'addLiquidity' || (tx.functionName && tx.functionName.includes('add'))) {
          lpEntries.set(key, txDate);
        } else if (tx.method === 'removeLiquidity' || (tx.functionName && tx.functionName.includes('remove'))) {
          // Check if this is an exit within 7 days of entry
          for (const [entryKey, entryDate] of lpEntries) {
            if (entryKey.startsWith(tx.to.slice(0, 10))) {
              const daysDiff = Math.floor((txDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
              if (daysDiff <= 7) {
                earlyExits++;
              }
              break;
            }
          }
        }
      }
    }

    const lastActiveDaysAgo = lastActive 
      ? Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24))
      : null;

    return {
      totalTxCount: txs.length,
      protocolsUsed: protocolMap.size,
      longestHoldDays: longestHold,
      lastActiveDaysAgo,
      hasLpHistory: lpTxns.length > 0,
      hasBorrowHistory: borrowTxns.length > 0,
      earlyLpExits: earlyExits,
      protocols: Array.from(protocolMap.values())
    };
  } catch (error) {
    console.error('Error fetching wallet history:', error);
    return {
      totalTxCount: 0,
      protocolsUsed: 0,
      longestHoldDays: 0,
      lastActiveDaysAgo: null,
      hasLpHistory: false,
      hasBorrowHistory: false,
      earlyLpExits: 0,
      protocols: []
    };
  }
}
