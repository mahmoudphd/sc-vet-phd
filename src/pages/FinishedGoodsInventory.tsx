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
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { CubeIcon } from '@radix-ui/react-icons';

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
  category: 'A' | 'B' | 'C';
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
    sellingPrice: 225,
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
    unitCost: 15.0,
    sellingPrice: 215,
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
    unitCost: 10.0,
    sellingPrice: 200,
    category: 'C'
  }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const FinishedGoodsInventory = () => {
  const [data, setData] = useState<InventoryItem[]>(initialData);
  const [currency, setCurrency] = useState<'USD' | 'EGP'>('EGP');

  // Calculate inventory metrics
  const totalProducts = data.length;
  const expiredProducts = data.filter(item => new Date(item.expiry) < new Date()).length;
  
  const turnoverRates = data.map(item => ({
    id: item.id,
    rate: (item.sellingPrice * item.quantity) / (item.unitCost * item.quantity)
  }));
  
  const averageTurnover = turnoverRates.reduce((sum, item) => sum + item.rate, 0) / turnoverRates.length;

  // Chart data
  const chartData = data.map(item => ({
    name: item.name,
    value: item.quantity,
    category: item.category
  }));

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
    
    if (diffDays < 0) return { color: 'red' }; // Expired
    if (diffDays < 30) return { color: 'amber' }; // Warning
    return { color: 'green' }; // Good
  };

  return (
    <Box p="4">
      <Card>
        <Flex direction="column" gap="4">
          {/* Header Section */}
          <Flex justify="between" align="center">
            <Heading size="6">Poultry Inventory Management</Heading>
            <Flex gap="3" align="center">
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

          {/* Summary Cards */}
          <Flex gap="4">
            <Card style={{ flex: 1 }}>
              <Flex direction="column" gap="1">
                <Text size="2" color="gray">Total Products</Text>
                <Text size="5" weight="bold">{totalProducts}</Text>
              </Flex>
            </Card>
            
            <Card style={{ flex: 1 }}>
              <Flex direction="column" gap="1">
                <Text size="2" color="gray">Expired Products</Text>
                <Text size="5" weight="bold">{expiredProducts}</Text>
              </Flex>
            </Card>
            
            <Card style={{ flex: 1 }}>
              <Flex direction="column" gap="1">
                <Text size="2" color="gray">Avg Turnover Rate</Text>
                <Text size="5" weight="bold">{averageTurnover.toFixed(2)}x</Text>
              </Flex>
            </Card>
          </Flex>

          {/* Inventory Charts */}
          <Flex gap="4">
            <Card style={{ flex: 1 }}>
              <Heading size="4" mb="2">Inventory Distribution</Heading>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name }) => name}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            <Card style={{ flex: 1 }}>
              <Heading size="4" mb="2">Inventory Value ({currency})</Heading>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip 
                    formatter={(value: number, name: string, props: any) => [
                      formatCurrency(props.payload.sellingPrice * value),
                      'Value'
                    ]}
                  />
                  <Bar dataKey="quantity" name="Quantity">
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
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
                <Table.ColumnHeaderCell>Storage</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Location</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Expiry Status</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data.map((item) => {
                const expiryStatus = getExpiryStatus(item.expiry);
                
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
                    <Table.Cell>
                      <Text>{item.storage}</Text>
                      <Text size="1" color="blue">Via IoT</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text>{item.location}</Text>
                      <Text size="1" color="blue">Via IoT</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge color={expiryStatus.color as any} />
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
