import React, { useState } from 'react';
import {
  Card,
  Flex,
  Heading,
  Table,
  Button,
  TextField,
  Text,
  Box,
} from '@radix-ui/themes';
import { FileTextIcon } from '@radix-ui/react-icons';

interface FinishedGood {
  id: string;
  name: string;
  location: string;
  status: string;
  expiry: string;
  storage: string;
  quantity: number;
  reserved: number;
}

const initialData: FinishedGood[] = [
  {
    id: 'FG001',
    name: 'Poultry Product A',
    location: 'Warehouse A',
    status: 'Available',
    expiry: '2025-12-31',
    storage: 'Cold',
    quantity: 100,
    reserved: 30,
  },
  {
    id: 'FG002',
    name: 'Poultry Product B',
    location: 'Warehouse B',
    status: 'Reserved',
    expiry: '2025-10-15',
    storage: 'Room Temp',
    quantity: 80,
    reserved: 20,
  },
];

export default function FinishedGoodsInventory() {
  const [data, setData] = useState<FinishedGood[]>(initialData);

  const handleSubmitToBlockchain = (item: FinishedGood) => {
    console.log('Submitting to blockchain:', item);
    alert(`Submitted ${item.name} to blockchain`);
  };

  const handleQuantityChange = (index: number, value: string) => {
    const updated = [...data];
    updated[index].quantity = parseInt(value) || 0;
    setData(updated);
  };

  const handleReservedChange = (index: number, value: string) => {
    const updated = [...data];
    updated[index].reserved = parseInt(value) || 0;
    setData(updated);
  };

  return (
    <Box p="4">
      <Card>
        <Flex justify="between" align="center" mb="4">
          <Heading size="5">Finished Goods Inventory</Heading>
          <FileTextIcon />
        </Flex>

        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Product Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Quantity</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Reserved</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Free to Use</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Location</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Expiry</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Storage</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {data.map((item, index) => (
              <Table.Row key={item.id}>
                <Table.RowHeaderCell>{item.name}</Table.RowHeaderCell>

                <Table.Cell>
                  <TextField.Root>
                    <TextField.Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(index, e.target.value)}
                    />
                  </TextField.Root>
                </Table.Cell>

                <Table.Cell>
                  <TextField.Root>
                    <TextField.Input
                      type="number"
                      value={item.reserved}
                      onChange={(e) => handleReservedChange(index, e.target.value)}
                    />
                  </TextField.Root>
                </Table.Cell>

                <Table.Cell>
                  <Text>{item.quantity - item.reserved}</Text>
                </Table.Cell>

                <Table.Cell>{item.location}</Table.Cell>
                <Table.Cell>{item.status}</Table.Cell>
                <Table.Cell>{item.expiry}</Table.Cell>
                <Table.Cell>{item.storage}</Table.Cell>

                <Table.Cell>
                  <Button
                    size="1"
                    variant="solid"
                    onClick={() => handleSubmitToBlockchain(item)}
                  >
                    Submit to Blockchain
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Card>
    </Box>
  );
}
