import React, { useState } from 'react';
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
    borders: {
      light: string;
      medium: string;
      strong: string;
    };
  };
}

const theme: Theme = {
  colors: {
    primary: '#3B82F6',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    compliance: '#6D28D9',
    background: '#F8FAFC',
    borders: {
      light: '#E2E8F0',
      medium: '#CBD5E1',
      strong: '#94A3B8'
    }
  }
};

// Type definitions
interface TestResult {
  status: 'Passed' | 'Pending' | 'Failed';
  date: string;
  performedBy: string;
  blockchainTx?: string;
  iotDevice: string;
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
        blockchainTx: '0x89ab4c6d3e2f1a7b5c9d8e0f2a4b6c8d',
        iotDevice: 'RAMAN-015'
      },
      Purity: {
        status: 'Passed',
        date: '2025-07-10',
        performedBy: 'Lab Tech 2',
        blockchainTx: '0x76c5d4e3f2a1b9e8d7c6b5a4f3e2d1c0',
        iotDevice: 'HPLC-023'
      },
      Microbial: {
        status: 'Passed',
        date: '2025-07-11',
        performedBy: 'Microbiology Team',
        blockchainTx: '0x54d3e2f1a9b8c7d6e5f4a3b2c1d0e9f8',
        iotDevice: 'MIC-007'
      },
      Endotoxins: {
        status: 'Passed',
        date: '2025-07-11',
        performedBy: 'Microbiology Team',
        blockchainTx: '0x32c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7',
        iotDevice: 'LAL-012'
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
    name: 'Vitamin B12 (Cyanocobalamin)',
    supplier: {
      id: 'SUP-002',
      name: 'Supplier B',
      status: 'Pending'
    },
    status: 'Pending',
    expiryDate: '2024-06-30',
    batchNumber: 'B230502',
    tests: {
      Identity: { status: 'Passed', date: '2024-01-10', performedBy: 'Lab Tech 3', iotDevice: 'RAMAN-016' },
      Purity: { status: 'Pending', date: new Date().toISOString(), performedBy: 'Lab Tech 1', iotDevice: 'HPLC-024' },
      Microbial: { status: 'Failed', date: '2024-01-15', performedBy: 'Micro Team', iotDevice: 'MIC-008' },
      Endotoxins: { status: 'Passed', date: '2024-01-12', performedBy: 'Micro Team', iotDevice: 'LAL-013' }
    },
    regulatory: {
      registrationNumber: 'EDA-REG-2023-54321',
      approvalDate: '2023-03-10',
      expiryDate: '2026-03-10',
      status: 'Pending',
      gmpInspection: false
    },
    blockchainRegistered: false,
    lastReviewed: '2024-01-20'
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
    expiryDate: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0],
    batchNumber: 'B230503',
    tests: {
      Identity: { status: 'Passed', date: new Date().toISOString(), performedBy: 'Lab Tech 1', iotDevice: 'RAMAN-017' },
      Purity: { status: 'Passed', date: new Date().toISOString(), performedBy: 'Lab Tech 2', iotDevice: 'HPLC-025' },
      Microbial: { status: 'Passed', date: new Date().toISOString(), performedBy: 'Micro Team', iotDevice: 'MIC-009' },
      Endotoxins: { status: 'Pending', date: new Date().toISOString(), performedBy: 'Micro Team', iotDevice: 'LAL-014' }
    },
    certificate: 'CERT-003',
    regulatory: {
      registrationNumber: 'EDA-REG-2023-67890',
      approvalDate: '2023-02-15',
      expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      status: 'Approved',
      gmpInspection: true
    },
    blockchainRegistered: true,
    lastReviewed: new Date().toISOString().split('T')[0]
  }
];

// Helper Components
const IconWrapper = ({ size = 16, color, children }: { size?: number; color?: string; children: React.ReactNode }) => (
  <Text as="span" style={{ display: 'inline-flex', width: size, height: size, color }}>
    {children}
  </Text>
);

