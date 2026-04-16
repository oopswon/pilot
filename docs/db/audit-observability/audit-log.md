# Audit Log

## Candidate Tables

- `audit_log`
- `security_events`
- `admin_actions`
- `data_change_log`
- `access_log`

## Notes

- Audit rows should be immutable once written.
- Capture actor, action, subject, timestamp, request metadata, and correlation IDs.
