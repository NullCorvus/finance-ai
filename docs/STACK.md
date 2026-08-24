# Stack — Finance AI Tracker

> **Status:** PROPOSAL — the interface (Flutter) and full stack are the team's proposal, pending
> professor/team confirmation once the semester starts. Resolves TASKS.md **Step 2** (was ON HOLD)
> and several **Step 8** post-stack items. Decisions source: `docs/ALCANCE.md`, `docs/ARCHITECTURE.md`,
> `TASKS.md` Step 2, `guia_paso_a_paso.md`.

## Decisions

| # | Layer | Decision | Rationale |
|---|---|---|---|
| 1 | **Interface** | **Flutter (Dart)** | Mobile — matches the PGC title "aplicación móvil". One codebase → Android + iOS + web (web build = free demo fallback). Hot reload → fast iteration for a 16-week prototype. Strong AI-assistant codegen support. |
| 2 | **Backend** | **Python + FastAPI** | Team already knows Python → zero language ramp-up. Lean, async JSON API with auto OpenAPI docs. Fits the pattern: one AI call per receipt + plain-SQL analytics. |
| 3 | **Database** | **PostgreSQL** | `docs/schema.sql` is already PostgreSQL. Runs on the VM. JSONB available for AI output if needed. |
| 4 | **Product AI** | **OpenAI-compatible LLM gateway (vision model)** — see Providers below | AI is used ONLY for input parsing (photo/voice/text → structured JSON), server-side. The phone never calls the LLM directly. In the same parse step it handles **voice → text (STT)**: voice input is sent as audio to the model, which **transcribes and extracts the structured expense in one call**. No separate STT service. Verified during construction with a real voice memo; if accuracy/latency is unacceptable, fall back to a separate STT step (server-side) feeding the same parse prompt. Provider swappable via env config (baseURL + API key + model id). |
| 5 | **Auth** | **JWT (stateless tokens)** | Mobile app + REST API → stateless is standard, no session storage. Resolves the "sessions vs tokens" marker in `ALCANCE.md`. |
| 6 | **File storage** | **Local disk on VM** | Receipt images stored as file paths (DB stays light). Already the design decision in `docs/ARCHITECTURE.md`. |
| 7 | **Deploy** | **VM + Docker Compose** | Separate containers: `api` + `postgres` (and optional Flutter web build). Matches the VM commitment; the mobile app is installed on phones, not deployed on the VM. |
| 8 | **Languages ("glue")** | Dart (UI) · Python 3.12 (API) · SQL (DB) · Docker/bash (tooling) | The languages that stitch the project together — no extra services. |

## Core rule (unchanged from architecture)

- AI parsing is **merged inside the backend** — the backend calls the LLM provider once per input.
- The user always confirms / edits / discards before anything is saved (ALCANCE.md Data Protection).
- Analytics are **plain SQL** — no AI involved in the dashboard.

## AI providers — interchangeable options

All expose OpenAI- and/or Anthropic-compatible endpoints, so swapping = changing a few env vars.
**Default: Google Gemini flash (free tier).** The others are documented, verified alternatives to use
if they work better in the construction phase (test each with a real receipt via curl before relying on it).

| Provider | Endpoint (OpenAI-compat) | Vision | Cost | Notes |
|---|---|---|---|---|
| **Google Gemini flash** *(default)* | Google Generative Language API (native SDK) | ✅ vision | **Free tier** | Verified in PGC 9.9 pricing refs. Reads receipt photos in one call. |
| **OpenCode Go** | `https://opencode.ai/zen/go/v1/chat/completions` | ⚠️ not documented (coding/text models) | $5 first mo, then $10/mo | API key verified in docs. Plan = "open coding models". Test image support in construction; if rejected, fall back to Gemini. |
| **Command Code Provider API (GOAT+)** | `https://api.commandcode.ai/provider/v1/chat/completions` | ✅ "Text and images" (official FAQ) | $15/mo min (Provider), or GOAT/Pro/Max plans | Go plan has NO API access (403) — need GOAT or higher. Zero-data-retention header `x-cmd-zdr: 1` available (good for receipts). |
| OpenCode Zen *(related, same family)* | `https://opencode.ai/zen/v1/chat/completions` | ✅ Gemini/GPT/Claude | pay-as-you-go | The gateway behind Go; documented vision models here. |

> Dev AI (opencode / commandcode / gemini CLI) is a **team development tool** — it does not go in the
> PGC and is unrelated to the product AI above.

## How the stack maps to the PGC

- **Title promise kept:** "asistencia de IA para la captura automática de recibos" — the Flutter app
  uploads the photo, FastAPI calls the LLM (vision) once, returns structured JSON, user confirms.
- **Metodología CDIO + Scrum:** Concebir/Diseñar (weeks 1–7) → Implementar (weeks 8–11, Scrum sprints)
  → Operar (weeks 12–16, pruebas funcionales + encuesta de usabilidad con estudiantes UdeC).
- **Justificación (viabilidad):** "herramientas de bajo costo y servicios con niveles gratuitos o
  cuotas de prueba" — Gemini free tier + VM free tiers (Oracle/AWS) keep costs near zero.

## Still pending

- Professor confirmation of the interface / project type (resolves at semester start).
- Price source (Phase 3 optional feature) — only if Phase 3 is built.
