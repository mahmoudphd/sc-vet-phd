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
  Select
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
  ShieldAlert,
  HelpCircle
} from 'lucide-react';

// 1. Enhanced Type Definitions
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

// 2. Sample Data with Enhanced Structure
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
  // ... other materials
];

// 3. Status Components (Professional Display)
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

// 4. Enhanced Compliance Calculation
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

// 5. Professional MaterialQualificationDashboard Component
export default function MaterialQualificationDashboard() {
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [filter, setFilter] = useState<'all' | 'compliant' | 'nonCompliant'>('all');

  // Filter materials based on compliance
  const filteredMaterials = materialsData.filter(material => {
    if (filter === 'compliant') return calculateCompliance(material) >= 90;
    if (filter === 'nonCompliant') return calculateCompliance(material) < 90;
    return true;
  });

  return (
    <Box p="4" style={{ backgroundColor: '#F8FAFC', minHeight: '100vh' }}>
      {/* Header with Filters */}
      <Flex justify="between" align="center" mb="5">
        <Text size="6" weight="bold">Pharmaceutical Materials Dashboard</Text>
        <Select.Root value={filter} onValueChange={(v) => setFilter(v as any)}>
          <Select.Trigger />
          <Select.Content>
            <Select.Item value="all">All Materials</Select.Item>
            <Select.Item value="compliant">Compliant Only</Select.Item>
            <Select.Item value="nonCompliant">Non-Compliant</Select.Item>
          </Select.Content>
        </Select.Root>
      </Flex>

      {/* Enhanced Materials Table */}
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
            <Table.Row key={material.id}>
              <Table.Cell>
                <Text weight="medium">{material.material}</Text>
                <Text size="1" color="gray">Last reviewed: {new Date(material.lastReviewed).toLocaleDateString()}</Text>
              </Table.Cell>

              <Table.Cell>
                <Badge variant="outline">{material.batch}</Badge>
              </Table.Cell>

              <Table.Cell>
                <StatusBadge status={material.status} />
              </Table.Cell>

              <Table.Cell>
                <TestResultsIndicator tests={material.tests} />
              </Table.Cell>

              <Table.Cell>
                <ComplianceProgress value={calculateCompliance(material)} />
              </Table.Cell>

              <Table.Cell>
                <EDARegistrationBadge regulatory={material.regulatory} />
              </Table.Cell>

              <Table.Cell>
                <MaterialActions material={material} />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

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

// 6. Professional Sub-Components
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

// 7. Action Buttons Component
const MaterialActions = ({ material }: { material: Material }) => {
  return (
    <Flex gap="2">
      <Dialog.Trigger>
        <Button 
          size="1" 
          variant="soft"
          onClick={() => console.log('View details', material.id)}
        >
          <FileText size={14} />
        </Button>
      </Dialog.Trigger>
      
      <Button size="1" variant="soft" color="red">
        <AlertTriangle size={14} />
      </Button>
    </Flex>
  );
};

// 8. Material Detail Dialog Component
const MaterialDetailDialog = ({ 
  material,
  onClose
}: {
  material: Material;
  onClose: () => void;
}) => {
  return (
    <Dialog.Content maxWidth="600px">
      <Dialog.Title>{material.material} Details</Dialog.Title>
      
      <Grid columns="2" gap="4" mt="4">
        <Box>
          <Text weight="bold" color="gray">Basic Information</Text>
          <DetailItem label="Batch" value={material.batch} />
          <DetailItem label="Supplier" value={material.supplier} />
          <DetailItem label="Status" value={<StatusBadge status={material.status} />} />
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

      <Flex justify="end" mt="4">
        <Button variant="soft" onClick={onClose}>
          Close
        </Button>
      </Flex>
    </Dialog.Content>
  );
};

// 9. Helper Components
const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <Flex justify="between" py="2" style={{ borderBottom: '1px solid #eee' }}>
    <Text color="gray">{label}</Text>
    {typeof value === 'string' ? <Text>{value}</Text> : value}
  </Flex>
);

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
