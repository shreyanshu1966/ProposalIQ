import { readMemory, readCompanyProfile, saveCompanyProfile } from "@/lib/agent";

export const runtime = "nodejs";

export async function GET() {
  const [memory, company] = await Promise.all([readMemory(), readCompanyProfile()]);
  return Response.json({ memory, company });
}

export async function PUT(req: Request) {
  const { company } = await req.json();
  await saveCompanyProfile(company);
  return Response.json({ ok: true });
}