const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    Approved: { color: 'green' as const, icon: <Check size={14} /> },
    Rejected: { color: 'red' as const, icon: <AlertTriangle size={14} /> },
    Pending: { color: 'yellow' as const, icon: <Clock size={14} /> },
    Expired: { color: 'orange' as const, icon: <Calendar size={14} /> },
    NotApproved: { color: 'red' as const, icon: <AlertTriangle size={14} /> },
    Passed: { color: 'green' as const, icon: <Check size={14} /> },
    Failed: { color: 'red' as const, icon: <AlertTriangle size={14} /> }
  };

  const currentConfig = statusConfig[status as keyof typeof statusConfig] || 
                      { color: 'gray' as const, icon: <HelpCircle size={14} /> };

  return (
    <Badge color={currentConfig.color} highContrast>
      <Flex align="center" gap="1">
        <IconWrapper size={14} color={`var(--${currentConfig.color}-11)`}>
          {currentConfig.icon}
        </IconWrapper>
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
    <Progress
      value={score}
      color={
        score > 90 ? 'green' : 
        score > 70 ? 'yellow' : 'red'
      }
      style={{ height: '8px' }}
    />
    <Text size="1" align="center" weight="bold">
      {score}%
    </Text>
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

const ExpiryWithIndicator = ({ expiryDate }: { expiryDate: string }) => {
  const expiry = new Date(expiryDate);
  const today = new Date();
  const isExpired = expiry < today;
  const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Flex align="center" gap="2">
      <Text>{new Date(expiryDate).toLocaleDateString()}</Text>
      <Tooltip content={isExpired ? "Expired" : `Valid (${daysUntilExpiry} days remaining)`}>
        <Box
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: isExpired ? theme.colors.danger : 
                           daysUntilExpiry <= 30 ? theme.colors.warning : theme.colors.success
          }}
        />
      </Tooltip>
    </Flex>
  );
};

const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <Flex justify="between" py="2" style={{ borderBottom: `1px solid ${theme.colors.borders.light}` }}>
    <Text color="gray">{label}</Text>
    {typeof value === 'string' ? <Text>{value}</Text> : value}
  </Flex>
);

// Utility functions
const calculateComplianceScore = (material: Material): number => {
  const testScores = Object.values(material.tests)
    .filter(test => test.status === 'Passed')
    .length * 25; // Each test worth 25 points (100/4)

  const certScore = material.certificate ? 20 : 0;
  const supplierScore = material.supplier.status === 'Approved' ? 20 : 0;
  const expiryScore = new Date(material.expiryDate) > new Date() ? 20 : 0;
  const blockchainScore = material.blockchainRegistered ? 20 : 0;

  return Math.min(100, testScores + certScore + supplierScore + expiryScore + blockchainScore);
};

