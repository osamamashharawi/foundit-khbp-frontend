# Smart Lost & Found — Frontend

A responsive frontend for the FoundIT Smart Lost and Found application, developed using **React, JavaScript, Vite, React Router and Bootstrap**.

The application helps passengers report lost belongings, browse found items, submit ownership claims and track their requests. Employees can register found items, review claims, manage item statuses and manage customer accounts.

The backend is maintained in a separate Node.js, Express and PostgreSQL repository.

## Project Status

The frontend is successfully deployed on Railway and connected to the deployed FoundIT backend API.

The production application retrieves found-item records from the PostgreSQL database through the Express REST API. The frontend production build and ESLint checks were completed successfully.

## Repository and Deployment Links

* Frontend GitHub repository:
  https://github.com/osamamashharawi/foundit-khbp-frontend

* Backend GitHub repository:
  https://github.com/osamamashharawi/foundit-khbp-backend

* Deployed frontend application:
  https://foundit-khbp-frontend-production.up.railway.app

* Deployed backend API:
  https://smart-lost-found-api-production.up.railway.app

* API health check:
  https://smart-lost-found-api-production.up.railway.app/api/health

* Found-items endpoint:
  https://smart-lost-found-api-production.up.railway.app/api/items

## Technologies

* React
* JavaScript
* JSX
* Vite
* React Router
* Bootstrap
* CSS
* Fetch API
* JSON Web Token authentication
* Railway
* Git and GitHub

## Main Features

### Customer Features

* Create a customer account
* Log in and log out
* Browse found items
* Search using an item name or location
* Filter items by category
* View item details
* Report a lost item
* Add an item image
* Edit or delete an unprocessed report
* Submit private ownership evidence
* Track lost reports and ownership claims
* View employee review notes
* Update profile information

### Employee Features

* Secure employee login
* Access the administrator dashboard
* Register found items
* Edit or delete item records
* Review ownership claims
* Approve or reject claims
* Confirm that an item was returned
* Update item statuses
* View dashboard statistics
* Activate or deactivate customer accounts

### Additional Features

* Responsive Bootstrap layout
* Navigation guards for protected pages
* Loading and error messages
* Form validation
* Amman weather information
* Connection to a PostgreSQL-backed REST API
* KHBP and FoundIT visual branding

## Prerequisites

To run the frontend locally, the following software is required:

* Node.js 22 or newer
* npm
* Git
* Visual Studio Code or another code editor
* A running FoundIT backend API

## Installation

Clone the frontend repository:

```powershell
git clone https://github.com/osamamashharawi/foundit-khbp-frontend.git
```

Move into the project folder:

```powershell
cd foundit-khbp-frontend
```

Install the project dependencies:

```powershell
npm ci
```

Create the local environment file:

```powershell
Copy-Item .env.example .env
```

For macOS or Linux, use:

```bash
cp .env.example .env
```

## Environment Variables

For local development, add the following value to `.env`:

```dotenv
VITE_API_URL=http://localhost:5000/api
```

The backend must be running on port `5000`.

For the Railway production deployment, the following variables are configured:

```dotenv
VITE_API_URL=https://smart-lost-found-api-production.up.railway.app/api
RAILPACK_SPA_OUTPUT_DIR=dist
```

`VITE_API_URL` is included in the frontend build and is therefore not a suitable place for passwords or private information.

Restart the Vite development server after changing `.env`. The production frontend must be rebuilt after changing `VITE_API_URL`.

## Run the Frontend Locally

Start the backend first. Then run:

```powershell
npm run dev
```

Open the local URL displayed by Vite, which is normally:

```text
http://localhost:5173
```

Keep both the frontend and backend terminals running.

## Project Structure

