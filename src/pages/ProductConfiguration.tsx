import React, { useState } from "react";
import {
  Card,
  Flex,
  Heading,
  Table,
  Text,
  TextField,
  DropdownMenu,
  Button,
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

const ProductConfiguration = () => {
  const [data, setData] = useState([
    {
      productId: "P001",
      name: "",
      components: "",
      packagingShape: "",
      packagingType: "",
      capType: "",
      packWeight: "",
      compliance: "",
      status: "Active",
      component: "",
    },
  ]);

  const handleChange = (
    index: number,
    field: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const updated = [...data];
    (updated[index] as any)[field] = e.target.value;
    setData(updated);
  };

  const handleDropdownChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updated = [...data];
    (updated[index] as any)[field] = value;
    setData(updated);
  };

  const addRow = () => {
    setData([
      ...data,
      {
        productId: `P00${data.length + 1}`,
        name: "",
        components: "",
        packagingShape: "",
        packagingType: "",
        capType: "",
        packWeight: "",
        compliance: "",
        status: "Active",
        component: "",
      },
    ]);
  };

  return (
    <Card>
      <Heading mb="4">Production Design Info</Heading>
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
                        onSelect={() =>
                          handleDropdownChange(index, "name", name)
                        }
                      >
                        {name}
                      </DropdownMenu.Item>
                    ))}
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </Table.Cell>
              <Table.Cell>
                <TextField.Input
                  value={row.components}
                  onChange={(e) => handleChange(index, "components", e)}
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
                        onSelect={() =>
                          handleDropdownChange(index, "packagingShape", shape)
                        }
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
                        onSelect={() =>
                          handleDropdownChange(index, "packagingType", type)
                        }
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
                        onSelect={() =>
                          handleDropdownChange(index, "capType", cap)
                        }
                      >
                        {cap}
                      </DropdownMenu.Item>
                    ))}
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </Table.Cell>
              <Table.Cell>
                <TextField.Input
                  type="number"
                  value={row.packWeight}
                  onChange={(e) => handleChange(index, "packWeight", e)}
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
                        onSelect={() =>
                          handleDropdownChange(index, "compliance", option)
                        }
                      >
                        {option}
                      </DropdownMenu.Item>
                    ))}
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </Table.Cell>
              <Table.Cell>
                <Text>{row.status}</Text>
              </Table.Cell>
              <Table.Cell>
                <TextField.Input
                  value={row.component}
                  onChange={(e) => handleChange(index, "component", e)}
                />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      <Button onClick={addRow} mt="4">
        Add Product
      </Button>
    </Card>
  );
};

export default ProductConfiguration;
