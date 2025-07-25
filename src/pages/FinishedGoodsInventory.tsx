// pages/FinishedGoodsInventory.tsx

import React, { useState } from 'react';
import {
  Card,
  Flex,
  Heading,
  Table,
  Text,
  TextField,
  Box,
  Button,
  Badge,
} from '@radix-ui/themes';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const initialData = [
  {
    id: 'FGI-001',
    name: 'Poultry Product 1',
    quantity: 150,
    reserved: 30,
    location: 'Warehouse 1 - Zone 1',
    storage: 4,
    expiry: '2025-09-01',
  },
  {
    id: 'FGI-002',
    name: 'Poultry Product 2',
    quantity: 200,
    reserved: 60,
    location: 'Warehouse 2 - Zone 2',
    storage: 8,
    expiry: '2025-08-01',
  },
  {
    id: 'FGI-003',
    name: 'Poultry Product 3',
    quantity: 120,
    reserved: 20,
    location: 'Warehouse 3 - Zone 3',
    storage: 6,
    expiry: '2026-01-15',
  },
];

const FinishedGoodsInventory = () => {
  const [data, setData] = useState(initialData);
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (index: number, key: 'quantity' | 'reserved', value: number) => {
    const updated = [...data];
    updated[index][key] = value;
    setData(updated);
  };

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const chartData = filteredData.map((item) => ({
    name: item.name,
    Quantity: item.quantity,
    Reserved: item.reserved,
    FreeToUse: item.quantity - item.reserved,
  }));

  const isExpiredSoon = (expiry: string) => {
    const today = new Date();
    const expDate = new Date(expiry);
    const diff = (expDate.getTime() - today.getTime()) / (1000 * 3600 * 24);
    return diff < 60;
  };

  return (
    <Box p="4">
      <Flex justify="between" align="center" mb="4">
        <Heading size="6">Finished Goods Inventory</Heading>
        <TextField
          placeholder="Search by Name, ID, or Location"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="3"
        />
      </Flex>

      <Card>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Product ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Product Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Quantity</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Reserved</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Free to Use</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>
                Location
                <br />
                <Text size="1" color="gray">Via <Text color="blue" weight="bold">IoT</Text></Text>
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>
                Storage
                <br />
                <Text size="1" color="gray">Via <Text color="blue" weight="bold">IoT</Text></Text>
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Expiry Date</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {filteredData.map((item, index) => (
              <Table.Row key={item.id}>
                <Table.Cell>{item.id}</Table.Cell>
                <Table.Cell>{item.name}</Table.Cell>
                <Table.Cell>
                  <TextField
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleChange(index, 'quantity', parseInt(e.target.value))}
                    size="1"
                    style={{ width: '70px' }}
                  />
                </Table.Cell>
                <Table.Cell>
                  <TextField
                    type="number"
                    value={item.reserved}
                    onChange={(e) => handleChange(index, 'reserved', parseInt(e.target.value))}
                    size="1"
                    style={{ width: '70px' }}
                  />
                </Table.Cell>
                <Table.Cell>{item.quantity - item.reserved}</Table.Cell>
                <Table.Cell>{item.location}</Table.Cell>
                <Table.Cell>{item.storage}°C</Table.Cell>
                <Table.Cell>
                  <Flex align="center" gap="2">
                    {item.expiry}
                    <Box
                      width="12px"
                      height="12px"
                      style={{
                        borderRadius: '50%',
                        backgroundColor: isExpiredSoon(item.expiry) ? 'red' : 'green',
                      }}
                    />
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Card>

      <Box mt="5">
        <Heading size="4" mb="3">Inventory Overview</Heading>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Quantity" fill="#8884d8" />
            <Bar dataKey="Reserved" fill="#82ca9d" />
            <Bar dataKey="FreeToUse" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      <Flex justify="center" mt="5">
        <Button color="green" size="3">Submit to Blockchain</Button>
      </Flex>
    </Box>
  );
};

export default FinishedGoodsInventory;
