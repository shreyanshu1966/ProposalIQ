const OWNER = process.env.GITHUB_OWNER!;
const REPO = process.env.GITHUB_REPO!;
const TOKEN = process.env.GITHUB_TOKEN!;

const BASE = `https://api.github.com/repos/${OWNER}/${REPO}/contents`;

async function ghGet(filePath: string): Promise<{ content: string; sha: string } | null> {
  const res = await fetch(`${BASE}/agent/${filePath}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: "application/vnd.github+json",
    },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = await res.json();
  const content = Buffer.from(data.content, "base64").toString("utf-8");
  return { content, sha: data.sha };
}

async function ghPut(filePath: string, content: string, sha: string, message: string) {
  await fetch(`${BASE}/agent/${filePath}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      content: Buffer.from(content, "utf-8").toString("base64"),
      sha,
    }),
  });
}

export async function readAgentFile(filename: string): Promise<string> {
  const result = await ghGet(filename);
  return result?.content ?? "";
}

export async function readCompanyProfile(): Promise<string> {
  return readAgentFile("knowledge/company.md");
}

export async function readMemory(): Promise<string> {
  return readAgentFile("memory/MEMORY.md");
}

export async function appendToMemory(entry: string): Promise<void> {
  const result = await ghGet("memory/MEMORY.md");
  if (!result) return;

  const timestamp = new Date().toISOString().split("T")[0];
  const newEntry = `\n## ${timestamp}\n${entry}\n`;
  const updated = result.content.replace(
    "<!-- Entries will be added automatically after each proposal is generated -->",
    "<!-- Entries will be added automatically after each proposal is generated -->" + newEntry
  );

  await ghPut(
    "memory/MEMORY.md",
    updated,
    result.sha,
    `memory: commit RFP response — ${timestamp}`
  );
}

export async function updateOutcome(date: string, outcome: string): Promise<void> {
  const result = await ghGet("memory/MEMORY.md");
  if (!result) return;

  const sectionRegex = new RegExp(`(## ${date}[\\s\\S]*?)(\\*\\*Status:\\*\\* \\w+)`, "m");
  let updated = result.content;
  if (sectionRegex.test(updated)) {
    updated = updated.replace(sectionRegex, `$1**Status:** ${outcome}`);
  }

  await ghPut(
    "memory/MEMORY.md",
    updated,
    result.sha,
    `memory: mark RFP ${date} as ${outcome}`
  );
}

export async function saveCompanyProfile(content: string): Promise<void> {
  const result = await ghGet("knowledge/company.md");
  if (!result) return;
  await ghPut(
    "knowledge/company.md",
    content,
    result.sha,
    "profile: update company profile"
  );
}
