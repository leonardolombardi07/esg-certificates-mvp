import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form as RemixForm, useNavigate } from "@remix-run/react";
import React from "react";
import type {
  AccordionTitleProps,
  InputOnChangeData,
  DropdownProps,
} from "semantic-ui-react";
import {
  Segment,
  Header,
  Divider,
  Form as SUIForm,
  Table,
  Button,
  Icon,
  Accordion,
} from "semantic-ui-react";
import type { Material } from "~/types";
import { invariant } from "~/utils/lib";
import * as Firebase from "~/services/firebase";

const FORM_DATA_FIELD = {
  NAME: "name",
  DESCRIPTION: "description",
  MATERIAL: {
    NAME: "materialName",
    AMOUNT: "materialAmount",
    UNIT: "materialUnit",
  },
};

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();

  const name = formData.get(FORM_DATA_FIELD.NAME);
  invariant(typeof name === "string", `Name "${name}" must be a string.`);

  const description = formData.get(FORM_DATA_FIELD.DESCRIPTION);
  invariant(
    typeof description === "string",
    `Description "${description}" must be a string.`
  );

  const materialNames = formData.getAll(FORM_DATA_FIELD.MATERIAL.NAME);
  materialNames.every((name) =>
    invariant(
      typeof name === "string",
      `Material name "${name}" must be a string`
    )
  );

  const materialAmounts = formData
    .getAll(FORM_DATA_FIELD.MATERIAL.AMOUNT)
    .map(Number);
  materialAmounts.every((amount) =>
    invariant(!isNaN(amount), `Material amount "${amount}" must be a number`)
  );

  const materialUnits = formData.getAll(FORM_DATA_FIELD.MATERIAL.UNIT);
  materialUnits.every((unit) =>
    invariant(
      ["kg", "ton"].includes(String(unit)),
      `Material unit "${unit}" must be kg or ton`
    )
  );

  const materials = materialNames
    .map((name, index) => ({
      name,
      amount: materialAmounts[index],
      unit: materialUnits[index],
    }))
    // VERY IMPORTANT: removing "next" material
    // TODO: we should have a better way to omit
    // next from this values (specially for validation)
    .slice(0, -1) as unknown as Material[];

  await Firebase.createProcess({
    name,
    description,
    category: "ship",
    materials,
  });
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return redirect("/processes");
}

export default function CreateShipProcessRoute() {
  const navigate = useNavigate();

  function onCancel() {
    navigate("/processes");
  }

  return (
    <Segment>
      <Header as="h2">Certificação de Navio</Header>
      <Divider />

      <SUIForm as={RemixForm} method="post" action="/processes/create/ship">
        <SUIForm.Group>
          <div style={{ width: "100%", margin: 10 }}>
            <SUIForm.Input
              name={FORM_DATA_FIELD.NAME}
              label="Nome"
              placeholder={`Nome do navio (exemplo "Pérola Negra")`}
            />

            <SUIForm.TextArea
              name={FORM_DATA_FIELD.DESCRIPTION}
              label="Descrição"
              placeholder={"Conte mais sobre os objetivos do processo.."}
            />
          </div>
        </SUIForm.Group>

        <Sections />

        <SUIForm.Group inline style={{ marginTop: 30 }}>
          <Button
            size={"large"}
            onClick={(event) => {
              event.preventDefault();
              onCancel();
            }}
          >
            Cancelar
          </Button>

          <Button type="submit" primary size="large">
            Adicionar
          </Button>
        </SUIForm.Group>
      </SUIForm>
    </Segment>
  );
}

function Sections() {
  const [activeIndexes, setActiveIndexes] = React.useState<number[]>([0]);

  function onClick(event: any, titleProps: AccordionTitleProps) {
    const { index } = titleProps;
    if (typeof index !== "number") return;

    setActiveIndexes(
      activeIndexes.includes(index)
        ? activeIndexes.filter((i) => i !== index)
        : [...activeIndexes, index]
    );
  }

  return (
    <Accordion fluid styled>
      <Accordion.Title
        active={activeIndexes.includes(0)}
        index={0}
        onClick={onClick}
      >
        <Icon name="dropdown" />
        Materiais
      </Accordion.Title>
      <Accordion.Content active={activeIndexes.includes(0)}>
        <Materials />
      </Accordion.Content>
    </Accordion>
  );
}

