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
  Select,
  TextField,
  Grid,
  Heading,
  Separator
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
  Search,
  Link,
  Database,
  Calendar,
  HelpCircle
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

// Updated interfaces from second code
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
  material: string;
  supplier: Supplier;
  status: 'Approved' | 'Pending' | 'Rejected';
  expiry: string;
  batch: string;
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

// Complete sample data from both codes
const materialsData: Material[] = [
  {
    id: 'MAT-001',
    material: 'Vitamin B1 (Thiamine)',
    supplier: {
      id: 'SUP-001',
      name: 'Supplier A',
      status: 'Approved',
      approvalDate: '2023-01-10'
    },
    status: 'Approved',
    expiry: '2025-08-10',
    batch: 'B230501',
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
  },
  {
    id: 'MAT-002',
    material: 'Vitamin B2 (Riboflavin)',
    supplier: {
      id: 'SUP-002',
      name: 'Supplier B',
      status: 'NotApproved'
    },
    status: 'Pending',
    expiry: '2025-12-15',
    batch: 'B230502',
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
    material: 'Nicotinamide',
    supplier: {
      id: 'SUP-001',
      name: 'Supplier A',
      status: 'Approved',
      approvalDate: '2023-01-10'
    },
    status: 'Approved',
    expiry: '2026-01-20',
    batch: 'B230503',
    tests: {
      Identity: {
        status: 'Passed',
        date: '2025-07-01',
        performedBy: 'Lab Tech 2',
        blockchainTx: '0x12ab3c4d5e6f7a8b9c0d1e2f3a4b5c6d7'
      },
      Purity: {
        status: 'Passed',
        date: '2025-07-01',
        performedBy: 'Lab Tech 3',
        blockchainTx: '0x98fe7d6c5b4a3f2e1d0c9b8a7f6e5d4c3'
      },
      Microbial: {
        status: 'Failed',
        date: '2025-07-02',
        performedBy: 'Microbiology Team',
        blockchainTx: '0x56ef4a3b2c1d0e9f8a7b6c5d4e3f2a1b0'
      },
      Endotoxins: {
        status: 'Passed',
        date: '2025-07-02',
        performedBy: 'Microbiology Team',
        blockchainTx: '0x34cd5e6f7a8b9c0d1e2f3a4b5c6d7e8f9'
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
  },
  {
    id: 'MAT-004',
    material: 'Magnesium Stearate',
    supplier: {
      id: 'SUP-003',
      name: 'Supplier C',
      status: 'Pending'
    },
    status: 'Pending',
    expiry: '2025-10-30',
    batch: 'B230504',
    tests: {
      Identity: {
        status: 'Passed',
        date: '2025-08-15',
        performedBy: 'Lab Tech 1',
        blockchainTx: '0x78ab9c0d1e2f3a4b5c6d7e8f9a0b1c2d3'
      },
      Purity: {
        status: 'Pending',
        date: '2025-08-16',
        performedBy: 'Lab Tech 2'
      },
      Microbial: {
        status: 'Pending',
        date: '2025-08-16',
        performedBy: 'Microbiology Team'
      },
      Endotoxins: {
        status: 'Pending',
        date: '2025-08-17',
        performedBy: 'Microbiology Team'
      }
    },
    regulatory: {
      registrationNumber: 'EDA-REG-2023-98765',
      approvalDate: '2023-04-20',
      expiryDate: '2026-04-20',
      status: 'Pending',
      gmpInspection: false
    },
    blockchainRegistered: false,
    lastReviewed: '2025-08-15'
  }
];

// ========== UTILITY FUNCTIONS ==========
const calculateComplianceScore = (material: Material): number => {
  const testScores = Object.values(material.tests)
    .filter(test => test.status === 'Passed')
    .length * 10;

  const certScore = material.certificate ? 30 : 0;
  const supplierScore = material.supplier.status === 'Approved' ? 20 : 10;
  const expiryScore = new Date(material.expiry) > new Date() ? 10 : 0;
  const blockchainScore = material.blockchainRegistered ? 10 : 0;

  return testScores + certScore + supplierScore + expiryScore + blockchainScore;
};

const checkALCOACompliance = (material: Material): boolean => {
  const testsPassed = Object.values(material.tests)
    .every(test => test.status === 'Passed');
  
  const hasCertificate = !!material.certificate;
  const validSupplier = material.supplier.status === 'Approved';
  const notExpired = new Date(material.expiry) > new Date();
  const blockchainVerified = material.blockchainRegistered;

  return testsPassed && hasCertificate && validSupplier && notExpired && blockchainVerified;
};

// ========== COMPONENTS ==========
const StatusBadge = ({ status }: { status: string }) => {
  const config = {
    Approved: { color: 'green' as const, icon: <Check size={14} /> },
    Rejected: { color: 'red' as const, icon: <AlertTriangle size={14} /> },
    Pending: { color: 'yellow' as const, icon: <Clock size={14} /> },
    Expired: { color: 'orange' as const, icon: <Calendar size={14} /> },
    NotApproved: { color: 'red' as const, icon: <AlertTriangle size={14} /> },
    Passed: { color: 'green' as const, icon: <Check size={14} /> },
    Failed: { color: 'red' as const, icon: <AlertTriangle size={14} /> }
  };

  const currentConfig = config[status as keyof typeof config] || 
                      { color: 'gray' as const, icon: <HelpCircle size={14} /> };

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
            <Link size={12} />
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
        score >= 90 ? 'green' : 
        score >= 70 ? 'yellow' : 'red'
      }
      style={{ height: '8px' }}
    />
    <Text size="1" align="center">{score}%</Text>
  </Flex>
);

const ALCOABadge = ({ isCompliant }: { isCompliant: boolean }) => (
  isCompliant ? (
    <Badge color="green" highContrast>
      <Flex align="center" gap="1">
        <Check size={12} />
        ALCOA+
      </Flex>
    </Badge>
  ) : (
    <Badge color="red" highContrast>
      <Flex align="center" gap="1">
        <AlertTriangle size={12} />
        Not ALCOA+
      </Flex>
    </Badge>
  )
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

// ========== MAIN COMPONENT ==========
export default function MaterialQualificationDashboard() {
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMaterials = materialsData.filter(material => {
    if (filter === 'approved' && material.status !== 'Approved') return false;
    if (filter === 'pending' && material.status === 'Approved') return false;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        material.material.toLowerCase().includes(query) ||
        material.batch.toLowerCase().includes(query) ||
        material.supplier.name.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  const stats = {
    total: materialsData.length,
    approved: materialsData.filter(m => m.status === 'Approved').length,
    pending: materialsData.filter(m => m.status !== 'Approved').length,
    compliant: materialsData.filter(m => checkALCOACompliance(m)).length
  };

  return (
    <Box p="4" style={{ backgroundColor: theme.colors.background, minHeight: '100vh' }}>
      {/* Header with Search and Filter */}
      <Flex justify="between" align="center" mb="5">
        <Text size="6" weight="bold">Material Qualification Dashboard</Text>
        <Flex gap="3">
          <Button variant="solid" color="violet">
            <ShieldCheck size={16} />
            <Text>Quality Report</Text>
          </Button>

          <Select.Root value={filter} onValueChange={(value: 'all' | 'approved' | 'pending') => setFilter(value)}>
            <Select.Trigger />
            <Select.Content>
              <Select.Item value="all">All Materials ({stats.total})</Select.Item>
              <Select.Item value="approved">Approved ({stats.approved})</Select.Item>
              <Select.Item value="pending">Pending ({stats.pending})</Select.Item>
            </Select.Content>
          </Select.Root>

          <TextField.Root>
            <TextField.Slot>
              <Search size={16} />
            </TextField.Slot>
            <TextField.Input 
              placeholder="Search materials..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </TextField.Root>
        </Flex>
      </Flex>

      {/* Stats Cards */}
      <Grid columns="3" gap="4" mb="5">
        <Card variant="surface">
          <Flex gap="3" align="center">
            <Box p="2" style={{ background: '#ECFDF5', borderRadius: '8px' }}>
              <Check color={theme.colors.success} size={20} />
            </Box>
            <Box>
              <Text size="2" color="gray">Approved Materials</Text>
              <Text size="4" weight="bold">{stats.approved}</Text>
            </Box>
          </Flex>
        </Card>

        <Card variant="surface">
          <Flex gap="3" align="center">
            <Box p="2" style={{ background: '#FEF3C7', borderRadius: '8px' }}>
              <Clock color={theme.colors.warning} size={20} />
            </Box>
            <Box>
              <Text size="2" color="gray">Pending Approval</Text>
              <Text size="4" weight="bold">{stats.pending}</Text>
            </Box>
          </Flex>
        </Card>

        <Card variant="surface">
          <Flex gap="3" align="center">
            <Box p="2" style={{ background: '#F5F3FF', borderRadius: '8px' }}>
              <Database color={theme.colors.compliance} size={20} />
            </Box>
            <Box>
              <Text size="2" color="gray">ALCOA+ Compliant</Text>
              <Text size="4" weight="bold">{stats.compliant}</Text>
            </Box>
          </Flex>
        </Card>
      </Grid>

      {/* Materials Table */}
      <Table.Root variant="surface" style={{ borderRadius: '8px', overflow: 'hidden' }}>
        <Table.Header style={{ backgroundColor: theme.colors.primary }}>
          <Table.Row>
            <Table.ColumnHeaderCell style={{ color: 'white' }}>Material</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell style={{ color: 'white' }}>Batch</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell style={{ color: 'white' }}>Supplier</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell style={{ color: 'white' }}>Status</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell style={{ color: 'white' }}>Compliance</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell style={{ color: 'white' }}>ALCOA+</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell style={{ color: 'white' }}>Expiry</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell style={{ color: 'white' }}>Actions</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {filteredMaterials.map((material) => {
            const complianceScore = calculateComplianceScore(material);
            const isALCOACompliant = checkALCOACompliance(material);
            
            return (
              <Table.Row key={material.id} style={{ backgroundColor: '#fff' }}>
                <Table.Cell>
                  <Dialog.Root>
                    <Dialog.Trigger>
                      <Button 
                        variant="ghost" 
                        onClick={() => setSelectedMaterial(material)}
                        style={{ fontWeight: 500 }}
                      >
                        {material.material}
                        <ChevronRight size={14} style={{ marginLeft: 4 }} />
                      </Button>
                    </Dialog.Trigger>
                  </Dialog.Root>
                </Table.Cell>

                <Table.Cell>
                  <Badge variant="outline">{material.batch}</Badge>
                </Table.Cell>

                <Table.Cell>
                  <SupplierStatus supplier={material.supplier} />
                </Table.Cell>

                <Table.Cell>
                  <StatusBadge status={material.status} />
                </Table.Cell>

                <Table.Cell>
                  <ComplianceBar score={complianceScore} />
                </Table.Cell>

                <Table.Cell>
                  <ALCOABadge isCompliant={isALCOACompliant} />
                </Table.Cell>

                <Table.Cell>
                  <Flex align="center" gap="2">
                    <Text
                      weight={
                        new Date(material.expiry) < new Date() ? 'bold' : 
                        (new Date(material.expiry).getTime() - new Date().getTime()) < (30 * 24 * 60 * 60 * 1000) ? 'bold' : 'regular'
                      }
                      color={
                        new Date(material.expiry) < new Date() ? 'red' : 
                        (new Date(material.expiry).getTime() - new Date().getTime()) < (30 * 24 * 60 * 60 * 1000) ? 'yellow' : undefined
                      }
                    >
                      {new Date(material.expiry).toLocaleDateString()}
                    </Text>
                    {((new Date(material.expiry).getTime() - new Date().getTime()) < (30 * 24 * 60 * 60 * 1000)) && (
                      <Tooltip content={`Expires in ${Math.ceil((new Date(material.expiry).getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000))} days`}>
                        <Box>
                          <AlertTriangle size={16} color={theme.colors.warning} />
                        </Box>
                      </Tooltip>
                    )}
                  </Flex>
                </Table.Cell>

                <Table.Cell>
                  <Button 
                    size="1" 
                    variant="soft"
                    onClick={() => setSelectedMaterial(material)}
                  >
                    <FileText size={14} /> Details
                  </Button>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Root>

      {/* Material Detail Dialog */}
      {selectedMaterial && (
        <Dialog.Root open onOpenChange={() => setSelectedMaterial(null)}>
          <Dialog.Content style={{ maxWidth: '800px', padding: '20px' }}>
            <Dialog.Title>
              <Flex align="center" gap="2">
                {selectedMaterial.material} - Batch: {selectedMaterial.batch}
                {selectedMaterial.blockchainRegistered && (
                  <Badge color="violet">
                    <Database size={12} /> Blockchain Verified
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
                      label="Expiry Date" 
                      value={new Date(selectedMaterial.expiry).toLocaleDateString()} 
                    />
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
                        selectedMaterial.regulatory.gmpInspection ? 
                        <StatusBadge status="Passed" /> : 
                        <StatusBadge status="Pending" />
                      } 
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
                    <Text>{material.material} (Batch: {material.batch})</Text>
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
