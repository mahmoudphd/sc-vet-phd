import {
  Card,
  Flex,
  Heading,
  Table,
  Button,
  Text,
  Box,
} from '@radix-ui/themes';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState } from 'react';

const FinishedGoodsInventory = () => {
  const [data] = useState([
    {
      id: 'FP001',
      name: 'Poultry Product A',
      quantity: 100,
      reserved: 30,
      freeToUse: 70,
      location: 'Warehouse 1 - Zone 1',
      storage: '4°C',
    },
    {
      id: 'FP002',
      name: 'Poultry Product B',
      quantity: 150,
      reserved: 50,
      freeToUse: 100,
      location: 'Warehouse 2 - Zone 2',
      storage: '8°C',
    },
    {
      id: 'FP003',
      name: 'Poultry Product C',
      quantity: 200,
      reserved: 80,
      freeToUse: 120,
      location: 'Warehouse 1 - Zone 1',
      storage: '6°C',
    },
  ]);

  return (
    <Box p="4">
      <Card>
        <Flex justify="between" align="center" mb="4">
          <Heading size="6">Finished Goods Inventory</Heading>
          <Button>Submit to Blockchain</Button>
        </Flex>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Product ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Quantity</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Reserved</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Free to Use</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Location</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>
                Storage
                <br />
                <Text size="1" color="gray">Via IoT</Text>
              </Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.map((record) => (
              <Table.Row key={record.id}>
                <Table.RowHeaderCell>{record.id}</Table.RowHeaderCell>
                <Table.Cell>{record.name}</Table.Cell>
                <Table.Cell>{record.quantity}</Table.Cell>
                <Table.Cell>{record.reserved}</Table.Cell>
                <Table.Cell>{record.freeToUse}</Table.Cell>
                <Table.Cell>{record.location}</Table.Cell>
                <Table.Cell>{record.storage}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Card>

      <Box mt="6">
        <Card>
          <Heading size="5" mb="3">Inventory Levels Overview</Heading>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="quantity" fill="#4F46E5" name="Quantity" />
              <Bar dataKey="reserved" fill="#EC4899" name="Reserved" />
              <Bar dataKey="freeToUse" fill="#10B981" name="Free to Use" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </Box>
    </Box>
  );
};

export default FinishedGoodsInventory;
