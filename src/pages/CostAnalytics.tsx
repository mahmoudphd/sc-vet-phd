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
  Table,
  Text,
  Dialog,
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
  const [showGapAnalysis, setShowGapAnalysis] = useState(true);
  const [manualInputs, setManualInputs] = useState<Record<CostCategory, { actual: number; budget: number; costAfter: number }>>({
    'Direct Materials': { actual: 0, budget: 0, costAfter: 0 },
    'Packaging Materials': { actual: 0, budget: 0, costAfter: 0 },
    'Direct Labor': { actual: 0, budget: 0, costAfter: 0 },
    'Overhead': { actual: 0, budget: 0, costAfter: 0 },
    'Other Costs': { actual: 0, budget: 0, costAfter: 0 },
  });

  const [dialogAutoMode, setDialogAutoMode] = useState<Record<CostCategory, boolean>>({
    'Direct Materials': true,
    'Packaging Materials': true,
    'Direct Labor': true,
    'Overhead': true,
    'Other Costs': true,
  });

  const [dialogData, setDialogData] = useState<Record<CostCategory, Item[]>>({
    'Direct Materials': getDetailsByCategory('Direct Materials'),
    'Packaging Materials': getDetailsByCategory('Packaging Materials'),
    'Direct Labor': getDetailsByCategory('Direct Labor'),
    'Overhead': getDetailsByCategory('Overhead'),
    'Other Costs': getDetailsByCategory('Other Costs'),
  });

  const [solutions, setSolutions] = useState<Record<string, Record<number, string>>>({});
  const totals = simulatedIoTCostData.totals;

  const totalActual = categories.reduce((sum, c) => sum + (autoMode ? totals[c].actual : manualInputs[c].actual), 0);
  const totalBudget = categories.reduce((sum, c) => sum + (autoMode ? totals[c].budget : manualInputs[c].budget), 0);
  const totalCostAfter = categories.reduce((sum, c) => sum + (autoMode ? totals[c].costAfter : manualInputs[c].costAfter), 0);
  const targetCost = benchmarkPrice * (1 - profitMargin / 100);
  const postOptimizationEstimate = totalCostAfter * (1 - profitMargin / 100);

  const handleManualInputChange = (category: CostCategory, field: 'actual' | 'budget' | 'costAfter', value: number) => {
    setManualInputs((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
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

  const updateDialogItem = (category: CostCategory, index: number, field: keyof Item, value: number) => {
    setDialogData((prev) => {
      const updated = [...prev[category]];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, [category]: updated };
    });
  };

  const submitToBlockchain = (category: CostCategory) => {
    console.log(`Submitting ${category} data to blockchain...`, dialogData[category]);
    alert(`Submitted ${category} data to blockchain (mock).`);
  };
  return (
    <Box p="6" style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <Heading size="6" mb="4">Inter-Organizational Cost Management</Heading>

      <Flex align="center" gap="4" mb="4">
        <Text>Auto Mode:</Text>
        <Switch checked={autoMode} onCheckedChange={setAutoMode} />
        <Button variant="outline" onClick={() => setShowGapAnalysis(!showGapAnalysis)}>
          {showGapAnalysis ? 'Hide Gap Analysis' : 'Show Gap Analysis'}
        </Button>
      </Flex>

      <Grid columns="4" gap="4" mb="4">
        <Box>
          <Text size="2">Product</Text>
          <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}>
            {products.map((product) => (
              <option key={product} value={product}>{product}</option>
            ))}
          </select>
        </Box>
        <Box>
          <Text size="2">Currency</Text>
          <select value={currency} onChange={(e) => setCurrency(e.target.value as 'EGP' | 'USD')}>
            <option value="EGP">EGP</option>
            <option value="USD">USD</option>
          </select>
        </Box>
        <Box>
          <Text size="2">Benchmark Price</Text>
          <input type="number" value={benchmarkPrice} onChange={(e) => setBenchmarkPrice(parseFloat(e.target.value))} />
        </Box>
        <Box>
          <Text size="2">Profit Margin (%)</Text>
          <input type="number" value={profitMargin} onChange={(e) => setProfitMargin(parseFloat(e.target.value))} />
        </Box>
      </Grid>

      <Grid columns="3" gap="4" mb="4">
        <Box>
          <Text size="2">Actual Cost</Text>
          <Text>{formatCurrency(totalActual, currency)}</Text>
        </Box>
        <Box>
          <Text size="2">Target Cost</Text>
          <Text>{formatCurrency(targetCost, currency)}</Text>
        </Box>
        <Box>
          <Text size="2">Post-Optimization Estimate</Text>
          <Text>{formatCurrency(postOptimizationEstimate, currency)}</Text>
        </Box>
        <Box>
          <Text size="2">Progress to Target</Text>
          <Progress value={(totalActual / targetCost) * 100} max={100} />
        </Box>
      </Grid>
      {showGapAnalysis && (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={categories.map((c) => ({
            name: c,
            actual: autoMode ? totals[c].actual : manualInputs[c].actual,
            target: targetCost,
          }))}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="actual" stroke="#3b82f6" name="Actual" />
            <Line type="monotone" dataKey="target" stroke="#10b981" name="Target" strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      )}

      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={categories.map((c) => ({ name: c, value: autoMode ? totals[c].actual : manualInputs[c].actual }))}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            label
          >
            {categories.map((_, index) => (
              <Cell key={`cell-${index}`} fill={['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'][index % 5]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '2rem', marginBottom: '2rem' }}>
        <thead>
          <tr>
            <th>Category</th>
            <th>Actual</th>
            <th>Target</th>
            <th>Cost After</th>
            <th>% of Total</th>
            <th>Manual Entry</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category}>
              <td>{category}</td>
              <td>{formatCurrency(autoMode ? totals[category].actual : manualInputs[category].actual, currency)}</td>
              <td>{formatCurrency(autoMode ? totals[category].budget : manualInputs[category].budget, currency)}</td>
              <td>{formatCurrency(autoMode ? totals[category].costAfter : manualInputs[category].costAfter, currency)}</td>
              <td>{totalActual === 0 ? '0.00' : (((autoMode ? totals[category].actual : manualInputs[category].actual) / totalActual) * 100).toFixed(2)}%</td>
              <td>
                {!autoMode && (
                  <Flex direction="column" gap="2">
                    <input type="number" placeholder="Actual" value={manualInputs[category].actual} onChange={(e) => handleManualInputChange(category, 'actual', parseFloat(e.target.value) || 0)} />
                    <input type="number" placeholder="Target" value={manualInputs[category].budget} onChange={(e) => handleManualInputChange(category, 'budget', parseFloat(e.target.value) || 0)} />
                    <input type="number" placeholder="Cost After" value={manualInputs[category].costAfter} onChange={(e) => handleManualInputChange(category, 'costAfter', parseFloat(e.target.value) || 0)} />
                  </Flex>
                )}
              </td>
              <td>
                <Button variant="outline" onClick={() => setDialogCategory(category)}>View Details</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Dialog.Root open={dialogCategory !== null} onOpenChange={(open) => !open && setDialogCategory(null)}>
        <Dialog.Portal>
          <Dialog.Overlay style={{ backgroundColor: 'rgba(0,0,0,0.3)', position: 'fixed', inset: 0 }} />
          <Dialog.Content style={{ backgroundColor: 'white', padding: 24, borderRadius: 8, maxWidth: 800, margin: 'auto', top: '10%', position: 'relative' }}>
            {dialogCategory && (
              <>
                <Heading size="5" mb="4">{dialogCategory} Breakdown</Heading>
                <Flex gap="2" mb="2" align="center">
                  <Text>Auto Mode</Text>
                  <Switch
                    checked={dialogAutoMode[dialogCategory]}
                    onCheckedChange={(checked) =>
                      setDialogAutoMode((prev) => ({ ...prev, [dialogCategory]: checked }))
                    }
                  />
                </Flex>
                <Table.Root>
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Qty</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Unit Price</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Cost</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Solution</Table.ColumnHeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {dialogData[dialogCategory]?.map((item, index) => (
                      <Table.Row key={index}>
                        <Table.Cell>{item.name}</Table.Cell>
                        <Table.Cell>
                          <TextField.Root>
                            <TextField.Input
                              type="number"
                              value={item.qty ?? 0}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                updateDialogItem(dialogCategory, index, 'qty', parseFloat(e.target.value) || 0)
                              }
                              disabled={dialogAutoMode[dialogCategory]}
                              style={{ width: '80px' }}
                            />
                          </TextField.Root>
                        </Table.Cell>
                        <Table.Cell>
                          <TextField.Root>
                            <TextField.Input
                              type="number"
                              value={item.unitPrice ?? 0}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                updateDialogItem(dialogCategory, index, 'unitPrice', parseFloat(e.target.value) || 0)
                              }
                              disabled={dialogAutoMode[dialogCategory]}
                              style={{ width: '80px' }}
                            />
                          </TextField.Root>
                        </Table.Cell>
                        <Table.Cell>
                          {formatCurrency((item.qty ?? 0) * (item.unitPrice ?? 0), currency)}
                        </Table.Cell>
                        <Table.Cell>
                          <select
                            value={solutions[dialogCategory]?.[index] || ''}
                            onChange={(e) => handleSolutionChange(dialogCategory, index, e.target.value)}
                            style={{ width: '180px' }}
                          >
                            <option value="">Select Solution</option>
                            {solutionsOptions.map((s, i) => (
                              <option key={i} value={s}>{s}</option>
                            ))}
                          </select>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
                <Flex mt="4" gap="2" justify="end">
                  <Button variant="surface" onClick={() => submitToBlockchain(dialogCategory)}>
                    Submit to Blockchain
                  </Button>
                  <Dialog.Close>
                    <Button variant="soft">Close</Button>
                  </Dialog.Close>
                </Flex>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <Flex justify="end">
        <Button variant="solid" onClick={() => alert('Report submitted (mock)!')}>
          Submit Report
        </Button>
      </Flex>
    </Box>
  );
}
