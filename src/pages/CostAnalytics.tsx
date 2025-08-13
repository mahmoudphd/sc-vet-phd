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
  Tabs,
  Badge,
  Select,
  ScrollArea
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
import { DownloadIcon, UploadIcon, UpdateIcon, MagicWandIcon } from '@radix-ui/react-icons';
import { toast } from 'react-hot-toast';

// ========== Data Types ==========
interface Supplier {
  id: number;
  name: string;
  pricePerKg: number;
  rating: number;
  delivery: string;
  reliability: string;
  qualityRating: number;
  selected?: boolean;
}

interface CostData {
  category: string;
  actual: number;
  target: number;
  variance: number;
  percentage: number;
  costAfter?: number;
  items?: {
    name: string;
    qty: number;
    unitPrice: number;
    total: number;
    concentrationKg?: number;
    pricePerKg?: number;
    hours?: number;
    hourlyRate?: number;
  }[];
}

interface BenchmarkData {
  month: string;
  actual: number;
  benchmark: number;
  target?: number;
}

// ========== Complete Sample Data ==========
const initialSuppliers: Supplier[] = [
  {
    id: 1,
    name: 'Supplier A',
    pricePerKg: 513.00, // 5% discount from 540
    rating: 4.7,
    delivery: '1 week',
    reliability: '97%',
    qualityRating: 4.8,
    selected: false
  },
  {
    id: 2,
    name: 'Supplier B',
    pricePerKg: 486.00, // 10% discount
    rating: 4.2,
    delivery: '2 weeks',
    reliability: '90%',
    qualityRating: 4.2,
    selected: false
  },
  {
    id: 3,
    name: 'Supplier C',
    pricePerKg: 459.00, // 15% discount
    rating: 3.8,
    delivery: '3 weeks',
    reliability: '85%',
    qualityRating: 3.9,
    selected: false
  }
];

