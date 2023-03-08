import { NavLink, Outlet } from "@remix-run/react";
import type { SemanticICONS } from "semantic-ui-react";
import { Segment, Header, Divider, Button, Icon } from "semantic-ui-react";

export default function CreateProcessRoute() {
  return (
    <Segment style={{ minHeight: "100vh" }}>
      <Header as="h1">Adicionar novo processo</Header>
      <Divider />

      <Type />

      <Outlet />
    </Segment>
  );
}

function Type() {
  return (
    <Segment>
      <Header as="h2">Selecione o Tipo de Processo</Header>

      <TypeButton to="/processes/create/ship" name="ship" label="Navio" />
      <TypeButton to="/processes/create/flight" name="plane" label="Avião" />
    </Segment>
  );
}

function TypeButton({
  to,
  name,
  label,
}: {
  to: string;
  name: SemanticICONS;
  label: string;
}) {
  return (
    <Button
      as={NavLink}
      to={to}
      icon
      size="massive"
      style={({ isActive }: any) => ({
        background: isActive ? "lightgrey" : "transparent",
        border: "solid 1px lightgrey",
      })}
    >
      <Icon name={name} />
      <p style={{ fontSize: 14 }}>{label}</p>
    </Button>
  );
}
