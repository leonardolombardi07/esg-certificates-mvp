import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { Link, useFetcher } from "@remix-run/react";
import React from "react";
import {
  Header,
  Segment,
  Grid,
  Form as SUIForm,
  Button,
  Message,
} from "semantic-ui-react";
import { APP_NAME } from "~/constants";
import * as Cookies from "~/services/cookies";
import * as Firebase from "~/services/firebase";
import { badRequest } from "~/utils/response";

export const meta: MetaFunction = () => ({
  title: `${APP_NAME} | Cadastro"`,
  description: "Cadastre-se para solicitar certificados!",
});

export async function loader({ request }: LoaderArgs) {
  return await Cookies.redirectIfAuthenticated(request);
}

const FORM_DATA_NAME = {
  ID_TOKEN: "idToken",
  EMAIL: "email",
  PASSWORD: "password",
  PASSWORD_CONFIRMATION: "passwordConfirmation",
};

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData();
  const idToken = form.get(FORM_DATA_NAME.ID_TOKEN)?.toString();
  if (!idToken) {
    throw badRequest(`We couldn't get your credentials`);
  }

  const jwt = await Firebase.Server.signIn(idToken, Cookies.EXPIRES_IN);
  return Cookies.signIn(jwt);
};

export default function SignUpRoute() {
  const fetcher = useFetcher();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  async function handleSignUp(email: string, password: string) {
    setLoading(true);
    setError("");
    try {
      const { user } = await Firebase.createUserWithEmailAndPassword(
        email,
        password
      );
      const idToken = await user.getIdToken();
      fetcher.submit({ idToken }, { method: "post", action: "/signup" });
    } catch (error) {
      setError("Não foi possível realizar o cadastro");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Grid textAlign="center" style={{ height: "100vh" }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Segment>
          <Header as="h2" textAlign="center">
            Cadastro
          </Header>

          <SUIForm
            size="large"
            onSubmit={(event) => {
              const formData = new FormData(event.currentTarget);
              const email = String(formData.get(FORM_DATA_NAME.EMAIL));
              if (!email) return setError("É necessário um e-mail");

              const password = String(formData.get(FORM_DATA_NAME.PASSWORD));
              if (!password) return setError("É necessária uma senha");

              const passwordConf = String(
                formData.get(FORM_DATA_NAME.PASSWORD_CONFIRMATION)
              );
              if (password !== passwordConf)
                return setError("A senha e confirmação da senha devem iguais");

              handleSignUp(email, password);
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
                autoComplete="new-password"
              />

              <SUIForm.Input
                name={FORM_DATA_NAME.PASSWORD_CONFIRMATION}
                fluid
                icon="lock"
                iconPosition="left"
                placeholder="Confirme a senha"
                type="password"
                autoComplete="new-password"
              />

              <Button
                loading={loading}
                type="submit"
                primary
                fluid
                size="large"
              >
                Cadastrar
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
            Já se cadastrou? <Link to="/login">Entre</Link>
          </Message>
        </Segment>
      </Grid.Column>
    </Grid>
  );
}
