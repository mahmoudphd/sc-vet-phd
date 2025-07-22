// src/pages/CostAnalytics.tsx

import React, { useState } from 'react';
import {
  Box,
  Flex,
  Grid,
  Heading,
  Text,
  Table,
  Button,
  Dialog,
  Switch,
} from '@radix-ui/themes';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { simulatedIoTCostData, CostCategory } from './simulateIoTCostData';

const pieColors = ['#4f46e5', '#22c55e', '#f97316', '#14b8a6', '#8b5cf6'];

export default function CostAnalytics() {
  const [totals, setTotals] = useState(simulatedIoTCostData.totals);
  const [autoMode, setAutoMode] = useState(false);
  const [insightVisible, setInsightVisible] = useState(false);
  const [showGapAnalysis, setShowGapAnalysis] = useState(false);

  const handleTargetChange = (category: CostCategory, value: number) => {
    setTotals(prev => ({
      ...prev,
      [category]: { ...prev[category], target: value },
    }));
  };

  const handleShowGapAnalysis = () => {
    setShowGapAnalysis(!showGapAnalysis);
  };

  const handleSubmitAll = () => {
    console.log('Submitted to Blockchain:', totals);
  };

  return (
    <Box p="4">
      <Heading size="6" mb="4">Cost Analytics Dashboard</Heading>

      <Flex mb="4" gap="4">
        <Text>Product: Liver Tonic</Text>
        <Text>Currency: EGP</Text>
        <Text>Export Country: UAE</Text>
      </Flex>

      <Grid columns="3" gap="4" mb="4">
        <Box p="3" style={{ border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <Text>Actual Cost</Text>
          <Heading size="4">EGP {Object.values(totals).reduce((acc, cur) => acc + cur.actual, 0).toFixed(2)}</Heading>
        </Box>
        <Box p="3" style={{ border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <Text>Target Cost</Text>
          <Heading size="4">EGP {Object.values(totals).reduce((acc, cur) => acc + cur.budget, 0).toFixed(2)}</Heading>
        </Box>
        <Box p="3" style={{ border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <Flex justify="between" align="center">
            <Text>Benchmark Price</Text>
            <Button size="1" variant="outline" onClick={() => setInsightVisible(true)}>Insights</Button>
          </Flex>
          <Heading size="4">EGP 125.00</Heading>
        </Box>
      </Grid>

      <Grid columns="3" gap="4" mb="4">
        <Box p="3" style={{ border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <Text>Profit Margin (%)</Text>
          <Heading size="4">18%</Heading>
        </Box>
        <Box p="3" style={{ border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <Text>Progress To Target</Text>
          <Heading size="4">82%</Heading>
        </Box>
        <Box p="3" style={{ border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <Text>Post-Optimization Estimate</Text>
          <Heading size="4">EGP {Object.values(totals).reduce((acc, cur) => acc + cur.costAfter, 0).toFixed(2)}</Heading>
        </Box>
      </Grid>

      <Flex mb="4" gap="4">
        <Box flex="1" style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px' }}>
          <Heading size="3">Cost Distribution</Heading>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={Object.entries(totals).map(([name, d]) => ({ name, value: d.actual }))}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={80}
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

        <Box flex="1" style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px' }}>
          <Heading size="3">Benchmark Trend</Heading>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={[{ name: 'Jan', benchmark: 122 }, { name: 'Feb', benchmark: 123 }, { name: 'Mar', benchmark: 124 }]}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="benchmark" stroke="#4f46e5" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
          <Button size="1" variant="outline" onClick={handleShowGapAnalysis} style={{ marginTop: '8px' }}>
            Show Gap Analysis
          </Button>
        </Box>
      </Flex>

      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Cost Category</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actual</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Target</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Variance</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>% Of Total</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Cost After</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>View Details</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {Object.entries(totals).map(([category, data], index) => (
            <Table.Row key={index}>
              <Table.RowHeaderCell>{category}</Table.RowHeaderCell>
              <Table.Cell>EGP {data.actual.toFixed(2)}</Table.Cell>
              <Table.Cell>
                <input
                  type="number"
                  defaultValue={data.budget}
                  onChange={e => handleTargetChange(category as CostCategory, Number(e.target.value))}
                  style={{ width: '60px' }}
                />
              </Table.Cell>
              <Table.Cell>EGP {(data.actual - data.budget).toFixed(2)}</Table.Cell>
              <Table.Cell>{((data.actual / Object.values(totals).reduce((acc, cur) => acc + cur.actual, 0)) * 100).toFixed(1)}%</Table.Cell>
              <Table.Cell>EGP {data.costAfter.toFixed(2)}</Table.Cell>
              <Table.Cell>
                <Dialog.Root>
                  <Dialog.Trigger>
                    <Button size="1">Details</Button>
                  </Dialog.Trigger>
                  <Dialog.Content>
                    <Heading size="4">{category} Details</Heading>
                    <Text>Auto Mode:</Text>
                    <Switch checked={autoMode} onCheckedChange={setAutoMode} />
                    <Table.Root>
                      <Table.Header>
                        <Table.Row>
                          <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell>Cost</Table.ColumnHeaderCell>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        {getDetailsByCategory(category as CostCategory).map((item, idx) => (
                          <Table.Row key={idx}>
                            <Table.RowHeaderCell>{item.name}</Table.RowHeaderCell>
                            <Table.Cell>EGP {item.cost?.toFixed(2) || 0}</Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table.Root>
                    <Button onClick={() => setInsightVisible(true)} size="1">Improve Tips</Button>
                  </Dialog.Content>
                </Dialog.Root>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <Box mt="4">
        <Button color="green" onClick={handleSubmitAll}>
          Submit to Blockchain
        </Button>
      </Box>

      {insightVisible && (
        <Dialog.Root open={insightVisible} onOpenChange={setInsightVisible}>
          <Dialog.Content>
            <Heading size="4">Benchmark Insights</Heading>
            <Text>Benchmark price reflects competitive market averages to guide optimization. Use it to assess where cost saving opportunities exist compared to current actual cost.</Text>
            <Button size="1" onClick={() => setInsightVisible(false)}>Close</Button>
          </Dialog.Content>
        </Dialog.Root>
      )}
    </Box>
  );
}

function getDetailsByCategory(category: CostCategory) {
  return simulatedIoTCostData[category === 'Direct Materials' ? 'rawMaterials' :
    category === 'Packaging Materials' ? 'packagingMaterials' :
    category === 'Direct Labor' ? 'directLabor' :
    category === 'Overhead' ? 'overheadItems' :
    'otherCosts'] || [];
}
