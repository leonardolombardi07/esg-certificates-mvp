import { Segment, Header, Divider } from "semantic-ui-react";
import { NotImplementedMessage } from "~/components";

export default function CreateFlightProcessRoute() {
  return (
    <Segment>
      <Header as="h2">Certificação de Avião</Header>
      <Divider />

      <NotImplementedMessage />
    </Segment>
  );
}
