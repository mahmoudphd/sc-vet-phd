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

  const formatCurrency = (num: number | string | undefined) => {
    const value = typeof num === 'string' ? parseFloat(num ?? '0') : num ?? 0;
    return `${value} ${currency}`;
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

  const totalCostAfter = costData
    .filter(item => !item.isGroup)
    .reduce((sum, item) => sum + parseFloat(item.costAfter ?? '0'), 0);

  return (
    <Box p="6">
      {/* Header Section */}
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

          <Select.Root
            defaultValue="EGP"
            onValueChange={(val) => setCurrency(val as 'EGP' | 'USD')}
          >
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
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">Actual Cost</Text>
            <Heading size="6">{formatCurrency(3050)}</Heading>
          </Flex>
        </Card>

        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">Total Cost</Text>
            <Heading size="6">{formatCurrency(3200)}</Heading>
          </Flex>
        </Card>

        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">Target Cost</Text>
            <Heading size="6">{formatCurrency(2950)}</Heading>
          </Flex>
        </Card>

        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">Benchmark Price</Text>
            <Heading size="6">{formatCurrency(3100)}</Heading>
          </Flex>
        </Card>

        <Card>
          <Flex direction="column" gap="2">
            <Text size="2">Progress To Target</Text>
            <Progress value={85} />
            <Text size="1">85% Achieved</Text>
          </Flex>
        </Card>

        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">Post-Optimization Estimate</Text>
            <Heading size="6">{formatCurrency(2820)}</Heading>
          </Flex>
        </Card>
      </Grid>

      {/* Charts */}
      <Flex gap="4" mb="6">
        <Card style={{ flex: 1 }}>
          <Heading size="4" mb="3">Cost Composition</Heading>
          <div style={{ height: '250px' }}>
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
                {costData
                  .filter(item => !item.isGroup)
                  .map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={["#3b82f6", "#f59e0b", "#ef4444", "#10b981", "#8b5cf6"][index % 5]}
                    />
                  ))}
              </Pie>
            </PieChart>
          </div>
        </Card>

        <Card style={{ flex: 1 }}>
          <Heading size="4" mb="3">Cost Trend Analysis</Heading>
          <div style={{ height: '250px' }}>
            <BarChart width={500} height={250} data={costData.filter(item => !item.isGroup)}>
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </div>
        </Card>
      </Flex>

      {/* Table Section */}
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
                  <Table.Cell colSpan={7}>
                    <Text
                      weight="bold"
                      size="3"
                      color="gray"
                      style={{ backgroundColor: '#f3f4f6', padding: '6px' }}
                    >
                      {item.category}
                    </Text>
                  </Table.Cell>
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
                <Table.Cell>{formatCurrency(actual)}</Table.Cell>
                <Table.Cell>{formatCurrency(budget)}</Table.Cell>
                <Table.Cell>
                  <Text color={varianceColor}>{varianceLabel}</Text>
                </Table.Cell>
                <Table.Cell>{item.value}%</Table.Cell>
                <Table.Cell>
                  <Select.Root
                    value={solutions[item.category] || ''}
                    onValueChange={(val) =>
                      setSolutions((prev) => ({ ...prev, [item.category]: val }))
                    }
                  >
                    <Select.Trigger placeholder="Select" />
                    <Select.Content>
                      {solutionOptions.map((option) => (
                        <Select.Item key={option} value={option}>
                          {option}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </Table.Cell>
                <Table.Cell>{formatCurrency(item.costAfter)}</Table.Cell>
              </Table.Row>
            );
          })}

          <Table.Row>
            <Table.Cell>
              <Text weight="bold">Total</Text>
            </Table.Cell>
            <Table.Cell />
            <Table.Cell />
            <Table.Cell />
            <Table.Cell>
              <Text weight="bold">100%</Text>
            </Table.Cell>
            <Table.Cell />
            <Table.Cell>
              <Text weight="bold">{formatCurrency(totalCostAfter)}</Text>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

export default CostAnalysis;
