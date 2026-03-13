"use client";

interface PersonalityCardProps {
  personality: {
    label: string;
    description: string;
    riskTolerance: "conservative" | "moderate" | "aggressive";
  };
  address: string;
}

export default function PersonalityCard({ personality, address }: PersonalityCardProps) {
  const riskColors = {
    conservative: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    moderate: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    aggressive: "text-rose-400 bg-rose-500/10 border-rose-500/20",
  };

  const riskBg = {
    conservative: "from-emerald-500/20 to-transparent",
    moderate: "from-amber-500/20 to-transparent",
    aggressive: "from-rose-500/20 to-transparent",
  };

  return (
    <div className="relative overflow-hidden rounded-2xl">
      <div className={`absolute inset-0 bg-gradient-to-br ${riskBg[personality.riskTolerance]}`} />
      <div className="relative glass rounded-2xl p-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs text-gray-400 uppercase tracking-wider">Your DeFi Profile</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">{personality.label}</h2>
            <p className="text-gray-400 max-w-md">{personality.description}</p>
          </div>
          <span className={`self-start px-4 py-2 rounded-full text-sm font-medium border ${riskColors[personality.riskTolerance]}`}>
            {personality.riskTolerance.charAt(0).toUpperCase() + personality.riskTolerance.slice(1)} Risk
          </span>
        </div>
        
        <div className="pt-6 border-t border-white/10">
          <p className="text-xs text-gray-500 mb-1">Analyzed Wallet</p>
          <p className="font-mono text-sm text-cyan-400">{address.slice(0, 6)}...{address.slice(-4)}</p>
        </div>
      </div>
    </div>
  );
}
