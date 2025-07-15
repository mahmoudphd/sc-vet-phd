// Updated CostAnalysis.tsx with headings bold + currency toggle + scientific term
import {
  Card,
  Flex,
  Heading,
  Text,
  Table,
  Badge,
  Button,
  Grid,
  Progress,
  Select,
  Box
} from '@radix-ui/themes';
import { PieChart, Pie, Cell } from 'recharts';
import { useState } from 'react';

const solutionOptions = [
  'Negotiating better prices with supplier',
  'Reducing waste in material usage',
  'Automation to reduce manual labor costs',
  'Optimizing machine usage',
  'Improving inventory management',
  'Minimize transportation costs',
  'Reduce rework costs',
  'Other'
];

const initialCostData = [
  { category: 'Raw Materials', actual: 1200000, target: 1100000, percent: 40, color: '#3b82f6' },
  { category: 'Direct Labor', actual: 600000, target: 580000, percent: 20, color: '#10b981' },
  { category: 'Packaging Materials', actual: 450000, target: 420000, percent: 15, color: '#f59e0b' },
  { category: 'Overhead', actual: 300000, target: 280000, percent: 15, color: '#a855f7' },
  { category: 'Other Costs', actual: 200000, target: 190000, percent: 10, color: '#f97316' }
];

const currencySymbols: { [key: string]: string } = {
  USD: '$',
  EGP: 'ج.م'
};

const CostAnalysis = () => {
  const [costData, setCostData] = useState(initialCostData);
  const [solutions, setSolutions] = useState(Array(costData.length).fill(''));
  const [currency, setCurrency] = useState<'USD' | 'EGP'>('USD');

  const symbol = currencySymbols[currency];

  const handleSolutionChange = (index: number, newSolution: string) => {
    const updatedSolutions = [...solutions];
    updatedSolutions[index] = newSolution;
    setSolutions(updatedSolutions);
  };

  const totalActual = costData.reduce((acc, item) => acc + item.actual, 0);
  const totalTarget = costData.reduce((acc, item) => acc + item.target, 0);
  const totalAfter = costData.reduce((acc, item) => acc + (item.actual - 10000), 0); // placeholder savings

  return (
    <Box p="6">
      <Flex justify="between" align="center" mb="5">
        <Heading size="6">Cost Analysis</Heading>
        <Flex gap="3">
          <Button variant="soft">{symbol} Export Report</Button>
          <Select.Root value={currency} onValueChange={(val) => setCurrency(val as 'USD' | 'EGP')}>
            <Select.Trigger />
            <Select.Content>
              <Select.Item value="USD">USD</Select.Item>
              <Select.Item value="EGP">EGP</Select.Item>
            </Select.Content>
          </Select.Root>
        </Flex>
      </Flex>

      <Grid columns="4" gap="4" mb="5">
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">Total Actual Cost</Text>
            <Heading size="7">{symbol}{(totalActual / 1000000).toFixed(2)}M</Heading>
            <Text size="1" color="gray">Based on current numbers</Text>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">Target Cost</Text>
            <Heading size="7">{symbol}{(totalTarget / 1000000).toFixed(2)}M</Heading>
            <Text size="1" color="gray">Ideal goal</Text>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">Post-Optimization Estimate</Text>
            <Heading size="7">{symbol}{(totalAfter / 1000000).toFixed(2)}M</Heading>
            <Text size="1" color="green">Estimated savings included</Text>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">Progress to Target</Text>
            <Progress value={(totalTarget / totalActual) * 100} />
            <Text size="1">{((totalTarget / totalActual) * 100).toFixed(1)}% toward target</Text>
          </Flex>
        </Card>
      </Grid>

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Cost Category</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actual</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Target</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Variance</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>% of Total</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Solution</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Cost After</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell colSpan={7}><strong>Direct Cost</strong></Table.Cell>
          </Table.Row>
          {costData.map((item, index) => (
            <Table.Row key={item.category}>
              <Table.Cell>{item.category}</Table.Cell>
              <Table.Cell>{symbol}{(item.actual / 1000).toFixed(0)}K</Table.Cell>
              <Table.Cell>{symbol}{(item.target / 1000).toFixed(0)}K</Table.Cell>
              <Table.Cell>{(((item.actual - item.target) / item.target) * 100).toFixed(1)}%</Table.Cell>
              <Table.Cell>{item.percent}%</Table.Cell>
              <Table.Cell>
                <Select.Root
                  value={solutions[index]}
                  onValueChange={(value) => handleSolutionChange(index, value)}
                >
                  <Select.Trigger placeholder="Choose..." />
                  <Select.Content>
                    {solutionOptions.map((option, i) => (
                      <Select.Item key={i} value={option}>{option}</Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </Table.Cell>
              <Table.Cell>{symbol}{((item.actual - 10000) / 1000).toFixed(0)}K</Table.Cell>
            </Table.Row>
          ))}
          <Table.Row>
            <Table.Cell colSpan={7}><strong>Overhead</strong></Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell colSpan={7}><strong>Other Costs</strong></Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell><strong>Total</strong></Table.Cell>
            <Table.Cell><strong>{symbol}{(totalActual / 1000).toFixed(0)}K</strong></Table.Cell>
            <Table.Cell><strong>{symbol}{(totalTarget / 1000).toFixed(0)}K</strong></Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell><strong>100%</strong></Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell><strong>{symbol}{(totalAfter / 1000).toFixed(0)}K</strong></Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

export default CostAnalysis;
