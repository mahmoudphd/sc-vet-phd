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
  DownloadIcon,
  Pencil1Icon,
  CheckIcon,
  Cross2Icon
} from '@radix-ui/react-icons';
import { useState } from 'react';

interface Authority {
  id: string;
  name: string;
  certifications: string[];
  lastAudit: string;
  findings: {
    critical: number;
    major: number;
    minor: number;
  };
  complianceScore: number;
  nextAudit: string;
  capaStatus: string;
  country: string;
  accreditationStatus: string;
}

interface TempData extends Partial<Omit<Authority, 'findings'>> {
  findings?: {
    critical: number;
    major: number;
    minor: number;
  };
}

const RegulatoryAuthorityManagement = () => {
  const [authorities, setAuthorities] = useState<Authority[]>([
    {
      id: 'AUD-001',
      name: 'Egyptian Drug Authority (EDA)',
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
      complianceScore: 98.7,
      nextAudit: '2024-07-15',
      capaStatus: 'In Progress',
      country: 'Egypt',
      accreditationStatus: 'Active'
    }
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempData, setTempData] = useState<TempData>({});
  const [scheduleAuditOpen, setScheduleAuditOpen] = useState(false);
  const [complianceReportOpen, setComplianceReportOpen] = useState(false);

  // Calculate dynamic metrics
  const metrics = {
    totalAuthorities: authorities.length,
    activeAccreditations: authorities.filter(a => a.accreditationStatus === 'Active').length,
    openFindings: authorities.reduce((sum, a) => sum + a.findings.critical + a.findings.major + a.findings.minor, 0),
    avgComplianceScore: authorities.reduce((sum, a) => sum + a.complianceScore, 0) / authorities.length
  };

  const handleEdit = (authority: Authority) => {
    setEditingId(authority.id);
    setTempData({ ...authority });
  };

  const handleSave = (id: string) => {
    if (tempData.findings) {
      // Ensure all findings fields have numbers, not undefined
      const completeFindings = {
        critical: tempData.findings.critical ?? 0,
        major: tempData.findings.major ?? 0,
        minor: tempData.findings.minor ?? 0
      };
      
      setAuthorities(authorities.map(a => 
        a.id === id ? { 
          ...a, 
          ...tempData,
          findings: completeFindings
        } as Authority : a
      ));
    } else {
      setAuthorities(authorities.map(a => 
        a.id === id ? { ...a, ...tempData } as Authority : a
      ));
    }
    setEditingId(null);
    setTempData({});
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTempData({});
  };

  const handleUpdateTempData = (field: keyof Authority, value: any) => {
    setTempData(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdateFindings = (type: 'critical' | 'major' | 'minor', value: string) => {
    const numValue = parseInt(value) || 0;
    setTempData(prev => ({
      ...prev,
      findings: {
        critical: prev.findings?.critical ?? 0,
        major: prev.findings?.major ?? 0,
        minor: prev.findings?.minor ?? 0,
        [type]: numValue
      }
    }));
  };

  const renderStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: 'green' | 'blue' | 'orange' | 'red' | 'gray'; text: string }> = {
      'Completed': { color: 'green', text: 'Completed' },
      'In Progress': { color: 'blue', text: 'In Progress' },
      'Under Review': { color: 'orange', text: 'Under Review' },
      'Not Started': { color: 'red', text: 'Not Started' }
    };
    
    const config = statusConfig[status] || { color: 'gray', text: status };
    return <Badge color={config.color}>{config.text}</Badge>;
  };

  const renderFindings = (findings: { critical: number; major: number; minor: number }, isEditing: boolean = false) => {
    if (isEditing) {
      return (
        <Flex direction="column" gap="2">
          <TextField.Root
            size="1"
            placeholder="Critical"
            value={tempData.findings?.critical?.toString() || ''}
            onChange={(e) => handleUpdateFindings('critical', e.target.value)}
          />
          <TextField.Root
            size="1"
            placeholder="Major"
            value={tempData.findings?.major?.toString() || ''}
            onChange={(e) => handleUpdateFindings('major', e.target.value)}
          />
          <TextField.Root
            size="1"
            placeholder="Minor"
            value={tempData.findings?.minor?.toString() || ''}
            onChange={(e) => handleUpdateFindings('minor', e.target.value)}
          />
        </Flex>
      );
    }

    return (
      <Flex direction="column" gap="1">
        {findings.critical > 0 && <Text size="1" color="red">Critical: {findings.critical}</Text>}
        {findings.major > 0 && <Text size="1" color="orange">Major: {findings.major}</Text>}
        {findings.minor > 0 && <Text size="1" color="yellow">Minor: {findings.minor}</Text>}
      </Flex>
    );
  };

  return (
    <Box p="6" className="flex-1">
      <Flex justify="between" align="center" mb="5">
        <Heading size="6">Regulatory Authority Management System</Heading>
        <Flex gap="3">
          <Button variant="soft" onClick={() => setScheduleAuditOpen(true)}>
            <CalendarIcon /> Schedule Audit
          </Button>
          <Button variant="soft" onClick={() => setComplianceReportOpen(true)}>
            <DownloadIcon /> Compliance Report
          </Button>
        </Flex>
      </Flex>

      {/* Metrics Cards - Dynamic with table data */}
      <Grid columns="4" gap="4" mb="5">
        <Card className="bg-green-50">
          <Flex direction="column" gap="1">
            <Text size="2">Regulatory Authorities</Text>
            <Heading size="7">{metrics.totalAuthorities}</Heading>
            <Text size="1" className="text-green-600">
              {metrics.activeAccreditations} Active
            </Text>
          </Flex>
        </Card>
        <Card className="bg-amber-50">
          <Flex direction="column" gap="1">
            <Text size="2">Open Findings</Text>
            <Heading size="7" className="text-amber-600">{metrics.openFindings}</Heading>
            <Text size="1">
              {authorities.reduce((sum, a) => sum + a.findings.major, 0)} Major, 
              {authorities.reduce((sum, a) => sum + a.findings.minor, 0)} Minor
            </Text>
          </Flex>
        </Card>
        <Card className="bg-blue-50">
          <Flex direction="column" gap="1">
            <Text size="2">Avg Compliance Score</Text>
            <Heading size="7">{metrics.avgComplianceScore.toFixed(1)}%</Heading>
            <Progress value={metrics.avgComplianceScore} />
          </Flex>
        </Card>
        <Card className="bg-purple-50">
          <Flex direction="column" gap="1">
            <Text size="2">Certification Status</Text>
            <Heading size="7">100% Valid</Heading>
            <Text size="1">All accreditations active</Text>
          </Flex>
        </Card>
      </Grid>

      {/* Compliance Heatmap */}
      <Card mb="5">
        <Heading size="4" mb="3">Compliance Heatmap</Heading>
        <Grid columns="4" gap="3">
          {['WHO GBT', 'OMCL Network', 'ISO 9001', 'ISO 17025'].map((standard) => (
            <Flex key={standard} direction="column" align="center">
              <Text weight="bold">{standard}</Text>
              <Progress value={98} />
              <Text size="2">98%</Text>
            </Flex>
          ))}
        </Grid>
      </Card>

      {/* Editable Table */}
      <Table.Root variant="surface" className="mt-6">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Regulatory Authority</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Certifications</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Last Audit</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Findings</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Compliance Score</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>CAPA Status</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Next Audit</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {authorities.map((authority) => (
            <Table.Row key={authority.id}>
              <Table.Cell>
                {editingId === authority.id ? (
                  <TextField.Root
                    value={tempData.name || authority.name}
                    onChange={(e) => handleUpdateTempData('name', e.target.value)}
                  />
                ) : (
                  <Flex align="center" gap="2">
                    <PersonIcon className="text-blue-600" />
                    {authority.name}
                    <Badge variant="soft" color="blue">Regulatory</Badge>
                  </Flex>
                )}
              </Table.Cell>
              <Table.Cell>
                {editingId === authority.id ? (
                  <TextField.Root
                    placeholder="Certifications (comma separated)"
                    value={tempData.certifications?.join(', ') || authority.certifications.join(', ')}
                    onChange={(e) => handleUpdateTempData('certifications', e.target.value.split(',').map((c: string) => c.trim()))}
                  />
                ) : (
                  <Flex gap="1" wrap="wrap" style={{ maxWidth: '250px' }}>
                    {authority.certifications.slice(0, 3).map(cert => (
                      <Badge key={cert} variant="outline" color="green">
                        {cert}
                      </Badge>
                    ))}
                    {authority.certifications.length > 3 && (
                      <Badge variant="soft">+{authority.certifications.length - 3} more</Badge>
                    )}
                  </Flex>
                )}
              </Table.Cell>
              <Table.Cell>
                {editingId === authority.id ? (
                  <TextField.Root
                    type="date"
                    value={tempData.lastAudit || authority.lastAudit}
                    onChange={(e) => handleUpdateTempData('lastAudit', e.target.value)}
                  />
                ) : (
                  <Flex align="center" gap="2">
                    <CalendarIcon />
                    {authority.lastAudit}
                  </Flex>
                )}
              </Table.Cell>
              <Table.Cell>
                {renderFindings(editingId === authority.id ? (tempData.findings || authority.findings) : authority.findings, editingId === authority.id)}
              </Table.Cell>
              <Table.Cell>
                {editingId === authority.id ? (
                  <TextField.Root
                    type="number"
                    min="0"
                    max="100"
                    value={tempData.complianceScore || authority.complianceScore}
                    onChange={(e) => handleUpdateTempData('complianceScore', parseFloat(e.target.value))}
                  />
                ) : (
                  <Flex align="center" gap="2">
                    <Progress value={authority.complianceScore} />
                    <Text>{authority.complianceScore}%</Text>
                  </Flex>
                )}
              </Table.Cell>
              <Table.Cell>
                {editingId === authority.id ? (
                  <Select.Root
                    value={tempData.capaStatus || authority.capaStatus}
                    onValueChange={(value) => handleUpdateTempData('capaStatus', value)}
                  >
                    <Select.Trigger />
                    <Select.Content>
                      <Select.Item value="Completed">Completed</Select.Item>
                      <Select.Item value="In Progress">In Progress</Select.Item>
                      <Select.Item value="Under Review">Under Review</Select.Item>
                      <Select.Item value="Not Started">Not Started</Select.Item>
                    </Select.Content>
                  </Select.Root>
                ) : (
                  renderStatusBadge(authority.capaStatus)
                )}
              </Table.Cell>
              <Table.Cell>
                {editingId === authority.id ? (
                  <TextField.Root
                    type="date"
                    value={tempData.nextAudit || authority.nextAudit}
                    onChange={(e) => handleUpdateTempData('nextAudit', e.target.value)}
                  />
                ) : (
                  <Flex align="center" gap="2">
                    <CalendarIcon />
                    {authority.nextAudit}
                  </Flex>
                )}
              </Table.Cell>
              <Table.Cell>
                <Flex gap="2">
                  {editingId === authority.id ? (
                    <>
                      <Button size="1" color="green" onClick={() => handleSave(authority.id)}>
                        <CheckIcon /> Save
                      </Button>
                      <Button size="1" color="red" onClick={handleCancelEdit}>
                        <Cross2Icon /> Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button size="1" onClick={() => handleEdit(authority)}>
                        <Pencil1Icon /> Edit
                      </Button>
                      <DropdownMenu.Root>
                        <DropdownMenu.Trigger>
                          <Button size="1" variant="ghost">•••</Button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content>
                          <DropdownMenu.Item>
                            <FileTextIcon /> Audit Report
                          </DropdownMenu.Item>
                          <DropdownMenu.Item>
                            <CheckCircledIcon /> Approve CAPA
                          </DropdownMenu.Item>
                          <DropdownMenu.Item>
                            <CrossCircledIcon /> Raise Finding
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Root>
                    </>
                  )}
                </Flex>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      {/* Modals */}
      <Dialog.Root open={scheduleAuditOpen} onOpenChange={setScheduleAuditOpen}>
        <Dialog.Content>
          <Dialog.Title>Schedule Audit</Dialog.Title>
          <Flex direction="column" gap="3">
            <Select.Root>
              <Select.Trigger placeholder="Select authority" />
              <Select.Content>
                {authorities.map(authority => (
                  <Select.Item key={authority.id} value={authority.id}>
                    {authority.name}
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
    </Box>
  );
};

export default RegulatoryAuthorityManagement;
