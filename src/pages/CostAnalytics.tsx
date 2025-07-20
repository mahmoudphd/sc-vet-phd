// src/pages/CostAnalytics.tsx

import { useState } from 'react';
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
  TextField,
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

const formatCurrency = (value: number, currency: string) => `${currency} ${value.toFixed(2)}`;

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
  const [mainAutoMode, setMainAutoMode] = useState(true);
  const [dialogAutoMode, setDialogAutoMode] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [solutions, setSolutions] = useState<Record<string, Record<number, string>>>({});

  const totals = simulatedIoTCostData.totals;

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

  const percentOfTotal = (category: CostCategory) => ((totals[category].actual / totalActual) * 100).toFixed(2);

  const handleSolutionChange = (category: CostCategory, index: number, value: string) => {
    setSolutions((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [index]: value,
      },
    }));
  };

  return (
    <Box p="4">
      <Flex justify="between" align="center" mb="4">
        <Heading>Inter-Organizational Cost Management</Heading>
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

          <RadixSelect.Root value={currency} onValueChange={(value) => setCurrency(value as 'EGP' | 'USD')}>
            <RadixSelect.Trigger aria-label="Select currency" />
            <RadixSelect.Content>
              <RadixSelect.Item value="EGP">EGP</RadixSelect.Item>
              <RadixSelect.Item value="USD">USD</RadixSelect.Item>
            </RadixSelect.Content>
          </RadixSelect.Root>

          <Flex align="center" gap="2">
            <Text>Auto Mode</Text>
            <Switch checked={mainAutoMode} onCheckedChange={setMainAutoMode} />
          </Flex>

          <Button onClick={() => alert('Export functionality not implemented yet.')}>Export Report</Button>
        </Flex>
      </Flex>

      <Grid columns={{ initial: '3', md: '3' }} gap="4" mb="4">
        <Box border="1px solid #ccc" borderRadius="8" p="3" backgroundColor="white">
          <Text size="2">Actual Cost</Text>
          <Heading size="6">{formatCurrency(totalActual, currency)}</Heading>
        </Box>
        <Box border="1px solid #ccc" borderRadius="8" p="3" backgroundColor="white">
          <Text size="2">Target Cost</Text>
          <Heading size="6">{formatCurrency(totalTarget, currency)}</Heading>
        </Box>
        <Box border="1px solid #ccc" borderRadius="8" p="3" backgroundColor="white">
          <Text size="2">Cost After Optimization</Text>
          <Heading size="6">{formatCurrency(totalCostAfter, currency)}</Heading>
        </Box>
        <Box border="1px solid #ccc" borderRadius="8" p="3" backgroundColor="white">
          <Text size="2">Benchmark Price</Text>
          <TextField type="number" value={benchmarkPrice} onChange={(e) => setBenchmarkPrice(parseFloat(e.target.value) || 0)} />
        </Box>
        <Box border="1px solid #ccc" borderRadius="8" p="3" backgroundColor="white">
          <Text size="2">Profit Margin (%)</Text>
          <TextField type="number" value={profitMargin} onChange={(e) => setProfitMargin(parseFloat(e.target.value) || 0)} />
        </Box>
        <Box border="1px solid #ccc" borderRadius="8" p="3" backgroundColor="white">
          <Text size="2">Progress to Target</Text>
          <Progress value={Math.min((targetCost / totalActual) * 100, 100)} />
          <Text>{Math.round((targetCost / totalActual) * 100)}%</Text>
        </Box>
        <Box border="1px solid #ccc" borderRadius="8" p="3" backgroundColor="white">
          <Text size="2">Post-Optimization Estimate</Text>
          <Heading size="6">{formatCurrency(postOptimizationEstimate, currency)}</Heading>
        </Box>
      </Grid>

      <Flex gap="6" mb="6">
        <Box flex="1" border="1px solid #ccc" borderRadius="8" p="3" backgroundColor="white">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data=[
                  {
                    name: 'Direct Cost',
                    value:
                      totals['Direct Materials'].actual +
                      totals['Packaging Materials'].actual +
                      totals['Direct Labor'].actual,
                  },
                  { name: 'Overhead', value: totals['Overhead'].actual },
                  { name: 'Other Costs', value: totals['Other Costs'].actual },
                ]
                dataKey="value"
                nameKey="name"
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

        <Box flex="1" border="1px solid #ccc" borderRadius="8" p="3" backgroundColor="white">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={benchmarkTrendDataWithGap}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="actual" stroke="#3b82f6" name="Actual Cost" />
              <Line type="monotone" dataKey="benchmark" stroke="#f59e0b" name="Benchmark Price" />
              <Line type="monotone" dataKey="targetCost" stroke="#ef4444" name="Target Cost" />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Flex>

      {/* Continue with table and dialog logic... */}
    </Box>
  );
}
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Category</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actual</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Target</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Cost After</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>% of Total</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Solution</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Action</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {categories.map((category) => (
            <Table.Row key={category}>
              <Table.RowHeaderCell>{category}</Table.RowHeaderCell>
              <Table.Cell>{formatCurrency(totals[category].actual, currency)}</Table.Cell>
              <Table.Cell>{formatCurrency(totals[category].budget, currency)}</Table.Cell>
              <Table.Cell>{formatCurrency(totals[category].costAfter, currency)}</Table.Cell>
              <Table.Cell>{percentOfTotal(category)}%</Table.Cell>
              <Table.Cell>
                <RadixSelect.Root
                  value={solutions[category]?.[0] || ''}
                  onValueChange={(value) => handleSolutionChange(category, 0, value)}
                >
                  <RadixSelect.Trigger placeholder="Select solution" />
                  <RadixSelect.Content>
                    {solutionsOptions.map((option) => (
                      <RadixSelect.Item key={option} value={option}>{option}</RadixSelect.Item>
                    ))}
                  </RadixSelect.Content>
                </RadixSelect.Root>
              </Table.Cell>
              <Table.Cell>
                <Button size="1" onClick={() => {
                  setDialogCategory(category);
                  setDialogAutoMode(true);
                }}>View Details</Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <Dialog.Root open={!!dialogCategory} onOpenChange={() => setDialogCategory(null)}>
        <Dialog.Content maxWidth="600px">
          <Dialog.Title>{dialogCategory} Breakdown</Dialog.Title>
          <Flex align="center" gap="3" mb="3">
            <Text>Auto Mode</Text>
            <Switch checked={dialogAutoMode} onCheckedChange={setDialogAutoMode} />
          </Flex>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                {dialogCategory === 'Direct Materials' && (
                  <>
                    <Table.ColumnHeaderCell>Composition</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Concentration (kg)</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Price/Kg</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Cost</Table.ColumnHeaderCell>
                  </>
                )}
                {dialogCategory !== 'Direct Materials' && (
                  <>
                    <Table.ColumnHeaderCell>Item</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Qty</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Unit Price</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Cost</Table.ColumnHeaderCell>
                  </>
                )}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {getDetailsByCategory(dialogCategory || 'Direct Materials').map((item, index) => (
                <Table.Row key={index}>
                  <Table.Cell>{item.name}</Table.Cell>
                  <Table.Cell>
                    {dialogAutoMode ? item.qty ?? item.concentrationKg : (
                      <TextField
                        type="number"
                        value={(item.qty ?? item.concentrationKg)?.toString() || ''}
                        onChange={(e) => {
                          const newValue = parseFloat(e.target.value) || 0;
                          if (dialogCategory && !dialogAutoMode) {
                            const details = getDetailsByCategory(dialogCategory);
                            if ('qty' in details[index]) details[index].qty = newValue;
                            else if ('concentrationKg' in details[index]) details[index].concentrationKg = newValue;
                          }
                        }}
                      />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {dialogAutoMode ? item.unitPrice ?? item.pricePerKg : (
                      <TextField
                        type="number"
                        value={(item.unitPrice ?? item.pricePerKg)?.toString() || ''}
                        onChange={(e) => {
                          const newValue = parseFloat(e.target.value) || 0;
                          if (dialogCategory && !dialogAutoMode) {
                            const details = getDetailsByCategory(dialogCategory);
                            if ('unitPrice' in details[index]) details[index].unitPrice = newValue;
                            else if ('pricePerKg' in details[index]) details[index].pricePerKg = newValue;
                          }
                        }}
                      />
                    )}
                  </Table.Cell>
                  <Table.Cell>{formatCurrency(item.cost, currency)}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
          <Flex justify="end" mt="4">
            <Button onClick={() => setDialogCategory(null)}>Close</Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Box>
  );
}
