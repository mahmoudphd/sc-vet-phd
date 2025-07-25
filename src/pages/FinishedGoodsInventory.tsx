import React, { useState } from 'react';
import {
  Card, Table, Button, Heading, Flex, Box, Text,
} from '@radix-ui/themes';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const initialData = [
  {
    id: 'FG001',
    name: 'Poultry Product A',
    quantity: 100,
    reserved: 40,
    location: 'Warehouse 1 - Zone 1',
    storage: 4,
    expiry: '2025-08-10',
  },
  {
    id: 'FG002',
    name: 'Poultry Product B',
    quantity: 120,
    reserved: 20,
    location: 'Warehouse 2 - Zone 2',
    storage: 8,
    expiry: '2025-07-30',
  },
  {
    id: 'FG003',
    name: 'Poultry Product C',
    quantity: 90,
    reserved: 30,
    location: 'Warehouse 1 - Zone 1',
    storage: 6,
    expiry: '2025-10-15',
  },
];

const getDaysUntilExpiry = (date: string) => {
  const today = new Date();
  const expiry = new Date(date);
  const diffTime = expiry.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const FinishedGoodsInventory = () => {
  const [data, setData] = useState(initialData);

  const handleChange = (index: number, field: 'quantity' | 'reserved', value: number) => {
    const newData = [...data];
    newData[index][field] = value;
    setData(newData);
  };

  return (
    <Box p="4">
      <Heading size="6" mb="4">Finished Goods Inventory</Heading>

      <Card>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Product ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Quantity</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Reserved</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Free to Use</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Location</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>
                Storage (Temperature)
                <Text size="1" color="gray">Via IoT</Text>
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Expiry Date</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.map((item, index) => {
              const freeToUse = item.quantity - item.reserved;
              const daysLeft = getDaysUntilExpiry(item.expiry);
              const expiryStatusColor = daysLeft < 30 ? 'red' : 'green';

              return (
                <Table.Row key={item.id}>
                  <Table.RowHeaderCell>{item.id}</Table.RowHeaderCell>
                  <Table.Cell>{item.name}</Table.Cell>
                  <Table.Cell>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleChange(index, 'quantity', Number(e.target.value))}
                      style={{ width: 60 }}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <input
                      type="number"
                      value={item.reserved}
                      onChange={(e) => handleChange(index, 'reserved', Number(e.target.value))}
                      style={{ width: 60 }}
                    />
                  </Table.Cell>
                  <Table.Cell>{freeToUse}</Table.Cell>
                  <Table.Cell>{item.location}</Table.Cell>
                  <Table.Cell>{item.storage} °C</Table.Cell>
                  <Table.Cell>
                    <Flex align="center" gap="2">
                      {item.expiry}
                      <span style={{
                        display: 'inline-block',
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        backgroundColor: expiryStatusColor,
                      }} />
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Root>
      </Card>

      {/* Bar Chart Section */}
      <Box mt="6" height="300px">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="quantity" fill="#3b82f6" name="Quantity" />
            <Bar dataKey="reserved" fill="#facc15" name="Reserved" />
            <Bar
              dataKey={(entry) => entry.quantity - entry.reserved}
              fill="#10b981"
              name="Free to Use"
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      {/* Submit Button */}
      <Flex justify="end" mt="4">
        <Button color="green" size="3">Submit to Blockchain</Button>
      </Flex>
    </Box>
  );
};

export default FinishedGoodsInventory;

