import { NextRequest } from "next/server";
import { updateOutcome } from "@/lib/agent";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { date, outcome } = await req.json();
  if (!date || !outcome) return Response.json({ error: "date and outcome required" }, { status: 400 });
  await updateOutcome(date, outcome);
  return Response.json({ ok: true });
}
