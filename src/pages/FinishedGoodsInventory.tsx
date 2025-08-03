import React, { useState } from 'react';
import {
  Card,
  Flex,
  Heading,
  Table,
  Button,
  TextField,
  Box,
  Grid,
  Text,
  Badge,
  Tooltip,
  Dialog,
  Select,
  Tabs
} from '@radix-ui/themes';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend
} from 'recharts';
import { 
  MagnifyingGlassIcon, 
  CubeIcon, 
  InfoCircledIcon,
  MixerHorizontalIcon,
  DashboardIcon,
  TableIcon
} from '@radix-ui/react-icons';

interface ProductMetrics {
  annualCOGS: number;
  avgInventoryValue: number;
  shelfLifeDays: number;
  seasonalityFactor: number;
  unitCost: number;
}

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  reserved: number;
  storage?: string;
  expiry?: string;
  location?: string;
}

const productMetrics: Record<string, ProductMetrics> = {
  'Poultry Product A': {
    annualCOGS: 75000,
    avgInventoryValue: 15000,
    shelfLifeDays: 90,
    seasonalityFactor: 1.2,
    unitCost: 12.5
  },
  'Poultry Product B': {
    annualCOGS: 50000,
    avgInventoryValue: 20000,
    shelfLifeDays: 180,
    seasonalityFactor: 1.0,
    unitCost: 15.0
  },
  'Poultry Product C': {
    annualCOGS: 30000,
    avgInventoryValue: 10000,
    shelfLifeDays: 60,
    seasonalityFactor: 1.5,
    unitCost: 10.0
  }
};

