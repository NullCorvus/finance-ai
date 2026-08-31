# Windows Loopback API Access Plan

## Diagnosis

The copied client report identified `network_unavailable` and `connection_failure` at `http://127.0.0.1:8000`. Docker inspection then confirmed:

- The Compose project was initially stopped.
- After startup, PostgreSQL and the API were healthy inside Compose.
- Host port `8000` still refused connections because both services were attached only to an `internal: true` network.

## Authorized Fix Scope

This bounded local-development fix supports the already authorized Windows client. PostgreSQL remains attached only to the internal network and loses its ineffective host port declaration. The API remains on the internal network for database access and also joins a separate client-access bridge whose published API port is bound only to `127.0.0.1`.

## Tasks

- [x] Add the API-only client-access network while preserving the internal database network.
- [x] Remove the ineffective PostgreSQL host-port declaration and obsolete environment example.
- [x] Update local setup, architecture, security, and agent documentation.
- [x] Render Compose and recreate the local services.
- [x] Verify the database is not host-reachable and the API is reachable only through loopback.
- [x] Verify readiness and one controlled registration through `127.0.0.1:8000`.
- [x] Record evidence and restore completed project state.

## Extension Compliance

- Security baseline: applicable. Loopback-only HTTP remains permitted; the database must remain private; no new credentials or non-loopback listener is allowed.
- Property-based testing: N/A. The change is deterministic local network topology and is covered by rendered configuration, socket probes, health, and real registration checks.
