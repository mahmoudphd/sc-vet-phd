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

// Styles
const styles = {
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

// Sub-components
const ProductCurrencySelectors = ({ 
  selectedProduct, 
  setSelectedProduct, 
  currency, 
  setCurrency 
}: {
  selectedProduct: string;
  setSelectedProduct: (value: string) => void;
  currency: 'EGP' | 'USD';
  setCurrency: (value: 'EGP' | 'USD') => void;
}) => (
  <>
    <Flex align="center" gap="2">
      <Text size="2" weight="bold" style={{ color: '#4b5563' }}>Product:</Text>
      <RadixSelect.Root value={selectedProduct} onValueChange={setSelectedProduct}>
        <RadixSelect.Trigger style={styles.selectTrigger} />
        <RadixSelect.Content style={styles.selectContent}>
          {PRODUCTS.map((p) => (
            <RadixSelect.Item key={p} value={p} style={styles.selectItem}>
              {p}
            </RadixSelect.Item>
          ))}
        </RadixSelect.Content>
      </RadixSelect.Root>
    </Flex>
    
    <Flex align="center" gap="2">
      <Text size="2" weight="bold" style={{ color: '#4b5563' }}>Currency:</Text>
      <RadixSelect.Root value={currency} onValueChange={setCurrency}>
        <RadixSelect.Trigger style={styles.selectTrigger} />
        <RadixSelect.Content style={styles.selectContent}>
          <RadixSelect.Item value="EGP" style={styles.selectItem}>EGP</RadixSelect.Item>
          <RadixSelect.Item value="USD" style={styles.selectItem}>USD</RadixSelect.Item>
        </RadixSelect.Content>
      </RadixSelect.Root>
    </Flex>
  </>
);

const SummaryCards = ({ 
  totals, 
  editableValues, 
  handlers, 
  currency 
}: {
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
        <Card key={index} style={styles.card}>
          <Flex direction="column" gap="2" p="4">
            <Flex justify="between" align="center">
              <Text size="2" color="gray" weight="bold">{item.label}</Text>
              {item.trend && (
                <Badge 
                  color={
                    item.trend === 'up' ? 'green' : 
                    item.trend === 'down' ? 'red' : 'gray'
                  }
                  style={styles.badge}
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
                  style={styles.editableInput}
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

const CostTable = ({
  categories,
  totals,
  totalActual,
  totalTarget,
  totalCostAfter,
  percentOfTotal,
  currency,
  setDialogCategory,
  handleTargetChange
}: {
  categories: CostCategory[];
  totals: Record<CostCategory, CostTotals>;
  totalActual: number;
  totalTarget: number;
  totalCostAfter: number;
  percentOfTotal: (category: CostCategory) => string;
  currency: string;
  setDialogCategory: (category: CostCategory) => void;
  handleTargetChange: (category: CostCategory, value: number) => void;
}) => (
  <Card mb="6" style={styles.card}>
    <Inset clip="padding-box" side="top" pb="current">
      <Table.Root variant="surface">
        <Table.Header style={{ backgroundColor: '#f9fafb' }}>
          <Table.Row>
            <Table.ColumnHeaderCell style={styles.tableHeader}>Cost Category</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell style={styles.tableHeader}>Actual Cost</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell style={styles.tableHeader}>Target Cost</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell style={styles.tableHeader}>Variance</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell style={styles.tableHeader}>% of Total</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell style={styles.tableHeader}>Cost After Optimization</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell style={styles.tableHeader}>Details</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {categories.map((category) => {
            const variance = totals[category].actual - totals[category].budget;
            const varianceColor = variance <= 0 ? '#10b981' : '#ef4444';
            return (
              <Table.Row key={category}>
                <Table.RowHeaderCell style={styles.tableCell}>{category}</Table.RowHeaderCell>
                <Table.Cell style={styles.tableCell}>{formatCurrency(totals[category].actual, currency)}</Table.Cell>
                <Table.Cell style={styles.tableCell}>
                  <input
                    type="number"
                    value={totals[category].budget}
                    onChange={(e) => handleTargetChange(category, parseFloat(e.target.value) || 0)}
                    style={styles.editableInput}
                  />
                </Table.Cell>
                <Table.Cell style={{ 
                  ...styles.tableCell,
                  color: varianceColor,
                  fontWeight: '500'
                }}>
                  {formatCurrency(variance, currency)}
                </Table.Cell>
                <Table.Cell style={styles.tableCell}>{percentOfTotal(category)}%</Table.Cell>
                <Table.Cell style={styles.tableCell}>{formatCurrency(totals[category].costAfter, currency)}</Table.Cell>
                <Table.Cell style={styles.tableCell}>
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
            <Table.RowHeaderCell style={styles.totalCell}>Total</Table.RowHeaderCell>
            <Table.Cell style={styles.totalCell}>{formatCurrency(totalActual, currency)}</Table.Cell>
            <Table.Cell style={styles.totalCell}>{formatCurrency(totalTarget, currency)}</Table.Cell>
            <Table.Cell style={{ 
              ...styles.totalCell,
              color: totalActual - totalTarget <= 0 ? '#10b981' : '#ef4444'
            }}>
              {formatCurrency(totalActual - totalTarget, currency)}
            </Table.Cell>
            <Table.Cell style={styles.totalCell}>100%</Table.Cell>
            <Table.Cell style={styles.totalCell}>{formatCurrency(totalCostAfter, currency)}</Table.Cell>
            <Table.Cell style={styles.totalCell}></Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
    </Inset>
  </Card>
);

const CategoryDialog = ({
  category,
  viewMode,
  setViewMode,
  autoMode,
  setAutoMode,
  data,
  setData,
  solutions,
  handleSolutionSelect,
  selectedSolution,
  setSelectedSolution,
  currency,
  handleSubmitDialog,
  onClose
}: {
  category: CostCategory;
  viewMode: 'actual' | 'target';
  setViewMode: (mode: 'actual' | 'target') => void;
  autoMode: boolean;
  setAutoMode: (value: boolean) => void;
  data: CostData;
  setData: (data: CostData) => void;
  solutions: Record<CostCategory, Record<number, string>>;
  handleSolutionSelect: (category: CostCategory, index: number, solution: string) => void;
  selectedSolution: {
    category: CostCategory | null;
    index: number | null;
    solution: string | null;
  };
  setSelectedSolution: (solution: {
    category: CostCategory | null;
    index: number | null;
    solution: string | null;
  }) => void;
  currency: string;
  handleSubmitDialog: (category: CostCategory) => void;
  onClose: () => void;
}) => {
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

  return (
    <Dialog.Root open onOpenChange={onClose}>
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
        <Flex justify="between" align="center" mb="6">
          <Dialog.Title style={{ 
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#111827',
            margin: 0
          }}>
            {category} Breakdown
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
            
            <Dialog.Close>
              <button 
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
            </Dialog.Close>
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
                    <Table.ColumnHeaderCell style={styles.tableHeader}>Item</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell style={styles.tableHeader}>Qty/Units</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell style={styles.tableHeader}>Unit Price</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell style={styles.tableHeader}>Total Cost</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell style={styles.tableHeader}>Solution</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {getDetailsByCategory(category).map((item, index) => {
                    const qty = category === 'Direct Materials' ? item.concentrationKg :
                              category === 'Direct Labor' ? item.hours : item.qty;
                    
                    const unitPrice = category === 'Direct Materials' ? item.pricePerKg :
                                    category === 'Direct Labor' ? item.hourlyRate : item.unitPrice;

                    const totalCost = (qty || 0) * (unitPrice || 0);

                    return (
                      <Table.Row key={index}>
                        <Table.RowHeaderCell style={styles.tableCell}>{item.name}</Table.RowHeaderCell>
                        <Table.Cell style={styles.tableCell}>
                          {autoMode ? (
                            category === 'Direct Materials' 
                              ? `${qty?.toString()} kg` 
                              : category === 'Direct Labor'
                                ? `${qty} hrs`
                                : qty
                          ) : (
                            <input
                              type="number"
                              value={qty || 0}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value) || 0;
                                const updatedItems = [...getDetailsByCategory(category)];
                                
                                if (category === 'Direct Materials') {
                                  updatedItems[index].concentrationKg = value;
                                } else if (category === 'Direct Labor') {
                                  updatedItems[index].hours = value;
                                } else {
                                  updatedItems[index].qty = value;
                                }

                                setData(prev => {
                                  const newData = { ...prev };
                                  switch(category) {
                                    case 'Direct Materials': 
                                      newData.rawMaterials = updatedItems as Item[];
                                      break;
                                    case 'Packaging Materials':
                                      newData.packagingMaterials = updatedItems as Item[];
                                      break;
                                    case 'Direct Labor':
                                      newData.directLabor = updatedItems as Item[];
                                      break;
                                    case 'Overhead':
                                      newData.overheadItems = updatedItems as Item[];
                                      break;
                                    case 'Other Costs':
                                      newData.otherCosts = updatedItems as Item[];
                                      break;
                                  }
                                  return newData;
                                });
                              }}
                              style={styles.editableInput}
                              step={category === 'Direct Materials' ? 'any' : '1'}
                              min="0"
                            />
                          )}
                        </Table.Cell>
                        <Table.Cell style={styles.tableCell}>
                          {autoMode ? (
                            unitPrice ? formatCurrency(unitPrice, currency) : formatCurrency(0, currency)
                          ) : (
                            <input
                              type="number"
                              value={unitPrice || 0}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value) || 0;
                                const updatedItems = [...getDetailsByCategory(category)];
                                
                                if (category === 'Direct Materials') {
                                  updatedItems[index].pricePerKg = value;
                                } else if (category === 'Direct Labor') {
                                  updatedItems[index].hourlyRate = value;
                                } else {
                                  updatedItems[index].unitPrice = value;
                                }

                                setData(prev => {
                                  const newData = { ...prev };
                                  switch(category) {
                                    case 'Direct Materials': 
                                      newData.rawMaterials = updatedItems as Item[];
                                      break;
                                    case 'Packaging Materials':
                                      newData.packagingMaterials = updatedItems as Item[];
                                      break;
                                    case 'Direct Labor':
                                      newData.directLabor = updatedItems as Item[];
                                      break;
                                    case 'Overhead':
                                      newData.overheadItems = updatedItems as Item[];
                                      break;
                                    case 'Other Costs':
                                      newData.otherCosts = updatedItems as Item[];
                                      break;
                                  }
                                  return newData;
                                });
                              }}
                              style={styles.editableInput}
                              step="0.01"
                              min="0"
                            />
                          )}
                        </Table.Cell>
                        <Table.Cell style={styles.tableCell}>{formatCurrency(totalCost, currency)}</Table.Cell>
                        <Table.Cell style={styles.tableCell}>
                          <RadixSelect.Root
                            value={solutions[category]?.[index] || ''}
                            onValueChange={(value) => handleSolutionSelect(category, index, value)}
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
                              {SOLUTIONS_OPTIONS.map((sol) => (
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
                    <Table.ColumnHeaderCell style={styles.tableHeader}>Item</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell style={styles.tableHeader}>Current</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell style={styles.tableHeader}>Target</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell style={styles.tableHeader}>Reduction</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell style={styles.tableHeader}>Savings</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {getDetailsByCategory(category).map((item, index) => {
                    const currentQty = category === 'Direct Materials' ? item.concentrationKg || 0 :
                                     category === 'Direct Labor' ? item.hours || 0 : item.qty || 0;
                    
                    const currentPrice = category === 'Direct Materials' ? item.pricePerKg || 0 :
                                       category === 'Direct Labor' ? item.hourlyRate || 0 : item.unitPrice || 0;

                    const [targetQty, setTargetQty] = useState(parseFloat((currentQty * 0.9).toString()));
                    const [targetPrice, setTargetPrice] = useState(parseFloat((currentPrice * 0.95).toString()));

                    const savings = parseFloat(((currentQty * currentPrice) - (targetQty * targetPrice)).toFixed(2));
                    const qtyReduction = parseFloat(((1 - (targetQty / currentQty)) * 100).toFixed(1));
                    const priceReduction = parseFloat(((1 - (targetPrice / currentPrice)) * 100).toFixed(1));

                    return (
                      <Table.Row key={index}>
                        <Table.RowHeaderCell style={styles.tableCell}>{item.name}</Table.RowHeaderCell>
                        <Table.Cell style={styles.tableCell}>
                          {category === 'Direct Materials' 
                            ? `${currentQty.toString()} kg` 
                            : category === 'Direct Labor'
                              ? `${currentQty} hrs`
                              : currentQty}
                          <br />
                          {formatCurrency(currentPrice, currency)}
                        </Table.Cell>
                        <Table.Cell style={styles.tableCell}>
                          <div style={{ marginBottom: '8px' }}>
                            <input
                              type="number"
                              value={targetQty}
                              onChange={(e) => {
                                const newValue = parseFloat(e.target.value) || 0;
                                setTargetQty(newValue);
                              }}
                              style={styles.editableInput}
                              step={category === 'Direct Materials' ? 'any' : '1'}
                              min="0"
                            />
                            {category === 'Direct Materials' ? ' kg' : 
                             category === 'Direct Labor' ? ' hrs' : ''}
                          </div>
                          <input
                            type="number"
                            value={targetPrice}
                            onChange={(e) => {
                              const newValue = parseFloat(e.target.value) || 0;
                              setTargetPrice(newValue);
                            }}
                            style={styles.editableInput}
                            step="0.01"
                            min="0"
                          />
                        </Table.Cell>
                        <Table.Cell style={styles.tableCell}>
                          <div style={{ color: '#4f46e5', fontWeight: '500' }}>
                            {qtyReduction}% Qty
                          </div>
                          <div style={{ color: '#4f46e5', fontWeight: '500' }}>
                            {priceReduction}% Price
                          </div>
                        </Table.Cell>
                        <Table.Cell style={{ 
                          ...styles.tableCell,
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
                    <Table.RowHeaderCell style={styles.totalCell}>Total</Table.RowHeaderCell>
                    <Table.Cell style={styles.totalCell}></Table.Cell>
                    <Table.Cell style={styles.totalCell}></Table.Cell>
                    <Table.Cell style={styles.totalCell}></Table.Cell>
                    <Table.Cell style={{ 
                      ...styles.totalCell,
                      color: getDetailsByCategory(category).reduce((sum, item) => {
                        const currentQty = item.concentrationKg || item.hours || item.qty || 0;
                        const currentPrice = item.pricePerKg || item.hourlyRate || item.unitPrice || 0;
                        const targetQty = currentQty * 0.9;
                        const targetPrice = currentPrice * 0.95;
                        return sum + (currentQty * currentPrice) - (targetQty * targetPrice);
                      }, 0) > 0 ? '#10b981' : '#ef4444'
                    }}>
                      {formatCurrency(
                        getDetailsByCategory(category).reduce((sum, item) => {
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
            style={styles.primaryButton}
            onClick={() => handleSubmitDialog(category)}
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
            onClick={onClose}
          >
            Cancel
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

const SupplierDialog = ({
  suppliers,
  currentPrice,
  potentialSavings,
  currency,
  handleSupplierSelect,
  autoSelectBestSupplier,
  selectedSolution,
  setSelectedSolution,
  data,
  setData
}: {
  suppliers: Supplier[];
  currentPrice: number;
  potentialSavings: number;
  currency: string;
  handleSupplierSelect: (id: number) => void;
  autoSelectBestSupplier: () => void;
  selectedSolution: {
    category: CostCategory | null;
    index: number | null;
    solution: string | null;
  };
  setSelectedSolution: (solution: {
    category: CostCategory | null;
    index: number | null;
    solution: string | null;
  }) => void;
  data: CostData;
  setData: (data: CostData) => void;
}) => (
  <Dialog.Root open onOpenChange={() => setSelectedSolution({ category: null, index: null, solution: null })}>
    <Dialog.Content style={{ 
      maxWidth: '800px',
      padding: '24px',
      borderRadius: '16px',
      boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
      border: '1px solid #e5e7eb',
      backgroundColor: 'white',
      fontFamily: 'sans-serif'
    }}>
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
                <Table.ColumnHeaderCell style={styles.tableHeader}>Supplier</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell style={styles.tableHeader}>Price/kg</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell style={styles.tableHeader}>Rating</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell style={styles.tableHeader}>Delivery</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell style={styles.tableHeader}>Reliability</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell style={styles.tableHeader}>Select</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {suppliers.map((supplier) => (
                <Table.Row key={supplier.id}>
                  <Table.Cell style={styles.tableCell}>{supplier.name}</Table.Cell>
                  <Table.Cell style={styles.tableCell}>{formatCurrency(supplier.pricePerKg, currency)}</Table.Cell>
                  <Table.Cell style={styles.tableCell}>{supplier.rating}/5</Table.Cell>
                  <Table.Cell style={styles.tableCell}>{supplier.delivery}</Table.Cell>
                  <Table.Cell style={styles.tableCell}>{supplier.reliability}</Table.Cell>
                  <Table.Cell style={styles.tableCell}>
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
            style={styles.primaryButton}
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
    </Dialog.Content>
  </Dialog.Root>
);

const ChartsSection = ({
  categories,
  totals,
  totalActual,
  targetCost,
  benchmarkTrendDataWithGap,
  currency
}: {
  categories: CostCategory[];
  totals: Record<CostCategory, CostTotals>;
  totalActual: number;
  targetCost: number;
  benchmarkTrendDataWithGap: any[];
  currency: string;
}) => (
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
        <Heading size="4" mb="3" align="center" style={styles.cardTitle}>
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
                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
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
        <Heading size="4" mb="3" align="center" style={styles.cardTitle}>
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
        <Heading size="4" mb="3" align="center" style={styles.cardTitle}>
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
);

// Main Component
const CostAnalytics = () => {
  // State
  const [dialogCategory, setDialogCategory] = useState<CostCategory | null>(null);
  const [viewMode, setViewMode] = useState<'actual' | 'target'>('actual');
  const [benchmarkPrice, setBenchmarkPrice] = useState(220);
  const [profitMargin, setProfitMargin] = useState(25);
  const [currency, setCurrency] = useState<'EGP' | 'USD'>('EGP');
  const [autoMode, setAutoMode] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0]);
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

  // Memoized calculations
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

  // Helper functions
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

  // Handlers
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
            style={styles.primaryButton}
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
          style={styles.successButton}
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
