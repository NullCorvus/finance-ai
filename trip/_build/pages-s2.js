PAGES.q2_1 = {
  intro: "The backend is the core of the stack: it serves the REST/JSON API, talks to the AI provider, stores files, and powers the chat. This page compares Django and FastAPI against your project's actual constraints — an API-first architecture, AI calls that spend time waiting on external services, and a demo where the professor should be able to try every endpoint. It ends with the three questions that decide the pick.",
  sections: [
    { h: "What each framework gives you",
      b: "Django is batteries-included: an admin panel (a free CRUD UI, useful for seeding and inspecting demo data), an ORM with migrations (makemigrations/migrate), built-in authentication, and templates. It is sync-first (WSGI); async support exists but is not its core. FastAPI is async-native, ships Pydantic validation, and auto-generates OpenAPI documentation with Swagger UI — a built-in demo asset: the professor can try every endpoint from the browser without reading your code. For the database layer FastAPI pairs with SQLModel (SQLAlchemy plus Pydantic, same author), and you assemble auth yourself (bcrypt with sessions or JWT — see q3_1).\n\nBoth handle your 11-table schema (docs/SCHEMA.md) without difficulty; the differences are in workflow and demo surface, not in capacity." },
    { h: "What the data says",
      b: "Per the JetBrains 2025 survey, FastAPI is the most popular Python framework (38% versus Django 35% and Flask 34%). That popularity reflects async adoption and API-first development across the industry. But popularity is not fit: for a one-semester project, existing team knowledge beats any ranking — a framework the team already understands produces better-reviewed code than a more popular one being learned from scratch.\n\nThe 2025 comparison articles (linked below) converge on the same nuance: Django wins when you want the batteries (admin, auth, ORM) and a classic server-rendered app; FastAPI wins when the product is an API consumed by another frontend — which is exactly your architecture.\n\nA final note on the ranking: the gap between the leaders is small, so the survey should confirm a leaning, never dictate it. For a project where every line is reviewed (q1_4), the framework the AI can write is irrelevant — the framework you can read is what matters, and both produce readable code once you know them." },
    { h: "Decisive factors for THIS project",
      b: "Three facts tip the scale for this project. First, your architecture is API-first: REST/JSON between Client and API (docs/ARCHITECTURE.md), which is FastAPI's native shape. Second, the AI agent spends time waiting on external APIs — receipt extraction, chat completions — and async fits that waiting naturally; Django makes you add async machinery for the same benefit. Third, the demo: auto-generated Swagger docs let the professor exercise every endpoint live, which is free demo value.\n\nThe counter-argument is Django's admin panel: if you want a free back-office to inspect expenses during the demo, Django gives it to you, while FastAPI requires you to build a small admin surface yourself. Either choice is defensible; the deciding questions below are about your team and your comfort, not about raw framework power.\n\nA practical tiebreaker: whichever you pick, keep the API layer thin — controllers that call the AI agent and the ORM, nothing more. A thin layer is the easiest to review, which is the project's real constraint." },
    { h: "Common pitfalls",
      b: "Picking by popularity alone — the JetBrains numbers describe the industry, not your semester. Ignoring async comfort: FastAPI makes you live with async/await; Django lets you ignore it, which is a real advantage if async is new to the team. Assuming Django's admin is free in FastAPI — it is not; you would add django-admin or build a minimal admin UI. And skipping the demo angle: Swagger UI and the admin panel are both demo assets, and the choice between them is a demo decision as much as a technical one." },
    { h: "What a good answer includes",
      b: "Your answer names the pick plus one concrete reason tied to this project — for example 'FastAPI, because async fits waiting on the AI, and the API-first design matches ARCHITECTURE.md'. Then note the two context facts: whether the team already knows one framework, and how comfortable you are with async/await in Python.\n\nThat is enough to fill one row of the STACK.md decision matrix (TASKS.md Step 8). One reason, honestly argued, beats three reasons copied from a blog post." }
  ],
  sub: [
    { q: "Do you want the free admin UI (Django) or auto API docs + Swagger (FastAPI)?", info: "You can have Swagger in FastAPI for free; Django admin requires the full framework." },
    { q: "Does your team know one of them already?", info: "Existing team knowledge beats popularity rankings for a 1-semester project." },
    { q: "How comfortable are you with async/await in Python?", info: "FastAPI makes you live with async; Django lets you ignore it." }
  ],
  links: [
    "JetBrains: most popular Python frameworks 2025 — https://blog.jetbrains.com/pycharm/2025/09/the-most-popular-python-frameworks-and-libraries-in-2025-2/",
    "FastAPI SQL databases tutorial (SQLModel) — https://fastapi.tiangolo.com/tutorial/sql-databases/",
    "FastAPI vs Django 2025 — https://railsfactory.com/blog/django-vs-fastapi-python-framework-comparison/",
    "docs/ARCHITECTURE.md — API-first layer diagram (repo)"
  ]
};
PAGES.q2_2 = {
  intro: "The database choice looks technical but is really a demo-reliability decision: how much setup can the grading machine absorb, and how much data will this project actually hold? This page compares SQLite and PostgreSQL against your real constraints — a one-to-two user demo, your PostgreSQL-flavored schema.sql, and a backup procedure you can trust. The recommended default is SQLite for the demo with a portable schema, and this page explains why.",
  sections: [
    { h: "What each database really is",
      b: "SQLite is a single file with zero configuration: no server, no install, no credentials. WAL mode (PRAGMA journal_mode=WAL) lets readers and a writer coexist, which is plenty for 1-2 users and thousands of rows. The whole database is one file you can copy to the grading machine — the classic 'the DB is the backup' property. PostgreSQL is a server-grade database (Docker or a native install) with richer types — JSONB, arrays, full-text search — but every one of those features is a moving part on demo day: if the grading machine lacks Docker, PostgreSQL is a setup risk before the demo even starts.\n\nCommunity consensus for small apps is consistent: SQLite first; move to PostgreSQL when you need concurrency or production features. This project needs neither.\n\nA useful framing: PostgreSQL is a product you must run and maintain; SQLite is a file you carry. For a demo that must survive a grading machine you do not control, carrying the file is the lower-risk posture." },
    { h: "Porting your schema",
      b: "Your docs/schema.sql is PostgreSQL-flavored (the TASKS.md Step 3 deliverable), but the porting notes to SQLite are small and mechanical: SERIAL becomes INTEGER PRIMARY KEY AUTOINCREMENT; TIMESTAMPTZ becomes TEXT (ISO-8601) or REAL epoch seconds; ENUM types become TEXT plus a CHECK constraint; BOOLEAN stays. With SQLAlchemy or the Django ORM the switch is mostly configuration plus a migration, which means the decision is reversible: you can demo on SQLite and move to PostgreSQL later without redesigning anything.\n\nKeeping the schema portable is the single most valuable habit here: it turns a binary decision into a preference." },
    { h: "Backing up SQLite safely (the WAL caveat)",
      b: "SQLite in WAL mode writes to a sidecar file (the -wal file), and a plain file copy while a writer is active can produce an inconsistent or incomplete database. Before copying the SQLite file, run PRAGMA wal_checkpoint; — this merges the WAL content into the main database file so the copy is complete — or use the .backup command (sqlite3 source.db '.backup target.db'), which produces a consistent snapshot even with a live writer. For a demo, checkpoint-then-copy is the simple reliable path; make it part of your export routine.\n\nThis matters on grading day: the professor may want a copy of the database, and an unchecked copy is the kind of failure that looks like data loss but is really a WAL artifact.\n\nTwo extra details: the .backup command also works while other connections are writing, and VACUUM INTO 'target.db' produces a compact consistent copy as a third option. Any of the three beats a raw cp of a live WAL database, and all three are worth one test run at home before the trip ends." },
    { h: "Common pitfalls",
      b: "Assuming the grading machine has Docker — check first; if it does, PostgreSQL is safe, and if it does not, SQLite is the resilient choice. Choosing PostgreSQL for 'production-grade' without needing JSONB, arrays, or full-text search — unused power is unused complexity for a demo. Copying the SQLite file mid-write without a checkpoint. And locking the schema to PostgreSQL syntax so tightly that the switch becomes a rewrite instead of a migration — keep the schema portable and the decision stays reversible." },
    { h: "What a good answer includes",
      b: "Your answer should contain: the pick (SQLite for the demo, PostgreSQL one config change away); the data-volume estimate — even 5,000 expenses in a semester is trivial for SQLite; whether the grading machine has Docker; and the backup procedure you will use (wal_checkpoint then copy, or the .backup command).\n\nThis resolves the 'candidate: PostgreSQL' TBD in the data layer of docs/ARCHITECTURE.md and becomes one row of the STACK.md matrix." }
  ],
  sub: [
    { q: "Will the grading machine have Docker installed?", info: "If yes, PG is safe; if no, SQLite is the resilient choice." },
    { q: "Estimate the data volume: how many expenses in a semester?", info: "Even 5,000 rows is trivial for SQLite." },
    { q: "Do you need JSONB, full-text search, or array types?", info: "If no, PostgreSQL's extra power is unused complexity for this project." }
  ],
  links: [
    "SQLite WAL mode — official docs — https://sqlite.org/wal.html",
    "SQLite backup API / .backup command — https://www.sqlite.org/backup.html",
    "SQLite vs MySQL vs PostgreSQL — https://logz.io/blog/relational-database-comparison/",
    "docs/SCHEMA.md — the 11-table ER diagram (repo)"
  ]
};
PAGES.q2_3 = {
  intro: "The frontend decision is a review-surface decision: every framework you add is code you must understand line by line (REFERENCES.md). This page compares plain HTML+JS, React, and the Telegram Mini App path against the actual UI of this project — forms, tables, charts, and a chat — and concludes that vanilla is the low-risk default unless you identify genuinely complex state. The three sub-questions at the end confirm whether that applies to you.",
  sections: [
    { h: "The three frontends, honestly compared",
      b: "Plain HTML+JS: no build step, no node_modules, every line readable; charts via Chart.js (roughly 70-90KB gzipped, from a CDN or a local file — offline-friendly); state handled by you, which is fine at this scale. React: components and state plus a Vite build and npm — more power for complex UIs, but every config file and hook is review surface, and React itself is roughly 45KB of bundle you did not write. Telegram Mini App: the frontend shrinks to small embedded web views — the bot's buttons and inline keyboards are the UI shell, and the pages are plain HTML/JS anyway; production Mini Apps must be served over HTTPS, but development works on localhost or Telegram's dev tools.\n\nNote the pattern: even the Mini App path is plain HTML/JS underneath. The framework question really only exists between vanilla and React.\n\nOne more comparison point: ecosystem and hiring arguments do not apply to a semester project. React's job-market relevance is real, but it is a career argument, not a demo argument — the professor grades this project, not your resume." },
    { h: "The decision rule from your own constraints",
      b: "Your scope (docs/FEATURES.md) is upload screens, review/confirmation, a dashboard with graphs and tables, and a chat — forms, tables, and charts. None of these need complex state. The honest decision rule: if the UI is mostly forms, tables, and charts, vanilla is enough and review stays real. Reach for React only if you identify genuinely complex state — drag-and-drop, real-time multi-user updates, complex optimistic UI — and none of those are in the scope docs.\n\nThis is the same reasoning as q1_4 applied to the frontend: choose the surface you can OWN." },
    { h: "Charts: the one library decision that matters",
      b: "The demo's 'wow' moment is the AI answering with a chart, so the charting library deserves a deliberate choice. Chart.js is the lightweight default: simple, popular, offline-capable as a local file, and well documented — enough for category breakdowns and time trends. ECharts is more powerful and bigger; reach for it only if you need advanced interactions the demo does not require.\n\nThe rule of thumb: the chart library should be the smallest thing that renders the two demo charts — spending by category, trend over time — which is feature 7 (AI-generated graphs) on the dashboard, feature 8.\n\nIf the Telegram Mini App wins, the same Chart.js file works inside the embedded web view, so the chart decision is interface-independent: one library choice, not three." },
    { h: "Common pitfalls",
      b: "Adding npm and build tooling without a feature that needs it — every config file is review surface, and the professor does not grade your webpack setup. Confusing 'learning React' with 'progress on the project': it is a valid choice, but it is learning time taken from reviewing your own project. Forgetting the Mini App HTTPS requirement if Telegram wins — production Mini Apps must be served over HTTPS, so plan the deploy accordingly (q2_5). And picking a heavy chart library that bloats the single offline file — size matters when the tool must work without internet." },
    { h: "What a good answer includes",
      b: "Your answer names the pick (plain HTML+JS, React, or none — the Mini App path), lists the UI features that actually need state (if they are forms, filters, and charts only, vanilla territory applies), and names the charting library with a one-line reason.\n\nAdd a note on whether you want to learn npm and build tools this semester, and — if Telegram wins — confirm you understand the HTTPS requirement for production. This decides the Client container implementation in the architecture." }
  ],
  sub: [
    { q: "List the UI features that need 'complex state' — forms, filters, charts only?", info: "Forms + charts = vanilla territory. Real-time multi-user = React territory." },
    { q: "Do you want to learn npm + build tools this semester?", info: "A valid choice — but it is learning time taken from reviewing your own project." },
    { q: "Which charting library fits? Chart.js is the lightweight default.", info: "Chart.js: simple, popular, offline-capable. ECharts: more powerful, bigger." }
  ],
  links: [
    "Chart.js — https://www.chartjs.org/",
    "JavaScript chart libraries 2026 comparison — https://www.usedatabrain.com/blog/javascript-chart-libraries",
    "Telegram Mini Apps — official docs — https://core.telegram.org/bots/webapps"
  ]
};
PAGES.q2_4 = {
  intro: "The AI provider is the highest-visibility decision in the stack: receipts need vision, voice notes need audio parsing, and you pay for usage through one shared key (docs/FEATURES.md, feature 0b). This page gives you the current 2026 pricing and accuracy facts for OpenAI, Claude, and local models, plus the safety-net reasoning that matters more than the brand. The conclusion is usually cloud — at under a cent per receipt — but the privacy question is yours to answer.",
  sections: [
    { h: "2026 pricing: the actual numbers",
      b: "Current API pricing: GPT-5.4 runs about $2.50 per 1M input tokens and Claude Sonnet 4.6 about $3 per 1M input tokens; both charge about $15 per 1M output tokens, and both offer roughly 90% discounts on cached input. The older GPT-5 was $1.25 input / $10 output — a reminder that prices and model names change yearly, which is exactly what q2_7 is for. Do the semester math: 200 receipts at under a cent each is $1-2, and 50 voice notes cost a few cents. The API bill is a rounding error; your time is the real budget." },
    { h: "Vision accuracy on receipts",
      b: "Third-party 2026 tests (codesota) report OCR edit distance of 0.02-0.03 and hallucination rates of 0.09-0.15% on their test set (Thai-script accuracy 92-94%) for current GPT and Claude vision models — for receipts, both providers are in the same class. The accuracy number matters less than the loop around it: your design already has the confirm/edit/discard preview (docs/ALCANCE.md), so every extraction is reviewed by the user before it touches the database. That safety net absorbs residual errors, blurry receipts, and unusual store formats.\n\nThis is the key insight: provider choice tunes the error rate from 'sometimes wrong' to 'rarely wrong', but the confirm loop is what makes the product trustworthy.\n\nThe codesota results also show the accuracy gap between the two leaders is small enough that the brand matters less than the loop: pick the provider whose docs you like and whose key you can fund, and let the confirm/edit/discard step absorb the residual errors." },
    { h: "Audio: transcription options",
      b: "For voice notes, the OpenAI audio lineup: Whisper (legacy) at about $0.006 per minute with a 25MB file cap — webm files are fine, so your voice notes fit; GPT-4o Transcribe at $0.006 per minute; and GPT Transcribe at $0.0045 per minute, which is OpenAI's current default and the cheapest of the three (gpt-4o-mini-transcribe is $0.003/min if you want cheaper still). Whisper-first is the simple, cheap path and integrates with any provider stack; letting a multimodal model parse the short audio directly is fewer moving parts but newer.\n\nEither way, keep clips under two minutes and start by saying the question id — the trip guide's own advice, and it makes transcription far more reliable.\n\nIf a voice note is misheard, the same confirm/edit loop catches the error before saving — the safety net that protects receipts protects voice notes too." },
    { h: "Local models: when they make sense",
      b: "Local options — Llama-3.2-11B-Vision, Qwen2.5-VL-7B, Qwen3-VL — are free, private, and offline-capable, but they need roughly 8-16GB of VRAM (quantized) and are noticeably weaker on messy receipts. They are the right answer when privacy is a real constraint (receipt photos contain personal data) or when the demo must work with zero network. Otherwise the shared cloud key is the pragmatic pick: sub-cent per photo, best-documented SDKs, and the shared-key design (feature 0b) already assumes one backend key." },
    { h: "Common pitfalls",
      b: "Optimizing price when cost is a rounding error — reliability and documentation matter more at this scale. Using stale numbers: model names and prices from last semester are already outdated; write the verification URLs down now (q2_7). No fallback if the key fails: pre-seed demo data so charts work offline (q1_3). And skipping the privacy conversation: decide consciously whether receipts may go to a cloud API; 'I did not think about it' is the only wrong answer." },
    { h: "What a good answer includes",
      b: "Your answer ranks the options by four criteria from the question bank: receipt accuracy, audio parsing, cost for a semester, and shared-key setup — then names the pick and one reason. Add your monthly API budget (even $5 covers a semester), your privacy stance on cloud APIs, and your audio plan (Whisper-first or direct multimodal).\n\nThis sets feature 0b and becomes one row of the STACK.md matrix." }
  ],
  sub: [
    { q: "What is your monthly API budget? Even $5 covers a semester of receipts.", info: "At <$0.01/receipt, budget is rarely the constraint — reliability is." },
    { q: "Any privacy concern with sending receipt photos to a cloud API?", info: "If yes, local models become attractive despite lower accuracy; if no, cloud is the pragmatic pick." },
    { q: "Audio plan: transcribe with Whisper first, or let a multimodal model parse the voice note directly?", info: "Whisper-first is simpler and cheap; direct multimodal parsing is fewer moving parts but newer." }
  ],
  links: [
    "GPT-5 vs Claude Sonnet 4.6 comparison — https://www.llmreference.com/compare/claude-sonnet-4-6/gpt-5",
    "GPT-5.4 vs Claude Sonnet 4.6 pricing/benchmarks — https://tokenmix.ai/blog/gpt-5-4-vs-claude-sonnet-4-6",
    "Whisper transcription pricing — https://costgoat.com/pricing/openai-transcription",
    "Claude vs GPT OCR comparison 2026 — https://codesota.com/ocr/claude-vs-gpt4o-ocr"
  ]
};
PAGES.q2_5 = {
  intro: "Deployment decides how the demo starts: one command or a fragile manual setup on a machine you do not control. This page compares Docker on your laptop, a cloud VM, and manual setup, and walks through the fallback plan if the grading machine lacks Docker. The default is Docker with a written fallback, because the professor's first impression is the command that makes your project run.",
  sections: [
    { h: "What Docker actually gives you",
      b: "Docker packages the app and the database into containers: a Dockerfile is the recipe, and docker-compose orchestrates several containers with one command — docker compose up. Volumes persist data across container restarts, which is critical for the SQLite file and uploaded receipts: a container without a volume loses everything on rebuild. For grading, one command beats 'install Python, create a venv, pip install, configure the database' — and it is reproducible: the professor gets exactly the environment you tested.\n\nTASKS.md Step 6 already plans Docker basics (container, Dockerfile, docker-compose), so this is not new learning for the project; it is scheduled learning.\n\nThe reproducibility argument is also a review argument: a Dockerfile and a compose file are small, readable artifacts you can audit line by line, and the professor can run the same image at home. That is a stronger story than 'it worked on my machine'." },
    { h: "The risks — and the check",
      b: "Two risks matter. The grading machine may lack Docker — check before the demo, or demo from your own laptop where Docker is safe. And Docker Desktop requires virtualization enabled, which is not guaranteed on every university machine. The mitigation is a written fallback: a requirements.txt plus venv plus the SQLite file plus a start script (start.sh) — still one command, no Docker.\n\nWrite and test the fallback before the trip ends so it exists whether you need it or not. A fallback that has never been run is a hope, not a plan.\n\nA third risk is the AI key: the container needs the .env at runtime, so document the one-line command that injects it (for example docker compose --env-file .env up) and never commit the key to the repository. The demo script should include starting with the key present." },
    { h: "Cloud: when it is worth it",
      b: "A small VPS (Hetzner or OVH, roughly $5-8/month) adds always-on reachability: the professor can open a live URL any time. It also adds money, a security surface, and more moving parts — and the demo benefit is zero if the professor grades in person. Your docs decide this already: the business model is self-hosted, not SaaS (docs/ALCANCE.md), so the default is a self-hosted demo, and cloud is only worth it if the professor explicitly wants a live URL.\n\nIf cloud is chosen anyway, keep the same Docker packaging — the VPS runs the same compose file — so the cloud decision does not fork the project into a second deployment path." },
    { h: "Common pitfalls",
      b: "No volume → data loss on rebuild: the SQLite file and uploaded receipts must live in a volume or bind mount. Assuming Docker on the grading machine — ask first; the fallback plan is not optional. Cloud without a reason: money and security for zero demo benefit. Manual setup: the highest risk of a failed demo, because every environment difference is a potential failure. And forgetting the .env: the shared AI key must be provided at runtime (feature 0b), so document where it lives and make sure it is never committed to the repo.\n\nAnd rehearse the one-command start on a cold machine: the first run pulls images and can take minutes, so a warmed image cache and a rehearsed sequence keep the demo from stalling at the very first step." },
    { h: "What a good answer includes",
      b: "Your answer names the pick — Docker on your laptop for the demo — plus three specifics: whether the grading environment has Docker or you will demo from your own laptop; the fallback run instructions written out (venv + requirements.txt + SQLite + start script); and the list of paths that must persist (database file, uploaded receipts, .env with the AI key).\n\nThis locks the deploy row of Step 2 in TASKS.md and becomes one row of the STACK.md matrix." }
  ],
  sub: [
    { q: "Does the grading environment have Docker, or will you demo from your own laptop?", info: "Your laptop = Docker is safe. Their machine = ask first." },
    { q: "Write the fallback run instructions if Docker is impossible.", info: "venv + requirements.txt + SQLite + start script is the standard fallback." },
    { q: "Where do volumes live — which paths must persist?", info: "DB file, uploaded receipts, and the .env with the AI key." }
  ],
  links: [
    "Docker docs — https://docs.docker.com/",
    "docker-compose overview — https://docs.docker.com/compose/",
    "docs/ALCANCE.md — Business Model (self-hosted, repo)"
  ]
};
PAGES.q2_6 = {
  intro: "This page synthesizes q2_1 through q2_5 into one sentence — the stack lock — and explains how to structure the STACK.md document that will carry the reasoning later. The lock sentence is your proposal to the team and the professor, not a contract: Step 2 of TASKS.md is on hold until the professor defines the project type, so the lock is a researched leaning, ready to be confirmed or overridden.",
  sections: [
    { h: "Why a lock sentence",
      b: "The lock sentence is a synthesis, not a justification: 'FastAPI + SQLite + plain HTML/JS + OpenAI + Docker' — one line naming backend, database, frontend, AI provider, and deploy. Its purpose is to make the stack easy to state, easy to challenge, and easy to change: when the professor overrides one layer, only that word changes. The reasoning lives in your q2_1..q2_5 answers and will move into docs/STACK.md (TASKS.md Step 8) as the decision matrix.\n\nA good lock sentence is deliberately boring. If the sentence needs adjectives, the reasoning is not finished.\n\nThe lock also protects the team: with the stack stated in one line, everyone argues about the same five words instead of vague preferences. Disagreements become precise — 'I would change SQLite for PostgreSQL' names the layer under discussion." },
    { h: "The STACK.md structure you are preparing",
      b: "The document you will generate later has four parts: (1) a decision matrix — options by criteria (effort, review, demo, cost); (2) your choice with two or three reasons per layer; (3) a 'research needed' list, which is exactly the output of q2_7; and (4) a fallback plan if the professor forces a change. Everything you answer in this section maps to one of those four parts, so the trip answers are the raw material of the document.\n\nDocs/ARCHITECTURE.md already lists the pending decisions (interface, stack, price source) that Step 8 must resolve — your lock sentence is the proposed resolution for the stack row.\n\nThe matrix format also forces the effort and review criteria to appear next to each other, which is where the honest trade-offs live: a layer that is cheap to build but expensive to review shows up immediately." },
    { h: "Confidence and plan B",
      b: "Rate your confidence 1-10 on each layer of the lock sentence: low-confidence layers are the research-first list for when you are online again. And write a second-favorite combo — a fallback proposal — because having a plan B makes the proposal look mature and gives the professor an easy alternative if one layer is rejected.\n\nThe interface layer is the most likely override; your architecture is interface-agnostic (docs/ALCANCE.md), so the core survives it.\n\nA useful test of the lock: explain it to a classmate in under thirty seconds. If you cannot, the sentence is not a lock yet, it is a draft." },
    { h: "Common pitfalls",
      b: "Putting justification in the sentence — the reasoning belongs in the matrix, not the lock. Locking layers you are not confident about: a 4/10 confidence on a layer is a research item, not a decision. No plan B: the professor will test flexibility, and the fallback combo shows you have thought beyond the happy path. Treating the lock as final before the professor decides: Step 2 is ON HOLD for a reason, and the sweep (Step 8) exists so nothing is forgotten when the platform is defined.\n\nAnd remember the lock is a leaning, not a commitment: TASKS.md keeps Step 2 ON HOLD precisely because the professor defines the project type first — a good lock makes that final decision cheaper, not unnecessary." },
    { h: "What a good answer includes",
      b: "Three things: the one-sentence lock in the exact format 'backend + DB + frontend + AI provider + deploy'; a confidence rating per layer; and the second-favorite combo with one line on why it is the fallback. No justifications needed in the sentence itself — the reasoning lives in your other answers and in the future STACK.md.\n\nAfter this, the answer is written into docs/STACK.md as your leaning. Keep the sentence boring and the matrix rich.\n\nWrite the confidence ratings and the plan B in the same answer block, so the future STACK.md receives all three inputs from one place." }
  ],
  sub: [
    { q: "Rate your confidence 1-10 on each layer of your lock sentence.", info: "Low confidence layers = research first when online." },
    { q: "What is your second-favorite combo (the fallback proposal)?", info: "Having a plan B makes the proposal look mature." },
    { q: "Which layer would the professor most likely override, and what is your counter-proposal?", info: "The interface is the most likely override; your core is interface-agnostic (docs/ALCANCE.md)." }
  ],
  links: [
    "TASKS.md — Step 2 and Step 8 (repo)",
    "docs/ARCHITECTURE.md — pending decisions / TBD list (repo)",
    "docs/ALCANCE.md — design decisions (repo)"
  ]
};
PAGES.q2_7 = {
  intro: "You cannot search the internet during the trip, but the decisions you make now depend on facts that change — model prices, framework versions, platform limits. This page is your offline research parking lot: what to verify online later, where exactly to verify it, and which repo labels still say TBD, candidate, or to define. Writing the URLs down now saves an hour of re-searching later.",
  sections: [
    { h: "What actually changes over time",
      b: "The facts most likely to be stale by the time you build: LLM API prices and model names — GPT and Claude release new versions yearly (the q2_4 numbers are already an update of earlier ones); Telegram limits — file size caps, message rate limits, Mini App rules; and framework versions with their breaking changes. The trip guide's own sources list (04-guide.js) and the qbank links point to the canonical places: official docs and the limits reference.\n\nPlan for change: write today's numbers as 'as of August 2026' notes, and treat any number older than a few months as unverified.\n\nThe same applies to library APIs: a tutorial written for Chart.js v3 may not work on v4, so note the version number next to each fact you record. Versions are facts too." },
    { h: "Where to check",
      b: "OpenRouter is the practical one-stop for model price comparison across providers. Official docs are the source of truth for your chosen stack — FastAPI, Django, SQLite, Docker, Chart.js. Telegram's limits are tracked at limits.tginfo.me, which stays current. And this repo's own docs carry the TBD labels that only you can resolve once the professor decides.\n\nThe habit to build: whenever you write a fact down during the trip, also write the URL you would verify it at — that turns the research list into a checklist with no re-searching.\n\nFor prices specifically, compare the official pricing pages with OpenRouter: the official page wins for budgeting, OpenRouter wins for what is actually available and running today. If they disagree, record both numbers and the date." },
    { h: "The TBD sweep (TASKS.md Step 8)",
      b: "Step 8 exists so nothing stack-dependent is forgotten when the professor defines the platform. It is literally a sweep: review every doc for 'TBD', 'to define', and 'candidate' leftovers and resolve them. The known labels right now: the interface (web / Telegram / app), the tech stack with DB candidate PostgreSQL (docs/ARCHITECTURE.md), the price source for feature 14, the auth mechanism (sessions vs tokens), receipt storage (local disk vs object storage), and how spending limits are created (Step 4).\n\nDo the sweep now, offline: grep the repo (or search the docs) and write down where each label lives. Later, after the professor decides, the sweep is a ten-minute pass instead of an hour of archaeology.\n\nAlso sweep the question bank itself: the qbank entries carry ref links to the docs (docs/ALCANCE.md, docs/FEATURES.md, docs/ARCHITECTURE.md), and each one is a place a TBD may hide after the professor decides." },
    { h: "Common pitfalls",
      b: "Not writing URLs now — 'I will search later' becomes re-researching the same questions. Trusting one source for prices: cross-check OpenRouter with the official pricing pages. Forgetting the TBDs that are not in the docs — tooling choices like Mermaid PNG export via mmdc, or Docker Desktop versus Podman on your machine, are real setup questions that deserve a research line. And assuming your memory of today's numbers will be right in a month: dating your facts is the cheapest insurance." },
    { h: "What a good answer includes",
      b: "Three to five concrete research items, each with a verification URL: for example, current vision API prices per 1M tokens; Mini App file limits; whether your schema.sql's PostgreSQL types port cleanly to SQLite; Docker Desktop versus Podman; Mermaid PNG export via mmdc. Plus the list of docs still carrying TBD, to define, or candidate labels.\n\nThis list becomes the 'research needed' section of STACK.md and the input to the OpenCode prompt when you are back online.\n\nFormat each item as a question, not a topic: 'What is the current GPT-5.4 input price per 1M tokens?' is checkable; 'prices' is not. Checkable items produce a done list; topics produce more topics." }
  ],
  sub: [
    { q: "Which 3 facts, if they changed, would change your stack?", info: "Example: vision API price triples, Mini App file limits shrink, professor mandates React." },
    { q: "Where exactly will you verify them (URLs)?", info: "Write the URLs now so you do not re-search later." },
    { q: "Which docs in this repo still carry 'TBD', 'to define', or 'candidate' labels?", info: "ARCHITECTURE.md lists the pending decisions; TASKS.md Step 8 is the sweep." }
  ],
  links: [
    "OpenRouter model/pricing list — https://openrouter.ai/models",
    "Telegram limits — https://limits.tginfo.me/en",
    "TASKS.md — Step 8 TBD sweep (repo)",
    "docs/ARCHITECTURE.md — pending decisions (repo)"
  ]
};
