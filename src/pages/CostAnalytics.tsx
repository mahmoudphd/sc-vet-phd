// src/pages/CostAnalytics.tsx

import { useState, useEffect } from 'react';
import {
  Box, Button, Card, Dialog, Flex, Grid, Heading, Progress, Select,
  Table, Text, TextField
} from '@radix-ui/themes';
import {
  PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts';

import { simulatedIoTCostData, Item, CostCategory } from './simulateIoTCostData';

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

const CostAnalytics = () => {
  const [currency, setCurrency] = useState<'EGP' | 'USD'>('EGP');
  const [mode, setMode] = useState<'manual' | 'auto'>('manual');
  const [benchmarkPrice, setBenchmarkPrice] = useState(220);
  const [profitMargin, setProfitMargin] = useState(25);
  const [dialogCategory, setDialogCategory] = useState<CostCategory | null>(null);
  const [solutions, setSolutions] = useState<Record<CostCategory, string>>({});

  const categories: CostCategory[] = ['Direct Materials', 'Packaging Materials', 'Direct Labor', 'Overhead', 'Other Costs'];

  const defaultData = categories.map(category => ({
    category,
    ...simulatedIoTCostData.totals[category]
  }));

  const [costData, setCostData] = useState(defaultData);

  useEffect(() => {
    if (mode === 'auto') {
      setCostData(categories.map(category => ({
        category,
        ...simulatedIoTCostData.totals[category]
      })));
    }
  }, [mode]);

  const updateValue = (index: number, field: 'actual' | 'budget' | 'costAfter', value: string) => {
    const newData = [...costData];
    newData[index][field] = parseFloat(value) || 0;
    setCostData(newData);
  };

  const formatCurrency = (val: number) => `${currency} ${val.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

  const totalActual = costData.reduce((acc, item) => acc + item.actual, 0);
  const totalBudget = costData.reduce((acc, item) => acc + item.budget, 0);
  const totalAfter = costData.reduce((acc, item) => acc + item.costAfter, 0);
  const targetCost = benchmarkPrice * (1 - profitMargin / 100);

  const benchmarkTrendData = [
    { month: 'Jan', actual: 160, benchmark: benchmarkPrice },
    { month: 'Feb', actual: 170, benchmark: benchmarkPrice },
    { month: 'Mar', actual: 175, benchmark: benchmarkPrice },
    { month: 'Apr', actual: 165, benchmark: benchmarkPrice },
    { month: 'May', actual: totalActual, benchmark: benchmarkPrice },
  ].map(item => ({
    ...item,
    targetCost,
    gap: item.actual - targetCost,
  }));

  const pieColors = ['#3b82f6', '#f59e0b', '#ef4444'];

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

  return (
    <Box p="6">
      <Flex justify="between" mb="4" align="center">
        <Heading size="6">Inter-Organizational Cost Management</Heading>
        <Flex gap="3">
          <Select.Root value={currency} onValueChange={val => setCurrency(val as 'EGP' | 'USD')}>
            <Select.Trigger />
            <Select.Content>
              <Select.Item value="EGP">EGP</Select.Item>
              <Select.Item value="USD">USD</Select.Item>
            </Select.Content>
          </Select.Root>
          <Select.Root value={mode} onValueChange={val => setMode(val as 'manual' | 'auto')}>
            <Select.Trigger />
            <Select.Content>
              <Select.Item value="manual">Manual</Select.Item>
              <Select.Item value="auto">Auto (IoT)</Select.Item>
            </Select.Content>
          </Select.Root>
        </Flex>
      </Flex>

      <Grid columns="3" gap="4" mb="6">
        <Card><Text>Actual Cost</Text><Heading size="6">{formatCurrency(totalActual)}</Heading></Card>
        <Card><Text>Target Cost</Text><Heading size="6">{formatCurrency(totalBudget)}</Heading></Card>
        <Card>
          <Text>Benchmark Price</Text>
          <TextField.Root
            type="number"
            value={benchmarkPrice.toString()}
            onChange={e => setBenchmarkPrice(Number(e.target.value))}
          />
        </Card>
        <Card>
          <Text>Profit Margin %</Text>
          <TextField.Root
            type="number"
            value={profitMargin.toString()}
            onChange={e => setProfitMargin(Number(e.target.value))}
          />
        </Card>
        <Card>
          <Text>Progress To Target</Text>
          <Progress value={Math.min(100, (totalActual / targetCost) * 100)} />
          <Text>{Math.min(100, (totalActual / targetCost) * 100).toFixed(1)}%</Text>
        </Card>
        <Card><Text>Post-Optimization</Text><Heading size="6">{formatCurrency(totalAfter)}</Heading></Card>
      </Grid>

      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Category</Table.ColumnHeaderCell>
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
                    value={row.actual.toString()}
                    onChange={e => updateValue(idx, 'actual', e.target.value)}
                  />
                ) : formatCurrency(row.actual)}
              </Table.Cell>
              <Table.Cell>
                {mode === 'manual' ? (
                  <TextField.Root
                    type="number"
                    value={row.budget.toString()}
                    onChange={e => updateValue(idx, 'budget', e.target.value)}
                  />
                ) : formatCurrency(row.budget)}
              </Table.Cell>
              <Table.Cell>
                {mode === 'manual' ? (
                  <TextField.Root
                    type="number"
                    value={row.costAfter.toString()}
                    onChange={e => updateValue(idx, 'costAfter', e.target.value)}
                  />
                ) : formatCurrency(row.costAfter)}
              </Table.Cell>
              <Table.Cell>
                <Select.Root
                  value={solutions[row.category] || ''}
                  onValueChange={(val) => setSolutions(prev => ({ ...prev, [row.category]: val }))}
                >
                  <Select.Trigger />
                  <Select.Content>
                    <Select.Item value="">None</Select.Item>
                    {solutionOptions.map(option => (
                      <Select.Item key={option} value={option}>{option}</Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </Table.Cell>
              <Table.Cell>
                <Button onClick={() => setDialogCategory(row.category)}>View</Button>
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
                  value: costData.slice(0, 3).reduce((sum, d) => sum + d.actual, 0),
                },
                {
                  name: 'Overhead',
                  value: costData[3].actual,
                },
                {
                  name: 'Other Costs',
                  value: costData[4].actual,
                },
              ]}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {pieColors.map((color, idx) => (
                <Cell key={idx} fill={color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Box>

      <Box mt="6" style={{ height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={benchmarkTrendData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="actual" stroke="#3b82f6" name="Actual" />
            <Line type="monotone" dataKey="benchmark" stroke="#f59e0b" name="Benchmark" />
            <Line type="monotone" dataKey="targetCost" stroke="#ef4444" name="Target" />
          </LineChart>
        </ResponsiveContainer>
      </Box>

      {dialogCategory && (
        <Dialog.Root open onOpenChange={() => setDialogCategory(null)}>
          <Dialog.Content maxWidth="700px">
            <Dialog.Title>{dialogCategory} Breakdown</Dialog.Title>
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Qty</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Unit Price</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Cost</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {getDetailsByCategory(dialogCategory).map((item, idx) => (
                  <Table.Row key={idx}>
                    <Table.Cell>{item.name}</Table.Cell>
                    <Table.Cell>{item.qty}</Table.Cell>
                    <Table.Cell>{formatCurrency(item.unitPrice)}</Table.Cell>
                    <Table.Cell>{formatCurrency(item.cost)}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
            <Flex justify="end" mt="4">
              <Button onClick={() => setDialogCategory(null)}>Close</Button>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      )}
    </Box>
  );
};

export default CostAnalytics;
