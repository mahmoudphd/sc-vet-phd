// src/pages/InventoryOverview.tsx
import React, { useState } from 'react';
import {
  Card,
  Flex,
  Heading,
  Table,
  TextField,
  Text,
  Box,
  Button
} from '@radix-ui/themes';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const initialProducts = [
  {
    id: 'P001',
    name: 'Poultry Product 1',
    quantity: 100,
    reserved: 20,
    location: 'Warehouse A',
    status: 'Available',
    expiry: '2025-12-31',
    storage: 'Cool & Dry'
  },
  {
    id: 'P002',
    name: 'Poultry Product 2',
    quantity: 80,
    reserved: 10,
    location: 'Warehouse B',
    status: 'Low Stock',
    expiry: '2025-10-15',
    storage: 'Refrigerated'
  },
  {
    id: 'P003',
    name: 'Poultry Product 3',
    quantity: 150,
    reserved: 50,
    location: 'Warehouse C',
    status: 'Available',
    expiry: '2026-01-01',
    storage: 'Frozen'
  }
];

const inventoryTrendData = [
  { date: 'Week 1', P001: 100, P002: 80, P003: 150 },
  { date: 'Week 2', P001: 90, P002: 75, P003: 140 },
  { date: 'Week 3', P001: 85, P002: 70, P003: 130 },
  { date: 'Week 4', P001: 80, P002: 68, P003: 125 },
];

const InventoryOverview = () => {
  const [products, setProducts] = useState(initialProducts);

  const handleReservedChange = (index: number, value: number) => {
    const updated = [...products];
    updated[index].reserved = value;
    setProducts(updated);
  };

  const handleSubmitToBlockchain = () => {
    // Placeholder function to simulate submission
    console.log("Submitting to blockchain:", products);
    alert("Submitted to blockchain!");
  };

  return (
    <Box p="4">
      <Heading size="7" mb="4">Inventory Overview</Heading>

      <Card mb="6">
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Product ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Product Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Quantity</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Reserved</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Free to Use</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Location</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Expiry</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Storage</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {products.map((product, index) => {
              const freeToUse = product.quantity - product.reserved;
              return (
                <Table.Row key={product.id}>
                  <Table.Cell>{product.id}</Table.Cell>
                  <Table.Cell>{product.name}</Table.Cell>
                  <Table.Cell>{product.quantity}</Table.Cell>
                  <Table.Cell>
                    <TextField.Input
                      type="number"
                      min={0}
                      value={product.reserved}
                      onChange={(e) =>
                        handleReservedChange(index, parseInt(e.target.value) || 0)
                      }
                    />
                  </Table.Cell>
                  <Table.Cell>{freeToUse}</Table.Cell>
                  <Table.Cell>{product.location}</Table.Cell>
                  <Table.Cell>{product.status}</Table.Cell>
                  <Table.Cell>{product.expiry}</Table.Cell>
                  <Table.Cell>{product.storage}</Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Root>
      </Card>

      <Card mb="4">
        <Heading size="5" mb="3">📊 Inventory Trend</Heading>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={inventoryTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            {['P001', 'P002', 'P003'].map((id, i) => (
              <Line
                key={id}
                type="monotone"
                dataKey={id}
                stroke={['#8884d8', '#82ca9d', '#ff7300'][i]}
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Flex justify="end" mt="3">
        <Button onClick={handleSubmitToBlockchain} variant="solid" color="green">
          Submit to Blockchain
        </Button>
      </Flex>
    </Box>
  );
};

export default InventoryOverview;
