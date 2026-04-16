# Tenants, Users, Roles

## Candidate Tables

- `tenants`
- `users`
- `user_profiles`
- `roles`
- `permissions`
- `groups`
- `group_members`
- `role_assignments`

## Notes

- `tenants` is the top-level boundary for all tenant-scoped rows.
- `users` stores the durable principal record.
- `role_assignments` should be the join point for tenant-scoped access control.
