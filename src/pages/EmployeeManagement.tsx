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
  Switch
} from '@radix-ui/themes';
import { toast, Toaster } from 'sonner';
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

const COLORS = ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'];

const EmployeeManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: 'Moamen Mahmoud',
      email: 'moamen@supplychain.com',
      role: 'Inventory Specialist',
      department: 'Operations',
      status: 'active',
      trainingComplete: true,
      performance: 4.8
    },
    {
      id: 2,
      name: 'Housam Nabil',
      email: 'housam@supplychain.com',
      role: 'Inventory Specialist',
      department: 'Purchasing',
      status: 'active',
      trainingComplete: false,
      performance: 4.5
    }
  ]);

  const [newEmployee, setNewEmployee] = useState({ name: '', email: '' });

  const employeeDetails: { [key: string]: { role: string; department: string } } = {
    'Mohamed Ahmed': { role: 'Warehouse Manager', department: 'Logistics' },
    'Moamen Mahmoud': { role: 'Inventory Specialist', department: 'Operations' },
    'Housam Nabil': { role: 'Inventory Specialist', department: 'Purchasing' }
  };

  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.email) {
      toast.error('Please fill all fields');
      return;
    }

    const { role, department } = employeeDetails[newEmployee.name] || {
      role: 'Employee',
      department: 'General'
    };

    setEmployees([
      ...employees,
      {
        id: employees.length + 1,
        name: newEmployee.name,
        email: newEmployee.email,
        role,
        department,
        status: 'active',
        trainingComplete: false,
        performance: 4.0
      }
    ]);

    setNewEmployee({ name: '', email: '' });
    setIsDialogOpen(false);
    toast.success('Employee added successfully');
  };

  const handleStatusChange = (id: number) => {
    setEmployees(
      employees.map(emp =>
        emp.id === id
          ? { ...emp, status: emp.status === 'active' ? 'inactive' : 'active' }
          : emp
      )
    );
  };

  const departmentData = [
    { name: 'Logistics', employees: 15 },
    { name: 'Operations', employees: 22 },
    { name: 'Purchasing', employees: 8 },
    { name: 'Distribution', employees: 12 }
  ];

  const performanceData = [
    { month: 'Jan', score: 4.2 },
    { month: 'Feb', score: 4.5 },
    { month: 'Mar', score: 4.7 },
    { month: 'Apr', score: 4.6 },
    { month: 'May', score: 4.8 },
    { month: 'Jun', score: 4.9 }
  ];

  return (
    <Box p="6">
      <Toaster position="top-right" />
      <Flex justify="between" align="center" mb="5">
        <Heading size="6">Employee Management</Heading>
        <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <Dialog.Trigger>
            <Button>Add Employee</Button>
          </Dialog.Trigger>
          <Dialog.Content style={{ maxWidth: 500 }}>
            <Dialog.Title>Add New Employee</Dialog.Title>
            <Flex direction="column" gap="3" mt="4">
              <Select.Root
                value={newEmployee.name}
                onValueChange={val => setNewEmployee(prev => ({ ...prev, name: val }))}
              >
                <Select.Trigger placeholder="Select Name" />
                <Select.Content>
                  <Select.Item value="Mohamed Ahmed">Mohamed Ahmed</Select.Item>
                  <Select.Item value="Moamen Mahmoud">Moamen Mahmoud</Select.Item>
                  <Select.Item value="Housam Nabil">Housam Nabil</Select.Item>
                </Select.Content>
              </Select.Root>

              <TextField.Root
                placeholder="Email"
                value={newEmployee.email}
                onChange={e => setNewEmployee(prev => ({ ...prev, email: e.target.value }))}
              />

              <Flex gap="3" mt="4" justify="end">
                <Dialog.Close>
                  <Button variant="soft">Cancel</Button>
                </Dialog.Close>
                <Button onClick={handleAddEmployee}>Save</Button>
              </Flex>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      </Flex>

      <Grid columns="2" gap="4" mb="5">
        <Card>
          <Heading size="4" mb="3">Performance Trend</Heading>
          <Box height="250">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[4, 5]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Card>
        <Card>
          <Heading size="4" mb="3">Department Distribution</Heading>
          <Box height="250">
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
          </Box>
        </Card>
      </Grid>

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Department</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Training</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Performance</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {employees.map(emp => (
            <Table.Row key={emp.id}>
              <Table.Cell>{emp.name}</Table.Cell>
              <Table.Cell>{emp.role}</Table.Cell>
              <Table.Cell>{emp.department}</Table.Cell>
              <Table.Cell>
                <Flex align="center" gap="2">
                  <Switch
                    checked={emp.status === 'active'}
                    onCheckedChange={() => handleStatusChange(emp.id)}
                  />
                  <Badge color={emp.status === 'active' ? 'green' : 'red'}>
                    {emp.status}
                  </Badge>
                </Flex>
              </Table.Cell>
              <Table.Cell>
                <Badge color={emp.trainingComplete ? 'green' : 'orange'}>
                  {emp.trainingComplete ? 'Complete' : 'Pending'}
                </Badge>
              </Table.Cell>
              <Table.Cell>{emp.performance}/5</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

export default EmployeeManagement;
