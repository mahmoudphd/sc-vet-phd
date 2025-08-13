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
  Badge,
  Tabs
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
  CartesianGrid
} from 'recharts';
import { DownloadIcon, UploadIcon } from '@radix-ui/react-icons';

interface Item {
  name: string;
  qty?: number;
  unitPrice?: number;
  cost?: number;
  costAfter?: number;
  concentrationKg?: number;
  pricePerKg?: number;
  hours?: number;
  hourlyRate?: number;
  qualityRating?: number;
  deliveryTime?: number;
  reliability?: number;
  totalCost?: number;
  basis?: number;
}

interface CostTotals {
  actual: number;
  budget: number;
  costAfter: number;
}

type CostCategory = 'Direct Materials' | 'Packaging Materials' | 'Direct Labor' | 'Overhead' | 'Other Costs';

interface CostData {
  rawMaterials: Item[];
  packagingMaterials: Item[];
  directLabor: Item[];
  overheadItems: Item[];
  otherCosts: Item[];
  totals: Record<CostCategory, CostTotals>;
}

interface Supplier {
  id: number;
  name: string;
  pricePerKg: number;
  rating: number;
  delivery: string;
  reliability: string;
  selected?: boolean;
}

export const simulatedIoTCostData: CostData = {
  totals: {
    'Direct Materials': { actual: 133.11, budget: 129, costAfter: 130 },
    'Packaging Materials': { actual: 18, budget: 16, costAfter: 16 },
    'Direct Labor': { actual: 3, budget: 2, costAfter: 2 },
    'Overhead': { actual: 2, budget: 2, costAfter: 2 },
    'Other Costs': { actual: 15, budget: 13, costAfter: 14 },
  },
  rawMaterials: [
    { name: 'Vitamin B1', concentrationKg: 0.001, pricePerKg: 540, cost: 0.54 },
    { name: 'Vitamin B2', concentrationKg: 0.006, pricePerKg: 600, cost: 3.6 },
    { name: 'Vitamin B12', concentrationKg: 0.001, pricePerKg: 2300, cost: 2.3 },
    { name: 'Nicotinamide B3', concentrationKg: 0.01, pricePerKg: 400, cost: 4 },
    { name: 'Pantothenic Acid', concentrationKg: 0.004, pricePerKg: 1700, cost: 6.8 },
    { name: 'Vitamin B6', concentrationKg: 0.0015, pricePerKg: 900, cost: 1.35 },
    { name: 'Leucine', concentrationKg: 0.03, pricePerKg: 200, cost: 6 },
    { name: 'Threonine', concentrationKg: 0.01, pricePerKg: 950, cost: 9.5 },
    { name: 'Taurine', concentrationKg: 0.0025, pricePerKg: 3000, cost: 7.5 },
    { name: 'Glycine', concentrationKg: 0.0025, pricePerKg: 4200, cost: 10.5 },
    { name: 'Arginine', concentrationKg: 0.0025, pricePerKg: 5000, cost: 12.5 },
    { name: 'Cynarin', concentrationKg: 0.0025, pricePerKg: 3900, cost: 9.75 },
    { name: 'Silymarin', concentrationKg: 0.025, pricePerKg: 700, cost: 17.5 },
    { name: 'Sorbitol', concentrationKg: 0.01, pricePerKg: 360, cost: 3.6 },
    { name: 'Carnitine', concentrationKg: 0.005, pricePerKg: 1070, cost: 5.35 },
    { name: 'Betaine', concentrationKg: 0.02, pricePerKg: 1250, cost: 25 },
    { name: 'Tween-80', concentrationKg: 0.075, pricePerKg: 90, cost: 6.75 },
    { name: 'Water', concentrationKg: 0.571, pricePerKg: 1, cost: 0.571 },
  ],
  packagingMaterials: [
    { name: 'Plastic Bottle (1 L)', qty: 1, unitPrice: 10, cost: 10 },
    { name: 'Safety Seal', qty: 1, unitPrice: 3, cost: 3 },
    { name: 'Cap', qty: 1, unitPrice: 5, cost: 5 },
  ],
  directLabor: [
    { name: 'Operator', hours: 0.5, hourlyRate: 3.5, cost: 1.75 },
    { name: 'Supervisor', hours: 0.5, hourlyRate: 1.75, cost: 0.88 },
    { name: 'Quality Control', hours: 0.5, hourlyRate: 0.74, cost: 0.37 },
  ],
  overheadItems: [
    { name: 'Rent', totalCost: 1000, basis: 1000, cost: 1 },
    { name: 'Electricity', totalCost: 500, basis: 1000, cost: 0.5 },
    { name: 'Maintenance', totalCost: 1500, basis: 1000, cost: 1.5 },
  ],
  otherCosts: [
    { name: 'Transportation', qty: 1, unitPrice: 6.67, cost: 6.67 },
    { name: 'Packaging Waste Disposal', qty: 1, unitPrice: 3.33, cost: 3.33 },
    { name: 'Rework', qty: 1, unitPrice: 5.0, cost: 5 },
  ],
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

const products = ['Poultry Drug A', 'Poultry Drug B', 'Poultry Drug C'];

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
  const [viewMode, setViewMode] = useState<'actual' | 'target'>('actual');
  const [benchmarkPrice, setBenchmarkPrice] = useState(220);
  const [profitMargin, setProfitMargin] = useState(25);
  const [currency, setCurrency] = useState<'EGP' | 'USD'>('EGP');
  const [autoMode, setAutoMode] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [data, setData] = useState(simulatedIoTCostData);
  const [solutions, setSolutions] = useState<Record<CostCategory, Record<number, string>>>({
    'Direct Materials': {},
    'Packaging Materials': {},
    'Direct Labor': {},
    'Overhead': {},
    'Other Costs': {},
  });
  const [selectedSolution, setSelectedSolution] = useState<{
    category: CostCategory | null;
    index: number | null;
    solution: string | null;
  }>({ category: null, index: null, solution: null });
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: 1,
      name: 'Supplier A',
      pricePerKg: 496.80,
      rating: 4.7,
      delivery: '1 week',
      reliability: '97%'
    },
    {
      id: 2,
      name: 'Supplier B',
      pricePerKg: 475.20,
      rating: 4.2,
      delivery: '2 weeks',
      reliability: '90%'
    },
    {
      id: 3,
      name: 'Supplier C',
      pricePerKg: 442.80,
      rating: 3.8,
      delivery: '3 weeks',
      reliability: '85%'
    }
  ]);
  const [currentPrice, setCurrentPrice] = useState(540.00);
  const [potentialSavings, setPotentialSavings] = useState(0);

  const getDetailsByCategory = (category: CostCategory): Item[] => {
    switch (category) {
      case 'Direct Materials': return data.rawMaterials;
      case 'Packaging Materials': return data.packagingMaterials;
      case 'Direct Labor': return data.directLabor;
      case 'Overhead': return data.overheadItems;
      case 'Other Costs': return data.otherCosts;
      default: return [];
    }
  };

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

  const handleSolutionSelect = (category: CostCategory, index: number, solution: string) => {
    setSelectedSolution({ category, index, solution });
    handleSolutionChange(category, index, solution);
    
    if (category === 'Direct Materials') {
      const item = data.rawMaterials[index];
      setCurrentPrice(item.pricePerKg || 0);
    }
  };

  const handleSupplierSelect = (id: number) => {
    setSuppliers(prev => prev.map(supplier => ({
      ...supplier,
      selected: supplier.id === id
    })));
    
    const selectedSupplier = suppliers.find(s => s.id === id);
    if (selectedSupplier) {
      const savings = currentPrice - selectedSupplier.pricePerKg;
      setPotentialSavings(savings > 0 ? savings : 0);
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

  const handleSubmitToBlockchain = () => {
    alert('Data submitted to blockchain successfully!');
  };

  const handleSubmitDialog = (category: CostCategory) => {
    const items = getDetailsByCategory(category);
    const newActual = items.reduce((sum, item) => {
      if (category === 'Direct Materials') {
        return sum + ((item.concentrationKg || 0) * (item.pricePerKg || 0));
      } else if (category === 'Direct Labor') {
        return sum + ((item.hours || 0) * (item.hourlyRate || 0));
      } else if (category === 'Overhead') {
        return sum + ((item.totalCost || 0) / (item.basis || 1));
      } else {
        return sum + ((item.qty || 0) * (item.unitPrice || 0));
      }
    }, 0);

    setData(prev => ({
      ...prev,
      totals: {
        ...prev.totals,
        [category]: {
          ...prev.totals[category],
          actual: newActual
        }
      }
    }));

    setDialogCategory(null);
  };

  return (
    <Box p="6" style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <Flex justify="between" align="center" mb="6" wrap="wrap" gap="3">
        <Heading size="6" weight="bold" style={{ color: '#1f2937' }}>Inter-Organizational Cost Management</Heading>
        <Flex gap="3" align="center" wrap="wrap">
          <Flex align="center" gap="2">
            <Text size="2" weight="bold" style={{ color: '#4b5563' }}>Product:</Text>
            <RadixSelect.Root
              value={selectedProduct}
              onValueChange={(value) => setSelectedProduct(value)}
            >
              <RadixSelect.Trigger style={{ 
                minWidth: '120px',
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '6px'
              }} />
              <RadixSelect.Content style={{
                backgroundColor: 'white',
                borderRadius: '6px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}>
                {products.map((p) => (
                  <RadixSelect.Item key={p} value={p} style={{
                    padding: '8px 12px'
                  }}>
                    {p}
                  </RadixSelect.Item>
                ))}
              </RadixSelect.Content>
            </RadixSelect.Root>
          </Flex>
          
          <Flex align="center" gap="2">
            <Text size="2" weight="bold" style={{ color: '#4b5563' }}>Currency:</Text>
            <RadixSelect.Root
              value={currency}
              onValueChange={(value) => setCurrency(value as 'EGP' | 'USD')}
            >
              <RadixSelect.Trigger style={{ 
                minWidth: '80px',
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '6px'
              }} />
              <RadixSelect.Content style={{
                backgroundColor: 'white',
                borderRadius: '6px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}>
                <RadixSelect.Item value="EGP" style={{
                  padding: '8px 12px'
                }}>EGP</RadixSelect.Item>
                <RadixSelect.Item value="USD" style={{
                  padding: '8px 12px'
                }}>USD</RadixSelect.Item>
              </RadixSelect.Content>
            </RadixSelect.Root>
          </Flex>

          <Button 
            variant="soft" 
            onClick={handleExportReport}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '6px',
              fontWeight: '500'
            }}
          >
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
          <Card 
            key={index} 
            style={{ 
              position: 'relative',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              transition: 'all 0.2s ease',
              backgroundColor: 'white'
            }}
          >
            <Flex direction="column" gap="2" p="4">
              <Flex justify="between" align="center">
                <Text size="2" color="gray" weight="medium">
                  {item.label}
                </Text>
                {item.trend && (
                  <Badge 
                    color={
                      item.trend === 'up' ? 'green' : 
                      item.trend === 'down' ? 'red' : 'gray'
                    }
                    style={{
                      borderRadius: '9999px',
                      padding: '2px 8px',
                      fontWeight: '500'
                    }}
                  >
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
                      padding: '6px 10px',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0',
                      backgroundColor: '#f9fafb',
                      fontSize: '14px'
                    }}
                  />
                  <Text size="4" weight="bold" style={{ color: '#1f2937' }}>
                    {item.label.includes('%') ? `${item.value}%` : formatCurrency(item.value as number, currency)}
                  </Text>
                </Flex>
              ) : (
                <Heading size="5" style={{ fontWeight: '600', color: '#1f2937' }}>
                  {item.label.includes('%') ? `${item.value}%` : formatCurrency(item.value as number, currency)}
                </Heading>
              )}
            </Flex>
          </Card>
        ))}
      </Grid>

      <Card mb="6" style={{ 
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        backgroundColor: 'white'
      }}>
        <Inset clip="padding-box" side="top" pb="current">
          <Table.Root variant="surface">
            <Table.Header style={{ backgroundColor: '#f3f4f6' }}>
              <Table.Row>
                <Table.ColumnHeaderCell style={{ 
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  padding: '12px 16px'
                }}>Cost Category</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell style={{ 
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  padding: '12px 16px'
                }}>Actual Cost</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell style={{ 
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  padding: '12px 16px'
                }}>Target Cost</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell style={{ 
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  padding: '12px 16px'
                }}>Variance</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell style={{ 
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  padding: '12px 16px'
                }}>% of Total</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell style={{ 
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  padding: '12px 16px'
                }}>Cost After Optimization</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell style={{ 
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  padding: '12px 16px'
                }}>Details</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {categories.map((category) => {
                const variance = totals[category].actual - totals[category].budget;
                const varianceColor = variance <= 0 ? 'green' : 'red';
                return (
                  <Table.Row key={category}>
                    <Table.RowHeaderCell style={{ 
                      padding: '12px 16px',
                      borderBottom: '1px solid #e5e7eb'
                    }}>{category}</Table.RowHeaderCell>
                    <Table.Cell style={{ 
                      padding: '12px 16px',
                      borderBottom: '1px solid #e5e7eb'
                    }}>{formatCurrency(totals[category].actual, currency)}</Table.Cell>
                    <Table.Cell style={{ 
                      padding: '12px 16px',
                      borderBottom: '1px solid #e5e7eb'
                    }}>
                      <input
                        type="number"
                        value={totals[category].budget}
                        onChange={(e) => handleTargetChange(category, parseFloat(e.target.value) || 0)}
                        style={{
                          width: '80px',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          border: '1px solid #e2e8f0',
                          backgroundColor: '#f9fafb',
                          fontSize: '14px'
                        }}
                      />
                    </Table.Cell>
                    <Table.Cell style={{ 
                      color: varianceColor,
                      padding: '12px 16px',
                      borderBottom: '1px solid #e5e7eb',
                      fontWeight: '500'
                    }}>
                      {formatCurrency(variance, currency)}
                    </Table.Cell>
                    <Table.Cell style={{ 
                      padding: '12px 16px',
                      borderBottom: '1px solid #e5e7eb'
                    }}>{percentOfTotal(category)}%</Table.Cell>
                    <Table.Cell style={{ 
                      padding: '12px 16px',
                      borderBottom: '1px solid #e5e7eb'
                    }}>{formatCurrency(totals[category].costAfter, currency)}</Table.Cell>
                    <Table.Cell style={{ 
                      padding: '12px 16px',
                      borderBottom: '1px solid #e5e7eb'
                    }}>
                      <Button 
                        size="1" 
                        variant="outline" 
                        onClick={() => setDialogCategory(category)}
                        style={{
                          borderRadius: '6px',
                          padding: '4px 8px',
                          fontSize: '0.875rem',
                          borderColor: '#e5e7eb'
                        }}
                      >
                        View Details
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
              <Table.Row style={{ 
                backgroundColor: '#f8fafc',
                fontWeight: '600'
              }}>
                <Table.RowHeaderCell style={{ 
                  padding: '12px 16px',
                  borderBottom: '1px solid #e5e7eb'
                }}><Text weight="bold">Total</Text></Table.RowHeaderCell>
                <Table.Cell style={{ 
                  padding: '12px 16px',
                  borderBottom: '1px solid #e5e7eb'
                }}><Text weight="bold">{formatCurrency(totalActual, currency)}</Text></Table.Cell>
                <Table.Cell style={{ 
                  padding: '12px 16px',
                  borderBottom: '1px solid #e5e7eb'
                }}><Text weight="bold">{formatCurrency(totalTarget, currency)}</Text></Table.Cell>
                <Table.Cell style={{ 
                  padding: '12px 16px',
                  borderBottom: '1px solid #e5e7eb'
                }}><Text weight="bold">{formatCurrency(totalActual - totalTarget, currency)}</Text></Table.Cell>
                <Table.Cell style={{ 
                  padding: '12px 16px',
                  borderBottom: '1px solid #e5e7eb'
                }}><Text weight="bold">100%</Text></Table.Cell>
                <Table.Cell style={{ 
                  padding: '12px 16px',
                  borderBottom: '1px solid #e5e7eb'
                }}><Text weight="bold">{formatCurrency(totalCostAfter, currency)}</Text></Table.Cell>
                <Table.Cell style={{ 
                  padding: '12px 16px',
                  borderBottom: '1px solid #e5e7eb'
                }}></Table.Cell>
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
            padding: '24px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb',
            backgroundColor: 'white'
          }}>
            <Flex justify="between" align="center" mb="4">
              <Dialog.Title style={{ 
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#1f2937'
              }}>
                {dialogCategory} Breakdown
              </Dialog.Title>
              <Flex align="center" gap="2">
                <Text size="2" style={{ color: '#4b5563' }}>Auto IoT Mode</Text>
                <Switch 
                  checked={autoMode} 
                  onCheckedChange={setAutoMode}
                />
              </Flex>
            </Flex>

            <Tabs.Root value={viewMode} onValueChange={(value) => setViewMode(value as 'actual' | 'target')}>
              <Tabs.List>
                <Tabs.Trigger value="actual">Actual View</Tabs.Trigger>
                <Tabs.Trigger value="target">Target View</Tabs.Trigger>
              </Tabs.List>

              <Box pt="3">
                <Tabs.Content value="actual">
                  <Table.Root variant="surface">
                    <Table.Header style={{ backgroundColor: '#f3f4f6' }}>
                      <Table.Row>
                        <Table.ColumnHeaderCell style={{ 
                          fontWeight: '600',
                          fontSize: '0.875rem',
                          padding: '12px 16px'
                        }}>Item</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell style={{ 
                          fontWeight: '600',
                          fontSize: '0.875rem',
                          padding: '12px 16px'
                        }}>Qty/Units</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell style={{ 
                          fontWeight: '600',
                          fontSize: '0.875rem',
                          padding: '12px 16px'
                        }}>Unit Price</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell style={{ 
                          fontWeight: '600',
                          fontSize: '0.875rem',
                          padding: '12px 16px'
                        }}>Total Cost</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell style={{ 
                          fontWeight: '600',
                          fontSize: '0.875rem',
                          padding: '12px 16px'
                        }}>Solution</Table.ColumnHeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {getDetailsByCategory(dialogCategory).map((item, index) => {
                        const qty = dialogCategory === 'Direct Materials' ? item.concentrationKg :
                                    dialogCategory === 'Direct Labor' ? item.hours : item.qty;
                        
                        const unitPrice = dialogCategory === 'Direct Materials' ? item.pricePerKg :
                                        dialogCategory === 'Direct Labor' ? item.hourlyRate : item.unitPrice;

                        const totalCost = (qty || 0) * (unitPrice || 0);

                        return (
                          <Table.Row key={index}>
                            <Table.RowHeaderCell style={{ 
                              padding: '12px 16px',
                              borderBottom: '1px solid #e5e7eb'
                            }}>{item.name}</Table.RowHeaderCell>
                            <Table.Cell style={{ 
                              padding: '12px 16px',
                              borderBottom: '1px solid #e5e7eb'
                            }}>
                              {autoMode ? (
                                dialogCategory === 'Direct Materials' 
                                  ? (qty?.toFixed(6) || '-')
                                  : (qty?.toString() || '-')
                              ) : (
                                <input
                                  type="number"
                                  value={qty || 0}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const value = parseFloat(e.target.value) || 0;
                                    if (dialogCategory === 'Direct Materials') item.concentrationKg = value;
                                    else if (dialogCategory === 'Direct Labor') item.hours = value;
                                    else if (item.qty !== undefined) item.qty = value;
                                  }}
                                  style={{ 
                                    width: '80px',
                                    padding: '6px 10px',
                                    borderRadius: '6px',
                                    border: '1px solid #e2e8f0',
                                    backgroundColor: '#f9fafb',
                                    fontSize: '14px'
                                  }}
                                />
                              )}
                            </Table.Cell>
                            <Table.Cell style={{ 
                              padding: '12px 16px',
                              borderBottom: '1px solid #e5e7eb'
                            }}>
                              {autoMode ? (
                                unitPrice ? formatCurrency(unitPrice, currency) : '-'
                              ) : (
                                <input
                                  type="number"
                                  value={unitPrice || 0}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const value = parseFloat(e.target.value) || 0;
                                    if (dialogCategory === 'Direct Materials') item.pricePerKg = value;
                                    else if (dialogCategory === 'Direct Labor') item.hourlyRate = value;
                                    else if (item.unitPrice !== undefined) item.unitPrice = value;
                                  }}
                                  style={{ 
                                    width: '80px',
                                    padding: '6px 10px',
                                    borderRadius: '6px',
                                    border: '1px solid #e2e8f0',
                                    backgroundColor: '#f9fafb',
                                    fontSize: '14px'
                                  }}
                                />
                              )}
                            </Table.Cell>
                            <Table.Cell style={{ 
                              padding: '12px 16px',
                              borderBottom: '1px solid #e5e7eb'
                            }}>{formatCurrency(totalCost, currency)}</Table.Cell>
                            <Table.Cell style={{ 
                              padding: '12px 16px',
                              borderBottom: '1px solid #e5e7eb'
                            }}>
                              <RadixSelect.Root
                                value={solutions[dialogCategory]?.[index] || ''}
                                onValueChange={(value) => handleSolutionSelect(dialogCategory, index, value)}
                              >
                                <RadixSelect.Trigger 
                                  aria-label="Select solution" 
                                  style={{
                                    backgroundColor: 'white',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '6px',
                                    padding: '6px 12px',
                                    fontSize: '0.875rem'
                                  }}
                                />
                                <RadixSelect.Content style={{
                                  backgroundColor: 'white',
                                  borderRadius: '6px',
                                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                }}>
                                  {solutionsOptions.map((sol) => (
                                    <RadixSelect.Item 
                                      key={sol} 
                                      value={sol}
                                      style={{
                                        padding: '8px 12px',
                                        fontSize: '0.875rem'
                                      }}
                                    >
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
                </Tabs.Content>

                <Tabs.Content value="target">
                  <Table.Root variant="surface">
                    <Table.Header style={{ backgroundColor: '#f3f4f6' }}>
                      <Table.Row>
                        <Table.ColumnHeaderCell style={{ 
                          fontWeight: '600',
                          fontSize: '0.875rem',
                          padding: '12px 16px'
                        }}>Item</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell style={{ 
                          fontWeight: '600',
                          fontSize: '0.875rem',
                          padding: '12px 16px'
                        }}>Target Qty</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell style={{ 
                          fontWeight: '600',
                          fontSize: '0.875rem',
                          padding: '12px 16px'
                        }}>Target Price</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell style={{ 
                          fontWeight: '600',
                          fontSize: '0.875rem',
                          padding: '12px 16px'
                        }}>Target Cost</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell style={{ 
                          fontWeight: '600',
                          fontSize: '0.875rem',
                          padding: '12px 16px'
                        }}>Potential Savings</Table.ColumnHeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {getDetailsByCategory(dialogCategory).map((item, index) => {
                        const actualQty = dialogCategory === 'Direct Materials' ? item.concentrationKg || 0 :
                                        dialogCategory === 'Direct Labor' ? item.hours || 0 : item.qty || 0;
                        
                        const actualPrice = dialogCategory === 'Direct Materials' ? item.pricePerKg || 0 :
                                          dialogCategory === 'Direct Labor' ? item.hourlyRate || 0 : item.unitPrice || 0;

                        const targetQty = actualQty * 0.9; // 10% reduction target
                        const targetPrice = actualPrice * 0.95; // 5% reduction target
                        const targetCost = targetQty * targetPrice;
                        const actualCost = actualQty * actualPrice;
                        const potentialSavings = actualCost - targetCost;

                        return (
                          <Table.Row key={index}>
                            <Table.RowHeaderCell style={{ 
                              padding: '12px 16px',
                              borderBottom: '1px solid #e5e7eb'
                            }}>{item.name}</Table.RowHeaderCell>
                            <Table.Cell style={{ 
                              padding: '12px 16px',
                              borderBottom: '1px solid #e5e7eb'
                            }}>
                              <input
                                type="number"
                                value={targetQty.toFixed(6)}
                                onChange={(e) => {
                                  // Handle target quantity change
                                }}
                                style={{ 
                                  width: '80px',
                                  padding: '6px 10px',
                                  borderRadius: '6px',
                                  border: '1px solid #e2e8f0',
                                  backgroundColor: '#f9fafb',
                                  fontSize: '14px'
                                }}
                              />
                            </Table.Cell>
                            <Table.Cell style={{ 
                              padding: '12px 16px',
                              borderBottom: '1px solid #e5e7eb'
                            }}>
                              <input
                                type="number"
                                value={targetPrice.toFixed(2)}
                                onChange={(e) => {
                                  // Handle target price change
                                }}
                                style={{ 
                                  width: '80px',
                                  padding: '6px 10px',
                                  borderRadius: '6px',
                                  border: '1px solid #e2e8f0',
                                  backgroundColor: '#f9fafb',
                                  fontSize: '14px'
                                }}
                              />
                            </Table.Cell>
                            <Table.Cell style={{ 
                              padding: '12px 16px',
                              borderBottom: '1px solid #e5e7eb'
                            }}>{formatCurrency(targetCost, currency)}</Table.Cell>
                            <Table.Cell style={{ 
                              color: potentialSavings > 0 ? '#10b981' : '#ef4444',
                              padding: '12px 16px',
                              borderBottom: '1px solid #e5e7eb',
                              fontWeight: '500'
                            }}>
                              {formatCurrency(potentialSavings, currency)}
                            </Table.Cell>
                          </Table.Row>
                        );
                      })}
                    </Table.Body>
                  </Table.Root>
                </Tabs.Content>
              </Box>
            </Tabs.Root>

            <Flex justify="end" gap="3" mt="4">
              <Button 
                style={{ 
                  backgroundColor: '#10b981', 
                  color: '#fff',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontWeight: '500'
                }}
                onClick={() => handleSubmitDialog(dialogCategory)}
              >
                Submit
              </Button>
              <Button
                variant="ghost"
                style={{ 
                  backgroundColor: '#3b82f6', 
                  color: '#fff',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontWeight: '500'
                }}
                onClick={() => setDialogCategory(null)}
              >
                Close
              </Button>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      )}

      {selectedSolution.solution && (
        <Dialog.Root open onOpenChange={() => setSelectedSolution({ category: null, index: null, solution: null })}>
          <Dialog.Content style={{ 
            maxWidth: '800px',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb',
            backgroundColor: 'white'
          }}>
            <Dialog.Title style={{ 
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '16px'
            }}>
              Supplier Negotiation
            </Dialog.Title>
            
            <Flex direction="column" gap="4">
              <Card style={{
                borderRadius: '8px',
                backgroundColor: '#f9fafb',
                padding: '16px'
              }}>
                <Flex justify="between" align="center">
                  <Text weight="bold" style={{ color: '#1f2937' }}>Current Price/kg:</Text>
                  <Text style={{ color: '#1f2937', fontWeight: '500' }}>{formatCurrency(currentPrice, currency)}</Text>
                </Flex>
                <Flex justify="between" align="center" mt="2">
                  <Text weight="bold" style={{ color: '#1f2937' }}>Potential Savings/kg:</Text>
                  <Text 
                    style={{ 
                      color: potentialSavings > 0 ? '#10b981' : '#ef4444',
                      fontWeight: '500'
                    }}
                  >
                    {formatCurrency(potentialSavings, currency)}
                  </Text>
                </Flex>
              </Card>

              <Card style={{
                borderRadius: '8px',
                backgroundColor: 'white',
                padding: '16px'
              }}>
                <Heading size="4" mb="3" style={{ 
                  color: '#1f2937',
                  fontWeight: '600'
                }}>
                  Supplier Comparison
                </Heading>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={suppliers.map(s => ({
                      name: s.name,
                      price: s.pricePerKg,
                      rating: s.rating
                    }))}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: '#4b5563', fontSize: 12 }}
                      axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <YAxis 
                      yAxisId="left" 
                      orientation="left" 
                      stroke="#3b82f6" 
                      tick={{ fill: '#4b5563', fontSize: 12 }}
                      axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right" 
                      stroke="#f59e0b" 
                      tick={{ fill: '#4b5563', fontSize: 12 }}
                      axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'Price' ? formatCurrency(Number(value), currency) : value,
                        name
                      ]}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Legend />
                    <Bar 
                      yAxisId="left" 
                      dataKey="price" 
                      name="Price/kg" 
                      fill="#3b82f6"
                      animationBegin={0}
                      animationDuration={1000}
                    >
                      {suppliers.map((_, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={suppliers[index].selected ? '#10b981' : '#3b82f6'}
                        />
                      ))}
                    </Bar>
                    <Bar 
                      yAxisId="right" 
                      dataKey="rating" 
                      name="Rating" 
                      fill="#f59e0b"
                      animationBegin={0}
                      animationDuration={1000}
                    >
                      {suppliers.map((_, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={suppliers[index].selected ? '#10b981' : '#f59e0b'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card style={{
                borderRadius: '8px',
                backgroundColor: 'white',
                padding: '16px'
              }}>
                <Table.Root>
                  <Table.Header style={{ backgroundColor: '#f3f4f6' }}>
                    <Table.Row>
                      <Table.ColumnHeaderCell style={{ 
                        fontWeight: '600',
                        fontSize: '0.875rem',
                        padding: '12px 16px'
                      }}>Supplier</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell style={{ 
                        fontWeight: '600',
                        fontSize: '0.875rem',
                        padding: '12px 16px'
                      }}>Price/kg</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell style={{ 
                        fontWeight: '600',
                        fontSize: '0.875rem',
                        padding: '12px 16px'
                      }}>Rating</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell style={{ 
                        fontWeight: '600',
                        fontSize: '0.875rem',
                        padding: '12px 16px'
                      }}>Delivery</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell style={{ 
                        fontWeight: '600',
                        fontSize: '0.875rem',
                        padding: '12px 16px'
                      }}>Reliability</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell style={{ 
                        fontWeight: '600',
                        fontSize: '0.875rem',
                        padding: '12px 16px'
                      }}>Select</Table.ColumnHeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {suppliers.map((supplier) => (
                      <Table.Row key={supplier.id}>
                        <Table.Cell style={{ 
                          padding: '12px 16px',
                          borderBottom: '1px solid #e5e7eb'
                        }}>{supplier.name}</Table.Cell>
                        <Table.Cell style={{ 
                          padding: '12px 16px',
                          borderBottom: '1px solid #e5e7eb'
                        }}>{formatCurrency(supplier.pricePerKg, currency)}</Table.Cell>
                        <Table.Cell style={{ 
                          padding: '12px 16px',
                          borderBottom: '1px solid #e5e7eb'
                        }}>{supplier.rating}/5</Table.Cell>
                        <Table.Cell style={{ 
                          padding: '12px 16px',
                          borderBottom: '1px solid #e5e7eb'
                        }}>{supplier.delivery}</Table.Cell>
                        <Table.Cell style={{ 
                          padding: '12px 16px',
                          borderBottom: '1px solid #e5e7eb'
                        }}>{supplier.reliability}</Table.Cell>
                        <Table.Cell style={{ 
                          padding: '12px 16px',
                          borderBottom: '1px solid #e5e7eb'
                        }}>
                          <Button
                            size="1"
                            variant={supplier.selected ? 'solid' : 'outline'}
                            onClick={() => handleSupplierSelect(supplier.id)}
                            style={{
                              borderRadius: '6px',
                              padding: '4px 8px',
                              fontSize: '0.875rem',
                              backgroundColor: supplier.selected ? '#3b82f6' : 'white',
                              color: supplier.selected ? 'white' : '#1f2937',
                              borderColor: '#e5e7eb'
                            }}
                          >
                            {supplier.selected ? 'Selected' : 'Select'}
                          </Button>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </Card>

              <Flex justify="end" gap="3" mt="4">
                <Button 
                  variant="soft"
                  onClick={() => {
                    const selectedSupplier = suppliers.find(s => s.selected);
                    if (selectedSupplier && selectedSolution.category && selectedSolution.index !== null) {
                      const items = [...getDetailsByCategory(selectedSolution.category)];
                      items[selectedSolution.index].pricePerKg = selectedSupplier.pricePerKg;
                      setData(prev => ({
                        ...prev,
                        rawMaterials: [...prev.rawMaterials]
                      }));
                    }
                    setSelectedSolution({ category: null, index: null, solution: null });
                  }}
                  style={{
                    backgroundColor: '#10b981',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontWeight: '500'
                  }}
                >
                  Apply Changes
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedSolution({ category: null, index: null, solution: null })}
                  style={{
                    backgroundColor: '#f3f4f6',
                    color: '#1f2937',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontWeight: '500'
                  }}
                >
                  Cancel
                </Button>
              </Flex>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      )}

      <Grid columns={{ initial: '1', md: '3' }} gap="4" mb="6">
        <Card style={{
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          backgroundColor: 'white',
          padding: '16px'
        }}>
          <Flex direction="column" p="4">
            <Heading size="4" mb="3" align="center" style={{ 
              color: '#1f2937',
              fontWeight: '600'
            }}>
              Cost Gap Analysis
            </Heading>
            <Text align="center" mb="4" size="2" style={{ 
              color: '#4b5563',
              fontWeight: '500'
            }}>
              Total Cost Gap: {formatCurrency(totalActual - targetCost, currency)}
            </Text>
            <Grid columns="3" gap="2">
              {categories.map((category, index) => (
                <Box 
                  key={category} 
                  style={{ 
                    padding: '12px',
                    borderRadius: '8px', 
                    backgroundColor: '#f3f4f6'
                  }}
                >
                  <Text weight="bold" size="2" mb="2" style={{ color: '#1f2937' }}>
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
                    style={{
                      height: '8px',
                      borderRadius: '4px'
                    }}
                  />
                  <Text mt="2" size="2" style={{ color: '#4b5563' }}>
                    {formatCurrency(totals[category].actual, currency)} ({percentOfTotal(category)}%)
                  </Text>
                </Box>
              ))}
            </Grid>
          </Flex>
        </Card>

        <Card style={{
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          backgroundColor: 'white',
          padding: '16px'
        }}>
          <Flex direction="column" p="4">
            <Heading size="4" mb="3" align="center" style={{ 
              color: '#1f2937',
              fontWeight: '600'
            }}>
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
                  label={({ name, percent }) => (
                    <text
                      x={0}
                      y={0}
                      fill="#374151"
                      textAnchor="middle"
                      dominantBaseline="central"
                      style={{
                        fontSize: '12px',
                        fontWeight: '500'
                      }}
                    >
                      {`${(percent * 100).toFixed(1)}%`}
                    </text>
                  )}
                  labelLine={false}
                  animationBegin={0}
                  animationDuration={1000}
                  animationEasing="ease-out"
                >
                  {categories.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Legend 
                  wrapperStyle={{
                    paddingTop: '20px'
                  }}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    `${formatCurrency(value, currency)}`,
                    name
                  ]}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Flex>
        </Card>

        <Card style={{
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          backgroundColor: 'white',
          padding: '16px'
        }}>
          <Flex direction="column" p="4">
            <Heading size="4" mb="3" align="center" style={{ 
              color: '#1f2937',
              fontWeight: '600'
            }}>
              Benchmark Trend
            </Heading>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart 
                data={benchmarkTrendDataWithGap}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: '#4b5563', fontSize: 12 }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis 
                  tick={{ fill: '#4b5563', fontSize: 12 }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    `${formatCurrency(value, currency)}`,
                    name
                  ]}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend 
                  wrapperStyle={{
                    paddingTop: '10px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#3b82f6" 
                  activeDot={{ r: 8 }} 
                  name="Actual Cost"
                  strokeWidth={2}
                  animationBegin={0}
                  animationDuration={1000}
                />
                <Line 
                  type="monotone" 
                  dataKey="benchmark" 
                  stroke="#f59e0b" 
                  name="Benchmark Price" 
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  animationBegin={0}
                  animationDuration={1000}
                />
                <Line 
                  type="monotone" 
                  dataKey="targetCost" 
                  stroke="#10b981" 
                  name="Target Cost" 
                  strokeDasharray="3 4 5 2"
                  strokeWidth={2}
                  animationBegin={0}
                  animationDuration={1000}
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
            fontWeight: '500',
            padding: '12px 24px',
            borderRadius: '6px'
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
