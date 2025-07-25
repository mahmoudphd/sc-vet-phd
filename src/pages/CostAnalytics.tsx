// src/pages/CostAnalytics.tsx

import React, { useState } from 'react';
import {
  Card,
  Flex,
  Heading,
  Table,
  Button,
  Box,
  Dialog,
  Text,
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
import { useTranslation } from 'react-i18next';

import { simulatedIoTCostData, CostCategory } from '../simulateIoTCostData';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00c49f'];

const formatCurrency = (value: number) =>
  `$${value.toFixed(2)}`;

const CostAnalytics: React.FC = () => {
  const { t } = useTranslation();

  // بيانات الجدول (يمكن تحديثها ديناميكيًا لاحقاً)
  const [totals, setTotals] = useState(simulatedIoTCostData.totals);

  // حالة عرض تحليل الفجوة في الرسم البياني
  const [showGapAnalysis, setShowGapAnalysis] = useState(false);

  // حالة الـ Dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CostCategory | null>(null);

  // فتح النافذة مع اختيار الفئة
  const openDialog = (category: CostCategory) => {
    setSelectedCategory(category);
    setDialogOpen(true);
  };

  // إغلاق النافذة
  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedCategory(null);
  };

  // حساب إجمالي التكلفة لكل بند (costAfter)
  const totalCost = Object.values(totals).reduce((sum, val) => sum + val.costAfter, 0);

  // بيانات الرسم البياني للخط (مثال مبسط)
  const data = [
    { month: 'Jan', actual: 120, target: 100, gap: 20 },
    { month: 'Feb', actual: 110, target: 105, gap: 5 },
    { month: 'Mar', actual: 115, target: 110, gap: 5 },
    // ... أكمل حسب حاجتك
  ];

  // بيانات PieChart بناءً على التكلفة لكل بند
  const pieData = Object.entries(totals).map(([name, val]) => ({
    name,
    value: val.costAfter,
  }));

  // بيانات Benchmark Price (مثال)
  const benchmarkChartData = [
    { month: 'Jan', Actual: 120, Benchmark: 115, Gap: 5 },
    { month: 'Feb', Actual: 110, Benchmark: 108, Gap: 2 },
    { month: 'Mar', Actual: 115, Benchmark: 112, Gap: 3 },
  ];

  return (
    <Box p="4">
      <Card>
        <Heading size="3" mb="3">
          {t('Inter-Organizational Cost Management')}
        </Heading>

        {/* جدول التكلفة */}
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.RowHeaderCell>{t('Cost Category')}</Table.RowHeaderCell>
              <Table.HeaderCell>{t('Actual')}</Table.HeaderCell>
              <Table.HeaderCell>{t('Budget')}</Table.HeaderCell>
              <Table.HeaderCell>{t('Cost After Optimization')}</Table.HeaderCell>
              <Table.HeaderCell>{t('Details')}</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {Object.entries(totals).map(([category, values]) => (
              <Table.Row key={category}>
                <Table.Cell>{category}</Table.Cell>
                <Table.Cell>{formatCurrency(values.actual)}</Table.Cell>
                <Table.Cell>{formatCurrency(values.budget)}</Table.Cell>
                <Table.Cell>{formatCurrency(values.costAfter)}</Table.Cell>
                <Table.Cell>
                  <Button onClick={() => openDialog(category as CostCategory)}>
                    {t('View Details')}
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}

            {/* صف الإجمالي */}
            <Table.Row>
              <Table.RowHeaderCell><strong>{t('Total')}</strong></Table.RowHeaderCell>
              <Table.Cell />
              <Table.Cell />
              <Table.Cell><strong>{formatCurrency(totalCost)}</strong></Table.Cell>
              <Table.Cell />
            </Table.Row>
          </Table.Body>
        </Table.Root>

        {/* زر إرسال */}
        <Flex justify="end" mt="4">
          <Button onClick={() => alert('Submitted!')}>{t('Submit All')}</Button>
        </Flex>
      </Card>

      {/* الرسم البياني الخطّي */}
      <Card mt="4">
        <Flex justify="between" align="center">
          <Heading size="4">{t('Cost Breakdown')}</Heading>
          <Button onClick={() => setShowGapAnalysis(!showGapAnalysis)}>
            {showGapAnalysis ? t('Hide Gap Analysis') : t('Show Gap Analysis')}
          </Button>
        </Flex>
        <Box height={300} mt="3">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#8884d8"
                name={t('Actual Cost')}
              />
              <Line
                type="monotone"
                dataKey="target"
                stroke="#82ca9d"
                name={t('Target Cost')}
              />
              {showGapAnalysis && (
                <Line
                  type="monotone"
                  dataKey="gap"
                  stroke="#ff7300"
                  name={t('Gap')}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Card>

      {/* رسم بياني دائري */}
      <Card mt="4">
        <Heading size="3" mb="2">
          {t('Cost Composition')}
        </Heading>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      {/* Benchmark Price Chart */}
      <Card mt="4">
        <Heading size="3" mb="2">
          {t('Benchmark Price Analysis')}
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

      {/* Dialog: تفاصيل كل بند */}
      <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Overlay
          style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 1000,
          }}
        />
        <Dialog.Content
          style={{
            backgroundColor: 'white',
            borderRadius: 8,
            padding: 20,
            maxWidth: 600,
            margin: '100px auto',
            position: 'relative',
            zIndex: 1001,
          }}
        >
          <Dialog.Title style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
            {selectedCategory} {t('Details')}
          </Dialog.Title>

          <Box mt="3" mb="3" style={{ maxHeight: 300, overflowY: 'auto' }}>
            {selectedCategory === 'Direct Materials' && (
              <Table.Root>
                <Table.Header>
                  <Table.Row>
                    <Table.RowHeaderCell>{t('Name')}</Table.RowHeaderCell>
                    <Table.HeaderCell>{t('Concentration (Kg)')}</Table.HeaderCell>
                    <Table.HeaderCell>{t('Price per Kg')}</Table.HeaderCell>
                    <Table.HeaderCell>{t('Cost')}</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {simulatedIoTCostData.rawMaterials.map((item) => (
                    <Table.Row key={item.name}>
                      <Table.Cell>{item.name}</Table.Cell>
                      <Table.Cell>{item.concentrationKg}</Table.Cell>
                      <Table.Cell>{formatCurrency(item.pricePerKg || 0)}</Table.Cell>
                      <Table.Cell>{formatCurrency(item.cost || 0)}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            )}

            {selectedCategory === 'Packaging Materials' && (
              <Table.Root>
                <Table.Header>
                  <Table.Row>
                    <Table.RowHeaderCell>{t('Name')}</Table.RowHeaderCell>
                    <Table.HeaderCell>{t('Quantity')}</Table.HeaderCell>
                    <Table.HeaderCell>{t('Unit Price')}</Table.HeaderCell>
                    <Table.HeaderCell>{t('Cost')}</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {simulatedIoTCostData.packagingMaterials.map((item) => (
                    <Table.Row key={item.name}>
                      <Table.Cell>{item.name}</Table.Cell>
                      <Table.Cell>{item.qty}</Table.Cell>
                      <Table.Cell>{formatCurrency(item.unitPrice || 0)}</Table.Cell>
                      <Table.Cell>{formatCurrency(item.cost || 0)}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            )}

            {selectedCategory === 'Direct Labor' && (
              <Table.Root>
                <Table.Header>
                  <Table.Row>
                    <Table.RowHeaderCell>{t('Name')}</Table.RowHeaderCell>
                    <Table.HeaderCell>{t('Hours')}</Table.HeaderCell>
                    <Table.HeaderCell>{t('Hourly Rate')}</Table.HeaderCell>
                    <Table.HeaderCell>{t('Cost')}</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {simulatedIoTCostData.directLabor.map((item) => (
                    <Table.Row key={item.name}>
                      <Table.Cell>{item.name}</Table.Cell>
                      <Table.Cell>{item.hours}</Table.Cell>
                      <Table.Cell>{formatCurrency(item.hourlyRate || 0)}</Table.Cell>
                      <Table.Cell>{formatCurrency(item.cost || 0)}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            )}

            {selectedCategory === 'Overhead' && (
              <Table.Root>
                <Table.Header>
                  <Table.Row>
                    <Table.RowHeaderCell>{t('Name')}</Table.RowHeaderCell>
                    <Table.HeaderCell>{t('Total Cost')}</Table.HeaderCell>
                    <Table.HeaderCell>{t('Basis')}</Table.HeaderCell>
                    <Table.HeaderCell>{t('Cost')}</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {simulatedIoTCostData.overheadItems.map((item) => (
                    <Table.Row key={item.name}>
                      <Table.Cell>{item.name}</Table.Cell>
                      <Table.Cell>{formatCurrency(item.totalCost || 0)}</Table.Cell>
                      <Table.Cell>{item.basis}</Table.Cell>
                      <Table.Cell>{formatCurrency(item.cost || 0)}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            )}

            {selectedCategory === 'Other Costs' && (
              <Table.Root>
                <Table.Header>
                  <Table.Row>
                    <Table.RowHeaderCell>{t('Name')}</Table.RowHeaderCell>
                    <Table.HeaderCell>{t('Quantity')}</Table.HeaderCell>
                    <Table.HeaderCell>{t('Unit Price')}</Table.HeaderCell>
                    <Table.HeaderCell>{t('Cost')}</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {simulatedIoTCostData.otherCosts.map((item) => (
                    <Table.Row key={item.name}>
                      <Table.Cell>{item.name}</Table.Cell>
                      <Table.Cell>{item.qty}</Table.Cell>
                      <Table.Cell>{formatCurrency(item.unitPrice || 0)}</Table.Cell>
                      <Table.Cell>{formatCurrency(item.cost || 0)}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            )}
          </Box>

          <Flex justify="end" mt="4">
            <Button onClick={closeDialog}>{t('Close')}</Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Box>
  );
};

export default CostAnalytics;
