import { NextResponse } from "next/server";
import { readMemory, readCompanyProfile } from "@/lib/agent";

export const runtime = "nodejs";

export async function GET() {
  const memory = readMemory();
  const company = readCompanyProfile();
  return NextResponse.json({ memory, company });
}

export async function PUT(req: Request) {
  const { company } = await req.json();
  const fs = await import("fs");
  const { COMPANY_FILE } = await import("@/lib/agent");
  fs.writeFileSync(COMPANY_FILE, company, "utf-8");
  return NextResponse.json({ ok: true });
}
