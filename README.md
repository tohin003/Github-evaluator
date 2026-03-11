# Code Portfolio Evaluator — AI-Powered GitHub Analysis

An agentic AI system that evaluates a candidate's GitHub portfolio and generates a comprehensive **Portfolio Score (0-100)** with dimensional breakdowns, per-repository insights, strengths, concerns, and an actionable improvement roadmap.

Built as the **Part B prototype** for the JSO Internship Assignment.

---

## Features

- **GitHub Username + Target Role Input** — Enter any public GitHub username and specify the role they're applying for (e.g. "Senior Full Stack Developer")
- **Batched Multi-Repo Analysis** — Evaluates up to 10 repositories in a single LLM call for speed and reliability
- **5-Dimensional Scoring** — Code Quality, Project Complexity, Documentation, Consistency & Activity, Tech Relevance (each 0-20)
- **Expandable Repository Insights** — Click any repo to reveal its individual score breakdown, key positives, and suggested improvements
- **AI-Generated Improvement Roadmap** — Prioritized recommendations with estimated score impact
- **Strengths & Concerns Summary** — Quick overview for HR consultants and recruiters

## Tech Stack

| Component | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| LLM Engine | Google Gemini 2.0 Flash (via OpenAI-compatible endpoint) |
| Data Source | GitHub REST API |
| Language | TypeScript |

## Getting Started

### 1. Clone & Install

```bash
git clone <repo-url>
cd portfolio-evaluator
npm install
```

### 2. Configure Environment

Create a `.env.local` file:

```env
GITHUB_TOKEN=ghp_your_github_personal_access_token
GEMINI_API_KEY=your_google_gemini_api_key
```

- **GITHUB_TOKEN** — A GitHub Personal Access Token (classic) with `public_repo` scope. Increases the API rate limit from 60 to 5000 requests/hour.
- **GEMINI_API_KEY** — A Google Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey).

### 3. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Architecture

```
Input: GitHub Username + Target Role
        │
        ▼
┌─────────────────────────────────┐
│  GitHub REST API (Data Fetch)   │
│  • Profile, Repos, File Trees   │
│  • Commits, README, Code Files  │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│  Gemini 2.0 Flash (Analysis)    │
│  • Batched multi-repo prompt    │
│  • 5-dimensional scoring        │
│  • Portfolio-level summary      │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│  Next.js Dashboard (Display)    │
│  • Score card + profile summary │
│  • Dimensional breakdown cards  │
│  • Expandable repo insights     │
│  • Strengths, concerns, roadmap │
└─────────────────────────────────┘
```

---

## Testing with OpenAI API

> **Note:** During development, the Gemini free-tier API did not have sufficient quota for the large batched analysis prompts required by this agent. To validate that the entire analysis pipeline works correctly end-to-end, we tested extensively using **OpenAI's `gpt-4o-mini` model** via the paid API.
>
> The architecture uses the **OpenAI-compatible chat completions format** (`/v1/chat/completions`), which is supported by both OpenAI and Google Gemini (via `generativelanguage.googleapis.com/v1beta/openai/v1`). This means the codebase can be switched between providers by changing just **2 values**: the base URL and the model name.
>
> **To switch to OpenAI for testing:**
> 1. In `lib/gemini.ts`, change `LLM_API_BASE` to `https://api.openai.com/v1` and `model` to `gpt-4o-mini`
> 2. In `route.ts`, change `GEMINI_API_KEY` references to `OPENAI_API_KEY`
> 3. Add `OPENAI_API_KEY=sk-...` to your `.env.local`
>
> The analysis logic, scoring engine, and UI remain identical regardless of which LLM provider is used.

---

## Project Structure

```
portfolio-evaluator/
├── app/
│   ├── page.tsx              # Main dashboard UI
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Tailwind v4 styles
│   └── api/
│       └── analyze/
│           └── route.ts      # POST /api/analyze endpoint
├── lib/
│   ├── gemini.ts             # LLM client (batched prompt + parsing)
│   └── github.ts             # GitHub API data fetching
├── .env.local                # API keys (not committed)
└── package.json
```

## License

MIT
