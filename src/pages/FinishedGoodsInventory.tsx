// src/pages/FinishedGoodsInventory.tsx

import React, { useState } from 'react';
import {
  Card,
  Flex,
  Heading,
  Table,
  Button,
  Text,
  Box
} from '@radix-ui/themes';
import { Input } from "@/components/ui/input";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface InventoryItem {
  id: string;
  productName: string;
  quantity: number;
  reserved: number;
  freeToUse: number;
  location: string;
  expiryDate: string;
  storage: string;
}

const initialData: InventoryItem[] = [
  {
    id: '1',
    productName: 'Poultry Product 1',
    quantity: 100,
    reserved: 20,
    freeToUse: 80,
    location: 'Zone 1\nVia IoT',
    expiryDate: '2025-12-31',
    storage: 'Cold Storage\nVia IoT'
  },
  {
    id: '2',
    productName: 'Poultry Product 2',
    quantity: 200,
    reserved: 60,
    freeToUse: 140,
    location: 'Zone 2\nVia IoT',
    expiryDate: '2025-11-30',
    storage: 'Dry Storage\nVia IoT'
  },
  {
    id: '3',
    productName: 'Poultry Product 3',
    quantity: 150,
    reserved: 30,
    freeToUse: 120,
    location: 'Zone 3\nVia IoT',
    expiryDate: '2026-01-15',
    storage: 'Frozen Storage\nVia IoT'
  }
];

const FinishedGoodsInventory = () => {
  const [inventory, setInventory] = useState(initialData);
  const [newItem, setNewItem] = useState<InventoryItem>({
    id: '',
    productName: '',
    quantity: 0,
    reserved: 0,
    freeToUse: 0,
    location: '',
    expiryDate: '',
    storage: ''
  });

  const handleChange = (field: keyof InventoryItem, value: string | number) => {
    setNewItem(prev => ({
      ...prev,
      [field]: typeof value === 'string' && field !== 'productName' && field !== 'location' && field !== 'storage' && field !== 'expiryDate'
        ? Number(value)
        : value
    }));
  };

  const handleSubmit = () => {
    const id = (inventory.length + 1).toString();
    setInventory(prev => [
      ...prev,
      { ...newItem, id, location: newItem.location + '\nVia IoT', storage: newItem.storage + '\nVia IoT' }
    ]);
    setNewItem({
      id: '',
      productName: '',
      quantity: 0,
      reserved: 0,
      freeToUse: 0,
      location: '',
      expiryDate: '',
      storage: ''
    });
  };

  return (
    <Box p="4">
      <Heading mb="4">📦 Finished Goods Inventory</Heading>

      <Card mb="4">
        <Flex direction="column" gap="3">
          <Heading size="3">Add New Entry</Heading>
          <Input
            placeholder="Product Name"
            value={newItem.productName}
            onChange={(e) => handleChange('productName', e.target.value)}
          />
          <Input
            type="number"
            placeholder="Quantity"
            value={newItem.quantity}
            onChange={(e) => handleChange('quantity', e.target.value)}
          />
          <Input
            type="number"
            placeholder="Reserved"
            value={newItem.reserved}
            onChange={(e) => handleChange('reserved', e.target.value)}
          />
          <Input
            type="number"
            placeholder="Free to Use"
            value={newItem.freeToUse}
            onChange={(e) => handleChange('freeToUse', e.target.value)}
          />
          <Input
            placeholder="Location (e.g., Zone 4)"
            value={newItem.location}
            onChange={(e) => handleChange('location', e.target.value)}
          />
          <Input
            placeholder="Storage Type"
            value={newItem.storage}
            onChange={(e) => handleChange('storage', e.target.value)}
          />
          <Input
            type="date"
            placeholder="Expiry Date"
            value={newItem.expiryDate}
            onChange={(e) => handleChange('expiryDate', e.target.value)}
          />
          <Button onClick={handleSubmit}>Add to Inventory</Button>
        </Flex>
      </Card>

      <Card mb="4">
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Product</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Quantity</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Reserved</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Free to Use</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Location</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Expiry Date</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Storage</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {inventory.map((item) => (
              <Table.Row key={item.id}>
                <Table.Cell>{item.productName}</Table.Cell>
                <Table.Cell>{item.quantity}</Table.Cell>
                <Table.Cell>{item.reserved}</Table.Cell>
                <Table.Cell>{item.freeToUse}</Table.Cell>
                <Table.Cell>
                  {item.location.split('\n').map((line, i) => (
                    <Text key={i} size="2">{line}</Text>
                  ))}
                </Table.Cell>
                <Table.Cell>{item.expiryDate}</Table.Cell>
                <Table.Cell>
                  {item.storage.split('\n').map((line, i) => (
                    <Text key={i} size="2">{line}</Text>
                  ))}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Card>

      <Card>
        <Heading size="4" mb="3">📊 Inventory Overview</Heading>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={inventory}>
            <XAxis dataKey="productName" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="quantity" fill="#8884d8" name="Total Quantity" />
            <Bar dataKey="reserved" fill="#f87171" name="Reserved" />
            <Bar dataKey="freeToUse" fill="#4ade80" name="Free to Use" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </Box>
  );
};

export default FinishedGoodsInventory;
