import React, { useState } from 'react';
import { Box, Text, Select, Flex, TextField } from '@radix-ui/themes';

const OpenBookAccountingOverview = () => {
  const [supplierTier, setSupplierTier] = useState('Tier 1');
  const [transactionVolume, setTransactionVolume] = useState('');
  const [componentCriticality, setComponentCriticality] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  const incentives = [
    'Greater volumes',
    'Longer contracts',
    'Technical support',
    'Marketing support',
  ];

  const [selectedIncentives, setSelectedIncentives] = useState<string[]>([]);

  const handleIncentiveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (selectedIncentives.includes(value)) {
      setSelectedIncentives(selectedIncentives.filter((i) => i !== value));
    } else {
      setSelectedIncentives([...selectedIncentives, value]);
    }
  };

  return (
    <Box p="4">
      <Text as="h1" size="6" weight="bold" mb="4">
        Open Book Accounting Overview
      </Text>

      <Flex direction="column" gap="3">
        {/* Dropdowns */}
        <Box>
          <Text size="3" mb="1">Select Supplier</Text>
          <Select.Root onValueChange={setSelectedSupplier}>
            <Select.Trigger placeholder="Choose Supplier" />
            <Select.Content>
              <Select.Item value="Supplier A">Supplier A</Select.Item>
              <Select.Item value="Supplier B">Supplier B</Select.Item>
            </Select.Content>
          </Select.Root>
        </Box>

        <Box>
          <Text size="3" mb="1">Select Product</Text>
          <Select.Root onValueChange={setSelectedProduct}>
            <Select.Trigger placeholder="Choose Product" />
            <Select.Content>
              <Select.Item value="Product 1">Product 1</Select.Item>
              <Select.Item value="Product 2">Product 2</Select.Item>
            </Select.Content>
          </Select.Root>
        </Box>

        <Box>
          <Text size="3" mb="1">Select Currency</Text>
          <Select.Root onValueChange={setSelectedCurrency}>
            <Select.Trigger placeholder="Choose Currency" />
            <Select.Content>
              <Select.Item value="USD">USD</Select.Item>
              <Select.Item value="EGP">EGP</Select.Item>
            </Select.Content>
          </Select.Root>
        </Box>

        {/* Editable Cards (as Boxes) */}
        <Box mt="4" p="3" style={{ border: '1px solid #ccc', borderRadius: 8 }}>
          <Text weight="bold">Supplier Tier</Text>
          <Select.Root value={supplierTier} onValueChange={setSupplierTier}>
            <Select.Trigger />
            <Select.Content>
              <Select.Item value="Tier 1">Tier 1</Select.Item>
              <Select.Item value="Tier 2">Tier 2</Select.Item>
              <Select.Item value="Tier 3">Tier 3</Select.Item>
            </Select.Content>
          </Select.Root>
        </Box>

        <Box p="3" style={{ border: '1px solid #ccc', borderRadius: 8 }}>
          <Text weight="bold">Transaction Volume</Text>
          <TextField.Root
            placeholder="Enter transaction volume"
            value={transactionVolume}
            onChange={(e) => setTransactionVolume(e.target.value)}
          />
        </Box>

        <Box p="3" style={{ border: '1px solid #ccc', borderRadius: 8 }}>
          <Text weight="bold">Component Criticality</Text>
          <TextField.Root
            placeholder="Enter criticality level"
            value={componentCriticality}
            onChange={(e) => setComponentCriticality(e.target.value)}
          />
        </Box>

        {/* Supplier Incentives */}
        <Box p="3" style={{ border: '1px solid #ccc', borderRadius: 8 }}>
          <Text weight="bold" mb="2">Supplier Incentives Offered</Text>
          {incentives.map((item) => (
            <label key={item} style={{ display: 'block', marginBottom: 6 }}>
              <input
                type="checkbox"
                value={item}
                checked={selectedIncentives.includes(item)}
                onChange={handleIncentiveChange}
              />{' '}
              {item}
            </label>
          ))}
        </Box>
      </Flex>
    </Box>
  );
};

export default OpenBookAccountingOverview;
