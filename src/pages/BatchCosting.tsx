import React, { useState } from 'react';
import {
  Card,
  Flex,
  Heading,
  Text,
  Table,
  Badge,
  Grid,
  Progress,
  Box,
} from '@radix-ui/themes';
import * as Tabs from '@radix-ui/react-tabs';
import { PieChart, Pie, BarChart, Bar } from 'recharts';

const suppliers = ['A', 'B', 'C'];
const products = ['A', 'B', 'C'];
const currencies = ['USD', 'EGP'];

const SupplierTierOptions = ['Tier 1', 'Tier 2', 'Tier 3'];
const ComponentCriticalityOptions = ['High', 'Medium', 'Low'];
const incentivesOptions = [
  'Greater volumes',
  'Longer contracts',
  'Technical support',
  'Marketing support',
  'Negotiation support',
  'Joint problem solving teams',
  'Shared Profit',
];

const BatchCosting = () => {
  const [selectedSupplier, setSelectedSupplier] = useState('A');
  const [selectedProduct, setSelectedProduct] = useState('A');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  const [supplierTier, setSupplierTier] = useState('');
  const [transactionVolume, setTransactionVolume] = useState('');
  const [componentCriticality, setComponentCriticality] = useState('');
  const [supplierIncentives, setSupplierIncentives] = useState('');

  const [items, setItems] = useState([
    {
      id: 'Item1',
      declaredPrice: 1000,
      actualCost: 900,
      variance: '-10%',
      incentives: '',
    },
    {
      id: 'Item2',
      declaredPrice: 1500,
      actualCost: 1600,
      variance: '+6.7%',
      incentives: '',
    },
  ]);

  const batches = [
    {
      id: 'VC23001',
      product: 'Anthelmintic Oral Suspension',
      materialCost: 24500,
      laborCost: 12000,
      overhead: 8500,
      totalCost: 45000,
      costPerUnit: 3.15,
      variance: '-2.5%',
    },
  ];

  const exchangeRate = 30;

  const formatPrice = (value: number) => {
    if (selectedCurrency === 'USD') {
      return `$${value.toLocaleString()}`;
    } else if (selectedCurrency === 'EGP') {
      return `£${(value * exchangeRate).toLocaleString()}`;
    }
    return value.toString();
  };

  const handleIncentivesChange = (value: string, index: number) => {
    const updated = [...items];
    updated[index].incentives = value;
    setItems(updated);
  };

  const tabTriggerStyle = (isSelected: boolean): React.CSSProperties => ({
    padding: '8px 16px',
    borderRadius: 6,
    backgroundColor: isSelected ? '#2563eb' : '#e0e7ff',
    color: isSelected ? 'white' : '#1e293b',
    cursor: 'pointer',
    fontWeight: 600,
    border: 'none',
  });

  return (
    <Box p="6">
      <Flex justify="between" align="center" mb="5" wrap="wrap" gap="3">
        <Heading size="6">Open Book Accounting Overview</Heading>

        <Flex gap="3" align="center" wrap="wrap">
          {/* Supplier Tabs */}
          <Tabs.Root
            value={selectedSupplier}
            onValueChange={setSelectedSupplier}
          >
            <Tabs.List
              aria-label="Suppliers"
              style={{ display: 'flex', gap: 10, marginRight: 10 }}
            >
              {suppliers.map((s) => (
                <Tabs.Trigger
                  key={s}
                  value={s}
                  style={tabTriggerStyle(selectedSupplier === s)}
                >
                  Supplier {s}
                </Tabs.Trigger>
              ))}
            </Tabs.List>
          </Tabs.Root>

          {/* Product Tabs */}
          <Tabs.Root value={selectedProduct} onValueChange={setSelectedProduct}>
            <Tabs.List
              aria-label="Products"
              style={{ display: 'flex', gap: 10, marginRight: 10 }}
            >
              {products.map((p) => (
                <Tabs.Trigger
                  key={p}
                  value={p}
                  style={tabTriggerStyle(selectedProduct === p)}
                >
                  Product {p}
                </Tabs.Trigger>
              ))}
            </Tabs.List>
          </Tabs.Root>

          {/* Currency Tabs */}
          <Tabs.Root value={selectedCurrency} onValueChange={setSelectedCurrency}>
            <Tabs.List aria-label="Currencies" style={{ display: 'flex', gap: 10 }}>
              {currencies.map((c) => (
                <Tabs.Trigger
                  key={c}
                  value={c}
                  style={tabTriggerStyle(selectedCurrency === c)}
                >
                  {c}
                </Tabs.Trigger>
              ))}
            </Tabs.List>
          </Tabs.Root>
        </Flex>
      </Flex>

      <Grid columns="4" gap="4" mb="5">
        <Card>
          <Flex direction="column" gap="2">
            <Text size="2" weight="bold">Supplier Tier</Text>
            <select
              value={supplierTier}
              onChange={(e) => setSupplierTier(e.target.value)}
              style={{
                padding: '8px 12px',
                fontSize: 14,
                borderRadius: 6,
                border: '1px solid #ccc',
                fontWeight: 600,
                width: '100%',
                boxSizing: 'border-box',
                cursor: 'pointer',
              }}
            >
              <option value="" disabled>
                Select Tier
              </option>
              {SupplierTierOptions.map((tier) => (
                <option key={tier} value={tier}>
                  {tier}
                </option>
              ))}
            </select>
          </Flex>
        </Card>

        <Card>
          <Flex direction="column" gap="2">
            <Text size="2" weight="bold">Transaction Volume</Text>
            <input
              type="number"
              placeholder="Enter volume"
              value={transactionVolume}
              onChange={(e) => setTransactionVolume(e.target.value)}
              style={{
                padding: '8px 12px',
                fontSize: 14,
                borderRadius: 6,
                border: '1px solid #ccc',
                fontWeight: 600,
                width: '100%',
                boxSizing: 'border-box',
              }}
            />
          </Flex>
        </Card>

        <Card>
          <Flex direction="column" gap="2">
            <Text size="2" weight="bold">Component Criticality</Text>
            <select
              value={componentCriticality}
              onChange={(e) => setComponentCriticality(e.target.value)}
              style={{
                padding: '8px 12px',
                fontSize: 14,
                borderRadius: 6,
                border: '1px solid #ccc',
                fontWeight: 600,
                width: '100%',
                boxSizing: 'border-box',
                cursor: 'pointer',
              }}
            >
              <option value="" disabled>
                Select criticality
              </option>
              {ComponentCriticalityOptions.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </Flex>
        </Card>

        <Card>
          <Flex direction="column" gap="2">
            <Text size="2" weight="bold">Supplier Incentives Offered</Text>
            <input
              type="number"
              placeholder="Enter amount"
              value={supplierIncentives}
              onChange={(e) => setSupplierIncentives(e.target.value)}
              style={{
                padding: '8px 12px',
                fontSize: 14,
                borderRadius: 6,
                border: '1px solid #ccc',
                fontWeight: 600,
                width: '100%',
                boxSizing: 'border-box',
              }}
            />
          </Flex>
        </Card>
      </Grid>

      <Table.Root variant="surface" style={{ marginBottom: 24 }}>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Item</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Declared Price via blockchain</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actual Cost</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Variance</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Incentives</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {items.map((item, index) => (
            <Table.Row key={item.id}>
              <Table.Cell>{item.id}</Table.Cell>
              <Table.Cell>{formatPrice(item.declaredPrice)}</Table.Cell>
              <Table.Cell>{formatPrice(item.actualCost)}</Table.Cell>
              <Table.Cell>
                <Badge color={item.variance.startsWith('-') ? 'green' : 'red'}>
                  {item.variance}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <select
                  value={item.incentives}
                  onChange={(e) => handleIncentivesChange(e.target.value, index)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 6,
                    border: '1px solid #ccc',
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#1e293b',
                    cursor: 'pointer',
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="" disabled>
                    Select incentive
                  </option>
                  {incentivesOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <Flex mt="5" gap="4" wrap="wrap">
        <Card style={{ flex: 1, minWidth: 320 }}>
          <Heading size="4" mb="3">Cost Breakdown</Heading>
          <div className="h-64">
            <BarChart width={500} height={250} data={batches}>
              <Bar dataKey="materialCost" fill="#3b82f6" name="Material" />
              <Bar dataKey="laborCost" fill="#ef4444" name="Labor" />
              <Bar dataKey="overhead" fill="#10b981" name="Overhead" />
            </BarChart>
          </div>
        </Card>
        <Card style={{ flex: 1, minWidth: 320 }}>
          <Heading size="4" mb="3">Variance Analysis</Heading>
          <div className="h-64">
            <PieChart width={300} height={250}>
              <Pie
                data={[
                  { name: 'Material', value: 65 },
                  { name: 'Labor', value: 25 },
                  { name: 'Overhead', value: 10 },
                ]}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              />
            </PieChart>
          </div>
        </Card>
      </Flex>
    </Box>
  );
};

export default BatchCosting;
