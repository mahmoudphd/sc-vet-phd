import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  Dialog,
  Flex,
  Grid,
  Heading,
  Inset,
  Switch,
  Table,
  Text,
  Select as RadixSelect,
  Badge,
  Tabs,
  Spinner
} from '@radix-ui/themes';
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  CartesianGrid
} from 'recharts';
import { DownloadIcon, UploadIcon } from '@radix-ui/react-icons';

// ========== INTERFACES ==========
interface Item {
  name: string;
  qty?: number;
  unitPrice?: number;
  cost?: number;
  costAfter?: number;
  concentrationKg?: number;
  pricePerKg?: number;
  qualityRating?: number;
  deliveryTime?: number;
  reliability?: number;
  totalCost?: number;
  basis?: number;
  targetQty?: number;
  targetPrice?: number;
  originalPricePerKg?: number;
  originalConcentrationKg?: number;
  originalQty?: number;
  originalUnitPrice?: number;
  originalHours?: number;
  originalHourlyRate?: number;
  hours?: number;
  hourlyRate?: number;
}

interface CostTotals {
  actual: number;
  budget: number;
  costAfter: number;
}

type CostCategory = 'Direct Materials' | 'Packaging Materials' | 'Direct Labor' | 'Overhead' | 'Other Costs';

interface CostData {
  rawMaterials: Item[];
  packagingMaterials: Item[];
  directLabor: Item[];
  overheadItems: Item[];
  otherCosts: Item[];
  totals: Record<CostCategory, CostTotals>;
}

interface MaterialTest {
  status: 'Passed' | 'Failed' | 'Not Tested';
}

interface MaterialTests {
  identity: MaterialTest;
  purity: MaterialTest;
  microbial: MaterialTest;
  endotoxins: MaterialTest;
}

interface Material {
  name: string;
  tests: MaterialTests;
  certificate: boolean;
  supplier: {
    status: 'Approved' | 'Pending' | 'Rejected';
    name: string;
  };
  expiryDate: string;
  blockchainRegistered: boolean;
}

interface Supplier {
  id: number;
  name: string;
  pricePerKg: number;
  rating: number;
  delivery: string;
  reliability: string;
  selected?: boolean;
  score: number;
  complianceScore: number;
  material: Material;
}

interface SelectedSolution {
  category: CostCategory;
  index: number;
  solution: string;
}

// ========== UTILITY FUNCTIONS ==========
const calculateComplianceScore = (material: Material): number => {
  const weights = {
    tests: 40,
    certificate: 20,
    supplier: 15,
    expiry: 15,
    blockchain: 10
  };

  const testCount = Object.keys(material.tests).length;
  const passedTests = Object.values(material.tests)
    .filter(test => test.status === 'Passed').length;
  const testScore = (passedTests / testCount) * weights.tests;

  const certScore = material.certificate ? weights.certificate : 0;
  const supplierScore = material.supplier.status === 'Approved' ? weights.supplier : 0;
  
  const isExpiryValid = new Date(material.expiryDate) > new Date();
  const expiryScore = isExpiryValid ? weights.expiry : 0;
  
  const blockchainScore = material.blockchainRegistered ? weights.blockchain : 0;

  const totalScore = testScore + certScore + supplierScore + expiryScore + blockchainScore;
  return Math.min(Math.round(totalScore), 100);
};

const getTestName = (testKey: string): string => {
  const testNames: Record<string, string> = {
    identity: 'Identity Test',
    purity: 'Purity Test',
    microbial: 'Microbial Test',
    endotoxins: 'Endotoxins Test'
  };
  return testNames[testKey] || testKey;
};

const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    'Passed': 'Passed',
    'Failed': 'Failed',
    'Not Tested': 'Not Tested'
  };
  return statusMap[status] || status;
};

const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    'Passed': '#10b981',
    'Failed': '#ef4444',
    'Not Tested': '#94a3b8'
  };
  return statusColors[status] || '#94a3b8';
};

const getSupplierStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    'Approved': 'Approved',
    'Pending': 'Pending Review',
    'Rejected': 'Rejected'
  };
  return statusMap[status] || status;
};

const getScoreColor = (score: number): string => {
  if (score >= 80) return '#10b981';
  if (score >= 60) return '#f59e0b';
  return '#ef4444';
};

const getScoreLabel = (score: number): string => {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Very Good';
  if (score >= 70) return 'Good';
  if (score >= 60) return 'Acceptable';
  return 'Poor';
};

const getComplianceAssessment = (score: number, material: Material): string => {
  if (score >= 90) {
    return "This supplier has excellent compliance. All requirements are fully met.";
  } else if (score >= 80) {
    return "This supplier has very good compliance. There are a few minor areas for improvement.";
  } else if (score >= 70) {
    return "This supplier has acceptable compliance but needs improvement in some areas to ensure full compliance.";
  } else {
    const issues = [];
    if (Object.values(material.tests).some(t => t.status !== 'Passed')) {
      issues.push("some quality tests did not pass");
    }
    if (!material.certificate) issues.push("no quality certificate");
    if (material.supplier.status !== 'Approved') issues.push("supplier status not approved");
    if (new Date(material.expiryDate) <= new Date()) issues.push("product expired");
    if (!material.blockchainRegistered) issues.push("not registered on blockchain");
    
    return `This supplier has poor compliance. Needs improvement in: ${issues.join(', ')}.`;
  }
};

// ========== INITIAL DATA ==========
const initialData: CostData = {
  totals: {
    'Direct Materials': { actual: 133, budget: 129, costAfter: 130 },
    'Packaging Materials': { actual: 18, budget: 16, costAfter: 16 },
    'Direct Labor': { actual: 3, budget: 2, costAfter: 2 },
    'Overhead': { actual: 2, budget: 2, costAfter: 2 },
    'Other Costs': { actual: 15, budget: 13, costAfter: 14 },
  },
  rawMaterials: [
    { name: 'Vitamin B1', concentrationKg: 0.001, pricePerKg: 540, costAfter: 0.51, targetQty: 0.0009, targetPrice: 513 },
    { name: 'Vitamin B2', concentrationKg: 0.006, pricePerKg: 600, costAfter: 0.57, targetQty: 0.0054, targetPrice: 570 },
    { name: 'Vitamin B12', concentrationKg: 0.001, pricePerKg: 2300, costAfter: 2.19, targetQty: 0.0009, targetPrice: 2185 },
    { name: 'Nicotinamide B3', concentrationKg: 0.01, pricePerKg: 400, costAfter: 0.38, targetQty: 0.009, targetPrice: 380 },
    { name: 'Pantothenic Acid', concentrationKg: 0.004, pricePerKg: 1700, costAfter: 1.62, targetQty: 0.0036, targetPrice: 1615 },
    { name: 'Vitamin B6', concentrationKg: 极.0015, pricePerKg: 900, costAfter: 0.86, targetQty: 0.00135, targetPrice: 855 },
    { name: 'Leucine', concentrationKg: 0.03, pricePerKg: 200, costAfter: 0.19, targetQty: 0.027, targetPrice: 190 },
    { name: 'Threonine', concentrationKg: 0.01, pricePerKg: 950, costAfter: 0.90, targetQty: 0.009, targetPrice: 902.5 },
    { name: 'Taurine', concentrationKg: 0.0025, pricePerKg: 3000, costAfter: 2.85, targetQty: 0.00225, targetPrice: 2850 },
    { name: 'Glycine', concentrationKg: 0.0025, pricePerKg: 4200, costAfter: 3.99, targetQty: 0.00225, targetPrice: 3990 },
    { name: 'Arginine', concentrationKg: 0.0025, pricePerKg: 5000, costAfter: 4.75, targetQty: 0.00225, targetPrice: 4750 },
    { name: 'Cynarin', concentrationKg: 0.0025, pricePerKg: 3900, costAfter: 3.71, targetQty: 0.00225, targetPrice: 3705 },
    { name: 'Silymarin', concentrationKg: 0.025, pricePerKg: 700, costAfter: 0.67, targetQty: 0.0225, targetPrice: 665 },
    { name: 'Sorbitol', concentrationKg: 0.01, pricePerKg: 360, costAfter: 0.34, targetQty: 0.009, targetPrice: 342 },
    { name: 'Carnitine', concentrationKg: 0.005, pricePerKg: 1070, costAfter: 1.02, targetQty: 0.0045, targetPrice: 1016.5 },
    { name: 'Betaine', concentrationKg: 0.02, pricePerKg: 1250, costAfter: 1.19, targetQty: 0.018, targetPrice: 1187.5 },
    { name: 'Tween-80', concentrationKg: 0.075, pricePerKg: 90, costAfter: 0.09, targetQty: 0.0675, targetPrice: 85.5 },
    { name: 'Water', concentrationKg: 0.571, pricePerKg: 1, costAfter: 0.95, targetQty: 0.5139, targetPrice: 0.95 },
  ],
  packagingMaterials: [
    { name: 'Plastic Bottle (1 L)', qty: 1, unitPrice: 10, cost: 10, costAfter: 9.5, targetQty: 0.9, targetPrice: 9.5 },
    { name: 'Safety Seal', qty: 1, unitPrice: 3, cost: 3, costAfter: 2.85, targetQty: 0.9, targetPrice: 2.85 },
    { name: 'Cap', qty: 1, unitPrice: 5, cost: 5, costAfter: 4.75, targetQty: 0.9, targetPrice极 4.75 },
  ],
  directLabor: [
    { name: 'Operator', hours: 0.5, hourlyRate: 3.5, cost: 1.75, costAfter: 1.66, targetQty: 0.45, targetPrice: 3.33 },
    { name: 'Supervisor', hours: 0.5, hourlyRate: 1.75, cost: 0.88, costAfter: 0.83, targetQty: 0.45, targetPrice: 1.66 },
    { name: 'Quality Control', hours: 0.5, hourlyRate: 0.74, cost: 0.37, costAfter: 0.35, targetQty: 0.45, targetPrice: 0.70 },
  ],
  overheadItems: [
    { name: 'Rent', totalCost: 1000, basis: 1000, cost: 1, costAfter: 0.95, targetQty: 1, targetPrice: 0.95 },
    { name: 'Electricity', totalCost: 500, basis: 1000, cost: 0.5, costAfter: 0.48, targetQty: 1, targetPrice: 0.48 },
    { name: 'Maintenance', totalCost: 1500, basis: 1000, cost: 1.5, costAfter: 1.43, targetQty: 1, targetPrice: 1.43 },
  ],
  otherCosts: [
    { name: 'Transportation', qty: 1, unitPrice: 6.67, cost: 6.67, costAfter: 6.34, targetQty: 0.9, targetPrice: 6.34 },
    { name: 'Packaging Waste Disposal', qty: 1, unitPrice: 3.33, cost: 3.33, costAfter: 3.16, targetQty: 0.9, targetPrice: 3.16 },
    { name: 'Rework', qty: 1, unitPrice: 5.0, cost: 5, costAfter: 4.5, targetQty: 0.8, targetPrice: 4.5 },
  ],
};