function useSection<Element extends { focus: () => void }, T>(
  initialData: T[],
  initialNext: T
) {
  const [data, setData] = React.useState<T[]>(initialData);
  const [next, setNext] = React.useState<T>(initialNext);
  const nextRef = React.useRef<Element>(null);

  function onAdd() {
    setData([...data, next]);
    setNext(initialNext);
    if (nextRef.current?.focus) {
      nextRef.current?.focus();
    }
  }

  function onEdit(index: number, edited: T) {
    const updatedData: T[] = [...data];
    updatedData[index] = edited;
    setData(updatedData);
  }

  function onDelete(index: number) {
    const updatedData: T[] = [...data];
    updatedData.splice(index, 1);
    setData(updatedData);
  }

  return {
    state: { data, next },
    actions: { setNext, onAdd, onEdit, onDelete },
    refs: { nextRef },
  };
}

function Materials() {
  const {
    state: { data, next },
    actions: { setNext, onAdd, onEdit, onDelete },
    refs: { nextRef },
  } = useSection<HTMLInputElement, Material>([], {
    amount: 0,
    name: "",
    unit: "kg",
  });

  return (
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Nome</Table.HeaderCell>
          <Table.HeaderCell>Quantidade</Table.HeaderCell>
          <Table.HeaderCell>Unidade</Table.HeaderCell>
          <Table.HeaderCell />
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {data.map((item, index) => (
          <MaterialTableRow
            key={index}
            value={item}
            onChangeName={(e) =>
              onEdit(index, { ...item, name: e.target.value })
            }
            onChangeAmount={(e) =>
              onEdit(index, { ...item, amount: e.target.valueAsNumber })
            }
            onChangeUnit={(e, { value }) => {
              onEdit(index, { ...item, unit: value as any });
            }}
            onDelete={() => onDelete(index)}
          />
        ))}

        <MaterialTableRow
          value={next}
          inputRef={nextRef}
          onChangeName={(e) => setNext((n) => ({ ...n, name: e.target.value }))}
          onChangeAmount={(e) =>
            setNext((n) => ({ ...n, amount: e.target.valueAsNumber }))
          }
          onChangeUnit={(e, { value }) =>
            setNext((n) => ({ ...n, unit: value as any }))
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") onAdd();
          }}
        />
      </Table.Body>

      <Table.Footer fullWidth>
        <Table.Row>
          <Table.HeaderCell colSpan="4">
            <Button
              disabled={next.name === ""}
              onClick={(event) => {
                event.preventDefault();
                onAdd();
              }}
              size="small"
              secondary
            >
              Adicionar
              <Icon name="plus" style={{ marginLeft: 5, marginRight: 0 }} />
            </Button>
          </Table.HeaderCell>
        </Table.Row>
      </Table.Footer>
    </Table>
  );
}

interface MaterialTableRowProps {
  value: Material;

  onChangeName: (
    event: React.ChangeEvent<HTMLInputElement>,
    data: InputOnChangeData
  ) => void;

  onChangeAmount: (
    event: React.ChangeEvent<HTMLInputElement>,
    data: InputOnChangeData
  ) => void;

  onChangeUnit: (
    event: React.SyntheticEvent<HTMLElement>,
    data: DropdownProps
  ) => void;

  onDelete?: () => void;
  inputRef?: React.RefObject<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement> | undefined;
}

function MaterialTableRow({
  value,
  inputRef,
  onChangeName,
  onChangeAmount,
  onChangeUnit,
  onDelete,
}: MaterialTableRowProps) {
  return (
    <Table.Row>
      <Table.Cell>
        <SUIForm.Input
          value={value.name}
          onChange={onChangeName}
          name={FORM_DATA_FIELD.MATERIAL.NAME}
          placeholder={`"Aço"`}
        >
          <input ref={inputRef} />
        </SUIForm.Input>
      </Table.Cell>

      <Table.Cell>
        <SUIForm.Input
          value={value.amount}
          onChange={onChangeAmount}
          name={FORM_DATA_FIELD.MATERIAL.AMOUNT}
          placeholder={`"1000"`}
          type="number"
        />
      </Table.Cell>

      <Table.Cell>
        <input hidden name={FORM_DATA_FIELD.MATERIAL.UNIT} value={value.unit} />
        <SUIForm.Select
          value={value.unit}
          onChange={onChangeUnit}
          placeholder={`"kg"`}
          options={[
            { key: "kg", value: "kg", text: "kg" },
            { key: "ton", value: "ton", text: "ton" },
          ]}
        />
      </Table.Cell>

      <Table.Cell textAlign="center">
        {onDelete && (
          <Button
            icon
            onClick={(event) => {
              event.preventDefault();
              onDelete();
            }}
          >
            <Icon name="trash" />
          </Button>
        )}
      </Table.Cell>
    </Table.Row>
  );
}
