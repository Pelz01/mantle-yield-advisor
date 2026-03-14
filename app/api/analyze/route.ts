import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import { analyzeWallet } from "@/lib/claude";
import { getWalletHistory } from "@/lib/history";
import { getLivePositions } from "@/lib/positions";
import { getAaveData } from "@/lib/aave";
import { getMantleYields } from "@/lib/yields";

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

    // Determine state
    const state =
      !positions.hasTokens && history.totalTxCount < 3 && !aave.totalSuppliedUSD
        ? "empty"
        : positions.hasTokens && history.totalTxCount < 3 && !aave.totalSuppliedUSD
        ? "no_yield"
        : history.totalTxCount < 3
        ? "thin_history"
        : "full";

    // Return early for empty state
    if (state === "empty") {
      return NextResponse.json({ state });
    }

    // Analyze with Claude for all other states
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
