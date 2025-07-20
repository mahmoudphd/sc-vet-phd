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

// صيغة العملة
const formatCurrency = (value: number, currency: string) => `${currency} ${value.toFixed(2)}`;

// الفئات الثابتة
const categories: CostCategory[] = [
  'Direct Materials',
  'Packaging Materials',
  'Direct Labor',
  'Overhead',
  'Other Costs'
];

// جلب تفاصيل الفئة
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

  // لحسابات التكلفة
  const totals = simulatedIoTCostData.totals;

  const totalActual = categories.reduce((sum, category) => sum + totals[category].actual, 0);
  const totalBudget = categories.reduce((sum, category) => sum + totals[category].budget, 0);
  const totalCostAfter = categories.reduce((sum, category) => sum + totals[category].costAfter, 0);

  const targetCost = benchmarkPrice * (1 - profitMargin / 100);

  // بيانات الشارت الزمني
  const benchmarkTrendData = [
    { month: 'Jan', actual: 169.61, benchmark: benchmarkPrice },
    { month: 'Feb', actual: 170.5, benchmark: benchmarkPrice },
    { month: 'Mar', actual: 168.0, benchmark: benchmarkPrice },
    { month: 'Apr', actual: 171.2, benchmark: benchmarkPrice },
    { month: 'May', actual: totalActual, benchmark: benchmarkPrice }
  ];

  const benchmarkTrendDataWithGap = benchmarkTrendData.map((d) => ({
    ...d,
    targetCost,
    gap: d.actual - targetCost
  }));

  const pieColors = ['#3b82f6', '#f59e0b', '#ef4444'];

  // حالة بيانات تعديل التفاصيل داخل النافذة (نموذجية)
  const [editDetails, setEditDetails] = useState<Item[]>([]);

  // عند فتح النافذة، ننسخ البيانات لتعديلها
  const openDialogWithData = (category: CostCategory) => {
    const details = getDetailsByCategory(category);
    // نسخ بيانات للتعديل محليًا
    setEditDetails(details.map(item => ({ ...item })));
    setDialogCategory(category);
  };

  // تحديث حقل محدد في التفاصيل
  const handleDetailChange = (index: number, field: keyof Item, value: string | number) => {
    setEditDetails((prev) => {
      const updated = [...prev];
      // تحديث الحقل مع حفظ النوع الصحيح
      if (field === 'name') {
        updated[index][field] = value as string;
      } else {
        updated[index][field] = Number(value);
      }
      // إعادة حساب التكلفة تلقائياً (qty * unitPrice)
      if (field === 'qty' || field === 'unitPrice') {
        updated[index].cost = updated[index].qty * updated[index].unitPrice;
      }
      return updated;
    });
  };

  // زر submit dummy: هنا يمكن إضافة منطق الإرسال أو التحديث الحقيقي
  const handleSubmitDetails = () => {
    alert(`Submitted changes for ${dialogCategory}`);
    // إغلاق النافذة
    setDialogCategory(null);
  };

  return (
    <Box p="4">
      {/* العنوان والاختيارات */}
      <Flex justify="between" align="center" mb="4" wrap="wrap" gap="3">
        <Heading>Inter-Organizational Cost Management</Heading>

        <Flex gap="3" align="center" wrap="wrap">
          {/* Currency Select */}
          <Select.Root
            defaultValue={currency}
            onValueChange={(value: string) => setCurrency(value as 'EGP' | 'USD')}
          >
            <Select.Trigger aria-label="Select currency" />
            <Select.Content>
              <Select.Item value="EGP">EGP</Select.Item>
              <Select.Item value="USD">USD</Select.Item>
            </Select.Content>
          </Select.Root>

          <Button>Export Report</Button>
        </Flex>
      </Flex>

      {/* KPIs */}
      <Grid columns={{ '@initial': 1, '@sm': 3 }} gap="4" mb="4">
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
          <TextField.Root>
            <TextField.Input
              type="number"
              value={benchmarkPrice}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBenchmarkPrice(parseFloat(e.target.value))}
            />
          </TextField.Root>
        </Box>
        <Box>
          <Text size="2">Profit Margin (%)</Text>
          <TextField.Root>
            <TextField.Input
              type="number"
              value={profitMargin}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfitMargin(parseFloat(e.target.value))}
            />
          </TextField.Root>
        </Box>
        <Box>
          <Text size="2">Progress to Target</Text>
          <Progress value={(targetCost / totalActual) * 100} />
          <Text>{Math.round((targetCost / totalActual) * 100)}%</Text>
        </Box>
      </Grid>

      {/* جدول ملخص التكلفة */}
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
                <Button onClick={() => openDialogWithData(category)}>View Details</Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      {/* PieChart لعرض التوزيع */}
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

      {/* LineChart للترند الشهري */}
      <Box mt="6" style={{ height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={benchmarkTrendDataWithGap}>
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

      {/* نافذة التفاصيل */}
      {dialogCategory && (
        <Dialog.Root open onOpenChange={() => setDialogCategory(null)}>
          <Dialog.Content maxWidth="700px">
            <Dialog.Title>{dialogCategory} Breakdown</Dialog.Title>

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
                {editDetails.map((item, index) => (
                  <Table.Row key={index}>
                    <Table.RowHeaderCell>{item.name}</Table.RowHeaderCell>
                    <Table.Cell>
                      <TextField.Root>
                        <TextField.Input
                          type="number"
                          value={item.qty}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleDetailChange(index, 'qty', e.target.value)
                          }
                        />
                      </TextField.Root>
                    </Table.Cell>
                    <Table.Cell>
                      <TextField.Root>
                        <TextField.Input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleDetailChange(index, 'unitPrice', e.target.value)
                          }
                        />
                      </TextField.Root>
                    </Table.Cell>
                    <Table.Cell>{formatCurrency(item.cost, currency)}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>

            <Flex justify="end" mt="4" gap="3">
              <Button variant="secondary" onClick={() => setDialogCategory(null)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitDetails}>Submit</Button>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      )}
    </Box>
  );
}
