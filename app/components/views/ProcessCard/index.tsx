import { Link, useLocation } from "@remix-run/react";
import { Card, Icon } from "semantic-ui-react";
import type { Process } from "~/types";

interface ProcessCardProps extends Process {}

function ProcessCard({ id, name, description }: ProcessCardProps) {
  const { pathname } = useLocation();
  return (
    <Card as={Link} to={`${pathname}/${id}`} centered>
      <Card.Content header={name} />
      <Card.Content description={description} />
      <Card.Content extra>
        <Icon name="time" />

        <Icon name="calculator" />
      </Card.Content>
    </Card>
  );
}

export { ProcessCard };
