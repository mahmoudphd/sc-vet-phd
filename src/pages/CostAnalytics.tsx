// Updated CostAnalysis.tsx with benchmark section, renamed column, collapsible raw materials
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
  Accordion
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

const rawMaterialItems = [
  { name: 'Vitamin B1', kg: 0.001, pricePerKg: 540 },
  { name: 'Vitamin B2', kg: 0.006, pricePerKg: 600 },
  { name: 'Vitamin B12', kg: 0.001, pricePerKg: 2300 },
  { name: 'Nicotinamide (Vitamin B3)', kg: 0.01, pricePerKg: 400 },
  { name: 'Pantothenic Acid', kg: 0.004, pricePerKg: 1700 },
  { name: 'Vitamin B6', kg: 0.0015, pricePerKg: 900 },
  { name: 'Leucine', kg: 0.03, pricePerKg: 200 },
  { name: 'Threonine', kg: 0.01, pricePerKg: 950 },
  { name: 'Taurine', kg: 0.0025, pricePerKg: 3000 },
  { name: 'Glycine', kg: 0.0025, pricePerKg: 4200 },
  { name: 'Arginine', kg: 0.0025, pricePerKg: 5000 },
  { name: 'Cynarin', kg: 0.0025, pricePerKg: 3900 },
  { name: 'Silymarin', kg: 0.025, pricePerKg: 700 },
  { name: 'Sorbitol', kg: 0.01, pricePerKg: 360 },
  { name: 'Carnitine', kg: 0.005, pricePerKg: 1070 },
  { name: 'Betaine', kg: 0.02, pricePerKg: 1250 },
  { name: 'Tween-80', kg: 0.075, pricePerKg: 90 },
  { name: 'Water', kg: 0.571, pricePerKg: 1 }
];

const CostAnalysis = () => {
  const totalRawMaterialCost = rawMaterialItems.reduce((acc, item) => acc + item.kg * item.pricePerKg, 0);
  const totalActual = 1550133.11;
  const totalTarget = 2570000;
  const totalAfter = 1500133.11;
  const costPerUnit = totalActual / 10000;
  const benchmarkPrice = 257;
  const symbol = 'EGP';

  const format = (val: number) => `${symbol}${val.toFixed(2)}`;

  return (
    <Box p="6">
      <Heading size="6" mb="4">Inter-Organizational Cost Management</Heading>

      <Grid columns="4" gap="4" mb="5">
        <Card><Text size="2">Total Actual Cost</Text><Heading size="7">{format(totalActual)}</Heading><Text size="1">Based On Current Numbers</Text></Card>
        <Card><Text size="2">Target Cost</Text><Heading size="7">{format(totalTarget)}</Heading><Text size="1">Ideal Goal</Text></Card>
        <Card><Text size="2">Post-Optimization Estimate</Text><Heading size="7">{format(totalAfter)}</Heading><Text size="1">Estimated Savings Included</Text></Card>
        <Card><Text size="2">Progress To Target</Text><Progress value={93.5} /><Text size="1">93.5% Toward Target</Text></Card>
      </Grid>

      <Card mb="4">
        <Flex justify="between" align="center">
          <Text size="2">Cost Per Unit</Text>
          <Text size="3">{format(costPerUnit)}</Text>
        </Flex>
      </Card>

      <Card mb="4">
        <Flex justify="between" align="center">
          <Text size="2">Benchmark Price</Text>
          <Text size="3">{format(benchmarkPrice)}</Text>
        </Flex>
      </Card>

      <Card>
        <Heading size="4" mb="3">Detailed Cost Table</Heading>
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Cost Category</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Actual</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Target</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Variance</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>% of Total</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Gap Solution</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Cost After</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell><strong>Raw Materials</strong></Table.Cell>
              <Table.Cell>{format(totalRawMaterialCost)}</Table.Cell>
              <Table.Cell>{format(1100000)}</Table.Cell>
              <Table.Cell>{format(totalRawMaterialCost - 1100000)}</Table.Cell>
              <Table.Cell>40%</Table.Cell>
              <Table.Cell>
                <Select.Root defaultValue="Negotiating Better Prices With Supplier">
                  <Select.Trigger />
                  <Select.Content>
                    {solutionOptions.map((s, i) => <Select.Item key={i} value={s}>{s}</Select.Item>)}
                  </Select.Content>
                </Select.Root>
              </Table.Cell>
              <Table.Cell>{format(totalRawMaterialCost - 10000)}</Table.Cell>
            </Table.Row>

            <Table.Row>
              <Table.Cell colSpan={7}>
                <Accordion.Root type="single" collapsible>
                  <Accordion.Item value="materials">
                    <Accordion.Header>
                      <Accordion.Trigger>Show Raw Material Breakdown</Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Content>
                      <Table.Root>
                        <Table.Header>
                          <Table.Row>
                            <Table.ColumnHeaderCell>Material</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Concentration (kg)</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Price/Kg</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Cost</Table.ColumnHeaderCell>
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          {rawMaterialItems.map((item, index) => (
                            <Table.Row key={index}>
                              <Table.Cell>{item.name}</Table.Cell>
                              <Table.Cell>{item.kg}</Table.Cell>
                              <Table.Cell>{format(item.pricePerKg)}</Table.Cell>
                              <Table.Cell>{format(item.kg * item.pricePerKg)}</Table.Cell>
                            </Table.Row>
                          ))}
                        </Table.Body>
                      </Table.Root>
                    </Accordion.Content>
                  </Accordion.Item>
                </Accordion.Root>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </Card>
    </Box>
  );
};

export default CostAnalysis;
