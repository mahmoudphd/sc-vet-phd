// src/pages/CostAnalytics.tsx

import React, { useState } from 'react';
import {
  Box, Button, Dialog, Flex, Grid, Heading, Switch, Table, Text, TextField
} from '@radix-ui/themes';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { simulatedIoTCostData, CostCategory } from './simulateIoTCostData';

const pieColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a83279'];

export default function CostAnalytics() {
  const [totals, setTotals] = useState(simulatedIoTCostData.totals);
  const [target, setTarget] = useState<Record<CostCategory, number>>({
    'Direct Materials': 129,
    'Packaging Materials': 16,
    'Direct Labor': 2,
    Overhead: 2,
    'Other Costs': 13,
  });
  const [solutions, setSolutions] = useState<Record<CostCategory, string>>({
    'Direct Materials': '', 'Packaging Materials': '', 'Direct Labor': '',
    Overhead: '', 'Other Costs': ''
  });
  const [showGapAnalysis, setShowGapAnalysis] = useState(false);

  const handleTargetChange = (category: CostCategory, value: number) => {
    setTarget(prev => ({ ...prev, [category]: value }));
  };

  const handleSolutionChange = (category: CostCategory, value: string) => {
    setSolutions(prev => ({ ...prev, [category]: value }));
  };

  const handleShowGapAnalysis = () => {
    setShowGapAnalysis(!showGapAnalysis);
  };

  const handleSubmitAll = () => {
    alert('Submitted to blockchain successfully!');
  };

  const benchmarkTrendData = [
    { name: 'Jan', benchmark: 120 },
    { name: 'Feb', benchmark: 123 },
    { name: 'Mar', benchmark: 121 },
  ];
  return (
    <Box p="4">
      <Heading size="4" mb="3">Cost Analytics Dashboard</Heading>
      <Text>Product: HepaVita | Currency: EGP | Export Market</Text>

      <Grid columns="3" gap="3" mt="4">
        <Box><Text>Actual Cost</Text><Text>{Object.values(totals).reduce((s,t)=>s+t.actual,0).toFixed(2)}</Text></Box>
        <Box><Text>Target Cost</Text><Text>{Object.values(target).reduce((s,t)=>s+t,0).toFixed(2)}</Text></Box>
        <Box><Text>Benchmark Price</Text><TextField defaultValue="123" /></Box>
      </Grid>

      <Grid columns="3" gap="3" mt="2">
        <Box><Text>Profit Margin (%)</Text><Text>18%</Text></Box>
        <Box><Text>Progress To Target</Text><Text>85%</Text></Box>
        <Box><Text>Post-Optimization Estimate</Text><Text>{Object.values(totals).reduce((s,t)=>s+t.costAfter,0).toFixed(2)}</Text></Box>
      </Grid>
      <Flex mt="4" gap="4">
        <Box style={{ width:'50%',border:'1px solid #ddd',borderRadius:'8px',padding:'8px' }}>
          <Heading size="3">Cost Distribution</Heading>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={Object.entries(totals).map(([category, data])=>({ name:category,value:data.actual }))}
                dataKey="value" cx="50%" cy="50%" outerRadius={70} label
              >
                {Object.entries(totals).map((_, idx) => (
                  <Cell key={idx} fill={pieColors[idx % pieColors.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </Box>

        <Box style={{ width:'50%',border:'1px solid #ddd',borderRadius:'8px',padding:'8px' }}>
          <Heading size="3">Benchmark Trend</Heading>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={benchmarkTrendData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Line type="monotone" dataKey="benchmark" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
          <Button onClick={handleShowGapAnalysis}>Show Gap Analysis</Button>
        </Box>
      </Flex>

      {showGapAnalysis && (
        <Text mt="2">Gap analysis: variance vs benchmark shows potential savings if optimization strategies are applied.</Text>
      )}
      <Table.Root mt="4">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Cost Category</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actual</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Target</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Variance</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>% of Total</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Cost After</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>View Details</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {Object.entries(totals).map(([category, data], idx) => (
            <Table.Row key={idx}>
              <Table.RowHeaderCell>{category}</Table.RowHeaderCell>
              <Table.Cell>{data.actual}</Table.Cell>
              <Table.Cell>
                <TextField
                  type="number"
                  value={target[category as CostCategory]}
                  onChange={e => handleTargetChange(category as CostCategory, Number(e.target.value))}
                />
              </Table.Cell>
              <Table.Cell>{(data.actual - target[category as CostCategory]).toFixed(2)}</Table.Cell>
              <Table.Cell>{((data.actual/Object.values(totals).reduce((s,t)=>s+t.actual,0))*100).toFixed(1)}%</Table.Cell>
              <Table.Cell>{data.costAfter}</Table.Cell>
              <Table.Cell>
                <Dialog.Root>
                  <Dialog.Trigger><Button size="1">Details</Button></Dialog.Trigger>
                  <Dialog.Content>
                    <Dialog.Title>{category} Details</Dialog.Title>
                    <Button variant="ghost" size="1" onClick={()=>alert('Suggestions: Reduce waste, renegotiate supplier contracts...')}>
                      Improve Tips
                    </Button>
                    <Table.Root>
                      <Table.Header>
                        <Table.Row>
                          <Table.ColumnHeaderCell>Item</Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell>Cost</Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell>Solution</Table.ColumnHeaderCell>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        {getDetailsByCategory(category as CostCategory).map((item, i)=>(
                          <Table.Row key={i}>
                            <Table.Cell>{item.name}</Table.Cell>
                            <Table.Cell>{item.cost}</Table.Cell>
                            <Table.Cell>
                              <TextField
                                value={solutions[category as CostCategory]}
                                onChange={e=>handleSolutionChange(category as CostCategory, e.target.value)}
                              />
                            </Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table.Root>
                  </Dialog.Content>
                </Dialog.Root>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      <Button variant="solid" color="green" mt="4" onClick={handleSubmitAll}>
        Submit to Blockchain
      </Button>
    </Box>
  );
}

function getDetailsByCategory(category: CostCategory) {
  switch (category) {
    case 'Direct Materials': return simulatedIoTCostData.rawMaterials;
    case 'Packaging Materials': return simulatedIoTCostData.packagingMaterials;
    case 'Direct Labor': return simulatedIoTCostData.directLabor;
    case 'Overhead': return simulatedIoTCostData.overheadItems;
    case 'Other Costs': return simulatedIoTCostData.otherCosts;
    default: return [];
  }
}
