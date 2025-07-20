// src/pages/CostAnalytics.tsx

import React, { useState } from 'react';
import {
  Box, Heading, Flex, Text, Grid, Button, Dialog, Table, Switch,
} from '@radix-ui/themes';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, LineChart, Line, XAxis, YAxis } from 'recharts';
import { TextField } from '@radix-ui/themes';
import * as RadixSelect from '@radix-ui/react-select';

interface Item {
  name: string;
  qty?: number;
  unitPrice?: number;
}

type Category = 'Direct Materials' | 'Packaging Materials' | 'Direct Labor' | 'Overhead' | 'Other Costs';

export default function CostAnalytics() {
  const [selectedProduct, setSelectedProduct] = useState('Product A');
  const [currency, setCurrency] = useState<'EGP' | 'USD'>('EGP');
  const [benchmarkPrice, setBenchmarkPrice] = useState(0);
  const [profitMargin, setProfitMargin] = useState(0);
  const [showCostGap, setShowCostGap] = useState(false);
  const [dialogCategory, setDialogCategory] = useState<Category | null>(null);
  const [dialogAutoMode, setDialogAutoMode] = useState<Record<Category, boolean>>({
    'Direct Materials': false,
    'Packaging Materials': false,
    'Direct Labor': false,
    'Overhead': false,
    'Other Costs': false,
  });

  const products = ['Product A', 'Product B'];
  const categories: Category[] = ['Direct Materials', 'Packaging Materials', 'Direct Labor', 'Overhead', 'Other Costs'];

  const dialogData: Record<Category, Item[]> = {
    'Direct Materials': [],
    'Packaging Materials': [],
    'Direct Labor': [],
    'Overhead': [],
    'Other Costs': []
  };

  const solutions: Record<Category, string[]> = {
    'Direct Materials': [],
    'Packaging Materials': [],
    'Direct Labor': [],
    'Overhead': [],
    'Other Costs': []
  };

  const solutionsOptions = [
    'Negotiating better prices with supplier',
    'Reducing waste in material usage',
    'Automation to reduce manual labor costs',
    'Optimizing machine usage',
    'Improving inventory management',
    'Minimize transportation costs',
    'Reduce rework costs',
    'Other'
  ];

  const totals = {
    'Direct Materials': { actual: 0 },
    'Packaging Materials': { actual: 0 },
    'Direct Labor': { actual: 0 },
    'Overhead': { actual: 0 },
    'Other Costs': { actual: 0 }
  };

  const totalActual = 0;
  const totalTarget = 0;
  const totalCostAfter = 0;
  const postOptimizationEstimate = 0;
  const benchmarkTrendDataWithGap = [];

  const formatCurrency = (value: number, curr: string) => {
    return curr === 'EGP' ? `EGP ${value.toFixed(2)}` : `$${value.toFixed(2)}`;
  };

  const exportToCSV = (data: any) => { };
  const updateDialogItem = (cat: Category, index: number, field: keyof Item, value: number) => { };
  const handleSolutionChange = (cat: Category, index: number, value: string) => { };
  const calculateTotalForCategory = (cat: Category) => 0;
  const submitToBlockchain = (cat: Category) => { };

  return (
    <Box p="4">
      <Heading mb="4">Inter-Organizational Cost Management</Heading>
      <Flex gap="3" align="center" mb="4" wrap="wrap">
        <Text>Product:</Text>
        <RadixSelect.Root value={selectedProduct} onValueChange={setSelectedProduct}>
          <RadixSelect.Trigger />
          <RadixSelect.Content>
            {products.map((p) => (
              <RadixSelect.Item key={p} value={p}>
                {p}
              </RadixSelect.Item>
            ))}
          </RadixSelect.Content>
        </RadixSelect.Root>

        <Text>Currency:</Text>
        <RadixSelect.Root value={currency} onValueChange={(value: string) => setCurrency(value as 'EGP' | 'USD')}>
          <RadixSelect.Trigger />
          <RadixSelect.Content>
            <RadixSelect.Item value="EGP">EGP</RadixSelect.Item>
            <RadixSelect.Item value="USD">USD</RadixSelect.Item>
          </RadixSelect.Content>
        </RadixSelect.Root>

        <Button onClick={() => exportToCSV(dialogData)}>Export CSV</Button>
        <Button variant="soft" onClick={() => setShowCostGap((prev: boolean) => !prev)}>
          {showCostGap ? 'Hide Cost Gap' : 'Show Cost Gap'}
        </Button>
      </Flex>

      <Grid columns="3" gap="4" mb="4">
        <Box>
          <Text>Actual Cost</Text>
          <Heading>{formatCurrency(totalActual, currency)}</Heading>
        </Box>
        <Box>
          <Text>Target Cost</Text>
          <Heading>{formatCurrency(totalTarget, currency)}</Heading>
        </Box>
        <Box>
          <Text>Cost After Optimization</Text>
          <Heading>{formatCurrency(totalCostAfter, currency)}</Heading>
        </Box>
        <Box>
          <Text>Benchmark Price</Text>
          <TextField
            type="number"
            value={benchmarkPrice.toString()}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBenchmarkPrice(parseFloat(e.target.value) || 0)}
          />
        </Box>
        <Box>
          <Text>Profit Margin (%)</Text>
          <TextField
            type="number"
            value={profitMargin.toString()}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfitMargin(parseFloat(e.target.value) || 0)}
          />
        </Box>
        <Box>
          <Text>Post-Optimization Estimate</Text>
          <Heading>{formatCurrency(postOptimizationEstimate, currency)}</Heading>
        </Box>
      </Grid>

      <Flex gap="4" direction={{ initial: 'column', md: 'row' }} mb="6">
        <Box style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                dataKey="value"
                nameKey="name"
                data={[
                  {
                    name: 'Direct Cost',
                    value:
                      totals['Direct Materials'].actual +
                      totals['Packaging Materials'].actual +
                      totals['Direct Labor'].actual,
                  },
                  {
                    name: 'Overhead',
                    value: totals['Overhead'].actual,
                  },
                  {
                    name: 'Other Costs',
                    value: totals['Other Costs'].actual,
                  },
                ]}
                outerRadius={100}
                label
              >
                <Cell fill="#3b82f6" />
                <Cell fill="#f59e0b" />
                <Cell fill="#ef4444" />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Box>
        <Box style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={benchmarkTrendDataWithGap}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="actual" stroke="#3b82f6" name="Actual Cost" />
              <Line type="monotone" dataKey="benchmark" stroke="#f59e0b" name="Benchmark Price" />
              <Line type="monotone" dataKey="targetCost" stroke="#ef4444" name="Target Cost" />
              {showCostGap && (
                <Line
                  type="monotone"
                  dataKey="gap"
                  stroke="#22c55e"
                  name="Cost Gap"
                  strokeDasharray="3 3"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Flex>

      {categories.map((category) => (
        <Box key={category} mb="6">
          <Flex justify="between" align="center" mb="2">
            <Heading size="4">{category}</Heading>
            <Button onClick={() => setDialogCategory(category)}>View Details</Button>
          </Flex>
          <Dialog.Root open={dialogCategory === category} onOpenChange={() => setDialogCategory(null)}>
            <Dialog.Content style={{ maxWidth: 800 }}>
              <Dialog.Title>{category} Breakdown</Dialog.Title>
              <Flex gap="2" mb="2" align="center">
                <Text>Auto Mode</Text>
                <Switch
                  checked={dialogAutoMode[category]}
                  onCheckedChange={(checked) =>
                    setDialogAutoMode((prev) => ({ ...prev, [category]: checked }))
                  }
                />
              </Flex>
              <Table.Root>
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeaderCell>Item</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Qty</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Unit Price</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Cost</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {dialogData[category]?.map((item, idx) => (
                    <Table.Row key={idx}>
                      <Table.Cell>{item.name}</Table.Cell>
                      <Table.Cell>
                        <TextField
                          type="number"
                          value={item.qty?.toString() ?? '0'}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateDialogItem(category, idx, 'qty', parseFloat(e.target.value) || 0)}
                          disabled={dialogAutoMode[category]}
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <TextField
                          type="number"
                          value={item.unitPrice?.toString() ?? '0'}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateDialogItem(category, idx, 'unitPrice', parseFloat(e.target.value) || 0)}
                          disabled={dialogAutoMode[category]}
                        />
                      </Table.Cell>
                      <Table.Cell>{formatCurrency((item.qty ?? 0) * (item.unitPrice ?? 0), currency)}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
              <Flex mt="4" gap="2" justify="end">
                <Button variant="surface" onClick={() => submitToBlockchain(category)}>
                  Submit to Blockchain
                </Button>
                <Dialog.Close>
                  <Button variant="soft">Close</Button>
                </Dialog.Close>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>
        </Box>
      ))}
    </Box>
  );
}
