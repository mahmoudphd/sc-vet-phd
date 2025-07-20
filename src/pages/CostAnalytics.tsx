// src/pages/CostAnalysis.tsx

import React, { useState, useEffect } from 'react';
import {
  Box, Button, Card, Flex, Grid, Heading, Progress, Select,
  Table, Text, TextField, Dialog
} from '@radix-ui/themes';
import {
  PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts';

// ----------- Simulated IoT Data -----------

const simulatedIoTCostData = {
  totals: {
    'Direct Materials': { actual: 133.11, budget: 140, costAfter: 120 },
    'Packaging Materials': { actual: 18, budget: 20, costAfter: 16 },
    'Direct Labor': { actual: 3, budget: 4, costAfter: 3.2 },
    'Overhead': { actual: 0.5, budget: 1, costAfter: 0.4 },
    'Other Costs': { actual: 10, budget: 12, costAfter: 9 },
  },
  rawMaterials: [
    { name: 'Vitamin B1', qty: 0.001, unitPrice: 540, cost: 0.54 },
    { name: 'Vitamin B2', qty: 0.006, unitPrice: 600, cost: 3.6 },
    { name: 'Vitamin B12', qty: 0.001, unitPrice: 2300, cost: 2.3 },
    { name: 'Nicotinamide B3', qty: 0.01, unitPrice: 400, cost: 4 },
    { name: 'Pantothenic Acid', qty: 0.004, unitPrice: 1700, cost: 6.8 },
    { name: 'Vitamin B6', qty: 0.0015, unitPrice: 900, cost: 1.35 },
    { name: 'Leucine', qty: 0.03, unitPrice: 200, cost: 6 },
    { name: 'Threonine', qty: 0.01, unitPrice: 950, cost: 9.5 },
    { name: 'Taurine', qty: 0.0025, unitPrice: 3000, cost: 7.5 },
    { name: 'Glycine', qty: 0.0025, unitPrice: 4200, cost: 10.5 },
    { name: 'Arginine', qty: 0.0025, unitPrice: 5000, cost: 12.5 },
    { name: 'Cynarin', qty: 0.0025, unitPrice: 3900, cost: 9.75 },
    { name: 'Silymarin', qty: 0.025, unitPrice: 700, cost: 17.5 },
    { name: 'Sorbitol', qty: 0.01, unitPrice: 360, cost: 3.6 },
    { name: 'Carnitine', qty: 0.005, unitPrice: 1070, cost: 5.35 },
    { name: 'Betaine', qty: 0.02, unitPrice: 1250, cost: 25 },
    { name: 'Tween-80', qty: 0.075, unitPrice: 90, cost: 6.75 },
    { name: 'Water', qty: 0.571, unitPrice: 1, cost: 0.571 },
  ],
  packagingMaterials: [
    { name: 'Plastic Bottle 1L', qty: 1, unitPrice: 2.5, cost: 2.5 },
    { name: 'Cap with Safety Seal', qty: 1, unitPrice: 0.75, cost: 0.75 },
    { name: 'Label Sticker', qty: 1, unitPrice: 0.3, cost: 0.3 },
    { name: 'Box Carton', qty: 1, unitPrice: 1.5, cost: 1.5 },
  ],
  directLabor: [
    { name: 'Operator', hours: 2, ratePerHour: 5, cost: 10 },
    { name: 'Supervisor', hours: 1, ratePerHour: 8, cost: 8 },
  ],
  overheadItems: [
    { name: 'Electricity', type: 'Utility', cost: 0.3 },
    { name: 'Water', type: 'Utility', cost: 0.1 },
    { name: 'Maintenance', type: 'Service', cost: 0.1 },
  ],
  otherCosts: [
    { name: 'Transportation', type: 'Logistics', cost: 5 },
    { name: 'Quality Inspection', type: 'Service', cost: 2 },
    { name: 'Miscellaneous', type: 'Other', cost: 3 },
  ],
};

// ----------- Types -----------

type Item = {
  name: string;
  qty?: number;
  unitPrice?: number;
  cost: number;
  hours?: number;
  ratePerHour?: number;
  type?: string;
};

type CostCategory = 'Direct Materials' | 'Packaging Materials' | 'Direct Labor' | 'Overhead' | 'Other Costs';

type CostRow = {
  category: CostCategory;
  actual: string;
  budget: string;
  costAfter: string;
};

// ----------- Main Component -----------

const solutionOptions = [
  'Negotiating Better Prices With Supplier',
  'Reducing Waste In Material Usage',
  'Automation To Reduce Manual Labor Costs',
  'Optimizing Machine Usage',
  'Improving Inventory Management',
  'Minimize Transportation Costs',
  'Reduce Rework Costs',
  'Other',
];

const CostAnalysis = () => {
  const [currency, setCurrency] = useState<'EGP' | 'USD'>('EGP');
  const [mode, setMode] = useState<'manual' | 'auto'>('manual');
  const [benchmarkPrice, setBenchmarkPrice] = useState(220);
  const [profitMargin, setProfitMargin] = useState(25);
  const [solutions, setSolutions] = useState<Record<string, string>>({});
  const [dialogOpen, setDialogOpen] = useState<CostCategory | null>(null);

  // Data state
  const defaultCostData: CostRow[] = [
    { category: 'Direct Materials', actual: '133.11', budget: '140', costAfter: '120' },
    { category: 'Packaging Materials', actual: '18', budget: '20', costAfter: '16' },
    { category: 'Direct Labor', actual: '3', budget: '4', costAfter: '3.2' },
    { category: 'Overhead', actual: '0.5', budget: '1', costAfter: '0.4' },
    { category: 'Other Costs', actual: '10', budget: '12', costAfter: '9' },
  ];
  const [costData, setCostData] = useState<CostRow[]>(defaultCostData);

  useEffect(() => {
    if (mode === 'auto') {
      const totals = simulatedIoTCostData.totals;
      const newData = costData.map(row => ({
        ...row,
        actual: totals[row.category]?.actual.toString() || row.actual,
        budget: totals[row.category]?.budget.toString() || row.budget,
        costAfter: totals[row.category]?.costAfter.toString() || row.costAfter,
      }));
      setCostData(newData);
    } else {
      setCostData(defaultCostData);
    }
  }, [mode]);

  const updateCostField = (index: number, field: keyof CostRow, value: string) => {
    const newCostData = [...costData];
    newCostData[index][field] = value;
    setCostData(newCostData);
  };

  // Helper: Format currency
  const formatCurrency = (val: string | number) => {
    const num = typeof val === 'string' ? parseFloat(val) : val;
    return `${currency} ${num.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  };

  // Compute totals
  const totalActual = costData.reduce((sum, row) => sum + parseFloat(row.actual), 0);
  const totalBudget = costData.reduce((sum, row) => sum + parseFloat(row.budget), 0);
  const totalCostAfter = costData.reduce((sum, row) => sum + parseFloat(row.costAfter), 0);

  const targetCost = benchmarkPrice * (1 - profitMargin / 100);

  // Benchmark trend data (sample)
  const benchmarkTrendData = [
    { month: 'Jan', actual: 169.61, benchmark: benchmarkPrice },
    { month: 'Feb', actual: 170.5, benchmark: benchmarkPrice },
    { month: 'Mar', actual: 168.0, benchmark: benchmarkPrice },
    { month: 'Apr', actual: 171.2, benchmark: benchmarkPrice },
    { month: 'May', actual: totalActual, benchmark: benchmarkPrice },
  ];

  const benchmarkTrendDataWithGap = benchmarkTrendData.map(d => ({
    ...d,
    targetCost,
    gap: d.actual - targetCost,
  }));

  const pieColors = ['#3b82f6', '#f59e0b', '#ef4444'];

  // Render dialog content by category
  const renderDialogContent = (category: CostCategory) => {
    let items: Item[] = [];
    switch (category) {
      case 'Direct Materials':
        items = simulatedIoTCostData.rawMaterials;
        break;
      case 'Packaging Materials':
        items = simulatedIoTCostData.packagingMaterials;
        break;
      case 'Direct Labor':
        items = simulatedIoTCostData.directLabor;
        break;
      case 'Overhead':
        items = simulatedIoTCostData.overheadItems;
        break;
      case 'Other Costs':
        items = simulatedIoTCostData.otherCosts;
        break;
    }

    return (
      <>
        <Heading size="5" mb="4">{category} Details</Heading>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
              {category === 'Direct Labor' ? (
                <>
                  <Table.ColumnHeaderCell>Hours</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Rate/Hour</Table.ColumnHeaderCell>
                </>
              ) : (
                <>
                  <Table.ColumnHeaderCell>Quantity</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Unit Price</Table.ColumnHeaderCell>
                </>
              )}
              <Table.ColumnHeaderCell>Cost</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {items.map((item, idx) => (
              <Table.Row key={idx}>
                <Table.Cell>{item.name}</Table.Cell>
                {category === 'Direct Labor' ? (
                  <>
                    <Table.Cell>{item.hours ?? '-'}</Table.Cell>
                    <Table.Cell>{currency} {item.ratePerHour ?? '-'}</Table.Cell>
                  </>
                ) : (
                  <>
                    <Table.Cell>{item.qty ?? '-'}</Table.Cell>
                    <Table.Cell>{currency} {item.unitPrice ?? '-'}</Table.Cell>
                  </>
                )}
                <Table.Cell>{currency} {item.cost}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
        <Flex justify="end" mt="4">
          <Button onClick={() => setDialogOpen(null)}>Close</Button>
        </Flex>
      </>
    );
  };

  return (
    <Box p="6">
      <Flex justify="between" align="center" mb="4">
        <Heading size="6">Inter-Organizational Cost Management</Heading>
        <Flex gap="3">
          <Select.Root defaultValue="product-1">
            <Select.Trigger aria-label="Select Product" />
            <Select.Content>
              <Select.Item value="product-1">Product A</Select.Item>
              <Select.Item value="product-2">Product B</Select.Item>
            </Select.Content>
          </Select.Root>
          <Select.Root value={currency} onValueChange={(val) => setCurrency(val as 'EGP' | 'USD')}>
            <Select.Trigger aria-label="Select Currency" />
            <Select.Content>
              <Select.Item value="EGP">EGP</Select.Item>
              <Select.Item value="USD">USD</Select.Item>
            </Select.Content>
          </Select.Root>
          <Button variant="soft">Export Report</Button>
        </Flex>
      </Flex>

      <Flex justify="end" mb="3" gap="3" align="center">
        <Text size="2">IoT Mode</Text>
        <Select.Root value={mode} onValueChange={(val) => setMode(val as 'manual' | 'auto')}>
          <Select.Trigger aria-label="Select Mode" />
          <Select.Content>
            <Select.Item value="manual">Manual</Select.Item>
            <Select.Item value="auto">Auto</Select.Item>
          </Select.Content>
        </Select.Root>
      </Flex>

      <Grid columns="3" gap="4" mb="6">
        <Card><Flex direction="column"><Text size="2">Actual Cost</Text><Heading size="6">{formatCurrency(totalActual)}</Heading></Flex></Card>
        <Card><Flex direction="column"><Text size="2">Target Cost</Text><Heading size="6">{formatCurrency(totalBudget)}</Heading></Flex></Card>
        <Card><Flex direction="column" gap="2"><Text size="2">Benchmark Price</Text><TextField.Root type="number" value={benchmarkPrice.toString()} onChange={e => setBenchmarkPrice(Number(e.target.value))} /></Flex></Card>
        <Card><Flex direction="column" gap="2"><Text size="2">Profit Margin (%)</Text><TextField.Root type="number" value={profitMargin.toString()} onChange={e => setProfitMargin(Number(e.target.value))} /></Flex></Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">Progress To Target</Text>
            <Progress value={Math.min(100, (totalActual / targetCost) * 100)} max={100} />
            <Text size="1" align="center">{Math.min(100, (totalActual / targetCost) * 100).toFixed(1)}%</Text>
          </Flex>
        </Card>
        <Card><Flex direction="column"><Text size="2">Post-Optimization Estimate</Text><Heading size="6">{formatCurrency(totalCostAfter)}</Heading></Flex></Card>
      </Grid>

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Cost Category</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actual</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Budget</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Cost After</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Solution</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Details</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {costData.map((row, idx) => (
            <Table.Row key={row.category}>
              <Table.Cell>{row.category}</Table.Cell>
              <Table.Cell>
                {mode === 'manual' ? (
                  <TextField.Root
                    type="number"
                    value={row.actual}
                    onChange={(e) => updateCostField(idx, 'actual', e.target.value)}
                  />
                ) : formatCurrency(row.actual)}
              </Table.Cell>
              <Table.Cell>
                {mode === 'manual' ? (
                  <TextField.Root
                    type="number"
                    value={row.budget}
                    onChange={(e) => updateCostField(idx, 'budget', e.target.value)}
                  />
                ) : formatCurrency(row.budget)}
              </Table.Cell>
              <Table.Cell>
                {mode === 'manual' ? (
                  <TextField.Root
                    type="number"
                    value={row.costAfter}
                    onChange={(e) => updateCostField(idx, 'costAfter', e.target.value)}
                  />
                ) : formatCurrency(row.costAfter)}
              </Table.Cell>
              <Table.Cell>
                <Select.Root
                  value={solutions[row.category] || ''}
                  onValueChange={(val) =>
                    setSolutions(prev => ({ ...prev, [row.category]: val }))}
                >
                  <Select.Trigger aria-label="Select Solution" />
                  <Select.Content>
                    <Select.Item value="">None</Select.Item>
                    {solutionOptions.map(sol => (
                      <Select.Item key={sol} value={sol}>{sol}</Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </Table.Cell>
              <Table.Cell>
                <Button size="2" variant="outline" onClick={() => setDialogOpen(row.category)}>
                  View Details
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <Box mt="6" style={{ height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={[
                {
                  name: 'Direct Cost',
                  value:
                    parseFloat(costData.find(r => r.category === 'Direct Materials')?.actual || '0') +
                    parseFloat(costData.find(r => r.category === 'Packaging Materials')?.actual || '0') +
                    parseFloat(costData.find(r => r.category === 'Direct Labor')?.actual || '0'),
                },
                {
                  name: 'Overhead',
                  value: parseFloat(costData.find(r => r.category === 'Overhead')?.actual || '0'),
                },
                {
                  name: 'Other Costs',
                  value: parseFloat(costData.find(r => r.category === 'Other Costs')?.actual || '0'),
                },
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

      <Box mt="6" style={{ height: 300 }}>
        <ResponsiveContainer>
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

      <Dialog.Root open={dialogOpen !== null} onOpenChange={open => !open && setDialogOpen(null)}>
        <Dialog.Content style={{ maxWidth: 700 }}>
          {dialogOpen && renderDialogContent(dialogOpen)}
        </Dialog.Content>
      </Dialog.Root>
    </Box>
  );
};

export default CostAnalysis;
