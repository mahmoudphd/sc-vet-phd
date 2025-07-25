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
  Input,
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
  const [showTargetView, setShowTargetView] = useState(false);
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
  const postOptimizationEstimate = totalActual - totalCostAfter; // حسب طلبك

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

  const pieColors = ['#3b82f6', '#f59e0b', '#ef4444', '#10b981', '#a855f7'];

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
        <Box
          style={{
            border: '1px solid #ccc',
            borderRadius: 8,
            padding: 12,
            backgroundColor: '#fff',
          }}
        >
          <Text size="2">Actual Cost</Text>
          <Heading size="6">{formatCurrency(totalActual, currency)}</Heading>
        </Box>
        <Box
          style={{
            border: '1px solid #ccc',
            borderRadius: 8,
            padding: 12,
            backgroundColor: '#fff',
          }}
        >
          <Text size="2">Target Cost</Text>
          <Heading size="6">{formatCurrency(totalTarget, currency)}</Heading>
        </Box>
        <Box
          style={{
            border: '1px solid #ccc',
            borderRadius: 8,
            padding: 12,
            backgroundColor: '#fff',
          }}
        >
          <Text size="2">Cost After Optimization</Text>
          <Heading size="6">{formatCurrency(totalCostAfter, currency)}</Heading>
        </Box>
        <Box
          style={{
            border: '1px solid #ccc',
            borderRadius: 8,
            padding: 12,
            backgroundColor: '#fff',
          }}
        >
          <Text size="2">Post-Optimization Estimate</Text>
          <Heading size="6">{formatCurrency(postOptimizationEstimate, currency)}</Heading>
        </Box>
        <Box
          style={{
            border: '1px solid #ccc',
            borderRadius: 8,
            padding: 12,
            backgroundColor: '#fff',
          }}
        >
          <Text size="2">Benchmark Price (Editable)</Text>
          <Input
            type="number"
            value={benchmarkPrice}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setBenchmarkPrice(parseFloat(e.target.value) || 0)
            }
          />
        </Box>
        <Box
          style={{
            border: '1px solid #ccc',
            borderRadius: 8,
            padding: 12,
            backgroundColor: '#fff',
          }}
        >
          <Text size="2">Profit Margin (%)</Text>
          <Heading size="6">{profitMargin}%</Heading>
        </Box>
      </Grid>

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
                <Table.RowHeaderCell>{category}</Table.RowHeaderCell>
                <Table.Cell>{formatCurrency(totals[category].actual, currency)}</Table.Cell>
                <Table.Cell>
                  <Input
                    type="number"
                    value={totals[category].budget}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleTargetChange(category, parseFloat(e.target.value) || 0)
                    }
                    style={{ width: '80px' }}
                  />
                </Table.Cell>
                <Table.Cell style={{ color: varianceColor }}>
                  {formatCurrency(variance, currency)}
                </Table.Cell>
                <Table.Cell>{percentOfTotal(category)}%</Table.Cell>
                <Table.Cell>{formatCurrency(totals[category].costAfter, currency)}</Table.Cell>
                <Table.Cell>
                  <Button onClick={() => setDialogCategory(category)}>View Details</Button>
                </Table.Cell>
              </Table.Row>
            );
          })}
          <Table.Row>
            <Table.RowHeaderCell>
              <b>Total</b>
            </Table.RowHeaderCell>
            <Table.Cell>
              <b>{formatCurrency(totalActual, currency)}</b>
            </Table.Cell>
            <Table.Cell>
              <b>{formatCurrency(totalTarget, currency)}</b>
            </Table.Cell>
            <Table.Cell>
              <b>{formatCurrency(totalActual - totalTarget, currency)}</b>
            </Table.Cell>
            <Table.Cell>
              <b>100%</b>
            </Table.Cell>
            <Table.Cell>
              <b>{formatCurrency(totalCostAfter, currency)}</b>
            </Table.Cell>
            <Table.Cell></Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>

      {dialogCategory && (
        <Dialog.Root open onOpenChange={() => setDialogCategory(null)}>
          <Dialog.Content maxWidth="700px" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <Dialog.Title>{dialogCategory} Breakdown</Dialog.Title>
            <Flex justify="between" align="center" mb="3" mt="3">
              <Text>Auto IoT Mode</Text>
              <Switch checked={autoMode} onCheckedChange={(checked) => setAutoMode(checked)} />
            </Flex>
            <Flex justify="start" mb="3">
              <Button onClick={() => setAutoMode(!autoMode)}>
                {autoMode ? 'Switch to Manual Mode' : 'Switch to Auto Mode'}
              </Button>
            </Flex>

            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Actual Cost</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Target Cost</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Cost After Optimization</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Solution</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {getDetailsByCategory(dialogCategory).map((item, index) => (
                  <Table.Row key={index}>
                    <Table.RowHeaderCell>{item.name}</Table.RowHeaderCell>
                    <Table.Cell>
                      <Input
                        type="number"
                        disabled={autoMode}
                        value={item.actual}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          // update actual in data state
                          const val = parseFloat(e.target.value) || 0;
                          setData((prev) => {
                            const newData = { ...prev };
                            const items = getDetailsByCategory(dialogCategory);
                            items[index].actual = val;
                            return newData;
                          });
                        }}
                        style={{ width: '80px' }}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <Input
                        type="number"
                        disabled={autoMode}
                        value={item.target}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const val = parseFloat(e.target.value) || 0;
                          setData((prev) => {
                            const newData = { ...prev };
                            const items = getDetailsByCategory(dialogCategory);
                            items[index].target = val;
                            return newData;
                          });
                        }}
                        style={{ width: '80px' }}
                      />
                    </Table.Cell>
                    <Table.Cell>{formatCurrency(item.costAfter, currency)}</Table.Cell>
                    <Table.Cell>
                      <RadixSelect.Root
                        value={solutions[dialogCategory]?.[index] || ''}
                        onValueChange={(value) => handleSolutionChange(dialogCategory, index, value)}
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

            <Flex justify="end" mt="4">
              <Dialog.Close>
                <Button mt="4" style={{ width: '100%' }}>
                  Close
                </Button>
              </Dialog.Close>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      )}

      <Flex justify="end" mt="4">
        <Button onClick={() => alert('Submit All clicked')}>
          Submit All
        </Button>
      </Flex>

      {/* Charts Section */}

      <Card mt="6">
        <Flex justify="between" align="center">
          <Heading size="4">Cost Breakdown</Heading>
          <Button onClick={() => setShowTargetView(!showTargetView)}>
            {showTargetView ? 'Hide Gap Analysis' : 'Show Gap Analysis'}
          </Button>
        </Flex>
        <Box height={300} mt="3">
          <ResponsiveContainer width="100%" height="100%">
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
                dataKey="targetCost"
                stroke="#82ca9d"
                name="Target Cost"
              />
              {showTargetView && (
                <Line
                  type="monotone"
                  dataKey="gap"
                  stroke="#ff7300"
                  name="Gap"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Card>

      <Card mt="6">
        <Heading size="3" mb="3">
          Cost Composition
        </Heading>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categories.map((category, idx) => ({
                name: category,
                value: totals[category].actual,
              }))}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {pieColors.map((color, idx) => (
                <Cell key={idx} fill={color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      <Card mt="6">
        <Heading size="3" mb="3">
          Benchmark Price Analysis
        </Heading>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={benchmarkTrendDataWithGap}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="actual" stroke="#8884d8" name="Actual" />
            <Line type="monotone" dataKey="benchmark" stroke="#82ca9d" name="Benchmark" />
            <Line
              type="monotone"
              dataKey="gap"
              stroke="#ff7300"
              strokeDasharray="5 5"
              name="Gap"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </Box>
  );
}

export default CostAnalytics;
