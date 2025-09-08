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
      id: 'AUD-001',
      firm: 'Egyptian Drug Authority (EDA)',
      certifications: [
        'WHO GBT', 
        'OMCL Network', 
        'ISO 9001:2015',
        'ISO/IEC 17025:2017',
        'ISO/IEC 17043:2010',
        'ISO/IEC 17034:2016'
      ],
      lastAudit: '2024-01-20',
      findings: { critical: 0, major: 2, minor: 5 },
      status: 'Active',
      complianceScore: 98.7,
      nextAudit: '2024-07-15',
      capaStatus: 'In Progress',
      country: 'Egypt',
      accreditationStatus: 'Valid'
    },
  ];

  return (
    <Box p="6" className="flex-1">
      <Flex justify="between" align="center" mb="5">
        <Heading size="6">GMP Auditor Management System</Heading>
        <Flex gap="3">
          <Button variant="soft" onClick={() => setScheduleAuditOpen(true)}>
            <CalendarIcon /> Schedule Audit
          </Button>
          <Button variant="soft" onClick={() => setComplianceReportOpen(true)}>
            <DownloadIcon /> Compliance Report
          </Button>
        </Flex>
      </Flex>

      {/* Schedule Audit Modal */}
      <Dialog.Root open={scheduleAuditOpen} onOpenChange={setScheduleAuditOpen}>
        <Dialog.Content>
          <Dialog.Title>Schedule Audit</Dialog.Title>
          <Flex direction="column" gap="3">
            <Select.Root>
              <Select.Trigger placeholder="Select auditor" />
              <Select.Content>
                {auditors.map(auditor => (
                  <Select.Item key={auditor.id} value={auditor.id}>
                    {auditor.firm}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>

            <TextField.Root type="date" placeholder="Audit date" />

            <Flex gap="3" mt="4" justify="end">
              <Button variant="soft" onClick={() => setScheduleAuditOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setScheduleAuditOpen(false)}>
                Schedule
              </Button>
            </Flex>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      {/* Compliance Report Modal */}
      <Dialog.Root open={complianceReportOpen} onOpenChange={setComplianceReportOpen}>
        <Dialog.Content>
          <Dialog.Title>Compliance Report</Dialog.Title>
          <Flex direction="column" gap="3">
            <Text>Generate compliance report</Text>
            <Select.Root>
              <Select.Trigger placeholder="Select format" />
              <Select.Content>
                <Select.Item value="pdf">PDF</Select.Item>
                <Select.Item value="excel">Excel</Select.Item>
              </Select.Content>
            </Select.Root>

            <Flex gap="3" mt="4" justify="end">
              <Button variant="soft" onClick={() => setComplianceReportOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setComplianceReportOpen(false)}>
                <DownloadIcon /> Download
              </Button>
            </Flex>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      {/* Action Modals */}
      <Dialog.Root 
        open={selectedAction.type !== null} 
        onOpenChange={(open) => !open && setSelectedAction({ type: null, auditorId: null })}
      >
        <Dialog.Content>
          {selectedAction.type === 'report' && (
            <>
              <Dialog.Title>Audit Report</Dialog.Title>
              <Text>Download audit report</Text>
              <Flex gap="3" mt="4" justify="end">
                <Button variant="soft" onClick={() => setSelectedAction({ type: null, auditorId: null })}>
                  Cancel
                </Button>
                <Button>
                  <DownloadIcon /> Download
                </Button>
              </Flex>
            </>
          )}

          {selectedAction.type === 'approve' && (
            <>
              <Dialog.Title>Approve CAPA</Dialog.Title>
              <Text>Approve corrective action plan</Text>
              <Flex gap="3" mt="4" justify="end">
                <Button variant="soft" onClick={() => setSelectedAction({ type: null, auditorId: null })}>
                  Cancel
                </Button>
                <Button color="green">
                  <CheckCircledIcon /> Approve
                </Button>
              </Flex>
            </>
          )}

          {selectedAction.type === 'finding' && (
            <>
              <Dialog.Title>Raise Finding</Dialog.Title>
              <TextField.Root placeholder="Finding description" />
              <Select.Root>
                <Select.Trigger placeholder="Severity" />
                <Select.Content>
                  <Select.Item value="critical">Critical</Select.Item>
                  <Select.Item value="major">Major</Select.Item>
                  <Select.Item value="minor">Minor</Select.Item>
                </Select.Content>
              </Select.Root>
              <Flex gap="3" mt="4" justify="end">
                <Button variant="soft" onClick={() => setSelectedAction({ type: null, auditorId: null })}>
                  Cancel
                </Button>
                <Button color="red">
                  <CrossCircledIcon /> Submit Finding
                </Button>
              </Flex>
            </>
          )}
        </Dialog.Content>
      </Dialog.Root>

      <Grid columns="4" gap="4" mb="5">
        <Card className="bg-green-50">
          <Flex direction="column" gap="1">
            <Text size="2">Certified Auditors</Text>
            <Heading size="7">24</Heading>
            <Text size="1" className="text-green-600">98% compliant</Text>
          </Flex>
        </Card>
        <Card className="bg-amber-50">
          <Flex direction="column" gap="1">
            <Text size="2">Open Findings</Text>
            <Heading size="7" className="text-amber-600">7</Heading>
            <Text size="1">2 Major, 5 Minor</Text>
          </Flex>
        </Card>
        <Card className="bg-blue-50">
          <Flex direction="column" gap="1">
            <Text size="2">Average CAPA Time</Text>
            <Heading size="7">7.2 days</Heading>
            <Progress value={65} />
          </Flex>
        </Card>
        <Card className="bg-purple-50">
          <Flex direction="column" gap="1">
            <Text size="2">Certifications</Text>
            <Heading size="7">98% Valid</Heading>
            <Text size="1">All certifications active</Text>
          </Flex>
        </Card>
      </Grid>

      <Flex gap="4" mb="5">
        <Card style={{ flex: 2 }}>
          <Heading size="4" mb="3" className="flex items-center gap-2">
            <CalendarIcon /> Audit Schedule
          </Heading>
          <div className="h-96">
            {/* GanttChart component */}
          </div>
        </Card>
        <Card style={{ flex: 1 }}>
          <Heading size="4" mb="3" className="flex items-center gap-2">
            <MagnifyingGlassIcon /> Compliance Heatmap
          </Heading>
          <div className="grid grid-cols-2 gap-4 h-96 p-4">
            {['WHO GBT', 'OMCL', 'ISO 9001', 'ISO 17025'].map((standard) => (
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
            <Table.ColumnHeaderCell>Regulatory Authority</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Certifications</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Last Audit</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Findings</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Compliance Score</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>CAPA Status</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {auditors.map((auditor) => (
            <Table.Row key={auditor.id}>
              <Table.Cell>
                <Flex align="center" gap="2">
                  <PersonIcon className="text-blue-600" />
                  {auditor.firm}
                  <Badge variant="soft" color="blue">Regulatory</Badge>
                </Flex>
              </Table.Cell>
              <Table.Cell>
                <Flex gap="1" wrap="wrap" style={{ maxWidth: '250px' }}>
                  {auditor.certifications.slice(0, 3).map(cert => (
                    <Badge key={cert} variant="outline" color="green">
                      {cert}
                    </Badge>
                  ))}
                  {auditor.certifications.length > 3 && (
                    <Badge variant="soft">+{auditor.certifications.length - 3} more</Badge>
                  )}
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
                  <Badge color="red">{auditor.findings.critical} Critical</Badge>
                  <Badge color="amber">{auditor.findings.major} Major</Badge>
                  <Badge color="gray">{auditor.findings.minor} Minor</Badge>
                </Flex>
              </Table.Cell>
              <Table.Cell>
                <Progress value={auditor.complianceScore} />
                <Text size="1">{auditor.complianceScore}%</Text>
              </Table.Cell>
              <Table.Cell>
                <Badge
                  color={auditor.capaStatus === 'Completed' ? 'green' : 'blue'}
                  variant="soft"
                >
                  {auditor.capaStatus}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    <Button variant="ghost">Actions</Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content>
                    <DropdownMenu.Item onSelect={() => setSelectedAction({ type: 'report', auditorId: auditor.id })}>
                      <FileTextIcon /> Audit Report
                    </DropdownMenu.Item>
                    <DropdownMenu.Item onSelect={() => setSelectedAction({ type: 'approve', auditorId: auditor.id })}>
                      <CheckCircledIcon /> Approve CAPA
                    </DropdownMenu.Item>
                    <DropdownMenu.Item onSelect={() => setSelectedAction({ type: 'finding', auditorId: auditor.id })}>
                      <CrossCircledIcon /> Raise Finding
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
