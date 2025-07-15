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

const products = {
  'Poultry Product': rawMaterialItems,
  'Liver Tonic': rawMaterialItems.slice(0, 10),
  'Energy Plus': rawMaterialItems.slice(10)
};

const currencySymbols = {
  USD: '$',
  EGP: 'EGP'
};

const CostAnalysis = () => {
  const [currency, setCurrency] = useState('EGP');
  const [selectedProduct, setSelectedProduct] = useState('Poultry Product');

  const symbol = currencySymbols[currency];
  const selectedItems = products[selectedProduct] || [];

  // بيانات التكلفة الرئيسية
  const costData = [
    {
      category: 'Raw Materials',
      actual: selectedItems.reduce((acc, item) => acc + item.kg * item.pricePerKg, 0),
      target: 1100000,
      percent: 40,
      color: '#3b82f6',
      items: selectedItems.map(item => ({ name: item.name, cost: item.kg * item.pricePerKg }))
    },
    { category: 'Direct Labor', actual: 600000, target: 580000, percent: 20, color: '#10b981' },
    { category: 'Packaging Materials', actual: 450000, target: 420000, percent: 15, color: '#f59e0b' },
    { category: 'Overhead', actual: 300000, target: 280000, percent: 15, color: '#a855f7' },
    { category: 'Other Costs', actual: 200000, target: 190000, percent: 10, color: '#f97316' }
  ];

  const totalActual = costData.reduce((acc, item) => acc + item.actual, 0);
  const totalTarget = costData.reduce((acc, item) => acc + item.target, 0);
  // بعد تطبيق حلول مفترضة (مثلاً نقص 10,000 على كل بند)
  const totalAfter = costData.reduce((acc, item) => acc + (item.actual - 10000), 0);
  const unitsProduced = 10000;

  const costPerUnit = {
    actual: totalActual / unitsProduced,
    target: totalTarget / unitsProduced,
    after: totalAfter / unitsProduced
  };

  const formatCurrency = (val) =>
    `${symbol}${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <Box p="6">
      {/* عنوان وتحديد المنتج والعملة */}
      <Flex justify="between" align="center" mb="5">
        <Flex align="center" gap="4">
          <Heading size="6">Inter-Organizational Cost Management</Heading>
          <Select.Root value={selectedProduct} onValueChange={setSelectedProduct}>
            <Select.Trigger />
            <Select.Content>
              {Object.keys(products).map(product => (
                <Select.Item key={product} value={product}>
                  {product}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </Flex>
        <Flex gap="3">
          <Button variant="soft">
            {symbol} Export Report
          </Button>
          <Select.Root value={currency} onValueChange={setCurrency}>
            <Select.Trigger />
            <Select.Content>
              <Select.Item value="USD">USD</Select.Item>
              <Select.Item value="EGP">EGP</Select.Item>
            </Select.Content>
          </Select.Root>
        </Flex>
      </Flex>

      {/* ملخص التكاليف */}
      <Grid columns="4" gap="4" mb="5">
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
            <Heading size="7">{formatCurrency(totalAfter)}</Heading>
            <Text size="1">Estimated Savings Included</Text>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">Progress To Target</Text>
            <Progress value={(totalAfter / totalTarget) * 100} />
            <Text size="1">{((totalAfter / totalTarget) * 100).toFixed(1)}% Toward Target</Text>
          </Flex>
        </Card>
      </Grid>

      {/* تكلفة الوحدة */}
      <Card mb="4">
        <Flex justify="between" align="center">
          <Text size="2">Cost Per Unit</Text>
          <Text size="3">{formatCurrency(costPerUnit.actual)}</Text>
        </Flex>
        <Text size="1">
          Target: {formatCurrency(costPerUnit.target)} | After: {formatCurrency(costPerUnit.after)}
        </Text>
      </Card>

      {/* الرسومات البيانية */}
      <Flex gap="4" mb="5">
        <Card style={{ flex: 1 }}>
          <Heading size="4" mb="3">Cost Composition</Heading>
          <PieChart width={300} height={250}>
            <Pie
              data={costData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="actual"
              nameKey="category"
            >
              {costData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </Card>
        <Card style={{ flex: 1 }}>
          <Heading size="4" mb="3">Cost Trend Analysis</Heading>
          <BarChart width={500} height={250} data={costData}>
            <Bar dataKey="actual" fill="#3b82f6" />
          </BarChart>
        </Card>
      </Flex>

      {/* جدول تفاصيل التكاليف */}
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
          {costData.map((category) => {
            const variance = (((category.actual - category.target) / category.target) * 100).toFixed(1);
            const costAfter = category.actual - 10000; // افتراضياً ناقص 10000 كحل مؤقت
            return (
              <Table.Row key={category.category}>
                <Table.Cell>
                  {category.category === 'Raw Materials' ? (
                    <>
                      <b>{category.category}</b>
                      <Table.Root variant="transparent" style={{ marginTop: '0.5rem' }}>
                        <Table.Body>
                          {category.items.map(item => (
                            <Table.Row key={item.name}>
                              <Table.Cell style={{ paddingLeft: '1.5rem' }}>{item.name}</Table.Cell>
                              <Table.Cell>{formatCurrency(item.cost)}</Table.Cell>
                              <Table.Cell></Table.Cell>
                              <Table.Cell></Table.Cell>
                              <Table.Cell></Table.Cell>
                              <Table.Cell></Table.Cell>
                              <Table.Cell></Table.Cell>
                            </Table.Row>
                          ))}
                        </Table.Body>
                      </Table.Root>
                    </>
                  ) : (
                    <b>{category.category}</b>
                  )}
                </Table.Cell>
                <Table.Cell>{formatCurrency(category.actual)}</Table.Cell>
                <Table.Cell>{formatCurrency(category.target)}</Table.Cell>
                <Table.Cell>{variance}%</Table.Cell>
                <Table.Cell>{category.percent}%</Table.Cell>
                <Table.Cell>
                  <Select.Root defaultValue={solutionOptions[0]}>
                    <Select.Trigger style={{ minWidth: '180px' }} />
                    <Select.Content>
                      {solutionOptions.map(opt => (
                        <Select.Item key={opt} value={opt}>
                          {opt}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </Table.Cell>
                <Table.Cell>{formatCurrency(costAfter)}</Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

export default CostAnalysis;

