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

function CostAnalytics() {
  const [dialogCategory, setDialogCategory] = useState<CostCategory | null>(null);
  const [benchmarkPrice, setBenchmarkPrice] = useState(220);
  const [profitMargin, setProfitMargin] = useState(25);
  const [currency, setCurrency] = useState<'EGP' | 'USD'>('EGP');
  const [autoMode, setAutoMode] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [data, setData] = useState(simulatedIoTCostData);
  const totals = data.totals;

  const totalActual = categories.reduce((sum, category) => sum + totals[category].actual, 0);
  const totalTarget = categories.reduce((sum, category) => sum + totals[category].target, 0);
  const totalCostAfter = categories.reduce((sum, category) => sum + totals[category].costAfter, 0);
  const targetCost = benchmarkPrice * (1 - profitMargin / 100);
  const postOptimizationEstimate = totalCostAfter * (1 - profitMargin / 100);

  return (
    <Box p="6" style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <Flex justify="between" align="center" mb="5" wrap="wrap" gap="3">
        <Heading size="6"><b>Inter-Organizational Cost Management</b></Heading>
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
          <Button onClick={() => alert('Export Report not implemented')}>Export Report</Button>
        </Flex>
      </Flex>

      <Grid columns={{ initial: '2', md: '4' }} gap="4" mb="6">
        <Box style={{ backgroundColor: '#e0f2fe', borderRadius: 8, padding: 12 }}>
          <Heading size="4" style={{ fontWeight: 'bold' }}>Actual Cost</Heading>
          <Text>{formatCurrency(totalActual, currency)}</Text>
        </Box>
        <Box style={{ backgroundColor: '#d1fae5', borderRadius: 8, padding: 12 }}>
          <Heading size="4" style={{ fontWeight: 'bold' }}>Target Cost</Heading>
          <Text>{formatCurrency(totalTarget, currency)}</Text>
        </Box>
        <Box style={{ backgroundColor: '#fef3c7', borderRadius: 8, padding: 12 }}>
          <Heading size="4" style={{ fontWeight: 'bold' }}>Cost After Optimization</Heading>
          <Text>{formatCurrency(totalCostAfter, currency)}</Text>
        </Box>
        <Box style={{ backgroundColor: '#fde68a', borderRadius: 8, padding: 12 }}>
          <Heading size="4" style={{ fontWeight: 'bold' }}>Benchmark Price</Heading>
          <Text>{formatCurrency(benchmarkPrice, currency)}</Text>
        </Box>
        <Box style={{ backgroundColor: '#f3e8ff', borderRadius: 8, padding: 12 }}>
          <Heading size="4" style={{ fontWeight: 'bold' }}>Target Cost (Profit Margin)</Heading>
          <Text>{formatCurrency(targetCost, currency)}</Text>
        </Box>
        <Box style={{ backgroundColor: '#fee2e2', borderRadius: 8, padding: 12 }}>
          <Heading size="4" style={{ fontWeight: 'bold' }}>Post Optimization Estimate</Heading>
          <Text>{formatCurrency(postOptimizationEstimate, currency)}</Text>
        </Box>
        <Box style={{ backgroundColor: '#e5e7eb', borderRadius: 8, padding: 12 }}>
          <Heading size="4" style={{ fontWeight: 'bold' }}>Profit Margin</Heading>
          <Text>{profitMargin}%</Text>
        </Box>
      </Grid>
      <Box mb="6">
        <Heading size="5" mb="3"><b>Cost Breakdown by Category</b></Heading>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Category</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Actual</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Target</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Variance</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>% of Total</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Cost After Optimization</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>View Detail</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {categories.map((category) => {
              const catData = totals[category];
              const variance = catData.actual - catData.target;
              const percentOfTotal = ((catData.actual / totalActual) * 100).toFixed(1);
              return (
                <Table.Row key={category}>
                  <Table.Cell>{category}</Table.Cell>
                  <Table.Cell>{formatCurrency(catData.actual, currency)}</Table.Cell>
                  <Table.Cell>
                    <input
                      type="number"
                      value={catData.target}
                      onChange={(e) => {
                        const newTarget = parseFloat(e.target.value) || 0;
                        setData((prev) => ({
                          ...prev,
                          totals: {
                            ...prev.totals,
                            [category]: {
                              ...prev.totals[category],
                              target: newTarget,
                            },
                          },
                        }));
                      }}
                      style={{ width: 80 }}
                    />
                  </Table.Cell>
                  <Table.Cell>{formatCurrency(variance, currency)}</Table.Cell>
                  <Table.Cell>{percentOfTotal}%</Table.Cell>
                  <Table.Cell>{formatCurrency(catData.costAfter, currency)}</Table.Cell>
                  <Table.Cell>
                    <Button onClick={() => setDialogCategory(category)}>Detail</Button>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Root>
      </Box>
      {dialogCategory && (
        <Dialog.Root open onOpenChange={() => setDialogCategory(null)}>
          <Dialog.Content maxWidth="700px" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <Dialog.Title><b>{dialogCategory} Breakdown</b></Dialog.Title>

            <Flex justify="between" align="center" mb="3" mt="3">
              <Text>Auto Mode</Text>
              <Switch checked={autoMode} onCheckedChange={(checked) => setAutoMode(checked)} />
            </Flex>

            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Item</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Qty / Hours / Kg</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Unit Price / Hourly Rate</Table.ColumnHeaderCell>
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
                      <Table.Cell>{item.name}</Table.Cell>
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
                              const v = parseFloat(e.target.value) || 0;
                              if (dialogCategory === 'Direct Materials') item.concentrationKg = v;
                              else if (dialogCategory === 'Direct Labor') item.hours = v;
                              else item.qty = v;
                            }}
                            style={{ width: 80 }}
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
                              const v = parseFloat(e.target.value) || 0;
                              if (dialogCategory === 'Direct Materials') item.pricePerKg = v;
                              else if (dialogCategory === 'Direct Labor') item.hourlyRate = v;
                              else item.unitPrice = v;
                            }}
                            style={{ width: 80 }}
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
              <Button style={{ backgroundColor: '#10b981', color: '#fff' }}>
                Submit
              </Button>
              <Button variant="ghost" style={{ backgroundColor: '#3b82f6', color: '#fff' }}
                onClick={() => setDialogCategory(null)}
              >
                Close
              </Button>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      )}
<Grid columns={{ initial: "1", md: "3" }} gap="4" mt="6">
  {categories.map((category, idx) => (
    <Card key={idx} style={{ backgroundColor: '#10b981', color: '#fff', borderRadius: '16px' }}>
      <CardContent>
        <Heading size="md" style={{ fontWeight: 'bold' }}>{category}</Heading>
        <Text size="xl" style={{ fontWeight: 'bold' }}>
          {formatCurrency(summaryData[category].actual, currency)}
        </Text>
        <Text size="sm">Target: {formatCurrency(summaryData[category].target, currency)}</Text>
        <Text size="sm">Cost After Opt: {formatCurrency(summaryData[category].costAfter, currency)}</Text>
      </CardContent>
    </Card>
  ))}
</Grid>
<Box mt="6" mb="6">
  <Heading size="md" mb="3">Actual vs Target Trend</Heading>
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={lineChartData}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="actual" stroke="#3b82f6" />
      <Line type="monotone" dataKey="target" stroke="#10b981" />
    </LineChart>
  </ResponsiveContainer>
</Box>
<Box mt="6" mb="6">
  <Heading size="md" mb="3">Cost Distribution</Heading>
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie data={pieChartData} dataKey="value" nameKey="name" outerRadius={100} fill="#8884d8" label>
        {pieChartData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  </ResponsiveContainer>
</Box>
<Table.Root>
  <Table.Header>
    <Table.Row>
      <Table.ColumnHeaderCell>Category</Table.ColumnHeaderCell>
      <Table.ColumnHeaderCell>Actual</Table.ColumnHeaderCell>
      <Table.ColumnHeaderCell>Target (Editable)</Table.ColumnHeaderCell>
      <Table.ColumnHeaderCell>Variance</Table.ColumnHeaderCell>
      <Table.ColumnHeaderCell>% of Total</Table.ColumnHeaderCell>
      <Table.ColumnHeaderCell>Cost After Optimization</Table.ColumnHeaderCell>
      <Table.ColumnHeaderCell>View Detail</Table.ColumnHeaderCell>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {categories.map((category) => {
      const actual = summaryData[category].actual;
      const target = summaryData[category].target;
      const costAfter = summaryData[category].costAfter;
      const variance = actual - target;
      return (
        <Table.Row key={category}>
          <Table.RowHeaderCell>{category}</Table.RowHeaderCell>
          <Table.Cell>{formatCurrency(actual, currency)}</Table.Cell>
          <Table.Cell>
            <input
              type="number"
              value={target}
              onChange={(e) => handleTargetChange(category, parseFloat(e.target.value) || 0)}
              style={{ width: '80px' }}
            />
          </Table.Cell>
          <Table.Cell>{formatCurrency(variance, currency)}</Table.Cell>
          <Table.Cell>{percentOfTotal(category)}%</Table.Cell>
          <Table.Cell>{formatCurrency(costAfter, currency)}</Table.Cell>
          <Table.Cell>
            <Button onClick={() => setDialogCategory(category)}>View Details</Button>
          </Table.Cell>
        </Table.Row>
      );
    })}
    <Table.Row>
      <Table.RowHeaderCell><b>Total</b></Table.RowHeaderCell>
      <Table.Cell><b>{formatCurrency(totalActual, currency)}</b></Table.Cell>
      <Table.Cell><b>{formatCurrency(totalTarget, currency)}</b></Table.Cell>
      <Table.Cell><b>{formatCurrency(totalActual - totalTarget, currency)}</b></Table.Cell>
      <Table.Cell><b>100%</b></Table.Cell>
      <Table.Cell><b>{formatCurrency(totalCostAfter, currency)}</b></Table.Cell>
      <Table.Cell></Table.Cell>
    </Table.Row>
  </Table.Body>
</Table.Root>
{dialogCategory && (
  <Dialog.Root open onOpenChange={() => setDialogCategory(null)}>
    <Dialog.Content maxWidth="800px" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
      <Dialog.Title>{dialogCategory} Breakdown</Dialog.Title>
      
      <Flex justify="between" align="center" mb="3" mt="3">
        <Text>Auto Mode</Text>
        <Switch checked={autoMode} onCheckedChange={(checked) => setAutoMode(checked)} />
      </Flex>

      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Item</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Qty / Hours / Kg</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Unit Price / Hourly Rate</Table.ColumnHeaderCell>
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
                      ? formatCurrency(item.pricePerKg ?? 0, currency)
                      : dialogCategory === 'Direct Labor'
                      ? formatCurrency(item.hourlyRate ?? 0, currency)
                      : formatCurrency(item.unitPrice ?? 0, currency)
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
{/* أزرار تحكم خارج الجدول للعمليات الرئيسية */}
<Flex justify="end" gap="4" mt="6">
  <Button
    style={{
      backgroundColor: '#10b981',
      color: '#fff',
      fontWeight: 'bold',
      padding: '0.5rem 1.25rem',
      borderRadius: '0.5rem'
    }}
    onClick={() => console.log('Submitted to blockchain')}
  >
    Submit to Blockchain
  </Button>
  <Button
    variant="ghost"
    style={{
      backgroundColor: '#3b82f6',
      color: '#fff',
      fontWeight: 'bold',
      padding: '0.5rem 1.25rem',
      borderRadius: '0.5rem'
    }}
    onClick={() => console.log('Canceled')}
  >
    Cancel
  </Button>
</Flex>
