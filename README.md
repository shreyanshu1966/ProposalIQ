# ProposalIQ — Git-Native RFP Response Agent

> Built for the **Lyzr Builder Challenge** using GitAgent

ProposalIQ is an AI agent that lives inside this GitHub repository. It reads RFPs (Requests for Proposal), scores compliance against your company profile, generates full proposal responses, and remembers every RFP outcome — all as real git commits.

## Architecture

```
ProposalIQ/
├── agent/                  ← GitAgent identity (version-controlled)
│   ├── SOUL.md             ← Agent persona: senior enterprise sales executive
│   ├── RULES.md            ← Guardrails: never invent facts, use [NEEDS INPUT]
│   ├── agent.yaml          ← Model config (gpt-4o-mini via GitHub Models)
│   ├── knowledge/
│   │   └── company.md      ← Your company profile (editable in-app)
│   └── memory/
│       └── MEMORY.md       ← Every RFP response logged as a git commit
└── web/                    ← Next.js 15 front-end
    ├── app/api/
    │   ├── analyze/        ← RFP analysis + compliance scoring
    │   ├── generate/       ← Streaming proposal generation
    │   ├── history/        ← Memory + company profile CRUD
    │   └── outcome/        ← Win/Loss tracking (commits to MEMORY.md)
    ├── lib/agent.ts        ← GitHub Contents API bridge
    └── components/         ← RFPAnalysis, ResponseStream, SampleRFPs
```

## How It Works (GitAgent Pattern)

1. **Agent lives in git** — SOUL.md, RULES.md, knowledge, and memory are all plain files in this repo. The web app reads them via the GitHub Contents API on every request, so updating the agent is just a git commit.

2. **Every proposal = a commit** — When a proposal is generated, `appendToMemory()` commits a new entry to `agent/memory/MEMORY.md`. When you mark a deal Won or Lost, `updateOutcome()` commits that too. The repo IS the agent's memory.

3. **Streaming generation** — The `/api/generate` route calls GitHub Models (gpt-4o-mini) with Server-Sent Events, streaming each token to the UI in real time.

4. **Compliance scoring** — `/api/analyze` returns a structured JSON score (0–100) with met requirements, gaps, red flags, deadline, and budget extracted from the RFP.

## Features

| Feature | Description |
|---|---|
| RFP Analyzer | Scores compliance 0-100, extracts requirements, flags gaps |
| Proposal Generator | Streams a full 6-section proposal response |
| Win/Loss Tracker | Every outcome committed to git — full audit trail |
| Company Profile Editor | Edit your profile in-app; saves as a git commit |
| Sample RFPs | 4 real-world examples (Healthcare, Finance, Gov, Retail) |

## Setup

### 1. Clone and install

```bash
git clone https://github.com/shreyanshu1966/ProposalIQ
cd ProposalIQ/web
npm install
```

### 2. Configure environment

Create `web/.env.local`:

```env
# GitHub PAT with read/write access to THIS repo (for agent file R/W)
GITHUB_TOKEN=ghp_...

# GitHub PAT with Models permission (for AI generation)
OPENAI_API_KEY=github_pat_...

GITHUB_OWNER=shreyanshu1966
GITHUB_REPO=ProposalIQ
```

Two separate tokens are used intentionally:
- `GITHUB_TOKEN` — reads/writes `agent/` files (SOUL.md, memory, company profile)
- `OPENAI_API_KEY` — calls GitHub Models API (`https://models.inference.ai.azure.com`)

### 3. Run

```bash
cd web
npm run dev
# open http://localhost:3000
```

## GitAgent Connection

This project implements the GitAgent standard:

- **`agent/SOUL.md`** — agent identity and persona
- **`agent/RULES.md`** — behavioral rules and constraints  
- **`agent/agent.yaml`** — model preferences
- **`agent/knowledge/`** — domain knowledge (company profile)
- **`agent/memory/`** — persistent memory via git commits

The web app is the agent's interface, but the agent itself is the git repo. Swapping the model, changing the persona, or updating knowledge is a git operation — fully auditable, diffable, and rollback-able.

## Tech Stack

- **Next.js 15** (App Router, streaming API routes)
- **GitHub Models API** (gpt-4o-mini, OpenAI-compatible)
- **GitHub Contents API** (agent file storage)
- **GitAgent / Lyzr gitclaw** (agent file standard)
- **Tailwind CSS**
