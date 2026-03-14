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

    const hasActivity = history.totalTxCount > 0 || positions.hasTokens || aave.totalSuppliedUSD > 0;
    const hasYieldExposure =
      positions.meth > 0 ||
      positions.cmeth > 0 ||
      history.hasLpHistory ||
      history.hasBorrowHistory ||
      aave.totalSuppliedUSD > 0;

    // Determine state using wallet activity and actual yield exposure.
    let state: WalletState;
    if (!hasActivity) {
      state = "empty";
    } else if (hasYieldExposure && history.totalTxCount >= 3) {
      state = "full";
    } else if (!hasYieldExposure && (positions.hasTokens || history.totalTxCount >= 3)) {
      state = "no_yield";
    } else {
      state = "thin_history";
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
