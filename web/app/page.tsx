"use client";

import { useState } from "react";
import RFPInput from "@/components/RFPInput";
import ResponseStream from "@/components/ResponseStream";
import SampleRFPs from "@/components/SampleRFPs";
import RFPAnalysisPanel from "@/components/RFPAnalysis";
import type { RFPAnalysis } from "@/app/api/analyze/route";

type Step = "input" | "analyzing" | "analyzed" | "generating" | "done";

export default function HomePage() {
  const [rfpText, setRfpText] = useState("");
  const [response, setResponse] = useState("");
  const [analysis, setAnalysis] = useState<RFPAnalysis | null>(null);
  const [step, setStep] = useState<Step>("input");
  const [error, setError] = useState("");

  async function handleAnalyze() {
    if (!rfpText.trim()) return;
    setStep("analyzing");
    setAnalysis(null);
    setError("");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rfpText }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setAnalysis(data);
      setStep("analyzed");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
      setStep("input");
    }
  }

  async function handleGenerate() {
    setStep("generating");
    setResponse("");
    setError("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rfpText }),
      });
      if (!res.ok || !res.body) throw new Error("Failed to start generation");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        for (const line of chunk.split("\n")) {
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.type === "delta") setResponse(prev => prev + data.content);
            if (data.type === "error") setError(data.content);
            if (data.type === "done") setStep("done");
          } catch {}
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
      setStep("analyzed");
    }
  }

  function handleReset() {
    setRfpText("");
    setAnalysis(null);
    setResponse("");
    setError("");
    setStep("input");
  }

  const isAnalyzing = step === "analyzing";
  const isGenerating = step === "generating";

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">RFP Response Agent</h1>
          <p className="text-gray-400 text-sm">
            Git-native AI agent that reads RFPs, scores your fit, and writes winning proposals.
          </p>
        </div>
        {step !== "input" && (
          <button onClick={handleReset} className="text-sm text-gray-500 hover:text-white transition-colors border border-gray-700 px-4 py-2 rounded-lg">
            ← New RFP
          </button>
        )}
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {[
          { id: "input", label: "1. Paste RFP" },
          { id: "analyzed", label: "2. Analyze" },
          { id: "done", label: "3. Generate" },
        ].map((s, i) => {
          const steps = ["input", "analyzing", "analyzed", "generating", "done"];
          const current = steps.indexOf(step);
          const target = steps.indexOf(s.id);
          const done = current > target;
          const active = current === target || (s.id === "analyzed" && step === "analyzing") || (s.id === "done" && step === "generating");
          return (
            <div key={s.id} className="flex items-center gap-2">
              {i > 0 && <div className={`h-px w-8 ${done ? "bg-blue-500" : "bg-gray-700"}`} />}
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors
                ${done ? "bg-blue-600 text-white" : active ? "bg-blue-600/30 text-blue-300 border border-blue-500" : "bg-gray-900 text-gray-500 border border-gray-800"}`}>
                {done ? "✓" : ""} {s.label}
              </div>
            </div>
          );
        })}
      </div>

      {error && (
        <div className="mb-6 bg-red-900/30 border border-red-800 text-red-300 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="flex flex-col gap-4">
          {/* Step 1: Input */}
          {step === "input" && (
            <>
              <SampleRFPs onSelect={(text) => { setRfpText(text); }} />
              <RFPInput
                value={rfpText}
                onChange={setRfpText}
                onGenerate={handleAnalyze}
                loading={isAnalyzing}
              />
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Agent", value: "ProposalIQ v1" },
                  { label: "Memory", value: "Git-native" },
                  { label: "Model", value: "GPT-4o mini" },
                ].map(stat => (
                  <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2">
                    <div className="text-xs text-gray-500">{stat.label}</div>
                    <div className="text-sm font-medium text-gray-200">{stat.value}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Step 2+: Show RFP preview */}
          {step !== "input" && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">RFP Document</p>
              <p className="text-xs text-gray-400 font-mono whitespace-pre-wrap line-clamp-6">{rfpText}</p>
            </div>
          )}

          {/* Step 2: Analysis */}
          {step === "analyzing" && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-400">Analyzing RFP requirements...</p>
              <p className="text-xs text-gray-600">Checking against your company profile</p>
            </div>
          )}

          {(step === "analyzed" || step === "generating" || step === "done") && analysis && (
            <RFPAnalysisPanel
              analysis={analysis}
              onGenerate={handleGenerate}
              loading={isGenerating}
            />
          )}
        </div>

        {/* Right column */}
        <div>
          {step === "input" && (
            <div className="h-full min-h-64 bg-gray-900 border border-dashed border-gray-700 rounded-xl flex flex-col items-center justify-center text-center p-8">
              <div className="text-4xl mb-3">📄</div>
              <p className="text-gray-400 text-sm">Analysis & proposal appear here</p>
              <p className="text-gray-600 text-xs mt-1">Paste an RFP or load a sample to start</p>
            </div>
          )}

          {step === "analyzing" && (
            <div className="h-full min-h-64 bg-gray-900 border border-dashed border-gray-700 rounded-xl flex flex-col items-center justify-center text-center p-8">
              <div className="text-4xl mb-3 animate-pulse">🔍</div>
              <p className="text-gray-400 text-sm">Reading requirements...</p>
            </div>
          )}

          {step === "analyzed" && (
            <div className="h-full min-h-64 bg-gray-900 border border-dashed border-gray-700 rounded-xl flex flex-col items-center justify-center text-center p-8">
              <div className="text-4xl mb-3">✅</div>
              <p className="text-gray-400 text-sm">Analysis complete</p>
              <p className="text-gray-600 text-xs mt-1">Click "Generate Full Proposal" to write the response</p>
            </div>
          )}

          {(step === "generating" || step === "done") && (
            <ResponseStream content={response} loading={isGenerating} />
          )}
        </div>
      </div>
    </div>
  );
}
