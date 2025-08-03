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
  Badge
} from '@radix-ui/themes';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useState } from 'react';
import { MagnifyingGlassIcon, CubeIcon } from '@radix-ui/react-icons';

const initialData = [
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

const FinishedGoodsInventory = () => {
  const [data, setData] = useState(initialData);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = data.filter(item =>
    item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChange = (index: number, field: 'quantity' | 'reserved', value: number) => {
    const newData = [...data];
    newData[index][field] = value;
    setData(newData);
  };

  const getExpiryIndicator = (expiry: string) => {
    const today = new Date();
    const expiryDate = new Date(expiry);
    const diffDays = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const color = diffDays < 10 ? '#ef4444' : '#22c55e';
    return (
      <span
        style={{
          display: 'inline-block',
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          backgroundColor: color,
          marginLeft: '6px',
        }}
      />
    );
  };

  // Calculate inventory turnover ratio (simplified calculation)
  const totalQuantity = data.reduce((sum, item) => sum + item.quantity, 0);
  const totalReserved = data.reduce((sum, item) => sum + item.reserved, 0);
  const inventoryTurnoverRatio = totalQuantity > 0 ? (totalReserved / totalQuantity) * 100 : 0;

  return (
    <Box p="4">
      <Card>
        <Flex direction="column" gap="4">
          {/* Header with Search and Blockchain Button */}
          <Flex justify="between" align="center">
            <Heading size="6">Finished Goods Inventory</Heading>
            <Flex gap="3" align="center">
              <TextField.Root
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48"
              >
                <TextField.Slot>
                  <MagnifyingGlassIcon />
                </TextField.Slot>
              </TextField.Root>
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
          <Grid columns="3" gap="4">
            <Card>
              <Flex direction="column" gap="1">
                <Text size="2" color="gray">Total Products</Text>
                <Text size="5" weight="bold">{data.length}</Text>
              </Flex>
            </Card>
            <Card>
              <Flex direction="column" gap="1">
                <Text size="2" color="gray">Expiring Soon</Text>
                <Text size="5" weight="bold">
                  {data.filter(item => {
                    const today = new Date();
                    const expiry = new Date(item.expiry);
                    return (expiry.getTime() - today.getTime()) < 10 * 24 * 60 * 60 * 1000;
                  }).length}
                </Text>
              </Flex>
            </Card>
            <Card>
              <Flex direction="column" gap="1">
                <Text size="2" color="gray">Inventory Turnover</Text>
                <Flex align="center" gap="2">
                  <Text size="5" weight="bold">
                    {inventoryTurnoverRatio.toFixed(1)}%
                  </Text>
                  <Badge color={
                    inventoryTurnoverRatio > 50 ? 'green' :
                    inventoryTurnoverRatio > 30 ? 'amber' : 'red'
                  }>
                    {
                      inventoryTurnoverRatio > 50 ? 'High' :
                      inventoryTurnoverRatio > 30 ? 'Medium' : 'Low'
                    }
                  </Badge>
                </Flex>
              </Flex>
            </Card>
          </Grid>

          {/* Inventory Table */}
          <Table.Root style={{ fontWeight: 600 }}>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Product ID</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Product Name</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Quantity</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Reserved</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Available</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>
                  Storage
                  <div style={{ fontSize: '0.75rem', color: '#3b82f6' }}>Via IoT</div>
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>
                  Location
                  <div style={{ fontSize: '0.75rem', color: '#3b82f6' }}>Via IoT</div>
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Expiry Date</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredData.map((item, index) => (
                <Table.Row key={item.id}>
                  <Table.Cell><Text weight="medium">{item.id}</Text></Table.Cell>
                  <Table.Cell><Text weight="medium">{item.name}</Text></Table.Cell>
                  <Table.Cell>
                    <TextField.Root
                      value={item.quantity}
                      type="number"
                      onChange={(e) => handleChange(index, 'quantity', parseInt(e.target.value))}
                      style={{ width: '70px', fontWeight: 600 }}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <TextField.Root
                      value={item.reserved}
                      type="number"
                      onChange={(e) => handleChange(index, 'reserved', parseInt(e.target.value))}
                      style={{ width: '70px', fontWeight: 600 }}
                    />
                  </Table.Cell>
                  <Table.Cell><Text weight="medium">{item.quantity - item.reserved}</Text></Table.Cell>
                  <Table.Cell>
                    <Text weight="medium">{item.storage}</Text>
                    <div style={{ fontSize: '0.75rem', color: '#3b82f6' }}>Via IoT</div>
                  </Table.Cell>
                  <Table.Cell>
                    <Text weight="medium">{item.location}</Text>
                    <div style={{ fontSize: '0.75rem', color: '#3b82f6' }}>Via IoT</div>
                  </Table.Cell>
                  <Table.Cell>
                    <Flex align="center" gap="2">
                      <Text weight="medium">{item.expiry}</Text>
                      {getExpiryIndicator(item.expiry)}
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>

          {/* Inventory Chart */}
          <Box mt="6">
            <Heading size="5" mb="2">
              Inventory Distribution
            </Heading>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={filteredData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantity" fill="#3b82f6" name="Total Quantity" />
                <Bar dataKey="reserved" fill="#f59e0b" name="Reserved" />
                <Bar
                  dataKey={(entry) => entry.quantity - entry.reserved}
                  fill="#10b981"
                  name="Available"
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
