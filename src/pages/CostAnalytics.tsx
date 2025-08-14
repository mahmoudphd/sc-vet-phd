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

function CostAnalytics() {
  const [dialogCategory, setDialogCategory] = useState<CostCategory | null>(null);
  const [viewMode, setViewMode] = useState<'actual' | 'target'>('actual');
  const [benchmarkPrice, setBenchmarkPrice] = useState(220);
  const [profitMargin, setProfitMargin] = useState(25);
  const [currency, setCurrency] = useState<'EGP' | 'USD'>('EGP');
  const [autoMode, setAutoMode] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [data, setData] = useState(simulatedIoTCostData);

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
                    <Table.Cell style={tableCellStyle}>{formatCurrency(totals[category].budget, currency)}</Table.Cell>
                    <Table.Cell style={{ 
                      ...tableCellStyle,
                      color: varianceColor,
                      fontWeight: '500'
                    }}>
                      {formatCurrency(variance, currency)}
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
                <Table.RowHeaderCell style={totalCellStyle}>Total</Table.RowHeaderCell>
                <Table.Cell style={totalCellStyle}>{formatCurrency(totalActual, currency)}</Table.Cell>
                <Table.Cell style={totalCellStyle}>{formatCurrency(totalTarget, currency)}</Table.Cell>
                <Table.Cell style={{ 
                  ...totalCellStyle,
                  color: totalActual - totalTarget <= 0 ? '#10b981' : '#ef4444'
                }}>
                  {formatCurrency(totalActual - totalTarget, currency)}
                </Table.Cell>
                <Table.Cell style={totalCellStyle}></Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Root>
        </Inset>
      </Card>

      {/* Fixed Dialog Implementation */}
      <Dialog.Root open={!!dialogCategory} onOpenChange={(open) => !open && setDialogCategory(null)}>
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
                  
                  <Dialog.Close asChild>
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
                              <Table.RowHeaderCell style={tableCellStyle}>{item.name}</Table.RowHeaderCell>
                              <Table.Cell style={tableCellStyle}>
                                {dialogCategory === 'Direct Materials' 
                                  ? `${qty} kg` 
                                  : dialogCategory === 'Direct Labor'
                                    ? `${qty} hrs`
                                    : qty}
                              </Table.Cell>
                              <Table.Cell style={tableCellStyle}>
                                {unitPrice ? formatCurrency(unitPrice, currency) : 'N/A'}
                              </Table.Cell>
                              <Table.Cell style={tableCellStyle}>
                                {formatCurrency(totalCost, currency)}
                              </Table.Cell>
                            </Table.Row>
                          );
                        })}
                      </Table.Body>
                    </Table.Root>
                  </Tabs.Content>

                  <Tabs.Content value="target">
                    <Text>Target view implementation would go here</Text>
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
                >
                  Save Changes
                </Button>
                
                <Dialog.Close asChild>
                  <Button
                    variant="soft"
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
                </Dialog.Close>
              </Flex>
            </>
          )}
        </Dialog.Content>
      </Dialog.Root>
    </Box>
  );
}

export default CostAnalytics;
