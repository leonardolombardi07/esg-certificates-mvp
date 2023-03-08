import { Link, useLocation, useNavigate } from "@remix-run/react";
import { Button } from "semantic-ui-react";
import { ErrorBoundary } from "~/components/views/ErrorBoundary";

interface RouteErrorBoundaryProps {
  error: Error;
  tryAgain?: boolean;
  goBack?: boolean;
  goHome?: boolean;
}

function RouteErrorBoundary({
  error,
  tryAgain = true,
  goBack = true,
  goHome = true,
}: RouteErrorBoundaryProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  return (
    <ErrorBoundary
      header={"We're sorry, something went wrong"}
      message={error.message}
      segmentStyle={{ minHeight: "100vh" }}
    >
      {tryAgain && (
        <Button
          as={Link}
          reloadDocument
          to={pathname}
          primary
          size="huge"
          style={{ marginTop: "1em" }}
        >
          Tentar novamente
        </Button>
      )}

      {goBack && (
        <Button
          onClick={() => navigate(-1)}
          secondary
          size="huge"
          style={{ marginTop: "1em", margin: "0 20px" }}
        >
          Voltar
        </Button>
      )}

      {goHome && (
        <Button
          onClick={() => navigate("/")}
          size="huge"
          style={{ marginTop: "1em" }}
        >
          Ir para tela inicial
        </Button>
      )}
    </ErrorBoundary>
  );
}

export { RouteErrorBoundary };
