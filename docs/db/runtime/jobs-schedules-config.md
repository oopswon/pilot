# Jobs, Schedules, Config

## Candidate Tables

- `jobs`
- `job_runs`
- `schedules`
- `task_queues`
- `feature_flags`
- `runtime_config`

## Notes

- Persist enough metadata to debug retries and failures.
- Configuration rows should distinguish global defaults from tenant overrides.
