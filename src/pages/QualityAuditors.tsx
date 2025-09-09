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
  Select,
  AlertDialog
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
  Cross2Icon,
  CubeIcon,
  LockClosedIcon
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
  validityDate: string;
}

interface TempData extends Partial<Omit<Authority, 'findings'>> {
  findings?: {
    critical: number;
    major: number;
    minor: number;
  };
}

const EDAAuthorityManagement = () => {
  const [authorities, setAuthorities] = useState<Authority[]>([
    {
      id: 'EDA-001',
      name: 'Egyptian Drug Authority (EDA)',
      certifications: [
        'WHO GBT Certification', 
        'OMCL Network Membership', 
        'ISO 9001:2015 Quality Management',
        'ISO/IEC 17025:2017 Laboratory Competence',
        'ISO/IEC 17043:2010 Proficiency Testing',
        'ISO/IEC 17034:2016 Reference Materials'
      ],
      lastAudit: '2024-03-15',
      findings: { critical: 0, major: 2, minor: 4 },
      complianceScore: 97.8,
      nextAudit: '2024-09-15',
      capaStatus: 'In Progress',
      country: 'Egypt',
      accreditationStatus: 'Active',
      validityDate: '2025-12-31'
    }
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempData, setTempData] = useState<TempData>({});
  const [isBlockchainDialogOpen, setIsBlockchainDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate dynamic metrics
  const metrics = {
    totalAuthorities: authorities.length,
    activeAccreditations: authorities.filter(a => a.accreditationStatus === 'Active').length,
    openFindings: authorities.reduce((sum, a) => sum + a.findings.critical + a.findings.major + a.findings.minor, 0),
    criticalFindings: authorities.reduce((sum, a) => sum + a.findings.critical, 0),
    majorFindings: authorities.reduce((sum, a) => sum + a.findings.major, 0),
    minorFindings: authorities.reduce((sum, a) => sum + a.findings.minor, 0),
    avgComplianceScore: authorities.reduce((sum, a) => sum + a.complianceScore, 0) / authorities.length
  };

  const handleEdit = (authority: Authority) => {
    setEditingId(authority.id);
    setTempData({ ...authority });
  };

  const handleSave = (id: string) => {
    if (tempData.findings) {
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

  const submitToBlockchain = async () => {
    setIsSubmitting(true);
    try {
      // Simulate blockchain submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('EDA data successfully submitted to blockchain!');
    } catch (error) {
      alert('Error submitting to blockchain');
    } finally {
      setIsSubmitting(false);
      setIsBlockchainDialogOpen(false);
    }
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
        <Heading size="6">Egyptian Drug Authority (EDA) Management</Heading>
        <Flex gap="3">
          <Button variant="soft">
            <DownloadIcon /> Compliance Report
          </Button>
        </Flex>
      </Flex>

      {/* Metrics Cards */}
      <Grid columns="4" gap="4" mb="5">
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">Accreditations Status</Text>
            <Heading size="7" style={{ color: '#10b981' }}>Active</Heading>
            <Text size="1">Valid until 2025-12-31</Text>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">Total Certifications</Text>
            <Heading size="7">6</Heading>
            <Text size="1">International Standards</Text>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">Open Findings</Text>
            <Heading size="7">6</Heading>
            <Text size="1" color="orange">2 Major, 4 Minor</Text>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">Compliance Score</Text>
            <Heading size="7">97.8%</Heading>
            <Progress value={97.8} />
          </Flex>
        </Card>
      </Grid>

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
                  <Flex direction="column" gap="1" style={{ maxWidth: '300px' }}>
                    {authority.certifications.map((cert, index) => (
                      <Badge key={index} variant="outline" color="green" style={{ margin: '2px' }}>
                        {cert}
                      </Badge>
                    ))}
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
                    </>
                  )}
                </Flex>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      {/* Submit to Blockchain Button */}
      <Flex justify="center" mt="6">
        <Button 
          size="3" 
          color="green" 
          variant="solid"
          onClick={() => setIsBlockchainDialogOpen(true)}
          style={{ 
            backgroundColor: '#006400',
            padding: '12px 24px',
            fontSize: '16px'
          }}
        >
          <CubeIcon /> Submit EDA Data to Blockchain
        </Button>
      </Flex>

      {/* Blockchain Submission Dialog */}
      <AlertDialog.Root open={isBlockchainDialogOpen}>
        <AlertDialog.Content style={{ maxWidth: 500 }}>
          <AlertDialog.Title>
            <Flex align="center" gap="2">
              <LockClosedIcon />
              Submit to Blockchain
            </Flex>
          </AlertDialog.Title>
          <AlertDialog.Description size="2" mb="4">
            Are you sure you want to submit Egyptian Drug Authority data to the blockchain? 
            This action will create an immutable record of all EDA accreditations and compliance data.
          </AlertDialog.Description>
          
          <Flex direction="column" gap="3" mb="4">
            <Text weight="bold">Data to be submitted:</Text>
            <Text size="2">• 6 International Certifications</Text>
            <Text size="2">• Compliance Score: 97.8%</Text>
            <Text size="2">• Audit Findings: 2 Major, 4 Minor</Text>
            <Text size="2">• Next Audit Date: 2024-09-15</Text>
          </Flex>

          <Flex gap="3" mt="4" justify="end">
            <Button 
              variant="soft" 
              color="gray" 
              onClick={() => setIsBlockchainDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              color="green"
              onClick={submitToBlockchain}
              disabled={isSubmitting}
              style={{ backgroundColor: '#006400' }}
            >
              {isSubmitting ? (
                <>Submitting to Blockchain...</>
              ) : (
                <>Confirm Submission</>
              )}
            </Button>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </Box>
  );
};

export default EDAAuthorityManagement;
