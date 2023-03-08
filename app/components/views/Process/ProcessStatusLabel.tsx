import type { LabelProps } from "semantic-ui-react";
import { Label, Icon } from "semantic-ui-react";
import type { Process } from "~/types";

interface ProcessStatusLabelProps extends LabelProps {
  status: Process["status"];
}

function ProcessStatusLabel({ status, ...rest }: ProcessStatusLabelProps) {
  const isPending = status === "pending";
  const isProgress = status === "progress";
  const isCanceled = status === "canceled";
  return (
    <Label
      color={
        isPending
          ? "yellow"
          : isCanceled
          ? "red"
          : isProgress
          ? "blue"
          : "green"
      }
      {...rest}
    >
      <Icon
        name={
          isPending
            ? "time"
            : isCanceled
            ? "close"
            : isProgress
            ? "spinner"
            : "check"
        }
      />

      {isPending
        ? "Aguardando aprovação"
        : isCanceled
        ? "Cancelado"
        : isProgress
        ? "blue"
        : "Certificado"}
    </Label>
  );
}

export { ProcessStatusLabel };
