import { useState } from 'react';
import { 
  Card, 
  Flex, 
  Heading, 
  Table, 
  Badge, 
  Button, 
  Grid,
  Text,
  Box,
  Dialog,
  TextField
} from '@radix-ui/themes';
import { 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Legend,
  Cell
} from 'recharts';

const EndCustomers = () => {
  const [selectedReport, setSelectedReport] = useState('');

  const customers = [
    { id: 'CUST-02501', productPurchased: 'Poultry Drug A', purchasedFrequency: 92, satisfactionLevel: 'high', rating: 4.7, lastPurchaseDate: '2025-01-15' },
    { id: 'CUST-02502', productPurchased: 'Poultry Drug B', purchasedFrequency: 85, satisfactionLevel: 'medium', rating: 4.2, lastPurchaseDate: '2025-02-05' },
    { id: 'CUST-02503', productPurchased: 'Poultry Drug C', purchasedFrequency: 78, satisfactionLevel: 'low', rating: 3.9, lastPurchaseDate: '2025-03-10' },
  ];

  const purchasedFrequencyData = [
    { month: 'Jan', frequency: 85 },
    { month: 'Feb', frequency: 88 },
    { month: 'Mar', frequency: 90 },
    { month: 'Apr', frequency: 87 },
    { month: 'May', frequency: 91 },
    { month: 'Jun', frequency: 93 },
  ];

  const satisfactionData = [
    { name: 'High Satisfaction', value: 25, color: '#3b82f6' },
    { name: 'Medium Satisfaction', value: 45, color: '#60a5fa' },
    { name: 'Low Satisfaction', value: 30, color: '#93c5fd' },
  ];

  return (
    <Box p="6">
      <Flex justify="between" align="center" mb="5">
        <Heading size="6">End Customer Management</Heading>
        <Flex gap="3">
          <Dialog.Root>
            <Dialog.Trigger>
              <Button variant="soft">Safety Reporting</Button>
            </Dialog.Trigger>
            <Dialog.Content style={{ maxWidth: 450 }}>
              <Dialog.Title>Safety Reporting</Dialog.Title>
              <Dialog.Description mb="4">
                Report an adverse event related to the product.
              </Dialog.Description>
              
              <Flex direction="column" gap="3">
                <TextField.Root
                  placeholder="Enter Customer ID"
                  onChange={(e) => setSelectedReport(e.target.value)}
                />
                <TextField.Root
                  placeholder="Describe the event"
                  onChange={(e) => setSelectedReport(e.target.value)}
                />
              </Flex>

              <Flex gap="3" mt="4" justify="end">
                <Dialog.Close>
                  <Button variant="soft" color="gray">
                    Cancel
                  </Button>
                </Dialog.Close>
                <Dialog.Close>
                  <Button>Submit Report</Button>
                </Dialog.Close>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>

          <Dialog.Root>
            <Dialog.Trigger>
              <Button variant="soft">GDPR Compliance</Button>
            </Dialog.Trigger>
            <Dialog.Content style={{ maxWidth: 500 }}>
              <Dialog.Title>GDPR Compliance</Dialog.Title>
              <Text as="div" size="2" mb="4">
                We ensure full compliance with GDPR regulations.
              </Text>
              <Flex gap="3" mt="4" justify="end">
                <Dialog.Close>
                  <Button>Close</Button>
                </Dialog.Close>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>
        </Flex>
      </Flex>

      <Grid columns="4" gap="4" mb="5">
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">Active Customers</Text>
            <Heading size="7">3,000</Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">Average Purchase Frequency</Text>
            <Heading size="7">89%</Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">Average Satisfaction Level</Text>
            <Heading size="7">4.6/5</Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">Average Rating</Text>
            <Heading size="7">4.6/5</Heading>
          </Flex>
        </Card>
      </Grid>

      <Flex gap="4" mb="5">
        <Card style={{ flex: 1 }}>
          <Heading size="4" mb="3">Purchase Frequency Over Time</Heading>
          <div className="h-64">
            <LineChart width={800} height={250} data={purchasedFrequencyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="frequency" 
                stroke="#3b82f6" 
                strokeWidth={2}
              />
            </LineChart>
          </div>
        </Card>
        
        <Card style={{ flex: 1 }}>
          <Heading size="4" mb="3">Customer Satisfaction</Heading>
          <div className="h-64">
            <PieChart width={400} height={250}>
              <Pie
                data={satisfactionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label
              >
                {satisfactionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        </Card>
      </Flex>

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Customer ID</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Product Purchased</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Purchase Frequency</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Satisfaction Level</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Rating</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Last Purchase Date</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {customers.map((customer) => (
            <Table.Row key={customer.id}>
              <Table.Cell>{customer.id}</Table.Cell>
              <Table.Cell>{customer.productPurchased}</Table.Cell>
              <Table.Cell>{customer.purchasedFrequency} times</Table.Cell>
              <Table.Cell>
                <Badge variant="soft" color={
                  customer.satisfactionLevel === 'high' ? 'green' :
                  customer.satisfactionLevel === 'medium' ? 'amber' : 'red'
                }>
                  {customer.satisfactionLevel}
                </Badge>
              </Table.Cell>
              <Table.Cell>{customer.rating}/5</Table.Cell>
              <Table.Cell>{customer.lastPurchaseDate}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

export default EndCustomers;
