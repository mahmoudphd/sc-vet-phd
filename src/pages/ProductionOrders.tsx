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
  ClipboardIcon,
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
    toast.success(t('messages.blockchainSubmitSuccess'));
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
            placeholder={t('search-placeholder')}
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
            {t('buttons.submitToBlockchain')}
          </Button>
          
          <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <Dialog.Trigger>
              <Button variant="soft">
                <PlusIcon className="mr-2" /> {t('new-order-button')}
              </Button>
            </Dialog.Trigger>

            <Dialog.Content style={{ maxWidth: 600 }}>
              <Dialog.Title>{t('dialog.createOrderTitle')}</Dialog.Title>
              
              <Flex direction="column" gap="4" mt="4">
                <TextField.Root
                  value={formData.productId}
                  onChange={(e) => handleFormChange('productId', e.target.value)}
                  placeholder={t('form.productId')}
                />

                <TextField.Root
                  value={formData.productName}
                  onChange={(e) => handleFormChange('productName', e.target.value)}
                  placeholder={t('form.productName')}
                />

                <TextField.Root
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => handleFormChange('quantity', e.target.value)}
                  placeholder={t('form.quantity')}
                />

                <Select.Root 
                  value={formData.priority}
                  onValueChange={(value) => handleFormChange('priority', value)}
                >
                  <Select.Trigger placeholder={t('form.priority')} />
                  <Select.Content>
                    <Select.Item value="high">{t('priority.high')}</Select.Item>
                    <Select.Item value="medium">{t('priority.medium')}</Select.Item>
                    <Select.Item value="low">{t('priority.low')}</Select.Item>
                  </Select.Content>
                </Select.Root>

                <Select.Root 
                  value={formData.materialsStatus}
                  onValueChange={(value) => handleFormChange('materialsStatus', value)}
                >
                  <Select.Trigger placeholder={t('form.materialsStatus')} />
                  <Select.Content>
                    <Select.Item value="pending">{t('status.materials.pending')}</Select.Item>
                    <Select.Item value="allocated">{t('status.materials.allocated')}</Select.Item>
                    <Select.Item value="insufficient">{t('status.materials.insufficient')}</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Flex>

              <Flex gap="3" justify="end" mt="4">
                <Button 
                  variant="soft" 
                  color="gray"
                  onClick={() => setIsDialogOpen(false)}
                >
                  {t('buttons.cancel')}
                </Button>
                <Button onClick={handleSubmit}>
                  {t('buttons.createOrder')}
                </Button>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>
        </Flex>
      </Flex>

      <Table.Root variant="surface" className="rounded-lg shadow-sm">
        <Table.Header className="bg-gray-50">
          <Table.Row>
            <Table.ColumnHeaderCell className="font-semibold">
              {t('table-headers.order-id')}
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="font-semibold">
              {t('table-headers.product')}
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="font-semibold">
              {t('table-headers.priority')}
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="font-semibold">
              {t('table-headers.materials')}
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="font-semibold">
              {t('table-headers.progress')}
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="font-semibold">
              {t('table-headers.schedule')}
            </Table.ColumnHeaderCell>
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
                  {t(`status.priority.${order.priority.toLowerCase()}`)}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <Badge 
                  color={order.materials === 'Allocated' ? 'green' : 'red'}
                  variant="soft"
                >
                  {t(`status.materials.${order.materials.toLowerCase()}`)}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <Flex align="center" gap="2" style={{ minWidth: 150 }}>
                  <Progress 
                    value={order.progress} 
                    className="h-2"
                    style={{
                      backgroundColor: order.progress > 80 
                        ? '#10B981' 
                        : order.progress > 50 
                        ? '#3B82F6' 
                        : '#F59E0B'
                    }}
                  />
                  <Text size="2" weight="medium">{order.progress}%</Text>
                </Flex>
              </Table.Cell>
              <Table.Cell>{order.schedule}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <Flex mt="6" direction="column" gap="4">
        <Heading size="5">{t('chart-title')}</Heading>
        <div className="h-64">
          <BarChart
            layout="vertical"
            data={orders}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis type="number" hide />
            <YAxis dataKey="product" type="category" />
            <Bar dataKey="progress" fill="#3b82f6" />
          </BarChart>
        </div>
      </Flex>
    </Box>
  );
};

export default ProductionOrders;
