import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Card,
  Flex,
  Grid,
  Heading,
  Table,
  Badge,
  Button,
  Text,
  Box,
  Dialog,
  TextField,
  Select,
  DropdownMenu,
  AlertDialog
} from '@radix-ui/themes';
import { 
  BarChart, 
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
  ReferenceLine
} from 'recharts';
import { toast } from 'sonner';
import { Toaster } from 'sonner';

const SupplierManagement = () => {
  const { t } = useTranslation('suppliers');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [isBlockchainDialogOpen, setIsBlockchainDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [suppliers, setSuppliers] = useState([
    { 
      id: 1, 
      name: 'Supplier A', 
      contact: 'contact@supplierA.com', 
      location: 'Europe', 
      leadTime: 14, 
      compliance: 'certified', 
      rating: 4.8,
      orderVolume: 24500,
      onTimeDelivery: 98,
      qualityRating: 4.9,
      contracts: ['2023 Master Agreement'],
      riskScore: 12
    },
    { 
      id: 2, 
      name: 'Supplier B', 
      contact: 'orders@supplierB.com', 
      location: 'North America', 
      leadTime: 21, 
      compliance: 'pending', 
      rating: 4.3,
      orderVolume: 18200,
      onTimeDelivery: 92,
      qualityRating: 4.5,
      contracts: [],
      riskScore: 28
    },
    { 
      id: 3, 
      name: 'Supplier C', 
      contact: 'support@supplierC.com', 
      location: 'Asia', 
      leadTime: 30, 
      compliance: 'non-compliant', 
      rating: 3.9,
      orderVolume: 15600,
      onTimeDelivery: 85,
      qualityRating: 4.0,
      contracts: ['2024 Quarterly Contract'],
      riskScore: 42
    },
  ]);

  const performanceData = [
    { month: t('jan'), orders: 245, deliveries: 240 },
    { month: t('feb'), orders: 278, deliveries: 275 },
    { month: t('mar'), orders: 312, deliveries: 308 },
    { month: t('apr'), orders: 298, deliveries: 295 },
    { month: t('may'), orders: 331, deliveries: 328 },
    { month: t('jun'), orders: 356, deliveries: 352 },
  ];

  const regions = [t('all-regions'), t('north-america'), t('europe'), t('asia'), t('middle-east')];

  const filteredSuppliers = suppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedStatus === 'all' || supplier.compliance === selectedStatus) &&
    (selectedRegion === 'all' || supplier.location === selectedRegion)
  );

  // Enhanced risk data for visualization
  const riskData = suppliers.map(supplier => ({
    name: supplier.name,
    leadTime: supplier.leadTime,
    delivery: supplier.onTimeDelivery,
    quality: supplier.qualityRating,
    risk: supplier.riskScore,
    size: supplier.orderVolume / 1000 // Scale for bubble size
  }));

  const handleComplianceUpdate = (id: number, newStatus: string) => {
    setSuppliers(suppliers.map(supplier => 
      supplier.id === id ? { ...supplier, compliance: newStatus } : supplier
    ));
    toast.success(t('compliance-updated'));
  };

  const submitToBlockchain = async () => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Supplier data submitted to blockchain successfully!');
    } catch (error) {
      toast.error('Failed to submit data to blockchain');
    } finally {
      setIsSubmitting(false);
      setIsBlockchainDialogOpen(false);
    }
  };

  return (
    <Box p="6">
      <Toaster position="top-right" />
      
      <Flex justify="between" align="center" mb="5">
        <Heading size="6">{t('supplier-management')}</Heading>
        <Flex gap="3">
          <TextField.Root
            placeholder={t('search-suppliers')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select.Root value={selectedRegion} onValueChange={setSelectedRegion}>
            <Select.Trigger placeholder={t('select-region')} />
            <Select.Content>
              {regions.map(region => (
                <Select.Item key={region} value={region}>{region}</Select.Item>
              ))}
            </Select.Content>
          </Select.Root>

          {/* Green Submit to Blockchain Button */}
          <Button 
            variant="solid" 
            color="green"
            onClick={() => setIsBlockchainDialogOpen(true)}
          >
            Submit to Blockchain
          </Button>

          <Dialog.Root>
            <Dialog.Trigger>
              <Button>{t('add-supplier')}</Button>
            </Dialog.Trigger>
            <Dialog.Content style={{ maxWidth: 600 }}>
              <Dialog.Title>{t('new-supplier')}</Dialog.Title>
              <Flex direction="column" gap="3" mt="4">
                <Grid columns="2" gap="3">
                  <TextField.Root placeholder={t('supplier-name')} />
                  <TextField.Root placeholder={t('contact-email')} />
                  <Select.Root>
                    <Select.Trigger placeholder={t('region')} />
                    <Select.Content>
                      <Select.Item value="north-america">{t('north-america')}</Select.Item>
                      <Select.Item value="europe">{t('europe')}</Select.Item>
                      <Select.Item value="asia">{t('asia')}</Select.Item>
                    </Select.Content>
                  </Select.Root>
                  <TextField.Root placeholder={t('lead-time')} type="number" />
                </Grid>
                <Flex gap="3" mt="4" justify="end">
                  <Dialog.Close>
                    <Button variant="soft">{t('cancel')}</Button>
                  </Dialog.Close>
                  <Button>{t('save-supplier')}</Button>
                </Flex>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>
        </Flex>
      </Flex>

      {/* Blockchain Submission Dialog */}
      <AlertDialog.Root open={isBlockchainDialogOpen}>
        <AlertDialog.Content style={{ maxWidth: 450 }}>
          <AlertDialog.Title>Submit to Blockchain</AlertDialog.Title>
          <AlertDialog.Description size="2" mb="4">
            Are you sure you want to submit supplier data to the blockchain? This action cannot be undone.
          </AlertDialog.Description>
          <Flex gap="3" mt="4" justify="end">
            <Button 
              variant="soft" 
              color="gray" 
              onClick={() => setIsBlockchainDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="solid" 
              color="green"
              onClick={submitToBlockchain}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Confirm'}
            </Button>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>

      <Grid columns="4" gap="4" mb="5">
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">{t('active-suppliers')}</Text>
            <Heading size="7">80</Heading> {/* Updated to 80 active suppliers */}
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">{t('avg-lead-time')}</Text>
            <Heading size="7">21.7 {t('days')}</Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">{t('on-time-delivery')}</Text>
            <Heading size="7">91.7%</Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">{t('quality-compliance')}</Text>
            <Heading size="7">4.5/5</Heading>
          </Flex>
        </Card>
      </Grid>

      <Flex gap="4" mb="5">
        <Card style={{ flex: 2 }}>
          <Heading size="4" mb="3">{t('order-performance')}</Heading>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="#3b82f6" />
                <Bar dataKey="deliveries" fill="#60a5fa" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        <Card style={{ flex: 1 }}>
          <Heading size="4" mb="3">{t('risk-distribution')}</Heading>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  type="number" 
                  dataKey="leadTime" 
                  name="Lead Time (days)" 
                  unit="d"
                  domain={[0, 40]}
                />
                <YAxis 
                  type="number" 
                  dataKey="delivery" 
                  name="On-Time Delivery %" 
                  unit="%"
                  domain={[80, 100]}
                />
                <ZAxis 
                  type="number" 
                  dataKey="risk" 
                  range={[50, 500]} 
                  name="Risk Score"
                />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Legend />
                <ReferenceLine y={90} stroke="orange" label="Target" />
                <Scatter 
                  name="Suppliers" 
                  data={riskData} 
                  fill="#3b82f6" 
                  shape="circle"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <Flex justify="center" mt="2" gap="3">
            <Flex align="center" gap="1">
              <Box style={{ width: 10, height: 10, backgroundColor: '#3b82f6', borderRadius: '50%' }} />
              <Text size="1">Low Risk</Text>
            </Flex>
            <Flex align="center" gap="1">
              <Box style={{ width: 10, height: 10, backgroundColor: '#60a5fa', borderRadius: '50%' }} />
              <Text size="1">Medium Risk</Text>
            </Flex>
            <Flex align="center" gap="1">
              <Box style={{ width: 10, height: 10, backgroundColor: '#93c5fd', borderRadius: '50%' }} />
              <Text size="1">High Risk</Text>
            </Flex>
          </Flex>
        </Card>
      </Flex>

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>{t('supplier')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('location')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('lead-time')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('compliance')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('performance')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('contracts')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('actions')}</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {filteredSuppliers.map(supplier => (
            <Table.Row key={supplier.id}>
              <Table.Cell>
                <Flex direction="column">
                  <Text weight="bold">{supplier.name}</Text>
                  <Text size="1" color="gray">{supplier.contact}</Text>
                </Flex>
              </Table.Cell>
              <Table.Cell>
                <Badge variant="soft">{t(supplier.location.toLowerCase())}</Badge>
              </Table.Cell>
              <Table.Cell>{supplier.leadTime} {t('days')}</Table.Cell>
              <Table.Cell>
                <Select.Root
                  value={supplier.compliance}
                  onValueChange={(value) => handleComplianceUpdate(supplier.id, value)}
                >
                  <Select.Trigger variant="ghost" />
                  <Select.Content>
                    <Select.Item value="certified">{t('certified')}</Select.Item>
                    <Select.Item value="pending">{t('pending')}</Select.Item>
                    <Select.Item value="non-compliant">{t('non-compliant')}</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Table.Cell>
              <Table.Cell>
                <Flex gap="2">
                  <Badge color={supplier.onTimeDelivery >= 95 ? 'green' : 'yellow'}>
                    {supplier.onTimeDelivery}% {t('delivery')}
                  </Badge>
                  <Badge color={supplier.qualityRating >= 4.5 ? 'green' : 'yellow'}>
                    {supplier.qualityRating}/5 {t('quality')}
                  </Badge>
                </Flex>
              </Table.Cell>
              <Table.Cell>
                {supplier.contracts.length > 0 ? (
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                      <Button variant="soft" size="1">
                        {supplier.contracts.length} {t('contracts')}
                      </Button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                      {supplier.contracts.map(contract => (
                        <DropdownMenu.Item key={contract}>{contract}</DropdownMenu.Item>
                      ))}
                    </DropdownMenu.Content>
                  </DropdownMenu.Root>
                ) : (
                  <Text color="gray">{t('no-contracts')}</Text>
                )}
              </Table.Cell>
              <Table.Cell>
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    <Button variant="ghost">•••</Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content>
                    <DropdownMenu.Item>{t('view-analytics')}</DropdownMenu.Item>
                    <DropdownMenu.Item>{t('edit-details')}</DropdownMenu.Item>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Item color="red">{t('terminate')}</DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <Dialog.Root>
        <Dialog.Trigger>
          <Button variant="soft" style={{ position: 'fixed', bottom: 20, right: 20 }}>
            {t('supply-chain-map')}
          </Button>
        </Dialog.Trigger>
        <Dialog.Content style={{ width: '80vw', height: '80vh' }}>
          <Dialog.Title>{t('global-supply-network')}</Dialog.Title>
          <div className="h-full w-full bg-gray-50 rounded-lg p-4">
            <Flex align="center" justify="center" className="h-full">
              <Text color="gray">{t('map-integration-placeholder')}</Text>
            </Flex>
          </div>
        </Dialog.Content>
      </Dialog.Root>
    </Box>
  );
};

export default SupplierManagement;
