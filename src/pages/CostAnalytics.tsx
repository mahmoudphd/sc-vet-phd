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
import { DownloadIcon, UploadIcon, EyeOpenIcon } from '@radix-ui/react-icons';

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
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [currentPrice, setCurrentPrice] = useState(0);
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

  const generateSupplierPrices = (basePrice: number) => {
    const discounts = [
      0.05 + Math.random() * 0.05,
      0.05 + Math.random() * 0.05,
      0.05 + Math.random() * 0.05
    ].sort(() => Math.random() - 0.5);

    return [
      {
        id: 1,
        name: 'Supplier A',
        pricePerKg: Math.round(basePrice * (1 - discounts[0]) * 100) / 100,
        rating: 4.7,
        delivery: '1 week',
        reliability: '97%',
        selected: false
      },
      {
        id: 2,
        name: 'Supplier B',
        pricePerKg: Math.round(basePrice * (1 - discounts[1]) * 100) / 100,
        rating: 4.2,
        delivery: '2 weeks',
        reliability: '90%',
        selected: false
      },
      {
        id: 3,
        name: 'Supplier C',
        pricePerKg: Math.round(basePrice * (1 - discounts[2]) * 100) / 100,
        rating: 3.8,
        delivery: '3 weeks',
        reliability: '85%',
        selected: false
      }
    ];
  };

  const autoSelectBestSupplier = () => {
    const weightedSuppliers = suppliers.map(supplier => {
      const priceScore = (1 - (supplier.pricePerKg / currentPrice)) * 40;
      const ratingScore = (supplier.rating / 5) * 30;
      const reliabilityScore = (parseInt(supplier.reliability) / 100) * 20;
      const deliveryWeeks = parseInt(supplier.delivery.split(' ')[0]);
      const deliveryScore = (1 - (deliveryWeeks / 3)) * 10;
      const totalScore = priceScore + ratingScore + reliabilityScore + deliveryScore;
      
      return {
        ...supplier,
        score: totalScore
      };
    });

    const bestSupplier = weightedSuppliers.reduce((prev, current) => 
      (prev.score > current.score) ? prev : current
    );

    handleSupplierSelect(bestSupplier.id);
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

  const handleSolutionSelect = (category: CostCategory, index: number, solution: string) => {
    setSelectedSolution({ category, index, solution });
    handleSolutionChange(category, index, solution);
    
    if (category === 'Direct Materials') {
      const item = data.rawMaterials[index];
      setCurrentPrice(item.pricePerKg || 0);
      setSuppliers(generateSupplierPrices(item.pricePerKg || 0));
    }
  };

  const handleSolutionChange = (category: CostCategory, index: number, value: string) => {
    setSolutions((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [index]: value,
      },
    }));
  };

  const totals = data.totals;
  const totalActual = categories.reduce((sum, category) => sum + totals[category].actual, 0);
  const totalTarget = categories.reduce((sum, category) => sum + totals[category].budget, 0);
  const totalCostAfter = categories.reduce((sum, category) => sum + totals[category].costAfter, 0);
  const postOptimizationEstimate = totalActual - totalCostAfter;
  const targetCost = benchmarkPrice * (1 - profitMargin / 100);

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

  const pieColors = ['#4f46e5', '#f59e0b', '#ef4444', '#10b981', '#a855f7'];

  const percentOfTotal = (category: CostCategory) =>
    totalActual === 0 ? '0.00' : ((totals[category].actual / totalActual) * 100).toFixed(2);

  const handleBenchmarkChange = (value: number) => {
    setBenchmarkPrice(value);
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

  // Updated Styles without pseudo-selectors
  const tableHeaderStyle = {
    fontWeight: '600',
    padding: '12px 16px',
    backgroundColor: '#f9fafb',
    fontSize: '0.9rem',
    color: '#374151'
  };

  const tableCellStyle = {
    fontWeight: 'normal',
    padding: '12px 16px',
    borderBottom: '1px solid #e5e7eb',
    fontSize: '0.9rem',
    color: '#4b5563'
  };

  const totalCellStyle = {
    fontWeight: '600',
    padding: '12px 16px',
    borderBottom: '1px solid #e5e7eb',
    fontSize: '0.9rem',
    color: '#111827'
  };

  const cardTitleStyle = {
    fontWeight: '600',
    color: '#111827',
    fontSize: '1.1rem'
  };

  const viewDetailsButtonStyle = {
    backgroundColor: '#4f46e5',
    color: 'white',
    padding: '6px 16px',
    borderRadius: '8px',
    fontWeight: '500',
    fontSize: '0.875rem',
    border: 'none',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer'
  };

  const editableInputStyle = {
    width: '80px',
    padding: '6px 10px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    backgroundColor: '#f9fafb',
    fontSize: '14px',
    marginRight: '4px'
  };

  return (
    <Box p="6" style={{ backgroundColor: '#f9fafb', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <Flex justify="between" align="center" mb="6" wrap="wrap" gap="3">
        <Heading size="6" weight="bold" style={{ color: '#111827' }}>Inter-Organizational Cost Management</Heading>
        <Flex gap="3" align="center" wrap="wrap">
          <Flex align="center" gap="2">
            <Text size="2" weight="bold" style={{ color: '#4b5563' }}>Product:</Text>
            <RadixSelect.Root
              value={selectedProduct}
              onValueChange={(value) => setSelectedProduct(value)}
            >
              <RadixSelect.Trigger style={{ 
                minWidth: '140px',
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '0.875rem'
              }} />
              <RadixSelect.Content style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                border: '1px solid #e5e7eb'
              }}>
                {products.map((p) => (
                  <RadixSelect.Item key={p} value={p} style={{
                    padding: '8px 12px',
                    fontSize: '0.875rem'
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
                minWidth: '90px',
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '0.875rem'
              }} />
              <RadixSelect.Content style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                border: '1px solid #e5e7eb'
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
            variant="solid"
            onClick={handleExportReport}
            style={{
              backgroundColor: '#4f46e5',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: '500'
            }}
          >
            <DownloadIcon style={{ marginRight: '6px' }} />
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
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              backgroundColor: 'white',
              border: '1px solid #e5e7eb'
            }}
          >
            <Flex direction="column" gap="2" p="4">
              <Flex justify="between" align="center">
                <Text size="2" color="gray" weight="bold">
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
                      fontWeight: '500',
                      fontSize: '0.75rem'
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
                      border: '1px solid #d1d5db',
                      backgroundColor: '#f9fafb',
                      fontSize: '14px'
                    }}
                  />
                  <Text size="4" weight="bold" style={{ color: '#111827' }}>
                    {item.label.includes('%') ? `${item.value}%` : formatCurrency(item.value as number, currency)}
                  </Text>
                </Flex>
              ) : (
                <Heading size="5" style={{ fontWeight: '600', color: '#111827' }}>
                  {item.label.includes('%') ? `${item.value}%` : formatCurrency(item.value as number, currency)}
                </Heading>
              )}
            </Flex>
          </Card>
        ))}
      </Grid>

      <Card mb="6" style={{ 
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        backgroundColor: 'white',
        border: '1px solid #e5e7eb'
      }}>
        <Inset clip="padding-box" side="top" pb="current">
          <Table.Root variant="surface">
            <Table.Header style={{ backgroundColor: '#f9fafb' }}>
              <Table.Row>
                <Table.ColumnHeaderCell style={tableHeaderStyle}>Cost Category</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell style={tableHeaderStyle}>Actual Cost</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell style={tableHeaderStyle}>Target Cost</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell style={tableHeaderStyle}>Variance</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell style={tableHeaderStyle}>% of Total</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell style={tableHeaderStyle}>Cost After Optimization</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell style={tableHeaderStyle}>Details</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {categories.map((category) => {
                const variance = totals[category].actual - totals[category].budget;
                const varianceColor = variance <= 0 ? '#10b981' : '#ef4444';
                return (
                  <Table.Row key={category}>
                    <Table.RowHeaderCell style={tableCellStyle}>{category}</Table.RowHeaderCell>
                    <Table.Cell style={tableCellStyle}>{formatCurrency(totals[category].actual, currency)}</Table.Cell>
                    <Table.Cell style={tableCellStyle}>
                      <input
                        type="number"
                        value={totals[category].budget}
                        onChange={(e) => handleTargetChange(category, parseFloat(e.target.value) || 0)}
                        style={{
                          width: '80px',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          border: '1px solid #d1d5db',
                          backgroundColor: '#f9fafb',
                          fontSize: '14px'
                        }}
                      />
                    </Table.Cell>
                    <Table.Cell style={{ 
                      ...tableCellStyle,
                      color: varianceColor,
                      fontWeight: '500'
                    }}>
                      {formatCurrency(variance, currency)}
                    </Table.Cell>
                    <Table.Cell style={tableCellStyle}>{percentOfTotal(category)}%</Table.Cell>
                    <Table.Cell style={tableCellStyle}>{formatCurrency(totals[category].costAfter, currency)}</Table.Cell>
                    <Table.Cell style={tableCellStyle}>
                      <button 
                        onClick={() => setDialogCategory(category)}
                        style={viewDetailsButtonStyle}
                      >
                        <EyeOpenIcon width="14" height="14" />
                        View Details
                      </button>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
              <Table.Row style={{ 
                backgroundColor: '#f8fafc',
                borderTop: '1px solid #e5e7eb'
              }}>
                <Table.RowHeaderCell style={totalCellStyle}>Total</Table.RowHeaderCell>
                <Table.Cell style={totalCellStyle}>{formatCurrency(totalActual, currency)}</Table.Cell>
                <Table.Cell style={totalCellStyle}>{formatCurrency(totalTarget, currency)}</Table.Cell>
                <Table.Cell style={{ 
                  ...totalCellStyle,
                  color: totalActual - totalTarget <= 0 ? '#10b981' : '#ef4444'
                }}>
                  {formatCurrency(totalActual - totalTarget, currency)}
                </Table.Cell>
                <Table.Cell style={totalCellStyle}>100%</Table.Cell>
                <Table.Cell style={totalCellStyle}>{formatCurrency(totalCostAfter, currency)}</Table.Cell>
                <Table.Cell style={totalCellStyle}></Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Root>
        </Inset>
      </Card>

      {/* Category Details Dialog */}
      <Dialog.Root open={!!dialogCategory} onOpenChange={() => setDialogCategory(null)}>
        <Dialog.Content style={{ 
          maxWidth: '900px',
          maxHeight: '85vh',
          overflowY: 'auto',
          borderRadius: '16px',
          padding: '28px',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
          border: '1px solid #e5e7eb',
          backgroundColor: 'white',
          position: 'relative',
          fontFamily: 'sans-serif'
        }}>
          {dialogCategory && (
            <>
              <Flex justify="between" align="center" mb="6">
                <Dialog.Title style={{ 
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#111827',
                  margin: 0
                }}>
                  {dialogCategory} Breakdown
                  <Text as="p" size="2" color="gray" mt="2">
                    Detailed cost analysis and optimization options
                  </Text>
                </Dialog.Title>
                
                <Flex align="center" gap="4">
                  <Text as="label" size="2" style={{ color: '#4b5563', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Switch 
                      checked={autoMode} 
                      onCheckedChange={setAutoMode}
                      style={{ cursor: 'pointer' }}
                    />
                    Auto IoT Mode
                  </Text>
                  
                  <button 
                    onClick={() => setDialogCategory(null)}
                    style={{
                      backgroundColor: 'transparent',
                      color: '#6b7280',
                      padding: '6px',
                      borderRadius: '50%',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    ✕
                  </button>
                </Flex>
              </Flex>

              <Tabs.Root value={viewMode} onValueChange={(value) => setViewMode(value as 'actual' | 'target')}>
                <Tabs.List style={{
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  padding: '4px',
                  marginBottom: '20px'
                }}>
                  <Tabs.Trigger 
                    value="actual" 
                    style={{
                      fontWeight: '600',
                      padding: '8px 16px',
                      borderRadius: '6px'
                    }}
                  >
                    Actual View
                  </Tabs.Trigger>
                  <Tabs.Trigger 
                    value="target" 
                    style={{
                      fontWeight: '600',
                      padding: '8px 16px',
                      borderRadius: '6px'
                    }}
                  >
                    Target View
                  </Tabs.Trigger>
                </Tabs.List>

                <Box pt="3">
                  <Tabs.Content value="actual">
                    <Table.Root variant="surface" style={{
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                    }}>
                      <Table.Header style={{ 
                        backgroundColor: '#f9fafb',
                        borderBottom: '1px solid #e5e7eb'
                      }}>
                        <Table.Row>
                          <Table.ColumnHeaderCell style={tableHeaderStyle}>Item</Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell style={tableHeaderStyle}>Qty/Units</Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell style={tableHeaderStyle}>Unit Price</Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell style={tableHeaderStyle}>Total Cost</Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell style={tableHeaderStyle}>Solution</Table.ColumnHeaderCell>
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
                              <Table.RowHeaderCell style={tableCellStyle}>{item.name}</Table.RowHeaderCell>
                              <Table.Cell style={tableCellStyle}>
                                {autoMode ? (
                                  dialogCategory === 'Direct Materials' 
                                    ? `${qty?.toString()} kg` 
                                    : dialogCategory === 'Direct Labor'
                                      ? `${qty} hrs`
                                      : qty
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
                                    style={editableInputStyle}
                                    step={dialogCategory === 'Direct Materials' ? 'any' : '1'}
                                    min="0"
                                  />
                                )}
                              </Table.Cell>
                              <Table.Cell style={tableCellStyle}>
                                {autoMode ? (
                                  unitPrice ? formatCurrency(unitPrice, currency) : formatCurrency(0, currency)
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
                                    style={editableInputStyle}
                                    step="0.01"
                                    min="0"
                                  />
                                )}
                              </Table.Cell>
                              <Table.Cell style={tableCellStyle}>{formatCurrency(totalCost, currency)}</Table.Cell>
                              <Table.Cell style={tableCellStyle}>
                                <RadixSelect.Root
                                  value={solutions[dialogCategory]?.[index] || ''}
                                  onValueChange={(value) => handleSolutionSelect(dialogCategory, index, value)}
                                >
                                  <RadixSelect.Trigger 
                                    aria-label="Select solution" 
                                    style={{
                                      backgroundColor: 'white',
                                      border: '1px solid #d1d5db',
                                      borderRadius: '6px',
                                      padding: '6px 12px',
                                      fontSize: '0.875rem',
                                      width: '100%'
                                    }}
                                  />
                                  <RadixSelect.Content style={{
                                    backgroundColor: 'white',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                    border: '1px solid #e5e7eb',
                                    zIndex: 1000
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
                    <Table.Root variant="surface" style={{
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                    }}>
                      <Table.Header style={{ 
                        backgroundColor: '#f9fafb',
                        borderBottom: '1px solid #e5e7eb'
                      }}>
                        <Table.Row>
                          <Table.ColumnHeaderCell style={tableHeaderStyle}>Item</Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell style={tableHeaderStyle}>Current</Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell style={tableHeaderStyle}>Target</Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell style={tableHeaderStyle}>Reduction</Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell style={tableHeaderStyle}>Savings</Table.ColumnHeaderCell>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        {getDetailsByCategory(dialogCategory).map((item, index) => {
                          const currentQty = dialogCategory === 'Direct Materials' ? item.concentrationKg || 0 :
                                           dialogCategory === 'Direct Labor' ? item.hours || 0 : item.qty || 0;
                          
                          const currentPrice = dialogCategory === 'Direct Materials' ? item.pricePerKg || 0 :
                                             dialogCategory === 'Direct Labor' ? item.hourlyRate || 0 : item.unitPrice || 0;

                          const [targetQty, setTargetQty] = useState(parseFloat((currentQty * 0.9).toString()));
                          const [targetPrice, setTargetPrice] = useState(parseFloat((currentPrice * 0.95).toString()));

                          const savings = parseFloat(((currentQty * currentPrice) - (targetQty * targetPrice)).toFixed(2));
                          const qtyReduction = parseFloat(((1 - (targetQty / currentQty)) * 100).toFixed(1));
                          const priceReduction = parseFloat(((1 - (targetPrice / currentPrice)) * 100).toFixed(1));

                          return (
                            <Table.Row key={index}>
                              <Table.RowHeaderCell style={tableCellStyle}>{item.name}</Table.RowHeaderCell>
                              <Table.Cell style={tableCellStyle}>
                                {dialogCategory === 'Direct Materials' 
                                  ? `${currentQty.toString()} kg` 
                                  : dialogCategory === 'Direct Labor'
                                    ? `${currentQty} hrs`
                                    : currentQty}
                                <br />
                                {formatCurrency(currentPrice, currency)}
                              </Table.Cell>
                              <Table.Cell style={tableCellStyle}>
                                <div style={{ marginBottom: '8px' }}>
                                  <input
                                    type="number"
                                    value={targetQty}
                                    onChange={(e) => {
                                      const newValue = parseFloat(e.target.value) || 0;
                                      setTargetQty(newValue);
                                    }}
                                    style={editableInputStyle}
                                    step={dialogCategory === 'Direct Materials' ? 'any' : '1'}
                                    min="0"
                                  />
                                  {dialogCategory === 'Direct Materials' ? ' kg' : 
                                   dialogCategory === 'Direct Labor' ? ' hrs' : ''}
                                </div>
                                <input
                                  type="number"
                                  value={targetPrice}
                                  onChange={(e) => {
                                    const newValue = parseFloat(e.target.value) || 0;
                                    setTargetPrice(newValue);
                                  }}
                                  style={editableInputStyle}
                                  step="0.01"
                                  min="0"
                                />
                              </Table.Cell>
                              <Table.Cell style={tableCellStyle}>
                                <div style={{ color: '#4f46e5', fontWeight: '500' }}>
                                  {qtyReduction}% Qty
                                </div>
                                <div style={{ color: '#4f46e5', fontWeight: '500' }}>
                                  {priceReduction}% Price
                                </div>
                              </Table.Cell>
                              <Table.Cell style={{ 
                                ...tableCellStyle,
                                color: savings > 0 ? '#10b981' : '#ef4444',
                                fontWeight: '500'
                              }}>
                                {formatCurrency(savings, currency)}
                              </Table.Cell>
                            </Table.Row>
                          );
                        })}
                        
                        <Table.Row style={{ 
                          backgroundColor: '#f8fafc',
                          borderTop: '1px solid #e5e7eb'
                        }}>
                          <Table.RowHeaderCell style={totalCellStyle}>Total</Table.RowHeaderCell>
                          <Table.Cell style={totalCellStyle}></Table.Cell>
                          <Table.Cell style={totalCellStyle}></Table.Cell>
                          <Table.Cell style={totalCellStyle}></Table.Cell>
                          <Table.Cell style={{ 
                            ...totalCellStyle,
                            color: getDetailsByCategory(dialogCategory).reduce((sum, item) => {
                              const currentQty = item.concentrationKg || item.hours || item.qty || 0;
                              const currentPrice = item.pricePerKg || item.hourlyRate || item.unitPrice || 0;
                              const targetQty = currentQty * 0.9;
                              const targetPrice = currentPrice * 0.95;
                              return sum + (currentQty * currentPrice) - (targetQty * targetPrice);
                            }, 0) > 0 ? '#10b981' : '#ef4444'
                          }}>
                            {formatCurrency(
                              getDetailsByCategory(dialogCategory).reduce((sum, item) => {
                                const currentQty = item.concentrationKg || item.hours || item.qty || 0;
                                const currentPrice = item.pricePerKg || item.hourlyRate || item.unitPrice || 0;
                                const targetQty = currentQty * 0.9;
                                const targetPrice = currentPrice * 0.95;
                                return sum + (currentQty * currentPrice) - (targetQty * targetPrice);
                              }, 0),
                              currency
                            )}
                          </Table.Cell>
                        </Table.Row>
                      </Table.Body>
                    </Table.Root>
                  </Tabs.Content>
                </Box>
              </Tabs.Root>

              <Flex justify="end" gap="3" mt="6" style={{ borderTop: '1px solid #f3f4f6', paddingTop: '20px' }}>
                <Button 
                  style={{ 
                    backgroundColor: '#4f46e5',
                    color: 'white',
                    padding: '10px 24px',
                    borderRadius: '8px',
                    fontWeight: '600'
                  }}
                  onClick={() => handleSubmitDialog(dialogCategory)}
                >
                  Save Changes
                </Button>
                
                <Button
                  variant="soft"
                  style={{ 
                    color: '#4f46e5',
                    padding: '10px 24px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    border: '1px solid #e5e7eb'
                  }}
                  onClick={() => setDialogCategory(null)}
                >
                  Cancel
                </Button>
              </Flex>
            </>
          )}
        </Dialog.Content>
      </Dialog.Root>

      {/* Supplier Negotiation Dialog */}
      <Dialog.Root open={!!selectedSolution.solution} onOpenChange={() => setSelectedSolution({ category: null, index: null, solution: null })}>
        <Dialog.Content style={{ 
          maxWidth: '800px',
          padding: '24px',
          borderRadius: '16px',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
          border: '1px solid #e5e7eb',
          backgroundColor: 'white',
          fontFamily: 'sans-serif'
        }}>
          {selectedSolution.solution && (
            <>
              <Dialog.Title style={{ 
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '16px'
              }}>
                Supplier Negotiation
                <Text as="p" size="2" color="gray" mt="2">
                  Compare suppliers and select the best option
                </Text>
              </Dialog.Title>
              
              <Flex direction="column" gap="4">
                <Card style={{
                  borderRadius: '8px',
                  backgroundColor: '#f9fafb',
                  padding: '16px',
                  border: '1px solid #e5e7eb'
                }}>
                  <Flex justify="between" align="center">
                    <Text weight="bold" style={{ color: '#111827' }}>Current Price/kg:</Text>
                    <Text style={{ color: '#111827', fontWeight: '600' }}>{formatCurrency(currentPrice, currency)}</Text>
                  </Flex>
                  <Flex justify="between" align="center" mt="2">
                    <Text weight="bold" style={{ color: '#111827' }}>Potential Savings/kg:</Text>
                    <Text 
                      style={{ 
                        color: potentialSavings > 0 ? '#10b981' : '#ef4444',
                        fontWeight: '600'
                      }}
                    >
                      {formatCurrency(potentialSavings, currency)}
                    </Text>
                  </Flex>
                </Card>

                <Button 
                  onClick={autoSelectBestSupplier}
                  size="1"
                  variant="soft"
                  style={{
                    backgroundColor: '#f0fdf4',
                    color: '#166534',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    border: '1px solid #bbf7d0',
                    marginBottom: '10px',
                    fontSize: '0.875rem'
                  }}
                >
                  Auto Select Best Supplier
                </Button>

                <Card style={{
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  padding: '16px',
                  border: '1px solid #e5e7eb'
                }}>
                  <Heading size="4" mb="3" style={{ 
                    color: '#111827',
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
                        stroke="#4f46e5" 
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
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Legend />
                      <Bar 
                        yAxisId="left" 
                        dataKey="price" 
                        name="Price/kg" 
                        fill="#4f46e5"
                        animationBegin={0}
                        animationDuration={1000}
                      >
                        {suppliers.map((_, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={suppliers[index].selected ? '#10b981' : '#4f46e5'}
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
                  padding: '16px',
                  border: '1px solid #e5e7eb'
                }}>
                  <Table.Root>
                    <Table.Header style={{ backgroundColor: '#f9fafb' }}>
                      <Table.Row>
                        <Table.ColumnHeaderCell style={tableHeaderStyle}>Supplier</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell style={tableHeaderStyle}>Price/kg</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell style={tableHeaderStyle}>Rating</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell style={tableHeaderStyle}>Delivery</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell style={tableHeaderStyle}>Reliability</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell style={tableHeaderStyle}>Select</Table.ColumnHeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {suppliers.map((supplier) => (
                        <Table.Row key={supplier.id}>
                          <Table.Cell style={tableCellStyle}>{supplier.name}</Table.Cell>
                          <Table.Cell style={tableCellStyle}>{formatCurrency(supplier.pricePerKg, currency)}</Table.Cell>
                          <Table.Cell style={tableCellStyle}>{supplier.rating}/5</Table.Cell>
                          <Table.Cell style={tableCellStyle}>{supplier.delivery}</Table.Cell>
                          <Table.Cell style={tableCellStyle}>{supplier.reliability}</Table.Cell>
                          <Table.Cell style={tableCellStyle}>
                            <Button
                              size="1"
                              variant={supplier.selected ? 'solid' : 'outline'}
                              onClick={() => handleSupplierSelect(supplier.id)}
                              style={{
                                borderRadius: '6px',
                                padding: '4px 12px',
                                fontSize: '0.875rem',
                                backgroundColor: supplier.selected ? '#4f46e5' : 'white',
                                color: supplier.selected ? 'white' : '#4f46e5',
                                borderColor: supplier.selected ? '#4f46e5' : '#d1d5db',
                                fontWeight: '500'
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

                <Flex justify="end" gap="3" mt="4" style={{ borderTop: '1px solid #f3f4f6', paddingTop: '20px' }}>
                  <Button 
                    variant="solid"
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
                      backgroundColor: '#4f46e5',
                      color: 'white',
                      padding: '10px 24px',
                      borderRadius: '8px',
                      fontWeight: '600'
                    }}
                  >
                    Apply Changes
                  </Button>
                  <Button
                    variant="soft"
                    onClick={() => setSelectedSolution({ category: null, index: null, solution: null })}
                    style={{
                      color: '#4f46e5',
                      padding: '10px 24px',
                      borderRadius: '8px',
                      fontWeight: '600',
                      border: '1px solid #e5e7eb'
                    }}
                  >
                    Cancel
                  </Button>
                </Flex>
              </Flex>
            </>
          )}
        </Dialog.Content>
      </Dialog.Root>

      <Grid columns={{ initial: '1', md: '2' }} gap="4" mb="6">
        <Card style={{
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          backgroundColor: 'white',
          padding: '16px',
          height: '400px',
          border: '1px solid #e5e7eb'
        }}>
          <Flex direction="column" height="100%">
            <Heading size="4" mb="3" align="center" style={cardTitleStyle}>
              Cost Breakdown
            </Heading>
            <ResponsiveContainer width="100%" height="100%">
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
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                  labelLine={false}
                >
                  {categories.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value, currency)}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Flex>
        </Card>

        <Card style={{
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          backgroundColor: 'white',
          padding: '16px',
          height: '400px',
          border: '1px solid #e5e7eb'
        }}>
          <Flex direction="column" height="100%">
            <Heading size="4" mb="3" align="center" style={cardTitleStyle}>
              Benchmark Trend
            </Heading>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={benchmarkTrendDataWithGap}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fill: '#4b5563' }} />
                <YAxis tick={{ fill: '#4b5563' }} />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value, currency)}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#4f46e5" 
                  strokeWidth={2}
                  dot={{ fill: '#4f46e5', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="benchmark" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="targetCost" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  strokeDasharray="3 4 5 2"
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Flex>
        </Card>

        <Card style={{
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          backgroundColor: 'white',
          padding: '16px',
          gridColumn: '1 / -1',
          border: '1px solid #e5e7eb'
        }}>
          <Flex direction="column">
            <Heading size="4" mb="3" align="center" style={cardTitleStyle}>
              Cost Gap Analysis
            </Heading>
            <Text align="center" mb="4" size="2" color="gray">
              Total Cost Gap: {formatCurrency(totalActual - targetCost, currency)}
            </Text>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={categories.map(category => ({
                  name: category,
                  actual: totals[category].actual,
                  target: totals[category].budget,
                  gap: totals[category].actual - totals[category].budget
                }))}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fill: '#4b5563' }} />
                <YAxis tick={{ fill: '#4b5563' }} />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value, currency)}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend />
                <Bar dataKey="actual" fill="#4f46e5" name="Actual Cost" />
                <Bar dataKey="target" fill="#10b981" name="Target Cost" />
              </BarChart>
            </ResponsiveContainer>
          </Flex>
        </Card>
      </Grid>

      <Flex justify="end" mt="6">
        <Button 
          size="2" 
          style={{ 
            backgroundColor: '#4f46e5', 
            color: '#fff', 
            fontWeight: '600',
            padding: '12px 24px',
            borderRadius: '8px'
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
