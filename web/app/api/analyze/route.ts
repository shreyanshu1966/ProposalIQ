import { NextRequest } from "next/server";
import { readCompanyProfile, AGENT_DIR } from "@/lib/agent";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";
export const maxDuration = 60;

export interface RFPAnalysis {
  requirements: string[];
  redFlags: { item: string; reason: string }[];
  deadline: string;
  budget: string;
  complianceScore: number;
  metRequirements: string[];
  gaps: string[];
  summary: string;
}

export async function POST(req: NextRequest) {
  const { rfpText } = await req.json();
  if (!rfpText?.trim()) {
    return Response.json({ error: "RFP text required" }, { status: 400 });
  }

  const company = readCompanyProfile();
  const rules = (() => {
    try { return fs.readFileSync(path.join(AGENT_DIR, "RULES.md"), "utf-8"); } catch { return ""; }
  })();

  const githubToken = process.env.OPENAI_API_KEY;
  if (!githubToken) return Response.json({ error: "No API key" }, { status: 500 });

  const prompt = `Analyze this RFP against the company profile below. Return ONLY valid JSON.

## Company Profile
${company}

## RFP Document
${rfpText}

Return this exact JSON structure:
{
  "requirements": ["list every distinct requirement from the RFP"],
  "redFlags": [{"item": "requirement text", "reason": "why company cannot meet it"}],
  "deadline": "submission deadline date as string",
  "budget": "budget/contract value as string",
  "complianceScore": <number 0-100>,
  "metRequirements": ["requirements the company clearly meets"],
  "gaps": ["requirements the company cannot clearly meet"],
  "summary": "2-sentence plain English summary of this RFP"
}`;

  try {
    const res = await fetch("https://models.inference.ai.azure.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${githubToken}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: `You are an expert RFP analyst. ${rules}` },
          { role: "user", content: prompt },
        ],
        max_tokens: 2048,
        temperature: 0.1,
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return Response.json({ error: err }, { status: 500 });
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    const analysis: RFPAnalysis = JSON.parse(content);
    return Response.json(analysis);
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
