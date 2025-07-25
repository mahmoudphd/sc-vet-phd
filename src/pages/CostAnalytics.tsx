// src/pages/CostAnalytics.tsx
import React, { useState } from 'react';
import {
  Card,
  Flex,
  Heading,
  Text,
  Table,
  Button,
  Box,
  Dialog,
  TextField,
  Select,
} from '@radix-ui/themes';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { simulatedIoTCostData, CostCategory, Item } from '../simulateIoTCostData';
import { useTranslation } from 'react-i18next';

// ألوان PieChart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA336A'];

// دالة تنسيق العملة
const formatCurrency = (value: number, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(value);
};

type TotalsType = typeof simulatedIoTCostData.totals;

const CostAnalytics: React.FC = () => {
  const { t } = useTranslation();

  // حالة اختيار العملة
  const [currency, setCurrency] = useState<'USD' | 'EGP'>('USD');

  // حالة بيانات التكلفة - actual, budget, costAfter حسب كل بند
  const [totals, setTotals] = useState<TotalsType>(simulatedIoTCostData.totals);

  // حالة إظهار تحليلات الجاب (Gap Analysis)
  const [showGapAnalysis, setShowGapAnalysis] = useState(false);

  // حالة إظهار الدايلوج (مثال: ل Raw Materials)
  const [showRawMaterialsDialog, setShowRawMaterialsDialog] = useState(false);

  // بيانات PieChart من المجاميع
  const pieData = Object.entries(totals).map(([key, val]) => ({
    name: key,
    value: val.actual,
  }));

  // بيانات LineChart للمقارنة الشهرية (مثال ثابت هنا)
  const data = [
    { month: 'Jan', actual: 100, target: 90, gap: 10 },
    { month: 'Feb', actual: 120, target: 110, gap: 10 },
    { month: 'Mar', actual: 130, target: 130, gap: 0 },
    { month: 'Apr', actual: 125, target: 130, gap: -5 },
  ];

  // بيانات Benchmark Price Analysis (مثال ثابت)
  const benchmarkChartData = [
    { month: 'Jan', Actual: 100, Benchmark: 105, Gap: 5 },
    { month: 'Feb', Actual: 110, Benchmark: 108, Gap: -2 },
    { month: 'Mar', Actual: 115, Benchmark: 112, Gap: -3 },
    { month: 'Apr', Actual: 120, Benchmark: 115, Gap: -5 },
  ];

  // حساب مجموع التكلفة الفعلية
  const totalCost = Object.values(totals).reduce((acc, cur) => acc + cur.actual, 0);

  // معالج تغير العملة
  const handleCurrencyChange = (value: 'USD' | 'EGP') => {
    setCurrency(value);
  };

  // معالج تعديل قيم التكلفة يدوياً
  const handleInputChange = (
    category: CostCategory,
    field: 'actual' | 'budget' | 'costAfter',
    value: number
  ) => {
    setTotals((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }));
  };

  // مثال: Submit الكل
  const handleSubmitAll = () => {
    alert(t('Data submitted successfully!'));
  };

  return (
    <Box p="4">
      {/* عنوان + اختيار العملة */}
      <Flex justify="space-between" align="center" mb="4">
        <Heading size="3">{t('Inter-Organizational Cost Management')}</Heading>
        <Select
          value={currency}
          onValueChange={(val) => handleCurrencyChange(val as 'USD' | 'EGP')}
          aria-label={t('Select currency')}
        >
          <Select.Item value="USD">{t('USD')}</Select.Item>
          <Select.Item value="EGP">{t('EGP')}</Select.Item>
        </Select>
      </Flex>

      {/* الكروت KPI */}
      <Flex gap="4" wrap="wrap">
        {/* Actual Cost */}
        <Card style={{ minWidth: 180, flex: '1 1 150px' }}>
          <Text size="3" mb="1">{t('Actual Cost')}</Text>
          <Heading size="4">{formatCurrency(totals['Direct Materials'].actual + totals['Packaging Materials'].actual + totals['Direct Labor'].actual + totals['Overhead'].actual + totals['Other Costs'].actual, currency)}</Heading>
        </Card>

        {/* Total Cost */}
        <Card style={{ minWidth: 180, flex: '1 1 150px' }}>
          <Text size="3" mb="1">{t('Total Cost')}</Text>
          <Heading size="4">{formatCurrency(totalCost, currency)}</Heading>
        </Card>

        {/* Target Cost */}
        <Card style={{ minWidth: 180, flex: '1 1 150px' }}>
          <Text size="3" mb="1">{t('Target Cost')}</Text>
          <Heading size="4">{formatCurrency(Object.values(totals).reduce((acc, cur) => acc + cur.budget, 0), currency)}</Heading>
        </Card>

        {/* Benchmark Price */}
        <Card style={{ minWidth: 180, flex: '1 1 150px' }}>
          <Text size="3" mb="1">{t('Benchmark Price')}</Text>
          <Heading size="4">{formatCurrency(120, currency)}</Heading>
        </Card>

        {/* Progress to Target */}
        <Card style={{ minWidth: 180, flex: '1 1 150px' }}>
          <Text size="3" mb="1">{t('Progress to Target')}</Text>
          <ProgressBar progress={70} />
        </Card>

        {/* Post Optimization Estimate */}
        <Card style={{ minWidth: 180, flex: '1 1 150px' }}>
          <Text size="3" mb="1">{t('Post Optimization Estimate')}</Text>
          <Heading size="4">{formatCurrency(110, currency)}</Heading>
        </Card>
      </Flex>

      {/* جدول التحليل */}
      <Card mt="4" p="4">
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.RowHeaderCell>{t('Category')}</Table.RowHeaderCell>
              <Table.RowHeaderCell>{t('Actual Cost')}</Table.RowHeaderCell>
              <Table.RowHeaderCell>{t('Target Cost')}</Table.RowHeaderCell>
              <Table.RowHeaderCell>{t('Cost After')}</Table.RowHeaderCell>
              <Table.RowHeaderCell>{t('% of Total')}</Table.RowHeaderCell>
              <Table.RowHeaderCell>{t('Gap')}</Table.RowHeaderCell>
              <Table.RowHeaderCell>{t('Solution')}</Table.RowHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {(Object.entries(totals) as [CostCategory, { actual: number; budget: number; costAfter: number }][]).map(([category, data]) => {
              const percentOfTotal = ((data.actual / totalCost) * 100).toFixed(1) + '%';
              const gap = (data.actual - data.budget).toFixed(2);
              return (
                <Table.Row key={category}>
                  <Table.RowHeaderCell>{t(category)}</Table.RowHeaderCell>
                  <Table.Cell>{formatCurrency(data.actual, currency)}</Table.Cell>
                  <Table.Cell>{formatCurrency(data.budget, currency)}</Table.Cell>
                  <Table.Cell>{formatCurrency(data.costAfter, currency)}</Table.Cell>
                  <Table.Cell>{percentOfTotal}</Table.Cell>
                  <Table.Cell style={{ color: Number(gap) > 0 ? 'red' : 'green' }}>{gap}</Table.Cell>
                  <Table.Cell>
                    <Select aria-label={t('Select solution')}>
                      <Select.Item value="negotiation">{t('Negotiating better prices')}</Select.Item>
                      <Select.Item value="wasteReduction">{t('Reducing waste')}</Select.Item>
                      <Select.Item value="automation">{t('Automation')}</Select.Item>
                      <Select.Item value="optimization">{t('Optimizing usage')}</Select.Item>
                      <Select.Item value="inventory">{t('Improving inventory')}</Select.Item>
                      <Select.Item value="transportation">{t('Minimizing transportation')}</Select.Item>
                      <Select.Item value="rework">{t('Reducing rework')}</Select.Item>
                      <Select.Item value="other">{t('Other')}</Select.Item>
                    </Select>
                  </Table.Cell>
                </Table.Row>
              );
            })}
            <Table.Row>
              <Table.RowHeaderCell><strong>{t('Total')}</strong></Table.RowHeaderCell>
              <Table.Cell />
              <Table.Cell />
              <Table.Cell>
                <strong>{formatCurrency(totalCost, currency)}</strong>
              </Table.Cell>
              <Table.Cell>
                <strong>100%</strong>
              </Table.Cell>
              <Table.Cell />
              <Table.Cell />
            </Table.Row>
          </Table.Body>
        </Table.Root>
        {/* Submit All Button */}
        <Flex justify="end" mt="4">
          <Button onClick={handleSubmitAll}>{t('Submit All')}</Button>
        </Flex>
      </Card>

      {/* الرسوم البيانية */}
      <Card mt="4" p="4">
        <Flex justify="space-between" align="center" mb="3">
          <Heading size="4">{t('Cost Breakdown')}</Heading>
          <Button onClick={() => setShowGapAnalysis(!showGapAnalysis)}>
            {showGapAnalysis ? t('Hide Gap Analysis') : t('Show Gap Analysis')}
          </Button>
        </Flex>
        <Box height={300}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        {/* خط زمني - Actual vs Target */}
        <Box height={300} mt="6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="actual" stroke="#8884d8" />
              <Line type="monotone" dataKey="target" stroke="#82ca9d" />
              {showGapAnalysis && <Line type="monotone" dataKey="gap" stroke="#ff7300" />}
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Card>

      {/* دايلوج التفاصيل (مثال لـ Raw Materials) */}
      <Dialog open={showRawMaterialsDialog} onOpenChange={setShowRawMaterialsDialog}>
        <Dialog.Content>
          <Dialog.Title>{t('Raw Materials Details')}</Dialog.Title>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.RowHeaderCell>{t('Name')}</Table.RowHeaderCell>
                <Table.RowHeaderCell>{t('Concentration (Kg)')}</Table.RowHeaderCell>
                <Table.RowHeaderCell>{t('Price per Kg')}</Table.RowHeaderCell>
                <Table.RowHeaderCell>{t('Cost')}</Table.RowHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {simulatedIoTCostData.rawMaterials.map((item: Item, index: number) => (
                <Table.Row key={index}>
                  <Table.RowHeaderCell>{item.name}</Table.RowHeaderCell>
                  <Table.Cell>{item.concentrationKg?.toFixed(4)}</Table.Cell>
                  <Table.Cell>{formatCurrency(item.pricePerKg ?? 0, currency)}</Table.Cell>
                  <Table.Cell>{formatCurrency(item.cost ?? 0, currency)}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
          <Flex justify="end" mt="4">
            <Button onClick={() => setShowRawMaterialsDialog(false)}>{t('Close')}</Button>
          </Flex>
        </Dialog.Content>
      </Dialog>
    </Box>
  );
};

// مكون شريط التقدم (ProgressBar)
interface ProgressBarProps {
  progress: number; // نسبة من 0 إلى 100
}
const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <Box
      css={{
        width: '100%',
        backgroundColor: '#eee',
        borderRadius: 8,
        overflow: 'hidden',
        height: 20,
      }}
    >
      <Box
        css={{
          width: `${progress}%`,
          backgroundColor: '#007bff',
          height: '100%',
          transition: 'width 0.3s ease-in-out',
        }}
      />
      <Text
        size="2"
        style={{
          position: 'relative',
          top: '-22px',
          textAlign: 'center',
          fontWeight: 'bold',
          color: '#fff',
          userSelect: 'none',
        }}
      >
        {progress}%
      </Text>
    </Box>
  );
};

export default CostAnalytics;
