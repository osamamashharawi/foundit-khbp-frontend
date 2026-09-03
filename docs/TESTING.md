# Validation evidence — 1 September 2026

## Completed

- `npm run build` in frontend: passed.
- `npm run lint` in frontend: passed, no reported lint errors.
- `npm test` in backend: **14 tests passed, zero failed**.
- SQL setup, reads, inserts, updates, deletes, constraints and transactions executed through PGlite's PostgreSQL engine.

## Test scenarios

1. Health and seeded public search.
2. Registration role escalation blocked and password hashed.
3. Duplicate email, incorrect login and weak password rejected.
4. Own lost report create/update and forced initial status.
5. Private reports and other-customer writes denied; employee endpoint protected.
6. Invalid date/image/ID rejected; SQL injection input treated as data.
7. Employee creates found item; customer submits one private claim.
8. Approval rejects competing pending claims; return updates item; invalid transitions rejected.
9. Lost-report progression controlled; processed reports not editable by customer.
10. Customer delete persists; employee delete cascades claims.
11. Account deactivation revokes tokens and blocks login.
12. Profile persists; logout revokes issued token.
13. Weather response and provider failure contract.
14. Unknown endpoint and untrusted CORS origin.

## Limits of this evidence

PGlite tests execute real PostgreSQL semantics in-process using a test adapter, not a network PostgreSQL server or the production pg.Pool. Tests run sequentially; real concurrent requests, TLS, hosting resources and production network behavior still require checks. The weather test uses an injected response; it is not evidence that the live provider was reachable. A build/lint pass does not prove browser usability. No real passenger research or success rates are invented.

## Manual checks to perform after setup

| Check | Expected result | Actual result |
| --- | --- | --- |
| Register, refresh and log out | Account persists; protected page requires login after logout | Pending |
| Upload real small PNG/JPG | Image remains after backend restart | Pending |
| Desktop and phone catalogue | No page overflow; cards readable | Pending |
| Mobile menu, keyboard, 200% zoom | All controls reachable with visible focus | Pending |
| Claim, employee approval, return | Dashboard updates and item marked Returned | Pending |
| Refresh nested hosted URL | React route loads without host 404 | Pending |
| Offline API | Clear error and no false success message | Pending |
| Live weather | Actual provider result or clear unavailable state | Pending |
| Two simultaneous approvals | One winner; no duplicate successful claim | Pending |

Record date, device/browser, input, result and screenshot for each real check. Preserve failed checks and explain fixes rather than reporting all rows passed without evidence.

## Live provider check

A direct Open-Meteo request was attempted on 1 September 2026 and timed out after eight seconds in this environment. Provider reachability was therefore not verified. The application has a five-second timeout and a tested 503/unavailable path.
