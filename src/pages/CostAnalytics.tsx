// src/pages/CostAnalysis.tsx

import React, { useState, useEffect } from 'react';
import {
  Box, Button, Card, Flex, Grid, Heading, Progress, Select,
  Table, Text, TextField, Dialog, Switch
} from '@radix-ui/themes';
import {
  PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts';
import { simulatedIoTCostData } from './simulateIoTCostData';

const solutionOptions = [
  'Negotiating Better Prices With Supplier',
  'Reducing Waste In Material Usage',
  'Automation To Reduce Manual Labor Costs',
  'Optimizing Machine Usage',
  'Improving Inventory Management',
  'Minimize Transportation Costs',
  'Reduce Rework Costs',
  'Other'
];

type Category = 'Direct Materials' | 'Packaging Materials' | 'Direct Labor' | 'Overhead' | 'Other Costs';

type Item = {
  name: string;
  qty: number;
  unitPrice: number;
  cost: number;
};

const CostAnalysis = () => {
  const [currency, setCurrency] = useState<'EGP' | 'USD'>('EGP');
  const [mode, setMode] = useState<'manual' | 'auto'>('manual');
  const [benchmarkPrice, setBenchmarkPrice] = useState(220);
  const [profitMargin, setProfitMargin] = useState(25);
  const [showGap, setShowGap] = useState(false);
  const [solutions, setSolutions] = useState<Record<string, string>>({});
  const [openDialog, setOpenDialog] = useState<Category | null>(null);

  const totals = simulatedIoTCostData.totals;
  const categories: Category[] = ['Direct Materials', 'Packaging Materials', 'Direct Labor', 'Overhead', 'Other Costs'];
  const detailMap: Record<Category, Item[]> = {
    'Direct Materials': simulatedIoTCostData.rawMaterials,
    'Packaging Materials': simulatedIoTCostData.packagingMaterials,
    'Direct Labor': simulatedIoTCostData.directLabor,
    'Overhead': simulatedIoTCostData.overheadItems,
    'Other Costs': simulatedIoTCostData.otherCosts
  };

  const formatCurrency = (num: number) => `${currency} ${num.toFixed(2)}`;

  const totalActual = categories.reduce((sum, cat) => sum + totals[cat].actual, 0);
  const totalBudget = categories.reduce((sum, cat) => sum + totals[cat].budget, 0);
  const totalCostAfter = categories.reduce((sum, cat) => sum + totals[cat].costAfter, 0);

  const targetCost = benchmarkPrice * (1 - profitMargin / 100);

  const benchmarkTrendData = [
    { month: 'Jan', actual: 169.61, benchmark: benchmarkPrice },
    { month: 'Feb', actual: 170.5, benchmark: benchmarkPrice },
    { month: 'Mar', actual: 168.0, benchmark: benchmarkPrice },
    { month: 'Apr', actual: 171.2, benchmark: benchmarkPrice },
    { month: 'May', actual: totalActual, benchmark: benchmarkPrice }
  ];

  const benchmarkTrendDataWithGap = benchmarkTrendData.map(d => ({
    ...d,
    targetCost,
    gap: d.actual - targetCost
  }));

  const averageGap = benchmarkTrendDataWithGap.reduce((sum, d) => sum + d.gap, 0) / benchmarkTrendDataWithGap.length;

  const renderDetailDialog = (category: Category) => {
    const data = detailMap[category];
    return (
      <Dialog.Root open={openDialog === category} onOpenChange={() => setOpenDialog(null)}>
        <Dialog.Content maxWidth="800px">
          <Dialog.Title>{category} Breakdown</Dialog.Title>
          <Flex align="center" gap="3" my="2">
            <Text size="2">Mode</Text>
            <Switch checked={mode === 'auto'} onCheckedChange={(checked) => setMode(checked ? 'auto' : 'manual')} />
            <Text size="2">{mode}</Text>
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
              {data.map((item, i) => (
                <Table.Row key={i}>
                  <Table.Cell>{item.name}</Table.Cell>
                  <Table.Cell>{item.qty}</Table.Cell>
                  <Table.Cell>{formatCurrency(item.unitPrice)}</Table.Cell>
                  <Table.Cell>{formatCurrency(item.cost)}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
          <Flex justify="end" mt="4">
            <Button onClick={() => setOpenDialog(null)}>Close</Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    );
  };

  return (
    <Box p="4">
      <Flex justify="between" align="center" mb="4">
        <Heading size="6">Inter-Organizational Cost Management</Heading>
        <Flex gap="3">
          <Select.Root value={currency} onValueChange={(val) => setCurrency(val as 'EGP' | 'USD')}>
            <Select.Trigger />
            <Select.Content>
              <Select.Item value="EGP">EGP</Select.Item>
              <Select.Item value="USD">USD</Select.Item>
            </Select.Content>
          </Select.Root>
          <Button variant="soft">Export Report</Button>
        </Flex>
      </Flex>

      <Grid columns="3" gap="4" mb="6">
        <Card><Flex direction="column"><Text size="2">Actual Cost</Text><Heading size="6">{formatCurrency(totalActual)}</Heading></Flex></Card>
        <Card><Flex direction="column"><Text size="2">Target Cost</Text><Heading size="6">{formatCurrency(totalBudget)}</Heading></Flex></Card>
        <Card><Flex direction="column" gap="2"><Text size="2">Benchmark Price</Text><TextField.Root value={benchmarkPrice.toString()} onChange={(e) => setBenchmarkPrice(Number(e.target.value))} /></Flex></Card>
        <Card><Flex direction="column" gap="2"><Text size="2">Profit Margin (%)</Text><TextField.Root value={profitMargin.toString()} onChange={(e) => setProfitMargin(Number(e.target.value))} /></Flex></Card>
        <Card><Flex direction="column" gap="1"><Text size="2">Progress To Target</Text><Progress value={80} /><Text size="1">80% Achieved</Text></Flex></Card>
        <Card><Flex direction="column"><Text size="2">Post-Optimization Estimate</Text><Heading size="6">{formatCurrency(totalCostAfter)}</Heading></Flex></Card>
      </Grid>

      <Flex justify="end" mb="4"><Button onClick={() => setShowGap(!showGap)}>{showGap ? 'Hide Gap Analysis' : 'Show Gap Analysis'}</Button></Flex>

      <Grid columns="2" gap="4" mb="6">
        <Card>
          <Heading size="4" mb="3">Cost Composition</Heading>
          <PieChart width={300} height={250}>
            <Pie data={categories.map(cat => ({ name: cat, value: totals[cat].actual }))} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
              <Cell fill="#3b82f6" /><Cell fill="#f59e0b" /><Cell fill="#10b981" /><Cell fill="#a855f7" /><Cell fill="#ef4444" />
            </Pie>
            <Legend />
          </PieChart>
        </Card>

        <Card>
          <Heading size="4" mb="3">Benchmark Price Analysis</Heading>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={benchmarkTrendDataWithGap}>
              <XAxis dataKey="month" /><YAxis /><Tooltip formatter={(value: number) => formatCurrency(value)} /><Legend />
              <Line type="monotone" dataKey="actual" stroke="#3b82f6" name="Our Product Cost" />
              <Line type="monotone" dataKey="benchmark" stroke="#ef4444" name="Market Benchmark" />
              <Line type="monotone" dataKey="targetCost" stroke="#f97316" name="Target Cost" strokeDasharray="5 5" />
              {showGap && <Line type="monotone" dataKey="gap" stroke="#10b981" name="Cost Gap" dot={false} />}
            </LineChart>
          </ResponsiveContainer>
          {showGap && <Text align="center" mt="3" size="2" color="gray">Average Gap: <strong>{formatCurrency(averageGap)}</strong></Text>}
        </Card>
      </Grid>

      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Category</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actual</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Target</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Variance</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>View</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Solution</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>After</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {categories.map(cat => {
            const actual = totals[cat].actual;
            const budget = totals[cat].budget;
            const costAfter = totals[cat].costAfter;
            const variance = budget - actual;
            const percent = totalActual ? ((actual / totalActual) * 100).toFixed(1) : '0';
            return (
              <Table.Row key={cat}>
                <Table.Cell>{cat}</Table.Cell>
                <Table.Cell>{formatCurrency(actual)}</Table.Cell>
                <Table.Cell>{formatCurrency(budget)}</Table.Cell>
                <Table.Cell><Text color={variance > 0 ? 'red' : 'green'}>{variance.toFixed(2)}</Text></Table.Cell>
                <Table.Cell><Button onClick={() => setOpenDialog(cat)}>View</Button></Table.Cell>
                <Table.Cell>
                  <Select.Root value={solutions[cat] || ''} onValueChange={(val) => setSolutions(prev => ({ ...prev, [cat]: val }))}>
                    <Select.Trigger placeholder="Select" />
                    <Select.Content>
                      {solutionOptions.map(opt => (
                        <Select.Item key={opt} value={opt}>{opt}</Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </Table.Cell>
                <Table.Cell>{formatCurrency(costAfter)}</Table.Cell>
              </Table.Row>
            );
          })}
          <Table.Row>
            <Table.Cell><Text weight="bold">Total</Text></Table.Cell>
            <Table.Cell>{formatCurrency(totalActual)}</Table.Cell>
            <Table.Cell>{formatCurrency(totalBudget)}</Table.Cell>
            <Table.Cell /><Table.Cell /><Table.Cell /><Table.Cell>{formatCurrency(totalCostAfter)}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>

      {categories.map(cat => renderDetailDialog(cat))}
    </Box>
  );
};

export default CostAnalysis;
