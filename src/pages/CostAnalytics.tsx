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
  BarChart,
  Bar,
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
  name: string;
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

const SOLUTIONS_CONFIG: SolutionConfig[] = [
  {
    name: 'Negotiating better prices with supplier',
    actions: ['Initiate supplier negotiation'],
    applyAdjustment: (item: Item) => {
      if ('pricePerKg' in item) item.pricePerKg! *= 0.9;
      if ('unitPrice' in item) item.unitPrice! *= 0.9;
    },
    applicableTo: ['Direct Materials', 'Packaging Materials'],
    details: {
      suppliers: [
        { name: 'Supplier A', price: 45, rating: 4.5, deliveryTime: '2 weeks', reliability: 95 },
        { name: 'Supplier B', price: 48, rating: 4.2, deliveryTime: '1 week', reliability: 90 },
        { name: 'Supplier C', price: 42, rating: 4.0, deliveryTime: '3 weeks', reliability: 85 }
      ],
      currentPrice: 50
    }
  },
  {
    name: 'Other Solutions',
    actions: ['Create custom improvement plan'],
    applyAdjustment: (item: Item) => {},
    applicableTo: ['*']
  }
];

const simulatedIoTCostData: SimulatedIoTCostData = {
  totals: {
    'Direct Materials': { actual: 1000, budget: 950, costAfter: 900 },
    'Packaging Materials': { actual: 500, budget: 450, costAfter: 400 },
    'Direct Labor': { actual: 800, budget: 750, costAfter: 700 },
    'Overhead': { actual: 600, budget: 550, costAfter: 500 },
    'Other Costs': { actual: 300, budget: 250, costAfter: 200 }
  },
  rawMaterials: [
    { name: 'Material A', concentrationKg: 10, pricePerKg: 50 },
    { name: 'Material B', concentrationKg: 5, pricePerKg: 30 }
  ],
  packagingMaterials: [
    { name: 'Boxes', qty: 100, unitPrice: 2 },
    { name: 'Labels', qty: 200, unitPrice: 0.5 }
  ],
  directLabor: [
    { name: 'Assembly', hours: 40, hourlyRate: 15 },
    { name: 'Inspection', hours: 20, hourlyRate: 12 }
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
  const [solutionDialog, setSolutionDialog] = useState<{
    open: boolean;
    solution: SolutionConfig | null;
    category: CostCategory | null;
    itemIndex: number | null;
    selectedSupplier: Supplier | null;
  }>({ 
    open: false, 
    solution: null, 
    category: null, 
    itemIndex: null,
    selectedSupplier: null
  });

  const totals = data.totals;
  const totalActual = categories.reduce((sum, category) => sum + totals[category].actual, 0);
  const totalTarget = categories.reduce((sum, category) => sum + totals[category].budget, 0);
  const totalCostAfter = categories.reduce((sum, category) => sum + totals[category].costAfter, 0);
  const targetCost = benchmarkPrice * (1 - profitMargin / 100);

  const handleBenchmarkChange = (value: number) => {
    setBenchmarkPrice(value);
  };

  const benchmarkTrendData = [
    { month: 'Jan', actual: 169.61, benchmark: benchmarkPrice },
    { month: 'Feb', actual: 170.5, benchmark: benchmarkPrice },
    { month: 'Mar', actual: 168.0, benchmark: benchmarkPrice },
    { month: 'Apr', actual: 171.2, benchmark: benchmarkPrice },
    { month: 'May', actual: totalActual, benchmark: benchmarkPrice }
  ];

  const pieColors = ['#3b82f6', '#f59e0b', '#ef4444', '#10b981', '#a855f7'];

  const percentOfTotal = (category: CostCategory) =>
    totalActual === 0 ? '0.00' : ((totals[category].actual / totalActual) * 100).toFixed(2);

  const handleSolutionChange = (category: CostCategory, index: number, solutionName: string) => {
    const solution = SOLUTIONS_CONFIG.find(s => s.name === solutionName);
    if (!solution) return;

    if (!solution.applicableTo.includes('*') && !solution.applicableTo.includes(category)) {
      alert('This solution is not applicable for the selected category');
      return;
    }

    let selectedSupplier = null;
    if (solution.details?.suppliers) {
      // Auto-select best supplier based on price and rating
      selectedSupplier = solution.details.suppliers.reduce((best, current) => {
        const bestScore = best.price * 0.7 + (5 - best.rating) * 0.3;
        const currentScore = current.price * 0.7 + (5 - current.rating) * 0.3;
        return currentScore < bestScore ? current : best;
      });
    }

    setSolutionDialog({ 
      open: true, 
      solution,
      category,
      itemIndex: index,
      selectedSupplier
    });
  };

  const applySolution = () => {
    if (!solutionDialog.solution || solutionDialog.category === null || solutionDialog.itemIndex === null) return;

    const newData = {...data};
    const category = solutionDialog.category;
    const itemIndex = solutionDialog.itemIndex;
    const item = getDetailsByCategory(category)[itemIndex];

    if (solutionDialog.selectedSupplier) {
      if ('pricePerKg' in item) {
        item.pricePerKg = solutionDialog.selectedSupplier.price;
      } else if ('unitPrice' in item) {
        item.unitPrice = solutionDialog.selectedSupplier.price;
      }
    }

    // Calculate new cost after applying solution
    const newCost = calculateItemCost(item, category);
    newData.totals[category].costAfter = newCost;

    // Update solutions tracking
    const updatedSolutions = {
      ...solutions,
      [category]: {
        ...solutions[category],
        [itemIndex]: solutionDialog.solution.name
      }
    };

    setSolutions(updatedSolutions);
    setData(newData);
    setSolutionDialog({...solutionDialog, open: false});
  };

  const renderSolutionDialogContent = () => {
    if (!solutionDialog.solution || !solutionDialog.category || solutionDialog.itemIndex === null) return null;

    const item = getDetailsByCategory(solutionDialog.category)[solutionDialog.itemIndex];
    const currentCost = calculateItemCost(item, solutionDialog.category);
    let newCost = currentCost;

    if (solutionDialog.selectedSupplier) {
      if ('concentrationKg' in item) {
        newCost = item.concentrationKg! * solutionDialog.selectedSupplier.price;
      } else if ('qty' in item) {
        newCost = item.qty! * solutionDialog.selectedSupplier.price;
      }
    }

    return (
      <Box>
        <Flex justify="between" mb="4">
          <Box>
            <Text size="2" color="gray">Current Price</Text>
            <Text size="5" weight="bold">
              {formatCurrency(
                'pricePerKg' in item ? item.pricePerKg! : 
                'unitPrice' in item ? item.unitPrice! : 0, 
                currency
              )}
            </Text>
          </Box>
          <Box>
            <Text size="2" color="gray">New Price</Text>
            <Text size="5" weight="bold" color="green">
              {solutionDialog.selectedSupplier ? 
                formatCurrency(solutionDialog.selectedSupplier.price, currency) : 
                'No supplier selected'}
            </Text>
          </Box>
        </Flex>

        <Flex justify="between" mb="4">
          <Box>
            <Text size="2" color="gray">Current Cost</Text>
            <Text size="5" weight="bold">
              {formatCurrency(currentCost, currency)}
            </Text>
          </Box>
          <Box>
            <Text size="2" color="gray">Cost After</Text>
            <Text size="5" weight="bold" color="green">
              {formatCurrency(newCost, currency)}
            </Text>
          </Box>
        </Flex>

        {solutionDialog.solution.details?.suppliers && (
          <>
            <Heading size="4" mb="3">Supplier Comparison</Heading>
            <Table.Root mt="4">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Supplier</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Price</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Rating</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Select</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {solutionDialog.solution.details.suppliers.map((supplier, idx) => (
                  <Table.Row key={idx} style={
                    solutionDialog.selectedSupplier?.name === supplier.name ? 
                    { backgroundColor: '#f0fdf4' } : {}
                  }>
                    <Table.Cell>{supplier.name}</Table.Cell>
                    <Table.Cell>{formatCurrency(supplier.price, currency)}</Table.Cell>
                    <Table.Cell>
                      <Progress value={supplier.rating * 20} />
                      {supplier.rating}/5
                    </Table.Cell>
                    <Table.Cell>
                      <Button
                        size="1"
                        variant={solutionDialog.selectedSupplier?.name === supplier.name ? 'solid' : 'outline'}
                        onClick={() => setSolutionDialog({
                          ...solutionDialog,
                          selectedSupplier: supplier
                        })}
                      >
                        {solutionDialog.selectedSupplier?.name === supplier.name ? 'Selected' : 'Select'}
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </>
        )}
      </Box>
    );
  };

  return (
    <Box p="6" style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
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
      </Grid>

      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Cost Category</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actual Cost</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Target Cost</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Cost After Optimization</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Details</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {categories.map((category) => (
            <Table.Row key={category}>
              <Table.RowHeaderCell>{category}</Table.RowHeaderCell>
              <Table.Cell>{formatCurrency(totals[category].actual, currency)}</Table.Cell>
              <Table.Cell>{formatCurrency(totals[category].budget, currency)}</Table.Cell>
              <Table.Cell>{formatCurrency(totals[category].costAfter, currency)}</Table.Cell>
              <Table.Cell>
                <Button onClick={() => setDialogCategory(category)}>View Details</Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      {dialogCategory && (
        <Dialog.Root open onOpenChange={() => setDialogCategory(null)}>
          <Dialog.Content maxWidth="700px" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <Dialog.Title>{dialogCategory} Breakdown</Dialog.Title>
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Item</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Qty/Units</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Unit Price</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Current Cost</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Cost After</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Solution</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {getDetailsByCategory(dialogCategory).map((item, index) => {
                  const currentCost = calculateItemCost(item, dialogCategory);
                  const appliedSolution = solutions[dialogCategory]?.[index];
                  let costAfter = currentCost;

                  if (appliedSolution === 'Negotiating better prices with supplier') {
                    const solution = SOLUTIONS_CONFIG.find(s => s.name === appliedSolution);
                    const bestSupplier = solution?.details?.suppliers?.reduce((best, current) => 
                      current.price < best.price ? current : best
                    );
                    if (bestSupplier) {
                      costAfter = ('concentrationKg' in item ? item.concentrationKg! : item.qty!) * bestSupplier.price;
                    }
                  }

                  return (
                    <Table.Row key={index}>
                      <Table.RowHeaderCell>{item.name}</Table.RowHeaderCell>
                      <Table.Cell>
                        {dialogCategory === 'Direct Materials'
                          ? item.concentrationKg?.toFixed(3) ?? '-'
                          : dialogCategory === 'Direct Labor'
                          ? item.hours ?? '-'
                          : item.qty ?? '-'}
                      </Table.Cell>
                      <Table.Cell>
                        {dialogCategory === 'Direct Materials'
                          ? item.pricePerKg
                            ? formatCurrency(item.pricePerKg, currency)
                            : '-'
                          : dialogCategory === 'Direct Labor'
                          ? item.hourlyRate
                            ? formatCurrency(item.hourlyRate, currency)
                            : '-'
                          : item.unitPrice
                          ? formatCurrency(item.unitPrice, currency)
                          : '-'}
                      </Table.Cell>
                      <Table.Cell>{formatCurrency(currentCost, currency)}</Table.Cell>
                      <Table.Cell>{formatCurrency(costAfter, currency)}</Table.Cell>
                      <Table.Cell>
                        <RadixSelect.Root
                          value={solutions[dialogCategory]?.[index] || ''}
                          onValueChange={(value) => handleSolutionChange(dialogCategory, index, value)}
                        >
                          <RadixSelect.Trigger aria-label="Select solution" />
                          <RadixSelect.Content>
                            {SOLUTIONS_CONFIG.filter(s => s.applicableTo.includes(dialogCategory) || s.applicableTo.includes('*'))
                              .map((solution) => (
                                <RadixSelect.Item key={solution.name} value={solution.name}>
                                  {solution.name}
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
              onClick={() => setSolutionDialog({...solutionDialog, open: false})}
            >
              Cancel
            </Button>
            <Button 
              onClick={applySolution}
              disabled={solutionDialog.solution?.name === 'Negotiating better prices with supplier' && 
                       !solutionDialog.selectedSupplier}
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
      </Flex>
    </Box>
  );
}

export default CostAnalytics;
