import React, { useState, useCallback } from 'react';
import {
  Table,
  Badge,
  Button,
  Flex,
  Heading,
  Select,
  TextField,
  Box,
  Progress,
  Dialog,
  Text,
  Tooltip
} from '@radix-ui/themes';
import {
  CubeIcon as BlockchainIcon,
  PlusIcon,
  MagnifyingGlassIcon
} from '@radix-ui/react-icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

const ProductionOrders = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const orders = [
    {
      id: 'PO23045',
      product: 'Poultry Drug 1',
      priority: 'High',
      materials: 'Allocated',
      progress: 40,
      schedule: '2025-07-25',
      batchSize: 5000,
      completed: 2000
    },
    {
      id: 'PO23046',
      product: 'Poultry Drug 2',
      priority: 'Medium',
      materials: 'Pending',
      progress: 25,
      schedule: '2025-07-28',
      batchSize: 8000,
      completed: 2000
    },
    {
      id: 'PO23047',
      product: 'Poultry Drug 3',
      priority: 'Low',
      materials: 'Insufficient',
      progress: 10,
      schedule: '2025-08-01',
      batchSize: 6000,
      completed: 600
    },
  ];

  const filteredOrders = useCallback(() => {
    return orders.filter(order =>
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.product.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const chartData = filteredOrders().map(order => ({
    name: order.product,
    progress: order.progress,
    completed: order.completed,
    remaining: order.batchSize - order.completed
  }));

  return (
    <Box p="6" className="flex-1">
      <Flex justify="between" align="center" mb="4">
        <Heading size="6">Production Orders</Heading>
        
        <Flex gap="3" align="center">
          <TextField.Root
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-48"
          >
            <TextField.Slot>
              <MagnifyingGlassIcon />
            </TextField.Slot>
          </TextField.Root>
          
          <Button 
            variant="solid" 
            color="green"
            className="bg-green-700 hover:bg-green-800"
            onClick={() => toast.success('Submitted to blockchain')}
          >
            <BlockchainIcon className="mr-2" />
            Submit to Blockchain
          </Button>
          
          <Button variant="soft" onClick={() => setIsDialogOpen(true)}>
            <PlusIcon className="mr-2" /> New Order
          </Button>
        </Flex>
      </Flex>

      {/* Compact Table */}
      <Table.Root variant="surface" className="text-sm">
        <Table.Header>
          <Table.Row className="[&>th]:py-2 [&>th]:px-3">
            <Table.ColumnHeaderCell>Order ID</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Product</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Priority</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Materials</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Progress</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Schedule</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Batch Size</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body className="[&>tr>td]:py-2 [&>tr>td]:px-3">
          {filteredOrders().map((order) => (
            <Table.Row key={order.id} className="hover:bg-gray-50">
              <Table.Cell className="font-medium">{order.id}</Table.Cell>
              <Table.Cell>{order.product}</Table.Cell>
              <Table.Cell>
                <Badge color={
                  order.priority === 'High' ? 'red' :
                  order.priority === 'Medium' ? 'amber' : 'green'
                }>
                  {order.priority}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <Badge color={
                  order.materials === 'Allocated' ? 'green' :
                  order.materials === 'Pending' ? 'amber' : 'red'
                }>
                  {order.materials}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <Flex align="center" gap="2" className="w-32">
                  <Progress 
                    value={order.progress} 
                    className="h-1.5"
                  />
                  <Text size="2">{order.progress}%</Text>
                </Flex>
              </Table.Cell>
              <Table.Cell>{order.schedule}</Table.Cell>
              <Table.Cell>{order.batchSize.toLocaleString()}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      {/* Improved Stacked Bar Chart */}
      <Box mt="6" className="bg-white p-4 rounded-lg shadow-sm">
        <Heading size="5" mb="4">Production Overview</Heading>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <ChartTooltip />
              <Bar dataKey="completed" stackId="a" fill="#10B981" name="Completed" />
              <Bar dataKey="remaining" stackId="a" fill="#E5E7EB" name="Remaining" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Box>

      {/* Dialog for new orders */}
      <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog.Content>
          <Dialog.Title>Create New Order</Dialog.Title>
          {/* Add your form content here */}
        </Dialog.Content>
      </Dialog.Root>
    </Box>
  );
};

export default ProductionOrders;
