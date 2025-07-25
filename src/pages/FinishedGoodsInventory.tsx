// src/pages/FinishedGoodsInventory.tsx

import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Flex,
  Heading,
  Text,
  TextField,
  Box,
  Select,
} from '@radix-ui/themes';
import { CheckIcon } from '@radix-ui/react-icons';

type FinishedGood = {
  id: string;
  name: string;
  batch: string;
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
    batch: 'BATCH-001',
    quantity: 100,
    reserved: 20,
    location: 'Zone 1',
    expiryDate: '2025-12-31',
    storageTemp: '2-8°C',
  },
  {
    id: 'FG002',
    name: 'Product B',
    batch: 'BATCH-002',
    quantity: 150,
    reserved: 50,
    location: 'Zone 2',
    expiryDate: '2025-09-30',
    storageTemp: 'Room Temp',
  },
];

const FinishedGoodsInventory: React.FC = () => {
  const [data, setData] = useState(initialData);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitToBlockchain = async () => {
    setSubmitting(true);
    try {
      // Replace with actual smart contract interaction
      console.log('Submitting to blockchain...', data);
      setTimeout(() => {
        alert('Data submitted to blockchain successfully!');
        setSubmitting(false);
      }, 1000);
    } catch (error) {
      alert('Submission failed');
      setSubmitting(false);
    }
  };

  const handleChange = (
    index: number,
    field: keyof FinishedGood,
    value: string | number
  ) => {
    const newData = [...data];
    if (field === 'quantity' || field === 'reserved') {
      newData[index][field] = Number(value);
    } else {
      newData[index][field] = value as string;
    }
    setData(newData);
  };

  return (
    <Box p="4">
      <Heading mb="4">Finished Goods Inventory</Heading>
      <Card>
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>ID</Table.ColumnHeader>
              <Table.ColumnHeader>Name</Table.ColumnHeader>
              <Table.ColumnHeader>Batch</Table.ColumnHeader>
              <Table.ColumnHeader>Quantity</Table.ColumnHeader>
              <Table.ColumnHeader>Reserved</Table.ColumnHeader>
              <Table.ColumnHeader>Free to Use</Table.ColumnHeader>
              <Table.ColumnHeader>Location</Table.ColumnHeader>
              <Table.ColumnHeader>Expiry Date</Table.ColumnHeader>
              <Table.ColumnHeader>Storage Temp</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.map((item, index) => (
              <Table.Row key={item.id}>
                <Table.Cell>{item.id}</Table.Cell>
                <Table.Cell>{item.name}</Table.Cell>
                <Table.Cell>{item.batch}</Table.Cell>
                <Table.Cell>
                  <TextField.Root>
                    <TextField.Input
                      type="number"
                      value={item.quantity}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleChange(index, 'quantity', e.target.value)
                      }
                    />
                  </TextField.Root>
                </Table.Cell>
                <Table.Cell>
                  <TextField.Root>
                    <TextField.Input
                      type="number"
                      value={item.reserved}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleChange(index, 'reserved', e.target.value)
                      }
                    />
                  </TextField.Root>
                </Table.Cell>
                <Table.Cell>{item.quantity - item.reserved}</Table.Cell>
                <Table.Cell>
                  <Select.Root
                    value={item.location}
                    onValueChange={(val: string) =>
                      handleChange(index, 'location', val)
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
                  <TextField.Root>
                    <TextField.Input
                      type="date"
                      value={item.expiryDate}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleChange(index, 'expiryDate', e.target.value)
                      }
                    />
                  </TextField.Root>
                </Table.Cell>
                <Table.Cell>
                  <TextField.Root>
                    <TextField.Input
                      type="text"
                      value={item.storageTemp}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleChange(index, 'storageTemp', e.target.value)
                      }
                    />
                  </TextField.Root>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
        <Flex justify="end" mt="4">
          <Button onClick={handleSubmitToBlockchain} disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit to Blockchain'}
            <CheckIcon />
          </Button>
        </Flex>
      </Card>
    </Box>
  );
};

export default FinishedGoodsInventory;
