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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

import {
  simulatedIoTCostData,
  CostCategory,
  Item
} from './simulateIoTCostData';

const formatCurrency = (value: number, currency: string) => `${currency} ${value.toFixed(2)}`;

const categories: CostCategory[] = [
  'Direct Materials',
  'Packaging Materials',
  'Direct Labor',
  'Overhead',
  'Other Costs'
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
  'Other'
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
    { month: 'May', actual: totalActual, benchmark: benchmarkPrice }
  ];

  const benchmarkTrendDataWithGap = benchmarkTrendData.map((d) => ({
    ...d,
    targetCost,
    gap: d.actual - targetCost
  }));

  const pieColors = ['#3b82f6', '#f59e0b', '#ef4444'];

  const percentOfTotal = (category: CostCategory) =>
    ((totals[category].actual / totalActual) * 100).toFixed(2);

  const handleSolutionChange = (category: CostCategory, index: number, value: string) => {
    setSolutions(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [index]: value
      }
    }));
  };

  const handleExportReport = () => {
    alert('Export Report functionality not implemented yet.');
  };

  const postOptimizationEstimate = totalCostAfter * (1 - profitMargin / 100);

  return (
    <Box p="4">
      <Flex justify="between" align="center" mb="4" wrap="wrap" gap="3">
        <Heading>Inter-Organizational Cost Management</Heading>
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

          <RadixSelect.Root value={currency} onValueChange={(value) => setCurrency(value as 'EGP' | 'USD')}>
            <RadixSelect.Trigger aria-label="Select currency" />
            <RadixSelect.Content>
              <RadixSelect.Item value="EGP">EGP</RadixSelect.Item>
              <RadixSelect.Item value="USD">USD</RadixSelect.Item>
            </RadixSelect.Content>
          </RadixSelect.Root>

          <Button onClick={handleExportReport}>Export Report</Button>
        </Flex>
      </Flex>

      <Grid columns="3" gap="4" mb="4">
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
          <input
            type="number"
            value={benchmarkPrice}
            onChange={(e) => setBenchmarkPrice(parseFloat(e.target.value))}
            style={{
              padding: '8px',
              fontSize: '1rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              width: '100%'
            }}
          />
        </Box>
        <Box>
          <Text size="2">Profit Margin (%)</Text>
          <input
            type="number"
            value={profitMargin}
            onChange={(e) => setProfitMargin(parseFloat(e.target.value))}
            style={{
              padding: '8px',
              fontSize: '1rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              width: '100%'
            }}
          />
        </Box>
        <Box>
          <Text size="2">Progress to Target</Text>
          <Progress value={(targetCost / totalActual) * 100} />
          <Text>{Math.round((targetCost / totalActual) * 100)}%</Text>
        </Box>
        <Box>
          <Text size="2">Post-Optimization Estimate</Text>
          <Heading size="6">{formatCurrency(postOptimizationEstimate, currency)}</Heading>
        </Box>
      </Grid>

      <Box mt="6" mb="6" style={{ display: 'flex', flexDirection: 'row', gap: 40, height: 300 }}>
        <Box style={{ flex: 1, height: '100%' }}>
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

        <Box style={{ flex: 1, height: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={benchmarkTrendDataWithGap}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="actual" fill="#3b82f6" name="Actual Cost" />
              <Bar dataKey="benchmark" fill="#f59e0b" name="Benchmark Price" />
              <Bar dataKey="targetCost" fill="#ef4444" name="Target Cost" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>

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
          <Dialog.Content maxWidth="700px">
            <Dialog.Title>{dialogCategory} Breakdown</Dialog.Title>

            <Flex justify="between" align="center" mb="3">
              <Text>Auto Mode</Text>
              <Switch checked={autoMode} onCheckedChange={setAutoMode} />
            </Flex>

            {!autoMode && (
              <Text color="gray" mb="3">
                Manual input mode enabled. You can modify the cost data here.
              </Text>
            )}

            <Table.Root>
              <Table.Header>
                <Table.Row>
                  {dialogCategory === 'Direct Materials' ? (
                    <>
                      <Table.ColumnHeaderCell>Composition</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Concentration (kg)</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Price/Kg ({currency})</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Cost ({currency})</Table.ColumnHeaderCell>
                    </>
                  ) : dialogCategory === 'Direct Labor' ? (
                    <>
                      <Table.ColumnHeaderCell>Item</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Hourly Rate ({currency})</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Hours</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Cost ({currency})</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Solution</Table.ColumnHeaderCell>
                    </>
                  ) : (
                    <>
                      <Table.ColumnHeaderCell>Item</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Qty</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Unit Price ({currency})</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Cost ({currency})</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Solution</Table.ColumnHeaderCell>
                    </>
                  )}
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {getDetailsByCategory(dialogCategory).map((item, index) => (
                  <Table.Row key={index}>
                    {dialogCategory === 'Direct Materials' ? (
                      <>
                        <Table.RowHeaderCell>{item.name}</Table.RowHeaderCell>
                        <Table.Cell>{item.concentrationKg}</Table.Cell>
                        <Table.Cell>
                          {autoMode ? (
                            formatCurrency(item.pricePerKg, currency)
                          ) : (
                            <input
                              type="number"
                              value={item.pricePerKg}
                              onChange={(e) => {
                                // Update pricePerKg logic here
                              }}
                              style={{ width: '100%' }}
                            />
                          )}
                        </Table.Cell>
                        <Table.Cell>{formatCurrency(item.cost, currency)}</Table.Cell>
                      </>
                    ) : dialogCategory === 'Direct Labor' ? (
                      <>
                        <Table.RowHeaderCell>{item.name}</Table.RowHeaderCell>
                        <Table.Cell>
                          {autoMode ? (
                            formatCurrency(item.hourlyRate, currency)
                          ) : (
                            <input
                              type="number"
                              value={item.hourlyRate}
                              onChange={(e) => {
                                // Update hourlyRate logic here
                              }}
                              style={{ width: '100%' }}
                            />
                          )}
                        </Table.Cell>
                        <Table.Cell>
                          {autoMode ? (
                            item.hours
                          ) : (
                            <input
                              type="number"
                              value={item.hours}
                              onChange={(e) => {
                                // Update hours logic here
                              }}
                              style={{ width: '100%' }}
                            />
                          )}
                        </Table.Cell>
                        <Table.Cell>{formatCurrency(item.cost, currency)}</Table.Cell>
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
                    ) : (
                      <>
                        <Table.RowHeaderCell>{item.name}</Table.RowHeaderCell>
                        <Table.Cell>
                          {autoMode ? (
                            item.qty
                          ) : (
                            <input
                              type="number"
                              value={item.qty}
                              onChange={(e) => {
                                // Update qty logic here
                              }}
                              style={{ width: '100%' }}
                            />
                          )}
                        </Table.Cell>
                        <Table.Cell>
                          {autoMode ? (
                            formatCurrency(item.unitPrice, currency)
                          ) : (
                            <input
                              type="number"
                              value={item.unitPrice}
                              onChange={(e) => {
                                // Update unitPrice logic here
                              }}
                              style={{ width: '100%' }}
                            />
                          )}
                        </Table.Cell>
                        <Table.Cell>{formatCurrency(item.cost, currency)}</Table.Cell>
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
                ))}
              </Table.Body>
            </Table.Root>

            <Flex justify="end" gap="3" mt="3">
              <Button onClick={() => setDialogCategory(null)}>Close</Button>
              <Button color="green">Submit</Button>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      )}
    </Box>
  );
}
