"use client";

interface RecommendationsProps {
  recommendations: {
    protocol: string;
    action: "stake" | "restake" | "supply" | "borrow" | "hold";
    allocation: string;
    apy: string;
    reason: string;
  }[];
  riskFlags: string[];
  blendedAPY: string;
}

export default function Recommendations({ 
  recommendations, 
  riskFlags, 
  blendedAPY 
}: RecommendationsProps) {
  const actionColors = {
    stake: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    restake: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    supply: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    borrow: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    hold: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  };

  const actionIcons = {
    stake: "⬆",
    restake: "🔄",
    supply: "📥",
    borrow: "📤",
    hold: "⏸",
  };

  return (
    <div className="space-y-6">
      {/* APY Summary */}
      <div className="relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10" />
        <div className="relative glass rounded-2xl p-8 text-center">
          <p className="text-gray-400 text-sm mb-2 uppercase tracking-wider">Estimated Blended APY</p>
          <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            {blendedAPY}
          </p>
        </div>
      </div>

      {/* Recommendations */}
      <div className="glass rounded-2xl p-8">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <span className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full" />
          Strategy Recommendations
        </h3>
        <div className="space-y-4">
          {recommendations.map((rec, i) => (
            <div 
              key={i}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
              <div className="relative bg-black/30 rounded-xl p-5 border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{actionIcons[rec.action]}</span>
                    <span className="text-lg font-semibold text-white">{rec.protocol}</span>
                    <span className={`px-2 py-1 rounded-md text-xs font-medium border ${actionColors[rec.action]}`}>
                      {rec.action}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-cyan-400 font-bold text-lg">{rec.allocation}</span>
                    <span className="text-gray-500 text-sm ml-2">• {rec.apy} APY</span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm pl-11">{rec.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Flags */}
      <div className="relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent" />
        <div className="relative glass rounded-2xl p-8 border-l-4 border-amber-500/50">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Risk Considerations
          </h3>
          <ul className="space-y-3">
            {riskFlags.map((flag, i) => (
              <li key={i} className="text-gray-400 text-sm flex items-start gap-3">
                <span className="text-amber-400 mt-0.5">⚠</span>
                {flag}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
