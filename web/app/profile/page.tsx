"use client";

import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [company, setCompany] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/history")
      .then(r => r.json())
      .then(d => { setCompany(d.company || ""); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function handleSave() {
    await fetch("/api/history", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Company Profile</h1>
        <p className="text-gray-400 text-sm">
          This is what your agent knows about your company. It uses this to write accurate proposals.
          Stored in <code className="text-blue-400 text-xs">agent/knowledge/company.md</code>
        </p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-4 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-yellow-400" />
        <span className="text-xs text-gray-400">
          The agent will only use facts from this file. Anything missing will be flagged as <code className="text-yellow-300">[NEEDS INPUT]</code>
        </span>
      </div>

      {loading ? (
        <div className="text-gray-500 text-sm">Loading profile...</div>
      ) : (
        <>
          <textarea
            className="w-full h-[500px] bg-gray-900 border border-gray-700 rounded-xl p-4 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono resize-none"
            value={company}
            onChange={e => setCompany(e.target.value)}
            placeholder="Enter your company profile in markdown..."
          />
          <button
            onClick={handleSave}
            className="mt-4 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors text-sm"
          >
            {saved ? "✓ Saved" : "Save Profile"}
          </button>
        </>
      )}
    </div>
  );
}
