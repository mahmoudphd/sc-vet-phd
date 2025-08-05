import React, { useState, useMemo } from 'react';
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
  Grid
} from '@radix-ui/themes';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid
} from 'recharts';
import { 
  MixerHorizontalIcon,
  DownloadIcon,
  CubeIcon,
  ClockIcon
} from '@radix-ui/react-icons';

interface RawMaterial {
  id: string;
  name: string;
  quantity: number;
  reserved: number;
  storage: string;
  expiry: string;
  location: string;
  category: 'A' | 'B' | 'C';
  lastRestock: string;
  supplier: string;
  minStockLevel: number;
}

const CATEGORY_COLORS = {
  A: '#3b82f6',
  B: '#10b981',
  C: '#6b7280'
};

const initialData: RawMaterial[] = [
  {
    id: 'RM001',
    name: 'Vitamin B1',
    quantity: 120,
    reserved: 40,
    storage: '4°C',
    expiry: '2025-08-10',
    location: 'Zone 1',
    category: 'A',
    lastRestock: '2023-05-15',
    supplier: 'Supplier X',
    minStockLevel: 50
  },
  {
    id: 'RM002',
    name: 'Vitamin B2',
    quantity: 100,
    reserved: 30,
    storage: '6°C',
    expiry: '2025-09-15',
    location: 'Zone 2',
    category: 'B',
    lastRestock: '2023-06-20',
    supplier: 'Supplier Y',
    minStockLevel: 40
  },
  {
    id: 'RM003',
    name: 'Nicotinamide B3',
    quantity: 80,
    reserved: 20,
    storage: '8°C',
    expiry: '2025-07-28',
    location: 'Zone 2',
    category: 'C',
    lastRestock: '2023-07-10',
    supplier: 'Supplier Z',
    minStockLevel: 30
  }
];

const StatusCircle = ({ color }: { color: 'red' | 'green' | 'orange' }) => (
  <div style={{
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    backgroundColor: color,
    display: 'inline-block',
    marginRight: '8px'
  }} />
);

