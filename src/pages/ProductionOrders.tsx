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
  Text
} from '@radix-ui/themes';
import { useTranslation } from 'react-i18next';
import { ClipboardIcon } from '@radix-ui/react-icons';
import { BarChart, XAxis, YAxis, Bar } from 'recharts';
import { toast } from 'sonner';
import { useState } from 'react';
import { DialogTitle } from '@radix-ui/react-dialog';

const ProductionOrders = () => {
  const { t } = useTranslation('production-orders');
  const [open, setOpen] = useState(false);
  const [productId, setProductId] = useState('');
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [priority, setPriority] = useState('medium');
  const [materialsStatus, setMaterialsStatus] = useState('pending');

  const orders = [
    {
      id: 'PO23045',
      product: 'Poultry Product 1',
      priority: 'High',
      materials: 'Allocated',
      progress: 40,
      schedule: '2025-07-25'
    },
  ];

  const handleSubmit = () => {
    if (!productId || !productName || !quantity) {
      toast.error(t('errors.fillAllFields'));
      return;
    }

    // Add your order creation logic here
    setOpen(false);
    toast.success(t('success.orderCreated'));
  };

  const handleSubmitToBlockchain = () => {
    // يمكن ربطه بعقد ذكي فعلي لاحقًا
    toast.success(t('messages.blockchainSubmitSuccess', 'Submitted to blockchain successfully!'));
  };

  return (
    <Box p="6" className="flex-1">
      <Flex justify="between" align="center" mb="5">
        <Heading size="6">{t('page-title')}</Heading>

        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger>
            <Button variant="soft">
              <ClipboardIcon /> {t('new-order-button')}
            </Button>
          </Dialog.Trigger>

          <Dialog.Content style={{ maxWidth: 600 }}>
            <DialogTitle>{t('dialog.createOrderTitle')}</DialogTitle>
            <Dialog.Description>
              {t('dialog.createOrderDescription')}
            </Dialog.Description>

            <Box p="4">
              <TextField.Root
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                placeholder={t('form.productId')}
                className="w-full h-11 rounded-lg border-gray-300"
              />

              <TextField.Root
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder={t('form.productName')}
                className="w-full h-11 rounded-lg border-gray-300"
              />

              <TextField.Root
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder={t('form.quantity')}
                className="w-full h-11 rounded-lg border-gray-300"
              />

              <Select.Root value={priority} onValueChange={setPriority}>
                <Select.Trigger
                  placeholder={t('form.priority')}
                  className="bg-gray-100 rounded-lg"
                />
                <Select.Content>
                  <Select.Item value="high">{t('priority.high')}</Select.Item>
                  <Select.Item value="medium">{t('priority.medium')}</Select.Item>
                  <Select.Item value="low">{t('priority.low')}</Select.Item>
                </Select.Content>
              </Select.Root>

              <Select.Root value={materialsStatus} onValueChange={setMaterialsStatus}>
                <Select.Trigger
                  placeholder={t('form.materialsStatus')}
                  className="bg-gray-100 rounded-lg"
                />
                <Select.Content>
                  <Select.Item value="pending">{t('status.materials.pending')}</Select.Item>
                  <Select.Item value="allocated">{t('status.materials.allocated')}</Select.Item>
                  <Select.Item value="insufficient">{t('status.materials.insufficient')}</Select.Item>
                </Select.Content>
              </Select.Root>
            </Box>

            <Flex gap="3" justify="end" mt="4">
              <Button variant="ghost" color="gray" onClick={() => setOpen(false)}>
                {t('buttons.cancel')}
              </Button>
              <Button variant="solid" onClick={handleSubmit}>
                {t('buttons.createOrder')}
              </Button>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      </Flex>

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>{t('table-headers.order-id')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('table-headers.product')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('table-headers.priority')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('table-headers.materials')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('table-headers.progress')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('table-headers.schedule')}</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {orders.map((order) => (
            <Table.Row key={order.id}>
              <Table.Cell>{order.id}</Table.Cell>
              <Table.Cell>{order.product}</Table.Cell>
              <Table.Cell>
                <Badge
                  color={
                    order.priority === 'High' ? 'red' :
                    order.priority === 'Medium' ? 'amber' : 'green'
                  }
                  variant="soft"
                >
                  {t(`status.priority.${order.priority.toLowerCase()}`)}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <Badge color={order.materials === 'Allocated' ? 'green' : 'red'}>
                  {t(`status.materials.${order.materials.toLowerCase()}`)}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <Flex align="center" gap="2">
                  <Progress value={order.progress} />
                  <Text size="4">{order.progress}%</Text>
                </Flex>
              </Table.Cell>
              <Table.Cell>{order.schedule}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <Flex mt="6" justify="center">
        <Button variant="solid" color="blue" onClick={handleSubmitToBlockchain}>
          {t('buttons.submitToBlockchain', 'Submit to Blockchain')}
        </Button>
      </Flex>

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
