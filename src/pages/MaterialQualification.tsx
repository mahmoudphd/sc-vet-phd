import {
  Table,
  Button,
  Dialog,
  Flex,
  Text,
  Box,
  Badge,
  Card,
  Tooltip,
  Progress,
  Grid,
  Select,
  Separator,
  TextField,
  Heading
} from '@radix-ui/themes';
import { useState } from 'react';
import {
  Check,
  Clock,
  AlertTriangle,
  ChevronRight,
  FileText,
  ShieldCheck,
  HardHat,
  HelpCircle,
  Link,
  Database,
  Calendar,
  Search
} from 'lucide-react';

// Theme configuration
interface Theme {
  colors: {
    primary: string;
    success: string;
    warning: string;
    danger: string;
    compliance: string;
    background: string;
  };
}

const theme: Theme = {
  colors: {
    primary: '#3B82F6',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    compliance: '#6D28D9',
    background: '#F8FAFC'
  }
};

// Type definitions
interface TestResult {
  status: 'Passed' | 'Pending' | 'Failed';
  date: string;
  performedBy: string;
  blockchainTx?: string;
}

interface EDARegistration {
  registrationNumber: string;
  approvalDate: string;
  expiryDate: string;
  status: 'Approved' | 'Rejected' | 'Pending' | 'Expired';
  gmpInspection: boolean;
}

interface Supplier {
  id: string;
  name: string;
  status: 'Approved' | 'NotApproved' | 'Pending';
  approvalDate?: string;
}

interface Material {
  id: string;
  name: string;
  supplier: Supplier;
  status: 'Approved' | 'Pending' | 'Rejected';
  expiryDate: string;
  batchNumber: string;
  tests: {
    Identity: TestResult;
    Purity: TestResult;
    Microbial: TestResult;
    Endotoxins: TestResult;
  };
  certificate?: string;
  regulatory: EDARegistration;
  blockchainRegistered: boolean;
  lastReviewed: string;
}

// Sample data
const materialsData: Material[] = [
  {
    id: 'MAT-001',
    name: 'Vitamin B1 (Thiamine)',
    supplier: {
      id: 'SUP-001',
      name: 'Supplier A',
      status: 'Approved',
      approvalDate: '2023-01-10'
    },
    status: 'Approved',
    expiryDate: '2026-12-31',
    batchNumber: 'B230501',
    tests: {
      Identity: {
        status: 'Passed',
        date: '2025-07-10',
        performedBy: 'Lab Tech 1',
        blockchainTx: '0x89ab4c6d3e2f1a7b5c9d8e0f2a4b6c8d'
      },
      Purity: {
        status: 'Passed',
        date: '2025-07-10',
        performedBy: 'Lab Tech 2',
        blockchainTx: '0x76c5d4e3f2a1b9e8d7c6b5a4f3e2d1c0'
      },
      Microbial: {
        status: 'Passed',
        date: '2025-07-11',
        performedBy: 'Microbiology Team',
        blockchainTx: '0x54d3e2f1a9b8c7d6e5f4a3b2c1d0e9f8'
      },
      Endotoxins: {
        status: 'Passed',
        date: '2025-07-11',
        performedBy: 'Microbiology Team',
        blockchainTx: '0x32c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7'
      }
    },
    certificate: 'CERT-001',
    regulatory: {
      registrationNumber: 'EDA-REG-2023-12345',
      approvalDate: '2023-01-15',
      expiryDate: '2026-12-31',
      status: 'Approved',
      gmpInspection: true
    },
    blockchainRegistered: true,
    lastReviewed: '2025-07-15'
  },
  {
    id: 'MAT-002',
    name: 'Vitamin B2 (Riboflavin)',
    supplier: {
      id: 'SUP-002',
      name: 'Supplier B',
      status: 'NotApproved'
    },
    status: 'Pending',
    expiryDate: '2025-12-15',
    batchNumber: 'B230502',
    tests: {
      Identity: {
        status: 'Pending',
        date: '2025-08-01',
        performedBy: 'Lab Tech 3'
      },
      Purity: {
        status: 'Pending',
        date: '2025-08-01',
        performedBy: 'Lab Tech 1'
      },
      Microbial: {
        status: 'Pending',
        date: '2025-08-02',
        performedBy: 'Microbiology Team'
      },
      Endotoxins: {
        status: 'Pending',
        date: '2025-08-02',
        performedBy: 'Microbiology Team'
      }
    },
    regulatory: {
      registrationNumber: 'EDA-REG-2023-54321',
      approvalDate: '2023-03-10',
      expiryDate: '2026-03-10',
      status: 'Pending',
      gmpInspection: false
    },
    blockchainRegistered: false,
    lastReviewed: '2025-08-10'
  },
  {
    id: 'MAT-003',
    name: 'Nicotinamide',
    supplier: {
      id: 'SUP-001',
      name: 'Supplier A',
      status: 'Approved',
      approvalDate: '2023-01-10'
    },
    status: 'Approved',
    expiryDate: '2025-10-20',
    batchNumber: 'B230503',
    tests: {
      Identity: {
        status: 'Passed',
        date: '2025-07-01',
        performedBy: 'Lab Tech 1',
        blockchainTx: '0x89ab4c6d3e2f1a7b5c9d8e0f2a4b6c8d'
      },
      Purity: {
        status: 'Passed',
        date: '2025-07-01',
        performedBy: 'Lab Tech 2',
        blockchainTx: '0x76c5d4e3f2a1b9e8d7c6b5a4f3e2d1c0'
      },
      Microbial: {
        status: 'Failed',
        date: '2025-07-02',
        performedBy: 'Microbiology Team',
        blockchainTx: '0x54d3e2f1a9b8c7d6e5f4a3b2c1d0e9f8'
      },
      Endotoxins: {
        status: 'Passed',
        date: '2025-07-02',
        performedBy: 'Microbiology Team',
        blockchainTx: '0x32c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7'
      }
    },
    certificate: 'CERT-003',
    regulatory: {
      registrationNumber: 'EDA-REG-2023-67890',
      approvalDate: '2023-02-15',
      expiryDate: '2026-02-15',
      status: 'Approved',
      gmpInspection: true
    },
    blockchainRegistered: true,
    lastReviewed: '2025-07-01'
  }
];

