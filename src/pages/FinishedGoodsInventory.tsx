import {
  Card,
  Flex,
  Heading,
  Table,
  Badge,
  Button,
  Grid,
  Text,
  TextField,
  Select,
} from '@radix-ui/themes';
import { useState } from 'react';

const FinishedGoodsInventory = () => {
  const [inventory, setInventory] = useState([
    {
      id: 'FG001',
      productName: 'Poultry Product 1',
      quantity: 100,
      reserved: 20,
      free: 80,
      location: 'Main Storage',
      storage: 'Cold Room A',
      expiry: '2025-12-31',
      zone: 'Zone 1',
    },
    {
      id: 'FG002',
      productName: 'Poultry Product 2',
      quantity: 200,
      reserved: 50,
      free: 150,
      location: 'Secondary Storage',
      storage: 'Freezer B',
      expiry: '2025-10-15',
      zone: 'Zone 2',
    },
    {
      id: 'FG003',
      productName: 'Poultry Product 3',
      quantity: 150,
      reserved: 30,
      free: 120,
      location: 'Backup Storage',
      storage: 'Shelf C',
      expiry: '2025-11-20',
      zone: 'Zone 3',
    },
  ]);

  return (
    <Flex direction="column" gap="4">
      <Heading size="6">📦 Finished Goods Inventory</Heading>

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
              <Table.ColumnHeaderCell>Storage</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Expiry</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {inventory.map((item) => (
              <Table.Row key={item.id}>
                <Table.Cell>{item.id}</Table.Cell>
                <Table.Cell>{item.productName}</Table.Cell>
                <Table.Cell>{item.quantity}</Table.Cell>
                <Table.Cell>{item.reserved}</Table.Cell>
                <Table.Cell>{item.free}</Table.Cell>

                {/* Location with Zone */}
                <Table.Cell>
                  <div>
                    {item.location}
                    <div
                      style={{
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: '#333',
                        backgroundColor: '#f1f1f1',
                        border: '1px solid #ccc',
                        borderRadius: '6px',
                        padding: '2px 6px',
                        marginTop: '4px',
                        display: 'inline-block',
                      }}
                    >
                      {item.zone} via IoT
                    </div>
                  </div>
                </Table.Cell>

                {/* Storage with Zone */}
                <Table.Cell>
                  <div>
                    {item.storage}
                    <div
                      style={{
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: '#333',
                        backgroundColor: '#f1f1f1',
                        border: '1px solid #ccc',
                        borderRadius: '6px',
                        padding: '2px 6px',
                        marginTop: '4px',
                        display: 'inline-block',
                      }}
                    >
                      {item.zone} via IoT
                    </div>
                  </div>
                </Table.Cell>

                {/* Expiry with Zone */}
                <Table.Cell>
                  <div>
                    {item.expiry}
                    <div
                      style={{
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: '#333',
                        backgroundColor: '#f1f1f1',
                        border: '1px solid #ccc',
                        borderRadius: '6px',
                        padding: '2px 6px',
                        marginTop: '4px',
                        display: 'inline-block',
                      }}
                    >
                      {item.zone} via IoT
                    </div>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Card>
    </Flex>
  );
};

export default FinishedGoodsInventory;
