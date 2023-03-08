import {
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword as fbCreateUserWithEmailAndPassword,
  signInWithEmailAndPassword as fbSignInWithEmailAndPassword,
} from "firebase/auth";
import { getServices } from "./app";

const { auth } = getServices();

async function createUserWithEmailAndPassword(email: string, password: string) {
  return fbCreateUserWithEmailAndPassword(auth, email, password);
}

async function signInWithEmailAndPassword(email: string, password: string) {
  return fbSignInWithEmailAndPassword(auth, email, password);
}

async function signOut() {
  return firebaseSignOut(auth);
}

export { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut };
