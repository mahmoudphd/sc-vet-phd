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
  Tooltip,
  IconButton
} from '@radix-ui/themes';
import {
  CubeIcon as BlockchainIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  Cross2Icon,
  ExclamationTriangleIcon,
  CheckCircledIcon,
  ClockIcon
} from '@radix-ui/react-icons';
import { PieChart, Pie, Cell, Tooltip as ChartTooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const ProductionOrders = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    productId: '',
    productName: '',
    quantity: '',
    priority: 'medium',
    materialsStatus: 'Allocated'
  });

  const orders = [
    {
      id: 'PO23045',
      product: 'Poultry Drug A',
      priority: 'High',
      materials: 'Allocated',
      progress: 65,
      schedule: '2025-07-25',
      batchSize: 5000
    },
    {
      id: 'PO23046',
      product: 'Poultry Drug B',
      priority: 'Medium',
      materials: 'Pending',
      progress: 30,
      schedule: '2025-07-28',
      batchSize: 8000
    },
    {
      id: 'PO23047',
      product: 'Poultry Drug C',
      priority: 'Low',
      materials: 'Insufficient',
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
    toast.success('Production order created successfully');
    setIsDialogOpen(false);
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'High': return <ExclamationTriangleIcon className="mr-1" />;
      case 'Medium': return <ClockIcon className="mr-1" />;
      default: return <CheckCircledIcon className="mr-1" />;
    }
  };

  const getMaterialsIcon = (status: string) => {
    switch (status) {
      case 'Allocated': return <CheckCircledIcon className="mr-1" />;
      case 'Pending': return <ClockIcon className="mr-1" />;
      default: return <ExclamationTriangleIcon className="mr-1" />;
    }
  };

  return (
    <Box p="6" className="flex-1">
      <Flex justify="between" align="center" mb="6">
        <div>
          <Heading size="6" className="text-gray-800 font-bold">Pharmaceutical Production</Heading>
          <Text size="2" className="text-gray-500">Batch manufacturing orders</Text>
        </div>
        
        <Flex gap="3" align="center">
          <TextField.Root
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-56"
            variant="soft"
          >
            <TextField.Slot>
              <MagnifyingGlassIcon />
            </TextField.Slot>
          </TextField.Root>
          
          <Button 
            variant="solid" 
            color="green"
            className="bg-green-700 hover:bg-green-800 transition-colors shadow-sm"
            onClick={() => toast.success('Data submitted to blockchain')}
          >
            <BlockchainIcon className="mr-2" />
            Submit to Blockchain
          </Button>
          
          <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <Dialog.Trigger>
              <Button variant="soft" className="shadow-sm">
                <PlusIcon className="mr-2" /> New Order
              </Button>
            </Dialog.Trigger>

            <Dialog.Content style={{ maxWidth: 500 }} className="p-6">
              <Flex justify="between" align="center" mb="4">
                <Dialog.Title className="text-lg font-bold">New Production Order</Dialog.Title>
                <IconButton variant="ghost" onClick={() => setIsDialogOpen(false)}>
                  <Cross2Icon />
                </IconButton>
              </Flex>
              
              <Flex direction="column" gap="3">
                <Flex direction="column" gap="1">
                  <Text as="label" size="2" weight="bold">Product ID</Text>
                  <TextField.Root
                    placeholder="DRG-2023-001"
                    value={formData.productId}
                    onChange={(e) => handleFormChange('productId', e.target.value)}
                  />
                </Flex>

                <Flex direction="column" gap="1">
                  <Text as="label" size="2" weight="bold">Product Name</Text>
                  <Select.Root 
                    value={formData.productName}
                    onValueChange={(value) => handleFormChange('productName', value)}
                  >
                    <Select.Trigger placeholder="Select product" />
                    <Select.Content>
                      <Select.Item value="Poultry Drug A">Poultry Drug A</Select.Item>
                      <Select.Item value="Poultry Drug B">Poultry Drug B</Select.Item>
                      <Select.Item value="Poultry Drug C">Poultry Drug C</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </Flex>

                <Flex direction="column" gap="1">
                  <Text as="label" size="2" weight="bold">Quantity (units)</Text>
                  <TextField.Root
                    type="number"
                    placeholder="5000"
                    value={formData.quantity}
                    onChange={(e) => handleFormChange('quantity', e.target.value)}
                  />
                </Flex>

                <Flex gap="3">
                  <Flex direction="column" gap="1" className="flex-1">
                    <Text as="label" size="2" weight="bold">Priority</Text>
                    <Select.Root 
                      value={formData.priority}
                      onValueChange={(value) => handleFormChange('priority', value)}
                    >
                      <Select.Trigger />
                      <Select.Content>
                        <Select.Item value="high">High</Select.Item>
                        <Select.Item value="medium">Medium</Select.Item>
                        <Select.Item value="low">Low</Select.Item>
                      </Select.Content>
                    </Select.Root>
                  </Flex>

                  <Flex direction="column" gap="1" className="flex-1">
                    <Text as="label" size="2" weight="bold">Materials</Text>
                    <Select.Root 
                      value={formData.materialsStatus}
                      onValueChange={(value) => handleFormChange('materialsStatus', value)}
                    >
                      <Select.Trigger />
                      <Select.Content>
                        <Select.Item value="Allocated">Allocated</Select.Item>
                        <Select.Item value="Pending">Pending</Select.Item>
                        <Select.Item value="Insufficient">Insufficient</Select.Item>
                      </Select.Content>
                    </Select.Root>
                  </Flex>
                </Flex>

                <Flex gap="3" justify="end" mt="4" className="border-t border-gray-100 pt-4">
                  <Button 
                    variant="soft" 
                    color="gray"
                    onClick={() => setIsDialogOpen(false)}
                    className="hover:bg-gray-100"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    className="hover:bg-blue-600 transition-colors"
                  >
                    Create Order
                  </Button>
                </Flex>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>
        </Flex>
      </Flex>

      {/* Enhanced Table */}
      <Table.Root variant="surface" className="rounded-lg shadow-sm border border-gray-200 mb-6">
        <Table.Header className="bg-gray-50">
          <Table.Row className="[&>th]:font-semibold [&>th]:text-gray-700 [&>th]:py-3">
            <Table.ColumnHeaderCell>Order ID</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Product</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Priority</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Materials</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Progress</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Schedule</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Batch Size</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body className="divide-y divide-gray-100">
          {filteredOrders().map((order) => (
            <Table.Row key={order.id} className="hover:bg-gray-50/50">
              <Table.Cell className="font-medium">
                <Badge variant="soft" className="px-2 py-1">
                  {order.id}
                </Badge>
              </Table.Cell>
              
              <Table.Cell className="font-medium">{order.product}</Table.Cell>
              
              <Table.Cell>
                <Badge 
                  color={
                    order.priority === 'High' ? 'red' :
                    order.priority === 'Medium' ? 'amber' : 'green'
                  }
                  variant="soft"
                  className="px-2 py-1 rounded-full"
                >
                  {getPriorityIcon(order.priority)}
                  {order.priority}
                </Badge>
              </Table.Cell>
              
              <Table.Cell>
                <Badge 
                  color={
                    order.materials === 'Allocated' ? 'green' :
                    order.materials === 'Pending' ? 'amber' : 'red'
                  }
                  variant="soft"
                  className="px-2 py-1 rounded-full"
                >
                  {getMaterialsIcon(order.materials)}
                  {order.materials}
                </Badge>
              </Table.Cell>
              
              <Table.Cell>
                <Flex align="center" gap="2" className="w-40">
                  <Progress 
                    value={order.progress} 
                    className="h-2 rounded-full flex-1"
                    style={{
                      backgroundColor: '#e5e7eb',
                      ['--accent-9' as any]: 
                        order.progress > 70 ? '#10b981' :
                        order.progress > 40 ? '#3b82f6' : '#ef4444'
                    }}
                  />
                  <Text size="2" weight="medium">{order.progress}%</Text>
                </Flex>
              </Table.Cell>
              
              <Table.Cell className="text-gray-700">{order.schedule}</Table.Cell>
              <Table.Cell className="font-medium">{order.batchSize.toLocaleString()}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      {/* Enhanced Pie Chart */}
      <Box className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <Heading size="5" className="text-gray-800 mb-4">Production Distribution</Heading>
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
                  `${value}% (${props.payload.batchSize.toLocaleString()} units)`,
                  name
                ]}
                contentStyle={{
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  padding: '8px 12px'
                }}
              />
              <Legend 
                layout="horizontal"
                verticalAlign="bottom"
                height={36}
                wrapperStyle={{ paddingTop: '20px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Box>
    </Box>
  );
};

export default ProductionOrders;
