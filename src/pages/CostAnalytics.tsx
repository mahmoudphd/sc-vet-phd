import { useState, useEffect } from 'react';
import {
  Box, Button, Card, Flex, Grid, Heading, Progress, Select,
  Table, Text, TextField, Dialog
} from '@radix-ui/themes';
import {
  PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts';
import { simulatedIoTCostData } from './simulateIoTCostData';

type TotalsKey = keyof typeof simulatedIoTCostData.totals;

type GroupRow = {
  category: string;
  isGroup: true;
};

type DataRow = {
  category: string;
  value: number;
  actual: string;
  budget: string;
  costAfter: string;
  isGroup?: false;
};

type CostRow = GroupRow | DataRow;

const solutionOptions = [
  'Negotiating Better Prices With Supplier',
  'Reducing Waste In Material Usage',
  'Automation To Reduce Manual Labor Costs',
  'Optimizing Machine Usage',
  'Improving Inventory Management',
  'Minimize Transportation Costs',
  'Reduce Rework Costs',
  'Other'
];

const CostAnalysis = () => {
  const [currency, setCurrency] = useState<'EGP' | 'USD'>('EGP');
  const [mode, setMode] = useState<'manual' | 'auto'>('manual');
  const [benchmarkPrice, setBenchmarkPrice] = useState(220);
  const [profitMargin, setProfitMargin] = useState(25);
  const [showGap, setShowGap] = useState(false);
  const [solutions, setSolutions] = useState<Record<string, string>>({});
  const [showRawDialog, setShowRawDialog] = useState(false);

  const rawMaterials = simulatedIoTCostData.rawMaterials;

  const defaultCostData: CostRow[] = [
    { category: 'Direct Cost', isGroup: true },
    { category: 'Direct Materials', value: 45, actual: '133.11', budget: '140', costAfter: '120' },
    { category: 'Packaging Materials', value: 20, actual: '45', budget: '50', costAfter: '43' },
    { category: 'Direct Labor', value: 15, actual: '38', budget: '40', costAfter: '37' },
    { category: 'Overhead', isGroup: true },
    { category: 'Overhead', value: 12, actual: '30', budget: '32', costAfter: '29' },
    { category: 'Other Costs', isGroup: true },
    { category: 'Other Costs', value: 8, actual: '20', budget: '25', costAfter: '19' }
  ];

  const [costData, setCostData] = useState<CostRow[]>(defaultCostData);

  useEffect(() => {
    if (mode === 'auto') {
      const autoData = simulatedIoTCostData.totals;
      const mapped: CostRow[] = defaultCostData.map((item) => {
        if ('isGroup' in item && item.isGroup) return item;
        const key = item.category as TotalsKey;
        return {
          ...item,
          actual: autoData[key]?.actual?.toString() || item.actual,
          budget: autoData[key]?.budget?.toString() || item.budget,
          costAfter: autoData[key]?.costAfter?.toString() || item.costAfter
        };
      });
      setCostData(mapped);
    } else {
      setCostData(defaultCostData);
    }
  }, [mode]);

  const updateCostField = (index: number, field: 'actual' | 'budget' | 'costAfter', value: string) => {
    const updated = [...costData];
    if (!('isGroup' in updated[index])) {
      (updated[index] as DataRow)[field] = value;
      setCostData(updated);
    }
  };

  const formatCurrency = (num: number | string | undefined) => {
    const value = typeof num === 'string' ? parseFloat(num ?? '0') : num ?? 0;
    return `${currency} ${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  };

  const dataRows = costData.filter((i): i is DataRow => !('isGroup' in i));
  const totalActual = dataRows.reduce((sum, i) => sum + parseFloat(i.actual ?? '0'), 0);
  const totalBudget = dataRows.reduce((sum, i) => sum + parseFloat(i.budget ?? '0'), 0);
  const totalCostAfter = dataRows.reduce((sum, i) => sum + parseFloat(i.costAfter ?? '0'), 0);

  const targetCost = benchmarkPrice * (1 - profitMargin / 100);

  const benchmarkTrendData = [
    { month: 'Jan', actual: 169.61, benchmark: benchmarkPrice },
    { month: 'Feb', actual: 170.5, benchmark: benchmarkPrice },
    { month: 'Mar', actual: 168.0, benchmark: benchmarkPrice },
    { month: 'Apr', actual: 171.2, benchmark: benchmarkPrice },
    { month: 'May', actual: totalActual, benchmark: benchmarkPrice }
  ];

  const benchmarkTrendDataWithGap = benchmarkTrendData.map(d => ({
    ...d,
    targetCost,
    gap: d.actual - targetCost
  }));

  const averageGap = benchmarkTrendDataWithGap.reduce((sum, d) => sum + d.gap, 0) / benchmarkTrendDataWithGap.length;

  return (
    <Box p="6">
      <Dialog.Root open={showRawDialog} onOpenChange={setShowRawDialog}>
        <Dialog.Content maxWidth="800px">
          <Dialog.Title>Raw Materials Breakdown</Dialog.Title>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Composition</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Concentration (kg)</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Price/Kg</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Cost</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {rawMaterials.map((item, index) => (
                <Table.Row key={index}>
                  <Table.Cell>{item.name}</Table.Cell>
                  <Table.Cell>{item.weightKg}</Table.Cell>
                  <Table.Cell>{currency} {item.pricePerKg}</Table.Cell>
                  <Table.Cell>{currency} {item.cost}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
          <Flex justify="end" mt="4">
            <Button onClick={() => setShowRawDialog(false)}>Close</Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Box>
  );
};

export default CostAnalysis;
