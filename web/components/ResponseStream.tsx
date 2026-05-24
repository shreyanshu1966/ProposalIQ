"use client";

interface Props {
  content: string;
  loading: boolean;
}

const SECTION_ICONS: Record<string, string> = {
  "Executive Summary": "📋",
  "Understanding of Requirements": "🔍",
  "Proposed Solution": "💡",
  "Team & Experience": "👥",
  "Pricing": "💰",
  "Compliance": "✅",
};

function highlightFlags(text: string) {
  return text
    .replace(/\[NEEDS INPUT\]/g, '<mark class="bg-yellow-900 text-yellow-300 px-1 rounded">[NEEDS INPUT]</mark>')
    .replace(/\[REVIEW NEEDED\]/g, '<mark class="bg-red-900 text-red-300 px-1 rounded">[REVIEW NEEDED]</mark>');
}

export default function ResponseStream({ content, loading }: Props) {
  if (!content && !loading) return null;

  const lines = content.split("\n");

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-700 bg-gray-800/50">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${loading ? "bg-green-400 animate-pulse" : "bg-gray-500"}`} />
          <span className="text-sm font-medium text-gray-300">
            {loading ? "Agent is writing..." : "Proposal generated"}
          </span>
        </div>
        {content && (
          <button
            onClick={() => navigator.clipboard.writeText(content)}
            className="text-xs text-gray-400 hover:text-white transition-colors border border-gray-600 px-3 py-1 rounded-lg"
          >
            Copy
          </button>
        )}
      </div>

      <div className="p-6 prose prose-invert prose-sm max-w-none overflow-y-auto max-h-[600px]">
        {lines.map((line, i) => {
          const isH1 = line.startsWith("# ");
          const isH2 = line.startsWith("## ");
          const isH3 = line.startsWith("### ");
          const isBullet = line.startsWith("- ") || line.startsWith("* ");
          const isNumbered = /^\d+\./.test(line);

          const sectionKey = Object.keys(SECTION_ICONS).find(k => line.includes(k));
          const icon = sectionKey ? SECTION_ICONS[sectionKey] : "";

          if (isH1) return (
            <h1 key={i} className="text-xl font-bold text-white mt-0 mb-4">
              {line.replace("# ", "")}
            </h1>
          );
          if (isH2) return (
            <h2 key={i} className="text-base font-semibold text-blue-400 mt-6 mb-2 flex items-center gap-2">
              {icon && <span>{icon}</span>}
              {line.replace("## ", "")}
            </h2>
          );
          if (isH3) return (
            <h3 key={i} className="text-sm font-semibold text-gray-300 mt-4 mb-1">
              {line.replace("### ", "")}
            </h3>
          );
          if (isBullet) return (
            <li key={i} className="text-gray-300 text-sm ml-4"
              dangerouslySetInnerHTML={{ __html: highlightFlags(line.replace(/^[-*] /, "")) }} />
          );
          if (isNumbered) return (
            <p key={i} className="text-gray-300 text-sm"
              dangerouslySetInnerHTML={{ __html: highlightFlags(line) }} />
          );
          if (!line.trim()) return <div key={i} className="h-2" />;
          return (
            <p key={i} className="text-gray-300 text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: highlightFlags(line) }} />
          );
        })}
        {loading && (
          <span className="inline-block w-2 h-4 bg-blue-400 animate-pulse ml-1 align-middle" />
        )}
      </div>
    </div>
  );
}
