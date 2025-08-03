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
  Tooltip,
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
  MagnifyingGlassIcon,
  CubeIcon,
  MixerHorizontalIcon,
  InfoCircledIcon,
  CalendarIcon
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
    name: 'Poultry Product 1',
    quantity: 120,
    reserved: 40,
    storage: '4°C',
    expiry: '2025-08-10',
    location: 'Zone 1',
    unitPrice: 12.5,
    category: 'A'
  },
  {
    id: 'FGI002',
    name: 'Poultry Product 2',
    quantity: 100,
    reserved: 30,
    storage: '6°C',
    expiry: '2025-09-15',
    location: 'Zone 2',
    unitPrice: 15.0,
    category: 'B'
  },
  {
    id: 'FGI003',
    name: 'Poultry Product 3',
    quantity: 80,
    reserved: 20,
    storage: '8°C',
    expiry: '2025-07-28',
    location: 'Zone 2',
    unitPrice: 10.0,
    category: 'C'
  }
];

const FinishedGoodsInventory = () => {
  const [data, setData] = useState<InventoryItem[]>(initialData);
  const [searchQuery, setSearchQuery] = useState('');
  const [currency, setCurrency] = useState<'USD' | 'EGP'>('USD');
  const [locationFilter, setLocationFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  // Calculate inventory metrics
  const totalValue = data.reduce((sum, item) => 
    sum + (item.quantity * item.unitPrice * (currency === 'EGP' ? EXCHANGE_RATE : 1)), 0);

  const filteredData = data.filter(item => {
    const matchesSearch = item.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = locationFilter === 'all' || item.location === locationFilter;
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    
    return matchesSearch && matchesLocation && matchesCategory;
  });

  // Enhanced data processing for professional charts
  const inventoryValueData = filteredData.map(item => ({
    name: item.name,
    value: item.quantity * item.unitPrice * (currency === 'EGP' ? EXCHANGE_RATE : 1),
    category: item.category,
    fill: CATEGORY_COLORS[item.category]
  }));

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
          </Flex>

          {/* Inventory Table */}
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Product ID</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Product Name</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Category</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Quantity</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Reserved</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Available</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Value</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Storage</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Location</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Expiry Date</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredData.map((item) => {
                const expiryStatus = getExpiryStatus(item.expiry);
                
                return (
                  <Table.Row 
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    style={{ cursor: 'pointer' }}
                  >
                    <Table.Cell>{item.id}</Table.Cell>
                    <Table.Cell>{item.name}</Table.Cell>
                    <Table.Cell>
                      <Badge color={item.category === 'A' ? 'blue' : 
                                   item.category === 'B' ? 'green' : 'gray'}>
                        {item.category}
                      </Badge>
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
                        style={{ width: '80px' }}
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
                        style={{ width: '80px' }}
                      />
                    </Table.Cell>
                    <Table.Cell>{item.quantity - item.reserved}</Table.Cell>
                    <Table.Cell>{formatCurrency(item.quantity * item.unitPrice)}</Table.Cell>
                    <Table.Cell>{item.storage}</Table.Cell>
                    <Table.Cell>{item.location}</Table.Cell>
                    <Table.Cell>
                      <Flex align="center" gap="2">
                        <Text>{item.expiry}</Text>
                        <Badge color={expiryStatus.color as any}>
                          {expiryStatus.status}
                        </Badge>
                      </Flex>
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
                    {selectedItem.category}
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
                    <Text size="3">{selectedItem.expiry}</Text>
                    <Badge color={getExpiryStatus(selectedItem.expiry).color as any}>
                      {getExpiryStatus(selectedItem.expiry).status}
                    </Badge>
                  </Flex>
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

export default FinishedGoodsInventory;
