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
    stake: "bg-mantle/20 text-mantle border-mantle/30",
    restake: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    supply: "bg-green-500/20 text-green-400 border-green-500/30",
    borrow: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    hold: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  };

  return (
    <div className="space-y-6">
      {/* APY Summary */}
      <div className="glass rounded-2xl p-6">
        <div className="text-center">
          <p className="text-gray-400 text-sm mb-1">Estimated Blended APY</p>
          <p className="text-4xl font-bold gradient-mantle bg-clip-text text-transparent">
            {blendedAPY}
          </p>
        </div>
      </div>

      {/* Recommendations */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">Strategy Recommendations</h3>
        <div className="space-y-4">
          {recommendations.map((rec, i) => (
            <div 
              key={i}
              className="bg-black/30 rounded-xl p-4 border border-gray-800"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-white">{rec.protocol}</span>
                  <span className={`px-2 py-0.5 rounded text-xs border ${actionColors[rec.action]}`}>
                    {rec.action.toUpperCase()}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-mantle font-semibold">{rec.allocation}</span>
                  <span className="text-gray-500 text-sm ml-2">{rec.apy} APY</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm">{rec.reason}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Flags */}
      <div className="glass rounded-2xl p-6 border-l-4 border-orange-500">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Risk Considerations
        </h3>
        <ul className="space-y-2">
          {riskFlags.map((flag, i) => (
            <li key={i} className="text-gray-400 text-sm flex items-start gap-2">
              <span className="text-orange-400 mt-1">•</span>
              {flag}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
