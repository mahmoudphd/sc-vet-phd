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
  Switch,
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
  PieChart,
  Pie,
  Legend,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';
import { 
  CubeIcon,
  MixerHorizontalIcon,
  DownloadIcon,
  CommitIcon,
  SymbolIcon,
  ClockIcon,
  UpdateIcon
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
  unitCost: number;
  category: 'A' | 'B' | 'C';
  lastRestock: string;
  cogs: number;
  movement?: { month: string; quantity: number }[];
}

const EXCHANGE_RATE = 50;
const CATEGORY_COLORS = {
  A: '#3b82f6',
  B: '#10b981',
  C: '#6b7280'
};

const initialData: InventoryItem[] = [
  {
    id: 'DRG001',
    name: 'Poultry Drug A',
    quantity: 120,
    reserved: 40,
    storage: '4°C',
    expiry: '2025-08-10',
    location: 'Zone 1',
    unitPrice: 225,
    unitCost: 171,
    category: 'A',
    lastRestock: '2023-05-15',
    cogs: 20520,
    movement: [
      { month: 'Jan', quantity: 100 },
      { month: 'Feb', quantity: 110 },
      { month: 'Mar', quantity: 95 },
      { month: 'Apr', quantity: 120 },
      { month: 'May', quantity: 115 },
      { month: 'Jun', quantity: 120 }
    ]
  },
  {
    id: 'DRG002',
    name: 'Poultry Drug B',
    quantity: 100,
    reserved: 30,
    storage: '6°C',
    expiry: '2025-09-15',
    location: 'Zone 2',
    unitPrice: 215,
    unitCost: 160,
    category: 'B',
    lastRestock: '2023-06-20',
    cogs: 19200,
    movement: [
      { month: 'Jan', quantity: 80 },
      { month: 'Feb', quantity: 90 },
      { month: 'Mar', quantity: 85 },
      { month: 'Apr', quantity: 95 },
      { month: 'May', quantity: 100 },
      { month: 'Jun', quantity: 100 }
    ]
  },
  {
    id: 'DRG003',
    name: 'Poultry Drug C',
    quantity: 80,
    reserved: 20,
    storage: '8°C',
    expiry: '2025-07-28',
    location: 'Zone 2',
    unitPrice: 230,
    unitCost: 171,
    category: 'C',
    lastRestock: '2023-07-10',
    cogs: 20520,
    movement: [
      { month: 'Jan', quantity: 70 },
      { month: 'Feb', quantity: 75 },
      { month: 'Mar', quantity: 80 },
      { month: 'Apr', quantity: 85 },
      { month: 'May', quantity: 80 },
      { month: 'Jun', quantity: 80 }
    ]
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

const InventoryDashboard = () => {
  const [data, setData] = useState<InventoryItem[]>(initialData);
  const [currency, setCurrency] = useState<'USD' | 'EGP'>('EGP');
  const [locationFilter, setLocationFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [sortConfig, setSortConfig] = useState<{key: keyof InventoryItem, direction: 'asc' | 'desc'} | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const calculateTurnoverRate = (item: InventoryItem) => {
    const avgInventoryValue = (item.quantity * item.unitCost) / 2;
    return avgInventoryValue > 0 ? item.cogs / avgInventoryValue : 0;
  };

  const getExpiryStatus = (expiryDate: string): { status: string; color: 'red' | 'green' | 'orange' } => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { status: 'Expired', color: 'red' };
    if (diffDays < 7) return { status: 'Urgent', color: 'red' };
    if (diffDays < 30) return { status: 'Warning', color: 'orange' };
    return { status: 'Good', color: 'green' };
  };

  const totalInventoryValue = useMemo(() => 
    data.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 
    [data, currency]
  );

  const itemsNearExpiry = useMemo(() => 
    data.filter(item => {
      const expiry = new Date(item.expiry);
      const today = new Date();
      const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays < 30;
    }).length, 
    [data]
  );

  const avgTurnoverRate = useMemo(() => {
    const total = data.reduce((sum, item) => sum + calculateTurnoverRate(item), 0);
    return data.length > 0 ? total / data.length : 0;
  }, [data]);

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

  const requestSort = (key: keyof InventoryItem) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const updateItemField = (id: string, field: keyof InventoryItem, value: any) => {
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(currency === 'EGP' ? value : value / EXCHANGE_RATE);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const inventoryValueData = filteredData.map(item => ({
    name: item.name,
    value: item.quantity * item.unitPrice * (currency === 'EGP' ? 1 : 1/EXCHANGE_RATE),
    category: item.category,
    fill: CATEGORY_COLORS[item.category]
  }));

  const turnoverData = filteredData.map(item => ({
    name: item.name,
    turnoverRate: calculateTurnoverRate(item),
    category: item.category,
    fill: CATEGORY_COLORS[item.category]
  }));

  return (
    <Box p="4">
      <Card>
        <Flex direction="column" gap="4">
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
                <Text>EGP</Text>
                <Switch 
                  checked={currency === 'USD'}
                  onCheckedChange={(checked) => setCurrency(checked ? 'USD' : 'EGP')}
                />
                <Text>USD (1:50)</Text>
              </Flex>

              <Button variant="soft" onClick={() => alert('Export functionality would go here')}>
                <DownloadIcon />
              </Button>
            </Flex>
          </Flex>

          <Grid columns="3" gap="4">
            <Card>
              <Flex direction="column" gap="2">
                <Text color="gray">Total Inventory Value</Text>
                <Heading size="5">{formatCurrency(totalInventoryValue)}</Heading>
                <Flex align="center" gap="1">
                  <Text color="green">↑ 2.5%</Text>
                  <Text color="gray">vs last month</Text>
                </Flex>
              </Flex>
            </Card>
            <Card>
              <Flex direction="column" gap="2">
                <Text color="gray">Items Near Expiry</Text>
                <Heading size="5">{itemsNearExpiry}</Heading>
                <Flex align="center" gap="1">
                  <Text color="red">↑ 1.2%</Text>
                  <Text color="gray">vs last month</Text>
                </Flex>
              </Flex>
            </Card>
            <Card>
              <Flex direction="column" gap="2">
                <Text color="gray">Avg. Turnover Rate</Text>
                <Heading size="5">{avgTurnoverRate.toFixed(2)}</Heading>
                <Flex align="center" gap="1">
                  <Text color="green">↑ 0.3</Text>
                  <Text color="gray">vs last quarter</Text>
                </Flex>
              </Flex>
            </Card>
          </Grid>

          <Table.Root variant="surface">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell onClick={() => requestSort('id')}>
                  ID {sortConfig?.key === 'id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell onClick={() => requestSort('name')}>
                  Product {sortConfig?.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell onClick={() => requestSort('quantity')}>
                  Qty {sortConfig?.key === 'quantity' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell onClick={() => requestSort('reserved')}>
                  Reserved {sortConfig?.key === 'reserved' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>
                  Available
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell onClick={() => requestSort('expiry')}>
                  Expiry {sortConfig?.key === 'expiry' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>
                  Status
                </Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {filteredData.map((item) => {
                const expiryStatus = getExpiryStatus(item.expiry);
                const rowColor = expiryStatus.color === 'red' ? 'var(--red-2)' : 
                                expiryStatus.color === 'orange' ? 'var(--orange-2)' : 'white';
                const hoverColor = expiryStatus.color === 'red' ? 'var(--red-3)' :
                                  expiryStatus.color === 'orange' ? 'var(--orange-3)' : 'var(--gray-2)';
                
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
                        <StatusCircle color={expiryStatus.color} />
                        <Text>{expiryStatus.status}</Text>
                      </Flex>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table.Root>

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
                  <YAxis domain={[0, 5]} />
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
              <Box style={{ flex: '1 1 200px' }}>
                <Card>
                  <Heading size="4" mb="3">Inventory Details</Heading>
                  <Flex direction="column" gap="3">
                    <Flex justify="between">
                      <Text color="gray">Current Stock:</Text>
                      <Text weight="bold">{formatNumber(selectedItem.quantity)} units</Text>
                    </Flex>
                    <Flex justify="between">
                      <Text color="gray">Available:</Text>
                      <Text weight="bold">{formatNumber(selectedItem.quantity - selectedItem.reserved)} units</Text>
                    </Flex>
                    <Flex justify="between">
                      <Text color="gray">Unit Cost:</Text>
                      <Text weight="bold">{formatCurrency(selectedItem.unitCost)}</Text>
                    </Flex>
                    <Flex justify="between">
                      <Text color="gray">Unit Price:</Text>
                      <Text weight="bold">{formatCurrency(selectedItem.unitPrice)}</Text>
                    </Flex>
                    <Flex justify="between">
                      <Text color="gray">Total Value:</Text>
                      <Text weight="bold">{formatCurrency(selectedItem.quantity * selectedItem.unitPrice)}</Text>
                    </Flex>
                    <Flex justify="between">
                      <Text color="gray">Turnover Rate:</Text>
                      <Text weight="bold">{calculateTurnoverRate(selectedItem).toFixed(2)}</Text>
                    </Flex>
                  </Flex>
                </Card>

                <Card mt="4">
                  <Heading size="4" mb="3">Stock Movement (Last 6 Months)</Heading>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={selectedItem.movement}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip 
                        formatter={(value: number) => [`${value} units`, 'Quantity']}
                        labelFormatter={(month) => `Month: ${month}`}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="quantity" 
                        stroke={CATEGORY_COLORS[selectedItem.category]} 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              </Box>

              <Box style={{ flex: '1 1 200px' }}>
                <Card>
                  <Heading size="4" mb="3">Product Information</Heading>
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
                    <Flex justify="between">
                      <Text color="gray">Cost of Goods Sold:</Text>
                      <Text weight="bold">{formatCurrency(selectedItem.cogs)}</Text>
                    </Flex>
                  </Flex>
                </Card>

                <Card mt="4">
                  <Heading size="4" mb="3">Quick Actions</Heading>
                  <Flex direction="column" gap="2">
                    <Button variant="soft">
                      Request Restock
                    </Button>
                    <Button variant="soft" color="red">
                      Mark as Damaged
                    </Button>
                    <Button variant="soft" color="amber">
                      Change Location
                    </Button>
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
                <CubeIcon className="mr-2" />
                View Blockchain Record
              </Button>
              <Button variant="solid" color="green">
                <CommitIcon className="mr-2" />
                Commit to Ledger
              </Button>
            </Flex>
          </Dialog.Content>
        )}
      </Dialog.Root>
    </Box>
  );
};

export default InventoryDashboard;
