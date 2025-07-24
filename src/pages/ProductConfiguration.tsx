// src/pages/ProductConfiguration.tsx
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

// تعريف نوع البيانات مع دعم الوصول الديناميكي
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
  component: string;
  [key: string]: string; // 👈 حل المشكلة
};

// البيانات الافتراضية
const defaultRows: ProductRow[] = [
  {
    productId: "PD-A",
    name: "Poultry Drug Product A",
    components: "Vitamin B1, B2, B12",
    packagingShape: "Round",
    packagingType: "Pump",
    capType: "Flip Top",
    packWeight: "500",
    compliance: "ISO 9001:2015 QMS",
    status: "Active",
    component: "101",
  },
];

// القوائم المنسدلة
const nameOptions = ["Poultry Drug Product A", "Poultry Drug Product B"];
const shapeOptions = ["Round", "Oval", "Rectangular"];
const typeOptions = ["Pump", "Floater", "Scroll", "Tube"];
const capOptions = ["Safety Steel", "Flip Top", "Screw Cap"];
const complianceOptions = [
  "ISO 9001:2015 QMS",
  "ISO 14001:2015 EHS",
  "ISO 45001:2018 OHS",
  "ISO 22716:2007 GMP",
  "EDA",
];

export default function ProductConfiguration() {
  const [rows, setRows] = useState<ProductRow[]>(defaultRows);

  const handleChange = (index: number, key: string, value: string) => {
    const updated = [...rows];
    updated[index][key] = value;
    setRows(updated);
  };

  return (
    <Card style={{ padding: 24 }}>
      <Heading size="5" mb="4">
        Production Design Info
      </Heading>
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Product ID</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Components</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Packaging Shape</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Packaging Type</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Cap Type</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Pack Weight (gram)</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Compliance</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Component</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rows.map((row, index) => (
            <Table.Row key={index}>
              <Table.Cell>{row.productId}</Table.Cell>
              <Table.Cell>
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    <Button variant="soft">{row.name}</Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content>
                    {nameOptions.map((option) => (
                      <DropdownMenu.Item
                        key={option}
                        onSelect={() =>
                          handleChange(index, "name", option)
                        }
                      >
                        {option}
                      </DropdownMenu.Item>
                    ))}
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </Table.Cell>
              <Table.Cell>
                <TextField.Input
                  value={row.components}
                  onChange={(e) =>
                    handleChange(index, "components", e.target.value)
                  }
                />
              </Table.Cell>
              <Table.Cell>
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    <Button variant="soft">{row.packagingShape}</Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content>
                    {shapeOptions.map((option) => (
                      <DropdownMenu.Item
                        key={option}
                        onSelect={() =>
                          handleChange(index, "packagingShape", option)
                        }
                      >
                        {option}
                      </DropdownMenu.Item>
                    ))}
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </Table.Cell>
              <Table.Cell>
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    <Button variant="soft">{row.packagingType}</Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content>
                    {typeOptions.map((option) => (
                      <DropdownMenu.Item
                        key={option}
                        onSelect={() =>
                          handleChange(index, "packagingType", option)
                        }
                      >
                        {option}
                      </DropdownMenu.Item>
                    ))}
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </Table.Cell>
              <Table.Cell>
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    <Button variant="soft">{row.capType}</Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content>
                    {capOptions.map((option) => (
                      <DropdownMenu.Item
                        key={option}
                        onSelect={() =>
                          handleChange(index, "capType", option)
                        }
                      >
                        {option}
                      </DropdownMenu.Item>
                    ))}
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </Table.Cell>
              <Table.Cell>
                <TextField.Input
                  type="number"
                  value={row.packWeight}
                  onChange={(e) =>
                    handleChange(index, "packWeight", e.target.value)
                  }
                />
              </Table.Cell>
              <Table.Cell>
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    <Button variant="soft">{row.compliance}</Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content>
                    {complianceOptions.map((option) => (
                      <DropdownMenu.Item
                        key={option}
                        onSelect={() =>
                          handleChange(index, "compliance", option)
                        }
                      >
                        {option}
                      </DropdownMenu.Item>
                    ))}
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </Table.Cell>
              <Table.Cell>
                <TextField.Input
                  value={row.status}
                  onChange={(e) =>
                    handleChange(index, "status", e.target.value)
                  }
                />
              </Table.Cell>
              <Table.Cell>
                <TextField.Input
                  value={row.component}
                  onChange={(e) =>
                    handleChange(index, "component", e.target.value)
                  }
                />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Card>
  );
}
