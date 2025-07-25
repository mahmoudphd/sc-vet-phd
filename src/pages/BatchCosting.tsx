// src/pages/OpenBookAccountingDashboard.tsx

import React, { useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Card,
  Select,
  Grid,
} from '@radix-ui/themes';

const OpenBookAccountingDashboard = () => {
  const [selectedSupplier, setSelectedSupplier] = useState("Supplier A");
  const [selectedProduct, setSelectedProduct] = useState("Product A");
  const [selectedCurrency, setSelectedCurrency] = useState("USD");

  const [supplierTier, setSupplierTier] = useState("Tier 1");
  const [transactionVolume, setTransactionVolume] = useState("");
  const [componentCriticality, setComponentCriticality] = useState("");
  const [incentiveType, setIncentiveType] = useState("Greater volumes");

  return (
    <Box p="4">
      {/* Header */}
      <Heading mb="4" size="8">Open Book Accounting Dashboard</Heading>

      {/* Dropdowns */}
      <Flex gap="4" mb="6" wrap="wrap">
        <Box>
          <Text size="2">Select Supplier</Text>
          <Select.Root value={selectedSupplier} onValueChange={setSelectedSupplier}>
            <Select.Trigger />
            <Select.Content>
              <Select.Item value="Supplier A">Supplier A</Select.Item>
              <Select.Item value="Supplier B">Supplier B</Select.Item>
            </Select.Content>
          </Select.Root>
        </Box>

        <Box>
          <Text size="2">Select Product</Text>
          <Select.Root value={selectedProduct} onValueChange={setSelectedProduct}>
            <Select.Trigger />
            <Select.Content>
              <Select.Item value="Product A">Product A</Select.Item>
              <Select.Item value="Product B">Product B</Select.Item>
            </Select.Content>
          </Select.Root>
        </Box>

        <Box>
          <Text size="2">Currency</Text>
          <Select.Root value={selectedCurrency} onValueChange={setSelectedCurrency}>
            <Select.Trigger />
            <Select.Content>
              <Select.Item value="USD">USD</Select.Item>
              <Select.Item value="EGP">EGP</Select.Item>
            </Select.Content>
          </Select.Root>
        </Box>
      </Flex>

      {/* Editable Data Cards */}
      <Grid columns={{ initial: '1', md: '4' }} gap="4" mb="6">
        <Card>
          <Text size="2" mb="2">Supplier Tier</Text>
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
          <Text size="2" mb="2">Transaction Volume</Text>
          <input
            type="text"
            placeholder="Enter volume"
            value={transactionVolume}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTransactionVolume(e.target.value)}
            style={{
              padding: '8px',
              width: '100%',
              borderRadius: '6px',
              border: '1px solid #ccc',
              fontSize: '14px'
            }}
          />
        </Card>

        <Card>
          <Text size="2" mb="2">Component Criticality</Text>
          <input
            type="text"
            placeholder="Enter criticality"
            value={componentCriticality}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setComponentCriticality(e.target.value)}
            style={{
              padding: '8px',
              width: '100%',
              borderRadius: '6px',
              border: '1px solid #ccc',
              fontSize: '14px'
            }}
          />
        </Card>

        <Card>
          <Text size="2" mb="2">Incentives Offered</Text>
          <Select.Root value={incentiveType} onValueChange={setIncentiveType}>
            <Select.Trigger />
            <Select.Content>
              <Select.Item value="Greater volumes">Greater volumes</Select.Item>
              <Select.Item value="Longer contracts">Longer contracts</Select.Item>
              <Select.Item value="Technical support">Technical support</Select.Item>
              <Select.Item value="Marketing support">Marketing support</Select.Item>
              <Select.Item value="Negotiation support">Negotiation support</Select.Item>
              <Select.Item value="Joint problem solving teams">Joint problem solving teams</Select.Item>
            </Select.Content>
          </Select.Root>
        </Card>
      </Grid>
    </Box>
  );
};

export default OpenBookAccountingDashboard;
