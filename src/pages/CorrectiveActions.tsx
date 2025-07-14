import { 
  Table, 
  Badge, 
  Button, 
  Flex, 
  Heading,
  Card,
  Text,
  Box,
  Select,
  TextField,
  Dialog,
  TextArea
} from '@radix-ui/themes';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const CorrectiveActions = () => {
  const { t } = useTranslation('corrective-actions');

  const [selectedCapa, setSelectedCapa] = useState<any>(null);
  const [selectedDeviation, setSelectedDeviation] = useState<any>(null);
  const [isInitiateOpen, setIsInitiateOpen] = useState<any>(false);

  const capas = [
    {
      id: 'CAPA-0045',
      description: 'Implement preventive maintenance schedule',
      dueDate: '2023-09-01',
      status: 'in-progress',
      effectiveness: 'pending',
      relatedDeviation: 'DEV-0231'
    },
  ];

  return (
    <Box p="6">
      <Flex justify="between" align="center" mb="5">
        <Heading size="6">{t('page-title')}</Heading>
        <Dialog.Root open={isInitiateOpen} onOpenChange={setIsInitiateOpen}>
          <Dialog.Trigger>
            <Button variant="soft">{t('initiate-capa')}</Button>
          </Dialog.Trigger>

        <Dialog.Content style={{ maxWidth: 450 }}>
          <Dialog.Title>{t('initiate-capa')}</Dialog.Title>
          
          <Flex direction="column" gap="3">
            <TextField.Root>
              <TextField.Slot>{t('capa-id')}</TextField.Slot>
            </TextField.Root>

            <TextArea 
              placeholder={t('action-description')} 
              style={{ height: 100 }}
            />

            <TextField.Root  type="date">
              <TextField.Slot>{t('due-date')}</TextField.Slot>
            </TextField.Root>

            <Select.Root>
              <Select.Trigger>
                {/* <Select. placeholder={t('select-status')} /> */}
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="pending">{t('statuses.pending')}</Select.Item>
                <Select.Item value="in-progress">{t('statuses.in-progress')}</Select.Item>
              </Select.Content>
            </Select.Root>

            <Flex gap="3" justify="end">
              <Button variant="soft" onClick={() => setIsInitiateOpen(false)}>
                {t('cancel')}
              </Button>
              <Button>{t('submit')}</Button>
            </Flex>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
      </Flex>


          {/* CAPA Details Modal */}
          <Dialog.Root open={!!selectedCapa} onOpenChange={open => !open && setSelectedCapa(null)}>
        <Dialog.Content>
          {selectedCapa && (
            <>
              <Dialog.Title>{selectedCapa.id}</Dialog.Title>
              
              <Flex direction="column" gap="2">
                <Text weight="bold">{t('action')}:</Text>
                <Text>{selectedCapa.description}</Text>

                <Text weight="bold">{t('due-date')}:</Text>
                <Text>{selectedCapa.dueDate}</Text>

                <Text weight="bold">{t('status')}:</Text>
                <Badge color={selectedCapa.status === 'completed' ? 'green' : 'amber'}>
                  {t(`statuses.${selectedCapa.status}`)}
                </Badge>

                <Button 
                  variant="ghost" 
                  onClick={() => {
                    setSelectedDeviation(selectedCapa.relatedDeviation);
                    setSelectedCapa(null);
                  }}
                >
                  {t('view-linked-deviation')}
                </Button>
              </Flex>
              
              <Flex gap="3" justify="end" mt="4">
                <Button onClick={() => setSelectedCapa(null)}>
                  {t('close')}
                </Button>
              </Flex>
            </>
          )}
        </Dialog.Content>
      </Dialog.Root>

      {/* Deviation Details Modal */}
      <Dialog.Root open={!!selectedDeviation} onOpenChange={open => !open && setSelectedDeviation(null)}>
        <Dialog.Content>
          <Dialog.Title>{selectedDeviation}</Dialog.Title>
          <Text>{t('deviation-details-placeholder')}</Text>
          
          <Flex gap="3" justify="end" mt="4">
            <Button onClick={() => setSelectedDeviation(null)}>
              {t('close')}
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>


      <Flex gap="4" mb="5">
        <Card style={{ flex: 1 }}>
          <Flex direction="column" gap="1">
            <Text size="2">{t('overdue-actions')}</Text>
            <Heading size="7" className="text-red-500">2</Heading>
          </Flex>
        </Card>
        <Card style={{ flex: 1 }}>
          <Flex direction="column" gap="1">
            <Text size="2">{t('effectiveness-rate')}</Text>
            <Heading size="7">92%</Heading>
          </Flex>
        </Card>
      </Flex>

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>{t('table-headers.capa-id')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('table-headers.action')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('table-headers.due-date')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('table-headers.status')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('table-headers.effectiveness')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('table-headers.linked-deviation')}</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {capas.map((capa) => (
            <Table.Row key={capa.id}>
              <Table.Cell>{capa.id}</Table.Cell>
              <Table.Cell>{capa.description}</Table.Cell>
              <Table.Cell>{capa.dueDate}</Table.Cell>
              <Table.Cell>
                <Badge 
                  color={
                    capa.status === 'completed' ? 'green' :
                    capa.status === 'in-progress' ? 'amber' : 'red'
                  }
                  variant="soft"
                >
                  {t(`statuses.${capa.status}`)}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <Badge 
                  color={
                    capa.effectiveness === 'effective' ? 'green' :
                    capa.effectiveness === 'pending' ? 'amber' : 'red'
                  }
                >
                  {t(`effectiveness-statuses.${capa.effectiveness}`)}
                </Badge>
              </Table.Cell>
              <Table.Cell>
              <Button 
                  variant="ghost" 
                  size="1"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedDeviation(capa.relatedDeviation);
                  }}
                >
                  {capa.relatedDeviation}
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

export default CorrectiveActions;