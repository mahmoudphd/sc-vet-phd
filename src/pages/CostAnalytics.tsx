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
import { simulatedIoTCostData, Item, CostCategory } from './simulateIoTCostData';

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

const pieColors = ['#3b82f6', '#f59e0b', '#ef4444'];
function CostAnalytics() {
  const [dialogCategory, setDialogCategory] = useState<CostCategory | null>(null);
  const [benchmarkPrice, setBenchmarkPrice] = useState(220);
  const [profitMargin, setProfitMargin] = useState(25);
  const [currency, setCurrency] = useState<'EGP' | 'USD'>('EGP');
  const [autoMode, setAutoMode] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [showCostGap, setShowCostGap] = useState(true);
  const [data, setData] = useState(simulatedIoTCostData);
  const [solutions, setSolutions] = useState<Record<CostCategory, Record<number, string>>>({
    'Direct Materials': {},
    'Packaging Materials': {},
    'Direct Labor': {},
    'Overhead': {},
    'Other Costs': {},
  });

  const totals = data.totals;
  const totalActual = categories.reduce((sum, category) => sum + totals[category].actual, 0);
  const totalTarget = categories.reduce((sum, category) => sum + totals[category].budget, 0);
  const totalCostAfter = categories.reduce((sum, category) => sum + totals[category].costAfter, 0);
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

  const handleSubmitAll = () => {
    alert('Submitting all data to blockchain...');
  };

  const showGapAnalysis = () => {
    alert('Gap Analysis details shown here.');
  };

  const percentOfTotal = (category: CostCategory) =>
    totalActual === 0 ? '0.00' : ((totals[category].actual / totalActual) * 100).toFixed(2);
  return (
    <Box p="6" style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <Flex justify="between" align="center" mb="5" wrap="wrap" gap="3">
        <Heading size="6">Inter-Organizational Cost Management</Heading>
        <Flex gap="3" align="center" wrap="wrap">
          <Text>Product:</Text>
          <RadixSelect.Root value={selectedProduct} onValueChange={(v) => setSelectedProduct(v)}>
            <RadixSelect.Trigger aria-label="Select product" />
            <RadixSelect.Content>
              {products.map((p) => (
                <RadixSelect.Item key={p} value={p}>{p}</RadixSelect.Item>
              ))}
            </RadixSelect.Content>
          </RadixSelect.Root>
          <RadixSelect.Root value={currency} onValueChange={(v) => setCurrency(v as 'EGP' | 'USD')}>
            <RadixSelect.Trigger aria-label="Select currency" />
            <RadixSelect.Content>
              <RadixSelect.Item value="EGP">EGP</RadixSelect.Item>
              <RadixSelect.Item value="USD">USD</RadixSelect.Item>
            </RadixSelect.Content>
          </RadixSelect.Root>
          <Button onClick={() => alert('Export Report')}>Export Report</Button>
        </Flex>
      </Flex>

      <Grid columns="3" gap="4" mb="4">
        <Box style={{ border: '1px solid #ccc', padding: 12, backgroundColor: '#fff' }}>
          <Text size="2">Actual Cost</Text>
          <Heading size="6">{formatCurrency(totalActual, currency)}</Heading>
        </Box>
        <Box style={{ border: '1px solid #ccc', padding: 12, backgroundColor: '#fff' }}>
          <Text size="2">Target Cost</Text>
          <Heading size="6">{formatCurrency(totalTarget, currency)}</Heading>
        </Box>
        <Box style={{ border: '1px solid #ccc', padding: 12, backgroundColor: '#fff' }}>
          <Text size="2">Benchmark Price</Text>
          <input
            type="number"
            value={benchmarkPrice}
            onChange={(e) => setBenchmarkPrice(parseFloat(e.target.value) || 0)}
            style={{ width: '100%' }}
          />
        </Box>
      </Grid>

      <Grid columns="3" gap="4" mb="4">
        <Box style={{ border: '1px solid #ccc', padding: 12, backgroundColor: '#fff' }}>
          <Text size="2">Profit Margin (%)</Text>
          <input
            type="number"
            value={profitMargin}
            onChange={(e) => setProfitMargin(parseFloat(e.target.value) || 0)}
            style={{ width: '100%' }}
          />
        </Box>
        <Box style={{ border: '1px solid #ccc', padding: 12, backgroundColor: '#fff' }}>
          <Text size="2">Progress To Target</Text>
          <Heading size="6">
            {((totalActual / benchmarkPrice) * 100).toFixed(2)}%
          </Heading>
        </Box>
        <Box style={{ border: '1px solid #ccc', padding: 12, backgroundColor: '#fff' }}>
          <Text size="2">Post-Optimization Estimate</Text>
          <Heading size="6">{formatCurrency(totalCostAfter, currency)}</Heading>
        </Box>
      </Grid>
      <Box mb="5">
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Cost Category</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Actual</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Target (Editable)</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Post-Optimization Estimate</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Progress %</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Details</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {categories.map((category) => (
              <Table.Row key={category}>
                <Table.RowHeaderCell>{category}</Table.RowHeaderCell>
                <Table.Cell>{formatCurrency(totals[category].actual, currency)}</Table.Cell>
                <Table.Cell>
                  <input
                    type="number"
                    value={totals[category].budget}
                    onChange={(e) => handleTargetChange(category, parseFloat(e.target.value))}
                    style={{ width: '80px' }}
                  />
                </Table.Cell>
                <Table.Cell>{formatCurrency(totals[category].costAfter, currency)}</Table.Cell>
                <Table.Cell>{percentOfTotal(category)}%</Table.Cell>
                <Table.Cell>
                  <Button onClick={() => setDialogCategory(category)}>Details</Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
      <Flex gap="4" wrap="wrap" mb="5">
        <Box style={{ flex: '1', minWidth: '300px', height: '300px', backgroundColor: '#fff' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categories.map((category) => ({
                  name: category,
                  value: totals[category].actual,
                }))}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {categories.map((category, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        <Box style={{ flex: '1', minWidth: '300px', height: '300px', backgroundColor: '#fff' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={benchmarkTrendDataWithGap}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="actual" stroke="#3b82f6" />
              <Line type="monotone" dataKey="targetCost" stroke="#10b981" />
              <Line type="monotone" dataKey="gap" stroke="#ef4444" />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Flex>

      <Flex gap="3" mb="5">
        <Button onClick={showGapAnalysis} color="blue">Show Gap Analysis</Button>
        <Button onClick={handleSubmitAll} color="green">Submit To Blockchain</Button>
      </Flex>
      {dialogCategory && (
        <Dialog.Root open={!!dialogCategory} onOpenChange={() => setDialogCategory(null)}>
          <Dialog.Content style={{ maxWidth: 600 }}>
            <Dialog.Title>
              {dialogCategory} Details
              <Button size="1" style={{ marginLeft: '8px' }} onClick={() => alert('Here are cost reduction suggestions.')}>
                Improve Tips
              </Button>
            </Dialog.Title>
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Item</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Cost</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Solution</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {getDetailsByCategory(dialogCategory).map((item, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>{item.name}</Table.Cell>
                    <Table.Cell>{formatCurrency(item.cost ?? 0, currency)}</Table.Cell>
                    <Table.Cell>
                      <RadixSelect.Root
                        value={solutions[dialogCategory][index] || ''}
                        onValueChange={(v) => handleSolutionChange(dialogCategory, index, v)}
                      >
                        <RadixSelect.Trigger aria-label="Select solution" />
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
            <Flex justify="end" mt="3">
              <Switch checked={autoMode} onCheckedChange={setAutoMode} />
              <Text style={{ marginLeft: '8px' }}>Auto Mode</Text>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      )}
    </Box>
  );
}

export default CostAnalytics;
