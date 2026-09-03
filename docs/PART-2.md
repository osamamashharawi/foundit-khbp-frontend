# Part 2 — Implementation discussion and evidence map

Prepared for Osama Mashharawi, Special Topics in Computer Science 1. This is a technical draft grounded in the implemented code. Add your own screenshots, live URLs and real user-test observations. Do not claim pending activities are complete.

## 1. API and Markdown documentation (P6)

Both repositories have README files covering purpose, technologies, setup, environment variables, commands, folder structure, limitations and links to the endpoint reference. The API reference records method, URL, authorization, payload, response and errors. This makes a client/server contract visible and reduces time spent guessing field names. For example, the frontend knows that approving a claim uses `PATCH /claims/:id` with a status, while editing an item uses `PUT /items/:id` with the full editable payload. Documentation must be kept aligned with future changes.

## 2. Development from requirements (P7)

The implementation follows the report's customer and employee roles: customers register, report lost property, browse found items and submit ownership evidence; employees manage items, review claims and confirm returns. The page structure includes shared navigation, an item catalogue/details, forms, customer dashboard and employee dashboard. The Figma site could not be retrieved during this build, so exact visual fidelity needs comparison with the supplied prototype screenshots.

React pages use state, effects and reusable components. Express routes implement request handling and database queries. PostgreSQL persists users, items and claims with foreign keys and uniqueness constraints. CRUD is implemented through GET, POST, PUT/PATCH and DELETE. The optional photo persists as a validated data URL in the database. The submitted report's MongoDB references must be updated to PostgreSQL and its ERD aligned with the SQL schema.

Six seeded records provide realistic example item types and Amman stations. They are labelled fictional samples and are not presented as collected evidence. Add permitted real records if the instructor interprets the submission's real-data requirement literally; export only appropriately anonymized evidence.

## 3. Third-party API and GitHub impact (M1)

The app integrates Open-Meteo through the Express `/weather` route. Its purpose is to help a passenger check Amman weather before collecting property. Only fixed public coordinates go to the provider; claim details do not. A five-second timeout, 15-minute process cache and a controlled unavailable message keep weather failure separate from report submission. This adds a useful external API without an API key in the client. Limitations include provider availability, licensing/usage conditions and limited value compared with a future transport-company API. The integration contract and failure path were tested with controlled responses; a live-provider check is recorded separately in testing documentation.

Git offers real commits, feature branches and merges in both local repositories. GitHub will provide remote backup, pull requests, issues and CI once connected. These features support review and coordination, but a configured workflow is not a completed CI run. Cross-repository changes need coordinated versions and accurate endpoint documentation. No teammate review or issue discussion has been fabricated.

## 4. Deployment and production configuration (M2)

The chosen arrangement is a static React build, an Express service and PostgreSQL. The code is prepared for Render-backed API/database hosting and a Sites or Render frontend. The detailed deployment document explains environment variables, database setup, health checks, origin restrictions, HTTPS and React Router rewrites. The frontend production build passed, but no live deployment or hosted database has been verified. Platform selection balances straightforward Node support with the extra configuration of two services. A production rollback must preserve data; migrations and database backups are preferable to resetting the schema.

## 5. UI framework and responsiveness (M3)

Bootstrap supplies the responsive container, rows/columns, forms, buttons, alerts and tables. Item cards use `col-12 col-sm-6 col-lg-4`, producing one, two and three columns at relevant widths. Custom CSS gives the project its green transport-service theme and switches the navigation to a menu button on smaller screens. Employee tables scroll horizontally within their container. Labels, visible focus, semantic buttons, a skip link and reduced-motion support improve access. Actual phone, keyboard and zoom tests remain in the manual checklist.

## 6. Authentication and authorization (M4 / D1)

Registration stores a bcrypt password hash and forces the customer role. Login issues a two-hour JWT. Protected backend routes verify the signature and look up the current user, activity flag and token version. Logout or deactivation invalidates old tokens. Employees are created through an explicit administrator script, not a public role selector. Customers cannot edit another user's report or approve their own claim. The frontend displays appropriate routes, but server-side checks are the authority.

Authentication identifies a user; authorization decides what that user may do. Private ownership evidence and employee review help avoid returning a found item solely because somebody clicked Claim. A transaction updates claim and item states together, and a database constraint prevents multiple approved claims. Human verification is still required; this is not an AI ownership detector. Session storage is a simple learning choice with JavaScript-access risk; cookie-based sessions and recovery/verification flows are future improvements.

