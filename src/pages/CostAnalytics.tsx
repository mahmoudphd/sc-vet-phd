// src/pages/CostAnalytics.tsx

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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

type CostCategory =
  | 'Direct Materials'
  | 'Packaging Materials'
  | 'Direct Labor'
  | 'Overhead'
  | 'Other Costs';

interface RawMaterial {
  name: string;
  concentration: number;
  pricePerKg: number;
  cost: number;
}

interface DirectLabor {
  role: string;
  hourlyRate: number;
  costPerUnit: number;
  cost: number;
}

interface CostItem {
  item: string;
  qty: number;
  unitPrice: number;
  cost: number;
}

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

// Initial data simulating IoT data inputs or blockchain retrieved data

const initialRawMaterialsData: RawMaterial[] = [
  { name: 'Vitamin B1', concentration: 0.001, pricePerKg: 540, cost: 0.54 },
  { name: 'Vitamin B2', concentration: 0.006, pricePerKg: 600, cost: 3.6 },
  { name: 'Vitamin B12', concentration: 0.001, pricePerKg: 2300, cost: 2.3 },
  { name: 'Nicotinamide B3', concentration: 0.01, pricePerKg: 400, cost: 4 },
  { name: 'Pantothenic Acid', concentration: 0.004, pricePerKg: 1700, cost: 6.8 },
  { name: 'Vitamin B6', concentration: 0.0015, pricePerKg: 900, cost: 1.35 },
  { name: 'Leucine', concentration: 0.03, pricePerKg: 200, cost: 6 },
  { name: 'Threonine', concentration: 0.01, pricePerKg: 950, cost: 9.5 },
  { name: 'Taurine', concentration: 0.0025, pricePerKg: 3000, cost: 7.5 },
  { name: 'Glycine', concentration: 0.0025, pricePerKg: 4200, cost: 10.5 },
  { name: 'Arginine', concentration: 0.0025, pricePerKg: 5000, cost: 12.5 },
  { name: 'Cynarin', concentration: 0.0025, pricePerKg: 3900, cost: 9.75 },
  { name: 'Silymarin', concentration: 0.025, pricePerKg: 700, cost: 17.5 },
  { name: 'Sorbitol', concentration: 0.01, pricePerKg: 360, cost: 3.6 },
  { name: 'Carnitine', concentration: 0.005, pricePerKg: 1070, cost: 5.35 },
  { name: 'Betaine', concentration: 0.02, pricePerKg: 1250, cost: 25 },
  { name: 'Tween-80', concentration: 0.075, pricePerKg: 90, cost: 6.75 },
  { name: 'Water', concentration: 0.571, pricePerKg: 1, cost: 0.571 },
];

const initialDirectLaborData: DirectLabor[] = [
  { role: 'Operator', hourlyRate: 0.585, costPerUnit: 3, cost: 1.755 },
  { role: 'Supervisor', hourlyRate: 0.1465, costPerUnit: 6, cost: 0.879 },
  { role: 'Quality Control', hourlyRate: 0.0732, costPerUnit: 5, cost: 0.366 },
];

const initialOtherCostsData: CostItem[] = [
  { item: 'Transportation', qty: 1, unitPrice: 6.67, cost: 6.67 },
  { item: 'Packaging Waste Disposal', qty: 1, unitPrice: 3.33, cost: 3.33 },
  { item: 'Rework', qty: 1, unitPrice: 5.0, cost: 5.0 },
];

const initialPackagingMaterialsData: CostItem[] = [
  { item: 'Plastic Bottle (1 L)', qty: 1, unitPrice: 10, cost: 10 },
  { item: 'Safety Seal', qty: 1, unitPrice: 3, cost: 3 },
  { item: 'Cap', qty: 1, unitPrice: 5, cost: 5 },
];

// Utility to format currency with two decimals
const formatCurrency = (value: number, currency: string) =>
  `${currency} ${value.toFixed(2)}`;