// Components
const IconWrapper = ({ size = 16, color, children }: { size?: number; color?: string; children: React.ReactNode }) => (
  <Text as="span" style={{ display: 'inline-flex', width: size, height: size, color }}>
    {children}
  </Text>
);

const StatusBadge = ({ status }: { status: string }) => {
  const config = {
    Approved: { color: 'green' as const, icon: <IconWrapper size={14}><Check /></IconWrapper> },
    Rejected: { color: 'red' as const, icon: <IconWrapper size={14}><AlertTriangle /></IconWrapper> },
    Pending: { color: 'yellow' as const, icon: <IconWrapper size={14}><Clock /></IconWrapper> },
    Expired: { color: 'orange' as const, icon: <IconWrapper size={14}><Calendar /></IconWrapper> },
    NotApproved: { color: 'red' as const, icon: <IconWrapper size={14}><AlertTriangle /></IconWrapper> },
    Passed: { color: 'green' as const, icon: <IconWrapper size={14}><Check /></IconWrapper> },
    Failed: { color: 'red' as const, icon: <IconWrapper size={14}><AlertTriangle /></IconWrapper> }
  };

  const currentConfig = config[status as keyof typeof config] || 
                      { color: 'gray' as const, icon: <IconWrapper size={14}><HelpCircle /></IconWrapper> };

  return (
    <Badge color={currentConfig.color} highContrast>
      <Flex align="center" gap="1">
        {currentConfig.icon}
        {status}
      </Flex>
    </Badge>
  );
};

const BlockchainLink = ({ txHash }: { txHash?: string }) => {
  if (!txHash) return null;
  return (
    <Tooltip content="View on Blockchain Explorer">
      <Button variant="ghost" size="1" asChild>
        <a href={`https://blockchain.example/tx/${txHash}`} target="_blank" rel="noopener noreferrer">
          <Flex align="center" gap="1">
            <IconWrapper size={12}><Link /></IconWrapper>
            Verify
          </Flex>
        </a>
      </Button>
    </Tooltip>
  );
};

const SupplierStatus = ({ supplier }: { supplier: Supplier }) => (
  <Flex direction="column" gap="1">
    <Text>{supplier.name}</Text>
    <StatusBadge status={supplier.status} />
    {supplier.approvalDate && (
      <Text size="1" color="gray">
        Approved: {new Date(supplier.approvalDate).toLocaleDateString()}
      </Text>
    )}
  </Flex>
);

