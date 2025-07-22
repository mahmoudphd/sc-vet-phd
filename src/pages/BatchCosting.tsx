import { useState } from 'react';
import {
  Card,
  Flex,
  Heading,
  Text,
  Table,
  Badge,
  Grid,
  Progress,
  Box,
  Select,
} from '@radix-ui/themes';
import { PieChart, Pie, BarChart, Bar } from 'recharts';

const OpenBookAccounting = () => {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('');
  
  const transactions = [
    {
      id: 'TX-23001',
      date: '2023-05-15',
      product: 'Product A',
      supplier: 'Supplier X',
      amount: 24500,
      status: 'paid',
      dueDate: '2023-06-14'
    },
    {
      id: 'TX-23002',
      date: '2023-05-18',
      product: 'Product B',
      supplier: 'Supplier Y',
      amount: 18700,
      status: 'pending',
      dueDate: '2023-06-17'
    },
    {
      id: 'TX-23003',
      date: '2023-05-20',
      product: 'Product C',
      supplier: 'Supplier Z',
      amount: 32000,
      status: 'paid',
      dueDate: '2023-06-19'
    },
  ];

  return (
    <Box p="6">
      <Flex justify="between" align="center" mb="5">
        <Heading size="6">Open Book Accounting Dashboard</Heading>
        
        <Flex gap="3" align="center">
          <Select.Root 
            value={selectedSupplier}
            onValueChange={setSelectedSupplier}
          >
            <Select.Trigger placeholder="Select Supplier" />
            <Select.Content>
              <Select.Item value="x">Supplier X</Select.Item>
              <Select.Item value="y">Supplier Y</Select.Item>
              <Select.Item value="z">Supplier Z</Select.Item>
            </Select.Content>
          </Select.Root>

          <Select.Root 
            value={selectedProduct}
            onValueChange={setSelectedProduct}
          >
            <Select.Trigger placeholder="Select Product" />
            <Select.Content>
              <Select.Item value="a">Product A</Select.Item>
              <Select.Item value="b">Product B</Select.Item>
              <Select.Item value="c">Product C</Select.Item>
            </Select.Content>
          </Select.Root>
        </Flex>
      </Flex>

      <Grid columns="4" gap="4" mb="5">
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">Total Open Transactions</Text>
            <Heading size="7">$75,200</Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">Upcoming Payments</Text>
            <Heading size="7">$18,700</Heading>
            <Text size="1" color="gray">Due in 7 days</Text>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">Avg Payment Terms</Text>
            <Heading size="7">30 days</Heading>
            <Text size="1" color="gray">Net 30 standard</Text>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">Supplier Health</Text>
            <Progress value={92} />
            <Text size="1" color="gray">3 active suppliers</Text>
          </Flex>
        </Card>
      </Grid>

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Transaction ID</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Product</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Supplier</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Amount</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Due Date</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {transactions.map((tx) => (
            <Table.Row key={tx.id}>
              <Table.Cell>{tx.id}</Table.Cell>
              <Table.Cell>{tx.date}</Table.Cell>
              <Table.Cell>{tx.product}</Table.Cell>
              <Table.Cell>{tx.supplier}</Table.Cell>
              <Table.Cell>${tx.amount.toLocaleString()}</Table.Cell>
              <Table.Cell>
                <Badge color={tx.status === 'paid' ? 'green' : 'orange'}>
                  {tx.status}
                </Badge>
              </Table.Cell>
              <Table.Cell>{tx.dueDate}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <Flex mt="5" gap="4">
        <Card style={{ flex: 1 }}>
          <Heading size="4" mb="3">Spending by Supplier</Heading>
          <div className="h-64">
            <BarChart width={500} height={250} data={[
              { name: 'Supplier X', value: 24500 },
              { name: 'Supplier Y', value: 18700 },
              { name: 'Supplier Z', value: 32000 }
            ]}>
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </div>
        </Card>
        <Card style={{ flex: 1 }}>
          <Heading size="4" mb="3">Payment Status</Heading>
          <div className="h-64">
            <PieChart width={300} height={250}>
              <Pie
                data={[
                  { name: 'Paid', value: 65 },
                  { name: 'Pending', value: 25 },
                  { name: 'Overdue', value: 10 }
                ]}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              />
            </PieChart>
          </div>
        </Card>
      </Flex>
    </Box>
  );
};

export default OpenBookAccounting;
