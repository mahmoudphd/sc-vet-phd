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
  Grid,
  Select,
  Separator
} from '@radix-ui/themes';
import { useState } from 'react';
import {
  Check,
  Clock,
  AlertTriangle,
  FileText,
  HelpCircle,
  Link,
  Database,
  Calendar
} from 'lucide-react';

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
    expiryDate: '2025-08-10',
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
      expiryDate: '2026-01-15',
      status: 'Approved',
      gmpInspection: true
    },
    blockchainRegistered: true,
    lastReviewed: '2025-07-15'
  }
];

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

const ComplianceChart = ({ compliance }: { compliance: number }) => (
  <div style={{ width: '100%', height: '8px', backgroundColor: '#e9ecef', borderRadius: '4px', overflow: 'hidden' }}>
    <div style={{
      width: `${compliance}%`,
      height: '100%',
      backgroundColor: compliance > 75 ? '#2ecc71' : compliance > 50 ? '#f39c12' : '#e74c3c'
    }} />
  </div>
);

const ExpiryStatusIndicator = ({ expiryDate }: { expiryDate: string }) => {
  const daysRemaining = Math.floor((new Date(expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
  const color = daysRemaining <= 30 ? 'red' : daysRemaining <= 90 ? 'orange' : 'green';
  return (
    <Tooltip content={`Expires in ${daysRemaining} days`}>
      <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: color, marginRight: '8px' }} />
    </Tooltip>
  );
};

const ALCOABadge = () => (
  <Badge color="green" highContrast>
    <Flex align="center" gap="1">
      <IconWrapper size={12}><Check /></IconWrapper>
      ALCOA+
    </Flex>
  </Badge>
);

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

const calculateComplianceDetails = (material: Material) => {
  const passedTests = Object.values(material.tests).filter(t => t.status === 'Passed').length;
  const testsScore = passedTests * 10;
  const certificateScore = material.certificate ? 30 : 0;
  const supplierScore = material.supplier.status === 'Approved' ? 20 : 
                      material.supplier.status === 'Pending' ? 10 : 0;
  const validityScore = new Date(material.expiryDate) > new Date() ? 10 : 0;
  const totalScore = testsScore + certificateScore + supplierScore + validityScore;

  return {
    totalScore,
    details: {
      tests: { passed: passedTests, total: 4, score: testsScore, max: 40 },
      certificate: { exists: !!material.certificate, score: certificateScore, max: 30 },
      supplier: { status: material.supplier.status, score: supplierScore, max: 20 },
      validity: { isExpired: validityScore === 0, score: validityScore, max: 10 }
    }
  };
};

const isALCOACompliant = (material: Material) => {
  return (
    Object.values(material.tests).every(t => t.status === 'Passed') &&
    !!material.certificate &&
    material.supplier.status === 'Approved' &&
    new Date(material.expiryDate) > new Date() &&
    material.blockchainRegistered
  );
};

const ComplianceCard = ({ material }: { material: Material }) => {
  const { totalScore, details } = calculateComplianceDetails(material);
  return (
    <Card>
      <Flex direction="column" gap="3">
        <Text size="4" weight="bold">Compliance Score: {totalScore}%</Text>
        <DetailItem label="Test Results" value={`${details.tests.score}/${details.tests.max}`} />
        <DetailItem label="Certificate" value={`${details.certificate.score}/${details.certificate.max}`} />
        <DetailItem label="Supplier Status" value={`${details.supplier.score}/${details.supplier.max}`} />
        <DetailItem label="Validity" value={`${details.validity.score}/${details.validity.max}`} />
        {isALCOACompliant(material) && <ALCOABadge />}
      </Flex>
    </Card>
  );
};

export default function MaterialsQualificationDashboard() {
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all');

  const filteredMaterials = materialsData.filter(material => {
    if (filter === 'approved') return material.status === 'Approved';
    if (filter === 'pending') return material.status !== 'Approved';
    return true;
  });

  const stats = {
    total: materialsData.length,
    approved: materialsData.filter(m => m.status === 'Approved').length,
    pending: materialsData.filter(m => m.status !== 'Approved').length,
    blockchainRegistered: materialsData.filter(m => m.blockchainRegistered).length
  };

  return (
    <Box p="4" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Flex justify="between" align="center" mb="4">
        <Text size="6" weight="bold">Materials Qualification Dashboard</Text>
        <Select.Root value={filter} onValueChange={(value) => setFilter(value as 'all' | 'approved' | 'pending')}>
          <Select.Trigger />
          <Select.Content>
            <Select.Item value="all">All Materials ({stats.total})</Select.Item>
            <Select.Item value="approved">Approved ({stats.approved})</Select.Item>
            <Select.Item value="pending">Pending ({stats.pending})</Select.Item>
          </Select.Content>
        </Select.Root>
      </Flex>

      <Grid columns="3" gap="4" mb="4">
        <Card>
          <Flex gap="3" align="center">
            <Box style={{ padding: '8px', backgroundColor: '#ECFDF5', borderRadius: '8px' }}>
              <IconWrapper size={20} color="#10B981"><Check /></IconWrapper>
            </Box>
            <Box>
              <Text color="gray" size="2">Approved Materials</Text>
              <Text size="4" weight="bold">{stats.approved}</Text>
            </Box>
          </Flex>
        </Card>

        <Card>
          <Flex gap="3" align="center">
            <Box style={{ padding: '8px', backgroundColor: '#FEF3C7', borderRadius: '8px' }}>
              <IconWrapper size={20} color="#F59E0B"><Clock /></IconWrapper>
            </Box>
            <Box>
              <Text color="gray" size="2">Pending Approval</Text>
              <Text size="4" weight="bold">{stats.pending}</Text>
            </Box>
          </Flex>
        </Card>

        <Card>
          <Flex gap="3" align="center">
            <Box style={{ padding: '8px', backgroundColor: '#F5F3FF', borderRadius: '8px' }}>
              <IconWrapper size={20} color="#6D28D9"><Database /></IconWrapper>
            </Box>
            <Box>
              <Text color="gray" size="2">Blockchain Verified</Text>
              <Text size="4" weight="bold">{stats.blockchainRegistered}</Text>
            </Box>
          </Flex>
        </Card>
      </Grid>

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Material</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Batch</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Supplier</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Compliance</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {filteredMaterials.map(material => {
            const { totalScore } = calculateComplianceDetails(material);
            return (
              <Table.Row key={material.id}>
                <Table.Cell>
                  <Flex align="center">
                    <ExpiryStatusIndicator expiryDate={material.expiryDate} />
                    <Text weight="medium">{material.name}</Text>
                  </Flex>
                </Table.Cell>
                <Table.Cell>{material.batchNumber}</Table.Cell>
                <Table.Cell>
                  <SupplierStatus supplier={material.supplier} />
                </Table.Cell>
                <Table.Cell>
                  <Flex direction="column" gap="1">
                    <Text weight="bold">{totalScore}%</Text>
                    <ComplianceChart compliance={totalScore} />
                  </Flex>
                </Table.Cell>
                <Table.Cell>
                  <Button 
                    size="1" 
                    variant="soft"
                    onClick={() => setSelectedMaterial(material)}
                  >
                    <IconWrapper size={14}><FileText /></IconWrapper> Details
                  </Button>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Root>

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
                <Text weight="bold" color="gray" mb="2">Basic Information</Text>
                <Card>
                  <Flex direction="column" gap="2">
                    <DetailItem label="Material ID" value={selectedMaterial.id} />
                    <DetailItem label="Supplier" value={
                      <SupplierStatus supplier={selectedMaterial.supplier} />
                    } />
                    <DetailItem 
                      label="Expiry Date" 
                      value={
                        <Flex align="center" gap="2">
                          <ExpiryStatusIndicator expiryDate={selectedMaterial.expiryDate} />
                          {new Date(selectedMaterial.expiryDate).toLocaleDateString()}
                        </Flex>
                      } 
                    />
                    <DetailItem 
                      label="Last Reviewed" 
                      value={new Date(selectedMaterial.lastReviewed).toLocaleDateString()} 
                    />
                  </Flex>
                </Card>
              </Box>

              <Box>
                <Text weight="bold" color="gray" mb="2">Regulatory Information</Text>
                <Card>
                  <Flex direction="column" gap="2">
                    <DetailItem 
                      label="Status" 
                      value={<StatusBadge status={selectedMaterial.status} />} 
                    />
                    <DetailItem 
                      label="EDA Registration" 
                      value={selectedMaterial.regulatory.registrationNumber} 
                    />
                    <DetailItem 
                      label="Approval Date" 
                      value={new Date(selectedMaterial.regulatory.approvalDate).toLocaleDateString()} 
                    />
                    <DetailItem 
                      label="GMP Inspection" 
                      value={
                        selectedMaterial.regulatory.gmpInspection ? 'Passed' : 'Pending'
                      } 
                    />
                  </Flex>
                </Card>
              </Box>
            </Grid>

            <Separator my="4" />

            <Flex direction="column" gap="4">
              <Box>
                <Text weight="bold" color="gray" mb="2">Compliance Score</Text>
                <ComplianceCard material={selectedMaterial} />
              </Box>

              <Box>
                <Text weight="bold" color="gray" mb="2">Test Results</Text>
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
    </Box>
  );
}
