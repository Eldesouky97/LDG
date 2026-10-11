# LDG Content Administration

The admin page is available at `/admin` and uses Google sign-in through Firebase Authentication. The administrator is `eldesouky71@gmail.com`; authorization is enforced by the Firestore `admins/{email}` document, not by a client-side email comparison. That document can only be created by a trusted project administrator.

## Content

- Company name and logo; bilingual home, about, and contact text.
- Email, telephone, WhatsApp, address, LinkedIn, and Facebook.
- Portfolio projects with bilingual titles, categories, descriptions, images, links, and visibility.
- Partner names, logos, links, order, and visibility.
- Save a private draft, preview it, and explicitly publish it to the public website.

Firestore stores `site/draft` and `site/published`. The public website subscribes only to the published document. Transactions check document revisions to prevent overwriting changes made from another session. The site continues to support Next.js static export, Firebase Hosting, Vercel, and the `/LDG` GitHub Pages base path.

Uploaded images are compressed to WebP in the browser. The content document has an 800 KB limit; oversized content is rejected with a message before saving. No company contact information or customer projects are fabricated.

## Infrastructure

- Firebase project: `ldg-website-app`.
- Firestore: `(default)`, region `eur3`, Standard free tier.
- Google sign-in is enabled. Authorized domains include Firebase defaults, localhost, `ldg-eta.vercel.app`, and `eldesouky97.github.io`.
- Firebase web configuration in `frontend/src/services/firebase/client.ts` is public project identification. It grants no administrative access.
- `backend/firebase/firestore.rules` denies all unspecified access, anonymous writes, draft reads by visitors, and changes to administrator records.
- `backend/firebase/firestore.indexes.json` exempts the serialized content payload from indexing.

Run `npm test` and `npm run build` from `frontend/`. Run Firebase commands from `backend/`. Deploy rules with `firebase deploy --only firestore` and the generated static website with `firebase deploy --only hosting`.

Google provider setup: https://firebase.google.com/docs/auth/web/google-signin
Firestore authorization: https://firebase.google.com/docs/rules/rules-and-auth

Adding another administrator requires a trusted project administrator to create `admins/<verified Google email>` with `enabled: true`. There is intentionally no public role-granting UI.
