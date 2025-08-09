import { 
  Card, 
  Flex, 
  Heading, 
  Text, 
  Badge, 
  Table, 
  Button, 
  Grid,
  Box,
  Dialog,
  TextField,
  Select
} from '@radix-ui/themes';
import { MixerHorizontalIcon } from '@radix-ui/react-icons';
import { useTranslation } from 'react-i18next';
import { differenceInDays } from 'date-fns';

const equipmentData = [
  { id: 'EQ00001', name: 'سير العبوات', criticality: 'حرج', lastService: '2025-04-01', status: 'تشغيلي', nextDue: 'شهري', iot: true },
  { id: 'EQ00002', name: 'بوابة حجز العبوات', criticality: 'حرج', lastService: '2025-04-05', status: 'تشغيلي', nextDue: 'أسبوعي', iot: true },
  { id: 'EQ00003', name: 'ماسك العبوات', criticality: 'حرج', lastService: '2025-04-07', status: 'تشغيلي', nextDue: 'أسبوعي', iot: true },
  { id: 'EQ00004', name: 'نوزل التعبئة', criticality: 'حرج', lastService: '2025-04-07', status: 'تشغيلي', nextDue: 'أسبوعي', iot: false },
  { id: 'EQ00005', name: 'بوابة مسار الخامة', criticality: 'حرج', lastService: '2025-04-07', status: 'تشغيلي', nextDue: 'أسبوعي', iot: false },
  { id: 'EQ00006', name: 'بستم التعبئة', criticality: 'حرج', lastService: '2025-04-01', status: 'تشغيلي', nextDue: 'شهري', iot: false },
  { id: 'EQ00007', name: 'أسطوانة التعبئة', criticality: 'حرج', lastService: '2025-03-15', status: 'تشغيلي', nextDue: 'نصف سنوي', iot: false },
  { id: 'EQ00008', name: 'هوبر الماكينة', criticality: 'حرج', lastService: '2025-03-15', status: 'تشغيلي', nextDue: 'نصف سنوي', iot: false },
  { id: 'EQ00009', name: 'حساس العبوات', criticality: 'حرج', lastService: '2025-04-01', status: 'تشغيلي', nextDue: 'شهري', iot: true },
  { id: 'EQ00010', name: 'حساس الموضع', criticality: 'حرج', lastService: '2025-04-01', status: 'تشغيلي', nextDue: 'شهري', iot: true },
  { id: 'EQ00011', name: 'سيرفو موتور التعبئة', criticality: 'حرج', lastService: '2025-04-01', status: 'تشغيلي', nextDue: 'شهري', iot: false },
  { id: 'EQ00012', name: 'سيرفو موتور النوزل', criticality: 'حرج', lastService: '2025-04-01', status: 'تشغيلي', nextDue: 'شهري', iot: false },
];

const EquipmentMaintenance = () => {
  const { t } = useTranslation('equipment-maintenance');

  const criticalCount = equipmentData.filter(eq => eq.criticality === 'حرج').length;

  const overdueCount = equipmentData.filter(eq => {
    const last = new Date(eq.lastService);
    const today = new Date();
    const daysDiff = differenceInDays(today, last);
    return daysDiff > 30;
  }).length;

  const calibrationCompliance = '100%';

  return (
    <Box p="6">
      <Flex justify="between" align="center" mb="5">
        <Flex align="center" gap="3">
          <Heading size="6">{t('equipment-maintenance-register')}</Heading>
          <Button color="green" variant="solid">
            Submit to Blockchain
          </Button>
        </Flex>
        <Flex gap="3">
          <Dialog.Root>
            <Dialog.Trigger>
              <Button variant="soft">
                <MixerHorizontalIcon /> {t('new-work-order')}
              </Button>
            </Dialog.Trigger>
            <Dialog.Content>
              <Dialog.Title>{t('new-work-order')}</Dialog.Title>
              <Flex direction="column" gap="3">
                <TextField.Root placeholder={t('title')} />
                <TextField.Root placeholder={t('description')} />
                <Select.Root>
                  <Select.Trigger placeholder={t('priority')} />
                  <Select.Content>
                    <Select.Item value="high">{t('high')}</Select.Item>
                    <Select.Item value="medium">{t('medium')}</Select.Item>
                    <Select.Item value="low">{t('low')}</Select.Item>
                  </Select.Content>
                </Select.Root>
                <TextField.Root type="date" placeholder={t('due-date')} />
                <Flex gap="3" justify="end">
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
                {t('calibration-schedule')}
              </Button>
            </Dialog.Trigger>
            <Dialog.Content>
              <Dialog.Title>{t('calibration-schedule')}</Dialog.Title>
              <Flex direction="column" gap="3">
                <Select.Root>
                  <Select.Trigger placeholder={t('select-equipment')} />
                  <Select.Content>
                    {equipmentData.map((item) => (
                      <Select.Item key={item.id} value={item.id}>
                        {item.name}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
                <TextField.Root type="date" placeholder={t('calibration-date')} />
                <TextField.Root placeholder={t('technician')} />
                <Flex gap="3" justify="end">
                  <Dialog.Close>
                    <Button variant="soft" color="gray">
                      {t('cancel')}
                    </Button>
                  </Dialog.Close>
                  <Button>{t('schedule')}</Button>
                </Flex>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>
        </Flex>
      </Flex>

      <Grid columns="3" gap="4" mb="5">
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">{t('critical-equipment')}</Text>
            <Heading size="7">{criticalCount}</Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">{t('overdue-maintenance')}</Text>
            <Heading size="7" className="text-red-500">{overdueCount}</Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">{t('calibration-compliance')}</Text>
            <Heading size="7">{calibrationCompliance}</Heading>
          </Flex>
        </Card>
      </Grid>

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>رقم الجهاز</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>اسم الجزء</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>الأهمية</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>آخر صيانة</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>الحالة</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>التكرار</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {equipmentData.map((item) => (
            <Table.Row key={item.id}>
              <Table.Cell>{item.id}</Table.Cell>
              <Table.Cell style={{ direction: 'rtl' }}>
                <Flex align="center" gap="2">
                  <Text>{item.name}</Text>
                  {item.iot && (
                    <Text size="2" color="blue" weight="medium">
                      (via IoT)
                    </Text>
                  )}
                </Flex>
              </Table.Cell>
              <Table.Cell>
                <Badge color="red" variant="soft">{item.criticality}</Badge>
              </Table.Cell>
              <Table.Cell>{item.lastService}</Table.Cell>
              <Table.Cell>
                <Badge color="green" variant="soft">{item.status}</Badge>
              </Table.Cell>
              <Table.Cell>{item.nextDue}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

export default EquipmentMaintenance;
