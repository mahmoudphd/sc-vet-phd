import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Select as RadixSelect,
  Table,
  Text,
} from "@radix-ui/themes";

const incentiveOptions = [
  "Greater volumes",
  "Longer contracts",
  "Technical support",
  "Marketing support",
  "Negotiation support",
  "Joint problem solving teams",
];

const rawMaterials = [
  { item: "Vitamin B1", declaredPrice: 10, actualCost: 50 },
  { item: "Vitamin B2", declaredPrice: 8, actualCost: 48 },
  { item: "Vitamin B12", declaredPrice: 12, actualCost: 60 },
  { item: "Pantothenic Acid", declaredPrice: 5, actualCost: 25 },
  { item: "Vitamin B6", declaredPrice: 6, actualCost: 30 },
  { item: "Leucine", declaredPrice: 7, actualCost: 35 },
  { item: "Taurine", declaredPrice: 4, actualCost: 20 },
  { item: "Glycine", declaredPrice: 3, actualCost: 15 },
];

function formatCurrency(value: number, currency: string) {
  return `${currency} ${value.toFixed(2)}`;
}

const BatchCosting = () => {
  // States
  const [supplier, setSupplier] = useState("");
  const [product, setProduct] = useState("");
  const [currency, setCurrency] = useState<"EGP" | "USD">("USD");
  const [tier, setTier] = useState("Tier 1");
  const [volume, setVolume] = useState("");
  const [criticality, setCriticality] = useState("");
  const [incentives, setIncentives] = useState<string[]>([]);
  const [incentivesMap, setIncentivesMap] = useState<Record<number, string>>({});

  // Toggle incentives checkboxes
  const handleIncentiveToggle = (val: string) => {
    setIncentives((prev) =>
      prev.includes(val) ? prev.filter((i) => i !== val) : [...prev, val]
    );
  };

  // Handle incentive select change for each raw material row
  const handleIncentiveSelect = (idx: number, val: string) => {
    setIncentivesMap((prev) => ({
      ...prev,
      [idx]: val,
    }));
  };

  return (
    <Box p="6" style={{ backgroundColor: "#f9fafb", minHeight: "100vh" }}>
      <Flex justify="between" align="center" mb="5" wrap="wrap" gap="3">
        <Heading size="6">Open Book Accounting Overview</Heading>
      </Flex>

      {/* Filters Row */}
      <Grid columns={{ initial: "3", md: "3" }} gap="4" mb="6">
        <Box
          style={{
            border: "1px solid #ccc",
            borderRadius: 8,
            padding: 12,
            backgroundColor: "#fff",
          }}
        >
          <Text size="2" weight="bold" mb="2">
            Supplier
          </Text>
          <RadixSelect.Root
            value={supplier}
            onValueChange={(val) => setSupplier(val)}
          >
            <RadixSelect.Trigger aria-label="Select supplier" />
            <RadixSelect.Content>
              <RadixSelect.Item value="">Select Supplier</RadixSelect.Item>
              <RadixSelect.Item value="Supplier A">Supplier A</RadixSelect.Item>
              <RadixSelect.Item value="Supplier B">Supplier B</RadixSelect.Item>
            </RadixSelect.Content>
          </RadixSelect.Root>
        </Box>

        <Box
          style={{
            border: "1px solid #ccc",
            borderRadius: 8,
            padding: 12,
            backgroundColor: "#fff",
          }}
        >
          <Text size="2" weight="bold" mb="2">
            Product
          </Text>
          <RadixSelect.Root
            value={product}
            onValueChange={(val) => setProduct(val)}
          >
            <RadixSelect.Trigger aria-label="Select product" />
            <RadixSelect.Content>
              <RadixSelect.Item value="">Select Product</RadixSelect.Item>
              <RadixSelect.Item value="Product X">Product X</RadixSelect.Item>
              <RadixSelect.Item value="Product Y">Product Y</RadixSelect.Item>
            </RadixSelect.Content>
          </RadixSelect.Root>
        </Box>

        <Box
          style={{
            border: "1px solid #ccc",
            borderRadius: 8,
            padding: 12,
            backgroundColor: "#fff",
          }}
        >
          <Text size="2" weight="bold" mb="2">
            Currency
          </Text>
          <RadixSelect.Root
            value={currency}
            onValueChange={(val) => setCurrency(val as "EGP" | "USD")}
          >
            <RadixSelect.Trigger aria-label="Select currency" />
            <RadixSelect.Content>
              <RadixSelect.Item value="USD">USD</RadixSelect.Item>
              <RadixSelect.Item value="EGP">EGP</RadixSelect.Item>
            </RadixSelect.Content>
          </RadixSelect.Root>
        </Box>
      </Grid>

      {/* Info Cards Row */}
      <Grid columns={{ initial: "4", md: "4" }} gap="4" mb="6">
        <Box
          style={{
            border: "1px solid #ccc",
            borderRadius: 8,
            padding: 12,
            backgroundColor: "#fff",
          }}
        >
          <Text size="2" weight="bold" mb="2">
            Supplier Tier
          </Text>
          <RadixSelect.Root value={tier} onValueChange={(val) => setTier(val)}>
            <RadixSelect.Trigger aria-label="Select tier" />
            <RadixSelect.Content>
              <RadixSelect.Item value="Tier 1">Tier 1</RadixSelect.Item>
              <RadixSelect.Item value="Tier 2">Tier 2</RadixSelect.Item>
              <RadixSelect.Item value="Tier 3">Tier 3</RadixSelect.Item>
            </RadixSelect.Content>
          </RadixSelect.Root>
        </Box>

        <Box
          style={{
            border: "1px solid #ccc",
            borderRadius: 8,
            padding: 12,
            backgroundColor: "#fff",
          }}
        >
          <Text size="2" weight="bold" mb="2">
            Transaction Volume
          </Text>
          <input
            type="text"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
            style={{
              width: "100%",
              padding: 8,
              borderRadius: 6,
              border: "1px solid #ccc",
            }}
            placeholder="Enter volume"
          />
        </Box>

        <Box
          style={{
            border: "1px solid #ccc",
            borderRadius: 8,
            padding: 12,
            backgroundColor: "#fff",
          }}
        >
          <Text size="2" weight="bold" mb="2">
            Component Criticality
          </Text>
          <RadixSelect.Root
            value={criticality}
            onValueChange={(val) => setCriticality(val)}
          >
            <RadixSelect.Trigger aria-label="Select criticality" />
            <RadixSelect.Content>
              <RadixSelect.Item value="">Select Criticality</RadixSelect.Item>
              <RadixSelect.Item value="High">High</RadixSelect.Item>
              <RadixSelect.Item value="Medium">Medium</RadixSelect.Item>
              <RadixSelect.Item value="Low">Low</RadixSelect.Item>
            </RadixSelect.Content>
          </RadixSelect.Root>
        </Box>

        <Box
          style={{
            border: "1px solid #ccc",
            borderRadius: 8,
            padding: 12,
            backgroundColor: "#fff",
          }}
        >
          <Text size="2" weight="bold" mb="2">
            Supplier Incentives Offered
          </Text>
          <Flex wrap="wrap" gap="3" direction="column" style={{ maxHeight: 130, overflowY: "auto" }}>
            {incentiveOptions.map((inc) => (
              <label key={inc} style={{ userSelect: "none" }}>
                <input
                  type="checkbox"
                  checked={incentives.includes(inc)}
                  onChange={() => handleIncentiveToggle(inc)}
                  style={{ marginRight: 8 }}
                />
                {inc}
              </label>
            ))}
          </Flex>
        </Box>
      </Grid>

      {/* Raw Materials Table */}
      <Box
        style={{
          backgroundColor: "#fff",
          padding: 20,
          borderRadius: 10,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          overflowX: "auto",
          marginBottom: 24,
        }}
      >
        <Heading size="5" mb="4">
          Raw Materials Breakdown
        </Heading>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Item</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Declared Price ({currency})</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Actual Cost ({currency})</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Variance ({currency})</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Incentives</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {rawMaterials.map(({ item, declaredPrice, actualCost }, idx) => (
              <Table.Row key={idx}>
                <Table.RowHeaderCell>{item}</Table.RowHeaderCell>
                <Table.Cell>{formatCurrency(declaredPrice, currency)}</Table.Cell>
                <Table.Cell>{formatCurrency(actualCost, currency)}</Table.Cell>
                <Table.Cell>{formatCurrency(actualCost - declaredPrice, currency)}</Table.Cell>
                <Table.Cell>
                  <RadixSelect.Root
                    value={incentivesMap[idx] || ""}
                    onValueChange={(val) => handleIncentiveSelect(idx, val)}
                  >
                    <RadixSelect.Trigger aria-label="Select incentive" />
                    <RadixSelect.Content>
                      <RadixSelect.Item value="">Select Incentive</RadixSelect.Item>
                      {incentiveOptions.map((inc) => (
                        <RadixSelect.Item key={inc} value={inc}>
                          {inc}
                        </RadixSelect.Item>
                      ))}
                    </RadixSelect.Content>
                  </RadixSelect.Root>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>

      <Flex justify="end">
        <Button
          style={{ backgroundColor: "#10b981", color: "#fff", fontWeight: "bold" }}
          onClick={() => alert("Submit clicked!")}
        >
          Submit
        </Button>
      </Flex>
    </Box>
  );
};

export default BatchCosting;
