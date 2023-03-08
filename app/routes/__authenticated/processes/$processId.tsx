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
import {
  Segment,
  Header,
  Icon,
  Button,
  Menu,
  Statistic,
  Grid,
} from "semantic-ui-react";
import type { Process as IProcess } from "~/types";
import * as Firebase from "~/services/firebase";
import { badRequest } from "~/utils/response";
import { Confirm, FakeDataMessage, Process } from "~/components";
import {
  VictoryPie,
  VictoryBar,
  VictoryChart,
  VictoryTooltip,
  Slice,
  VictoryAxis,
  VictoryGroup,
} from "victory";

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

      <Segment basic style={{ marginTop: 0 }}>
        <Process.StatusLabel
          status={process?.status}
          style={{ marginLeft: 0 }}
        />
        <Process.CategoryLabel category={process?.category} />

        <Segment>
          <Header as="h3">Descrição</Header>
          <p>{process?.description}</p>
        </Segment>

        <Process.Materials materials={process?.materials} />

        <Dashboard />
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

      <Menu.Item
        header
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Menu.Header as="h2">{process.name}</Menu.Header>
      </Menu.Item>

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

function Dashboard() {
  return (
    <Segment>
      <Header as="h3">Estatísticas</Header>

      <FakeDataMessage />

      <Grid relaxed stackable>
        <Grid.Row columns={1}>
          <Grid.Column textAlign="center">
            <Segment>
              <TotalCarbonEmissions />
            </Segment>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row as={Segment} style={{ margin: "0 2em" }} divided>
          <Grid.Column width={8} textAlign="center">
            <VictoryPie
              style={{
                labels: { fill: "white", fontSize: 10 },
              }}
              dataComponent={<CustomSlice />}
              events={[
                {
                  target: "data",
                  eventHandlers: {
                    onMouseOver: (e) => {
                      return [
                        {
                          target: "data",
                          mutation: () => ({
                            style: { fill: "tomato", width: 30 },
                          }),
                        },
                        {
                          target: "labels",
                          mutation: () => ({ active: true }),
                        },
                      ];
                    },
                    onMouseOut: () => {
                      return [
                        {
                          target: "data",
                          mutation: () => {},
                        },
                        {
                          target: "labels",
                          mutation: () => ({ active: false }),
                        },
                      ];
                    },
                  },
                },
              ]}
              // innerRadius={100}
              labelRadius={120}
              labelComponent={
                <VictoryTooltip
                  x={200}
                  y={270}
                  orientation="top"
                  pointerLength={0}
                  cornerRadius={70}
                  flyoutWidth={140}
                  flyoutHeight={140}
                  flyoutStyle={{ fill: "black" }}
                />
              }
              data={[
                { x: "Motor Principal", y: 25 },
                { x: "Gerador Diesel", y: 10 },
                { x: "Gerador a Gás", y: 5 },
                { x: "Cadeiras a Vapor", y: 20 },
                { x: "Sistemas de Ar-Condicionado", y: 10 },
                { x: "Turbina a gás", y: 30 },
              ]}
            />
            <Header as="h3" style={{ marginTop: -40 }}>
              Emissão por Fonte
              <Header.Subheader>Passe o mouse para visualizar</Header.Subheader>
            </Header>
          </Grid.Column>

          <Grid.Column floated="right" width={8} textAlign="center">
            <VictoryChart>
              <VictoryGroup
                offset={50}
                colorScale={"grayscale"}
                // labels={({ datum }) => datum.title}
              >
                <VictoryBar
                  data={[
                    { x: "Transportes", y: 42 },
                    { x: "Maquinário", y: 30 },
                  ]}
                />

                <VictoryBar
                  data={[
                    { x: "Transportes", y: 100 },
                    { x: "Maquinário", y: 100 },
                  ]}
                />
              </VictoryGroup>

              <VictoryAxis />
              <VictoryAxis dependentAxis tickFormat={(tick) => `${tick}%`} />
            </VictoryChart>

            <Header as="h3" style={{ marginTop: -40 }}>
              Metas de Impacto Ambiental
            </Header>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row verticalAlign="top"></Grid.Row>
      </Grid>
    </Segment>
  );
}

const CustomSlice = (props: any) => {
  const [scale, setScale] = React.useState(1);
  // modified transformation from here
  // https://github.com/FormidableLabs/victory/blob/844109cfe4e40b23a4dcb565e551a5a98015d0c0/packages/victory-pie/src/slice.js#L74
  const transform = `translate(${props.origin.x}, ${props.origin.y}) scale(${scale})`;

  return (
    <Slice
      {...props}
      style={{ ...props.style }}
      events={{
        onMouseOver: (e: any) => {
          if (props.events.onMouseOver) {
            props.events.onMouseOver(e);
          }
          setScale((c) => c * 1.1);
        },
        onMouseOut: (e: any) => {
          if (props.events.onMouseOut) {
            props.events.onMouseOut(e);
          }
          setScale(1);
        },
      }}
      transform={transform}
    />
  );
};

function TotalCarbonEmissions() {
  return (
    <Statistic>
      <Statistic.Value>
        <Icon name="leaf" /> {"  "}
        5.000.000
      </Statistic.Value>
      <Statistic.Label>Emissão Total de Carbono em CO2e</Statistic.Label>
    </Statistic>
  );
}
