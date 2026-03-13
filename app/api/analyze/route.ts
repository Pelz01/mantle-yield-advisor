import { NextRequest, NextResponse } from "next/server";
import { analyzeWallet } from "@/lib/claude";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, positions, aavePosition, history } = body;

    if (!address) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      );
    }

    const result = await analyzeWallet({
      address,
      positions: positions || { mnt: "0", mEth: "0", cmEth: "0" },
      aavePosition,
      history,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze wallet" },
      { status: 500 }
    );
  }
}
