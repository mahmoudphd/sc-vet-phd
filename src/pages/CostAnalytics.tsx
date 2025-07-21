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
  Switch,
  Table,
  Text,
  Select as RadixSelect,
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
import { simulatedIoTCostData, Item, CostCategory } from './simulateIoTCostData';
import { DollarSign, Package, Users, Activity, MoreHorizontal, PieChart as PieIcon, TrendingUp } from 'lucide-react';

const formatCurrency = (value: number, currency: string) =>
  `${currency} ${value.toFixed(2)}`;

const categories: CostCategory[] = [
  'Direct Materials',
  'Packaging Materials',
  'Direct Labor',
  'Overhead',
  'Other Costs',
];

const products = ['Product A', 'Product B', 'Product C'];

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

function CostAnalytics() {
  const [dialogCategory, setDialogCategory] = useState<CostCategory | null>(null);
  const [benchmarkPrice, setBenchmarkPrice] = useState(220);
  const [profitMargin, setProfitMargin] = useState(25);
  const [currency, setCurrency] = useState<'EGP' | 'USD'>('EGP');
  const [autoMode, setAutoMode] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [showCostGap, setShowCostGap] = useState(true);
  const [data, setData] = useState(simulatedIoTCostData);
  const [solutions, setSolutions] = useState<Record<CostCategory, Record<number, string>>>({
    'Direct Materials': {},
    'Packaging Materials': {},
    'Direct Labor': {},
    'Overhead': {},
    'Other Costs': {},
  });

  const totals = data.totals;
  const totalActual = categories.reduce((sum, category) => sum + totals[category].actual, 0);
  const totalTarget = categories.reduce((sum, category) => sum + totals[category].budget, 0);
  const totalCostAfter = categories.reduce((sum, category) => sum + totals[category].costAfter, 0);
  const targetCost = benchmarkPrice * (1 - profitMargin / 100);
  const postOptimizationEstimate = totalCostAfter * (1 - profitMargin / 100);

  const benchmarkTrendData = [
    { month: 'Jan', actual: 169.61, benchmark: benchmarkPrice },
    { month: 'Feb', actual: 170.5, benchmark: benchmarkPrice },
    { month: 'Mar', actual: 168.0, benchmark: benchmarkPrice },
    { month: 'Apr', actual: 171.2, benchmark: benchmarkPrice },
    { month: 'May', actual: totalActual, benchmark: benchmarkPrice },
  ];

  const pieColors = ['#3b82f6', '#f59e0b', '#ef4444', '#10b981', '#6366f1'];

  const percentOfTotal = (category: CostCategory) =>
    totalActual === 0 ? '0.00' : ((totals[category].actual / totalActual) * 100).toFixed(2);
  return (
    <Box p="6" style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <Flex justify="between" align="center" mb="5" wrap="wrap" gap="3">
        <Heading size="6">Inter-Organizational Cost Management</Heading>
        <Flex gap="3" align="center" wrap="wrap">
          <Text>Product:</Text>
          <RadixSelect.Root
            value={selectedProduct}
            onValueChange={(value) => setSelectedProduct(value)}
          >
            <RadixSelect.Trigger aria-label="Select product" />
            <RadixSelect.Content>
              {products.map((p) => (
                <RadixSelect.Item key={p} value={p}>
                  {p}
                </RadixSelect.Item>
              ))}
            </RadixSelect.Content>
          </RadixSelect.Root>
          <RadixSelect.Root
            value={currency}
            onValueChange={(value) => setCurrency(value as 'EGP' | 'USD')}
          >
            <RadixSelect.Trigger aria-label="Select currency" />
            <RadixSelect.Content>
              <RadixSelect.Item value="EGP">EGP</RadixSelect.Item>
              <RadixSelect.Item value="USD">USD</RadixSelect.Item>
            </RadixSelect.Content>
          </RadixSelect.Root>
          <Button onClick={() => alert('Export Report functionality not implemented yet.')}>
            Export Report
          </Button>
        </Flex>
      </Flex>

      <Grid columns={{ initial: '3', md: '3' }} gap="4" mb="6">
        <Box style={{ border: '1px solid #ccc', borderRadius: 8, padding: 12, backgroundColor: '#e0f2fe' }}>
          <Flex align="center" gap="2">
            <DollarSign color="#0284c7" />
            <Text size="2">Actual Cost</Text>
          </Flex>
          <Heading size="6">{formatCurrency(totalActual, currency)}</Heading>
        </Box>
        <Box style={{ border: '1px solid #ccc', borderRadius: 8, padding: 12, backgroundColor: '#dcfce7' }}>
          <Flex align="center" gap="2">
            <TrendingUp color="#16a34a" />
            <Text size="2">Target Cost</Text>
          </Flex>
          <Heading size="6">{formatCurrency(totalTarget, currency)}</Heading>
        </Box>
        <Box style={{ border: '1px solid #ccc', borderRadius: 8, padding: 12, backgroundColor: '#fef9c3' }}>
          <Flex align="center" gap="2">
            <Activity color="#ca8a04" />
            <Text size="2">Cost After Optimization</Text>
          </Flex>
          <Heading size="6">{formatCurrency(totalCostAfter, currency)}</Heading>
        </Box>
      </Grid>
      <Grid columns={{ initial: '2', md: '2' }} gap="4" mb="6">
        <Box style={{ border: '1px solid #ccc', borderRadius: 8, padding: 12, backgroundColor: '#fff' }}>
          <Heading size="4" mb="2">Cost Distribution</Heading>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categories.map((category) => ({
                  name: category,
                  value: totals[category].actual,
                }))}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {categories.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        <Box style={{ border: '1px solid #ccc', borderRadius: 8, padding: 12, backgroundColor: '#fff' }}>
          <Heading size="4" mb="2">Benchmark Trend</Heading>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={showCostGap ? benchmarkTrendDataWithGap : benchmarkTrendData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="actual" stroke="#3b82f6" />
              <Line type="monotone" dataKey="benchmark" stroke="#f59e0b" />
              {showCostGap && <Line type="monotone" dataKey="gap" stroke="#ef4444" />}
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Grid>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Category</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actual</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Cost After Optimization</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Target (Editable)</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>% of Total</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>View Details</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {categories.map((category) => (
            <Table.Row key={category}>
              <Table.RowHeaderCell>{category}</Table.RowHeaderCell>
              <Table.Cell>{formatCurrency(totals[category].actual, currency)}</Table.Cell>
              <Table.Cell>{formatCurrency(totals[category].costAfter, currency)}</Table.Cell>
              <Table.Cell>
                <input
                  type="number"
                  value={totals[category].budget}
                  onChange={(e) => handleTargetChange(category, parseFloat(e.target.value) || 0)}
                  style={{ width: '80px' }}
                />
              </Table.Cell>
              <Table.Cell>{percentOfTotal(category)}%</Table.Cell>
              <Table.Cell>
                <Button onClick={() => setDialogCategory(category)}>View Details</Button>
              </Table.Cell>
            </Table.Row>
          ))}
          <Table.Row>
            <Table.RowHeaderCell><b>Total</b></Table.RowHeaderCell>
            <Table.Cell><b>{formatCurrency(totalActual, currency)}</b></Table.Cell>
            <Table.Cell><b>{formatCurrency(totalCostAfter, currency)}</b></Table.Cell>
            <Table.Cell><b>{formatCurrency(totalTarget, currency)}</b></Table.Cell>
            <Table.Cell><b>100%</b></Table.Cell>
            <Table.Cell></Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
{dialogCategory && (
  <Dialog.Root open onOpenChange={() => setDialogCategory(null)}>
    <Dialog.Content
      maxWidth="700px"
      style={{ maxHeight: '80vh', overflowY: 'auto' }}
    >
      <Dialog.Title>{dialogCategory} Breakdown</Dialog.Title>
      <Flex justify="between" align="center" mb="3" mt="3">
        <Text>Auto Mode</Text>
        <Switch
          checked={autoMode}
          onCheckedChange={(checked) => setAutoMode(checked)}
        />
      </Flex>

      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Item</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Qty / Hours / Kg</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>
              Unit Price / Hourly Rate / PricePerKg
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Cost</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Solution</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {getDetailsByCategory(dialogCategory).map((item, index) => {
            let costValue = item.cost ?? 0;
            if (autoMode) {
              if (dialogCategory === 'Direct Materials') {
                costValue = (item.concentrationKg ?? 0) * (item.pricePerKg ?? 0);
              } else if (dialogCategory === 'Direct Labor') {
                costValue = (item.hours ?? 0) * (item.hourlyRate ?? 0);
              } else {
                costValue = (item.qty ?? 0) * (item.unitPrice ?? 0);
              }
            }
            return (
              <Table.Row key={index}>
                <Table.RowHeaderCell>{item.name}</Table.RowHeaderCell>
                <Table.Cell>
                  {autoMode ? (
                    dialogCategory === 'Direct Materials' ? (
                      item.concentrationKg?.toFixed(3) ?? '-'
                    ) : dialogCategory === 'Direct Labor' ? (
                      item.hours ?? '-'
                    ) : (
                      item.qty ?? '-'
                    )
                  ) : (
                    <input
                      type="number"
                      value={
                        dialogCategory === 'Direct Materials'
                          ? item.concentrationKg ?? 0
                          : dialogCategory === 'Direct Labor'
                          ? item.hours ?? 0
                          : item.qty ?? 0
                      }
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0;
                        if (dialogCategory === 'Direct Materials')
                          item.concentrationKg = value;
                        else if (dialogCategory === 'Direct Labor') item.hours = value;
                        else item.qty = value;
                        setData({ ...data }); // trigger re-render
                      }}
                      style={{ width: '80px' }}
                    />
                  )}
                </Table.Cell>
                <Table.Cell>
                  {autoMode ? (
                    dialogCategory === 'Direct Materials' ? (
                      item.pricePerKg ? (
                        formatCurrency(item.pricePerKg, currency)
                      ) : (
                        '-'
                      )
                    ) : dialogCategory === 'Direct Labor' ? (
                      item.hourlyRate ? (
                        formatCurrency(item.hourlyRate, currency)
                      ) : (
                        '-'
                      )
                    ) : item.unitPrice ? (
                      formatCurrency(item.unitPrice, currency)
                    ) : (
                      '-'
                    )
                  ) : (
                    <input
                      type="number"
                      value={
                        dialogCategory === 'Direct Materials'
                          ? item.pricePerKg ?? 0
                          : dialogCategory === 'Direct Labor'
                          ? item.hourlyRate ?? 0
                          : item.unitPrice ?? 0
                      }
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0;
                        if (dialogCategory === 'Direct Materials')
                          item.pricePerKg = value;
                        else if (dialogCategory === 'Direct Labor') item.hourlyRate = value;
                        else item.unitPrice = value;
                        setData({ ...data }); // trigger re-render
                      }}
                      style={{ width: '80px' }}
                    />
                  )}
                </Table.Cell>
                <Table.Cell>{formatCurrency(costValue, currency)}</Table.Cell>
                <Table.Cell>
                  <RadixSelect.Root
                    value={solutions[dialogCategory]?.[index] || ''}
                    onValueChange={(value) =>
                      handleSolutionChange(dialogCategory, index, value)
                    }
                  >
                    <RadixSelect.Trigger aria-label="Select solution" />
                    <RadixSelect.Content>
                      {solutionsOptions.map((sol) => (
                        <RadixSelect.Item key={sol} value={sol}>
                          {sol}
                        </RadixSelect.Item>
                      ))}
                    </RadixSelect.Content>
                  </RadixSelect.Root>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Root>

      <Flex justify="end" gap="3" mt="4">
        <Button style={{ backgroundColor: '#10b981', color: '#fff' }}>Submit</Button>
        <Button
          variant="ghost"
          style={{ backgroundColor: '#3b82f6', color: '#fff' }}
          onClick={() => setDialogCategory(null)}
        >
          Close
        </Button>
      </Flex>
    </Dialog.Content>
  </Dialog.Root>
)}
{/* Benchmark Trend Line Chart */}
<Box my="6" style={{ height: 300, backgroundColor: '#fff', padding: 20, borderRadius: 8 }}>
  <Heading size="5" mb="3">Benchmark Trend</Heading>
  <ResponsiveContainer width="100%" height="90%">
    <LineChart data={benchmarkTrendDataWithGap} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="actual" stroke="#3b82f6" name="Actual Cost" />
      <Line type="monotone" dataKey="benchmark" stroke="#10b981" name="Benchmark Price" />
      <Line type="monotone" dataKey="targetCost" stroke="#f59e0b" name="Target Cost" />
    </LineChart>
  </ResponsiveContainer>
</Box>

{/* Cost Category Pie Chart */}
<Box my="6" style={{ height: 300, backgroundColor: '#fff', padding: 20, borderRadius: 8 }}>
  <Heading size="5" mb="3">Cost Distribution</Heading>
  <ResponsiveContainer width="100%" height="90%">
    <PieChart>
      <Pie
        data={categories.map((cat) => ({
          name: cat,
          value: totals[cat].actual,
        }))}
        dataKey="value"
        nameKey="name"
        outerRadius={100}
        fill="#8884d8"
        label={(entry) => `${entry.name} (${percentOfTotal(entry.name as CostCategory)}%)`}
      >
        {categories.map((_, index) => (
          <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
</Box>
{/* Summary Cards with Icons and Colors */}
<Grid columns={{ initial: '3', md: '3' }} gap="4" mb="6">
  {categories.map((category, index) => {
    const colors = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];
    const icons = [
      '📦', // Direct Materials
      '📦', // Packaging Materials
      '👷‍♂️', // Direct Labor
      '🏭', // Overhead
      '💼', // Other Costs
    ];
    return (
      <Box
        key={category}
        style={{
          border: `2px solid ${colors[index]}`,
          borderRadius: 8,
          padding: 16,
          backgroundColor: '#fff',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <Text style={{ fontSize: 24 }}>{icons[index]}</Text>
        <Box>
          <Text size="2" weight="medium" color={colors[index]}>
            {category}
          </Text>
          <Heading size="5">{formatCurrency(totals[category].actual, currency)}</Heading>
        </Box>
      </Box>
    );
  })}
</Grid>
{dialogCategory && (
  <Dialog.Root open onOpenChange={() => setDialogCategory(null)}>
    <Dialog.Content
      maxWidth="700px"
      style={{
        maxHeight: '70vh',
        overflowY: 'auto',
        padding: '20px',
      }}
    >
      <Dialog.Title>{dialogCategory} Breakdown</Dialog.Title>
      <Flex justify="between" align="center" mb="3" mt="3">
        <Text>Auto Mode</Text>
        <Switch checked={autoMode} onCheckedChange={setAutoMode} />
      </Flex>

      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Item</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Qty / Hours / Kg</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Unit Price / Hourly Rate / PricePerKg</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Cost</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Solution</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {getDetailsByCategory(dialogCategory).map((item, index) => {
            let costValue = item.cost ?? 0;
            if (autoMode) {
              if (dialogCategory === 'Direct Materials') {
                costValue = (item.concentrationKg ?? 0) * (item.pricePerKg ?? 0);
              } else if (dialogCategory === 'Direct Labor') {
                costValue = (item.hours ?? 0) * (item.hourlyRate ?? 0);
              } else {
                costValue = (item.qty ?? 0) * (item.unitPrice ?? 0);
              }
            }
            return (
              <Table.Row key={index}>
                <Table.RowHeaderCell>{item.name}</Table.RowHeaderCell>
                <Table.Cell>
                  {autoMode ? (
                    dialogCategory === 'Direct Materials'
                      ? item.concentrationKg?.toFixed(3) ?? '-'
                      : dialogCategory === 'Direct Labor'
                      ? item.hours ?? '-'
                      : item.qty ?? '-'
                  ) : (
                    <input
                      type="number"
                      value={
                        dialogCategory === 'Direct Materials'
                          ? item.concentrationKg ?? 0
                          : dialogCategory === 'Direct Labor'
                          ? item.hours ?? 0
                          : item.qty ?? 0
                      }
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0;
                        if (dialogCategory === 'Direct Materials') item.concentrationKg = value;
                        else if (dialogCategory === 'Direct Labor') item.hours = value;
                        else item.qty = value;
                      }}
                      style={{ width: '80px' }}
                    />
                  )}
                </Table.Cell>
                <Table.Cell>
                  {autoMode ? (
                    dialogCategory === 'Direct Materials'
                      ? item.pricePerKg
                        ? formatCurrency(item.pricePerKg, currency)
                        : '-'
                      : dialogCategory === 'Direct Labor'
                      ? item.hourlyRate
                        ? formatCurrency(item.hourlyRate, currency)
                        : '-'
                      : item.unitPrice
                      ? formatCurrency(item.unitPrice, currency)
                      : '-'
                  ) : (
                    <input
                      type="number"
                      value={
                        dialogCategory === 'Direct Materials'
                          ? item.pricePerKg ?? 0
                          : dialogCategory === 'Direct Labor'
                          ? item.hourlyRate ?? 0
                          : item.unitPrice ?? 0
                      }
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0;
                        if (dialogCategory === 'Direct Materials') item.pricePerKg = value;
                        else if (dialogCategory === 'Direct Labor') item.hourlyRate = value;
                        else item.unitPrice = value;
                      }}
                      style={{ width: '80px' }}
                    />
                  )}
                </Table.Cell>
                <Table.Cell>{formatCurrency(costValue, currency)}</Table.Cell>
                <Table.Cell>
                  <RadixSelect.Root
                    value={solutions[dialogCategory]?.[index] || ''}
                    onValueChange={(value) => handleSolutionChange(dialogCategory, index, value)}
                  >
                    <RadixSelect.Trigger aria-label="Select solution" />
                    <RadixSelect.Content>
                      {solutionsOptions.map((sol) => (
                        <RadixSelect.Item key={sol} value={sol}>
                          {sol}
                        </RadixSelect.Item>
                      ))}
                    </RadixSelect.Content>
                  </RadixSelect.Root>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Root>

      <Flex justify="end" gap="3" mt="4">
        <Button style={{ backgroundColor: '#10b981', color: '#fff' }}>Submit</Button>
        <Button variant="ghost" style={{ backgroundColor: '#3b82f6', color: '#fff' }} onClick={() => setDialogCategory(null)}>
          Close
        </Button>
      </Flex>
    </Dialog.Content>
  </Dialog.Root>
)}
<Box mt="8" style={{ backgroundColor: '#fff', padding: 20, borderRadius: 8 }}>
  <Heading size="5" mb="4">Cost Trend and Benchmark Analysis</Heading>
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={benchmarkTrendDataWithGap} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="actual" stroke="#3b82f6" name="Actual Cost" />
      <Line type="monotone" dataKey="benchmark" stroke="#10b981" name="Benchmark Price" />
      <Line type="monotone" dataKey="targetCost" stroke="#f59e0b" name="Target Cost" />
    </LineChart>
  </ResponsiveContainer>

  <Heading size="6" mt="6" mb="2">Cost Distribution</Heading>
  <ResponsiveContainer width="100%" height={250}>
    <PieChart>
      <Pie
        data={categories.map((cat) => ({
          name: cat,
          value: totals[cat].actual,
        }))}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={80}
        label
      >
        {categories.map((cat, index) => (
          <Cell key={`cell-${index}`} fill={['#3b82f6', '#f59e0b', '#ef4444', '#10b981', '#8b5cf6'][index]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
</Box>
  const handleExportReport = () => {
    // Placeholder for export functionality
    alert('Export Report functionality not implemented yet.');
  };

  return (
    <Box p="6" style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* ... الأجزاء السابقة من الواجهة هنا ... */}

      {/* أزرار أسفل الصفحة */}
      <Flex justify="center" mt="6" gap="4" wrap="wrap">
        <Button
          style={{ backgroundColor: '#10b981', color: '#fff' }}
          onClick={() => alert('Submitting data...')}
        >
          Submit to Blockchain
        </Button>
        <Button
          variant="outline"
          onClick={handleExportReport}
        >
          Export Report
        </Button>
      </Flex>
    </Box>
  );
}

export default CostAnalytics;
