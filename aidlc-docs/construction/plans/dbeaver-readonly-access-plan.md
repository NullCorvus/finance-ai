# DBeaver Read-Only Access Plan

## Scope

Add an explicit local-development mode that lets the user's installed DBeaver inspect Finance AI through a loopback-only PostgreSQL port. Keep the default stack private and give DBeaver a database-enforced read-only role instead of the application owner.

## Tasks

- [x] Add an opt-in Compose override bound only to `127.0.0.1`.
- [x] Provision repeatable read-only viewer permissions without displaying password hashes or application credentials.
- [x] Add one-command viewer start/stop behavior and copyable failures.
- [x] Document the exact DBeaver connection fields and local-only security boundary.
- [x] Verify SELECT permission, denied base-table/INSERT permission, loopback connectivity, and API health.
- [x] Leave the viewer running for the user's DBeaver connection.

## Extension Compliance

- Security baseline: applicable. Default Compose remains private; viewer access is explicit, local-only, read-only, and reversible.
- Property-based testing: N/A. This is deterministic development infrastructure verified with Compose rendering, role privileges, socket probes, and readiness checks.
