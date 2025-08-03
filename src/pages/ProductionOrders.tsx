import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
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
import { BarChart, XAxis, YAxis, Bar } from 'recharts';
import { toast } from 'sonner';

const ProductionOrders = () => {
  const { t } = useTranslation('production-orders');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    productId: '',
    productName: '',
    quantity: '',
    priority: 'medium',
    materialsStatus: 'pending'
  });

  const orders = [
    {
      id: 'PO23045',
      product: 'Poultry Drug 1',
      priority: 'High',
      materials: 'Allocated',
      progress: 40,
      schedule: '2025-07-25'
    },
    {
      id: 'PO23046',
      product: 'Poultry Drug 2',
      priority: 'Medium',
      materials: 'Pending',
      progress: 25,
      schedule: '2025-07-28'
    },
  ];

  const filteredOrders = useCallback(() => {
    return orders.filter(order =>
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.product.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.productId || !formData.productName || !formData.quantity) {
      toast.error(t('errors.fillAllFields'));
      return;
    }

    setIsDialogOpen(false);
    toast.success(t('success.orderCreated'));
  };

  const handleSubmitToBlockchain = () => {
    toast.success('Data submitted to blockchain successfully');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'red';
      case 'medium': return 'amber';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  return (
    <Box p="6" className="flex-1">
      <Flex justify="between" align="center" mb="5" gap="4">
        <Heading size="6">{t('page-title')}</Heading>
        
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
            className="bg-green-700 hover:bg-green-800 transition-colors"
            onClick={handleSubmitToBlockchain}
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

            <Dialog.Content style={{ maxWidth: 600 }}>
              <Dialog.Title>Create New Production Order</Dialog.Title>
              
              <Flex direction="column" gap="4" mt="4">
                <TextField.Root
                  value={formData.productId}
                  onChange={(e) => handleFormChange('productId', e.target.value)}
                  placeholder="Product ID"
                />

                <TextField.Root
                  value={formData.productName}
                  onChange={(e) => handleFormChange('productName', e.target.value)}
                  placeholder="Product Name"
                />

                <TextField.Root
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => handleFormChange('quantity', e.target.value)}
                  placeholder="Quantity"
                />

                <Select.Root 
                  value={formData.priority}
                  onValueChange={(value) => handleFormChange('priority', value)}
                >
                  <Select.Trigger placeholder="Priority" />
                  <Select.Content>
                    <Select.Item value="high">High</Select.Item>
                    <Select.Item value="medium">Medium</Select.Item>
                    <Select.Item value="low">Low</Select.Item>
                  </Select.Content>
                </Select.Root>

                <Select.Root 
                  value={formData.materialsStatus}
                  onValueChange={(value) => handleFormChange('materialsStatus', value)}
                >
                  <Select.Trigger placeholder="Materials Status" />
                  <Select.Content>
                    <Select.Item value="pending">Pending</Select.Item>
                    <Select.Item value="allocated">Allocated</Select.Item>
                    <Select.Item value="insufficient">Insufficient</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Flex>

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
            </Dialog.Content>
          </Dialog.Root>
        </Flex>
      </Flex>

      <Table.Root variant="surface" className="rounded-lg shadow-sm">
        <Table.Header className="bg-gray-50">
          <Table.Row>
            <Table.ColumnHeaderCell>Order ID</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Product</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Priority</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Materials</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Progress</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Schedule</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body className="divide-y divide-gray-200">
          {filteredOrders().map((order) => (
            <Table.Row key={order.id} className="hover:bg-gray-50">
              <Table.Cell className="font-medium">{order.id}</Table.Cell>
              <Table.Cell>{order.product}</Table.Cell>
              <Table.Cell>
                <Badge
                  color={getPriorityColor(order.priority)}
                  variant="soft"
                >
                  {order.priority}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <Badge 
                  color={order.materials === 'Allocated' ? 'green' : 'red'}
                  variant="soft"
                >
                  {order.materials}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <Flex align="center" gap="2" style={{ width: 120 }}>
                  <Progress 
                    value={order.progress} 
                    className="h-1"
                    style={{
                      backgroundColor: order.progress > 80 
                        ? '#10B981' 
                        : order.progress > 50 
                        ? '#3B82F6' 
                        : '#F59E0B'
                    }}
                  />
                  <Text size="2">{order.progress}%</Text>
                </Flex>
              </Table.Cell>
              <Table.Cell>{order.schedule}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <Flex mt="6" direction="column" gap="4">
        <Heading size="5">Production Progress</Heading>
        <div className="h-48">
          <BarChart
            layout="vertical"
            data={orders}
            margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
            width={500}
            height={200}
          >
            <XAxis type="number" hide />
            <YAxis dataKey="product" type="category" />
            <Bar dataKey="progress" fill="#3b82f6" barSize={20} />
          </BarChart>
        </div>
      </Flex>
    </Box>
  );
};

export default ProductionOrders;
