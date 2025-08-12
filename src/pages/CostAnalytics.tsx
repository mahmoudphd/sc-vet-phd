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
  TextField
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
  BarChart,
  Bar
} from 'recharts';

interface Item {
  name: string;
  cost?: number;
  qty?: number;
  unitPrice?: number;
  concentrationKg?: number;
  pricePerKg?: number;
  hours?: number;
  hourlyRate?: number;
}

type CostCategory = 'Direct Materials' | 'Packaging Materials' | 'Direct Labor' | 'Overhead' | 'Other Costs';

interface CostData {
  actual: number;
  budget: number;
  costAfter: number;
}

interface SimulatedIoTCostData {
  totals: Record<CostCategory, CostData>;
  rawMaterials: Item[];
  packagingMaterials: Item[];
  directLabor: Item[];
  overheadItems: Item[];
  otherCosts: Item[];
}

interface Supplier {
  name: 'Supplier A' | 'Supplier B' | 'Supplier C';
  price: number;
  rating: number;
  deliveryTime: string;
  reliability: number;
}

interface SolutionDetails {
  suppliers?: Supplier[];
  currentPrice?: number;
}

interface SolutionConfig {
  name: string;
  actions: string[];
  applyAdjustment: (item: Item) => void;
  applicableTo: (CostCategory | '*')[];
  details?: SolutionDetails;
}

const SOLUTION_OPTIONS = [
  'Negotiating better prices with supplier',
  'Reducing waste in material usage',
  'Automation to reduce manual labor costs',
  'Optimizing machine usage',
  'Improving inventory management',
  'Minimize transportation costs',
  'Reduce rework costs',
  'Other'
] as const;

const NEGOTIATION_SOLUTION: SolutionConfig = {
  name: 'Negotiating better prices with supplier',
  actions: ['Initiate supplier negotiation'],
  applyAdjustment: (item: Item) => {
    if ('pricePerKg' in item) item.pricePerKg! *= 0.9;
    if ('unitPrice' in item) item.unitPrice! *= 0.9;
  },
  applicableTo: ['Direct Materials', 'Packaging Materials'],
  details: {
    suppliers: [
      { name: 'Supplier A', price: 0, rating: 4.5, deliveryTime: '2 weeks', reliability: 95 },
      { name: 'Supplier B', price: 0, rating: 4.2, deliveryTime: '1 week', reliability: 90 },
      { name: 'Supplier C', price: 0, rating: 4.0, deliveryTime: '3 weeks', reliability: 85 }
    ],
    currentPrice: 0
  }
};

const OTHER_SOLUTION: SolutionConfig = {
  name: 'Other',
  actions: ['Create custom improvement plan'],
  applyAdjustment: () => {},
  applicableTo: ['*'],
  details: undefined
};

const simulatedIoTCostData: SimulatedIoTCostData = {
  totals: {
    'Direct Materials': { actual: 0, budget: 0, costAfter: 0 },
    'Packaging Materials': { actual: 500, budget: 450, costAfter: 400 },
    'Direct Labor': { actual: 800, budget: 750, costAfter: 700 },
    'Overhead': { actual: 600, budget: 550, costAfter: 500 },
    'Other Costs': { actual: 300, budget: 250, costAfter: 200 }
  },
  rawMaterials: [
    { name: 'Vitamin B1', concentrationKg: 0.001, pricePerKg: 540 },
    { name: 'Vitamin B2', concentrationKg: 0.006, pricePerKg: 600 },
    { name: 'Vitamin B12', concentrationKg: 0.001, pricePerKg: 2300 },
    { name: 'Nicotinamide B3', concentrationKg: 0.010, pricePerKg: 400 },
    { name: 'Pantothenic Acid', concentrationKg: 0.004, pricePerKg: 1700 },
    { name: 'Vitamin B6', concentrationKg: 0.002, pricePerKg: 900 },
    { name: 'Leucine', concentrationKg: 0.030, pricePerKg: 200 },
    { name: 'Threonine', concentrationKg: 0.010, pricePerKg: 950 },
    { name: 'Taurine', concentrationKg: 0.003, pricePerKg: 3000 },
    { name: 'Glycine', concentrationKg: 0.003, pricePerKg: 4200 },
    { name: 'Arginine', concentrationKg: 0.003, pricePerKg: 5000 },
    { name: 'Cynarin', concentrationKg: 0.003, pricePerKg: 3900 },
    { name: 'Silymarin', concentrationKg: 0.025, pricePerKg: 700 },
    { name: 'Sorbitol', concentrationKg: 0.010, pricePerKg: 360 },
    { name: 'Carnitine', concentrationKg: 0.005, pricePerKg: 1070 },
    { name: 'Betaine', concentrationKg: 0.020, pricePerKg: 1250 },
    { name: 'Tween-80', concentrationKg: 0.075, pricePerKg: 90 },
    { name: 'Water', concentrationKg: 0.571, pricePerKg: 1 }
  ],
  packagingMaterials: [
    { name: 'Bottles', qty: 100, unitPrice: 2 },
    { name: 'Labels', qty: 200, unitPrice: 0.5 },
    { name: 'Caps', qty: 100, unitPrice: 0.3 }
  ],
  directLabor: [
    { name: 'Mixing', hours: 40, hourlyRate: 15 },
    { name: 'Quality Control', hours: 20, hourlyRate: 12 }
  ],
  overheadItems: [
    { name: 'Electricity', cost: 200 },
    { name: 'Rent', cost: 400 }
  ],
  otherCosts: [
    { name: 'Transportation', cost: 150 },
    { name: 'Miscellaneous', cost: 150 }
  ]
};

