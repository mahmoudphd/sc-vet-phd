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
  const [dialogAutoMode, setDialogAutoMode] = useState<Record<CostCategory, boolean>>({
    'Direct Materials': true,
    'Packaging Materials': true,
    'Direct Labor': true,
    'Overhead': true,
    'Other Costs': true,
  });
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
      <Heading mb="4">Inter-Organizational Cost Management</Heading>

      <Flex gap="3" align="center" mb="4">
        <Text>Product:</Text>
        <RadixSelect.Root value={selectedProduct} onValueChange={setSelectedProduct}>
          <RadixSelect.Trigger />
          <RadixSelect.Content>
            {products.map((p) => (
              <RadixSelect.Item key={p} value={p}>{p}</RadixSelect.Item>
            ))}
          </RadixSelect.Content>
        </RadixSelect.Root>

        <Text>Currency:</Text>
        <RadixSelect.Root value={currency} onValueChange={(value) => setCurrency(value as 'EGP' | 'USD')}>
          <RadixSelect.Trigger />
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

      <Grid columns={{ initial: '3', md: '3' }} gap="4" mb="4">
        <Box><Text>Actual Cost</Text><Heading>{formatCurrency(totalActual, currency)}</Heading></Box>
        <Box><Text>Target Cost</Text><Heading>{formatCurrency(totalTarget, currency)}</Heading></Box>
        <Box><Text>Cost After Optimization</Text><Heading>{formatCurrency(totalCostAfter, currency)}</Heading></Box>
        <Box><Text>Benchmark Price</Text><TextField type="number" value={benchmarkPrice} onChange={(e) => setBenchmarkPrice(parseFloat(e.target.value) || 0)} /></Box>
        <Box><Text>Profit Margin (%)</Text><TextField type="number" value={profitMargin} onChange={(e) => setProfitMargin(parseFloat(e.target.value) || 0)} /></Box>
        <Box><Text>Post-Optimization Estimate</Text><Heading>{formatCurrency(postOptimizationEstimate, currency)}</Heading></Box>
      </Grid>

      <Flex gap="6" mb="6">
        <Box flex="1">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                dataKey="value"
                nameKey="name"
                data={[
                  { name: 'Direct Cost', value: totals['Direct Materials'].actual + totals['Packaging Materials'].actual + totals['Direct Labor'].actual },
                  { name: 'Overhead', value: totals['Overhead'].actual },
                  { name: 'Other Costs', value: totals['Other Costs'].actual },
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
        <Box flex="1">
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

      {categories.map((category) => (
        <Box key={category} mb="6">
          <Flex justify="between" align="center" mb="2">
            <Heading size="4">{category}</Heading>
            <Button onClick={() => setDialogCategory(category)}>View Details</Button>
          </Flex>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Item</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Qty</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Unit Price</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Cost</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Solution</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {getDetailsByCategory(category).map((item, index) => (
                <Table.Row key={index}>
                  <Table.Cell>{item.name}</Table.Cell>
                  <Table.Cell>{item.qty}</Table.Cell>
                  <Table.Cell>{formatCurrency(item.unitPrice || 0, currency)}</Table.Cell>
                  <Table.Cell>{formatCurrency(item.cost, currency)}</Table.Cell>
                  <Table.Cell>
                    <RadixSelect.Root
                      value={solutions[category]?.[index] || ''}
                      onValueChange={(value) => handleSolutionChange(category, index, value)}
                    >
                      <RadixSelect.Trigger />
                      <RadixSelect.Content>
                        {solutionsOptions.map((s) => (
                          <RadixSelect.Item key={s} value={s}>{s}</RadixSelect.Item>
                        ))}
                      </RadixSelect.Content>
                    </RadixSelect.Root>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>

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
                  {getDetailsByCategory(category).map((item, idx) => (
                    <Table.Row key={idx}>
                      <Table.Cell>{item.name}</Table.Cell>
                      <Table.Cell>
                        {dialogAutoMode[category] ? item.qty : (
                          <TextField
                            type="number"
                            defaultValue={item.qty}
                            style={{ width: '80px' }}
                          />
                        )}
                      </Table.Cell>
                      <Table.Cell>
                        {dialogAutoMode[category] ? formatCurrency(item.unitPrice || 0, currency) : (
                          <TextField
                            type="number"
                            defaultValue={item.unitPrice}
                            style={{ width: '80px' }}
                          />
                        )}
                      </Table.Cell>
                      <Table.Cell>{formatCurrency(item.cost, currency)}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
              <Dialog.Close>
                <Button variant="soft" mt="3">Close</Button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Root>
        </Box>
      ))}
    </Box>
  );
}
