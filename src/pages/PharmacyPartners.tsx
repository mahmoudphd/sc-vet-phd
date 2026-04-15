import { useState, useMemo } from 'react';
import {
  Table,
  Badge,
  Card,
  Flex,
  Heading,
  Text,
  Button,
  Dialog,
  Progress,
  Grid,
  Box,
  TextField,
  Select,
  DropdownMenu,
  AlertDialog
} from '@radix-ui/themes';
import {
  PersonIcon,
  ClockIcon,
  RocketIcon,
  MagnifyingGlassIcon,
  CubeIcon,
  Pencil1Icon,
  CheckIcon,
  Cross2Icon,
  PlusIcon
} from '@radix-ui/react-icons';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  certifications: number;
  trainingProgress: number;
  expiry: string;
  status: 'qualified' | 'pending' | 'expired';
}

const PersonnelQualification = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isBlockchainDialogOpen, setIsBlockchainDialogOpen] = useState(false);
  const [isAddEmployeeDialogOpen, setIsAddEmployeeDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempData, setTempData] = useState<Partial<Employee>>({});
  const [newEmployee, setNewEmployee] = useState<Partial<Employee>>({
    name: '',
    role: '',
    department: 'Quality Control',
    certifications: 0,
    trainingProgress: 0,
    expiry: '',
    status: 'pending'
  });

  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: 'EMP-0451',
      name: 'Mohamed Ahmed',
      role: 'Quality Control Specialist',
      department: 'Quality Control',
      certifications: 4,
      trainingProgress: 85,
      expiry: '2024-03-15',
      status: 'qualified'
    },
    {
      id: 'EMP-0789',
      name: 'Mahmoud Ibrahim',
      role: 'Production Supervisor',
      department: 'Manufacturing',
      certifications: 3,
      trainingProgress: 92,
      expiry: '2024-06-20',
      status: 'qualified'
    },
    {
      id: 'EMP-0325',
      name: 'Moamen Mahmoud',
      role: 'Microbiology Analyst',
      department: 'Quality Assurance',
      certifications: 2,
      trainingProgress: 65,
      expiry: '2023-12-10',
      status: 'expired'
    },
    {
      id: 'EMP-0678',
      name: 'Housam Nabil',
      role: 'Validation Engineer',
      department: 'Engineering',
      certifications: 5,
      trainingProgress: 78,
      expiry: '2024-09-30',
      status: 'pending'
    }
  ]);

  // Filter employees based on search term
  const filteredEmployees = useMemo(() => {
    return employees.filter(employee => 
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [employees, searchTerm]);

  // Calculate compliance data dynamically
  const complianceData = useMemo(() => {
    const qualified = employees.filter(e => e.status === 'qualified').length;
    const pending = employees.filter(e => e.status === 'pending').length;
    const expired = employees.filter(e => e.status === 'expired').length;

    return [
      { name: 'Qualified', value: qualified, color: '#10b981' },
      { name: 'Pending', value: pending, color: '#f59e0b' },
      { name: 'Expired', value: expired, color: '#ef4444' },
    ];
  }, [employees]);

  // Calculate department distribution for bar chart
  const departmentData = useMemo(() => {
    const departmentCount: Record<string, number> = {};
    
    employees.forEach(employee => {
      departmentCount[employee.department] = (departmentCount[employee.department] || 0) + 1;
    });

    return Object.entries(departmentCount).map(([department, count]) => ({
      department,
      employees: count
    }));
  }, [employees]);

  // Inline editing functions
  const handleEdit = (employee: Employee) => {
    setEditingId(employee.id);
    setTempData({ ...employee });
  };

  const handleSave = (id: string) => {
    setEmployees(employees.map(e => 
      e.id === id ? { ...e, ...tempData } as Employee : e
    ));
    setEditingId(null);
    setTempData({});
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTempData({});
  };

  const handleUpdateTempData = (field: keyof Employee, value: any) => {
    setTempData(prev => ({ ...prev, [field]: value }));
  };

  // Add new employee functions
  const handleAddEmployee = () => {
    const newEmployeeData: Employee = {
      id: `EMP-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      name: newEmployee.name || '',
      role: newEmployee.role || '',
      department: newEmployee.department || 'Quality Control',
      certifications: newEmployee.certifications || 0,
      trainingProgress: newEmployee.trainingProgress || 0,
      expiry: newEmployee.expiry || '',
      status: newEmployee.status || 'pending'
    };

    setEmployees(prev => [...prev, newEmployeeData]);
    setIsAddEmployeeDialogOpen(false);
    setNewEmployee({
      name: '',
      role: '',
      department: 'Quality Control',
      certifications: 0,
      trainingProgress: 0,
      expiry: '',
      status: 'pending'
    });
  };

  const handleNewEmployeeChange = (field: keyof Employee, value: any) => {
    setNewEmployee(prev => ({ ...prev, [field]: value }));
  };

  const submitToBlockchain = async () => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert('Personnel data submitted to blockchain successfully!');
    } catch (error) {
      alert('Failed to submit data to blockchain');
    } finally {
      setIsSubmitting(false);
      setIsBlockchainDialogOpen(false);
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'qualified':
        return <Badge color="green">Qualified</Badge>;
      case 'pending':
        return <Badge color="yellow">Pending</Badge>;
      case 'expired':
        return <Badge color="red">Expired</Badge>;
      default:
        return <Badge color="gray">Unknown</Badge>;
    }
  };

  return (
    <Box p="6">
      <Flex justify="between" align="center" mb="5">
        <Heading size="6">GMP Personnel Qualification Management</Heading>
        <Flex gap="3" align="center">
          <TextField.Root
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 250 }}
          >
            <TextField.Slot>
              <MagnifyingGlassIcon />
            </TextField.Slot>
          </TextField.Root>

          <Button 
            color="green" 
            variant="solid" 
            onClick={() => setIsBlockchainDialogOpen(true)}
            style={{ backgroundColor: '#006400' }}
          >
            <CubeIcon /> Submit to Blockchain
          </Button>

          <Button 
            variant="soft"
            onClick={() => setIsAddEmployeeDialogOpen(true)}
          >
            <PlusIcon /> Add Employee
          </Button>

          <Dialog.Root>
            <Dialog.Trigger>
              <Button variant="soft">
                <RocketIcon /> New Training Plan
              </Button>
            </Dialog.Trigger>
            <Dialog.Content style={{ maxWidth: 450 }}>
              <Dialog.Title>Create New Training Plan</Dialog.Title>
              <Flex direction="column" gap="3">
                <label>
                  <Text as="div" size="2" mb="1" weight="bold">
                    Training Plan Name
                  </Text>
                  <TextField.Root
                    placeholder="Enter plan name"
                  />
                </label>
                <label>
                  <Text as="div" size="2" mb="1" weight="bold">
                    Due Date
                  </Text>
                  <TextField.Root type="date" />
                </label>
                <Flex gap="3" mt="4" justify="end">
                  <Dialog.Close>
                    <Button variant="soft" color="gray">
                      Cancel
                    </Button>
                  </Dialog.Close>
                  <Dialog.Close>
                    <Button>
                      Create
                    </Button>
                  </Dialog.Close>
                </Flex>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>
        </Flex>
      </Flex>

      {/* Add Employee Dialog */}
      <Dialog.Root open={isAddEmployeeDialogOpen} onOpenChange={setIsAddEmployeeDialogOpen}>
        <Dialog.Content style={{ maxWidth: 500 }}>
          <Dialog.Title>Add New Employee</Dialog.Title>
          <Flex direction="column" gap="3">
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Full Name
              </Text>
              <TextField.Root
                placeholder="Enter employee name"
                value={newEmployee.name}
                onChange={(e) => handleNewEmployeeChange('name', e.target.value)}
              />
            </label>
            
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Role/Position
              </Text>
              <TextField.Root
                placeholder="Enter employee role"
                value={newEmployee.role}
                onChange={(e) => handleNewEmployeeChange('role', e.target.value)}
              />
            </label>
            
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Department
              </Text>
              <Select.Root
                value={newEmployee.department}
                onValueChange={(value) => handleNewEmployeeChange('department', value)}
              >
                <Select.Trigger />
                <Select.Content>
                  <Select.Item value="Quality Control">Quality Control</Select.Item>
                  <Select.Item value="Manufacturing">Manufacturing</Select.Item>
                  <Select.Item value="Quality Assurance">Quality Assurance</Select.Item>
                  <Select.Item value="Engineering">Engineering</Select.Item>
                  <Select.Item value="Research & Development">Research & Development</Select.Item>
                </Select.Content>
              </Select.Root>
            </label>
            
            <Grid columns="2" gap="3">
              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  Certifications
                </Text>
                <TextField.Root
                  type="number"
                  min="0"
                  value={newEmployee.certifications}
                  onChange={(e) => handleNewEmployeeChange('certifications', parseInt(e.target.value))}
                />
              </label>
              
              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  Training Progress (%)
                </Text>
                <TextField.Root
                  type="number"
                  min="0"
                  max="100"
                  value={newEmployee.trainingProgress}
                  onChange={(e) => handleNewEmployeeChange('trainingProgress', parseInt(e.target.value))}
                />
              </label>
            </Grid>
            
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Certification Expiry Date
              </Text>
              <TextField.Root
                type="date"
                value={newEmployee.expiry}
                onChange={(e) => handleNewEmployeeChange('expiry', e.target.value)}
              />
            </label>
            
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Status
              </Text>
              <Select.Root
                value={newEmployee.status}
                onValueChange={(value) => handleNewEmployeeChange('status', value)}
              >
                <Select.Trigger />
                <Select.Content>
                  <Select.Item value="qualified">Qualified</Select.Item>
                  <Select.Item value="pending">Pending</Select.Item>
                  <Select.Item value="expired">Expired</Select.Item>
                </Select.Content>
              </Select.Root>
            </label>
            
            <Flex gap="3" mt="4" justify="end">
              <Button 
                variant="soft" 
                color="gray"
                onClick={() => setIsAddEmployeeDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAddEmployee}
                disabled={!newEmployee.name || !newEmployee.role}
              >
                Add Employee
              </Button>
            </Flex>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      {/* Blockchain Submission Dialog */}
      <AlertDialog.Root open={isBlockchainDialogOpen}>
        <AlertDialog.Content style={{ maxWidth: 450 }}>
          <AlertDialog.Title>Submit to Blockchain</AlertDialog.Title>
          <AlertDialog.Description size="2" mb="4">
            Are you sure you want to submit personnel qualification data to the blockchain? This action cannot be undone.
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

      {/* Metrics Cards */}
      <Grid columns="4" gap="4" mb="5">
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">Total Employees</Text>
            <Heading size="7">{employees.length}</Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">Qualified Staff</Text>
            <Heading size="7" style={{ color: '#10b981' }}>
              {employees.filter(e => e.status === 'qualified').length}
            </Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">Training Due</Text>
            <Heading size="7" style={{ color: '#f59e0b' }}>
              {employees.filter(e => e.status === 'pending').length}
            </Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">Certifications Expiring</Text>
            <Heading size="7" style={{ color: '#ef4444' }}>
              {employees.filter(e => e.status === 'expired').length}
            </Heading>
          </Flex>
        </Card>
      </Grid>

      {/* Charts Section */}
      <Flex gap="4" mb="5">
        <Card style={{ flex: 1 }}>
          <Heading size="4" mb="3">Qualification Status</Heading>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={complianceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {complianceData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        <Card style={{ flex: 1 }}>
          <Heading size="4" mb="3">Department Distribution</Heading>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="employees" fill="#3b82f6" name="Employees" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </Flex>

      {/* Employees Table */}
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Employee</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Department</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Certifications</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Training Progress</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Expiry Date</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {filteredEmployees.map((employee) => (
            <Table.Row key={employee.id}>
              <Table.Cell>
                {editingId === employee.id ? (
                  <TextField.Root
                    value={tempData.name || employee.name}
                    onChange={(e) => handleUpdateTempData('name', e.target.value)}
                  />
                ) : (
                  <Flex align="center" gap="2">
                    <PersonIcon />
                    {employee.name}
                  </Flex>
                )}
              </Table.Cell>
              <Table.Cell>
                {editingId === employee.id ? (
                  <TextField.Root
                    value={tempData.role || employee.role}
                    onChange={(e) => handleUpdateTempData('role', e.target.value)}
                  />
                ) : (
                  employee.role
                )}
              </Table.Cell>
              <Table.Cell>
                {editingId === employee.id ? (
                  <Select.Root
                    value={tempData.department || employee.department}
                    onValueChange={(value) => handleUpdateTempData('department', value)}
                  >
                    <Select.Trigger />
                    <Select.Content>
                      <Select.Item value="Quality Control">Quality Control</Select.Item>
                      <Select.Item value="Manufacturing">Manufacturing</Select.Item>
                      <Select.Item value="Quality Assurance">Quality Assurance</Select.Item>
                      <Select.Item value="Engineering">Engineering</Select.Item>
                      <Select.Item value="Research & Development">Research & Development</Select.Item>
                    </Select.Content>
                  </Select.Root>
                ) : (
                  employee.department
                )}
              </Table.Cell>
              <Table.Cell>
                {editingId === employee.id ? (
                  <TextField.Root
                    type="number"
                    min="0"
                    value={tempData.certifications || employee.certifications}
                    onChange={(e) => handleUpdateTempData('certifications', parseInt(e.target.value))}
                  />
                ) : (
                  <Badge variant="outline">
                    {employee.certifications} Active
                  </Badge>
                )}
              </Table.Cell>
              <Table.Cell>
                {editingId === employee.id ? (
                  <Flex direction="column" gap="2">
                    <TextField.Root
                      type="number"
                      min="0"
                      max="100"
                      value={tempData.trainingProgress || employee.trainingProgress}
                      onChange={(e) => handleUpdateTempData('trainingProgress', parseInt(e.target.value))}
                    />
                    <Progress value={tempData.trainingProgress || employee.trainingProgress} />
                  </Flex>
                ) : (
                  <Flex align="center" gap="2">
                    <Progress value={employee.trainingProgress} />
                    <Text size="2">{employee.trainingProgress}%</Text>
                  </Flex>
                )}
              </Table.Cell>
              <Table.Cell>
                {editingId === employee.id ? (
                  <TextField.Root
                    type="date"
                    value={tempData.expiry || employee.expiry}
                    onChange={(e) => handleUpdateTempData('expiry', e.target.value)}
                  />
                ) : (
                  <Flex align="center" gap="2">
                    <ClockIcon />
                    {employee.expiry}
                  </Flex>
                )}
              </Table.Cell>
              <Table.Cell>
                {editingId === employee.id ? (
                  <Select.Root
                    value={tempData.status || employee.status}
                    onValueChange={(value) => handleUpdateTempData('status', value)}
                  >
                    <Select.Trigger />
                    <Select.Content>
                      <Select.Item value="qualified">Qualified</Select.Item>
                      <Select.Item value="pending">Pending</Select.Item>
                      <Select.Item value="expired">Expired</Select.Item>
                    </Select.Content>
                  </Select.Root>
                ) : (
                  renderStatusBadge(employee.status)
                )}
              </Table.Cell>
              <Table.Cell>
                <Flex gap="2">
                  {editingId === employee.id ? (
                    <>
                      <Button size="1" color="green" onClick={() => handleSave(employee.id)}>
                        <CheckIcon /> Save
                      </Button>
                      <Button size="1" color="red" onClick={handleCancelEdit}>
                        <Cross2Icon /> Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button size="1" onClick={() => handleEdit(employee)}>
                        <Pencil1Icon /> Edit
                      </Button>
                      <Dialog.Root>
                        <Dialog.Trigger>
                          <Button size="1" variant="soft">
                            Renew
                          </Button>
                        </Dialog.Trigger>
                        <Dialog.Content style={{ maxWidth: 450 }}>
                          <Dialog.Title>Renew Certification</Dialog.Title>
                          <Dialog.Description size="2" mb="4">
                            Renew certification for {employee.name}
                          </Dialog.Description>
                          <Flex direction="column" gap="3">
                            <label>
                              <Text as="div" size="2" mb="1" weight="bold">
                                Expiry Date
                              </Text>
                              <TextField.Root
                                type="date"
                                defaultValue={employee.expiry}
                              />
                            </label>
                            <Flex gap="3" mt="4" justify="end">
                              <Dialog.Close>
                                <Button variant="soft" color="gray">
                                  Cancel
                                </Button>
                              </Dialog.Close>
                              <Dialog.Close>
                                <Button>
                                  Submit
                                </Button>
                              </Dialog.Close>
                            </Flex>
                          </Flex>
                        </Dialog.Content>
                      </Dialog.Root>
                    </>
                  )}
                </Flex>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

export default PersonnelQualification;
