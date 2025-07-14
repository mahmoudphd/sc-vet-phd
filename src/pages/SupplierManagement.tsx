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
  DropdownMenu
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
  ResponsiveContainer
} from 'recharts';
import { toast } from 'sonner';
import { Toaster } from 'sonner';

const SupplierManagement = () => {
  const { t } = useTranslation('suppliers');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  
  const [suppliers, setSuppliers] = useState([
    { 
      id: 1, 
      name: 'Global Pharma Distributors', 
      contact: 'supply@globalpharma.com', 
      location: 'Europe', 
      leadTime: 14, 
      compliance: 'certified', 
      rating: 4.8,
      orderVolume: 24500,
      onTimeDelivery: 98,
      qualityRating: 4.9,
      contracts: ['2023 Master Agreement']
    },
    { 
      id: 2, 
      name: 'BioTech Raw Materials', 
      contact: 'orders@biotechrm.com', 
      location: 'North America', 
      leadTime: 21, 
      compliance: 'pending', 
      rating: 4.3,
      orderVolume: 18200,
      onTimeDelivery: 92,
      qualityRating: 4.5,
      contracts: []
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

  const handleComplianceUpdate = (id: number, newStatus: string) => {
    setSuppliers(suppliers.map(supplier => 
      supplier.id === id ? { ...supplier, compliance: newStatus } : supplier
    ));
    toast.success(t('compliance-updated'));
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

      <Grid columns="4" gap="4" mb="5">
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">{t('active-suppliers')}</Text>
            <Heading size="7">248</Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">{t('avg-lead-time')}</Text>
            <Heading size="7">17.2 {t('days')}</Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">{t('on-time-delivery')}</Text>
            <Heading size="7">96.4%</Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">{t('quality-compliance')}</Text>
            <Heading size="7">98.1%</Heading>
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
              <LineChart data={suppliers.map(s => ({
                name: s.name,
                risk: (100 - s.onTimeDelivery) * (s.leadTime / 30)
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" hide />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="risk" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
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
            {/* Would typically integrate a map library here */}
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