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

function CostAnalytics() {
  const [dialogCategory, setDialogCategory] = useState<CostCategory | null>(null);
  const [benchmarkPrice, setBenchmarkPrice] = useState(220);
  const [profitMargin, setProfitMargin] = useState(25);
  const [currency, setCurrency] = useState<'EGP' | 'USD'>('EGP');
  const [autoMode, setAutoMode] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [showCostGap, setShowCostGap] = useState(true);
  const [data, setData] = useState(simulatedIoTCostData);
  const totals = data.totals;

  const totalActual = categories.reduce((sum, category) => sum + totals[category].actual, 0);
  const totalTarget = categories.reduce((sum, category) => sum + totals[category].budget, 0);
  const totalCostAfter = categories.reduce((sum, category) => sum + totals[category].costAfter, 0);

  const targetCost = benchmarkPrice * (1 - profitMargin / 100);
  const postOptimizationEstimate = totalCostAfter * (1 - profitMargin / 100);

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

  const [solutions, setSolutions] = useState<Record<CostCategory, Record<number, string>>>({
    'Direct Materials': {},
    'Packaging Materials': {},
    'Direct Labor': {},
    'Overhead': {},
    'Other Costs': {},
  });

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
            onValueChange={(value) => setCurrenc
      <Grid columns={{ initial: '3', md: '3' }} gap="4" mb="6">
        <Box
          style={{
            border: '1px solid #ccc',
            borderRadius: 8,
            padding: 12,
            backgroundColor: '#e0f2fe',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Box
            style={{
              width: 24,
              height: 24,
              backgroundColor: '#3b82f6',
              borderRadius: '50%',
            }}
          />
          <Text size="2">Actual Cost</Text>
          <Heading size="6" style={{ marginLeft: 'auto' }}>
            {formatCurrency(totalActual, currency)}
          </Heading>
        </Box>
        <Box
          style={{
            border: '1px solid #ccc',
            borderRadius: 8,
            padding: 12,
            backgroundColor: '#dcfce7',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Box
            style={{
              width: 24,
              height: 24,
              backgroundColor: '#10b981',
              borderRadius: '50%',
            }}
          />
          <Text size="2">Target Cost</Text>
          <Heading size="6" style={{ marginLeft: 'auto' }}>
            {formatCurrency(totalTarget, currency)}
          </Heading>
        </Box>
        <Box
          style={{
            border: '1px solid #ccc',
            borderRadius: 8,
            padding: 12,
            backgroundColor: '#f0fdf4',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Box
            style={{
              width: 24,
              height: 24,
              backgroundColor: '#65a30d',
              borderRadius: '50%',
            }}
          />
          <Text size="2">Cost After Optimization</Text>
          <Heading size="6" style={{ marginLeft: 'auto' }}>
            {formatCurrency(totalCostAfter, currency)}
          </Heading>
        </Box>
      </Grid>

      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Category</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actual</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Cost After Optimization</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Target (Editable)</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>% of Total</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>View Details</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {categories.map((category) => (
            <Table.Row key={category}>
              <Table.RowHeaderCell>{category}</Table.RowHeaderCell>
              <Table.Cell>{formatCurrency(totals[category].actual, currency)}</Table.Cell>
              <Table.Cell>{formatCurrency(totals[category].costAfter, currency)}</Table.Cell>
              <Table.Cell>
                <input
                  type="number"
                  value={totals[category].budget}
                  onChange={(e) => handleTargetChange(category, parseFloat(e.target.value) || 0)}
                  style={{ width: '80px' }}
                />
              </Table.Cell>
              <Table.Cell>{percentOfTotal(category)}%</Table.Cell>
              <Table.Cell>
                <Button onClick={() => setDialogCategory(category)}>View Details</Button>
              </Table.Cell>
            </Table.Row>
          ))}
          <Table.Row>
            <Table.RowHeaderCell>
              <b>Total</b>
            </Table.RowHeaderCell>
            <Table.Cell>
              <b>{formatCurrency(totalActual, currency)}</b>
            </Table.Cell>
            <Table.Cell>
              <b>{formatCurrency(totalCostAfter, currency)}</b>
            </Table.Cell>
            <Table.Cell>
              <b>{formatCurrency(totalTarget, currency)}</b>
            </Table.Cell>
            <Table.Cell>
              <b>100%</b>
            </Table.Cell>
            <Table.Cell></Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
      {dialogCategory && (
        <Dialog.Root open onOpenChange={() => setDialogCategory(null)}>
          <Dialog.Content
            maxWidth="700px"
            style={{ maxHeight: '80vh', overflowY: 'auto' }}
          >
            <Dialog.Title>{dialogCategory} Breakdown</Dialog.Title>

            <Flex justify="between" align="center" mb="3" mt="3">
              <Text>Auto Mode</Text>
              <Switch
                checked={autoMode}
                onCheckedChange={(checked) => setAutoMode(checked)}
              />
            </Flex>

            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Item</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Qty / Hours / Kg</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>
                    Unit Price / Hourly Rate / PricePerKg
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
                      costValue =
                        (item.concentrationKg ?? 0) * (item.pricePerKg ?? 0);
                    } else if (dialogCategory === 'Direct Labor') {
                      costValue = (item.hours ?? 0) * (item.hourlyRate ?? 0);
                    } else {
                      costValue = (item.qty ?? 0) * (item.unitPrice ?? 0);
                    }
                  }
                  return (
                    <Table.Row key={index}>
                      <Table.RowHeaderCell>{item.name}</Table.RowHeaderCell>
                      <Table.Cell>
                        {autoMode ? (
                          dialogCategory === 'Direct Materials' ? (
                            item.concentrationKg?.toFixed(3) ?? '-'
                          ) : dialogCategory === 'Direct Labor' ? (
                            item.hours ?? '-'
                          ) : (
                            item.qty ?? '-'
                          )
                        ) : (
                          <input
                            type="number"
                            value={
                              dialogCategory === 'Direct Materials'
                                ? item.concentrationKg ?? 0
                                : dialogCategory === 'Direct Labor'
                                ? item.hours ?? 0
                                : item.qty ?? 0
                            }
                            onChange={(e) => {
                              const value = parseFloat(e.target.value) || 0;
                              if (dialogCategory === 'Direct Materials')
                                item.concentrationKg = value;
                              else if (dialogCategory === 'Direct Labor')
                                item.hours = value;
                              else item.qty = value;
                            }}
                            style={{ width: '80px' }}
                          />
                        )}
                      </Table.Cell>
                      <Table.Cell>
                        {autoMode ? (
                          dialogCategory === 'Direct Materials' ? (
                            item.pricePerKg ? (
                              formatCurrency(item.pricePerKg, currency)
                            ) : (
                              '-'
                            )
                          ) : dialogCategory === 'Direct Labor' ? (
                            item.hourlyRate ? (
                              formatCurrency(item.hourlyRate, currency)
                            ) : (
                              '-'
                            )
                          ) : item.unitPrice ? (
                            formatCurrency(item.unitPrice, currency)
                          ) : (
                            '-'
                          )
                        ) : (
                          <input
                            type="number"
                            value={
                              dialogCategory === 'Direct Materials'
                                ? item.pricePerKg ?? 0
                                : dialogCategory === 'Direct Labor'
                                ? item.hourlyRate ?? 0
                                : item.unitPrice ?? 0
                            }
                            onChange={(e) => {
                              const value = parseFloat(e.target.value) || 0;
                              if (dialogCategory === 'Direct Materials')
                                item.pricePerKg = value;
                              else if (dialogCategory === 'Direct Labor')
                                item.hourlyRate = value;
                              else item.unitPrice = value;
                            }}
                            style={{ width: '80px' }}
                          />
                        )}
                      </Table.Cell>
                      <Table.Cell>{formatCurrency(costValue, currency)}</Table.Cell>
                      <Table.Cell>
                        <RadixSelect.Root
                          value={solutions[dialogCategory]?.[index] || ''}
                          onValueChange={(value) =>
                            handleSolutionChange(dialogCategory, index, value)
                          }
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
              <Button
                style={{ backgroundColor: '#10b981', color: '#fff' }}
                onClick={() => {
                  // Could add submit logic here
                  alert('Submitted');
                  setDialogCategory(null);
                }}
              >
                Submit
              </Button>
              <Button
                variant="ghost"
                style={{ backgroundColor: '#3b82f6', color: '#fff' }}
                onClick={() => setDialogCategory(null)}
              >
                Close
              </Button>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      )}
      <Flex justify="center" mt="6">
        <Button
          style={{ backgroundColor: '#10b981', color: '#fff' }}
          onClick={() => alert('Submitted to Blockchain')}
        >
          Submit to Blockchain
        </Button>
      </Flex>

      <Box mt="8">
        <Heading size="5" mb="3">
          Benchmark & Cost Trend
        </Heading>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={benchmarkTrendDataWithGap} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="actual" stroke="#3b82f6" name="Actual Cost" />
            <Line type="monotone" dataKey="benchmark" stroke="#f59e0b" name="Benchmark Price" />
            <Line type="monotone" dataKey="targetCost" stroke="#10b981" name="Target Cost" />
          </LineChart>
        </ResponsiveContainer>
      </Box>

      <Box mt="8">
        <Heading size="5" mb="3">
          Cost Composition (Actual)
        </Heading>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categories.map((category) => ({
                name: category,
                value: totals[category].actual,
              }))}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
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
    </Box>
  );
}

export default CostAnalytics;
