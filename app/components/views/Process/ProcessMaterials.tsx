import { Segment, Header, Table } from "semantic-ui-react";
import type { Material } from "~/types";

function ProcessMaterials({ materials }: { materials: Material[] }) {
  return (
    <Segment>
      <Header as="h3">Materiais</Header>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Nome</Table.HeaderCell>
            <Table.HeaderCell>Quantidade</Table.HeaderCell>
            <Table.HeaderCell>Unidade</Table.HeaderCell>
            <Table.HeaderCell>Emissão de Carbono</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {materials.map((item, index) => (
            <Table.Row key={index}>
              <Table.Cell>{item.name}</Table.Cell>
              <Table.Cell>{item.amount}</Table.Cell>
              <Table.Cell>{item.unit}</Table.Cell>
              <Table.Cell>{generateRandomValue(item.name)}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Segment>
  );
}

const memo: any = {};
function generateRandomValue(name: string) {
  if (memo[name]) return memo[name];

  const toMemo = (Math.random() * 1000).toFixed(2);
  memo[name] = toMemo;
  return toMemo;
}

export { ProcessMaterials };
