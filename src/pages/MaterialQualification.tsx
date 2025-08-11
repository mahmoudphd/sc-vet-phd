2
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
  Progress
} from '@radix-ui/themes';
import { useState } from 'react';
import {
  Check,
  Clock,
  AlertTriangle,
  ChevronRight,
  FileText,
  ShieldCheck,
  HardHat
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

// Material interface
interface Material {
  id: string;
  material: string;
  supplier: string;
  status: 'Approved' | 'Pending';
  expiry: string;
  batch: string;
  tests: {
    Identity: 'Passed' | 'Pending' | 'Failed';
    Purity: 'Passed' | 'Pending' | 'Failed';
    Microbial: 'Passed' | 'Pending' | 'Failed';
    Endotoxins: 'Passed' | 'Pending' | 'Failed';
  };
  certificate: string;
  lastReviewed: string;
}

// Sample data
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
    lastReviewed: '2025-07-15'
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
    lastReviewed: '2025-06-20'
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
    lastReviewed: '2025-07-01'
  }
];

// Compliance calculation functions
const calculateMaterialCompliance = (material: Material): number => {
  let score = 0;
  
  // Test results (40 points)
  const tests = Object.values(material.tests);
  const passedTests = tests.filter(t => t === 'Passed').length;
  score += (passedTests / tests.length) * 40;

  // Certificates (30 points)
  score += material.certificate ? 30 : 0;

  // Supplier status (20 points - Supplier A is approved)
  score += material.supplier === 'Supplier A' ? 20 : 10;

  // Expiry date (10 points)
  const expiryDate = new Date(material.expiry);
  const today = new Date();
  score += expiryDate > today ? 10 : 0;

  return Math.round(score);
};

const isALCOACompliant = (material: Material): boolean => {
  return (
    Object.values(material.tests).every(t => t === 'Passed') &&
    !!material.certificate &&
    new Date(material.expiry) > new Date()
  );
};

// Component for test result badges
interface TestResultBadgeProps {
  result: 'Passed' | 'Pending' | 'Failed';
}

const TestResultBadge = ({ result }: TestResultBadgeProps) => {
  const statusConfig = {
    Passed: { color: 'green' as const, icon: <Check size={14} /> },
    Pending: { color: 'yellow' as const, icon: <Clock size={14} /> },
    Failed: { color: 'red' as const, icon: <AlertTriangle size={14} /> }
  };

  const config = statusConfig[result];

  return (
    <Badge color={config.color} highContrast>
      <Flex align="center" gap="1">
        {config.icon}
        {result}
      </Flex>
    </Badge>
  );
};

// Component for expiry date with warning indicators
interface ExpiryDateCellProps {
  date: string;
}

const ExpiryDateCell = ({ date }: ExpiryDateCellProps) => {
  const today = new Date();
  const expiryDate = new Date(date);
  const diffTime = expiryDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let status: 'normal' | 'expired' | 'warning' = 'normal';
  if (diffDays < 0) status = 'expired';
  else if (diffDays <= 30) status = 'warning';

  return (
    <Flex align="center" gap="2">
      <Text
        weight={status !== 'normal' ? 'bold' : 'regular'}
        color={
          status === 'expired' ? 'red' : 
          status === 'warning' ? 'yellow' : undefined
        }
      >
        {new Date(date).toLocaleDateString()}
      </Text>
      {status === 'warning' && (
        <Tooltip content={`Expires in ${diffDays} days`}>
          <Box>
            <AlertTriangle size={16} color={theme.colors.warning} />
          </Box>
        </Tooltip>
      )}
      {status === 'expired' && (
        <Tooltip content="Material expired">
          <Box>
            <AlertTriangle size={16} color={theme.colors.danger} />
          </Box>
        </Tooltip>
      )}
    </Flex>
  );
};

