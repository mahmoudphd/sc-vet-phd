// CostAnalysis.tsx - IoT-Integrated Version
import { useState, useEffect } from 'react';
import {
  Card, Flex, Heading, Text, Table, Button, Grid, Progress,
  Select, Box, TextField, Switch, Dialog
} from '@radix-ui/themes';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, PieChart, Pie, Cell,
  Legend, ResponsiveContainer
} from 'recharts';
import { simulatedIoTCostData } from './simulateIoTCostData';

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
  const [mode, setMode] = useState<'manual' | 'auto'>('manual');
  const [costData, setCostData] = useState(simulatedIoTCostData.manual);
  const [showMaterials, setShowMaterials] = useState(false);

  useEffect(() => {
    setCostData(mode === 'auto' ? simulatedIoTCostData.auto : simulatedIoTCostData.manual);
  }, [mode]);

  const formatCurrency = (val: number) => `${currency} ${val.toFixed(2)}`;

  const totalActual = costData.reduce((sum, i) => sum + i.actual, 0);
  const totalBudget = costData.reduce((sum, i) => sum + i.budget, 0);
  const totalCostAfter = costData.reduce((sum, i) => sum + i.costAfter, 0);

  return (
    <Box p="6">
      <Flex justify="between" align="center" mb="5">
        <Heading size="6">Inter-Organizational Cost Management</Heading>
        <Flex gap="3">
          <Box>
            <Text size="1">Auto Mode</Text>
            <Switch checked={mode === 'auto'} onCheckedChange={(val) => setMode(val ? 'auto' : 'manual')} />
          </Box>
          <Select.Root defaultValue={currency} onValueChange={(val) => setCurrency(val as 'EGP' | 'USD')}>
            <Select.Trigger />
            <Select.Content>
              <Select.Item value="EGP">EGP</Select.Item>
              <Select.Item value="USD">USD</Select.Item>
            </Select.Content>
          </Select.Root>
          <Button variant="soft">Export Report</Button>
        </Flex>
      </Flex>

      <Grid columns="3" gap="4" mb="6">
        <Card><Text>Actual Cost</Text><Heading>{formatCurrency(totalActual)}</Heading></Card>
        <Card><Text>Target Cost</Text><Heading>{formatCurrency(totalBudget)}</Heading></Card>
        <Card><Text>Post-Optimization</Text><Heading>{formatCurrency(totalCostAfter)}</Heading></Card>
      </Grid>

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Cost Category</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actual</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Budget</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Variance</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Solution</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Cost After</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {costData.map((item, i) => {
            const variance = item.actual - item.budget;
            const color = variance > 0 ? 'red' : 'green';
            return (
              <Table.Row key={item.category}>
                <Table.Cell>
                  {item.category === 'Direct Materials' ? (
                    <Button variant="ghost" onClick={() => setShowMaterials(true)}>
                      {item.category}
                    </Button>
                  ) : item.category}
                </Table.Cell>
                <Table.Cell>{formatCurrency(item.actual)}</Table.Cell>
                <Table.Cell>{formatCurrency(item.budget)}</Table.Cell>
                <Table.Cell><Text color={color}>{variance.toFixed(2)}</Text></Table.Cell>
                <Table.Cell>
                  <Select.Root
                    value={solutions[item.category] || ''}
                    onValueChange={(val) => setSolutions((prev) => ({ ...prev, [item.category]: val }))}
                  >
                    <Select.Trigger placeholder="Select" />
                    <Select.Content>
                      {solutionOptions.map((s) => (
                        <Select.Item key={s} value={s}>{s}</Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </Table.Cell>
                <Table.Cell>{formatCurrency(item.costAfter)}</Table.Cell>
              </Table.Row>
            );
          })}
          <Table.Row>
            <Table.Cell><Text weight="bold">Total</Text></Table.Cell>
            <Table.Cell>{formatCurrency(totalActual)}</Table.Cell>
            <Table.Cell>{formatCurrency(totalBudget)}</Table.Cell>
            <Table.Cell /><Table.Cell /><Table.Cell>{formatCurrency(totalCostAfter)}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>

      {/* Direct Materials Modal */}
      <Dialog.Root open={showMaterials} onOpenChange={setShowMaterials}>
        <Dialog.Content maxWidth="700px">
          <Dialog.Title>Direct Materials Composition</Dialog.Title>
          <Box style={{ maxHeight: 400, overflowY: 'auto', marginTop: '16px' }}>
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Material</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Weight (kg)</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Price/Kg</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Cost</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {simulatedIoTCostData.materials.map((mat, i) => (
                  <Table.Row key={i}>
                    <Table.Cell>{mat.name}</Table.Cell>
                    <Table.Cell>{mat.weight}</Table.Cell>
                    <Table.Cell>{formatCurrency(mat.pricePerKg)}</Table.Cell>
                    <Table.Cell>{formatCurrency(mat.cost)}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>
          <Flex justify="end" mt="4">
            <Button onClick={() => setShowMaterials(false)}>Close</Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Box>
  );
};

export default CostAnalysis;