const ComplianceBar = ({ score }: { score: number }) => (
  <Flex direction="column" gap="1">
    <div style={{ 
      width: '100%',
      height: '8px',
      backgroundColor: '#e9ecef',
      borderRadius: '4px',
      overflow: 'hidden'
    }}>
      <div style={{
        width: `${score}%`,
        height: '100%',
        backgroundColor: score > 75 ? '#2ecc71' : score > 50 ? '#f39c12' : '#e74c3c'
      }} />
    </div>
    <Text size="1" align="center">{score}%</Text>
  </Flex>
);

const ALCOABadge = ({ isCompliant }: { isCompliant: boolean }) => (
  isCompliant ? (
    <Badge color="green" highContrast>
      <Flex align="center" gap="1">
        <IconWrapper size={12}><Check /></IconWrapper>
        ALCOA+
      </Flex>
    </Badge>
  ) : (
    <Badge color="red" highContrast>
      <Flex align="center" gap="1">
        <IconWrapper size={12}><AlertTriangle /></IconWrapper>
        Not ALCOA+
      </Flex>
    </Badge>
  )
);

const ExpiryStatusCell = ({ expiryDate }: { expiryDate: string }) => {
  const expiry = new Date(expiryDate);
  const today = new Date();
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let status: 'safe' | 'warning' | 'danger' | 'expired';
  let label: string;
  let icon: React.ReactNode;

  if (diffDays < 0) {
    status = 'expired';
    label = 'Expired';
    icon = <AlertTriangle size={16} />;
  } else if (diffDays <= 30) {
    status = 'danger';
    label = `Soon (${diffDays}d)`;
    icon = <AlertTriangle size={16} />;
  } else if (diffDays <= 90) {
    status = 'warning';
    label = `OK (${diffDays}d)`;
    icon = <Clock size={16} />;
  } else {
    status = 'safe';
    label = 'Good';
    icon = <Check size={16} />;
  }

  const colors = {
    safe: { bg: '#ECFDF5', text: '#10B981', icon: '#10B981' },
    warning: { bg: '#FFFBEB', text: '#F59E0B', icon: '#F59E0B' },
    danger: { bg: '#FEF2F2', text: '#EF4444', icon: '#EF4444' },
    expired: { bg: '#FEF2F2', text: '#DC2626', icon: '#DC2626' }
  };

  return (
    <Flex
      align="center"
      gap="2"
      style={{
        backgroundColor: colors[status].bg,
        color: colors[status].text,
        padding: '4px 8px',
        borderRadius: '4px',
        fontWeight: 500
      }}
    >
      <Box style={{ color: colors[status].icon }}>
        {icon}
      </Box>
      <Text>{label}</Text>
    </Flex>
  );
};

const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <Flex justify="between" py="2" style={{ borderBottom: '1px solid #eee' }}>
    <Text color="gray">{label}</Text>
    {typeof value === 'string' ? <Text>{value}</Text> : value}
  </Flex>
);

