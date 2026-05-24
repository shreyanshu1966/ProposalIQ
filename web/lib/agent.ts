import path from "path";
import fs from "fs";

export const AGENT_DIR = path.resolve(process.cwd(), "../agent");
export const MEMORY_FILE = path.join(AGENT_DIR, "memory", "MEMORY.md");
export const COMPANY_FILE = path.join(AGENT_DIR, "knowledge", "company.md");

export function readCompanyProfile(): string {
  try {
    return fs.readFileSync(COMPANY_FILE, "utf-8");
  } catch {
    return "";
  }
}

export function appendToMemory(entry: string): void {
  const existing = fs.readFileSync(MEMORY_FILE, "utf-8");
  const timestamp = new Date().toISOString().split("T")[0];
  const newEntry = `\n## ${timestamp}\n${entry}\n`;
  const updated = existing.replace(
    "<!-- Entries will be added automatically after each proposal is generated -->",
    "<!-- Entries will be added automatically after each proposal is generated -->" + newEntry
  );
  fs.writeFileSync(MEMORY_FILE, updated, "utf-8");
}

export function readMemory(): string {
  try {
    return fs.readFileSync(MEMORY_FILE, "utf-8");
  } catch {
    return "";
  }
}
