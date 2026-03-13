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
    conservative: "text-green-400 bg-green-400/10 border-green-400/20",
    moderate: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    aggressive: "text-red-400 bg-red-400/10 border-red-400/20",
  };

  return (
    <div className="glass rounded-2xl p-6 animate-glow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">{personality.label}</h2>
          <p className="text-gray-400 text-sm">{personality.description}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${riskColors[personality.riskTolerance]}`}>
          {personality.riskTolerance.charAt(0).toUpperCase() + personality.riskTolerance.slice(1)} Risk
        </span>
      </div>
      <div className="pt-4 border-t border-gray-800">
        <p className="text-xs text-gray-500">Wallet</p>
        <p className="font-mono text-sm text-mantle">{address}</p>
      </div>
    </div>
  );
}
