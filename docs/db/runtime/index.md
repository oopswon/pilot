# Runtime

Scope: operational tables used by the application at runtime, including jobs, schedules, caches, configuration, and transient state.

## Split Files

- [Jobs, Schedules, Config](./jobs-schedules-config.md)
- [Cache, Sessions, Workers](./cache-sessions-workers.md)

## Cross-Cutting Notes

- Keep runtime state distinct from product truth.
- Favor clear TTL and cleanup semantics for transient rows.
