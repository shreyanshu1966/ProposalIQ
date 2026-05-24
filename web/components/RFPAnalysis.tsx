"use client";
import type { RFPAnalysis } from "@/app/api/analyze/route";

interface Props {
  analysis: RFPAnalysis;
  onGenerate: () => void;
  loading: boolean;
}

function ScoreRing({ score }: { score: number }) {
  const color = score >= 75 ? "text-green-400" : score >= 50 ? "text-yellow-400" : "text-red-400";
  const ring = score >= 75 ? "border-green-500" : score >= 50 ? "border-yellow-500" : "border-red-500";
  const label = score >= 75 ? "Strong Match" : score >= 50 ? "Partial Match" : "Weak Match";
  return (
    <div className={`flex flex-col items-center justify-center w-28 h-28 rounded-full border-4 ${ring} bg-gray-900`}>
      <span className={`text-3xl font-bold ${color}`}>{score}</span>
      <span className="text-xs text-gray-400">/ 100</span>
      <span className={`text-xs font-medium ${color}`}>{label}</span>
    </div>
  );
}

export default function RFPAnalysisPanel({ analysis, onGenerate, loading }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {/* Header row: score + meta */}
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 flex items-center gap-6">
        <ScoreRing score={analysis.complianceScore} />
        <div className="flex-1">
          <p className="text-sm text-gray-300 mb-3">{analysis.summary}</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-800 rounded-lg px-3 py-2">
              <p className="text-xs text-gray-500">Deadline</p>
              <p className="text-sm font-semibold text-white">{analysis.deadline || "Not specified"}</p>
            </div>
            <div className="bg-gray-800 rounded-lg px-3 py-2">
              <p className="text-xs text-gray-500">Budget</p>
              <p className="text-sm font-semibold text-white">{analysis.budget || "Not specified"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Requirements breakdown */}
      <div className="grid grid-cols-2 gap-4">
        {/* Met requirements */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-xs font-semibold text-green-400 uppercase tracking-wider">
              Can Meet ({analysis.metRequirements.length})
            </span>
          </div>
          <ul className="flex flex-col gap-1.5">
            {analysis.metRequirements.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                {r}
              </li>
            ))}
          </ul>
        </div>

        {/* Gaps */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-red-400" />
            <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">
              Gaps ({analysis.gaps.length})
            </span>
          </div>
          <ul className="flex flex-col gap-1.5">
            {analysis.gaps.length === 0 ? (
              <li className="text-xs text-gray-500">No gaps found 🎉</li>
            ) : analysis.gaps.map((g, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                <span className="text-red-500 mt-0.5 flex-shrink-0">✗</span>
                {g}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Red flags */}
      {analysis.redFlags.length > 0 && (
        <div className="bg-red-950/30 border border-red-900 rounded-xl p-4">
          <p className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2">
            ⚠ Red Flags ({analysis.redFlags.length})
          </p>
          <ul className="flex flex-col gap-2">
            {analysis.redFlags.map((f, i) => (
              <li key={i} className="text-xs">
                <span className="font-medium text-red-300">{f.item}</span>
                <span className="text-red-500"> — {f.reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Requirements list */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          All Requirements ({analysis.requirements.length})
        </p>
        <div className="grid grid-cols-1 gap-1">
          {analysis.requirements.map((r, i) => {
            const isMet = analysis.metRequirements.some(m => m.toLowerCase().includes(r.toLowerCase().slice(0, 20)));
            return (
              <div key={i} className="flex items-start gap-2 text-xs py-1 border-b border-gray-800 last:border-0">
                <span className={isMet ? "text-green-500" : "text-gray-600"}>
                  {isMet ? "✓" : "○"}
                </span>
                <span className="text-gray-300">{r}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Generate button */}
      <button
        onClick={onGenerate}
        disabled={loading}
        className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Generating proposal...
          </>
        ) : (
          `Generate Full Proposal → (Score: ${analysis.complianceScore}/100)`
        )}
      </button>
    </div>
  );
}
