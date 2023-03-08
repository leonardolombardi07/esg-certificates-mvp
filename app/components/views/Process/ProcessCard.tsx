import { Link, useLocation } from "@remix-run/react";
import { Card } from "semantic-ui-react";
import type { Process } from "~/types";
import { ProcessCategoryLabel } from "./ProcessCategoryLabel";
import { ProcessStatusLabel } from "./ProcessStatusLabel";

interface ProcessCardProps extends Process {}

function ProcessCard({
  id,
  name,
  description,
  category,
  status,
}: ProcessCardProps) {
  const { pathname } = useLocation();
  return (
    <Card as={Link} to={`${pathname}/${id}`} centered>
      <Card.Content>
        <Card.Header>{name}</Card.Header>
      </Card.Content>

      <Card.Content description={description} />
      <Card.Content extra>
        <ProcessStatusLabel status={status} style={{ display: "block" }} />
        <ProcessCategoryLabel
          category={category}
          style={{ display: "block", marginTop: 10 }}
        />
      </Card.Content>
    </Card>
  );
}

export { ProcessCard };
