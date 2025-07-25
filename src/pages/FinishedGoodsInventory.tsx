// src/pages/SimplifiedInventory.tsx

import React, { useState } from 'react';
import {
  Table,
  TextField,
  Select,
  Flex,
  Button,
  Heading,
  Card,
  Grid,
  Text,
} from '@radix-ui/themes';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type Product = {
  id: string;
  name: string;
  quantity: number;
  reserved: number;
  location: string;
  expiry: string;
  storage: string;
};

const initialData: Product[] = [
  {
    id: 'P-001',
    name: 'Product A',
    quantity: 100,
    reserved: 20,
    location: 'Zone 1',
    expiry: '2025-12-31',
    storage: '5°C',
  },
  {
    id: 'P-002',
    name: 'Product B',
    quantity: 150,
    reserved: 50,
    location: 'Zone 2',
    expiry: '2025-10-15',
    storage: '8°C',
  },
];

const SimplifiedInventory = () => {
  const [products, setProducts] = useState<Product[]>(initialData);

  const handleChange = (
    index: number,
    field: keyof Product,
    value: string
  ) => {
    const updated = [...products];
    if (field === 'quantity' || field === 'reserved') {
      updated[index][field] = parseInt(value) || 0;
    } else {
      updated[index][field] = value;
    }
    setProducts(updated);
  };

  const handleSubmit = () => {
    console.log('Submitting to blockchain...', products);
    alert('Submitted to Blockchain ✅');
  };

  const chartData = products.map((product) => ({
    name: product.name,
    Quantity: product.quantity,
    Reserved: product.reserved,
    FreeToUse: product.quantity - product.reserved,
  }));

  return (
    <Card m="4" p="4">
      <Heading mb="4">Finished Goods Inventory</Heading>

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
            <Table.ColumnHeaderCell>Storage (°C)</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {products.map((product, index) => (
            <Table.Row key={product.id}>
              <Table.RowHeaderCell>{product.id}</Table.RowHeaderCell>
              <Table.Cell>{product.name}</Table.Cell>
              <Table.Cell>
                <TextField.Input
                  type="number"
                  value={product.quantity}
                  onChange={(e) =>
                    handleChange(index, 'quantity', e.target.value)
                  }
                />
              </Table.Cell>
              <Table.Cell>
                <TextField.Input
                  type="number"
                  value={product.reserved}
                  onChange={(e) =>
                    handleChange(index, 'reserved', e.target.value)
                  }
                />
              </Table.Cell>
              <Table.Cell>
                {product.quantity - product.reserved}
              </Table.Cell>
              <Table.Cell>
                <Select.Root
                  value={product.location}
                  onValueChange={(value) =>
                    handleChange(index, 'location', value)
                  }
                >
                  <Select.Trigger />
                  <Select.Content>
                    <Select.Item value="Zone 1">Zone 1</Select.Item>
                    <Select.Item value="Zone 2">Zone 2</Select.Item>
                    <Select.Item value="Zone 3">Zone 3</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Table.Cell>
              <Table.Cell>
                <TextField.Input
                  type="date"
                  value={product.expiry}
                  onChange={(e) =>
                    handleChange(index, 'expiry', e.target.value)
                  }
                />
              </Table.Cell>
              <Table.Cell>
                <TextField.Input
                  value={product.storage}
                  onChange={(e) =>
                    handleChange(index, 'storage', e.target.value)
                  }
                />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <Box mt="6" mb="4">
        <Heading size="4" mb="2">
          Inventory Trend
        </Heading>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Quantity" fill="#8884d8" />
            <Bar dataKey="Reserved" fill="#f87171" />
            <Bar dataKey="FreeToUse" fill="#4ade80" />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      <Flex justify="center" mt="5">
        <Button size="3" onClick={handleSubmit}>
          Submit to Blockchain
        </Button>
      </Flex>
    </Card>
  );
};

export default SimplifiedInventory;
