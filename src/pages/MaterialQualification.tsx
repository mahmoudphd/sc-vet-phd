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
  Separator
} from '@radix-ui/themes';
import {
  Check,
  Clock,
  XCircle,
  ChevronRight,
  FileText,
  Shield,
  Database,
  HelpCircle,
  Eye,
  HardHat,
  Cpu,
  Link
} from 'lucide-react';

// Type Definitions
type TestStatus = 'Passed' | 'Pending' | 'Failed';

interface TestResult {
  status: TestStatus;
  date: string;
  performedBy: string;
  iotDevice?: string;
  blockchainTx?: string;
}

interface MaterialTests {
  Identity: TestResult;
  Purity: TestResult;
  Microbial: TestResult;
  Endotoxins: TestResult;
}

interface QualityReview {
  id: string;
  date: string;
  reviewer: string;
  comments: string;
  status: 'Approved' | 'Rejected' | 'Pending';
  blockchainTx?: string;
}

interface Material {
  id: string;
  name: string;
  supplier: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  expiryDate: string;
  batchNumber: string;
  tests: MaterialTests;
  certificate?: string;
  lastReviewed: string;
  reviews: QualityReview[];
}

// Sample Data with IoT and Blockchain data
const materialsData: Material[] = [
  {
    id: 'MAT-001',
    name: 'Vitamin B1',
    supplier: 'Supplier A',
    status: 'Approved',
    expiryDate: '2025-08-10',
    batchNumber: 'B230501',
    tests: {
      Identity: {
        status: 'Passed',
        date: '2025-07-10',
        performedBy: 'Lab Tech 1',
        iotDevice: 'IoT-HPLC-023',
        blockchainTx: '0x3a4f8c2d1e7b5a9f6c0d3e2b1a4c892'
      },
      Purity: {
        status: 'Passed',
        date: '2025-07-10',
        performedBy: 'Lab Tech 2',
        iotDevice: 'IoT-HPLC-023',
        blockchainTx: '0x5b2e9f8d7c3a1e6d4f7c2b1a0d741'
      },
      Microbial: {
        status: 'Passed',
        date: '2025-07-11',
        performedBy: 'Microbiology Team',
        iotDevice: 'IoT-MIC-007',
        blockchainTx: '0x1f8a3d7e5c2b9a6f4e1d7c3a2e356'
      },
      Endotoxins: {
        status: 'Passed',
        date: '2025-07-11',
        performedBy: 'Microbiology Team',
        iotDevice: 'IoT-LAL-012',
        blockchainTx: '0x7c3d9e2f1a8b5c4d6e7f8a9b0f902'
      }
    },
    certificate: 'CERT-001',
    lastReviewed: '2025-07-15',
    reviews: [
      {
        id: 'REV-001',
        date: '2025-07-12',
        reviewer: 'Dr. Smith',
        comments: 'All specifications met',
        status: 'Approved',
        blockchainTx: '0x9e2f5d3c1a7b8e4f6d2c3a1b5e451'
      }
    ]
  },
  {
    id: 'MAT-002',
    name: 'Vitamin B2',
    supplier: 'Supplier B',
    status: 'Pending',
    expiryDate: '2025-12-15',
    batchNumber: 'B230502',
    tests: {
      Identity: {
        status: 'Pending',
        date: '2025-07-15',
        performedBy: 'Lab Tech 1',
        iotDevice: 'IoT-HPLC-024'
      },
      Purity: {
        status: 'Pending',
        date: '2025-07-15',
        performedBy: 'Lab Tech 2',
        iotDevice: 'IoT-HPLC-024'
      },
      Microbial: {
        status: 'Pending',
        date: '2025-07-16',
        performedBy: 'Microbiology Team',
        iotDevice: 'IoT-MIC-008'
      },
      Endotoxins: {
        status: 'Pending',
        date: '2025-07-16',
        performedBy: 'Microbiology Team',
        iotDevice: 'IoT-LAL-013'
      }
    },
    lastReviewed: '2025-07-10',
    reviews: []
  },
  {
    id: 'MAT-003',
    name: 'Nicotinamide',
    supplier: 'Supplier A',
    status: 'Rejected',
    expiryDate: '2026-01-20',
    batchNumber: 'B230503',
    tests: {
      Identity: {
        status: 'Passed',
        date: '2025-07-20',
        performedBy: 'Lab Tech 1',
        iotDevice: 'IoT-HPLC-023',
        blockchainTx: '0x2e5d9f3c1a8b7e4d6f2c1a3b9e156'
      },
      Purity: {
        status: 'Passed',
        date: '2025-07-20',
        performedBy: 'Lab Tech 2',
        iotDevice: 'IoT-HPLC-023',
        blockchainTx: '0x4f7e2d1c3a9b8e5d6f1c2a3b7e902'
      },
      Microbial: {
        status: 'Failed',
        date: '2025-07-21',
        performedBy: 'Microbiology Team',
        iotDevice: 'IoT-MIC-007',
        blockchainTx: '0x1a3c5e7d9f2b4a6c8d0e1f3a5c782'
      },
      Endotoxins: {
        status: 'Passed',
        date: '2025-07-21',
        performedBy: 'Microbiology Team',
        iotDevice: 'IoT-LAL-012',
        blockchainTx: '0x3b5d7f9e1a2c4d6e8f0a1b3d5e694'
      }
    },
    certificate: 'CERT-003',
    lastReviewed: '2025-07-25',
    reviews: [
      {
        id: 'REV-002',
        date: '2025-07-22',
        reviewer: 'Quality Team',
        comments: 'Microbial contamination detected',
        status: 'Rejected',
        blockchainTx: '0x5d3f1a9e7c2b4d6e8f0a1c3e5d792'
      }
    ]
  }
];