const completeCostData: CostData[] = [
  {
    category: 'Direct Materials',
    actual: 133.11,
    target: 129,
    variance: 4.11,
    percentage: 40,
    costAfter: 130,
    items: [
      { name: 'Vitamin B1', concentrationKg: 0.001, pricePerKg: 540, qty: 0.001, unitPrice: 540, total: 0.54 },
      { name: 'Vitamin B2', concentrationKg: 0.006, pricePerKg: 600, qty: 0.006, unitPrice: 600, total: 3.6 },
      { name: 'Vitamin B12', concentrationKg: 0.001, pricePerKg: 2300, qty: 0.001, unitPrice: 2300, total: 2.3 },
      { name: 'Nicotinamide B3', concentrationKg: 0.01, pricePerKg: 400, qty: 0.01, unitPrice: 400, total: 4 },
      { name: 'Pantothenic Acid', concentrationKg: 0.004, pricePerKg: 1700, qty: 0.004, unitPrice: 1700, total: 6.8 },
      { name: 'Vitamin B6', concentrationKg: 0.0015, pricePerKg: 900, qty: 0.0015, unitPrice: 900, total: 1.35 },
      { name: 'Leucine', concentrationKg: 0.03, pricePerKg: 200, qty: 0.03, unitPrice: 200, total: 6 },
      { name: 'Threonine', concentrationKg: 0.01, pricePerKg: 950, qty: 0.01, unitPrice: 950, total: 9.5 },
      { name: 'Taurine', concentrationKg: 0.0025, pricePerKg: 3000, qty: 0.0025, unitPrice: 3000, total: 7.5 },
      { name: 'Glycine', concentrationKg: 0.0025, pricePerKg: 4200, qty: 0.0025, unitPrice: 4200, total: 10.5 },
      { name: 'Arginine', concentrationKg: 0.0025, pricePerKg: 5000, qty: 0.0025, unitPrice: 5000, total: 12.5 },
      { name: 'Cynarin', concentrationKg: 0.0025, pricePerKg: 3900, qty: 0.0025, unitPrice: 3900, total: 9.75 },
      { name: 'Silymarin', concentrationKg: 0.025, pricePerKg: 700, qty: 0.025, unitPrice: 700, total: 17.5 },
      { name: 'Sorbitol', concentrationKg: 0.01, pricePerKg: 360, qty: 0.01, unitPrice: 360, total: 3.6 },
      { name: 'Carnitine', concentrationKg: 0.005, pricePerKg: 1070, qty: 0.005, unitPrice: 1070, total: 5.35 },
      { name: 'Betaine', concentrationKg: 0.02, pricePerKg: 1250, qty: 0.02, unitPrice: 1250, total: 25 },
      { name: 'Tween-80', concentrationKg: 0.075, pricePerKg: 90, qty: 0.075, unitPrice: 90, total: 6.75 },
      { name: 'Water', concentrationKg: 0.571, pricePerKg: 1, qty: 0.571, unitPrice: 1, total: 0.571 }
    ]
  },
  {
    category: 'Packaging Materials',
    actual: 18,
    target: 16,
    variance: 2,
    percentage: 15,
    costAfter: 16,
    items: [
      { name: 'Plastic Bottle (1 L)', qty: 1, unitPrice: 10, total: 10 },
      { name: 'Safety Seal', qty: 1, unitPrice: 3, total: 3 },
      { name: 'Cap', qty: 1, unitPrice: 5, total: 5 }
    ]
  },
  {
    category: 'Direct Labor',
    actual: 3,
    target: 2,
    variance: 1,
    percentage: 10,
    costAfter: 2,
    items: [
      { name: 'Operator', hours: 0.5, hourlyRate: 3.5, qty: 0.5, unitPrice: 3.5, total: 1.75 },
      { name: 'Supervisor', hours: 0.5, hourlyRate: 1.75, qty: 0.5, unitPrice: 1.75, total: 0.88 },
      { name: 'Quality Control', hours: 0.5, hourlyRate: 0.74, qty: 0.5, unitPrice: 0.74, total: 0.37 }
    ]
  },
  {
    category: 'Overhead',
    actual: 2,
    target: 2,
    variance: 0,
    percentage: 10,
    costAfter: 2,
    items: [
      { name: 'Rent', qty: 1, unitPrice: 1, total: 1 },
      { name: 'Electricity', qty: 1, unitPrice: 0.5, total: 0.5 },
      { name: 'Maintenance', qty: 1, unitPrice: 1.5, total: 1.5 }
    ]
  },
  {
    category: 'Other Costs',
    actual: 15,
    target: 13,
    variance: 2,
    percentage: 25,
    costAfter: 14,
    items: [
      { name: 'Transportation', qty: 1, unitPrice: 6.67, total: 6.67 },
      { name: 'Packaging Waste Disposal', qty: 1, unitPrice: 3.33, total: 3.33 },
      { name: 'Rework', qty: 1, unitPrice: 5.0, total: 5 }
    ]
  }
];

const benchmarkData: BenchmarkData[] = [
  { month: 'Jan', actual: 169.61, benchmark: 220 },
  { month: 'Feb', actual: 170.5, benchmark: 220 },
  { month: 'Mar', actual: 168.0, benchmark: 220 },
  { month: 'Apr', actual: 171.2, benchmark: 220 },
  { month: 'May', actual: 171.11, benchmark: 220 }
];

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

