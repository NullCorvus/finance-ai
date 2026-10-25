# Project Context — Finance AI Tracker

> **Historical context:** the Academic, Vision and Constraints sections below record the
> pre-semester planning position. "No code yet" and undecided stack were true of that period,
> not of the current workspace. The implemented Flutter and FastAPI repositories are separate;
> see `docs/ARCHITECTURE.md` and `docs/STACK.md` for the verified `origin/develop` snapshot.

## Academic
- **Course:** Ingeniería de Software II
- **University:** Universidad de Cundinamarca
- **Phase at creation:** Pre-semester planning
- **Status at creation:** No code yet. The professor could change stack, scope, or requirements once the semester started. This was advance preparation only.
- **Language:** English (code, docs, and communication)

## Vision
Natural language input (photo/audio/text) → AI translates to structured data → DB → AI answers queries via tool/function calling → graphs + analysis

This was the original vision. The current core has assisted text and receipt proposals with user
confirmation; Android speech recognition supplies text locally. AI chat, tool-based database
queries and autonomous agent behavior remain optional Phase 3 ideas, not implemented core.

The core value prop is making expense tracking as frictionless as possible: send a photo, say it, or type it — and the AI handles the rest.

## Constraints
- This is a university project, not a production app
- Stack and interface will be decided with the team and professor once the semester starts
- The architecture must be interface-agnostic (core separation from presentation layer)
- At the time of this planning record, all features and decisions were proposals; current
  implementation status is documented separately in `docs/ARCHITECTURE.md` and `docs/STACK.md`.
