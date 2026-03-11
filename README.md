# GitHub Portfolio Evaluator (Gemini)

An evidence-grounded GitHub portfolio review agent built for hiring-style evaluation. It inspects repository structure, sampled code, configuration and infrastructure files, and deterministic repo signals before asking Gemini to produce a portfolio score, repository breakdowns, and a prioritized improvement roadmap.

## What it does

- Reviews a public GitHub profile against a target role.
- Builds a full portfolio catalog so older strong repos still influence the result.
- Selects a representative deep-review set using recency, substance, popularity, and role relevance.
- Samples code, manifests, workflows, infra files, schemas, and test/config assets from each selected repo.
- Runs deterministic checks for tests, API usage, Docker or containerization, CI/CD, database usage, and AI or LLM integration.
- Forces every finding to cite file paths or explicitly say `insufficient evidence`.

## Analysis pipeline

1. Fetch all non-fork, non-archived repositories for the profile.
2. Build a portfolio catalog used for fairness at the portfolio-summary level.
3. Rank repositories with a role-aware selector and choose up to 6 for deep analysis.
4. Load README content, repo trees, recent commits, sampled code files, and evidence files.
5. Extract deterministic repo signals before calling the LLM.
6. Send grounded repository context to Gemini through the OpenAI-compatible endpoint.
7. Normalize and guardrail the model output so unsupported claims are replaced with evidence-backed findings or `insufficient evidence`.

## Tech stack

| Component | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| LLM engine | Gemini 2.0 Flash via the OpenAI-compatible endpoint |
| Data source | GitHub REST API |

## Local setup

```bash
git clone <repo-url>
cd portfolio-evaluator
npm install
cp .env.example .env.local
```

Set the required variables in `.env.local`:

```env
GEMINI_API_KEY=your_gemini_key
GITHUB_TOKEN=ghp_...
```

- `GEMINI_API_KEY` is required for analysis.
- `GITHUB_TOKEN` is strongly recommended to avoid low unauthenticated rate limits.

Run the app:

```bash
npm run dev
```

Validation commands:

```bash
npm run lint
npm run build
```

## Provider note

This repository is the Gemini variant. The paired OpenAI deployment copy lives in `portfolio-evaluator-openai/` and is configured for `gpt-4o` so it can be deployed directly to Vercel with an OpenAI API key.

## Project structure

```text
portfolio-evaluator/
├── app/
│   ├── api/analyze/route.ts   # Analysis endpoint
│   ├── globals.css            # Global styling
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Dashboard UI
├── lib/
│   ├── gemini.ts              # Gemini analysis client and output guardrails
│   └── github.ts              # GitHub fetcher, repo sampler, deterministic signals
├── .env.example
└── package.json
```

## License

MIT
