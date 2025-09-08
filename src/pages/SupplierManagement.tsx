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
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import { toast } from 'sonner';
import { Toaster } from 'sonner';
import { 
  Pencil1Icon, 
  CheckIcon, 
  Cross2Icon,
  CubeIcon
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

  // Risk distribution data for pie chart
  const riskDistributionData = [
    { name: 'Low Risk', value: suppliers.filter(s => s.riskScore < 20).length },
    { name: 'Medium Risk', value: suppliers.filter(s => s.riskScore >= 20 && s.riskScore < 40).length },
    { name: 'High Risk', value: suppliers.filter(s => s.riskScore >= 40).length }
  ];

  const COLORS = ['#00C49F', '#FFBB28', '#FF8042'];

  // Radar chart data for supplier performance comparison
  const radarData = [
    {
      subject: 'Delivery',
      SupplierA: 98,
      SupplierB: 92,
      SupplierC: 85,
      fullMark: 100,
    },
    {
      subject: 'Quality',
      SupplierA: 4.9,
      SupplierB: 4.5,
      SupplierC: 4.0,
      fullMark: 5,
    },
    {
      subject: 'Lead Time',
      SupplierA: 14,
      SupplierB: 21,
      SupplierC: 30,
      fullMark: 35,
    },
    {
      subject: 'Compliance',
      SupplierA: 100,
      SupplierB: 70,
      SupplierC: 50,
      fullMark: 100,
    },
  ];

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
    setTempData(prev => ({ ...prev, [field]: value }));
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

      <Grid columns="4" gap="4" mb="5">
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">Active Suppliers</Text>
            <Heading size="7">80</Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">Avg Lead Time</Text>
            <Heading size="7">21.7 days</Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">On-Time Delivery</Text>
            <Heading size="7">91.7%</Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">Quality Compliance</Text>
            <Heading size="7">4.5/5</Heading>
          </Flex>
        </Card>
      </Grid>

      <Flex gap="4" mb="5">
        <Card style={{ flex: 2 }}>
          <Heading size="4" mb="3">Order Performance</Heading>
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

      <Card mb="5">
        <Heading size="4" mb="3">Supplier Performance Comparison</Heading>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar name="Supplier A" dataKey="SupplierA" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              <Radar name="Supplier B" dataKey="SupplierB" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
              <Radar name="Supplier C" dataKey="SupplierC" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </Card>

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
                <Flex gap="2">
                  <Badge color={supplier.onTimeDelivery >= 95 ? 'green' : 'yellow'}>
                    {supplier.onTimeDelivery}% Delivery
                  </Badge>
                  <Badge color={supplier.qualityRating >= 4.5 ? 'green' : 'yellow'}>
                    {supplier.qualityRating}/5 Quality
                  </Badge>
                </Flex>
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
                      <Button size="1" onClick={() => handleEdit(supplier)}>
                        <Pencil1Icon /> Edit
                      </Button>
                      <DropdownMenu.Root>
                        <DropdownMenu.Trigger>
                          <Button variant="ghost">•••</Button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content>
                          <DropdownMenu.Item>View Analytics</DropdownMenu.Item>
                          <DropdownMenu.Item>Edit Details</DropdownMenu.Item>
                          <DropdownMenu.Separator />
                          <DropdownMenu.Item color="red">Terminate</DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Root>
                    </>
                  )}
                </Flex>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <Dialog.Root>
        <Dialog.Trigger>
          <Button variant="soft" style={{ position: 'fixed', bottom: 20, right: 20 }}>
            Supply Chain Map
          </Button>
        </Dialog.Trigger>
        <Dialog.Content style={{ width: '80vw', height: '80vh' }}>
          <Dialog.Title>Global Supply Network</Dialog.Title>
          <div className="h-full w-full bg-gray-50 rounded-lg p-4">
            <Flex align="center" justify="center" className="h-full">
              <Text color="gray">Map integration placeholder</Text>
            </Flex>
          </div>
        </Dialog.Content>
      </Dialog.Root>
    </Box>
  );
};

export default SupplierManagement;
