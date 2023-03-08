import type {
  ActionArgs,
  LoaderArgs,
  MetaFunction,
  TypedResponse,
} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  useLoaderData,
  useLocation,
  useNavigate,
  useSubmit,
} from "@remix-run/react";
import React from "react";
import { Segment, Header, Icon, Button, Menu } from "semantic-ui-react";
import type { Process as IProcess } from "~/types";
import * as Firebase from "~/services/firebase";
import { badRequest } from "~/utils/response";
import { Confirm, Process } from "~/components";

// TODO: fix type on parameters
export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return { title: "No process", description: "No process found" };
  }

  return {
    title: `Processo "${data?.process?.name}"`,
    description: `Manage your"${data?.process?.name}" process and much more`,
  };
};

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
    process: IProcess;
  }>;
}

const ACTION_INTENTS = {
  DELETE_PROCESS: "deleteProcess",
} as const;

type ActionIntent = typeof ACTION_INTENTS[keyof typeof ACTION_INTENTS];

export async function action({ request, params }: ActionArgs) {
  const formData = await request.formData();

  const processId = String(params.processId);
  if (!processId) {
    throw badRequest({ error: `Process with id "${processId}" is not valid` });
  }

  const intent = String(formData.get("intent"));
  switch (intent as ActionIntent) {
    case "deleteProcess": {
      await Firebase.deleteProcess(processId);
      return redirect("/processes");
    }

    default:
      if (!Object.values(ACTION_INTENTS).includes(intent as any)) {
        throw badRequest({ error: `The intent "${intent}" is not supported` });
      }
  }

  return json({ error: null });
}

interface ProcessProps {
  process: IProcess;
}

interface ProcessRouteProps extends ProcessProps {
  canDelete: boolean;
  canEdit: boolean;
  canGoBack: boolean;
}

export default function ProcessRoute() {
  const { process } = useLoaderData<typeof loader>();
  return (
    <Segment style={{ padding: 0, minHeight: "100vh" }}>
      <HeaderMenu canGoBack canEdit canDelete process={process} />

      <Segment basic>
        <Header as="h1">
          {process?.name}
          <Header.Subheader style={{ marginTop: 5 }}>
            <Process.StatusLabel
              status={process?.status}
              style={{ marginLeft: 0 }}
            />
            <Process.CategoryLabel category={process?.category} />
          </Header.Subheader>
        </Header>

        <Segment>
          <Header as="h3">Descrição</Header>
          <p>{process?.description}</p>
        </Segment>

        <Process.Materials materials={process?.materials} />
      </Segment>
    </Segment>
  );
}

function HeaderMenu({
  process,
  canDelete,
  canEdit,
  canGoBack,
}: ProcessRouteProps) {
  const navigate = useNavigate();

  return (
    <Menu style={{ marginBottom: 0 }} size="huge">
      {canGoBack && (
        <Menu.Item onClick={() => navigate(-1)}>
          <Button icon style={{ backgroundColor: "transparent" }}>
            <Icon name="arrow left" />
          </Button>
        </Menu.Item>
      )}

      <Menu.Menu position="right">
        {canEdit && (
          <Menu.Item onClick={() => navigate(`/processes/edit/${process.id}`)}>
            <Button icon style={{ backgroundColor: "transparent" }}>
              <Icon name="edit" />
            </Button>
          </Menu.Item>
        )}

        {canDelete && <DeleteMenuItem process={process} />}
      </Menu.Menu>
    </Menu>
  );
}

function DeleteMenuItem({ process }: ProcessProps) {
  const [isConfirming, setIsConfirming] = React.useState(false);
  const { pathname } = useLocation();
  const submit = useSubmit();

  function onConfirm() {
    setIsConfirming(false);
    submit(
      { intent: ACTION_INTENTS.DELETE_PROCESS },
      { action: `${pathname}`, method: "post" }
    );
  }

  return (
    <>
      <Menu.Item onClick={() => setIsConfirming(true)}>
        <Button icon style={{ backgroundColor: "transparent" }}>
          <Icon name="trash" />
        </Button>
      </Menu.Item>

      <Confirm
        size="large"
        open={isConfirming}
        header={`Deletando o processo "${process.name}"`}
        message="Tem certeza que deseja deletá-lo?"
        cancelButton="Não"
        confirmButton="Sim"
        onCancel={() => setIsConfirming(false)}
        onConfirm={onConfirm}
        closeOnEscape
        closeOnDimmerClick
      />
    </>
  );
}
