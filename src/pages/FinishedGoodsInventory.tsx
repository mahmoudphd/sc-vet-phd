// src/pages/FinishedGoodsInventory.tsx
import React, { useState } from 'react';
import {
  Table,
  Card,
  Button,
  Flex,
  Heading,
  TextField,
  Select,
  Box,
} from '@radix-ui/themes';
import { PlusIcon } from '@radix-ui/react-icons';

type FinishedGood = {
  id: string;
  name: string;
  quantity: number;
  reserved: number;
  location: string;
  expiryDate: string;
  storageTemp: string;
};

const initialData: FinishedGood[] = [
  {
    id: 'FG001',
    name: 'Product A',
    quantity: 120,
    reserved: 20,
    location: 'Zone 1',
    expiryDate: '2025-12-31',
    storageTemp: '2-8°C',
  },
  {
    id: 'FG002',
    name: 'Product B',
    quantity: 80,
    reserved: 10,
    location: 'Zone 2',
    expiryDate: '2025-10-15',
    storageTemp: 'Room Temp',
  },
];

const FinishedGoodsInventory = () => {
  const [data, setData] = useState<FinishedGood[]>(initialData);

  const handleChange = (index: number, field: keyof FinishedGood, value: any) => {
    const updated = [...data];
    updated[index][field] = value;
    setData(updated);
  };

  const handleSubmitToBlockchain = () => {
    // Logic to submit to blockchain goes here
    console.log('Submitted to blockchain:', data);
    alert('Submitted to Blockchain!');
  };

  return (
    <Card className="p-4">
      <Heading size="6" mb="4">Finished Goods Inventory</Heading>

      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Product ID</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Quantity</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Reserved</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Free to Use</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Location</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Expiry Date</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Storage Temp</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.map((item, index) => (
            <Table.Row key={item.id}>
              <Table.Cell>{item.id}</Table.Cell>
              <Table.Cell>
                <TextField
                  value={item.name}
                  onChange={(e) => handleChange(index, 'name', e.target.value)}
                />
              </Table.Cell>
              <Table.Cell>
                <TextField
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleChange(index, 'quantity', parseInt(e.target.value) || 0)}
                />
              </Table.Cell>
              <Table.Cell>
                <TextField
                  type="number"
                  value={item.reserved}
                  onChange={(e) => handleChange(index, 'reserved', parseInt(e.target.value) || 0)}
                />
              </Table.Cell>
              <Table.Cell>
                {item.quantity - item.reserved}
              </Table.Cell>
              <Table.Cell>
                <Select.Root
                  value={item.location}
                  onValueChange={(value) => handleChange(index, 'location', value)}
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
                <TextField
                  type="date"
                  value={item.expiryDate}
                  onChange={(e) => handleChange(index, 'expiryDate', e.target.value)}
                />
              </Table.Cell>
              <Table.Cell>
                <TextField
                  value={item.storageTemp}
                  onChange={(e) => handleChange(index, 'storageTemp', e.target.value)}
                />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <Flex justify="end" mt="4">
        <Button onClick={handleSubmitToBlockchain}>
          Submit to Blockchain
        </Button>
      </Flex>
    </Card>
  );
};

export default FinishedGoodsInventory;
