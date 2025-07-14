import {
  Card,
  Flex,
  Heading,
  Text,
  Table,
  Badge,
  Button,
  Grid,
  Box,
  Dialog,
  TextField,
  Select
} from '@radix-ui/themes';
import { PieChart, Pie, LineChart, Line, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { toast } from 'sonner';

const DepreciationTracking = () => {
  const { t } = useTranslation('depreciation-tracking');
  const [newAsset, setNewAsset] = useState({
    name: '',
    category: '',
    cost: '',
    lifespan: ''
  });

  const assets = [
    {
      id: 'AST-04587',
      name: 'Lyophilizer L-245',
      category: t('production'),
      acquisitionCost: 450000,
      currentValue: 320000,
      method: 'Straight-line',
      lifespan: '10 Years',
      depreciationSchedule: [
        { year: 1, value: 405000 },
        { year: 2, value: 360000 },
        { year: 3, value: 315000 },
        { year: 4, value: 270000 },
        { year: 5, value: 225000 },
      ]
    },
  ];

  // Calculate asset distribution dynamically
  const categoryDistribution = assets.reduce((acc: any, asset) => {
    acc[asset.category] = (acc[asset.category] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(categoryDistribution).map(([name, value]: any) => ({
    name,
    value: (value / assets.length) * 100
  }));


  const handleAddAsset = () => {
    toast.success('Asset added successfully');
    // Add actual API call here
  };

  const handleGenerateReport = () => {
    toast.info('Generating tax report...');
    // Add actual report generation logic
  };

  return (
    <Box p="6">
      <Flex direction="column" gap="5">
        <Flex justify="between" align="center">
          <Heading size="6">{t('capex-depreciation-schedule')}</Heading>
          <Flex gap="3">
            <Dialog.Root>
              <Dialog.Trigger>
                <Button variant="soft">
                  {t('add-asset')}
                </Button>
              </Dialog.Trigger>
              <Dialog.Content style={{ maxWidth: 450 }}>
                <Dialog.Title>{t('add-asset')}</Dialog.Title>
                <Flex direction="column" gap="3">
                  <label>
                    <Text as="div" size="2" mb="1" weight="bold">
                      {t('asset-name')}
                    </Text>
                    <TextField.Root
                      value={newAsset.name}
                      onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                    />
                  </label>
                  <label>
                    <Text as="div" size="2" mb="1" weight="bold">
                      {t('category')}
                    </Text>
                    <Select.Root
                      value={newAsset.category}
                      onValueChange={(value) => setNewAsset({ ...newAsset, category: value })}
                    >
                      <Select.Trigger />
                      <Select.Content>
                        <Select.Item value="production">{t('production')}</Select.Item>
                        <Select.Item value="lab">{t('lab')}</Select.Item>
                        <Select.Item value="it">{t('it')}</Select.Item>
                      </Select.Content>
                    </Select.Root>
                  </label>
                  <Flex gap="3" mt="4" justify="end">
                    <Dialog.Close>
                      <Button variant="soft">
                        {t('cancel')}
                      </Button>
                    </Dialog.Close>
                    <Button onClick={handleAddAsset}>{t('save')}</Button>
                  </Flex>
                </Flex>
              </Dialog.Content>
            </Dialog.Root>
            <Dialog.Root>
              <Dialog.Trigger>
                <Button variant="soft">{t('tax-report')}</Button>
              </Dialog.Trigger>
              <Dialog.Content style={{ maxWidth: 500 }}>
                <Dialog.Title>{t('generate-tax-report')}</Dialog.Title>
                <Flex direction="column" gap="3">
                  <Text>{t('tax-report-description')}</Text>
                  <Flex gap="3" mt="4" justify="end">
                    <Dialog.Close>
                      <Button variant="soft">
                        {t('cancel')}
                      </Button>
                    </Dialog.Close>
                    <Button onClick={handleGenerateReport}>
                      {t('generate-report')}
                    </Button>
                  </Flex>
                </Flex>
              </Dialog.Content>
            </Dialog.Root>
          </Flex>
        </Flex>

        <Grid columns={{ initial: '1', sm: '3' }} gap="4">
          <Card>
            <Flex direction="column" gap="1">
              <Text size="2">{t('total-capex')}</Text>
              <Heading size="7">$4.5M</Heading>
            </Flex>
          </Card>
          <Card>
            <Flex direction="column" gap="1">
              <Text size="2">{t('accumulated-depreciation')}</Text>
              <Heading size="7">$1.2M</Heading>
            </Flex>
          </Card>
          <Card>
            <Flex direction="column" gap="1">
              <Text size="2">{t('net-book-value')}</Text>
              <Heading size="7">$3.3M</Heading>
            </Flex>
          </Card>
        </Grid>

        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>{t('asset-id')}</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>{t('equipment')}</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>{t('category')}</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>{t('acquisition-cost')}</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>{t('current-value')}</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>{t('depreciation-method')}</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>{t('remaining-life')}</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {assets.map((asset) => (
              <Table.Row key={asset.id}>
                <Table.Cell>{asset.id}</Table.Cell>
                <Table.Cell>{asset.name}</Table.Cell>
                <Table.Cell>
                  <Badge variant="soft">{asset.category}</Badge>
                </Table.Cell>
                <Table.Cell>${asset.acquisitionCost.toLocaleString()}</Table.Cell>
                <Table.Cell>${asset.currentValue.toLocaleString()}</Table.Cell>
                <Table.Cell>{asset.method}</Table.Cell>
                <Table.Cell>{asset.lifespan}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>

        <Flex direction={{ initial: 'column', md: 'row' }} gap="4">
          <Card style={{ flex: 1 }}>
            <Heading size="4" mb="3">{t('depreciation-schedule')}</Heading>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={assets[0].depreciationSchedule}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card style={{ flex: 1 }}>
            <Heading size="4" mb="3">{t('asset-distribution')}</Heading>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Flex>
      </Flex>
    </Box>
  );
};

export default DepreciationTracking;
