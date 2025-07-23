import React, { useState } from "react";
import {
  Box,
  Card,
  Flex,
  Heading,
  Select,
  Table,
  Text,
  TextField,
  Button,
} from "@radix-ui/themes";

const incentiveOptions = [
  "Greater volumes",
  "Longer contracts",
  "Technical support",
  "Marketing support",
];

type RawMaterial = {
  item: string;
  qty: number;
  unitPrice: number;
  cost: number;
  solution: string;
};

export default function BatchCosting() {
  const [supplierTier, setSupplierTier] = useState("Tier 1");
  const [transactionVolume, setTransactionVolume] = useState("");
  const [componentCriticality, setComponentCriticality] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [product, setProduct] = useState("Product A");
  const [supplier, setSupplier] = useState("Supplier X");

  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([
    {
      item: "Material A",
      qty: 100,
      unitPrice: 2.5,
      cost: 250,
      solution: "",
    },
    {
      item: "Material B",
      qty: 200,
      unitPrice: 1.2,
      cost: 240,
      solution: "",
    },
  ]);

  const handleSolutionChange = (index: number, value: string) => {
    const updated = [...rawMaterials];
    updated[index].solution = value;
    setRawMaterials(updated);
  };

  return (
    <Box p="4">
      <Heading mb="4">Open Book Accounting Dashboard</Heading>

      <Flex gap="4" mb="4" wrap="wrap">
        <Select.Root value={supplier} onValueChange={setSupplier}>
          <Select.Trigger />
          <Select.Content>
            <Select.Item value="Supplier X">Supplier X</Select.Item>
            <Select.Item value="Supplier Y">Supplier Y</Select.Item>
            <Select.Item value="Supplier Z">Supplier Z</Select.Item>
          </Select.Content>
        </Select.Root>

        <Select.Root value={product} onValueChange={setProduct}>
          <Select.Trigger />
          <Select.Content>
            <Select.Item value="Product A">Product A</Select.Item>
            <Select.Item value="Product B">Product B</Select.Item>
          </Select.Content>
        </Select.Root>

        <Select.Root value={currency} onValueChange={setCurrency}>
          <Select.Trigger />
          <Select.Content>
            <Select.Item value="USD">USD</Select.Item>
            <Select.Item value="EGP">EGP</Select.Item>
          </Select.Content>
        </Select.Root>
      </Flex>

      <Flex gap="4" mb="4" wrap="wrap">
        <Card>
          <Text size="2" weight="bold">
            Supplier Tier
          </Text>
          <Select.Root value={supplierTier} onValueChange={setSupplierTier}>
            <Select.Trigger />
            <Select.Content>
              <Select.Item value="Tier 1">Tier 1</Select.Item>
              <Select.Item value="Tier 2">Tier 2</Select.Item>
              <Select.Item value="Tier 3">Tier 3</Select.Item>
            </Select.Content>
          </Select.Root>
        </Card>

        <Card>
          <Text size="2" weight="bold">
            Transaction Volume
          </Text>
          <TextField.Root
            placeholder="Enter volume"
            value={transactionVolume}
            onChange={(e) => setTransactionVolume(e.target.value)}
          />
        </Card>

        <Card>
          <Text size="2" weight="bold">
            Component Criticality
          </Text>
          <TextField.Root
            placeholder="Enter criticality"
            value={componentCriticality}
            onChange={(e) => setComponentCriticality(e.target.value)}
          />
        </Card>

        <Card>
          <Text size="2" weight="bold">
            Supplier Incentives Offered
          </Text>
          <ul>
            {incentiveOptions.map((option, i) => (
              <li key={i}>• {option}</li>
            ))}
          </ul>
        </Card>
      </Flex>

      <Box mb="4">
        <Text weight="bold" mb="2">
          🧱 Editable Table: Raw Materials
        </Text>
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.Cell as="th">Item</Table.Cell>
              <Table.Cell as="th">Qty</Table.Cell>
              <Table.Cell as="th">Unit Price ({currency})</Table.Cell>
              <Table.Cell as="th">Cost ({currency})</Table.Cell>
              <Table.Cell as="th">Solution</Table.Cell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {rawMaterials.map((row, index) => (
              <Table.Row key={index}>
                <Table.Cell>{row.item}</Table.Cell>
                <Table.Cell>{row.qty}</Table.Cell>
                <Table.Cell>{row.unitPrice}</Table.Cell>
                <Table.Cell>{row.qty * row.unitPrice}</Table.Cell>
                <Table.Cell>
                  <Select.Root
                    value={row.solution}
                    onValueChange={(value) => handleSolutionChange(index, value)}
                  >
                    <Select.Trigger placeholder="Select..." />
                    <Select.Content>
                      {incentiveOptions.map((option, i) => (
                        <Select.Item key={i} value={option}>
                          {option}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>

      <Button>Submit</Button>
    </Box>
  );
}
