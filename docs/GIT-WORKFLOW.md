# Two repositories and ten feature branches each

Each repository contains `main` plus **10 feature branches**. Every feature branch has a real implementation commit and was merged to main with `--no-ff`. This records the work done in this build; it is not invented historical teamwork or instructor-reviewed pull requests. The GitHub URLs, remote pull requests and CI runs are pending account connection.

The submission ZIPs contain source without `node_modules` or `.git`. The complete package also contains `.bundle` files preserving commits and branches.

## Restore repository history (recommended)

From the complete package folder:

```powershell
git clone frontend-history.bundle smart-lost-found-frontend
git clone backend-history.bundle smart-lost-found-backend
```

For each cloned repository, make all preserved remote feature branches local before changing origin. In PowerShell:

```powershell
cd smart-lost-found-frontend
git for-each-ref --format='%(refname:short)' refs/remotes/origin/feature | ForEach-Object {
  $branch = $_ -replace '^origin/', ''
  git branch --track $branch $_
}
git branch
```

If a branch is already local, Git will say it exists; keep it. Repeat in the backend. Replace the bundle `origin` URL with your actual **empty** GitHub repository URL:

```powershell
git remote set-url origin https://github.com/YOUR_USERNAME/smart-lost-found-frontend.git
git push -u origin main
git push origin --all
```

Use the backend repository URL in the backend directory. Create new GitHub repositories without automatic README/license initialization to avoid unrelated-history conflicts. You do not need to reinitialize Git inside the cloned folders.

## Continue with a small real change

```powershell
git checkout -b feature/improve-search-message
# Edit and test the actual change.
git add src/pages/FoundItems.jsx
git commit -m "Clarify the empty search message"
git push -u origin feature/improve-search-message
```

Open a pull request in GitHub, explain the change and tests, review it, merge it, then `git checkout main` and `git pull`. A pull request template and CI workflow are included. Their presence is not evidence of an actual remote review or successful CI run.

## Frontend branches

1. feature/01-project-setup
2. feature/02-shared-components
3. feature/03-authentication
4. feature/04-browse-found-items
5. feature/05-item-details-claims
6. feature/06-report-forms
7. feature/07-customer-dashboard
8. feature/08-employee-dashboard
9. feature/09-responsive-layout
10. feature/10-documentation-quality

## Backend branches

1. feature/01-express-setup
2. feature/02-database-schema
3. feature/03-authentication
4. feature/04-item-crud
5. feature/05-ownership-claims
6. feature/06-employee-dashboard
7. feature/07-third-party-api
8. feature/08-server-security
9. feature/09-api-tests
10. feature/10-documentation-deployment

## Why this workflow helps (M1 / D2)

Feature branches isolate changes, commits describe their purpose, and explicit merges preserve a readable development history. Separate repositories make frontend/API ownership clear but require synchronized API contracts. README endpoint tables reduce that coordination cost. CI configuration checks builds/tests on future pushes and pull requests. Branches improve traceability; simply having ten branch names does not prove collaboration, quality or understanding. Capture genuine remote evidence after publishing and explain a specific change during the viva.
