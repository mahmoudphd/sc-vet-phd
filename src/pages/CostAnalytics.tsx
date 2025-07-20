import { useState } from 'react';
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
import {
  simulatedIoTCostData,
  Item,
  CostCategory,
} from './simulateIoTCostData';

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

export default function CostAnalytics() {
  const [dialogCategory, setDialogCategory] = useState<CostCategory | null>(null);
  const [benchmarkPrice, setBenchmarkPrice] = useState(220);
  const [profitMargin, setProfitMargin] = useState(25);
  const [currency, setCurrency] = useState<'EGP' | 'USD'>('EGP');
  const [autoMode, setAutoMode] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [solutions, setSolutions] = useState<Record<string, Record<number, string>>>({});

  const totals = simulatedIoTCostData.totals;

  const totalActual = categories.reduce((sum, category) => sum + totals[category].actual, 0);
  const totalBudget = categories.reduce((sum, category) => sum + totals[category].budget, 0);
  const totalCostAfter = categories.reduce((sum, category) => sum + totals[category].costAfter, 0);

  const targetCost = benchmarkPrice * (1 - profitMargin / 100);

  const benchmarkTrendData = [
    { month: 'Jan', actual: 169.61, benchmark: benchmarkPrice },
    { month: 'Feb', actual: 170.5, benchmark: benchmarkPrice },
    { month: 'Mar', actual: 168.0, benchmark: benchmarkPrice },
    { month: 'Apr', actual: 171.2, benchmark: benchmarkPrice },
    { month: 'May', actual: totalActual, benchmark: benchmarkPrice },
  ];

  const benchmarkTrendDataWithGap = benchmarkTrendData.map((d) => ({
    ...d,
    targetCost,
    gap: d.actual - targetCost,
  }));

  const pieColors = ['#3b82f6', '#f59e0b', '#ef4444'];

  const percentOfTotal = (category: CostCategory) =>
    ((totals[category].actual / totalActual) * 100).toFixed(2);

  const handleSolutionChange = (category: CostCategory, index: number, value: string) => {
    setSolutions((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [index]: value,
      },
    }));
  };

  const handleExportReport = () => {
    alert('Export Report functionality not implemented yet.');
  };

  const postOptimizationEstimate = totalCostAfter * (1 - profitMargin / 100);

  return (
    <Box p="4">
      <Flex justify="between" align="center" mb="4">
        <Heading>Inter-Organizational Cost Management</Heading>
        <Flex gap="3" align="center">
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

          <Button onClick={handleExportReport}>Export Report</Button>
        </Flex>
      </Flex>

      {/* KPI Cards with styled Box */}
      <Grid columns={{ initial: '3', md: '3' }} gap="4" mb="4">
        <Box
          style={{
            border: '1px solid #ccc',
            borderRadius: 8,
            padding: 12,
            backgroundColor: '#fff',
          }}
        >
          <Text size="2">Actual Cost</Text>
          <Heading size="6">{formatCurrency(totalActual, currency)}</Heading>
        </Box>
        <Box
          style={{
            border: '1px solid #ccc',
            borderRadius: 8,
            padding: 12,
            backgroundColor: '#fff',
          }}
        >
          <Text size="2">Budgeted Cost</Text>
          <Heading size="6">{formatCurrency(totalBudget, currency)}</Heading>
        </Box>
        <Box
          style={{
            border: '1px solid #ccc',
            borderRadius: 8,
            padding: 12,
            backgroundColor: '#fff',
          }}
        >
          <Text size="2">Cost After Optimization</Text>
          <Heading size="6">{formatCurrency(totalCostAfter, currency)}</Heading>
        </Box>
        <Box
          style={{
            border: '1px solid #ccc',
            borderRadius: 8,
            padding: 12,
            backgroundColor: '#fff',
          }}
        >
          <Text size="2">Benchmark Price</Text>
          <input
            type="number"
            value={benchmarkPrice}
            onChange={(e) => setBenchmarkPrice(parseFloat(e.target.value) || 0)}
            style={{
              padding: '8px',
              fontSize: '1rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              width: '100%',
            }}
          />
        </Box>
        <Box
          style={{
            border: '1px solid #ccc',
            borderRadius: 8,
            padding: 12,
            backgroundColor: '#fff',
          }}
        >
          <Text size="2">Profit Margin (%)</Text>
          <input
            type="number"
            value={profitMargin}
            onChange={(e) => setProfitMargin(parseFloat(e.target.value) || 0)}
            style={{
              padding: '8px',
              fontSize: '1rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              width: '100%',
            }}
          />
        </Box>
        <Box
          style={{
            border: '1px solid #ccc',
            borderRadius: 8,
            padding: 12,
            backgroundColor: '#fff',
          }}
        >
          <Text size="2">Progress to Target</Text>
          <Progress value={Math.min((targetCost / totalActual) * 100, 100)} />
          <Text>{Math.round((targetCost / totalActual) * 100)}%</Text>
        </Box>
        <Box
          style={{
            border: '1px solid #ccc',
            borderRadius: 8,
            padding: 12,
            backgroundColor: '#fff',
          }}
        >
          <Text size="2">Post-Optimization Estimate</Text>
          <Heading size="6">{formatCurrency(postOptimizationEstimate, currency)}</Heading>
        </Box>
      </Grid>

      <Flex gap="8" mb="6" style={{ height: 300 }}>
        <Box style={{ flex: 1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[
                  {
                    name: 'Direct Cost',
                    value:
                      totals['Direct Materials'].actual +
                      totals['Packaging Materials'].actual +
                      totals['Direct Labor'].actual,
                  },
                  { name: 'Overhead', value: totals['Overhead'].actual },
                  { name: 'Other Costs', value: totals['Other Costs'].actual },
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

        <Box style={{ flex: 1 }}>
          <ResponsiveContainer width="100%" height="100%">
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
      </Flex>

      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Category</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actual</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Budget</Table.ColumnHeaderCell>
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
              <Table.Cell>{formatCurrency(totals[category].budget, currency)}</Table.Cell>
              <Table.Cell>{formatCurrency(totals[category].costAfter, currency)}</Table.Cell>
              <Table.Cell>{percentOfTotal(category)}%</Table.Cell>
              <Table.Cell>
                <Button onClick={() => setDialogCategory(category)}>View Details</Button>
              </Table.Cell>
            </Table.Row>
          ))}

          <Table.Row>
            <Table.RowHeaderCell><b>Total</b></Table.RowHeaderCell>
            <Table.Cell><b>{formatCurrency(totalActual, currency)}</b></Table.Cell>
            <Table.Cell><b>{formatCurrency(totalBudget, currency)}</b></Table.Cell>
            <Table.Cell><b>{formatCurrency(totalCostAfter, currency)}</b></Table.Cell>
            <Table.Cell><b>100%</b></Table.Cell>
            <Table.Cell></Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>

      {dialogCategory && (
        <Dialog.Root open onOpenChange={() => setDialogCategory(null)}>
          <Dialog.Content maxWidth="600px">
            <Dialog.Title>{dialogCategory} Breakdown</Dialog.Title>
            <Flex justify="between" align="center" mb="3">
              <Text>Auto Mode</Text>
              <Switch checked={autoMode} onCheckedChange={(checked) => setAutoMode(checked)} />
            </Flex>
            {!autoMode && (
              <Text color="gray" mb="3">
                Manual input mode enabled. You can modify the cost data here.
              </Text>
            )}
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Item</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Qty / Concentration (kg) / Hours</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Unit Price</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Cost</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Solution</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {getDetailsByCategory(dialogCategory).map((item: Item, index: number) => {
                  let costValue = item.cost ?? 0;
                  // Auto calculation if autoMode
                  if (autoMode) {
                    if (dialogCategory === 'Direct Materials') {
                      costValue = (item.weightKg ?? 0) * (item.pricePerKg ?? 0);
                    } else if (dialogCategory === 'Direct Labor') {
                      costValue = (item.hourlyRate ?? 0) * (item.hours ?? 0);
                    } else {
                      costValue = item.cost ?? 0;
                    }
                  }

                  return (
                    <Table.Row key={index}>
                      {dialogCategory === 'Direct Materials' && (
                        <>
                          <Table.RowHeaderCell>{item.name}</Table.RowHeaderCell>
                          <Table.Cell>{item.concentrationKg ?? '-'}</Table.Cell>
                          <Table.Cell>{item.pricePerKg ? formatCurrency(item.pricePerKg, currency) : '-'}</Table.Cell>
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
                        </>
                      )}

                      {dialogCategory === 'Packaging Materials' && (
                        <>
                          <Table.RowHeaderCell>{item.name}</Table.RowHeaderCell>
                          <Table.Cell>{item.qty ?? '-'}</Table.Cell>
                          <Table.Cell>{item.unitPrice ? formatCurrency(item.unitPrice, currency) : '-'}</Table.Cell>
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
                        </>
                      )}

                      {dialogCategory === 'Direct Labor' && (
                        <>
                          <Table.RowHeaderCell>{item.name}</Table.RowHeaderCell>
                          <Table.Cell>{item.hours ?? '-'}</Table.Cell>
                          <Table.Cell>{item.hourlyRate ? formatCurrency(item.hourlyRate, currency) : '-'}</Table.Cell>
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
                        </>
                      )}

                      {(dialogCategory === 'Overhead' || dialogCategory === 'Other Costs') && (
                        <>
                          <Table.RowHeaderCell>{item.name}</Table.RowHeaderCell>
                          <Table.Cell>{item.qty ?? '-'}</Table.Cell>
                          <Table.Cell>{item.unitPrice ? formatCurrency(item.unitPrice, currency) : '-'}</Table.Cell>
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
                        </>
                      )}
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table.Root>

            {/* Submit Button */}
            <Box style={{ marginTop: 16, textAlign: 'right' }}>
              <Button onClick={() => alert('Submit functionality not implemented yet.')}>
                Submit
              </Button>
            </Box>

            <Box mt="4" style={{ textAlign: 'right' }}>
              <Button onClick={() => setDialogCategory(null)}>Close</Button>
            </Box>
          </Dialog.Content>
        </Dialog.Root>
      )}
    </Box>
  );
}
