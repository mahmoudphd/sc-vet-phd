import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  Flex,
  Heading,
  Text,
  Table,
  Badge,
  Button,
  Grid,
  Progress,
  Box,
} from '@radix-ui/themes';

import * as Select from '@radix-ui/react-select';

import { PieChartIcon, BarChartIcon, MixerHorizontalIcon } from '@radix-ui/react-icons';
import { PieChart, Pie, BarChart, Bar } from 'recharts';

const dropdownTriggerStyle: React.CSSProperties = {
  minWidth: 140,
  padding: '8px 12px',
  borderRadius: 6,
  border: 'none',
  backgroundColor: '#2563eb',
  fontSize: 14,
  fontWeight: 600,
  color: 'white',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  boxShadow: '0 2px 6px rgba(37, 99, 235, 0.6)',
  transition: 'background-color 0.2s ease',
};

const dropdownContentStyle: React.CSSProperties = {
  backgroundColor: 'white',
  borderRadius: 6,
  boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
  padding: '8px 0',
  minWidth: 140,
  zIndex: 1000,
};

const dropdownItemStyle: React.CSSProperties = {
  padding: '8px 12px',
  cursor: 'pointer',
  fontSize: 14,
  borderRadius: 4,
  fontWeight: 600,
  textTransform: 'capitalize',
  color: '#1e293b',
};

const BatchCosting = () => {
  const { t } = useTranslation('batch-costing');

  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  const suppliers = ['a', 'b', 'c'];
  const products = ['a', 'b', 'c'];
  const currencies = [
    { value: 'USD', label: 'Dollar (USD)' },
    { value: 'EGP', label: 'Egyptian Pound (EGP)' },
  ];

  const batches = [
    {
      id: 'VC23001',
      product: 'Anthelmintic Oral Suspension',
      materialCost: 24500,
      laborCost: 12000,
      overhead: 8500,
      totalCost: 45000,
      costPerUnit: 3.15,
      variance: '-2.5%',
    },
  ];

  return (
    <Box p="6">
      <Flex justify="between" align="center" mb="5">
        <Heading size="6">Open Book Accounting Overview</Heading>
        <Flex gap="3" align="center">
          {/* Supplier Dropdown */}
          <Select.Root value={selectedSupplier} onValueChange={setSelectedSupplier}>
            <Select.Trigger
              aria-label={t('selectSupplier') || 'Supplier'}
              style={dropdownTriggerStyle}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#3b82f6')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
            >
              <Select.Value placeholder="Supplier" />
              <Select.Icon />
            </Select.Trigger>
            <Select.Content style={dropdownContentStyle}>
              {suppliers.map((sup) => (
                <Select.Item
                  key={sup}
                  value={sup}
                  style={dropdownItemStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#dbeafe';
                    e.currentTarget.style.color = '#2563eb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#1e293b';
                  }}
                >
                  <Select.ItemText>{`Supplier ${sup.toUpperCase()}`}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>

          {/* Product Dropdown */}
          <Select.Root value={selectedProduct} onValueChange={setSelectedProduct}>
            <Select.Trigger
              aria-label={t('selectProduct') || 'Product'}
              style={dropdownTriggerStyle}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#3b82f6')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
            >
              <Select.Value placeholder="Product" />
              <Select.Icon />
            </Select.Trigger>
            <Select.Content style={dropdownContentStyle}>
              {products.map((prod) => (
                <Select.Item
                  key={prod}
                  value={prod}
                  style={dropdownItemStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#dbeafe';
                    e.currentTarget.style.color = '#2563eb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#1e293b';
                  }}
                >
                  <Select.ItemText>{`Product ${prod.toUpperCase()}`}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>

          {/* Currency Dropdown */}
          <Select.Root value={selectedCurrency} onValueChange={setSelectedCurrency}>
            <Select.Trigger
              aria-label={t('selectCurrency') || 'Currency'}
              style={dropdownTriggerStyle}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#3b82f6')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
            >
              <Select.Value placeholder="Currency" />
              <Select.Icon />
            </Select.Trigger>
            <Select.Content style={dropdownContentStyle}>
              {currencies.map(({ value, label }) => (
                <Select.Item
                  key={value}
                  value={value}
                  style={dropdownItemStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#dbeafe';
                    e.currentTarget.style.color = '#2563eb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#1e293b';
                  }}
                >
                  <Select.ItemText>{label}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </Flex>
      </Flex>

      {/* باقي الصفحة كما هي ... */}
      <Grid columns="4" gap="4" mb="5">
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">{t('avgCostUnit')}</Text>
            <Heading size="7">$3.45</Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">{t('yieldVariance')}</Text>
            <Heading size="7" className="text-green-500">
              -1.8%
            </Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">{t('materialWaste')}</Text>
            <Heading size="7">4.5%</Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">{t('batchEfficiency')}</Text>
            <Progress value={88} />
          </Flex>
        </Card>
      </Grid>

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>{t('batchID')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('materialCost')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('conversionCost')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('totalCost')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('costPerUnit')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('variance')}</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {batches.map((batch) => (
            <Table.Row key={batch.id}>
              <Table.Cell>{batch.id}</Table.Cell>
              <Table.Cell>${batch.materialCost.toLocaleString()}</Table.Cell>
              <Table.Cell>${(batch.laborCost + batch.overhead).toLocaleString()}</Table.Cell>
              <Table.Cell>${batch.totalCost.toLocaleString()}</Table.Cell>
              <Table.Cell>${batch.costPerUnit}</Table.Cell>
              <Table.Cell>
                <Badge color={batch.variance.startsWith('-') ? 'green' : 'red'}>
                  {batch.variance}
                </Badge>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <Flex mt="5" gap="4">
        <Card style={{ flex: 1 }}>
          <Heading size="4" mb="3">
            {t('costBreakdown')}
          </Heading>
          <div className="h-64">
            <BarChart width={500} height={250} data={batches}>
              <Bar dataKey="materialCost" fill="#3b82f6" name={t('material')} />
              <Bar dataKey="laborCost" fill="#ef4444" name={t('labor')} />
              <Bar dataKey="overhead" fill="#10b981" name={t('overhead')} />
            </BarChart>
          </div>
        </Card>
        <Card style={{ flex: 1 }}>
          <Heading size="4" mb="3">
            {t('varianceAnalysis')}
          </Heading>
          <div className="h-64">
            <PieChart width={300} height={250}>
              <Pie
                data={[
                  { name: t('material'), value: 65 },
                  { name: t('labor'), value: 25 },
                  { name: t('overhead'), value: 10 },
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

export default BatchCosting;
