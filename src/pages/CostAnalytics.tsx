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
  Box
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

  // بيانات التكلفة مع مجموعات
  const costData = [
    { category: 'Direct Cost', isGroup: true },
    {
      category: 'Direct Materials',
      value: 45,
      actual: 1400000,
      budget: 1300000,
      costAfter: 1250000
    },
    {
      category: 'Packaging',
      value: 20,
      actual: 700000,
      budget: 650000,
      costAfter: 630000
    },
    {
      category: 'Labor',
      value: 10,
      actual: 400000,
      budget: 350000,
      costAfter: 340000
    },
    { category: 'Overhead', isGroup: true },
    {
      category: 'Other Costs',
      value: 15,
      actual: 300000,
      budget: 280000,
      costAfter: 290000
    }
  ];

  // لحساب المجموع النهائي لـ costAfter
  const totalCostAfter = costData
    .filter(item => !item.isGroup)
    .reduce((sum, item) => sum + item.costAfter, 0);

  // تنسيق العملة مع الأرقام
  const formatCurrency = (num: number) => {
    return num.toLocaleString() + ' ' + currency;
  };

  return (
    <Box p="6">
      {/* Header */}
      <Flex justify="between" align="center" mb="5" wrap="wrap" gap="3">
        <Heading size="6">Inter-Organizational Cost Management</Heading>
        <Flex gap="3" align="center" wrap="wrap">
          <Select.Root defaultValue="product-1">
            <Select.Trigger aria-label="Select Product" />
            <Select.Content>
              <Select.Item value="product-1">Product A</Select.Item>
              <Select.Item value="product-2">Product B</Select.Item>
            </Select.Content>
          </Select.Root>

          <Select.Root defaultValue={currency} onValueChange={val => setCurrency(val as 'EGP' | 'USD')}>
            <Select.Trigger aria-label="Select Currency" />
            <Select.Content>
              <Select.Item value="EGP">EGP</Select.Item>
              <Select.Item value="USD">USD</Select.Item>
            </Select.Content>
          </Select.Root>

          <Button variant="soft">Export Report</Button>
        </Flex>
      </Flex>

      {/* KPI Cards */}
      <Grid columns={{ '@initial': 1, '@md': 3 }} gap="4" mb="6">
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">Actual Cost</Text>
            <Heading size="6">{formatCurrency(2750000)}</Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">Total Cost</Text>
            <Heading size="6">{formatCurrency(3150000)}</Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">Target Cost</Text>
            <Heading size="6">{formatCurrency(2900000)}</Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">Benchmark Price</Text>
            <Heading size="6">{formatCurrency(3050000)}</Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="2">
            <Text size="2">Progress To Target</Text>
            <Progress value={78} />
            <Text size="1">78% Achieved</Text>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">Post-Optimization Estimate</Text>
            <Heading size="6">{formatCurrency(2850000)}</Heading>
          </Flex>
        </Card>
      </Grid>

      {/* Charts */}
      <Flex gap="4" mb="6" wrap="wrap">
        <Card style={{ flex: 1, minWidth: 300 }}>
          <Heading size="4" mb="3">Cost Composition</Heading>
          <PieChart width={300} height={250}>
            <Pie
              data={costData.filter(item => !item.isGroup)}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {costData.filter(item => !item.isGroup).map((entry, index) => (
                <Cell key={index} fill={['#3b82f6', '#f59e0b', '#ef4444', '#10b981'][index % 4]} />
              ))}
            </Pie>
          </PieChart>
        </Card>
        <Card style={{ flex: 1, minWidth: 300 }}>
          <Heading size="4" mb="3">Cost Trend Analysis</Heading>
          <BarChart width={300} height={250} data={costData.filter(item => !item.isGroup)}>
            <Bar dataKey="value" fill="#3b82f6" />
          </BarChart>
        </Card>
      </Flex>

      {/* Cost Table */}
      <Table.Root variant="surface" style={{ overflowX: 'auto' }}>
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
          {costData.map((item, i) => {
            if (item.isGroup) {
              return (
                <Table.Row key={`group-${i}`}>
                  <Table.Cell colSpan={7}>
                    <Text weight="bold" size="3" color="gray" style={{ backgroundColor: '#f3f4f6', padding: 8 }}>
                      {item.category}
                    </Text>
                  </Table.Cell>
                </Table.Row>
              );
            }

            const actual = item.actual;
            const budget = item.budget;
            const variance = budget !== 0 ? ((actual - budget) / budget) * 100 : 0;
            const varianceLabel = `${variance > 0 ? '+' : ''}${variance.toFixed(1)}%`;
            const varianceColor = variance > 0 ? 'red' : 'green';

            return (
              <Table.Row key={item.category}>
                <Table.Cell>{item.category}</Table.Cell>
                <Table.Cell>{formatCurrency(actual)}</Table.Cell>
                <Table.Cell>{formatCurrency(budget)}</Table.Cell>
                <Table.Cell>
                  <Text color={varianceColor}>{varianceLabel}</Text>
                </Table.Cell>
                <Table.Cell>{item.value}%</Table.Cell>
                <Table.Cell>
                  <Select.Root
                    value={solutions[item.category] || ''}
                    onValueChange={val =>
                      setSolutions(prev => ({ ...prev, [item.category]: val }))
                    }
                  >
                    <Select.Trigger aria-label={`Select solution for ${item.category}`} placeholder="Select" />
                    <Select.Content>
                      {solutionOptions.map(option => (
                        <Select.Item key={option} value={option}>{option}</Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </Table.Cell>
                <Table.Cell>{formatCurrency(item.costAfter)}</Table.Cell>
              </Table.Row>
            );
          })}

          <Table.Row>
            <Table.Cell><Text weight="bold">Total</Text></Table.Cell>
            <Table.Cell />
            <Table.Cell />
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
