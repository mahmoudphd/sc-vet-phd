import React, { useState } from 'react';
import {
  Table,
  Badge,
  Card,
  Flex,
  Heading,
  Text,
  Progress,
  TextField,
  Select,
  Button,
  Box
} from '@radix-ui/themes';
import {
  BoxIcon,
  CalendarIcon,
  CubeIcon,
} from '@radix-ui/react-icons';
import { BarChart, Bar } from 'recharts';
import { useTranslation } from 'react-i18next';
import NewReceiptModel from '../components/NewReceiptModel';
import ExportCSVModel from '../components/ExportCSVModel';

const FinishedGoodsInventory = () => {
  const { t } = useTranslation('finished-goods-inventory');
  const [isNewReceiptOpen, setIsNewReceiptOpen] = useState(false);
  const [isExportCSVOpen, setIsExportCSVOpen] = useState(false);

  const inventory = [
    {
      id: 'FG23045',
      product: 'Antiparasitic Injection',
      productCategory: 'VC23001',
      quantity: 1245,
      location: 'Zone B-12',
      status: 'Released',
      expiry: '2024-12-01',
      temperature: '2-8°C'
    },
    {
      id: 'FG23048',
      product: 'Antiparasitic Injection',
      productCategory: 'VC23001',
      quantity: 400,
      location: 'Zone B-12',
      status: 'Released',
      expiry: '2024-12-01',
      temperature: '2-8°C'
    },
    {
      id: 'FG23048',
      product: 'Antiparasitic Injection',
      productCategory: 'VC23001',
      quantity: 800,
      location: 'Zone B-12',
      status: 'Released',
      expiry: '2024-12-01',
      temperature: '2-8°C'
    },
    {
      id: 'FG23048',
      product: 'Antiparasitic Injection',
      productCategory: 'VC23001',
      quantity: 1300,
      location: 'Zone B-12',
      status: 'Released',
      expiry: '2024-12-01',
      temperature: '2-8°C'
    },
  ];

  return (
    <Box p="6" className="flex-1">
      <Flex justify="between" align="center" mb="5">
        <Heading size="6">{t('finished-packaging-inventory')}</Heading>
        <Flex gap="3">
          <Button variant="soft" onClick={() => setIsNewReceiptOpen(true)}>
            <CubeIcon /> {t('new-receipt')}
          </Button>
          <Button variant="soft" onClick={() => setIsExportCSVOpen(true)}>
            {t('export-csv')}
          </Button>
        </Flex>
      </Flex>
      <Flex gap="4" mb="5">
        <Card style={{ flex: 1 }}>
          <Flex justify="between" align="center">
            <Text size="2" className="text-gray-500">{t('total-skus')}</Text>
            <Heading size="7">245</Heading>
          </Flex>
        </Card>
        <Card style={{ flex: 1 }}>
          <Flex justify="between" align="center">
            <Text size="2" className="text-gray-500">{t('quarantined')}</Text>
            <Heading size="7" className="text-red-500">3</Heading>
          </Flex>
        </Card>
        <Card style={{ flex: 2 }} className="h-32">
          <Text size="2" mb="2">{t('inventory-trend')}</Text>
          <BarChart width={300} height={100} data={inventory}>
            <Bar dataKey="quantity" fill="#3b82f6" />
          </BarChart>
        </Card>
      </Flex>
      <Flex gap="3" mb="4">
        <TextField.Root placeholder={t('search-products')} />
        <Select.Root defaultValue="all">
          <Select.Trigger />
          <Select.Content>
            <Select.Item value="all">{t('all-products')}</Select.Item>
            <Select.Item value="oral">{t('oral-preparations')}</Select.Item>
            <Select.Item value="injectable">{t('parenterals')}</Select.Item>
          </Select.Content>
        </Select.Root>
        <Select.Root defaultValue="all">
          <Select.Trigger />
          <Select.Content>
            <Select.Item value="all">{t('all-statuses')}</Select.Item>
            <Select.Item value="released">{t('released')}</Select.Item>
            <Select.Item value="quarantine">{t('quarantined-status')}</Select.Item>
          </Select.Content>
        </Select.Root>
      </Flex>
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>{t('product')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('product-category')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('quantity')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('Free To Use')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('Incoming')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('outgoing')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('Forecasted')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('location')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('status')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('expiry')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('storage')}</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {inventory.map((item) => (
            <Table.Row key={item.id}>
              <Table.Cell>
                <Flex align="center" gap="2">
                  <BoxIcon />
                  {item.product}
                </Flex>
              </Table.Cell>
              <Table.Cell>{item.productCategory}</Table.Cell>
              <Table.Cell>
                <Badge variant="outline">{item.quantity} {t('units')}</Badge>
              </Table.Cell>
              <Table.Cell>
                <Text size="1">10</Text>
              </Table.Cell>
              <Table.Cell>
                <Text size="1">+20</Text>
              </Table.Cell>
              <Table.Cell>
                <Text size="1">-40</Text>
              </Table.Cell>
              <Table.Cell>
                <Text size="1">100</Text>
              </Table.Cell>
              <Table.Cell>{item.location}</Table.Cell>
              <Table.Cell>
                <Badge
                  color={item.status === 'Released' ? 'green' : 'red'}
                  variant="soft"
                >
                  {t(item.status.toLowerCase())}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <Flex align="center" gap="2">
                  <CalendarIcon />
                  {item.expiry}
                </Flex>
              </Table.Cell>
              <Table.Cell>
                <Badge variant="outline">{item.temperature}</Badge>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <NewReceiptModel isOpen={isNewReceiptOpen} onClose={() => setIsNewReceiptOpen(false)} />
      <ExportCSVModel isOpen={isExportCSVOpen} onClose={() => setIsExportCSVOpen(false)} />
    </Box>
  );
};

export default FinishedGoodsInventory;

/*

  - Released
  - Quarantined

*/