import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase web configuration is public; write access is enforced by Firestore rules.
const config = {
  projectId: "ldg-website-app",
  appId: "1:917562618942:web:cd45a7071514130c160d6f",
  apiKey: "AIzaSyBp05Z5W15fqnnyPRfLCJXp1cP9RVhptWM",
  authDomain: "ldg-website-app.firebaseapp.com",
};
export function firebaseServices() {
  const app = getApps().length ? getApp() : initializeApp(config);
  return { auth: getAuth(app), db: getFirestore(app) };
}
