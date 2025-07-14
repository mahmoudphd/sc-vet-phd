import {
  Card,
  Flex,
  Heading,
  Text,
  Badge,
  Table,
  Progress,
  Button,
  Grid,
  Box,
  Dialog,
  Select,
  TextField
} from '@radix-ui/themes';
import {
  GlobeIcon,
  BellIcon,
  DrawingPinIcon,
  Cross2Icon,
  StopwatchIcon
} from '@radix-ui/react-icons';
import { LineChart, ReferenceLine, Line } from 'recharts';
import { useTranslation } from 'react-i18next';



// Add these components near the top of your ColdChainMonitoring component
const NewShipmentModal = () => {
  const { t } = useTranslation('cold-chain-monitoring');
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button variant="soft">
          <DrawingPinIcon /> {t('new-shipment')}
        </Button>
      </Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 450 }}>
        <Flex justify="between" align="center" mb="4">
          <Dialog.Title>{t('new-shipment')}</Dialog.Title>
          <Dialog.Close>
            <Cross2Icon />
          </Dialog.Close>
        </Flex>

        <Flex direction="column" gap="3">
          <TextField.Root placeholder={t('shipment-id')} />

          <TextField.Root placeholder={t('product-name')} />

          <Select.Root>
            <Select.Trigger placeholder={t('storage-type')} />
            <Select.Content>
              <Select.Item value="vaccine">Vaccines</Select.Item>
              <Select.Item value="pharma">Pharmaceuticals</Select.Item>
              <Select.Item value="biologics">Biologics</Select.Item>
              <Select.Item value="other">Other</Select.Item>
            </Select.Content>
          </Select.Root>

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                {t('cancel')}
              </Button>
            </Dialog.Close>
            <Button>{t('create-shipment')}</Button>
          </Flex>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  )
};


interface Shipment {
  id: string;
  product: string;
  currentTemp: number;
  location: string;
  status: string;
  tempHistory: {
    time: string;
    temp: number;
  }[];
}
const ShipmentDetailsModal: React.FC<{ shipment: Shipment }> = ({ shipment }) => {
  const { t } = useTranslation('cold-chain-monitoring');
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button variant="soft" size="1">{t('view-details')}</Button>
      </Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 500 }}>
        <Flex justify="between" align="center" mb="4">
          <Dialog.Title>{t('shipment-details')}</Dialog.Title>
          <Dialog.Close>
            <Cross2Icon />
          </Dialog.Close>
        </Flex>

        <Flex direction="column" gap="3">
          <Text size="2"><strong>ID:</strong> {shipment.id}</Text>
          <Text size="2"><strong>{t('product')}:</strong> {shipment.product}</Text>
          <Text size="2"><strong>{t('temperature')}:</strong> {shipment.currentTemp}°C</Text>
          <Text size="2"><strong>{t('location')}:</strong> {shipment.location}</Text>

          <Box mt="2">
            <Text size="2" weight="bold" mb="2">{t('temperature-history')}</Text>
            <LineChart width={450} height={100} data={shipment.tempHistory}>
              <Line
                type="monotone"
                dataKey="temp"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </Box>

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
  )
};

const ComplianceReportModal = () => {
  const { t } = useTranslation('cold-chain-monitoring');
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button variant="soft">{t('export-compliance-report')}</Button>
      </Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 400 }}>
        <Flex justify="between" align="center" mb="4">
          <Dialog.Title>{t('export-report')}</Dialog.Title>
          <Dialog.Close>
            <Cross2Icon />
          </Dialog.Close>
        </Flex>

        <Flex direction="column" gap="3">
          <Select.Root>
            <Select.Trigger placeholder={t('select-format')} />
            <Select.Content>
              <Select.Item value="pdf">PDF</Select.Item>
              <Select.Item value="csv">CSV</Select.Item>
              <Select.Item value="excel">Excel</Select.Item>
            </Select.Content>
          </Select.Root>

          <TextField.Root type="date" placeholder={t('select-date-range')} />

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                {t('cancel')}
              </Button>
            </Dialog.Close>
            <Button color="green">{t('export')}</Button>
          </Flex>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  )
};


const ColdChainMonitoring = () => {
  const { t } = useTranslation('cold-chain-monitoring');
  const shipments = [
    {
      id: 'SH-23001',
      product: 'Vaccine Adjuvant',
      currentTemp: 2.8,
      location: 'Warehouse B',
      status: t('in-transit'),
      tempHistory: [
        { time: '00:00', temp: 2.5 },
        { time: '04:00', temp: 2.7 },
        { time: '08:00', temp: 3.1 }
      ]
    }
  ];

  return (
    <Box p="6" className="flex-1">
      <Flex justify="between" align="center" mb="5">
        <Heading size="6">{t('active-cold-chain-monitoring')}</Heading>
        <Flex gap="3">
          <NewShipmentModal />
          <ComplianceReportModal />
        </Flex>
      </Flex>

      <Grid columns="3" gap="4" mb="5">
        <Card>
          <Flex direction="column" gap="2">
            <Flex align="center" gap="2">
              <StopwatchIcon />
              <Text size="2">{t('mean-temperature')}</Text>
            </Flex>
            <Heading size="7">2.8°C</Heading>
            <Badge color="green" variant="soft">{t('within-range')}</Badge>
          </Flex>
        </Card>

        <Card>
          <Flex direction="column" gap="2">
            <Flex align="center" gap="2">
              <GlobeIcon />
              <Text size="2">{t('active-shipments')}</Text>
            </Flex>
            <Heading size="7">24</Heading>
            <Progress value={85} />
          </Flex>
        </Card>

        <Card>
          <Flex direction="column" gap="2">
            <Flex align="center" gap="2">
              <BellIcon />
              <Text size="2">{t('active-alerts')}</Text>
            </Flex>
            <Heading size="7" className="text-red-500">2</Heading>
            <Text size="1">{t('last-24-hours')}</Text>
          </Flex>
        </Card>
      </Grid>

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>{t('shipment')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('temperature-trend')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('location')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('status')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('actions')}</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {shipments.map((shipment) => (
            <Table.Row key={shipment.id}>
              <Table.Cell>{shipment.id}</Table.Cell>
              <Table.Cell>
                <div className="w-48 h-12">
                  <LineChart width={200} height={50} data={shipment.tempHistory}>
                    <Line
                      type="monotone"
                      dataKey="temp"
                      stroke={shipment.currentTemp > 5 ? "#ef4444" : "#3b82f6"}
                      dot={false}
                    />
                    <ReferenceLine y={5} stroke="#ef4444" strokeDasharray="3 3" />
                  </LineChart>
                </div>
              </Table.Cell>
              <Table.Cell>{shipment.location}</Table.Cell>
              <Table.Cell>
                <Badge color="green" variant="soft">
                  {shipment.status}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <Button variant="soft" size="1">{t('view-details')}</Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <Flex mt="5" direction="column" gap="3">
        <Heading size="5">{t('geographical-distribution')}</Heading>
        <div className="h-64 bg-gray-100 rounded-lg">
          <Flex justify="center" align="center" height="100%">
            <Text className="text-gray-400">{t('gps-tracking-map')}</Text>
          </Flex>
        </div>
      </Flex>
    </Box>
  );
};

export default ColdChainMonitoring;