| Path                          | Purpose                                                                         |
| ----------------------------- | ------------------------------------------------------------------------------- |
| `src/main.jsx`                | Loads Bootstrap, creates the React root and provides routing and authentication |
| `src/App.jsx`                 | Defines application routes and the shared page layout                           |
| `src/components/`             | Contains reusable interface components                                          |
| `src/pages/`                  | Contains the main application pages                                             |
| `src/context/AuthContext.jsx` | Manages the current user, login, logout and session state                       |
| `src/services/api.js`         | Contains the shared API request function and error handling                     |
| `src/data/categories.js`      | Contains the supported item categories                                          |
| `src/App.css`                 | Contains the FoundIT theme and responsive styling                               |
| `public/branding/`            | Contains the FoundIT and KHBP branding assets                                   |
| `docs/`                       | Contains API, deployment, testing, Git and Part 2 documentation                 |

## Reusable Components

The application uses reusable React components to reduce repeated code:

* `Navbar`
* `Footer`
* `ItemCard`
* `ItemForm`
* `Field`
* `Feedback`
* `StatusBadge`
* `ClaimsList`
* Route guards

For example, `ItemCard` is reused to display different found items, while `StatusBadge` displays statuses such as Lost, Found, Matched and Returned.

This follows the DRY principle because the same interface code is not rewritten on every page.

## Application Pages

| Page             | Purpose                                                |
| ---------------- | ------------------------------------------------------ |
| `FoundItems`     | Displays searchable and filterable found items         |
| `AuthPage`       | Provides customer registration and login               |
| `ItemDetails`    | Displays information about one found item              |
| `ReportPage`     | Allows customers to report lost belongings             |
| `Dashboard`      | Shows customer reports and ownership claims            |
| `AdminDashboard` | Allows employees to manage items, claims and users     |
| `Profile`        | Allows users to update their name and telephone number |

## Frontend Routes

| URL               | Access                | Purpose                              |
| ----------------- | --------------------- | ------------------------------------ |
| `/`               | Public                | Display the homepage and found items |
| `/found`          | Public                | Browse found items                   |
| `/login`          | Public                | Log in                               |
| `/register`       | Public                | Create a customer account            |
| `/items/:id`      | Public or conditional | View an item                         |
| `/report`         | Authenticated         | Report a lost item                   |
| `/dashboard`      | Authenticated         | View customer reports and claims     |
| `/profile`        | Authenticated         | Update profile information           |
| `/items/:id/edit` | Owner or employee     | Edit an item                         |
| `/admin`          | Employee              | Open the administrator dashboard     |
| `/admin/new`      | Employee              | Register a found item                |

Frontend route guards improve navigation by preventing users from opening unsuitable pages. However, the backend performs the final authorization checks for every protected operation.

## How the Frontend Works

1. `main.jsx` loads React, Bootstrap, React Router and the authentication provider.
2. `App.jsx` selects the correct page based on the current URL.
3. A page uses the shared API service to request information.
4. The request is sent to the Express backend.
5. The backend retrieves or updates information in PostgreSQL.
6. The backend returns a JSON response.
7. React stores the response using state.
8. The page updates and displays the new information.

For example, the `FoundItems` page sends a request to `/api/items`. The backend reads the found items from PostgreSQL and returns them as JSON. React then uses `map()` to display an `ItemCard` for every returned item.

## API Communication

The frontend communicates with the backend using the browser Fetch API.

The shared `src/services/api.js` file handles:

* The backend base URL
* HTTP methods
* Request headers
* JSON request bodies
* JWT authorization headers
* JSON responses
* Error messages

Centralizing API requests improves maintainability because changes to the backend URL or request handling can be made in one place.

Examples of API operations used by the frontend include:

| Method   | Endpoint         | Purpose                           |
| -------- | ---------------- | --------------------------------- |
| `GET`    | `/items`         | Retrieve and search found items   |
| `POST`   | `/auth/register` | Register a customer               |
| `POST`   | `/auth/login`    | Log in                            |
| `GET`    | `/auth/me`       | Retrieve the current user         |
| `PUT`    | `/auth/me`       | Update the user profile           |
| `POST`   | `/auth/logout`   | Log out                           |
| `GET`    | `/items/mine`    | Retrieve the customer’s reports   |
| `POST`   | `/items`         | Create an item record             |
| `PUT`    | `/items/:id`     | Update an item                    |
| `DELETE` | `/items/:id`     | Delete an item                    |
| `GET`    | `/claims`        | Retrieve claims                   |
| `POST`   | `/claims`        | Submit an ownership claim         |
| `PATCH`  | `/claims/:id`    | Review a claim                    |
| `GET`    | `/admin/summary` | Retrieve administrator statistics |
| `GET`    | `/weather`       | Retrieve weather information      |

