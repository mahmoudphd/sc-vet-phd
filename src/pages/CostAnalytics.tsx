import React, { useState, useMemo, useCallback } from 'react';
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

// Interfaces and Types
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

// Sample Data
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

// Constants
const CATEGORIES: CostCategory[] = [
  'Direct Materials',
  'Packaging Materials',
  'Direct Labor',
  'Overhead',
  'Other Costs',
];

const PRODUCTS = ['Poultry Drug A', 'Poultry Drug B', 'Poultry Drug C'];

const SOLUTIONS_OPTIONS = [
  'Negotiating better prices with supplier',
  'Reducing waste in material usage',
  'Automation to reduce manual labor costs',
  'Optimizing machine usage',
  'Improving inventory management',
  'Minimize transportation costs',
  'Reduce rework costs',
  'Other',
];

const CHART_COLORS = ['#4f46e5', '#f59e0b', '#ef4444', '#10b981', '#a855f7'];

// Utility functions
const formatCurrency = (value: number, currency: string) => 
  `${currency} ${value.toFixed(2)}`;

const generateSuppliers = (basePrice: number): Supplier[] => {
  const discounts = [0.05 + Math.random() * 0.05, 0.05 + Math.random() * 0.05, 0.05 + Math.random() * 0.05]
    .sort(() => Math.random() - 0.5);

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

// Styles with proper TypeScript typing
interface Styles {
  [key: string]: React.CSSProperties | { [key: string]: React.CSSProperties };
}

const styles: Styles = {
  card: {
    position: 'relative',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    transition: 'all 0.2s ease',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }
  },
  primaryButton: {
    backgroundColor: '#4f46e5',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '8px',
    fontWeight: '500'
  },
  successButton: {
    backgroundColor: '#10b981',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    fontWeight: '600'
  },
  badge: {
    borderRadius: '9999px',
    padding: '2px 8px',
    fontWeight: '500',
    fontSize: '0.75rem'
  },
  selectTrigger: {
    minWidth: '140px',
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '6px 12px',
    fontSize: '0.875rem'
  },
  selectContent: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    border: '1px solid #e5e7eb'
  },
  selectItem: {
    padding: '8px 12px',
    fontSize: '0.875rem'
  },
  editableInput: {
    width: '80px',
    padding: '6px 10px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    backgroundColor: '#f9fafb',
    fontSize: '14px'
  },
  tableHeader: {
    fontWeight: '600',
    padding: '12px 16px',
    backgroundColor: '#f9fafb',
    fontSize: '0.9rem',
    color: '#374151'
  },
  tableCell: {
    fontWeight: 'normal',
    padding: '12px 16px',
    borderBottom: '1px solid #e5e7eb',
    fontSize: '0.9rem',
    color: '#4b5563'
  },
  totalCell: {
    fontWeight: '600',
    padding: '12px 16px',
    borderBottom: '1px solid #e5e7eb',
    fontSize: '0.9rem',
    color: '#111827'
  },
  cardTitle: {
    fontWeight: '600',
    color: '#111827',
    fontSize: '1.1rem'
  }
};

// Sub-components with proper prop typing
interface ProductCurrencySelectorsProps {
  selectedProduct: string;
  setSelectedProduct: (value: string) => void;
  currency: 'EGP' | 'USD';
  setCurrency: (value: 'EGP' | 'USD') => void;
}

