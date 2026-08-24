# Graph Report - finance-ai  (2026-08-23)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 37 nodes · 31 edges · 12 communities (5 shown, 7 thin omitted)
- Extraction: 81% EXTRACTED · 19% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ce724def`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Requirements Analysis
- Stack — Finance AI Tracker
- PGC Main Document
- Workflow Planning
- Mockups — Finance AI Tracker
- Adaptive Workflow Principle
- Inception Phase
- Construction Phase
- Operations Phase
- Scope — Finance AI Tracker
- Project Context — Finance AI Tracker
- PGC Propuesta — Borrador

## God Nodes (most connected - your core abstractions)
1. `Requirements Analysis` - 6 edges
2. `Stack — Finance AI Tracker` - 5 edges
3. `PGC Main Document` - 5 edges
4. `FastAPI Backend` - 4 edges
5. `PostgreSQL Database` - 3 edges
6. `Workflow Planning` - 3 edges
7. `Flutter App` - 2 edges
8. `LLM Provider` - 2 edges
9. `Architecture — Finance AI Tracker` - 2 edges
10. `PGC Document Template` - 2 edges

## Surprising Connections (you probably didn't know these)
- `PGC Main Document` --references--> `Faculty of Engineering Logo Text`  [INFERRED]
  latex/pgc/main_original.pdf → latex/pgc/assets/logo-facultad.jpg
- `PGC Main Document` --references--> `Green Gradient Footer Graphic`  [INFERRED]
  latex/pgc/main_original.pdf → latex/pgc/assets/logo-footer.png
- `PGC Main Document` --references--> `Universidad de Cundinamarca Institutional Logo`  [INFERRED]
  latex/pgc/main_original.pdf → latex/pgc/assets/logo-universidad.jpg
- `Requirements Analysis` --references--> `Resiliency Baseline Extension`  [EXTRACTED]
  AGENTS.md → .aidlc-rule-details/extensions/resiliency/baseline/resiliency-baseline.md
- `Requirements Analysis` --references--> `Security Baseline Extension`  [EXTRACTED]
  AGENTS.md → .aidlc-rule-details/extensions/security/baseline/security-baseline.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Institutional Branding Assets** — latex_pgc_assets_logo_facultad, latex_pgc_assets_logo_footer, latex_pgc_assets_logo_universidad [EXTRACTED 0.90]
- **AI-DLC Lifecycle Phases** — agents_inception_phase, agents_construction_phase, agents_operations_phase [EXTRACTED 1.00]
- **Finance AI Tracker Core System** — flutter_app, fastapi_backend, postgresql_db, llm_provider [EXTRACTED 1.00]
- **Mandatory Inception Stages** — agents_workspace_detection, agents_requirements_analysis, agents_workflow_planning [EXTRACTED 1.00]
- **Cross-Cutting Extensions** — aidlc_rule_details_extensions_security_baseline_security_baseline, aidlc_rule_details_extensions_resiliency_baseline_resiliency_baseline, aidlc_rule_details_extensions_testing_property_based_property_based_testing [INFERRED 0.85]

## Communities (12 total, 7 thin omitted)

### Community 0 - "Requirements Analysis"
Cohesion: 0.29
Nodes (7): Requirements Analysis, Reverse Engineering, User Stories, Workspace Detection, Resiliency Baseline Extension, Security Baseline Extension, Property-Based Testing Extension

### Community 1 - "Stack — Finance AI Tracker"
Cohesion: 0.43
Nodes (7): Architecture — Finance AI Tracker, Stack — Finance AI Tracker, Architecture Plan, FastAPI Backend, Flutter App, LLM Provider, PostgreSQL Database

### Community 2 - "PGC Main Document"
Cohesion: 0.40
Nodes (6): PGC Document Template, Faculty of Engineering Logo Text, Green Gradient Footer Graphic, Universidad de Cundinamarca Institutional Logo, PGC Main Document, PGC Format Reference

### Community 3 - "Workflow Planning"
Cohesion: 0.40
Nodes (5): Application Design, Build and Test, Code Generation, Units Generation, Workflow Planning

### Community 4 - "Mockups — Finance AI Tracker"
Cohesion: 0.67
Nodes (3): Features — Finance AI Tracker, Mockups — Finance AI Tracker, Database Schema — Finance AI Tracker

## Knowledge Gaps
- **21 isolated node(s):** `Architecture Plan`, `Project Context — Finance AI Tracker`, `PGC Propuesta — Borrador`, `Faculty of Engineering Logo Text`, `Green Gradient Footer Graphic` (+16 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Requirements Analysis` connect `Requirements Analysis` to `Workflow Planning`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **Why does `Workflow Planning` connect `Workflow Planning` to `Requirements Analysis`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `PGC Main Document` (e.g. with `PGC Document Template` and `Faculty of Engineering Logo Text`) actually correct?**
  _`PGC Main Document` has 5 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Architecture Plan`, `Project Context — Finance AI Tracker`, `PGC Propuesta — Borrador` to the rest of the system?**
  _21 weakly-connected nodes found - possible documentation gaps or missing edges._