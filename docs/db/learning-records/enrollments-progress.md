# Enrollments and Progress

## Candidate Tables

- `enrollments`
- `learning_progress`
- `lesson_progress`
- `module_progress`
- `progress_snapshots`

## Notes

- Progress state should be reconstructable from events or snapshots.
- Store current state separately from raw event history when read performance matters.
