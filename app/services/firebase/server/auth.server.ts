import { getServices } from "./app.server";
import type { UpdateRequest } from "firebase-admin/auth";
import type { User } from "~/types";

const { auth } = getServices();

async function signIn(idToken: string, expiresIn: number) {
  await auth.verifyIdToken(idToken);
  const jwt = await auth.createSessionCookie(idToken, {
    expiresIn,
  });
  return jwt;
}

async function getAuthenticatedUser(jwt: string): Promise<User> {
  const { uid } = await auth.verifySessionCookie(jwt);
  const userRecord = await auth.getUser(uid);
  return {
    displayName: userRecord.displayName || null,
    email: userRecord.email || null,
    phoneNumber: userRecord.phoneNumber || null,
    photoURL: userRecord.photoURL || null,
    // TODO: if we choose to link other providers, we need to
    // find a way to detect the right providerId here
    providerId: userRecord.providerData[0]?.providerId,
    uid: userRecord.uid,
  };
}

async function updateUser(jwt: string, properties: UpdateRequest) {
  const { uid } = await auth.verifySessionCookie(jwt);
  return auth.updateUser(uid, properties);
}

export { getAuthenticatedUser, signIn, updateUser };
