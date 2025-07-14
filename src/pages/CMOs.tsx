import {
  Card,
  Flex,
  Heading,
  Table,
  Badge,
  Button,
  Grid,
  Text,
  Progress,
  Box,
  Dialog,
  TextField,
  Select,
  Link
} from '@radix-ui/themes';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

const CMOs = () => {
  const { t } = useTranslation('cmo-oversight');
  const [selectedCMO, setSelectedCMO] = useState<any>(null);
  const [selectedStandard, setSelectedStandard] = useState<any>(null);

  const cmos = [
    {
      id: 'CMO-789',
      name: 'BioPharm Solutions',
      capability: 'Sterile Injectables',
      compliance: 'EU GMP',
      capacity: '85%',
      auditScore: 98,
      batches: 'VC23001, VC23002',
      contact: 'cmo@biopharm.example',
      location: 'Basel, Switzerland'
    },
  ];

  const certificationDetails: any = {
    'EU GMP': t('eu-gmp-desc'),
    'FDA': t('fda-desc'),
    'WHO': t('who-desc'),
    'ISO 13485': t('iso13485-desc')
  };

  return (
    <Box p="6" className="flex-1">
      <Dialog.Root open={!!selectedCMO} onOpenChange={() => setSelectedCMO(null)}>
        <Dialog.Content style={{ maxWidth: 600 }}>
          {selectedCMO && (
            <>
              <Dialog.Title>{selectedCMO.name}</Dialog.Title>
              <Flex direction="column" gap="3">
                <Text>{t('capabilities')}: {selectedCMO.capability}</Text>
                <Text>{t('location')}: {selectedCMO.location}</Text>
                <Text>{t('contact')}: <Link href={`mailto:${selectedCMO.contact}`}>{selectedCMO.contact}</Link></Text>
                <Text>{t('active-batches')}: {selectedCMO.batches}</Text>
                <Button variant="soft" onClick={() => setSelectedCMO(null)}>
                  {t('close')}
                </Button>
              </Flex>
            </>
          )}
        </Dialog.Content>
      </Dialog.Root>

      {/* Certification Modal */}
      <Dialog.Root open={!!selectedStandard} onOpenChange={() => setSelectedStandard(null)}>
        <Dialog.Content style={{ maxWidth: 500 }}>
          <Dialog.Title>{selectedStandard} {t('certification')}</Dialog.Title>
          <Text as="div" size="2" mb="4">
            {certificationDetails[selectedStandard]}
          </Text>
          <Button variant="soft" onClick={() => setSelectedStandard(null)}>
            {t('close')}
          </Button>
        </Dialog.Content>
      </Dialog.Root>

      <Flex justify="between" align="center" mb="5">
        <Heading size="6">{t('contract-manufacturing-oversight')}</Heading>
        <Flex gap="3">
          <Dialog.Root>
            <Dialog.Trigger>
              <Button variant="soft">{t('capacity-planner')}</Button>
            </Dialog.Trigger>
            <Dialog.Content style={{ maxWidth: 800 }}>
              <Dialog.Title>{t('capacity-planner')}</Dialog.Title>
              <Flex direction="column" gap="3">
                <Text>{t('capacity-planner-desc')}</Text>
                {/* Add Gantt Chart component here */}
                <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Text color="gray">{t('gantt-chart-placeholder')}</Text>
                </div>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>

          <Dialog.Root>
            <Dialog.Trigger>
              <Button variant="soft">{t('quality-dashboard')}</Button>
            </Dialog.Trigger>
            <Dialog.Content style={{ maxWidth: 800 }}>
              <Dialog.Title>{t('quality-dashboard')}</Dialog.Title>
              <Grid columns="2" gap="4">
                <Card>
                  <Heading size="2" mb="2">{t('critical-deviations')}</Heading>
                  <Text size="7" color="red">3</Text>
                </Card>
                <Card>
                  <Heading size="2" mb="2">{t('batch-success-rate')}</Heading>
                  <Text size="7" color="green">98.2%</Text>
                </Card>
              </Grid>
            </Dialog.Content>
          </Dialog.Root>

        </Flex>
      </Flex>

      <Grid columns="4" gap="4" mb="5">
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">{t('approved-cmos')}</Text>
            <Heading size="7">15</Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">{t('avg-audit-score')}</Text>
            <Heading size="7">96.4</Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">{t('active-batches')}</Text>
            <Heading size="7">45</Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">{t('yield-variance')}</Text>
            <Heading size="7" className="text-red-500">+2.1%</Heading>
          </Flex>
        </Card>
      </Grid>

      <Flex gap="4" mb="5">
        <Card style={{ flex: 1 }}>
          <Heading size="4" mb="3">{t('production-schedule')}</Heading>
          {/* <div className="h-64">
            <GanttChart />
          </div> */}
        </Card>
        <Card style={{ flex: 1 }}>
          <Heading size="4" mb="3">{t('compliance-matrix')}</Heading>
          <div className="h-64 grid grid-cols-2 gap-4">
            {['EU GMP', 'FDA', 'WHO', 'ISO 13485'].map((standard) => (
              <Badge 
                key={standard} 
                variant="soft" 
                color="green"
                onClick={() => setSelectedStandard(standard)}
                style={{ cursor: 'pointer' }}
              >
                {t('certified-label', { standard })}
              </Badge>
            ))}
          </div>
        </Card>
      </Flex>

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>{t('cmo')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('capabilities')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('compliance')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('capacity')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('audit-score')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('active-batches')}</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {cmos.map((cmo) => (
            <Table.Row 
              key={cmo.id} 
              onClick={() => setSelectedCMO(cmo)}
              style={{ cursor: 'pointer' }}
            >
              <Table.Cell>{cmo.name}</Table.Cell>
              <Table.Cell>{cmo.capability}</Table.Cell>
              <Table.Cell>
                <Badge variant="soft" color="green">
                  {cmo.compliance}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <Progress value={parseInt(cmo.capacity)} />
              </Table.Cell>
              <Table.Cell>{cmo.auditScore}/100</Table.Cell>
              <Table.Cell>{cmo.batches}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

export default CMOs;