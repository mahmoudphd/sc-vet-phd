import React, { useState, useEffect } from 'react';
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
  targetQty?: number;
  targetPrice?: number;
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

const initialData: CostData = {
  totals: {
    'Direct Materials': { actual: 133.11, budget: 129, costAfter: 130 },
    'Packaging Materials': { actual: 18, budget: 16, costAfter: 16 },
    'Direct Labor': { actual: 3, budget: 2, costAfter: 2 },
    'Overhead': { actual: 2, budget: 2, costAfter: 2 },
    'Other Costs': { actual: 15, budget: 13, costAfter: 14 },
  },
  rawMaterials: [
    { name: 'Vitamin B1', concentrationKg: 0.001, pricePerKg: 540, targetQty: 0.0009, targetPrice: 513 },
    { name: 'Vitamin B2', concentrationKg: 0.006, pricePerKg: 600, targetQty: 0.0054, targetPrice: 570 },
    { name: 'Vitamin B12', concentrationKg: 0.001, pricePerKg: 2300, targetQty: 0.0009, targetPrice: 2185 },
    { name: 'Nicotinamide B3', concentrationKg: 0.01, pricePerKg: 400, targetQty: 0.009, targetPrice: 380 },
    { name: 'Pantothenic Acid', concentrationKg: 0.004, pricePerKg: 1700, targetQty: 0.0036, targetPrice: 1615 },
    { name: 'Vitamin B6', concentrationKg: 0.0015, pricePerKg: 900, targetQty: 0.00135, targetPrice: 855 },
    { name: 'Leucine', concentrationKg: 0.03, pricePerKg: 200, targetQty: 0.027, targetPrice: 190 },
    { name: 'Threonine', concentrationKg: 0.01, pricePerKg: 950, targetQty: 0.009, targetPrice: 902.5 },
    { name: 'Taurine', concentrationKg: 0.0025, pricePerKg: 3000, targetQty: 0.00225, targetPrice: 2850 },
    { name: 'Glycine', concentrationKg: 0.0025, pricePerKg: 4200, targetQty: 0.00225, targetPrice: 3990 },
    { name: 'Arginine', concentrationKg: 0.0025, pricePerKg: 5000, targetQty: 0.00225, targetPrice: 4750 },
    { name: 'Cynarin', concentrationKg: 0.0025, pricePerKg: 3900, targetQty: 0.00225, targetPrice: 3705 },
    { name: 'Silymarin', concentrationKg: 0.025, pricePerKg: 700, targetQty: 0.0225, targetPrice: 665 },
    { name: 'Sorbitol', concentrationKg: 0.01, pricePerKg: 360, targetQty: 0.009, targetPrice: 342 },
    { name: 'Carnitine', concentrationKg: 0.005, pricePerKg: 1070, targetQty: 0.0045, targetPrice: 1016.5 },
    { name: 'Betaine', concentrationKg: 0.02, pricePerKg: 1250, targetQty: 0.018, targetPrice: 1187.5 },
    { name: 'Tween-80', concentrationKg: 0.075, pricePerKg: 90, targetQty: 0.0675, targetPrice: 85.5 },
    { name: 'Water', concentrationKg: 0.571, pricePerKg: 1, targetQty: 0.5139, targetPrice: 0.95 },
  ],
  packagingMaterials: [
    { name: 'Plastic Bottle (1 L)', qty: 1, unitPrice: 10, cost: 10, targetQty: 0.9, targetPrice: 9.5 },
    { name: 'Safety Seal', qty: 1, unitPrice: 3, cost: 3, targetQty: 0.9, targetPrice: 2.85 },
    { name: 'Cap', qty: 1, unitPrice: 5, cost: 5, targetQty: 0.9, targetPrice: 4.75 },
  ],
  directLabor: [
    { name: 'Operator', hours: 0.5, hourlyRate: 3.5, cost: 1.75, targetQty: 0.45, targetPrice: 3.33 },
    { name: 'Supervisor', hours: 0.5, hourlyRate: 1.75, cost: 0.88, targetQty: 0.45, targetPrice: 1.66 },
    { name: 'Quality Control', hours: 0.5, hourlyRate: 0.74, cost: 0.37, targetQty: 0.45, targetPrice: 0.70 },
  ],
  overheadItems: [
    { name: 'Rent', totalCost: 1000, basis: 1000, cost: 1, targetQty: 1, targetPrice: 0.95 },
    { name: 'Electricity', totalCost: 500, basis: 1000, cost: 0.5, targetQty: 1, targetPrice: 0.48 },
    { name: 'Maintenance', totalCost: 1500, basis: 1000, cost: 1.5, targetQty: 1, targetPrice: 1.43 },
  ],
  otherCosts: [
    { name: 'Transportation', qty: 1, unitPrice: 6.67, cost: 6.67, targetQty: 0.9, targetPrice: 6.34 },
    { name: 'Packaging Waste Disposal', qty: 1, unitPrice: 3.33, cost: 3.33, targetQty: 0.9, targetPrice: 3.16 },
    { name: 'Rework', qty: 1, unitPrice: 5.0, cost: 5, targetQty: 0.8, targetPrice: 4.5 },
  ],
};

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

