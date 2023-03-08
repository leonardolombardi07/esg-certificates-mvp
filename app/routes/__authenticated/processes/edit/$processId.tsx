import type { LoaderArgs, TypedResponse } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { Segment, Header, Divider, Button, Icon } from "semantic-ui-react";
import { NotImplementedMessage } from "~/components";
import * as Firebase from "~/services/firebase";
import type { Process } from "~/types";
import { badRequest } from "~/utils/response";

export async function loader({ params }: LoaderArgs) {
  if (!params.processId) {
    throw badRequest("No process id found!");
  }

  const process = await Firebase.getProcess(params.processId);
  if (!process) {
    throw badRequest(`Process for  process id "${params.processId}" not found`);
  }

  // Fix: something related to
  // https://github.com/remix-run/remix/issues/3931
  // We don't get correct types when importing the loader
  return json({ process }) as TypedResponse<{
    process: Process;
  }>;
}

export default function EditProcessByIdRoute() {
  const { process } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  return (
    <Segment style={{ minHeight: "100vh" }}>
      <Header as="h1">Editar processo "{process?.name}"</Header>
      <Divider />

      <Button size="big" icon onClick={() => navigate(-1)}>
        <Icon name="arrow left" />
        Voltar
      </Button>

      <NotImplementedMessage />
    </Segment>
  );
}
