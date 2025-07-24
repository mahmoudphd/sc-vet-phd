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
  packWeight: string;
  compliance: string;
  status: string;
  comment: string;
};

export default function ProductConfiguration() {
  const [data, setData] = useState<ProductRow[]>([
    {
      productId: "P-001",
      name: "Poultry Product A",
      components: "",
      packagingShape: "",
      packagingType: "",
      capType: "",
      packWeight: "",
      compliance: "",
      status: "Pending",
      comment: "",
    },
  ]);

  const handleChange = (index: number, key: keyof ProductRow, value: string) => {
    const updated = [...data];
    updated[index][key] = value;
    setData(updated);
  };

  return (
    <Card>
      <Flex justify="between" align="center" mb="4">
        <Heading size="5">Production Design Info</Heading>
        <Button
          onClick={() =>
            setData([
              ...data,
              {
                productId: `P-${String(data.length + 1).padStart(3, "0")}`,
                name: "",
                components: "",
                packagingShape: "",
                packagingType: "",
                capType: "",
                packWeight: "",
                compliance: "",
                status: "Pending",
                comment: "",
              },
            ])
          }
        >
          Add Row
        </Button>
      </Flex>

      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Product ID</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Components</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Packaging Shape</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Packaging Type</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Cap Type</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Pack Weight (g)</Table.ColumnHeaderCell>
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
                        onSelect={() => handleChange(index, "name", name)}
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
                  onChange={(e) => handleChange(index, "components", e.target.value)}
                />
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
                    <Button variant="soft">{row.packagingType || "Select"}</Button>
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
                    <Button variant="soft">{row.capType || "Select"}</Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content>
                    {capTypes.map((cap) => (
                      <DropdownMenu.Item
                        key={cap}
                        onSelect={() => handleChange(index, "capType", cap)}
                      >
                        {cap}
                      </DropdownMenu.Item>
                    ))}
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </Table.Cell>

              <Table.Cell>
                <TextField
                  value={row.packWeight}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      handleChange(index, "packWeight", value);
                    }
                  }}
                  placeholder="grams"
                />
              </Table.Cell>

              <Table.Cell>
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    <Button variant="soft">{row.compliance || "Select"}</Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content>
                    {complianceOptions.map((opt) => (
                      <DropdownMenu.Item
                        key={opt}
                        onSelect={() => handleChange(index, "compliance", opt)}
                      >
                        {opt}
                      </DropdownMenu.Item>
                    ))}
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </Table.Cell>

              <Table.Cell>
                <Text color="gray">{row.status}</Text>
              </Table.Cell>

              <Table.Cell>
                <TextField
                  value={row.comment}
                  onChange={(e) => handleChange(index, "comment", e.target.value)}
                />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Card>
  );
}
