import React, { useState } from 'react';
import {
  Card,
  Flex,
  Heading,
  Table,
  Button,
  TextField,
  Box,
  Text,
  Badge,
  Dialog,
  Select,
  Switch
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
  Legend,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';
import { 
  CubeIcon,
  MixerHorizontalIcon
} from '@radix-ui/react-icons';

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  reserved: number;
  storage: string;
  expiry: string;
  location: string;
  unitPrice: number;
  category: 'A' | 'B' | 'C';
  lastRestock: string;
  cogs: number; // Cost of Goods Sold
}

const EXCHANGE_RATE = 50; // 1 USD = 50 EGP
const CATEGORY_COLORS = {
  A: '#3b82f6', // Blue
  B: '#10b981', // Green
  C: '#6b7280'  // Gray
};

const initialData: InventoryItem[] = [
  {
    id: 'FGI001',
    name: 'Poultry Product A',
    quantity: 120,
    reserved: 40,
    storage: '4°C',
    expiry: '2025-08-10',
    location: 'Zone 1',
    unitPrice: 225,
    category: 'A',
    lastRestock: '2023-05-15',
    cogs: 5000
  },
  {
    id: 'FGI002',
    name: 'Poultry Product B',
    quantity: 100,
    reserved: 30,
    storage: '6°C',
    expiry: '2025-09-15',
    location: 'Zone 2',
    unitPrice: 215,
    category: 'B',
    lastRestock: '2023-06-20',
    cogs: 4500
  },
  {
    id: 'FGI003',
    name: 'Poultry Product C',
    quantity: 80,
    reserved: 20,
    storage: '8°C',
    expiry: '2025-07-28',
    location: 'Zone 2',
    unitPrice: 230,
    category: 'C',
    lastRestock: '2023-07-10',
    cogs: 3000
  }
];

