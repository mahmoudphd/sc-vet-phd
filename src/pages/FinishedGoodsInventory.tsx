import React, { useState } from 'react';
import {
  Card,
  Flex,
  Heading,
  Table,
  TextField,
  Button,
  Select,
  Box,
  Text,
} from '@radix-ui/themes';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const initialData = [
  {
    id: 'P-001',
    name: 'Poultry Product 1',
    quantity: 100,
    reserved: 30,
    location: 'Zone 1',
    expiry: '2025-09-15',
    storage: 'Cool',
  },
  {
    id: 'P-002',
    name: 'Poultry Product 2',
    quantity: 80,
    reserved: 20,
    location: 'Zone 2',
    expiry: '2025-10-10',
    storage: 'Dry',
  },
  {
    id: 'P-003',
    name: 'Poultry Product 3',
    quantity: 120,
    reserved: 50,
    location: 'Zone 3',
    expiry: '2025-08-20',
    storage: 'Room Temperature',
  },
];

const FinishedGoodsInventory = () => {
  const [products, setProducts] = useState(initialData);

  const handleChange = (index: number, field: 'quantity' | 'reserved', value: number) => {
    const updated = [...products];
    updated[index][field] = value;
    setProducts(updated);
  };

  const handleSubmit = () => {
    // Simulate blockchain submission
    alert('Data submitted to blockchain successfully!');
    console.log('Blockchain Data:', products);
  };

  const chartData = products.map((product) => ({
    name: product.name,
    Quantity: product.quantity,
    Reserved: product.reserved,
    FreeToUse: product.quantity - product.reserved,
  }));

  return (
    <Box p="4">
      <Heading size="6" mb="4">Finished Goods Inventory</Heading>

      <Card>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Product ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Product Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Quantity</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Reserved</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Free to Use</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Location</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Expiry Date</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Storage</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {products.map((product, index) => (
              <Table.Row key={product.id}>
                <Table.Cell>{product.id}</Table.Cell>
                <Table.Cell>{product.name}</Table.Cell>
                <Table.Cell>
                  <TextField
                    type="number"
                    size="1"
                    value={product.quantity}
                    onChange={(e) => handleChange(index, 'quantity', Number(e.target.value))}
                  />
                </Table.Cell>
                <Table.Cell>
                  <TextField
                    type="number"
                    size="1"
                    value={product.reserved}
                    onChange={(e) => handleChange(index, 'reserved', Number(e.target.value))}
                  />
                </Table.Cell>
                <Table.Cell>
                  {product.quantity - product.reserved}
                </Table.Cell>
                <Table.Cell>{product.location}</Table.Cell>
                <Table.Cell>{product.expiry}</Table.Cell>
                <Table.Cell>{product.storage}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Card>

      <Box mt="6">
        <Heading size="5" mb="2">Inventory Trend</Heading>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Quantity" fill="#4f46e5" />
            <Bar dataKey="Reserved" fill="#f59e0b" />
            <Bar dataKey="FreeToUse" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      <Flex justify="end" mt="5">
        <Button size="3" color="green" onClick={handleSubmit}>
          Submit to Blockchain
        </Button>
      </Flex>
    </Box>
  );
};

export default FinishedGoodsInventory;
