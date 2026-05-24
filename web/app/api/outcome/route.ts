import { NextRequest } from "next/server";
import { MEMORY_FILE } from "@/lib/agent";
import fs from "fs";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { date, outcome } = await req.json(); // outcome: "won" | "lost" | "pending"
  if (!date || !outcome) return Response.json({ error: "date and outcome required" }, { status: 400 });

  try {
    let memory = fs.readFileSync(MEMORY_FILE, "utf-8");
    // Find the section for this date and update/append outcome
    const sectionRegex = new RegExp(`(## ${date}[\\s\\S]*?)(\\*\\*Status:\\*\\* \\w+)`, "m");
    if (sectionRegex.test(memory)) {
      memory = memory.replace(sectionRegex, `$1**Status:** ${outcome}`);
    } else {
      // fallback: append outcome note
      memory += `\n## ${date} — Outcome\n**Status:** ${outcome}\n`;
    }
    fs.writeFileSync(MEMORY_FILE, memory, "utf-8");
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
