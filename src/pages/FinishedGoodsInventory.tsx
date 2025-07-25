import {
  Card,
  Table,
  Text,
  Heading,
  Flex,
  TextField,
} from '@radix-ui/themes';
import { useState } from 'react';

type ProductInventory = {
  productId: string;
  location: string;
  status: string;
  expiry: string;
  storage: string;
  quantity: number;
  reserved: number;
};

const sampleData: ProductInventory[] = [
  {
    productId: 'P001',
    location: 'Warehouse A',
    status: 'Available',
    expiry: '2025-12-31',
    storage: 'Cool',
    quantity: 100,
    reserved: 25,
  },
  {
    productId: 'P002',
    location: 'Warehouse B',
    status: 'On Hold',
    expiry: '2026-05-20',
    storage: 'Ambient',
    quantity: 80,
    reserved: 30,
  },
  {
    productId: 'P003',
    location: 'Warehouse A',
    status: 'Available',
    expiry: '2025-09-15',
    storage: 'Cool',
    quantity: 150,
    reserved: 50,
  },
];

const FinishedGoodsInventory = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = sampleData.filter((item) =>
    item.productId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <Flex justify="between" align="center" mb="4">
        <Heading size="5">Finished Goods Inventory</Heading>
        <TextField
          placeholder="Search by Product ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Flex>

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Product ID</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Location</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Expiry</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Storage</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Free to Use</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {filteredData.map((item, index) => (
            <Table.Row key={index}>
              <Table.Cell>{item.productId}</Table.Cell>
              <Table.Cell>{item.location}</Table.Cell>
              <Table.Cell>{item.status}</Table.Cell>
              <Table.Cell>{item.expiry}</Table.Cell>
              <Table.Cell>{item.storage}</Table.Cell>
              <Table.Cell>{item.quantity - item.reserved}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Card>
  );
};

export default FinishedGoodsInventory;
