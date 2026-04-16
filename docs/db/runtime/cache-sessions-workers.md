# Cache, Sessions, Workers

## Candidate Tables

- `cache_entries`
- `worker_heartbeats`
- `worker_allocations`
- `api_sessions`
- `mutex_locks`

## Notes

- Cache-like tables should define expiry and cleanup behavior explicitly.
- Operational session rows should not be confused with identity-provider sessions.
