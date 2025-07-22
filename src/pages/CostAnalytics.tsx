import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  Flex,
  Grid,
  Heading,
  Switch,
  Table,
  Text,
  Select as RadixSelect,
} from '@radix-ui/themes';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import { simulatedIoTCostData, Item, CostCategory } from './simulateIoTCostData';

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

const pieColors = ['#3b82f6', '#f59e0b', '#ef4444', '#10b981', '#6366f1'];

const formatCurrency = (value: number, currency: string) =>
  `${currency} ${value.toFixed(2)}`;
function CostAnalytics() {
  const [dialogCategory, setDialogCategory] = useState<CostCategory | null>(null);
  const [benchmarkPrice, setBenchmarkPrice] = useState(220);
  const [profitMargin, setProfitMargin] = useState(25);
  const [currency, setCurrency] = useState<'EGP' | 'USD'>('EGP');
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [autoMode, setAutoMode] = useState(true);
  const [showInsights, setShowInsights] = useState(false);
  const [solutions, setSolutions] = useState<Record<CostCategory, Record<number, string>>>({
    'Direct Materials': {},
    'Packaging Materials': {},
    'Direct Labor': {},
    'Overhead': {},
    'Other Costs': {},
  });
  const [data, setData] = useState(simulatedIoTCostData);

  const totals = data.totals;
  const totalActual = categories.reduce((sum, cat) => sum + totals[cat].actual, 0);
  const totalTarget = categories.reduce((sum, cat) => sum + totals[cat].budget, 0);
  const totalCostAfter = categories.reduce((sum, cat) => sum + totals[cat].costAfter, 0);
  const targetCost = benchmarkPrice * (1 - profitMargin / 100);

  const benchmarkTrendData = [
    { month: 'Jan', actual: 169, benchmark: benchmarkPrice },
    { month: 'Feb', actual: 170, benchmark: benchmarkPrice },
    { month: 'Mar', actual: 168, benchmark: benchmarkPrice },
    { month: 'Apr', actual: 171, benchmark: benchmarkPrice },
    { month: 'May', actual: totalActual, benchmark: benchmarkPrice },
  ];
  return (
    <Box p="5" style={{ background: '#f9fafb', minHeight: '100vh' }}>
      <Flex justify="between" align="center" mb="4" wrap="wrap" gap="2">
        <Heading size="6">Inter-Organizational Cost Management</Heading>
        <Flex gap="2" align="center" wrap="wrap">
          <Text>Product:</Text>
          <RadixSelect.Root value={selectedProduct} onValueChange={setSelectedProduct}>
            <RadixSelect.Trigger />
            <RadixSelect.Content>
              {products.map((p) => (
                <RadixSelect.Item key={p} value={p}>{p}</RadixSelect.Item>
              ))}
            </RadixSelect.Content>
          </RadixSelect.Root>
          <Text>Currency:</Text>
          <RadixSelect.Root value={currency} onValueChange={(v) => setCurrency(v as 'EGP' | 'USD')}>
            <RadixSelect.Trigger />
            <RadixSelect.Content>
              <RadixSelect.Item value="EGP">EGP</RadixSelect.Item>
              <RadixSelect.Item value="USD">USD</RadixSelect.Item>
            </RadixSelect.Content>
          </RadixSelect.Root>
          <Button>Export Report</Button>
        </Flex>
      </Flex>
      {/* Cards: 3 top + 3 bottom */}
      <Grid columns={{ initial: '3', md: '3' }} gap="4" mb="4">
        <Box style={{ background: '#fff', borderRadius: 8, padding: 12 }}>
          <Text size="2">Actual Cost</Text>
          <Heading size="6">{formatCurrency(totalActual, currency)}</Heading>
        </Box>
        <Box style={{ background: '#fff', borderRadius: 8, padding: 12 }}>
          <Text size="2">Target Cost</Text>
          <Heading size="6">{formatCurrency(totalTarget, currency)}</Heading>
        </Box>
        <Box style={{ background: '#fff', borderRadius: 8, padding: 12 }}>
          <Flex justify="between" align="center">
            <Text size="2">Benchmark Price</Text>
            <Button size="1" variant="outline" onClick={() => setShowInsights(true)}>Insights</Button>
          </Flex>
          <input
            type="number"
            value={benchmarkPrice}
            onChange={(e) => setBenchmarkPrice(parseFloat(e.target.value) || 0)}
            style={{ width: '100%', marginTop: 4 }}
          />
        </Box>
      </Grid>

      <Grid columns={{ initial: '3', md: '3' }} gap="4" mb="4">
        <Box style={{ background: '#fff', borderRadius: 8, padding: 12 }}>
          <Text size="2">Profit Margin (%)</Text>
          <input
            type="number"
            value={profitMargin}
            onChange={(e) => setProfitMargin(parseFloat(e.target.value) || 0)}
            style={{ width: '100%', marginTop: 4 }}
          />
        </Box>
        <Box style={{ background: '#fff', borderRadius: 8, padding: 12 }}>
          <Text size="2">Progress To Target</Text>
          <Heading size="6">{((totalActual / targetCost) * 100).toFixed(1)}%</Heading>
        </Box>
        <Box style={{ background: '#fff', borderRadius: 8, padding: 12 }}>
          <Text size="2">Post-Optimization Estimate</Text>
          <Heading size="6">{formatCurrency(totalCostAfter, currency)}</Heading>
        </Box>
      </Grid>
      <Flex justify="between" align="center" mb="3">
        <Heading size="5">Cost Distribution & Trend</Heading>
        <Button variant="outline">Show Gap Analysis</Button>
      </Flex>

      <Grid columns={{ initial: '2', md: '2' }} gap="4" mb="6">
        <Box style={{ background: '#fff', borderRadius: 8, padding: 12 }}>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categories.map((cat, idx) => ({ name: cat, value: totals[cat].actual }))}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {categories.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </Box>
        <Box style={{ background: '#fff', borderRadius: 8, padding: 12 }}>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={benchmarkTrendData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="actual" stroke="#3b82f6" />
              <Line type="monotone" dataKey="benchmark" stroke="#f59e0b" />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Grid>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Category</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actual</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Target (Editable)</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Cost After Optimization</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>% of Total</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>View Details</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {categories.map((category) => (
            <Table.Row key={category}>
              <Table.RowHeaderCell>{category}</Table.RowHeaderCell>
              <Table.Cell>{formatCurrency(totals[category].actual, currency)}</Table.Cell>
              <Table.Cell>
                <input
                  type="number"
                  value={totals[category].budget}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      totals: {
                        ...prev.totals,
                        [category]: { ...prev.totals[category], budget: parseFloat(e.target.value) || 0 },
                      },
                    }))
                  }
                  style={{ width: '80px' }}
                />
              </Table.Cell>
              <Table.Cell>{formatCurrency(totals[category].costAfter, currency)}</Table.Cell>
              <Table.Cell>{((totals[category].actual / totalActual) * 100).toFixed(2)}%</Table.Cell>
              <Table.Cell>
                <Button size="1" onClick={() => setDialogCategory(category)}>View Details</Button>
              </Table.Cell>
            </Table.Row>
          ))}
          <Table.Row>
            <Table.RowHeaderCell><b>Total</b></Table.RowHeaderCell>
            <Table.Cell><b>{formatCurrency(totalActual, currency)}</b></Table.Cell>
            <Table.Cell><b>{formatCurrency(totalTarget, currency)}</b></Table.Cell>
            <Table.Cell><b>{formatCurrency(totalCostAfter, currency)}</b></Table.Cell>
            <Table.Cell><b>100%</b></Table.Cell>
            <Table.Cell></Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
      {dialogCategory && (
        <Dialog.Root open onOpenChange={() => setDialogCategory(null)}>
          <Dialog.Content maxWidth="700px" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <Flex justify="between" align="center" mb="3">
              <Dialog.Title>{dialogCategory} Breakdown</Dialog.Title>
              <Button size="1" variant="outline" onClick={() => setShowInsights(true)}>
                Improve Tips
              </Button>
            </Flex>
            <Flex justify="between" align="center" mb="3">
              <Text>Auto Mode</Text>
              <Switch checked={autoMode} onCheckedChange={(checked) => setAutoMode(checked)} />
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
      {showInsights && (
        <Dialog.Root open onOpenChange={() => setShowInsights(false)}>
          <Dialog.Content maxWidth="500px">
            <Dialog.Title>Benchmark Price Insights</Dialog.Title>
            <Text size="2">
              Adjusting benchmark price can help align actual costs closer to market expectations.
              Consider factors like supplier negotiations, process efficiency, and market trends to refine your benchmark.
            </Text>
            <Flex justify="end" mt="4">
              <Button onClick={() => setShowInsights(false)}>Close</Button>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      )}

      <Flex justify="center" mt="6">
        <Button style={{ backgroundColor: '#10b981', color: '#fff' }}>
          Submit to Blockchain
        </Button>
      </Flex>
