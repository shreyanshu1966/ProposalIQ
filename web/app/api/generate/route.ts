import { NextRequest } from "next/server";
import { readCompanyProfile, readAgentFile, appendToMemory } from "@/lib/agent";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(req: NextRequest) {
  const { rfpText, companyProfile } = await req.json();
  if (!rfpText?.trim()) {
    return new Response(JSON.stringify({ error: "RFP text is required" }), { status: 400 });
  }

  const [company, soul, rules] = await Promise.all([
    companyProfile?.trim() || readCompanyProfile(),
    readAgentFile("SOUL.md"),
    readAgentFile("RULES.md"),
  ]);

  const systemPrompt = `${soul}\n\n---\n\n${rules}`;
  const userPrompt = `You are responding to the following RFP on behalf of the company described below.

## Company Profile
${company}

## RFP Document
${rfpText}

Write a complete, professional RFP response structured as:
1. Executive Summary (max 200 words)
2. Understanding of Requirements
3. Proposed Solution & Approach
4. Team & Experience
5. Pricing & Timeline
6. Compliance Checklist

Use [NEEDS INPUT] for missing company information.
Use [REVIEW NEEDED] for requirements that may be hard to meet.`;

  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  const githubToken = process.env.OPENAI_API_KEY;

  if (!githubToken) {
    return new Response(JSON.stringify({ error: "OPENAI_API_KEY not set" }), { status: 500 });
  }

  (async () => {
    let fullResponse = "";
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
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          max_tokens: 4096,
          temperature: 0.3,
          stream: true,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        await writer.write(encoder.encode(`data: ${JSON.stringify({ type: "error", content: err })}\n\n`));
        return;
      }

      const reader = res.body!.getReader();
      const dec = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = dec.decode(value);
        for (const line of chunk.split("\n")) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") continue;
          try {
            const json = JSON.parse(data);
            const delta = json.choices?.[0]?.delta?.content;
            if (delta) {
              fullResponse += delta;
              await writer.write(encoder.encode(`data: ${JSON.stringify({ type: "delta", content: delta })}\n\n`));
            }
          } catch {}
        }
      }

      if (fullResponse) {
        const summary = rfpText.slice(0, 200).replace(/\n/g, " ");
        await appendToMemory(`**RFP:** ${summary}...\n**Response generated:** ${new Date().toLocaleString()}\n**Status:** Draft`);
      }

      await writer.write(encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      await writer.write(encoder.encode(`data: ${JSON.stringify({ type: "error", content: msg })}\n\n`));
    } finally {
      await writer.close();
    }
  })();

  return new Response(stream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
