import React, { useState, useEffect } from 'react';
import {
  Box, Button, Card, Flex, Grid, Heading, Progress, Select, Switch,
  Table, Text, TextField, Dialog,
} from '@radix-ui/themes';
import {
  PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip,
  Legend, ResponsiveContainer,
} from 'recharts';
import { simulatedIoTCostData, Item, CostCategory } from './simulateIoTCostData';

const solutionOptions = [
  'Negotiating Better Prices With Supplier',
  'Reducing Waste In Material Usage',
  'Automation To Reduce Manual Labor Costs',
  'Optimizing Machine Usage',
  'Improving Inventory Management',
  'Minimize Transportation Costs',
  'Reduce Rework Costs',
  'Other',
];

const categories: CostCategory[] = [
  'Direct Materials',
  'Packaging Materials',
  'Direct Labor',
  'Overhead',
  'Other Costs',
];

const formatCurrency = (num: number | string | undefined, currency: string) => {
  const value = typeof num === 'string' ? parseFloat(num ?? '0') : num ?? 0;
  return `${currency} ${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
};

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

export default function CostAnalysisMerged() {
  // --- States ---
  const [currency, setCurrency] = useState<'EGP' | 'USD'>('EGP');
  const [selectedProduct, setSelectedProduct] = useState('Product A');
  const [benchmarkPrice, setBenchmarkPrice] = useState(220);
  const [profitMargin, setProfitMargin] = useState(25);
  const [showGap, setShowGap] = useState(false);
  const [dialogCategory, setDialogCategory] = useState<CostCategory | null>(null);
  const [autoMode, setAutoMode] = useState(true);

  // Cost data with editable fields for main table (category-level)
  // Initialized from simulatedIoTCostData.totals with string fields for TextFields
  const initialCostData = categories.map((cat) => {
    const data = simulatedIoTCostData.totals[cat];
    return {
      category: cat,
      actual: data.actual.toString(),
      budget: data.budget.toString(),
      costAfter: data.costAfter.toString(),
    };
  });

  const [costData, setCostData] = useState(initialCostData);

  // Solutions per category (main table)
  const [solutions, setSolutions] = useState<Record<string, string>>({});

  // Solutions per item inside dialog: category -> index -> solution
  const [itemSolutions, setItemSolutions] = useState<Record<string, Record<number, string>>>({});

  // Update main table cost field
  const updateCostField = (category: CostCategory, field: 'actual' | 'budget' | 'costAfter', value: string) => {
    setCostData((prev) =>
      prev.map((row) =>
        row.category === category ? { ...row, [field]: value } : row
      )
    );
  };

  // Update solution for category in main table
  const updateCategorySolution = (category: CostCategory, value: string) => {
    setSolutions((prev) => ({ ...prev, [category]: value }));
  };

  // Update solution for item inside dialog
  const updateItemSolution = (category: CostCategory, index: number, value: string) => {
    setItemSolutions((prev) => ({
      ...prev,
      [category]: {
        ...(prev[category] || {}),
        [index]: value,
      },
    }));
  };

  // Calculate totals from costData
  const totalActual = costData.reduce((sum, row) => sum + parseFloat(row.actual || '0'), 0);
  const totalBudget = costData.reduce((sum, row) => sum + parseFloat(row.budget || '0'), 0);
  const totalCostAfter = costData.reduce((sum, row) => sum + parseFloat(row.costAfter || '0'), 0);

  // Progress and target cost calculations
  const targetCost = benchmarkPrice * (1 - profitMargin / 100);
  const progressPercent = totalActual > 0 ? Math.min((targetCost / totalActual) * 100, 100) : 0;
  const postOptimizationEstimate = totalCostAfter * (1 - profitMargin / 100);

  // Benchmark trend data (static + last month = totalActual)
  const benchmarkTrendData = [
    { month: 'Jan', actual: 169.61, benchmark: benchmarkPrice },
    { month: 'Feb', actual: 170.5, benchmark: benchmarkPrice },
    { month: 'Mar', actual: 168.0, benchmark: benchmarkPrice },
    { month: 'Apr', actual: 171.2, benchmark: benchmarkPrice },
    { month: 'May', actual: totalActual, benchmark: benchmarkPrice },
  ].map((d) => ({ ...d, targetCost, gap: d.actual - targetCost }));

  // Average gap for display
  const averageGap = benchmarkTrendData.reduce((sum, d) => sum + d.gap, 0) / benchmarkTrendData.length;

  // Percent of total per category
  const percentOfTotal = (category: CostCategory) => {
    const row = costData.find((r) => r.category === category);
    if (!row) return '0.00';
    const actualVal = parseFloat(row.actual || '0');
    return totalActual !== 0 ? ((actualVal / totalActual) * 100).toFixed(2) : '0.00';
  };

  // Pie chart data grouping direct costs as sum of three categories
  const pieChartData = [
    {
      name: 'Direct Cost',
      value:
        (parseFloat(costData.find((r) => r.category === 'Direct Materials')?.actual || '0')) +
        (parseFloat(costData.find((r) => r.category === 'Packaging Materials')?.actual || '0')) +
        (parseFloat(costData.find((r) => r.category === 'Direct Labor')?.actual || '0')),
    },
    {
      name: 'Overhead',
      value: parseFloat(costData.find((r) => r.category === 'Overhead')?.actual || '0'),
    },
    {
      name: 'Other Costs',
      value: parseFloat(costData.find((r) => r.category === 'Other Costs')?.actual || '0'),
    },
  ];

  const pieColors = ['#3b82f6', '#f59e0b', '#ef4444'];

  // Detail rows for dialog, supporting manual editing if autoMode is off
  // We keep local state for manual editing inside dialog to avoid mutating simulatedIoTCostData
  const [dialogItemsData, setDialogItemsData] = useState<Record<string, Item[]>>({});

  // Load dialog data on dialog open or autoMode changes
  useEffect(() => {
    if (dialogCategory) {
      if (autoMode) {
        // Use fresh data from simulation source
        setDialogItemsData((prev) => ({
          ...prev,
          [dialogCategory]: getDetailsByCategory(dialogCategory),
        }));
      } else {
        // Keep existing or initialize with fresh deep copy to allow manual editing
        if (!dialogItemsData[dialogCategory]) {
          // Deep copy to allow manual editing
          const freshCopy = getDetailsByCategory(dialogCategory).map((item) => ({ ...item }));
          setDialogItemsData((prev) => ({ ...prev, [dialogCategory]: freshCopy }));
        }
      }
    }
  }, [dialogCategory, autoMode]);

  // Update dialog item field in manual mode
  const updateDialogItemField = (
    category: CostCategory,
    index: number,
    field: keyof Item,
    value: any
  ) => {
    if (autoMode) return; // prevent manual update in auto mode

    setDialogItemsData((prev) => {
      const catItems = prev[category] ? [...prev[category]] : [];
      if (catItems[index]) {
        catItems[index] = { ...catItems[index], [field]: value };
      }
      return { ...prev, [category]: catItems };
    });
  };

  // On submit: collect and log all data (you can replace with API call)
  const handleSubmitAll = () => {
    const submission = {
      mainCostData: costData,
      mainSolutions: solutions,
      itemSolutions,
      dialogItemsData,
      benchmarkPrice,
      profitMargin,
      currency,
      selectedProduct,
    };
    console.log('Submitting Cost Analysis Data:', submission);
    alert('Cost Analysis data submitted! Check console for details.');
  };

  return (
    <Box p="6" style={{ minWidth: 900 }}>
      {/* Header with product & currency & export */}
      <Flex justify="between" align="center" mb="5">
        <Heading size="6">Inter-Organizational Cost Management</Heading>
        <Flex gap="3" align="center">
          <Text>Product:</Text>
          <Select.Root
            value={selectedProduct}
            onValueChange={(val) => setSelectedProduct(val)}
            style={{ minWidth: 120 }}
          >
            <Select.Trigger aria-label="Select product" />
            <Select.Content>
              <Select.Item value="Product A">Product A</Select.Item>
              <Select.Item value="Product B">Product B</Select.Item>
              <Select.Item value="Product C">Product C</Select.Item>
            </Select.Content>
          </Select.Root>

          <Text>Currency:</Text>
          <Select.Root
            value={currency}
            onValueChange={(val) => setCurrency(val as 'EGP' | 'USD')}
            style={{ minWidth: 80 }}
          >
            <Select.Trigger aria-label="Select currency" />
            <Select.Content>
              <Select.Item value="EGP">EGP</Select.Item>
              <Select.Item value="USD">USD</Select.Item>
            </Select.Content>
          </Select.Root>

          <Button variant="soft" onClick={() => alert('Export not implemented')}>
            Export Report
          </Button>
        </Flex>
      </Flex>

      {/* KPI Cards */}
      <Grid columns="3" gap="
      {/* KPI Cards */}
      <Grid columns="3" gap="4" mb="6">
        <Card padding="4">
          <Text size="2" weight="semibold">Actual Cost</Text>
          <Heading size="5">{formatCurrency(totalActual, currency)}</Heading>
        </Card>
        <Card padding="4">
          <Text size="2" weight="semibold">Budgeted Cost</Text>
          <Heading size="5">{formatCurrency(totalBudget, currency)}</Heading>
        </Card>
        <Card padding="4">
          <Text size="2" weight="semibold">Cost After Optimization</Text>
          <Heading size="5">{formatCurrency(totalCostAfter, currency)}</Heading>
        </Card>
        <Card padding="4">
          <Text size="2" weight="semibold">Benchmark Price</Text>
          <TextField
            type="number"
            value={benchmarkPrice}
            onChange={(e) => setBenchmarkPrice(parseFloat(e.target.value) || 0)}
          />
        </Card>
        <Card padding="4">
          <Text size="2" weight="semibold">Profit Margin (%)</Text>
          <TextField
            type="number"
            value={profitMargin}
            onChange={(e) => setProfitMargin(parseFloat(e.target.value) || 0)}
          />
        </Card>
        <Card padding="4">
          <Text size="2" weight="semibold">Progress to Target</Text>
          <Progress value={progressPercent} />
          <Text>{progressPercent.toFixed(1)}%</Text>
        </Card>
        <Card padding="4">
          <Text size="2" weight="semibold">Post-Optimization Estimate</Text>
          <Heading size="5">{formatCurrency(postOptimizationEstimate, currency)}</Heading>
        </Card>
      </Grid>

      {/* Charts */}
      <Flex gap="6" mb="6" style={{ height: 300 }}>
        <Box style={{ flex: 1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieChartData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value, currency)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        <Box style={{ flex: 1 }}>
          <Flex align="center" justify="space-between" mb="1">
            <Text weight="semibold">Benchmark Trend</Text>
            <Switch
              checked={showGap}
              onCheckedChange={(checked) => setShowGap(checked)}
            >
              Show Gap Analysis
            </Switch>
          </Flex>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={benchmarkTrendData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: number) => formatCurrency(value, currency)} />
              <Legend />
              <Line type="monotone" dataKey="actual" stroke="#3b82f6" name="Actual Cost" />
              <Line type="monotone" dataKey="benchmark" stroke="#f59e0b" name="Benchmark Price" />
              {showGap && (
                <>
                  <Line type="monotone" dataKey="targetCost" stroke="#ef4444" name="Target Cost" />
                  <Line type="monotone" dataKey="gap" stroke="#22c55e" name="Gap" />
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Flex>

      {/* Main Cost Table */}
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Category</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actual</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Budget</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Cost After Optimization</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>% of Total</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Solution</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>View Details</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {costData.map(({ category, actual, budget, costAfter }, idx) => (
            <Table.Row key={category}>
              <Table.RowHeaderCell>{category}</Table.RowHeaderCell>

              <Table.Cell>
                <TextField
                  type="number"
                  value={actual}
                  onChange={(e) => updateCostField(category, 'actual', e.target.value)}
                  size="2"
                />
              </Table.Cell>

              <Table.Cell>
                <TextField
                  type="number"
                  value={budget}
                  onChange={(e) => updateCostField(category, 'budget', e.target.value)}
                  size="2"
                />
              </Table.Cell>

              <Table.Cell>
                <TextField
                  type="number"
                  value={costAfter}
                  onChange={(e) => updateCostField(category, 'costAfter', e.target.value)}
                  size="2"
                />
              </Table.Cell>

              <Table.Cell>{percentOfTotal(category)}%</Table.Cell>

              <Table.Cell>
                <Select.Root
                  value={solutions[category] || ''}
                  onValueChange={(val) => updateCategorySolution(category, val)}
                  style={{ minWidth: 220 }}
                >
                  <Select.Trigger aria-label={`Select solution for ${category}`} />
                  <Select.Content>
                    {solutionOptions.map((sol) => (
                      <Select.Item key={sol} value={sol}>
                        {sol}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </Table.Cell>

              <Table.Cell>
                <Button size="2" onClick={() => setDialogCategory(category)}>
                  View Details
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}

          {/* Total Row */}
          <Table.Row>
            <Table.RowHeaderCell><b>Total</b></Table.RowHeaderCell>
            <Table.Cell><b>{formatCurrency(totalActual, currency)}</b></Table.Cell>
            <Table.Cell><b>{formatCurrency(totalBudget, currency)}</b></Table.Cell>
            <Table.Cell><b>{formatCurrency(totalCostAfter, currency)}</b></Table.Cell>
            <Table.Cell><b>100%</b></Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell></Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>

      {/* Details Dialog */}
      {dialogCategory && (
        <Dialog.Root open onOpenChange={() => setDialogCategory(null)}>
          <Dialog.Content maxWidth="700px" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <Dialog.Title>{dialogCategory} Breakdown</Dialog.Title>

            <Flex justify="space-between" align="center" mb="3">
              <Text weight="semibold">Auto Mode</Text>
              <Switch checked={autoMode} onCheckedChange={setAutoMode} />
            </Flex>

            {!autoMode && (
              <Text size="2" color="gray" mb="4">
                Manual input mode enabled. You can edit the fields below.
              </Text>
            )}

            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Item</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>
                    Qty / Conc (kg) / Hours
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Unit Price</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Cost</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Solution</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {(dialogItemsData[dialogCategory] || []).map((item, idx) => {
                  // Calculate cost in auto mode for specific categories
                  let calcCost = item.cost ?? 0;
                  if (autoMode) {
                    switch (dialogCategory) {
                      case 'Direct Materials':
                        calcCost = (item.weightKg ?? 0) * (item.pricePerKg ?? 0);
                        break;
                      case 'Direct Labor':
                        calcCost = (item.hourlyRate ?? 0) * (item.hours ?? 0);
                        break;
                      default:
                        calcCost = item.cost ?? 0;
                    }
                  } else {
                    // In manual mode cost can be edited
                    calcCost = item.cost ?? 0;
                  }

                  // Handle editable fields only in manual mode
                  const isEditable = !autoMode;

                  // Render quantity/concentration/hours depending on category
                  let qtyCell;
                  switch (dialogCategory) {
                    case 'Direct Materials':
                      qtyCell = (
                        <TextField
                          type="number"
                          size="2"
                          value={item.concentrationKg ?? ''}
                          disabled={!isEditable}
                          onChange={(e) =>
                            updateDialogItemField(dialogCategory, idx, 'concentrationKg', parseFloat(e.target.value) || 0)
                          }
                        />
                      );
                      break;
                    case 'Packaging Materials':
                    case 'Overhead':
                    case 'Other Costs':
                      qtyCell = (
                        <TextField
                          type="number"
                          size="2"
                          value={item.qty ?? ''}
                          disabled={!isEditable}
                          onChange={(e) =>
                            updateDialogItemField(dialogCategory, idx, 'qty', parseInt(e.target.value) || 0)
                          }
                        />
                      );
                      break;
                    case 'Direct Labor':
                      qtyCell = (
                        <TextField
                          type="number"
                          size="2"
                          value={item.hours ?? ''}
                          disabled={!isEditable}
                          onChange={(e) =>
                            updateDialogItemField(dialogCategory, idx, 'hours', parseFloat(e.target.value) || 0)
                          }
                        />
                      );
                      break;
                    default:
                      qtyCell = <Text>-</Text>;
                  }

                  // Render unit price depending on category
                  let unitPriceCell;
                  switch (dialogCategory) {
                    case 'Direct Materials':
                      unitPriceCell = (
                        <TextField
                          type="number"
                          size="2"
                          value={item.pricePerKg ?? ''}
                          disabled={!isEditable}
                          onChange={(e) =>
                            updateDialogItemField(dialogCategory, idx, 'pricePerKg', parseFloat(e.target.value) || 0)
                          }
                        />
                      );
                      break;
                    case 'Packaging Materials':
                    case 'Overhead':
                    case 'Other Costs':
                      unitPriceCell = (
                        <TextField
                          type="number"
                          size="2"
                          value={item.unitPrice ?? ''}
                          disabled={!isEditable}
                          onChange={(e) =>
                            updateDialogItemField(dialogCategory, idx, 'unitPrice', parseFloat(e.target.value) || 0)
                          }
                        />
                      );
                      break;
                    case 'Direct Labor':
                      unitPriceCell = (
                        <TextField
                          type="number"
                          size="2"
                          value={item.hourlyRate ?? ''}
                          disabled={!isEditable}
                          onChange={(e) =>
                            updateDialogItemField(dialogCategory, idx, 'hourlyRate', parseFloat(e.target.value) || 0)
                          }
                        />
                      );
                      break;
                    default:
                      unitPriceCell = <Text>-</Text>;
                  }

                  return (
                    <Table.Row key={idx}>
                      <Table.RowHeaderCell>{item.name}</Table.RowHeaderCell>
                      <Table.Cell>{qtyCell}</Table.Cell>
                      <Table.Cell>{unitPriceCell}</Table.Cell>
                      <Table.Cell>
                        {formatCurrency(calcCost, currency)}
                      </Table.Cell>
                      <Table.Cell>
                        <Select.Root
                          value={itemSolutions[dialogCategory]?.[idx] || ''}
                          onValueChange={(val) => updateItemSolution(dialogCategory, idx, val)}
                          style={{ minWidth: 220 }}
                          disabled={!isEditable}
                        >
                          <Select.Trigger aria-label={`Select solution for ${item.name}`} />
                          <Select.Content>
                            {solutionOptions.map((sol) => (
                              <Select.Item key={sol} value={sol}>
                                {sol}
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select.Root>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table.Root>

            <Flex justify="end" gap="3" mt="5">
              <Button onClick={() => setDialogCategory(null)}>Close</Button>
              <Button
                variant="primary"
                onClick={() => alert('Submit functionality not implemented yet.')}
              >
                Submit
              </Button>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      )}

      {/* Submit all data */}
      <Box mt="6" textAlign="right">
        <Button variant="primary" onClick={handleSubmitAll}>
          Submit All Data
        </Button>
      </Box>
    </Box>
  );
}
