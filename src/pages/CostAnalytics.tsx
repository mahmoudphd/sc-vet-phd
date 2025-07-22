// src/pages/CostAnalytics.tsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Flex,
  Grid,
  Heading,
  Progress,
  Switch,
  Table,
  Text,
  Dialog
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
  ResponsiveContainer
} from 'recharts';

// ألوان المخطط الدائري
const pieColors = ['#4f46e5', '#0ea5e9', '#10b981', '#f97316', '#f43f5e'];

// البيانات المحاكاة
export const simulatedIoTCostData = {
  totals: {
    'Direct Materials': { actual: 133.11, target: 129, costAfter: 130 },
    'Packaging Materials': { actual: 18, target: 16, costAfter: 16 },
    'Direct Labor': { actual: 3, target: 2, costAfter: 2 },
    Overhead: { actual: 2, target: 2, costAfter: 2 },
    'Other Costs': { actual: 15, target: 13, costAfter: 14 },
  },
  benchmarkPrice: 140,
  costAfter: 164,
};

// الحالات
const CostAnalytics = () => {
  const [totals, setTotals] = useState(simulatedIoTCostData.totals);
  const [benchmarkPrice, setBenchmarkPrice] = useState(simulatedIoTCostData.benchmarkPrice);
  const [costAfter, setCostAfter] = useState(simulatedIoTCostData.costAfter);
  const [showGapAnalysis, setShowGapAnalysis] = useState(false);
  const [solutions, setSolutions] = useState<{ [key: string]: string }>({});
  const [autoMode, setAutoMode] = useState(true);
  return (
    <Box p="4">
      <Heading mb="4">Cost Analytics Dashboard</Heading>

      <Grid columns="3" gap="3" mb="3">
        <Card><Text>Actual Cost: EGP {Object.values(totals).reduce((a, b) => a + b.actual, 0).toFixed(2)}</Text></Card>
        <Card><Text>Target Cost: EGP {Object.values(totals).reduce((a, b) => a + b.target, 0).toFixed(2)}</Text></Card>
        <Card>
          <Flex justify="between">
            <Text>Benchmark Price: EGP {benchmarkPrice}</Text>
            <Button variant="outline" size="xs" onClick={() => alert('Benchmark insight: External market avg etc.')}>
              Insight
            </Button>
          </Flex>
        </Card>
      </Grid>

      <Grid columns="3" gap="3" mb="4">
        <Card><Text>Profit Margin (%): {(((benchmarkPrice - Object.values(totals).reduce((a, b) => a + b.actual, 0)) / benchmarkPrice) * 100).toFixed(1)}%</Text></Card>
        <Card>
          <Text>Progress To Target: </Text>
          <Progress value={70} />
        </Card>
        <Card><Text>Post-Optimization Estimate: EGP {costAfter}</Text></Card>
      </Grid>
      <Heading size="3" mb="2">Cost Breakdown</Heading>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Cost Category</Table.ColumnHeader>
            <Table.ColumnHeader>Actual</Table.ColumnHeader>
            <Table.ColumnHeader>Target</Table.ColumnHeader>
            <Table.ColumnHeader>Variance</Table.ColumnHeader>
            <Table.ColumnHeader>% Of Total</Table.ColumnHeader>
            <Table.ColumnHeader>Cost After</Table.ColumnHeader>
            <Table.ColumnHeader>View Details</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {Object.entries(totals).map(([category, data], index) => {
            const variance = (data.actual - data.target).toFixed(2);
            const percent = ((data.actual / Object.values(totals).reduce((a, b) => a + b.actual, 0)) * 100).toFixed(1);
            return (
              <Table.Row key={index}>
                <Table.Cell>{category}</Table.Cell>
                <Table.Cell>{data.actual}</Table.Cell>
                <Table.Cell>
                  <input
                    type="number"
                    value={data.target}
                    onChange={(e) => handleTargetChange(category, +e.target.value)}
                    style={{ width: '60px' }}
                  />
                </Table.Cell>
                <Table.Cell>{variance}</Table.Cell>
                <Table.Cell>{percent}%</Table.Cell>
                <Table.Cell>{data.costAfter}</Table.Cell>
                <Table.Cell>
                  <Dialog.Root>
                    <Dialog.Trigger>
                      <Button size="xs" variant="outline">View Details</Button>
                    </Dialog.Trigger>
                    <Dialog.Content>
                      <Dialog.Title>{category} Details</Dialog.Title>
                      <Text>Improve Tips: Consider process optimization, supplier negotiation, etc.</Text>
                      <Button onClick={() => handleSolutionChange(category, 'New Solution')}>
                        Apply Solution
                      </Button>
                    </Dialog.Content>
                  </Dialog.Root>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Root>
      <Box mb="4" style={{ border: '1px solid #ddd', padding: '16px', borderRadius: '8px' }}>
        <Heading size="3" mb="2">Cost Distribution</Heading>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={Object.entries(totals).map(([category, data]) => ({
                name: category,
                value: data.actual,
              }))}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
              dataKey="value"
            >
              {Object.entries(totals).map((_, index) => (
                <Cell key={index} fill={pieColors[index % pieColors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Box>

      <Box mb="4" style={{ border: '1px solid #ddd', padding: '16px', borderRadius: '8px' }}>
        <Flex justify="between" mb="2">
          <Heading size="3">Benchmark Trend</Heading>
          <Button size="xs" variant="outline" onClick={() => setShowGapAnalysis(!showGapAnalysis)}>
            Show Gap Analysis
          </Button>
        </Flex>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={[
            { name: 'Jan', benchmark: 120 },
            { name: 'Feb', benchmark: 125 },
            { name: 'Mar', benchmark: 130 },
            { name: 'Apr', benchmark: 135 },
          ]}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="benchmark" stroke="#4f46e5" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Box>
  );

  // تعديل الهدف
  function handleTargetChange(category: string, newTarget: number) {
    setTotals(prev => ({
      ...prev,
      [category]: { ...prev[category], target: newTarget },
    }));
  }

  // تحديث الحلول
  function handleSolutionChange(category: string, solution: string) {
    setSolutions(prev => ({ ...prev, [category]: solution }));
  }

  // زر Submit All
  function handleSubmitAll() {
    alert('All data submitted to blockchain!');
  }
  return (
    <>
      {/* باقي الكروت والرسومات والجدول كما فوق */}

      <Flex justify="center" mt="4">
        <Button size="md" variant="solid" color="green" onClick={handleSubmitAll}>
          Submit To Blockchain
        </Button>
      </Flex>
    </>
  );
};

export default CostAnalytics;
// ألوان القطاعات في PieChart
const pieColors = ['#4f46e5', '#22c55e', '#ec4899', '#f97316', '#0ea5e9'];

// بيانات الحلول المقترَحة (Solutions)
const solutions = {
  'Direct Materials': 'Use alternative supplier',
  'Packaging Materials': 'Reduce packaging weight',
  'Direct Labor': 'Optimize scheduling',
  Overhead: 'Improve energy efficiency',
  'Other Costs': 'Negotiate better transport rates',
};

// بيانات trend للخطّي
const benchmarkTrendData = [
  { name: 'Jan', benchmark: 120 },
  { name: 'Feb', benchmark: 125 },
  { name: 'Mar', benchmark: 130 },
  { name: 'Apr', benchmark: 135 },
];
const [totals, setTotals] = useState(simulatedIoTCostData.totals);
const [showGapAnalysis, setShowGapAnalysis] = useState(false);
const [insightOpen, setInsightOpen] = useState(false);
const [dialogCategory, setDialogCategory] = useState<string | null>(null);
{dialogCategory && (
  <Dialog.Root open={!!dialogCategory} onOpenChange={() => setDialogCategory(null)}>
    <Dialog.Content style={{ maxWidth: 600 }}>
      <Flex justify="between" align="center" mb="2">
        <Heading size="4">{dialogCategory} Details</Heading>
        <Button size="xs" variant="outline" onClick={() => setInsightOpen(true)}>
          Improve Tips
        </Button>
      </Flex>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Item</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Cost</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Solution</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {getDetailsByCategory(dialogCategory).map((item, index) => (
            <Table.Row key={index}>
              <Table.Cell>{item.name}</Table.Cell>
              <Table.Cell>{item.cost}</Table.Cell>
              <Table.Cell>{solutions[dialogCategory as CostCategory]}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      <Flex justify="end" mt="3">
        <Button onClick={() => setDialogCategory(null)}>Close</Button>
      </Flex>
    </Dialog.Content>
  </Dialog.Root>
)}

<Dialog.Root open={insightOpen} onOpenChange={setInsightOpen}>
  <Dialog.Content style={{ maxWidth: 400 }}>
    <Heading size="4">Improve Tips</Heading>
    <Text size="2">
      This benchmark price is derived from market trends and internal optimization.
      You can manually adjust it to reflect expected supplier negotiations or process improvements.
    </Text>
    <Flex justify="end" mt="3">
      <Button onClick={() => setInsightOpen(false)}>Close</Button>
    </Flex>
  </Dialog.Content>
</Dialog.Root>
