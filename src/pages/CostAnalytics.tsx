import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  Flex,
  Grid,
  Heading,
  Progress,
  Table,
  Text,
  Select,
  TextField,
  Badge,
  Switch
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
  Legend,
} from 'recharts';

// أنواع البيانات
type CostCategory = 'Direct Materials' | 'Packaging Materials' | 'Direct Labor' | 'Overhead' | 'Other Costs';

type CostRow = {
  id: string;
  category: CostCategory;
  actual: number;
  budget: number;
  costAfter: number;
};

type ItemDetail = {
  id: string;
  name: string;
  qty?: number;
  unitPrice?: number;
  concentrationKg?: number;
  pricePerKg?: number;
  hours?: number;
  hourlyRate?: number;
  cost: number;
};

type DetailViewMode = 'actual' | 'target';

// خيارات الحلول
const SOLUTION_OPTIONS = [
  'Negotiating Better Prices With Supplier',
  'Reducing Waste In Material Usage',
  'Automation To Reduce Manual Labor Costs',
  'Optimizing Machine Usage',
  'Improving Inventory Management',
  'Minimize Transportation Costs',
  'Reduce Rework Costs',
  'Other'
] as const;

type SolutionOption = typeof SOLUTION_OPTIONS[number];

// بيانات عينة
const SAMPLE_DATA: CostRow[] = [
  { id: '1', category: 'Direct Materials', actual: 133.11, budget: 140, costAfter: 120 },
  { id: '2', category: 'Packaging Materials', actual: 45, budget: 50, costAfter: 43 },
  { id: '3', category: 'Direct Labor', actual: 38, budget: 40, costAfter: 37 },
  { id: '4', category: 'Overhead', actual: 30, budget: 32, costAfter: 29 },
  { id: '5', category: 'Other Costs', actual: 20, budget: 25, costAfter: 19 }
];

const DETAIL_DATA: Record<CostCategory, {actual: ItemDetail[], target: ItemDetail[]}> = {
  'Direct Materials': {
    actual: [
      { id: 'dm1', name: 'Raw Material A', concentrationKg: 10, pricePerKg: 5, cost: 50 },
      { id: 'dm2', name: 'Raw Material B', concentrationKg: 8, pricePerKg: 4.5, cost: 36 }
    ],
    target: [
      { id: 'dm1', name: 'Raw Material A', concentrationKg: 8, pricePerKg: 4.5, cost: 36 },
      { id: 'dm2', name: 'Raw Material B', concentrationKg: 7, pricePerKg: 4, cost: 28 }
    ]
  },
  'Packaging Materials': {
    actual: [
      { id: 'pm1', name: 'Packaging A', qty: 100, unitPrice: 0.45, cost: 45 }
    ],
    target: [
      { id: 'pm1', name: 'Packaging A', qty: 90, unitPrice: 0.40, cost: 36 }
    ]
  },
  'Direct Labor': {
    actual: [
      { id: 'dl1', name: 'Operator A', hours: 40, hourlyRate: 0.95, cost: 38 }
    ],
    target: [
      { id: 'dl1', name: 'Operator A', hours: 38, hourlyRate: 0.90, cost: 34.2 }
    ]
  },
  'Overhead': {
    actual: [
      { id: 'oh1', name: 'Electricity', cost: 30 }
    ],
    target: [
      { id: 'oh1', name: 'Electricity', cost: 28 }
    ]
  },
  'Other Costs': {
    actual: [
      { id: 'oc1', name: 'Miscellaneous', cost: 20 }
    ],
    target: [
      { id: 'oc1', name: 'Miscellaneous', cost: 18 }
    ]
  }
};

