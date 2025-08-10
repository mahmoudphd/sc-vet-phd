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
  CalendarCheck
} from 'lucide-react';

// 1. Type Definitions
interface TestResults {
  Identity: 'Passed' | 'Pending' | 'Failed';
  Purity: 'Passed' | 'Pending' | 'Failed';
  Microbial: 'Passed' | 'Pending' | 'Failed';
  Endotoxins: 'Passed' | 'Pending' | 'Failed';
}

interface RegulatoryInfo {
  edaApproved: boolean;
  edaRegistrationNumber?: string;
  gmpCertified: boolean;
}

interface Material {
  id: string;
  material: string;
  supplier: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  expiry: string;
  batch: string;
  tests: TestResults;
  certificate?: string;
  lastReviewed: string;
  regulatory: RegulatoryInfo;
}

// 2. Sample Data
const materialsData: Material[] = [
  {
    id: 'MAT-001',
    material: 'Vitamin B1',
    supplier: 'Supplier A',
    status: 'Approved',
    expiry: '2025-08-10',
    batch: 'B230501',
    tests: {
      Identity: 'Passed',
      Purity: 'Passed',
      Microbial: 'Passed',
      Endotoxins: 'Passed',
    },
    certificate: 'Cert-001',
    lastReviewed: '2025-07-15',
    regulatory: {
      edaApproved: true,
      edaRegistrationNumber: 'EDA-REG-2023-12345',
      gmpCertified: true
    }
  },
  {
    id: 'MAT-002',
    material: 'Vitamin B2',
    supplier: 'Supplier B',
    status: 'Pending',
    expiry: '2025-12-15',
    batch: 'B230502',
    tests: {
      Identity: 'Pending',
      Purity: 'Pending',
      Microbial: 'Pending',
      Endotoxins: 'Pending',
    },
    certificate: '',
    lastReviewed: '2025-06-20',
    regulatory: {
      edaApproved: false,
      gmpCertified: false
    }
  },
  {
    id: 'MAT-003',
    material: 'Nicotinamide',
    supplier: 'Supplier A',
    status: 'Approved',
    expiry: '2026-01-20',
    batch: 'B230503',
    tests: {
      Identity: 'Passed',
      Purity: 'Passed',
      Microbial: 'Failed',
      Endotoxins: 'Passed',
    },
    certificate: 'Cert-003',
    lastReviewed: '2025-07-01',
    regulatory: {
      edaApproved: true,
      edaRegistrationNumber: 'EDA-REG-2023-67890',
      gmpCertified: true
    }
  }
];

// 3. Status Badge Component
const StatusBadge = ({ status }: { status: Material['status'] }) => {
  const config = {
    Approved: { color: 'green' as const, icon: <Check size={14} /> },
    Pending: { color: 'yellow' as const, icon: <Clock size={14} /> },
    Rejected: { color: 'red' as const, icon: <AlertTriangle size={14} /> }
  };

  return (
    <Badge color={config[status].color} highContrast>
      <Flex align="center" gap="1">
        {config[status].icon}
        {status}
      </Flex>
    </Badge>
  );
};

// 4. Compliance Calculation
const calculateCompliance = (material: Material): number => {
  const weights = {
    tests: 40,
    certificate: 30,
    supplier: 20,
    expiry: 10
  };

  let score = 0;

  // Test Results (40%)
  const passedTests = Object.values(material.tests)
    .filter(t => t === 'Passed').length;
  score += (passedTests / Object.keys(material.tests).length) * weights.tests;

  // Certificate (30%)
  score += material.certificate ? weights.certificate : 0;

  // Supplier (20%)
  score += material.supplier === 'Supplier A' ? weights.supplier : weights.supplier * 0.5;

  // Expiry (10%)
  const expiryDate = new Date(material.expiry);
  const today = new Date();
  score += expiryDate > today ? weights.expiry : 0;

  return Math.min(100, Math.round(score));
};

