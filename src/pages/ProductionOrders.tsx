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
  MagnifyingGlassIcon,
  Cross2Icon
} from '@radix-ui/react-icons';
import { PieChart, Pie, Cell, Tooltip as ChartTooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const ProductionOrders = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    productId: '',
    productName: '',
    quantity: '',
    priority: 'medium'
  });

  const orders = [
    {
      id: 'PO23045',
      product: 'Poultry Drug 1',
      priority: 'High',
      status: 'In Production',
      progress: 65,
      schedule: '2025-07-25',
      batchSize: 5000
    },
    {
      id: 'PO23046',
      product: 'Poultry Drug 2',
      priority: 'Medium',
      status: 'Pending',
      progress: 30,
      schedule: '2025-07-28',
      batchSize: 8000
    },
    {
      id: 'PO23047',
      product: 'Poultry Drug 3',
      priority: 'Low',
      status: 'On Hold',
      progress: 15,
      schedule: '2025-08-01',
      batchSize: 6000
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
    value: order.progress,
    batchSize: order.batchSize
  }));

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.productId || !formData.productName || !formData.quantity) {
      toast.error('Please fill all required fields');
      return;
    }
    toast.success('New order created successfully');
    setIsDialogOpen(false);
  };

  return (
    <Box p="6" className="flex-1">
      <Flex justify="between" align="center" mb="4">
        <Heading size="6">Production Orders Dashboard</Heading>
        
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
            onClick={() => toast.success('Data submitted to blockchain')}
          >
            <BlockchainIcon className="mr-2" />
            Submit to Blockchain
          </Button>
          
          <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <Dialog.Trigger>
              <Button variant="soft">
                <PlusIcon className="mr-2" /> New Order
              </Button>
            </Dialog.Trigger>

            <Dialog.Content style={{ maxWidth: 500 }}>
              <Flex justify="between" align="center" mb="4">
                <Dialog.Title>Create New Production Order</Dialog.Title>
                <IconButton variant="ghost" onClick={() => setIsDialogOpen(false)}>
                  <Cross2Icon />
                </IconButton>
              </Flex>
              
              <Flex direction="column" gap="3">
                <TextField.Root
                  placeholder="Product ID"
                  value={formData.productId}
                  onChange={(e) => handleFormChange('productId', e.target.value)}
                />

                <TextField.Root
                  placeholder="Product Name"
                  value={formData.productName}
                  onChange={(e) => handleFormChange('productName', e.target.value)}
                />

                <TextField.Root
                  type="number"
                  placeholder="Quantity"
                  value={formData.quantity}
                  onChange={(e) => handleFormChange('quantity', e.target.value)}
                />

                <Select.Root 
                  value={formData.priority}
                  onValueChange={(value) => handleFormChange('priority', value)}
                >
                  <Select.Trigger placeholder="Select priority" />
                  <Select.Content>
                    <Select.Item value="high">High Priority</Select.Item>
                    <Select.Item value="medium">Medium Priority</Select.Item>
                    <Select.Item value="low">Low Priority</Select.Item>
                  </Select.Content>
                </Select.Root>

                <Flex gap="3" justify="end" mt="4">
                  <Button 
                    variant="soft" 
                    color="gray"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit}>
                    Create Order
                  </Button>
                </Flex>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>
        </Flex>
      </Flex>

      {/* Compact Table */}
      <Table.Root variant="surface" className="text-sm mb-6">
        <Table.Header>
          <Table.Row className="[&>th]:py-2 [&>th]:px-3">
            <Table.ColumnHeaderCell>Order ID</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Product</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
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
                  order.status === 'In Production' ? 'green' :
                  order.status === 'Pending' ? 'amber' : 'red'
                }>
                  {order.status}
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

      {/* Pie Chart Visualization */}
      <Box className="bg-white p-4 rounded-lg shadow-sm">
        <Heading size="5" mb="4">Production Distribution</Heading>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip 
                formatter={(value, name, props) => [
                  `${value}% (${props.payload.batchSize} units)`,
                  name
                ]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Box>
    </Box>
  );
};

export default ProductionOrders;
