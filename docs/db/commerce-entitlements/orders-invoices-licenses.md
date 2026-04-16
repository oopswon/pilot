# Orders, Invoices, Licenses

## Candidate Tables

- `orders`
- `order_items`
- `subscriptions`
- `invoices`
- `payments`
- `licenses`
- `entitlements`

## Notes

- Transactional commerce tables should preserve external provider references.
- `entitlements` should model the active access grant, even when sourced from multiple commercial events.
