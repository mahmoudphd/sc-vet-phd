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
  TextField,
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
import { DownloadIcon, UploadIcon } from '@radix-ui/react-icons';

import {
  simulatedIoTCostData,
  Item,
  CostCategory,
} from './simulateIoTCostData';

// Constants and Styles
const colors = {
  primary: '#3b82f6',
  success: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
  info: '#6366f1',
  background: '#f9fafb',
  card: '#ffffff',
};

const cardStyle = {
  backgroundColor: colors.card,
  padding: '20px',
  borderRadius: '10px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  minWidth: '300px',
  flex: '1 1 300px',
};

const headingStyle = {
  fontSize: '1.25rem',
  fontWeight: '600',
  marginBottom: '1rem',
  textAlign: 'center' as const,
};

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
  const [isLoading, setIsLoading] = useState(false);

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

  const pieColors = [colors.primary, colors.warning, colors.danger, colors.success, colors.info];

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

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert('Data submitted successfully to blockchain!');
    } catch (error) {
      alert('Submission failed!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box p="6" style={{ backgroundColor: colors.background, minHeight: '100vh' }}>
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
          <Button onClick={handleExportReport}>
            <DownloadIcon style={{ marginRight: '0.5rem' }} />
            Export Report
          </Button>
        </Flex>
      </Flex>

      <Heading size="4" mb="4" style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>
        Cost Summary
      </Heading>

      <Grid columns={{ initial: '1', md: '3' }} gap="4" mb="6">
        {[
          { label: 'Actual Cost', value: totalActual },
          { label: 'Target Cost', value: totalTarget },
          { label: 'Cost After Optimization', value: totalCostAfter },
          { label: 'Post-Optimization Estimate', value: postOptimizationEstimate },
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
          <Box key={index} style={cardStyle}>
            <Text size="2">{item.label}</Text>
            {item.editable ? (
              <TextField.Input
                type="number"
                value={item.value}
                onChange={item.onChange}
                style={{ width: '100px', marginTop: '4px' }}
              />
            ) : null}
            <Heading size="6" mt={item.editable ? '2' : '0'}>
              {item.label.includes('%') ? `${item.value}%` : formatCurrency(item.value as number, currency)}
            </Heading>
          </Box>
        ))}
      </Grid>

      <Heading size="4" mb="4" style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>
        Cost Breakdown
      </Heading>

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell style={{ width: '200px' }}>Cost Category</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actual Cost</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Target Cost (Editable)</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Variance</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>% of Total</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Cost After Optimization</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Details</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {categories.map((category) => {
            const variance = totals[category].actual - totals[category].budget;
            const varianceColor = variance <= 0 ? colors.success : colors.danger;
            return (
              <Table.Row key={category} style={{ transition: 'background-color 0.2s', ':hover': { backgroundColor: '#f9fafb' } }}>
                <Table.RowHeaderCell>{category}</Table.RowHeaderCell>
                <Table.Cell>{formatCurrency(totals[category].actual, currency)}</Table.Cell>
                <Table.Cell>
                  <TextField.Input
                    type="number"
                    value={totals[category].budget}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      handleTargetChange(category, parseFloat(e.target.value) || 0)
                    }
                    style={{ width: '80px' }}
                  />
                </Table.Cell>
                <Table.Cell style={{ color: varianceColor }}>
                  {formatCurrency(variance, currency)}
                </Table.Cell>
                <Table.Cell>{percentOfTotal(category)}%</Table.Cell>
                <Table.Cell>{formatCurrency(totals[category].costAfter, currency)}</Table.Cell>
                <Table.Cell>
                  <Button onClick={() => setDialogCategory(category)}>View Details</Button>
                </Table.Cell>
              </Table.Row>
            );
          })}
          <Table.Row style={{ backgroundColor: '#f3f4f6' }}>
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
                    <Table.Row key={index} style={{ transition: 'background-color 0.2s', ':hover': { backgroundColor: '#f9fafb' } }}>
                      <Table.RowHeaderCell>{item.name}</Table.RowHeaderCell>
                      <Table.Cell>
                        {autoMode ? (
                          dialogCategory === 'Direct Materials'
                            ? item.concentrationKg?.toFixed(3) ?? '-'
                            : dialogCategory === 'Direct Labor'
                            ? item.hours ?? '-'
                            : item.qty ?? '-'
                        ) : (
                          <TextField.Input
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
                          <TextField.Input
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
              <Button style={{ backgroundColor: colors.success, color: '#fff' }}>
                Submit
              </Button>
              <Button
                variant="ghost"
                style={{ backgroundColor: colors.primary, color: '#fff' }}
                onClick={() => setDialogCategory(null)}
              >
                Close
              </Button>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      )}

      <Heading size="4" mb="4" mt="6" style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>
        Visual Analytics
      </Heading>

      <Flex mt="4" gap="6" wrap="wrap" justify="center">
        <Box style={cardStyle}>
          <Heading size="4" mb="3" style={headingStyle}>
            Cost Gap Analysis
          </Heading>
          <Text align="center" mb="4" size="2">
            Total Cost Gap: {formatCurrency(totalActual - targetCost, currency)}
          </Text>
          <Grid columns={{ initial: '1', md: '3' }} gap="2">
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
        </Box>
        <Box style={cardStyle}>
          <Heading size="4" mb="3" style={headingStyle}>
            Cost Breakdown
          </Heading>
          <ResponsiveContainer width="100%" height={300}>
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
        </Box>
        <Box style={cardStyle}>
          <Heading size="4" mb="3" style={headingStyle}>
            Benchmark Trend
          </Heading>
          <ResponsiveContainer width="100%" height={300}>
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
                stroke={colors.primary} 
                activeDot={{ r: 8 }} 
                name="Actual Cost" 
              />
              <Line 
                type="monotone" 
                dataKey="benchmark" 
                stroke={colors.warning} 
                name="Benchmark Price" 
                strokeDasharray="5 5" 
              />
              <Line 
                type="monotone" 
                dataKey="targetCost" 
                stroke={colors.success} 
                name="Target Cost" 
                strokeDasharray="3 4 5 2" 
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Flex>

      <Flex justify="end" mt="6">
        <Button 
          style={{ 
            backgroundColor: colors.success, 
            color: '#fff', 
            fontWeight: 'bold',
            padding: '12px 24px'
          }}
          onClick={handleSubmit}
          disabled={isLoading}
        >
          <UploadIcon style={{ marginRight: '0.5rem' }} />
          {isLoading ? 'Submitting...' : 'Submit to Blockchain'}
        </Button>
      </Flex>
    </Box>
  );
}

export default CostAnalytics;