// Status Display Component
const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    Approved: { color: 'green', icon: <Check size={14} /> },
    Pending: { color: 'yellow', icon: <Clock size={14} /> },
    Rejected: { color: 'red', icon: <XCircle size={14} /> },
    Passed: { color: 'green', icon: <Check size={14} /> },
    Failed: { color: 'red', icon: <XCircle size={14} /> }
  };

  const config = statusConfig[status as keyof typeof statusConfig] || 
                { color: 'gray', icon: <HelpCircle size={14} /> };

  return (
    <Badge color={config.color} highContrast>
      <Flex align="center" gap="1">
        {config.icon}
        {status}
      </Flex>
    </Badge>
  );
};

// Test Results Summary Component
const TestSummary = ({ tests }: { tests: MaterialTests }) => {
  const passedCount = Object.values(tests).filter(t => t.status === 'Passed').length;
  const totalTests = Object.keys(tests).length;

  return (
    <Tooltip content={`${passedCount}/${totalTests} tests passed`}>
      <Flex align="center" gap="2">
        <Progress 
          value={(passedCount / totalTests) * 100}
          color={passedCount === totalTests ? 'green' : passedCount > 0 ? 'yellow' : 'red'}
          style={{ width: '60px' }}
        />
        <Text size="2">{passedCount}/{totalTests}</Text>
      </Flex>
    </Tooltip>
  );
};

// IoT Device Badge Component
const IoTDeviceBadge = ({ deviceId }: { deviceId?: string }) => {
  if (!deviceId) return null;

  return (
    <Tooltip content={`IoT Device: ${deviceId}`}>
      <Badge color="blue" variant="soft">
        <Flex align="center" gap="1">
          <Cpu size={12} />
          IoT Connected
        </Flex>
      </Badge>
    </Tooltip>
  );
};

// Blockchain Transaction Link
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

