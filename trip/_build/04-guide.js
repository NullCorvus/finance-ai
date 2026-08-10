const GUIDE = {
  title: "Trip Guide — inside this page",
  steps: [
    { name: "Before the trip", text: "5-minute test on the phone: open this file, record a clip, play it back, tap Backup JSON once. That is the full check." },
    { name: "On the trip", text: "Answer in any order. Text auto-saves. Audio stays on this device. Use the Info panel under each question — the research is already embedded; no internet needed." },
    { name: "Every day", text: "Tap Backup JSON and keep the downloaded file. It is your insurance: answers and recordings survive only while browser data is intact." },
    { name: "Back online", text: "Copy the JSON into trip/ and run the OpenCode prompt (trip/opencode-prompt.md). It turns your answers into STACK.md, the architecture diagrams, mockups, and the AIDLC answers file." }
  ],
  phone: "Answers and recordings live in this browser on THIS device. They survive closing the tab, but NOT clearing browser data or switching devices. Tap Backup JSON daily and keep the file — that is the insurance. If the page shows a storage warning banner, the browser is blocking persistence: use Chrome (Android) and still export daily.",
  effort: [
    ["Telegram bot + Mini App", "3-4 days core", "Chat input native; Mini App for graphs"],
    ["Web dashboard", "3-4 days core", "Richest UI; one surface to review"],
    ["Mobile app (RN/Flutter)", "2 weeks+", "Most polished; most review work"],
    ["Backend (FastAPI or Django)", "3-5 days", "API + AI calls + uploads + auth"],
    ["Database (SQLite or PG)", "Half a day", "SQLite = one file; PG = Docker"],
    ["AI provider key", "1 hour", "Shared key; under $0.01 per receipt"],
    ["Auth (sessions)", "Half a day", "Email/password demo standard"],
    ["Docker packaging", "1 day", "One-command demo for the professor"]
  ],
  glossary: [
    ["Django", "Python backend with everything built in: admin, auth, ORM. Sync-first, heavier."],
    ["FastAPI", "Modern Python backend: async-native, Pydantic validation, API-first. #1 in popularity 2025."],
    ["PostgreSQL", "Production-grade database server. Needs Docker or an install."],
    ["SQLite", "Database in a single file, zero setup. Enough for a 1-2 user demo."],
    ["React", "JavaScript UI library with components and state. Adds tooling to review."],
    ["Telegram Mini App", "A web app (HTML/JS) that runs inside Telegram, launched from a bot."],
    ["aiogram", "Async Python library for Telegram bots (Mini Apps + messages)."],
    ["Mermaid", "Text that renders as diagrams; used in your docs/ diagrams."],
    ["mmdc", "mermaid-cli: exports Mermaid diagrams to PNG/SVG/PDF."],
    ["AIDLC", "AWS AI Development Lifecycle: Inception → Construction → Operations. The workflow in AGENTS.md."],
    ["OpenCode", "AI coding agent (CLI/TUI) that reads AGENTS.md and follows the workflow."],
    ["Antigravity", "Google's AI-powered IDE/agent family (TASKS.md Step 6 tool)."],
    ["Docker", "Packages an app + dependencies into a container that runs anywhere."],
    ["Dockerfile", "The recipe that builds the container."],
    ["docker-compose", "Runs several containers (app + database) with one command."],
    ["JWT", "Stateless token auth. Mobile-friendly, but revocation needs extra logic."],
    ["Sessions", "Server-side auth with cookies. Instant revocation, simpler for demos."],
    ["Vision (OCR)", "AI reading text from images — how receipts become data."],
    ["DFD", "Data Flow Diagram: who talks to whom, in what order."],
    ["ER", "Entity-Relationship: your SCHEMA.md diagrams."],
    ["DANE canasta", "Colombian official food-price statistics; a reference for the price-source feature."]
  ],
  coverage: [
    ["1. Interface & platform (Q1.1-Q1.5)", "TASKS.md Step 2 (interface), Step 8 (interface TBD)"],
    ["2. Stack (Q2.1-Q2.7)", "TASKS.md Step 2 (backend, DB, frontend, AI, deploy), Step 8 (docs/STACK.md)"],
    ["3. Auth & data (Q3.1-Q3.6)", "TASKS.md Step 4 (limits), Step 8 (auth, receipt storage, price source, scope)"],
    ["4. AIDLC pre-answers (Q4.1-Q4.5)", "AGENTS.md workflow question gate"],
    ["5. Architecture (Q5.1-Q5.5)", "TASKS.md Step 5 Stages 4-7"],
    ["6. Mockups & tools (Q6.1-Q6.10)", "TASKS.md Step 6 + Step 7"]
  ],
  sources: [
    ["Telegram Mini Apps — official docs", "https://core.telegram.org/bots/webapps"],
    ["FastAPI vs Django 2025 comparison", "https://railsfactory.com/blog/django-vs-fastapi-python-framework-comparison/"],
    ["JetBrains: most popular Python frameworks 2025", "https://blog.jetbrains.com/pycharm/2025/09/the-most-popular-python-frameworks-and-libraries-in-2025-2/"],
    ["Claude vs GPT OCR comparison (2026)", "https://codesota.com/ocr/claude-vs-gpt4o-ocr"],
    ["mermaid-cli (mmdc) — GitHub", "https://github.com/mermaid-js/mermaid-cli"],
    ["JWT vs sessions — which is right for you", "https://stytch.com/blog/jwts-vs-sessions-which-is-right-for-you/"],
    ["Flutter vs React Native 2025", "https://www.alimertgulec.com/en/blog/flutter-vs-react-native-2025"],
    ["aiogram — async Telegram bot framework", "https://dev.to/imrrobot/aiogram-asynchronous-telegram-bot-framework-2fkp"]
  ],
  tips: [
    "Short text answers are valid answers. One sentence beats a perfect paragraph you never write.",
    "Audio clips: keep under 2 minutes and start by saying the question id ('q2_4: ...').",
    "Answer what you can and skip the rest — the OpenCode prompt asks about gaps later.",
    "The 'why' and the Info panel under each question are the technical context. No searching needed.",
    "If an option table feels overwhelming, focus on the 'risk' and 'review' columns — those are the columns that decide."
  ]
};
