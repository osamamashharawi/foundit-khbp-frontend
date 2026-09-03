# Smart Lost & Found — Frontend

A student full-stack project for passengers and public transport employees in Amman. Built with **React, JavaScript/JSX, Vite, React Router and Bootstrap**. Backend: a separate **Express + PostgreSQL** repository.

## Project status

The production build and ESLint checks passed on 1 September 2026. The backend has 14 passing API integration tests using PGlite's PostgreSQL engine. A live database, live hosting and GitHub publication are **not yet configured**. Do not put placeholder URLs in your assignment as completed deployments. Browser/device and real-user tests still need to be performed.

## Run on Windows

Install Node.js 22 or newer and start the backend first. Open this frontend folder in VS Code, then open a terminal:

```powershell
npm ci
Copy-Item .env.example .env
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`. The `.env` file contains:

```dotenv
VITE_API_URL=http://localhost:5000/api
```

For macOS/Linux use `cp .env.example .env`. Keep the terminal open. If Vite chooses another port, put that origin in the backend `CLIENT_URL` and restart the backend.

## What works after connecting the backend

- Browse found items; search by title or station; filter category; move between pages.
- Create a customer account, log in and log out.
- Create, read, edit and delete your own unprocessed lost reports.
- Attach a JPG, PNG or WebP photo up to 1 MB.
- Read found-item details and submit private proof of ownership.
- Track reports, claims and employee notes in My dashboard.
- Edit profile name and telephone number.
- Employees register/edit/delete found items, review claims, confirm returns and activate/deactivate customer accounts.
- An Amman weather widget helps passengers plan station collection trips. Weather failure does not block reports.

The six seed items are explicitly labelled **Sample item**. They are fictional examples, not verified transport-company data. No employee password is embedded in the source; create one through the backend script.

## Folder structure

| Path | Responsibility |
| --- | --- |
| `src/main.jsx` | Bootstrap CSS, React root, router and authentication provider |
| `src/App.jsx` | URL routes and shared page layout |
| `src/components/` | Reusable Navbar, Footer, ItemCard, ItemForm, Field, Feedback, StatusBadge and guards |
| `src/pages/` | FoundItems, AuthPage, ItemDetails, ReportPage, Dashboard, AdminDashboard and Profile |
| `src/context/AuthContext.jsx` | Current user, login, logout and session expiry |
| `src/services/api.js` | Shared fetch helper, bearer token and error handling |
| `src/data/categories.js` | Shared frontend category list |
| `src/App.css` | App-specific theme and responsive refinements |
| `docs/` | API documentation, deployment, Part 2 analysis, testing and Git workflow |

## How the code flows

1. `main.jsx` mounts `App` inside `BrowserRouter` and `AuthProvider`.
2. A route selects a page, for example `FoundItems`.
3. `useEffect` requests data through `api('/items')`.
4. Express reads PostgreSQL and returns JSON.
5. `setData` updates state; React renders `ItemCard` components with props.
6. A form uses `onSubmit`, `preventDefault`, state and `fetch` to save data.
7. After saving, the dashboard reloads data from the database.

This follows the class concepts: functions, objects, arrays, destructuring, `map`, `useState`, `useEffect`, props, events, `async/await`, `fetch` and `try/catch`. Context is used only to avoid passing login state through every page. There is no Redux, TypeScript or ORM.

## Routes

| URL | Access |
| --- | --- |
| `/`, `/found` | Everyone |
| `/login`, `/register` | Everyone |
| `/items/:id` | Found items public; lost reports restricted by backend |
| `/report`, `/dashboard`, `/profile` | Logged-in users |
| `/items/:id/edit` | Logged-in users; backend checks owner/employee permission |
| `/admin`, `/admin/new` | Employees |

A frontend route guard improves navigation; it does **not** replace backend authorization. The backend verifies every protected operation.

## Commands

```powershell
npm run dev
npm run lint
npm run build
npm run preview
```

`build` creates `dist/`. `preview` checks the built frontend locally; it does not start the database or API.

## Environment and session handling

`VITE_API_URL` is a public build-time API address, never a password. Restart Vite after local changes and rebuild after production changes. JWTs last two hours and are held in `sessionStorage`, which is still accessible to JavaScript; this is a documented student-project tradeoff. A production upgrade should consider HttpOnly cookies with CSRF protections. Logout invalidates the user's existing tokens on the server.

## Documentation and assignment evidence

Read [API endpoints](docs/API.md), [deployment instructions](docs/DEPLOYMENT.md), [Git and branches](docs/GIT-WORKFLOW.md), [Part 2 analysis](docs/PART-2.md), [test evidence](docs/TESTING.md) and [report corrections](docs/REPORT-CORRECTIONS.md).

The prototype in the submitted report was used for the described page/role scope. The live Figma URL could not be retrieved during this build; exact visual matching has not been verified.

## Repository and deployment links

- Frontend GitHub: **pending account connection**
- Backend GitHub: **pending account connection**
- Frontend deployment: **pending backend hosting setup**
- Backend deployment: **pending Render connection and PostgreSQL provisioning**

These must be replaced with actual verified URLs before submission.

## Acknowledgements

Developed from the course concepts and uploaded React/Express/PostgreSQL examples. The supplied MIT license by Razan Al-Quran is preserved in `LICENSE`. AI assistance was used to implement and document this version; explain this according to your course declaration requirements.
