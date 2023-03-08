import { Form as SUIForm, Button, Segment, Popup } from "semantic-ui-react";
import { Form as RemixForm } from "@remix-run/react";
import { useRootData } from "~/root";
import { NotImplementedMessage } from "~/components";

export default function SettingsProfileRoute() {
  const { user } = useRootData();
  return (
    <Segment basic style={{ padding: 0 }}>
      <p>
        Essas informações aparecerão em seu perfil público e poderão ser vistas
        por outros membros.
      </p>

      <SUIForm as={RemixForm} method="post" action={"/settings/profile"}>
        <SUIForm.Group widths="equal">
          <SUIForm.Input
            value={user?.email}
            label="E-mail"
            icon="mail"
            required
            readonly
          />
        </SUIForm.Group>

        <DisabledButton />
      </SUIForm>
    </Segment>
  );
}

function DisabledButton() {
  return (
    <Popup
      trigger={
        <div>
          <Button primary disabled>
            Salvar alterações
          </Button>
        </div>
      }
    >
      <Popup.Content>
        <NotImplementedMessage />
      </Popup.Content>
    </Popup>
  );
}