See the complete [API documentation](docs/API.md).

## Authentication and Session Handling

After a successful login, the backend returns a JSON Web Token and user information.

The frontend:

1. Stores the JWT in `sessionStorage`.
2. Adds the token to protected API requests.
3. Stores the current authenticated user in `AuthContext`.
4. Displays pages and navigation options according to the user’s role.
5. Removes the local session after logout or token expiry.

Customers and employees see different navigation and dashboard options. However, frontend role checks are only used for the interface. The backend verifies the JWT, account status, ownership and role before allowing a protected operation.

Using `sessionStorage` is a simple choice for this student project. A more advanced production version could use secure HttpOnly cookies with suitable CSRF protection.

## UI Framework and Responsiveness

Bootstrap is used to create a responsive layout and consistent interface components.

Bootstrap provides:

* Containers
* Grid rows and columns
* Navigation controls
* Forms
* Buttons
* Cards
* Tables
* Alerts
* Responsive spacing

Item cards use responsive Bootstrap columns so the application can display approximately:

* One column on small mobile screens
* Two columns on tablet screens
* Three columns on larger desktop screens

Custom CSS is used with Bootstrap to create the green FoundIT/KHBP theme and improve navigation, spacing, focus indicators and mobile presentation.

## Error Handling

The application provides clear feedback when:

* The backend cannot be reached
* Login details are incorrect
* Required form fields are missing
* An item cannot be retrieved
* An operation is not permitted
* An ownership claim cannot be submitted
* The weather service is unavailable

Forms use `try/catch` with loading, success and error states. The weather feature is independent, so weather-service failure does not prevent the main lost-and-found features from working.

## Available Commands

```powershell
npm run dev
npm run lint
npm run build
npm run preview
```

| Command           | Purpose                                   |
| ----------------- | ----------------------------------------- |
| `npm run dev`     | Start the Vite development server         |
| `npm run lint`    | Check JavaScript and JSX code quality     |
| `npm run build`   | Create the production files inside `dist` |
| `npm run preview` | Preview the production build locally      |

## Production Deployment

The frontend is deployed on Railway from the `main` branch of the GitHub repository.

Railway builds the Vite application and serves the generated `dist` folder.

The deployed frontend communicates with the backend using:

```text
https://smart-lost-found-api-production.up.railway.app/api
```

The backend `CLIENT_URL` environment variable contains the deployed frontend address. This allows the backend CORS configuration to accept requests from the production frontend.

## Documentation and Maintainability

The frontend README explains:

* Project purpose
* Main features
* Technologies
* Installation
* Environment variables
* Commands
* Folder structure
* Page routes
* API communication
* Authentication
* Responsiveness
* Deployment

This documentation improves maintainability because another developer can understand the project structure and run the application without examining every source file.

It also improves collaboration by defining how the frontend communicates with the backend and explaining the responsibilities of important files and components.

Documentation should be updated whenever a route, component, environment variable, endpoint or deployment address changes.

## More Documentation

* [API documentation](docs/API.md)
* [Deployment instructions](docs/DEPLOYMENT.md)
* [Git and branch workflow](docs/GIT-WORKFLOW.md)
* [Part 2 discussion](docs/PART-2.md)
* [Testing evidence](docs/TESTING.md)
* [Report corrections](docs/REPORT-CORRECTIONS.md)

## Limitations

* No password-reset page
* No email-verification feature
* No automatic email or SMS notifications
* No automatic ownership verification
* JWT is stored in `sessionStorage`
* Final claims require employee review
* Browser and accessibility testing can be expanded
* Image storage is suitable for a student demonstration rather than a large production platform

## Acknowledgements

Developed from the course concepts and the official documentation for React, Vite, React Router, Bootstrap, Express and PostgreSQL. AI assistance was used during learning, development and documentation in accordance with the course requirements.