const RawMaterialsInventory = () => {
  const [data, setData] = useState<RawMaterial[]>(initialData);
  const [locationFilter, setLocationFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState<RawMaterial | null>(null);
  const [sortConfig, setSortConfig] = useState<{key: keyof Omit<RawMaterial, 'category'>, direction: 'asc' | 'desc'} | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const getExpiryStatus = (expiryDate: string): { status: string; color: 'red' | 'green' | 'orange' } => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { status: 'Expired', color: 'red' };
    if (diffDays < 7) return { status: 'Urgent', color: 'red' };
    if (diffDays < 30) return { status: 'Warning', color: 'orange' };
    return { status: 'Good', color: 'green' };
  };

  const itemsNearExpiry = useMemo(() => 
    data.filter(item => {
      const expiry = new Date(item.expiry);
      const today = new Date();
      const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays < 30;
    }).length, 
    [data]
  );

  const lowStockItems = useMemo(() => 
    data.filter(item => item.quantity < item.minStockLevel).length,
    [data]
  );

  const filteredData = useMemo(() => {
    let result = [...data];
    if (locationFilter !== 'all') {
      result = result.filter(item => item.location === locationFilter);
    }
    if (categoryFilter !== 'all') {
      result = result.filter(item => item.category === categoryFilter);
    }
    if (sortConfig !== null) {
      result.sort((a, b) => {
        if (sortConfig.key === 'expiry') {
          const dateA = new Date(a.expiry).getTime();
          const dateB = new Date(b.expiry).getTime();
          return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
        }
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [data, locationFilter, categoryFilter, sortConfig]);

  const requestSort = (key: keyof Omit<RawMaterial, 'category'>) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const updateItemField = (id: string, field: keyof RawMaterial, value: any) => {
    setData(prev => prev.map(item => {
      if (item.id === id) {
        if (field === 'quantity' && value > item.quantity) {
          return {
            ...item,
            [field]: value,
            lastRestock: new Date().toISOString().split('T')[0]
          };
        }
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const stockLevelData = filteredData.map(item => ({
    name: item.name,
    quantity: item.quantity,
    minLevel: item.minStockLevel,
    category: item.category,
    fill: CATEGORY_COLORS[item.category]
  }));

  return (
    <Box p="4">
      <Card>
        <Flex direction="column" gap="4">
          <Flex justify="between" align="center">
            <Heading size="6">Raw Materials Inventory</Heading>
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

              <Button variant="soft" onClick={() => alert('Export functionality would go here')}>
                <DownloadIcon />
              </Button>
            </Flex>
          </Flex>

          <Grid columns="2" gap="4">
            <Card style={{ 
              borderRadius: '12px', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              background: 'linear-gradient(135deg, #fefce8 0%, #fef9c3 100%)'
            }}>
              <Flex align="center" gap="4" p="4">
                <Box style={{
                  background: '#f59e0b20',
                  borderRadius: '12px',
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ClockIcon width="24" height="24" color="#d97706" />
                </Box>
                <Box>
                  <Text as="div" size="2" color="gray" mb="1">Near Expiry</Text>
                  <Heading size="5" mb="1" style={{ color: '#92400e' }}>
                    {itemsNearExpiry}
                  </Heading>
                  <Text size="1" color="gray">Materials expiring soon</Text>
                </Box>
              </Flex>
            </Card>

            <Card style={{ 
              borderRadius: '12px', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)'
            }}>
              <Flex align="center" gap="4" p="4">
                <Box style={{
                  background: '#ef444420',
                  borderRadius: '12px',
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <CubeIcon width="24" height="24" color="#dc2626" />
                </Box>
                <Box>
                  <Text as="div" size="2" color="gray" mb="1">Low Stock</Text>
                  <Heading size="5" mb="1" style={{ color: '#991b1b' }}>
                    {lowStockItems}
                  </Heading>
                  <Text size="1" color="gray">Below minimum level</Text>
                </Box>
              </Flex>
            </Card>
          </Grid>

          <Table.Root variant="surface">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell onClick={() => requestSort('id')}>
                  Material ID {sortConfig?.key === 'id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell onClick={() => requestSort('name')}>
                  Material Name {sortConfig?.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell onClick={() => requestSort('quantity')}>
                  Quantity (kg) {sortConfig?.key === 'quantity' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell onClick={() => requestSort('reserved')}>
                  Reserved (kg) {sortConfig?.key === 'reserved' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>
                  Available (kg)
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell onClick={() => requestSort('expiry')}>
                  Expiry Date {sortConfig?.key === 'expiry' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>
                  Status
                </Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {filteredData.map((item) => {
                const expiryStatus = getExpiryStatus(item.expiry);
                const isLowStock = item.quantity < item.minStockLevel;
                const rowColor = expiryStatus.color === 'red' ? 'var(--red-2)' : 
                                expiryStatus.color === 'orange' ? 'var(--orange-2)' : 
                                isLowStock ? 'var(--amber-2)' : 'white';
                const hoverColor = expiryStatus.color === 'red' ? 'var(--red-3)' :
                                  expiryStatus.color === 'orange' ? 'var(--orange-3)' : 
                                  isLowStock ? 'var(--amber-3)' : 'var(--gray-2)';
                
                return (
                  <Table.Row 
                    key={item.id}
                    style={{ 
                      backgroundColor: hoveredRow === item.id ? hoverColor : rowColor,
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={() => setHoveredRow(item.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <Table.Cell>{item.id}</Table.Cell>
                    <Table.Cell>
                      <Flex direction="column">
                        <Text 
                          weight="bold"
                          style={{ 
                            cursor: 'pointer',
                            color: '#3b82f6',
                            textDecoration: 'underline'
                          }}
                          onClick={() => setSelectedItem(item)}
                        >
                          {item.name}
                        </Text>
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
                            updateItemField(item.id, 'quantity', Math.max(0, newValue));
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
                            updateItemField(item.id, 'reserved', Math.min(item.quantity, Math.max(0, newValue)));
                          }
                        }}
                        style={{ width: '70px' }}
                      />
                    </Table.Cell>
                    <Table.Cell>{formatNumber(item.quantity - item.reserved)}</Table.Cell>
                    <Table.Cell>
                      {new Date(item.expiry).toLocaleDateString('en-US')}
                    </Table.Cell>
                    <Table.Cell>
                      <Flex align="center" gap="2">
                        <StatusCircle color={isLowStock ? 'red' : expiryStatus.color} />
                        <Text>{isLowStock ? 'Low Stock' : expiryStatus.status}</Text>
                      </Flex>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table.Root>

          <Card>
            <Heading size="4" mb="2">Stock Level Monitoring</Heading>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stockLevelData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip 
                  formatter={(value: number, name: string) => 
                    [`${value} kg`, name === 'quantity' ? 'Current Stock' : 'Minimum Level']
                  }
                />
                <Bar 
                  dataKey="quantity" 
                  name="Current Stock"
                  radius={[4, 4, 0, 0]}
                >
                  {stockLevelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
                <Bar 
                  dataKey="minLevel" 
                  name="Minimum Level"
                  radius={[4, 4, 0, 0]}
                  fill="#ef4444"
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Flex justify="end">
            <Button
              style={{ backgroundColor: '#22c55e', color: 'white', fontWeight: 700 }}
              size="3"
              onClick={() => alert('Inventory data submitted!')}
            >
              Update Inventory
            </Button>
          </Flex>
        </Flex>
      </Card>

      <Dialog.Root open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        {selectedItem && (
          <Dialog.Content style={{ maxWidth: '700px' }}>
            <Dialog.Title>
              <Flex align="center" gap="2">
                {selectedItem.name}
                <Badge color={selectedItem.category === 'A' ? 'blue' : 
                             selectedItem.category === 'B' ? 'green' : 'gray'}>
                  Category {selectedItem.category}
                </Badge>
              </Flex>
            </Dialog.Title>
            
            <Flex gap="4" mt="4">
              <Box style={{ flex: 1 }}>
                <Card>
                  <Heading size="4" mb="3">Inventory Details</Heading>
                  <Flex direction="column" gap="3">
                    <Flex justify="between">
                      <Text color="gray">Current Stock:</Text>
                      <Text weight="bold">{formatNumber(selectedItem.quantity)} kg</Text>
                    </Flex>
                    <Flex justify="between">
                      <Text color="gray">Available:</Text>
                      <Text weight="bold">{formatNumber(selectedItem.quantity - selectedItem.reserved)} kg</Text>
                    </Flex>
                    <Flex justify="between">
                      <Text color="gray">Minimum Level:</Text>
                      <Text weight="bold">{formatNumber(selectedItem.minStockLevel)} kg</Text>
                    </Flex>
                    <Flex justify="between">
                      <Text color="gray">Supplier:</Text>
                      <Text weight="bold">{selectedItem.supplier}</Text>
                    </Flex>
                  </Flex>
                </Card>
              </Box>

              <Box style={{ flex: 1 }}>
                <Card>
                  <Heading size="4" mb="3">Storage Information</Heading>
                  <Flex direction="column" gap="3">
                    <Flex justify="between">
                      <Text color="gray">Storage:</Text>
                      <Text weight="bold">{selectedItem.storage}</Text>
                    </Flex>
                    <Flex justify="between">
                      <Text color="gray">Location:</Text>
                      <Text weight="bold">{selectedItem.location}</Text>
                    </Flex>
                    <Flex justify="between">
                      <Text color="gray">Expiry Date:</Text>
                      <Flex align="center" gap="2">
                        <StatusCircle color={getExpiryStatus(selectedItem.expiry).color} />
                        <Text>{new Date(selectedItem.expiry).toLocaleDateString('en-US')}</Text>
                      </Flex>
                    </Flex>
                    <Flex justify="between">
                      <Text color="gray">Last Restock:</Text>
                      <Text>{new Date(selectedItem.lastRestock).toLocaleDateString('en-US')}</Text>
                    </Flex>
                  </Flex>
                </Card>
              </Box>
            </Flex>

            <Flex justify="end" gap="3" mt="4">
              <Dialog.Close>
                <Button variant="soft" color="gray">
                  Close
                </Button>
              </Dialog.Close>
              <Button>
                Request Reorder
              </Button>
            </Flex>
          </Dialog.Content>
        )}
      </Dialog.Root>
    </Box>
  );
};

export default RawMaterialsInventory;