// Calculate initial Direct Materials total
simulatedIoTCostData.totals['Direct Materials'].actual = simulatedIoTCostData.rawMaterials.reduce(
  (sum, item) => sum + (item.concentrationKg || 0) * (item.pricePerKg || 0), 
  0
);

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

const getDetailsByCategory = (category: CostCategory): Item[] => {
  switch (category) {
    case 'Direct Materials': return simulatedIoTCostData.rawMaterials;
    case 'Packaging Materials': return simulatedIoTCostData.packagingMaterials;
    case 'Direct Labor': return simulatedIoTCostData.directLabor;
    case 'Overhead': return simulatedIoTCostData.overheadItems;
    case 'Other Costs': return simulatedIoTCostData.otherCosts;
    default: return [];
  }
};

const calculateItemCost = (item: Item, category: CostCategory): number => {
  if (category === 'Direct Materials') {
    return (item.concentrationKg || 0) * (item.pricePerKg || 0);
  } else if (category === 'Direct Labor') {
    return (item.hours || 0) * (item.hourlyRate || 0);
  } else if ('cost' in item) {
    return item.cost || 0;
  } else {
    return (item.qty || 0) * (item.unitPrice || 0);
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
  const [pendingActions, setPendingActions] = useState<string[]>([]);
  const [solutionDialog, setSolutionDialog] = useState<{
    open: boolean;
    solution: SolutionConfig | null;
    category: CostCategory | null;
    itemIndex: number | null;
    selectedSupplier?: Supplier | null;
    reductionPercentage?: number;
  }>({ 
    open: false, 
    solution: null, 
    category: null, 
    itemIndex: null,
    selectedSupplier: null,
    reductionPercentage: 5
  });
  const [supplierDialogEditable, setSupplierDialogEditable] = useState(false);
  const [editableSupplierData, setEditableSupplierData] = useState<Supplier[]>([]);

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

  const determineBestSupplier = (suppliers: Supplier[]) => {
    return suppliers.reduce((prev, current) => 
      (current.price < prev.price) ? current : prev
    );
  };

  const handleSolutionChange = (category: CostCategory, index: number, solutionName: string) => {
    if (solutionName === 'Negotiating better prices with supplier') {
      const item = getDetailsByCategory(category)[index];
      const currentPrice = item.pricePerKg || item.unitPrice || 0;
      
      const updatedSuppliers = NEGOTIATION_SOLUTION.details?.suppliers?.map(supplier => ({
        ...supplier,
        price: parseFloat((currentPrice * (supplier.name === 'Supplier A' ? 0.92 : supplier.name === 'Supplier B' ? 0.88 : 0.82)).toFixed(2))
      })) || [];

      setEditableSupplierData([...updatedSuppliers]);
      
      setSolutionDialog({ 
        open: true, 
        solution: {
          ...NEGOTIATION_SOLUTION,
          details: {
            ...NEGOTIATION_SOLUTION.details,
            suppliers: updatedSuppliers,
            currentPrice,
            costComparison: {
              current: currentPrice,
              potential: updatedSuppliers[0].price
            }
          }
        },
        category,
        itemIndex: index,
        selectedSupplier: null
      });
    } else if (solutionName === 'Other') {
      setSolutions(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [index]: 'Other'
        }
      }));
    } else {
      alert(`Solution "${solutionName}" will not be implemented in this demo`);
    }
  };

  const handleSupplierDataChange = (index: number, field: keyof Supplier, value: any) => {
    const updatedSuppliers = [...editableSupplierData];
    updatedSuppliers[index] = {
      ...updatedSuppliers[index],
      [field]: field === 'price' || field === 'rating' ? Number(value) : value
    };
    setEditableSupplierData(updatedSuppliers);
  };

  const applySolution = () => {
    if (!solutionDialog.solution || solutionDialog.category === null || solutionDialog.itemIndex === null) return;

    const item = getDetailsByCategory(solutionDialog.category)[solutionDialog.itemIndex];
    const newData = {...data};

    try {
      setPendingActions(prev => [...prev, ...solutionDialog.solution?.actions || []]);
      
      if (solutionDialog.solution.name === 'Negotiating better prices with supplier') {
        const selectedSupplier = solutionDialog.selectedSupplier || 
                               determineBestSupplier(editableSupplierData);
        
        if ('pricePerKg' in item) item.pricePerKg = selectedSupplier.price;
        if ('unitPrice' in item) item.unitPrice = selectedSupplier.price;
        
        newData.totals[solutionDialog.category].costAfter = getDetailsByCategory(solutionDialog.category).reduce(
          (sum, item) => sum + calculateItemCost(item, solutionDialog.category!), 
          0
        );
      }

      setSolutions(prev => ({
        ...prev,
        [solutionDialog.category!]: {
          ...prev[solutionDialog.category!],
          [solutionDialog.itemIndex!]: solutionDialog.solution?.name || ''
        }
      }));
      
      setData(newData);
      setPendingActions(prev => prev.filter(a => !solutionDialog.solution?.actions.includes(a)));
      setSolutionDialog({...solutionDialog, open: false});
      setSupplierDialogEditable(false);
    } catch (error) {
      alert('Error applying solution');
      setPendingActions(prev => prev.filter(a => !solutionDialog.solution?.actions.includes(a)));
      setSolutionDialog({...solutionDialog, open: false});
      setSupplierDialogEditable(false);
    }
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

  const renderSolutionDialogContent = () => {
    if (!solutionDialog.solution) return null;

    if (solutionDialog.solution.name === 'Negotiating better prices with supplier') {
      const suppliersToShow = supplierDialogEditable ? editableSupplierData : solutionDialog.solution.details?.suppliers || [];
      const bestSupplier = determineBestSupplier(suppliersToShow);
      
      return (
        <Box>
          <Flex justify="between" align="center" mb="4">
            <Text>Edit Mode</Text>
            <Switch 
              checked={supplierDialogEditable} 
              onCheckedChange={(checked) => {
                setSupplierDialogEditable(checked);
                if (!checked) {
                  setEditableSupplierData([...(solutionDialog.solution?.details?.suppliers || [])]);
                }
              }} 
            />
          </Flex>

          <Flex justify="between" mb="4">
            <Box>
              <Text size="2" color="gray">Current Price/kg</Text>
              <Text size="5" weight="bold">
                {formatCurrency(solutionDialog.solution.details?.currentPrice || 0, currency)}
              </Text>
            </Box>
            <Box>
              <Text size="2" color="gray">Potential Savings/kg</Text>
              <Text size="5" weight="bold" color="green">
                {formatCurrency(
                  (solutionDialog.solution.details?.currentPrice || 0) - 
                  (solutionDialog.selectedSupplier?.price || bestSupplier.price), 
                  currency
                )}
              </Text>
            </Box>
          </Flex>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={suppliersToShow}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value), currency)} />
              <Legend />
              <Bar dataKey="price" fill="#3b82f6" name="Price/kg" />
              <Bar dataKey="rating" fill="#10b981" name="Rating" />
            </BarChart>
          </ResponsiveContainer>

          <Table.Root mt="4">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Supplier</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Price/kg</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Rating</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Delivery</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Reliability</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Select</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {suppliersToShow.map((supplier, idx) => {
                const isAutoSelected = !supplierDialogEditable && supplier.name === bestSupplier.name;
                const isManuallySelected = solutionDialog.selectedSupplier?.name === supplier.name;
                
                return (
                  <Table.Row 
                    key={idx} 
                    style={{
                      ...(isAutoSelected ? { backgroundColor: '#f0fdf4', border: '1px solid #10b981' } : {}),
                      ...(isManuallySelected ? { backgroundColor: '#e0f2fe' } : {})
                    }}
                  >
                    <Table.Cell>
                      {isAutoSelected && (
                        <Text color="green" style={{ marginRight: 8 }}>✓</Text>
                      )}
                      {supplier.name}
                    </Table.Cell>
                    <Table.Cell>
                      {supplierDialogEditable ? (
                        <TextField.Root>
                          <TextField.Input
                            type="number"
                            value={supplier.price}
                            onChange={(e) => handleSupplierDataChange(idx, 'price', e.target.value)}
                          />
                        </TextField.Root>
                      ) : formatCurrency(supplier.price, currency)}
                    </Table.Cell>
                    <Table.Cell>
                      {supplierDialogEditable ? (
                        <TextField.Root>
                          <TextField.Input
                            type="number"
                            min="1"
                            max="5"
                            step="0.1"
                            value={supplier.rating}
                            onChange={(e) => handleSupplierDataChange(idx, 'rating', e.target.value)}
                          />
                        </TextField.Root>
                      ) : (
                        <>
                          <Progress value={supplier.rating * 20} />
                          {supplier.rating}/5
                        </>
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      {supplierDialogEditable ? (
                        <TextField.Root>
                          <TextField.Input
                            value={supplier.deliveryTime}
                            onChange={(e) => handleSupplierDataChange(idx, 'deliveryTime', e.target.value)}
                          />
                        </TextField.Root>
                      ) : supplier.deliveryTime}
                    </Table.Cell>
                    <Table.Cell>
                      {supplierDialogEditable ? (
                        <TextField.Root>
                          <TextField.Input
                            type="number"
                            min="1"
                            max="100"
                            value={supplier.reliability}
                            onChange={(e) => handleSupplierDataChange(idx, 'reliability', e.target.value)}
                          />
                        </TextField.Root>
                      ) : `${supplier.reliability}%`}
                    </Table.Cell>
                    <Table.Cell>
                      <Button
                        size="1"
                        variant={isAutoSelected || isManuallySelected ? 'solid' : 'outline'}
                        onClick={() => setSolutionDialog({
                          ...solutionDialog,
                          selectedSupplier: supplier
                        })}
                      >
                        {isAutoSelected ? 'Auto-Selected' : 
                         isManuallySelected ? 'Selected' : 'Select'}
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table.Root>
        </Box>
      );
    }

    return null;
  };

  return (
    <Box p="6" style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {pendingActions.length > 0 && (
        <Box style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          backgroundColor: '#fff',
          padding: 16,
          borderRadius: 8,
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          zIndex: 1000
        }}>
          <Heading size="4" mb="2">Pending Actions</Heading>
          {pendingActions.map((action, i) => (
            <Flex key={i} align="center" gap="2" mb="1">
              <Progress value={100} style={{width: 100}} />
              <Text size="2">{action}</Text>
            </Flex>
          ))}
        </Box>
      )}

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
          <Button onClick={handleExportReport}>Export Report</Button>
        </Flex>
      </Flex>

      <Grid columns={{ initial: '3', md: '3' }} gap="4" mb="6">
        <Box style={{ border: '1px solid #ccc', borderRadius: 8, padding: 12, backgroundColor: '#fff' }}>
          <Text size="2">Actual Cost</Text>
          <Heading size="6">{formatCurrency(totalActual, currency)}</Heading>
        </Box>
        <Box style={{ border: '1px solid #ccc', borderRadius: 8, padding: 12, backgroundColor: '#fff' }}>
          <Text size="2">Target Cost</Text>
          <Heading size="6">{formatCurrency(totalTarget, currency)}</Heading>
        </Box>
        <Box style={{ border: '1px solid #ccc', borderRadius: 8, padding: 12, backgroundColor: '#fff' }}>
          <Text size="2">Cost After Optimization</Text>
          <Heading size="6">{formatCurrency(totalCostAfter, currency)}</Heading>
        </Box>
        <Box style={{ border: '1px solid #ccc', borderRadius: 8, padding: 12, backgroundColor: '#fff' }}>
          <Text size="2">Post-Optimization Estimate</Text>
          <Heading size="6">{formatCurrency(postOptimizationEstimate, currency)}</Heading>
        </Box>
        <Box style={{ border: '1px solid #ccc', borderRadius: 8, padding: 12, backgroundColor: '#fff' }}>
          <Text size="2">Benchmark Price</Text>
          <input
            type="number"
            value={benchmarkPrice}
            onChange={(e) => handleBenchmarkChange(parseFloat(e.target.value) || 0)}
            style={{ width: '80px', marginTop: '4px' }}
          />
          <Heading size="6" mt="2">{formatCurrency(benchmarkPrice, currency)}</Heading>
        </Box>
        <Box style={{ border: '1px solid #ccc', borderRadius: 8, padding: 12, backgroundColor: '#fff' }}>
          <Text size="2">Profit Margin (%)</Text>
          <input
            type="number"
            value={profitMargin}
            onChange={(e) => setProfitMargin(parseFloat(e.target.value) || 0)}
            style={{ width: '80px', marginTop: '4px' }}
          />
          <Heading size="6" mt="2">{profitMargin}%</Heading>
        </Box>
      </Grid>

      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Cost Category</Table.ColumnHeaderCell>
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
          <Dialog.Content maxWidth="700px" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <Dialog.Title>{dialogCategory} Breakdown</Dialog.Title>
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
                      costValue = (item.concentrationKg || 0) * (item.pricePerKg || 0);
                    } else if (dialogCategory === 'Direct Labor') {
                      costValue = (item.hours || 0) * (item.hourlyRate || 0);
                    } else {
                      costValue = (item.qty || 0) * (item.unitPrice || 0);
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
                            {SOLUTION_OPTIONS.map((option) => (
                              <RadixSelect.Item 
                                key={option} 
                                value={option}
                                disabled={
                                  option === 'Negotiating better prices with supplier' && 
                                  !['Direct Materials', 'Packaging Materials'].includes(dialogCategory)
                                }
                              >
                                {option}
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

      <Dialog.Root open={solutionDialog.open} onOpenChange={(open) => setSolutionDialog({...solutionDialog, open})}>
        <Dialog.Content style={{ maxWidth: 800, maxHeight: '90vh', overflowY: 'auto' }}>
          <Dialog.Title>{solutionDialog.solution?.name}</Dialog.Title>
          
          {renderSolutionDialogContent()}

          <Flex gap="3" mt="4" justify="end">
            <Button 
              variant="soft" 
              onClick={() => {
                setSolutionDialog({...solutionDialog, open: false});
                setSupplierDialogEditable(false);
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={applySolution}
              disabled={
                solutionDialog.solution?.name === 'Negotiating better prices with supplier' && 
                !solutionDialog.selectedSupplier && 
                !supplierDialogEditable
              }
            >
              Apply Solution
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      <Flex mt="8" gap="6" wrap="wrap" justify="center">
        <Box style={{
          backgroundColor: '#fff',
          padding: 20,
          borderRadius: 10,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          minWidth: 300,
          flex: '1 1 300px',
        }}>
          <Heading size="4" mb="3" align="center">
            Cost Gap Analysis
          </Heading>
          <Text align="center" mb="4" size="2">
            Total Cost Gap: {formatCurrency(totalActual - targetCost, currency)}
          </Text>
          <Grid columns={{ initial: '3' }} gap="2">
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
        <Box style={{
          backgroundColor: '#fff',
          padding: 20,
          borderRadius: 10,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          minWidth: 300,
          flex: '1 1 300px',
        }}>
          <Heading size="4" mb="3" align="center">
            Cost Breakdown Pie Chart
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
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {categories.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Box>
        <Box style={{
          backgroundColor: '#fff',
          padding: 20,
          borderRadius: 10,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          minWidth: 300,
          flex: '1 1 300px',
        }}>
          <Heading size="4" mb="3" align="center">
            Benchmark Trend Line Chart
          </Heading>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={benchmarkTrendDataWithGap}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="actual" stroke="#3b82f6" activeDot={{ r: 8 }} name="Actual Cost" />
              <Line type="monotone" dataKey="benchmark" stroke="#f59e0b" name="Benchmark Price" strokeDasharray="5 5" />
              <Line type="monotone" dataKey="targetCost" stroke="#10b981" name="Target Cost" strokeDasharray="3 4 5 2" />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Flex>

      <Flex justify="end" mt="6">
        <Button style={{ backgroundColor: '#10b981', color: '#fff', fontWeight: 'bold' }}
          onClick={() => alert('Submit All clicked')}>
          Submit to Blockchain
        </Button>
      </Flex>
    </Box>
  );
}

export default CostAnalytics;
