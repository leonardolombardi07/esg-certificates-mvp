import type { LoaderArgs } from "@remix-run/node";
import { Segment, Header, Divider, Message } from "semantic-ui-react";

export async function loader({ request }: LoaderArgs) {
  return null;
}

export default function SettingsIndexRoute() {
  return (
    <Segment style={{ minHeight: "100vh" }}>
      <Header as="h1">Configurações</Header>
      <Divider />

      <Message warning size="huge">
        <Message.Header>Não implementado</Message.Header>
      </Message>
    </Segment>
  );
}
