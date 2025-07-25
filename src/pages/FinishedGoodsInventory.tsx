import React, { useState } from 'react';
import {
  Table,
  Card,
  Flex,
  Heading,
  Text,
  TextField,
  Button,
  Box
} from '@radix-ui/themes';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const SimpleInventory = () => {
  const [inventoryData, setInventoryData] = useState([
    { id: 'P001', name: 'Product A', quantity: 100, reserved: 20 },
    { id: 'P002', name: 'Product B', quantity: 150, reserved: 30 },
    { id: 'P003', name: 'Product C', quantity: 80, reserved: 10 },
  ]);

  const handleChange = (index: number, field: 'quantity' | 'reserved', value: string) => {
    const newData = [...inventoryData];
    const numericValue = parseInt(value) || 0;
    newData[index][field] = numericValue;
    setInventoryData(newData);
  };

  const handleSubmitAllToBlockchain = () => {
    console.log('Submitting all to blockchain:', inventoryData);
    alert('All products submitted to blockchain!');
  };

  const chartData = inventoryData.map(item => ({
    name: item.name,
    Quantity: item.quantity,
    Reserved: item.reserved,
    FreeToUse: Math.max(item.quantity - item.reserved, 0),
  }));

  return (
    <Box p="6">
      <Heading size="6" mb="4">Finished Goods Inventory (Simplified)</Heading>

      <Card mb="6">
        <Text size="2" mb="2">Inventory Trend</Text>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Quantity" fill="#3b82f6" />
            <Bar dataKey="Reserved" fill="#ef4444" />
            <Bar dataKey="FreeToUse" fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Product ID</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Product Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Quantity</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Reserved</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Free to Use</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {inventoryData.map((item, index) => {
            const freeToUse = Math.max(item.quantity - item.reserved, 0);
            return (
              <Table.Row key={item.id}>
                <Table.Cell>{item.id}</Table.Cell>
                <Table.Cell>{item.name}</Table.Cell>
                <Table.Cell>
                  <TextField.Root
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleChange(index, 'quantity', e.target.value)}
                  />
                </Table.Cell>
                <Table.Cell>
                  <TextField.Root
                    type="number"
                    value={item.reserved}
                    onChange={(e) => handleChange(index, 'reserved', e.target.value)}
                  />
                </Table.Cell>
                <Table.Cell>{freeToUse}</Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Root>

      <Flex justify="end" mt="4">
        <Button onClick={handleSubmitAllToBlockchain} variant="solid" color="blue">
          Submit All to Blockchain
        </Button>
      </Flex>
    </Box>
  );
};

export default SimpleInventory;
