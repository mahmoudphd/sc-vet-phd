import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  Flex,
  Heading,
  Text,
  Table,
  Badge,
  Button,
  Grid,
  Progress,
  Box,
  Dialog,
  TextField,
  Select,
} from '@radix-ui/themes';
import {
  PieChartIcon,
  BarChartIcon,
  MixerHorizontalIcon
} from '@radix-ui/react-icons';
import { PieChart, Pie, BarChart, Bar } from 'recharts';

const OpenBookAccounting = () => {
  const { t } = useTranslation('open-book-accounting');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('');
  
  const batches = [
    {
      id: 'VC23001',
      product: 'Anthelmintic Oral Suspension',
      materialCost: 24500,
      laborCost: 12000,
      overhead: 8500,
      totalCost: 45000,
      costPerUnit: 3.15,
      variance: '-2.5%',
      supplier: 'PharmaSource Inc.'
    },
  ];

  const products = [
    { id: 'p1', name: 'Anthelmintic Oral Suspension' },
    { id: 'p2', name: 'Antibiotic Injection' },
  ];

  const suppliers = [
    { id: 's1', name: 'PharmaSource Inc.' },
    { id: 's2', name: 'Global Pharma Supplies' },
  ];

  return (
    <Box p="6">
      <Flex justify="between" align="center" mb="5">
        <Heading size="6">{t('openBookAccounting')}</Heading>
        <Flex gap="3">
          <Dialog.Root>
            <Dialog.Trigger>
              <Button variant="soft">
                <MixerHorizontalIcon /> {t('costAnalysis')}
              </Button>
            </Dialog.Trigger>

            <Dialog.Content>
              <Dialog.Title>{t('costAnalysis')}</Dialog.Title>
              <Dialog.Description>
                {t('costAnalysisDesc')}
              </Dialog.Description>

              <Flex direction="column" gap="3">
                <label>
                  <Text as="div" size="2" mb="1" weight="bold">
                    {t('selectProduct')}
                  </Text>
                  <Select.Root 
                    value={selectedProduct}
                    onValueChange={setSelectedProduct}
                  >
                    <Select.Trigger placeholder={t('selectProduct')} />
                    <Select.Content>
                      {products.map(product => (
                        <Select.Item key={product.id} value={product.id}>
                          {product.name}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </label>

                <Flex gap="3" mt="2" justify="end">
                  <Dialog.Close>
                    <Button variant="soft" color="gray">
                      {t('cancel')}
                    </Button>
                  </Dialog.Close>
                  <Button>{t('analyze')}</Button>
                </Flex>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>
          <Dialog.Root>
            <Dialog.Trigger>
              <Button variant="soft">
                {t('supplierReport')}
              </Button>
            </Dialog.Trigger>

            <Dialog.Content maxWidth="600px">
              <Dialog.Title>{t('supplierReport')}</Dialog.Title>

              <Grid columns="2" gap="4" mb="4">
                <Select.Root 
                  value={selectedSupplier}
                  onValueChange={setSelectedSupplier}
                >
                  <Select.Trigger placeholder={t('selectSupplier')} />
                  <Select.Content>
                    {suppliers.map(supplier => (
                      <Select.Item key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>

                <Select.Root>
                  <Select.Trigger placeholder={t('selectTimeframe')} />
                  <Select.Content>
                    <Select.Item value="last-month">Last Month</Select.Item>
                    <Select.Item value="last-quarter">Last Quarter</Select.Item>
                    <Select.Item value="last-year">Last Year</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Grid>

              <Flex direction="column" gap="2">
                <Text size="4" weight="bold">{t('supplierPerformance')}</Text>
                <Card variant="classic">
                  <Flex justify="between">
                    <Text>{t('deliveryTimeliness')}</Text>
                    <Badge color="jade">94%</Badge>
                  </Flex>
                  <Flex justify="between">
                    <Text>{t('qualityCompliance')}</Text>
                    <Badge color="jade">98.5%</Badge>
                  </Flex>
                  <Flex justify="between">
                    <Text>{t('costVariance')}</Text>
                    <Badge color="ruby">+2.1%</Badge>
                  </Flex>
                </Card>

                <Flex gap="3" mt="4" justify="end">
                  <Dialog.Close>
                    <Button variant="soft" color="gray">
                      {t('close')}
                    </Button>
                  </Dialog.Close>
                </Flex>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>
        </Flex>
      </Flex>

      <Grid columns="4" gap="4" mb="5">
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">{t('openTransactions')}</Text>
            <Heading size="7">24</Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">{t('pendingReconciliations')}</Text>
            <Heading size="7">8</Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">{t('avgPaymentTerms')}</Text>
            <Heading size="7">30 days</Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">{t('accountHealth')}</Text>
            <Progress value={92} />
          </Flex>
        </Card>
      </Grid>

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>{t('batchID')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('product')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('supplier')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('totalCost')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('paymentStatus')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('reconciliation')}</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {batches.map((batch) => (
            <Table.Row key={batch.id}>
              <Table.Cell>{batch.id}</Table.Cell>
              <Table.Cell>{batch.product}</Table.Cell>
              <Table.Cell>{batch.supplier}</Table.Cell>
              <Table.Cell>${batch.totalCost.toLocaleString()}</Table.Cell>
              <Table.Cell>
                <Badge color="green">Paid</Badge>
              </Table.Cell>
              <Table.Cell>
                <Badge color="blue">Reconciled</Badge>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <Flex mt="5" gap="4">
        <Card style={{ flex: 1 }}>
          <Heading size="4" mb="3">{t('costBreakdown')}</Heading>
          <div className="h-64">
            <BarChart width={500} height={250} data={batches}>
              <Bar dataKey="materialCost" fill="#3b82f6" name={t('material')} />
              <Bar dataKey="laborCost" fill="#ef4444" name={t('labor')} />
              <Bar dataKey="overhead" fill="#10b981" name={t('overhead')} />
            </BarChart>
          </div>
        </Card>
        <Card style={{ flex: 1 }}>
          <Heading size="4" mb="3">{t('supplierDistribution')}</Heading>
          <div className="h-64">
            <PieChart width={300} height={250}>
              <Pie
                data={[
                  { name: 'PharmaSource Inc.', value: 65 },
                  { name: 'Global Pharma', value: 25 },
                  { name: 'Others', value: 10 }
                ]}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              />
            </PieChart>
          </div>
        </Card>
      </Flex>
    </Box>
  );
};

export default OpenBookAccounting;