const checkALCOACompliance = (material: Material): boolean => {
  const testsPassed = Object.values(material.tests).every(test => test.status === 'Passed');
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

  // Calculate metrics
  const approvedCount = materialsData.filter(m => m.status === 'Approved').length;
  const pendingCount = materialsData.filter(m => m.status === 'Pending').length;
  const expiringSoonCount = materialsData.filter(m => {
    const expiryDate = new Date(m.expiryDate);
    const today = new Date();
    const diffDays = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
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

  // Table styling
  const tableStyle = {
    borderRadius: '8px',
    overflow: 'hidden',
    border: `1px solid ${theme.colors.borders.medium}`,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    width: '100%'
  };

  const headerStyle = {
    backgroundColor: theme.colors.primary,
    borderBottom: `2px solid ${theme.colors.borders.strong}`
  };

  const cellStyle = {
    borderRight: `1px solid ${theme.colors.borders.light}`,
    padding: '12px 16px'
  };

  const subTableStyle = {
    marginTop: '16px',
    border: `1px solid ${theme.colors.borders.light}`,
    borderRadius: '6px',
    backgroundColor: 'white',
    width: '100%'
  };

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

          {/* Fixed TextField implementation */}
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

      {/* Main Materials Table */}
      <Table.Root style={tableStyle}>
        <Table.Header style={headerStyle}>
          <Table.Row>
            <Table.ColumnHeaderCell style={{ color: 'white' }}>Material</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell style={{ color: 'white' }}>Supplier</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell style={{ color: 'white' }}>EDA Status</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell style={{ color: 'white' }}>Test Results</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell style={{ color: 'white' }}>Compliance</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell style={{ color: 'white' }}>Expiry</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell style={{ color: 'white' }}>ALCOA+</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {filteredMaterials.map((material) => (
            <Table.Row key={material.id} style={{ borderBottom: `1px solid ${theme.colors.borders.light}` }}>
              <Table.Cell style={cellStyle}>
                <Button 
                  variant="ghost" 
                  onClick={() => setSelectedMaterial(material)}
                  style={{ fontWeight: 500 }}
                >
                  {material.name}
                  <ChevronRight size={14} style={{ marginLeft: 4 }} />
                </Button>
              </Table.Cell>

              <Table.Cell style={cellStyle}>
                <SupplierStatus supplier={material.supplier} />
              </Table.Cell>

              <Table.Cell style={cellStyle}>
                <StatusBadge status={material.regulatory.status} />
              </Table.Cell>

              <Table.Cell style={cellStyle}>
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

              <Table.Cell style={cellStyle}>
                <ComplianceBar score={calculateComplianceScore(material)} />
              </Table.Cell>

              <Table.Cell style={cellStyle}>
                <ExpiryWithIndicator expiryDate={material.expiryDate} />
              </Table.Cell>

              <Table.Cell style={{ ...cellStyle, borderRight: 'none' }}>
                <Flex justify="center">
                  <ALCOABadge isCompliant={checkALCOACompliance(material)} />
                </Flex>
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
              <Box>
                <Heading size="4" mb="2">Basic Information</Heading>
                <Card>
                  <Flex direction="column" gap="2">
                    <DetailItem label="Material ID" value={selectedMaterial.id} />
                    <DetailItem label="Supplier" value={
                      <SupplierStatus supplier={selectedMaterial.supplier} />
                    } />
                    <DetailItem 
                      label="Last Reviewed" 
                      value={new Date(selectedMaterial.lastReviewed).toLocaleDateString()} 
                    />
                  </Flex>
                </Card>
              </Box>

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
                <Table.Root style={subTableStyle}>
                  <Table.Header style={{ backgroundColor: '#F8FAFC', borderBottom: `2px solid ${theme.colors.borders.light}` }}>
                    <Table.Row>
                      <Table.ColumnHeaderCell>Test</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Performed By</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>IoT Device</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Blockchain</Table.ColumnHeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {Object.entries(selectedMaterial.tests).map(([testName, test]) => (
                      <Table.Row key={testName} style={{ borderBottom: `1px solid ${theme.colors.borders.light}` }}>
                        <Table.Cell style={{ padding: '10px 12px', borderRight: `1px solid ${theme.colors.borders.light}` }}>{testName}</Table.Cell>
                        <Table.Cell style={{ padding: '10px 12px', borderRight: `1px solid ${theme.colors.borders.light}` }}>
                          <StatusBadge status={test.status} />
                        </Table.Cell>
                        <Table.Cell style={{ padding: '10px 12px', borderRight: `1px solid ${theme.colors.borders.light}` }}>{test.performedBy}</Table.Cell>
                        <Table.Cell style={{ padding: '10px 12px', borderRight: `1px solid ${theme.colors.borders.light}` }}>
                          {new Date(test.date).toLocaleDateString()}
                        </Table.Cell>
                        <Table.Cell style={{ padding: '10px 12px', borderRight: `1px solid ${theme.colors.borders.light}` }}>
                          <Badge color="blue" variant="soft">
                            {test.iotDevice}
                          </Badge>
                        </Table.Cell>
                        <Table.Cell style={{ padding: '10px 12px' }}>
                          <BlockchainLink txHash={test.blockchainTx} />
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
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
