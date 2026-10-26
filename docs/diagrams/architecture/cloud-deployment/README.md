# Finance AI cloud deployment

Open the [interactive deployment diagram](finance-ai-cloud.html). It is a snapshot of the service configuration verified on 26 October 2026. The companion [deployment guide](deployment-guide.md) explains the image, Cloud Run and commands.

The normal application path is Android → HTTPS → FastAPI on Cloud Run → Neon PostgreSQL or an AI provider. DeepSeek was configured as primary and Gemini as a conditional fallback for the main capture flows. The legacy receipt scan endpoint calls DeepSeek directly. The API documentation is served at `/docs` by the same backend. AI output is a proposal; confirmation is required before a financial operation is saved.

The candidate sources cite the tracked Finance AI documentation. Live provider order, Cloud Run and Neon hosting were verified separately from the cloud service configuration and can change. The repository has independent pre-existing local changes. No deployment or provider setting was changed in creating this diagram.

Archify schema validation, artifact delivery and strict provenance checks passed. The automated Archify browser check could not run because the environment did not provide a Chrome/Chromium executable. The rendered overview was inspected separately in the in-app browser.
