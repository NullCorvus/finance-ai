# Finance AI Documentation Map

Use this page as the entry point. Current product decisions live in the documents below; completed workflow evidence is not product authority.

## Start Here

| Need | Document |
|---|---|
| Product vision and constraints | [`CONTEXT.md`](CONTEXT.md) |
| Included and deferred scope | [`ALCANCE.md`](ALCANCE.md) |
| User-story identifiers and status | [`BACKLOG-AND-STORIES.md`](BACKLOG-AND-STORIES.md) |
| Delivery order | [`SPRINT-PLAN.md`](SPRINT-PLAN.md) |
| Architecture and boundaries | [`ARCHITECTURE.md`](ARCHITECTURE.md) |
| Database decisions | [`SCHEMA.md`](SCHEMA.md) |
| dbdiagram.io draft | [`finance-ai-draft.dbml`](finance-ai-draft.dbml) |
| Repository ownership | [`REPOSITORIES.md`](REPOSITORIES.md) |
| Technology choices | [`STACK.md`](STACK.md) |
| Screen direction | [`MOCKUPS.md`](MOCKUPS.md) |
| High-level diagrams | [`UML.md`](UML.md) |

## Authority Rules

- Backend code, migrations, tests, and OpenAPI belong to `finance-ai-backend`.
- Flutter code and client tests belong to `finance-ai-frontend`.
- SQLAlchemy models plus Alembic migrations are the executable database authority.
- The DBML file is the approved future design draft, not an already-deployed schema.
- `aidlc-docs/construction/` contains detailed implementation evidence for completed stories.
- `aidlc-docs/` contains detailed requirements and per-story implementation/test evidence; its README explains what remains authoritative.

Generic Scrum training material, one-time diagram instructions, the superseded architecture planning worksheet, and the conflicting SQL design snapshot were removed because they duplicated or contradicted the current sources above.
