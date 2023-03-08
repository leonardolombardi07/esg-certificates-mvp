import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import {
  Segment,
  Header,
  Divider,
  Message,
  Grid,
  Icon,
  Card,
  Button,
} from "semantic-ui-react";
import { Process } from "~/components";
import * as Firebase from "~/services/firebase";
import * as Cookies from "~/services/cookies";

export async function loader({ request }: LoaderArgs) {
  const { uid } = await Cookies.getAuthenticatedUser(request);
  return json({ processes: await Firebase.getAllProcesses(uid) });
}

export default function ProcessesIndexRoute() {
  const data = useLoaderData<typeof loader>();
  return (
    <Segment style={{ minHeight: "100vh" }}>
      <Header as="h1">Processos</Header>
      <Divider />

      <Segment>
        <Grid stackable>
          <Grid.Column widescreen={4}>
            <CreateProcessButton />
          </Grid.Column>

          <EmptyProcesses visible={data.processes.length === 0} />

          {data.processes.map((process) => (
            <Grid.Column widescreen={4} key={process.id}>
              <Process.Card {...process} />
            </Grid.Column>
          ))}
        </Grid>
      </Segment>
    </Segment>
  );
}

function CreateProcessButton() {
  return (
    <Card
      as={Button}
      style={{ height: 250, placeItems: "center" }}
      centered
      color="grey"
    >
      <Card.Content
        as={Link}
        to="/processes/create/ship"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Icon name="plus circle" size="huge" style={{ color: "white" }} />
        <Header style={{ color: "white", marginTop: 10 }}>
          Adicionar novo processo
        </Header>
      </Card.Content>
    </Card>
  );
}

function EmptyProcesses({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <Grid.Column widescreen={12}>
      <Message icon info size="big">
        <Icon name={"leaf"} />
        <Message.Content>
          <Message.Header>Você não tem nenhum processo!</Message.Header>
          Clique em <b>"Adicionar novo processo"</b> para começar.
        </Message.Content>
      </Message>
    </Grid.Column>
  );
}
