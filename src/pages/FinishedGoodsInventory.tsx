import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Flex,
  Heading,
  Text,
  Box,
} from '@radix-ui/themes';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const initialData = [
  { location: 'Warehouse A', status: 'Available', expiry: '2025-08-10', storage: 'Cool', quantity: 120, freeToUse: 80 },
  { location: 'Warehouse B', status: 'Quarantined', expiry: '2025-09-01', storage: 'Dry', quantity: 75, freeToUse: 0 },
  { location: 'Warehouse C', status: 'Available', expiry: '2025-07-30', storage: 'Cool', quantity: 95, freeToUse: 60 },
];

export default function FinishedGoodsInventory() {
  const [data, setData] = useState(initialData);
  const [newEntry, setNewEntry] = useState({
    location: '',
    status: '',
    expiry: '',
    storage: '',
    quantity: '',
    freeToUse: '',
  });

  const handleChange = (field: string, value: string) => {
    setNewEntry((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    if (
      newEntry.location &&
      newEntry.status &&
      newEntry.expiry &&
      newEntry.storage &&
      newEntry.quantity &&
      newEntry.freeToUse
    ) {
      const parsedEntry = {
        ...newEntry,
        quantity: parseInt(newEntry.quantity),
        freeToUse: parseInt(newEntry.freeToUse),
      };
      setData([...data, parsedEntry]);
      setNewEntry({
        location: '',
        status: '',
        expiry: '',
        storage: '',
        quantity: '',
        freeToUse: '',
      });
    }
  };

  const submitToBlockchain = () => {
    console.log('Submitting data to blockchain:', data);
    alert('Submitted to Blockchain!');
  };

  return (
    <Box p="4">
      <Heading mb="4">Finished Goods Inventory</Heading>

      <Card mb="4" p="4">
        <Flex gap="3" direction="column">
          <Flex gap="2">
            <input
              type="text"
              placeholder="Location"
              value={newEntry.location}
              onChange={(e) => handleChange('location', e.target.value)}
            />
            <input
              type="text"
              placeholder="Status"
              value={newEntry.status}
              onChange={(e) => handleChange('status', e.target.value)}
            />
            <input
              type="date"
              placeholder="Expiry"
              value={newEntry.expiry}
              onChange={(e) => handleChange('expiry', e.target.value)}
            />
            <input
              type="text"
              placeholder="Storage"
              value={newEntry.storage}
              onChange={(e) => handleChange('storage', e.target.value)}
            />
          </Flex>
          <Flex gap="2">
            <input
              type="number"
              placeholder="Quantity"
              value={newEntry.quantity}
              onChange={(e) => handleChange('quantity', e.target.value)}
            />
            <input
              type="number"
              placeholder="Free to Use"
              value={newEntry.freeToUse}
              onChange={(e) => handleChange('freeToUse', e.target.value)}
            />
            <Button onClick={handleSubmit}>Add Entry</Button>
          </Flex>
        </Flex>
      </Card>

      <Card mb="4">
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Location</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Expiry</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Storage</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Quantity</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Free to Use</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.map((item, index) => (
              <Table.Row key={index}>
                <Table.Cell>{item.location}</Table.Cell>
                <Table.Cell>{item.status}</Table.Cell>
                <Table.Cell>{item.expiry}</Table.Cell>
                <Table.Cell>{item.storage}</Table.Cell>
                <Table.Cell>{item.quantity}</Table.Cell>
                <Table.Cell>{item.freeToUse}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Card>

      <Card p="4" mb="4">
        <Heading size="4" mb="3">Inventory by Location</Heading>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="location" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="quantity" fill="#8884d8" name="Quantity" />
            <Bar dataKey="freeToUse" fill="#82ca9d" name="Free to Use" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Button variant="solid" color="green" onClick={submitToBlockchain}>
        Submit to Blockchain
      </Button>
    </Box>
  );
}
