import React, { useState } from 'react';
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
import * as Tabs from '@radix-ui/react-tabs';

const suppliers = ['A', 'B', 'C'];
const products = ['A', 'B', 'C'];
const currencies = ['USD', 'EGP'];

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
  const [selectedSupplier, setSelectedSupplier] = useState('A');
  const [selectedProduct, setSelectedProduct] = useState('A');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  const [supplierTier, setSupplierTier] = useState('');
  const [transactionVolume, setTransactionVolume] = useState('');
  const [componentCriticality, setComponentCriticality] = useState('');
  const [supplierIncentives, setSupplierIncentives] = useState('');

  const [items, setItems] = useState([
    {
      id: 'direct-material',
      title: 'Direct Material',
      subItems: [
        { id: 'vitB1', name: 'Vitamin B1', declaredPrice: 220, actualCost: 200, variance: '-9.1%', incentives: '' },
        { id: 'vitB2', name: 'Vitamin B2', declaredPrice: 320, actualCost: 315, variance: '-1.6%', incentives: '' },
        { id: 'vitB12', name: 'Vitamin B12', declaredPrice: 260, actualCost: 250, variance: '-3.8%', incentives: '' },
      ],
    },
    {
      id: 'other-material',
      title: 'Other Material',
      subItems: [
        { id: 'item2sub1', name: 'Sample X', declaredPrice: 100, actualCost: 90, variance: '-10%', incentives: '' },
      ],
    },
  ]);

  const exchangeRate = 30;

  const formatPrice = (value: number) => {
    if (selectedCurrency === 'USD') {
      return `$${value.toLocaleString()}`;
    } else if (selectedCurrency === 'EGP') {
      return `EGP ${ (value * exchangeRate).toLocaleString() }`;
    }
    return value.toString();
  };

  // Handle editing declared price or actual cost
  const handleSubItemChange = (
    groupId: string,
    subItemId: string,
    field: 'declaredPrice' | 'actualCost',
    value: string
  ) => {
    setItems((prevItems) =>
      prevItems.map((group) => {
        if (group.id !== groupId) return group;
        return {
          ...group,
          subItems: group.subItems.map((sub) => {
            if (sub.id !== subItemId) return sub;
            const numericValue = parseFloat(value);
            const updatedSub = {
              ...sub,
              [field]: isNaN(numericValue) ? 0 : numericValue,
            };
            // Update variance on change
            const diff = updatedSub.actualCost - updatedSub.declaredPrice;
            const variancePercent =
              updatedSub.declaredPrice === 0
                ? '0%'
                : ((diff / updatedSub.declaredPrice) * 100).toFixed(1) + '%';
            updatedSub.variance = variancePercent.startsWith('-') ? variancePercent : '+' + variancePercent;
            return updatedSub;
          }),
        };
      })
    );
  };

  // Handle incentives change
  const handleIncentivesChange = (groupId: string, subItemId: string, value: string) => {
    setItems((prevItems) =>
      prevItems.map((group) => {
        if (group.id !== groupId) return group;
        return {
          ...group,
          subItems: group.subItems.map((sub) => {
            if (sub.id !== subItemId) return sub;
            return {
              ...sub,
              incentives: value,
            };
          }),
        };
      })
    );
  };

  const tabTriggerStyle = (isSelected: boolean): React.CSSProperties => ({
    padding: '8px 16px',
    borderRadius: 6,
    backgroundColor: isSelected ? '#2563eb' : '#e0e7ff',
    color: isSelected ? 'white' : '#1e293b',
    cursor: 'pointer',
    fontWeight: 600,
    border: 'none',
  });

  return (
    <Box p="6">
      <Flex justify="between" align="center" mb="5" wrap="wrap" gap="3">
        <Heading size="6">Open Book Accounting Overview</Heading>

        <Flex gap="3" align="center" wrap="wrap">
          {/* Supplier Tabs */}
          <Tabs.Root
            value={selectedSupplier}
            onValueChange={setSelectedSupplier}
          >
            <Tabs.List
              aria-label="Suppliers"
              style={{ display: 'flex', gap: 10, marginRight: 10 }}
            >
              {suppliers.map((s) => (
                <Tabs.Trigger
                  key={s}
                  value={s}
                  style={tabTriggerStyle(selectedSupplier === s)}
                >
                  Supplier {s}
                </Tabs.Trigger>
              ))}
            </Tabs.List>
          </Tabs.Root>

          {/* Product Tabs */}
          <Tabs.Root value={selectedProduct} onValueChange={setSelectedProduct}>
            <Tabs.List
              aria-label="Products"
              style={{ display: 'flex', gap: 10, marginRight: 10 }}
            >
              {products.map((p) => (
                <Tabs.Trigger
                  key={p}
                  value={p}
                  style={tabTriggerStyle(selectedProduct === p)}
                >
                  Product {p}
                </Tabs.Trigger>
              ))}
            </Tabs.List>
          </Tabs.Root>

          {/* Currency Tabs */}
          <Tabs.Root value={selectedCurrency} onValueChange={setSelectedCurrency}>
            <Tabs.List aria-label="Currencies" style={{ display: 'flex', gap: 10 }}>
              {currencies.map((c) => (
                <Tabs.Trigger
                  key={c}
                  value={c}
                  style={tabTriggerStyle(selectedCurrency === c)}
                >
                  {c}
                </Tabs.Trigger>
              ))}
            </Tabs.List>
          </Tabs.Root>
        </Flex>
      </Flex>

      <Grid columns="4" gap="4" mb="5">
        <Card>
          <Flex direction="column" gap="2">
            <Text size="2" weight="bold">Supplier Tier</Text>
            <select
              value={supplierTier}
              onChange={(e) => setSupplierTier(e.target.value)}
              style={{
                padding: '8px 12px',
                fontSize: 14,
                borderRadius: 6,
                border: '1px solid #ccc',
                fontWeight: 600,
                width: '100%',
                boxSizing: 'border-box',
                cursor: 'pointer',
              }}
            >
              <option value="" disabled>
                Select Tier
              </option>
              {SupplierTierOptions.map((tier) => (
                <option key={tier} value={tier}>
                  {tier}
                </option>
              ))}
            </select>
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
            <select
              value={componentCriticality}
              onChange={(e) => setComponentCriticality(e.target.value)}
              style={{
                padding: '8px 12px',
                fontSize: 14,
                borderRadius: 6,
                border: '1px solid #ccc',
                fontWeight: 600,
                width: '100%',
                boxSizing: 'border-box',
                cursor: 'pointer',
              }}
            >
              <option value="" disabled>
                Select criticality
              </option>
              {ComponentCriticalityOptions.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
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

      <Table.Root variant="surface" style={{ marginBottom: 24 }}>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Item</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>
              Declared Price
              <div style={{ fontSize: 12, color: '#10b981', fontWeight: '600' }}>
                via blockchain
              </div>
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actual Cost</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Variance</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Incentives</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {items.map((group) => (
            <React.Fragment key={group.id}>
              <Table.Row>
                <Table.Cell
                  colSpan={5}
                  style={{ fontWeight: 'bold', color: 'black', backgroundColor: '#f0f4f8' }}
                >
                  {group.title}
                </Table.Cell>
              </Table.Row>

              {group.subItems.map((item, index) => (
                <Table.Row key={item.id}>
                  <Table.Cell style={{ paddingLeft: 24 }}>{item.name}</Table.Cell>

                  <Table.Cell>
                    <input
                      type="number"
                      value={item.declaredPrice}
                      onChange={(e) =>
                        handleSubItemChange(group.id, item.id, 'declaredPrice', e.target.value)
                      }
                      style={{
                        width: '100%',
                        border: 'none',
                        background: 'transparent',
                        fontWeight: 600,
                        outline: 'none',
                      }}
                    />
                  </Table.Cell>

                  <Table.Cell>
                    <input
                      type="number"
                      value={item.actualCost}
                      onChange={(e) =>
                        handleSubItemChange(group.id, item.id, 'actualCost', e.target.value)
                      }
                      style={{
                        width: '100%',
                        border: 'none',
                        background: 'transparent',
                        fontWeight: 600,
                        outline: 'none',
                      }}
                    />
                  </Table.Cell>

                  <Table.Cell style={{ color: item.variance.startsWith('-') ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>
                    {item.variance}
                  </Table.Cell>

                  <Table.Cell>
                    <select
                      value={item.incentives}
                      onChange={(e) => handleIncentivesChange(group.id, item.id, e.target.value)}
                      style={{
                        padding: '4px 8px',
                        fontSize: 14,
                        borderRadius: 6,
                        border: '1px solid #ccc',
                        width: '100%',
                        cursor: 'pointer',
                      }}
                    >
                      <option value="">Select incentive</option>
                      {incentivesOptions.map((inc) => (
                        <option key={inc} value={inc}>
                          {inc}
                        </option>
                      ))}
                    </select>
                  </Table.Cell>
                </Table.Row>
              ))}
            </React.Fragment>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

export default BatchCosting;
