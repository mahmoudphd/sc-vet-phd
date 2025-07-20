// src/pages/CostAnalytics.tsx

import React, { useState, useEffect } from 'react';
import {
  Box, Button, Card, Flex, Grid, Heading, Progress, Select,
  Table, Text, TextField, Dialog
} from '@radix-ui/themes';
import {
  PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts';
import { simulatedIoTCostData } from './simulateIoTCostData';

// ----------- Types -----------

type Item = {
  name: string;
  qty?: number;
  unitPrice?: number;
  cost: number;
  hours?: number;
  ratePerHour?: number;
  type?: string;
};

type CostCategory = 'Direct Materials' | 'Packaging Materials' | 'Direct Labor' | 'Overhead' | 'Other Costs';

type CostRow = {
  category: CostCategory;
  actual: string;
  budget: string;
  costAfter: string;
};

// ----------- Main Component -----------

const solutionOptions = [
  'Negotiating Better Prices With Supplier',
  'Reducing Waste In Material Usage',
  'Automation To Reduce Manual Labor Costs',
  'Optimizing Machine Usage',
  'Improving Inventory Management',
  'Minimize Transportation Costs',
  'Reduce Rework Costs',
  'Other',
];

const CostAnalysis = () => {
  const [currency, setCurrency] = useState<'EGP' | 'USD'>('EGP');
  const [mode, setMode] = useState<'manual' | 'auto'>('manual');
  const [benchmarkPrice, setBenchmarkPrice] = useState(220);
  const [profitMargin, setProfitMargin] = useState(25);
  const [solutions, setSolutions] = useState<Record<string, string>>({});
  const [dialogOpen, setDialogOpen] = useState<CostCategory | null>(null);

  const defaultCostData: CostRow[] = [
    { category: 'Direct Materials', actual: '133.11', budget: '140', costAfter: '120' },
    { category: 'Packaging Materials', actual: '18', budget: '20', costAfter: '16' },
    { category: 'Direct Labor', actual: '3', budget: '4', costAfter: '3.2' },
    { category: 'Overhead', actual: '0.5', budget: '1', costAfter: '0.4' },
    { category: 'Other Costs', actual: '10', budget: '12', costAfter: '9' },
  ];
  const [costData, setCostData] = useState<CostRow[]>(defaultCostData);

  useEffect(() => {
    if (mode === 'auto') {
      const totals = simulatedIoTCostData.totals;
      const newData = costData.map(row => {
        const category = row.category as CostCategory;
        const totalEntry = totals[category];
        return {
          ...row,
          actual: totalEntry?.actual.toString() || row.actual,
          budget: totalEntry?.budget.toString() || row.budget,
          costAfter: totalEntry?.costAfter.toString() || row.costAfter,
        };
      });
      setCostData(newData);
    } else {
      setCostData(defaultCostData);
    }
  }, [mode]);

  const updateCostField = (index: number, field: keyof CostRow, value: string) => {
    const newCostData = [...costData];
    newCostData[index][field] = value;
    setCostData(newCostData);
  };

  const formatCurrency = (val: string | number) => {
    const num = typeof val === 'string' ? parseFloat(val) : val;
    return `${currency} ${num.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  };

  const totalActual = costData.reduce((sum, row) => sum + parseFloat(row.actual), 0);
  const totalBudget = costData.reduce((sum, row) => sum + parseFloat(row.budget), 0);
  const totalCostAfter = costData.reduce((sum, row) => sum + parseFloat(row.costAfter), 0);

  const targetCost = benchmarkPrice * (1 - profitMargin / 100);

  const benchmarkTrendData = [
    { month: 'Jan', actual: 169.61, benchmark: benchmarkPrice },
    { month: 'Feb', actual: 170.5, benchmark: benchmarkPrice },
    { month: 'Mar', actual: 168.0, benchmark: benchmarkPrice },
    { month: 'Apr', actual: 171.2, benchmark: benchmarkPrice },
    { month: 'May', actual: totalActual, benchmark: benchmarkPrice },
  ];

  const benchmarkTrendDataWithGap = benchmarkTrendData.map(d => ({
    ...d,
    targetCost,
    gap: d.actual - targetCost,
  }));

  const pieColors = ['#3b82f6', '#f59e0b', '#ef4444'];

  const renderDialogContent = (category: CostCategory) => {
    let items: Item[] = [];
    switch (category) {
      case 'Direct Materials':
        items = simulatedIoTCostData.rawMaterials;
        break;
      case 'Packaging Materials':
        items = simulatedIoTCostData.packagingMaterials;
        break;
      case 'Direct Labor':
        items = simulatedIoTCostData.directLabor;
        break;
      case 'Overhead':
        items = simulatedIoTCostData.overhead;
        break;
      case 'Other Costs':
        items = simulatedIoTCostData.otherCosts;
        break;
    }

    return (
      <>
        <Heading size="5" mb="4">{category} Details</Heading>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Quantity</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Unit Price</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Cost</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {items.map((item, idx) => (
              <Table.Row key={idx}>
                <Table.Cell>{item.name}</Table.Cell>
                <Table.Cell>{item.qty ?? '-'}</Table.Cell>
                <Table.Cell>{currency} {item.unitPrice ?? '-'}</Table.Cell>
                <Table.Cell>{currency} {item.cost}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
        <Flex justify="end" mt="4">
          <Button onClick={() => setDialogOpen(null)}>Close</Button>
        </Flex>
      </>
    );
  };

  return (
    <Box p="6">
      <Dialog.Root open={dialogOpen !== null} onOpenChange={open => !open && setDialogOpen(null)}>
        <Dialog.Content style={{ maxWidth: 700 }}>
          {dialogOpen && renderDialogContent(dialogOpen)}
        </Dialog.Content>
      </Dialog.Root>
    </Box>
  );
};

export default CostAnalysis;