## 7. Quality, usefulness and usability evaluation (D1)

The central workflow addresses the uncertainty of whom to contact for lost property. Search by item/station, private claim details and visible progress make reports easier to organize. The innovation is a context-specific service combining passenger reporting with controlled employee return decisions, not a claim of a globally new technology. The simple component/route separation makes the work understandable for a student viva.

Fourteen API tests passed, including ownership boundaries, role escalation attempts, duplicate claims, status transitions, profile updates, logout, image/date rejection and weather failure. Frontend build and lint passed. These results support implemented behavior in a controlled environment, not guaranteed usability, load capacity or production reliability. PGlite runs PostgreSQL semantics inside tests, but does not validate the production connection pool, network failures or real simultaneous sessions. No browser test or user study has been claimed.

Remaining limitations include large unpaginated employee lists, database-heavy images, per-process rate limits/cache, no email verification/password reset and manual identity review. Test with a passenger and employee, record task completion, errors and comments, then make evidence-based improvements. Update the report after that evaluation.

## 8. Clean code, best practices and Git justification (D2)

- **Separation of concerns:** React components render UI; pages coordinate interactions; the shared API helper handles requests; Express routes enforce business rules; PostgreSQL stores data.
- **DRY:** Shared Field, ItemForm, ItemCard, StatusBadge, Feedback and ClaimsList components avoid repeating form/card/status markup. Backend authentication and validation helpers are reused. The category list is centralized within each separately deployable project.
- **Naming:** Named pages/routes and descriptive variables make the purpose visible without complex abstraction.
- **Error handling:** Forms display errors, the API returns consistent messages, timeouts avoid endless requests and SQL transactions roll back partial claim updates.
- **Security:** Parameterized SQL, hashing, current-role checks, body/image limits and no committed secrets protect the principal workflows.
- **Git:** Ten genuine feature commits/branches per repository plus merge commits preserve the implementation history. Future PRs and CI runs provide remote evidence after GitHub connection.

The code deliberately avoids Redux, TypeScript, an ORM and microservices. The extra security code is retained because simplifying it away would break permissions or data integrity. The student must be able to trace and explain the submitted work, as the assignment makes the viva part of assessment.

## Criteria evidence map

| Criterion | Implemented evidence | Still needed for submission |
| --- | --- | --- |
| P6 | Two READMEs and API reference | Explain documentation purpose in your words |
| P7 | React/Express/PostgreSQL CRUD and role workflows | Compare prototype and run final deployed walkthrough |
| M1 | Open-Meteo integration, local Git branches/merges, analysis | Actual GitHub links, PR/CI evidence and live API check |
| M2 | Deployment configuration guide and successful frontend build | Provision, deploy, verify and record real URLs |
| M3 | Bootstrap grid, controls and responsive CSS | Phone/tablet/desktop screenshots and checks |
| M4 | JWT, bcrypt, logout and server authorization | Demonstrate customer/employee flows during viva |
| D1 | Private claims, employee verification, tested boundaries, evaluation | Real usability evidence and final conclusions |
| D2 | Shared components/helpers, separation, naming, errors, Git history | Genuine collaboration/review evidence where applicable |

## References (Harvard style)

Bootstrap (n.d.) *Breakpoints*. Available at: https://getbootstrap.com/docs/5.3/layout/breakpoints/ (Accessed: 1 September 2026).

node-postgres (n.d.) *Queries*. Available at: https://node-postgres.com/features/queries (Accessed: 1 September 2026).

Open-Meteo (n.d.) *Weather Forecast API*. Available at: https://open-meteo.com/en/docs (Accessed: 1 September 2026).

Render (n.d.) *Deploy a Node Express App on Render*. Available at: https://render.com/docs/deploy-node-express-app (Accessed: 1 September 2026).

Render (n.d.) *Create and Connect to Render Postgres*. Available at: https://render.com/docs/postgresql-creating-connecting (Accessed: 1 September 2026).

Render (n.d.) *Static Site Redirects and Rewrites*. Available at: https://render.com/docs/redirects-rewrites (Accessed: 1 September 2026).

Vite (n.d.) *Building for Production*. Available at: https://vite.dev/guide/build (Accessed: 1 September 2026).
