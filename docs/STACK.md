# Stack — Finance AI Tracker

> **Original status:** PROPOSAL — Flutter and the stack were proposed for professor/team
> confirmation at semester start. This record addressed TASKS.md **Step 2** and several
> **Step 8** items; it is not evidence of academic approval. Original decisions source:
> `docs/ALCANCE.md`, `docs/ARCHITECTURE.md`, `TASKS.md` Step 2, `guia_paso_a_paso.md`.

> **Lectura actual (2026-10-20):** la tabla conserva el razonamiento del PGC y actualiza las
> decisiones técnicas verificadas. La sección «Implementación verificada» fija las ramas consultadas.

## Decisions

| # | Layer | Decision | Rationale |
|---|---|---|---|
| 1 | **Interface** | **Flutter (Dart)** | Mobile — matches the PGC title "aplicación móvil". One codebase → Android + iOS + web (web build = free demo fallback). Hot reload → fast iteration for a 16-week prototype. Strong AI-assistant codegen support. |
| 2 | **Backend** | **Python + FastAPI** | Team already knows Python → zero language ramp-up. Modular JSON API with OpenAPI docs. Receipt capture may call more than one configured provider during retries or fallback. |
| 3 | **Database** | **PostgreSQL** | The original VM design used `docs/schema.sql`; the implemented schema is maintained through SQLAlchemy models and Alembic migrations. Local Compose runs PostgreSQL. |
| 4 | **Product AI** | **Backend gateways for Gemini and DeepSeek** | Text and receipt-photo capture return proposals for user review. Android speech recognition produces text locally; the backend does not receive audio for transcription. The manual form bypasses AI. |
| 5 | **Auth** | **Opaque, renewable, database-backed credentials** | The previous JWT decision was superseded. Access credentials are held in Flutter memory; renewable credentials use secure storage. The backend rotates and revokes sessions. |
| 6 | **File storage** | **Device-local confirmed receipt photo** | The backend processes uploaded images in memory and persists structured proposals, not durable server image files. The confirmed photo is encrypted in the app's local documents on `origin/develop`. Remote media storage remains a separate design concern. |
| 7 | **Deploy** | **Docker Compose for local development; Cloud Run deployment workflow** | Compose runs the API with PostgreSQL locally. The backend repository also defines a Cloud Run deployment workflow; its presence does not prove a particular deployment is live. The original VM plan remains an academic design decision. |
| 8 | **Languages ("glue")** | Dart (UI) · Python 3.14 (API) · SQL (DB) · Docker/bash (tooling) | Verified from backend `pyproject.toml` and Dockerfile; frontend `pubspec.yaml` constrains Dart to `>=3.13.2 <3.14.0`. |

## Planned staff portal stack (2026-11-04)

The Support Agent extension adds a planned **React + Vite + TypeScript + Tailwind CSS**
application at `staff-web/` inside the existing Maicol2363/finance-ai-frontend repository.
Its package.json and vite.config.ts will be independent of the Flutter toolchain.
Flutter's existing `web/` remains its web runner; it is not the React application directory.
Customer support remains in Flutter, under `lib/features/support/` and Settings → Help & Support.

Reuse the existing FastAPI backend, PostgreSQL and opaque session architecture, extending
staff authentication and server-side role/resource authorization as necessary. Do not introduce
a separate backend/database or assume JWTs. Staff browser-session storage/CSRF/CORS details,
dependency versions/lockfile, portal CI and hosting belong to later implementation design.
The staff shell can serve future staff interfaces; this task only documents Support Agent.
No React application, packages or implementation directories are created by this change.

See [Support Agent requirements](../aidlc-docs/inception/requirements/support-agent-role.md)
and the [team reading guide](../aidlc-docs/README.md). Existing stack evidence above remains
the historical implemented snapshot; this section is an approved plan, not a deployment report.

## Planned Administrator and shared security scope (2026-11-07)

Extend the same planned React + Vite + TypeScript + Tailwind CSS staff application with
`staff-web/src/features/admin/`, reusing `features/auth/`, `app/` and `shared/`. Reserve
`features/audit/` for future authorized read-only Auditor work; no Auditor UI is implemented here.
The customer remains in Flutter and the portal remains outside Flutter's `web/` runner.

SEC-01 adds approved password-plus-TOTP requirements to existing opaque sessions: verified
enrollment, replay/rate-limit controls, recovery/replacement, invalidation and MFA gating for
every ADM request. Web login compatibility, browser credential protection and concrete lifetimes
are technical design responsibilities. SEC-02 uses existing PostgreSQL for shared security events,
including staff.created/staff.activated and safe audit access/failure handling. No new provider,
dependency version, key-management service, deployment topology or infrastructure is selected here.

