# Backend

Firebase provides Authentication and Firestore. This directory contains deployment configuration, security rules, and indexes. No custom Node.js server is required.

The frontend Firebase SDK adapters only call these services; authorization is enforced by the Firestore rules.

Build the frontend before deploying hosting:

```sh
cd ../frontend
npm run build
cd ../backend
node prepare-hosting.mjs
firebase deploy --only "hosting,firestore" --project ldg-website-app
```

The preparation command copies frontend/out into the ignored hosting build directory, which Firebase publishes. These commands deploy code and security rules, not editor drafts.
