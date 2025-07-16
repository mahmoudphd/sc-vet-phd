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
import { BarChart, Bar, PieChart, Pie, Cell, Tooltip as ReTooltip } from 'recharts';
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

const initialData = [
  { category: 'Direct Cost', isGroup: true },
  { category: 'Direct Materials', value: 45, actual: 1350, budget: 1300, costAfter: 1250 },
  { category: 'Packaging Materials', value: 20, actual: 600, budget: 580, costAfter: 570 },
  { category: 'Direct Labor', value: 15, actual: 450, budget: 420, costAfter: 430 },
  { category: 'Overhead', isGroup: true },
  { category: 'Overhead', value: 12, actual: 360, budget: 350, costAfter: 345 },
  { category: 'Other Costs', isGroup: true },
  { category: 'Other Costs', value: 8, actual: 240, budget: 230, costAfter: 225 }
];

const CostAnalysis = () => {
  const [currency, setCurrency] = useState<'EGP' | 'USD'>('EGP');
  const [solutions, setSolutions] = useState<Record<string, string>>({});
  const [targetCost, setTargetCost] = useState<number>(3200);
  const [postOptimizationEstimate, setPostOptimizationEstimate] = useState<number>(3150);
  const [profitMargin, setProfitMargin] = useState<number>(25);
  const [costData, setCostData] = useState(initialData);

  const formatCurrency = (num: number | string | undefined) => {
    const value = typeof num === 'string' ? parseFloat(num ?? '0') : num ?? 0;
    return `${value.toLocaleString(undefined, { maximumFractionDigits: 0 })} ${currency}`;
  };

  const totalActual = costData.filter(i => !i.isGroup).reduce((sum, i) => sum + Number(i.actual), 0);
  const totalBudget = costData.filter(i => !i.isGroup).reduce((sum, i) => sum + Number(i.budget), 0);
  const totalCostAfter = costData.filter(i => !i.isGroup).reduce((sum, i) => sum + Number(i.costAfter), 0);

  const updateCostValue = (index: number, field: 'actual' | 'budget' | 'costAfter', value: number) => {
    setCostData(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  return (
    <Box p="6">
      <Flex justify="between" align="center" mb="5">
        <Heading size="6" weight="bold">Inter-Organizational Cost Management</Heading>
        <Flex gap="3">
          <Select.Root defaultValue="product-1">
            <Select.Trigger />
            <Select.Content>
              <Select.Item value="product-1">Poultry Product 1</Select.Item>
              <Select.Item value="product-2">Poultry Product 2</Select.Item>
              <Select.Item value="product-3">Poultry Product 3</Select.Item>
              <Select.Item value="product-4">Poultry Product 4</Select.Item>
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

      <Grid columns="3" gap="4" mb="6">
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2" weight="bold">Actual Cost</Text>
            <Heading size="6" weight="bold">{formatCurrency(totalActual)}</Heading>
          </Flex>
        </Card>

        <Card>
          <Flex direction="column" gap="1">
            <Text size="2" weight="bold">Profit Margin (%)</Text>
            <input
              type="number"
              value={profitMargin}
              onChange={(e) => setProfitMargin(Number(e.target.value))}
              style={{ fontWeight: 'bold' }}
            />
          </Flex>
        </Card>

        <Card>
          <Flex direction="column" gap="1">
            <Text size="2" weight="bold">Target Cost</Text>
            <input
              type="number"
              value={targetCost}
              onChange={(e) => setTargetCost(Number(e.target.value))}
              style={{ fontWeight: 'bold' }}
            />
          </Flex>
        </Card>

        <Card>
          <Flex direction="column" gap="1">
            <Text size="2" weight="bold">Benchmark Price</Text>
            <Heading size="6" weight="bold">{formatCurrency(3450)}</Heading>
          </Flex>
        </Card>

        <Card>
          <Flex direction="column" gap="2">
            <Text size="2" weight="bold">Progress To Target</Text>
            <Progress value={80} />
            <Text size="1" weight="bold">80% Achieved</Text>
          </Flex>
        </Card>

        <Card>
          <Flex direction="column" gap="1">
            <Text size="2" weight="bold">Post-Optimization Estimate</Text>
            <input
              type="number"
              value={postOptimizationEstimate}
              onChange={(e) => setPostOptimizationEstimate(Number(e.target.value))}
              style={{ fontWeight: 'bold' }}
            />
          </Flex>
        </Card>
      </Grid>

      <Flex gap="4" mb="6">
        <Card style={{ flex: 1 }}>
          <Heading size="4" mb="3" weight="bold">Cost Composition</Heading>
          <PieChart width={300} height={250}>
            <Pie
              data={costData.filter(i => !i.isGroup)}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {costData.filter(i => !i.isGroup).map((entry, index) => (
                <Cell key={index} fill={["#3b82f6", "#f59e0b", "#ef4444", "#10b981", "#8b5cf6"][index % 5]} />
              ))}
            </Pie>
            <ReTooltip />
          </PieChart>
        </Card>

        <Card style={{ flex: 1 }}>
          <Heading size="4" mb="3" weight="bold">Cost Trend Analysis</Heading>
          <BarChart width={500} height={250} data={costData.filter(i => !i.isGroup)}>
            <Bar dataKey="value" fill="#3b82f6" />
            <ReTooltip />
          </BarChart>
        </Card>
      </Flex>

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
                    <Text weight="bold" size="3" color="gray" style={{ backgroundColor: '#f3f4f6', padding: '6px' }}>
                      {item.category}
                    </Text>
                  </Table.Cell>
                </Table.Row>
              );
            }

            const variance = item.budget !== 0 ? ((Number(item.actual) - Number(item.budget)) / Number(item.budget)) * 100 : 0;
            const percentOfTotal = totalActual !== 0 ? (Number(item.actual) / totalActual) * 100 : 0;
            const varianceColor = variance > 0 ? 'red' : 'green';

            return (
              <Table.Row key={item.category}>
                <Table.Cell>{item.category}</Table.Cell>
                <Table.Cell>
                  <input
                    type="number"
                    value={item.actual}
                    onChange={(e) => updateCostValue(index, 'actual', Number(e.target.value))}
                    style={{ fontWeight: 'bold' }}
                  />
                </Table.Cell>
                <Table.Cell>
                  <input
                    type="number"
                    value={item.budget}
                    onChange={(e) => updateCostValue(index, 'budget', Number(e.target.value))}
                    style={{ fontWeight: 'bold' }}
                  />
                </Table.Cell>
                <Table.Cell>
                  <Text color={varianceColor}>{variance.toFixed(1)}%</Text>
                </Table.Cell>
                <Table.Cell>{percentOfTotal.toFixed(1)}%</Table.Cell>
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
                <Table.Cell>
                  <input
                    type="number"
                    value={item.costAfter}
                    onChange={(e) => updateCostValue(index, 'costAfter', Number(e.target.value))}
                    style={{ fontWeight: 'bold' }}
                  />
                </Table.Cell>
              </Table.Row>
            );
          })}

          <Table.Row>
            <Table.Cell>
              <Text weight="bold">Total</Text>
            </Table.Cell>
            <Table.Cell>{formatCurrency(totalActual)}</Table.Cell>
            <Table.Cell>{formatCurrency(totalBudget)}</Table.Cell>
            <Table.Cell />
            <Table.Cell>
              <Text weight="bold">100%</Text>
            </Table.Cell>
            <Table.Cell />
            <Table.Cell>{formatCurrency(totalCostAfter)}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

export default CostAnalysis;
