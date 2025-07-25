import React, { useState } from 'react';
import {
  Card,
  Flex,
  Heading,
  Text,
  Select,
  TextField,
  Button,
  Box,
  Dialog,
  Table,
  Badge,
  Grid,
  Progress,
} from '@radix-ui/themes';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { MixerHorizontalIcon } from '@radix-ui/react-icons';
import { useTranslation } from 'react-i18next';
import costData, { columns, CostItem, chartData, costCategories, categoryColors } from './data/simulateIoTCostData';
const formatCurrency = (value: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const CostAnalytics = () => {
  const { t } = useTranslation();
  const [selectedProduct, setSelectedProduct] = useState('Product A');
  const [currency, setCurrency] = useState('USD');
  const [benchmarkPrice, setBenchmarkPrice] = useState(45.5);
  const [profitMargin, setProfitMargin] = useState(0.25);
  const [showGap, setShowGap] = useState(true);
  const [data, setData] = useState<TableRow[]>(defaultCostData);
  const [detailsDialog, setDetailsDialog] = useState<DialogState>({
    open: false,
    category: '',
    rows: [],
  });

  const handleUpdate = (index: number, field: keyof TableRow, value: number | string) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    setData(updated);
  };

  const handleSolutionChange = (index: number, solution: string) => {
    const updated = [...data];
    updated[index].solution = solution;
    setData(updated);
  };
  const calculateKPIs = () => {
    const actual = data.reduce((sum, row) => sum + Number(row.actual || 0), 0);
    const target = data.reduce((sum, row) => sum + Number(row.budget || 0), 0);
    const optimized = data.reduce((sum, row) => sum + Number(row.cost || 0), 0);

    return {
      actualCost: actual,
      targetCost: target,
      postOptimization: actual - optimized,
      benchmarkPrice: benchmarkPrice,
      profitMargin,
    };
  };

  const kpis = calculateKPIs();
  const pieData = [
    {
      name: 'Direct Cost',
      value: data
        .filter((row) =>
          ['Raw Materials', 'Direct Labor', 'Packaging Materials'].includes(row.name)
        )
        .reduce((sum, row) => sum + Number(row.cost || 0), 0),
    },
    {
      name: 'Overhead',
      value: data
        .filter((row) => row.name === 'Overhead')
        .reduce((sum, row) => sum + Number(row.cost || 0), 0),
    },
    {
      name: 'Other',
      value: data
        .filter((row) => row.name === 'Other Costs')
        .reduce((sum, row) => sum + Number(row.cost || 0), 0),
    },
  ];
  const barChartData = data.map((row) => ({
    name: row.name,
    Actual: Number(row.actual || 0),
    Budget: Number(row.budget || 0),
    Optimized: Number(row.cost || 0),
  }));

  const lineChartData = data.map((row) => ({
    name: row.name,
    'Benchmark Price': Number(benchmarkPrice || 0),
    'Actual Price': Number(row.actual || 0),
    Gap: Math.abs(Number(row.actual || 0) - Number(benchmarkPrice || 0)),
  }));
  return (
    <Box p="4">
      <Flex justify="between" align="center" mb="4">
        <Heading size="6">{t('Inter-Organizational Cost Management')}</Heading>
        <Flex gap="2">
          <Select.Root onValueChange={setSelectedProduct} value={selectedProduct}>
            <Select.Trigger>{selectedProduct}</Select.Trigger>
            <Select.Content>
              <Select.Item value="Product A">Product A</Select.Item>
              <Select.Item value="Product B">Product B</Select.Item>
              <Select.Item value="Product C">Product C</Select.Item>
            </Select.Content>
          </Select.Root>
          <Select.Root onValueChange={handleCurrencyChange} value={currency}>
            <Select.Trigger>{currency}</Select.Trigger>
            <Select.Content>
              <Select.Item value="USD">USD</Select.Item>
              <Select.Item value="EGP">EGP</Select.Item>
            </Select.Content>
          </Select.Root>
          <Button onClick={handleExport}>
            {t('Export Report')}
          </Button>
        </Flex>
      </Flex>
      <Grid columns="3" gap="4" mb="4">
        <Card>
          <Flex direction="column" gap="2">
            <Text>{t('Actual Cost')}</Text>
            <Heading size="4">{formatCurrency(totalActual)}</Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="2">
            <Text>{t('Target Cost')}</Text>
            <Heading size="4">{formatCurrency(totalBudget)}</Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="2">
            <Text>{t('Total Cost')}</Text>
            <Heading size="4">{formatCurrency(totalCostAfter)}</Heading>
          </Flex>
        </Card>
      </Grid>

      <Grid columns="3" gap="4" mb="4">
        <Card>
          <Flex direction="column" gap="2">
            <Text>{t('Benchmark Price')}</Text>
            <TextField
              type="number"
              value={benchmarkPrice}
              onChange={(e) => setBenchmarkPrice(Number(e.target.value))}
            />
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="2">
            <Text>{t('Progress to Target')}</Text>
            <Progress value={progressToTarget} />
            <Text size="1">{progressToTarget.toFixed(1)}%</Text>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="2">
            <Text>{t('Post-Optimization Estimate')}</Text>
            <Heading size="4">{formatCurrency(postOptimizationEstimate)}</Heading>
          </Flex>
        </Card>
      </Grid>
      <Box mb="4">
        <Flex justify="between" align="center" mb="2">
          <Heading size="4">{t('Cost Breakdown')}</Heading>
          <Button onClick={() => setShowGap(!showGap)}>
            {showGap ? t('Hide Gap Analysis') : t('Show Gap Analysis')}
          </Button>
        </Flex>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>{t('Category')}</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>{t('Actual Cost')}</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>{t('Target Cost')}</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>{t('Cost After')}</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>{t('% of Total')}</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>{t('Variance')}</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>{t('Solution')}</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>{t('Details')}</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell colSpan={8}>
                <strong>{t('Direct Cost')}</strong>
              </Table.Cell>
            </Table.Row>
            {costData.map((row, index) => {
              if (['Raw Materials', 'Direct Labor', 'Packaging Materials'].includes(row.name)) {
                return (
                  <Table.Row key={index}>
                    <Table.RowHeaderCell>{t(row.name)}</Table.RowHeaderCell>
                    <Table.Cell>
                      <TextField
                        value={row.actual}
                        onChange={(e) => handleEdit(index, 'actual', e.target.value)}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <TextField
                        value={row.budget}
                        onChange={(e) => handleEdit(index, 'budget', e.target.value)}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <TextField
                        value={row.cost}
                        onChange={(e) => handleEdit(index, 'cost', e.target.value)}
                      />
                    </Table.Cell>
                    <Table.Cell>{formatPercentage(row.cost / totalCost)}</Table.Cell>
                    <Table.Cell>{formatCurrency(row.cost - row.budget)}</Table.Cell>
                    <Table.Cell>
                      <Select.Root
                        value={row.solution || ''}
                        onValueChange={(value) => handleSolutionChange(index, value)}
                      >
                        <Select.Trigger />
                        <Select.Content>
                          {solutionOptions.map((option) => (
                            <Select.Item key={option} value={option}>
                              {option}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Root>
                    </Table.Cell>
                    <Table.Cell>
                      <Button onClick={() => openDetails(row.name)}>{t('View Details')}</Button>
                    </Table.Cell>
                  </Table.Row>
                );
              }
              return null;
            })}
            {costData.map((row, index) => {
              if (['Overhead', 'Other Costs'].includes(row.name)) {
                return (
                  <Table.Row key={index}>
                    <Table.RowHeaderCell>{t(row.name)}</Table.RowHeaderCell>
                    <Table.Cell>
                      <TextField
                        value={row.actual}
                        onChange={(e) => handleEdit(index, 'actual', e.target.value)}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <TextField
                        value={row.budget}
                        onChange={(e) => handleEdit(index, 'budget', e.target.value)}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <TextField
                        value={row.cost}
                        onChange={(e) => handleEdit(index, 'cost', e.target.value)}
                      />
                    </Table.Cell>
                    <Table.Cell>{formatPercentage(row.cost / totalCost)}</Table.Cell>
                    <Table.Cell>{formatCurrency(row.cost - row.budget)}</Table.Cell>
                    <Table.Cell>
                      <Select.Root
                        value={row.solution || ''}
                        onValueChange={(value) => handleSolutionChange(index, value)}
                      >
                        <Select.Trigger />
                        <Select.Content>
                          {solutionOptions.map((option) => (
                            <Select.Item key={option} value={option}>
                              {option}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Root>
                    </Table.Cell>
                    <Table.Cell>
                      <Button onClick={() => openDetails(row.name)}>{t('View Details')}</Button>
                    </Table.Cell>
                  </Table.Row>
                );
              }
              return null;
            })}
            <Table.Row>
              <Table.RowHeaderCell>
                <strong>{t('Total')}</strong>
              </Table.RowHeaderCell>
              <Table.Cell />
              <Table.Cell />
              <Table.Cell>
                <strong>{formatCurrency(totalCost)}</strong>
              </Table.Cell>
              <Table.Cell>
                <strong>100%</strong>
              </Table.Cell>
              <Table.Cell />
              <Table.Cell />
              <Table.Cell />
            </Table.Row>
          </Table.Body>
        </Table.Root>

        {/* Submit Button */}
        <Flex justify="end" mt="4">
          <Button onClick={handleSubmitAll}>{t('Submit All')}</Button>
        </Flex>
      </Card>

      {/* Chart Section */}
      <Card mt="4">
        <Flex justify="between" align="center">
          <Heading size="4">{t('Cost Breakdown')}</Heading>
          <Button onClick={() => setShowGapAnalysis(!showGapAnalysis)}>
            {showGapAnalysis ? t('Hide Gap Analysis') : t('Show Gap Analysis')}
          </Button>
        </Flex>
        <Box height={300} mt="3">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#8884d8"
                name={t('Actual Cost')}
              />
              <Line
                type="monotone"
                dataKey="target"
                stroke="#82ca9d"
                name={t('Target Cost')}
              />
              {showGapAnalysis && (
                <Line
                  type="monotone"
                  dataKey="gap"
                  stroke="#ff7300"
                  name={t('Gap')}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Card>
      <Card mt="4">
        <Heading size="3" mb="2">
          {t('Cost Composition')}
        </Heading>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
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
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card>
      <Card mt="4">
        <Heading size="3" mb="2">
          {t('Benchmark Price Analysis')}
        </Heading>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={benchmarkChartData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Actual" stroke="#8884d8" />
            <Line type="monotone" dataKey="Benchmark" stroke="#82ca9d" />
            <Line type="monotone" dataKey="Gap" stroke="#ff7300" strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </Box>
  );
};

export default CostAnalytics;
