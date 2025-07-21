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

        <Box style={{ width: 180 }}>
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

      <Flex gap="4" mb="5" wrap="wrap">
        <Card>
          <Flex direction="column" gap="1" p="4">
            <Text size="2">Total Emissions</Text>
            <Heading size="7">{totalEmissions.toFixed(1)} tCO₂e</Heading>
            <Text size="1" style={{ color: 'green' }}>↓ 12% YoY</Text>
          </Flex>
        </Card>

        <Card>
          <Flex direction="column" gap="1" p="4">
            <Text size="2">RE100 Progress</Text>
            <Heading size="7">68%</Heading>
            <Progress value={68} />
          </Flex>
        </Card>

        <Card>
          <Flex direction="column" gap="1" p="4">
            <Text size="2">Carbon Intensity</Text>
            <Heading size="7">{(totalEmissions / 100).toFixed(2)} t/$K</Heading>
            <Text size="1">Scope 1, 2 & 3</Text>
          </Flex>
        </Card>
      </Flex>

      <Flex gap="4" mb="5" style={{ flexWrap: 'wrap' }}>
        <Card style={{ flex: 1, minWidth: 300 }}>
          <Heading size="4" mb="3">Emission Breakdown</Heading>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={emissionDataWithPercent}
                  dataKey="emissions"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                >
                  {emissionDataWithPercent.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <Box mt="3">
            {emissionDataWithPercent.map((entry) => (
              <Flex key={entry.category} align="center" gap="2" mb="1">
                <Box
                  style={{
                    width: 14,
                    height: 14,
                    backgroundColor: entry.color,
                    borderRadius: 4
                  }}
                />
                <Text size="2">
                  {entry.category} ({entry.percentOfTotal}%)
                </Text>
              </Flex>
            ))}
          </Box>
        </Card>

        <Card style={{ flex: 1, minWidth: 300 }}>
          <Heading size="4" mb="3">Reduction Initiatives</Heading>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={reductionData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="reduction" name="CO₂e Reduced">
                  {reductionData.map((entry, index) => (
                    <Cell key={`cell-bar-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </Flex>

      <Table.Root variant="surface" style={{ marginTop: 20 }}>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Category</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Emissions (tCO₂e)</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>% of Total</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Target</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Progress</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Certification</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {emissionDataWithPercent.map((item, i) => {
            const target = (item.emissions * 0.8).toFixed(1);
            const progress = 80; // fixed progress
            return (
              <Table.Row key={i}>
                <Table.Cell>{item.category}</Table.Cell>
                <Table.Cell>{item.emissions.toFixed(1)}</Table.Cell>
                <Table.Cell>{item.percentOfTotal}%</Table.Cell>
                <Table.Cell>{target} tCO₂e</Table.Cell>
                <Table.Cell>
                  <Progress value={progress} />
                </Table.Cell>
                <Table.Cell>
                  <Button variant="soft" disabled>
                    ISO 14001
                  </Button>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}