Administrator provisioning is a controlled backend procedure, not a portal role-selection feature.
No fifth role, billing, private financial access or general-purpose internal notes is added.
The [Administrator](../aidlc-docs/inception/requirements/administrator-role.md) and
[shared security](../aidlc-docs/inception/requirements/shared-security-requirements.md)
specifications describe approved planned requirements; existing runtime evidence remains a separate
snapshot. New ADM/SEC implementation status is Not started until verified.

## Core rule (unchanged from architecture)

- AI extraction is part of the backend; provider retries and fallback mean the number of external
  calls can exceed one for an input.
- Proposals may be persisted temporarily, but no financial operation is saved before the user
  confirms. The user can edit or discard the proposal.
- Analytics are **plain SQL** — no AI involved in the dashboard.

## AI providers — interchangeable options

The following table records **historical provider options and price assumptions**, not the active
integration or a current price list. The implementation configures Gemini by default and DeepSeek
as an alternative. Text and receipt gateways attempt another configured provider when the selected
one fails; availability depends on configured keys and the gateway's retry budget.

| Provider | Endpoint (OpenAI-compat) | Vision | Cost | Notes |
|---|---|---|---|---|
| **Google Gemini flash** *(original default)* | Google Generative Language API (native SDK) | ✅ vision | **Free tier** | Original PGC pricing reference and one-call estimate; current gateway retries or fallback can make more than one request. |
| **OpenCode Go** | `https://opencode.ai/zen/go/v1/chat/completions` | ⚠️ not documented (coding/text models) | $5 first mo, then $10/mo | API key verified in docs. Plan = "open coding models". Test image support in construction; if rejected, fall back to Gemini. |
| **Command Code Provider API (GOAT+)** | `https://api.commandcode.ai/provider/v1/chat/completions` | ✅ "Text and images" (official FAQ) | $15/mo min (Provider), or GOAT/Pro/Max plans | Go plan has NO API access (403) — need GOAT or higher. Zero-data-retention header `x-cmd-zdr: 1` available (good for receipts). |
| OpenCode Zen *(related, same family)* | `https://opencode.ai/zen/v1/chat/completions` | ✅ Gemini/GPT/Claude | pay-as-you-go | The gateway behind Go; documented vision models here. |

> Dev AI (opencode / commandcode / gemini CLI) is a **team development tool** — it does not go in the
> PGC and is unrelated to the product AI above.

## How the stack maps to the PGC

- **Title promise kept:** "asistencia de IA para la captura automática de recibos" — the Flutter app
  uploads the photo, FastAPI requests structured extraction and the user confirms. The original
  one-call estimate is historical; the implementation can retry or use a configured fallback.
- **Metodología CDIO + Scrum:** Concebir/Diseñar (weeks 1–7) → Implementar (weeks 8–11, Scrum sprints)
  → Operar (weeks 12–16, pruebas funcionales + encuesta de usabilidad con estudiantes UdeC).
- **Justificación original (viabilidad):** "herramientas de bajo costo y servicios con niveles
  gratuitos o cuotas de prueba" — Gemini and VM free-tier assumptions belonged to the academic
  plan; they do not establish current provider pricing or production hosting cost.

## Still pending

- Professor confirmation of the interface / project type (resolves at semester start).
- Price source (Phase 3 optional feature) — only if Phase 3 is built.

## Implementación verificada

Source snapshot: backend `origin/develop` `1fae699`, frontend `origin/develop` `a23a8a6`.
The backend is one modular FastAPI application with `/api/v1` routers, services, SQLAlchemy
repositories and units of work. Its declared dependencies include FastAPI `>=0.140,<0.141` and
SQLAlchemy `>=2.0.45,<2.1`; local Compose uses PostgreSQL `18.6-bookworm`. The deployment workflow
targets Cloud Run, while local development uses Compose. These are distinct environments.

Code evidence: `finance-ai-backend/src/finance_ai/api/router.py`,
`finance-ai-backend/src/finance_ai/auth/session_service.py`,
`finance-ai-backend/src/finance_ai/core/config.py`,
`finance-ai-backend/src/finance_ai/capture/gateway.py`,
`finance-ai-backend/src/finance_ai/receipts/gateway.py`,
`finance-ai-backend/pyproject.toml`, `finance-ai-backend/compose.yaml`,
`finance-ai-backend/.github/workflows/deploy.yml`,
`finance-ai-frontend/lib/features/receipt_capture/data/receipt_photo_cache_repository.dart`.
