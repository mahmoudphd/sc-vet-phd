import {
  Card,
  Flex,
  Heading,
  Text,
  Table,
  Button,
  Grid,
  Progress,
  Select,
  Box
} from '@radix-ui/themes';
import { BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useState } from 'react';

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
  const [solutions, setSolutions] = useState<Record<string, string>>({});

  const formatCurrency = (num: number | string | undefined) => {
    const value = typeof num === 'string' ? parseFloat(num ?? '0') : num ?? 0;
    return `${value} ${currency}`;
  };

  const costData = [
    { category: 'Direct Cost', isGroup: true },
    {
      category: 'Direct Materials',
      value: 45,
      actual: '1350',
      budget: '1300',
      costAfter: '1250'
    },
    {
      category: 'Packaging Materials',
      value: 20,
      actual: '600',
      budget: '580',
      costAfter: '570'
    },
    {
      category: 'Direct Labor',
      value: 15,
      actual: '450',
      budget: '420',
      costAfter: '430'
    },
    { category: 'Overhead', isGroup: true },
    {
      category: 'Overhead',
      value: 12,
      actual: '360',
      budget: '350',
      costAfter: '345'
    },
    { category: 'Other Costs', isGroup: true },
    {
      category: 'Other Costs',
      value: 8,
      actual: '240',
      budget: '230',
      costAfter: '225'
    }
  ];

  const totalCostAfter = costData
    .filter(item => !item.isGroup)
    .reduce((sum, item) => sum + parseFloat(item.costAfter ?? '0'), 0);

  const totalActual = costData
    .filter(item => !item.isGroup)
    .reduce((sum, item) => sum + parseFloat(item.actual ?? '0'), 0);

  const totalBudget = costData
    .filter(item => !i