const initialData: InventoryItem[] = [
  {
    id: 'FGI001',
    name: 'Poultry Product A',
    quantity: 120,
    reserved: 40,
    storage: '4°C',
    expiry: '2025-08-10',
    location: 'Zone 1'
  },
  {
    id: 'FGI002',
    name: 'Poultry Product B',
    quantity: 100,
    reserved: 30,
    storage: '6°C',
    expiry: '2025-09-15',
    location: 'Zone 2'
  },
  {
    id: 'FGI003',
    name: 'Poultry Product C',
    quantity: 80,
    reserved: 20,
    storage: '8°C',
    expiry: '2025-07-28',
    location: 'Zone 2'
  }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const calculateTurnoverRate = (productName: string): number => {
  const metrics = productMetrics[productName];
  if (!metrics) return 0;
  
  const baseTurnover = metrics.annualCOGS / metrics.avgInventoryValue;
  const shelfLifeAdjustment = 365 / metrics.shelfLifeDays;
  
  return baseTurnover * shelfLifeAdjustment * metrics.seasonalityFactor;
};

const getExpiryDetails = (expiry: string) => {
  const today = new Date();
  const expiryDate = new Date(expiry);
  const diffDays = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  return {
    days: diffDays,
    status: diffDays < 10 ? 'Critical' : diffDays < 30 ? 'Warning' : 'Good',
    color: diffDays < 10 ? '#ef4444' : diffDays < 30 ? '#f59e0b' : '#22c55e'
  };
};

const classifyABC = (quantity: number, value: number) => {
  if (quantity >= 100 || value >= 1500) return 'A';
  if (quantity >= 50 || value >= 750) return 'B';
  return 'C';
};

const FinishedGoodsInventory: React.FC = () => {
  const [data, setData] = useState<InventoryItem[]>(initialData);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(null);
  const [activeTab, setActiveTab] = useState<'inventory' | 'analytics'>('inventory');

  // Apply filters
  const filteredData = data.filter(item => {
    const matchesSearch = 
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLocation = 
      locationFilter === 'all' || item.location === locationFilter;
    
    return matchesSearch && matchesLocation;
  });

  // Calculate metrics
  const totalInventoryValue = filteredData.reduce(
    (sum, item) => sum + (item.quantity * (productMetrics[item.name]?.unitCost || 0)), 
    0
  );

  const averageTurnover = filteredData.length > 0
    ? filteredData.reduce((sum, item) => sum + calculateTurnoverRate(item.name), 0) / filteredData.length
    : 0;

  const locations = [...new Set(data.map(item => item.location))];

  // Prepare data for charts
  const inventoryChartData = filteredData.map(item => ({
    name: item.name,
    quantity: item.quantity,
    reserved: item.reserved,
    available: item.quantity - item.reserved,
    value: item.quantity * (productMetrics[item.name]?.unitCost || 0),
    abcClass: classifyABC(
      item.quantity, 
      item.quantity * (productMetrics[item.name]?.unitCost || 0)
    )
  }));

  const turnoverData = filteredData.map(item => ({
    name: item.name,
    turnover: calculateTurnoverRate(item.name)
  }));

  const handleQuantityChange = (id: string, value: number) => {
    setData(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: value } : item
    ));
  };

  const handleReservedChange = (id: string, value: number) => {
    setData(prev => prev.map(item => 
      item.id === id ? { ...item, reserved: value } : item
    ));
  };

  return (
    <Box p="4">
      <Card>
        <Flex direction="column" gap="4">
          {/* Header Section */}
          <Flex justify="between" align="center">
            <Heading size="6">Finished Goods Inventory</Heading>
            <Flex gap="3" align="center">
              <TextField.Root
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '200px' }}
              >
                <TextField.Slot>
                  <MagnifyingGlassIcon />
                </TextField.Slot>
              </TextField.Root>

              <Select.Root 
                value={locationFilter}
                onValueChange={setLocationFilter}
              >
                <Select.Trigger>
                  <MixerHorizontalIcon />
                  Filter
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="all">All Locations</Select.Item>
                  {locations.map(loc => (
                    <Select.Item key={loc} value={loc || ''}>{loc}</Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>

              <Button
                variant="solid"
                color="green"
                onClick={() => alert('Inventory data submitted to blockchain!')}
              >
                <CubeIcon className="mr-2" />
                Submit to Blockchain
              </Button>
            </Flex>
          </Flex>

          {/* Tabs for view switching */}
          <Tabs.Root value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <Tabs.List>
              <Tabs.Trigger value="inventory">
                <TableIcon className="mr-2" />
                Inventory
              </Tabs.Trigger>
              <Tabs.Trigger value="analytics">
                <DashboardIcon className="mr-2" />
                Analytics
              </Tabs.Trigger>
            </Tabs.List>
          </Tabs.Root>

          {activeTab === 'inventory' ? (
            <>
              {/* Summary Cards */}
              <Grid columns="4" gap="4">
                <Card>
                  <Flex direction="column" gap="1">
                    <Flex align="center" gap="2">
                      <Text size="2" color="gray">Total Products</Text>
                      <Tooltip content="Number of unique products in inventory">
                        <InfoCircledIcon width="14" height="14" />
                      </Tooltip>
                    </Flex>
                    <Text size="5" weight="bold">{filteredData.length}</Text>
                  </Flex>
                </Card>
                <Card>
                  <Flex direction="column" gap="1">
                    <Flex align="center" gap="2">
                      <Text size="2" color="gray">Inventory Value</Text>
                      <Tooltip content="Total value of current inventory">
                        <InfoCircledIcon width="14" height="14" />
                      </Tooltip>
                    </Flex>
                    <Text size="5" weight="bold">
                      ${totalInventoryValue.toLocaleString()}
                    </Text>
                  </Flex>
                </Card>
                <Card>
                  <Flex direction="column" gap="1">
                    <Flex align="center" gap="2">
                      <Text size="2" color="gray">Avg Turnover</Text>
                      <Tooltip content="Average inventory turnover rate">
                        <InfoCircledIcon width="14" height="14" />
                      </Tooltip>
                    </Flex>
                    <Text size="5" weight="bold">
                      {averageTurnover.toFixed(1)}x
                      <Badge 
                        color={
                          averageTurnover > 8 ? 'green' :
                          averageTurnover > 4 ? 'amber' : 'red'
                        }
                        ml="2"
                      >
                        {
                          averageTurnover > 8 ? 'High' :
                          averageTurnover > 4 ? 'Medium' : 'Low'
                        }
                      </Badge>
                    </Text>
                  </Flex>
                </Card>
                <Card>
                  <Flex direction="column" gap="1">
                    <Flex align="center" gap="2">
                      <Text size="2" color="gray">Expiring Soon</Text>
                      <Tooltip content="Products expiring in less than 30 days">
                        <InfoCircledIcon width="14" height="14" />
                      </Tooltip>
                    </Flex>
                    <Text size="5" weight="bold">
                      {data.filter(item => getExpiryDetails(item.expiry || '').days < 30).length}
                    </Text>
                  </Flex>
                </Card>
              </Grid>

              {/* Inventory Table */}
              <Table.Root>
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeaderCell>Product</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>ABC Class</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Turnover</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Stock</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Value</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Storage</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Expiry</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {filteredData.map((item) => {
                    const expiryDetails = getExpiryDetails(item.expiry || '');
                    const metrics = productMetrics[item.name] || {
                      unitCost: 0,
                      annualCOGS: 0,
                      avgInventoryValue: 0,
                      shelfLifeDays: 0,
                      seasonalityFactor: 0
                    };
                    const abcClass = classifyABC(item.quantity, item.quantity * metrics.unitCost);
                    
                    return (
                      <Table.Row 
                        key={item.id}
                        onClick={() => setSelectedProduct(item)}
                        style={{ cursor: 'pointer' }}
                      >
                        <Table.Cell>
                          <Flex direction="column">
                            <Text weight="bold">{item.name}</Text>
                            <Text size="1" color="gray">{item.id}</Text>
                          </Flex>
                        </Table.Cell>
                        <Table.Cell>
                          <Badge 
                            color={
                              abcClass === 'A' ? 'blue' : 
                              abcClass === 'B' ? 'green' : 'gray'
                            }
                          >
                            {abcClass}
                          </Badge>
                        </Table.Cell>
                        <Table.Cell>
                          <Badge 
                            color={
                              calculateTurnoverRate(item.name) > 8 ? 'green' :
                              calculateTurnoverRate(item.name) > 4 ? 'amber' : 'red'
                            }
                          >
                            {calculateTurnoverRate(item.name).toFixed(1)}x
                          </Badge>
                        </Table.Cell>
                        <Table.Cell>
                          <Flex direction="column" gap="1">
                            <Flex gap="2" align="center">
                              <Text>Total:</Text>
                              <Text weight="bold">{item.quantity}</Text>
                            </Flex>
                            <Flex gap="2" align="center">
                              <Text>Avail:</Text>
                              <Text weight="bold">{item.quantity - item.reserved}</Text>
                            </Flex>
                          </Flex>
                        </Table.Cell>
                        <Table.Cell>
                          <Text weight="bold">
                            ${(item.quantity * metrics.unitCost).toLocaleString()}
                          </Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Text>{item.storage}</Text>
                          <Text size="1" color="blue">Zone: {item.location}</Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Flex align="center" gap="2">
                            <Text>{item.expiry}</Text>
                            <Badge color={expiryDetails.color}>
                              {expiryDetails.days}d
                            </Badge>
                          </Flex>
                        </Table.Cell>
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table.Row>
            </>
          ) : (
            <Flex direction="column" gap="4">
              {/* Analytics Dashboard */}
              <Grid columns="2" gap="4">
                <Card>
                  <Heading size="4" mb="2">Inventory Value by Product</Heading>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={inventoryChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                      >
                        {inventoryChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend />
                      <ChartTooltip 
                        formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>

                <Card>
                  <Heading size="4" mb="2">Turnover Rates</Heading>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={turnoverData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip 
                        formatter={(value: number) => [`${value.toFixed(1)}x`, 'Turnover']}
                      />
                      <Bar dataKey="turnover" name="Turnover Rate">
                        {turnoverData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={
                              entry.turnover > 8 ? '#10b981' :
                              entry.turnover > 4 ? '#f59e0b' : '#ef4444'
                            } 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </Grid>

              <Card>
                <Heading size="4" mb="2">ABC Analysis</Heading>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={inventoryChartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip />
                    <Bar dataKey="quantity" name="Quantity">
                      {inventoryChartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`}
                          fill={
                            entry.abcClass === 'A' ? '#3b82f6' :
                            entry.abcClass === 'B' ? '#10b981' : '#6b7280'
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Flex>
          )}

          {/* Product Detail Dialog */}
          <Dialog.Root open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
            <Dialog.Content style={{ maxWidth: '600px' }}>
              {selectedProduct && (
                <Flex direction="column" gap="3">
                  <Dialog.Title>{selectedProduct.name}</Dialog.Title>
                  
                  <Grid columns="2" gap="3">
                    <Box>
                      <Text as="div" size="2" color="gray">Product ID</Text>
                      <Text size="3">{selectedProduct.id}</Text>
                    </Box>
                    <Box>
                      <Text as="div" size="2" color="gray">ABC Class</Text>
                      <Badge 
                        color={
                          classifyABC(
                            selectedProduct.quantity,
                            selectedProduct.quantity * (productMetrics[selectedProduct.name]?.unitCost || 0)
                          ) === 'A' ? 'blue' : 
                          classifyABC(
                            selectedProduct.quantity,
                            selectedProduct.quantity * (productMetrics[selectedProduct.name]?.unitCost || 0)
                          ) === 'B' ? 'green' : 'gray'
                        }
                      >
                        Class {
                          classifyABC(
                            selectedProduct.quantity,
                            selectedProduct.quantity * (productMetrics[selectedProduct.name]?.unitCost || 0)
                          )
                        }
                      </Badge>
                    </Box>
                    <Box>
                      <Text as="div" size="2" color="gray">Current Stock</Text>
                      <Text size="3">{selectedProduct.quantity}</Text>
                    </Box>
                    <Box>
                      <Text as="div" size="2" color="gray">Available</Text>
                      <Text size="3">{selectedProduct.quantity - selectedProduct.reserved}</Text>
                    </Box>
                    <Box>
                      <Text as="div" size="2" color="gray">Unit Cost</Text>
                      <Text size="3">
                        ${productMetrics[selectedProduct.name]?.unitCost.toFixed(2) || '0.00'}
                      </Text>
                    </Box>
                    <Box>
                      <Text as="div" size="2" color="gray">Total Value</Text>
                      <Text size="3">
                        ${
                          (selectedProduct.quantity * 
                          (productMetrics[selectedProduct.name]?.unitCost || 0)).toLocaleString()
                        }
                      </Text>
                    </Box>
                    <Box>
                      <Text as="div" size="2" color="gray">Turnover Rate</Text>
                      <Text size="3">
                        {calculateTurnoverRate(selectedProduct.name).toFixed(1)}x
                      </Text>
                    </Box>
                    <Box>
                      <Text as="div" size="2" color="gray">Expiry Status</Text>
                      <Flex align="center" gap="2">
                        <Text size="3">{selectedProduct.expiry}</Text>
                        <Badge color={getExpiryDetails(selectedProduct.expiry || '').color}>
                          {getExpiryDetails(selectedProduct.expiry || '').days}d remaining
                        </Badge>
                      </Flex>
                    </Box>
                  </Grid>

                  <Box mt="3">
                    <Heading size="4">Storage Information</Heading>
                    <Grid columns="2" gap="3" mt="2">
                      <Box>
                        <Text as="div" size="2" color="gray">Temperature</Text>
                        <Text size="3">{selectedProduct.storage}</Text>
                      </Box>
                      <Box>
                        <Text as="div" size="2" color="gray">Location</Text>
                        <Text size="3">{selectedProduct.location}</Text>
                      </Box>
                    </Grid>
                  </Box>

                  <Flex gap="3" mt="4" justify="end">
                    <Dialog.Close>
                      <Button variant="soft" color="gray">
                        Close
                      </Button>
                    </Dialog.Close>
                    <Button color="blue">
                      <CubeIcon className="mr-2" />
                      Blockchain Details
                    </Button>
                  </Flex>
                </Flex>
              )}
            </Dialog.Content>
          </Dialog.Root>
        </Flex>
      </Card>
    </Box>
  );
};

export default FinishedGoodsInventory;
