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
  Tabs,
  Switch
} from '@radix-ui/themes';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  ResponsiveContainer
} from 'recharts';
import { 
  MagnifyingGlassIcon, 
  CubeIcon, 
  InfoCircledIcon,
  MixerHorizontalIcon,
  DashboardIcon,
  TableIcon
} from '@radix-ui/react-icons';

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  reserved: number;
  storage?: string;
  expiry?: string;
  location: string; // تأكد من وجود حقل الموقع
  unitPrice: number;
}

const initialData: InventoryItem[] = [
  {
    id: 'FGI001',
    name: 'Poultry Product A',
    quantity: 120,
    reserved: 40,
    storage: '4°C',
    expiry: '2025-08-10',
    location: 'Zone 1',
    unitPrice: 12.5
  },
  {
    id: 'FGI002',
    name: 'Poultry Product B',
    quantity: 100,
    reserved: 30,
    storage: '6°C',
    expiry: '2025-09-15',
    location: 'Zone 2',
    unitPrice: 15.0
  },
  {
    id: 'FGI003',
    name: 'Poultry Product C',
    quantity: 80,
    reserved: 20,
    storage: '8°C',
    expiry: '2025-07-28',
    location: 'Zone 2',
    unitPrice: 10.0
  }
];

const EXCHANGE_RATE = 50; // سعر الصرف الثابت 50 جنيه للدولار

const FinishedGoodsInventory: React.FC = () => {
  const [data, setData] = useState<InventoryItem[]>(initialData);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currency, setCurrency] = useState<'USD' | 'EGP'>('USD');
  const [locationFilter, setLocationFilter] = useState<string>('all');

  const filteredData = data.filter(item => {
    const matchesSearch = 
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLocation = 
      locationFilter === 'all' || item.location === locationFilter;
    
    return matchesSearch && matchesLocation;
  });

  const locations = [...new Set(data.map(item => item.location))];

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

  const formatCurrency = (value: number) => {
    const convertedValue = currency === 'EGP' ? value * EXCHANGE_RATE : value;
    return new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'ar-EG', {
      style: 'currency',
      currency: currency === 'USD' ? 'USD' : 'EGP',
      minimumFractionDigits: 2
    }).format(convertedValue);
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
                  Filter by Location
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="all">All Locations</Select.Item>
                  {locations.map(loc => (
                    <Select.Item key={loc} value={loc}>{loc}</Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>

              <Flex align="center" gap="2">
                <Text>USD</Text>
                <Switch 
                  checked={currency === 'EGP'}
                  onCheckedChange={(checked) => setCurrency(checked ? 'EGP' : 'USD')}
                />
                <Text>EGP (1 USD = {EXCHANGE_RATE} EGP)</Text>
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

          {/* Inventory Table */}
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Product ID</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Product Name</Table.ColumnHeaderCell>
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
              {filteredData.map((item) => (
                <Table.Row key={item.id}>
                  <Table.Cell><Text weight="medium">{item.id}</Text></Table.Cell>
                  <Table.Cell><Text weight="medium">{item.name}</Text></Table.Cell>
                  <Table.Cell>
                    <TextField.Root
                      value={item.quantity}
                      type="number"
                      onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                      style={{ width: '70px', fontWeight: 600 }}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <TextField.Root
                      value={item.reserved}
                      type="number"
                      onChange={(e) => handleReservedChange(item.id, parseInt(e.target.value))}
                      style={{ width: '70px', fontWeight: 600 }}
                    />
                  </Table.Cell>
                  <Table.Cell><Text weight="medium">{item.quantity - item.reserved}</Text></Table.Cell>
                  <Table.Cell>
                    <Text weight="medium">
                      {formatCurrency(item.quantity * item.unitPrice)}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text weight="medium">{item.storage}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text weight="medium">{item.location}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text weight="medium">{item.expiry}</Text>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>

          {/* Inventory Chart */}
          <Box mt="6">
            <Heading size="5" mb="2">Inventory Value ({currency})</Heading>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={filteredData}>
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip 
                  formatter={(value: number) => [
                    formatCurrency(value as number),
                    'Value'
                  ]}
                />
                <Bar 
                  dataKey={(item: InventoryItem) => 
                    item.quantity * item.unitPrice * (currency === 'EGP' ? EXCHANGE_RATE : 1)
                  }
                  fill="#3b82f6" 
                  name="Inventory Value" 
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Flex>
      </Card>
    </Box>
  );
};

export default FinishedGoodsInventory;
