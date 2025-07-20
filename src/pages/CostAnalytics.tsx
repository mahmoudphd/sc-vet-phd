// src/pages/CostAnalytics.tsx

import { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  Flex,
  Grid,
  Heading,
  Progress,
  Switch,
  Table,
  Text,
  Select as RadixSelect,
  TextField,
} from '@radix-ui/themes';
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  simulatedIoTCostData,
  Item,
  CostCategory,
} from './simulateIoTCostData';

const formatCurrency = (value: number, currency: string) =>
  `${currency} ${value.toFixed(2)}`;

const categories: CostCategory[] = [
  'Direct Materials',
  'Packaging Materials',
  'Direct Labor',
  'Overhead',
  'Other Costs',
];

const products = ['Product A', 'Product B', 'Product C'];

const solutionsOptions = [
  'Negotiating better prices with supplier',
  'Reducing waste in material usage',
  'Automation to reduce manual labor costs',
  'Optimizing machine usage',
  'Improving inventory management',
  'Minimize transportation costs',
  'Reduce rework costs',
  'Other',
];

const getDetailsByCategory = (category: CostCategory): Item[] => {
  switch (category) {
    case 'Direct Materials':
      return simulatedIoTCostData.rawMaterials;
    case 'Packaging Materials':
      return simulatedIoTCostData.packagingMaterials;
    case 'Direct Labor':
      return simulatedIoTCostData.directLabor;
    case 'Overhead':
      return simulatedIoTCostData.overheadItems;
    case 'Other Costs':
      return simulatedIoTCostData.otherCosts;
    default:
      return [];
  }
};
export default function CostAnalytics() {
  const [dialogCategory, setDialogCategory] = useState<CostCategory | null>(null);
  const [benchmarkPrice, setBenchmarkPrice] = useState(220);
  const [profitMargin, setProfitMargin] = useState(25);
  const [currency, setCurrency] = useState<'EGP' | 'USD'>('EGP');
  const [mainAutoMode, setMainAutoMode] = useState(true);
  const [dialogAutoMode, setDialogAutoMode] = useState<Record<CostCategory, boolean>>({
    'Direct Materials': true,
    'Packaging Materials': true,
    'Direct Labor': true,
    'Overhead': true,
    'Other Costs': true,
  });
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [solutions, setSolutions] = useState<Record<string, Record<number, string>>>({});
  const [dialogData, setDialogData] = useState<Record<CostCategory, Item[]>>({
    'Direct Materials': getDetailsByCategory('Direct Materials'),
    'Packaging Materials': getDetailsByCategory('Packaging Materials'),
    'Direct Labor': getDetailsByCategory('Direct Labor'),
    'Overhead': getDetailsByCategory('Overhead'),
    'Other Costs': getDetailsByCategory('Other Costs'),
  });
  const [showCostGap, setShowCostGap] = useState(true);

  const totals = simulatedIoTCostData.totals;
  const totalActual = categories.reduce((sum, category) => sum + totals[category].actual, 0);
  const totalTarget = categories.reduce((sum, category) => sum + totals[category].budget, 0);
  const totalCostAfter = categories.reduce((sum, category) => sum + totals[category].costAfter, 0);
  const targetCost = benchmarkPrice * (1 - profitMargin / 100);
  const postOptimizationEstimate = totalCostAfter * (1 - profitMargin / 100);

  const benchmarkTrendData = [
    { month: 'Jan', actual: 169.61, benchmark: benchmarkPrice },
    { month: 'Feb', actual: 170.5, benchmark: benchmarkPrice },
    { month: 'Mar', actual: 168.0, benchmark: benchmarkPrice },
    { month: 'Apr', actual: 171.2, benchmark: benchmarkPrice },
    { month: 'May', actual: totalActual, benchmark: benchmarkPrice },
  ];

  const benchmarkTrendDataWithGap = benchmarkTrendData.map((d) => ({
    ...d,
    targetCost,
    gap: d.actual - targetCost,
  }));
  const handleSolutionChange = (category: CostCategory, index: number, value: string) => {
    setSolutions((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [index]: value,
      },
    }));
  };

  const updateDialogItem = (category: CostCategory, index: number, field: keyof Item, value: number) => {
    setDialogData((prev) => {
      const updated = [...prev[category]];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, [category]: updated };
    });
  };

  const submitToBlockchain = (category: CostCategory) => {
    console.log(`Submitting ${category} data to blockchain...`, dialogData[category]);
    alert(`Submitted ${category} data to blockchain (mock).`);
  };

  return (
    <Box p="4">
      <Heading mb="4">Inter-Organizational Cost Management</Heading>

      <Button variant="surface" onClick={() => setShowCostGap((prev) => !prev)}>
        {showCostGap ? 'Hide Cost Gap' : 'Show Cost Gap'}
      </Button>

      {categories.map((category) => (
        <Dialog.Root
          key={category}
          open={dialogCategory === category}
          onOpenChange={() => setDialogCategory(null)}
        >
          <Dialog.Content style={{ maxWidth: 800 }}>
            <Dialog.Title>{category} Breakdown</Dialog.Title>
            <Flex gap="2" mb="2" align="center">
              <Text>Auto Mode</Text>
              <Switch
                checked={dialogAutoMode[category]}
                onCheckedChange={(checked) =>
                  setDialogAutoMode((prev) => ({ ...prev, [category]: checked }))
                }
              />
            </Flex>
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Item</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Qty</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Unit Price</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Cost</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {dialogData[category]?.map((item, idx) => (
                  <Table.Row key={idx}>
                    <Table.Cell>{item.name}</Table.Cell>
                    <Table.Cell>
                      <TextField.Root>
                        <TextField.Input
                          type="number"
                          value={item.qty ?? 0}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            updateDialogItem(category, idx, 'qty', parseFloat(e.target.value))
                          }
                          disabled={dialogAutoMode[category]}
                          style={{ width: '80px' }}
                        />
                      </TextField.Root>
                    </Table.Cell>
                    <Table.Cell>
                      <TextField.Root>
                        <TextField.Input
                          type="number"
                          value={item.unitPrice ?? 0}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            updateDialogItem(category, idx, 'unitPrice', parseFloat(e.target.value))
                          }
                          disabled={dialogAutoMode[category]}
                          style={{ width: '80px' }}
                        />
                      </TextField.Root>
                    </Table.Cell>
                    <Table.Cell>
                      {formatCurrency((item.qty ?? 0) * (item.unitPrice ?? 0), currency)}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
            <Flex mt="4" gap="2" justify="end">
              <Button variant="surface" onClick={() => submitToBlockchain(category)}>
                Submit to Blockchain
              </Button>
              <Dialog.Close>
                <Button variant="soft">Close</Button>
              </Dialog.Close>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      ))}
    </Box>
  );
}
