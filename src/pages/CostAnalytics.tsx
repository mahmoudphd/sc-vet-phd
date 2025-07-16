import {
  Card,
  Flex,
  Heading,
  Text,
  Table,
  Grid,
  Progress,
  Select,
  Box
} from '@radix-ui/themes';
import * as Accordion from '@radix-ui/react-accordion';
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

const initialData = [
  {
    category: 'Raw Materials',
    actual: 133.11,
    target: 1100000,
    percent: '40%',
    solution: solutionOptions[0],
    costAfter: -9866.89
  },
  {
    category: 'Direct Labor',
    actual: 600000,
    target: 580000,
    percent: '20%',
    solution: solutionOptions[1],
    costAfter: 590000
  },
  {
    category: 'Packaging Materials',
    actual: 450000,
    target: 420000,
    percent: '15%',
    solution: solutionOptions[2],
    costAfter: 440000
  },
  {
    category: 'Overhead',
    actual: 300000,
    target: 280000,
    percent: '15%',
    solution: solutionOptions[3],
    costAfter: 290000
  },
  {
    category: 'Other Costs',
    actual: 200000,
    target: 190000,
    percent: '10%',
    solution: solutionOptions[4],
    costAfter: 190000
  }
];

const CostAnalysis = () => {
  const [rows, setRows] = useState(initialData);

  const handleSolutionChange = (index: number, newVal: string) => {
    const updated = [...rows];
    updated[index].solution = newVal;
    setRows(updated);
  };

  const formatEGP = (val: number) =>
    `EGP${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const totalActual = rows.reduce((sum, r) => sum + r.actual, 0);
  const totalTarget = rows.reduce((sum, r) => sum + r.target, 0);
  const totalAfter = rows.reduce((sum, r) => sum + r.costAfter, 0);
  const totalVariance = totalActual - totalTarget;

  const renderAccordion = () => (
    <Accordion.Root type="single" collapsible defaultValue="materials">
      <Accordion.Item value="materials">
        <Accordion.Trigger>Raw Materials Breakdown</Accordion.Trigger>
        <Accordion.Content>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Kg</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Price/Kg</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Cost</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {rawMaterialItems.map((item, idx) => (
                <Table.Row key={idx}>
                  <Table.Cell>{item.name}</Table.Cell>
                  <Table.Cell>{item.kg}</Table.Cell>
                  <Table.Cell>{formatEGP(item.pricePerKg)}</Table.Cell>
                  <Table.Cell>{formatEGP(item.kg * item.pricePerKg)}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );

  return (
    <Box p="6">
      <Heading size="6" mb="4">Inter-Organizational Cost Management</Heading>

      {/* Accordion */}
      {renderAccordion()}

      {/* Table */}
      <Card mt="5">
        <Heading size="4" mb="3">Detailed Cost Breakdown</Heading>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Category</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Actual</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Target</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Variance</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>%</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Gap Solution</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Cost After</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {rows.map((row, i) => (
              <Table.Row key={i}>
                <Table.Cell>{row.category}</Table.Cell>
                <Table.Cell>{formatEGP(row.actual)}</Table.Cell>
                <Table.Cell>{formatEGP(row.target)}</Table.Cell>
                <Table.Cell>{formatEGP(row.actual - row.target)}</Table.Cell>
                <Table.Cell>{row.percent}</Table.Cell>
                <Table.Cell>
                  <Select.Root value={row.solution} onValueChange={(val) => handleSolutionChange(i, val)}>
                    <Select.Trigger />
                    <Select.Content>
                      {solutionOptions.map((option, idx) => (
                        <Select.Item key={idx} value={option}>
                          {option}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </Table.Cell>
                <Table.Cell>{formatEGP(row.costAfter)}</Table.Cell>
              </Table.Row>
            ))}
            <Table.Row>
              <Table.Cell><strong>Total</strong></Table.Cell>
              <Table.Cell>{formatEGP(totalActual)}</Table.Cell>
              <Table.Cell>{formatEGP(totalTarget)}</Table.Cell>
              <Table.Cell>{formatEGP(totalVariance)}</Table.Cell>
              <Table.Cell>100%</Table.Cell>
              <Table.Cell>-</Table.Cell>
              <Table.Cell>{formatEGP(totalAfter)}</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </Card>
    </Box>
  );
};

export default CostAnalysis;
