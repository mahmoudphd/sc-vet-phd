import React, { useState } from 'react';
import {
  Box,
  Heading,
  Flex,
  Text,
  Select,
  TextField,
  Checkbox,
  Table,
  Button,
} from '@radix-ui/themes';

const OpenBookAccounting = () => {
  const [supplier, setSupplier] = useState('');
  const [product, setProduct] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [tier, setTier] = useState('Tier 1');
  const [volume, setVolume] = useState('');
  const [criticality, setCriticality] = useState('');
  const [incentives, setIncentives] = useState<string[]>([]);

  const handleIncentiveChange = (value: string) => {
    setIncentives((prev) =>
      prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value]
    );
  };

  const incentiveOptions = [
    'Greater volumes',
    'Longer contracts',
    'Technical support',
    'Marketing support',
    'Negotiation support',
    'Joint problem solving teams',
  ];

  const rawMaterials = [
    { item: 'Vitamin B1', qty: 10, unitPrice: 5 },
    { item: 'Vitamin B2', qty: 8, unitPrice: 6 },
  ];

  const supplierTransactions = [
    {
      date: '2025-07-01',
      item: 'Vitamin B1',
      material: 'Vitamin B1',
      declared: 50,
      actual: 48,
      incentive: 'Technical support',
    },
    {
      date: '2025-07-05',
      item: 'Vitamin B2',
      material: 'Vitamin B2',
      declared: 48,
      actual: 51,
      incentive: 'Negotiation support',
    },
  ];

  return (
    <Box p="4">
      <Heading mb="4">Open Book Accounting Dashboard</Heading>

      <Flex gap="3" mb="4">
        <Select.Root value={supplier} onValueChange={setSupplier}>
          <Select.Trigger placeholder="Select Supplier" />
          <Select.Content>
            <Select.Item value="Supplier A">Supplier A</Select.Item>
            <Select.Item value="Supplier B">Supplier B</Select.Item>
          </Select.Content>
        </Select.Root>

        <Select.Root value={product} onValueChange={setProduct}>
          <Select.Trigger placeholder="Select Product" />
          <Select.Content>
            <Select.Item value="Product X">Product X</Select.Item>
            <Select.Item value="Product Y">Product Y</Select.Item>
          </Select.Content>
        </Select.Root>

        <Select.Root value={currency} onValueChange={setCurrency}>
          <Select.Trigger placeholder="Select Currency" />
          <Select.Content>
            <Select.Item value="USD">USD</Select.Item>
            <Select.Item value="EGP">EGP</Select.Item>
          </Select.Content>
        </Select.Root>
      </Flex>

      <Flex gap="3" mb="4">
        <Select.Root value={tier} onValueChange={setTier}>
          <Select.Trigger placeholder="Select Tier" />
          <Select.Content>
            <Select.Item value="Tier 1">Tier 1</Select.Item>
            <Select.Item value="Tier 2">Tier 2</Select.Item>
            <Select.Item value="Tier 3">Tier 3</Select.Item>
          </Select.Content>
        </Select.Root>

        <TextField.Input
          placeholder="Transaction Volume"
          value={volume}
          onChange={(e) => setVolume(e.target.value)}
        />

        <TextField.Input
          placeholder="Component Criticality"
          value={criticality}
          onChange={(e) => setCriticality(e.target.value)}
        />
      </Flex>

      <Box mb="4">
        <Text mb="2">Supplier Incentives Offered:</Text>
        <Flex gap="3" wrap="wrap">
          {incentiveOptions.map((label) => (
            <Checkbox
              key={label}
              checked={incentives.includes(label)}
              onCheckedChange={() => handleIncentiveChange(label)}
            >
              {label}
            </Checkbox>
          ))}
        </Flex>
      </Box>

      <Heading size="3" mb="2">Raw Material Breakdown</Heading>
      <Table.Root variant="surface" mb="4">
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
          {rawMaterials.map((row, i) => (
            <Table.Row key={i}>
              <Table.Cell>{row.item}</Table.Cell>
              <Table.Cell>{row.qty}</Table.Cell>
              <Table.Cell>{row.unitPrice}</Table.Cell>
              <Table.Cell>{row.qty * row.unitPrice}</Table.Cell>
              <Table.Cell>
                <Select.Root>
                  <Select.Trigger placeholder="Solution" />
                  <Select.Content>
                    {incentiveOptions.map((s, idx) => (
                      <Select.Item key={idx} value={s}>{s}</Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <Heading size="3" mb="2">Supplier Transactions</Heading>
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.Cell as="th">Date</Table.Cell>
            <Table.Cell as="th">Item</Table.Cell>
            <Table.Cell as="th">Material</Table.Cell>
            <Table.Cell as="th">Declared Cost</Table.Cell>
            <Table.Cell as="th">Actual Cost</Table.Cell>
            <Table.Cell as="th">Variance</Table.Cell>
            <Table.Cell as="th">Incentives Offered</Table.Cell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {supplierTransactions.map((row, i) => (
            <Table.Row key={i}>
              <Table.Cell>{row.date}</Table.Cell>
              <Table.Cell>{row.item}</Table.Cell>
              <Table.Cell>{row.material}</Table.Cell>
              <Table.Cell>{row.declared}</Table.Cell>
              <Table.Cell>{row.actual}</Table.Cell>
              <Table.Cell>{row.actual - row.declared}</Table.Cell>
              <Table.Cell>{row.incentive}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

export default OpenBookAccounting;
