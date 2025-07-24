import React, { useState } from "react";
import {
  Card,
  Flex,
  Heading,
  Table,
  Button,
  DropdownMenu,
  Text,
} from "@radix-ui/themes";
import * as TextField from "@radix-ui/themes/components/text-field";

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

export default function ProductConfiguration() {
  const [data, setData] = useState([
    {
      productId: "PRD-001",
      name: "Poultry Product A",
      components: "Vitamin A, B, D",
      packagingShape: "Round",
      packagingType: "Pump",
      capType: "Flip Top",
      packWeight: "",
      compliance: "",
      status: "Pending",
      component: "15",
    },
  ]);

  const handleChange = (index: number, field: string, value: string) => {
    const updated = [...data];
    updated[index][field] = value;
    setData(updated);
  };

  const handleAddRow = () => {
    setData([
      ...data,
      {
        productId: `PRD-${data.length + 1}`.padStart(7, "0"),
        name: "",
        components: "",
        packagingShape: "",
        packagingType: "",
        capType: "",
        packWeight: "",
        compliance: "",
        status: "Pending",
        component: "",
      },
    ]);
  };

  return (
    <Card>
      <Heading mb="4">PRODUCTION DESIGN INFO</Heading>
      <Table.Root>
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
            <Table.ColumnHeaderCell>Component</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.map((row, index) => (
            <Table.Row key={index}>
              <Table.Cell>{row.productId}</Table.Cell>

              <Table.Cell>
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    <Button variant="soft" size="1">
                      {row.name || "Select"}
                    </Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content>
                    {productNames.map((name) => (
                      <DropdownMenu.Item
                        key={name}
                        onSelect={() => handleChange(index, "name", name)}
                      >
                        {name}
                      </DropdownMenu.Item>
                    ))}
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </Table.Cell>

              <Table.Cell>
                <TextField.Root>
                  <TextField.Input
                    value={row.components}
                    onChange={(e) => handleChange(index, "components", e.target.value)}
                  />
                </TextField.Root>
              </Table.Cell>

              <Table.Cell>
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    <Button variant="soft" size="1">
                      {row.packagingShape || "Select"}
                    </Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content>
                    {packagingShapes.map((shape) => (
                      <DropdownMenu.Item
                        key={shape}
                        onSelect={() => handleChange(index, "packagingShape", shape)}
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
                    <Button variant="soft" size="1">
                      {row.packagingType || "Select"}
                    </Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content>
                    {packagingTypes.map((type) => (
                      <DropdownMenu.Item
                        key={type}
                        onSelect={() => handleChange(index, "packagingType", type)}
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
                    <Button variant="soft" size="1">
                      {row.capType || "Select"}
                    </Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content>
                    {capTypes.map((type) => (
                      <DropdownMenu.Item
                        key={type}
                        onSelect={() => handleChange(index, "capType", type)}
                      >
                        {type}
                      </DropdownMenu.Item>
                    ))}
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </Table.Cell>

              <Table.Cell>
                <TextField.Root>
                  <TextField.Input
                    type="number"
                    value={row.packWeight}
                    onChange={(e) => handleChange(index, "packWeight", e.target.value)}
                  />
                </TextField.Root>
              </Table.Cell>

              <Table.Cell>
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    <Button variant="soft" size="1">
                      {row.compliance || "Select"}
                    </Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content>
                    {complianceOptions.map((option) => (
                      <DropdownMenu.Item
                        key={option}
                        onSelect={() => handleChange(index, "compliance", option)}
                      >
                        {option}
                      </DropdownMenu.Item>
                    ))}
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </Table.Cell>

              <Table.Cell>
                <Text size="2">{row.status}</Text>
              </Table.Cell>

              <Table.Cell>
                <TextField.Root>
                  <TextField.Input
                    type="number"
                    value={row.component}
                    onChange={(e) => handleChange(index, "component", e.target.value)}
                  />
                </TextField.Root>
              </Table.Cell>

              <Table.Cell>
                <Button variant="solid" size="1" onClick={handleAddRow}>
                  +
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Card>
  );
}
