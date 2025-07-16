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
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

const CostAnalysis = () => {
  const { t } = useTranslation('cost-analysis');
  const [currency, setCurrency] = useState<'EGP' | 'USD'>('EGP');

  const costData = [
    {
      category: 'Direct Materials',
      value: 45,
      color: '#3b82f6',
      actual: '1400000',
      budget: '1300000',
      solution: 'Negotiate supplier contracts',
      costAfter: '1250000'
    },
    {
      category: 'Packaging',
      value: 20,
      color: '#f59e0b',
      actual: '700000',
      budget: '650000',
      solution: 'Use alternative packaging',
      costAfter: '630000'
    },
    {
      category: 'Labor',
      value: 10,
      color: '#ef4444',
      actual: '400000',
      budget: '350000',
      solution: 'Optimize shifts',
      costAfter: '340000'
    }
  ];

  const formatCurrency = (num: number | string) => {
    const value = typeof num === 'string' ? parseFloat(num) : num;
    return `${value.toLocaleString()} ${currency}`;
  };

  return (
    <Box p="6">
      {/* Title and Controls */}
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
            <Text size="2">Progress to Target</Text>
            <Progress value={78} />
            <Text size="1">78% achieved</Text>
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
      <Flex gap="4" mb="5">
        <Card style={{ flex: 1 }}>
          <Heading size="4" mb="3">{t('cost-composition')}</Heading>
          <div className="h-64">
            <PieChart width={300} height={250}>
              <Pie
                data={costData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {costData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </div>
        </Card>

        <Card style={{ flex: 1 }}>
          <Heading size="4" mb="3">{t('cost-trend-analysis')}</Heading>
          <div className="h-64">
            <BarChart width={500} height={250} data={costData}>
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </div>
        </Card>
      </Flex>

      {/* Data Table */}
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>{t('cost-category')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('actual')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('budget')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('variance')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('percent-of-total')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('solution')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('cost-after')}</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {costData.map((category) => {
            const actual = parseFloat(category.actual);
            const budget = parseFloat(category.budget);
            const variance = ((actual - budget) / budget) * 100;
            const varianceLabel = `${variance > 0 ? '+' : ''}${variance.toFixed(1)}%`;
            const varianceColor = variance > 0 ? 'red' : 'green';

            return (
              <Table.Row key={category.category}>
                <Table.Cell>{category.category}</Table.Cell>
                <Table.Cell>{formatCurrency(actual)}</Table.Cell>
                <Table.Cell>{formatCurrency(budget)}</Table.Cell>
                <Table.Cell>
                  <Text color={varianceColor}>{varianceLabel}</Text>
                </Table.Cell>
                <Table.Cell>{category.value}%</Table.Cell>
                <Table.Cell>{category.solution}</Table.Cell>
                <Table.Cell>{formatCurrency(category.costAfter)}</Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

export default CostAnalysis;
