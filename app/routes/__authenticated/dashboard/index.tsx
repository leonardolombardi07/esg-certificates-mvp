import type { LoaderArgs } from "@remix-run/node";
import React from "react";
import {
  Segment,
  Header,
  Divider,
  Statistic,
  Icon,
  Grid,
} from "semantic-ui-react";
import { FakeDataMessage } from "~/components";
import {
  VictoryPie,
  VictoryBar,
  VictoryChart,
  VictoryTooltip,
  Slice,
  VictoryAxis,
  VictoryGroup,
} from "victory";

export async function loader({ request }: LoaderArgs) {
  return null;
}

export default function DashboardIndexRoute() {
  return (
    <Segment style={{ minHeight: "100vh" }}>
      <Header as="h1">Dashboard</Header>
      <Divider />

      <Dashboard />
    </Segment>
  );
}

function Dashboard() {
  return (
    <Segment>
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
                { x: "Navio X", y: 25 },
                { x: "Transporte Navio Y", y: 10 },
                { x: "Obra Terreno Z", y: 10 },
                { x: "Caminhões de Carga", y: 30 },
              ]}
            />
            <Header as="h3" style={{ marginTop: -40 }}>
              Emissão por Processo
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
