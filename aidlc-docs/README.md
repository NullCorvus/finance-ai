# Detailed Design and Delivery Evidence

This directory preserves requirements, per-story design, implementation summaries, and build/test evidence. It is supporting detail, not a second product backlog.

For normal development, begin with [`../docs/README.md`](../docs/README.md), then open only the relevant detailed artifact here. Completed plans, question sheets, generic workflow rules, and raw conversation audit logs were removed because their decisions are already consolidated into current documentation.

- `inception/requirements/requirements.md`: detailed functional and quality requirements
- `inception/user-stories/stories.md`: acceptance scenarios
- `inception/application-design/`: original decomposition and dependency detail; story-specific construction documents supersede it where they differ
- `construction/uow-*`: detailed design and implementation summaries for completed work
- `construction/build-and-test/`: reproducible verification commands and results
- `construction/cross-cutting-error-diagnostics.md`: shared safe-error contract
- `aidlc-state.md`: concise delivery state and next gate
