import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Dialog,
  Flex,
  Grid,
  Heading,
  Select,
  Table,
  Text,
  TextField,
  TextArea,
} from '@radix-ui/themes';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

const supplierIncentiveOptions = [
  'Greater volumes',
  'Longer contracts',
  'Technical support',
  'Marketing support',
  'Negotiation support',
  'Joint problem solving teams',
];

const OpenBookAccountingDashboard = () => {
  const [supplier, setSupplier] = useState('');
  const [product, setProduct] = useState('');
  const [currency, setCurrency] = useState('EGP');
  const [cards, setCards] = useState({
    tier: 'Tier 1',
    volume: '12000',
    criticality: 'High',
    incentives: 'Longer contracts',
  });
  const [productionDesign, setProductionDesign] = useState('');
  const [transactions, setTransactions] = useState([
    { 
      date: '', 
      item: '', 
      material: '', 
      declaredCost: '', 
      actualCost: '', 
      incentive: '' 
    }
  ]);

  const relationshipMetrics = [
    { metric: 'Transparency', score: 85 },
    { metric: 'Cost Accuracy', score: 78 },
    { metric: 'Delivery', score: 92 },
    { metric: 'Communication', score: 88 },
    { metric: 'Innovation', score: 75 },
  ];

  const handleCardChange = (key: string, value: string) => {
    setCards({ ...cards, [key]: value });
  };

  const handleTransactionChange = (index: number, field: string, value: string) => {
    const updatedTransactions = [...transactions];
    updatedTransactions[index] = { ...updatedTransactions[index], [field]: value };
    setTransactions(updatedTransactions);
  };

  const addTransactionRow = () => {
    setTransactions([...transactions, { 
      date: '', 
      item: '', 
      material: '', 
      declaredCost: '', 
      actualCost: '', 
      incentive: '' 
    }]);
  };

  const calculateVariance = (declared: string, actual: string) => {
    const dec = parseFloat(declared) || 0;
    const act = parseFloat(actual) || 0;
    return (act - dec).toFixed(2);
  };

  const handleSubmitAll = () => {
    // Submit logic here
    console.log('Submitting all data', { supplier, product, cards, transactions });
  };

  return (
    <Box p="4">
      {/* Header Section */}
      <Flex justify="between" align="center" mb="4">
        <Heading size="7">Open Book Accounting Dashboard</Heading>
        <Flex gap="3">
          <Select.Root value={supplier} onValueChange={setSupplier}>
            <Select.Trigger placeholder="Select Supplier" />
            <Select.Content>
              <Select.Item value="Supplier A">Supplier A</Select.Item>
              <Select.Item value="Supplier B">Supplier B</Select.Item>
              <Select.Item value="Supplier C">Supplier C</Select.Item>
            </Select.Content>
          </Select.Root>
          <Select.Root value={product} onValueChange={setProduct}>
            <Select.Trigger placeholder="Select Product" />
            <Select.Content>
              <Select.Item value="Product X">Product X</Select.Item>
              <Select.Item value="Product Y">Product Y</Select.Item>
            </Select.Content>
          </Select.Root>
          <Select.Root value={currency} onValueChange={setCurrency}>
            <Select.Trigger />
            <Select.Content>
              <Select.Item value="EGP">EGP</Select.Item>
              <Select.Item value="USD">USD</Select.Item>
            </Select.Content>
          </Select.Root>
        </Flex>
      </Flex>

      {/* KPI Cards */}
      <Grid columns={{ initial: '1', md: '4' }} gap="3" mb="4">
        <Card>
          <Text size="2" weight="bold">Supplier Tier</Text>
          <TextField.Root>
            <TextField.Input 
              value={cards.tier} 
              onChange={(e) => handleCardChange('tier', e.target.value)} 
            />
          </TextField.Root>
        </Card>
        <Card>
          <Text size="2" weight="bold">Transaction Volume</Text>
          <TextField.Root>
            <TextField.Input 
              value={cards.volume} 
              onChange={(e) => handleCardChange('volume', e.target.value)} 
            />
          </TextField.Root>
        </Card>
        <Card>
          <Text size="2" weight="bold">Component Criticality</Text>
          <TextField.Root>
            <TextField.Input 
              value={cards.criticality} 
              onChange={(e) => handleCardChange('criticality', e.target.value)} 
            />
          </TextField.Root>
        </Card>
        <Card>
          <Text size="2" weight="bold">Supplier Incentives Offered</Text>
          <Select.Root 
            value={cards.incentives} 
            onValueChange={(val) => handleCardChange('incentives', val)}
          >
            <Select.Trigger />
            <Select.Content>
              {supplierIncentiveOptions.map((option) => (
                <Select.Item key={option} value={option}>{option}</Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </Card>
      </Grid>

      {/* Production Design Info Section */}
      <Box mt="5">
        <Heading size="4" mb="3">Production Design Info</Heading>
        <Text as="p" mb="2">
          Please describe or update key production parameters or processes.
        </Text>
        <TextArea
          placeholder="e.g., Batch Size: 5000 units, Sterile Processing, etc."
          rows={3}
          value={productionDesign}
          onChange={(e) => setProductionDesign(e.target.value)}
        />
      </Box>

      {/* Transactions Table */}
      <Box mt="6">
        <Heading size="4" mb="3">Detailed Transactions</Heading>
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Item</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Material</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Declared Cost</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Actual Cost</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Variance</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Incentives</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {transactions.map((tx, index) => (
              <Table.Row key={index}>
                <Table.Cell>
                  <TextField.Input
                    type="date"
                    value={tx.date}
                    onChange={(e) => handleTransactionChange(index, 'date', e.target.value)}
                  />
                </Table.Cell>
                <Table.Cell>
                  <TextField.Input
                    value={tx.item}
                    onChange={(e) => handleTransactionChange(index, 'item', e.target.value)}
                  />
                </Table.Cell>
                <Table.Cell>
                  <TextField.Input
                    value={tx.material}
                    onChange={(e) => handleTransactionChange(index, 'material', e.target.value)}
                  />
                </Table.Cell>
                <Table.Cell>
                  <TextField.Input
                    type="number"
                    value={tx.declaredCost}
                    onChange={(e) => handleTransactionChange(index, 'declaredCost', e.target.value)}
                  />
                </Table.Cell>
                <Table.Cell>
                  <TextField.Input
                    type="number"
                    value={tx.actualCost}
                    onChange={(e) => handleTransactionChange(index, 'actualCost', e.target.value)}
                  />
                </Table.Cell>
                <Table.Cell>
                  {calculateVariance(tx.declaredCost, tx.actualCost)}
                </Table.Cell>
                <Table.Cell>
                  <Select.Root
                    value={tx.incentive}
                    onValueChange={(value) => handleTransactionChange(index, 'incentive', value)}
                  >
                    <Select.Trigger />
                    <Select.Content>
                      {supplierIncentiveOptions.map((option) => (
                        <Select.Item key={option} value={option}>{option}</Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
        <Button mt="3" onClick={addTransactionRow}>+ Add Transaction</Button>
      </Box>

      {/* Relationship Chart */}
      <Box mt="6">
        <Heading size="4">Supplier Relationship Quality</Heading>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={relationshipMetrics}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <Radar 
              name="Supplier" 
              dataKey="score" 
              stroke="#8884d8" 
              fill="#8884d8" 
              fillOpacity={0.6} 
            />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </Box>

      {/* Submit Button */}
      <Flex justify="end" mt="6">
        <Button onClick={handleSubmitAll}>Submit All</Button>
      </Flex>
    </Box>
  );
};

export default OpenBookAccountingDashboard;
