import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { Link, useFetcher } from "@remix-run/react";
import React from "react";
import {
  Segment,
  Grid,
  Form as SUIForm,
  Button,
  Message,
  Header,
} from "semantic-ui-react";
import { APP_NAME } from "~/constants";
import * as Cookies from "~/services/cookies";
import * as Firebase from "~/services/firebase";
import { badRequest } from "~/utils/response";

export const meta: MetaFunction = () => ({
  title: `${APP_NAME} | Login"`,
  description: "Conecte-se para solicitar e gerenciar certificados!",
});

export async function loader({ request }: LoaderArgs) {
  return await Cookies.redirectIfAuthenticated(request);
}

const FORM_DATA_NAME = {
  ID_TOKEN: "idToken",
  EMAIL: "email",
  PASSWORD: "password",
};

export async function action({ request }: ActionArgs) {
  const form = await request.formData();
  const idToken = form.get(FORM_DATA_NAME.ID_TOKEN)?.toString();
  if (!idToken) {
    throw badRequest(`We couldn't get your credentials`);
  }

  const jwt = await Firebase.Server.signIn(idToken, Cookies.EXPIRES_IN);
  return Cookies.signIn(jwt);
}

export default function LoginRoute() {
  const fetcher = useFetcher();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  async function handleSignIn(email: string, password: string) {
    setLoading(true);
    setError("");
    try {
      const { user } = await Firebase.signInWithEmailAndPassword(
        email,
        password
      );
      const idToken = await user.getIdToken();
      fetcher.submit({ idToken }, { method: "post", action: "/login" });
    } catch (error) {
      setError("Não foi possível realizar o login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Grid textAlign="center" style={{ height: "100vh" }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Segment>
          <Header as="h2" textAlign="center">
            Login
          </Header>

          <SUIForm
            size="large"
            onSubmit={(event) => {
              const formData = new FormData(event.currentTarget);
              const email = String(formData.get(FORM_DATA_NAME.EMAIL));
              const password = String(formData.get(FORM_DATA_NAME.PASSWORD));
              handleSignIn(email, password);
            }}
          >
            <Segment stacked>
              <SUIForm.Input
                name={FORM_DATA_NAME.EMAIL}
                fluid
                icon="user"
                iconPosition="left"
                placeholder="E-mail"
              />
              <SUIForm.Input
                name={FORM_DATA_NAME.PASSWORD}
                fluid
                icon="lock"
                iconPosition="left"
                placeholder="Senha"
                type="password"
                autoComplete="current-password"
              />

              <Button
                loading={loading}
                type="submit"
                primary
                fluid
                size="large"
              >
                Entrar
              </Button>
            </Segment>
          </SUIForm>

          {error && (
            <Message negative>
              <Message.Header>Algum erro ocorreu</Message.Header>
              <p>{error}</p>
            </Message>
          )}

          <Message>
            Ainda não tem uma conta? <Link to="/signup">Cadastre-se</Link>
          </Message>
        </Segment>
      </Grid.Column>
    </Grid>
  );
}
