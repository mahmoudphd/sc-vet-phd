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
  ChevronRight,
  FileText,
  ShieldCheck,
  HardHat,
  HelpCircle,
  BarChart2,
  Gauge,
  CalendarCheck,
  Cpu,
  Link,
  Database
} from 'lucide-react';

// 1. Enhanced Type Definitions with IoT and Blockchain
interface TestResult {
  status: 'Passed' | 'Pending' | 'Failed';
  date: string;
  performedBy: string;
  iotDevice?: string; // IoT device ID
  blockchainTx?: string; // Blockchain transaction hash
}

interface EDARegistration {
  registrationNumber: string;
  approvalDate: string;
  expiryDate: string;
  status: 'Active' | 'Expired' | 'Pending';
  gmpInspection: boolean;
  lastInspectionDate?: string;
  blockchainTx?: string; // Blockchain transaction for registration
}

interface Material {
  id: string;
  material: string;
  supplier: string;
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
  lastReviewed: string;
  edaRegistration: EDARegistration;
  iotConnected: boolean;
  blockchainRegistered: boolean;
}

// 2. Sample Data with IoT and Blockchain integration
const materialsData: Material[] = [
  {
    id: 'MAT-001',
    material: 'Vitamin B1',
    supplier: 'Supplier A',
    status: 'Approved',
    expiry: '2025-08-10',
    batch: 'B230501',
    tests: {
      Identity: {
        status: 'Passed',
        date: '2025-07-10',
        performedBy: 'Lab Tech 1',
        iotDevice: 'HPLC-023',
        blockchainTx: '0x3a4f8c2d1e7b5a9f6c0d3e2b1a4c892'
      },
      Purity: {
        status: 'Passed',
        date: '2025-07-10',
        performedBy: 'Lab Tech 2',
        iotDevice: 'HPLC-023',
        blockchainTx: '0x5b2e9f8d7c3a1e6d4f7c2b1a0d741'
      },
      Microbial: {
        status: 'Passed',
        date: '2025-07-11',
        performedBy: 'Microbiology Team',
        iotDevice: 'MIC-007',
        blockchainTx: '0x1f8a3d7e5c2b9a6f4e1d7c3a2e356'
      },
      Endotoxins: {
        status: 'Passed',
        date: '2025-07-11',
        performedBy: 'Microbiology Team',
        iotDevice: 'LAL-012',
        blockchainTx: '0x7c3d9e2f1a8b5c4d6e7f8a9b0f902'
      }
    },
    certificate: 'Cert-001',
    lastReviewed: '2025-07-15',
    edaRegistration: {
      registrationNumber: 'EDA-REG-2023-12345',
      approvalDate: '2023-01-15',
      expiryDate: '2026-01-15',
      status: 'Active',
      gmpInspection: true,
      lastInspectionDate: '2024-03-20',
      blockchainTx: '0x9e2f5d3c1a7b8e4f6d2c3a1b5e451'
    },
    iotConnected: true,
    blockchainRegistered: true
  },
  // ... other materials
];

// 3. IoT Device Status Component
const IoTStatusBadge = ({ connected }: { connected: boolean }) => (
  <Badge color={connected ? 'green' : 'red'}>
    <Flex align="center" gap="1">
      <Cpu size={12} />
      {connected ? 'Connected' : 'Disconnected'}
    </Flex>
  </Badge>
);

// 4. Blockchain Verification Component
const BlockchainVerification = ({ verified }: { verified: boolean }) => (
  <Badge color={verified ? 'violet' : 'gray'}>
    <Flex align="center" gap="1">
      <Database size={12} />
      {verified ? 'Verified' : 'Pending'}
    </Flex>
  </Badge>
);

// 5. Blockchain Transaction Link Component
const BlockchainLink = ({ txHash }: { txHash?: string }) => {
  if (!txHash) return null;

  return (
    <Tooltip content="View on blockchain explorer">
      <Button variant="ghost" size="1" asChild>
        <a 
          href={`https://etherscan.io/tx/${txHash}`} 
          target="_blank"
          rel="noopener noreferrer"
        >
          <Flex align="center" gap="1">
            <Link size={12} />
            Transaction
          </Flex>
        </a>
      </Button>
    </Tooltip>
  );
};

