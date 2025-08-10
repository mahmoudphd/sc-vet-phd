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
  Separator
} from '@radix-ui/themes';
import { useState } from 'react';
import {
  Check,
  Clock,
  AlertTriangle,
  FileText,
  ShieldCheck,
  HardHat,
  HelpCircle,
  Cpu,
  Link,
  Database,
  Calendar,
  FlaskConical,
  Pill
} from 'lucide-react';

// ========== TYPE DEFINITIONS ==========
interface TestResult {
  status: 'Passed' | 'Pending' | 'Failed';
  date: string;
  performedBy: string;
  iotDevice?: string;
  blockchainTx?: string;
}

interface EDARegistration {
  registrationNumber: string;
  approvalDate: string;
  expiryDate: string;
  status: 'Approved' | 'Rejected' | 'Pending' | 'Expired';
  gmpInspection: boolean;
  lastInspectionDate?: string;
  blockchainTx?: string;
}

interface Supplier {
  id: string;
  name: string;
  status: 'Approved' | 'NotApproved' | 'Pending';
  approvalDate?: string;
  edaRegistration?: string;
}

interface Material {
  id: string;
  name: string;
  type: 'API' | 'Excipient' | 'Packaging';
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
  lastReviewed: string;
  regulatory: EDARegistration;
  iotConnected: boolean;
  blockchainRegistered: boolean;
}

