import React, { useState } from 'react';
import {
  Card,
  Flex,
  Heading,
  Text,
  Table,
  Grid,
  Box,
  Select,
  Button,
} from '@radix-ui/themes';
import { 
  FaBitcoin, 
  FaNetworkWired, 
  FaShieldAlt,
  FaChartLine,
  FaExchangeAlt,
  FaPercentage,
  FaHandshake 
} from 'react-icons/fa6';
import { IoMdCube } from 'react-icons/io';

interface SubItem {
  id: string;
  name: string;
  declaredPrice: number;
  actualCost: number;
  variance: string;
  incentives: string;
}

interface ItemGroup {
  id: string;
  title: string;
  subItems: SubItem[];
}

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
  const [selectedSupplier, setSelectedSupplier] = useState<string>('A');
  const [selectedProduct, setSelectedProduct] = useState<string>('A');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');

  const [supplierTier, setSupplierTier] = useState<string>('');
  const [transactionVolume, setTransactionVolume] = useState<string>('');
  const [componentCriticality, setComponentCriticality] = useState<string>('');
  const [supplierIncentives, setSupplierIncentives] = useState<string>('');

  const [items, setItems] = useState<ItemGroup[]>([
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

  const formatPrice = (value: number): string => {
    if (selectedCurrency === 'USD') {
      return `$${value.toLocaleString()}`;
    } else if (selectedCurrency === 'EGP') {
      return `EGP ${(value * exchangeRate).toLocaleString()}`;
    }
    return value.toString();
  };

  const handleSubItemChange = (
    groupId: string,
    subItemId: string,
    field: 'declaredPrice' | 'actualCost',
    value: string
  ): void => {
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

  const handleIncentivesChange = (groupId: string, subItemId: string, value: string): void => {
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

  const handleSubmitToBlockchain = (): void => {
    console.log('Submitting to blockchain:', {
      selectedSupplier,
      selectedProduct,
      items,
      supplierTier,
      transactionVolume,
      componentCriticality,
      supplierIncentives
    });
    alert('Data submitted to blockchain successfully!');
  };

  const cardColors = [
    'bg-blue-50 border-blue-200',
    'bg-green-50 border-green-200',
    'bg-purple-50 border-purple-200',
    'bg-amber-50 border-amber-200'
  ];

  return (
    <Box p="6" className="bg-gray-50 min-h-screen">
      <Flex justify="between" align="center" mb="5" wrap="wrap" gap="3">
        <Heading size="6" className="text-gray-800">Open Book Accounting Overview</Heading>

        <Flex gap="3" align="center" wrap="wrap">
          <Select.Root value={selectedSupplier} onValueChange={setSelectedSupplier}>
            <Select.Trigger 
              className="w-40 bg-white border border-gray-300 rounded-md shadow-sm"
              aria-label="Select Supplier"
            />
            <Select.Content>
              {suppliers.map((s) => (
                <Select.Item key={s} value={s}>
                  Supplier {s}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>

          <Select.Root value={selectedProduct} onValueChange={setSelectedProduct}>
            <Select.Trigger 
              className="w-40 bg-white border border-gray-300 rounded-md shadow-sm"
              aria-label="Select Product"
            />
            <Select.Content>
              {products.map((p) => (
                <Select.Item key={p} value={p}>
                  Product {p}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>

          <Flex align="center" gap="2" className="bg-white p-1 rounded-md border border-gray-300">
            {currencies.map((c) => (
              <Button
                key={c}
                variant={selectedCurrency === c ? 'solid' : 'soft'}
                className={`${selectedCurrency === c ? 'bg-blue-600' : 'bg-white hover:bg-gray-100'}`}
                onClick={() => setSelectedCurrency(c)}
              >
                {c}
              </Button>
            ))}
          </Flex>
        </Flex>
      </Flex>

      <Grid columns="4" gap="4" mb="5">
        <Card className={`${cardColors[0]} border`}>
          <Flex direction="column" gap="2">
            <Flex align="center" gap="2">
              <FaShieldAlt className="text-blue-600" />
              <Text size="2" weight="bold" className="text-blue-700">Supplier Tier</Text>
            </Flex>
            <Select.Root value={supplierTier} onValueChange={setSupplierTier}>
              <Select.Trigger 
                className="bg-white border border-gray-300"
                placeholder="Select Tier"
              />
              <Select.Content>
                {SupplierTierOptions.map((tier) => (
                  <Select.Item key={tier} value={tier}>
                    {tier}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Flex>
        </Card>

        <Card className={`${cardColors[1]} border`}>
          <Flex direction="column" gap="2">
            <Flex align="center" gap="2">
              <FaChartLine className="text-green-600" />
              <Text size="2" weight="bold" className="text-green-700">Transaction Volume</Text>
            </Flex>
            <input
              type="number"
              placeholder="Enter volume"
              value={transactionVolume}
              onChange={(e) => setTransactionVolume(e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </Flex>
        </Card>

        <Card className={`${cardColors[2]} border`}>
          <Flex direction="column" gap="2">
            <Flex align="center" gap="2">
              <FaExchangeAlt className="text-purple-600" />
              <Text size="2" weight="bold" className="text-purple-700">Component Criticality</Text>
            </Flex>
            <Select.Root value={componentCriticality} onValueChange={setComponentCriticality}>
              <Select.Trigger 
                className="bg-white border border-gray-300"
                placeholder="Select criticality"
              />
              <Select.Content>
                {ComponentCriticalityOptions.map((level) => (
                  <Select.Item key={level} value={level}>
                    {level}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Flex>
        </Card>

        <Card className={`${cardColors[3]} border`}>
          <Flex direction="column" gap="2">
            <Flex align="center" gap="2">
              <FaHandshake className="text-amber-600" />
              <Text size="2" weight="bold" className="text-amber-700">Supplier Incentives</Text>
            </Flex>
            <input
              type="number"
              placeholder="Enter amount"
              value={supplierIncentives}
              onChange={(e) => setSupplierIncentives(e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </Flex>
        </Card>
      </Grid>

      <Table.Root variant="surface" className="shadow-sm">
        <Table.Header className="bg-gray-100">
          <Table.Row>
            <Table.ColumnHeaderCell className="font-bold text-gray-800">Item</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="font-bold text-gray-800">
              <Flex align="center" gap="2">
                Declared Price
                <FaBitcoin className="text-green-600" title="Blockchain Verified"/>
              </Flex>
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="font-bold text-gray-800">
              <Flex align="center" gap="2">
                Actual Cost
                <FaNetworkWired className="text-blue-500" title="IoT Sensors Data"/>
              </Flex>
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="font-bold text-gray-800">
              <Flex align="center" gap="2">
                Variance
                <FaPercentage className="text-purple-500" title="Percentage Difference"/>
              </Flex>
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="font-bold text-gray-800">Incentives</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {items.map((group) => (
            <React.Fragment key={group.id}>
              <Table.Row className="bg-gray-50">
                <Table.Cell
                  colSpan={5}
                  className="font-bold text-gray-800"
                >
                  {group.title}
                </Table.Cell>
              </Table.Row>

              {group.subItems.map((item) => (
                <Table.Row key={item.id} className="hover:bg-gray-50">
                  <Table.Cell className="pl-6 text-gray-700">{item.name}</Table.Cell>

                  <Table.Cell>
                    <input
                      type="number"
                      value={item.declaredPrice}
                      onChange={(e) =>
                        handleSubItemChange(group.id, item.id, 'declaredPrice', e.target.value)
                      }
                      className="w-full bg-transparent font-semibold focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                    />
                  </Table.Cell>

                  <Table.Cell>
                    <input
                      type="number"
                      value={item.actualCost}
                      onChange={(e) =>
                        handleSubItemChange(group.id, item.id, 'actualCost', e.target.value)
                      }
                      className="w-full bg-transparent font-semibold focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                    />
                  </Table.Cell>

                  <Table.Cell className={`font-bold ${
                    item.variance.startsWith('-') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {item.variance}
                  </Table.Cell>

                  <Table.Cell>
                    <Select.Root
                      value={item.incentives}
                      onValueChange={(value) => handleIncentivesChange(group.id, item.id, value)}
                    >
                      <Select.Trigger 
                        className="w-full border border-gray-300"
                        placeholder="Select incentive"
                      />
                      <Select.Content>
                        {incentivesOptions.map((inc) => (
                          <Select.Item key={inc} value={inc}>
                            {inc}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>
                  </Table.Cell>
                </Table.Row>
              ))}
            </React.Fragment>
          ))}
        </Table.Body>
      </Table.Root>

      <Flex justify="end" mt="6">
        <Button 
          size="3" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md shadow-sm transition-colors flex items-center gap-2"
          onClick={handleSubmitToBlockchain}
        >
          <IoMdCube />
          Submit to Blockchain
        </Button>
      </Flex>
    </Box>
  );
};

export default BatchCosting;
