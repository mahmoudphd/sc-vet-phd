import {
  Card,
  Flex,
  Heading,
  Table,
  Button,
  TextField,
  Box,
  Grid,
  Text
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

const initialData = [
  {
    id: 'FGI001',
    name: 'Poultry Product 1',
    quantity: 120,
    reserved: 40,
    storage: '4°C',
    expiry: '2025-08-10',
    location: 'Zone 1'
  },
  {
    id: 'FGI002',
    name: 'Poultry Product 2',
    quantity: 100,
    reserved: 30,
    storage: '6°C',
    expiry: '2025-09-15',
    location: 'Zone 2'
  },
  {
    id: 'FGI003',
    name: 'Poultry Product 3',
    quantity: 80,
    reserved: 20,
    storage: '8°C',
    expiry: '2025-07-28',
    location: 'Zone 2'
  }
];

const FinishedGoodsInventory = () => {
  const [data, setData] = useState(initialData);

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

  return (
    <Box p="4">
      <Card>
        <Flex direction="column" gap="4">
          <Heading size="6">Finished Goods Inventory</Heading>

          <Grid columns="2" gap="4">
            <Card>
              <Flex direction="column" gap="1">
                <Text size="2" color="gray">Total SKUs</Text>
                <Text size="5" weight="bold">{data.length}</Text>
              </Flex>
            </Card>
            <Card>
              <Flex direction="column" gap="1">
                <Text size="2" color="gray">Expiring Soon</Text>
                <Text size="5" weight="bold">
                  {
                    data.filter(item => {
                      const today = new Date();
                      const expiry = new Date(item.expiry);
                      const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                      return diffDays < 10;
                    }).length
                  }
                </Text>
              </Flex>
            </Card>
          </Grid>

          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Product ID</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Product Name</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Quantity</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Reserved</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Free to Use</Table.ColumnHeaderCell>
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
              {data.map((item, index) => (
                <Table.Row key={item.id}>
                  <Table.Cell>{item.id}</Table.Cell>
                  <Table.Cell>{item.name}</Table.Cell>
                  <Table.Cell>
                    <TextField.Root
                      value={item.quantity}
                      type="number"
                      onChange={(e) => handleChange(index, 'quantity', parseInt(e.target.value))}
                      style={{ width: '70px' }}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <TextField.Root
                      value={item.reserved}
                      type="number"
                      onChange={(e) => handleChange(index, 'reserved', parseInt(e.target.value))}
                      style={{ width: '70px' }}
                    />
                  </Table.Cell>
                  <Table.Cell>{item.quantity - item.reserved}</Table.Cell>
                  <Table.Cell>
                    {item.storage}
                    <div style={{ fontSize: '0.75rem', color: '#3b82f6' }}>Via IoT</div>
                  </Table.Cell>
                  <Table.Cell>
                    {item.location}
                    <div style={{ fontSize: '0.75rem', color: '#3b82f6' }}>Via IoT</div>
                  </Table.Cell>
                  <Table.Cell>
                    <Flex align="center" gap="2">
                      {item.expiry}
                      {getExpiryIndicator(item.expiry)}
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>

          <Box mt="6">
            <Heading size="5" mb="2">
              Inventory Overview
            </Heading>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantity" fill="#3b82f6" name="Quantity" />
                <Bar dataKey="reserved" fill="#f59e0b" name="Reserved" />
                <Bar
                  dataKey={(entry) => entry.quantity - entry.reserved}
                  fill="#10b981"
                  name="Free to Use"
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>

          <Flex justify="end" mt="4">
            <Button
              style={{ backgroundColor: '#22c55e', color: 'white' }}
              size="3"
              onClick={() => alert('Submitted to Blockchain!')}
            >
              Submit to Blockchain
            </Button>
          </Flex>
        </Flex>
      </Card>
    </Box>
  );
};

export default FinishedGoodsInventory;