export default function MaterialQualificationDashboard() {
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<Material | null>(null);

  // Calculate overall metrics
  const approvedCount = materialsData.filter(m => m.status === 'Approved').length;
  const pendingCount = materialsData.filter(m => m.status === 'Pending').length;
  const expiringSoonCount = materialsData.filter(m => {
    const expiryDate = new Date(m.expiry);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays >= 0;
  }).length;
  
  const overallCompliance = materialsData.length > 0 
    ? materialsData.reduce((sum, material) => sum + calculateMaterialCompliance(material), 0) / materialsData.length
    : 0;

  return (
    <Box p="4" style={{ backgroundColor: theme.colors.background, minHeight: '100vh' }}>
      {/* Header */}
      <Flex justify="between" align="center" mb="5">
        <Text size="6" weight="bold">Material Qualification Dashboard</Text>
        <Button variant="solid" color="violet">
          <ShieldCheck size={16} />
          <Text>Quality Report</Text>
        </Button>
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
            <Table.ColumnHeaderCell style={{ color: 'white' }}>Expiry</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {materialsData.map((material) => (
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
                  
                  <Dialog.Content maxWidth="500px" style={{ borderRadius: '12px' }}>
                    <Dialog.Title>Test Results for {material.material}</Dialog.Title>
                    <Dialog.Description mb="4">
                      Batch: {material.batch} | Last Reviewed: {new Date(material.lastReviewed).toLocaleDateString()}
                    </Dialog.Description>
                    
                    <Box p="4" style={{ backgroundColor: '#F8FAFC', borderRadius: '8px' }}>
                      <Flex direction="column" gap="3">
                        {Object.entries(material.tests).map(([testName, result]) => (
                          <Flex key={testName} justify="between" align="center">
                            <Text weight="bold">
                              {testName}
                              <Text as="span" color="gray" size="2" style={{ marginLeft: 6 }}>
                                via IoT
                              </Text>
                            </Text>
                            <TestResultBadge result={result} />
                          </Flex>
                        ))}
                      </Flex>
                    </Box>

                    <Flex justify="end" mt="4">
                      <Dialog.Close>
                        <Button variant="soft">Close</Button>
                      </Dialog.Close>
                    </Flex>
                  </Dialog.Content>
                </Dialog.Root>
              </Table.Cell>

              <Table.Cell>
                <Badge variant="outline">{material.batch}</Badge>
              </Table.Cell>

              <Table.Cell>
                <Text>{material.supplier}</Text>
                <Text size="1" color="gray">
                  {material.supplier === 'Supplier A' ? 'Approved' : 'Under review'}
                </Text>
              </Table.Cell>

              <Table.Cell>
                <Badge 
                  color={material.status === 'Approved' ? 'green' : 'yellow'} 
                  highContrast
                >
                  {material.status}
                </Badge>
              </Table.Cell>

              <Table.Cell>
                {Object.values(material.tests).every(v => v === 'Passed') ? (
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
                      {Object.values(material.tests).filter(v => v === 'Pending').length} Pending
                    </Flex>
                  </Badge>
                )}
              </Table.Cell>

              <Table.Cell>
                <Box style={{ width: '100%' }}>
                  <Progress
                    value={calculateMaterialCompliance(material)}
                    color={
                      calculateMaterialCompliance(material) >= 90 ? 'green' : 
                      calculateMaterialCompliance(material) >= 70 ? 'yellow' : 'red'
                    }
                    style={{ height: '8px', marginBottom: '4px' }}
                  />
                  <Text size="2" weight="bold">
                    {calculateMaterialCompliance(material)}%
                  </Text>
                </Box>
              </Table.Cell>

              <Table.Cell>
                <Badge 
                  color={isALCOACompliant(material) ? 'green' : 'red'} 
                  highContrast
                >
                  {isALCOACompliant(material) ? 'Compliant' : 'Non-Compliant'}
                </Badge>
              </Table.Cell>

              <Table.Cell>
                <ExpiryDateCell date={material.expiry} />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

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