const TestResultsTable = ({ tests }: { tests: Material['tests'] }) => (
  <Table.Root mt="2">
    <Table.Header>
      <Table.Row>
        <Table.ColumnHeaderCell>Test</Table.ColumnHeaderCell>
        <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
        <Table.ColumnHeaderCell>Performed By</Table.ColumnHeaderCell>
        <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
        <Table.ColumnHeaderCell>Blockchain</Table.ColumnHeaderCell>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {Object.entries(tests).map(([testName, test]) => (
        <Table.Row key={testName}>
          <Table.Cell>{testName}</Table.Cell>
          <Table.Cell><StatusBadge status={test.status} /></Table.Cell>
          <Table.Cell>{test.performedBy}</Table.Cell>
          <Table.Cell>{new Date(test.date).toLocaleDateString()}</Table.Cell>
          <Table.Cell><BlockchainLink txHash={test.blockchainTx} /></Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  </Table.Root>
);

// Utility functions
const calculateComplianceScore = (material: Material): number => {
  const testScores = Object.values(material.tests)
    .filter(test => test.status === 'Passed')
    .length * 10;

  const certScore = material.certificate ? 30 : 0;

  const supplierScore = material.supplier.status === 'Approved' ? 20 :
                       material.supplier.status === 'Pending' ? 10 : 0;

  const expiryScore = new Date(material.expiryDate) > new Date() ? 10 : 0;

  return testScores + certScore + supplierScore + expiryScore;
};

const checkALCOACompliance = (material: Material): boolean => {
  const testsPassed = Object.values(material.tests)
    .every(test => test.status === 'Passed');
  
  const hasCertificate = !!material.certificate;
  const validSupplier = material.supplier.status === 'Approved';
  const notExpired = new Date(material.expiryDate) > new Date();
  const blockchainVerified = material.blockchainRegistered;

  return testsPassed && hasCertificate && validSupplier && notExpired && blockchainVerified;
};

// Main Dashboard Component
export default function MaterialQualificationDashboard() {
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<Material | null>(null);
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate overall metrics
  const approvedCount = materialsData.filter(m => m.status === 'Approved').length;
  const pendingCount = materialsData.filter(m => m.status === 'Pending').length;
  const expiringSoonCount = materialsData.filter(m => {
    const expiryDate = new Date(m.expiryDate);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays >= 0;
  }).length;
  
  const overallCompliance = materialsData.length > 0 
    ? materialsData.reduce((sum, material) => sum + calculateComplianceScore(material), 0) / materialsData.length
    : 0;

  const filteredMaterials = materialsData.filter(material => {
    if (filter === 'approved' && material.status !== 'Approved') return false;
    if (filter === 'pending' && material.status === 'Approved') return false;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        material.name.toLowerCase().includes(query) ||
        material.batchNumber.toLowerCase().includes(query) ||
        material.supplier.name.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  return (
    <Box p="4" style={{ backgroundColor: theme.colors.background, minHeight: '100vh' }}>
      {/* Header */}
      <Flex justify="between" align="center" mb="5">
        <Text size="6" weight="bold">Material Qualification Dashboard</Text>
        <Flex gap="3">
          <Select.Root value={filter} onValueChange={(value: 'all' | 'approved' | 'pending') => setFilter(value)}>
            <Select.Trigger />
            <Select.Content>
              <Select.Item value="all">All Materials ({materialsData.length})</Select.Item>
              <Select.Item value="approved">Approved ({approvedCount})</Select.Item>
              <Select.Item value="pending">Pending ({pendingCount})</Select.Item>
            </Select.Content>
          </Select.Root>

          <div style={{ position: 'relative', width: '200px' }}>
            <TextField.Root>
              <TextField.Slot>
                <Search size={16} />
              </TextField.Slot>
              <input
                className="radix-TextFieldInput"
                placeholder="Search materials..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  border: 'none',
                  background: 'transparent',
                  padding: '0 8px',
                  height: '100%',
                  outline: 'none'
                }}
              />
            </TextField.Root>
          </div>
          
          <Button variant="solid" color="violet">
            <ShieldCheck size={16} />
            <Text>Quality Report</Text>
          </Button>
        </Flex>
      </Flex>

      {/* Stats Cards */}
      <Flex gap="4" mb="5">
        <Card variant="surface" style={{ flex: 1 }}>
          <Flex gap="3" align="center">
            <Box p="2" style={{ background: '#F0F9FF', borderRadius: '8px' }}>
              <FileText color={theme.colors.primary} size={20} />
            </Box>
            <Box>
              <Text size="2" color="gray">Qualification Progress</Text>
              <Flex gap="3" mt="2">
                <Badge color="yellow" highContrast>
                  <Flex align="center" gap="1">
                    <Clock size={14} />
                    {pendingCount} Pending
                  </Flex>
                </Badge>
                <Badge color="green" highContrast>
                  <Flex align="center" gap="1">
                    <Check size={14} />
                    {approvedCount} Approved
                  </Flex>
                </Badge>
              </Flex>
            </Box>
          </Flex>
        </Card>

        <Card variant="surface" style={{ flex: 1 }}>
          <Flex gap="3" align="center">
            <Box p="2" style={{ background: '#F5F3FF', borderRadius: '8px' }}>
              <ShieldCheck color={theme.colors.compliance} size={20} />
            </Box>
            <Box>
              <Text size="2" color="gray">System Compliance</Text>
              <Flex align="center" gap="3" mt="2">
                <Text size="5" weight="bold" color={
                  overallCompliance >= 90 ? 'green' : 
                  overallCompliance >= 70 ? 'yellow' : 'red'
                }>
                  {overallCompliance.toFixed(1)}%
                </Text>
                <Progress
                  value={overallCompliance}
                  style={{ flex: 1 }}
                  color={
                    overallCompliance >= 90 ? 'green' : 
                    overallCompliance >= 70 ? 'yellow' : 'red'
                  }
                />
              </Flex>
            </Box>
          </Flex>
        </Card>

        <Card variant="surface" style={{ flex: 1 }}>
          <Flex gap="3" align="center">
            <Box p="2" style={{ background: '#FEF2F2', borderRadius: '8px' }}>
              <AlertTriangle color={theme.colors.danger} size={20} />
            </Box>
            <Box>
              <Text size="2" color="gray">Expiring Soon</Text>
              <Text size="5" weight="bold" color="red" mt="2">
                {expiringSoonCount} Materials
              </Text>
            </Box>
          </Flex>
        </Card>
      </Flex>

      {/* Materials Table */}
      <Table.Root variant="surface" style={{ borderRadius: '8px', overflow: 'hidden' }}>
        <Table.Header style={{ backgroundColor: theme.colors.primary }}>
          <Table.Row>
            <Table.ColumnHeaderCell style={{ color: 'white' }}>Material</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell style={{ color: 'white' }}>Batch</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell style={{ color: 'white' }}>Supplier</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell style={{ color: 'white' }}>Status</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell style={{ color: 'white' }}>Test Results</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell style={{ color: 'white' }}>Compliance</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell style={{ color: 'white' }}>ALCOA+</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell style={{ color: 'white' }}>Expiry Status</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {filteredMaterials.map((material) => (
            <Table.Row key={material.id} style={{ backgroundColor: '#fff' }}>
              <Table.Cell>
                <Button 
                  variant="ghost" 
                  onClick={() => setSelectedMaterial(material)}
                  style={{ fontWeight: 500 }}
                >
                  {material.name}
                  <ChevronRight size={14} style={{ marginLeft: 4 }} />
                </Button>
              </Table.Cell>

              <Table.Cell>
                <Badge variant="outline">{material.batchNumber}</Badge>
              </Table.Cell>

              <Table.Cell>
                <SupplierStatus supplier={material.supplier} />
              </Table.Cell>

              <Table.Cell>
                <StatusBadge status={material.status} />
              </Table.Cell>

              <Table.Cell>
                {Object.values(material.tests).every(v => v.status === 'Passed') ? (
                  <Badge color="green" highContrast>
                    <Flex align="center" gap="1">
                      <Check size={14} />
                      All Passed
                    </Flex>
                  </Badge>
                ) : (
                  <Badge color="yellow" highContrast>
                    <Flex align="center" gap="1">
                      <Clock size={14} />
                      {Object.values(material.tests).filter(v => v.status === 'Pending').length} Pending
                    </Flex>
                  </Badge>
                )}
              </Table.Cell>

              <Table.Cell>
                <Box style={{ width: '100%' }}>
                  <Progress
                    value={calculateComplianceScore(material)}
                    color={
                      calculateComplianceScore(material) >= 90 ? 'green' : 
                      calculateComplianceScore(material) >= 70 ? 'yellow' : 'red'
                    }
                    style={{ height: '8px', marginBottom: '4px' }}
                  />
                  <Text size="2" weight="bold">
                    {calculateComplianceScore(material)}%
                  </Text>
                </Box>
              </Table.Cell>

              <Table.Cell>
                <ALCOABadge isCompliant={checkALCOACompliance(material)} />
              </Table.Cell>

              <Table.Cell>
                <ExpiryStatusCell expiryDate={material.expiryDate} />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      {/* Material Details Dialog */}
      {selectedMaterial && (
        <Dialog.Root open onOpenChange={() => setSelectedMaterial(null)}>
          <Dialog.Content style={{ maxWidth: '800px', padding: '20px' }}>
            <Dialog.Title>
              <Flex align="center" gap="2">
                {selectedMaterial.name} - Batch: {selectedMaterial.batchNumber}
                {selectedMaterial.blockchainRegistered && (
                  <Badge color="violet">
                    <IconWrapper size={12}><Database /></IconWrapper> Blockchain Verified
                  </Badge>
                )}
              </Flex>
            </Dialog.Title>
            
            <Grid columns="2" gap="4" mt="4">
              {/* Basic Information Column */}
              <Box>
                <Heading size="4" mb="2">Basic Information</Heading>
                <Card>
                  <Flex direction="column" gap="2">
                    <DetailItem label="Material ID" value={selectedMaterial.id} />
                    <DetailItem label="Supplier" value={
                      <SupplierStatus supplier={selectedMaterial.supplier} />
                    } />
                    <DetailItem 
                      label="Expiry Date" 
                      value={new Date(selectedMaterial.expiryDate).toLocaleDateString()} 
                    />
                    <DetailItem 
                      label="Last Reviewed" 
                      value={new Date(selectedMaterial.lastReviewed).toLocaleDateString()} 
                    />
                  </Flex>
                </Card>
              </Box>

              {/* Regulatory Information Column */}
              <Box>
                <Heading size="4" mb="2">Regulatory Information</Heading>
                <Card>
                  <Flex direction="column" gap="2">
                    <DetailItem 
                      label="EDA Registration" 
                      value={selectedMaterial.regulatory.registrationNumber} 
                    />
                    <DetailItem 
                      label="GMP Certified" 
                      value={selectedMaterial.regulatory.gmpInspection ? 'Yes' : 'No'} 
                    />
                    <DetailItem 
                      label="Approval Date" 
                      value={new Date(selectedMaterial.regulatory.approvalDate).toLocaleDateString()} 
                    />
                    <DetailItem 
                      label="Status" 
                      value={<StatusBadge status={selectedMaterial.regulatory.status} />} 
                    />
                  </Flex>
                </Card>
              </Box>
            </Grid>

            <Separator my="4" />

            <Flex direction="column" gap="4">
              <Box>
                <Heading size="4" mb="2">Compliance Overview</Heading>
                <Grid columns="2" gap="4">
                  <Card>
                    <Flex direction="column" gap="2">
                      <Text weight="bold">Compliance Score</Text>
                      <Text size="6" weight="bold">
                        {calculateComplianceScore(selectedMaterial)}%
                      </Text>
                      <ComplianceBar score={calculateComplianceScore(selectedMaterial)} />
                    </Flex>
                  </Card>
                  <Card>
                    <Flex direction="column" gap="2">
                      <Text weight="bold">ALCOA+ Status</Text>
                      <ALCOABadge isCompliant={checkALCOACompliance(selectedMaterial)} />
                      {checkALCOACompliance(selectedMaterial) ? (
                        <Text size="1">This material meets all ALCOA+ requirements</Text>
                      ) : (
                        <Text size="1">This material does not meet all ALCOA+ requirements</Text>
                      )}
                    </Flex>
                  </Card>
                </Grid>
              </Box>

              <Box>
                <Heading size="4" mb="2">Test Results</Heading>
                <TestResultsTable tests={selectedMaterial.tests} />
              </Box>
            </Flex>

            <Flex justify="end" mt="4">
              <Button variant="soft" onClick={() => setSelectedMaterial(null)}>
                Close
              </Button>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      )}

      {/* Certificate Dialog */}
      <Dialog.Root>
        <Dialog.Trigger>
          <Button 
            variant="solid" 
            color="violet" 
            style={{ marginTop: '24px' }}
            onClick={() => setSelectedCertificate(materialsData[0])}
          >
            <HardHat size={16} />
            <Text>Submit to Blockchain</Text>
          </Button>
        </Dialog.Trigger>
        
        <Dialog.Content maxWidth="450px" style={{ borderRadius: '12px' }}>
          <Dialog.Title>Blockchain Submission</Dialog.Title>
          <Dialog.Description mb="4">
            Confirm submission of quality data to immutable ledger
          </Dialog.Description>
          
          <Box p="4" mb="4" style={{ 
            backgroundColor: '#F5F3FF', 
            borderRadius: '8px',
            border: `1px solid ${theme.colors.compliance}20`
          }}>
            <Flex direction="column" gap="2">
              <Text weight="bold">Materials to be submitted:</Text>
              <ul style={{ paddingLeft: '20px' }}>
                {materialsData.map(material => (
                  <li key={material.id}>
                    <Text>{material.name} (Batch: {material.batchNumber})</Text>
                  </li>
                ))}
              </ul>
            </Flex>
          </Box>

          <Flex justify="end" gap="2">
            <Dialog.Close>
              <Button variant="soft">Cancel</Button>
            </Dialog.Close>
            <Button color="violet">
              <HardHat size={16} />
              Confirm Submission
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Box>
  );
}
