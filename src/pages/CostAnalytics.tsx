// src/pages/CostAnalytics.tsx

import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Progress,
  Switch,
  Text,
} from '@radix-ui/themes';
import * as Dialog from '@radix-ui/react-dialog';
import * as Select from '@radix-ui/react-select';
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
    case 'Direct Materials': return simulatedIoTCostData.rawMaterials;
    case 'Packaging Materials': return simulatedIoTCostData.packagingMaterials;
    case 'Direct Labor': return simulatedIoTCostData.directLabor;
    case 'Overhead': return simulatedIoTCostData.overheadItems;
    case 'Other Costs': return simulatedIoTCostData.otherCosts;
    default: return [];
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

  const totals = simulatedIoTCostData.totals;

  const totalActual = categories.reduce((sum, category) => sum + totals[category].actual, 0);
  const totalBudget = categories.reduce((sum, category) => sum + totals[category].budget, 0);
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

  const benchmarkTrendDataWithGap = benchmarkTrendData.map((d) => ({ ...d, targetCost, gap: d.actual - targetCost }));

  const pieColors = ['#3b82f6', '#f59e0b', '#ef4444'];

  const percentOfTotal = (category: CostCategory) =>
    totalActual === 0 ? '0.00' : ((totals[category].actual / totalActual) * 100).toFixed(2);

  const handleSolutionChange = (category: CostCategory, index: number, value: string) => {
    setSolutions((prev) => ({ ...prev, [category]: { ...prev[category], [index]: value } }));
  };

  const handleSubmit = () => {
    const report = {
      mode: autoMode ? 'auto' : 'manual',
      currency,
      selectedProduct,
      benchmarkPrice,
      profitMargin,
      totalActual,
      totalBudget,
      totalCostAfter,
      postOptimizationEstimate,
      solutions,
      timestamp: new Date().toISOString(),
    };
    console.log('Submitted Report:', report);
    alert('Report submitted successfully.');
  };

  return (
    <Box p="6" style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <Flex justify="between" align="center" mb="5" wrap="wrap" gap="3">
        <Heading size="6">Inter-Organizational Cost Management</Heading>
        <Flex gap="3" align="center" wrap="wrap">
          <Text>Product:</Text>
          <Select.Root value={selectedProduct} onValueChange={(value) => setSelectedProduct(value)}>
            <Select.Trigger aria-label="Select product" />
            <Select.Content>
              {products.map((p) => <Select.Item key={p} value={p}>{p}</Select.Item>)}
            </Select.Content>
          </Select.Root>
          <Select.Root value={currency} onValueChange={(value) => setCurrency(value as 'EGP' | 'USD')}>
            <Select.Trigger aria-label="Select currency" />
            <Select.Content>
              <Select.Item value="EGP">EGP</Select.Item>
              <Select.Item value="USD">USD</Select.Item>
            </Select.Content>
          </Select.Root>
          <Button onClick={handleSubmit}>Export Report</Button>
        </Flex>
      </Flex>

      <Grid columns={{ initial: '3', md: '3' }} gap="4" mb="6">
        <Box style={{ border: '1px solid #ccc', borderRadius: 8, padding: 12, backgroundColor: '#fff' }}>
          <Text size="2">Actual Cost</Text><Heading size="6">{formatCurrency(totalActual, currency)}</Heading>
        </Box>
        <Box style={{ border: '1px solid #ccc', borderRadius: 8, padding: 12, backgroundColor: '#fff' }}>
          <Text size="2">Budgeted Cost</Text><Heading size="6">{formatCurrency(totalBudget, currency)}</Heading>
        </Box>
        <Box style={{ border: '1px solid #ccc', borderRadius: 8, padding: 12, backgroundColor: '#fff' }}>
          <Text size="2">Cost After Optimization</Text><Heading size="6">{formatCurrency(totalCostAfter, currency)}</Heading>
        </Box>
        <Box style={{ border: '1px solid #ccc', borderRadius: 8, padding: 12, backgroundColor: '#fff' }}>
          <Text size="2">Benchmark Price</Text>
          <input type="number" value={benchmarkPrice} onChange={(e) => setBenchmarkPrice(parseFloat(e.target.value) || 0)} style={{ padding: '8px', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }} />
        </Box>
        <Box style={{ border: '1px solid #ccc', borderRadius: 8, padding: 12, backgroundColor: '#fff' }}>
          <Text size="2">Profit Margin (%)</Text>
          <input type="number" value={profitMargin} onChange={(e) => setProfitMargin(parseFloat(e.target.value) || 0)} style={{ padding: '8px', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }} />
        </Box>
        <Box style={{ border: '1px solid #ccc', borderRadius: 8, padding: 12, backgroundColor: '#fff' }}>
          <Text size="2">Progress to Target</Text>
          <Progress value={Math.min((targetCost / totalActual) * 100, 100)} />
          <Text>{Math.round((targetCost / totalActual) * 100)}%</Text>
        </Box>
        <Box style={{ border: '1px solid #ccc', borderRadius: 8, padding: 12, backgroundColor: '#fff' }}>
          <Text size="2">Post-Optimization Estimate</Text>
          <Heading size="6">{formatCurrency(postOptimizationEstimate, currency)}</Heading>
        </Box>
      </Grid>

      <Flex gap="8" mb="6" style={{ height: 300 }}>
        <Box style={{ flex: 1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[
                  {
                    name: 'Direct Cost',
                    value:
                      totals['Direct Materials'].actual +
                      totals['Packaging Materials'].actual +
                      totals['Direct Labor'].actual,
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
        <Box style={{ flex: 1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={benchmarkTrendDataWithGap}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: number) => formatCurrency(value, currency)} />
              <Legend />
              <Line type="monotone" dataKey="actual" stroke="#3b82f6" name="Actual Cost" />
              <Line type="monotone" dataKey="benchmark" stroke="#f59e0b" name="Benchmark Price" />
              <Line type="monotone" dataKey="targetCost" stroke="#ef4444" name="Target Cost" strokeDasharray="5 5" />
              <Line type="monotone" dataKey="gap" stroke="#10b981" name="Cost Gap" dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Flex>

      <table style={{ backgroundColor: '#fff', borderRadius: 8, overflow: 'hidden', width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: 10 }}>Category</th>
            <th>Actual</th>
            <th>Budget (Target)</th>
            <th>Cost After</th>
            <th>% of Total</th>
            <th>Solution</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category}>
              <td style={{ padding: 10 }}>{category}</td>
              <td>{formatCurrency(totals[category].actual, currency)}</td>
              <td>{formatCurrency(totals[category].budget, currency)}</td>
              <td>{formatCurrency(totals[category].costAfter, currency)}</td>
              <td>{percentOfTotal(category)}%</td>
              <td>
                <Select.Root
                  value={solutions[category]?.[0] || ''}
                  onValueChange={(value) => handleSolutionChange(category, 0, value)}
                >
                  <Select.Trigger aria-label="Select solution" style={{ minWidth: 150 }} />
                  <Select.Content>
                    {solutionsOptions.map((option) => (
                      <Select.Item key={option} value={option}>{option}</Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </td>
              <td>
                <Button size="sm" onClick={() => setDialogCategory(category)}>View Details</Button>
              </td>
            </tr>
          ))}
          <tr style={{ fontWeight: 'bold' }}>
            <td style={{ padding: 10 }}>Total</td>
            <td>{formatCurrency(totalActual, currency)}</td>
            <td>{formatCurrency(totalBudget, currency)}</td>
            <td>{formatCurrency(totalCostAfter, currency)}</td>
            <td>100%</td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>

      {/* Dialog Section */}
      <Dialog.Root open={dialogCategory !== null} onOpenChange={(open) => !open && setDialogCategory(null)}>
        <Dialog.Portal>
          <Dialog.Overlay style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', position: 'fixed', inset: 0 }} />
          <Dialog.Content style={{ backgroundColor: 'white', padding: 20, borderRadius: 8, position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <Heading size="5" mb="4">{dialogCategory} Details</Heading>
            <Flex align="center" gap="3" mb="3">
              <Text>Auto Mode:</Text>
              <Switch checked={autoMode} onCheckedChange={setAutoMode} />
            </Flex>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>Name</th>
                  <th>Qty</th>
                  <th>Unit Price</th>
                  <th>Cost</th>
                </tr>
              </thead>
              <tbody>
                {dialogCategory && getDetailsByCategory(dialogCategory).map((item, idx) => (
                  <tr key={item.name}>
                    <td>{item.name}</td>
                    <td>{item.qty ?? '-'}</td>
                    <td>{formatCurrency(item.unitPrice ?? 0, currency)}</td>
                    <td>{formatCurrency(item.cost ?? 0, currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Flex justify="end" mt="4">
              <Button onClick={() => setDialogCategory(null)}>Close</Button>
            </Flex>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Flex justify="end" mt="5">
        <Button variant="solid" onClick={handleSubmit}>Submit All</Button>
      </Flex>
    </Box>
  );
}
