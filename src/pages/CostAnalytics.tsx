// Imports
import {
  Card,
  Flex,
  Heading,
  Text,
  Table,
  Button,
  Grid,
  Progress,
  Select,
  Box,
  TextField
} from '@radix-ui/themes';
import { BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useState } from 'react';

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

const CostAnalysis = () => {
  const [currency, setCurrency] = useState<'EGP' | 'USD'>('EGP');
  const [solutions, setSolutions] = useState<Record<string, string>>({});
  const [costData, setCostData] = useState([
    { category: 'Direct Cost', isGroup: true },
    { category: 'Direct Materials', value: 45, actual: '1350', budget: '1300', costAfter: '1250' },
    { category: 'Packaging Materials', value: 20, actual: '600', budget: '580', costAfter: '570' },
    { category: 'Direct Labor', value: 15, actual: '450', budget: '420', costAfter: '430' },
    { category: 'Overhead', isGroup: true },
    { category: 'Overhead', value: 12, actual: '360', budget: '350', costAfter: '345' },
    { category: 'Other Costs', isGroup: true },
    { category: 'Other Costs', value: 8, actual: '240', budget: '230', costAfter: '225' }
  ]);
  const [targetCost, setTargetCost] = useState(165);
  const [benchmarkPrice, setBenchmarkPrice] = useState(220);
  const [profitMargin, setProfitMargin] = useState(25);
  const [progress, setProgress] = useState(80);

  const formatCurrency = (num: number | string | undefined) => {
    const value = typeof num === 'string' ? parseFloat(num ?? '0') : num ?? 0;
    return `${value.toLocaleString(undefined, { maximumFractionDigits: 0 })} ${currency}`;
  };

  const totalActual = costData.filter(i => !i.isGroup).reduce((sum, i) => sum + parseFloat(i.actual ?? '0'), 0);
  const totalBudget = costData.filter(i => !i.isGroup).reduce((sum, i) => sum + parseFloat(i.budget ?? '0'), 0);
  const totalCostAfter = costData.filter(i => !i.isGroup).reduce((sum, i) => sum + parseFloat(i.costAfter ?? '0'), 0);
  const postOptimizationEstimate = targetCost * 0.95;

  const handleCellChange = (index: number, key: 'actual' | 'budget' | 'costAfter', value: string) => {
    const updated = [...costData];
    updated[index][key] = value;
    setCostData(updated);
  };

  return (
    <Box p="6">
      {/* Header */}
      <Flex justify="between" align="center" mb="5">
        <Heading size="6">Inter-Organizational Cost Management</Heading>
        <Flex gap="3">
          <Select.Root defaultValue="product-1">
            <Select.Trigger />
            <Select.Content>
              <Select.Item value="product-1">Product A</Select.Item>
              <Select.Item value="product-2">Product B</Select.Item>
            </Select.Content>
          </Select.Root>

          <Select.Root defaultValue="EGP" onValueChange={(val) => setCurrency(val as 'EGP' | 'USD')}>
            <Select.Trigger />
            <Select.Content>
              <Select.Item value="EGP">EGP</Select.Item>
              <Select.Item value="USD">USD</Select.Item>
            </Select.Content>
          </Select.Root>

          <Button variant="soft">Export Report</Button>
        </Flex>
      </Flex>

      {/* KPI Cards */}
      <Grid columns="3" gap="4" mb="6">
        <Card><Flex direction="column" gap="1"><Text size="2">Actual Cost</Text><Heading size="6">{formatCurrency(totalActual)}</Heading></Flex></Card>
        <Card><Flex direction="column" gap="1"><Text size="2">Profit Margin</Text><TextField type="number" value={profitMargin.toString()} onChange={(e) => setProfitMargin(parseFloat(e.target.value))} /></Flex></Card>
        <Card><Flex direction="column" gap="1"><Text size="2">Target Cost</Text><TextField type="number" value={targetCost.toString()} onChange={(e) => setTargetCost(parseFloat(e.target.value))} /></Flex></Card>
        <Card><Flex direction="column" gap="1"><Text size="2">Benchmark Price</Text><TextField type="number" value={benchmarkPrice.toString()} onChange={(e) => setBenchmarkPrice(parseFloat(e.target.value))} /></Flex></Card>
        <Card><Flex direction="column" gap="2"><Text size="2">Progress To Target</Text><Progress value={progress} /><TextField type="number" value={progress.toString()} onChange={(e) => setProgress(parseFloat(e.target.value))} /></Flex></Card>
        <Card><Flex direction="column" gap="1"><Text size="2">Post-Optimization Estimate</Text><Heading size="6">{formatCurrency(postOptimizationEstimate)}</Heading></Flex></Card>
      </Grid>

      {/* Table */}
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Cost Category</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actual</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Budget</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Variance</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>% Of Total</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Solution</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Cost After</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {costData.map((item, index) => {
            if (item.isGroup) {
              return (
                <Table.Row key={`group-${index}`}>
                  <Table.Cell colSpan={7}><Text weight="bold" size="3" color="gray" style={{ backgroundColor: '#f3f4f6', padding: '6px' }}>{item.category}</Text></Table.Cell>
                </Table.Row>
              );
            }

            const actual = parseFloat(item.actual ?? '0');
            const budget = parseFloat(item.budget ?? '0');
            const variance = budget !== 0 ? ((actual - budget) / budget) * 100 : 0;
            const varianceLabel = `${variance > 0 ? '+' : ''}${variance.toFixed(1)}%`;
            const varianceColor = variance > 0 ? 'red' : 'green';

            return (
              <Table.Row key={item.category}>
                <Table.Cell>{item.category}</Table.Cell>
                <Table.Cell><TextField type="number" value={item.actual} onChange={(e) => handleCellChange(index, 'actual', e.target.value)} /></Table.Cell>
                <Table.Cell><TextField type="number" value={item.budget} onChange={(e) => handleCellChange(index, 'budget', e.target.value)} /></Table.Cell>
                <Table.Cell><Text color={varianceColor}>{varianceLabel}</Text></Table.Cell>
                <Table.Cell>{item.value}%</Table.Cell>
                <Table.Cell>
                  <Select.Root value={solutions[item.category] || ''} onValueChange={(val) => setSolutions((prev) => ({ ...prev, [item.category]: val }))}>
                    <Select.Trigger placeholder="Select" />
                    <Select.Content>
                      {solutionOptions.map((option) => (<Select.Item key={option} value={option}>{option}</Select.Item>))}
                    </Select.Content>
                  </Select.Root>
                </Table.Cell>
                <Table.Cell><TextField type="number" value={item.costAfter} onChange={(e) => handleCellChange(index, 'costAfter', e.target.value)} /></Table.Cell>
              </Table.Row>
            );
          })}

          <Table.Row>
            <Table.Cell><Text weight="bold">Total</Text></Table.Cell>
            <Table.Cell>{formatCurrency(totalActual)}</Table.Cell>
            <Table.Cell>{formatCurrency(totalBudget)}</Table.Cell>
            <Table.Cell />
            <Table.Cell><Text weight="bold">100%</Text></Table.Cell>
            <Table.Cell />
            <Table.Cell><Text weight="bold">{formatCurrency(totalCostAfter)}</Text></Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

export default CostAnalysis;
