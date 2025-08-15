import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  calculatedTarget?: number;
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

const formatNumber = (value: number, decimalPlaces: number = 3) => {
  return value.toFixed(decimalPlaces).replace(/\.?0+$/, '');
};

const formatCurrency = (value: number, currency: string) => {
  return `${currency} ${value.toFixed(2)}`;
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

const CostAnalytics = () => {
  const [dialogCategory, setDialogCategory] = useState<CostCategory | null>(null);
  const [viewMode, setViewMode] = useState<'actual' | 'target'>('actual');
  const [benchmarkPrice, setBenchmarkPrice] = useState(220);
  const [profitMargin, setProfitMargin] = useState(25);
  const [currency, setCurrency] = useState<'EGP' | 'USD'>('EGP');
  const [autoMode, setAutoMode] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [data, setData] = useState<CostData>(simulatedIoTCostData);
  const [solutions, setSolutions] = useState<Record<CostCategory, Record<number, string>>>({
    'Direct Materials': {},
    'Packaging Materials': {},
    'Direct Labor': {},
    'Overhead': {},
    'Other Costs': {},
  });

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

  const calculateMaterialsTarget = useMemo(() => {
    const actualTotal = data.totals['Direct Materials'].actual;
    const savings = data.rawMaterials.reduce(
      (sum, item) => sum + 
        ((item.concentrationKg || 0) * (item.pricePerKg || 0)) - 
        ((item.targetQty || item.concentrationKg || 0) * 
         (item.targetPrice || item.pricePerKg || 0)),
      0
    );
    return actualTotal - savings;
  }, [data.rawMaterials, data.totals]);

  const updateItemTarget = useCallback((category: CostCategory, index: number, field: keyof Item, value: number) => {
    setData(prev => {
      const updatedData = { ...prev };
      const categoryItems = [...updatedData[getCategoryKey(category)]];
      
      categoryItems[index] = {
        ...categoryItems[index],
        [field]: value
      };

      if (category === 'Direct Materials') {
        const savings = categoryItems.reduce(
          (sum, item) => sum + 
            ((item.concentrationKg || 0) * (item.pricePerKg || 0)) - 
            ((item.targetQty || item.concentrationKg || 0) * 
             (item.targetPrice || item.pricePerKg || 0)),
          0
        );

        updatedData.totals['Direct Materials'].calculatedTarget = 
          updatedData.totals['Direct Materials'].actual - savings;
      }

      return {
        ...updatedData,
        [getCategoryKey(category)]: categoryItems
      };
    });
  }, []);

  const getCategoryKey = (category: CostCategory): keyof CostData => {
    switch(category) {
      case 'Direct Materials': return 'rawMaterials';
      case 'Packaging Materials': return 'packagingMaterials';
      case 'Direct Labor': return 'directLabor';
      case 'Overhead': return 'overheadItems';
      case 'Other Costs': return 'otherCosts';
      default: return 'rawMaterials';
    }
  };

  const { totalActual, totalTarget, totalCostAfter } = useMemo(() => {
    const totals = data.totals;
    return {
      totalActual: categories.reduce((sum, category) => sum + totals[category].actual, 0),
      totalTarget: categories.reduce((sum, category) => sum + totals[category].budget, 0),
      totalCostAfter: categories.reduce((sum, category) => sum + totals[category].costAfter, 0)
    };
  }, [data.totals]);

  const postOptimizationEstimate = totalActual - totalCostAfter;
  const targetCost = benchmarkPrice * (1 - profitMargin / 100);

  const handleBenchmarkChange = (value: number) => {
    setBenchmarkPrice(value);
  };

  const handleTargetChange = (category: CostCategory, value: number) => {
    setData(prev => ({
      ...prev,
      totals: {
        ...prev.totals,
        [category]: {
          ...prev.totals[category],
          budget: value
        }
      }
    }));
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

  const handleExportReport = () => {
    alert('Export Report functionality not implemented yet.');
  };

  const handleSubmitToBlockchain = () => {
    alert('Data submitted to blockchain successfully!');
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
                const variance = data.totals[category].actual - 
                  (category === 'Direct Materials' 
                    ? (data.totals[category].calculatedTarget || data.totals[category].budget)
                    : data.totals[category].budget);
                const varianceColor = variance <= 0 ? 'green' : 'red';
                return (
                  <Table.Row key={category}>
                    <Table.RowHeaderCell style={tableRowHeaderStyle}>{category}</Table.RowHeaderCell>
                    <Table.Cell style={tableCellStyle}>{formatCurrency(data.totals[category].actual, currency)}</Table.Cell>
                    <Table.Cell style={tableCellStyle}>
                      {category === 'Direct Materials' ? (
                        <Text weight="bold">
                          {formatCurrency(data.totals[category].calculatedTarget || data.totals[category].budget, currency)}
                        </Text>
                      ) : (
                        <input
                          type="number"
                          value={data.totals[category].budget}
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
                      )}
                    </Table.Cell>
                    <Table.Cell style={{ 
                      ...tableCellStyle,
                      color: varianceColor
                    }}>
                      {formatCurrency(variance, currency)}
                    </Table.Cell>
                    <Table.Cell style={tableCellStyle}>
                      {((data.totals[category].actual / totalActual) * 100).toFixed(2)}%
                    </Table.Cell>
                    <Table.Cell style={tableCellStyle}>
                      {formatCurrency(data.totals[category].costAfter, currency)}
                    </Table.Cell>
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
                                value={item.targetQty ?? currentQty * 0.9}
                                onChange={(e) => updateItemTarget(
                                  dialogCategory, 
                                  index, 
                                  'targetQty', 
                                  parseFloat(e.target.value) || 0
                                )}
                                step="0.001"
                                min="0"
                                style={{ width: '80px' }}
                              />
                            </Table.Cell>
                            <Table.Cell style={tableCellStyle}>
                              <input
                                type="number"
                                value={item.targetPrice ?? currentPrice * 0.95}
                                onChange={(e) => updateItemTarget(
                                  dialogCategory, 
                                  index, 
                                  'targetPrice', 
                                  parseFloat(e.target.value) || 0
                                )}
                                step="0.01"
                                min="0"
                                style={{ width: '80px' }}
                              />
                            </Table.Cell>
                            <Table.Cell style={tableCellStyle}>
                              {formatCurrency(
                                (currentQty * currentPrice) - 
                                ((item.targetQty ?? currentQty * 0.9) * 
                                 (item.targetPrice ?? currentPrice * 0.95)),
                                currency
                              )}
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
                    value: data.totals[category].actual,
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
                    <Cell key={`cell-${index}`} fill={['#3b82f6', '#f59e0b', '#ef4444', '#10b981', '#a855f7'][index % 5]} />
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
              Direct Materials Target
            </Heading>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { 
                    name: 'Current', 
                    value: data.totals['Direct Materials'].actual 
                  },
                  { 
                    name: 'Target', 
                    value: data.totals['Direct Materials'].calculatedTarget || 
                          data.totals['Direct Materials'].budget 
                  },
                  { 
                    name: 'Savings', 
                    value: data.totals['Direct Materials'].actual - 
                          (data.totals['Direct Materials'].calculatedTarget || 
                           data.totals['Direct Materials'].budget),
                    fill: '#10b981'
                  }
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value, currency)}
                />
                <Bar dataKey="value">
                  <Cell fill="#3b82f6" />
                  <Cell fill="#f59e0b" />
                  <Cell fill="#10b981" />
                </Bar>
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
};

export default React.memo(CostAnalytics);
