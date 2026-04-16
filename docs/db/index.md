# Database Specification Index

This directory is the canonical database spec for the product.

## Domain Map

- [Identity / Access](./identity-access/index.md)
- [LMS / Content / Learning Objects](./lms-content-lo/index.md)
- [Learning Records](./learning-records/index.md)
- [Commerce / Entitlements](./commerce-entitlements/index.md)
- [Runtime](./runtime/index.md)
- [Audit / Observability](./audit-observability/index.md)

## Conventions

- Keep each domain spec self-contained.
- Prefer stable table names and explicit foreign-key ownership.
- Record write paths, retention rules, and delete semantics in the owning domain.
- Use split files when a domain grows beyond one page.
