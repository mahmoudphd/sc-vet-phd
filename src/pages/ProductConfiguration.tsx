import React, { useState } from "react";
import {
  Card,
  Flex,
  Heading,
  Table,
  Button,
  Text,
  TextField,
  DropdownMenu,
  Dialog,
} from "@radix-ui/themes";

const productNames = ["Poultry Product A", "Poultry Product B", "Poultry Product C"];
const packagingShapes = ["Round", "Oval", "Rectangular"];
const packagingTypes = ["Pump", "Floater", "Scroll", "Tube"];
const capTypes = ["Safety Steel", "Flip Top", "Screw Cap"];
const complianceOptions = [
  "ISO 9001:2015 QMS",
  "ISO 14001:2015 EHS",
  "ISO 45001:2018 OHS",
  "ISO 22716:2007 GMP",
  "EDA",
];

type ProductRow = {
  productId: string;
  name: string;
  components: string;
  packagingShape: string;
  packagingType: string;
  capType: string;
  packWeight: number;
  compliance: string;
};

export default function ProductConfiguration() {
  const [rows, setRows] = useState<ProductRow[]>([
    {
      productId: "P-001",
      name: "Poultry Product A",
      components: "Vitamin A, B, D",
      packagingShape: "Round",
      packagingType: "Pump",
      capType: "Flip Top",
      packWeight: 500,
      compliance: "ISO 9001:2015 QMS",
    },
  ]);

  const handleFieldChange = (
    index: number,
    field: keyof ProductRow,
    value: string | number
  ) => {
    const updatedRows = [...rows];
    (updatedRows[index][field] as any) = value;
    setRows(updatedRows);
  };

  const addNewRow = () => {
    setRows([
      ...rows,
      {
        productId: `P-${rows.length + 1}`.padStart(5, "0"),
        name: "",
        components: "",
        packagingShape: "",
        packagingType: "",
        capType: "",
        packWeight: 0,
        compliance: "",
      },
    ]);
  };

  return (
    <Card>
      <Flex justify="between" align="center" mb="4">
        <Heading size="5">Product Configuration</Heading>
        <Button onClick={addNewRow}>Add Product</Button>
      </Flex>

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Product ID</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Components</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Packaging Shape</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Packaging Type</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Cap Type</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Pack Weight (grams)</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Compliance</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rows.map((row, index) => (
            <Table.Row key={index}>
              <Table.Cell>{row.productId}</Table.Cell>
              <Table.Cell>
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    <Button variant="soft">{row.name || "Select"}</Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content>
                    {productNames.map((name) => (
                      <DropdownMenu.Item
                        key={name}
                        onSelect={() => handleFieldChange(index, "name", name)}
                      >
                        {name}
                      </DropdownMenu.Item>
                    ))}
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </Table.Cell>

              <Table.Cell>
                <TextField.Root>
                  <input
                    type="text"
                    value={row.components}
                    onChange={(e) => handleFieldChange(index, "components", e.target.value)}
                  />
                </TextField.Root>
              </Table.Cell>

              <Table.Cell>
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    <Button variant="soft">{row.packagingShape || "Select"}</Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content>
                    {packagingShapes.map((shape) => (
                      <DropdownMenu.Item
                        key={shape}
                        onSelect={() => handleFieldChange(index, "packagingShape", shape)}
                      >
                        {shape}
                      </DropdownMenu.Item>
                    ))}
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </Table.Cell>

              <Table.Cell>
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    <Button variant="soft">{row.packagingType || "Select"}</Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content>
                    {packagingTypes.map((type) => (
                      <DropdownMenu.Item
                        key={type}
                        onSelect={() => handleFieldChange(index, "packagingType", type)}
                      >
                        {type}
                      </DropdownMenu.Item>
                    ))}
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </Table.Cell>

              <Table.Cell>
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    <Button variant="soft">{row.capType || "Select"}</Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content>
                    {capTypes.map((type) => (
                      <DropdownMenu.Item
                        key={type}
                        onSelect={() => handleFieldChange(index, "capType", type)}
                      >
                        {type}
                      </DropdownMenu.Item>
                    ))}
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </Table.Cell>

              <Table.Cell>
                <TextField.Root>
                  <input
                    type="number"
                    value={row.packWeight}
                    onChange={(e) =>
                      handleFieldChange(index, "packWeight", parseInt(e.target.value) || 0)
                    }
                  />
                </TextField.Root>
              </Table.Cell>

              <Table.Cell>
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    <Button variant="soft">{row.compliance || "Select"}</Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content>
                    {complianceOptions.map((option) => (
                      <DropdownMenu.Item
                        key={option}
                        onSelect={() => handleFieldChange(index, "compliance", option)}
                      >
                        {option}
                      </DropdownMenu.Item>
                    ))}
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </Table.Cell>

              <Table.Cell>
                <Dialog.Root>
                  <Dialog.Trigger>
                    <Button variant="soft" color="blue">
                      Configure
                    </Button>
                  </Dialog.Trigger>
                  <Dialog.Content style={{ maxWidth: 500 }}>
                    <Dialog.Title>Product Configuration</Dialog.Title>
                    <Dialog.Description>
                      Here you can configure the selected product.
                    </Dialog.Description>
                    <Text as="p" mt="3">
                      (Keep this area for detailed configuration options...)
                    </Text>
                    <Flex justify="end" mt="4">
                      <Dialog.Close>
                        <Button variant="soft" color="green">
                          Save
                        </Button>
                      </Dialog.Close>
                    </Flex>
                  </Dialog.Content>
                </Dialog.Root>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Card>
  );
}
