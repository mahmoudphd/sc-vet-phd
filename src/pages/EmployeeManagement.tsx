import { useState } from 'react';
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
  Switch,
  AlertDialog
} from '@radix-ui/themes';
import { 
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBlockchainDialogOpen, setIsBlockchainDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  // Department data that sums to 1,234 employees
  const departmentData = [
    { name: 'Logistics', employees: 420, percentage: 34 },
    { name: 'Operations', employees: 370, percentage: 30 },
    { name: 'Purchasing', employees: 247, percentage: 20 },
    { name: 'Distribution', employees: 197, percentage: 16 },
  ];

  const totalEmployees = 1234; // Explicit total
  const totalDepartments = departmentData.length; // Will be 4

  const performanceData = [
    { month: 'Jan', score: 4.2 },
    { month: 'Feb', score: 4.5 },
    { month: 'Mar', score: 4.7 },
    { month: 'Apr', score: 4.6 },
    { month: 'May', score: 4.8 },
    { month: 'Jun', score: 4.9 },
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

  const submitToBlockchain = async () => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Data submitted to blockchain!');
    } catch (error) {
      toast.error('Submission failed');
    } finally {
      setIsSubmitting(false);
      setIsBlockchainDialogOpen(false);
    }
  };

  return (
    <Box p="6">
      <Toaster position="top-right" />
      
      <Flex justify="between" align="center" mb="5">
        <Heading size="6">Employee Management</Heading>
        <Flex gap="3">
          <TextField.Root
            placeholder="Search employees"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select.Root value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <Select.Trigger placeholder="All departments" />
            <Select.Content>
              <Select.Item value="all">All departments</Select.Item>
              {departmentData.map(dept => (
                <Select.Item key={dept.name} value={dept.name}>{dept.name}</Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
          <Button 
            variant="soft" 
            color="blue"
            onClick={() => setIsBlockchainDialogOpen(true)}
          >
            Submit to Blockchain
          </Button>
          <Dialog.Root>
            <Dialog.Trigger>
              <Button>Add Employee</Button>
            </Dialog.Trigger>
            <Dialog.Content style={{ maxWidth: 500 }}>
              <Dialog.Title>Add Employee</Dialog.Title>
              <Flex direction="column" gap="3" mt="4">
                <TextField.Root placeholder="Full name" />
                <TextField.Root placeholder="Email" />
                <Select.Root>
                  <Select.Trigger placeholder="Select role" />
                  <Select.Content>
                    <Select.Item value="Manager">Warehouse Manager</Select.Item>
                    <Select.Item value="Specialist">Inventory Specialist</Select.Item>
                  </Select.Content>
                </Select.Root>
                <Select.Root>
                  <Select.Trigger placeholder="Select department" />
                  <Select.Content>
                    {departmentData.map(dept => (
                      <Select.Item key={dept.name} value={dept.name}>{dept.name}</Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
                <Flex gap="3" mt="4" justify="end">
                  <Dialog.Close>
                    <Button variant="soft">Cancel</Button>
                  </Dialog.Close>
                  <Button>Save</Button>
                </Flex>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>
        </Flex>
      </Flex>

      <AlertDialog.Root open={isBlockchainDialogOpen}>
        <AlertDialog.Content style={{ maxWidth: 450 }}>
          <AlertDialog.Title>Submit to Blockchain</AlertDialog.Title>
          <AlertDialog.Description size="2" mb="4">
            Confirm submission of employee data to blockchain
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
              color="blue"
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
            <Text size="2">Total Employees</Text>
            <Heading size="7">{totalEmployees.toLocaleString()}</Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">Departments</Text>
            <Heading size="7">{totalDepartments}</Heading> {/* Shows 4 */}
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">Active Ratio</Text>
            <Heading size="7">89%</Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">Avg. Performance</Text>
            <Heading size="7">4.7/5</Heading>
          </Flex>
        </Card>
      </Grid>

      <Flex gap="4" mb="5">
        <Card style={{ flex: 2 }}>
          <Heading size="4" mb="3">Performance Trend</Heading>
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
          <Heading size="4" mb="3">Department Distribution</Heading>
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
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value} employees`, 'Count']}
                  labelFormatter={(name) => `Department: ${name}`}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <Flex justify="center" gap="4" mt="3" wrap="wrap">
            {departmentData.map((dept, index) => (
              <Flex align="center" gap="2" key={dept.name}>
                <Box 
                  style={{ 
                    width: 12, 
                    height: 12, 
                    backgroundColor: COLORS[index % COLORS.length],
                    borderRadius: '50%' 
                  }} 
                />
                <Text size="2">
                  {dept.name}: {dept.employees}
                </Text>
              </Flex>
            ))}
          </Flex>
        </Card>
      </Flex>

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Department</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Training</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Performance</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
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
                    {employee.status}
                  </Badge>
                </Flex>
              </Table.Cell>
              <Table.Cell>
                <Badge color={employee.trainingComplete ? 'green' : 'orange'}>
                  {employee.trainingComplete ? 'Complete' : 'Pending'}
                </Badge>
              </Table.Cell>
              <Table.Cell>{employee.performance}/5</Table.Cell>
              <Table.Cell>
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    <Button variant="ghost">•••</Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content>
                    <DropdownMenu.Item>Edit</DropdownMenu.Item>
                    <DropdownMenu.Item>View Profile</DropdownMenu.Item>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Item color="red">Terminate</DropdownMenu.Item>
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
