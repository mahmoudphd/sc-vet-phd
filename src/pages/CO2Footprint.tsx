// SPDX-License-Identifier: UNLICENSED
import {
  Card,
  Flex,
  Heading,
  Text,
  Table,
  Button,
  Select,
  Progress,
  Box
} from '@radix-ui/themes';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useState, useMemo } from 'react';

const initialProducts = ['Poultry Product 1', 'Poultry Product 2', 'Poultry Product 3'];

const initialEmissionData = [
  { category: 'Raw Materials', emissions: 5.2, color: '#3b82f6' },
  { category: 'Manufacturing', emissions: 4.8, color: '#6366f1' },
  { category: 'Packaging', emissions: 3.6, color: '#f59e0b' },
  { category: 'Transport', emissions: 3.2, color: '#10b981' },
  { category: 'Distribution', emissions: 2.5, color: '#8b5cf6' },
  { category: 'Use', emissions: 2.1, color: '#ec4899' },
  { category: 'End of Life', emissions: 3.1, color: '#ef4444' }
];

const initialReductionInitiatives = [
  {
    name: 'Solar Panel Installation',
    reduction: 12,
    impact: 'High',
    color: '#10b981'
  },
  {
    name: 'LED Lighting Upgrade',
    reduction: 5,
    impact: 'Medium',
    color: '#f59e0b'
  },
  {
    name: 'Industrial Waste Recycling',
    reduction: 6,
    impact: 'Medium',
    color: '#6366f1'
  },
  {
    name: 'Fuel Optimization in Transport',
    reduction: 4,
    impact: 'Medium',
    color: '#3b82f6'
  }
];

export default function CO2Footprint() {
  const [selectedProduct, setSelectedProduct] = useState(initialProducts[0]);

  const [emissionData, setEmissionData] = useState(initialEmissionData);
  const [reductionData] = useState(initialReductionInitiatives);

  const totalEmissions = useMemo(() => {
    return emissionData.reduce((sum, item) => sum + item.emissions, 0);
  }, [emissionData]);

  const emissionDataWithPercent = useMemo(() => {
    return emissionData.map(item => ({
      ...item,
      percentOfTotal: totalEmissions ? ((item.emissions / totalEmissions) * 100).toFixed(1) : '0.0'
    }));
  }, [emissionData, totalEmissions]);

  return (
    <Box p="6">
      <Flex justify="between" align="center" mb="5">
        <Heading size="6">Sustainability Dashboard</Heading>
        <Box css={{ width: 180 }}>
          <Select.Root
            value={selectedProduct}
            onValueChange={val => setSelectedProduct(val)}
          >
            <Select.Trigger aria-label="Select product" />
            <Select.Content>
              {initialProducts.map(product => (
                <Select.Item key={product} value={product}>
                  {product}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </Box>
      </Flex>

      <Flex gap="4" mb="5">
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">Total Emissions</Text>
            <Heading size="7">{totalEmissions.toFixed(1)} tCO₂e</Heading>
