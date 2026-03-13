"use client";

import { useState, FormEvent } from "react";
import { isValidAddress } from "@/lib/mantle";

interface WalletInputProps {
  onSubmit: (address: string) => void;
  isLoading: boolean;
}

export default function WalletInput({ onSubmit, isLoading }: WalletInputProps) {
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmed = address.trim();
    
    if (!trimmed) {
      setError("Please enter a wallet address");
      return;
    }

    if (!isValidAddress(trimmed)) {
      setError("Invalid Ethereum address. Must be 0x followed by 40 hex characters.");
      return;
    }

    onSubmit(trimmed);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl">
      <div className="glass rounded-2xl p-6">
        <label htmlFor="wallet" className="block text-sm font-medium text-gray-400 mb-2">
          Enter your Mantle wallet address
        </label>
        <div className="flex gap-3">
          <input
            id="wallet"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="0x..."
            className="flex-1 bg-black/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-mantle focus:ring-1 focus:ring-mantle transition-all font-mono text-sm"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="gradient-mantle px-6 py-3 rounded-xl font-semibold text-black transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Analyzing
              </span>
            ) : (
              "Analyze"
            )}
          </button>
        </div>
        {error && (
          <p className="mt-2 text-red-400 text-sm">{error}</p>
        )}
        <p className="mt-3 text-gray-500 text-xs">
          Read-only analysis. We never ask for private keys or signatures.
        </p>
      </div>
    </form>
  );
}
