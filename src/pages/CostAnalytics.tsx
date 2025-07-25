// src/pages/CostAnalytics.tsx

import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Dialog,
  Flex,
  Grid,
  Heading,
  Progress,
  Switch,
  Table,
  Text,
  TextField,
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

const COLORS = ['#3b82f6', '#f59e0b', '#ef4444', '#10b981', '#a855f7'];

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

const formatCurrency = (value: number, currency: string) =>
  `${currency} ${value.toFixed(2)}`;

const getDetailsByCategory = (category: CostCategory): Item[] => {
  switch (category) {
    case 'Direct Materials':
      return simulatedIoTCostData.rawMaterials;
    case 'Packaging Materials':
      return simulatedIoTCostData.packagingMaterials;
    case 'Direct Labor':
      return simulatedIoTCostData.directLabor;
    case 'Overhead':
      return simulatedIoTCostData.overheadItems;
    case 'Other Costs':
      return simulatedIoTCostData.otherCosts;
    default:
      return [];
  }
};

function CostAnalytics() {
  const [dialogCategory, setDialogCategory] = useState<CostCategory | null>(null);
  const [benchmarkPrice, setBenchmarkPrice] = useState(220);
  const [profitMargin, setProfitMargin] = useState(25);
  const [currency, setCurrency] = useState<'EGP' | 'USD'>('EGP');
  const [autoMode, setAutoMode] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [showTargetView, setShowTargetView] = useState(false);
  const [showGapAnalysis, setShowGapAnalysis] = useState(false);
  const [solutions, setSolutions] = useState<Record<CostCategory, Record<number, string>>>({
    'Direct Materials': {},
    'Packaging Materials': {},
    'Direct Labor': {},
    'Overhead': {},
    'Other Costs': {},
  });
  const [data, setData] = useState(simulatedIoTCostData);

  const totals = data.totals;

  const totalActual = categories.reduce((sum, category) => sum + totals[category].actual, 0);
  const totalTarget = categories.reduce((sum, category) => sum + totals[category].budget, 0);
  const totalCostAfter = categories.reduce((sum, category) => sum + totals[category].costAfter, 0);

  // Post-Optimization Estimate = Actual Cost - Cost After Optimization
  const postOptimizationEstimate = totalActual - totalCostAfter;

  // target cost based on benchmarkPrice and profitMargin
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

  const handleSolutionChange = (category: CostCategory, index: number, value: string) => {
    setSolutions((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [index]: value,
      },
    }));
  };

  const handleExportReport = () => {
    alert('Export Report functionality not implemented yet.');
  };

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

  const pieData = categories.map((category) => ({
    name: category,
    value: totals[category].actual,
  }));

  // For benchmark line chart
  const benchmarkChartData = benchmarkTrendDataWithGap.map(({ month, actual, benchmark, gap }) => ({
    month,
    Actual: actual,
    Benchmark: benchmark,
    Gap: gap,
  }));

  const handleSubmitAll = () => {
    alert('Submit All clicked — you can add your blockchain submission logic here.');
  };

  return (
    <Box p="6" style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <Flex justify="between" align="center" mb="5" wrap="wrap" gap="3">
        <Heading size="6">Inter-Organizational Cost Management</Heading>
        <Flex gap="3" align="center" wrap="wrap">
          <Text>Product:</Text>
          <RadixSelect.Root
            value={selectedProduct}
            onValueChange={(value) => setSelectedProduct(value)}
          >
            <RadixSelect.Trigger aria-label="Select product" />
            <RadixSelect.Content>
              {products.map((p) => (
                <RadixSelect.Item key={p} value={p}>
                  {p}
                </RadixSelect.Item>
              ))}
            </RadixSelect.Content>
          </RadixSelect.Root>
          <RadixSelect.Root
            value={currency}
            onValueChange={(value) => setCurrency(value as 'EGP' | 'USD')}
          >
            <RadixSelect.Trigger aria-label="Select currency" />
            <RadixSelect.Content>
              <RadixSelect.Item value="EGP">EGP</RadixSelect.Item>
              <RadixSelect.Item value="USD">USD</RadixSelect.Item>
            </RadixSelect.Content>
          </RadixSelect.Root>
          <Button onClick={handleExportReport}>Export Report</Button>
        </Flex>
      </Flex>

      <Grid columns={{ initial: '3', md: '3' }} gap="4" mb="6">
        <Card style={{ padding: 12, backgroundColor: '#fff' }}>
          <Text size="2">Actual Cost</Text>
          <Heading size="6">{formatCurrency(totalActual, currency)}</Heading>
        </Card>
        <Card style={{ padding: 12, backgroundColor: '#fff' }}>
          <Text size="2">Target Cost</Text>
          <Heading size="6">{formatCurrency(totalTarget, currency)}</Heading>
        </Card>
        <Card style={{ padding: 12, backgroundColor: '#fff' }}>
          <Text size="2">Cost After Optimization</Text>
          <Heading size="6">{formatCurrency(totalCostAfter, currency)}</Heading>
        </Card>
        <Card style={{ padding: 12, backgroundColor: '#fff' }}>
          <Text size="2">Post-Optimization Estimate</Text>
          <Heading size="6">{formatCurrency(postOptimizationEstimate, currency)}</Heading>
        </Card>
        <Card style={{ padding: 12, backgroundColor: '#fff' }}>
          <Text size="2">Benchmark Price (Editable)</Text>
          <TextField
            type="number"
            value={benchmarkPrice}
            onChange={(e) => setBenchmarkPrice(parseFloat(e.target.value) || 0)}
          />
        </Card>
        <Card style={{ padding: 12, backgroundColor: '#fff' }}>
          <Text size="2">Profit Margin (%)</Text>
          <TextField
            type="number"
            value={profitMargin}
            onChange={(e) => setProfitMargin(parseFloat(e.target.value) || 0)}
          />
        </Card>
      </Grid>

      <Card mt="4">
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Cost Category</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Actual Cost</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Target Cost (Editable)</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Variance</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>% of Total</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Cost After Optimization</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Details</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {categories.map((category) => {
              const variance = totals[category].actual - totals[category].budget;
              const varianceColor = variance <= 0 ? 'green' : 'red';
              return (
                <Table.Row key={category}>
                  <Table.Cell>{category}</Table.Cell>
                  <Table.Cell>{formatCurrency(totals[category].actual, currency)}</Table.Cell>
                  <Table.Cell>
                    <TextField
                      type="number"
                      value={totals[category].budget}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        handleTargetChange(category, val);
                      }}
                    />
                  </Table.Cell>
                  <Table.Cell style={{ color: varianceColor }}>
                    {formatCurrency(variance, currency)}
                  </Table.Cell>
                  <Table.Cell>{percentOfTotal(category)}%</Table.Cell>
                  <Table.Cell>{formatCurrency(totals[category].costAfter, currency)}</Table.Cell>
                  <Table.Cell>
                    <Button
                      size="2"
                      onClick={() => setDialogCategory(category)}
                    >
                      View Details
                    </Button>
                  </Table.Cell>
                </Table.Row>
              );
            })}
            <Table.Row>
              <Table.RowHeaderCell>
                <strong>Total</strong>
              </Table.RowHeaderCell>
              <Table.Cell><strong>{formatCurrency(totalActual, currency)}</strong></Table.Cell>
              <Table.Cell><strong>{formatCurrency(totalTarget, currency)}</strong></Table.Cell>
              <Table.Cell>
                <strong>{formatCurrency(totalActual - totalTarget, currency)}</strong>
              </Table.Cell>
              <Table.Cell>100%</Table.Cell>
              <Table.Cell>
                <strong>{formatCurrency(totalCostAfter, currency)}</strong>
              </Table.Cell>
              <Table.Cell></Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>

        <Flex justify="end" mt="4">
          <Button onClick={handleSubmitAll}>Submit All</Button>
        </Flex>
      </Card>

      {/* Charts Section */}

      <Card mt="6">
        <Heading size="4" mb="3">Cost Breakdown Over Time</Heading>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={benchmarkTrendDataWithGap}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#8884d8"
              name="Actual Cost"
            />
            <Line
              type="monotone"
              dataKey="benchmark"
              stroke="#82ca9d"
              name="Benchmark Price"
            />
            {showGapAnalysis && (
              <Line
                type="monotone"
                dataKey="gap"
                stroke="#ff7300"
                strokeDasharray="5 5"
                name="Gap"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card mt="6">
        <Heading size="4" mb="3">Cost Composition</Heading>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      {/* Details Dialog */}
      <Dialog.Root open={dialogCategory !== null} onOpenChange={(open) => !open && setDialogCategory(null)}>
        <Dialog.Content style={{ maxWidth: 700, width: '90%' }}>
          <Dialog.Title>
            Details for {dialogCategory}
          </Dialog.Title>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Item</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Actual</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Target</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Cost After Optimization</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Solution</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {dialogCategory &&
                getDetailsByCategory(dialogCategory).map((item, idx) => (
                  <Table.Row key={idx}>
                    <Table.Cell>{item.name}</Table.Cell>
                    <Table.Cell>{formatCurrency(item.actual, currency)}</Table.Cell>
                    <Table.Cell>{formatCurrency(item.target, currency)}</Table.Cell>
                    <Table.Cell>{formatCurrency(item.costAfter, currency)}</Table.Cell>
                    <Table.Cell>
                      <RadixSelect.Root
                        value={solutions[dialogCategory]?.[idx] || ''}
                        onValueChange={(value) => handleSolutionChange(dialogCategory, idx, value)}
                      >
                        <RadixSelect.Trigger aria-label="Select solution" />
                        <RadixSelect.Content>
                          {solutionsOptions.map((opt) => (
                            <RadixSelect.Item key={opt} value={opt}>
                              {opt}
                            </RadixSelect.Item>
                          ))}
                        </RadixSelect.Content>
                      </RadixSelect.Root>
                    </Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table.Root>
          <Dialog.Close asChild>
            <Button mt="4" fullWidth>Close</Button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Root>
    </Box>
  );
}

export default CostAnalytics;