export default function CostAnalytics() {
  const [dialogCategory, setDialogCategory] = useState<CostCategory | null>(null);
  const [autoMode, setAutoMode] = useState(true);
  const [currency, setCurrency] = useState<'EGP' | 'USD'>('EGP');
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [benchmarkPrice, setBenchmarkPrice] = useState(220);
  const [profitMargin, setProfitMargin] = useState(25);

  const [solutions, setSolutions] = useState<Record<string, Record<number, string>>>({});

  // Editable data states
  const [rawMaterialsData, setRawMaterialsData] = useState<RawMaterial[]>(initialRawMaterialsData);
  const [directLaborData, setDirectLaborData] = useState<DirectLabor[]>(initialDirectLaborData);
  const [otherCostsData, setOtherCostsData] = useState<CostItem[]>(initialOtherCostsData);
  const [packagingMaterialsData, setPackagingMaterialsData] = useState<CostItem[]>(initialPackagingMaterialsData);

  // Calculation helpers
  const calcTotal = (data: Array<{ cost: number }>) =>
    data.reduce((sum, item) => sum + item.cost, 0);

  // Totals for each category
  const totals = {
    'Direct Materials': calcTotal(rawMaterialsData),
    'Direct Labor': calcTotal(directLaborData),
    'Other Costs': calcTotal(otherCostsData),
    'Packaging Materials': calcTotal(packagingMaterialsData),
    Overhead: 0, // Placeholder, as no overhead data given
  };

  const totalActual = Object.values(totals).reduce((acc, val) => acc + val, 0);
  const targetCost = benchmarkPrice * (1 - profitMargin / 100);
  const totalCostAfter = totalActual; // Could be updated if costAfter differs

  // Sample benchmark trend data for the bar chart
  const benchmarkTrendDataWithGap = [
    { month: 'Jan', actual: 169.61, benchmark: benchmarkPrice, targetCost },
    { month: 'Feb', actual: 170.5, benchmark: benchmarkPrice, targetCost },
    { month: 'Mar', actual: 168.0, benchmark: benchmarkPrice, targetCost },
    { month: 'Apr', actual: 171.2, benchmark: benchmarkPrice, targetCost },
    { month: 'May', actual: totalActual, benchmark: benchmarkPrice, targetCost },
  ];

  // Handle solution selection per category item
  const handleSolutionChange = (category: CostCategory, index: number, value: string) => {
    setSolutions((prev) => ({
      ...prev,
      [category]: { ...(prev[category] || {}), [index]: value },
    }));
  };

  // Handle manual changes for each data category only if manual mode enabled
  const handleRawMaterialsChange = (
    index: number,
    field: keyof RawMaterial,
    value: string
  ) => {
    if (autoMode) return;
    setRawMaterialsData((prev) => {
      const updated = [...prev];
      if (field === 'name') {
        updated[index][field] = value;
      } else {
        const numValue = parseFloat(value);
        updated[index][field] = isNaN(numValue) ? 0 : numValue;
        // recalc cost if qty or price changes
        if (field === 'concentration' || field === 'pricePerKg') {
          updated[index].cost = parseFloat(
            (updated[index].concentration * updated[index].pricePerKg).toFixed(3)
          );
        }
      }
      return updated;
    });
  };

  const handleDirectLaborChange = (
    index: number,
    field: keyof DirectLabor,
    value: string
  ) => {
    if (autoMode) return;
    setDirectLaborData((prev) => {
      const updated = [...prev];
      if (field === 'role') {
        updated[index][field] = value;
      } else {
        const numValue = parseFloat(value);
        updated[index][field] = isNaN(numValue) ? 0 : numValue;
        if (field === 'hourlyRate' || field === 'costPerUnit') {
          updated[index].cost = parseFloat(
            (updated[index].hourlyRate * updated[index].costPerUnit).toFixed(3)
          );
        }
      }
      return updated;
    });
  };

  const handleOtherCostsChange = (
    index: number,
    field: keyof CostItem,
    value: string
  ) => {
    if (autoMode) return;
    setOtherCostsData((prev) => {
      const updated = [...prev];
      if (field === 'item') {
        updated[index][field] = value;
      } else {
        const numValue = parseFloat(value);
        updated[index][field] = isNaN(numValue) ? 0 : numValue;
        if (field === 'qty' || field === 'unitPrice') {
          updated[index].cost = parseFloat(
            (updated[index].qty * updated[index].unitPrice).toFixed(3)
          );
        }
      }
      return updated;
    });
  };

  const handlePackagingMaterialsChange = (
    index: number,
    field: keyof CostItem,
    value: string
  ) => {
    if (autoMode) return;
    setPackagingMaterialsData((prev) => {
      const updated = [...prev];
      if (field === 'item') {
        updated[index][field] = value;
      } else {
        const numValue = parseFloat(value);
        updated[index][field] = isNaN(numValue) ? 0 : numValue;
        if (field === 'qty' || field === 'unitPrice') {
          updated[index].cost = parseFloat(
            (updated[index].qty * updated[index].unitPrice).toFixed(3)
          );
        }
      }
      return updated;
    });
  };

  // Render table content based on category
  const renderCategoryTable = (category: CostCategory) => {
    switch (category) {
      case 'Direct Materials':
        return (
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Composition</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Concentration (kg)</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Price/Kg ({currency})</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Cost ({currency})</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Solution</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {rawMaterialsData.map((item, idx) => (
                <Table.Row key={idx}>
                  <Table.RowHeaderCell>
                    {autoMode ? (
                      item.name
                    ) : (
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleRawMaterialsChange(idx, 'name', e.target.value)}
                        style={{ width: '100%' }}
                      />
                    )}
                  </Table.RowHeaderCell>
                  <Table.Cell>
                    {autoMode ? (
                      item.concentration
                    ) : (
                      <input
                        type="number"
                        step="0.0001"
                        value={item.concentration}
                        onChange={(e) => handleRawMaterialsChange(idx, 'concentration', e.target.value)}
                        style={{ width: '100%' }}
                      />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {autoMode ? (
                      formatCurrency(item.pricePerKg, currency)
                    ) : (
                      <input
                        type="number"
                        step="0.01"
                        value={item.pricePerKg}
                        onChange={(e) => handleRawMaterialsChange(idx, 'pricePerKg', e.target.value)}
                        style={{ width: '100%' }}
                      />
                    )}
                  </Table.Cell>
                  <Table.Cell>{formatCurrency(item.cost, currency)}</Table.Cell>
                  <Table.Cell>
                    <RadixSelect.Root
                      value={solutions['Direct Materials']?.[idx] || ''}
                      onValueChange={(val) => handleSolutionChange('Direct Materials', idx, val)}
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
              ))}
            </Table.Body>
          </Table.Root>
        );

      case 'Direct Labor':
        return (
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Hourly Rate ({currency})</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Cost per Unit ({currency})</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Cost ({currency})</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Solution</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {directLaborData.map((item, idx) => (
                <Table.Row key={idx}>
                  <Table.RowHeaderCell>
                    {autoMode ? (
                      item.role
                    ) : (
                      <input
                        type="text"
                        value={item.role}
                        onChange={(e) => handleDirectLaborChange(idx, 'role', e.target.value)}
                        style={{ width: '100%' }}
                      />
                    )}
                  </Table.RowHeaderCell>
                  <Table.Cell>
                    {autoMode ? (
                      formatCurrency(item.hourlyRate, currency)
                    ) : (
                      <input
                        type="number"
                        step="0.001"
                        value={item.hourlyRate}
                        onChange={(e) => handleDirectLaborChange(idx, 'hourlyRate', e.target.value)}
                        style={{ width: '100%' }}
                      />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {autoMode ? (
                      formatCurrency(item.costPerUnit, currency)
                    ) : (
                      <input
                        type="number"
                        step="0.01"
                        value={item.costPerUnit}
                        onChange={(e) => handleDirectLaborChange(idx, 'costPerUnit', e.target.value)}
                        style={{ width: '100%' }}
                      />
                    )}
                  </Table.Cell>
                  <Table.Cell>{formatCurrency(item.cost, currency)}</Table.Cell>
                  <Table.Cell>
                    <RadixSelect.Root
                      value={solutions['Direct Labor']?.[idx] || ''}
                      onValueChange={(val) => handleSolutionChange('Direct Labor', idx, val)}
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
              ))}
            </Table.Body>
          </Table.Root>
        );

      case 'Other Costs':
        return (
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Item</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Qty</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Unit Price ({currency})</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Cost ({currency})</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Solution</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {otherCostsData.map((item, idx) => (
                <Table.Row key={idx}>
                  <Table.RowHeaderCell>
                    {autoMode ? (
                      item.item
                    ) : (
                      <input
                        type="text"
                        value={item.item}
                        onChange={(e) => handleOtherCostsChange(idx, 'item', e.target.value)}
                        style={{ width: '100%' }}
                      />
                    )}
                  </Table.RowHeaderCell>
                  <Table.Cell>
                    {autoMode ? (
                      item.qty
                    ) : (
                      <input
                        type="number"
                        step="0.01"
                        value={item.qty}
                        onChange={(e) => handleOtherCostsChange(idx, 'qty', e.target.value)}
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
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => handleOtherCostsChange(idx, 'unitPrice', e.target.value)}
                        style={{ width: '100%' }}
                      />
                    )}
                  </Table.Cell>
                  <Table.Cell>{formatCurrency(item.cost, currency)}</Table.Cell>
                  <Table.Cell>
                    <RadixSelect.Root
                      value={solutions['Other Costs']?.[idx] || ''}
                      onValueChange={(val) => handleSolutionChange('Other Costs', idx, val)}
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
              ))}
            </Table.Body>
          </Table.Root>
        );

      case 'Packaging Materials':
        return (
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Item</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Qty</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Unit Price ({currency})</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Cost ({currency})</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Solution</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {packagingMaterialsData.map((item, idx) => (
                <Table.Row key={idx}>
                  <Table.RowHeaderCell>
                    {autoMode ? (
                      item.item
                    ) : (
                      <input
                        type="text"
                        value={item.item}
                        onChange={(e) => handlePackagingMaterialsChange(idx, 'item', e.target.value)}
                        style={{ width: '100%' }}
                      />
                    )}
                  </Table.RowHeaderCell>
                  <Table.Cell>
                    {autoMode ? (
                      item.qty
                    ) : (
                      <input
                        type="number"
                        step="0.01"
                        value={item.qty}
                        onChange={(e) => handlePackagingMaterialsChange(idx, 'qty', e.target.value)}
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
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => handlePackagingMaterialsChange(idx, 'unitPrice', e.target.value)}
                        style={{ width: '100%' }}
                      />
                    )}
                  </Table.Cell>
                  <Table.Cell>{formatCurrency(item.cost, currency)}</Table.Cell>
                  <Table.Cell>
                    <RadixSelect.Root
                      value={solutions['Packaging Materials']?.[idx] || ''}
                      onValueChange={(val) => handleSolutionChange('Packaging Materials', idx, val)}
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
              ))}
            </Table.Body>
          </Table.Root>
        );

      default:
        return null;
    }
  };

  // Percentage of total actual cost per category
  const percentOfTotal = (category: CostCategory) =>
    ((totals[category] / totalActual) * 100).toFixed(2);

  // Export function placeholder
  const handleExportReport = () => {
    alert('Export Report functionality not implemented.');
  };

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

      <Grid columns="3" gap="4" mb="4">
        <Box>
          <Text size="2">Actual Cost</Text>
          <Heading size="6">{formatCurrency(totalActual, currency)}</Heading>
        </Box>
        <Box>
          <Text size="2">Benchmark Price</Text>
          <input
            type="number"
            value={benchmarkPrice}
            onChange={(e) => setBenchmarkPrice(parseFloat(e.target.value))}
            style={{ width: '100%', padding: '8px', fontSize: '1rem', borderRadius: 4, border: '1px solid #ccc' }}
          />
        </Box>
        <Box>
          <Text size="2">Profit Margin (%)</Text>
          <input
            type="number"
            value={profitMargin}
            onChange={(e) => setProfitMargin(parseFloat(e.target.value))}
            style={{ width: '100%', padding: '8px', fontSize: '1rem', borderRadius: 4, border: '1px solid #ccc' }}
          />
        </Box>
        <Box>
          <Text size="2">Target Cost</Text>
          <Heading size="6">{formatCurrency(targetCost, currency)}</Heading>
        </Box>
        <Box>
          <Text size="2">Progress to Target</Text>
          <Progress value={(targetCost / totalActual) * 100} />
          <Text>{Math.round((targetCost / totalActual) * 100)}%</Text>
        </Box>
        <Box>
          <Text size="2">Post-Optimization Estimate</Text>
          <Heading size="6">{formatCurrency(totalCostAfter * (1 - profitMargin / 100), currency)}</Heading>
        </Box>
      </Grid>

      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Category</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actual</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>% of Total</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>View Details</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {categories.map((category) => (
            <Table.Row key={category}>
              <Table.RowHeaderCell>{category}</Table.RowHeaderCell>
              <Table.Cell>{formatCurrency(totals[category], currency)}</Table.Cell>
              <Table.Cell>{percentOfTotal(category)}%</Table.Cell>
              <Table.Cell>
                <Button onClick={() => setDialogCategory(category)}>View Details</Button>
              </Table.Cell>
            </Table.Row>
          ))}
          <Table.Row>
            <Table.RowHeaderCell><b>Total</b></Table.RowHeaderCell>
            <Table.Cell><b>{formatCurrency(totalActual, currency)}</b></Table.Cell>
            <Table.Cell><b>100%</b></Table.Cell>
            <Table.Cell></Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>

      <Box mt="6" style={{ height: 300 }}>
        <ResponsiveContainer>
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

      {dialogCategory && (
        <Dialog.Root open onOpenChange={() => setDialogCategory(null)}>
          <Dialog.Content maxWidth="800px" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <Dialog.Title>{dialogCategory} Breakdown</Dialog.Title>
            <Flex justify="between" align="center" my="3">
              <Text>Auto Mode</Text>
              <Switch checked={autoMode} onCheckedChange={setAutoMode} />
            </Flex>
            {!autoMode && (
              <Text color="gray" mb="3">
                Manual input mode enabled. You can modify the cost data here.
              </Text>
            )}

            {renderCategoryTable(dialogCategory)}

            <Flex justify="end" gap="3" mt="3">
              <Button onClick={() => setDialogCategory(null)}>Close</Button>
              <Button
                color="green"
                disabled={autoMode}
                onClick={() => {
                  alert('Submit functionality not implemented.');
                  setDialogCategory(null);
                }}
              >
                Submit
              </Button>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      )}
    </Box>
  );
}
