import type {
  LinksFunction,
  LoaderArgs,
  MetaFunction,
  SerializeFrom,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLocation,
  useMatches,
  useNavigate,
} from "@remix-run/react";
import SUIStyles from "semantic-ui-css/semantic.min.css";
import { Button } from "semantic-ui-react";
import { MediaContextProvider, mediaStyle } from "~/components/modules/Media";
import { ErrorBoundary as AppErrorBoundary } from "~/components";
import { APP_NAME } from "~/constants";
import * as Cookies from "~/services/cookies";
import type { User } from "~/types";
import {
  ActionLoadingMessage,
  PageLoadingProgress,
} from "./components/scoped/root";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: SUIStyles, as: "style" }];
};

export const meta: MetaFunction = () => ({
  title: APP_NAME,
  charset: "utf-8",
  viewport: "width=device-width,initial-scale=1",
});

export async function loader({ request }: LoaderArgs) {
  const data: { user: User | null } = { user: null };
  try {
    data.user = await Cookies.getAuthenticatedUser(request);
  } finally {
    return json(data);
  }
}

export const handle = { id: "root" };

export function useRootData() {
  const matches = useMatches();
  const match = matches.find(({ handle }) => handle?.id === "root");
  if (!match) {
    throw new Error(`No active route for handle ID "root"`);
  }
  return match.data as SerializeFrom<typeof loader>;
}

export default function AppWithProviders() {
  return (
    <MediaContextProvider>
      <App />
    </MediaContextProvider>
  );
}

function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

function Document({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />

        {/* TODO: maybe we should load this in the links function? */}
        <style type="text/css">${mediaStyle}</style>
      </head>

      <body>
        <PageLoadingProgress />
        {children}
        <LiveReload />
        <ScrollRestoration />
        <Scripts />
        <ActionLoadingMessage />
      </body>
    </html>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  console.log("Caught Boundary:", caught);

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const unauthorized = caught.status === 401;
  const notFound = caught.status === 404;

  function onClick() {
    const to = notFound ? "/" : unauthorized ? "/login" : pathname;
    navigate(to);
  }

  const buttonText = notFound
    ? "Ir para tela inicial"
    : unauthorized
    ? "Ir para o login"
    : "Tentar novamente";

  return (
    <Document>
      <AppErrorBoundary
        header={"Algum erro ocorreu"}
        message={`${String(caught.status)} | ${caught.data}`}
      >
        <Button
          onClick={onClick}
          primary
          size="huge"
          style={{ marginTop: "1em" }}
        >
          {buttonText}
        </Button>
      </AppErrorBoundary>
    </Document>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  const { pathname } = useLocation();
  console.log("RootErrorBoundary", error);
  return (
    <Document>
      <AppErrorBoundary header={"Algum erro ocorreu"} message={error.message}>
        <Button
          as={Link}
          to={pathname}
          primary
          size="huge"
          style={{ marginTop: "1em" }}
        >
          Tentar novamente
        </Button>
      </AppErrorBoundary>
    </Document>
  );
}
