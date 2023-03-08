import type { App } from "firebase-admin/app";
import { initializeApp } from "firebase-admin/app";
import type { Auth } from "firebase-admin/auth";
import { getAuth } from "firebase-admin/auth";
import { getApp, getApps } from "firebase-admin/app";
import { credential } from "firebase-admin";
import { EMULATOR_PORT } from "../constants";

const serverCredentials = require("./esg-certificates-mvp-firebase-adminsdk-kpwle-3cd52c167f.json");

interface FirebaseServerServices {
  app: App;
  auth: Auth;
}

function getServices(): FirebaseServerServices {
  const app = initializeIfNoExistingApp();
  const auth = getAuth(app);
  return { app, auth };
}

// The admin SDK doesn’t allow initialization of the same app more than once
// – since Remix provides some hot-reloading on file changes this will trigger
// initialization more than once, so we first check if a Firebase App instance
// has been initialized and return it if it already has been.
function initializeIfNoExistingApp(): App {
  if (getApps().length === 0) {
    if (process.env.NODE_ENV === "development") {
      process.env["FIRESTORE_EMULATOR_HOST"] = getEmulatorUrl(
        EMULATOR_PORT.FIRESTORE
      );
      process.env["FIREBASE_AUTH_EMULATOR_HOST"] = getEmulatorUrl(
        EMULATOR_PORT.AUTH
      );
    }
    return initializeApp({
      credential: credential.cert(serverCredentials),
    });
  }

  return getApp();
}

function getEmulatorUrl(port: number) {
  return `127.0.0.1:${port}`;
}

export { getServices };
