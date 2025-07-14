import {
  Table,
  Badge,
  Card,
  Flex,
  Heading,
  Text,
  Button,
  Box,
  TextArea,
  TextField,
  Dialog,
  Select
} from '@radix-ui/themes';
import { BarChart, XAxis, YAxis, Bar } from 'recharts';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

const DeviationManagement = () => {
  const { t } = useTranslation('deviation-management');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selectedCapa, setSelectedCapa] = useState<any>(null);
  const [selectedDeviation, setSelectedDeviation] = useState<any>(null);

  const deviations = [
    {
      id: 'DEV-0231',
      description: t('temperature-excursion'),
      severity: t('severity-major'),
      rootCause: t('cooling-system-failure'),
      status: t('status-under-investigation'),
      capa: 'CAPA-0045'
    },
  ];

  return (
    <Box p="6">
      <Flex justify="between" align="center" mb="5">
        <Heading size="6">{t('deviation-tracking-system')}</Heading>
        <Dialog.Root open={isNewModalOpen} onOpenChange={setIsNewModalOpen}>
          <Dialog.Trigger>
            <Button variant="soft">{t('new-deviation-button')}</Button>
          </Dialog.Trigger>

          <Dialog.Content style={{ maxWidth: 450 }}>
            <Dialog.Title>{t('new-deviation')}</Dialog.Title>
            <Flex direction="column" gap="3">
              <TextField.Root>
                <TextField.Slot>{t('description')}</TextField.Slot>
              </TextField.Root>

              <Select.Root>
                <Select.Trigger placeholder={t('severity')} />
                <Select.Content>
                  <Select.Item value="critical">{t('severity-critical')}</Select.Item>
                  <Select.Item value="major">{t('severity-major')}</Select.Item>
                  <Select.Item value="minor">{t('severity-minor')}</Select.Item>
                </Select.Content>
              </Select.Root>

              <TextField.Root>
                <TextField.Slot>{t('root-cause')}</TextField.Slot>
              </TextField.Root>

              <Flex gap="3" mt="4" justify="end">
                <Button variant="soft" onClick={() => setIsNewModalOpen(false)}>
                  {t('cancel')}
                </Button>
                <Button>{t('submit')}</Button>
              </Flex>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      </Flex>

      <Dialog.Root open={!!selectedCapa} onOpenChange={() => setSelectedCapa(null)}>
        <Dialog.Content style={{ maxWidth: 450 }}>
          <Dialog.Title>{t('capa-details')}</Dialog.Title>
          <Flex direction="column" gap="2">
            <Text><strong>{t('capa-id')}:</strong> {selectedCapa}</Text>
            <Text><strong>{t('status')}:</strong> {t('status-in-progress')}</Text>
            <Text><strong>{t('actions')}:</strong> {t('cooling-system-repair')}</Text>
            <Text><strong>{t('due-date')}:</strong> 2024-03-15</Text>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

       {/* Deviation Details Modal */}
      <Dialog.Root open={!!selectedDeviation} onOpenChange={() => setSelectedDeviation(null)}>
        <Dialog.Content style={{ maxWidth: 600 }}>
          {selectedDeviation && (
            <>
              <Dialog.Title>{selectedDeviation.id}</Dialog.Title>
              <Flex direction="column" gap="3">
                <Text><strong>{t('description')}:</strong> {selectedDeviation.description}</Text>
                <Text><strong>{t('severity')}:</strong> {selectedDeviation.severity}</Text>
                <Text><strong>{t('root-cause')}:</strong> {selectedDeviation.rootCause}</Text>
                <Text><strong>{t('status')}:</strong> {selectedDeviation.status}</Text>
                <Text><strong>{t('capa-link')}:</strong> {selectedDeviation.capa}</Text>
              </Flex>
            </>
          )}
        </Dialog.Content>
      </Dialog.Root>

      <Flex gap="4" mb="5">
        <Card style={{ flex: 1 }}>
          <Flex direction="column" gap="1">
            <Text size="2">{t('open-deviations')}</Text>
            <Heading size="7">{t('active-count', { count: 5 })}</Heading>
          </Flex>
        </Card>
        <Card style={{ flex: 1 }}>
          <Flex direction="column" gap="1">
            <Text size="2">{t('avg-resolution-time')}</Text>
            <Heading size="7">{t('resolution-days', { days: 7.2 })}</Heading>
          </Flex>
        </Card>
      </Flex>

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>{t('deviation-id')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('description')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('severity')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('root-cause')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('status')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('capa-link')}</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {deviations.map((dev) => (
            <Table.Row key={dev.id}>
              <Table.Cell>{dev.id}</Table.Cell>
              <Table.Cell>{dev.description}</Table.Cell>
              <Table.Cell>
                <Badge
                  color={
                    dev.severity === t('severity-critical') ? 'red' :
                      dev.severity === t('severity-major') ? 'amber' : 'green'
                  }
                >
                  {dev.severity}
                </Badge>
              </Table.Cell>
              <Table.Cell>{dev.rootCause}</Table.Cell>
              <Table.Cell>
                <Badge
                  color={
                    dev.status === t('status-closed') ? 'green' :
                      dev.status === t('status-under-investigation') ? 'amber' : 'red'
                  }
                  variant="soft"
                >
                  {dev.status}
                </Badge>
              </Table.Cell>
              <Table.Cell>
              <Button 
                  variant="ghost" 
                  size="1"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCapa(dev.capa);
                  }}>
                  {dev.capa}
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <Flex mt="5" direction="column" gap="3">
        <Heading size="5">{t('deviation-trend-analysis')}</Heading>
        <div className="h-64">
          <BarChart
            data={[]}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis dataKey={t('month')} />
            <YAxis />
            <Bar dataKey={t('deviations')} fill="#ef4444" />
          </BarChart>
        </div>
      </Flex>
    </Box>
  );
};

export default DeviationManagement;