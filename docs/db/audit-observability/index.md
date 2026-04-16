# Audit / Observability

Scope: audit trail, security logs, metrics support tables, tracing correlation, and operational history.

## Split Files

- [Audit Log](./audit-log.md)
- [Metrics and Traces](./metrics-traces.md)

## Cross-Cutting Notes

- This domain is append-heavy and should prioritize queryability for investigations.
- Store correlation identifiers needed to reconstruct user and system actions.
