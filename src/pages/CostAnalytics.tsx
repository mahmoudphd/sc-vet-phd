import { useState, useEffect } from 'react';
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
  TextField,
  Card,
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
  // Auto/manual mode for main page and dialog separately
  const [mainAutoMode, setMainAutoMode] = useState(true);
  const [dialogAutoMode, setDialogAutoMode] = useState(true);

  const [dialogCategory, setDialogCategory] = useState<CostCategory | null>(null);
  const [benchmarkPrice, setBenchmarkPrice] = useState(220);
  const [profitMargin, setProfitMargin] = useState(25);
  const [currency, setCurrency] = useState<'EGP' | 'USD'>('EGP');
  const [selectedProduct, setSelectedProduct] = useState(products[0]);

  // Store main page editable data copy for manual mode
  const [editableTotals, setEditableTotals] = useState(() => {
    // Deep clone totals to avoid mutation of original data
    return JSON.parse(JSON.stringify(simulatedIoTCostData.totals));
  });

  // Store dialog items editable data copy
  const [editableDialogItems, setEditableDialogItems] = useState<Item[]>([]);

  // Solutions state: category -> itemIndex -> solution string
  const [solutions, setSolutions] = useState<Record<string, Record<number, string>>>({});

  // On dialogCategory change or dialogAutoMode change, load dialog items editable copy
  useEffect(() => {
    if (dialogCategory) {
      const baseItems = getDetailsByCategory(dialogCategory);
      if (dialogAutoMode) {
        // Auto mode: reset editable items to base items (deep clone)
        setEditableDialogItems(JSON.parse(JSON.stringify(baseItems)));
      } else {
        // Manual mode: keep current editableDialogItems or reset if empty
        if (editableDialogItems.length === 0) {
          setEditableDialogItems(JSON.parse(JSON.stringify(baseItems)));
        }
      }
    } else {
      setEditableDialogItems([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogCategory, dialogAutoMode]);

  // When mainAutoMode changes, reset editableTotals to original totals if auto
  useEffect(() => {
    if (mainAutoMode) {
      setEditableTotals(JSON.parse(JSON.stringify(simulatedIoTCostData.totals)));
    }
  }, [mainAutoMode]);

  // Calculate totals dynamically from editableTotals state
  const totalActual = categories.reduce(
    (sum, cat) => sum + (editableTotals[cat]?.actual || 0),
    0,
  );
  const totalTarget = categories.reduce(
    (sum, cat) => sum + (editableTotals[cat]?.target || 0),
    0,
  );
  const totalCostAfter = categories.reduce(
    (sum, cat) => sum + (editableTotals[cat]?.costAfter || 0),
    0,
  );

  // Target cost calculation based on benchmark and margin
  const targetCost = benchmarkPrice * (1 - profitMargin / 100);

  // Benchmark trend data (fixed values except last month)
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
    totalActual > 0
      ? ((editableTotals[category]?.actual / totalActual) * 100).toFixed(2)
      : '0.00';

  // Handlers for main page editable totals changes
  const handleMainValueChange = (
    category: CostCategory,
    field: 'actual' | 'target' | 'costAfter',
    value: number,
  ) => {
    setEditableTotals((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }));
  };

  // Handlers for dialog editable items changes
  const handleDialogItemChange = (
    index: number,
    field: keyof Item,
    value: string | number,
  ) => {
    setEditableDialogItems((prev) => {
      const newItems = [...prev];
      const current = newItems[index];
      if (typeof value === 'string' && !isNaN(Number(value))) {
        value = Number(value);
      }
      newItems[index] = { ...current, [field]: value };
      // If fields relate to cost, recalc cost for auto mode if dialogAutoMode is true
      if (dialogAutoMode) {
        if (dialogCategory === 'Direct Materials') {
          const qty = Number(newItems[index].weightKg ?? 0);
          const price = Number(newItems[index].pricePerKg ?? 0);
          newItems[index].cost = qty * price;
        } else if (dialogCategory === 'Direct Labor') {
          const hours = Number(newItems[index].hours ?? 0);
          const rate = Number(newItems[index].hourlyRate ?? 0);
          newItems[index].cost = hours * rate;
        } else {
          // For other categories, keep cost as is or calculate if fields present
          const qty = Number(newItems[index].qty ?? 0);
          const price = Number(newItems[index].unitPrice ?? 0);
          newItems[index].cost = qty * price;
        }
      }
      return newItems;
    });
  };

  // Handler for solutions select change
  const handleSolutionChange = (category: CostCategory, index: number, value: string) => {
    setSolutions((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [index]: value,
      },
    }));
  };

  // Calculate post-optimization estimate
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

          <Button onClick={() => alert('Export Report functionality not implemented yet.')}>
            Export Report
          </Button>
        </Flex>
      </Flex>

      {/* Auto/Manual mode switch for main page */}
      <Flex align="center" gap="2" mb="3">
        <Text>Manual Input Mode (Main Page)</Text>
        <Switch checked={!mainAutoMode} onCheckedChange={(checked) => setMainAutoMode(!checked)} />
      </Flex>

      {/* KPI Cards */}
      <Grid columns={{ initial: '3', md: '3' }} gap="4" mb="4">
        <Card>
          <Text size="2">Actual Cost</Text>
          <Heading size="6">{formatCurrency(totalActual, currency)}</Heading>
        </Card>
        <Card>
          <Text size="2">Target Cost</Text>
          <Heading size="6">{formatCurrency(totalTarget, currency)}</Heading>
        </Card>
        <Card>
          <Text size="2">Cost After Optimization</Text>
          <Heading size="6">{formatCurrency(totalCostAfter, currency)}</Heading>
        </Card>
        <Card>
          <Text size="2">Benchmark Price</Text>
          <TextField
            type="number"
            value={benchmarkPrice}
            onChange={(e) => setBenchmarkPrice(parseFloat(e.target.value) || 0)}
          />
        </Card>
        <Card>
          <Text size="2">Profit Margin (%)</Text>
          <TextField
            type="number"
            value={profitMargin}
            onChange={(e) => setProfitMargin(parseFloat(e.target.value) || 0)}
          />
        </Card>
        <Card>
          <Text size="2">Progress to Target</Text>
          <Progress value={Math.min((targetCost / totalActual) * 100, 100)} />
          <Text>{Math.round((targetCost / totalActual) * 100)}%</Text>
        </Card>
        <Card>
          <Text size="2">Post-Optimization Estimate</Text>
          <Heading size="6">{formatCurrency(postOptimizationEstimate, currency)}</Heading>
        </Card>
      </Grid>

      {/* Charts inside Cards */}
      <Flex gap="8" mb="6" style={{ height: 300 }}>
        <Card style={{ flex: 1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[
                  {
                    name: 'Direct Cost',
                    value:
                      (editableTotals['Direct Materials']?.actual || 0) +
                      (editableTotals['Packaging Materials']?.actual || 0) +
                      (editableTotals['Direct Labor']?.actual || 0),
                  },
                  { name: 'Overhead', value: editableTotals['Overhead']?.actual || 0 },
                  { name: 'Other Costs', value: editableTotals['Other Costs']?.actual || 0 },
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
        </Card>

        <Card style={{ flex: 1 }}>
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
        </Card>
      </Flex>

      {/* Editable Table */}
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Category</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actual</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Target</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Cost After Optimization</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>% of Total</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>View Details</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {categories.map((category) => (
            <Table.Row key={category}>
              <Table.RowHeaderCell>{category}</Table.RowHeaderCell>
              <Table.Cell>
                {mainAutoMode ? (
                  formatCurrency(editableTotals[category]?.actual || 0, currency)
                ) : (
                  <TextField
                    type="number"
                    value={editableTotals[category]?.actual || 0}
                    onChange={(e) =>
                      handleMainValueChange(category, 'actual', parseFloat(e.target.value) || 0)
                    }
                  />
                )}
              </Table.Cell>
              <Table.Cell>
                {mainAutoMode ? (
                  formatCurrency(editableTotals[category]?.target || 0, currency)
                ) : (
                  <TextField
                    type="number"
                    value={editableTotals[category]?.target || 0}
                    onChange={(e) =>
                      handleMainValueChange(category, 'target', parseFloat(e.target.value) || 0)
                    }
                  />
                )}
              </Table.Cell>
              <Table.Cell>
                {mainAutoMode ? (
                  formatCurrency(editableTotals[category]?.costAfter || 0, currency)
                ) : (
                  <TextField
                    type="number"
                    value={editableTotals[category]?.costAfter || 0}
                    onChange={(e) =>
                      handleMainValueChange(category, 'costAfter', parseFloat(e.target.value) || 0)
                    }
                  />
                )}
              </Table.Cell>
              <Table.Cell>{percentOfTotal(category)}%</Table.Cell>
              <Table.Cell>
                <Button onClick={() => setDialogCategory(category)}>View Details</Button>
              </Table.Cell>
            </Table.Row>
          ))}
          <Table.Row>
            <Table.RowHeaderCell>
              <b>Total</b>
            </Table.RowHeaderCell>
            <Table.Cell>
              <b>{formatCurrency(totalActual, currency)}</b>
            </Table.Cell>
            <Table.Cell>
              <b>{formatCurrency(totalTarget, currency)}</b>
            </Table.Cell>
            <Table.Cell>
              <b>{formatCurrency(totalCostAfter, currency)}</b>
            </Table.Cell>
            <Table.Cell>
              <b>100%</b>
            </Table.Cell>
            <Table.Cell></Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>

      {/* Dialog with details */}
      {dialogCategory && (
        <Dialog.Root open onOpenChange={() => setDialogCategory(null)}>
          <Dialog.Content maxWidth="600px">
            <Dialog.Title>{dialogCategory} Breakdown</Dialog.Title>

            {/* Auto/Manual switch for dialog */}
            <Flex justify="between" align="center" mb="3">
              <Text>Manual Input Mode (Dialog)</Text>
              <Switch
                checked={!dialogAutoMode}
                onCheckedChange={(checked) => setDialogAutoMode(!checked)}
              />
            </Flex>

            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Item</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>
                    Qty / Concentration (kg) / Hours
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Unit Price</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Cost</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Solution</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {editableDialogItems.map((item, index) => {
                  const costValue = item.cost ?? 0;

                  const handleChange = (field: keyof Item) => (
                    e: React.ChangeEvent<HTMLInputElement>,
                  ) => {
                    handleDialogItemChange(index, field, e.target.value);
                  };

                  return (
                    <Table.Row key={index}>
                      <Table.RowHeaderCell>{item.name}</Table.RowHeaderCell>

                      {/* Qty / Concentration / Hours */}
                      {dialogCategory === 'Direct Materials' && (
                        <Table.Cell>
                          {dialogAutoMode ? (
                            item.concentrationKg ?? '-'
                          ) : (
                            <TextField
                              type="number"
                              value={item.concentrationKg ?? ''}
                              onChange={handleChange('concentrationKg')}
                            />
                          )}
                        </Table.Cell>
                      )}

                      {dialogCategory === 'Packaging Materials' && (
                        <Table.Cell>
                          {dialogAutoMode ? (
                            item.qty ?? '-'
                          ) : (
                            <TextField
                              type="number"
                              value={item.qty ?? ''}
                              onChange={handleChange('qty')}
                            />
                          )}
                        </Table.Cell>
                      )}

                      {dialogCategory === 'Direct Labor' && (
                        <Table.Cell>
                          {dialogAutoMode ? (
                            item.hours ?? '-'
                          ) : (
                            <TextField
                              type="number"
                              value={item.hours ?? ''}
                              onChange={handleChange('hours')}
                            />
                          )}
                        </Table.Cell>
                      )}

                      {dialogCategory === 'Overhead' && (
                        <Table.Cell>
                          {dialogAutoMode ? (
                            item.qty ?? '-'
                          ) : (
                            <TextField
                              type="number"
                              value={item.qty ?? ''}
                              onChange={handleChange('qty')}
                            />
                          )}
                        </Table.Cell>
                      )}

                      {dialogCategory === 'Other Costs' && (
                        <Table.Cell>
                          {dialogAutoMode ? (
                            item.qty ?? '-'
                          ) : (
                            <TextField
                              type="number"
                              value={item.qty ?? ''}
                              onChange={handleChange('qty')}
                            />
                          )}
                        </Table.Cell>
                      )}

                      {/* Unit Price */}
                      <Table.Cell>
                        {dialogAutoMode ? (
                          formatCurrency(item.unitPrice ?? 0, currency)
                        ) : (
                          <TextField
                            type="number"
                            value={item.unitPrice ?? ''}
                            onChange={handleChange('unitPrice')}
                          />
                        )}
                      </Table.Cell>

                      {/* Cost */}
                      <Table.Cell>{formatCurrency(costValue, currency)}</Table.Cell>

                      {/* Solution Select */}
                      <Table.Cell>
                        <RadixSelect.Root
                          value={solutions[dialogCategory]?.[index] || ''}
                          onValueChange={(val) =>
                            handleSolutionChange(dialogCategory, index, val)
                          }
                        >
                          <RadixSelect.Trigger aria-label="Select solution" />
                          <RadixSelect.Content>
                            {solutionsOptions.map((opt) => (
                              <RadixSelect.Item key={opt} value={opt}>
                                {opt}
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

            <Dialog.Close asChild>
              <Button mt="4" variant="accent">
                Close
              </Button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Root>
      )}
    </Box>
  );
}
