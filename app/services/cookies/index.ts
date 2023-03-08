import { createCookieSessionStorage } from "@remix-run/node";
import { redirect } from "react-router";
import * as Firebase from "~/services/firebase";
import { unauthorized } from "~/utils/response";

const SESSION_SECRET = process.env.SESSION_SECRET || "Random";
const COOKIE_NAME = "jwt";
const EXPIRES_IN = 60 * 60 * 24 * 5 * 1000;

const storage = createCookieSessionStorage({
  cookie: {
    name: "auth_session",
    secrets: [SESSION_SECRET],
    // normally you want this to be `secure: true`
    // but that doesn't work on localhost for Safari
    // https://web.dev/when-to-use-local-https/
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: EXPIRES_IN,
    httpOnly: true,
  },
});

async function signIn(jwt: string, redirectTo: string = "/") {
  const session = await storage.getSession();
  session.set(COOKIE_NAME, jwt);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

async function signOut(request: Request) {
  const session = await getSession(request);
  // TODO: maybe we should signout the user on Firebase admin here somehow?
  return redirect("/login", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}

async function getAuthenticatedUser(request: Request) {
  try {
    const jwt = await getJwt(request);
    if (!jwt) throw new Error("No jwt found");
    const user = await Firebase.Server.getAuthenticatedUser(jwt);
    if (!user) throw new Error("No user found");
    return { jwt, ...user };
  } catch (error) {
    throw unauthorized("User not authenticated");
  }
}

async function redirectIfAuthenticated(request: Request, to: string = "/") {
  try {
    const user = await getAuthenticatedUser(request);
    if (user) return redirect(to);
    return null;
  } catch (error) {
    return null;
  }
}

async function redirectIfNotAuthenticated(
  request: Request,
  to: string = "/login"
) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) return redirect(to);
    return null;
  } catch (error) {
    return redirect(to);
  }
}

async function getJwt(request: Request) {
  const session = await getSession(request);
  const jwt = session.get(COOKIE_NAME);
  return jwt;
}

function getSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export {
  EXPIRES_IN,
  signIn,
  signOut,
  getAuthenticatedUser,
  redirectIfNotAuthenticated,
  redirectIfAuthenticated,
};
