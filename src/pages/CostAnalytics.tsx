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
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
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

// سعر الصرف بين الدولار والجنيه
const EXCHANGE_RATE = 30; // 1 دولار = 30 جنيه (مثال)

const currencies = [
  { label: 'EGP', symbol: 'EGP' },
  { label: 'USD', symbol: '$' }
];

// بيانات التكلفة الأساسية
const costDataInitial = [
  {
    category: 'Raw Materials',
    actual: 133.11,
    target: 1100000,
    percent: 40,
    gapSolution: solutionOptions[0],
    costAfter: -9866.89
  },
  {
    category: 'Direct Labor',
    actual: 600000,
    target: 580000,
    percent: 20,
    gapSolution: solutionOptions[1],
    costAfter: 590000
  },
  {
    category: 'Packaging Materials',
    actual: 450000,
    target: 420000,
    percent: 15,
    gapSolution: solutionOptions[2],
    costAfter: 440000
  },
  {
    category: 'Overhead',
    actual: 300000,
    target: 280000,
    percent: 15,
    gapSolution: solutionOptions[3],
    costAfter: 290000
  },
  {
    category: 'Other Costs',
    actual: 200000,
    target: 190000,
    percent: 10,
    gapSolution: solutionOptions[4],
    costAfter: 190000
  }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA00FF'];

const CostAnalysis = () => {
  const [costData, setCostData] = useState(costDataInitial);
  const [currency, setCurrency] = useState(currencies[0]); // EGP افتراضيا

  const unitsProduced = 10000;

  // دالة لتحويل العملة حسب الاختيار
  const convert = (val: number) => {
    if (currency.label === 'USD') {
      return val / EXCHANGE_RATE;
    }
    return val;
  };

  // دالة لتنسيق الأرقام مع رمز العملة
  const formatCurrency = (val: number) =>
    `${currency.symbol}${convert(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // حسابات إجمالية
  const totalActual = costData.reduce((acc, item) => acc + Number(item.actual), 0);
  const totalTarget = costData.reduce((acc, item) => acc + Number(item.target), 0);
  const totalCostAfter = costData.reduce((acc, item) => acc + Number(item.costAfter), 0);
  const totalVariance = totalActual - totalTarget;

  const costPerUnitActual = totalActual / unitsProduced;
  const benchmarkPrice = totalTarget / unitsProduced;
  const costPerUnitAfter = totalCostAfter / unitsProduced;

  // تغيير الحل في الجدول
  const handleGapSolutionChange = (index: number, newValue: string) => {
    setCostData(prev =>
      prev.map((item, i) =>
        i === index ? { ...item, gapSolution: newValue } : item
      )
    );
  };

  // بيانات للرسم البياني (PieChart) لنسب التكاليف (بالعملة المختارة)
  const pieData = costData.map(item => ({
    name: item.category,
    value: convert(Number(item.actual))
  }));

  // Accordion للمواد الخام بالتفصيل
  const renderRawMaterialsAccordion = () => (
    <Accordion.Root type="single" collapsible defaultValue="raw-materials">
      <Accordion.Item value="raw-materials">
        <Accordion.Header>
          <Accordion.Trigger
            style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: 8, fontSize: 16 }}
          >
            Raw Materials Breakdown
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          <Table.Root variant="surface" style={{ marginBottom: 16 }}>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Concentration (kg)</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Price/Kg ({currency.symbol})</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Cost ({currency.symbol})</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {rawMaterialItems.map((item, index) => (
                <Table.Row key={index}>
                  <Table.Cell>{item.name}</Table.Cell>
                  <Table.Cell>{item.kg}</Table.Cell>
                  <Table.Cell>{formatCurrency(item.pricePerKg)}</Table.Cell>
                  <Table.Cell>{formatCurrency(item.kg * item.pricePerKg)}</Table.Cell>
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
      {/* اختيار العملة */}
      <Flex justify="space-between" align="center" mb="6">
        <Heading size="6">Inter-Organizational Cost Management</Heading>
        <Select.Root
          value={currency.label}
          onValueChange={(val: string) => {
            const selected = currencies.find(c => c.label === val);
            if (selected) setCurrency(selected);
          }}
        >
          <Select.Trigger aria-label="Select Currency" />
          <Select.Content>
            {currencies.map((c) => (
              <Select.Item key={c.label} value={c.label}>
                {c.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </Flex>

      {/* الملخصات */}
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

      {/* Cost Per Unit و Benchmark Price */}
      <Card mb="6">
        <Flex direction="column" gap="2">
          <Text size="2">Cost Per Unit</Text>
          <Heading size="5">{formatCurrency(costPerUnitActual)}</Heading>
          <Text size="2" mt="2">Benchmark Price</Text>
          <Heading size="5">{formatCurrency(benchmarkPrice)}</Heading>
        </Flex>
      </Card>

      {/* شارت دائري لنسب التكاليف */}
      <Card mb="6" p="4" style={{ maxWidth: 600, margin: 'auto' }}>
        <Heading size="4" mb="4" style={{ textAlign: 'center' }}>Cost Distribution</Heading>
        <PieChart width={400} height={300}>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={(entry) => `${entry.name}: ${entry.value.toFixed(2)}`}
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: any) => formatCurrency(value)} />
          <Legend />
        </PieChart>
      </Card>

      {/* Accordion للمواد الخام */}
      {renderRawMaterialsAccordion()}

      {/* جدول تفصيلي مع اختيار الحلول */}
      <Card mt="6">
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
            {costData.map((item, index) => (
              <Table.Row key={index}>
                <Table.Cell>{item.category}</Table.Cell>
                <Table.Cell>{formatCurrency(Number(item.actual))}</Table.Cell>
                <Table.Cell>{formatCurrency(Number(item.target))}</Table.Cell>
                <Table.Cell>{formatCurrency(Number(item.actual) - Number(item.target))}</Table.Cell>
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
              <Table.Cell><strong>Total</strong></Table.Cell>
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
