# Deployment guide and analysis

## Current status

No live application URL has been verified. Connect GitHub for the two repositories and Render for the Node/Express service and PostgreSQL database. The frontend can be served by Sites or Render Static Sites after a reachable API is configured. The current Sites project is registered privately but not published. The frontend was intentionally not published pointing to localhost.

## Selected production arrangement

React/Vite static frontend → Express web service → PostgreSQL. Keep the frontend and backend in separate GitHub repositories. PostgreSQL was selected because it matches the uploaded class code and is explicitly permitted in the assignment. Do not replace Express with a different server framework just to fit a static hosting service.

Render documents support for [Node/Express](https://render.com/docs/deploy-node-express-app), [static sites](https://render.com/docs/static-sites) and [PostgreSQL](https://render.com/docs/postgresql-creating-connecting). Choose account plans after checking their current limits; no paid resources were provisioned during this build.

## Step 1 — GitHub

Use `docs/GIT-WORKFLOW.md` to restore and push both repositories and all feature branches. Keep secrets out of Git. Make repositories public or give the instructor access, as required by the assignment.

## Step 2 — PostgreSQL

In Render choose New → Postgres, choose a name and region, and create it using your selected plan. Keep the database and API in the same region. Render provides internal and external connection URLs: use the internal one for the API and the external one only when connecting from your computer. Treat both as secrets.

Set your local backend `DATABASE_URL` temporarily to the external production connection string, with provider-required TLS parameters. Run `npm run db:setup` once, then create the employee account with `npm run admin:create`. Restore your local connection afterward. Alternatively run these scripts in the host's shell if your plan provides one. Do not turn off certificate verification to hide TLS errors.

## Step 3 — Express service

In Render choose New → Web Service and select the backend repository.

| Setting | Value |
| --- | --- |
| Runtime | Node |
| Branch | main |
| Build command | `npm ci` |
| Start command | `npm start` |
| Health check path | `/api/health` |
| Node version | 22 or newer |
| `DATABASE_URL` | Production PostgreSQL internal URL |
| `JWT_SECRET` | A freshly generated random secret, at least 32 characters |
| `CLIENT_URL` | Exact final frontend origin, with no trailing slash |
| `NODE_ENV` | production |
| `TRUST_PROXY` | 1 on Render's trusted proxy arrangement |

The host supplies `PORT`. Confirm `/api/health` returns database connected. If the frontend URL is not assigned yet, update `CLIENT_URL` once it is known, then redeploy/restart.

## Step 4 — Frontend

For Render choose New → Static Site and the frontend repository:

| Setting | Value |
| --- | --- |
| Branch | main |
| Build command | `npm ci && npm run build` |
| Publish directory | dist |
| `VITE_API_URL` | `https://YOUR-ACTUAL-API-HOST/api` |

Add a rewrite: source `/*`, destination `/index.html`, action **Rewrite**. This lets React Router handle refreshed URLs. These values are templates, not existing deployment addresses. [Render rewrite instructions](https://render.com/docs/redirects-rewrites) explain the setting. Vite's `VITE_` values are bundled into public JavaScript; never put secrets there.

For Sites, the same Vite build can be published once `VITE_API_URL` is set to the live API. Keep its existing project identity rather than registering a new Site. Ensure the frontend access setting allows the instructor to open it.

## Step 5 — Production verification

1. Open `/api/health` and check the database response.
2. Open the frontend; confirm found items load from the hosted database.
3. Register a customer and create a report with an image.
4. Reload the page; confirm the saved report persists.
5. Edit and delete your own report.
6. Log in as the employee in another browser; add a found item.
7. Submit and approve a claim, then confirm return.
8. Check another customer's token cannot modify your report.
9. Refresh `/dashboard` directly and check it loads.
10. Check mobile navigation, keyboard controls and visible error messages.

Record actual screenshots and URLs. Do not mark these completed until they run on the hosted app.

## Deployment evaluation (M2)

Independent frontend/API hosting allows separate releases and scaling, but creates configuration responsibilities: CORS must match the frontend origin, HTTPS must be used, and the API URL requires a frontend rebuild. A static frontend is easy to cache; PostgreSQL and Express remain the bottlenecks for data requests. A same-region private database connection reduces network distance and external exposure. Environment variables separate secrets from code and let identical source run locally and in production.

Failures to anticipate include a wrong database password, a missing schema, a stopped database/service, an incorrect `CLIENT_URL`, and a frontend bundle built with localhost. Check the health endpoint, host logs and environment values in that order. Roll back to the previous working code revision if a release fails; preserve the database and use backups/migrations rather than destructive resets. Multi-instance scale needs shared rate limiting/cache and more pagination. Deployment success and performance are still pending measurements, not assumed from a local build.
