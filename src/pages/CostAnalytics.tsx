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
import { LineChart, Line, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';
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
  const [benchmarkPrice, setBenchmarkPrice] = useState(3450);
  const [targetCost, setTargetCost] = useState(3200);
  const [profitMargin, setProfitMargin] = useState(25);
  const [showGap, setShowGap] = useState(false);

  const formatCurrency = (num: number | string | undefined) => {
    const value = typeof num === 'string' ? parseFloat(num ?? '0') : num ?? 0;
    return `${value.toLocaleString(undefined, { maximumFractionDigits: 0 })} ${currency}`;
  };

  const costData = [
    { category: 'Direct Cost', isGroup: true },
    {
      category: 'Direct Materials',
      value: 45,
      actual: '1350',
      budget: '1300',
      costAfter: '1250'
    },
    {
      category: 'Packaging Materials',
      value: 20,
      actual: '600',
      budget: '580',
      costAfter: '570'
    },
    {
      category: 'Direct Labor',
      value: 15,
      actual: '450',
      budget: '420',
      costAfter: '430'
    },
    { category: 'Overhead', isGroup: true },
    {
      category: 'Overhead',
      value: 12,
      actual: '360',
      budget: '350',
      costAfter: '345'
    },
    { category: 'Other Costs', isGroup: true },
    {
      category: 'Other Costs',
      value: 8,
      actual: '240',
      budget: '230',
      costAfter: '225'
    }
  ];

  const totalActual = costData.filter(i => !i.isGroup).reduce((sum, i) => sum + parseFloat(i.actual ?? '0'), 0);
  const totalBudget = costData.filter(i => !i.isGroup).reduce((sum, i) => sum + parseFloat(i.budget ?? '0'), 0);
  const totalCostAfter = costData.filter(i => !i.isGroup).reduce((sum, i) => sum + parseFloat(i.costAfter ?? '0'), 0);

  const benchmarkTrendData = [
    { month: 'Jan', actual: 3250, benchmark: 3400 },
    { month: 'Feb', actual: 3300, benchmark: 3425 },
    { month: 'Mar', actual: 3340, benchmark: 3440 },
    { month: 'Apr', actual: 3360, benchmark: 3435 },
    { month: 'May', actual: totalActual, benchmark: benchmarkPrice }
  ];

  const averageGap = benchmarkTrendData.reduce((sum, d) => sum + (d.benchmark - d.actual), 0) / benchmarkTrendData.length;

  return (
    <Box p="6">
      {/* Header */}
      <Flex justify="between" align="center" mb="5">
        <Heading size="6">Inter-Organizational Cost Management</Heading>
        <Flex gap="3">
          <Select.Root defaultValue="product-1">
            <Select.Trigger />
            <Select.Content>
              <Select.Item value="product-1">Poultry Product 1</Select.Item>
              <Select.Item value="product-2">Poultry Product 2</Select.Item>
              <Select.Item value="product-3">Poultry Product 3</Select.Item>
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

      <Flex direction="column" gap="3" mb="4">
        <TextField.Root size="2" placeholder="Target Cost" value={targetCost} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTargetCost(Number(e.target.value))} />
        <TextField.Root size="2" placeholder="Benchmark Price" value={benchmarkPrice} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBenchmarkPrice(Number(e.target.value))} />
        <TextField.Root size="2" placeholder="Profit Margin %" value={profitMargin} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfitMargin(Number(e.target.value))} />
      </Flex>

      {/* KPI Cards */}
      <Grid columns="3" gap="4" mb="6">
        <Card><Flex direction="column" gap="1"><Text size="2">Actual Cost</Text><Heading size="6"><strong>{formatCurrency(totalActual)}</strong></Heading></Flex></Card>
        <Card><Flex direction="column" gap="1"><Text size="2">Target Cost</Text><Heading size="6"><strong>{formatCurrency(targetCost)}</strong></Heading></Flex></Card>
        <Card><Flex direction="column" gap="1"><Text size="2">Benchmark Price</Text><Heading size="6"><strong>{formatCurrency(benchmarkPrice)}</strong></Heading></Flex></Card>
        <Card><Flex direction="column" gap="1"><Text size="2">Profit Margin</Text><Heading size="6"><strong>{profitMargin}%</strong></Heading></Flex></Card>
        <Card><Flex direction="column" gap="2"><Text size="2">Progress To Target</Text><Progress value={80} /><Text size="1">80% Achieved</Text></Flex></Card>
        <Card><Flex direction="column" gap="1"><Text size="2">Post-Optimization Estimate</Text><Heading size="6"><strong>{formatCurrency(totalCostAfter)}</strong></Heading></Flex></Card>
      </Grid>

      <Flex justify="end" mb="4">
        <Button variant="solid" onClick={() => setShowGap(!showGap)}>
          {showGap ? 'Hide Gap Analysis' : 'Show Gap Analysis'}
        </Button>
      </Flex>

      {/* Charts */}
      <Flex gap="4" mb="6">
        <Card style={{ flex: 1 }}>
          <Heading size="4" mb="3">Cost Composition</Heading>
          <PieChart width={300} height={250}>
            <Pie data={[{ name: 'Direct Cost', value: 80 }, { name: 'Overhead', value: 12 }, { name: 'Other Costs', value: 8 }]} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
              <Cell fill="#3b82f6" />
              <Cell fill="#f59e0b" />
              <Cell fill="#ef4444" />
            </Pie>
            <Legend />
          </PieChart>
        </Card>

        <Card style={{ flex: 1 }}>
          <Heading size="4" mb="3">Benchmark Price Analysis</Heading>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={benchmarkTrendData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
              <Line type="monotone" dataKey="actual" stroke="#3b82f6" name="Our Product Price" />
              <Line type="monotone" dataKey="benchmark" stroke="#ef4444" name="Market Benchmark" />
              {showGap && <Line type="monotone" dataKey={(d: any) => d.benchmark - d.actual} stroke="#10b981" name="Price Gap" dot={false} />} 
            </LineChart>
          </ResponsiveContainer>
          {showGap && (
            <Text align="center" mt="3" size="2" color="gray">
              Average Gap: <strong>{formatCurrency(averageGap)}</strong>
            </Text>
          )}
        </Card>
      </Flex>

      {/* Table remains unchanged below */}
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Cost Category</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actual</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Target</Table.ColumnHeaderCell>
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
                <Table.Cell><Text weight="medium">{item.category}</Text></Table.Cell>
                <Table.Cell><Text weight="medium">{formatCurrency(actual)}</Text></Table.Cell>
                <Table.Cell><Text weight="medium">{formatCurrency(budget)}</Text></Table.Cell>
                <Table.Cell><Text weight="medium" color={varianceColor}>{varianceLabel}</Text></Table.Cell>
                <Table.Cell><Text weight="medium">{item.value}%</Text></Table.Cell>
                <Table.Cell>
                  <Select.Root
                    value={solutions[item.category] || ''}
                    onValueChange={(val) => setSolutions((prev) => ({ ...prev, [item.category]: val }))}
                  >
                    <Select.Trigger placeholder="Select" />
                    <Select.Content>
                      {solutionOptions.map((option) => (
                        <Select.Item key={option} value={option}>{option}</Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </Table.Cell>
                <Table.Cell><Text weight="medium">{formatCurrency(item.costAfter)}</Text></Table.Cell>
              </Table.Row>
            );
          })}

          <Table.Row>
            <Table.Cell><Text weight="bold">Total</Text></Table.Cell>
            <Table.Cell><Text weight="bold">{formatCurrency(totalActual)}</Text></Table.Cell>
            <Table.Cell><Text weight="bold">{formatCurrency(totalBudget)}</Text></Table.Cell>
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