// 5. Test Results Indicator
const TestResultsIndicator = ({ tests }: { tests: TestResults }) => {
  const passedCount = Object.values(tests).filter(t => t === 'Passed').length;
  const totalTests = Object.keys(tests).length;

  return (
    <Tooltip content={`${passedCount}/${totalTests} tests passed`}>
      <Flex align="center" gap="2">
        <Progress 
          value={(passedCount / totalTests) * 100} 
          color={passedCount === totalTests ? 'green' : 'yellow'}
          style={{ width: '60px' }}
        />
        <Text size="2">{passedCount}/{totalTests}</Text>
      </Flex>
    </Tooltip>
  );
};

// 6. Compliance Progress
const ComplianceProgress = ({ value }: { value: number }) => {
  return (
    <Tooltip content={`Compliance Score: ${value}%`}>
      <Flex direction="column" gap="1">
        <Progress 
          value={value}
          color={
            value >= 90 ? 'green' :
            value >= 70 ? 'yellow' : 'red'
          }
        />
        <Text size="1" align="right">{value}%</Text>
      </Flex>
    </Tooltip>
  );
};

// 7. EDA Registration Badge
const EDARegistrationBadge = ({ regulatory }: { regulatory: RegulatoryInfo }) => {
  return (
    <Tooltip content={
      regulatory.edaApproved ? 
      `EDA Registered: ${regulatory.edaRegistrationNumber}` :
      "Not registered with EDA"
    }>
      <Badge color={regulatory.edaApproved ? 'blue' : 'gray'}>
        <Flex align="center" gap="1">
          {regulatory.edaApproved ? <ShieldCheck size={14} /> : <HelpCircle size={14} />}
          {regulatory.edaApproved ? 'EDA Approved' : 'Not Registered'}
        </Flex>
      </Badge>
    </Tooltip>
  );
};

// 8. Expiry Date Cell
const ExpiryDateCell = ({ date }: { date: string }) => {
  const today = new Date();
  const expiryDate = new Date(date);
  const diffTime = expiryDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let status: 'normal' | 'warning' | 'expired' = 'normal';
  if (diffDays < 0) status = 'expired';
  else if (diffDays <= 30) status = 'warning';

  return (
    <Flex align="center" gap="2">
      <Text
        color={
          status === 'expired' ? 'red' :
          status === 'warning' ? 'yellow' : undefined
        }
      >
        {new Date(date).toLocaleDateString()}
      </Text>
      {status !== 'normal' && (
        <Tooltip content={status === 'expired' ? 'Expired' : `Expires in ${diffDays} days`}>
          <AlertTriangle 
            size={14} 
            color={status === 'expired' ? 'var(--red-9)' : 'var(--yellow-9)'} 
          />
        </Tooltip>
      )}
    </Flex>
  );
};

// 9. Test Result Badge
const TestResultBadge = ({ result }: { result: 'Passed' | 'Pending' | 'Failed' }) => {
  const config = {
    Passed: { color: 'green' as const, icon: <Check size={12} /> },
    Pending: { color: 'yellow' as const, icon: <Clock size={12} /> },
    Failed: { color: 'red' as const, icon: <AlertTriangle size={12} /> }
  };
  
  return (
    <Badge color={config[result].color}>
      <Flex align="center" gap="1">
        {config[result].icon}
        {result}
      </Flex>
    </Badge>
  );
};

// 10. Detail Item Component
const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <Flex justify="between" py="2" style={{ borderBottom: '1px solid #eee' }}>
    <Text color="gray">{label}</Text>
    {typeof value === 'string' ? <Text>{value}</Text> : value}
  </Flex>
);