// Test Results Table with IoT and Blockchain
const TestResultsTable = ({ tests }: { tests: MaterialTests }) => (
  <Table.Root mt="2">
    <Table.Header>
      <Table.Row>
        <Table.ColumnHeaderCell>Test</Table.ColumnHeaderCell>
        <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
        <Table.ColumnHeaderCell>Performed By</Table.ColumnHeaderCell>
        <Table.ColumnHeaderCell>IoT</Table.ColumnHeaderCell>
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

// Blockchain Submission Component
const BlockchainSubmitDialog = ({ materials }: { materials: Material[] }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate blockchain submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    }, 2000);
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button variant="solid" color="violet">
          <HardHat size={16} />
          <Text>Submit to Blockchain</Text>
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Blockchain Submission</Dialog.Title>
        
        <Box my="4">
          <Text>You are submitting {materials.length} material records to the blockchain:</Text>
          <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
            {materials.map(material => (
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
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || isSuccess}
            color={isSuccess ? 'green' : 'violet'}
          >
            {isSubmitting ? 'Submitting...' : isSuccess ? 'Submitted!' : 'Confirm Submission'}
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

// Material Detail Dialog Component
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
            {material.name} Details
            {material.reviews.some(r => r.blockchainTx) && (
              <Badge color="violet">
                <HardHat size={12} /> Blockchain Verified
              </Badge>
            )}
          </Flex>
        </Dialog.Title>
        
        <Grid columns="2" gap="4" mt="4">
          <Box>
            <Text weight="bold" color="gray">Basic Information</Text>
            <Flex direction="column" gap="2" mt="2">
              <Text><strong>Batch:</strong> {material.batchNumber}</Text>
              <Text><strong>Supplier:</strong> {material.supplier}</Text>
              <Text><strong>Status:</strong> <StatusBadge status={material.status} /></Text>
              <Text><strong>Expiry:</strong> {new Date(material.expiryDate).toLocaleDateString()}</Text>
            </Flex>
          </Box>

          <Box>
            <Text weight="bold" color="gray">Certification</Text>
            <Flex direction="column" gap="2" mt="2">
              <Text><strong>Certificate:</strong> {material.certificate || 'Not Available'}</Text>
              <Text><strong>Last Reviewed:</strong> {new Date(material.lastReviewed).toLocaleDateString()}</Text>
            </Flex>
          </Box>
        </Grid>

        <Separator my="4" />

        <Text weight="bold" color="gray">Test Results</Text>
        <TestResultsTable tests={material.tests} />

        {material.reviews.length > 0 && (
          <>
            <Separator my="4" />
            <Text weight="bold" color="gray">Quality Reviews</Text>
            <Flex direction="column" gap="2" mt="2">
              {material.reviews.map(review => (
                <Card key={review.id} variant="surface">
                  <Flex justify="between">
                    <Flex align="center" gap="2">
                      <Text><strong>{review.reviewer}</strong></Text>
                      {review.blockchainTx && (
                        <BlockchainLink txHash={review.blockchainTx} />
                      )}
                    </Flex>
                    <StatusBadge status={review.status} />
                  </Flex>
                  <Text size="2" color="gray">{new Date(review.date).toLocaleDateString()}</Text>
                  <Text mt="2">{review.comments}</Text>
                </Card>
              ))}
            </Flex>
          </>
        )}

        <Flex justify="end" mt="4">
          <Button variant="soft" onClick={onClose}>
            Close
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

// Main Dashboard Component
const MaterialsQualificationDashboard = () => {
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
    iotConnected: materialsData.filter(m => 
      Object.values(m.tests).some(t => t.iotDevice)
    ).length,
    blockchainVerified: materialsData.filter(m => 
      [...Object.values(m.tests), ...m.reviews].some(item => item.blockchainTx)
    ).length
  };

  return (
    <Box p="4" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Flex justify="between" align="center" mb="4">
        <Text size="6" weight="bold">Materials Qualification Dashboard</Text>
        <Select.Root value={filter} onValueChange={(value: 'all' | 'approved' | 'pending') => setFilter(value)}>
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
              <HardHat color="#6d28d9" size={20} />
            </Box>
            <Box>
              <Text size="2" color="gray">Blockchain Verified</Text>
              <Text size="4" weight="bold">{stats.blockchainVerified}</Text>
            </Box>
          </Flex>
        </Card>
      </Grid>

      <Flex justify="end" mb="4">
        <BlockchainSubmitDialog materials={materialsData} />
      </Flex>

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Material</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Batch</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Supplier</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Test Results</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {filteredMaterials.map(material => (
            <Table.Row key={material.id}>
              <Table.Cell>
                <Text weight="medium">{material.name}</Text>
                <Text size="1" color="gray">Expires: {new Date(material.expiryDate).toLocaleDateString()}</Text>
              </Table.Cell>
              <Table.Cell>{material.batchNumber}</Table.Cell>
              <Table.Cell>{material.supplier}</Table.Cell>
              <Table.Cell><StatusBadge status={material.status} /></Table.Cell>
              <Table.Cell>
                <TestSummary tests={material.tests} />
              </Table.Cell>
              <Table.Cell>
                <Button 
                  size="1" 
                  variant="soft"
                  onClick={() => setSelectedMaterial(material)}
                >
                  <Eye size={14} /> View
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Row>

      {selectedMaterial && (
        <MaterialDetailDialog 
          material={selectedMaterial} 
          onClose={() => setSelectedMaterial(null)} 
        />
      )}
    </Box>
  );
};

export default MaterialsQualificationDashboard;
