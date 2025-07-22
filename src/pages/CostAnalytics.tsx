// src/pages/CostAnalytics.tsx

import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  Flex,
  Grid,
  Heading,
  Progress,
  Switch,
  Table,
  Text,
  Select as RadixSelect
} from '@radix-ui/themes';
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { simulatedIoTCostData, CostCategory, Item } from './simulateIoTCostData';

const formatCurrency = (value: number, currency: string) =>
  `${currency} ${value.toFixed(2)}`;

const categories: CostCategory[] = [
  'Direct Materials',
  'Packaging Materials',
  'Direct Labor',
  'Overhead',
  'Other Costs',
];

const products = ['Product A', 'Product B', 'Product C'];

const solutionsOptions = [
  'Negotiating better prices with supplier',
  'Reducing waste in material usage',
  'Automation to reduce manual labor costs',
  'Optimizing machine usage',
  'Improving inventory management',
  'Minimize transportation costs',
  'Reduce rework costs',
  'Other',
];
function CostAnalytics() {
  const [dialogCategory, setDialogCategory] = useState<CostCategory | null>(null);
  const [benchmarkPrice, setBenchmarkPrice] = useState(220);
  const [profitMargin, setProfitMargin] = useState(25);
  const [currency, setCurrency] = useState<'EGP' | 'USD'>('EGP');
  const [autoMode, setAutoMode] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [showWhyModal, setShowWhyModal] = useState(false);
  const [solutions, setSolutions] = useState<Record<CostCategory, Record<number, string>>>({
    'Direct Materials': {},
    'Packaging Materials': {},
    'Direct Labor': {},
    'Overhead': {},
    'Other Costs': {},
  });

  const [data, setData] = useState(simulatedIoTCostData);
  const totals = data.totals;

  const totalActual = categories.reduce((sum, c) => sum + totals[c].actual, 0);
  const totalTarget = categories.reduce((sum, c) => sum + totals[c].budget, 0);
  const totalCostAfter = categories.reduce((sum, c) => sum + totals[c].costAfter, 0);
  const targetCost = benchmarkPrice * (1 - profitMargin / 100);

  const handleTargetChange = (category: CostCategory, value: number) => {
    setData((prev) => ({
      ...prev,
      totals: {
        ...prev.totals,
        [category]: { ...prev.totals[category], budget: value }
      }
    }));
  };

  const handleBenchmarkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBenchmarkPrice(parseFloat(e.target.value) || 0);
  };
  return (
    <Box p="6" style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <Flex justify="between" align="center" mb="5">
        <Heading size="6">Inter-Organizational Cost Management</Heading>
        <Flex gap="3" align="center">
          <Text>Product:</Text>
          <RadixSelect.Root value={selectedProduct} onValueChange={setSelectedProduct}>
            <RadixSelect.Trigger aria-label="Select product" />
            <RadixSelect.Content>
              {products.map((p) => (
                <RadixSelect.Item key={p} value={p}>{p}</RadixSelect.Item>
              ))}
            </RadixSelect.Content>
          </RadixSelect.Root>

          <Text>Currency:</Text>
          <RadixSelect.Root value={currency} onValueChange={(v) => setCurrency(v as 'EGP' | 'USD')}>
            <RadixSelect.Trigger aria-label="Select currency" />
            <RadixSelect.Content>
              <RadixSelect.Item value="EGP">EGP</RadixSelect.Item>
              <RadixSelect.Item value="USD">USD</RadixSelect.Item>
            </RadixSelect.Content>
          </RadixSelect.Root>

          <Text>Benchmark Price:</Text>
          <input type="number" value={benchmarkPrice} onChange={handleBenchmarkChange} style={{ width: '80px' }} />

          <Button onClick={() => setShowWhyModal(true)}>Why?</Button>
        </Flex>
      </Flex>

      <Grid columns={{ initial: '3' }} gap="4" mb="6">
        <Box style={{ border: '1px solid #ccc', borderRadius: 8, padding: 12, background: '#fff' }}>
          <Text size="2">Actual Cost</Text>
          <Heading size="6">{formatCurrency(totalActual, currency)}</Heading>
        </Box>
        <Box style={{ border: '1px solid #ccc', borderRadius: 8, padding: 12, background: '#fff' }}>
          <Text size="2">Target Cost</Text>
          <Heading size="6">{formatCurrency(totalTarget, currency)}</Heading>
        </Box>
        <Box style={{ border: '1px solid #ccc', borderRadius: 8, padding: 12, background: '#fff' }}>
          <Text size="2">Cost After Optimization</Text>
          <Heading size="6">{formatCurrency(totalCostAfter, currency)}</Heading>
        </Box>
      </Grid>
      <Flex gap="6" mb="6" wrap="wrap">
        <Box style={{ flex: 1, minWidth: 300 }}>
          <Text>Cost Breakdown</Text>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categories.map((c) => ({ name: c, value: totals[c].actual }))}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                <Cell fill="#3b82f6" />
                <Cell fill="#f59e0b" />
                <Cell fill="#ef4444" />
                <Cell fill="#10b981" />
                <Cell fill="#6366f1" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        <Box style={{ flex: 1, minWidth: 300 }}>
          <Text>Benchmark Trend</Text>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={[
              { month: 'Jan', actual: 169.61, benchmark: benchmarkPrice },
              { month: 'Feb', actual: 170.5, benchmark: benchmarkPrice },
              { month: 'Mar', actual: 168.0, benchmark: benchmarkPrice },
              { month: 'Apr', actual: 171.2, benchmark: benchmarkPrice },
              { month: 'May', actual: totalActual, benchmark: benchmarkPrice },
            ]}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="actual" stroke="#3b82f6" />
              <Line type="monotone" dataKey="benchmark" stroke="#ef4444" />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Flex>
      {dialogCategory && (
        <Dialog.Root open onOpenChange={() => setDialogCategory(null)}>
          <Dialog.Content maxWidth="700px" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <Dialog.Title>{dialogCategory} Breakdown</Dialog.Title>

            <Flex justify="between" align="center" mb="3" mt="3">
              <Text>Auto Mode</Text>
              <Switch checked={autoMode} onCheckedChange={setAutoMode} />
            </Flex>

            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Item</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Qty / Hours / Kg</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Unit Price / Hourly Rate / PricePerKg</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Cost</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Solution</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {getDetailsByCategory(dialogCategory).map((item, index) => {
                  let costValue = item.cost ?? 0;
                  if (autoMode) {
                    if (dialogCategory === 'Direct Materials')
                      costValue = (item.concentrationKg ?? 0) * (item.pricePerKg ?? 0);
                    else if (dialogCategory === 'Direct Labor')
                      costValue = (item.hours ?? 0) * (item.hourlyRate ?? 0);
                    else
                      costValue = (item.qty ?? 0) * (item.unitPrice ?? 0);
                  }

                  return (
                    <Table.Row key={index}>
                      <Table.RowHeaderCell>{item.name}</Table.RowHeaderCell>
                      <Table.Cell>
                        {autoMode
                          ? dialogCategory === 'Direct Materials'
                            ? item.concentrationKg?.toFixed(3) ?? '-'
                            : dialogCategory === 'Direct Labor'
                            ? item.hours ?? '-'
                            : item.qty ?? '-'
                          : <input
                              type="number"
                              value={
                                dialogCategory === 'Direct Materials'
                                  ? item.concentrationKg ?? 0
                                  : dialogCategory === 'Direct Labor'
                                  ? item.hours ?? 0
                                  : item.qty ?? 0
                              }
                              onChange={(e) => {
                                const v = parseFloat(e.target.value) || 0;
                                if (dialogCategory === 'Direct Materials') item.concentrationKg = v;
                                else if (dialogCategory === 'Direct Labor') item.hours = v;
                                else item.qty = v;
                              }}
                              style={{ width: '80px' }}
                            />}
                      </Table.Cell>
                      <Table.Cell>
                        {autoMode
                          ? dialogCategory === 'Direct Materials'
                            ? formatCurrency(item.pricePerKg ?? 0, currency)
                            : dialogCategory === 'Direct Labor'
                            ? formatCurrency(item.hourlyRate ?? 0, currency)
                            : formatCurrency(item.unitPrice ?? 0, currency)
                          : <input
                              type="number"
                              value={
                                dialogCategory === 'Direct Materials'
                                  ? item.pricePerKg ?? 0
                                  : dialogCategory === 'Direct Labor'
                                  ? item.hourlyRate ?? 0
                                  : item.unitPrice ?? 0
                              }
                              onChange={(e) => {
                                const v = parseFloat(e.target.value) || 0;
                                if (dialogCategory === 'Direct Materials') item.pricePerKg = v;
                                else if (dialogCategory === 'Direct Labor') item.hourlyRate = v;
                                else item.unitPrice = v;
                              }}
                              style={{ width: '80px' }}
                            />}
                      </Table.Cell>
                      <Table.Cell>{formatCurrency(costValue, currency)}</Table.Cell>
                      <Table.Cell>
                        <RadixSelect.Root
                          value={solutions[dialogCategory]?.[index] || ''}
                          onValueChange={(v) => setSolutions((prev) => ({
                            ...prev,
                            [dialogCategory]: { ...prev[dialogCategory], [index]: v }
                          }))}
                        >
                          <RadixSelect.Trigger aria-label="Select solution" />
                          <RadixSelect.Content>
                            {solutionsOptions.map((s) => (
                              <RadixSelect.Item key={s} value={s}>{s}</RadixSelect.Item>
                            ))}
                          </RadixSelect.Content>
                        </RadixSelect.Root>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table.Root>

            <Flex justify="end" gap="3" mt="4">
              <Button style={{ backgroundColor: '#10b981', color: '#fff' }}>
                Submit to Blockchain
              </Button>
              <Button variant="ghost" onClick={() => setDialogCategory(null)}>Close</Button>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      )}
      {showWhyModal && (
        <Dialog.Root open onOpenChange={() => setShowWhyModal(false)}>
          <Dialog.Content>
            <Dialog.Title>Why these numbers?</Dialog.Title>
            <Text>
              The benchmark price and profit margin are based on historical data and market research.
              Adjust them manually if market conditions change.
            </Text>
            <Flex justify="end" mt="3">
              <Button onClick={() => setShowWhyModal(false)}>Close</Button>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      )}
    </Box>
  );
}

export default CostAnalytics;
