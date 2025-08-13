import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Dialog,
  Flex,
  Grid,
  Heading,
  Inset,
  Progress,
  Switch,
  Table,
  Text,
  Select as RadixSelect,
  Badge
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
import { DownloadIcon, UploadIcon } from '@radix-ui/react-icons';

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

function CostAnalytics() {
  const [dialogCategory, setDialogCategory] = useState<CostCategory | null>(null);
  const [benchmarkPrice, setBenchmarkPrice] = useState(220);
  const [profitMargin, setProfitMargin] = useState(25);
  const [currency, setCurrency] = useState<'EGP' | 'USD'>('EGP');
  const [autoMode, setAutoMode] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [showTargetView, setShowTargetView] = useState(false);
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

  const postOptimizationEstimate = totalActual - totalCostAfter;
  const targetCost = benchmarkPrice * (1 - profitMargin / 100);

  const handleBenchmarkChange = (value: number) => {
    setBenchmarkPrice(value);
  };

  const benchmarkTrendData = [
    { month: 'Jan', actual: 169.61, benchmark: benchmarkPrice },
    { month: 'Feb', actual: 170.5, benchmark: benchmarkPrice },
    { month: 'Mar', actual: 168.0, benchmark: benchmarkPrice },
    { month: 'Apr', actual: 171.2, benchmark: benchmarkPrice },
    { month: 'May', actual: totalActual, benchmark: benchmarkPrice, costAfter: totalCostAfter, postOptimization: postOptimizationEstimate },
  ];

  const benchmarkTrendDataWithGap = benchmarkTrendData.map((d) => ({
    ...d,
    targetCost,
    gap: d.actual - targetCost,
  }));

  const pieColors = ['#3b82f6', '#f59e0b', '#ef4444', '#10b981', '#a855f7'];

  const percentOfTotal = (category: CostCategory) =>
    totalActual === 0 ? '0.00' : ((totals[category].actual / totalActual) * 100).toFixed(2);

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

  const handleTargetChange = (category: CostCategory, value: number) => {
    setData((prev) => ({
      ...prev,
      totals: {
        ...prev.totals,
        [category]: {
          ...prev.totals[category],
          budget: value,
        },
      },
    }));
  };

  const handleSubmitToBlockchain = () => {
    alert('Data submitted to blockchain successfully!');
  };

  return (
    <Box p="6" style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <Flex justify="between" align="center" mb="6" wrap="wrap" gap="3">
        <Heading size="6" weight="bold">Inter-Organizational Cost Management</Heading>
        <Flex gap="3" align="center" wrap="wrap">
          <Flex align="center" gap="2">
            <Text size="2" weight="bold">Product:</Text>
            <RadixSelect.Root
              value={selectedProduct}
              onValueChange={(value) => setSelectedProduct(value)}
            >
              <RadixSelect.Trigger style={{ minWidth: '120px' }} />
              <RadixSelect.Content>
                {products.map((p) => (
                  <RadixSelect.Item key={p} value={p}>
                    {p}
                  </RadixSelect.Item>
                ))}
              </RadixSelect.Content>
            </RadixSelect.Root>
          </Flex>
          
          <Flex align="center" gap="2">
            <Text size="2" weight="bold">Currency:</Text>
            <RadixSelect.Root
              value={currency}
              onValueChange={(value) => setCurrency(value as 'EGP' | 'USD')}
            >
              <RadixSelect.Trigger style={{ minWidth: '80px' }} />
              <RadixSelect.Content>
                <RadixSelect.Item value="EGP">EGP</RadixSelect.Item>
                <RadixSelect.Item value="USD">USD</RadixSelect.Item>
              </RadixSelect.Content>
            </RadixSelect.Root>
          </Flex>

          <Button variant="soft" onClick={handleExportReport}>
            <DownloadIcon />
            Export Report
          </Button>
        </Flex>
      </Flex>

      <Grid columns={{ initial: '1', md: '3' }} gap="4" mb="6">
        {[
          { label: 'Actual Cost', value: totalActual, trend: 'down' },
          { label: 'Target Cost', value: totalTarget, trend: 'neutral' },
          { label: 'Cost After Optimization', value: totalCostAfter, trend: 'up' },
          { label: 'Post-Optimization Estimate', value: postOptimizationEstimate, trend: 'up' },
          {
            label: 'Benchmark Price',
            value: benchmarkPrice,
            editable: true,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
              handleBenchmarkChange(parseFloat(e.target.value) || 0)
          },
          {
            label: 'Profit Margin (%)',
            value: profitMargin,
            editable: true,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
              setProfitMargin(parseFloat(e.target.value) || 0)
          },
        ].map((item, index) => (
          <Card key={index} style={{ position: 'relative' }}>
            <Flex direction="column" gap="2">
              <Flex justify="between" align="center">
                <Text size="2" color="gray">
                  {item.label}
                </Text>
                {item.trend && (
                  <Badge color={
                    item.trend === 'up' ? 'green' : 
                    item.trend === 'down' ? 'red' : 'gray'
                  }>
                    {item.trend === 'up' ? '↓' : item.trend === 'down' ? '↑' : '→'}
                  </Badge>
                )}
              </Flex>
              
              {item.editable ? (
                <Flex align="center" gap="2">
                  <input
                    type="number"
                    value={item.value}
                    onChange={item.onChange}
                    style={{
                      width: '80px',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      border: '1px solid #e2e8f0'
                    }}
                  />
                  <Text size="4" weight="bold">
                    {item.label.includes('%') ? `${item.value}%` : formatCurrency(item.value as number, currency)}
                  </Text>
                </Flex>
              ) : (
                <Heading size="5">
                  {item.label.includes('%') ? `${item.value}%` : formatCurrency(item.value as number, currency)}
                </Heading>
              )}
            </Flex>
          </Card>
        ))}
      </Grid>

      <Card mb="6">
        <Inset clip="padding-box" side="top" pb="current">
          <Table.Root variant="surface">
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
              {categories.map((category) => {
                const variance = totals[category].actual - totals[category].budget;
                const varianceColor = variance <= 0 ? 'green' : 'red';
                return (
                  <Table.Row key={category}>
                    <Table.RowHeaderCell>{category}</Table.RowHeaderCell>
                    <Table.Cell>{formatCurrency(totals[category].actual, currency)}</Table.Cell>
                    <Table.Cell>
                      <input
                        type="number"
                        value={totals[category].budget}
                        onChange={(e) => handleTargetChange(category, parseFloat(e.target.value) || 0)}
                        style={{
                          width: '80px',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          border: '1px solid #e2e8f0'
                        }}
                      />
                    </Table.Cell>
                    <Table.Cell style={{ color: varianceColor }}>
                      {formatCurrency(variance, currency)}
                    </Table.Cell>
                    <Table.Cell>{percentOfTotal(category)}%</Table.Cell>
                    <Table.Cell>{formatCurrency(totals[category].costAfter, currency)}</Table.Cell>
                    <Table.Cell>
                      <Button size="1" variant="outline" onClick={() => setDialogCategory(category)}>
                        View Details
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
              <Table.Row style={{ backgroundColor: '#f8fafc' }}>
                <Table.RowHeaderCell><Text weight="bold">Total</Text></Table.RowHeaderCell>
                <Table.Cell><Text weight="bold">{formatCurrency(totalActual, currency)}</Text></Table.Cell>
                <Table.Cell><Text weight="bold">{formatCurrency(totalTarget, currency)}</Text></Table.Cell>
                <Table.Cell><Text weight="bold">{formatCurrency(totalActual - totalTarget, currency)}</Text></Table.Cell>
                <Table.Cell><Text weight="bold">100%</Text></Table.Cell>
                <Table.Cell><Text weight="bold">{formatCurrency(totalCostAfter, currency)}</Text></Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Root>
        </Inset>
      </Card>

      {dialogCategory && (
        <Dialog.Root open onOpenChange={() => setDialogCategory(null)}>
          <Dialog.Content style={{ 
            maxWidth: '800px',
            maxHeight: '80vh',
            overflowY: 'auto',
            borderRadius: '12px',
            padding: '24px'
          }}>
            <Dialog.Title style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
              {dialogCategory} Breakdown
            </Dialog.Title>
            <Flex justify="between" align="center" mb="3" mt="3">
              <Text>Auto IoT Mode</Text>
              <Switch checked={autoMode} onCheckedChange={(checked) => setAutoMode(checked)} />
            </Flex>
            <Flex justify="start" mb="3">
              <Button
                variant={showTargetView ? 'solid' : 'soft'}
                onClick={() => setShowTargetView(false)}
                style={{ marginRight: '8px' }}
              >
                Actual View
              </Button>
              <Button
                variant={showTargetView ? 'soft' : 'solid'}
                onClick={() => setShowTargetView(true)}
              >
                Target View
              </Button>
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
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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
              <Button style={{ backgroundColor: '#10b981', color: '#fff' }}>
                Submit
              </Button>
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

      <Grid columns={{ initial: '1', md: '3' }} gap="4" mb="6">
        <Card>
          <Flex direction="column" p="4">
            <Heading size="4" mb="3" align="center">
              Cost Gap Analysis
            </Heading>
            <Text align="center" mb="4" size="2">
              Total Cost Gap: {formatCurrency(totalActual - targetCost, currency)}
            </Text>
            <Grid columns="3" gap="2">
              {categories.map((category, index) => (
                <Box key={category} style={{ padding: 10, borderRadius: 6, backgroundColor: '#f3f4f6' }}>
                  <Text weight="bold" size="2" mb="2">
                    {category}
                  </Text>
                  <Progress
                    value={(totals[category].actual / totalActual) * 100}
                    color={
                      index === 0 ? 'blue' :
                      index === 1 ? 'amber' :
                      index === 2 ? 'red' :
                      index === 3 ? 'green' :
                      'purple'
                    }
                    size="2"
                  />
                  <Text mt="2" size="2">
                    {formatCurrency(totals[category].actual, currency)} ({percentOfTotal(category)}%)
                  </Text>
                </Box>
              ))}
            </Grid>
          </Flex>
        </Card>

        <Card>
          <Flex direction="column" p="4">
            <Heading size="4" mb="3" align="center">
              Cost Breakdown
            </Heading>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categories.map((category) => ({
                    name: category,
                    value: totals[category].actual,
                  }))}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}\n${(percent * 100).toFixed(1)}%`}
                  labelLine={false}
                >
                  {categories.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    `${formatCurrency(value, currency)}`,
                    name
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </Flex>
        </Card>

        <Card>
          <Flex direction="column" p="4">
            <Heading size="4" mb="3" align="center">
              Benchmark Trend
            </Heading>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={benchmarkTrendDataWithGap}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    `${formatCurrency(value, currency)}`,
                    name
                  ]}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#3b82f6" 
                  activeDot={{ r: 8 }} 
                  name="Actual Cost" 
                />
                <Line 
                  type="monotone" 
                  dataKey="benchmark" 
                  stroke="#f59e0b" 
                  name="Benchmark Price" 
                  strokeDasharray="5 5" 
                />
                <Line 
                  type="monotone" 
                  dataKey="targetCost" 
                  stroke="#10b981" 
                  name="Target Cost" 
                  strokeDasharray="3 4 5 2" 
                />
              </LineChart>
            </ResponsiveContainer>
          </Flex>
        </Card>
      </Grid>

      <Flex justify="end" mt="6">
        <Button 
          size="2" 
          style={{ 
            backgroundColor: '#10b981', 
            color: '#fff', 
            fontWeight: 'bold',
            padding: '12px 24px'
          }}
          onClick={handleSubmitToBlockchain}
        >
          <UploadIcon style={{ marginRight: '8px' }} />
          Submit to Blockchain
        </Button>
      </Flex>
    </Box>
  );
}

export default CostAnalytics;
