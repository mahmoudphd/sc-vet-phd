import { useState, useMemo } from 'react';
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
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Area
} from 'recharts';
import { toast } from 'sonner';
import { Toaster } from 'sonner';
import { 
  Pencil1Icon, 
  CheckIcon, 
  Cross2Icon,
  CubeIcon,
  EyeOpenIcon
} from '@radix-ui/react-icons';

const SupplierManagement = () => {
  const { t } = useTranslation('suppliers');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [isBlockchainDialogOpen, setIsBlockchainDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [tempData, setTempData] = useState<any>({});
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  
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

  // Calculate dynamic metrics from suppliers data
  const metrics = useMemo(() => {
    const totalSuppliers = suppliers.length;
    const avgLeadTime = suppliers.reduce((sum, supplier) => sum + supplier.leadTime, 0) / totalSuppliers;
    const avgOnTimeDelivery = suppliers.reduce((sum, supplier) => sum + supplier.onTimeDelivery, 0) / totalSuppliers;
    const avgQualityRating = suppliers.reduce((sum, supplier) => sum + supplier.qualityRating, 0) / totalSuppliers;
    
    return {
      totalSuppliers,
      avgLeadTime: avgLeadTime.toFixed(1),
      avgOnTimeDelivery: avgOnTimeDelivery.toFixed(1),
      avgQualityRating: avgQualityRating.toFixed(1)
    };
  }, [suppliers]);

  const performanceData = [
    { month: 'Jan', orders: 245, deliveries: 240 },
    { month: 'Feb', orders: 278, deliveries: 275 },
    { month: 'Mar', orders: 312, deliveries: 308 },
    { month: 'Apr', orders: 298, deliveries: 295 },
    { month: 'May', orders: 331, deliveries: 328 },
    { month: 'Jun', orders: 356, deliveries: 352 },
  ];

  const regions = ['All Regions', 'North America', 'Europe', 'Asia', 'Middle East'];

  const filteredSuppliers = suppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedStatus === 'all' || supplier.compliance === selectedStatus) &&
    (selectedRegion === 'all' || supplier.location === selectedRegion)
  );

  // Risk distribution data for pie chart - dynamic from suppliers
  const riskDistributionData = useMemo(() => [
    { name: 'Low Risk', value: suppliers.filter(s => s.riskScore < 20).length },
    { name: 'Medium Risk', value: suppliers.filter(s => s.riskScore >= 20 && s.riskScore < 40).length },
    { name: 'High Risk', value: suppliers.filter(s => s.riskScore >= 40).length }
  ], [suppliers]);

  const COLORS = ['#00C49F', '#FFBB28', '#FF8042'];

  // Supplier performance data for bar chart - dynamic from filtered suppliers
  const supplierPerformanceData = useMemo(() => 
    filteredSuppliers.map(supplier => ({
      name: supplier.name,
      delivery: supplier.onTimeDelivery,
      quality: supplier.qualityRating * 20, // Convert to percentage for better visualization
      leadTime: supplier.leadTime
    }))
  , [filteredSuppliers]);

  const handleComplianceUpdate = (id: number, newStatus: string) => {
    setSuppliers(suppliers.map(supplier => 
      supplier.id === id ? { ...supplier, compliance: newStatus } : supplier
    ));
    toast.success('Compliance status updated');
  };

  // Inline editing functions
  const handleEdit = (supplier: any) => {
    setEditingId(supplier.id);
    setTempData({ ...supplier });
  };

  const handleSave = (id: number) => {
    setSuppliers(suppliers.map(s => 
      s.id === id ? { ...s, ...tempData } : s
    ));
    setEditingId(null);
    toast.success('Supplier updated successfully');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTempData({});
  };

  const handleUpdateTempData = (field: string, value: any) => {
    setTempData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleViewDetails = (supplier: any) => {
    setSelectedSupplier(supplier);
    setIsDetailsModalOpen(true);
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

  const renderComplianceBadge = (compliance: string) => {
    switch (compliance) {
      case 'certified':
        return <Badge color="green">Certified</Badge>;
      case 'pending':
        return <Badge color="yellow">Pending</Badge>;
      case 'non-compliant':
        return <Badge color="red">Non-Compliant</Badge>;
      default:
        return <Badge color="gray">Unknown</Badge>;
    }
  };

  return (
    <Box p="6">
      <Toaster position="top-right" />
      
      <Flex justify="between" align="center" mb="5">
        <Heading size="6">Supplier Management</Heading>
        <Flex gap="3">
          <TextField.Root
            placeholder="Search suppliers"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select.Root value={selectedRegion} onValueChange={setSelectedRegion}>
            <Select.Trigger placeholder="Select region" />
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
            style={{ backgroundColor: '#006400' }}
          >
            <CubeIcon /> Submit to Blockchain
          </Button>

          <Dialog.Root>
            <Dialog.Trigger>
              <Button>Add Supplier</Button>
            </Dialog.Trigger>
            <Dialog.Content style={{ maxWidth: 600 }}>
              <Dialog.Title>New Supplier</Dialog.Title>
              <Flex direction="column" gap="3" mt="4">
                <Grid columns="2" gap="3">
                  <TextField.Root placeholder="Supplier name" />
                  <TextField.Root placeholder="Contact email" />
                  <Select.Root>
                    <Select.Trigger placeholder="Region" />
                    <Select.Content>
                      <Select.Item value="north-america">North America</Select.Item>
                      <Select.Item value="europe">Europe</Select.Item>
                      <Select.Item value="asia">Asia</Select.Item>
                    </Select.Content>
                  </Select.Root>
                  <TextField.Root placeholder="Lead time" type="number" />
                </Grid>
                <Flex gap="3" mt="4" justify="end">
                  <Dialog.Close>
                    <Button variant="soft">Cancel</Button>
                  </Dialog.Close>
                  <Button>Save Supplier</Button>
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
              style={{ backgroundColor: '#006400' }}
            >
              {isSubmitting ? 'Submitting...' : 'Confirm'}
            </Button>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>

      {/* Dynamic Metrics Cards */}
      <Grid columns="4" gap="4" mb="5">
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">Active Suppliers</Text>
            <Heading size="7">{metrics.totalSuppliers}</Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">Avg Lead Time</Text>
            <Heading size="7">{metrics.avgLeadTime} days</Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">On-Time Delivery</Text>
            <Heading size="7">{metrics.avgOnTimeDelivery}%</Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">Quality Compliance</Text>
            <Heading size="7">{metrics.avgQualityRating}/5</Heading>
          </Flex>
        </Card>
      </Grid>

      <Flex gap="4" mb="5">
        <Card style={{ flex: 2 }}>
          <Heading size="4" mb="3">Supplier Performance Comparison</Heading>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={supplierPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="delivery" fill="#3b82f6" name="On-Time Delivery %" />
                <Bar dataKey="quality" fill="#82ca9d" name="Quality Score (%)" />
                <Bar dataKey="leadTime" fill="#ffc658" name="Lead Time (days)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        <Card style={{ flex: 1 }}>
          <Heading size="4" mb="3">Risk Distribution</Heading>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {riskDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <Flex justify="center" mt="2" gap="3">
            <Flex align="center" gap="1">
              <Box style={{ width: 10, height: 10, backgroundColor: '#00C49F', borderRadius: '50%' }} />
              <Text size="1">Low Risk</Text>
            </Flex>
            <Flex align="center" gap="1">
              <Box style={{ width: 10, height: 10, backgroundColor: '#FFBB28', borderRadius: '50%' }} />
              <Text size="1">Medium Risk</Text>
            </Flex>
            <Flex align="center" gap="1">
              <Box style={{ width: 10, height: 10, backgroundColor: '#FF8042', borderRadius: '50%' }} />
              <Text size="1">High Risk</Text>
            </Flex>
          </Flex>
        </Card>
      </Flex>

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Supplier</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Location</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Lead Time</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Compliance</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Performance</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Risk Score</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {filteredSuppliers.map((supplier) => (
            <Table.Row key={supplier.id}>
              <Table.Cell>
                {editingId === supplier.id ? (
                  <TextField.Root
                    value={tempData.name || supplier.name}
                    onChange={(e) => handleUpdateTempData('name', e.target.value)}
                  />
                ) : (
                  <Text weight="bold">{supplier.name}</Text>
                )}
              </Table.Cell>
              <Table.Cell>
                {editingId === supplier.id ? (
                  <Select.Root
                    value={tempData.location || supplier.location}
                    onValueChange={(value) => handleUpdateTempData('location', value)}
                  >
                    <Select.Trigger />
                    <Select.Content>
                      <Select.Item value="North America">North America</Select.Item>
                      <Select.Item value="Europe">Europe</Select.Item>
                      <Select.Item value="Asia">Asia</Select.Item>
                      <Select.Item value="Middle East">Middle East</Select.Item>
                    </Select.Content>
                  </Select.Root>
                ) : (
                  <Badge variant="soft">{supplier.location}</Badge>
                )}
              </Table.Cell>
              <Table.Cell>
                {editingId === supplier.id ? (
                  <TextField.Root
                    type="number"
                    value={tempData.leadTime || supplier.leadTime}
                    onChange={(e) => handleUpdateTempData('leadTime', parseInt(e.target.value))}
                  />
                ) : (
                  `${supplier.leadTime} days`
                )}
              </Table.Cell>
              <Table.Cell>
                {editingId === supplier.id ? (
                  <Select.Root
                    value={tempData.compliance || supplier.compliance}
                    onValueChange={(value) => handleUpdateTempData('compliance', value)}
                  >
                    <Select.Trigger />
                    <Select.Content>
                      <Select.Item value="certified">Certified</Select.Item>
                      <Select.Item value="pending">Pending</Select.Item>
                      <Select.Item value="non-compliant">Non-Compliant</Select.Item>
                    </Select.Content>
                  </Select.Root>
                ) : (
                  renderComplianceBadge(supplier.compliance)
                )}
              </Table.Cell>
              <Table.Cell>
                {editingId === supplier.id ? (
                  <Flex direction="column" gap="2">
                    <TextField.Root
                      type="number"
                      min="0"
                      max="100"
                      placeholder="On-time delivery %"
                      value={tempData.onTimeDelivery || supplier.onTimeDelivery}
                      onChange={(e) => handleUpdateTempData('onTimeDelivery', parseInt(e.target.value))}
                    />
                    <TextField.Root
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      placeholder="Quality rating"
                      value={tempData.qualityRating || supplier.qualityRating}
                      onChange={(e) => handleUpdateTempData('qualityRating', parseFloat(e.target.value))}
                    />
                  </Flex>
                ) : (
                  <Flex direction="column" gap="1">
                    <Badge color={supplier.onTimeDelivery >= 95 ? 'green' : 'yellow'}>
                      {supplier.onTimeDelivery}% Delivery
                    </Badge>
                    <Badge color={supplier.qualityRating >= 4.5 ? 'green' : 'yellow'}>
                      {supplier.qualityRating}/5 Quality
                    </Badge>
                  </Flex>
                )}
              </Table.Cell>
              <Table.Cell>
                <Badge color={
                  supplier.riskScore < 20 ? 'green' : 
                  supplier.riskScore < 40 ? 'yellow' : 'red'
                }>
                  {supplier.riskScore}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <Flex gap="2">
                  {editingId === supplier.id ? (
                    <>
                      <Button size="1" color="green" onClick={() => handleSave(supplier.id)}>
                        <CheckIcon /> Save
                      </Button>
                      <Button size="1" color="red" onClick={handleCancelEdit}>
                        <Cross2Icon /> Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button size="1" onClick={() => handleViewDetails(supplier)}>
                        <EyeOpenIcon /> View
                      </Button>
                      <Button size="1" onClick={() => handleEdit(supplier)}>
                        <Pencil1Icon /> Edit
                      </Button>
                    </>
                  )}
                </Flex>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
    </Table.Root>

      {/* Supplier Details Modal */}
      <Dialog.Root open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <Dialog.Content>
          <Dialog.Title>Supplier Details</Dialog.Title>
          {selectedSupplier && (
            <Flex direction="column" gap="3">
              <Flex direction="column" gap="1">
                <Text weight="bold">Name:</Text>
                <Text>{selectedSupplier.name}</Text>
              </Flex>
              <Flex direction="column" gap="1">
                <Text weight="bold">Location:</Text>
                <Text>{selectedSupplier.location}</Text>
              </Flex>
              <Flex direction="column" gap="1">
                <Text weight="bold">Contact Email:</Text>
                <Text>{selectedSupplier.contact}</Text>
              </Flex>
              <Flex direction="column" gap="1">
                <Text weight="bold">Lead Time:</Text>
                <Text>{selectedSupplier.leadTime} days</Text>
              </Flex>
              <Flex direction="column" gap="1">
                <Text weight="bold">Compliance Status:</Text>
                {renderComplianceBadge(selectedSupplier.compliance)}
              </Flex>
              <Flex direction="column" gap="1">
                <Text weight="bold">On-Time Delivery:</Text>
                <Text>{selectedSupplier.onTimeDelivery}%</Text>
              </Flex>
              <Flex direction="column" gap="1">
                <Text weight="bold">Quality Rating:</Text>
                <Text>{selectedSupplier.qualityRating}/5</Text>
              </Flex>
              <Flex direction="column" gap="1">
                <Text weight="bold">Risk Score:</Text>
                <Text>{selectedSupplier.riskScore}</Text>
              </Flex>
              <Flex justify="end" mt="3">
                <Button onClick={() => setIsDetailsModalOpen(false)}>
                  Close
                </Button>
              </Flex>
            </Flex>
          )}
        </Dialog.Content>
      </Dialog.Root>
    </Box>
  );
};

export default SupplierManagement;
