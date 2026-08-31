# Repository Ownership

Finance AI uses three private repositories with one responsibility each.

| Repository | Owns | Does not own |
|---|---|---|
| `finance-ai` | Product documentation, backlog, architecture, AI-DLC records, decisions, and cross-repository Compose orchestration | Application source code or language dependency locks |
| `finance-ai-backend` | FastAPI application, persistence, migrations, seeds, OpenAPI contract, backend infrastructure, and backend CI | Flutter UI or product-planning authority |
| `finance-ai-frontend` | Flutter application shared by Android and Windows, client diagnostics/storage, platform runners, and frontend CI | Server persistence or product-planning authority |

## Change rules

1. Product behavior and acceptance criteria are decided in `finance-ai`.
2. API behavior is implemented and versioned in `finance-ai-backend/openapi.json`.
3. The frontend consumes the published API contract and must not reproduce backend business rules as an independent authority.
4. A change spanning repositories uses linked issues or pull requests and lands in dependency order: documentation/decision when needed, backend contract, then frontend integration.
5. Each code repository runs its own quality gates. The hub's integration profile is the final cross-repository check.
6. Historical AI-DLC construction records may mention the former `backend/` and `frontend/` monorepo paths. Those paths describe the layout at the time; new work uses the standalone repository roots.

## Local checkout

The supported default is:

```text
Finance App/
├── finance-ai/
├── finance-ai-backend/
└── finance-ai-frontend/
```

Alternative paths can be configured in the hub's `.env` through `FINANCE_AI_BACKEND_PATH` and `FINANCE_AI_FRONTEND_PATH`.
