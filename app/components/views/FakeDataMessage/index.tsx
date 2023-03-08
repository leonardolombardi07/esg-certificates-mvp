import { Message, Icon } from "semantic-ui-react";

function FakeDataMessage() {
  return (
    <Message icon info size="huge">
      <Icon name="info" />

      <Message.Content>
        <Message.Header>Atenção!</Message.Header>
        Os dados abaixo foram gerados aleatoriamente.{" "}
        <b>Componentes meramente ilustrativos.</b>
      </Message.Content>
    </Message>
  );
}

export { FakeDataMessage };
