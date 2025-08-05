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
  Tooltip
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
  InfoCircledIcon,
  DashboardIcon,
  CalendarIcon,
  DownloadIcon
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
  cogs: number;
}

const EXCHANGE_RATE = 50;
const CATEGORY_COLORS = {
  A: '#3b82f6',
  B: '#10b981',
  C: '#6b7280'
};

// الحصول على التاريخ الحالي بتنسيق YYYY-MM-DD
const getCurrentDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
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
    lastRestock: getCurrentDate(), // تحديث تاريخ الريستوك
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
    lastRestock: getCurrentDate(), // تحديث تاريخ الريستوك
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
    lastRestock: getCurrentDate(), // تحديث تاريخ الريستوك
    cogs: 3000
  }
];

type SortableKeys = keyof Omit<InventoryItem, 'category' | 'cogs'>;

const InventoryDashboard = () => {
  const [data, setData] = useState<InventoryItem[]>(initialData);
  const [currency, setCurrency] = useState<'USD' | 'EGP'>('EGP');
  const [locationFilter, setLocationFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [sortConfig, setSortConfig] = useState<{key: SortableKeys, direction: 'asc' | 'desc'} | null>(null);

  // Calculate metrics
  const totalValue = data.reduce((sum, item) => sum + (item.quantity * item.unitPrice * (currency === 'EGP' ? 1 : 1/EXCHANGE_RATE)), 0);

  const calculateTurnoverRate = (item: InventoryItem) => {
    const avgInventoryValue = (item.quantity * item.unitPrice) / 2;
    return avgInventoryValue > 0 ? item.cogs / avgInventoryValue : 0;
  };

  const filteredData = useMemo(() => {
    let result = data.filter(item => {
      const matchesLocation = locationFilter === 'all' || item.location === locationFilter;
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      return matchesLocation && matchesCategory;
    });

    if (sortConfig !== null) {
      result.sort((a, b) => {
        if (sortConfig.key === 'expiry') {
          const dateA = new Date(a.expiry).getTime();
          const dateB = new Date(b.expiry).getTime();
          return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
        }
        
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return result;
  }, [data, locationFilter, categoryFilter, sortConfig]);

  const requestSort = (key: SortableKeys) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'ar-EG', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(currency === 'EGP' ? value : value / EXCHANGE_RATE);
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

  const exportToCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "ID,Product,Category,Quantity,Reserved,Available,Storage,Location,Expiry,Status\n" 
      + data.map(item => {
        const status = getExpiryStatus(item.expiry).status;
        return `${item.id},"${item.name}",${item.category},${item.quantity},${item.reserved},${item.quantity-item.reserved},${item.storage},${item.location},${item.expiry},${status}`;
      }).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "poultry_inventory.csv");
    document.body.appendChild(link);
    link.click();
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
                <Text>EGP</Text>
                <Switch 
                  checked={currency === 'USD'}
                  onCheckedChange={(checked) => setCurrency(checked ? 'USD' : 'EGP')}
                />
                <Text>USD (1:50)</Text>
              </Flex>

              <Tooltip content="Export to CSV">
                <Button variant="soft" onClick={exportToCSV}>
                  <DownloadIcon />
                </Button>
              </Tooltip>

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

          {/* KPI Cards */}
          <Flex gap="4">
            <Card style={{ flex: 1 }}>
              <Flex align="center" gap="3">
                <Box p="2" style={{ background: '#3b82f620', borderRadius: '50%' }}>
                  <CubeIcon width="24" height="24" color="#3b82f6" />
                </Box>
                <Box>
                  <Text as="div" size="2" color="gray">Total Inventory Value</Text>
                  <Heading size="5">{formatCurrency(totalValue)}</Heading>
                </Box>
              </Flex>
            </Card>

            <Card style={{ flex: 1 }}>
              <Flex align="center" gap="3">
                <Box p="2" style={{ background: '#10b98120', borderRadius: '50%' }}>
                  <DashboardIcon width="24" height="24" color="#10b981" />
                </Box>
                <Box>
                  <Text as="div" size="2" color="gray">Items Near Expiry</Text>
                  <Heading size="5">{
                    expiryStatusData.filter(x => x.name === 'This Week' || x.name === 'Next 30 Days')
                      .reduce((sum, x) => sum + x.value, 0)
                  }</Heading>
                </Box>
              </Flex>
            </Card>

            <Card style={{ flex: 1 }}>
              <Flex align="center" gap="3">
                <Box p="2" style={{ background: '#6366f120', borderRadius: '50%' }}>
                  <CalendarIcon width="24" height="24" color="#6366f1" />
                </Box>
                <Box>
                  <Text as="div" size="2" color="gray">Avg. Turnover Rate</Text>
                  <Heading size="5">{
                    (turnoverData.reduce((sum, item) => sum + item.turnoverRate, 0) / turnoverData.length).toFixed(2)
                  }</Heading>
                </Box>
              </Flex>
            </Card>
          </Flex>

          {/* Expiry Warning Banner */}
          {data.filter(i => {
            const diff = Math.ceil((new Date(i.expiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            return diff <= 7 && diff > 0;
          }).length > 0 && (
            <Card style={{ background: '#fef3c7', borderColor: '#f59e0b' }}>
              <Flex align="center" gap="2">
                <InfoCircledIcon color="#d97706" />
                <Text weight="bold" color="amber">Warning: {data.filter(i => {
                  const diff = Math.ceil((new Date(i.expiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                  return diff <= 7 && diff > 0;
                }).length} items will expire within 7 days!</Text>
              </Flex>
            </Card>
          )}

          {/* Charts Section */}
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
          <Table.Root variant="surface">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell onClick={() => requestSort('id')}>
                  ID {sortConfig?.key === 'id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell onClick={() => requestSort('name')}>
                  Product (Category) {sortConfig?.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
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
                const rowColor = expiryStatus.color === 'red' ? 'var(--red-3)' : 
                                expiryStatus.color === 'amber' ? 'var(--amber-3)' : undefined;
                
                return (
                  <Table.Row 
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    style={{ 
                      cursor: 'pointer',
                      background: rowColor,
                      ...(rowColor ? { ':hover': { background: `color-mix(in srgb, ${rowColor} 90%, white)` } } : {})
                    }}
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
                    <Table.Cell>
                      {new Date(item.expiry).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                      <Badge color={expiryStatus.color as any}>
                        {expiryStatus.status}
                      </Badge>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table.Root>
        </Flex>
      </Card>

      {/* Enhanced Item Detail Modal */}
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
                      <Text weight="bold">{selectedItem.quantity} units</Text>
                    </Flex>
                    <Flex justify="between">
                      <Text color="gray">Available:</Text>
                      <Text weight="bold">{selectedItem.quantity - selectedItem.reserved} units</Text>
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
                  <Heading size="4" mb="3">Stock Movement</Heading>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={[
                      { name: 'Jan', value: 80 },
                      { name: 'Feb', value: 95 },
                      { name: 'Mar', value: 70 },
                      { name: 'Apr', value: 60 },
                      { name: 'May', value: 110 },
                      { name: 'Jun', value: 120 },
                    ]}>
                      <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip formatter={(value: number) => [value, 'Quantity']}/>
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
                      <Badge color={getExpiryStatus(selectedItem.expiry).color as any}>
                        {new Date(selectedItem.expiry).toLocaleDateString()} ({getExpiryStatus(selectedItem.expiry).status})
                      </Badge>
                    </Flex>
                    <Flex justify="between">
                      <Text color="gray">Last Restock:</Text>
                      <Text>{selectedItem.lastRestock}</Text>
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
            </Flex>
          </Dialog.Content>
        )}
      </Dialog.Root>
    </Box>
  );
};

export default InventoryDashboard;
