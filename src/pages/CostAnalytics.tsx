// src/pages/CostAnalytics.tsx

import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  Flex,
  Grid,
  Heading,
  Progress,
  Select,
  Table,
  Text,
  TextField
} from '@radix-ui/themes';
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

import {
  simulatedIoTCostData,
  Item,
  CostCategory
} from './simulateIoTCostData';

const formatCurrency = (value: number, currency: string) =>
  `${currency} ${value.toFixed(2)}`;

const categories: CostCategory[] = [
  'Direct Materials',
  'Packaging Materials',
  'Direct Labor',
  'Overhead',
  'Other Costs'
];

const getDetailsByCategory = (category: CostCategory): Item[] => {
  switch (category) {
    case 'Direct Materials':
      return simulatedIoTCostData.rawMaterials;
    case 'Packaging Materials':
      return simulatedIoTCostData.packagingMaterials;
    case 'Direct Labor':
      return simulatedIoTCostData.directLabor;
    case 'Overhead':
      return simulatedIoTCostData.overheadItems;
    case 'Other Costs':
      return simulatedIoTCostData.otherCosts;
    default:
      return [];
  }
};

export default function CostAnalytics() {
  const [dialogCategory, setDialogCategory] = useState<CostCategory | null>(null);
  const [benchmarkPrice, setBenchmarkPrice] = useState(220);
  const [profitMargin, setProfitMargin] = useState(25);
  const [currency, setCurrency] = useState<'EGP' | 'USD'>('EGP');
  const [detailsData, setDetailsData] = useState<Item[]>([]);
  const [isManual, setIsManual] = useState(false);

  const totals = simulatedIoTCostData.totals;

  // Compute totals
  const totalActual = categories.reduce(
    (sum, category) => sum + totals[category].actual,
    0
  );
  const totalBudget = categories.reduce(
    (sum, category) => sum + totals[category].budget,
    0
  );
  const totalCostAfter = categories.reduce(
    (sum, category) => sum + totals[category].costAfter,
    0
  );

  // Target cost calculation
  const targetCost = benchmarkPrice * (1 - profitMargin / 100);

  // Benchmark trend data for line chart
  const benchmarkTrendData = [
    { month: 'Jan', actual: 169.61, benchmark: benchmarkPrice },
    { month: 'Feb', actual: 170.5, benchmark: benchmarkPrice },
    { month: 'Mar', actual: 168.0, benchmark: benchmarkPrice },
    { month: 'Apr', actual: 171.2, benchmark: benchmarkPrice },
    { month: 'May', actual: totalActual, benchmark: benchmarkPrice }
  ].map((d) => ({
    ...d,
    targetCost,
    gap: d.actual - targetCost
  }));

  const pieColors = ['#3b82f6', '#f59e0b', '#ef4444'];

  // When dialog opens, load details data for category
  const openDialog = (category: CostCategory) => {
    setDialogCategory(category);
    setDetailsData(getDetailsByCategory(category));
    setIsManual(false); // default mode manual off
  };

  // Handle detail changes in dialog table
  const handleDetailChange = (
    index: number,
    field: keyof Omit<Item, 'name' | 'cost'>,
    value: string
  ) => {
    const parsedValue = parseFloat(value);
    if (isNaN(parsedValue)) return;

    setDetailsData((prev) => {
      const newData = [...prev];
      newData[index] = {
        ...newData[index],
        [field]: parsedValue,
        cost:
          field === 'qty'
            ? parsedValue * newData[index].unitPrice
            : newData[index].qty * parsedValue
      };
      return newData;
    });
  };

  // Submit updated details - this is a stub, implement saving logic as needed
  const handleSubmitDetails = () => {
    // Here you can integrate updated details into your main data or backend
    setDialogCategory(null);
  };

  return (
    <Box p="4" style={{ maxWidth: 1200, margin: 'auto' }}>
      <Flex justify="between" align="center" mb="4">
        <Heading>Inter-Organizational Cost Management</Heading>
        <Flex gap="3" align="center">
          <Select
            defaultValue={currency}
            onValueChange={(value: string) =>
              setCurrency(value === 'USD' ? 'USD' : 'EGP')
            }
          >
            <Select.Trigger />
            <Select.Content>
              <Select.Item value="EGP">EGP</Select.Item>
              <Select.Item value="USD">USD</Select.Item>
            </Select.Content>
          </Select>
          <Button>Export Report</Button>
        </Flex>
      </Flex>

      <Grid columns={3} gap="4" mb="4">
        <Box>
          <Text size="2">Actual Cost</Text>
          <Heading size="6">{formatCurrency(totalActual, currency)}</Heading>
        </Box>
        <Box>
          <Text size="2">Budgeted Cost</Text>
          <Heading size="6">{formatCurrency(totalBudget, currency)}</Heading>
        </Box>
        <Box>
          <Text size="2">Cost After Optimization</Text>
          <Heading size="6">{formatCurrency(totalCostAfter, currency)}</Heading>
        </Box>
        <Box>
          <Text size="2">Benchmark Price</Text>
          <TextField
            type="number"
            value={benchmarkPrice}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setBenchmarkPrice(parseFloat(e.target.value))
            }
          />
        </Box>
        <Box>
          <Text size="2">Profit Margin (%)</Text>
          <TextField
            type="number"
            value={profitMargin}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setProfitMargin(parseFloat(e.target.value))
            }
          />
        </Box>
        <Box>
          <Text size="2">Progress to Target</Text>
          <Progress value={(targetCost / totalActual) * 100}>
            <Text>{Math.round((targetCost / totalActual) * 100)}%</Text>
          </Progress>
        </Box>
      </Grid>

      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Category</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actual</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Budget</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Cost After Optimization</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>View Details</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {categories.map((category) => (
            <Table.Row key={category}>
              <Table.RowHeaderCell>{category}</Table.RowHeaderCell>
              <Table.Cell>{formatCurrency(totals[category].actual, currency)}</Table.Cell>
              <Table.Cell>{formatCurrency(totals[category].budget, currency)}</Table.Cell>
              <Table.Cell>{formatCurrency(totals[category].costAfter, currency)}</Table.Cell>
              <Table.Cell>
                <Button onClick={() => openDialog(category)}>View Details</Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <Box mt="6" style={{ height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={[
                {
                  name: 'Direct Cost',
                  value:
                    totals['Direct Materials'].actual +
                    totals['Packaging Materials'].actual +
                    totals['Direct Labor'].actual
                },
                { name: 'Overhead', value: totals['Overhead'].actual },
                { name: 'Other Costs', value: totals['Other Costs'].actual }
              ]}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              <Cell fill={pieColors[0]} />
              <Cell fill={pieColors[1]} />
              <Cell fill={pieColors[2]} />
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Box>

      <Box mt="6" style={{ height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={benchmarkTrendData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="actual" stroke="#3b82f6" name="Actual Cost" />
            <Line type="monotone" dataKey="benchmark" stroke="#f59e0b" name="Benchmark Price" />
            <Line type="monotone" dataKey="targetCost" stroke="#ef4444" name="Target Cost" />
          </LineChart>
        </ResponsiveContainer>
      </Box>

      {/* Dialog for details */}
      {dialogCategory && (
        <Dialog.Root open onOpenChange={() => setDialogCategory(null)}>
          <Dialog.Content maxWidth="700px" p="4">
            <Dialog.Title>{dialogCategory} Breakdown</Dialog.Title>

            <Flex align="center" gap="4" mb="3">
              <Button
                variant={isManual ? 'solid' : 'outline'}
                onClick={() => setIsManual(true)}
              >
                Manual
              </Button>
              <Button
                variant={!isManual ? 'solid' : 'outline'}
                onClick={() => setIsManual(false)}
              >
                Auto
              </Button>
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
                {detailsData.map((item, index) => (
                  <Table.Row key={index}>
                    <Table.RowHeaderCell>{item.name}</Table.RowHeaderCell>
                    <Table.Cell>
                      {isManual ? (
                        <TextField
                          type="number"
                          value={item.qty}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleDetailChange(index, 'qty', e.target.value)
                          }
                        />
                      ) : (
                        item.qty
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      {isManual ? (
                        <TextField
                          type="number"
                          value={item.unitPrice}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleDetailChange(index, 'unitPrice', e.target.value)
                          }
                        />
                      ) : (
                        formatCurrency(item.unitPrice, currency)
                      )}
                    </Table.Cell>
                    <Table.Cell>{formatCurrency(item.cost, currency)}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>

            <Flex justify="end" mt="4" gap="3">
              <Button onClick={() => setDialogCategory(null)}>Cancel</Button>
              {isManual && (
                <Button onClick={handleSubmitDetails} variant="solid">
                  Submit
                </Button>
              )}
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      )}
    </Box>
  );
}
