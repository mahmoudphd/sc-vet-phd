import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  Dialog,
  Flex,
  Heading,
  Select as RadixSelect,
  Table,
  Text,
  TextField,
} from '@radix-ui/themes';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

import { simulatedIoTCostData, CostCategory, Item } from '../simulateIoTCostData';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe'];

type Totals = typeof simulatedIoTCostData.totals;

const solutionsOptions = [
  'Negotiating better prices with supplier',
  'Reducing waste in material usage',
  'Automation to reduce manual labor costs',
  'Optimizing machine usage',
  'Improving inventory management',
  'Minimize transportation costs',
  'Reduce rework costs',
  'Other',
];

const CostAnalytics: React.FC = () => {
  // State for totals summary (actual, budget, costAfter)
  const [totals, setTotals] = useState<Totals>(simulatedIoTCostData.totals);

  // State for Benchmark Price editable (per product or global)
  const [benchmarkPrice, setBenchmarkPrice] = useState<number>(150); // مثال

  // State for which dialog (category) is open
  const [dialogCategory, setDialogCategory] = useState<CostCategory | null>(null);

  // State for solutions selected per category & item index
  const [solutions, setSolutions] = useState<Record<CostCategory, Record<number, string>>>({
    'Direct Materials': {},
    'Packaging Materials': {},
    'Direct Labor': {},
    Overhead: {},
    'Other Costs': {},
  });

  // AutoMode toggle (disable inputs when true)
  const [autoMode, setAutoMode] = useState<boolean>(false);

  // Currency formatter helper
  const formatCurrency = (value: number) =>
    `$${value.toFixed(2)}`; // غيّر حسب العملة المطلوبة

  // الدالة لإرجاع البيانات التفصيلية حسب الفئة
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

  // دالة تعديل قيم cost داخل العناصر التفصيلية (تحتاج تحديث totals بشكل متناسب)
  const handleDetailCostChange = (category: CostCategory, index: number, newCost: number) => {
    // تعديل في بيانات محلية موقتة (هنا تحتاج إدارة بيانات أعمق إذا تريد تعديل حقيقي)
    // هذه مجرد فكرة لتوضيح
    const updatedDetails = [...getDetailsByCategory(category)];
    updatedDetails[index] = { ...updatedDetails[index], cost: newCost };

    // تحديث totals actual لهذا البند (مجموع عناصر cost الجديدة)
    const newActualTotal = updatedDetails.reduce((sum, item) => sum + (item.cost || 0), 0);
    setTotals((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        actual: newActualTotal,
        // يمكن حساب costAfter كما تريد، هنا أبقيته كما هو مؤقتًا
        costAfter: prev[category].costAfter,
      },
    }));

    // لو عندك طريقة لحفظ التفاصيل المحدثة في State مركزي يمكن إضافتها هنا
  };

  // دالة تعديل budget في totals
  const handleBudgetChange = (category: CostCategory, newBudget: number) => {
    setTotals((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        budget: newBudget,
      },
    }));
  };

  // دالة تعديل costAfter في totals (مثلاً بعد تحسينات)
  const handleCostAfterChange = (category: CostCategory, newCostAfter: number) => {
    setTotals((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        costAfter: newCostAfter,
      },
    }));
  };

  // دالة تغيير حلول لكل بند تفصيلي
  const handleSolutionChange = (category: CostCategory, index: number, solution: string) => {
    setSolutions((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [index]: solution,
      },
    }));
  };

  // حساب إجمالي actual من totals
  const totalActualCost = Object.values(totals).reduce((sum, v) => sum + v.actual, 0);

  // حساب Post-Optimization Estimate = Actual Cost - Cost After Optimization (لكل category ثم المجموع)
  const postOptimizationEstimate = Object.values(totals).reduce(
    (sum, v) => sum + (v.actual - v.costAfter),
    0,
  );

  // بيانات الجدول الرئيسي
  const mainTableData: { category: CostCategory; actual: number; budget: number; costAfter: number }[] =
    Object.entries(totals).map(([category, values]) => ({
      category: category as CostCategory,
      actual: values.actual,
      budget: values.budget,
      costAfter: values.costAfter,
    }));

  // بيانات للرسم البياني للخط
  const lineChartData = mainTableData.map((item, idx) => ({
    month: item.category,
    actual: item.actual,
    target: item.budget,
    gap: item.actual - item.budget,
  }));

  // بيانات رسم بياني Benchmark (كمثال ثابت شهري)
  const benchmarkChartData = [
    { month: 'Jan', Actual: 140, Benchmark: benchmarkPrice, Gap: 140 - benchmarkPrice },
    { month: 'Feb', Actual: 135, Benchmark: benchmarkPrice, Gap: 135 - benchmarkPrice },
    { month: 'Mar', Actual: 150, Benchmark: benchmarkPrice, Gap: 150 - benchmarkPrice },
  ];

  // بيانات Pie Chart لتكوين التكلفة (حسب actual)
  const pieData = mainTableData.map((item) => ({
    name: item.category,
    value: item.actual,
  }));

  // Handle benchmarkPrice change
  const handleBenchmarkPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val)) setBenchmarkPrice(val);
  };

  // دالة لإغلاق النافذة المنبثقة
  const closeDialog = () => setDialogCategory(null);

  return (
    <Box p="4" style={{ maxWidth: 1200, margin: 'auto' }}>
      <Heading mb="4">Cost Analysis Dashboard</Heading>

      {/* الجدول الرئيسي */}
      <Card>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.RowHeaderCell>Category</Table.RowHeaderCell>
              <Table.HeaderCell>Actual Cost</Table.HeaderCell>
              <Table.HeaderCell>Budget</Table.HeaderCell>
              <Table.HeaderCell>Cost After Optimization</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {mainTableData.map((row, idx) => (
              <Table.Row key={idx}>
                <Table.RowHeaderCell>{row.category}</Table.RowHeaderCell>
                <Table.Cell>{formatCurrency(row.actual)}</Table.Cell>
                <Table.Cell>
                  <TextField
                    type="number"
                    value={row.budget}
                    onChange={(e) => handleBudgetChange(row.category, parseFloat(e.target.value))}
                  />
                </Table.Cell>
                <Table.Cell>
                  <TextField
                    type="number"
                    value={row.costAfter}
                    onChange={(e) => handleCostAfterChange(row.category, parseFloat(e.target.value))}
                  />
                </Table.Cell>
                <Table.Cell>
                  <Button onClick={() => setDialogCategory(row.category)}>View Details</Button>
                </Table.Cell>
              </Table.Row>
            ))}

            {/* Total Row */}
            <Table.Row>
              <Table.RowHeaderCell>
                <strong>Total</strong>
              </Table.RowHeaderCell>
              <Table.Cell>
                <strong>{formatCurrency(totalActualCost)}</strong>
              </Table.Cell>
              <Table.Cell />
              <Table.Cell>
                <strong>{formatCurrency(postOptimizationEstimate)}</strong>
              </Table.Cell>
              <Table.Cell />
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </Card>

      {/* Benchmark Price Editable */}
      <Card mt="4" p="3" style={{ maxWidth: 400 }}>
        <Text mb="2" weight="bold">
          Benchmark Price:
        </Text>
        <TextField
          type="number"
          value={benchmarkPrice}
          onChange={handleBenchmarkPriceChange}
          step={0.01}
        />
      </Card>

      {/* Line Chart for Cost Breakdown */}
      <Card mt="4">
        <Flex justify="between" align="center">
          <Heading size="4">Cost Breakdown</Heading>
        </Flex>
        <Box height={300} mt="3">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineChartData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="actual" stroke="#8884d8" name="Actual Cost" />
              <Line type="monotone" dataKey="target" stroke="#82ca9d" name="Target Cost" />
              <Line type="monotone" dataKey="gap" stroke="#ff7300" name="Gap" />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Card>

      {/* Pie Chart for Cost Composition */}
      <Card mt="4">
        <Heading size="3" mb="2">
          Cost Composition
        </Heading>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      {/* Benchmark Price Analysis Chart */}
      <Card mt="4">
        <Heading size="3" mb="2">
          Benchmark Price Analysis
        </Heading>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={benchmarkChartData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Actual" stroke="#8884d8" />
            <Line type="monotone" dataKey="Benchmark" stroke="#82ca9d" />
            <Line type="monotone" dataKey="Gap" stroke="#ff7300" strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Dialog for Details */}
      <Dialog.Root open={!!dialogCategory} onOpenChange={(open) => !open && closeDialog()}>
        <Dialog.Content size="5" style={{ maxWidth: 700 }}>
          <Dialog.Title>Details - {dialogCategory}</Dialog.Title>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.RowHeaderCell>Name</Table.RowHeaderCell>
                <Table.HeaderCell>Actual Cost</Table.HeaderCell>
                <Table.HeaderCell>Budget</Table.HeaderCell>
                <Table.HeaderCell>Cost After Optimization</Table.HeaderCell>
                <Table.HeaderCell>Solution</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {dialogCategory &&
                getDetailsByCategory(dialogCategory).map((item, idx) => (
                  <Table.Row key={idx}>
                    <Table.RowHeaderCell>{item.name}</Table.RowHeaderCell>
                    <Table.Cell>
                      <TextField
                        type="number"
                        value={item.cost || 0}
                        disabled={autoMode}
                        onChange={(e) =>
                          handleDetailCostChange(dialogCategory, idx, parseFloat(e.target.value))
                        }
                      />
                    </Table.Cell>
                    <Table.Cell>
                      {/* Budget editable for whole category only - can extend per item if needed */}
                      <TextField
                        type="number"
                        value={totals[dialogCategory].budget}
                        disabled={autoMode}
                        onChange={(e) => handleBudgetChange(dialogCategory, parseFloat(e.target.value))}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <TextField
                        type="number"
                        value={totals[dialogCategory].costAfter}
                        disabled={autoMode}
                        onChange={(e) => handleCostAfterChange(dialogCategory, parseFloat(e.target.value))}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <RadixSelect.Root
                        value={solutions[dialogCategory]?.[idx] || ''}
                        onValueChange={(val) => handleSolutionChange(dialogCategory, idx, val)}
                      >
                        <RadixSelect.Trigger aria-label="Select solution" />
                        <RadixSelect.Content>
                          {solutionsOptions.map((opt) => (
                            <RadixSelect.Item key={opt} value={opt}>
                              {opt}
                            </RadixSelect.Item>
                          ))}
                        </RadixSelect.Content>
                      </RadixSelect.Root>
                    </Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table.Root>

          <Dialog.Close asChild>
            <Button mt="4" fullWidth>
              Close
            </Button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Root>
    </Box>
  );
};

export default CostAnalytics;
