# STUDENT OPERATION GUIDE — Project with AI-DLC

## What is this for?

This is not just a references document. It is **your operation manual** as a student on a project where AI generates code. It tells you exactly what to do, what to decide yourself, and what to leave to the AI — phase by phase.

---

## The fundamental principle

> *"When AI writes code for you, your primary job becomes understanding what that code is doing, evaluating whether it's correct, and spotting subtle bugs or inefficiencies the model misses."*
> — The 2026 CS Playbook

**In plain words:** Now that AI writes the code, your job has shifted from "writing lines" to "designing, specifying, and reviewing." It's not easier — it's different.

---

## PHASE 0: BEFORE STARTING — What YOU must do alone, without AI

Before opening any code agent, sit down with paper or Excalidraw and design:

### 📐 Database (you decide, AI writes)

Draw the entity-relationship diagram **yourself**. Define:

- What tables exist?
- What columns does each one have?
- What are the foreign keys?
- Which fields are required vs optional?
- What indexes do you need?

**Rule:** If you can't draw the schema on a napkin, you don't understand it. The AI can write the `CREATE TABLE`. You decide the relationships, constraints, and indexes.

### 📐 User flow (you decide, AI implements)

Define:

- User uploads a photo → what happens step by step?
- User chats with the AI → how does it respond?
- What happens if the AI doesn't understand the receipt?

### 📐 Tech stack (you research, AI configures)

Choose consciously:
- Django or FastAPI?
- PostgreSQL or SQLite?
- React, vanilla HTML, or mobile?
- OpenAI, Claude, or local?

**Your decision.** Don't ask the AI "what stack should we use." Tell it: "We're going to use Django + PostgreSQL + OpenAI. Generate the configuration."

---

## PHASE 1: INCEPTION — Specify, don't code

### What YOU do (student):

| Activity | What you DON'T do | What you DO do |
|---|---|---|
| Requirements | Don't ask the AI "design the system" | Open the chat and say: *"Using AI-DLC, I want a system where the user uploads a receipt photo, the AI extracts {amount, date, merchant, category}, and saves it to PostgreSQL with Django"* |
| Schema | Don't let the AI invent the tables | Draw the ER diagram → tell the AI: *"Here is my schema. Generate the Django models with validation and the migration."* |
| Work plan | Don't accept the first thing it proposes | Review the plan AI-DLC generates. Are all units there? Is anything missing? Anything extra? **Approve or adjust.** |

### Questions AI-DLC will ask you (and how to respond):

| AI-DLC asks | What it expects from you |
|---|---|
| "What do you want to build?" | A clear description with scope: *"A system where..."* |
| "Who are the users?" | *"Just me"* or *"Multiple users with login"* — this changes EVERYTHING in the design |
| "What fields does a receipt have?" | You already defined them in your schema. Answer with confidence. |
| "How complex is it?" | Be honest: *"Simple feature: just upload photo and save"* or *"Complex feature: needs authentication, multiple roles, reports"* |

### Output of this phase:

AI-DLC generates an `aidlc-docs/` with:
- Detailed work plan
- Work units (each unit = something the AI will generate later)
- Application design

**You review and say APPROVE or REJECT.**

---

## PHASE 2: CONSTRUCTION — AI generates, you review

### Loop for each work unit:

```
┌─────────────────────────────────────────────────┐
│ 1. AI generates code + tests                     │
│    (You: NOT writing, just waiting)              │
├─────────────────────────────────────────────────┤
│ 2. AI compiles and runs tests                    │
│    (You: NOT debugging, AI does it)              │
├─────────────────────────────────────────────────┤
│ 3. YOU REVIEW                                    │
│    └── Does the code do what the spec promised?  │
│    └── Any security vulnerabilities?             │
│    └── Do variable names make sense?             │
│    └── Any errors the AI missed?                 │
│    └── Is performance acceptable?                │
│                                                  │
│    ✅ APPROVE → move to next unit                 │
│    ❌ REJECT → AI fixes it, back to step 1       │
└─────────────────────────────────────────────────┘
```

### Review checklist for EACH unit:

```
[ ] Does it do exactly what the spec says? (no more, no less)
[ ] Does it handle errors? (try/except, validations)
[ ] Is it secure? (SQL injection, auth, rate limiting)
[ ] Does it follow project style?
[ ] Do the tests actually test something?
[ ] Do you understand EVERY line? If not, ask the AI why it wrote it
```

### ⚠️ COMMON STUDENT MISTAKE:

> *"The AI generated the code and it works on my machine. Done."*

**NO.** You have to understand why it works. If the AI generated something you don't understand, ask it: *"Explain this line to me, I don't get it."* That's learning. Blindly accepting code is not learning.

---

## PHASE 3: OPERATIONS — Deployment

### What the AI does:
- Generates Dockerfile, docker-compose
- Generates CI/CD (GitHub Actions)
- Generates README, documentation

### What YOU do:
- Review every generated file
- Verify paths and environment variables are correct
- Run `docker compose up -d`
- Verify it works in production

---

## REFERENCES (to cite in your academic document)

| Source | Key quote | Link |
|---|---|---|
| Anthropic 2026 Report | *"engineers move from implementer to orchestrator of agent systems"* | anthropic.com/2026-agentic-coding-trends-report |
| CS Playbook 2026 | *"When AI writes code for you, your primary job becomes understanding what that code is doing"* | dev.to/naveens16/the-2026-computer-science-playbook |
| Pragmatic Engineer 2026 | *"Being a solid software engineer and not just a 'coder' will be more sought-after"* | pragmaticengineer.com |
| ACM 2026 | *"Coding is local behavior; architecture is system behavior"* | cacm.acm.org/news/the-end-of-the-coder |
| AWS AI-DLC 2025 | *"AI defers critical decisions to humans"* | aws.amazon.com/blogs/devops/ai-driven-development-life-cycle |

### For your Ing. Software II document, write:

> *"We adopted AI-DLC (AWS, 2025), a methodology where the team writes detailed specifications, the AI generates the implementation and tests, and humans review and approve each unit at quality gates. This shift from 'implementer' to 'orchestrator' is documented by Anthropic (2026) as the main trend in software engineering."*

---

## Practical conclusion

| What you are NOT (and that's fine) | What you ARE |
|---|---|
| A code typist | A system designer |
| Someone who memorizes syntax | Someone who understands architecture |
| A prompt engineer | An engineer who uses AI as a tool |
| Someone who blindly accepts code | Someone who reviews, questions, and improves |

> *"The students who invest in fundamentals do not get replaced by AI — they become the people who know how to leverage AI to produce work that is dramatically beyond the reach of someone relying solely on tools."*
> — The 2026 CS Playbook

**Your Finance AI Tracker project is proof that you are that student.**
