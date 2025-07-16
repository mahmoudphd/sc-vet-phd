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
} from '@radix-ui/themes';

import * as Accordion from '@radix-ui/react-accordion';
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
  'Other',
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
  { name: 'Water', kg: 0.571, pricePerKg: 1 },
];

const costDataInitial = [
  {
    category: 'Raw Materials',
    actual: 133.11,
    target: 1100000,
    percent: 40,
    gapSolution: solutionOptions[0],
    costAfter: -9866.89,
  },
  {
    category: 'Direct Labor',
    actual: 600000,
    target: 580000,
    percent: 20,
    gapSolution: solutionOptions[1],
    costAfter: 590000,
  },
  {
    category: 'Packaging Materials',
    actual: 450000,
    target: 420000,
    percent: 15,
    gapSolution: solutionOptions[2],
    costAfter: 440000,
  },
  {
    category: 'Overhead',
    actual: 300000,
    target: 280000,
    percent: 15,
    gapSolution: solutionOptions[3],
    costAfter: 290000,
  },
  {
    category: 'Other Costs',
    actual: 200000,
    target: 190000,
    percent: 10,
    gapSolution: solutionOptions[4],
    costAfter: 190000,
  },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA00FF'];

const CostAnalysis = () => {
  const [costData, setCostData] = useState(costDataInitial);
  const [currency, setCurrency] = useState<'EGP' | 'USD'>('EGP');

  // تحويلات بسيطة للأسعار بين العملتين (مثال)
  const conversionRates = {
    EGP: 1,
    USD: 0.032, // مثال: 1 EGP = 0.032 USD
  };

  // حساب المجاميع مع التحويل حسب العملة المختارة
  const totalActual =
    costData.reduce((acc, item) => acc + Number(item.actual), 0) *
    conversionRates[currency];
  const totalTarget =
    costData.reduce((acc, item) => acc + Number(item.target), 0) *
    conversionRates[currency];
  const totalCostAfter =
    costData.reduce((acc, item) => acc + Number(item.costAfter), 0) *
    conversionRates[currency];
  const totalVariance = totalActual - totalTarget;

  const unitsProduced = 10000;

  const costPerUnitActual = totalActual / unitsProduced;
  const benchmarkPrice = totalTarget / unitsProduced;
  const costPerUnitAfter = totalCostAfter / unitsProduced;

  const formatCurrency = (val: number) =>
    `${currency} ${val.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const handleGapSolutionChange = (index: number, newValue: string) => {
    setCostData((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, gapSolution: newValue } : item
      )
    );
  };

  // Raw Materials Accordion
  const renderRawMaterialsAccordion = () => (
    <Accordion.Root type="single" collapsible defaultValue="raw-materials">
      <Accordion.Item value="raw-materials">
        <Accordion.Trigger
          style={{
            cursor: 'pointer',
            fontWeight: 'bold',
            marginBottom: 8,
          }}
        >
          Raw Materials Breakdown
        </Accordion.Trigger>
        <Accordion.Content>
          <Table.Root variant="surface" style={{ marginBottom: 20 }}>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Concentration (kg)</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Price/Kg ({currency})</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Cost ({currency})</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {rawMaterialItems.map((item, index) => {
                const pricePerKg = item.pricePerKg * conversionRates[currency];
                const cost = item.kg * pricePerKg;
                return (
                  <Table.Row key={index}>
                    <Table.Cell>{item.name}</Table.Cell>
                    <Table.Cell>{item.kg}</Table.Cell>
                    <Table.Cell>{formatCurrency(pricePerKg)}</Table.Cell>
                    <Table.Cell>{formatCurrency(cost)}</Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table.Root>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );

  // بيانات شارت الدونات لعرض Actual Cost لكل بند
  const pieData = costData.map((item) => ({
    name: item.category,
    value: Number(item.actual) * conversionRates[currency],
  }));

  // بيانات شارت الأعمدة للـ Target vs After
  const barData = costData.map((item) => ({
    category: item.category,
    Target: Number(item.target) * conversionRates[currency],
    After: Number(item.costAfter) * conversionRates[currency],
  }));

  return (
    <Box p="6" style={{ maxWidth: 960, margin: 'auto' }}>
      <Heading size="6" mb="6">
        Inter-Organizational Cost Management
      </Heading>

      {/* عملة الاختيار */}
      <Flex justify="end" mb="6">
        <Select.Root
          value={currency}
          onValueChange={(val: string) => setCurrency(val as 'EGP' | 'USD')}
        >
          <Select.Trigger aria-label="Select Currency" />
          <Select.Content>
            <Select.Item value="EGP">EGP</Select.Item>
            <Select.Item value="USD">USD</Select.Item>
          </Select.Content>
        </Select.Root>
      </Flex>

      {/* Summary cards */}
      <Grid columns="4" gap="4" mb="6">
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">Total Actual Cost</Text>
            <Heading size="7">{formatCurrency(totalActual)}</Heading>
            <Text size="1">Based On Current Numbers</Text>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">Target Cost</Text>
            <Heading size="7">{formatCurrency(totalTarget)}</Heading>
            <Text size="1">Ideal Goal</Text>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">Post-Optimization Estimate</Text>
            <Heading size="7">{formatCurrency(totalCostAfter)}</Heading>
            <Text size="1">Estimated Savings Included</Text>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">Progress to Target</Text>
            <Progress value={(totalActual / totalTarget) * 100} />
            <Text size="1">{((totalActual / totalTarget) * 100).toFixed(1)}% Toward Target</Text>
          </Flex>
        </Card>
      </Grid>

      {/* Cost Per Unit and Benchmark Price */}
      <Card mb="6">
        <Flex direction="column" gap="2">
          <Text size="2">Cost Per Unit</Text>
          <Heading size="5">{formatCurrency(costPerUnitActual)}</Heading>
          <Text size="2" mt="2">
            Benchmark Price
          </Text>
          <Heading size="5">{formatCurrency(benchmarkPrice)}</Heading>
          <Text size="2" mt="2">
            Cost Per Unit After Optimization
          </Text>
          <Heading size="5">{formatCurrency(costPerUnitAfter)}</Heading>
        </Flex>
      </Card>

      {/* Charts */}
      <Flex justify="between" align="center" mb="6" wrap="wrap" gap={20}>
        <PieChart width={280} height={280}>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            outerRadius={100}
            dataKey="value"
            label={(entry) =>
              `${entry.name}: ${formatCurrency(entry.value)}`
            }
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>

        <BarChart width={400} height={280} data={barData} margin={{ left: 20 }}>
          <Bar dataKey="Target" fill="#8884d8" />
          <Bar dataKey="After" fill="#82ca9d" />
        </BarChart>
      </Flex>

      {/* Accordion for Raw Materials */}
      {renderRawMaterialsAccordion()}

      {/* Detailed Cost Breakdown Table */}
      <Card mt="6" style={{ overflowX: 'auto' }}>
        <Heading size="4" mb="3">
          Detailed Cost Breakdown
        </Heading>
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
            {costData.map((item, index) => (
              <Table.Row key={index}>
                <Table.Cell>{item.category}</Table.Cell>
                <Table.Cell>{formatCurrency(Number(item.actual))}</Table.Cell>
                <Table.Cell>{formatCurrency(Number(item.target))}</Table.Cell>
                <Table.Cell>
                  {formatCurrency(Number(item.actual) - Number(item.target))}
                </Table.Cell>
                <Table.Cell>{item.percent}%</Table.Cell>
                <Table.Cell>
                  <Select.Root
                    value={item.gapSolution}
                    onValueChange={(val: string) => handleGapSolutionChange(index, val)}
                  >
                    <Select.Trigger aria-label="Select Gap Solution" />
                    <Select.Content>
                      {solutionOptions.map((option, i) => (
                        <Select.Item key={i} value={option}>
                          {option}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </Table.Cell>
                <Table.Cell>{formatCurrency(Number(item.costAfter))}</Table.Cell>
              </Table.Row>
            ))}

            <Table.Row>
              <Table.Cell>
                <strong>Total</strong>
              </Table.Cell>
              <Table.Cell>{formatCurrency(totalActual)}</Table.Cell>
              <Table.Cell>{formatCurrency(totalTarget)}</Table.Cell>
              <Table.Cell>{formatCurrency(totalVariance)}</Table.Cell>
              <Table.Cell>100%</Table.Cell>
              <Table.Cell>-</Table.Cell>
              <Table.Cell>{formatCurrency(totalCostAfter)}</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </Card>
    </Box>
  );
};

export default CostAnalysis;
