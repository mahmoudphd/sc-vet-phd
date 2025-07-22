// src/pages/CostAnalytics.tsx

import React, { useState } from 'react';
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
} from 'recharts';
import { simulatedIoTCostData } from './simulateIoTCostData';
const [totals, setTotals] = useState(simulatedIoTCostData.totals);
const [solutions, setSolutions] = useState({
  'Direct Materials': 'Use alternative supplier',
  'Packaging Materials': 'Reduce packaging weight',
  'Direct Labor': 'Optimize scheduling',
  Overhead: 'Improve energy efficiency',
  'Other Costs': 'Negotiate better transport rates',
});
const [showGapAnalysis, setShowGapAnalysis] = useState(false);
const [autoMode, setAutoMode] = useState(true);
const [benchmarkPrice, setBenchmarkPrice] = useState(123); // مثال
const [insightVisible, setInsightVisible] = useState(false);
const pieColors = ['#4f46e5', '#22c55e', '#ec4899', '#f97316', '#0ea5e9'];

const benchmarkTrendData = [
  { name: 'Jan', benchmark: 120 },
  { name: 'Feb', benchmark: 125 },
  { name: 'Mar', benchmark: 130 },
  { name: 'Apr', benchmark: 135 },
];
function getDetailsByCategory(category: string) {
  switch (category) {
    case 'Direct Materials': return simulatedIoTCostData.rawMaterials;
    case 'Packaging Materials': return simulatedIoTCostData.packagingMaterials;
    case 'Direct Labor': return simulatedIoTCostData.directLabor;
    case 'Overhead': return simulatedIoTCostData.overheadItems;
    case 'Other Costs': return simulatedIoTCostData.otherCosts;
    default: return [];
  }
}

const handleTargetChange = (category: string, value: number) => {
  setTotals(prev => ({
    ...prev,
    [category]: { ...prev[category], target: value }
  }));
};

const handleSolutionChange = (category: string, value: string) => {
  setSolutions(prev => ({ ...prev, [category]: value }));
};

const handleShowGapAnalysis = () => {
  setShowGapAnalysis(prev => !prev);
};

const handleSubmitAll = () => {
  console.log('Submitted to blockchain:', totals);
};
<Grid columns="3" gap="3">
  <Box>
    <Heading>Actual Cost</Heading>
    <Text>EGP {Object.values(totals).reduce((sum, c) => sum + c.actual, 0).toFixed(2)}</Text>
  </Box>
  <Box>
    <Heading>Target Cost</Heading>
    <Text>EGP {Object.values(totals).reduce((sum, c) => sum + c.target, 0).toFixed(2)}</Text>
  </Box>
  <Box>
    <Heading>Benchmark Price</Heading>
    <Text>
      <input
        type="number"
        value={benchmarkPrice}
        onChange={e => setBenchmarkPrice(Number(e.target.value))}
      />
      <Button size="1" onClick={() => setInsightVisible(true)}>Insights</Button>
    </Text>
  </Box>
</Grid>

<Grid columns="3" gap="3" mt="2">
  <Box>
    <Heading>Profit Margin (%)</Heading>
    <Text>25%</Text>
  </Box>
  <Box>
    <Heading>Progress To Target</Heading>
    <Progress value={70} />
  </Box>
  <Box>
    <Heading>Post-Optimization Estimate</Heading>
    <Text>EGP {Object.values(totals).reduce((sum, c) => sum + c.costAfter, 0).toFixed(2)}</Text>
  </Box>
</Grid>
<Table.Root>
  <Table.Header>
    <Table.Row>
      <Table.ColumnHeader>Cost Category</Table.ColumnHeader>
      <Table.ColumnHeader>Actual</Table.ColumnHeader>
      <Table.ColumnHeader>Target</Table.ColumnHeader>
      <Table.ColumnHeader>Variance</Table.ColumnHeader>
      <Table.ColumnHeader>% Of Total</Table.ColumnHeader>
      <Table.ColumnHeader>Cost After</Table.ColumnHeader>
      <Table.ColumnHeader>View Details</Table.ColumnHeader>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {Object.entries(totals).map(([category, data]) => {
      const variance = (data.target - data.actual).toFixed(2);
      const percent = ((data.actual / benchmarkPrice) * 100).toFixed(1);
      return (
        <Table.Row key={category}>
          <Table.Cell>{category}</Table.Cell>
          <Table.Cell>EGP {data.actual}</Table.Cell>
          <Table.Cell>
            <input
              type="number"
              value={data.target}
              onChange={e => handleTargetChange(category, Number(e.target.value))}
            />
          </Table.Cell>
          <Table.Cell>{variance}</Table.Cell>
          <Table.Cell>{percent}%</Table.Cell>
          <Table.Cell>EGP {data.costAfter}</Table.Cell>
          <Table.Cell>
            <Dialog.Root>
              <Dialog.Trigger><Button size="1">Details</Button></Dialog.Trigger>
              <Dialog.Content>
                <Heading>{category} Breakdown</Heading>
                <Table.Root>
                  <Table.Body>
                    {getDetailsByCategory(category).map((item, idx) => (
                      <Table.Row key={idx}>
                        <Table.Cell>{item.name}</Table.Cell>
                        <Table.Cell>{item.cost}</Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
                <Button size="1" onClick={() => alert(solutions[category])}>Improve Tips</Button>
              </Dialog.Content>
            </Dialog.Root>
          </Table.Cell>
        </Table.Row>
      );
    })}
  </Table.Body>
</Table.Root>
<Flex mt="4" gap="4">
  <Box style={{ flex: '1', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px' }}>
    <Heading size="3">Cost Distribution</Heading>
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={Object.entries(totals).map(([name, d]) => ({ name, value: d.actual }))}
          dataKey="value"
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          label
        >
          {Object.entries(totals).map(([_, __], index) => (
            <Cell key={index} fill={pieColors[index % pieColors.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </Box>

  <Box style={{ flex: '1', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px' }}>
    <Heading size="3">Benchmark Trend</Heading>
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={benchmarkTrendData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="benchmark" stroke="#4f46e5" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
    <Button size="1" variant="outline" style={{ marginTop: '8px' }} onClick={handleShowGapAnalysis}>
      Show Gap Analysis
    </Button>
  </Box>
</Flex>
{insightVisible && (
  <Dialog.Root open={insightVisible} onOpenChange={setInsightVisible}>
    <Dialog.Content>
      <Heading size="4">Benchmark Insights</Heading>
      <Text>Benchmark price reflects competitive market averages to guide optimization. Use it to assess where cost saving opportunities exist compared to current actual cost.</Text>
      <Button size="1" onClick={() => setInsightVisible(false)}>Close</Button>
    </Dialog.Content>
  </Dialog.Root>
)}
<Box mt="4">
  <Button color="green" onClick={handleSubmitAll}>
    Submit to Blockchain
  </Button>
</Box>

</Box> {/* إغلاق Box الرئيسي */}
);
}

export default CostAnalytics;
