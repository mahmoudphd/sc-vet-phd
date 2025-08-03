import React, { useState, useEffect } from 'react';
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
  Select,
  Switch,
  Dialog
} from '@radix-ui/themes';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { 
  MagnifyingGlassIcon,
  CubeIcon,
  MixerHorizontalIcon,
  InfoCircledIcon
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
  category: string;
}

const EXCHANGE_RATE = 50; // 1 USD = 50 EGP

const initialData: InventoryItem[] = [
  {
    id: 'FGI001',
    name: 'Poultry Product A',
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
    name: 'Poultry Product B',
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
    name: 'Poultry Product C',
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

  const handleQuantityChange = (id: string, value: number) => {
    setData(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(0, value) } : item
    ));
  };

  const handleReservedChange = (id: string, value: number) => {
    setData(prev => prev.map(item => 
      item.id === id ? { 
        ...item, 
        reserved: Math.min(item.quantity, Math.max(0, value)) 
      } : item
    ));
  };

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
    if (diffDays < 7) return { status: 'Critical', color: 'red' };
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
                <Text>EGP (1 USD = 50 EGP)</Text>
              </Flex>

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

          {/* Summary Cards */}
          <Flex gap="4">
            <Card style={{ flex: 1 }}>
              <Flex direction="column" gap="1">
                <Text size="2" color="gray">Total Inventory Value</Text>
                <Text size="5" weight="bold">{formatCurrency(totalValue)}</Text>
              </Flex>
            </Card>
            <Card style={{ flex: 1 }}>
              <Flex direction="column" gap="1">
                <Text size="2" color="gray">Total Items</Text>
                <Text size="5" weight="bold">{data.length}</Text>
              </Flex>
            </Card>
            <Card style={{ flex: 1 }}>
              <Flex direction="column" gap="1">
                <Text size="2" color="gray">Expiring Soon</Text>
                <Text size="5" weight="bold">
                  {data.filter(item => getExpiryStatus(item.expiry).status === 'Critical').length}
                </Text>
              </Flex>
            </Card>
          </Flex>

          {/* Inventory Table */}
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Product Name</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Category</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Quantity</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Reserved</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Available</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Value</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Storage</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Location</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Expiry Status</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredData.map((item) => {
                const expiryStatus = getExpiryStatus(item.expiry);
                const itemValue = item.quantity * item.unitPrice;
                
                return (
                  <Table.Row 
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    style={{ cursor: 'pointer' }}
                  >
                    <Table.Cell>{item.id}</Table.Cell>
                    <Table.Cell>{item.name}</Table.Cell>
                    <Table.Cell>
                      <Badge color={
                        item.category === 'A' ? 'blue' :
                        item.category === 'B' ? 'green' : 'gray'
                      }>
                        {item.category}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <TextField.Root
                        value={item.quantity}
                        type="number"
                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                        style={{ width: '80px' }}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <TextField.Root
                        value={item.reserved}
                        type="number"
                        onChange={(e) => handleReservedChange(item.id, parseInt(e.target.value))}
                        style={{ width: '80px' }}
                      />
                    </Table.Cell>
                    <Table.Cell>{item.quantity - item.reserved}</Table.Cell>
                    <Table.Cell>{formatCurrency(itemValue)}</Table.Cell>
                    <Table.Cell>{item.storage}</Table.Cell>
                    <Table.Cell>{item.location}</Table.Cell>
                    <Table.Cell>
                      <Badge color={expiryStatus.color}>
                        {expiryStatus.status} ({new Date(item.expiry).toLocaleDateString()})
                      </Badge>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table.Root>

          {/* Inventory Charts */}
          <Flex gap="4" mt="4">
            <Card style={{ flex: 1 }}>
              <Heading size="4" mb="2">Inventory Value by Product ({currency})</Heading>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={filteredData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip 
                    formatter={(value) => [formatCurrency(Number(value)), 'Value']}
                  />
                  <Bar 
                    dataKey={(item) => item.quantity * item.unitPrice * (currency === 'EGP' ? EXCHANGE_RATE : 1)}
                    name="Value"
                  >
                    {filteredData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={
                          entry.category === 'A' ? '#3b82f6' :
                          entry.category === 'B' ? '#10b981' : '#6b7280'
                        } 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Flex>
        </Flex>
      </Card>

      {/* Item Detail Dialog */}
      <Dialog.Root open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        {selectedItem && (
          <Dialog.Content style={{ maxWidth: '600px' }}>
            <Dialog.Title>{selectedItem.name}</Dialog.Title>
            <Flex direction="column" gap="3" mt="4">
              <Grid columns="2" gap="3">
                <Box>
                  <Text as="div" size="2" color="gray">Product ID</Text>
                  <Text size="3">{selectedItem.id}</Text>
                </Box>
                <Box>
                  <Text as="div" size="2" color="gray">Category</Text>
                  <Badge color={
                    selectedItem.category === 'A' ? 'blue' :
                    selectedItem.category === 'B' ? 'green' : 'gray'
                  }>
                    {selectedItem.category}
                  </Badge>
                </Box>
                <Box>
                  <Text as="div" size="2" color="gray">Unit Price</Text>
                  <Text size="3">{formatCurrency(selectedItem.unitPrice)}</Text>
                </Box>
                <Box>
                  <Text as="div" size="2" color="gray">Total Value</Text>
                  <Text size="3">
                    {formatCurrency(selectedItem.quantity * selectedItem.unitPrice)}
                  </Text>
                </Box>
                <Box>
                  <Text as="div" size="2" color="gray">Storage</Text>
                  <Text size="3">{selectedItem.storage}</Text>
                </Box>
                <Box>
                  <Text as="div" size="2" color="gray">Location</Text>
                  <Text size="3">{selectedItem.location}</Text>
                </Box>
                <Box>
                  <Text as="div" size="2" color="gray">Expiry Date</Text>
                  <Text size="3">
                    {new Date(selectedItem.expiry).toLocaleDateString()}
                    <Badge color={getExpiryStatus(selectedItem.expiry).color} ml="2">
                      {getExpiryStatus(selectedItem.expiry).status}
                    </Badge>
                  </Text>
                </Box>
              </Grid>

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