const CostAnalysisDashboard = () => {
  // حالات التطبيق
  const [currency, setCurrency] = useState<'EGP' | 'USD'>('EGP');
  const [autoMode, setAutoMode] = useState(true);
  const [benchmarkPrice, setBenchmarkPrice] = useState(220);
  const [profitMargin, setProfitMargin] = useState(25);
  const [showGap, setShowGap] = useState(false);
  const [detailCategory, setDetailCategory] = useState<CostCategory | null>(null);
  const [detailMode, setDetailMode] = useState<DetailViewMode>('actual');
  const [solutions, setSolutions] = useState<Record<string, SolutionOption>>({});
  const [costData, setCostData] = useState<CostRow[]>(SAMPLE_DATA);

  // الحسابات
  const totalActual = costData.reduce((sum, item) => sum + item.actual, 0);
  const totalBudget = costData.reduce((sum, item) => sum + item.budget, 0);
  const totalCostAfter = costData.reduce((sum, item) => sum + item.costAfter, 0);
  const targetCost = benchmarkPrice * (1 - profitMargin / 100);
  const averageGap = totalActual - targetCost;

  // تنسيق العملة
  const formatCurrency = (value: number) => {
    return `${currency} ${value.toFixed(2)}`;
  };

  // معالجة تغيير الحلول
  const handleSolutionChange = (category: CostCategory, itemId: string, value: SolutionOption) => {
    setSolutions(prev => ({
      ...prev,
      [`${category}-${itemId}`]: value
    }));
  };

  // معالجة تغيير الميزانية
  const handleBudgetChange = (id: string, value: number) => {
    setCostData(prev => 
      prev.map(item => 
        item.id === id ? { ...item, budget: value } : item
      )
    );
  };

  // فتح تفاصيل الفئة
  const handleDetailOpen = (category: CostCategory) => {
    setDetailCategory(category);
    setDetailMode('actual');
  };

  // تبديل وضع التفاصيل
  const toggleDetailMode = () => {
    setDetailMode(prev => prev === 'actual' ? 'target' : 'actual');
  };

  // تقديم التقرير
  const handleSubmitReport = () => {
    const report = {
      costData,
      solutions,
      totals: {
        actual: totalActual,
        budget: totalBudget,
        costAfter: totalCostAfter,
        targetCost,
        profitMargin
      },
      timestamp: new Date().toISOString()
    };
    console.log('Cost Analysis Report:', report);
    alert('Report submitted successfully!');
  };

  return (
    <Box p="6" style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* رأس الصفحة */}
      <Flex justify="between" align="center" mb="4">
        <Heading size="6">Cost Analysis Dashboard</Heading>
        <Flex gap="3">
          <Select.Root value={currency} onValueChange={(val) => setCurrency(val as 'EGP' | 'USD')}>
            <Select.Trigger />
            <Select.Content>
              <Select.Item value="EGP">EGP</Select.Item>
              <Select.Item value="USD">USD</Select.Item>
            </Select.Content>
          </Select.Root>
          <Button onClick={() => setShowGap(!showGap)}>
            {showGap ? 'Hide Gap Analysis' : 'Show Gap Analysis'}
          </Button>
        </Flex>
      </Flex>

      {/* بطاقات الملخص */}
      <Grid columns="3" gap="4" mb="6">
        <Box style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 16, backgroundColor: 'white' }}>
          <Text size="2" color="gray">Actual Cost</Text>
          <Heading size="6">{formatCurrency(totalActual)}</Heading>
        </Box>
        <Box style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 16, backgroundColor: 'white' }}>
          <Text size="2" color="gray">Target Cost</Text>
          <Heading size="6">{formatCurrency(totalBudget)}</Heading>
        </Box>
        <Box style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 16, backgroundColor: 'white' }}>
          <Text size="2" color="gray">Cost Gap</Text>
          <Heading size="6" color={averageGap >= 0 ? 'green' : 'red'}>
            {formatCurrency(Math.abs(averageGap))} {averageGap >= 0 ? 'Under' : 'Over'}
          </Heading>
        </Box>
      </Grid>

      {/* الجدول الرئيسي */}
      <Table.Root variant="surface" mb="6">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Cost Category</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actual Cost</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Target Cost</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Variance</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>% of Total</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Cost After Optimization</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Details</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {costData.map((item) => {
            const variance = item.budget - item.actual;
            const percentOfTotal = (item.actual / totalActual) * 100;
            
            return (
              <Table.Row key={item.id}>
                <Table.Cell>{item.category}</Table.Cell>
                <Table.Cell>{formatCurrency(item.actual)}</Table.Cell>
                <Table.Cell>
                  <TextField.Root
                    type="number"
                    value={item.budget}
                    onChange={(e) => handleBudgetChange(item.id, parseFloat(e.target.value) || 0)}
                  />
                </Table.Cell>
                <Table.Cell>
                  <Badge color={variance >= 0 ? 'green' : 'red'}>
                    {formatCurrency(Math.abs(variance))} {variance >= 0 ? 'Under' : 'Over'}
                  </Badge>
                </Table.Cell>
                <Table.Cell>{percentOfTotal.toFixed(1)}%</Table.Cell>
                <Table.Cell>{formatCurrency(item.costAfter)}</Table.Cell>
                <Table.Cell>
                  <Button size="1" onClick={() => handleDetailOpen(item.category)}>
                    View Details
                  </Button>
                </Table.Cell>
              </Table.Row>
            );
          })}
          <Table.Row>
            <Table.Cell><Text weight="bold">Total</Text></Table.Cell>
            <Table.Cell><Text weight="bold">{formatCurrency(totalActual)}</Text></Table.Cell>
            <Table.Cell><Text weight="bold">{formatCurrency(totalBudget)}</Text></Table.Cell>
            <Table.Cell>
              <Badge color={totalBudget - totalActual >= 0 ? 'green' : 'red'}>
                {formatCurrency(Math.abs(totalBudget - totalActual))}
              </Badge>
            </Table.Cell>
            <Table.Cell><Text weight="bold">100%</Text></Table.Cell>
            <Table.Cell><Text weight="bold">{formatCurrency(totalCostAfter)}</Text></Table.Cell>
            <Table.Cell></Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>

      {/* تفاصيل الفئة */}
      <Dialog.Root open={!!detailCategory} onOpenChange={(open) => !open && setDetailCategory(null)}>
        <Dialog.Content style={{ maxWidth: 800 }}>
          <Flex justify="between" align="center" mb="4">
            <Dialog.Title>
              {detailCategory} Details - {detailMode === 'actual' ? 'Actual' : 'Target'} View
            </Dialog.Title>
            <Flex gap="3" align="center">
              <Text>Auto IoT Mode</Text>
              <Switch checked={autoMode} onCheckedChange={setAutoMode} />
              <Button variant="soft" onClick={toggleDetailMode}>
                Switch to {detailMode === 'actual' ? 'Target' : 'Actual'}
              </Button>
            </Flex>
          </Flex>

          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Item</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Qty/Units</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Unit Price</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Total Cost</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Solution</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {detailCategory && DETAIL_DATA[detailCategory][detailMode].map((item) => (
                <Table.Row key={item.id}>
                  <Table.Cell>{item.name}</Table.Cell>
                  <Table.Cell>
                    {autoMode ? (
                      item.concentrationKg ? item.concentrationKg.toFixed(3) :
                      item.hours ? item.hours :
                      item.qty ? item.qty : '-'
                    ) : (
                      <TextField.Root
                        type="number"
                        value={
                          item.concentrationKg ? item.concentrationKg :
                          item.hours ? item.hours :
                          item.qty ? item.qty : 0
                        }
                        onChange={(e) => {
                          // تحديث القيمة يدوياً
                        }}
                      />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {autoMode ? (
                      formatCurrency(
                        item.pricePerKg ? item.pricePerKg :
                        item.hourlyRate ? item.hourlyRate :
                        item.unitPrice ? item.unitPrice : 0
                      )
                    ) : (
                      <TextField.Root
                        type="number"
                        value={
                          item.pricePerKg ? item.pricePerKg :
                          item.hourlyRate ? item.hourlyRate :
                          item.unitPrice ? item.unitPrice : 0
                        }
                        onChange={(e) => {
                          // تحديث القيمة يدوياً
                        }}
                      />
                    )}
                  </Table.Cell>
                  <Table.Cell>{formatCurrency(item.cost)}</Table.Cell>
                  <Table.Cell>
                    <Select.Root
                      value={solutions[`${detailCategory}-${item.id}`] || ''}
                      onValueChange={(value) => 
                        handleSolutionChange(detailCategory, item.id, value as SolutionOption)
                      }
                    >
                      <Select.Trigger placeholder="Select solution" />
                      <Select.Content>
                        {SOLUTION_OPTIONS.map((option) => (
                          <Select.Item key={option} value={option}>
                            {option}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>

          <Flex justify="end" gap="3" mt="4">
            <Button variant="soft" onClick={() => setDetailCategory(null)}>
              Close
            </Button>
            <Button onClick={() => alert('Changes saved successfully!')}>
              Save Changes
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      {/* المخططات */}
      <Flex gap="4" mt="6">
        {/* مخطط دائري */}
        <Box style={{ flex: 1, border: '1px solid #e2e8f0', borderRadius: 8, padding: 16, backgroundColor: 'white' }}>
          <Heading size="4" mb="3">Cost Composition</Heading>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={costData.map(item => ({
                  name: item.category,
                  value: item.actual
                }))}
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {costData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={['#3b82f6', '#f59e0b', '#ef4444', '#10b981', '#a855f7'][index]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        {/* مخطط خطي */}
        <Box style={{ flex: 1, border: '1px solid #e2e8f0', borderRadius: 8, padding: 16, backgroundColor: 'white' }}>
          <Heading size="4" mb="3">Cost Trend Analysis</Heading>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={[
              { month: 'Jan', actual: 130, target: 120 },
              { month: 'Feb', actual: 135, target: 120 },
              { month: 'Mar', actual: 140, target: 120 },
              { month: 'Apr', actual: 138, target: 120 },
              { month: 'May', actual: totalActual, target: targetCost }
            ]}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Line type="monotone" dataKey="actual" stroke="#3b82f6" name="Actual Cost" />
              <Line type="monotone" dataKey="target" stroke="#10b981" name="Target Cost" />
              {showGap && (
                <Line 
                  type="monotone" 
                  dataKey={data => data.actual - data.target} 
                  stroke="#ef4444" 
                  name="Cost Gap" 
                  strokeDasharray="5 5"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Flex>

      {/* تقديم التقرير */}
      <Flex justify="end" mt="6">
        <Button onClick={handleSubmitReport} style={{ backgroundColor: '#10b981', color: 'white' }}>
          Submit Final Report
        </Button>
      </Flex>
    </Box>
  );
};

export default CostAnalysisDashboard;
