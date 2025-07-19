// CostAnalysis.tsx - مع تكامل إنترنت الأشياء وعرض تفاصيل المواد الخام
import { useState, useMemo, useEffect } from 'react';
import {
  Box, Button, Card, Flex, Grid, Heading, Progress, Select, Table, Text, TextField, Switch, Dialog
} from '@radix-ui/themes';
import {
  PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
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

const CostAnalysis = () => {
  const [currency, setCurrency] = useState<'EGP' | 'USD'>('EGP');
  const [mode, setMode] = useState<'manual' | 'auto'>('manual');
  const [benchmarkPrice, setBenchmarkPrice] = useState(220);
  const [profitMargin, setProfitMargin] = useState(25);
  const [showGap, setShowGap] = useState(false);
  const [solutions, setSolutions] = useState<Record<string, string>>({});
  const [showRawDialog, setShowRawDialog] = useState(false);

  const rawMaterials = simulatedIoTCostData.rawMaterials;

  const defaultCostData = [
    { category: 'Direct Cost', isGroup: true },
    {
      category: 'Direct Materials',
      value: 45,
      actual: '133.11',
      budget: '140',
      costAfter: '120'
    },
    {
      category: 'Packaging Materials',
      value: 20,
      actual: '45',
      budget: '50',
      costAfter: '43'
    },
    {
      category: 'Direct Labor',
      value: 15,
      actual: '38',
      budget: '40',
      costAfter: '37'
    },
    { category: 'Overhead', isGroup: true },
    {
      category: 'Overhead',
      value: 12,
      actual: '30',
      budget: '32',
      costAfter: '29'
    },
    { category: 'Other Costs', isGroup: true },
    {
      category: 'Other Costs',
      value: 8,
      actual: '20',
      budget: '25',
      costAfter: '19'
    }
  ];

  const [costData, setCostData] = useState(defaultCostData);

  useEffect(() => {
    if (mode === 'auto') {
      const autoData = simulatedIoTCostData.totals;
      const mapped = defaultCostData.map((item) => {
        if (item.isGroup) return item;
        return {
          ...item,
          actual: autoData[item.category]?.actual?.toString() || item.actual,
          budget: autoData[item.category]?.budget?.toString() || item.budget,
          costAfter: autoData[item.category]?.costAfter?.toString() || item.costAfter
        };
      });
      setCostData(mapped);
    } else {
      setCostData(defaultCostData);
    }
  }, [mode]);

  const updateCostField = (index: number, field: 'actual' | 'budget' | 'costAfter', value: string) => {
    const updated = [...costData];
    (updated[index] as any)[field] = value;
    setCostData(updated);
  };

  const formatCurrency = (num: number | string | undefined) => {
    const value = typeof num === 'string' ? parseFloat(num ?? '0') : num ?? 0;
    return `${currency} ${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  };

  const totalActual = costData.filter(i => !i.isGroup).reduce((sum, i) => sum + parseFloat(i.actual ?? '0'), 0);
  const totalBudget = costData.filter(i => !i.isGroup).reduce((sum, i) => sum + parseFloat(i.budget ?? '0'), 0);
  const totalCostAfter = costData.filter(i => !i.isGroup).reduce((sum, i) => sum + parseFloat(i.costAfter ?? '0'), 0);

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

  const handleSubmit = () => {
    console.log('Submitted cost data:', costData);
  };

  return (
    <Box p="6">
      <Flex justify="between" align="center" mb="4">
        <Heading size="6">Inter-Organizational Cost Management</Heading>
        <Flex gap="3">
          <Box>
            <Text size="1">Auto Mode</Text>
            <Switch checked={mode === 'auto'} onCheckedChange={(val) => setMode(val ? 'auto' : 'manual')} />
          </Box>
          <Select.Root defaultValue={currency} onValueChange={(val) => setCurrency(val as 'EGP' | 'USD')}>
            <Select.Trigger />
            <Select.Content>
              <Select.Item value="EGP">EGP</Select.Item>
              <Select.Item value="USD">USD</Select.Item>
            </Select.Content>
          </Select.Root>
          <Button variant="soft">Export Report</Button>
        </Flex>
      </Flex>

      <Grid columns="3" gap="4" mb="5">
        <Card><Flex direction="column" gap="1"><Text size="2">Actual Cost</Text><Heading size="6">{formatCurrency(totalActual)}</Heading></Flex></Card>
        <Card><Flex direction="column" gap="1"><Text size="2">Target Cost</Text><Heading size="6">{formatCurrency(totalBudget)}</Heading></Flex></Card>
        <Card><Flex direction="column" gap="1"><Text size="2">Benchmark Price</Text><TextField.Root value={benchmarkPrice.toString()} onChange={(e) => setBenchmarkPrice(Number(e.target.value))} /></Flex></Card>
        <Card><Flex direction="column" gap="1"><Text size="2">Profit Margin (%)</Text><TextField.Root value={profitMargin.toString()} onChange={(e) => setProfitMargin(Number(e.target.value))} /></Flex></Card>
        <Card><Flex direction="column" gap="1"><Text size="2">Progress To Target</Text><Progress value={80} /></Flex></Card>
        <Card><Flex direction="column" gap="1"><Text size="2">Post-Optimization Estimate</Text><Heading size="6">{formatCurrency(totalCostAfter)}</Heading></Flex></Card>
      </Grid>

      <Flex justify="end" mb="3">
        <Button variant="solid" onClick={() => setShowGap(!showGap)}>{showGap ? 'Hide Gap Analysis' : 'Show Gap Analysis'}</Button>
      </Flex>

      <Flex gap="4" mb="5">
        <Card style={{ flex: 1 }}>
          <Heading size="4" mb="3">Cost Composition</Heading>
          <PieChart width={300} height={250}>
            <Pie data={[{ name: 'Direct Cost', value: 80 }, { name: 'Overhead', value: 12 }, { name: 'Other Costs', value: 8 }]} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
              <Cell fill="#3b82f6" /><Cell fill="#f59e0b" /><Cell fill="#ef4444" />
            </Pie>
            <Legend />
          </PieChart>
        </Card>

        <Card style={{ flex: 1 }}>
          <Heading size="4" mb="3">Our Product Cost Analysis</Heading>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={benchmarkTrendDataWithGap}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
              <Legend />
              <Line type="monotone" dataKey="actual" stroke="#3b82f6" name="Our Product Cost" />
              <Line type="monotone" dataKey="benchmark" stroke="#ef4444" name="Market Benchmark" />
              <Line type="monotone" dataKey="targetCost" stroke="#f97316" name="Target Cost" strokeDasharray="5 5" />
              {showGap && <Line type="monotone" dataKey="gap" stroke="#10b981" name="Cost Gap" dot={false} />}
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </Flex>

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
          {costData.map((item, index) => {
            if (item.isGroup) {
              return <Table.Row key={index}><Table.Cell colSpan={6}><Text weight="bold">{item.category}</Text></Table.Cell></Table.Row>;
            }
            return (
              <Table.Row key={index}>
                <Table.Cell>{item.category}</Table.Cell>
                <Table.Cell><TextField.Root value={item.actual ?? ''} onChange={(e) => updateCostField(index, 'actual', e.target.value)} /></Table.Cell>
                <Table.Cell><TextField.Root value={item.budget ?? ''} onChange={(e) => updateCostField(index, 'budget', e.target.value)} /></Table.Cell>
                <Table.Cell><TextField.Root value={item.costAfter ?? ''} onChange={(e) => updateCostField(index, 'costAfter', e.target.value)} /></Table.Cell>
                <Table.Cell>
                  <Select.Root
                    value={solutions[item.category] || ''}
                    onValueChange={(val) => setSolutions((prev) => ({ ...prev, [item.category]: val }))}>
                    <Select.Trigger placeholder="Select" />
                    <Select.Content>
                      {solutionOptions.map(opt => <Select.Item key={opt} value={opt}>{opt}</Select.Item>)}
                    </Select.Content>
                  </Select.Root>
                </Table.Cell>
                <Table.Cell>
                  {item.category === 'Direct Materials' ? (
                    <Button variant="outline" size="1" onClick={() => setShowRawDialog(true)}>View</Button>
                  ) : (
                    <Text>-</Text>
                  )}
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Root>

      <Flex mt="4" justify="end">
        <Button color="green" variant="solid" onClick={handleSubmit}>Submit</Button>
      </Flex>

      <Dialog.Root open={showRawDialog} onOpenChange={setShowRawDialog}>
        <Dialog.Content maxWidth="600px">
          <Dialog.Title>Raw Materials Breakdown</Dialog.Title>
          <Box style={{ maxHeight: 400, overflowY: 'auto' }} mt="3">
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Weight (kg)</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Price/Kg</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Total Cost</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {rawMaterials.map((mat, i) => (
                  <Table.Row key={i}>
                    <Table.Cell>{mat.name}</Table.Cell>
                    <Table.Cell>{mat.weight}</Table.Cell>
                    <Table.Cell>{formatCurrency(mat.price)}</Table.Cell>
                    <Table.Cell>{formatCurrency(mat.cost)}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>
          <Flex mt="3" justify="end">
            <Button variant="solid" onClick={() => setShowRawDialog(false)}>Close</Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Box>
  );
};

export default CostAnalysis;
