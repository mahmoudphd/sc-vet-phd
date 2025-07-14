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
  Select,
  TextArea,
  Dialog,
  TextField
} from '@radix-ui/themes';
import { useTranslation } from 'react-i18next';

const PreventiveMaintenance = () => {
  const { t } = useTranslation('preventive-maintenance');
  const maintenanceSchedule = [
    {
      equipment: 'Lyophilizer-03',
      lastService: '2023-06-15',
      nextDue: '2023-09-15',
      status: 'Scheduled',
      criticality: 'High'
    }
  ];

  return (
    <Box p="6" className="flex-1">
      <Flex justify="between" align="center" mb="5">
        <Heading size="6">{t('equipment-maintenance-program')}</Heading>
         {/* New Work Order Modal */}
         <Dialog.Root>
          <Dialog.Trigger>
            <Button variant="soft">
              {t('new-work-order')}
            </Button>
          </Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Title>{t('new-work-order')}</Dialog.Title>
            
            <Flex direction="column" gap="3">
              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  {t('title')}
                </Text>
                <TextField.Root placeholder={t('enter-title')} />
              </label>

              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  {t('description')}
                </Text>
                <TextArea placeholder={t('enter-description')} />
              </label>

              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  {t('priority')}
                </Text>
                <Select.Root>
                  <Select.Trigger />
                  <Select.Content>
                    <Select.Item value="high">{t('high')}</Select.Item>
                    <Select.Item value="medium">{t('medium')}</Select.Item>
                    <Select.Item value="low">{t('low')}</Select.Item>
                  </Select.Content>
                </Select.Root>
              </label>

              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  {t('due-date')}
                </Text>
                <TextField.Root type="date" />
              </label>

              <Flex gap="3" mt="4" justify="end">
                <Dialog.Close>
                  <Button variant="soft" color="gray">
                    {t('cancel')}
                  </Button>
                </Dialog.Close>
                <Button>{t('create-order')}</Button>
              </Flex>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      </Flex>

      <Grid columns="2" gap="4" mb="5">
        <Card>
          <Flex direction="column" gap="2">
            <Text>{t('pending-actions')}</Text>
            <Heading size="7">12</Heading>
            <Progress value={65} />
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="2">
            <Text>{t('overdue-tasks')}</Text>
            <Heading size="7" className="text-red-500">3</Heading>
            <Text size="1">{t('require-immediate-action')}</Text>
          </Flex>
        </Card>
      </Grid>

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>{t('equipment')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('last-service')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('next-due')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('status')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('criticality')}</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {maintenanceSchedule.map((item) => (
            <Table.Row key={item.equipment}>
              <Table.Cell>{item.equipment}</Table.Cell>
              <Table.Cell>{item.lastService}</Table.Cell>
              <Table.Cell>{item.nextDue}</Table.Cell>
              <Table.Cell>
                <Badge 
                  color={item.status === 'Scheduled' ? 'green' : 'red'} 
                  variant="soft"
                >
                  {item.status}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <Badge 
                  color={
                    item.criticality === 'High' ? 'red' :
                    item.criticality === 'Medium' ? 'amber' : 'green'
                  }
                >
                  {item.criticality}
                </Badge>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <Flex mt="5" direction="column" gap="3">
        <Heading size="5">{t('maintenance-calendar')}</Heading>
        <div className="h-96">
          <Flex justify="center" align="center" height="100%" className="bg-gray-100 rounded-lg">
            <Text className="text-gray-400">{t('maintenance-schedule-calendar')}</Text>
          </Flex>
        </div>
      </Flex>
    </Box>
  );
};

export default PreventiveMaintenance;