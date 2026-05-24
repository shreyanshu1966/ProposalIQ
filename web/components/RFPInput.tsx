"use client";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onGenerate: () => void;
  loading: boolean;
}

export default function RFPInput({ value, onChange, onGenerate, loading }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Paste RFP Document
        </label>
        <textarea
          className="w-full h-64 bg-gray-900 border border-gray-700 rounded-xl p-4 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono"
          placeholder={`Paste the full RFP text here...

Example:
REQUEST FOR PROPOSAL
Project: Enterprise Cloud Migration
Deadline: June 30, 2026

1. Company Background
   We are seeking a vendor to...

2. Scope of Work
   The selected vendor shall...`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>

      <button
        onClick={onGenerate}
        disabled={loading || !value.trim()}
        className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Generating proposal...
          </>
        ) : (
          "Generate RFP Response →"
        )}
      </button>
    </div>
  );
}
