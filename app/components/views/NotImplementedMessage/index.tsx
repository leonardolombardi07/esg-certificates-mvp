import { Message, Icon } from "semantic-ui-react";

function NotImplementedMessage() {
  return (
    <Message icon warning size="huge">
      <Icon name="warning sign" />

      <Message.Content>
        <Message.Header>Ainda não implementado 😥</Message.Header>
        Estamos trabalhando nisso, conte conosco!
      </Message.Content>
    </Message>
  );
}

export { NotImplementedMessage };