// Add original values for comparison
initialData.rawMaterials = initialData.rawMaterials.map(item => ({
  ...item,
  originalPricePerKg: item.pricePerKg,
  originalConcentrationKg: item.concentrationKg
}));

initialData.packagingMaterials = initialData.packagingMaterials.map(item => ({
  ...item,
  originalUnitPrice: item.unitPrice,
  originalQty: item.qty
}));

initialData.directLabor = initialData.directLabor.map(item => ({
  ...item,
  originalHourlyRate: item.hourlyRate,
  originalHours: item.hours
}));

const categories: CostCategory[] = [
  'Direct Materials',
  'Packaging Materials',
  'Direct Labor',
  'Overhead',
  'Other Costs',
];

const products = ['Poultry Drug A', 'Poultry Drug B', 'Poultry Drug C'];

const solutionsOptions = [
  'Negotiating better prices with supplier',
  'Reducing waste in material usage',
  'Automation to reduce manual labor costs',
  'Optimizing machine usage',
  'Improving inventory management',
  'Minimize transportation costs',
  'Reduce rework costs',
  'Other',
];

// ========== STYLES ==========
const tableHeaderStyle = {
  fontWeight: 'bold',
  padding: '12px 16px',
  backgroundColor: '#f3f4f6',
  fontSize: '0.9rem'
};

const tableCellStyle = {
  fontWeight: 'normal',
  padding: '12px 16px',
  borderBottom: '1px solid #e5e7eb',
  fontSize: '0.9rem'
};

const tableRowHeaderStyle = {
  fontWeight: 'bold',
  padding: '12px 16px',
  borderBottom: '1px solid #e5e7eb',
  fontSize: '0.9rem'
};

const cardTitleStyle = {
  color: '#1f2937',
  fontWeight: 'bold',
  marginBottom: '16px'
};

