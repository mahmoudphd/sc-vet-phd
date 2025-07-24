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
} from "@radix-ui/themes";

const productNames = ["Poultry Product A", "Poultry Product B", "Poultry Product C"];
const shapes = ["Round", "Oval", "Rectangular"];
const types = ["Pump", "Floater", "Scroll", "Tube"];
const caps = ["Safety Steel", "Flip Top", "Screw Cap"];
const complianceOptions = [
  "ISO 9001:2015 QMS",
  "ISO 14001:2015 EHS",
  "ISO 45001:2018 OHS",
  "ISO 22716:2007 GMP",
  "EDA",
];

interface ProductRow {
  productId: string;
  name: string;
  components: string;
  shape: string;
  type: string;
  cap: string;
  weight: string;
  compliance: string;
  status: string;
  comment: string;
}

export default function ProductConfiguration() {
  const [data, setData] = useState<ProductRow[]>([
    {
      productId: "001",
      name: "Poultry Product A",
      components: "",
      shape: "",
      type: "",
      cap: "",
      weight: "",
      compliance: "",
      status: "Active",
      comment: "",
    },
  ]);

  const handleInputChange = (index: number, field: keyof ProductRow, value: string) => {
    const newData = [...data];
    newData[index][field] = value;
    setData(newData);
  };

  const addRow = () => {
    setData([
      ...data,
      {
        productId: `${data.length + 1}`.padStart(3, "0"),
        name: "",
        components: "",
        shape: "",
        type: "",
        cap: "",
        weight: "",
        compliance: "",
        status: "Active",
        comment: "",
      },
    ]);
  };

  return (
    <Card>
      <Heading mb="4">Production Design Info</Heading>
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
            <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Comment</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.map((row, index) => (
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
                        onSelect={() => handleInputChange(index, "name", name)}
                      >
                        {name}
                      </DropdownMenu.Item>
                    ))}
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </Table.Cell>
              <Table.Cell>
                <TextField
                  value={row.components}
                  onChange={(e) => handleInputChange(index, "components", e.target.value)}
                />
              </Table.Cell>
              <Table.Cell>
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    <Button variant="soft">{row.shape || "Select"}</Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content>
                    {shapes.map((shape) => (
                      <DropdownMenu.Item
                        key={shape}
                        onSelect={() => handleInputChange(index, "shape", shape)}
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
                    <Button variant="soft">{row.type || "Select"}</Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content>
                    {types.map((type) => (
                      <DropdownMenu.Item
                        key={type}
                        onSelect={() => handleInputChange(index, "type", type)}
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
                    <Button variant="soft">{row.cap || "Select"}</Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content>
                    {caps.map((cap) => (
                      <DropdownMenu.Item
                        key={cap}
                        onSelect={() => handleInputChange(index, "cap", cap)}
                      >
                        {cap}
                      </DropdownMenu.Item>
                    ))}
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </Table.Cell>
              <Table.Cell>
                <TextField
                  type="number"
                  value={row.weight}
                  onChange={(e) => handleInputChange(index, "weight", e.target.value)}
                />
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
                        onSelect={() => handleInputChange(index, "compliance", option)}
                      >
                        {option}
                      </DropdownMenu.Item>
                    ))}
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </Table.Cell>
              <Table.Cell>
                <TextField
                  value={row.status}
                  onChange={(e) => handleInputChange(index, "status", e.target.value)}
                />
              </Table.Cell>
              <Table.Cell>
                <TextField
                  value={row.comment}
                  onChange={(e) => handleInputChange(index, "comment", e.target.value)}
                />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      <Flex mt="4" justify="end">
        <Button onClick={addRow}>Add Product</Button>
      </Flex>
    </Card>
  );
}
