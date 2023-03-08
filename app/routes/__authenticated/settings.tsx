import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { Link, Outlet, useLocation } from "@remix-run/react";
import React from "react";
import type { SemanticICONS } from "semantic-ui-react";
import {
  Segment,
  Accordion,
  Icon,
  Header,
  Menu,
  Grid,
  Divider,
} from "semantic-ui-react";
import { RouteErrorBoundary } from "~/components";
import { APP_NAME } from "~/constants";
import * as Cookies from "~/services/cookies";

export const meta: MetaFunction = () => ({
  title: `${APP_NAME} | Configurações"`,
  description: "Configure suas preferências e dados!",
});

export async function loader({ request }: LoaderArgs) {
  return await Cookies.redirectIfNotAuthenticated(request);
}

export default function SettingsRoute() {
  return (
    <Segment style={{ minHeight: "100vh" }}>
      <Header as="h1">Configurações</Header>
      <Divider />

      <Accordion as={Menu} vertical fluid>
        <AccordionItem
          title={<AccordionTitle icon="user" title="Perfil" />}
          to={"/settings/profile"}
        />
      </Accordion>
    </Segment>
  );
}

interface AccordionItemProps {
  title: React.ReactNode;
  to: string;
}

function AccordionItem({ title, to }: AccordionItemProps) {
  const { pathname } = useLocation();
  const active = pathname === to;

  function defaultToIndex(path: string) {
    return path === pathname ? "/settings/" : path;
  }

  return (
    <React.Fragment>
      <Menu.Item>
        <Accordion.Title as={Link} to={defaultToIndex(to)} active={active}>
          {title}
        </Accordion.Title>

        <Accordion.Content active={active}>
          <Outlet />
        </Accordion.Content>
      </Menu.Item>
    </React.Fragment>
  );
}

function AccordionTitle({
  icon,
  title,
}: {
  icon: SemanticICONS;
  title: string;
}) {
  return (
    <Grid style={{ padding: 2 }}>
      <Grid.Column floated="left" width={13} verticalAlign="middle">
        <Header as="h3">
          <Icon name={icon} size="huge" />
          <Header.Content>{title}</Header.Content>
        </Header>
      </Grid.Column>

      <Grid.Column
        floated="right"
        textAlign={"right"}
        width={1}
        verticalAlign="middle"
      >
        <Segment.Inline>
          <Icon name="dropdown" />
        </Segment.Inline>
      </Grid.Column>
    </Grid>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return <RouteErrorBoundary error={error} />;
}