// ========== COMPONENTS ==========
const EnhancedComplianceDisplay = ({ supplier }: { supplier: Supplier }) => {
  const complianceScore = calculateComplianceScore(supplier.material);
  
  const calculateTestScore = (tests: MaterialTests): number => {
    const passedTests = Object.values(tests).filter(test => test.status === 'Passed').length;
    return (passedTests / Object.keys(tests).length) * 40;
  };

  return (
    <Dialog.Root open onOpenChange={() => {}}>
      <Dialog.Content style={{ 
        maxWidth: '800px',
        width: '90vw',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 10极 40px rgba(0,0,0,0.2)',
        border: '1px solid #e5e7eb',
        backgroundColor: 'white',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <Flex justify="between" align="center" mb="6">
          <Dialog.Title style={{ 
            fontSize: '1.8rem',
            fontWeight: 'bold',
            color: '#1f2937'
          }}>
            Compliance Details for {supplier.name}
          </Dialog.Title>
          <Badge 
            style={{ 
              padding: '10px 16px', 
              borderRadius: '20px', 
              backgroundColor: getScoreColor(complianceScore),
              color: 'white',
              fontWeight: 'bold',
              fontSize: '16px'
            }}
          >
            {complianceScore}/100 - {getScoreLabel(complianceScore)}
          </Badge>
        </Flex>

        <Grid columns="2" gap="6" mb="6">
          <Card style={{ 
            padding: '20px', 
            backgroundColor: '#f8fafc', 
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
          }}>
            <Flex justify="center" mb="5">
              <Box style={{ position: 'relative', width: '150px', height: '150px' }}>
                <svg width="150" height="150" viewBox="0 0 150 150">
                  <circle
                    cx="75"
                    cy="75"
                    r="68"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="10"
                  />
                  <circle
                    cx="75"
                    cy="75"
                    r="68"
                    fill="none"
                    stroke={getScoreColor(complianceScore)}
                    strokeWidth="10"
                    strokeLinecap='round'
                    strokeDasharray={`${complianceScore * 4.27} 427`}
                    transform="rotate(-90 75 75)"
                  />
                </svg>
                <Box style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center'
                }}>
                  <Text size="8" weight="bold" style={{ color: '#1e293b' }}>
                    {complianceScore}
                  </Text>
                  <Text size="3" style={{ color: '#64748b' }}>
                    of 100
                  </Text>
                </Box>
              </Box>
            </Flex>
          </Card>

          <Card style={{ 
            padding: '20px', 
            backgroundColor: '#f8极fc', 
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
          }}>
            <Heading size="4" mb="4" style={{ color: '#1e293b', fontWeight: 'bold' }}>
              Score Breakdown
            </Heading>
            
            {[
              { 
                name: 'Quality Tests', 
                value: calculateTestScore(supplier.material.tests), 
                max: 40,
                details: `(${Object.values(supplier.material.tests).filter(t => t.status === 'Passed').length} of 4 passed)`,
                icon: '🧪'
              },
              { 
                name: 'Quality Certificate', 
                value: supplier.material.certificate ? 20 : 0, 
                max: 20,
                details: supplier.material.certificate ? 'Available' : 'Not available',
                icon: '📄'
              },
              { 
                name: 'Supplier Status', 
                value: supplier.material.supplier.status === 'Approved' ? 15 : 0, 
                max: 15,
                details: getSupplierStatusText(supplier.material.supplier.status),
                icon: '🏢'
              },
              { 
                name: 'Expiry Date', 
                value: new Date(s极pplier.material.expiryDate) > new Date() ? 15 : 0, 
                max: 15,
                details: new Date(supplier.material.expiryDate) > new Date() ? 'Valid' : 'Expired',
                icon: '📅'
              },
              { 
                name: 'Blockchain Registration', 
                value: supplier.material.blockchainRegistered ? 10 : 0, 
                max: 10,
                details: supplier.material.blockchainRegistered ? 'Registered' : 'Not registered',
                icon: '🔗'
              }
            ].map((item, index) => (
              <Box key={index} mb="4">
                <Flex justify="between" align="center" mb="2">
                  <Flex align="center" gap="3">
                    <Text size="5">{item.icon}</Text>
                    <Text size="3" weight="medium" style={{ color: '#475569' }}>
                      {item.name}
                    </Text>
                  </Flex>
                  <Text size="3" style={{ color: '#64748b' }}>
                    {item.value}/{item.max} - {item.details}
                  </Text>
                </Flex>
                <Box style={{
                  height: '10px',
                  backgroundColor: '#e2e8f0',
                  borderRadius: '5px',
                  overflow: 'hidden'
                }}>
                  <Box style={{
                    height: '100%',
                    width: `${((item.value || 0) / (item.max || 100)) * 100}%`,
                    backgroundColor: (item.value || 0) > 0 
                      ? getScoreColor(((item.value || 0) / (item.max || 100)) * 100) 
                      : '#ef4444',
                    borderRadius: '5px',
                    transition: 'width 0.3s ease'
                  }} />
                </Box>
              </Box>
            ))}
          </Card>
        </Grid>

        <Grid columns="2" gap="6" mb="6">
          <Card style={{ 
            padding: '20px', 
            backgroundColor: 'white', 
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
          }}>
            <Heading size="4" mb="4" style={{ color: '#1e293b', fontWeight: 'bold' }}>
              Quality Tests Details
            </Heading>
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell style={{ fontWeight: 'bold', fontSize: '1rem' }}>Test</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell style={{ fontWeight: 'bold', fontSize: '1rem' }}>Status</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {Object.entries(supplier.material.tests).map(([test, { status }], index) => (
                  <Table.Row key={index}>
                    <Table.Cell style={{ padding: '12px', fontSize: '1rem' }}>
                      <Flex align="center" gap="3">
                        <Text>🔍</Text>
                        <Text>{getTestName(test)}</Text>
                      </Flex>
                    </Table.Cell>
                    <Table.Cell style={{ padding: '12px' }}>
                      <Badge 
                        style={{ 
                          backgroundColor: getStatusColor(status),
                          color: 'white',
                          padding: '6px 12px',
                          fontSize: '0.9rem',
                          fontWeight: 'bold'
                        }}
                      >
                        {getStatusText(status)}
                      </Badge>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Card>

          <Card style={{ 
            backgroundColor: '#fffbeb', 
            padding: '20px',
            border: '1px solid #fde68a',
            borderRadius: '12px'
          }}>
            <Heading size="4" mb="3" style={{ color: '#92400e', fontWeight: 'bold' }}>
              Compliance Assessment
            </Heading>
            <Text size="3" style={{ 
              color: '#92400e',
              lineHeight: '1.6'
            }}>
              {getComplianceAssessment(complianceScore, supplier.material)}
            </Text>
          </Card>
        </Grid>

        <Flex justify="end" mt="6">
          <Button
            variant="soft"
            onClick={() => window.history.back()}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '1rem'
            }}
          >
            Close
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

interface CostAfterViewProps {
  category: CostCategory;
  data: CostData;
  updateCostAfterValue: (category: CostCategory, index: number, value: number) => void;
  formatCurrency: (value: number, currency: string) => string;
  currency: string;
  getDetailsByCategory: (category: CostCategory, dataToUse?: CostData) => Item[];
  calculateActualCost: (item: Item) => number;
  calculateCostAfter: (item: Item) => number;
}

const CostAfterView: React.FC<CostAfterViewProps> = ({ 
  category, 
  data, 
  updateCostAfterValue, 
  formatCurrency, 
  currency, 
  getDetailsByCategory, 
  calculateActualCost, 
  calculateCostAfter 
}) => {
  return (
    <Table.Root variant="surface">
      <Table.Header style={{ backgroundColor: '#f3f4f6' }}>
        <Table.Row>
          <Table.ColumnHeaderCell style={tableHeaderStyle}>Item</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell style={tableHeaderStyle}>Cost Before</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell style={tableHeaderStyle}>Cost After</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell style={tableHeaderStyle}>Savings Achieved</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell style={tableHeaderStyle}>Savings %</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {getDetailsByCategory(category, data).map((item, index) => {
          const costBefore = calculateActualCost(item);
          const costAfter = calculateCostAfter(item);
          const savings = costBefore - costAfter;
          const savingsPercentage = ((savings / costBefore) * 100).toFixed(1);
          const hasSavings = savings > 0;
          
          return (
            <Table.Row key={index}>
              <Table.RowHeaderCell style={tableRowHeaderStyle}>{item.name}</Table.RowHeaderCell>
              <Table.Cell style={tableCellStyle}>
                {formatCurrency(costBefore, currency)}
              </Table.Cell>
              <Table.Cell style={tableCellStyle}>
                <input
                  type="number"
                  value={costAfter}
                  onChange={(e) => updateCostAfterValue(
                    category, 
                    index, 
                    parseFloat(e.target.value) || 0
                  )}
                  step="0.01"
                  min={costBefore * 0.95}
                  max={costBefore}
                  style={{ 
                    width: '80px',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: 'white',
                    fontSize: '14px'
                  }}
                />
              </Table.Cell>
              <Table.Cell style={{ 
                ...tableCellStyle,
                color: hasSavings ? '#10b981' : '#6b7280',
                fontWeight: 'bold'
              }}>
                {formatCurrency(savings, currency)}
              </Table.Cell>
              <Table.Cell style={{ 
                ...tableCellStyle,
                color: hasSavings ? '#10b981' : '#6b7280',
                fontWeight: 'bold'
              }}>
                {savingsPercentage}%
              </Table.Cell>
            </Table.Row>
          );
        })}
        
        <Table.Row style={{backgroundColor: '#f8fafc', fontWeight: 'bold'}}>
          <Table.RowHeaderCell style={tableRowHeaderStyle}>Total</Table.RowHeaderCell>
          <Table.Cell style={tableCellStyle}>
            {formatCurrency(
              getDetailsByCategory(category, data).reduce(
                (sum: number, item: Item) => sum + calculateActualCost(item), 0
              ), 
              currency
            )}
          </Table.Cell>
          <Table.Cell style={tableCellStyle}>
            {formatCurrency(
              getDetailsByCategory(category, data).reduce(
                (sum: number, item: Item) => sum + calculateCostAfter(item), 0
              ), 
              currency
            )}
          </Table.Cell>
          <Table.Cell style={tableCellStyle}>
            {formatCurrency(
              getDetailsByCategory(category, data).reduce(
                (sum: number, item: Item) => sum + (calculateActualCost(item) - calculateCostAfter(item)), 0
              ), 
              currency
            )}
          </Table.Cell>
          <Table.Cell style={tableCellStyle}>
            {(() => {
              const totalBefore = getDetailsByCategory(category, data).reduce(
                (sum: number, item: Item) => sum + calculateActualCost(item), 0
              );
              const totalAfter = getDetailsByCategory(category, data).reduce(
                (sum: number, item: Item) => sum + calculateCostAfter(item), 0
              );
              const totalSavingsPercentage = totalBefore === 0 ? 0 : ((totalBefore - totalAfter) / totalBefore) * 100;
              const hasTotalSavings = totalSavingsPercentage > 0;
              
              return (
                <span style={{ 
                  color: hasTotalSavings ? '#10b981' : '#6b7280',
                }}>
                  {totalBefore === 0 ? '0.0' : totalSavingsPercentage.toFixed(1)}%
                </span>
              );
            })()}
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  );
};

// ========== MAIN COMPONENT ==========
function CostAnalytics() {
  const [data, setData] = useState<CostData>(initialData);
  const [dialogCategory, setDialogCategory] = useState<CostCategory | null>(null);
  const [viewMode, setViewMode] = useState<'actual' | 'target' | 'costAfter'>('actual');
  const [benchmarkPrice, setBenchmarkPrice] = useState(220);
  const [profitMargin, setProfitMargin] = useState(25);
  const [currency, setCurrency] = useState<'EGP' | 'USD'>('EGP');
  const [autoMode, setAutoMode] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [solutions, setSolutions] = useState<Record<CostCategory, Record<number, string>>>({
    'Direct Materials': {},
    'Packaging Materials': {},
    'Direct Labor': {},
    'Overhead': {},
    'Other Costs': {},
  });
  const [selectedSolution, setSelectedSolution] = useState<SelectedSolution | null>(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [potentialSavings, setPotentialSavings] = useState(0);
  const [complianceTooltip, setComplianceTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    supplier: Supplier | null;
  }>({
    visible: false,
    x: 0,
    y: 0,
    supplier: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  // Utility functions
  const formatNumber = (value: number, decimalPlaces: number = 2, showExact: boolean = false) => {
    if (showExact) {
      const fixedValue = value.toFixed(6);
      return fixedValue.replace(/(\.\d*?[1-9])0+$/, "$1").replace(/\.0+$/, "");
    }
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimalPlaces
    });
  };

  const formatCurrency = (value: number, currency: string) => {
    const roundedValue = Math.round(value * 100) / 100;
    
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(roundedValue);
  };

  const getDetailsByCategory = (category: CostCategory, dataToUse = data): Item[] => {
    switch (category) {
      case 'Direct Materials': return dataToUse.rawMaterials;
      case 'Packaging Materials': return dataToUse.packagingMaterials;
      case 'Direct Labor': return dataToUse.directLabor;
      case 'Overhead': return dataToUse.overheadItems;
      case 'Other Costs': return dataToUse.otherCosts;
      default: return [];
    }
  };

  const calculateActualCost = (item: Item): number => {
    if ('concentrationKg' in item && item.originalConcentrationKg !== undefined) 
      return (item.originalConcentrationKg || 0) * (item.originalPricePerKg || item.pricePerKg || 0);
    
    if ('hours' in item && item.originalHours !== undefined) 
      return (item.originalHours || 0) * (item.originalHourlyRate || item.hourlyRate || 0);
    
    if ('totalCost' in item) 
      return (item.totalCost || 0) / (item.basis || 1);
    
    if (item.originalQty !== undefined && item.originalUnitPrice !== undefined)
      return (item.originalQty || 0) * (item.originalUnitPrice || 0);
    
    return (item.qty || 0) * (item.unitPrice || 0);
  };

  const calculateCostAfter = (item: Item): number => {
    if (item.costAfter !== undefined) return item.costAfter;
    
    if (item.targetQty !== undefined && item.targetPrice !== undefined) {
      return (item.targetQty || 0) * (item.targetPrice || 0);
    }
    
    return calculateActualCost(item);
  };

  const generateSupplierPrices = (basePrice: number, materialName: string) => {
    const intBasePrice = Math.round(basePrice);
    
    const discounts = [
      0.01 + Math.random() * 0.04,
      0.01 + Math.random() * 0.04,
      0.01 + Math.random() * 0.04
    ].sort(() => Math.random() - 0.5);

    const generateRandomMaterial = (supplierName: string): Material => {
      const testStatuses: ('Passed' | 'Failed' | 'Not Tested')[] = ['Passed', 'Failed', 'Not Tested'];
      const supplierStatuses: ('Approved' | 'Pending' | 'Rejected')[] = ['Approved', 'Pending', 'Rejected'];
      
      return {
        name: materialName,
        tests: {
          identity: { status: testStatuses[Math.floor(Math.random() * 3)] },
          purity: { status: testStatuses[Math.floor(Math.random() * 3)] },
          microbial: { status: testStatuses[Math.floor(Math.random() * 3)] },
          endotoxins: { status: testStatuses[Math.floor(Math.random() * 3)] }
        },
        certificate: Math.random() > 0.3,
        supplier: {
          status: supplierStatuses[Math.floor(Math.random() * 3)],
          name: supplierName
        },
        expiryDate: new Date(Date.now() + Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        blockchainRegistered: Math.random() > 0.4
      };
    };

    const suppliers = [
      {
        id: 1,
        name: 'Supplier A',
        pricePerKg: Math.round(intBasePrice * (1 - discounts[0])),
        rating: 4.7,
        delivery: '1 week',
        reliability: '97%',
        selected: false,
        material: generateRandomMaterial('Supplier A')
      },
      {
        id: 2,
        name: 'Supplier B',
        pricePerKg: Math.round(intBasePrice * (1 - discounts[1])),
        rating: 4.2,
        delivery: '2 weeks',
        reliability: '90%',
        selected: false,
        material: generateRandomMaterial('Supplier B')
      },
      {
        id: 3,
        name: 'Supplier C',
        pricePerKg: Math.round(intBasePrice * (1 - discounts[2])),
        rating: 3.8,
        delivery: '3 weeks',
        reliability: '85%',
        selected: false,
        material: generateRandomMaterial('Supplier C')
      }
    ];

    return suppliers.map(supplier => {
      const complianceScore = calculateComplianceScore(supplier.material);
      
      const priceScore = (1 - (supplier.pricePerKg / intBasePrice)) * 40;
      const ratingScore = (supplier.rating / 5) * 30;
      const reliabilityScore = (parseInt(supplier.reliability) / 100) * 20;
      const deliveryWeeks = parseInt(supplier.delivery.split(' ')[0]);
      const deliveryScore = (1 - (deliveryWeeks / 3)) * 10;
      
      const totalScore = priceScore + ratingScore + reliabilityScore + deliveryScore + complianceScore;
      
      return {
        ...supplier,
        score: Math.round(totalScore * 100) / 100,
        complianceScore: complianceScore
      };
    });
  };

  const autoSelectBestSupplier = () => {
    if (!selectedSolution) return;
    
    const bestSupplier = suppliers.reduce((prev, current) => 
      (prev.score > current.score) ? prev : current
    );

    handleSupplierSelect(bestSupplier.id);
  };

  const handleSupplierSelect = (id: number) => {
    if (!selectedSolution) return;
    
    setSuppliers(prev => prev.map(supplier => ({
      ...supplier,
      selected: supplier.id === id
    })));
    
    const selectedSupplier = suppliers.find(s => s.id === id);
    if (selectedSupplier) {
      const savings = currentPrice - selectedSupplier.pricePerKg;
      setPotentialSavings(Math.round(savings * 100) / 100);
      
      setData(prev => {
        const newData = {...prev};
        const categoryItems = [...getDetailsByCategory(selectedSolution.category, newData)];
        const item = categoryItems[selectedSolution.index];
        
        if (selectedSolution.category === 'Direct Materials') {
          item.costAfter = (item.concentrationKg || 0) * selectedSupplier.pricePerKg;
        } else if (selectedSolution.category === 'Packaging Materials') {
          item.costAfter = (item.qty || 0) * selectedSupplier.pricePerKg;
        }
        
        switch (selectedSolution.category) {
          case 'Direct Materials': newData.rawMaterials = categoryItems; break;
          case 'Packaging Materials': newData.packagingMaterials = categoryItems; break;
          case 'Direct Labor': newData.directLabor = categoryItems; break;
          case 'Overhead': newData.overheadItems = categoryItems; break;
          case 'Other Costs': newData.other极osts = categoryItems; break;
        }
        
        updateCategoryTotals(selectedSolution.category, newData);
        
        return newData;
      });
    }
  };

  const updateTargetValues = (category: CostCategory, index: number, field: 'targetQty' | 'targetPrice', value: number) => {
    setData(prev => {
      const newData = {...prev};
      const categoryItems = [...getDetailsByCategory(category, newData)];
      categoryItems[index][field] = value;
      
      switch (category) {
          case 'Direct Materials': newData.rawMaterials = categoryItems; break;
          case 'Packaging Materials': newData.packagingMaterials = categoryItems; break;
          case 'Direct Labor': newData.directLabor = categoryItems; break;
          case 'Overhead': newData.overheadItems = categoryItems; break;
          case 'Other Costs': newData.otherCosts = categoryItems; break;
      }
      
      updateCategoryTotals(category, newData);
      
      return newData;
    });
  };

  const updateCostAfterValue = (category: CostCategory, index: number, value: number) => {
    setData(prev => {
      const newData = {...prev};
      const categoryItems = [...getDetailsByCategory(category, newData)];
      const item = categoryItems[index];
      const actualCost = calculateActualCost(item);
      
      const maxAllowedSavings = actualCost * 0.05;
      const minAllowedCostAfter = actual极 - maxAllowedSavings;
      
      item.costAfter = Math.max(value, minAllowedCostAfter);
      
      switch (category) {
        case 'Direct Materials': newData.rawMaterials = categoryItems; break;
        case 'Packaging Materials': newData.packagingMaterials = categoryItems; break;
        case 'Direct Labor': newData.directLabor = categoryItems; break;
        case 'Overhead': newData.overheadItems = categoryItems; break;
        case 'Other Costs': newData.otherCosts = categoryItems; break;
      }
      
      updateCategoryTotals(category, newData);
      
      return newData;
    });
  };

  const updateCategoryTotals = (category: CostCategory, dataToUpdate: CostData) => {
    const items = getDetailsByCategory(category, dataToUpdate);
    const actualTotal = items.reduce((sum, item) => sum + calculateActualCost(item), 0);
    const targetTotal = items.reduce((sum, item) => sum + ((item.targetQty || 0) * (item.targetPrice || 0)), 0);
    const costAfterTotal = items.reduce((sum, item) => sum + calculateCostAfter(item), 0);
    
    dataToUpdate.totals[category] = {
      ...dataToUpdate.totals[category],
      actual: Math.round(actualTotal),
      budget: Math.round(targetTotal),
      costAfter: Math.round(costAfterTotal)
    };
  };

  const handleSolutionSelect = (category: CostCategory, index: number, solution: string) => {
    const item = getDetailsByCategory(category)[index];
    setCurrentPrice(item.pricePerKg || 0);
    
    if (!item.originalPricePerKg) {
      item.originalPricePerKg = item.pricePerKg;
    }

    setIsLoading(true);
    const newSelectedSolution = { category, index, solution };
    setSelectedSolution(newSelectedSolution);
    setSolutions((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [index]: solution,
      },
    }));
    
    if (category === 'Direct Materials') {
      setTimeout(() => {
        setSuppliers(generateSupplierPrices(item.pricePerKg || 0, item.name));
        setIsLoading(false);
      }, 800);
    } else {
      setIsLoading(false);
    }
  };

  const handleBenchmarkChange = (value: number) => {
    setBenchmarkPrice(Math.round(value));
  };

  const handleExportReport = () => {
    alert('Export Report functionality not implemented yet.');
  };

  const handleTargetChange = (category: CostCategory, value: number) => {
    setData(prev => ({
      ...prev,
      totals: {
        ...prev.totals,
        [category]: {
          ...prev.totals[category],
          budget: Math.round(value),
        },
      },
    }));
  };

  const handleSubmitToBlockchain = () => {
    alert('Data submitted to blockchain successfully!');
  };

  const handleSubmitDialog = (category: CostCategory) => {
    const items = getDetailsByCategory(category);
    const newActual = items.reduce((sum, item) => sum + calculateActualCost(item), 0);
    const newCostAfter = items.reduce((sum, item) => sum + calculateCostAfter(item), 0);

    setData(prev => ({
      ...prev,
      totals: {
        ...prev.totals,
        [category]: {
          ...prev.totals[category],
          actual: Math.round(newActual),
          costAfter: Math.round(newCostAfter)
        }
      }
    }));

    setDialogCategory(null);
  };

  useEffect(() => {
    const newData = {...data};
    categories.forEach(category => {
      updateCategoryTotals(category, newData);
    });
    setData(newData);
  }, []);

  // Data calculations
  const totals = data.totals;
  const totalActual = categories.reduce((sum, category) => sum + totals[category].actual, 0);
  const totalTarget = categories.reduce((sum, category) => sum + totals[category].budget, 0);
  const totalCostAfter = categories.reduce((sum, category) => sum + totals[category].costAfter, 0);
  const postOptimizationEstimate = Math.round((totalActual - totalCostAfter));
  const targetCost = Math.round(benchmarkPrice * (1 - profitMargin / 100));

  const costGapData = [
    { month: 'Jan', actual: 170, benchmark: benchmarkPrice, targetCost: targetCost },
    { month: 'Feb', actual: 171, benchmark: benchmarkPrice, targetCost: targetCost },
    { month: 'Mar', actual: 168, benchmark: benchmarkPrice, targetCost: targetCost },
    { month: 'Apr', actual: 171, benchmark: benchmarkPrice, targetCost: targetCost },
    { month: 'May', actual: totalActual, benchmark: benchmarkPrice, targetCost: targetCost, costAfter: totalCostAfter },
  ];

  const costGapDataWithGap = costGapData.map((d) => ({
    ...d,
    gap: Math.round((d.actual - targetCost)),
  }));

  const pieColors = ['#3b82f6', '#f59e0b', '#ef4444', '#10b981', '#a855f7'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ 
          backgroundColor: 'white', 
          padding: '10px', 
          border: '1px solid #ccc',
          borderRadius: '5px'
        }}>
          <p>{`Month: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${formatCurrency(entry.value, currency)}`}
              {entry.name === 'actual' && (
                <span>{` (Cost Gap: ${formatCurrency(entry.value - targetCost, currency)})`}</span>
              )}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Render the component
  return (
    <Box p="4" style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Header section */}
      <Flex justify="between" align="center" mb="6" wrap="wrap" gap="3">
        <Heading size="6" weight="bold" style={{ color: '#1f2937' }}>Inter-Organizational Cost Management</Heading>
        <Flex gap="3" align="center" wrap="wrap">
          <Flex align="center" gap="2">
            <Text size="2" weight="bold" style={{ color: '#4b5563' }}>Product:</Text>
            <RadixSelect.Root
              value={selectedProduct}
              onValueChange={(value) => setSelectedProduct(value)}
            >
              <RadixSelect.Trigger style={{ 
                minWidth: '120px',
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '6px'
              }} />
              <RadixSelect.Content style={{
                backgroundColor: 'white',
                borderRadius: '6px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}>
                {products.map((p) => (
                  <RadixSelect.Item key={p} value={p} style={{
                    padding: '8px 12px'
                  }}>
                    {p}
                  </RadixSelect.Item>
                ))}
              </RadixSelect.Content>
            </RadixSelect.Root>
          </Flex>
          
          <Flex align="center" gap="2">
            <Text size="2" weight="bold" style={{ color: '#4b5563' }}>Currency:</Text>
            <RadixSelect.Root
              value={currency}
              onValueChange={(value) => setCurrency(value as 'EGP' | 'USD')}
            >
              <RadixSelect.Trigger style={{ 
                minWidth: '80px',
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '极px'
              }} />
              <RadixSelect.Content style={{
                backgroundColor: 'white',
                borderRadius: '6px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}>
                <RadixSelect.Item value="EGP" style={{
                  padding: '8px 12px'
                }}>EGP</RadixSelect.Item>
                <RadixSelect.Item value="USD" style={{
                  padding: '8px 12px'
                }}>USD</RadixSelect.Item>
              </RadixSelect.Content>
            </RadixSelect.Root>
          </Flex>

          <Button 
            variant="soft" 
            onClick={handleExportReport}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '6px',
              fontWeight: '500'
            }}
          >
            <DownloadIcon />
            Export Report
          </Button>
        </Flex>
      </Flex>

      {/* Key metrics cards */}
      <Grid columns={{ initial: '1', md: '3' }} gap="4极 mb="6">
        {[
          { label: 'Actual Cost', value: totalActual, trend: 'down' },
          { label: 'Target Cost', value: totalTarget, trend: 'neutral' },
          { label: 'Cost After Optimization', value: totalCostAfter, trend: 'up' },
          { label: 'Post-Optimization Estimate', value: postOptimizationEstimate, trend: 'up' },
          {
            label: 'Benchmark Price',
            value: benchmarkPrice,
            editable: true,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
              handleBenchmarkChange(parseFloat(e.target.value) || 0)
          },
          {
            label: 'Profit Margin (%)',
            value: profitMargin,
            editable: true,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
              setProfitMargin(parseFloat(e.target.value) || 0)
          },
        ].map((item, index) => (
          <Card 
            key={index} 
            style={{ 
              position: 'relative',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              transition: 'all 0.2s ease',
              backgroundColor: 'white'
            }}
          >
            <Flex direction="column" gap="2" p="4">
              <Flex justify="between" align="center">
                <Text size="2" color="gray" weight="bold">
                  {item.label}
                </Text>
                {item.trend && (
                  <Badge color={
                      item.trend === 'up' ? 'green' : item.trend === 'down' ? 'red' : 'gray'
                    }
                    style={{
                      borderRadius: '9999px',
                      padding: '2px 8px',
                      fontWeight: '500'
                    }}
                  >
                    {item.trend === 'up' ? '↓' : item.trend === 'down' ? '↑' : '→'}
                  </Badge>
                )}
              </Flex>
              
              {item.editable ? (
                <Flex align="center" gap="2">
                  <input
                    type="number"
                    value={item.value}
                    onChange={item.onChange}
                    style={{
                      width: '80px',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0',
                      backgroundColor: '#f9fafb',
                      fontSize: '14px'
                    }}
                  />
                  <Text size="4" weight="bold" style={{ color: '#1f2937' }}>
                    {item.label.includes('%') ? `${item.value}%` : formatCurrency(item.value as number, currency)}
                  </Text>
                </Flex> ) : (
                <Heading size="5" style={{ fontWeight: 'bold', color: '#1f2937' }}>
                  {item.label.includes('%') ? `${item.value}极` : formatCurrency(item.value as number, currency)}
                </Heading>
              )}
            </Flex>
          </Card>
        ))}
      </Grid>

      {/* Main cost table */}
      <Card mb="6" style={{ 
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        backgroundColor: 'white'
      }}>
        <Inset clip="padding-box" side="top" pb="current">
          <Table.Root variant="surface">
            <Table.Header style={{ backgroundColor: '#f3f4f6' }}>
              <Table.Row>
                <Table.ColumnHeaderCell style={tableHeaderStyle}>Cost Category</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell style={tableHeaderStyle}>Actual Cost</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell style={tableHeaderStyle}>Target Cost极Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell style={tableHeaderStyle}>Variance</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell style={tableHeaderStyle}>% of Total</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell style={tableHeaderStyle}>Cost After Optimization</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell style={tableHeaderStyle}>Details</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            
            <Table.Body>
              {categories.map((category) => {
                const actualTotal = Math.round(
                  getDetailsByCategory(category)
                    .reduce((sum, item) => sum + calculateActualCost(item), 0) * 100
                ) / 100;
                
                const costAfterTotal = Math.round(
                  getDetailsByCategory(category)
                    .reduce((sum, item) => sum + calculateCostAfter(item), 0) * 100
                ) / 100;
                
                const variance = actualTotal - totals[category].budget;
                const varianceColor = variance <= 0 ? 'green' : 'red';
                
                return (
                  <Table.Row key={category}>
                    <Table.RowHeaderCell style={tableRowHeaderStyle}>{category}</Table.RowHeaderCell>
                    
                    <Table.Cell style={tableCellStyle}>
                      {formatCurrency(actualTotal, currency)}
                    </Table.Cell>
                    
                    <Table.Cell style={tableCellStyle}>
                      <input
                        type="number"
                        value={totals[category].budget}
                        onChange={(e) => handleTargetChange(category, parseFloat(e.target.value) || 0)}
                        step="0.01"
                        min="0"
                        style={{
                          width: '80px',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          border: '1px solid #e2e8f0',
                          backgroundColor: '#f9fafb',
                          fontSize: '14px'
                        }}
                      />
                    </Table.Cell>
                    
                    <Table.Cell style={{ 
                      ...tableCellStyle,
                      color: varianceColor
                    }}>
                      {formatCurrency(variance, currency)}
                    </Table.Cell>
                    
                    <Table.Cell style={tableCellStyle}>
                      {totalActual === 0 ? '0.00' : ((actualTotal / totalActual) * 100).toFixed(2)}%
                    </Table.Cell>
                    
                    <Table.Cell style={tableCellStyle}>
                      {formatCurrency(costAfterTotal, currency)}
                    </Table.Cell>
                    
                    <Table.Cell style={tableCellStyle}>
                      <Button 
                        size="1" 
                        variant="solid"
                        onClick={() => setDialogCategory(category)}
                        style={{
                          borderRadius: '6px',
                          padding: '4px 12px',
                          fontSize: '0.875rem',
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      >
                        View Details
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
              
              <Table.Row style={{ 
                backgroundColor: '#f8fafc',
                fontWeight: 'bold'
              }}>
                <Table.RowHeaderCell style={tableRowHeaderStyle}>Total</Table.RowHeaderCell>
                <Table.Cell style={tableCellStyle}>
                  {formatCurrency(
                    Math.round(
                      categories.reduce((sum, category) => 
                        sum + getDetailsByCategory(category).reduce(
                          (catSum, item) => catSum + calculateActualCost(item), 0
                        ), 0) * 100
                    ) / 100, 
                    currency
                  )}
                </Table.Cell>
                <Table.Cell style={tableCellStyle}>{formatCurrency(totalTarget, currency)}</Table.Cell>
                <Table.Cell style={tableCellStyle}>
                  {formatCurrency(
                    Math.round(
                      (categories.reduce((sum, category) => 
                        sum + getDetailsByCategory(category).reduce(
                          (catSum, item) => catSum + calculateActualCost(item), 0
                        ), 0) - totalTarget) * 100
                    ) / 100, 
                    currency
                  )}
                </Table.Cell>
                <Table.Cell style={tableCellStyle}>100%</Table.Cell>
                <Table.Cell style={tableCellStyle}>
                  {formatCurrency(
                    Math.round(
                      categories.reduce((sum, category) => 
                        sum + getDetailsByCategory(category).reduce(
                          (catSum, item) => catSum + calculateCostAfter(item), 0
                        ), 0) * 100
                    ) / 100, 
                    currency
                  )}
                </Table.Cell>
                <Table.Cell style={tableCellStyle}></Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Root>
        </Inset>
      </Card>

      {/* Category detail dialog */}
      {dialogCategory && (
        <Dialog.Root open onOpenChange={() => setDialogCategory(null)}>
          <Dialog.Content style={{ 
            maxWidth: '800px',
            maxHeight: '80vh',
            overflowY: 'auto',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb',
            backgroundColor: 'white'
          }}>
            <Flex justify="between" align="center" mb="4">
              <Dialog.Title style={{ 
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#1f2937'
              }}>
                {dialogCategory} Breakdown
              </Dialog.Title>
              <Flex align="center" gap="2">
                <Text size="2" style={{ color: '#4b5563' }}>Auto IoT Mode</Text>
                <Switch 
                  checked={autoMode} 
                  onCheckedChange={setAutoMode}
                />
              </Flex>
            </Flex>

            <Tabs.Root value={viewMode} onValueChange={(value) => setViewMode(value as 'actual' | 'target' | 'costAfter')}>
              <Tabs.List>
                <Tabs.Trigger value="actual" style={{ fontWeight: 'bold' }}>Actual View</Tabs.Trigger>
                <Tabs.Trigger value="target" style={{ fontWeight: 'bold' }}>Target View</Tabs.Trigger>
                <Tabs.Trigger value="costAfter" style={{ fontWeight: 'bold' }}>Cost After View</Tabs.Trigger>
              </Tabs.List>

              <Box pt="3">
                <Tabs.Content value="actual">
                  <Table.Root variant="surface">
                    <Table.Header style={{ backgroundColor: '#f3f4f6' }}>
                      <Table.Row>
                        {(() => {
                          const columns = [];
                          switch (dialogCategory) {
                            case 'Direct Materials':
                              columns.push(
                                { header: 'Item', key: 'name' },
                                { header: 'Concentration (Kg)', key: 'concentration' },
                                { header: 'Price/Kg', key: 'pricePerKg' },
                                { header: 'Total Cost', key: 'totalCost' },
                                { header: 'Solution', key: 'solution' }
                              );
                              break;
                            case 'Packaging Materials':
                              columns.push(
                                { header: 'Item', key: 'name' },
                                { header: 'Quantity', key: 'qty' },
                                { header: 'Unit Price', key: 'unitPrice' },
                                { header: 'Total Cost', key: 'totalCost' },
                                { header: 'Solution', key: 'solution' }
                              );
                              break;
                            case 'Direct Labor':
                              columns.push(
                                { header: 'Role', key: 'name' },
                                { header: 'Hours', key: 'hours' },
                                { header: 'Hourly Rate', key: 'hourlyRate' },
                                { header: 'Total Cost', key: 'totalCost' },
                                { header: 'Solution', key: 'solution' }
                              );
                              break;
                            case 'Overhead':
                              columns.push(
                                { header: 'Item', key: 'name' },
                                { header: 'Total Cost', key: 'totalCost' },
                                { header: 'Basis', key: 'basis' },
                                { header: 'Cost per Unit', key: 'cost' },
                                { header: 'Solution', key: 'solution' }
                              );
                              break;
                            case 'Other Costs':
                              columns.push(
                                { header: 'Item', key: 'name' },
                                { header: 'Quantity', key: 'qty' },
                                { header: 'Unit Price', key: 'unitPrice' },
                                { header: 'Total Cost', key: 'totalCost' },
                                { header: 'Solution', key: 'solution' }
                              );
                              break;
                          }
                          return columns.map((column, idx) => (
                            <Table.ColumnHeaderCell key={idx} style={tableHeaderStyle}>
                              {column.header}
                            </Table.ColumnHeaderCell>
                          ));
                        })()}
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {getDetailsByCategory(dialogCategory).map((item, index) => {
                        const concentration = dialogCategory === 'Direct Materials' ? 
                          (item.originalConcentrationKg !== undefined ? item.originalConcentrationKg : item.concentrationKg) : 
                          null;
                        
                        const unitPrice = dialogCategory === 'Direct Materials' ? 
                          (item.originalPricePerKg !== undefined ? item.originalPricePerKg : item.pricePerKg) :
                          dialogCategory === 'Direct Labor' ? 
                          (item.originalHourlyRate !== undefined ? item.originalHourlyRate : item.hourlyRate) : 
                          (item.originalUnitPrice !== undefined ? item.originalUnitPrice : item.unitPrice);

                        const totalCost = calculateActualCost(item);

                        return (
                          <Table.Row key={index}>
                            <Table.RowHeaderCell style={tableRowHeaderStyle}>{item.name}</Table.RowHeaderCell>
                            
                            {dialogCategory === 'Direct Materials' && (
                              <>
                                <Table.Cell style={tableCellStyle}>
                                  {formatNumber(concentration || 0, 6, true)}
                                </Table.Cell>
                                <Table.Cell style={tableCellStyle}>
                                  {autoMode ? (
                                    unitPrice ? formatCurrency(unitPrice, currency) : '-'
                                  ) : (
                                    <input
                                      type="number"
                                      value={unitPrice || 0}
                                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        const value = parseFloat(e.target.value) || 0;
                                        if (dialogCategory === 'Direct Materials') item.pricePerKg = value;
                                        updateCategoryTotals(dialogCategory, {...data});
                                      }}
                                      style={{ 
                                        width: '80px',
                                        padding: '6px 10px',
                                        borderRadius: '6px',
                                        border: '1px solid #e2e8f0',
                                        backgroundColor: 'white',
                                        fontSize: '14px'
                                      }}
                                    />
                                  )}
                                </Table.Cell>
                              </>
                            )}
                            
                            {dialogCategory === 'Packaging Materials' && (
                              <>
                                <Table.Cell style={tableCellStyle}>
                                  {autoMode ? (
                                    (item.originalQty !== undefined ? item.originalQty : item.qty)?.toString() || '-'
                                  ) : (
                                    <input
                                      type="number"
                                      value={item.qty || 0}
                                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        const value = parseFloat(e.target.value) || 0;
                                        item.qty = value;
                                        updateCategoryTotals(dialogCategory, {...data});
                                      }}
                                      style={{ 
                                        width: '80px',
                                        padding: '6px 10px',
                                        borderRadius: '6px',
                                        border: '1px solid #e2e8f0',
                                        backgroundColor: '#f9fafb',
                                        fontSize: '14px'
                                      }}
                                    />
                                  )}
                                </Table极ell>
                                <Table.Cell style={tableCellStyle}>
                                  {autoMode ? (
                                    unitPrice ? formatCurrency(unitPrice, currency) : '-'
                                  ) : (
                                    <input
                                      type="number"
                                      value={unitPrice || 0}
                                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        const value = parseFloat(e.target.value) || 0;
                                        if (item.unitPrice !== undefined) item.unitPrice = value;
                                        updateCategoryTotals(dialogCategory, {...data});
                                      }}
                                      style={{ 
                                        width: '80px',
                                        padding: '6px 10px',
                                        borderRadius: '6px',
                                        border: '1px solid #e2e8f0',
                                        backgroundColor: 'white',
                                        fontSize: '14px'
                                      }}
                                    />
                                  )}
                                </Table.Cell>
                              </>
                            )}
                            
                            {dialogCategory === 'Direct Labor' && (
                              <>
                                <Table.Cell style={tableCell极yle}>
                                  {autoMode ? (
                                    formatNumber(item.originalHours !== undefined ? item.originalHours : item.hours || 0, 2)
                                  ) : (
                                    <input
                                      type="number"
                                      value极item.hours || 0}
                                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        const value = parseFloat(e.target.value) || 0;
                                        item.hours = value;
                                        updateCategoryTotals(dialogCategory, {...data});
                                      }}
                                      style={{ 
                                        width: '80px',
                                        padding: '6px 10px',
                                        borderRadius: '6px',
                                        border: '1px solid #e2e8f0',
                                        backgroundColor: '#f9fafb',
                                        fontSize: '14px'
                                      }}
                                    />
                                  )}
                                </Table.Cell>
                                <Table.Cell style={tableCellStyle}>
                                  {autoMode ? (
                                    unitPrice ? formatCurrency(unitPrice, currency) : '-'
                                  ) : (
                                    <input
                                      type="number"
                                      value={unitPrice || 0}
                                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        const value = parseFloat(e.target.value) || 0;
                                        if (dialogCategory === 'Direct Labor') item.hourlyRate = value;
                                        updateCategoryTotals(dialogCategory, {...data});
                                      }} style={{ 
                                        width: '80px',
                                        padding: '6px 极0px',
                                        borderRadius: '6px',
                                        border: '1px solid #e2e8f0',
                                        backgroundColor: 'white',
                                        fontSize: '14px'
                                      }}
                                    />
                                  )}
                                </Table.Cell>
                              </>
                            )}
                            
                            {dialogCategory === 'Overhead' && (
                              <>
                                <Table.Cell style={tableCellStyle}>
                                  {formatCurrency(item.totalCost || 0, currency)}
                                </Table.Cell>
                                <Table.Cell style={tableCellStyle}>
                                  {item.basis}
                                </Table.Cell>
                                <Table.Cell style={tableCellStyle}>
                                  {autoMode ? (
                                    formatCurrency(item.cost || 0, currency)
                                  ) : (
                                    <input
                                      type="number"
                                      value={item.cost || 0}
                                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        const value = parseFloat(e.target.value) || 0;
                                        item.c极st = value;
                                        updateCategoryTotals(dialogCategory, {...data});
                                      }}
                                      style={{ 
                                        width: '80px',
                                        padding: '6px 10px',
                                        borderRadius: '6px',
                                        border: '1px solid #e2e8f0',
                                        backgroundColor: 'white',
                                        fontSize: '14px'
                                      }}
                                    />
                                  )}
                                </Table.Cell>
                              </>
                            )}
                            
                            <Table.Cell style={tableCellStyle}>{formatCurrency(totalCost, currency)}</Table.Cell>
                            <Table.Cell style={tableCellStyle}>
                              <RadixSelect.Root
                                value={solutions[dialogCategory]?.[index] || ''}
                                onValueChange={(value) => handleSolutionSelect(dialogCategory, index, value)}
                              >
                                <RadixSelect.Trigger 
                                  aria-label="Select solution" 
                                  style={{
                                    backgroundColor: 'white',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '6px',
                                    padding: '6px 12px',
                                    fontSize: '0.875rem'
                                  }}
                                />
                                <RadixSelect.Content style={{
                                  backgroundColor: 'white',
                                  borderRadius: '6px',
                                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                }}>
                                  {solutionsOptions.map((sol) => (
                                    <RadixSelect.Item 
                                      key={sol} 
                                      value={sol}
                                      style={{
                                        padding: '8px 12px',
                                        fontSize: '0.875rem'
                                      }}
                                    >
                                      {sol}
                                    </RadixSelect.Item>
                                  ))}
                                </RadixSelect.Content>
                              </RadixSelect.Root>
                            </Table.Cell>
                          </Table.Row>
                        );
                      })}
                    </Table.Body>
                  </Table.Root>
                </Tabs.Content>

                <Tabs.Content value="target">
                  <Table.Root variant="surface">
                    <Table.Header style={{ backgroundColor: '#f3f4f6' }}>
                      <Table.Row>
                        <Table.ColumnHeaderCell style={tableHeaderStyle}>Item</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell style={tableHeaderStyle}>Target Qty</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell style={tableHeaderStyle}>Target Price</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell style={tableHeaderStyle}>Potential Savings</Table.ColumnHeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {getDetailsByCategory(dialogCategory).map((item, index) => {
                        const currentQty = dialogCategory === 'Direct Materials' ? item.concentrationKg || 0 :
                                        dialogCategory === 'Direct Labor' ? item.hours || 0 : item.qty || 0;
                        
                        const currentPrice = dialogCategory === 'Direct Materials' ? item.pricePerKg || 0 :
                                          dialogCategory === 'Direct Labor' ? item.hourlyRate || 0 : item.unitPrice || 0;

                        return (
                          <Table.Row key={index}>
                            <Table.RowHeaderCell style={tableRowHeaderStyle}>{item.name}</Table.RowHeaderCell>

                            <Table.Cell style={tableCellStyle}>
                              <input
                                type="number"
                                value={item.targetQty || ''}
                                onChange={(e) => updateTargetValues(
                                  dialogCategory, 
                                  index, 
                                  'targetQty', 
                                  parseFloat(e.target.value) || 0
                                )}
                                step="0.0001"
                                min="0"
                                style={{ 
                                  width: '80px',
                                  padding: '6px 10px',
                                  borderRadius: '6px',
                                  border: '1px solid #e2e8f0',
                                  backgroundColor: '#f9fafb',
                                  fontSize: '14px'
                                }}
                              />
                            </Table.Cell>
                            <Table.Cell style={tableCellStyle}>
                              <input
                                type="number"
                                value={item.targetPrice || ''}
                                onChange={(e) => updateTargetValues(
                                  dialogCategory, 
                                  index, 
                                  'targetPrice', 
                                  parseFloat(e.target.value) || 0
                                )}
                                step="0.01"
                                min="0"
                                style={{ 
                                  width: '80px',
                                  padding: '6px 10px',
                                  borderRadius: '6px',
                                  border: '1px solid #e2e8f0',
                                  backgroundColor: '#f9fafb',
                                  fontSize: '14px'
                                }}
                              />
                            </Table.Cell>
                            <Table.Cell style={{ 
                              ...tableCellStyle,
                              color: calculateActualCost(item) - calculateCostAfter(item) > 0 ? '#10b981' : '#6b7280',
                              fontWeight: 'bold'
                            }}>
                              {formatCurrency(calculateActualCost(item) - calculateCostAfter(item), currency)}
                            </Table.Cell>
                          </Table.Row>
                        );
                      })}
                    </Table.Body>
                  </Table.Root>
                </Tabs.Content>

                <Tabs.Content value="costAfter">
                  <CostAfterView 
                    category={dialogCategory} 
                    data={data} 
                    updateCostAfterValue={updateCostAfterValue}
                    formatCurrency={formatCurrency}
                    currency={currency}
                    getDetailsByCategory={getDetails极Category}
                    calculateActualCost={calculateActualCost}
                    calculateCostAfter={calculateCostAfter}
                  />
                </Tabs.Content>
              </Box>
            </Tabs.Root>

            <Flex justify="end" gap="3" mt="4">
              <Button 
                style={{ 
                  backgroundColor: '#10b981', 
                  color: '#fff',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontWeight: 'bold'
                }}
                onClick={() => handleSubmitDialog(dialogCategory)}
              >
                Submit
              </Button>
              <Button
                variant="ghost"
                style={{ 
                  backgroundColor: '#3b82f6', 
                  color: '#fff',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontWeight: 'bold'
                }}
                onClick={() => setDialogCategory(null)}
              >
                Close
              </Button>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      )}

      {/* Supplier selection dialog */}
      {selectedSolution && (
        <Dialog.Root open onOpenChange={() => setSelectedSolution(null)}>
          <Dialog.Content style={{ 
            maxWidth: '1200px',
            width: '95vw', 
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            border: '1px solid #e5e7eb',
            backgroundColor: 'white',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <Dialog.Title style={{ 
              fontSize: '1.8rem',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '20px',
              textAlign: 'center',
              paddingBottom: '15px',
              borderBottom: '2px solid #f1f5f9'
            }}>
              Supplier Selection for {getDetailsByCategory(selectedSolution.category)[selectedSolution.index]?.name}
            </Dialog.Title>
            
            <Flex direction="column" gap="6">
              <Grid columns="2" gap="5">
                <Card style={{
                  borderRadius: '10px',
                  backgroundColor: '#f8fafc',
                  padding: '20px',
                  border: '1px solid #e2e8f0'
                }}>
                  <Text weight="bold" size="4极 style={{ color: '#1f2937', marginBottom: '12px' }}>
                    📊 Current Situation
                  </Text>
                  <Flex direction="column" gap="3">
                    <Flex justify="between" align="center">
                      <Text style={{ color: '#4b5563', fontSize: '1rem' }}>Current Price/kg:</Text>
                      <Text style={{ color: '#1f2937', fontWeight: 'bold', fontSize: '1.1rem' }}>
                        {formatCurrency(currentPrice, currency)}
                      </Text>
                    </Flex>
                    <Flex justify="between" align="center">
                      <Text style={{ color: '#4b5563', fontSize: '1rem' }}>Selected Supplier Price:</极ext>
                      <Text style={{ 
                        color: potentialSavings > 0 ? '#10b981' : '#6b7280',
                        fontWeight: 'bold',
                        fontSize: '1.1rem'
                      }}>
                        {suppliers.find(s => s.selected) ? 
                          formatCurrency(suppliers.find(s => s.selected)!.pricePerKg, currency) : 
                          'Not selected'
                        }
                      </Text>
                    </Flex>
                  </Flex>
                </Card>
                
                <Card style={{
                  borderRadius: '10px',
                  backgroundColor: '#f0fdf4',
                  padding: '20px',
                  border: '1px solid #bbf7d0'
                }}>
                  <Text weight="bold" size="4" style={{ color: '#166534', marginBottom: '12px' }}>
                    💰 Potential Savings
                  </Text>
                  <Flex direction="column" gap极3">
                    <Flex justify="between" align="center">
                      <Text style={{ color: '#4b5563', fontSize: '1rem' }}>Savings per kg:</Text>
                      <Text style={{ 
                        color: potentialSavings > 0 ? '#10b981' : '#6b7280',
                        fontWeight: 'bold',
                        fontSize: '1.1rem'
                      }}>
                        {formatCurrency(potentialSavings, currency)}
                      </Text>
                    </Flex>
                    <Flex justify="between" align="center">
                      <Text style={{ color: '#4b5563', fontSize: '1rem' }}>Savings percentage:</Text>
                      <Text style={{ 
                        color: potentialSavings > 0 ? '#10b981' : '#6b7280',
                        fontWeight: 'bold',
                        fontSize: '1.1rem'
                      }}>
                        {currentPrice > 0 ? `${((potentialSavings / currentPrice) * 100).toFixed(1)}%` : '0%'}
                      </Text>
                    </Flex>
                  </Flex>
                </Card>
              </Grid>

              <Flex justify="center">
                <Button 
                  onClick={autoSelectBestSupplier}
                  size="3"
                  variant="solid"
                  style={{
                    backgroundColor: '#10b981',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    fontSize: '1rem'
                  }}
                >
                  🚀 Auto Select Best Supplier
                </Button>
              </Flex>

              {isLoading ? (
                <Flex justify="center" align="center" style={{ height: '300px' }}>
                  <Flex direction="column" align="center" gap="3">
                    <Text size="4" weight="bold">Loading supplier data...</Text>
                    <Spinner size="3" />
                  </Flex>
                </Flex>
              ) : (
                <>
                  <Card style={{
                    borderRadius: '10px',
                    backgroundColor: 'white',
                    padding: '20px',
                    height: '400px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.08)',
                    marginBottom: '25px'
                  }}>
                    <Heading size="4" mb="4" style={{ 
                      color: '#1f2937',
                      fontWeight: 'bold',
                      textAlign: 'center'
                    }}>
                      Supplier Comparison - Key Metrics
                    </Heading>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={suppliers.map(s => ({
                          name: s.name,
                          price: s.pricePerKg,
                          compliance: s.complianceScore,
                          totalScore: s.score,
                          selected: s.selected
                        }))}
                        margin={{ top: 25, right: 30, left: 20, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          dataKey="name" 
                          tick={{ fill: '#4b5563', fontSize: 12 }}
                          axisLine={{ stroke: '#e5e7eb' }}
                        />
                        <YAxis 
                          yAxisId="left"
                          orientation="left"
                          tick={{ fill: '#4b5563', fontSize: 12 }}
                          axisLine={{ stroke: '#e5e7eb' }}
                          label={{ 
                            value: 'Price (Currency)', 
                            angle: -90, 
                            position: 'insideLeft',
                            style: { textAnchor: 'middle', fill: '#3b82f6' } 
                          }}
                        />
                        <YAxis 
                          yAxisId="right"
                          orientation="right"
                          domain={[0, 200]}
                          tick={{ fill: '#4b5563', fontSize: 12 }}
                          axisLine={{ stroke: '#e5e7eb' }}
                          label={{ 
                            value: 'Scores', 
                            angle: 90, 
                            position: 'insideRight',
                            style极 { textAnchor: 'middle', fill: '#f59e0b' } 
                          }}
                        />
                        <Tooltip 
                          formatter={(value, name) => {
                            if (name === 'price') return [`${formatCurrency(Number(value), currency)}`, 'Price/kg'];
                            if (name === 'compliance') return [`${value}/100`, 'Compliance Score'];
                            if (name === 'totalScore') return [`${value}/200`, 'Total Score'];
                            return [value, name];
                          }}
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            boxShadow: '0 4px 10px rgba极0,0,0,0.15)',
                            fontSize: '1rem'
                          }}
                        />
                        <Legend />
                        <Bar 
                          yAxisId="left"
                          dataKey="price" 
                          name="Price/kg" 
                          fill="#3b82f6"
                          barSize={30}
                          radius={[5, 5, 0, 0]}
                        >
                          {suppliers.map((supplier, index) => (
                            <Cell 
                              key={`price-cell-${index}`} 
                              fill={supplier.selected ? '#10b981' : '#3b82f6'}
                              stroke={supplier.selected ? '#059669' : '#3b82f6'}
                              strokeWidth={supplier.selected ? 2 : 0}
                            />
                          ))}
                        </Bar>
                        <Bar 
                          yAxisId="right"
                          dataKey="compliance" 
                          name="Compliance Score" 
                          fill="#8b5cf6"
                          barSize={30}
                          radius={[5, 5, 0, 0]}
                        >
                          {suppliers.map((supplier, index) => (
                            <Cell 
                              key={`compliance-cell-${index}`} 
                              fill={supplier.selected ? '#10b981' : '#8b5cf6'}
                              stroke={supplier.selected ? '#059669' : '#8b5cf6'}
                              strokeWidth={supplier.selected ? 2 : 0}
                            />
                          ))}
                        </Bar>
                        <Bar 
                          yAxisId="right"
                          dataKey="totalScore" 
                          name="Total Score" 
                          fill="#ec4899"
                          barSize={30}
                          radius={[5, 5, 0, 0]}
                        >
                          {suppliers.map((supplier, index) => (
                            <Cell 
                              key={`totalScore-cell-${index}`} 
                              fill={supplier.selected ? '#10b981' : '#ec4899'}
                              stroke={supplier.selected ? '#059669' : '#ec4899'}
                              strokeWidth={supplier.selected ? 2 : 0}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                    
                    {/* Chart color key */}
                    <Flex justify="center" gap="4" mt="4" wrap="wrap">
                      <Flex align="center" gap="2">
                        <Box style={{ width: '14px', height: '14px', backgroundColor: '#3b82f6', borderRadius: '3px' }}></Box>
                        <Text size="2">Price/kg</Text>
                      </Flex>
                      <Flex align="center" gap="2">
                        <Box style={{ width: '14px', height: '14px', backgroundColor: '#8b5cf6', borderRadius: '3px' }}></Box>
                        <Text size="2">Compliance Score</Text>
                      </Flex>
                      <Flex align="center" gap="2">
                        <极ox style={{ width: '14px', height: '14px', backgroundColor: '#ec4899', borderRadius: '3px' }}></Box>
                        <Text size="2">Total Score</Text>
                      </Flex>
                      <Flex align="center" gap="2">
                        <Box style={{ width: '14px', height: '14px', backgroundColor: '#10b981', border: '2px solid #059669', borderRadius: '3px' }}></Box>
                        <Text size="2">Selected Supplier</Text>
                      </Flex>
                    </Flex>
                  </Card>

                  <Card style={{
                    borderRadius: '10px',
                    backgroundColor: 'white',
                    padding: '20px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.08)',
                  }}>
                    <div style={{ overflowX: 'auto' }}>
                      <Table.Root size="2">
                        <Table.Header style={{ 
                          backgroundColor: '#f1f5f9',
                        }}>
                          <Table.Row>
                            <Table.ColumnHeaderCell style={{
                              fontWeight: 'bold',
                              padding: '12px',
                              fontSize: '1rem',
                              color: '#1e293b',
                              whiteSpace: 'nowrap'
                            }}>Supplier</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell style={{
                              fontWeight: 'bold',
                              padding: '12px',
                              fontSize: '1rem',
                              color: '#1e293b',
                              whiteSpace: 'nowrap'
                            }}>Price/kg</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell style={{
                              fontWeight: 'bold',
                              padding: '12px',
                              fontSize: '1rem',
                              color: '1e293b',
                              whiteSpace: 'nowrap'
                            }}>Rating</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell style={{
                              fontWeight: 'bold',
                              padding: '12px',
                              fontSize: '1rem',
                              color: '#1e293b',
                              whiteSpace: 'nowrap'
                            }}>Delivery</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell style={{
                              fontWeight: 'bold',
                              padding: '12px',
                              fontSize: '1rem',
                              color: '#1e293b',
                              whiteSpace: 'nowrap'
                            }}>Reliability</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell style={{
                              fontWeight: 'bold',
                              padding: '12px',
                              fontSize: '1rem',
                              color: '#1e293b',
                              whiteSpace: 'nowrap'
                            }}>Compliance</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell style={{
                              fontWeight: 'bold',
                              padding: '12px',
                              fontSize: '1rem',
                              color: '#1e293b',
                              whiteSpace: 'nowrap'
                            }}>Total Score</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell style={{
                              fontWeight: 'bold',
                              padding: '12px',
                              fontSize: '1rem',
                              color: '#1e293b',
                              whiteSpace: 'nowrap'
                            }}>Select</Table.ColumnHeaderCell>
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          {suppliers.map((supplier, index) => (
                            <Table.Row 
                              key={supplier.id} 
                              style={{
                                backgroundColor: hoveredRow === index ? '#f8fafc' : 
                                                (supplier.selected ? '#f0fdf4' : 
                                                (index % 2 === 0 ? '#fafafa' : 'white')),
                              }}
                              onMouseEnter={() => setHoveredRow(index)}
                              onMouseLeave={() => setHoveredRow(null)}
                            >
                              <Table.Cell style={{
                                padding: '12px',
                                fontWeight: supplier.selected ? '600' : '400',
                                color: supplier.selected ? '#059669' : '#334155',
                                fontSize: '1rem',
                                whiteSpace: 'nowrap'
                              }}>
                                <Flex align="center" gap="2">
                                  {supplier.selected && (
                                    <Badge color="green" variant="solid" style={{ padding: '2px 6px', fontSize: '0.8rem' }}>
                                      ✓
                                    </Badge>
                                  )}
                                  {supplier.name}
                                </Flex>
                              </Table.Cell>
                              <Table.Cell style={{
                                padding: '12px',
                                fontWeight: '500',
                                color: '#334155',
                                fontSize: '1rem',
                                whiteSpace: 'nowrap'
                              }}>
                                {formatCurrency(supplier.pricePerKg, currency)}
                              </Table.Cell>
                              <Table.Cell style={{
                                padding: '12px',
                                fontSize: '1rem',
                                whiteSpace: 'nowrap'
                              }}>
                                <Flex align="center" gap="2">
                                  <span style={{ 
                                    color: '#f59e0b',
                                    fontSize: '16px'
                                  }}>
                                    ★
                                  </span>
                                  <Text style={{ color: '#64748b' }}>
                                    {supplier.rating}
                                  </Text>
                                </Flex>
                              </Table.Cell>
                              <Table.Cell style={{
                                padding: '12px',
                                color: '#475569',
                                fontSize: '1rem',
                                whiteSpace: 'nowrap'
                              }}>{supplier.delivery}</Table.Cell>
                              <Table.Cell style={{
                                padding: '12px',
                                color: '#475569',
                                fontSize: '1rem',
                                whiteSpace: 'nowrap'
                              }}>{supplier.reliability}</Table.Cell>
                              <Table.Cell 
                                style={{
                                  padding: '12px',
                                  fontWeight: 'bold',
                                  color: supplier.complianceScore > 80 ? '#10b981' : 
                                        supplier.complianceScore > 60 ? '#f59e0b' : '#ef4444',
                                  cursor: 'pointer',
                                  fontSize: '1rem',
                                  whiteSpace: 'nowrap'
                                }}
                                onClick={() => {
                                  setComplianceTooltip({
                                    visible: true,
                                    x: 0,
                                    y: 0,
                                    supplier: supplier
                                  });
                                }}
                              >
                                {supplier.complianceScore}/100
                              </Table.Cell>
                              <Table.Cell style={{
                                padding: '12px',
                                fontWeight: 'bold',
                                color: supplier.score > 200 ? '#10b981' : 
                                      supplier.score > 150 ? '#f59e0b' : '#ef4444',
                                fontSize: '1rem',
                                whiteSpace: 'nowrap'
                              }}>
                                {supplier.score}/200
                              </Table.Cell>
                              <Table.Cell style={{
                                padding: '12px',
                                whiteSpace: 'nowrap'
                              }}>
                                <Button
                                  size="2"
                                  variant={supplier.selected ? 'solid' : 'outline'}
                                  onClick={() => handleSupplierSelect(supplier.id)}
                                  style={{
                                    borderRadius: '6px',
                                    padding: '6px 12px',
                                    fontSize: '0.9rem',
                                    backgroundColor: supplier.selected ? '#10b981' : 'white',
                                    color: supplier.selected ? 'white' : '#1f2937',
                                    borderColor: supplier.selected ? '#10b981' : '#e5e7eb',
                                    fontWeight: 'bold',
                                    width: '100%',
                                  }}
                                >
                                  {supplier.selected ? 'Selected' : 'Select'}
                                </Button>
                              </Table.Cell>
                            </Table.Row>
                          ))}
                        </Table.Body>
                      </Table.Root>
                    </div>
                  </Card>
                </>
              )}

              <Flex justify="end" gap="3" mt="4">
                <Button 
                  variant="solid"
                  onClick={() => {
                    const selectedSupplier = suppliers.find(s => s.selected);
                    if (selectedSupplier && selectedSolution) {
                      const items = [...getDetailsByCategory(selectedSolution.category)];
                      items[selectedSolution.index].pricePerKg = selectedSupplier.pricePerKg;
                      setData(prev => ({
                        ...prev,
                        rawMaterials: [...prev.rawMaterials]
                      }));
                      updateCategoryTotals(selectedSolution.category, {...data});
                    }
                    setSelectedSolution(null);
                  }}
                  style={{
                    backgroundColor: '#2563eb',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    fontSize: '1rem'
                  }}
                  disabled={!suppliers.find(s => s.selected)}
                >
                  💾 Apply Changes
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedSolution(null)}
                  style={{
                    backgroundColor: '#f3f4f6',
                    color: '#1f2937',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    fontSize: '1rem'
                  }}
                >
                  ❌ Cancel
                </Button>
              </Flex>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      )}

      {/* Compliance tooltip dialog */}
      {complianceTooltip.visible && complianceTooltip.supplier && (
        <EnhancedComplianceDisplay supplier={complianceTooltip.supplier} />
      )}

      {/* Charts section */}
      <Grid columns={{ initial: '1', md: '2' }} gap="4" mb="6">
        <Card style={{
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          backgroundColor: 'white',
          padding: '16px',
          height: '350px'
        }}>
          <Flex direction="column" height="100%">
            <Heading size="4" mb="3" align="center" style={cardTitleStyle}>
              Cost Breakdown
            </Heading>
            <ResponsiveContainer width="100%" height="100%">
              <极ieChart>
                <Pie
                  data={categories.map((category) => ({
                    name: category,
                    value: getDetailsByCategory(category).reduce(
                      (sum, item) => sum + calculateActualCost(item), 0
                    ),
                  }))}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                  labelLine={false}
                >
                  {categories.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value, currency)}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Flex>
        </Card>

        <Card style={{
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          backgroundColor: 'white',
          padding: '16px',
          height: '350px'
        }}>
          <Flex direction="column" height="100%">
            <Heading size="4" mb="3" align="center" style={cardTitleStyle}>
              Cost Gap Calculation
            </Heading>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={costGapDataWithGap}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Actual Cost"
                />
                <Line 
                  type="monotone" 
                  dataKey="benchmark" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Benchmark Price"
                />
                <Line 
                  type="monotone" 
                  dataKey="targetCost" 
                  stroke="#10b981" 
                  strokeWidth极2}
                  strokeDasharray="3 4 5 2"
                  name="Target Cost"
                />
                <Line 
                  type="monotone" 
                  dataKey="gap" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="Cost Gap"
                />
              </LineChart>
            </ResponsiveContainer>
          </Flex>
        </Card>

        <Card style={{
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          backgroundColor: 'white',
          padding: '16px',
          gridColumn: '1 / -1',
          height: '350px'
        }}>
          <Flex direction="column" height="100%">
            <Heading size="4" mb="3" align="center" style={cardTitleStyle}>
              Cost Gap Analysis
            </Heading>
            <Text align="center" mb="2" size="2">
              Total Cost Gap: {formatCurrency(
                categories.reduce((sum, category) => 
                  sum + getDetailsByCategory(category).reduce(
                    (catSum, item) => catSum + calculateActualCost(item), 0
                  ), 0) - targetCost, 
                currency
              )}
            </Text>
            <ResponsiveContainer width="极0%" height="100%">
              <BarChart
                data={categories.map(category => ({
                  name: category,
                  actual: getDetailsByCategory(category).reduce(
                    (sum, item) => sum + calculateActualCost(item), 0
                  ),
                  target: totals[category].budget,
                  gap: getDetailsByCategory(category).reduce(
                    (sum, item) => sum + calculateActualCost(item), 0
                  ) - totals[category].budget
                }))}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value, currency)}
                />
                <Legend />
                <Bar dataKey="actual" fill="#3b82f6" name="Actual Cost极 />
                <Bar dataKey="target" fill="#10b981" name="Target Cost" />
              </BarChart>
            </ResponsiveContainer>
          </Flex>
        </Card>
      </Grid>

      {/* Submit to blockchain button */}
      <Flex justify="end" mt="6">
        <Button 
          size="2" 
          style={{ 
            backgroundColor: '#10b981', 
            color: '#fff', 
            fontWeight: 'bold',
            padding: '12px 24px',
            borderRadius: '6px'
          }}
          onClick={handleSubmitToBlockchain}
        >
          <UploadIcon style={{ marginRight: '8px' }} />
          Submit to Blockchain
        </Button>
      </Flex>
    </Box>
  );
}

export default CostAnalytics;
