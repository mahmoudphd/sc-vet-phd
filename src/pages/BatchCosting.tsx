import React, { useState, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
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
} from '@radix-ui/themes';
import * as Select from '@radix-ui/react-select';
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

const SupplierTierOptions = ['Tier 1', 'Tier 2', 'Tier 3'];
const ComponentCriticalityOptions = ['High', 'Medium', 'Low'];
const incentivesOptions = [
  'Greater volumes',
  'Longer contracts',
  'Technical support',
  'Marketing support',
  'Negotiation support',
  'Joint problem solving teams',
  'Shared Profit',
];

const BatchCosting = () => {
  const { t } = useTranslation('batch-costing');

  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  const [supplierTier, setSupplierTier] = useState('');
  const [transactionVolume, setTransactionVolume] = useState('');
  const [componentCriticality, setComponentCriticality] = useState('');
  const [supplierIncentives, setSupplierIncentives] = useState('');

  const [items, setItems] = useState([
    {
      id: 'Item1',
      declaredPrice: 1000,
      actualCost: 900,
      variance: '-10%',
      incentives: '',
    },
    {
      id: 'Item2',
      declaredPrice: 1500,
      actualCost: 1600,
      variance: '+6.7%',
      incentives: '',
    },
  ]);

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

  const handleTransactionVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTransactionVolume(e.target.value);
  };
  const handleSupplierIncentivesChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSupplierIncentives(e.target.value);
  };

  const handleIncentivesChange = (value: string, index: number) => {
    const updated = [...items];
    updated[index].incentives = value;
    setItems(updated);
  };

  return (
    <Box p="6">
      <Flex justify="between" align="center" mb="5" wrap="wrap" gap="3">
        <Heading size="6">Open Book Accounting Overview</Heading>
        <Flex gap="3" align="center" wrap="wrap">
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

      <Grid columns="4" gap="4" mb="5">
        <Card>
          <Flex direction="column" gap="2">
            <Text size="2" weight="bold">Supplier Tier</Text>
            <Select.Root value={supplierTier} onValueChange={setSupplierTier}>
              <Select.Trigger
                aria-label="Supplier Tier"
                style={{
                  ...dropdownTriggerStyle,
                  backgroundColor: 'white',
                  color: '#1e293b',
                  border: '1px solid #ccc',
                  boxShadow: 'none',
                  cursor: 'pointer',
                }}
              >
                <Select.Value placeholder="Select Tier" />
                <Select.Icon />
              </Select.Trigger>
              <Select.Content style={dropdownContentStyle}>
                {SupplierTierOptions.map((tier) => (
                  <Select.Item key={tier} value={tier} style={dropdownItemStyle}>
                    <Select.ItemText>{tier}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Flex>
        </Card>

        <Card>
          <Flex direction="column" gap="2">
            <Text size="2" weight="bold">Transaction Volume</Text>
            <input
              type="number"
              placeholder="Enter volume"
              value={transactionVolume}
              onChange={(e) => setTransactionVolume(e.target.value)}
              style={{
                padding: '8px 12px',
                fontSize: 14,
                borderRadius: 6,
                border: '1px solid #ccc',
                fontWeight: 600,
                width: '100%',
                boxSizing: 'border-box',
              }}
            />
          </Flex>
        </Card>

        <Card>
          <Flex direction="column" gap="2">
            <Text size="2" weight="bold">Component Criticality</Text>
            <Select.Root value={componentCriticality} onValueChange={setComponentCriticality}>
              <Select.Trigger
                aria-label="Component Criticality"
                style={{
                  ...dropdownTriggerStyle,
                  backgroundColor: 'white',
                  color: '#1e293b',
                  border: '1px solid #ccc',
                  boxShadow: 'none',
                  cursor: 'pointer',
                }}
              >
                <Select.Value placeholder="Select criticality" />
                <Select.Icon />
              </Select.Trigger>
              <Select.Content style={dropdownContentStyle}>
                {ComponentCriticalityOptions.map((level) => (
                  <Select.Item key={level} value={level} style={dropdownItemStyle}>
                    <Select.ItemText>{level}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Flex>
        </Card>

        <Card>
          <Flex direction="column" gap="2">
            <Text size="2" weight="bold">Supplier Incentives Offered</Text>
            <input
              type="number"
              placeholder="Enter amount"
              value={supplierIncentives}
              onChange={(e) => setSupplierIncentives(e.target.value)}
              style={{
                padding: '8px 12px',
                fontSize: 14,
                borderRadius: 6,
                border: '1px solid #ccc',
                fontWeight: 600,
                width: '100%',
                boxSizing: 'border-box',
              }}
            />
          </Flex>
        </Card>
      </Grid>

      {/* New Table with requested columns */}
      <Table.Root variant="surface" mb="6">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Item</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Declared Price via blockchain</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actual Cost</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Variance</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Incentives</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {items.map((item, i) => (
            <Table.Row key={item.id}>
              <Table.Cell>{item.id}</Table.Cell>
              <Table.Cell>${item.declaredPrice.toLocaleString()}</Table.Cell>
              <Table.Cell>${item.actualCost.toLocaleString()}</Table.Cell>
              <Table.Cell>
                <Badge color={item.variance.startsWith('-') ? 'green' : 'red'}>
                  {item.variance}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <Select.Root
                  value={item.incentives}
                  onValueChange={(value) => handleIncentivesChange(value, i)}
                >
                  <Select.Trigger
                    aria-label="Select incentive"
                    style={{
                      minWidth: 180,
                      padding: '6px 10px',
                      fontSize: 14,
                      borderRadius: 6,
                      border: '1px solid #ccc',
                      backgroundColor: 'white',
                      color: '#1e293b',
                      cursor: 'pointer',
                    }}
                  >
                    <Select.Value placeholder="Select incentive" />
                    <Select.Icon />
                  </Select.Trigger>
                  <Select.Content
                    style={{
                      backgroundColor: 'white',
                      borderRadius: 6,
                      boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                      minWidth: 180,
                      zIndex: 1000,
                    }}
                  >
                    {incentivesOptions.map((opt) => (
                      <Select.Item
                        key={opt}
                        value={opt}
                        style={{
                          padding: '8px 12px',
                          cursor: 'pointer',
                          fontSize: 14,
                          borderRadius: 4,
                          fontWeight: 600,
                          textTransform: 'capitalize',
                          color: '#1e293b',
                        }}
                      >
                        <Select.ItemText>{opt}</Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      {/* Existing charts and cards section */}
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
