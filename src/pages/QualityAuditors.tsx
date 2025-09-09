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
  AlertDialog,
  ScrollArea
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
  LockClosedIcon,
  GlobeIcon
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

const RegulatoryAuthorityManagement = () => {
  const [authorities, setAuthorities] = useState<Authority[]>([
    {
      id: 'EDA-001',
      name: 'Egyptian Drug Authority (EDA)',
      certifications: [
        'WHO GBT', 
        'OMCL Network', 
        'ISO 9001:2015',
        'ISO/IEC 17025:2017',
        'ISO/IEC 17043:2010',
        'ISO/IEC 17034:2016'
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
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCertification, setSelectedCertification] = useState<string | null>(null);
  const [auditDate, setAuditDate] = useState('');

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

  const certificationDetails = {
    'WHO GBT': {
      title: 'WHO Good Practices for Pharmaceutical Quality Control Laboratories',
      description: 'International standards for quality control laboratories in the pharmaceutical sector',
      validity: '2025-12-31',
      scope: 'Pharmaceutical Quality Control'
    },
    'OMCL Network': {
      title: 'Official Medicines Control Laboratories Network',
      description: 'European network of official medicines control laboratories',
      validity: '2025-12-31',
      scope: 'Medicines Control'
    },
    'ISO 9001:2015': {
      title: 'Quality Management Systems',
      description: 'International standard for quality management systems',
      validity: '2025-12-31',
      scope: 'Quality Management'
    },
    'ISO/IEC 17025:2017': {
      title: 'General Requirements for the Competence of Testing and Calibration Laboratories',
      description: 'International standard for laboratory competence',
      validity: '2025-12-31',
      scope: 'Laboratory Testing'
    },
    'ISO/IEC 17043:2010': {
      title: 'Conformity Assessment - General Requirements for Proficiency Testing',
      description: 'International standard for proficiency testing',
      validity: '2025-12-31',
      scope: 'Proficiency Testing'
    },
    'ISO/IEC 17034:2016': {
      title: 'General Requirements for the Competence of Reference Material Producers',
      description: 'International standard for reference material producers',
      validity: '2025-12-31',
      scope: 'Reference Materials'
    }
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

  const submitToBlockchain = async () => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('EDA data successfully submitted to blockchain!');
    } catch (error) {
      alert('Error submitting to blockchain');
    } finally {
      setIsSubmitting(false);
      setIsBlockchainDialogOpen(false);
    }
  };

  const scheduleAudit = () => {
    if (auditDate) {
      setAuthorities(authorities.map(a => ({
        ...a,
        nextAudit: auditDate
      })));
      alert(`Audit scheduled for ${auditDate}`);
      setIsScheduleDialogOpen(false);
      setAuditDate('');
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

  const renderCertificationBadge = (certification: string) => {
    return (
      <Badge 
        variant="soft" 
        color="green"
        style={{ margin: '2px', cursor: 'pointer' }}
        onClick={() => setSelectedCertification(certification)}
      >
        {certification}
      </Badge>
    );
  };

  return (
    <Box p="6" className="flex-1">
      <Flex justify="between" align="center" mb="5">
        <Heading size="6">Regulatory Authority Management System</Heading>
        <Flex gap="3">
          <Button variant="soft" onClick={() => setIsScheduleDialogOpen(true)}>
            <CalendarIcon /> Schedule Audit
          </Button>
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
                <Flex align="center" gap="2">
                  <PersonIcon className="text-blue-600" />
                  {authority.name}
                  <Badge variant="soft" color="blue">Regulatory</Badge>
                </Flex>
              </Table.Cell>
              <Table.Cell>
                <ScrollArea style={{ maxHeight: '120px', maxWidth: '300px' }}>
                  <Flex direction="column" gap="1">
                    {authority.certifications.map((certification) => (
                      <div key={certification}>
                        {renderCertificationBadge(certification)}
                      </div>
                    ))}
                  </Flex>
                </ScrollArea>
              </Table.Cell>
              <Table.Cell>
                <Flex align="center" gap="2">
                  <CalendarIcon />
                  {authority.lastAudit}
                </Flex>
              </Table.Cell>
              <Table.Cell>
                <Flex direction="column" gap="1">
                  {authority.findings.critical > 0 && <Text size="1" color="red">Critical: {authority.findings.critical}</Text>}
                  {authority.findings.major > 0 && <Text size="1" color="orange">Major: {authority.findings.major}</Text>}
                  {authority.findings.minor > 0 && <Text size="1" color="yellow">Minor: {authority.findings.minor}</Text>}
                </Flex>
              </Table.Cell>
              <Table.Cell>
                <Flex align="center" gap="2">
                  <Progress value={authority.complianceScore} />
                  <Text>{authority.complianceScore}%</Text>
                </Flex>
              </Table.Cell>
              <Table.Cell>
                {renderStatusBadge(authority.capaStatus)}
              </Table.Cell>
              <Table.Cell>
                <Flex align="center" gap="2">
                  <CalendarIcon />
                  {authority.nextAudit}
                </Flex>
              </Table.Cell>
              <Table.Cell>
                <Button size="1" onClick={() => handleEdit(authority)}>
                  <Pencil1Icon /> Edit
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Row>

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
          <CubeIcon /> Submit to Blockchain
        </Button>
      </Flex>

      {/* Certification Details Dialog */}
      <Dialog.Root open={!!selectedCertification} onOpenChange={(open) => {
        if (!open) setSelectedCertification(null);
      }}>
        <Dialog.Content style={{ maxWidth: 600 }}>
          {selectedCertification && (
            <>
              <Dialog.Title>
                <Flex align="center" gap="2">
                  <FileTextIcon />
                  {selectedCertification} - Certification Details
                </Flex>
              </Dialog.Title>
              
              <Flex direction="column" gap="4">
                <Flex direction="column" gap="1">
                  <Text weight="bold">Full Title:</Text>
                  <Text>{certificationDetails[selectedCertification as keyof typeof certificationDetails]?.title}</Text>
                </Flex>

                <Flex direction="column" gap="1">
                  <Text weight="bold">Description:</Text>
                  <Text>{certificationDetails[selectedCertification as keyof typeof certificationDetails]?.description}</Text>
                </Flex>

                <Flex direction="column" gap="1">
                  <Text weight="bold">Scope:</Text>
                  <Text>{certificationDetails[selectedCertification as keyof typeof certificationDetails]?.scope}</Text>
                </Flex>

                <Flex direction="column" gap="1">
                  <Text weight="bold">Validity:</Text>
                  <Badge color="green" variant="soft">
                    Valid until {certificationDetails[selectedCertification as keyof typeof certificationDetails]?.validity}
                  </Badge>
                </Flex>

                <Flex direction="column" gap="1">
                  <Text weight="bold">Status:</Text>
                  <Badge color="green">Active</Badge>
                </Flex>
              </Flex>

              <Flex gap="3" mt="4" justify="end">
                <Button variant="soft" onClick={() => setSelectedCertification(null)}>
                  Close
                </Button>
              </Flex>
            </>
          )}
        </Dialog.Content>
      </Dialog.Root>

      {/* Schedule Audit Dialog */}
      <Dialog.Root open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <Dialog.Content>
          <Dialog.Title>
            <Flex align="center" gap="2">
              <CalendarIcon />
              Schedule New Audit
            </Flex>
          </Dialog.Title>
          <Flex direction="column" gap="3">
            <Text>Schedule a new audit for Egyptian Drug Authority</Text>
            
            <Flex direction="column" gap="2">
              <Text weight="bold">Authority:</Text>
              <Text>Egyptian Drug Authority (EDA)</Text>
            </Flex>

            <Flex direction="column" gap="2">
              <Text weight="bold">Current Next Audit:</Text>
              <Text>{authorities[0].nextAudit}</Text>
            </Flex>

            <Flex direction="column" gap="2">
              <Text weight="bold">Select New Audit Date:</Text>
              <TextField.Root
                type="date"
                value={auditDate}
                onChange={(e) => setAuditDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </Flex>

            <Flex gap="3" mt="4" justify="end">
              <Button variant="soft" onClick={() => setIsScheduleDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={scheduleAudit} disabled={!auditDate}>
                Schedule Audit
              </Button>
            </Flex>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

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
            Are you sure you want to submit regulatory authority data to the blockchain? 
            This action will create an immutable record of all accreditations and compliance data.
          </AlertDialog.Description>
          
          <Flex direction="column" gap="3" mb="4">
            <Text weight="bold">Data to be submitted:</Text>
            <Text size="2">• 6 International Certifications</Text>
            <Text size="2">• Compliance Score: 97.8%</Text>
            <Text size="2">• Audit Findings: 2 Major, 4 Minor</Text>
            <Text size="2">• Next Audit Date: {authorities[0].nextAudit}</Text>
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
              {isSubmitting ? 'Submitting...' : 'Confirm Submission'}
            </Button>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </Box>
  );
};

export default RegulatoryAuthorityManagement;
