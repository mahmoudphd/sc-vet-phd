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
// import { DialogClose, , DialogDescription, DialogTitle, DialogTrigger } from '@radix-ui/react-dialog';

const BatchCosting = () => {
  const { t } = useTranslation('batch-costing');
  const batches = [
    {
      id: 'VC23001',
      product: 'Anthelmintic Oral Suspension',
      materialCost: 24500,
      laborCost: 12000,
      overhead: 8500,
      totalCost: 45000,
      costPerUnit: 3.15,
      variance: '-2.5%'
    },
  ];

  return (
    <Box p="6">
      <Flex justify="between" align="center" mb="5">
        <Heading size="6">{t('batchCostAccounting')}</Heading>
        <Flex gap="3">
          <Dialog.Root>
            <Dialog.Trigger>
              <Button variant="soft">
                <MixerHorizontalIcon /> {t('newCostRun')}
              </Button>
            </Dialog.Trigger>

            <Dialog.Content>
              <Dialog.Title>{t('newCostRun')}</Dialog.Title>
              <Dialog.Description>
                {t('createNewCostDesc')}
              </Dialog.Description>

              <Flex direction="column" gap="3">
                <label>
                  <Text as="div" size="2" mb="1" weight="bold">
                    {t('costRunName')}
                  </Text>
                  <TextField.Root placeholder={t('enterRunName')} />
                </label>

                <label>
                  <Text as="div" size="2" mb="1" weight="bold">
                    {t('selectBatch')}
                  </Text>
                  <Select.Root>
                    <Select.Trigger />
                    <Select.Content>
                      <Select.Item value="vc23001">VC23001</Select.Item>
                      <Select.Item value="vc23002">VC23002</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </label>

                <Flex gap="3" mt="2" justify="end">
                  <Dialog.Close>
                    <Button variant="soft" color="gray">
                      {t('cancel')}
                    </Button>
                  </Dialog.Close>
                  <Button>{t('submit')}</Button>
                </Flex>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>
          <Dialog.Root>
            <Dialog.Trigger>
              <Button variant="soft">
                {t('compareStandards')}
              </Button>
            </Dialog.Trigger>

            <Dialog.Content maxWidth="600px">
              <Dialog.Title>{t('compareBatchStandards')}</Dialog.Title>

              <Grid columns="2" gap="4" mb="4">
                <Select.Root>
                  <Select.Trigger placeholder={t('selectBatch1')} />
                  <Select.Content>
                    <Select.Item value="vc23001">VC23001</Select.Item>
                    <Select.Item value="vc23002">VC23002</Select.Item>
                  </Select.Content>
                </Select.Root>

                <Select.Root>
                  <Select.Trigger placeholder={t('selectBatch2')} />
                  <Select.Content>
                    <Select.Item value="vc23001">VC23001</Select.Item>
                    <Select.Item value="vc23002">VC23002</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Grid>

              <Flex direction="column" gap="2">
                <Text size="4" weight="bold">{t('comparisonResults')}</Text>
                <Card variant="classic">
                  <Flex justify="between">
                    <Text>{t('totalCostDiff')}</Text>
                    <Badge color="ruby">+$1,200</Badge>
                  </Flex>
                  <Flex justify="between">
                    <Text>{t('materialVariance')}</Text>
                    <Badge color="jade">-4.2%</Badge>
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
            <Text size="2">{t('avgCostUnit')}</Text>
            <Heading size="7">$3.45</Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">{t('yieldVariance')}</Text>
            <Heading size="7" className="text-green-500">-1.8%</Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">{t('materialWaste')}</Text>
            <Heading size="7">4.5%</Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">{t('batchEfficiency')}</Text>
            <Progress value={88} />
          </Flex>
        </Card>
      </Grid>

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>{t('batchID')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('materialCost')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('conversionCost')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('totalCost')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('costPerUnit')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('variance')}</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {batches.map((batch) => (
            <Table.Row key={batch.id}>
              <Table.Cell>{batch.id}</Table.Cell>
              <Table.Cell>${batch.materialCost.toLocaleString()}</Table.Cell>
              <Table.Cell>
                ${(batch.laborCost + batch.overhead).toLocaleString()}
              </Table.Cell>
              <Table.Cell>${batch.totalCost.toLocaleString()}</Table.Cell>
              <Table.Cell>${batch.costPerUnit}</Table.Cell>
              <Table.Cell>
                <Badge color={batch.variance.startsWith('-') ? 'green' : 'red'}>
                  {batch.variance}
                </Badge>
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
          <Heading size="4" mb="3">{t('varianceAnalysis')}</Heading>
          <div className="h-64">
            <PieChart width={300} height={250}>
              <Pie
                data={[
                  { name: t('material'), value: 65 },
                  { name: t('labor'), value: 25 },
                  { name: t('overhead'), value: 10 }
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

export default BatchCosting;