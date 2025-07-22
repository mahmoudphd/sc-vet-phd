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

const pieColors = ['#3b82f6', '#f59e0b', '#ef4444', '#10b981', '#6366f1'];
function CostAnalytics() {
  const [dialogCategory, setDialogCategory] = useState<CostCategory | null>(null);
  const [benchmarkPrice, setBenchmarkPrice] = useState(220);
  const [profitMargin, setProfitMargin] = useState(25);
  const [currency, setCurrency] = useState<'EGP' | 'USD'>('EGP');
  const [autoMode, setAutoMode] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [solutions, setSolutions] = useState<Record<CostCategory, Record<number, string>>>({
    'Direct Materials': {}, 'Packaging Materials': {}, 'Direct Labor': {}, 'Overhead': {}, 'Other Costs': {}
  });

  const totals = simulatedIoTCostData.totals;
  const totalActual = categories.reduce((sum, c) => sum + totals[c].actual, 0);
  const totalTarget = categories.reduce((sum, c) => sum + totals[c].budget, 0);
  const totalCostAfter = categories.reduce((sum, c) => sum + totals[c].costAfter, 0);
  const targetCost = benchmarkPrice * (1 - profitMargin / 100);
  const postOptimizationEstimate = totalCostAfter;

  const handleSolutionChange = (category: CostCategory, index: number, value: string) => {
    setSolutions((prev) => ({ ...prev, [category]: { ...prev[category], [index]: value } }));
  };
const getDetailsByCategory = (category: CostCategory): Item[] => {
  switch (category) {
    case 'Direct Materials': return simulatedIoTCostData.rawMaterials;
    case 'Packaging Materials': return simulatedIoTCostData.packagingMaterials;
    case 'Direct Labor': return simulatedIoTCostData.directLabor;
    case 'Overhead': return simulatedIoTCostData.overheadItems;
    case 'Other Costs': return simulatedIoTCostData.otherCosts;
    default: return [];
  }
};

const benchmarkTrendData = [
  { month: 'Jan', actual: 169.61, benchmark: benchmarkPrice },
  { month: 'Feb', actual: 170.5, benchmark: benchmarkPrice },
  { month: 'Mar', actual: 168.0, benchmark: benchmarkPrice },
  { month: 'Apr', actual: 171.2, benchmark: benchmarkPrice },
  { month: 'May', actual: totalActual, benchmark: benchmarkPrice },
];

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
return (
  <Box p="6" style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
    <Flex justify="between" align="center" mb="4" wrap="wrap" gap="3">
      <Heading size="6">Inter-Organizational Cost Management</Heading>
      <Flex gap="3" align="center" wrap="wrap">
        <Text>Product:</Text>
        <RadixSelect.Root value={selectedProduct} onValueChange={setSelectedProduct}>
          <RadixSelect.Trigger aria-label="Select product" />
          <RadixSelect.Content>
            {products.map((p) => <RadixSelect.Item key={p} value={p}>{p}</RadixSelect.Item>)}
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

    <Grid columns={{ initial: '3', md: '3' }} gap="3" mb="4">
      <Box><Text size="2">Actual Cost</Text><Heading>{formatCurrency(totalActual, currency)}</Heading></Box>
      <Box><Text size="2">Target Cost</Text><Heading>{formatCurrency(totalTarget, currency)}</Heading></Box>
      <Box>
        <Text size="2">Benchmark Price</Text>
        <input type="number" value={benchmarkPrice} onChange={(e) => setBenchmarkPrice(parseFloat(e.target.value) || 0)} style={{ width: '100px' }} />
      </Box>
    </Grid>
    <Grid columns={{ initial: '3', md: '3' }} gap="3" mb="4">
      <Box><Text size="2">Profit Margin (%)</Text><input type="number" value={profitMargin} onChange={(e) => setProfitMargin(parseFloat(e.target.value) || 0)} style={{ width: '100px' }} /></Box>
      <Box><Text size="2">Progress To Target</Text><Progress value={(totalActual / totalTarget) * 100} /></Box>
      <Box><Text size="2">Post-Optimization Estimate</Text><Heading>{formatCurrency(postOptimizationEstimate, currency)}</Heading></Box>
    </Grid>
    <Box mb="4">
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Category</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actual</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Target</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Benchmark</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Action</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {categories.map((category) => (
            <Table.Row key={category}>
              <Table.Cell>{category}</Table.Cell>
              <Table.Cell>{formatCurrency(totals[category].actual, currency)}</Table.Cell>
              <Table.Cell>{formatCurrency(totals[category].costAfter, currency)}</Table.Cell>
              <Table.Cell>{formatCurrency(benchmarkPrice, currency)}</Table.Cell>
              <Table.Cell>
                <Button onClick={() => setDialogCategory(category)}>Details</Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
    <Flex gap="4" mb="4" wrap="wrap">
      <Box style={{ width: '300px', height: '300px' }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie dataKey="actual" data={categories.map((c, i) => ({ name: c, actual: totals[c].actual }))} outerRadius={100} label>
              {categories.map((_, i) => (
                <Cell key={i} fill={pieColors[i % pieColors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Box>
      <Box flex="1" style={{ minWidth: '300px', height: '300px' }}>
        <ResponsiveContainer>
          <LineChart data={benchmarkTrendData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="actual" stroke="#3b82f6" />
            <Line type="monotone" dataKey="benchmark" stroke="#f59e0b" strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Flex>
    <Button variant="surface" onClick={() => alert('Gap Analysis')}>
      Show Gap Analysis
    </Button>
    {dialogCategory && (
      <Dialog.Root open={!!dialogCategory} onOpenChange={() => setDialogCategory(null)}>
        <Dialog.Content>
          <Dialog.Title>{dialogCategory} Details
            <Button size="1" variant="ghost" onClick={() => alert('Tips to reduce cost')}>
              Improve Tips
            </Button>
          </Dialog.Title>
          <Flex justify="between" mb="2" align="center">
            <Text>Auto Mode</Text>
            <Switch checked={autoMode} onCheckedChange={setAutoMode} />
          </Flex>
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
                      value={solutions[dialogCategory]?.[index] || ''}
                      onValueChange={(value) => handleSolutionChange(dialogCategory, index, value)}
                    >
                      <RadixSelect.Trigger aria-label="Select solution" />
                      <RadixSelect.Content>
                        {solutionsOptions.map((option) => (
                          <RadixSelect.Item key={option} value={option}>{option}</RadixSelect.Item>
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
    )}
    <Flex justify="end" mt="4">
      <Button style={{ backgroundColor: '#10b981', color: '#fff' }} onClick={() => alert('Submitted')}>
        Submit to Blockchain
      </Button>
    </Flex>
  </Box>
);
}

export default CostAnalytics;
