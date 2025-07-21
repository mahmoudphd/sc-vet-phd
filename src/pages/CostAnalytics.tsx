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

export default function CostAnalytics() {
  const [dialogCategory, setDialogCategory] = useState<CostCategory | null>(null);
  const [benchmarkPrice, setBenchmarkPrice] = useState(220);
  const [profitMargin, setProfitMargin] = useState(25);
  const [currency, setCurrency] = useState<'EGP' | 'USD'>('EGP');
  const [autoMode, setAutoMode] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [solutions, setSolutions] = useState<Record<string, Record<number, string>>>({});
  const [manualData, setManualData] = useState<Record<string, Record<number, number>>>({});
  const [showCostGap, setShowCostGap] = useState(true);

  const totals = simulatedIoTCostData.totals;

  const totalActual = categories.reduce((sum, category) => sum + totals[category].actual, 0);
  const totalBudget = categories.reduce((sum, category) => sum + totals[category].budget, 0);
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

  const pieColors = ['#3b82f6', '#f59e0b', '#ef4444'];

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

  const handleManualChange = (category: CostCategory, index: number, value: number) => {
    setManualData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [index]: value,
      },
    }));
  };

  const postOptimizationEstimate = totalCostAfter * (1 - profitMargin / 100);

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
          <Button onClick={() => alert('Export Report not implemented')}>Export Report</Button>
        </Flex>
      </Flex>

      <Grid columns={{ initial: '3', md: '3' }} gap="4" mb="6">
        <Box style={{ border: '1px solid #ccc', borderRadius: 8, padding: 12, backgroundColor: '#fff' }}>
          <Text size="2">Actual Cost</Text>
          <Heading size="6">{formatCurrency(totalActual, currency)}</Heading>
        </Box>
        <Box style={{ border: '1px solid #ccc', borderRadius: 8, padding: 12, backgroundColor: '#fff' }}>
          <Text size="2">Budget Target</Text>
          <input
            type="number"
            value={benchmarkPrice}
            onChange={(e) => setBenchmarkPrice(parseFloat(e.target.value) || 0)}
            style={{ padding: '8px', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
            min={0}
          />
        </Box>
        <Box style={{ border: '1px solid #ccc', borderRadius: 8, padding: 12, backgroundColor: '#fff' }}>
          <Text size="2">Profit Margin (%)</Text>
          <input
            type="number"
            value={profitMargin}
            onChange={(e) => setProfitMargin(parseFloat(e.target.value) || 0)}
            style={{ padding: '8px', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
            min={0}
            max={100}
          />
        </Box>
      </Grid>

      <Flex justify="center" mb="3">
        <Button
          color="green"
          onClick={() => setShowCostGap((prev) => !prev)}
        >
          {showCostGap ? 'Hide Cost Gap' : 'Show Cost Gap'}
        </Button>
      </Flex>

      <Flex gap="8" mb="6" style={{ height: 300 }}>
        <Box style={{ flex: 1, border: '1px solid #ccc', borderRadius: 8, padding: 12 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[
                  {
                    name: 'Direct Cost',
                    value: totals['Direct Materials'].actual + totals['Packaging Materials'].actual + totals['Direct Labor'].actual,
                  },
                  { name: 'Overhead', value: totals['Overhead'].actual },
                  { name: 'Other Costs', value: totals['Other Costs'].actual },
                ]}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                <Cell fill={pieColors[0]} />
                <Cell fill={pieColors[1]} />
                <Cell fill={pieColors[2]} />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Box>
        <Box style={{ flex: 1, border: '1px solid #ccc', borderRadius: 8, padding: 12 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={benchmarkTrendDataWithGap}>
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => formatCurrency(value, currency)} />
              <Tooltip formatter={(value: number) => formatCurrency(value, currency)} />
              <Legend />
              <Line type="monotone" dataKey="actual" stroke="#3b82f6" name="Actual Cost" />
              <Line type="monotone" dataKey="benchmark" stroke="#f59e0b" name="Budget Target" />
              <Line type="monotone" dataKey="targetCost" stroke="#ef4444" name="Target Cost" strokeDasharray="5 5" />
              {showCostGap && (
                <Line type="monotone" dataKey="gap" stroke="#10b981" name="Cost Gap" dot={false} isAnimationActive={false} />
              )}
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Flex>

      <Flex justify="center" mt="6" mb="6">
        <Button color="green" onClick={() => alert('Submit to Blockchain clicked')}>
          Submit to Blockchain
        </Button>
      </Flex>

      {dialogCategory && (
        <Dialog.Root open onOpenChange={() => setDialogCategory(null)}>
          <Dialog.Content maxWidth="700px" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <Dialog.Title>{dialogCategory} Breakdown</Dialog.Title>

            <Flex justify="between" align="center" mb="3" mt="3">
              <Text>Auto Mode</Text>
              <Switch checked={autoMode} onCheckedChange={(checked) => setAutoMode(checked)} />
            </Flex>
            {!autoMode && (
              <Text color="gray" mb="3">
                Manual input mode enabled. You can modify the cost data below.
              </Text>
            )}

            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Item</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>
                    {dialogCategory === 'Direct Materials'
                      ? 'Concentration (kg)'
                      : dialogCategory === 'Direct Labor'
                      ? 'Hours'
                      : 'Qty'}
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>
                    {dialogCategory === 'Direct Materials'
                      ? 'Price / Kg'
                      : dialogCategory === 'Direct Labor'
                      ? 'Hourly Rate'
                      : 'Unit Price'}
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Cost</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Solution</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {getDetailsByCategory(dialogCategory).map((item, index) => {
                  let costValue = item.cost ?? 0;
                  if (autoMode) {
                    if (dialogCategory === 'Direct Materials') {
                      costValue = (item.concentrationKg ?? 0) * (item.pricePerKg ?? 0);
                    } else if (dialogCategory === 'Direct Labor') {
                      costValue = (item.hours ?? 0) * (item.hourlyRate ?? 0);
                    } else {
                      costValue = (item.qty ?? 0) * (item.unitPrice ?? 0);
                    }
                  } else {
                    costValue = manualData[dialogCategory]?.[index] ?? costValue;
                  }
                  return (
                    <Table.Row key={index}>
                      <Table.RowHeaderCell>{item.name}</Table.RowHeaderCell>
                      <Table.Cell>
                        {dialogCategory === 'Direct Materials'
                          ? item.concentrationKg?.toFixed(3) ?? '-'
                          : dialogCategory === 'Direct Labor'
                          ? item.hours ?? '-'
                          : item.qty ?? '-'}
                      </Table.Cell>
                      <Table.Cell>
                        {dialogCategory === 'Direct Materials'
                          ? item.pricePerKg
                            ? formatCurrency(item.pricePerKg, currency)
                            : '-'
                          : dialogCategory === 'Direct Labor'
                          ? item.hourlyRate
                            ? formatCurrency(item.hourlyRate, currency)
                            : '-'
                          : item.unitPrice
                          ? formatCurrency(item.unitPrice, currency)
                          : '-'}
                      </Table.Cell>
                      <Table.Cell>
                        {autoMode ? (
                          formatCurrency(costValue, currency)
                        ) : (
                          <input
                            type="number"
                            value={costValue}
                            onChange={(e) =>
                              handleManualChange(
                                dialogCategory,
                                index,
                                parseFloat(e.target.value) || 0
                              )
                            }
                            style={{
                              width: '80px',
                              padding: '4px',
                              fontSize: '0.9rem',
                              border: '1px solid #ccc',
                              borderRadius: 4,
                            }}
                          />
                        )}
                      </Table.Cell>
                      <Table.Cell>
                        <RadixSelect.Root
                          value={solutions[dialogCategory]?.[index] || ''}
                          onValueChange={(value) => handleSolutionChange(dialogCategory, index, value)}
                        >
                          <RadixSelect.Trigger aria-label="Select solution" />
                          <RadixSelect.Content>
                            {solutionsOptions.map((sol) => (
                              <RadixSelect.Item key={sol} value={sol}>
                                {sol}
                              </RadixSelect.Item>
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
              <Button color="green" onClick={() => alert('Submit clicked')}>
                Submit
              </Button>
              <Button color="blue" variant="ghost" onClick={() => setDialogCategory(null)}>
                Close
              </Button>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      )}
    </Box>
  );
}
