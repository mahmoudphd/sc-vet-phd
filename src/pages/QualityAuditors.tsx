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
  DropdownMenu,
  Box,
  Dialog,
  TextField,
  Select
} from '@radix-ui/themes';
import {
  MagnifyingGlassIcon,
  FileTextIcon,
  CalendarIcon,
  CheckCircledIcon,
  CrossCircledIcon,
  PersonIcon,
  LockClosedIcon,
  TrashIcon,
  DownloadIcon
} from '@radix-ui/react-icons';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

const QualityAuditors = () => {
  const { t } = useTranslation('quality-auditors');
  const [scheduleAuditOpen, setScheduleAuditOpen] = useState(false);
  const [complianceReportOpen, setComplianceReportOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<{
    type: 'report' | 'approve' | 'finding' | null;
    auditorId: string | null;
  }>({ type: null, auditorId: null });

  const auditors = [
    {
      id: 'AUD-04521',
      firm: t('pharma-cert-eu'),
      certifications: [t('eu-gmp'), t('fda'), t('iso-9001')],
      lastAudit: '2023-06-15',
      findings: { critical: 2, major: 5, minor: 12 },
      status: t('active'),
      complianceScore: 98.4,
      nextAudit: '2024-01-15',
      capaStatus: t('in-progress')
    },
  ];

  return (
    <Box p="6" className="flex-1">
      <Flex justify="between" align="center" mb="5">
        <Heading size="6">{t('gmp-auditor-management-system')}</Heading>
        <Flex gap="3">
          {/* Schedule Audit Modal */}
          <Dialog.Root open={scheduleAuditOpen} onOpenChange={setScheduleAuditOpen}>
            <Dialog.Content>
              <Dialog.Title>{t('schedule-audit')}</Dialog.Title>
              <Flex direction="column" gap="3">
                <Select.Root>
                  <Select.Trigger placeholder={t('select-auditor')} />
                  <Select.Content>
                    {auditors.map(auditor => (
                      <Select.Item key={auditor.id} value={auditor.id}>
                        {auditor.firm}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>

                <TextField.Root type="date" placeholder={t('audit-date')} />

                <Flex gap="3" mt="4" justify="end">
                  <Button variant="soft" onClick={() => setScheduleAuditOpen(false)}>
                    {t('cancel')}
                  </Button>
                  <Button onClick={() => setScheduleAuditOpen(false)}>
                    {t('schedule')}
                  </Button>
                </Flex>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>
          {/* Compliance Report Modal */}
          <Dialog.Root open={complianceReportOpen} onOpenChange={setComplianceReportOpen}>
            <Dialog.Content>
              <Dialog.Title>{t('compliance-report')}</Dialog.Title>
              <Flex direction="column" gap="3">
                <Text>{t('generate-compliance-report')}</Text>
                <Select.Root>
                  <Select.Trigger placeholder={t('select-format')} />
                  <Select.Content>
                    <Select.Item value="pdf">PDF</Select.Item>
                    <Select.Item value="excel">Excel</Select.Item>
                  </Select.Content>
                </Select.Root>

                <Flex gap="3" mt="4" justify="end">
                  <Button variant="soft" onClick={() => setComplianceReportOpen(false)}>
                    {t('cancel')}
                  </Button>
                  <Button onClick={() => setComplianceReportOpen(false)}>
                    <DownloadIcon /> {t('download')}
                  </Button>
                </Flex>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>
        </Flex>
      </Flex>

            {/* Action Modals */}
            <Dialog.Root 
        open={selectedAction.type !== null} 
        onOpenChange={(open) => !open && setSelectedAction({ type: null, auditorId: null })}
      >
        <Dialog.Content>
          {selectedAction.type === 'report' && (
            <>
              <Dialog.Title>{t('audit-report')}</Dialog.Title>
              <Text>{t('download-audit-report')}</Text>
              <Flex gap="3" mt="4" justify="end">
                <Button variant="soft" onClick={() => setSelectedAction({ type: null, auditorId: null })}>
                  {t('cancel')}
                </Button>
                <Button>
                  <DownloadIcon /> {t('download')}
                </Button>
              </Flex>
            </>
          )}

          {selectedAction.type === 'approve' && (
            <>
              <Dialog.Title>{t('approve-capa')}</Dialog.Title>
              <Text>{t('approve-capa-confirm')}</Text>
              <Flex gap="3" mt="4" justify="end">
                <Button variant="soft" onClick={() => setSelectedAction({ type: null, auditorId: null })}>
                  {t('cancel')}
                </Button>
                <Button color="green">
                  <CheckCircledIcon /> {t('approve')}
                </Button>
              </Flex>
            </>
          )}

          {selectedAction.type === 'finding' && (
            <>
              <Dialog.Title>{t('raise-finding')}</Dialog.Title>
              <TextField.Root placeholder={t('finding-description')} />
              <Select.Root>
                <Select.Trigger placeholder={t('severity')} />
                <Select.Content>
                  <Select.Item value="critical">{t('critical')}</Select.Item>
                  <Select.Item value="major">{t('major')}</Select.Item>
                  <Select.Item value="minor">{t('minor')}</Select.Item>
                </Select.Content>
              </Select.Root>
              <Flex gap="3" mt="4" justify="end">
                <Button variant="soft" onClick={() => setSelectedAction({ type: null, auditorId: null })}>
                  {t('cancel')}
                </Button>
                <Button color="red">
                  <CrossCircledIcon /> {t('submit-finding')}
                </Button>
              </Flex>
            </>
          )}
        </Dialog.Content>
      </Dialog.Root>

      <Grid columns="4" gap="4" mb="5">
        <Card className="bg-green-50">
          <Flex direction="column" gap="1">
            <Text size="2">{t('certified-auditors')}</Text>
            <Heading size="7">24</Heading>
            <Text size="1" className="text-green-600">{t('98-compliant')}</Text>
          </Flex>
        </Card>
        <Card className="bg-amber-50">
          <Flex direction="column" gap="1">
            <Text size="2">{t('open-findings')}</Text>
            <Heading size="7" className="text-amber-600">45</Heading>
            <Text size="1">{t('12-critical')}</Text>
          </Flex>
        </Card>
        <Card className="bg-blue-50">
          <Flex direction="column" gap="1">
            <Text size="2">{t('avg-capa-time')}</Text>
            <Heading size="7">7.2 {t('days')}</Heading>
            <Progress value={65} />
          </Flex>
        </Card>
        <Card className="bg-purple-50">
          <Flex direction="column" gap="1">
            <Text size="2">{t('certifications')}</Text>
            <Heading size="7">{t('98-valid')}</Heading>
            <Text size="1">{t('3-expiring-soon')}</Text>
          </Flex>
        </Card>
      </Grid>

      <Flex gap="4" mb="5">
        <Card style={{ flex: 2 }}>
          <Heading size="4" mb="3" className="flex items-center gap-2">
            <CalendarIcon /> {t('audit-schedule')}
          </Heading>
          <div className="h-96">
            {/* GanttChart component */}
          </div>
        </Card>
        <Card style={{ flex: 1 }}>
          <Heading size="4" mb="3" className="flex items-center gap-2">
            <MagnifyingGlassIcon /> {t('compliance-heatmap')}
          </Heading>
          <div className="grid grid-cols-2 gap-4 h-96 p-4">
            {[t('eu-gmp'), t('fda'), t('iso-13485'), t('who')].map((standard) => (
              <Badge
                key={standard}
                variant="soft"
                className="h-24 flex items-center justify-center text-center"
              >
                <Text weight="bold">{standard}</Text>
                <Text size="1" className="text-green-600">98%</Text>
              </Badge>
            ))}
          </div>
        </Card>
      </Flex>

      <Table.Root variant="surface" className="mt-6">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>{t('audit-firm')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('certifications')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('last-audit')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('findings')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('compliance-score')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('capa-status')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('actions')}</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {auditors.map((auditor) => (
            <Table.Row key={auditor.id}>
              <Table.Cell>
                <Flex align="center" gap="2">
                  <PersonIcon className="text-blue-600" />
                  {auditor.firm}
                </Flex>
              </Table.Cell>
              <Table.Cell>
                <Flex gap="2">
                  {auditor.certifications.map(cert => (
                    <Badge key={cert} variant="outline" color="blue">
                      {cert}
                    </Badge>
                  ))}
                </Flex>
              </Table.Cell>
              <Table.Cell>
                <Flex align="center" gap="2">
                  <CalendarIcon />
                  {auditor.lastAudit}
                </Flex>
              </Table.Cell>
              <Table.Cell>
                <Flex gap="2">
                  <Badge color="red">{auditor.findings.critical} {t('critical')}</Badge>
                  <Badge color="amber">{auditor.findings.major} {t('major')}</Badge>
                  <Badge color="gray">{auditor.findings.minor} {t('minor')}</Badge>
                </Flex>
              </Table.Cell>
              <Table.Cell>
                <Progress value={auditor.complianceScore} />
                <Text size="1">{auditor.complianceScore}%</Text>
              </Table.Cell>
              <Table.Cell>
                <Badge
                  color={auditor.capaStatus === t('completed') ? 'green' : 'blue'}
                  variant="soft"
                >
                  {auditor.capaStatus}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    <Button variant="ghost">{t('actions')}</Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content>
                    <DropdownMenu.Item onSelect={() => setSelectedAction({ type: 'report', auditorId: auditor.id })}>
                      <FileTextIcon /> {t('audit-report')}
                    </DropdownMenu.Item>
                    <DropdownMenu.Item onSelect={() => setSelectedAction({ type: 'approve', auditorId: auditor.id })}>
                      <CheckCircledIcon /> {t('approve-capa')}
                    </DropdownMenu.Item>
                    <DropdownMenu.Item onSelect={() => setSelectedAction({ type: 'finding', auditorId: auditor.id })}>
                      <CrossCircledIcon /> {t('raise-finding')}
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

export default QualityAuditors;