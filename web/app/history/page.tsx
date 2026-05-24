"use client";

import { useEffect, useState } from "react";

interface Entry { date: string; content: string; status: string; }

function parseMemoryEntries(memory: string): Entry[] {
  const entries: Entry[] = [];
  const sections = memory.split(/^## /m).filter(Boolean);
  for (const section of sections) {
    const lines = section.trim().split("\n");
    const date = lines[0]?.trim();
    const content = lines.slice(1).join("\n").trim();
    if (!date || !content || date === "Past RFPs") continue;
    const statusMatch = content.match(/\*\*Status:\*\* (\w+)/);
    const status = statusMatch?.[1]?.toLowerCase() || "draft";
    entries.push({ date, content, status });
  }
  return entries.reverse();
}

function statusBadge(status: string) {
  if (status === "won") return <span className="px-2 py-0.5 text-xs font-semibold bg-green-900 text-green-300 rounded-full">Won ✓</span>;
  if (status === "lost") return <span className="px-2 py-0.5 text-xs font-semibold bg-red-900 text-red-300 rounded-full">Lost ✗</span>;
  return <span className="px-2 py-0.5 text-xs font-semibold bg-gray-800 text-gray-400 rounded-full">Draft</span>;
}

export default function HistoryPage() {
  const [memory, setMemory] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/history").then(r => r.json()).then(d => { setMemory(d.memory || ""); setLoading(false); });
  }, []);

  async function setOutcome(date: string, outcome: string) {
    setUpdating(date);
    await fetch("/api/outcome", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, outcome }),
    });
    const d = await fetch("/api/history").then(r => r.json());
    setMemory(d.memory || "");
    setUpdating(null);
  }

  const entries = parseMemoryEntries(memory);
  const won = entries.filter(e => e.status === "won").length;
  const lost = entries.filter(e => e.status === "lost").length;
  const total = entries.length;
  const winRate = total > 0 ? Math.round((won / total) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Agent Memory</h1>
        <p className="text-gray-400 text-sm">Every RFP committed to git. Mark outcomes to help the agent learn what wins.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total RFPs", value: total, color: "text-white" },
          { label: "Won", value: won, color: "text-green-400" },
          { label: "Lost", value: lost, color: "text-red-400" },
          { label: "Win Rate", value: `${winRate}%`, color: winRate >= 50 ? "text-green-400" : "text-yellow-400" },
        ].map(s => (
          <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-green-400" />
        <code className="text-xs text-gray-400 font-mono">agent/memory/MEMORY.md — git-committed history</code>
        <span className="ml-auto text-xs text-gray-500">{total} entries</span>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading memory...</div>
      ) : entries.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-4xl mb-4">🧠</div>
          <p className="text-gray-400">No memory yet.</p>
          <p className="text-gray-600 text-sm mt-1">Generate your first RFP response to start building memory.</p>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-800" />
          <div className="flex flex-col gap-4">
            {entries.map((entry, i) => (
              <div key={i} className="relative pl-10">
                <div className={`absolute left-3 top-3 w-2.5 h-2.5 rounded-full border-2 border-gray-950
                  ${entry.status === "won" ? "bg-green-500" : entry.status === "lost" ? "bg-red-500" : "bg-blue-500"}`}
                />
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-blue-400">{entry.date}</span>
                      {statusBadge(entry.status)}
                    </div>
                    <span className="text-xs text-gray-600 font-mono">git commit</span>
                  </div>
                  <p className="text-sm text-gray-300 whitespace-pre-wrap mb-3">{entry.content}</p>

                  {/* Win/Loss buttons */}
                  {entry.status !== "won" && entry.status !== "lost" && (
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-800">
                      <span className="text-xs text-gray-500">Mark outcome:</span>
                      <button
                        onClick={() => setOutcome(entry.date, "won")}
                        disabled={updating === entry.date}
                        className="px-3 py-1 text-xs font-semibold bg-green-900/50 hover:bg-green-800 text-green-300 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {updating === entry.date ? "..." : "✓ Won"}
                      </button>
                      <button
                        onClick={() => setOutcome(entry.date, "lost")}
                        disabled={updating === entry.date}
                        className="px-3 py-1 text-xs font-semibold bg-red-900/50 hover:bg-red-800 text-red-300 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {updating === entry.date ? "..." : "✗ Lost"}
                      </button>
                    </div>
                  )}

                  {/* Re-open if already marked */}
                  {(entry.status === "won" || entry.status === "lost") && (
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-800">
                      <button
                        onClick={() => setOutcome(entry.date, "draft")}
                        disabled={updating === entry.date}
                        className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
                      >
                        Reset outcome
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
