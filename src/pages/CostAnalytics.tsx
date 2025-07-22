// src/pages/CostAnalytics.tsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Dialog,
  Flex,
  Grid,
  Heading,
  Switch,
  Table,
  Text,
} from '@radix-ui/themes';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { simulatedIoTCostData } from './simulateIoTCostData';

const pieColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1'];

const CostAnalytics = () => {
  const [autoMode, setAutoMode] = useState(true);
  const [showGap, setShowGap] = useState(false);
  const [insightOpen, setInsightOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState<null | string>(null);

  const handleTargetChange = (category: string, value: number) => {
    // Update logic here
  };
  const handleSolutionChange = (category: string, solution: string) => {
    // Update logic here
  };
  const handleSubmitAll = () => {
    // Submit all logic
  };
  const showGapAnalysis = () => {
    setShowGap(!showGap);
  };
  return (
    <Box p="4">
      <Heading size="6" mb="4">Cost Analytics Dashboard</Heading>
      
      <Grid columns="3" gap="4" mb="4">
        <Card>
          <Text>Actual Cost</Text>
          <Text size="5" weight="bold">EGP {simulatedIoTCostData.totals['Direct Materials'].actual + simulatedIoTCostData.totals['Packaging Materials'].actual + simulatedIoTCostData.totals['Direct Labor'].actual + simulatedIoTCostData.totals['Overhead'].actual + simulatedIoTCostData.totals['Other Costs'].actual}</Text>
        </Card>
        <Card>
          <Text>Target Cost</Text>
          <Text size="5" weight="bold">EGP {simulatedIoTCostData.totals['Direct Materials'].budget + simulatedIoTCostData.totals['Packaging Materials'].budget + simulatedIoTCostData.totals['Direct Labor'].budget + simulatedIoTCostData.totals['Overhead'].budget + simulatedIoTCostData.totals['Other Costs'].budget}</Text>
        </Card>
        <Card>
          <Flex justify="between" align="center">
            <Text>Benchmark Price</Text>
            <Button size="1" onClick={() => setInsightOpen(true)}>Insight</Button>
          </Flex>
          <Text size="5" weight="bold">EGP 123.00</Text>
        </Card>
      </Grid>

      <Grid columns="3" gap="4" mb="4">
        <Card>
          <Text>Profit Margin (%)</Text>
          <Text size="5" weight="bold">18%</Text>
        </Card>
        <Card>
          <Text>Progress To Target</Text>
          <Text size="5" weight="bold">75%</Text>
        </Card>
        <Card>
          <Text>Post-Optimization Estimate</Text>
          <Text size="5" weight="bold">EGP {simulatedIoTCostData.totals['Direct Materials'].costAfter + simulatedIoTCostData.totals['Packaging Materials'].costAfter + simulatedIoTCostData.totals['Direct Labor'].costAfter + simulatedIoTCostData.totals['Overhead'].costAfter + simulatedIoTCostData.totals['Other Costs'].costAfter}</Text>
        </Card>
      </Grid>
      <Box mb="4" style={{ border: '1px solid #ccc', padding: 12, borderRadius: 8 }}>
        <Flex justify="end" mb="2">
          <Button variant="blue" size="2" onClick={() => setShowGapAnalysis(!showGapAnalysis)}>
            Show Gap Analysis
          </Button>
        </Flex>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={benchmarkTrendData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="actual" stroke="#8884d8" />
            <Line type="monotone" dataKey="benchmark" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </Box>

      {showGapAnalysis && (
        <Box mb="4" style={{ border: '1px solid #ccc', padding: 12, borderRadius: 8 }}>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={gapData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {gapData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      )}
      <Box mb="4">
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Cost Category</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Actual</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Target</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Benchmark Price</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Varience</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Cost After</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {Object.entries(costData.totals).map(([category, data]) => (
              <Table.Row key={category}>
                <Table.RowHeaderCell>{category}</Table.RowHeaderCell>
                <Table.Cell>{data.actual.toFixed(2)}</Table.Cell>
                <Table.Cell>
                  <TextField.Root
                    value={data.target}
                    onChange={(e) => handleTargetChange(category, parseFloat(e.target.value))}
                  />
                </Table.Cell>
                <Table.Cell>
                  <TextField.Root
                    value={data.benchmark}
                    onChange={(e) => handleBenchmarkChange(category, parseFloat(e.target.value))}
                  />
                </Table.Cell>
                <Table.Cell>{(data.actual - data.target).toFixed(2)}</Table.Cell>
                <Table.Cell>{data.costAfter.toFixed(2)}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
      {Object.entries(costData.details).map(([category, details]) => (
        <Dialog.Root key={category}>
          <Dialog.Trigger asChild>
            <Button variant="outline" size="small">
              View {category} Details
            </Button>
          </Dialog.Trigger>
          <Dialog.Content>
            <Flex justify="between" align="center" mb="2">
              <Heading size="4">{category} Details</Heading>
              <Button size="xs" variant="ghost" onClick={() => handleShowImproveTips(category)}>
                Improve Tips
              </Button>
            </Flex>
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Quantity / Hours / Basis</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Unit Price / Hourly Rate / Total</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Cost</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Solution</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {details.map((item, idx) => (
                  <Table.Row key={idx}>
                    <Table.RowHeaderCell>{item.name}</Table.RowHeaderCell>
                    <Table.Cell>{item.qty ?? item.hours ?? item.basis ?? '-'}</Table.Cell>
                    <Table.Cell>{item.unitPrice ?? item.hourlyRate ?? item.totalCost ?? '-'}</Table.Cell>
                    <Table.Cell>{item.cost?.toFixed(2)}</Table.Cell>
                    <Table.Cell>
                      <RadixSelect.Root
                        value={item.solution ?? ''}
                        onValueChange={(value) => handleSolutionChange(category, idx, value)}
                      >
                        <RadixSelect.Trigger />
                        <RadixSelect.Content>
                          <RadixSelect.Item value="">None</RadixSelect.Item>
                          <RadixSelect.Item value="Reduce Usage">Reduce Usage</RadixSelect.Item>
                          <RadixSelect.Item value="Change Supplier">Change Supplier</RadixSelect.Item>
                          <RadixSelect.Item value="Re-Negotiate Price">Re-Negotiate Price</RadixSelect.Item>
                        </RadixSelect.Content>
                      </RadixSelect.Root>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Dialog.Content>
        </Dialog.Root>
      ))}
      <Flex gap="4" mt="4">
        <Box p="3" style={{ border: '1px solid #ccc', borderRadius: '12px', width: '50%' }}>
          <Heading size="4" mb="2">Cost Distribution</Heading>
          <PieChart width={300} height={300}>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {pieData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
              ))}
            </Pie>
          </PieChart>
        </Box>
        <Box p="3" style={{ border: '1px solid #ccc', borderRadius: '12px', width: '50%' }}>
          <Flex justify="between" align="center" mb="2">
            <Heading size="4">Benchmark Price Trend</Heading>
            <Button size="xs" onClick={handleShowGapAnalysis} variant="blue">Show Gap Analysis</Button>
          </Flex>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={benchmarkTrendData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="benchmarkPrice" stroke="#8884d8" />
              {showGapAnalysis && (
                <Line type="monotone" dataKey="gap" stroke="#82ca9d" strokeDasharray="3 3" />
              )}
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Flex>
      <Box mt="6" style={{ textAlign: 'center' }}>
        <Button color="green" size="3" onClick={handleSubmitAll}>
          Submit To Blockchain
        </Button>
      </Box>

    </Box>
  );
};

export default CostAnalytics;

// 🔧 Helper functions & state handlers

const handleTargetChange = (category: CostCategory, newTarget: number) => {
  setTotals(prev => ({
    ...prev,
    [category]: {
      ...prev[category],
      target: newTarget,
    },
  }));
};

const handleSolutionChange = (index: number, newSolution: string) => {
  const updated = [...solutions];
  updated[index] = newSolution;
  setSolutions(updated);
};

const handleShowGapAnalysis = () => {
  setShowGapAnalysis(!showGapAnalysis);
};

const pieColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA336A'];

const benchmarkTrendData = [
  { month: 'Jan', benchmarkPrice: 120, gap: 10 },
  { month: 'Feb', benchmarkPrice: 125, gap: 8 },
  { month: 'Mar', benchmarkPrice: 123, gap: 9 },
];