// ========== SAMPLE DATA ==========
const materialsData: Material[] = [
  {
    id: 'MAT-001',
    name: 'Vitamin B1 (Thiamine)',
    type: 'API',
    supplier: {
      id: 'SUP-001',
      name: 'Supplier A',
      status: 'Approved',
      approvalDate: '2023-01-10',
      edaRegistration: 'EDA-SUP-2022-3456'
    },
    status: 'Approved',
    expiryDate: '2025-08-10',
    batchNumber: 'B230501',
    tests: {
      Identity: {
        status: 'Passed',
        date: '2025-07-10',
        performedBy: 'Lab Tech 1',
        iotDevice: 'HPLC-023',
        blockchainTx: '0x89ab4c6d3e2f1a7b5c9d8e0f2a4b6c8d'
      },
      Purity: {
        status: 'Passed',
        date: '2025-07-10',
        performedBy: 'Lab Tech 2',
        iotDevice: 'HPLC-023',
        blockchainTx: '0x76c5d4e3f2a1b9e8d7c6b5a4f3e2d1c0'
      },
      Microbial: {
        status: 'Passed',
        date: '2025-07-11',
        performedBy: 'Microbiology Team',
        iotDevice: 'MIC-007',
        blockchainTx: '0x54d3e2f1a9b8c7d6e5f4a3b2c1d0e9f8'
      },
      Endotoxins: {
        status: 'Passed',
        date: '2025-07-11',
        performedBy: 'Microbiology Team',
        iotDevice: 'LAL-012',
        blockchainTx: '0x32c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7'
      }
    },
    certificate: 'CERT-001',
    lastReviewed: '2025-07-15',
    regulatory: {
      registrationNumber: 'EDA-REG-2023-12345',
      approvalDate: '2023-01-15',
      expiryDate: '2026-01-15',
      status: 'Approved',
      gmpInspection: true,
      lastInspectionDate: '2024-03-20',
      blockchainTx: '0x21b0a9f8c7d6e5f4a3b2c1d0e9f8a7b6'
    },
    iotConnected: true,
    blockchainRegistered: true
  },
  {
    id: 'MAT-002',
    name: 'Vitamin B2 (Riboflavin)',
    type: 'API',
    supplier: {
      id: 'SUP-002',
      name: 'Supplier B',
      status: 'NotApproved',
      edaRegistration: 'EDA-SUP-2023-7890'
    },
    status: 'Pending',
    expiryDate: '2025-12-15',
    batchNumber: 'B230502',
    tests: {
      Identity: {
        status: 'Pending',
        date: '2025-08-01',
        performedBy: 'Lab Tech 3',
        iotDevice: 'HPLC-024'
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
    lastReviewed: '2025-08-10',
    regulatory: {
      registrationNumber: 'EDA-REG-2023-54321',
      approvalDate: '2023-03-10',
      expiryDate: '2026-03-10',
      status: 'Pending',
      gmpInspection: false
    },
    iotConnected: false,
    blockchainRegistered: false
  }
];

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
    <Tooltip content="View on Hyperledger Besu Explorer">
      <Button variant="ghost" size="1" asChild>
        <a 
          href={`http://besu-explorer.local/transactions/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none' }}
        >
          <Flex align="center" gap="1">
            <Link size={12} />
            Verify
          </Flex>
        </a>
      </Button>
    </Tooltip>
  );
};

const MaterialTypeIcon = ({ type }: { type: Material['type'] }) => {
  const icons = {
    API: <Pill size={16} />,
    Excipient: <FlaskConical size={16} />,
    Packaging: <Box size={16} />
  };
  
  return (
    <Tooltip content={type}>
      {icons[type]}
    </Tooltip>
  );
};

const SupplierStatus = ({ supplier }: { supplier: Supplier }) => {
  return (
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
};

// ========== MAIN DASHBOARD COMPONENT ==========
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
    iotConnected: materialsData.filter(m => m.iotConnected).length,
    blockchainRegistered: materialsData.filter(m => m.blockchainRegistered).length
  };

  return (
    <Box p="4" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Flex justify="between" align="center" mb="4">
        <Text size="6" weight="bold">Materials Qualification Dashboard</Text>
        <Select.Root value={filter} onValueChange={(v) => setFilter(v as any)}>
          <Select.Trigger />
          <Select.Content>
            <Select.Item value="all">All Materials ({stats.total})</Select.Item>
            <Select.Item value="approved">Approved ({stats.approved})</Select.Item>
            <Select.Item value="pending">Pending ({stats.pending})</Select.Item>
          </Select.Content>
        </Select.Root>
      </Flex>

      <Grid columns="4" gap="4" mb="4">
        <Card>
          <Flex gap="3" align="center">
            <Box style={{ padding: '8px', backgroundColor: '#ECFDF5', borderRadius: '8px' }}>
              <Check color="#10B981" size={20} />
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
              <Clock color="#F59E0B" size={20} />
            </Box>
            <Box>
              <Text color="gray" size="2">Pending Approval</Text>
              <Text size="4" weight="bold">{stats.pending}</Text>
            </Box>
          </Flex>
        </Card>

        <Card>
          <Flex gap="3" align="center">
            <Box style={{ padding: '8px', backgroundColor: '#EFF6FF', borderRadius: '8px' }}>
              <Cpu color="#3B82F6" size={20} />
            </Box>
            <Box>
              <Text color="gray" size="2">IoT Connected</Text>
              <Text size="4" weight="bold">{stats.iotConnected}</Text>
            </Box>
          </Flex>
        </Card>

        <Card>
          <Flex gap="3" align="center">
            <Box style={{ padding: '8px', backgroundColor: '#F5F3FF', borderRadius: '8px' }}>
              <Database color="#6D28D9" size={20} />
            </Box>
            <Box>
              <Text color="gray" size="2">Blockchain Verified</Text>
              <Text size="4" weight="bold">{stats.blockchainRegistered}</Text>
            </Box>
          </Flex>
        </Card>
      </Grid>

      <Flex justify="end" mb="4">
        <Dialog.Root>
          <Dialog.Trigger>
            <Button variant="solid" color="violet">
              <HardHat size={16} />
              <Text>Submit to Blockchain</Text>
            </Button>
          </Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Title>Hyperledger Besu Submission</Dialog.Title>
            <Dialog.Description>
              Submit material qualification data to the private blockchain
            </Dialog.Description>
            
            <Box my="4">
              <Text>You are about to submit {materialsData.length} material records:</Text>
              <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
                {materialsData.map(material => (
                  <li key={material.id}>
                    <Text>{material.name} (Batch: {material.batchNumber})</Text>
                  </li>
                ))}
              </ul>
            </Box>

            <Flex justify="end" gap="2" mt="4">
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
      </Flex>

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Material</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Type</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Batch</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Supplier</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Tech</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>EDA Status</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {filteredMaterials.map(material => (
            <Table.Row key={material.id}>
              <Table.Cell>
                <Text weight="medium">{material.name}</Text>
                <Text size="1" color="gray">
                  Expires: {new Date(material.expiryDate).toLocaleDateString()}
                </Text>
              </Table.Cell>
              <Table.Cell>
                <MaterialTypeIcon type={material.type} />
              </Table.Cell>
              <Table.Cell>{material.batchNumber}</Table.Cell>
              <Table.Cell>
                <SupplierStatus supplier={material.supplier} />
              </Table.Cell>
              <Table.Cell>
                <StatusBadge status={material.status} />
              </Table.Cell>
              <Table.Cell>
                <Flex align="center" gap="2">
                  <Tooltip content={material.iotConnected ? 'IoT Connected' : 'IoT Disconnected'}>
                    <Badge color={material.iotConnected ? 'green' : 'red'}>
                      <Cpu size={12} />
                    </Badge>
                  </Tooltip>
                  <Tooltip content={material.blockchainRegistered ? 'Blockchain Verified' : 'Not on Blockchain'}>
                    <Badge color={material.blockchainRegistered ? 'violet' : 'gray'}>
                      <Database size={12} />
                    </Badge>
                  </Tooltip>
                </Flex>
              </Table.Cell>
              <Table.Cell>
                <StatusBadge status={material.regulatory.status} />
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
          ))}
        </Table.Body>
      </Table.Root>

      {selectedMaterial && (
        <Dialog.Root open={true} onOpenChange={() => setSelectedMaterial(null)}>
          <Dialog.Content style={{ maxWidth: '800px' }}>
            <Dialog.Title>
              <Flex align="center" gap="2">
                {selectedMaterial.name} Details
                {selectedMaterial.blockchainRegistered && (
                  <Badge color="violet">
                    <Database size={12} /> Blockchain Verified
                  </Badge>
                )}
              </Flex>
            </Dialog.Title>
            
            <Grid columns="2" gap="4" mt="4">
              <Box>
                <Text weight="bold" color="gray">Basic Information</Text>
                <DetailItem label="Type" value={selectedMaterial.type} />
                <DetailItem label="Batch" value={selectedMaterial.batchNumber} />
                <DetailItem label="Supplier" value={
                  <SupplierStatus supplier={selectedMaterial.supplier} />
                } />
                <DetailItem label="Status" value={<StatusBadge status={selectedMaterial.status} />} />
                <DetailItem 
                  label="Expiry Date" 
                  value={new Date(selectedMaterial.expiryDate).toLocaleDateString()} 
                />
              </Box>

              <Box>
                <Text weight="bold" color="gray">Regulatory Information</Text>
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
                  value={selectedMaterial.regulatory.gmpInspection ? 'Passed' : 'Pending'} 
                />
                <DetailItem 
                  label="Blockchain Verification" 
                  value={
                    selectedMaterial.regulatory.blockchainTx ? 
                    <BlockchainLink txHash={selectedMaterial.regulatory.blockchainTx} /> : 
                    'Not submitted'
                  } 
                />
              </Box>
            </Grid>

            <Separator my="4" />

            <Text weight="bold" color="gray">Test Results</Text>
            <TestResultsTable tests={selectedMaterial.tests} />

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

// ========== HELPER COMPONENTS ==========
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
        <Table.ColumnHeaderCell>IoT Device</Table.ColumnHeaderCell>
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
          <Table.Cell>
            {test.iotDevice ? (
              <Badge color="blue">
                <Cpu size={12} /> {test.iotDevice}
              </Badge>
            ) : (
              <Text color="gray">N/A</Text>
            )}
          </Table.Cell>
          <Table.Cell>
            <BlockchainLink txHash={test.blockchainTx} />
          </Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  </Table.Root>
);
