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
  Select,
  Switch
} from '@radix-ui/themes';
import { CubeIcon } from '@radix-ui/react-icons';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend // Added missing import
} from 'recharts';

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  reserved: number;
  storage: string;
  expiry: string;
  location: string;
  unitCost: number;
  sellingPrice: number;
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
    unitCost: 12.5,
    sellingPrice: 225
  },
  {
    id: 'FGI002',
    name: 'Poultry Product B',
    quantity: 100,
    reserved: 30,
    storage: '6°C',
    expiry: '2025-09-15',
    location: 'Zone 2',
    unitCost: 15.0,
    sellingPrice: 215
  },
  {
    id: 'FGI003',
    name: 'Poultry Product C',
    quantity: 80,
    reserved: 20,
    storage: '8°C',
    expiry: '2025-07-28',
    location: 'Zone 2',
    unitCost: 10.0,
    sellingPrice: 200
  }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const FinishedGoodsInventory = () => {
  const [data, setData] = useState<InventoryItem[]>(initialData);
  const [currency, setCurrency] = useState<'USD' | 'EGP'>('EGP');
  const [locationFilter, setLocationFilter] = useState('all');

  const filteredData = data.filter(item => 
    locationFilter === 'all' || item.location === locationFilter
  );

  // Chart data
  const inventoryValueData = filteredData.map(item => ({
    name: item.name,
    value: item.quantity * item.sellingPrice * (currency === 'EGP' ? 1 : 1/EXCHANGE_RATE)
  }));

  const stockLevelData = filteredData.map(item => ({
    name: item.name,
    quantity: item.quantity,
    reserved: item.reserved,
    available: item.quantity - item.reserved
  }));

  const expiryStatusData = [
    { name: 'Expired', value: data.filter(i => new Date(i.expiry) < new Date()).length },
    { name: 'Urgent', value: data.filter(i => {
      const diff = (new Date(i.expiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
      return diff > 0 && diff <= 7;
    }).length },
    { name: 'Warning', value: data.filter(i => {
      const diff = (new Date(i.expiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
      return diff > 7 && diff <= 30;
    }).length },
    { name: 'Good', value: data.filter(i => {
      const diff = (new Date(i.expiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
      return diff > 30;
    }).length }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'ar-EG', {
      style: 'currency',
      currency: currency === 'USD' ? 'USD' : 'EGP',
      minimumFractionDigits: 2
    }).format(currency === 'EGP' ? value : value / EXCHANGE_RATE);
  };

  const getExpiryStatus = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'red';
    if (diffDays < 7) return 'red';
    if (diffDays < 30) return 'amber';
    return 'green';
  };

  return (
    <Box p="4">
      <Card>
        <Flex direction="column" gap="4">
          <Heading size="6">Finished Goods Inventory</Heading>

          {/* Filters and Currency Toggle */}
          <Flex gap="3" align="center">
            <Select.Root value={locationFilter} onValueChange={setLocationFilter}>
              <Select.Trigger>
                Filter by Location
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="all">All Locations</Select.Item>
                <Select.Item value="Zone 1">Zone 1</Select.Item>
                <Select.Item value="Zone 2">Zone 2</Select.Item>
              </Select.Content>
            </Select.Root>

            <Flex align="center" gap="2">
              <Text>USD</Text>
              <Switch 
                checked={currency === 'EGP'}
                onCheckedChange={(checked) => setCurrency(checked ? 'EGP' : 'USD')}
              />
              <Text>EGP</Text>
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

          {/* Charts Section */}
          <Flex direction="column" gap="4">
            {/* Inventory Value Chart */}
            <Card>
              <Heading size="4" mb="2">Inventory Value ({currency})</Heading>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={inventoryValueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip 
                    formatter={(value: number) => [formatCurrency(value), 'Value']}
                  />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Stock Levels Chart */}
            <Card>
              <Heading size="4" mb="2">Stock Levels</Heading>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stockLevelData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip />
                  <Bar dataKey="quantity" fill="#0088FE" name="Total Quantity" />
                  <Bar dataKey="reserved" fill="#FFBB28" name="Reserved" />
                  <Bar dataKey="available" fill="#00C49F" name="Available" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Expiry Status Chart */}
            <Card>
              <Heading size="4" mb="2">Expiry Status</Heading>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expiryStatusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {expiryStatusData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={
                          entry.name === 'Expired' ? '#FF0000' :
                          entry.name === 'Urgent' ? '#FF6347' :
                          entry.name === 'Warning' ? '#FFA500' : '#008000'
                        } 
                      />
                    ))}
                  </Pie>
                  <Legend />
                  <ChartTooltip />
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
                <Table.ColumnHeaderCell>Quantity</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Reserved</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Available</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Selling Price</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>
                  Storage
                  <Text size="1" color="blue">Via IoT</Text>
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>
                  Location
                  <Text size="1" color="blue">Via IoT</Text>
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Expiry Date</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredData.map((item) => {
                const statusColor = getExpiryStatus(item.expiry);
                
                return (
                  <Table.Row key={item.id}>
                    <Table.Cell>{item.id}</Table.Cell>
                    <Table.Cell>{item.name}</Table.Cell>
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
                    <Table.Cell>{formatCurrency(item.sellingPrice)}</Table.Cell>
                    <Table.Cell>{item.storage}</Table.Cell>
                    <Table.Cell>{item.location}</Table.Cell>
                    <Table.Cell>
                      <Flex align="center" gap="2">
                        <Text>{item.expiry}</Text>
                        <Box
                          style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor: `var(--${statusColor}-9)`
                          }}
                        />
                      </Flex>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table.Root>
        </Flex>
      </Card>
    </Box>
  );
};

export default FinishedGoodsInventory;
