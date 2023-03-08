import type { LabelProps } from "semantic-ui-react";
import { Label, Icon } from "semantic-ui-react";
import type { Process } from "~/types";

interface ProcessCategoryLabelProps extends LabelProps {
  category: Process["category"];
}

function ProcessCategoryLabel({
  category,
  ...rest
}: ProcessCategoryLabelProps) {
  const isShip = category === "ship";
  return (
    <Label color={isShip ? "blue" : "grey"} {...rest}>
      <Icon name={isShip ? "ship" : "question"} />
      {isShip ? "Navio" : "Categoria desconhecida"}
    </Label>
  );
}

export { ProcessCategoryLabel };
