import type { LoaderArgs } from "@remix-run/node";
import { Segment, Header, Divider } from "semantic-ui-react";
import { NotImplementedMessage } from "~/components";

export async function loader({ request }: LoaderArgs) {
  return null;
}

export default function DashboardIndexRoute() {
  return (
    <Segment style={{ minHeight: "100vh" }}>
      <Header as="h1">Dashboard</Header>
      <Divider />

      <NotImplementedMessage />
    </Segment>
  );
}
