// src/pages/CostAnalytics.tsx

import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  Flex,
  Grid,
  Heading,
  Switch,
  Table,
  Text,
  Select as RadixSelect,
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
  Legend,
} from 'recharts';
import {
  simulatedIoTCostData,
  Item,
  CostCategory,
} from './simulateIoTCostData';

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

const pieColors = ['#3b82f6', '#f59e0b', '#ef4444', '#10b981', '#6366f1'];
function CostAnalytics() {
  const [dialogCategory, setDialogCategory] = useState<CostCategory | null>(null);
  const [benchmarkPrice, setBenchmarkPrice] = useState(220);
  const [profitMargin, setProfitMargin] = useState(25);
  const [currency, setCurrency] = useState<'EGP' | 'USD'>('EGP');
  const [autoMode, setAutoMode] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [showCostGap, setShowCostGap] = useState(false);
  const [data, setData] = useState(simulatedIoTCostData);
  const [solutions, setSolutions] = useState<Record<CostCategory, Record<number, string>>>({
    'Direct Materials': {},
    'Packaging Materials': {},
    'Direct Labor': {},
    'Overhead': {},
    'Other Costs': {},
  });

  const totals = data.totals;
  const totalActual = categories.reduce((sum, cat) => sum + totals[cat].actual, 0);
  const totalTarget = categories.reduce((sum, cat) => sum + totals[cat].budget, 0);
  const totalCostAfter = categories.reduce((sum, cat) => sum + totals[cat].costAfter, 0);
  const targetCost = benchmarkPrice * (1 - profitMargin / 100);

  const benchmarkTrendData = [
    { month: 'Jan', actual: 169.61, benchmark: benchmarkPrice },
    { month: 'Feb', actual: 170.5, benchmark: benchmarkPrice },
    { month: 'Mar', actual: 168.0, benchmark: benchmarkPrice },
    { month: 'Apr', actual: 171.2, benchmark: benchmarkPrice },
    { month: 'May', actual: totalActual, benchmark: benchmarkPrice },
  ];

  const benchmarkTrendDataWithGap = benchmarkTrendData.map((d) => ({
    ...d,
    targetCost,
    gap: d.actual - targetCost,
  }));

  const percentOfTotal = (category: CostCategory) =>
    totalActual === 0 ? '0.00' : ((totals[category].actual / totalActual) * 100).toFixed(2);

  const handleTargetChange = (category: CostCategory, value: number) => {
    setData((prev) => ({
      ...prev,
      totals: {
        ...prev.totals,
        [category]: {
          ...prev.totals[category],
          budget: value,
        },
      },
    }));
  };

  const handleSolutionChange = (category: CostCategory, index: number, value: string) => {
    setSolutions((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [index]: value,
      },
    }));
  };

  const getDetailsByCategory = (category: CostCategory): Item[] => {
    switch (category) {
      case 'Direct Materials': return data.rawMaterials;
      case 'Packaging Materials': return data.packagingMaterials;
      case 'Direct Labor': return data.directLabor;
      case 'Overhead': return data.overheadItems;
      case 'Other Costs': return data.otherCosts;
      default: return [];
    }
  };
  return (
    <Box p="4">
      <Heading size="6">Cost Analytics Dashboard</Heading>
      <Flex gap="3" mt="3">
        <RadixSelect.Root value={selectedProduct} onValueChange={(v) => setSelectedProduct(v)}>
          <RadixSelect.Trigger placeholder="Select Product" />
          <RadixSelect.Content>
            {products.map((p) => (
              <RadixSelect.Item key={p} value={p}>{p}</RadixSelect.Item>
            ))}
          </RadixSelect.Content>
        </RadixSelect.Root>
        <RadixSelect.Root value={currency} onValueChange={(v) => setCurrency(v as 'EGP' | 'USD')}>
          <RadixSelect.Trigger placeholder="Select Currency" />
          <RadixSelect.Content>
            <RadixSelect.Item value="EGP">EGP</RadixSelect.Item>
            <RadixSelect.Item value="USD">USD</RadixSelect.Item>
          </RadixSelect.Content>
        </RadixSelect.Root>
      </Flex>

      <Grid columns="3" gap="3" mt="4">
        <Box>
          <Text>Actual Cost</Text>
          <Text>{formatCurrency(totalActual, currency)}</Text>
        </Box>
        <Box>
          <Text>Target Cost</Text>
          <Text>{formatCurrency(totalTarget, currency)}</Text>
        </Box>
        <Box>
          <Text>Benchmark Price</Text>
          <input
            type="number"
            value={benchmarkPrice}
            onChange={(e) => setBenchmarkPrice(parseFloat(e.target.value))}
          />
        </Box>
      </Grid>

      <Grid columns="3" gap="3" mt="2">
        <Box>
          <Text>Profit Margin (%)</Text>
          <input
            type="number"
            value={profitMargin}
            onChange={(e) => setProfitMargin(parseFloat(e.target.value))}
          />
        </Box>
        <Box>
          <Text>Progress To Target</Text>
          <Text>{((totalActual / totalTarget) * 100).toFixed(1)}%</Text>
        </Box>
        <Box>
          <Text>Post-Optimization Estimate</Text>
          <Text>{formatCurrency(totalCostAfter, currency)}</Text>
        </Box>
      </Grid>

      <Dialog.Root>
        <Dialog.Trigger>
          <Button mt="3">Insights</Button>
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Cost Insights</Dialog.Title>
          <Text>
            Your current actual cost is higher than the benchmark price.
            Consider negotiating better prices or reducing waste to close the gap.
          </Text>
          <Dialog.Close>
            <Button>Close</Button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Root>
      <Table.Root mt="4">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Category</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actual</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Target</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Cost After</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>% of Total</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Details</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {categories.map((cat) => (
            <Table.Row key={cat}>
              <Table.Cell>{cat}</Table.Cell>
              <Table.Cell>{formatCurrency(totals[cat].actual, currency)}</Table.Cell>
              <Table.Cell>
                <input
                  type="number"
                  value={totals[cat].budget}
                  onChange={(e) => handleTargetChange(cat, parseFloat(e.target.value))}
                />
              </Table.Cell>
              <Table.Cell>{formatCurrency(totals[cat].costAfter, currency)}</Table.Cell>
              <Table.Cell>{percentOfTotal(cat)}%</Table.Cell>
              <Table.Cell>
                <Dialog.Root>
                  <Dialog.Trigger>
                    <Button>Details</Button>
                  </Dialog.Trigger>
                  <Dialog.Content>
                    <Dialog.Title>{cat} Breakdown</Dialog.Title>
                    <Table.Root>
                      <Table.Header>
                        <Table.Row>
                          <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell>Cost</Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell>Solution</Table.ColumnHeaderCell>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        {getDetailsByCategory(cat).map((item, idx) => (
                          <Table.Row key={idx}>
                            <Table.Cell>{item.name}</Table.Cell>
                            <Table.Cell>{formatCurrency(item.cost || 0, currency)}</Table.Cell>
                            <Table.Cell>
                              <RadixSelect.Root
                                value={solutions[cat][idx] || ''}
                                onValueChange={(v) => handleSolutionChange(cat, idx, v)}
                              >
                                <RadixSelect.Trigger placeholder="Select" />
                                <RadixSelect.Content>
                                  {solutionsOptions.map((opt) => (
                                    <RadixSelect.Item key={opt} value={opt}>{opt}</RadixSelect.Item>
                                  ))}
                                </RadixSelect.Content>
                              </RadixSelect.Root>
                            </Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table.Root>
                    <Dialog.Close>
                      <Button>Close</Button>
                    </Dialog.Close>
                  </Dialog.Content>
                </Dialog.Root>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      <Flex mt="4" gap="4" wrap="wrap">
        <Box style={{ minWidth: "300px", height: "300px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categories.map((cat) => ({
                  name: cat,
                  value: totals[cat].actual,
                }))}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
                dataKey="value"
              >
                {categories.map((_, idx) => (
                  <Cell key={idx} fill={pieColors[idx % pieColors.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </Box>

        <Box style={{ minWidth: "300px", height: "300px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={benchmarkTrendData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="cost" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Flex>

      <Flex gap="3" mt="4">
        <Button color="blue" onClick={showGapAnalysis}>Show Cost Gap Analysis</Button>
        <Button color="green" onClick={handleSubmitAll}>Submit to Blockchain</Button>
      </Flex>
    </Box>
  );
};

export default CostAnalytics;
