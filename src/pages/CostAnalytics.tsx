import {
  Flex,
  Heading,
  Text,
  Table,
  Button,
  Grid,
  Progress,
  Select,
  Box,
  Card
} from '@radix-ui/themes';
import { PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
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

const currencySymbols: Record<string, string> = {
  USD: '$',
  EGP: 'EGP'
};

const CostAnalysis = () => {
  const [currency, setCurrency] = useState<string>('EGP');
  const [selectedSolutions, setSelectedSolutions] = useState<string[]>([]);

  const symbol = currencySymbols[currency];

  const costData = [
    {
      category: 'Direct Cost',
      isGroupHeader: true
    },
    {
      category: 'Raw Materials',
      actual: 133.11,
      target: 1100000,
      color: '#3b82f6'
    },
    {
      category: 'Direct Labor',
      actual: 300000,
      target: 250000,
      color: '#10b981'
    },
    {
      category: 'Packaging Materials',
      actual: 50000,
      target: 60000,
      color: '#6366f1'
    },
    {
      category: 'Overhead',
      actual: 150000,
      target: 140000,
      color: '#f59e0b'
    },
    {
      category: 'Other Costs',
      actual: 200000,
      target: 190000,
      color: '#f97316'
    }
  ];

  if (selectedSolutions.length !== costData.length) {
    setSelectedSolutions(Array(costData.length).fill(''));
  }

  const totalActual = costData.filter(i => !i.isGroupHeader).reduce((acc, item) => acc + (item.actual || 0), 0);
  const totalTarget = costData.filter(i => !i.isGroupHeader).reduce((acc, item) => acc + (item.target || 0), 0);
  const totalAfter = costData.filter(i => !i.isGroupHeader).reduce((acc, item) => acc + ((item.actual || 0) - 10000), 0);
  const unitsProduced = 10000;

  const costPerUnit = {
    actual: totalActual / unitsProduced,
    target: totalTarget / unitsProduced,
    after: totalAfter / unitsProduced
  };

  const formatCurrency = (val: number) =>
    `${symbol}${val.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;

  return (
    <Box p="6">
      <Heading size="6" mb="4">Detailed Cost Table</Heading>
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
            if (item.isGroupHeader) {
              return (
                <Table.Row key={index}>
                  <Table.Cell colSpan={7}>
                    <Text weight="bold" color="gray">{item.category}</Text>
                  </Table.Cell>
                </Table.Row>
              );
            }

            const actual = item.actual || 0;
            const target = item.target || 0;
            const variance = actual - target;
            const percent = ((actual / totalActual) * 100).toFixed(2);
            const costAfter = actual - 10000;

            return (
              <Table.Row key={index}>
                <Table.Cell><strong>{item.category}</strong></Table.Cell>
                <Table.Cell>{formatCurrency(actual)}</Table.Cell>
                <Table.Cell>{formatCurrency(target)}</Table.Cell>
                <Table.Cell>{formatCurrency(variance)}</Table.Cell>
                <Table.Cell>{percent}%</Table.Cell>
                <Table.Cell>
                  <Select.Root
                    value={selectedSolutions[index]}
                    onValueChange={(val) => {
                      const updated = [...selectedSolutions];
                      updated[index] = val;
                      setSelectedSolutions(updated);
                    }}
                  >
                    <Select.Trigger placeholder="Choose Solution" />
                    <Select.Content>
                      {solutionOptions.map((option, i) => (
                        <Select.Item key={i} value={option}>
                          {option}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </Table.Cell>
                <Table.Cell>{formatCurrency(costAfter)}</Table.Cell>
              </Table.Row>
            );
          })}

          <Table.Row>
            <Table.Cell><strong>Total</strong></Table.Cell>
            <Table.Cell>{formatCurrency(totalActual)}</Table.Cell>
            <Table.Cell>{formatCurrency(totalTarget)}</Table.Cell>
            <Table.Cell>{formatCurrency(totalActual - totalTarget)}</Table.Cell>
            <Table.Cell>100%</Table.Cell>
            <Table.Cell>-</Table.Cell>
            <Table.Cell>{formatCurrency(totalAfter)}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

export default CostAnalysis;