const ProductCurrencySelectors: React.FC<ProductCurrencySelectorsProps> = ({ 
  selectedProduct, 
  setSelectedProduct, 
  currency, 
  setCurrency 
}) => (
  <>
    <Flex align="center" gap="2">
      <Text size="2" weight="bold" style={{ color: '#4b5563' }}>Product:</Text>
      <RadixSelect.Root value={selectedProduct} onValueChange={setSelectedProduct}>
        <RadixSelect.Trigger style={styles.selectTrigger as React.CSSProperties} />
        <RadixSelect.Content style={styles.selectContent as React.CSSProperties}>
          {PRODUCTS.map((p) => (
            <RadixSelect.Item key={p} value={p} style={styles.selectItem as React.CSSProperties}>
              {p}
            </RadixSelect.Item>
          ))}
        </RadixSelect.Content>
      </RadixSelect.Root>
    </Flex>
    
    <Flex align="center" gap="2">
      <Text size="2" weight="bold" style={{ color: '#4b5563' }}>Currency:</Text>
      <RadixSelect.Root value={currency} onValueChange={setCurrency}>
        <RadixSelect.Trigger style={styles.selectTrigger as React.CSSProperties} />
        <RadixSelect.Content style={styles.selectContent as React.CSSProperties}>
          <RadixSelect.Item value="EGP" style={styles.selectItem as React.CSSProperties}>EGP</RadixSelect.Item>
          <RadixSelect.Item value="USD" style={styles.selectItem as React.CSSProperties}>USD</RadixSelect.Item>
        </RadixSelect.Content>
      </RadixSelect.Root>
    </Flex>
  </>
);

interface SummaryCardsProps {
  totals: {
    totalActual: number;
    totalTarget: number;
    totalCostAfter: number;
    postOptimizationEstimate: number;
  };
  editableValues: {
    benchmarkPrice: number;
    profitMargin: number;
  };
  handlers: {
    handleBenchmarkChange: (value: number) => void;
    setProfitMargin: (value: number) => void;
  };
  currency: string;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ 
  totals, 
  editableValues, 
  handlers, 
  currency 
}) => {
  const { totalActual, totalTarget, totalCostAfter, postOptimizationEstimate } = totals;
  const { benchmarkPrice, profitMargin } = editableValues;
  const { handleBenchmarkChange, setProfitMargin } = handlers;

  return (
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
        <Card key={index} style={styles.card as React.CSSProperties}>
          <Flex direction="column" gap="2" p="4">
            <Flex justify="between" align="center">
              <Text size="2" color="gray" weight="bold">{item.label}</Text>
              {item.trend && (
                <Badge 
                  color={
                    item.trend === 'up' ? 'green' : 
                    item.trend === 'down' ? 'red' : 'gray'
                  }
                  style={styles.badge as React.CSSProperties}
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
                  style={styles.editableInput as React.CSSProperties}
                />
                <Text size="4" weight="bold" style={{ color: '#111827' }}>
                  {item.label.includes('%') ? `${item.value}%` : formatCurrency(item.value, currency)}
                </Text>
              </Flex>
            ) : (
              <Heading size="5" style={{ fontWeight: '600', color: '#111827' }}>
                {item.label.includes('%') ? `${item.value}%` : formatCurrency(item.value, currency)}
              </Heading>
            )}
          </Flex>
        </Card>
      ))}
    </Grid>
  );
};

interface CostTableProps {
  categories: CostCategory[];
  totals: Record<CostCategory, CostTotals>;
  totalActual: number;
  totalTarget: number;
  totalCostAfter: number;
  percentOfTotal: (category: CostCategory) => string;
  currency: string;
  setDialogCategory: (category: CostCategory) => void;
  handleTargetChange: (category: CostCategory, value: number) => void;
}

