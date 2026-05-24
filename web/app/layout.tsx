import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ProposalIQ — AI RFP Response Agent",
  description: "Win more RFPs with your git-native AI proposal agent",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-gray-100 antialiased min-h-screen">
        <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">P</div>
            <span className="font-semibold text-lg tracking-tight">ProposalIQ</span>
            <span className="text-xs text-gray-500 border border-gray-700 px-2 py-0.5 rounded-full">git-native</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <a href="/" className="hover:text-white transition-colors">Generate</a>
            <a href="/history" className="hover:text-white transition-colors">Memory</a>
            <a href="/profile" className="hover:text-white transition-colors">Company Profile</a>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
