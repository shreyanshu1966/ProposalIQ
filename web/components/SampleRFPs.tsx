"use client";
import { SAMPLE_RFPS } from "@/lib/samples";

interface Props {
  onSelect: (text: string) => void;
}

export default function SampleRFPs({ onSelect }: Props) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
        Load a sample RFP
      </p>
      <div className="flex flex-wrap gap-2">
        {SAMPLE_RFPS.map((s) => (
          <button
            key={s.title}
            onClick={() => onSelect(s.text)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-500 rounded-lg text-xs text-gray-300 hover:text-white transition-all"
          >
            <span>{s.emoji}</span>
            <span>{s.title}</span>
            <span className="text-gray-600">·</span>
            <span className="text-gray-500">{s.industry}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