// 6. Enhanced Test Results Table with IoT and Blockchain
const TestResultsTable = ({ tests }: { tests: Material['tests'] }) => (
  <Table.Root mt="2">
    <Table.Header>
      <Table.Row>
        <Table.ColumnHeaderCell>Test</Table.ColumnHeaderCell>
        <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
        <Table.ColumnHeaderCell>IoT Device</Table.ColumnHeaderCell>
        <Table.ColumnHeaderCell>Blockchain</Table.ColumnHeaderCell>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {Object.entries(tests).map(([testName, test]) => (
        <Table.Row key={testName}>
          <Table.Cell>{testName}</Table.Cell>
          <Table.Cell>
            <StatusBadge status={test.status} />
          </Table.Cell>
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

// 7. Blockchain Submission Dialog
const BlockchainSubmissionDialog = () => {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = () => {
    setSubmitting(true);
    // Simulate blockchain submission
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 2000);
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button variant="solid" color="violet">
          <HardHat size={16} />
          Submit to Blockchain
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Blockchain Submission</Dialog.Title>
        <Dialog.Description>
          Submit material qualification data to the Ethereum blockchain
        </Dialog.Description>

        <Box my="4">
          <Text>You are about to submit {materialsData.length} material records:</Text>
          <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
            {materialsData.map(material => (
              <li key={material.id}>
                <Text>{material.material} (Batch: {material.batch})</Text>
              </li>
            ))}
          </ul>
        </Box>

        <Flex justify="end" gap="2" mt="4">
          <Dialog.Close>
            <Button variant="soft">Cancel</Button>
          </Dialog.Close>
          <Button 
            onClick={handleSubmit}
            disabled={submitting || success}
            color={success ? 'green' : 'violet'}
          >
            {submitting ? 'Submitting...' : success ? 'Submitted!' : 'Confirm'}
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

// 8. Enhanced Material Detail Dialog with IoT/Blockchain
const MaterialDetailDialog = ({ material, onClose }: { material: Material; onClose: () => void }) => {
  return (
    <Dialog.Root open={true} onOpenChange={onClose}>
      <Dialog.Content style={{ maxWidth: '800px' }}>
        <Dialog.Title>
          <Flex align="center" gap="2">
            {material.material} Details
            {material.blockchainRegistered && (
              <Badge color="violet">
                <Database size={12} /> Blockchain Verified
              </Badge>
            )}
          </Flex>
        </Dialog.Title>

        <Grid columns="2" gap="4" mt="4">
          <Box>
            <Text weight="bold" color="gray">Basic Information</Text>
            <DetailItem label="Batch" value={material.batch} />
            <DetailItem label="Supplier" value={material.supplier} />
            <DetailItem label="Status" value={<StatusBadge status={material.status} />} />
            <DetailItem 
              label="IoT Status" 
              value={<IoTStatusBadge connected={material.iotConnected} />} 
            />
          </Box>

          <Box>
            <Text weight="bold" color="gray">Regulatory Information</Text>
            <DetailItem 
              label="EDA Registration" 
              value={material.edaRegistration.registrationNumber} 
            />
            <DetailItem 
              label="Blockchain Verification" 
              value={
                material.edaRegistration.blockchainTx ? 
                <BlockchainLink txHash={material.edaRegistration.blockchainTx} /> : 
                'Not submitted'
              } 
            />
          </Box>
        </Grid>

        <Separator my="4" />

        <Text weight="bold" color="gray">Test Results</Text>
        <TestResultsTable tests={material.tests} />

        <Flex justify="end" mt="4">
          <Button variant="soft" onClick={onClose}>
            Close
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

// 9. Enhanced Main Dashboard Component
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
        <Text size="6" weight="bold">EDA Materials Qualification</Text>
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
        {/* ... existing stat cards ... */}
        <Card>
          <Flex gap="3" align="center">
            <Box p="2" style={{ background: '#EFF6FF', borderRadius: '8px' }}>
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
            <Box p="2" style={{ background: '#F5F3FF', borderRadius: '8px' }}>
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
        <BlockchainSubmissionDialog />
      </Flex>

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Material</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Batch</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>IoT</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Blockchain</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {filteredMaterials.map(material => (
            <Table.Row key={material.id}>
              <Table.Cell onClick={() => setSelectedMaterial(material)}>
                <Text weight="medium">{material.material}</Text>
              </Table.Cell>
              <Table.Cell>{material.batch}</Table.Cell>
              <Table.Cell><StatusBadge status={material.status} /></Table.Cell>
              <Table.Cell>
                <IoTStatusBadge connected={material.iotConnected} />
              </Table.Cell>
              <Table.Cell>
                <BlockchainVerification verified={material.blockchainRegistered} />
              </Table.Cell>
              <Table.Cell>
                <Button 
                  size="1" 
                  variant="soft"
                  onClick={() => setSelectedMaterial(material)}
                >
                  Details
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      {selectedMaterial && (
        <MaterialDetailDialog 
          material={selectedMaterial} 
          onClose={() => setSelectedMaterial(null)} 
        />
      )}
    </Box>
  );
}

// Helper component
const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <Flex justify="between" py="2" style={{ borderBottom: '1px solid #eee' }}>
    <Text color="gray">{label}</Text>
    {typeof value === 'string' ? <Text>{value}</Text> : value}
  </Flex>
);
