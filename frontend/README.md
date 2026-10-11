# Lilian Data Group

The project has two application directories:

- frontend/: Next.js website, admin interface, source code, static assets, tests, dependencies, and build configuration.
- backend/: Firebase deployment configuration, Firestore security rules, and indexes.

Only Git/GitHub repository metadata and this guide remain at the root.

## Run And Test

Use Node.js 22 or newer. Run all npm commands from frontend/.

```sh
cd frontend
npm install
npm run dev
npm test
npm run build
```

Local website: http://localhost:3000. Administration: http://localhost:3000/admin. Production static files are generated in frontend/out/.

## Frontend Source

- src/app/: Next.js routes and layouts.
- src/site/: public website, translations, and styles.
- src/admin/: administration, fields, session hook, and styles.
- src/services/firebase/: browser-side Firebase SDK service adapters; these are not privileged server code.
- src/shared/content/: types, defaults, and validation.
- public/: media.
- tests/: validation tests.

Firebase is the actual backend. Do not put privileged credentials in browser code. See frontend/ADMIN.md and backend/README.md for access and deployment.

## Deploy

After building the frontend:

```sh
cd ../backend
node prepare-hosting.mjs
firebase deploy --only "hosting,firestore" --project ldg-website-app
```

GitHub Pages builds frontend/ with /LDG as its base path. When importing this repository into Vercel, set the project Root Directory to frontend.
