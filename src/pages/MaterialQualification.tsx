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

// 1. Type Definitions with EDA, IoT and Blockchain
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
  status: 'Active' | 'Expired' | 'Pending';
  gmpInspection: boolean;
  lastInspectionDate?: string;
  blockchainTx?: string;
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

// 2. Sample Data with EDA, IoT and Blockchain
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
  {
    id: 'MAT-002',
    material: 'Vitamin B2',
    supplier: 'Supplier B',
    status: 'Pending',
    expiry: '2025-12-15',
    batch: 'B230502',
    tests: {
      Identity: {
        status: 'Pending',
        date: '2025-07-15',
        performedBy: 'Lab Tech 1',
        iotDevice: 'HPLC-024'
      },
      Purity: {
        status: 'Pending',
        date: '2025-07-15',
        performedBy: 'Lab Tech 2',
        iotDevice: 'HPLC-024'
      },
      Microbial: {
        status: 'Pending',
        date: '2025-07-16',
        performedBy: 'Microbiology Team',
        iotDevice: 'MIC-008'
      },
      Endotoxins: {
        status: 'Pending',
        date: '2025-07-16',
        performedBy: 'Microbiology Team',
        iotDevice: 'LAL-013'
      }
    },
    certificate: '',
    lastReviewed: '2025-06-20',
    edaRegistration: {
      registrationNumber: 'EDA-PEND-2024-54321',
      approvalDate: '2024-02-10',
      expiryDate: '2025-02-10',
      status: 'Pending',
      gmpInspection: false
    },
    iotConnected: true,
    blockchainRegistered: false
  },
  {
    id: 'MAT-003',
    material: 'Nicotinamide',
    supplier: 'Supplier A',
    status: 'Rejected',
    expiry: '2026-01-20',
    batch: 'B230503',
    tests: {
      Identity: {
        status: 'Passed',
        date: '2025-07-20',
        performedBy: 'Lab Tech 1',
        iotDevice: 'HPLC-023',
        blockchainTx: '0x2e5d9f3c1a8b7e4d6f2c1a3b9e156'
      },
      Purity: {
        status: 'Passed',
        date: '2025-07-20',
        performedBy: 'Lab Tech 2',
        iotDevice: 'HPLC-023',
        blockchainTx: '0x4f7e2d1c3a9b8e5d6f1c2a3b7e902'
      },
      Microbial: {
        status: 'Failed',
        date: '2025-07-21',
        performedBy: 'Microbiology Team',
        iotDevice: 'MIC-007',
        blockchainTx: '0x1a3c5e7d9f2b4a6c8d0e1f3a5c782'
      },
      Endotoxins: {
        status: 'Passed',
        date: '2025-07-21',
        performedBy: 'Microbiology Team',
        iotDevice: 'LAL-012',
        blockchainTx: '0x3b5d7f9e1a2c4d6e8f0a1b3d5e694'
      }
    },
    certificate: 'Cert-003',
    lastReviewed: '2025-07-25',
    edaRegistration: {
      registrationNumber: 'EDA-REG-2022-67890',
      approvalDate: '2022-11-05',
      expiryDate: '2025-11-05',
      status: 'Active',
      gmpInspection: true,
      lastInspectionDate: '2024-01-15',
      blockchainTx: '0x5d3f1a9e7c2b4d6e8f0a1c3e5d792'
    },
    iotConnected: true,
    blockchainRegistered: true
  }
];

