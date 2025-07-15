// Updated CostAnalysis.tsx with Accordion support and full cost breakdown
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

const renderRawMaterialsAccordion = () => (
  <Accordion.Root type="single" collapsible>
    <Accordion.Item value="raw-materials">
      <Accordion.Trigger>Raw Materials Breakdown</Accordion.Trigger>
      <Accordion.Content>
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
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
                <Table.Cell>EGP{item.pricePerKg.toFixed(2)}</Table.Cell>
                <Table.Cell>EGP{(item.kg * item.pricePerKg).toFixed(2)}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Accordion.Content>
    </Accordion.Item>
  </Accordion.Root>
);

const renderCostBreakdownTable = () => {
  const data = [
    ['Raw Materials', 133.11, 1100000, -1099866.89, '40%', solutionOptions[0], -9866.89],
    ['Direct Labor', 600000, 580000, 20000, '20%', solutionOptions[1], 590000],
    ['Packaging Materials', 450000, 420000, 30000, '15%', solutionOptions[2], 440000],
    ['Overhead', 300000, 280000, 20000, '15%', solutionOptions[3], 290000],
    ['Other Costs', 200000, 190000, 10000, '10%', solutionOptions[4], 190000]
  ];
  const totalActual = data.reduce((acc, val) => acc + val[1], 0);
  const totalTarget = data.reduce((acc, val) => acc + val[2], 0);
  const totalAfter = data.reduce((acc, val) => acc + val[6], 0);
  const totalVariance = totalActual - totalTarget;

  return (
    <Card mt="5">
      <Heading size="4" mb="3">Detailed Cost Breakdown</Heading>
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Cost Category</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actual</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Target</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Variance</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>% Of Total</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Gap Solution</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Cost After</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.map((row, i) => (
            <Table.Row key={i}>
              {row.map((val, j) => (
                <Table.Cell key={j}>{typeof val === 'number' ? `EGP${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : val}</Table.Cell>
              ))}
            </Table.Row>
          ))}
          <Table.Row>
            <Table.Cell><strong>Total</strong></Table.Cell>
            <Table.Cell>EGP{totalActual.toLocaleString()}</Table.Cell>
            <Table.Cell>EGP{totalTarget.toLocaleString()}</Table.Cell>
            <Table.Cell>EGP{totalVariance.toLocaleString()}</Table.Cell>
            <Table.Cell>100%</Table.Cell>
            <Table.Cell>-</Table.Cell>
            <Table.Cell>EGP{totalAfter.toLocaleString()}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
    </Card>
  );
};

const CostAnalysis = () => {
  return (
    <Box p="6">
      <Heading size="6" mb="4">Inter-Organizational Cost Management</Heading>
      {renderRawMaterialsAccordion()}
      {renderCostBreakdownTable()}
    </Box>
  );
};

export default CostAnalysis;
