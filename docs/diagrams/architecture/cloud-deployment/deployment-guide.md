# How to update the Finance AI backend

This guide describes the configuration checked on 26 October 2026. Commands are examples: execute deployment commands only when an actual update has been reviewed and is intended for the shared production service.

## What goes where

The backend source and `Dockerfile` are in `Maicol2363/finance-ai-backend`. A Dockerfile is a recipe, not a running server: this one starts from Python, installs locked dependencies using `uv`, copies source and migrations into `/app`, and starts Uvicorn on port 8000 as a non-root user. `docker build` turns that recipe and the build context into an image. Artifact Registry stores the image. Cloud Run starts the image as one or more container instances and provides HTTPS.

The database is a separate Neon PostgreSQL service. Cloud Run supplies the database URL and AI settings to the container through environment variables. Replacing the container image does not by itself erase the Neon database. Database migrations, if run, can change the database and must be reviewed independently.

The Android APK is built and installed separately. Updating the backend does not automatically rebuild or reinstall the APK.

## Current service

- Project: `finance-ai-api`; region: `southamerica-east1`; service: `finance-api`.
- URL: `https://finance-api-7caahuohmq-rj.a.run.app`.
- Revision verified: `finance-api-00017-x22`; port 8000, 1 CPU, 512 MiB, max 3 instances for the revision, 80 concurrent requests per instance, 300-second request timeout.
- Provider selection: `deepseek` first, `deepseek-flash`; Gemini fallback `gemini-3.5-flash-lite` in main capture gateways.
- Runtime environment includes a Neon database URL and API keys. Do not paste credential values into a Dockerfile, commands, logs or Git.

The current image was built directly from the previously deployed image with an API description change. The matching backend source change is uncommitted locally as of this snapshot. A future image built from source that still has the old description can restore it.

## What happens when code is pushed

Pushing a Dockerfile or Python source to GitHub does not itself run Docker on Cloud Run. A working CI/CD workflow must build and deploy it.

The workflow on remote `main` checked for this guide listens to completed Backend CI runs for `main` and `develop`, builds an image, pushes it to Artifact Registry, deploys Cloud Run and runs health checks. It contains an optional Neon migration step if the GitHub database secret is supplied. Its checkout/image tagging is not pinned to the triggering CI head SHA. Its manual dispatch is declared, but the job condition requires a successful `workflow_run`, so manual dispatch should not be assumed to run the deployment.

The version on remote `develop` differs and contains stricter main-only/exact-SHA checks; it is not evidence that those checks are active on `main`. The latest three deployment workflow runs observed on 26 October failed at Google Cloud authentication. The current working revision was deployed manually. Check the [GitHub Actions deployment history](https://github.com/Maicol2363/finance-ai-backend/actions/workflows/deploy.yml) and repair the authentication failure before relying on automated deployments.

## Manual image build and deployment

The commands below deploy the image from the **current working directory**, including uncommitted files. First select and review the exact backend source and database migrations you intend to deploy. Do not run these against an old or dirty checkout by accident. The example does **not** run migrations.

From the root of a reviewed `finance-ai-backend` checkout:

```bash
git status --short --branch
git log -1 --oneline
gcloud auth list
gcloud config set project finance-ai-api
gcloud auth configure-docker southamerica-east1-docker.pkg.dev
```

Choose a unique image tag that identifies the reviewed build. Replace the placeholder before running:

```bash
IMAGE="southamerica-east1-docker.pkg.dev/finance-ai-api/finance-ai/backend:REPLACE_WITH_UNIQUE_TAG"
docker build --target runtime --tag "$IMAGE" .
docker push "$IMAGE"
```

Deploy the pushed image to the existing service:

```bash
gcloud run deploy finance-api \
  --project=finance-ai-api \
  --region=southamerica-east1 \
  --image="$IMAGE"
```

This command creates a new Cloud Run revision and normally directs traffic to it. It does not itself build the image, run Alembic migrations or rebuild the APK. Without flags that update environment variables, existing Cloud Run environment settings are retained. Review the command output and the revision/traffic state after deployment. Credentials need appropriate permissions for Artifact Registry and Cloud Run.

Verify the resulting deployment:

```bash
gcloud run services describe finance-api \
  --project=finance-ai-api --region=southamerica-east1 \
  --format='value(status.latestReadyRevisionName,status.url)'
curl -fsS https://finance-api-7caahuohmq-rj.a.run.app/health/live
curl -fsS https://finance-api-7caahuohmq-rj.a.run.app/health/ready
curl -sS -o /dev/null -w '%{http_code}\n' \
  https://finance-api-7caahuohmq-rj.a.run.app/api/v1/accounts
```

The last request should return `401` without credentials. A successful health check does not prove every feature or the AI provider works. If the release introduces migrations, plan and execute the appropriate migration separately with a backup and rollback strategy; do not assume deploying an image performs it.

To inspect a service without printing secrets, use targeted output such as the revision and URL above. The current service uses inline environment values for credentials, so avoid dumping the whole service definition into shared logs.