// 3. Status Badge Component
const StatusBadge = ({ status }: { status: string }) => {
  const config = {
    Approved: { color: 'green' as const, icon: <Check size={14} /> },
    Pending: { color: 'yellow' as const, icon: <Clock size={14} /> },
    Rejected: { color: 'red' as const, icon: <AlertTriangle size={14} /> },
    Active: { color: 'green' as const, icon: <Check size={14} /> },
    Expired: { color: 'red' as const, icon: <AlertTriangle size={14} /> },
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

// 4. IoT Device Badge
const IoTDeviceBadge = ({ deviceId }: { deviceId?: string }) => {
  if (!deviceId) return null;

  return (
    <Tooltip content={`IoT Device: ${deviceId}`}>
      <Badge color="blue" variant="soft">
        <Flex align="center" gap="1">
          <Cpu size={12} />
          {deviceId}
        </Flex>
      </Badge>
    </Tooltip>
  );
};

// 5. Blockchain Link
const BlockchainLink = ({ txHash }: { txHash?: string }) => {
  if (!txHash) return null;

  return (
    <Tooltip content={`View on blockchain explorer`}>
      <Button variant="ghost" size="1" asChild>
        <a 
          href={`https://etherscan.io/tx/${txHash}`} 
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none' }}
        >
          <Flex align="center" gap="1">
            <Link size={12} />
            Blockchain
          </Flex>
        </a>
      </Button>
    </Tooltip>
  );
};

// 6. Test Results Table with IoT and Blockchain
const TestResultsTable = ({ tests }: { tests: Material['tests'] }) => (
  <Table.Root mt="2">
    <Table.Header>
      <Table.Row>
        <Table.ColumnHeaderCell>Test</Table.ColumnHeaderCell>
        <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
        <Table.ColumnHeaderCell>Performed By</Table.ColumnHeaderCell>
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
          <Table.Cell>
            <IoTDeviceBadge deviceId={test.iotDevice} />
          </Table.Cell>
          <Table.Cell>
            <BlockchainLink txHash={test.blockchainTx} />
          </Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  </Table.Root>
);

// 7. EDA Registration Component
const EDARegistrationDetails = ({ registration }: { registration: EDARegistration }) => (
  <Card variant="surface">
    <Flex direction="column" gap="2">
      <Flex justify="between">
        <Text weight="bold">EDA Registration</Text>
        <StatusBadge status={registration.status} />
      </Flex>
      
      <DetailItem label="Registration Number" value={registration.registrationNumber} />
      <DetailItem label="Approval Date" value={new Date(registration.approvalDate).toLocaleDateString()} />
      <DetailItem label="Expiry Date" value={new Date(registration.expiryDate).toLocaleDateString()} />
      <DetailItem label="GMP Inspection" value={registration.gmpInspection ? 'Yes' : 'No'} />
      
      {registration.lastInspectionDate && (
        <DetailItem 
          label="Last Inspection" 
          value={new Date(registration.lastInspectionDate).toLocaleDateString()} 
        />
      )}
      
      {registration.blockchainTx && (
        <DetailItem 
          label="Blockchain Verification" 
          value={<BlockchainLink txHash={registration.blockchainTx} />} 
        />
      )}
    </Flex>
  </Card>
);

// 8. Material Detail Dialog with IoT and Blockchain
const MaterialDetailDialog = ({ 
  material,
  onClose
}: {
  material: Material;
  onClose: () => void;
}) => {
  return (
    <Dialog.Root open={true} onOpenChange={onClose}>
      <Dialog.Content style={{ maxWidth: '800px' }}>
        <Dialog.Title>
          <Flex align="center" gap="2">
            {material.material} Details
            {material.blockchainRegistered && (
              <Badge color="violet">
                <Database size={12} /> Blockchain Registered
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
              label="Expiry Date" 
              value={new Date(material.expiry).toLocaleDateString()} 
            />
            <DetailItem 
              label="IoT Connection" 
              value={
                <Badge color={material.iotConnected ? 'green' : 'red'}>
                  {material.iotConnected ? 'Connected' : 'Disconnected'}
                </Badge>
              } 
            />
          </Box>

          <Box>
            <EDARegistrationDetails registration={material.edaRegistration} />
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

// 9. Main Dashboard Component with IoT and Blockchain features
export default function MaterialsQualificationDashboard() {
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all');
  const [showBlockchainDialog, setShowBlockchainDialog] = useState(false);

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
        <Card>
          <Flex gap="3" align="center">
            <Box p="2" style={{ backgroundColor: '#ecfdf5', borderRadius: '6px' }}>
              <Check color="#10b981" size={20} />
            </Box>
            <Box>
              <Text size="2" color="gray">Approved Materials</Text>
              <Text size="4" weight="bold">{stats.approved}</Text>
            </Box>
          </Flex>
        </Card>

        <Card>
          <Flex gap="3" align="center">
            <Box p="2" style={{ backgroundColor: '#fef3c7', borderRadius: '6px' }}>
              <Clock color="#f59e0b" size={20} />
            </Box>
            <Box>
              <Text size="2" color="gray">Pending Review</Text>
              <Text size="4" weight="bold">{stats.pending}</Text>
            </Box>
          </Flex>
        </Card>

        <Card>
          <Flex gap="3" align="center">
            <Box p="2" style={{ backgroundColor: '#eff6ff', borderRadius: '6px' }}>
              <Cpu color="#3b82f6" size={20} />
            </Box>
            <Box>
              <Text size="2" color="gray">IoT Connected</Text>
              <Text size="4" weight="bold">{stats.iotConnected}</Text>
            </Box>
          </Flex>
        </Card>

        <Card>
          <Flex gap="3" align="center">
            <Box p="2" style={{ backgroundColor: '#f5f3ff', borderRadius: '6px' }}>
              <Database color="#6d28d9" size={20} />
            </Box>
            <Box>
              <Text size="2" color="gray">Blockchain Registered</Text>
              <Text size="4" weight="bold">{stats.blockchainRegistered}</Text>
            </Box>
          </Flex>
        </Card>
      </Grid>

      <Flex justify="end" mb="4">
        <Button 
          variant="solid" 
          color="violet"
          onClick={() => setShowBlockchainDialog(true)}
        >
          <HardHat size={16} />
          <Text>Submit to Blockchain</Text>
        </Button>
      </Flex>

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Material</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Batch</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Supplier</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>IoT</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Blockchain</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {filteredMaterials.map(material => (
            <Table.Row key={material.id}>
              <Table.Cell>
                <Text weight="medium">{material.material}</Text>
                <Text size="1" color="gray">Expires: {new Date(material.expiry).toLocaleDateString()}</Text>
              </Table.Cell>
              <Table.Cell>{material.batch}</Table.Cell>
              <Table.Cell>{material.supplier}</Table.Cell>
              <Table.Cell><StatusBadge status={material.status} /></Table.Cell>
              <Table.Cell>
                <Badge color={material.iotConnected ? 'green' : 'red'}>
                  {material.iotConnected ? 'Connected' : 'Offline'}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <Badge color={material.blockchainRegistered ? 'violet' : 'gray'}>
                  {material.blockchainRegistered ? 'Registered' : 'Pending'}
                </Badge>
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
        <MaterialDetailDialog 
          material={selectedMaterial} 
          onClose={() => setSelectedMaterial(null)} 
        />
      )}

      {/* Blockchain Submission Dialog */}
      <Dialog.Root open={showBlockchainDialog} onOpenChange={setShowBlockchainDialog}>
        <Dialog.Content>
          <Dialog.Title>Blockchain Submission</Dialog.Title>
          <Dialog.Description>
            Submit material qualification data to the blockchain
          </Dialog.Description>
          
          <Box my="4">
            <Text>You are submitting {materialsData.length} material records to the blockchain:</Text>
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

// Helper component
const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <Flex justify="between" py="2" style={{ borderBottom: '1px solid #eee' }}>
    <Text color="gray">{label}</Text>
    {typeof value === 'string' ? <Text>{value}</Text> : value}
  </Flex>
);
