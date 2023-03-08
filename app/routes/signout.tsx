import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import * as Cookies from "~/services/cookies";

export const action = async ({ request }: ActionArgs) => {
  return Cookies.signOut(request);
};

export const loader = async () => {
  return redirect("/");
};
