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

  // بيانات التكلفة مع مجموعات واضحة وجميع القيم معرفة
  const costData = [
    { category: 'Direct Cost', isGroup: true },
    {
      category: 'Direct Materials',
      value: 45,
      actual: 1400000,
      budget: 1300000,
      costAfter: 1250000
    },
    {
      category: 'Packaging',
      value: 20,
      actual: 700000,
      budget: 650000,
      costAfter: 630000
    },
    {
      category: 'Labor',
      value: 10,
      actual: 400000,
      budget: 350000,
      costAfter: 340000
    },
    { category: 'Overhead', isGroup: true },
    {
      category: 'Other Costs',
      value: 15,
      actual: 300000,
      budget: 280000,
      costAfter: 290000
    }
  ];

  // حساب المجموع
  const totalCostAfter = costData
    .filter(item => !item.isGroup)
    .reduce((sum, item) => sum + (item.costAfter ?? 0), 0);

  // دالة تنسيق الأرقام مع العملة
  const formatCurrency = (num: number) => {
    return num.toLocaleString() + ' '
