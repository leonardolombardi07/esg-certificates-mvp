import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { RouteErrorBoundary } from "~/components";
import { APP_NAME } from "~/constants";
import * as Cookies from "~/services/cookies";

export const meta: MetaFunction = () => ({
  title: `${APP_NAME} | Processos"`,
  description: "Crie e gerencie seus processos de certificação!",
});

export async function loader({ request }: LoaderArgs) {
  return await Cookies.redirectIfNotAuthenticated(request);
}

export default function ProcessesRoute() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: { error: Error }) {
  return <RouteErrorBoundary error={error} />;
}
