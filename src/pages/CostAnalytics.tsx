import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  Flex,
  Grid,
  Heading,
  Switch,
  Table,
  Text,
  TextField,
} from '@radix-ui/themes';
import * as RadixSelect from '@radix-ui/react-select';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
} from 'recharts';
import { exportToCSV } from '../utils/exportCSV';
import { formatCurrency } from '../utils/formatCurrency';
import { useCostAnalyticsData } from '../hooks/useCostAnalyticsData';

export default function CostAnalytics() {
  const {
    selectedProduct,
    setSelectedProduct,
    currency,
    setCurrency,
    benchmarkPrice,
    setBenchmarkPrice,
    profitMargin,
    setProfitMargin,
    totalActual,
    totalTarget,
    totalCostAfter,
    postOptimizationEstimate,
    totals,
    benchmarkTrendDataWithGap,
    showCostGap,
    setShowCostGap,
    categories,
    dialogCategory,
    setDialogCategory,
    dialogData,
    dialogAutoMode,
    setDialogAutoMode,
    updateDialogItem,
    calculateTotalForCategory,
    submitToBlockchain,
    solutions,
    solutionsOptions,
    handleSolutionChange,
  } = useCostAnalyticsData();

  return (
    <Box p="4">
      <Heading mb="4">Inter-Organizational Cost Management</Heading>
      <Flex gap="3" align="center" mb="4" wrap="wrap">
        <Text>Product:</Text>
        <RadixSelect.Root value={selectedProduct} onValueChange={setSelectedProduct}>
          <RadixSelect.Trigger />
          <RadixSelect.Content>
            {['Product A', 'Product B', 'Product C'].map((p) => (
              <RadixSelect.Item key={p} value={p}>
                {p}
              </RadixSelect.Item>
            ))}
          </RadixSelect.Content>
        </RadixSelect.Root>

        <Text>Currency:</Text>
        <RadixSelect.Root value={currency} onValueChange={(value) => setCurrency(value as 'EGP' | 'USD')}>
          <RadixSelect.Trigger />
          <RadixSelect.Content>
            <RadixSelect.Item value="EGP">EGP</RadixSelect.Item>
            <RadixSelect.Item value="USD">USD</RadixSelect.Item>
          </RadixSelect.Content>
        </RadixSelect.Root>

        <Button onClick={() => exportToCSV(dialogData)}>Export CSV</Button>
        <Button variant="soft" onClick={() => setShowCostGap((prev) => !prev)}>
          {showCostGap ? 'Hide Cost Gap' : 'Show Cost Gap'}
        </Button>
      </Flex>

      <Grid columns="3" gap="4" mb="4">
        <Box>
          <Text>Actual Cost</Text>
          <Heading>{formatCurrency(totalActual, currency)}</Heading>
        </Box>
        <Box>
          <Text>Target Cost</Text>
          <Heading>{formatCurrency(totalTarget, currency)}</Heading>
        </Box>
        <Box>
          <Text>Cost After Optimization</Text>
          <Heading>{formatCurrency(totalCostAfter, currency)}</Heading>
        </Box>
        <Box>
          <Text>Benchmark Price</Text>
          <TextField.Input
            type="number"
            value={benchmarkPrice.toString()}
            onChange={(e) => setBenchmarkPrice(parseFloat(e.target.value) || 0)}
          />
        </Box>
        <Box>
          <Text>Profit Margin (%)</Text>
          <TextField.Input
            type="number"
            value={profitMargin.toString()}
            onChange={(e) => setProfitMargin(parseFloat(e.target.value) || 0)}
          />
        </Box>
        <Box>
          <Text>Post-Optimization Estimate</Text>
          <Heading>{formatCurrency(postOptimizationEstimate, currency)}</Heading>
        </Box>
      </Grid>

      <Flex gap="4" direction={{ initial: 'column', md: 'row' }} mb="6">
        <Box style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                dataKey="value"
                nameKey="name"
                data={[{
                  name: 'Direct Cost',
                  value:
                    totals['Direct Materials'].actual +
                    totals['Packaging Materials'].actual +
                    totals['Direct Labor'].actual,
                }, {
                  name: 'Overhead', value: totals['Overhead'].actual
                }, {
                  name: 'Other Costs', value: totals['Other Costs'].actual
                }]}
                outerRadius={100}
                label
              >
                <Cell fill="#3b82f6" />
                <Cell fill="#f59e0b" />
                <Cell fill="#ef4444" />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Box>
        <Box style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={benchmarkTrendDataWithGap}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="actual" stroke="#3b82f6" name="Actual Cost" />
              <Line type="monotone" dataKey="benchmark" stroke="#f59e0b" name="Benchmark Price" />
              <Line type="monotone" dataKey="targetCost" stroke="#ef4444" name="Target Cost" />
              {showCostGap && (
                <Line
                  type="monotone"
                  dataKey="gap"
                  stroke="#22c55e"
                  name="Cost Gap"
                  strokeDasharray="3 3"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Flex>

      {categories.map((category) => (
        <Box key={category} mb="6">
          <Flex justify="between" align="center" mb="2">
            <Heading size="4">{category}</Heading>
            <Button onClick={() => setDialogCategory(category)}>View Details</Button>
          </Flex>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Item</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Qty</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Unit Price</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Cost</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Solution</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {dialogData[category].map((item, index) => (
                <Table.Row key={index}>
                  <Table.Cell>{item.name}</Table.Cell>
                  <Table.Cell>
                    <TextField.Input
                      type="number"
                      value={item.qty?.toString() ?? '0'}
                      onChange={(e) => updateDialogItem(category, index, 'qty', parseFloat(e.target.value) || 0)}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <TextField.Input
                      type="number"
                      value={item.unitPrice?.toString() ?? '0'}
                      onChange={(e) => updateDialogItem(category, index, 'unitPrice', parseFloat(e.target.value) || 0)}
                    />
                  </Table.Cell>
                  <Table.Cell>{formatCurrency((item.qty ?? 0) * (item.unitPrice ?? 0), currency)}</Table.Cell>
                  <Table.Cell>
                    <RadixSelect.Root
                      value={solutions[category]?.[index] || ''}
                      onValueChange={(value) => handleSolutionChange(category, index, value)}
                    >
                      <RadixSelect.Trigger />
                      <RadixSelect.Content>
                        {solutionsOptions.map((s) => (
                          <RadixSelect.Item key={s} value={s}>
                            {s}
                          </RadixSelect.Item>
                        ))}
                      </RadixSelect.Content>
                    </RadixSelect.Root>
                  </Table.Cell>
                </Table.Row>
              ))}
              <Table.Row>
                <Table.Cell colSpan={3}><b>Total</b></Table.Cell>
                <Table.Cell colSpan={2}><b>{formatCurrency(calculateTotalForCategory(category), currency)}</b></Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Root>

          <Dialog.Root open={dialogCategory === category} onOpenChange={() => setDialogCategory(null)}>
            <Dialog.Content style={{ maxWidth: 800 }}>
              <Dialog.Title>{category} Breakdown</Dialog.Title>
              <Flex gap="2" mb="2" align="center">
                <Text>Auto Mode</Text>
                <Switch
                  checked={dialogAutoMode[category]}
                  onCheckedChange={(checked) =>
                    setDialogAutoMode((prev) => ({ ...prev, [category]: checked }))
                  }
                />
              </Flex>
              <Table.Root>
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeaderCell>Item</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Qty</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Unit Price</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Cost</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {dialogData[category]?.map((item, idx) => (
                    <Table.Row key={idx}>
                      <Table.Cell>{item.name}</Table.Cell>
                      <Table.Cell>
                        <TextField.Input
                          type="number"
                          value={item.qty?.toString() ?? '0'}
                          onChange={(e) => updateDialogItem(category, idx, 'qty', parseFloat(e.target.value) || 0)}
                          disabled={dialogAutoMode[category]}
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <TextField.Input
                          type="number"
                          value={item.unitPrice?.toString() ?? '0'}
                          onChange={(e) => updateDialogItem(category, idx, 'unitPrice', parseFloat(e.target.value) || 0)}
                          disabled={dialogAutoMode[category]}
                        />
                      </Table.Cell>
                      <Table.Cell>{formatCurrency((item.qty ?? 0) * (item.unitPrice ?? 0), currency)}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
              <Flex mt="4" gap="2" justify="end">
                <Button variant="surface" onClick={() => submitToBlockchain(category)}>
                  Submit to Blockchain
                </Button>
                <Dialog.Close>
                  <Button variant="soft">Close</Button>
                </Dialog.Close>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>
        </Box>
      ))}
    </Box>
  );
}
