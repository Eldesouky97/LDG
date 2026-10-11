import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, type User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { firebaseServices } from "./client";

export function subscribeAuth(next: (user: User | null) => void) {
  return onAuthStateChanged(firebaseServices().auth, next);
}

export async function checkAdmin(user: User) {
  const role = await getDoc(doc(firebaseServices().db, "admins", user.email ?? "_"));
  return user.emailVerified && role.data()?.enabled === true;
}

export function loginWithGoogle() {
  return signInWithPopup(firebaseServices().auth, new GoogleAuthProvider());
}

export function logout() {
  return signOut(firebaseServices().auth);
}