const tableHeaderStyle = {
  fontWeight: 'bold',
  padding: '12px 16px',
  backgroundColor: '#f3f4f6',
  fontSize: '0.9rem'
};

const tableCellStyle = {
  fontWeight: 'normal',
  padding: '12px 16px',
  borderBottom: '1px solid #e5e7eb',
  fontSize: '0.9rem'
};

const tableRowHeaderStyle = {
  fontWeight: 'bold',
  padding: '12px 16px',
  borderBottom: '1px solid #e5e7eb',
  fontSize: '0.9rem'
};

const cardTitleStyle = {
  color: '#1f2937',
  fontWeight: 'bold',
  marginBottom: '16px'
};

function CostAnalytics() {
  const [data, setData] = useState<CostData>(initialData);
  const [dialogCategory, setDialogCategory] = useState<CostCategory | null>(null);
  const [viewMode, setViewMode] = useState<'actual' | 'target'>('actual');
  const [benchmarkPrice, setBenchmarkPrice] = useState(220);
  const [profitMargin, setProfitMargin] = useState(25);
  const [currency, setCurrency] = useState<'EGP' | 'USD'>('EGP');
  const [autoMode, setAutoMode] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
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

  const formatNumber = (value: number, decimalPlaces: number = 3) => {
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimalPlaces
    });
  };

  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const getDetailsByCategory = (category: CostCategory | null, dataToUse = data): Item[] => {
    if (!category) return [];
    switch (category) {
      case 'Direct Materials': return dataToUse.rawMaterials;
      case 'Packaging Materials': return dataToUse.packagingMaterials;
      case 'Direct Labor': return dataToUse.directLabor;
      case 'Overhead': return dataToUse.overheadItems;
      case 'Other Costs': return dataToUse.otherCosts;
      default: return [];
    }
  };

  const calculateActualCost = (item: Item): number => {
    if ('concentrationKg' in item) return (item.concentrationKg || 0) * (item.pricePerKg || 0);
    if ('hours' in item) return (item.hours || 0) * (item.hourlyRate || 0);
    if ('totalCost' in item) return (item.totalCost || 0) / (item.basis || 1);
    return (item.qty || 0) * (item.unitPrice || 0);
  };

  const calculateCostAfterOptimization = (category: CostCategory, dataToUse = data): number => {
    const items = getDetailsByCategory(category, dataToUse);
    return items.reduce((sum, item) => {
      return sum + calculateActualCost(item);
    }, 0);
  };

  const calculatePotentialSavings = (item: Item): number => {
    const currentCost = calculateActualCost(item);
    const targetCost = (item.targetQty || 0) * (item.targetPrice || 0);
    return currentCost - targetCost;
  };

  const updateTargetValues = (category: CostCategory, index: number, field: 'targetQty' | 'targetPrice', value: number) => {
    setData(prev => {
      const newData = {...prev};
      const categoryItems = [...getDetailsByCategory(category, newData)];
      categoryItems[index][field] = value;
      
      switch (category) {
        case 'Direct Materials': newData.rawMaterials = categoryItems; break;
        case 'Packaging Materials': newData.packagingMaterials = categoryItems; break;
        case 'Direct Labor': newData.directLabor = categoryItems; break;
        case 'Overhead': newData.overheadItems = categoryItems; break;
        case 'Other Costs': newData.otherCosts = categoryItems; break;
      }
      
      updateCategoryTotals(category, newData);
      
      return newData;
    });
  };

  const updateCategoryTotals = (category: CostCategory, dataToUpdate: CostData) => {
    const items = getDetailsByCategory(category, dataToUpdate);
    const actualTotal = items.reduce((sum, item) => sum + calculateActualCost(item), 0);
    const targetTotal = items.reduce((sum, item) => sum + ((item.targetQty || 0) * (item.targetPrice || 0)), 0);
    const costAfterTotal = calculateCostAfterOptimization(category, dataToUpdate);
    
    dataToUpdate.totals[category] = {
      ...dataToUpdate.totals[category],
      actual: Math.round(actualTotal * 100) / 100,
      budget: Math.round(targetTotal * 100) / 100,
      costAfter: Math.round(costAfterTotal * 100) / 100
    };
  };

  const generateSupplierPrices = (basePrice: number) => {
    const discounts = [
      0.05 + Math.random() * 0.10,
      0.05 + Math.random() * 0.10,
      0.05 + Math.random() * 0.10
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
    if (selectedSupplier && selectedSolution.category && selectedSolution.index !== null) {
      const items = [...getDetailsByCategory(selectedSolution.category)];
      items[selectedSolution.index].pricePerKg = selectedSupplier.pricePerKg;
      
      setData(prev => {
        const newData = {...prev};
        switch(selectedSolution.category) {
          case 'Direct Materials': newData.rawMaterials = items; break;
          case 'Packaging Materials': newData.packagingMaterials = items; break;
          case 'Direct Labor': newData.directLabor = items; break;
          case 'Overhead': newData.overheadItems = items; break;
          case 'Other Costs': newData.otherCosts = items; break;
        }
        
        updateCategoryTotals(selectedSolution.category, newData);
        return newData;
      });
      
      const savings = currentPrice - selectedSupplier.pricePerKg;
      setPotentialSavings(Math.round(savings * 100) / 100);
    }
  };

  const handleSolutionSelect = (category: CostCategory, index: number, solution: string) => {
    setSelectedSolution({ category, index, solution });
    setSolutions((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [index]: solution,
      },
    }));
    
    if (category === 'Direct Materials') {
      const item = data.rawMaterials[index];
      setCurrentPrice(item.pricePerKg || 0);
      setSuppliers(generateSupplierPrices(item.pricePerKg || 0));
    }
  };

  const handleBenchmarkChange = (value: number) => {
    setBenchmarkPrice(Math.round(value * 100) / 100);
  };

  const handleExportReport = () => {
    alert('Export Report functionality not implemented yet.');
  };

  const handleTargetChange = (category: CostCategory, value: number) => {
    setData(prev => ({
      ...prev,
      totals: {
        ...prev.totals,
        [category]: {
          ...prev.totals[category],
          budget: Math.round(value * 100) / 100,
        },
      },
    }));
  };

  const handleSubmitToBlockchain = () => {
    alert('Data submitted to blockchain successfully!');
  };

  const handleSubmitDialog = (category: CostCategory) => {
    const items = getDetailsByCategory(category);
    const newActual = items.reduce((sum, item) => sum + calculateActualCost(item), 0);

    setData(prev => ({
      ...prev,
      totals: {
        ...prev.totals,
        [category]: {
          ...prev.totals[category],
          actual: Math.round(newActual * 100) / 100
        }
      }
    }));

    setDialogCategory(null);
  };

  useEffect(() => {
    // Initialize all category totals
    const newData = {...data};
    categories.forEach(category => {
      updateCategoryTotals(category, newData);
    });
    setData(newData);
  }, []);

  const totals = data.totals;
  const totalActual = categories.reduce((sum, category) => sum + totals[category].actual, 0);
  const totalTarget = categories.reduce((sum, category) => sum + totals[category].budget, 0);
  const totalCostAfter = categories.reduce((sum, category) => sum + totals[category].costAfter, 0);
  const postOptimizationEstimate = Math.round((totalActual - totalCostAfter) * 100) / 100;
  const targetCost = Math.round(benchmarkPrice * (1 - profitMargin / 100) * 100) / 100;

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
    gap: Math.round((d.actual - targetCost) * 100) / 100,
  }));

  const pieColors = ['#3b82f6', '#f59e0b', '#ef4444', '#10b981', '#a855f7'];

  const percentOfTotal = (category: CostCategory) =>
    totalActual === 0 ? '0.00' : ((totals[category].actual / totalActual) * 100).toFixed(2);

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
                <Heading size="5" style={{ fontWeight: 'bold', color: '#1f2937' }}>
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
                const varianceColor = variance <= 0 ? 'green' : 'red';
                return (
                  <Table.Row key={category}>
                    <Table.RowHeaderCell style={tableRowHeaderStyle}>{category}</Table.RowHeaderCell>
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
                          border: '1px solid #e2e8f0',
                          backgroundColor: '#f9fafb',
                          fontSize: '14px'
                        }}
                      />
                    </Table.Cell>
                    <Table.Cell style={{ 
                      ...tableCellStyle,
                      color: varianceColor
                    }}>
                      {formatCurrency(variance, currency)}
                    </Table.Cell>
                    <Table.Cell style={tableCellStyle}>{percentOfTotal(category)}%</Table.Cell>
                    <Table.Cell style={tableCellStyle}>{formatCurrency(totals[category].costAfter, currency)}</Table.Cell>
                    <Table.Cell style={tableCellStyle}>
                      <Button 
                        size="1" 
                        variant="solid"
                        onClick={() => setDialogCategory(category)}
                        style={{
                          borderRadius: '6px',
                          padding: '4px 12px',
                          fontSize: '0.875rem',
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          fontWeight: 'bold'
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
                fontWeight: 'bold'
              }}>
                <Table.RowHeaderCell style={tableRowHeaderStyle}>Total</Table.RowHeaderCell>
                <Table.Cell style={tableCellStyle}>{formatCurrency(totalActual, currency)}</Table.Cell>
                <Table.Cell style={tableCellStyle}>{formatCurrency(totalTarget, currency)}</Table.Cell>
                <Table.Cell style={tableCellStyle}>{formatCurrency(totalActual - totalTarget, currency)}</Table.Cell>
                <Table.Cell style={tableCellStyle}>100%</Table.Cell>
                <Table.Cell style={tableCellStyle}>{formatCurrency(totalCostAfter, currency)}</Table.Cell>
                <Table.Cell style={tableCellStyle}></Table.Cell>
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
                fontWeight: 'bold',
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
                <Tabs.Trigger value="actual" style={{ fontWeight: 'bold' }}>Actual View</Tabs.Trigger>
                <Tabs.Trigger value="target" style={{ fontWeight: 'bold' }}>Target View</Tabs.Trigger>
              </Tabs.List>

              <Box pt="3">
                <Tabs.Content value="actual">
                  <Table.Root variant="surface">
                    <Table.Header style={{ backgroundColor: '#f3f4f6' }}>
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
                            <Table.RowHeaderCell style={tableRowHeaderStyle}>{item.name}</Table.RowHeaderCell>
                            <Table.Cell style={tableCellStyle}>
                              {autoMode ? (
                                dialogCategory === 'Direct Materials' 
                                  ? formatNumber(qty || 0)
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
                                    updateCategoryTotals(dialogCategory, {...data});
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
                            <Table.Cell style={tableCellStyle}>
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
                                    updateCategoryTotals(dialogCategory, {...data});
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
                        <Table.ColumnHeaderCell style={tableHeaderStyle}>Item</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell style={tableHeaderStyle}>Target Qty</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell style={tableHeaderStyle}>Target Price</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell style={tableHeaderStyle}>Potential Savings</Table.ColumnHeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {getDetailsByCategory(dialogCategory).map((item, index) => {
                        const currentQty = dialogCategory === 'Direct Materials' ? item.concentrationKg || 0 :
                                        dialogCategory === 'Direct Labor' ? item.hours || 0 : item.qty || 0;
                        
                        const currentPrice = dialogCategory === 'Direct Materials' ? item.pricePerKg || 0 :
                                          dialogCategory === 'Direct Labor' ? item.hourlyRate || 0 : item.unitPrice || 0;

                        return (
                          <Table.Row key={index}>
                            <Table.RowHeaderCell style={tableRowHeaderStyle}>{item.name}</Table.RowHeaderCell>
                            <Table.Cell style={tableCellStyle}>
                              <input
                                type="number"
                                value={item.targetQty || ''}
                                onChange={(e) => updateTargetValues(
                                  dialogCategory, 
                                  index, 
                                  'targetQty', 
                                  parseFloat(e.target.value) || 0
                                )}
                                step="0.0001"
                                min="0"
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
                            <Table.Cell style={tableCellStyle}>
                              <input
                                type="number"
                                value={item.targetPrice || ''}
                                onChange={(e) => updateTargetValues(
                                  dialogCategory, 
                                  index, 
                                  'targetPrice', 
                                  parseFloat(e.target.value) || 0
                                )}
                                step="0.01"
                                min="0"
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
                              ...tableCellStyle,
                              color: calculatePotentialSavings(item) > 0 ? '#10b981' : '#ef4444',
                              fontWeight: 'bold'
                            }}>
                              {formatCurrency(calculatePotentialSavings(item), currency)}
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
                  fontWeight: 'bold'
                }}
                onClick={() => dialogCategory && handleSubmitDialog(dialogCategory)}
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
                  fontWeight: 'bold'
                }}
                onClick={() => setDialogCategory(null)}
              >
                Close
              </Button>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      )}

      {selectedSolution.solution && selectedSolution.category && (
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
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '16px'
            }}>
              Supplier Selection Overview
            </Dialog.Title>
            
            <Flex direction="column" gap="4">
              <Card style={{
                borderRadius: '8px',
                backgroundColor: '#f9fafb',
                padding: '16px'
              }}>
                <Flex justify="between" align="center">
                  <Text weight="bold" style={{ color: '#1f2937' }}>Current Price/kg:</Text>
                  <Text style={{ color: '#1f2937', fontWeight: 'bold' }}>{formatCurrency(currentPrice, currency)}</Text>
                </Flex>
                <Flex justify="between" align="center" mt="2">
                  <Text weight="bold" style={{ color: '#1f2937' }}>Potential Savings/kg:</Text>
                  <Text 
                    style={{ 
                      color: potentialSavings > 0 ? '#10b981' : '#ef4444',
                      fontWeight: 'bold'
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
                  padding: '5px 10px',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  border: '1px solid #bbf7d0',
                  marginBottom: '10px',
                  fontSize: '0.85rem'
                }}
              >
                Auto Select Best Supplier
              </Button>

              <Card style={{
                borderRadius: '8px',
                backgroundColor: 'white',
                padding: '16px'
              }}>
                <Heading size="4" mb="3" style={{ 
                  color: '#1f2937',
                  fontWeight: 'bold'
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
                              padding: '4px 8px',
                              fontSize: '0.875rem',
                              backgroundColor: supplier.selected ? '#3b82f6' : 'white',
                              color: supplier.selected ? 'white' : '#1f2937',
                              borderColor: '#e5e7eb',
                              fontWeight: 'bold'
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
                  variant="solid"
                  onClick={() => {
                    const selectedSupplier = suppliers.find(s => s.selected);
                    if (selectedSupplier && selectedSolution.category && selectedSolution.index !== null) {
                      const items = [...getDetailsByCategory(selectedSolution.category)];
                      items[selectedSolution.index].pricePerKg = selectedSupplier.pricePerKg;
                      
                      setData(prev => {
                        const newData = {...prev};
                        switch(selectedSolution.category) {
                          case 'Direct Materials': newData.rawMaterials = items; break;
                          case 'Packaging Materials': newData.packagingMaterials = items; break;
                          case 'Direct Labor': newData.directLabor = items; break;
                          case 'Overhead': newData.overheadItems = items; break;
                          case 'Other Costs': newData.otherCosts = items; break;
                        }
                        
                        updateCategoryTotals(selectedSolution.category, newData);
                        return newData;
                      });
                    }
                    setSelectedSolution({ category: null, index: null, solution: null });
                  }}
                  style={{
                    backgroundColor: '#2563eb',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontWeight: 'bold'
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
                    fontWeight: 'bold'
                  }}
                >
                  Cancel
                </Button>
              </Flex>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      )}

      <Grid columns={{ initial: '1', md: '2' }} gap="4" mb="6">
        <Card style={{
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          backgroundColor: 'white',
          padding: '16px',
          height: '400px'
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
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          backgroundColor: 'white',
          padding: '16px',
          height: '400px'
        }}>
          <Flex direction="column" height="100%">
            <Heading size="4" mb="3" align="center" style={cardTitleStyle}>
              Benchmark Trend
            </Heading>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={benchmarkTrendDataWithGap}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value, currency)}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="benchmark" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
                <Line 
                  type="monotone" 
                  dataKey="targetCost" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  strokeDasharray="3 4 5 2"
                />
              </LineChart>
            </ResponsiveContainer>
          </Flex>
        </Card>

        <Card style={{
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          backgroundColor: 'white',
          padding: '16px',
          gridColumn: '1 / -1'
        }}>
          <Flex direction="column">
            <Heading size="4" mb="3" align="center" style={cardTitleStyle}>
              Cost Gap Analysis
            </Heading>
            <Text align="center" mb="4" size="2">
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
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value, currency)}
                />
                <Legend />
                <Bar dataKey="actual" fill="#3b82f6" name="Actual Cost" />
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
            backgroundColor: '#10b981', 
            color: '#fff', 
            fontWeight: 'bold',
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