// ========== Main Component ==========
const CostAnalyticsDashboard = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [currentPrice, setCurrentPrice] = useState(540.00);
  const [currency, setCurrency] = useState<'USD' | 'EUR'>('USD');
  const [dialogCategory, setDialogCategory] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'actual' | 'target'>('actual');
  const [autoMode, setAutoMode] = useState(true);
  const [solutions, setSolutions] = useState<Record<string, Record<number, string>>>({});
  const [selectedSolution, setSelectedSolution] = useState<{
    category: string | null;
    index: number | null;
    solution: string | null;
  }>({ category: null, index: null, solution: null });

  const formatCurrency = (value: number, curr: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: curr
    }).format(value);
  };

  const handleSupplierSelect = (id: number) => {
    const updatedSuppliers = suppliers.map(supplier => ({
      ...supplier,
      selected: supplier.id === id
    }));
    setSuppliers(updatedSuppliers);

    const selectedSupplier = updatedSuppliers.find(s => s.selected);
    if (selectedSupplier) {
      const savings = currentPrice - selectedSupplier.pricePerKg;
      toast.success(`Selected ${selectedSupplier.name} with ${formatCurrency(savings, currency)} savings`);
    }
  };

  const autoSelectSupplier = (strategy: 'cost' | 'balanced' | 'quality') => {
    const scoredSuppliers = suppliers.map(supplier => {
      const weights = {
        cost: { price: 0.6, rating: 0.2, reliability: 0.1, delivery: 0.1 },
        balanced: { price: 0.4, rating: 0.3, reliability: 0.2, delivery: 0.1 },
        quality: { price: 0.2, rating: 0.4, reliability: 0.3, delivery: 0.1 }
      };

      const priceScore = (1 - (supplier.pricePerKg / currentPrice)) * weights[strategy].price * 100;
      const ratingScore = supplier.rating * weights[strategy].rating * 20;
      const reliabilityScore = parseInt(supplier.reliability) * weights[strategy].reliability;
      const deliveryScore = supplier.delivery.includes('1') ? 100 * weights[strategy].delivery : 
                          supplier.delivery.includes('2') ? 70 * weights[strategy].delivery : 
                          40 * weights[strategy].delivery;

      return {
        ...supplier,
        score: priceScore + ratingScore + reliabilityScore + deliveryScore
      };
    });

    const bestSupplier = scoredSuppliers.reduce((prev, current) => 
      (prev.score > current.score) ? prev : current
    );

    handleSupplierSelect(bestSupplier.id);
  };

  const handleSolutionSelect = (category: string, index: number, solution: string) => {
    setSelectedSolution({ category, index, solution });
    setSolutions(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [index]: solution,
      },
    }));
    
    if (category === 'Direct Materials') {
      const item = completeCostData.find(c => c.category === category)?.items?.[index];
      if (item) setCurrentPrice(item.pricePerKg || 0);
    }
  };

  const getCategoryItems = (category: string) => {
    return completeCostData.find(c => c.category === category)?.items || [];
  };

  const getCategoryData = (category: string) => {
    return completeCostData.find(c => c.category === category) || completeCostData[0];
  };

  const MainCostTable = () => (
    <Card mb="6" style={{ borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <Inset clip="padding-box" side="top" pb="current">
        <Table.Root variant="surface">
          <Table.Header style={{ backgroundColor: '#f3f4f6' }}>
            <Table.Row>
              <Table.ColumnHeaderCell>Cost Category</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Actual Cost</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Target Cost</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Variance</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>% of Total</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Cost After Optimization</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Details</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {completeCostData.map((category) => {
              const variance = category.actual - category.target;
              const varianceColor = variance <= 0 ? 'green' : 'red';
              const percentOfTotal = ((category.actual / completeCostData.reduce((sum, c) => sum + c.actual, 0)) * 100).toFixed(2);
              
              return (
                <Table.Row key={category.category}>
                  <Table.RowHeaderCell>{category.category}</Table.RowHeaderCell>
                  <Table.Cell>{formatCurrency(category.actual, currency)}</Table.Cell>
                  <Table.Cell>
                    <input
                      type="number"
                      value={category.target}
                      onChange={(e) => {
                        // Handle target change
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
                  <Table.Cell style={{ color: varianceColor, fontWeight: '500' }}>
                    {formatCurrency(variance, currency)}
                  </Table.Cell>
                  <Table.Cell>{percentOfTotal}%</Table.Cell>
                  <Table.Cell>{formatCurrency(category.costAfter || 0, currency)}</Table.Cell>
                  <Table.Cell>
                    <Button 
                      size="1" 
                      variant="outline" 
                      onClick={() => setDialogCategory(category.category)}
                    >
                      View Details
                    </Button>
                  </Table.Cell>
                </Table.Row>
              );
            })}
            <Table.Row style={{ backgroundColor: '#f8fafc', fontWeight: '600' }}>
              <Table.RowHeaderCell>Total</Table.RowHeaderCell>
              <Table.Cell>
                {formatCurrency(
                  completeCostData.reduce((sum, c) => sum + c.actual, 0), 
                  currency
                )}
              </Table.Cell>
              <Table.Cell>
                {formatCurrency(
                  completeCostData.reduce((sum, c) => sum + c.target, 0), 
                  currency
                )}
              </Table.Cell>
              <Table.Cell>
                {formatCurrency(
                  completeCostData.reduce((sum, c) => sum + (c.actual - c.target), 0), 
                  currency
                )}
              </Table.Cell>
              <Table.Cell>100%</Table.Cell>
              <Table.Cell>
                {formatCurrency(
                  completeCostData.reduce((sum, c) => sum + (c.costAfter || 0), 0), 
                  currency
                )}
              </Table.Cell>
              <Table.Cell></Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </Inset>
    </Card>
  );

  const SummaryCards = () => (
    <Grid columns={{ initial: '1', md: '3' }} gap="4" mb="6">
      {[
        { label: 'Actual Cost', value: completeCostData.reduce((sum, c) => sum + c.actual, 0), trend: 'down' },
        { label: 'Target Cost', value: completeCostData.reduce((sum, c) => sum + c.target, 0), trend: 'neutral' },
        { label: 'Cost After Optimization', value: completeCostData.reduce((sum, c) => sum + (c.costAfter || 0), 0), trend: 'up' },
        { label: 'Post-Optimization Estimate', 
          value: completeCostData.reduce((sum, c) => sum + c.actual, 0) - 
                 completeCostData.reduce((sum, c) => sum + (c.costAfter || 0), 0), 
          trend: 'up' },
        {
          label: 'Benchmark Price',
          value: 220,
          editable: true,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            // Handle benchmark change
          }
        },
        {
          label: 'Profit Margin (%)',
          value: 25,
          editable: true,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            // Handle margin change
          }
        },
      ].map((item, index) => (
        <Card key={index} style={{ 
          position: 'relative',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          transition: 'all 0.2s ease',
          backgroundColor: 'white'
        }}>
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
  );

  const ChartsSection = () => (
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
            Cost Breakdown
          </Heading>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={completeCostData.map((category) => ({
                  name: category.category,
                  value: category.actual,
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
                {completeCostData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={[
                    '#3b82f6', '#f59e0b', '#ef4444', '#10b981', '#a855f7'
                  ][index % 5]} />
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
              data={benchmarkData}
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
            </LineChart>
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
            Cost Gap Analysis
          </Heading>
          <Text align="center" mb="4" size="2" style={{ 
            color: '#4b5563',
            fontWeight: '500'
          }}>
            Total Cost Gap: {formatCurrency(
              completeCostData.reduce((sum, c) => sum + c.actual, 0) - 
              (220 * 0.75), // 25% margin
              currency
            )}
          </Text>
          <Grid columns="3" gap="2">
            {completeCostData.map((category, index) => (
              <Box 
                key={category.category} 
                style={{ 
                  padding: '12px',
                  borderRadius: '8px', 
                  backgroundColor: '#f3f4f6'
                }}
              >
                <Text weight="bold" size="2" mb="2" style={{ color: '#1f2937' }}>
                  {category.category}
                </Text>
                <Progress
                  value={category.percentage}
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
                  {formatCurrency(category.actual, currency)} ({category.percentage}%)
                </Text>
              </Box>
            ))}
          </Grid>
        </Flex>
      </Card>
    </Grid>
  );

  const SupplierComparison = () => (
    <Card mb="4" style={{ 
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      backgroundColor: 'white'
    }}>
      <Flex justify="between" align="center" mb="4">
        <Heading size="4">Supplier Comparison</Heading>
        <Flex gap="2">
          <Button variant="soft" onClick={() => autoSelectSupplier('cost')}>
            <MagicWandIcon /> Cost Focus
          </Button>
          <Button variant="soft" onClick={() => autoSelectSupplier('balanced')}>
            <MagicWandIcon /> Balanced
          </Button>
          <Button variant="soft" onClick={() => autoSelectSupplier('quality')}>
            <MagicWandIcon /> Quality Focus
          </Button>
        </Flex>
      </Flex>

      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Supplier</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Price/kg</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Price Difference</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Rating</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Quality</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Delivery</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Reliability</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Select</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {suppliers.map((supplier) => {
            const priceDifference = currentPrice - supplier.pricePerKg;
            return (
              <Table.Row key={supplier.id}>
                <Table.Cell>{supplier.name}</Table.Cell>
                <Table.Cell>{formatCurrency(supplier.pricePerKg, currency)}</Table.Cell>
                <Table.Cell style={{ color: '#10b981', fontWeight: 'bold' }}>
                  -{formatCurrency(priceDifference, currency)}
                </Table.Cell>
                <Table.Cell>
                  <Flex align="center" gap="2">
                    <Text>{supplier.rating}/5</Text>
                    <Progress value={supplier.rating * 20} style={{ height: 3 }} />
                  </Flex>
                </Table.Cell>
                <Table.Cell>
                  <Badge color={supplier.qualityRating >= 4.5 ? 'green' : 'yellow'}>
                    {supplier.qualityRating}/5
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <Badge color={supplier.delivery.includes('1') ? 'green' : 'orange'}>
                    {supplier.delivery}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <Progress value={parseInt(supplier.reliability)} max={100} style={{ height: 3 }} />
                </Table.Cell>
                <Table.Cell>
                  <Button
                    size="1"
                    variant={supplier.selected ? 'solid' : 'outline'}
                    onClick={() => handleSupplierSelect(supplier.id)}
                  >
                    {supplier.selected ? 'Selected' : 'Select'}
                  </Button>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Root>
    </Card>
  );

  const CategoryDialogs = () => (
    <>
      {completeCostData.map((categoryData) => (
        <Dialog.Root 
          key={categoryData.category}
          open={dialogCategory === categoryData.category} 
          onOpenChange={(open) => setDialogCategory(open ? categoryData.category : null)}
        >
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
                {categoryData.category} Breakdown
              </Dialog.Title>
              <Flex align="center" gap="2">
                <Text size="2" style={{ color: '#4b5563' }}>Auto IoT Mode</Text>
                <Switch 
                  checked={autoMode} 
                  onCheckedChange={setAutoMode}
                />
              </Flex>
            </Flex>

            <Tabs.Root value={selectedTab} onValueChange={(value) => setSelectedTab(value as 'actual' | 'target')}>
              <Tabs.List>
                <Tabs.Trigger value="actual">Actual View</Tabs.Trigger>
                <Tabs.Trigger value="target">Target View</Tabs.Trigger>
              </Tabs.List>

              <Tabs.Content value="actual">
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
                    {categoryData.items?.map((item, index) => (
                      <Table.Row key={index}>
                        <Table.Cell>{item.name}</Table.Cell>
                        <Table.Cell>
                          {autoMode ? (
                            categoryData.category === 'Direct Materials' 
                              ? item.concentrationKg?.toFixed(6)
                              : item.qty
                          ) : (
                            <input
                              type="number"
                              value={categoryData.category === 'Direct Materials' 
                                ? item.concentrationKg 
                                : item.qty}
                              onChange={(e) => {
                                // Handle quantity change logic
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
                        <Table.Cell>
                          {autoMode ? (
                            formatCurrency(
                              categoryData.category === 'Direct Materials' 
                                ? item.pricePerKg || 0 
                                : item.unitPrice, 
                              currency
                            )
                          ) : (
                            <input
                              type="number"
                              value={categoryData.category === 'Direct Materials' 
                                ? item.pricePerKg 
                                : item.unitPrice}
                              onChange={(e) => {
                                // Handle price change logic
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
                        <Table.Cell>{formatCurrency(item.total, currency)}</Table.Cell>
                        <Table.Cell>
                          <Select.Root
                            value={solutions[categoryData.category]?.[index] || ''}
                            onValueChange={(value) => handleSolutionSelect(categoryData.category, index, value)}
                          >
                            <Select.Trigger />
                            <Select.Content>
                              {solutionsOptions.map((solution) => (
                                <Select.Item key={solution} value={solution}>
                                  {solution}
                                </Select.Item>
                              ))}
                            </Select.Content>
                          </Select.Root>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </Tabs.Content>

              <Tabs.Content value="target">
                <Table.Root>
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeaderCell>Item</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Target Qty</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Target Price</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Potential Savings</Table.ColumnHeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {categoryData.items?.map((item, index) => (
                      <Table.Row key={index}>
                        <Table.Cell>{item.name}</Table.Cell>
                        <Table.Cell>
                          <input
                            type="number"
                            value={categoryData.category === 'Direct Materials' 
                              ? (item.concentrationKg || 0) * 0.95 // 5% reduction
                              : item.qty * 0.95}
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
                        <Table.Cell>
                          <input
                            type="number"
                            value={categoryData.category === 'Direct Materials' 
                              ? (item.pricePerKg || 0) * 0.95 // 5% reduction
                              : item.unitPrice * 0.95}
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
                        <Table.Cell style={{ color: '#10b981' }}>
                          {formatCurrency(
                            categoryData.category === 'Direct Materials'
                              ? (item.concentrationKg || 0) * (item.pricePerKg || 0) * 0.05
                              : item.qty * item.unitPrice * 0.05, 
                            currency
                          )}
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </Tabs.Content>
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
                onClick={() => {
                  // Handle submit logic
                  setDialogCategory(null);
                }}
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
      ))}
    </>
  );

  const CategoryButtons = () => (
    <Flex gap="3" mb="4">
      {completeCostData.map((category) => (
        <Button 
          key={category.category}
          onClick={() => setDialogCategory(category.category)}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '6px',
            fontWeight: '500'
          }}
        >
          View {category.category} Details
        </Button>
      ))}
    </Flex>
  );

  return (
    <Box p="6" style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <Flex justify="between" align="center" mb="6">
        <Heading size="6">Inter-Organizational Cost Management</Heading>
        <Flex gap="3" align="center">
          <Select.Root value={currency} onValueChange={(value) => setCurrency(value as 'USD' | 'EUR')}>
            <Select.Trigger />
            <Select.Content>
              <Select.Item value="USD">USD</Select.Item>
              <Select.Item value="EUR">EUR</Select.Item>
            </Select.Content>
          </Select.Root>
          <Button>
            <DownloadIcon /> Export Report
          </Button>
        </Flex>
      </Flex>

      <SummaryCards />
      <MainCostTable />
      <ChartsSection />
      <SupplierComparison />
      <CategoryButtons />
      <CategoryDialogs />

      <Flex justify="end" mt="4">
        <Button 
          size="2" 
          style={{ 
            backgroundColor: '#10b981', 
            color: '#fff', 
            fontWeight: '500',
            padding: '12px 24px',
            borderRadius: '6px'
          }}
          onClick={() => toast.success('Data submitted to blockchain!')}
        >
          <UploadIcon style={{ marginRight: '8px' }} />
          Submit to Blockchain
        </Button>
      </Flex>
    </Box>
  );
};

export default CostAnalyticsDashboard;