const InventoryDashboard = () => {
  const [data, setData] = useState<InventoryItem[]>(initialData);
  const [currency, setCurrency] = useState<'USD' | 'EGP'>('USD');
  const [locationFilter, setLocationFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  // Calculate inventory metrics
  const totalValue = data.reduce((sum, item) => 
    sum + (item.quantity * item.unitPrice * (currency === 'EGP' ? EXCHANGE_RATE : 1)), 0);

  // Calculate inventory turnover rate for each item
  const calculateTurnoverRate = (item: InventoryItem) => {
    const avgInventoryValue = (item.quantity * item.unitPrice) / 2;
    return avgInventoryValue > 0 ? item.cogs / avgInventoryValue : 0;
  };

  const filteredData = data.filter(item => {
    const matchesLocation = locationFilter === 'all' || item.location === locationFilter;
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    
    return matchesLocation && matchesCategory;
  });

  // Enhanced data processing for professional charts
  const inventoryValueData = filteredData.map(item => ({
    name: item.name,
    value: item.quantity * item.unitPrice * (currency === 'EGP' ? EXCHANGE_RATE : 1),
    category: item.category,
    fill: CATEGORY_COLORS[item.category]
  }));

  // Prepare turnover data for the trend chart
  const turnoverData = filteredData.map(item => ({
    name: item.name,
    turnoverRate: calculateTurnoverRate(item),
    category: item.category,
    fill: CATEGORY_COLORS[item.category]
  }));

  const expiryStatusData = [
    { name: 'Expired', value: data.filter(i => new Date(i.expiry) < new Date()).length },
    { name: 'This Week', value: data.filter(i => {
      const diff = Math.ceil((new Date(i.expiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return diff > 0 && diff <= 7;
    }).length },
    { name: 'Next 30 Days', value: data.filter(i => {
      const diff = Math.ceil((new Date(i.expiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return diff > 7 && diff <= 30;
    }).length },
    { name: 'Safe', value: data.filter(i => {
      const diff = Math.ceil((new Date(i.expiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return diff > 30;
    }).length }
  ];

  // Helper functions
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'ar-EG', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(currency === 'EGP' ? value * EXCHANGE_RATE : value);
  };

  const getExpiryStatus = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { status: 'Expired', color: 'red' };
    if (diffDays < 7) return { status: 'Urgent', color: 'red' };
    if (diffDays < 30) return { status: 'Warning', color: 'amber' };
    return { status: 'Good', color: 'green' };
  };

  return (
    <Box p="4">
      <Card>
        <Flex direction="column" gap="4">
          {/* Header Section */}
          <Flex justify="between" align="center">
            <Heading size="6">Finished Good Inventory Overview</Heading>
            <Flex gap="3" align="center">
              <Select.Root value={locationFilter} onValueChange={setLocationFilter}>
                <Select.Trigger>
                  <MixerHorizontalIcon />
                  Location
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="all">All Locations</Select.Item>
                  <Select.Item value="Zone 1">Zone 1</Select.Item>
                  <Select.Item value="Zone 2">Zone 2</Select.Item>
                </Select.Content>
              </Select.Root>

              <Select.Root value={categoryFilter} onValueChange={setCategoryFilter}>
                <Select.Trigger>
                  <MixerHorizontalIcon />
                  Category
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="all">All Categories</Select.Item>
                  <Select.Item value="A">Category A</Select.Item>
                  <Select.Item value="B">Category B</Select.Item>
                  <Select.Item value="C">Category C</Select.Item>
                </Select.Content>
              </Select.Root>

              <Flex align="center" gap="2">
                <Text>USD</Text>
                <Switch 
                  checked={currency === 'EGP'}
                  onCheckedChange={(checked) => setCurrency(checked ? 'EGP' : 'USD')}
                />
                <Text>EGP (1:50)</Text>
              </Flex>

              <Button
                variant="solid"
                color="blue"
                onClick={() => alert('Data submitted to blockchain ledger')}
              >
                <CubeIcon className="mr-2" />
                Commit to Ledger
              </Button>
            </Flex>
          </Flex>

          {/* Professional Dashboard Charts */}
          <Flex direction="column" gap="4">
            <Flex gap="4">
              <Card style={{ flex: 1 }}>
                <Heading size="4" mb="2">Inventory Value by Category ({currency})</Heading>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={inventoryValueData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {inventoryValueData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Legend />
                    <ChartTooltip 
                      formatter={(value: number) => [formatCurrency(value), 'Value']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Card>

              <Card style={{ flex: 1 }}>
                <Heading size="4" mb="2">Inventory Turnover Rate</Heading>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={turnoverData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip 
                      formatter={(value: number) => [value.toFixed(2), 'Turnover Rate']}
                    />
                    <Bar 
                      dataKey="turnoverRate" 
                      fill="#8884d8"
                      radius={[4, 4, 0, 0]}
                    >
                      {turnoverData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Flex>

            <Flex gap="4">
              <Card style={{ flex: 1 }}>
                <Heading size="4" mb="2">Expiry Status Overview</Heading>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={expiryStatusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip />
                    <Bar 
                      dataKey="value" 
                      fill="#8884d8"
                      radius={[4, 4, 0, 0]}
                    >
                      {expiryStatusData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={
                            entry.name === 'Expired' ? '#ef4444' :
                            entry.name === 'This Week' ? '#f59e0b' :
                            entry.name === 'Next 30 Days' ? '#fbbf24' : '#10b981'
                          } 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Flex>
          </Flex>

          {/* Inventory Table */}
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Product (Category)</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Qty</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Reserved</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Available</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Value</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Turnover Rate</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Storage</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Location</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Expiry</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Last Restock</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredData.map((item) => {
                const expiryStatus = getExpiryStatus(item.expiry);
                const itemValue = item.quantity * item.unitPrice;
                const turnoverRate = calculateTurnoverRate(item);
                
                return (
                  <Table.Row 
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    style={{ cursor: 'pointer' }}
                  >
                    <Table.Cell>{item.id}</Table.Cell>
                    <Table.Cell>
                      <Flex direction="column">
                        <Text weight="bold">{item.name}</Text>
                        <Badge color={item.category === 'A' ? 'blue' : item.category === 'B' ? 'green' : 'gray'}>
                          Category {item.category}
                        </Badge>
                      </Flex>
                    </Table.Cell>
                    <Table.Cell>
                      <TextField.Root
                        value={item.quantity}
                        type="number"
                        onChange={(e) => {
                          const newValue = parseInt(e.target.value);
                          if (!isNaN(newValue)) {
                            setData(prev => prev.map(i => 
                              i.id === item.id ? { ...i, quantity: Math.max(0, newValue) } : i
                            ));
                          }
                        }}
                        style={{ width: '70px' }}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <TextField.Root
                        value={item.reserved}
                        type="number"
                        onChange={(e) => {
                          const newValue = parseInt(e.target.value);
                          if (!isNaN(newValue)) {
                            setData(prev => prev.map(i => 
                              i.id === item.id ? { 
                                ...i, 
                                reserved: Math.min(i.quantity, Math.max(0, newValue))
                              } : i
                            ));
                          }
                        }}
                        style={{ width: '70px' }}
                      />
                    </Table.Cell>
                    <Table.Cell>{item.quantity - item.reserved}</Table.Cell>
                    <Table.Cell>{formatCurrency(itemValue)}</Table.Cell>
                    <Table.Cell>{turnoverRate.toFixed(2)}</Table.Cell>
                    <Table.Cell>{item.storage}</Table.Cell>
                    <Table.Cell>{item.location}</Table.Cell>
                    <Table.Cell>
                      <Flex align="center" gap="2">
                        <Text>{new Date(item.expiry).toLocaleDateString()}</Text>
                        <Badge color={expiryStatus.color as any}>
                          {expiryStatus.status}
                        </Badge>
                      </Flex>
                    </Table.Cell>
                    <Table.Cell>
                      {new Date(item.lastRestock).toLocaleDateString()}
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table.Root>
        </Flex>
      </Card>

      {/* Item Detail Modal */}
      <Dialog.Root open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        {selectedItem && (
          <Dialog.Content style={{ maxWidth: '600px' }}>
            <Dialog.Title>{selectedItem.name}</Dialog.Title>
            <Flex direction="column" gap="4" mt="4">
              <Flex gap="4" wrap="wrap">
                <Box style={{ flex: '1 1 200px' }}>
                  <Text as="div" size="2" color="gray">Product ID</Text>
                  <Text size="3">{selectedItem.id}</Text>
                </Box>
                <Box style={{ flex: '1 1 200px' }}>
                  <Text as="div" size="2" color="gray">Category</Text>
                  <Badge color={selectedItem.category === 'A' ? 'blue' : 
                               selectedItem.category === 'B' ? 'green' : 'gray'}>
                    Category {selectedItem.category}
                  </Badge>
                </Box>
              </Flex>

              <Flex gap="4" wrap="wrap">
                <Box style={{ flex: '1 1 200px' }}>
                  <Text as="div" size="2" color="gray">Current Stock</Text>
                  <Text size="3">{selectedItem.quantity} units</Text>
                </Box>
                <Box style={{ flex: '1 1 200px' }}>
                  <Text as="div" size="2" color="gray">Available</Text>
                  <Text size="3">{selectedItem.quantity - selectedItem.reserved} units</Text>
                </Box>
              </Flex>

              <Flex gap="4" wrap="wrap">
                <Box style={{ flex: '1 1 200px' }}>
                  <Text as="div" size="2" color="gray">Unit Price</Text>
                  <Text size="3">{formatCurrency(selectedItem.unitPrice)}</Text>
                </Box>
                <Box style={{ flex: '1 1 200px' }}>
                  <Text as="div" size="2" color="gray">Total Value</Text>
                  <Text size="3">{formatCurrency(selectedItem.quantity * selectedItem.unitPrice)}</Text>
                </Box>
              </Flex>

              <Flex gap="4" wrap="wrap">
                <Box style={{ flex: '1 1 200px' }}>
                  <Text as="div" size="2" color="gray">Turnover Rate</Text>
                  <Text size="3">{calculateTurnoverRate(selectedItem).toFixed(2)}</Text>
                </Box>
                <Box style={{ flex: '1 1 200px' }}>
                  <Text as="div" size="2" color="gray">Cost of Goods Sold</Text>
                  <Text size="3">{formatCurrency(selectedItem.cogs)}</Text>
                </Box>
              </Flex>

              <Flex gap="4" wrap="wrap">
                <Box style={{ flex: '1 1 200px' }}>
                  <Text as="div" size="2" color="gray">Storage</Text>
                  <Text size="3">{selectedItem.storage}</Text>
                </Box>
                <Box style={{ flex: '1 1 200px' }}>
                  <Text as="div" size="2" color="gray">Location</Text>
                  <Text size="3">{selectedItem.location}</Text>
                </Box>
              </Flex>

              <Flex gap="4" wrap="wrap">
                <Box style={{ flex: '1 1 200px' }}>
                  <Text as="div" size="2" color="gray">Expiry Date</Text>
                  <Flex align="center" gap="2">
                    <Text size="3">{new Date(selectedItem.expiry).toLocaleDateString()}</Text>
                    <Badge color={getExpiryStatus(selectedItem.expiry).color as any}>
                      {getExpiryStatus(selectedItem.expiry).status}
                    </Badge>
                  </Flex>
                </Box>
                <Box style={{ flex: '1 1 200px' }}>
                  <Text as="div" size="2" color="gray">Last Restock</Text>
                  <Text size="3">{new Date(selectedItem.lastRestock).toLocaleDateString()}</Text>
                </Box>
              </Flex>

              <Flex justify="end" gap="3" mt="4">
                <Dialog.Close>
                  <Button variant="soft" color="gray">
                    Close
                  </Button>
                </Dialog.Close>
                <Button>
                  <CubeIcon className="mr-2" />
                  View Blockchain Record
                </Button>
              </Flex>
            </Flex>
          </Dialog.Content>
        )}
      </Dialog.Root>
    </Box>
  );
};

export default InventoryDashboard;
