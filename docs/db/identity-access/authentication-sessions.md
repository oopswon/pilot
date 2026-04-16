# Authentication, Sessions

## Candidate Tables

- `auth_identities`
- `auth_providers`
- `auth_sessions`
- `refresh_tokens`
- `verification_tokens`
- `password_reset_tokens`

## Notes

- External identity mappings belong here, not in the user profile tables.
- Session and token rows should have explicit expiration and revocation fields.
