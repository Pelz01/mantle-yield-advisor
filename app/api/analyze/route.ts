import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import { analyzeWallet } from "@/lib/claude";
import { getWalletHistory } from "@/lib/history";
import { getLivePositions } from "@/lib/positions";
import { getAaveData } from "@/lib/aave";
import { getMantleYields } from "@/lib/yields";

type WalletState = "empty" | "no_yield" | "thin_history" | "full";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address } = body;

    if (!address) {
      return NextResponse.json({ error: "Wallet address is required" }, { status: 400 });
    }

    // Validate address
    if (!ethers.utils.isAddress(address)) {
      return NextResponse.json({ error: "Invalid wallet address" }, { status: 400 });
    }

    // Fetch all data in parallel
    const [history, positions, aave, mantleYields] = await Promise.all([
      getWalletHistory(address),
      getLivePositions(address),
      getAaveData(address),
      getMantleYields(),
    ]);

    // For the demo, transaction count is the strongest signal that a wallet has enough
    // history to support a full profile, even if Mantle-specific DeFi detection is incomplete.
    let state: WalletState;
    if (history.totalTxCount === 0 && !positions.hasTokens) {
      state = "empty";
    } else if (positions.hasTokens && history.totalTxCount < 5) {
      state = "no_yield";
    } else {
      state = "full";
    }

    // Return early for empty state only
    if (state === "empty") {
      return NextResponse.json({ 
        state,
        message: "No tokens or transaction history found on Mantle. Bridge assets to get started."
      });
    }

    // Analyze with AI for all other states
    const claudeResult = await analyzeWallet({
      address,
      history,
      positions,
      aave,
      mantleYields,
      state,
    });

    return NextResponse.json({ state, ...claudeResult });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json({ error: "Analysis failed. Please try again." }, { status: 500 });
  }
}