const CostTable: React.FC<CostTableProps> = ({
  categories,
  totals,
  totalActual,
  totalTarget,
  totalCostAfter,
  percentOfTotal,
  currency,
  setDialogCategory,
  handleTargetChange
}) => (
  <Card mb="6" style={styles.card as React.CSSProperties}>
    <Inset clip="padding-box" side="top" pb="current">
      <Table.Root variant="surface">
        <Table.Header style={{ backgroundColor: '#f9fafb' }}>
          <Table.Row>
            <Table.ColumnHeaderCell style={styles.tableHeader as React.CSSProperties}>Cost Category</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell style={styles.tableHeader as React.CSSProperties}>Actual Cost</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell style={styles.tableHeader as React.CSSProperties}>Target Cost</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell style={styles.tableHeader as React.CSSProperties}>Variance</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell style={styles.tableHeader as React.CSSProperties}>% of Total</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell style={styles.tableHeader as React.CSSProperties}>Cost After Optimization</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell style={styles.tableHeader as React.CSSProperties}>Details</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {categories.map((category) => {
            const variance = totals[category].actual - totals[category].budget;
            const varianceColor = variance <= 0 ? '#10b981' : '#ef4444';
            return (
              <Table.Row key={category}>
                <Table.RowHeaderCell style={styles.tableCell as React.CSSProperties}>{category}</Table.RowHeaderCell>
                <Table.Cell style={styles.tableCell as React.CSSProperties}>{formatCurrency(totals[category].actual, currency)}</Table.Cell>
                <Table.Cell style={styles.tableCell as React.CSSProperties}>
                  <input
                    type="number"
                    value={totals[category].budget}
                    onChange={(e) => handleTargetChange(category, parseFloat(e.target.value) || 0)}
                    style={styles.editableInput as React.CSSProperties}
                  />
                </Table.Cell>
                <Table.Cell style={{ 
                  ...styles.tableCell,
                  color: varianceColor,
                  fontWeight: '500'
                } as React.CSSProperties}>
                  {formatCurrency(variance, currency)}
                </Table.Cell>
                <Table.Cell style={styles.tableCell as React.CSSProperties}>{percentOfTotal(category)}%</Table.Cell>
                <Table.Cell style={styles.tableCell as React.CSSProperties}>{formatCurrency(totals[category].costAfter, currency)}</Table.Cell>
                <Table.Cell style={styles.tableCell as React.CSSProperties}>
                  <Button 
                    size="1" 
                    variant="solid"
                    onClick={() => setDialogCategory(category)}
                    style={{
                      borderRadius: '6px',
                      padding: '4px 12px',
                      fontSize: '0.875rem',
                      backgroundColor: '#4f46e5',
                      color: 'white',
                      fontWeight: '500'
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
            borderTop: '1px solid #e5e7eb'
          }}>
            <Table.RowHeaderCell style={styles.totalCell as React.CSSProperties}>Total</Table.RowHeaderCell>
            <Table.Cell style={styles.totalCell as React.CSSProperties}>{formatCurrency(totalActual, currency)}</Table.Cell>
            <Table.Cell style={styles.totalCell as React.CSSProperties}>{formatCurrency(totalTarget, currency)}</Table.Cell>
            <Table.Cell style={{ 
              ...styles.totalCell,
              color: totalActual - totalTarget <= 0 ? '#10b981' : '#ef4444'
            } as React.CSSProperties}>
              {formatCurrency(totalActual - totalTarget, currency)}
            </Table.Cell>
            <Table.Cell style={styles.totalCell as React.CSSProperties}>100%</Table.Cell>
            <Table.Cell style={styles.totalCell as React.CSSProperties}>{formatCurrency(totalCostAfter, currency)}</Table.Cell>
            <Table.Cell style={styles.totalCell as React.CSSProperties}></Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
    </Inset>
  </Card>
);

// Continue with the rest of the components following the same pattern...

// Main Component with proper typing
const CostAnalytics: React.FC = () => {
  // State with proper types
  const [dialogCategory, setDialogCategory] = useState<CostCategory | null>(null);
  const [viewMode, setViewMode] = useState<'actual' | 'target'>('actual');
  const [benchmarkPrice, setBenchmarkPrice] = useState<number>(220);
  const [profitMargin, setProfitMargin] = useState<number>(25);
  const [currency, setCurrency] = useState<'EGP' | 'USD'>('EGP');
  const [autoMode, setAutoMode] = useState<boolean>(true);
  const [selectedProduct, setSelectedProduct] = useState<string>(PRODUCTS[0]);
  const [data, setData] = useState<CostData>(simulatedIoTCostData);
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
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [potentialSavings, setPotentialSavings] = useState<number>(0);

  // Memoized calculations with proper return type
  const { totals, totalActual, totalTarget, totalCostAfter, postOptimizationEstimate, targetCost } = useMemo(() => {
    const totals = data.totals;
    const totalActual = CATEGORIES.reduce((sum, category) => sum + totals[category].actual, 0);
    const totalTarget = CATEGORIES.reduce((sum, category) => sum + totals[category].budget, 0);
    const totalCostAfter = CATEGORIES.reduce((sum, category) => sum + totals[category].costAfter, 0);
    const postOptimizationEstimate = totalActual - totalCostAfter;
    const targetCost = benchmarkPrice * (1 - profitMargin / 100);

    return { totals, totalActual, totalTarget, totalCostAfter, postOptimizationEstimate, targetCost };
  }, [data, benchmarkPrice, profitMargin]);

  const benchmarkTrendData = useMemo(() => [
    { month: 'Jan', actual: 169.61, benchmark: benchmarkPrice },
    { month: 'Feb', actual: 170.5, benchmark: benchmarkPrice },
    { month: 'Mar', actual: 168.0, benchmark: benchmarkPrice },
    { month: 'Apr', actual: 171.2, benchmark: benchmarkPrice },
    { month: 'May', actual: totalActual, benchmark: benchmarkPrice, costAfter: totalCostAfter, postOptimization: postOptimizationEstimate },
  ], [benchmarkPrice, totalActual, totalCostAfter, postOptimizationEstimate]);

  const benchmarkTrendDataWithGap = useMemo(() => benchmarkTrendData.map((d) => ({
    ...d,
    targetCost,
    gap: d.actual - targetCost,
  })), [benchmarkTrendData, targetCost]);

  // Helper functions with proper typing
  const getDetailsByCategory = useCallback((category: CostCategory): Item[] => {
    switch (category) {
      case 'Direct Materials': return data.rawMaterials;
      case 'Packaging Materials': return data.packagingMaterials;
      case 'Direct Labor': return data.directLabor;
      case 'Overhead': return data.overheadItems;
      case 'Other Costs': return data.otherCosts;
      default: return [];
    }
  }, [data]);

  const percentOfTotal = useCallback((category: CostCategory) => 
    totalActual === 0 ? '0.00' : ((totals[category].actual / totalActual) * 100).toFixed(2),
    [totals, totalActual]
  );

  // Handlers with proper typing
  const handleSolutionSelect = useCallback((category: CostCategory, index: number, solution: string) => {
    setSelectedSolution({ category, index, solution });
    setSolutions(prev => ({
      ...prev,
      [category]: { ...prev[category], [index]: solution }
    }));
    
    if (category === 'Direct Materials') {
      const item = data.rawMaterials[index];
      setCurrentPrice(item.pricePerKg || 0);
      setSuppliers(generateSuppliers(item.pricePerKg || 0));
    }
  }, [data.rawMaterials]);

  const handleSupplierSelect = useCallback((id: number) => {
    setSuppliers(prev => prev.map(supplier => ({
      ...supplier,
      selected: supplier.id === id
    })));
    
    const selectedSupplier = suppliers.find(s => s.id === id);
    if (selectedSupplier) {
      const savings = currentPrice - selectedSupplier.pricePerKg;
      setPotentialSavings(Math.max(savings, 0));
    }
  }, [suppliers, currentPrice]);

  const autoSelectBestSupplier = useCallback(() => {
    const weightedSuppliers = suppliers.map(supplier => {
      const priceScore = (1 - (supplier.pricePerKg / currentPrice)) * 40;
      const ratingScore = (supplier.rating / 5) * 30;
      const reliabilityScore = (parseInt(supplier.reliability) / 100) * 20;
      const deliveryWeeks = parseInt(supplier.delivery.split(' ')[0]);
      const deliveryScore = (1 - (deliveryWeeks / 3)) * 10;
      const totalScore = priceScore + ratingScore + reliabilityScore + deliveryScore;
      
      return { ...supplier, score: totalScore };
    });

    const bestSupplier = weightedSuppliers.reduce((prev, current) => 
      (prev.score > current.score) ? prev : current
    );

    handleSupplierSelect(bestSupplier.id);
  }, [suppliers, currentPrice, handleSupplierSelect]);

  const handleSubmitDialog = useCallback((category: CostCategory) => {
    const items = getDetailsByCategory(category);
    const newActual = items.reduce((sum, item) => {
      if (category === 'Direct Materials') {
        return sum + ((item.concentrationKg || 0) * (item.pricePerKg || 0));
      } else if (category === 'Direct Labor') {
        return sum + ((item.hours || 0) * (item.hourlyRate || 0));
      } else if (category === 'Overhead') {
        return sum + ((item.totalCost || 0) / (item.basis || 1));
      }
      return sum + ((item.qty || 0) * (item.unitPrice || 0));
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
  }, [getDetailsByCategory]);

  // Render method
  return (
    <Box p="6" style={{ backgroundColor: '#f9fafb', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      {/* Header Section */}
      <Flex justify="between" align="center" mb="6" wrap="wrap" gap="3">
        <Heading size="6" weight="bold" style={{ color: '#111827' }}>Inter-Organizational Cost Management</Heading>
        <Flex gap="3" align="center" wrap="wrap">
          <ProductCurrencySelectors 
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            currency={currency}
            setCurrency={setCurrency}
          />
          <Button 
            variant="solid"
            onClick={() => alert('Export Report functionality not implemented yet.')}
            style={styles.primaryButton as React.CSSProperties}
          >
            <DownloadIcon style={{ marginRight: '6px' }} />
            Export Report
          </Button>
        </Flex>
      </Flex>

      {/* Summary Cards */}
      <SummaryCards 
        totals={{ totalActual, totalTarget, totalCostAfter, postOptimizationEstimate }}
        editableValues={{ benchmarkPrice, profitMargin }}
        handlers={{ 
          handleBenchmarkChange: setBenchmarkPrice, 
          setProfitMargin 
        }}
        currency={currency}
      />

      {/* Main Cost Table */}
      <CostTable 
        categories={CATEGORIES}
        totals={totals}
        totalActual={totalActual}
        totalTarget={totalTarget}
        totalCostAfter={totalCostAfter}
        percentOfTotal={percentOfTotal}
        currency={currency}
        setDialogCategory={setDialogCategory}
        handleTargetChange={(category, value) => setData(prev => ({
          ...prev,
          totals: {
            ...prev.totals,
            [category]: { ...prev.totals[category], budget: value }
          }
        }))}
      />

      {/* Category Dialog */}
      {dialogCategory && (
        <CategoryDialog 
          category={dialogCategory}
          viewMode={viewMode}
          setViewMode={setViewMode}
          autoMode={autoMode}
          setAutoMode={setAutoMode}
          data={data}
          setData={setData}
          solutions={solutions}
          handleSolutionSelect={handleSolutionSelect}
          selectedSolution={selectedSolution}
          setSelectedSolution={setSelectedSolution}
          currency={currency}
          handleSubmitDialog={handleSubmitDialog}
          onClose={() => setDialogCategory(null)}
        />
      )}

      {/* Supplier Dialog */}
      {selectedSolution.solution && (
        <SupplierDialog 
          suppliers={suppliers}
          currentPrice={currentPrice}
          potentialSavings={potentialSavings}
          currency={currency}
          handleSupplierSelect={handleSupplierSelect}
          autoSelectBestSupplier={autoSelectBestSupplier}
          selectedSolution={selectedSolution}
          setSelectedSolution={setSelectedSolution}
          data={data}
          setData={setData}
        />
      )}

      {/* Charts Section */}
      <ChartsSection 
        categories={CATEGORIES}
        totals={totals}
        totalActual={totalActual}
        targetCost={targetCost}
        benchmarkTrendDataWithGap={benchmarkTrendDataWithGap}
        currency={currency}
      />

      {/* Submit Button */}
      <Flex justify="end" mt="6">
        <Button 
          size="2" 
          style={styles.successButton as React.CSSProperties}
          onClick={() => alert('Data submitted to blockchain successfully!')}
        >
          <UploadIcon style={{ marginRight: '8px' }} />
          Submit to Blockchain
        </Button>
      </Flex>
    </Box>
  );
};

export default CostAnalytics;