// 11. Test Results Table
const TestResultsTable = ({ tests }: { tests: TestResults }) => (
  <Table.Root mt="2">
    <Table.Body>
      {Object.entries(tests).map(([test, result]) => (
        <Table.Row key={test}>
          <Table.Cell>{test}</Table.Cell>
          <Table.Cell>
            <TestResultBadge result={result} />
          </Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  </Table.Root>
);

// 12. Material Detail Dialog
const MaterialDetailDialog = ({ 
  material,
  onClose
}: {
  material: Material;
  onClose: () => void;
}) => {
  return (
    <Dialog.Root open={true} onOpenChange={onClose}>
      <Dialog.Content maxWidth="600px">
        <Dialog.Title>{material.material} Details</Dialog.Title>
        
        <Grid columns="2" gap="4" mt="4">
          <Box>
            <Text weight="bold" color="gray">Basic Information</Text>
            <DetailItem label="Batch" value={material.batch} />
            <DetailItem label="Supplier" value={material.supplier} />
            <DetailItem label="Status" value={<StatusBadge status={material.status} />} />
            <DetailItem 
              label="Last Reviewed" 
              value={new Date(material.lastReviewed).toLocaleDateString()} 
            />
          </Box>

          <Box>
            <Text weight="bold" color="gray">Regulatory Information</Text>
            <DetailItem 
              label="EDA Registration" 
              value={material.regulatory.edaApproved ? 
                material.regulatory.edaRegistrationNumber : 
                'Not Registered'
              } 
            />
            <DetailItem 
              label="GMP Certified" 
              value={material.regulatory.gmpCertified ? 'Yes' : 'No'} 
            />
            <DetailItem 
              label="Expiry Date" 
              value={<ExpiryDateCell date={material.expiry} />} 
            />
          </Box>
        </Grid>

        <Box mt="4">
          <Text weight="bold" color="gray">Test Results</Text>
          <TestResultsTable tests={material.tests} />
        </Box>

        {material.certificate && (
          <Box mt="4">
            <Text weight="bold" color="gray">Certificates</Text>
            <Flex gap="2" mt="2">
              <Badge color="green">
                <FileText size={12} /> COA
              </Badge>
              <Badge color="green">
                <FileText size={12} /> COC
              </Badge>
            </Flex>
          </Box>
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

// 13. Stats Cards Component
const StatsCards = () => {
  const approvedCount = materialsData.filter(m => m.status === 'Approved').length;
  const pendingCount = materialsData.filter(m => m.status === 'Pending').length;
  const compliantCount = materialsData.filter(m => calculateCompliance(m) >= 90).length;
  const overallCompliance = materialsData.length > 0 
    ? materialsData.reduce((sum, material) => sum + calculateCompliance(material), 0) / materialsData.length
    : 0;
  const expiringSoonCount = materialsData.filter(m => {
    const expiryDate = new Date(m.expiry);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays >= 0;
  }).length;

  return (
    <Grid columns="3" gap="4" mb="5">
      <Card>
        <Flex gap="3" align="center">
          <Box p="2" style={{ background: '#ECFDF5', borderRadius: '8px' }}>
            <Check color="#10B981" size={20} />
          </Box>
          <Box>
            <Text color="gray" size="2">Approved Materials</Text>
            <Text size="4" weight="bold">{approvedCount}</Text>
          </Box>
        </Flex>
      </Card>

      <Card>
        <Flex gap="3" align="center">
          <Box p="2" style={{ background: '#FEF3C7', borderRadius: '8px' }}>
            <Clock color="#F59E0B" size={20} />
          </Box>
          <Box>
            <Text color="gray" size="2">Pending Approval</Text>
            <Text size="4" weight="bold">{pendingCount}</Text>
          </Box>
        </Flex>
      </Card>

      <Card>
        <Flex gap="3" align="center">
          <Box p="2" style={{ background: '#EFF6FF', borderRadius: '8px' }}>
            <ShieldCheck color="#3B82F6" size={20} />
          </Box>
          <Box>
            <Text color="gray" size="2">ALCOA+ Compliant</Text>
            <Text size="4" weight="bold">{compliantCount}</Text>
          </Box>
        </Flex>
      </Card>
    </Grid>
  );
};

// 14. Main Dashboard Component
export default function MaterialsQualificationDashboard() {
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [filter, setFilter] = useState<'all' | 'compliant' | 'nonCompliant'>('all');
  const [showBlockchainDialog, setShowBlockchainDialog] = useState(false);

  // Filter materials based on compliance
  const filteredMaterials = materialsData.filter(material => {
    if (filter === 'compliant') return calculateCompliance(material) >= 90;
    if (filter === 'nonCompliant') return calculateCompliance(material) < 90;
    return true;
  });

  // Calculate dashboard metrics
  const overallCompliance = materialsData.length > 0 
    ? materialsData.reduce((sum, material) => sum + calculateCompliance(material), 0) / materialsData.length
    : 0;

  return (
    <Box p="4" style={{ backgroundColor: '#F8FAFC', minHeight: '100vh' }}>
      {/* Dashboard Header */}
      <Flex justify="between" align="center" mb="5">
        <Text size="6" weight="bold">Materials Qualification Dashboard</Text>
        <Select.Root value={filter} onValueChange={(v) => setFilter(v as any)}>
          <Select.Trigger />
          <Select.Content>
            <Select.Item value="all">All Materials</Select.Item>
            <Select.Item value="compliant">Compliant Only</Select.Item>
            <Select.Item value="nonCompliant">Non-Compliant</Select.Item>
          </Select.Content>
        </Select.Root>
      </Flex>

      {/* Stats Cards */}
      <StatsCards />

      {/* Materials Table */}
      <Table.Root variant="surface" style={{ borderRadius: '8px' }}>
        <Table.Header style={{ backgroundColor: '#3B82F6' }}>
          <Table.Row>
            <Table.ColumnHeaderCell style={{ color: 'white' }}>Material</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell style={{ color: 'white' }}>Batch</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell style={{ color: 'white' }}>Status</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell style={{ color: 'white' }}>Tests</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell style={{ color: 'white' }}>Compliance</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell style={{ color: 'white' }}>EDA Status</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell style={{ color: 'white' }}>Actions</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {filteredMaterials.map((material) => (
            <Table.Row key={material.id} style={{ cursor: 'pointer' }}>
              <Table.Cell onClick={() => setSelectedMaterial(material)}>
                <Text weight="medium">{material.material}</Text>
                <Text size="1" color="gray">Last reviewed: {new Date(material.lastReviewed).toLocaleDateString()}</Text>
              </Table.Cell>

              <Table.Cell onClick={() => setSelectedMaterial(material)}>
                <Badge variant="outline">{material.batch}</Badge>
              </Table.Cell>

              <Table.Cell onClick={() => setSelectedMaterial(material)}>
                <StatusBadge status={material.status} />
              </Table.Cell>

              <Table.Cell onClick={() => setSelectedMaterial(material)}>
                <TestResultsIndicator tests={material.tests} />
              </Table.Cell>

              <Table.Cell onClick={() => setSelectedMaterial(material)}>
                <ComplianceProgress value={calculateCompliance(material)} />
              </Table.Cell>

              <Table.Cell onClick={() => setSelectedMaterial(material)}>
                <EDARegistrationBadge regulatory={material.regulatory} />
              </Table.Cell>

              <Table.Cell>
                <Flex gap="2">
                  <Button 
                    size="1" 
                    variant="soft"
                    onClick={() => setSelectedMaterial(material)}
                  >
                    <FileText size={14} />
                  </Button>
                  <Button 
                    size="1" 
                    variant="soft" 
                    color="red"
                    onClick={() => alert(`Reported ${material.material} to EDA`)}
                  >
                    <AlertTriangle size={14} />
                  </Button>
                </Flex>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      {/* Blockchain Submission Section */}
      <Flex justify="end" mt="4">
        <Dialog.Root open={showBlockchainDialog} onOpenChange={setShowBlockchainDialog}>
          <Dialog.Trigger>
            <Button variant="solid" color="violet">
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
              border: `1px solid #6D28D920`
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
      </Flex>

      {/* Overall Compliance Footer */}
      <Card mt="4">
        <Flex justify="between" align="center">
          <Text weight="bold">Overall Compliance Score</Text>
          <Flex align="center" gap="3">
            <Text size="5" weight="bold" color={
              overallCompliance >= 90 ? 'green' :
              overallCompliance >= 70 ? 'yellow' : 'red'
            }>
              {overallCompliance.toFixed(1)}%
            </Text>
            <Progress 
              value={overallCompliance}
              style={{ width: '200px' }}
              color={
                overallCompliance >= 90 ? 'green' :
                overallCompliance >= 70 ? 'yellow' : 'red'
              }
            />
          </Flex>
        </Flex>
      </Card>

      {/* Material Detail Dialog */}
      {selectedMaterial && (
        <MaterialDetailDialog 
          material={selectedMaterial} 
          onClose={() => setSelectedMaterial(null)}
        />
      )}
    </Box>
  );
}
