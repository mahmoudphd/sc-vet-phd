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
  Switch
} from '@radix-ui/themes';
import { 
  BarChart, 
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer
} from 'recharts';
import { toast } from 'sonner';
import { Toaster } from 'sonner';

const COLORS = ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'];

const EmployeeManagement = () => {
  const { t } = useTranslation('employees');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [employees, setEmployees] = useState([
  { id: 1, name: 'Moamen Mahmoud', email: 'moamen@supplychain.com', role: 'Warehouse Manager', 
    department: 'Logistics', status: 'active', trainingComplete: true, performance: 4.8 },
  { id: 2, name: 'Housam Nabil', email: 'housam@supplychain.com', role: 'Inventory Specialist', 
    department: 'Operations', status: 'active', trainingComplete: false, performance: 4.5 },
  { id: 3, name: 'Mohamed Ahmed', email: 'mohamed@supplychain.com', role: 'Inventory Specialist', 
    department: 'Purchasing', status: 'inactive', trainingComplete: true, performance: 4.2 },
]);


  const departmentData = [
    { name: t('logistics'), employees: 15 },
    { name: t('operations'), employees: 22 },
    { name: t('purchasing'), employees: 8 },
    { name: t('distribution'), employees: 12 },
  ];

  const performanceData = [
    { month: t('jan'), score: 4.2 },
    { month: t('feb'), score: 4.5 },
    { month: t('mar'), score: 4.7 },
    { month: t('apr'), score: 4.6 },
    { month: t('may'), score: 4.8 },
    { month: t('jun'), score: 4.9 },
  ];

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedDepartment === 'all' || emp.department === selectedDepartment)
  );

  const handleStatusChange = (id: number) => {
    setEmployees(employees.map(emp => 
      emp.id === id ? { ...emp, status: emp.status === 'active' ? 'inactive' : 'active' } : emp
    ));
  };

  return (
    <Box p="6">
      <Toaster position="top-right" />
      
      <Flex justify="between" align="center" mb="5">
        <Heading size="6">{t('employee-management')}</Heading>
        <Flex gap="3">
          <TextField.Root
            placeholder={t('search-employees')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select.Root value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <Select.Trigger placeholder={t('all-departments')} />
            <Select.Content>
              <Select.Item value="all">{t('all-departments')}</Select.Item>
              <Select.Item value="Logistics">{t('logistics')}</Select.Item>
              <Select.Item value="Operations">{t('operations')}</Select.Item>
              <Select.Item value="Purchasing">{t('purchasing')}</Select.Item>
            </Select.Content>
          </Select.Root>
          <Dialog.Root>
            <Dialog.Trigger>
              <Button>{t('add-employee')}</Button>
            </Dialog.Trigger>
            <Dialog.Content style={{ maxWidth: 500 }}>
              <Dialog.Title>{t('add-employee')}</Dialog.Title>
              <Flex direction="column" gap="3" mt="4">
                <TextField.Root placeholder={t('full-name')} />
                <TextField.Root placeholder={t('email')} />
                <Select.Root>
                  <Select.Trigger placeholder={t('select-role')} />
                  <Select.Content>
                    <Select.Item value="Manager">{t('warehouse-manager')}</Select.Item>
                    <Select.Item value="Specialist">{t('inventory-specialist')}</Select.Item>
                  </Select.Content>
                </Select.Root>
                <Select.Root>
                  <Select.Trigger placeholder={t('select-department')} />
                  <Select.Content>
                    <Select.Item value="Logistics">{t('logistics')}</Select.Item>
                    <Select.Item value="Operations">{t('operations')}</Select.Item>
                    <Select.Item value="Purchasing">{t('purchasing')}</Select.Item>
                  </Select.Content>
                </Select.Root>
                <Flex gap="3" mt="4" justify="end">
                  <Dialog.Close>
                    <Button variant="soft">{t('cancel')}</Button>
                  </Dialog.Close>
                  <Button>{t('save')}</Button>
                </Flex>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>
        </Flex>
      </Flex>

      <Grid columns="4" gap="4" mb="5">
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">{t('total-employees')}</Text>
            <Heading size="7">1,234</Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">{t('active-ratio')}</Text>
            <Heading size="7">89%</Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">{t('avg-performance')}</Text>
            <Heading size="7">4.7/5</Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">{t('departments')}</Text>
            <Heading size="7">12</Heading>
          </Flex>
        </Card>
      </Grid>

      <Flex gap="4" mb="5">
        <Card style={{ flex: 2 }}>
          <Heading size="4" mb="3">{t('performance-trend')}</Heading>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[4, 5]} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        <Card style={{ flex: 1 }}>
          <Heading size="4" mb="3">{t('department-distribution')}</Heading>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="employees"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </Flex>

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>{t('name')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('role')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('department')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('status')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('training')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('performance')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('actions')}</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {filteredEmployees.map(employee => (
            <Table.Row key={employee.id}>
              <Table.Cell>{employee.name}</Table.Cell>
              <Table.Cell>{employee.role}</Table.Cell>
              <Table.Cell>
                <Badge variant="soft" color="blue">
                  {employee.department}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <Flex align="center" gap="2">
                  <Switch
                    checked={employee.status === 'active'}
                    onCheckedChange={() => handleStatusChange(employee.id)}
                  />
                  <Badge color={employee.status === 'active' ? 'green' : 'red'}>
                    {t(employee.status)}
                  </Badge>
                </Flex>
              </Table.Cell>
              <Table.Cell>
                <Badge color={employee.trainingComplete ? 'green' : 'orange'}>
                  {employee.trainingComplete ? t('complete') : t('pending')}
                </Badge>
              </Table.Cell>
              <Table.Cell>{employee.performance}/5</Table.Cell>
              <Table.Cell>
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    <Button variant="ghost">•••</Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content>
                    <DropdownMenu.Item>{t('edit')}</DropdownMenu.Item>
                    <DropdownMenu.Item>{t('view-profile')}</DropdownMenu.Item>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Item color="red">{t('terminate')}</DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

export default EmployeeManagement;
