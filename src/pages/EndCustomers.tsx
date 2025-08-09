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

// دالة ترجمة بسيطة بدل i18next
const translations: Record<string, string> = {
  'customer-id': 'Customer ID',
  'product-purchased': 'Product Purchased',
  'purchased-frequency': 'Purchased Frequency',
  'satisfaction-level': 'Satisfaction Level',
  'rating': 'Rating',
  'last-purchase-date': 'Last Purchase Date',
  'high': 'High',
  'medium': 'Medium',
  'low': 'Low',
  'times': 'times',
  'end-customer-management': 'End Customer Management',
  'safety-reporting': 'Safety Reporting',
  'report-adverse-event': 'Report an adverse event related to the product.',
  'customer-id-placeholder': 'Enter Customer ID',
  'event-description': 'Describe the event',
  'cancel': 'Cancel',
  'submit-report': 'Submit Report',
  'gdpr-compliance': 'GDPR Compliance',
  'gdpr-description': 'We ensure full compliance with GDPR regulations.',
  'close': 'Close',
  'active-customers': 'Active Customers',
  'avg-purchased-frequency': 'Average Purchased Frequency',
  'avg-satisfaction-level': 'Average Satisfaction Level',
  'avg-rating': 'Average Rating',
  'purchased-frequency-over-time': 'Purchased Frequency Over Time',
  'customer-satisfaction': 'Customer Satisfaction',
  'high-satisfaction': 'High Satisfaction',
  'medium-satisfaction': 'Medium Satisfaction',
  'low-satisfaction': 'Low Satisfaction'
};

const t = (key: string) => translations[key] ?? key;

const EndCustomers = () => {
  const [selectedReport, setSelectedReport] = useState('');

  const customers = [
    { id: 'CUST-04578', productPurchased: 'Poultry Drug', purchasedFrequency: 92, satisfactionLevel: 'high', rating: 4.7, lastPurchaseDate: '2023-07-01' },
    { id: 'CUST-04579', productPurchased: 'Fish Antibiotic', purchasedFrequency: 85, satisfactionLevel: 'medium', rating: 4.2, lastPurchaseDate: '2023-07-05' },
    { id: 'CUST-04580', productPurchased: 'Cattle Vaccine', purchasedFrequency: 78, satisfactionLevel: 'low', rating: 3.9, lastPurchaseDate: '2023-07-10' },
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
    { name: t('high-satisfaction'), value: 25, color: '#3b82f6' },
    { name: t('medium-satisfaction'), value: 45, color: '#60a5fa' },
    { name: t('low-satisfaction'), value: 30, color: '#93c5fd' },
  ];

  return (
    <Box p="6">
      <Flex justify="between" align="center" mb="5">
        <Heading size="6">{t('end-customer-management')}</Heading>
        <Flex gap="3">
          <Dialog.Root>
            <Dialog.Trigger>
              <Button variant="soft">{t('safety-reporting')}</Button>
            </Dialog.Trigger>
            <Dialog.Content style={{ maxWidth: 450 }}>
              <Dialog.Title>{t('safety-reporting')}</Dialog.Title>
              <Dialog.Description mb="4">
                {t('report-adverse-event')}
              </Dialog.Description>
              
              <Flex direction="column" gap="3">
                <TextField.Root
                  placeholder={t('customer-id-placeholder')}
                  onChange={(e) => setSelectedReport(e.target.value)}
                />
                <TextField.Root
                  placeholder={t('event-description')}
                  onChange={(e) => setSelectedReport(e.target.value)}
                />
              </Flex>

              <Flex gap="3" mt="4" justify="end">
                <Dialog.Close>
                  <Button variant="soft" color="gray">
                    {t('cancel')}
                  </Button>
                </Dialog.Close>
                <Dialog.Close>
                  <Button>{t('submit-report')}</Button>
                </Dialog.Close>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>

          <Dialog.Root>
            <Dialog.Trigger>
              <Button variant="soft">{t('gdpr-compliance')}</Button>
            </Dialog.Trigger>
            <Dialog.Content style={{ maxWidth: 500 }}>
              <Dialog.Title>{t('gdpr-compliance')}</Dialog.Title>
              <Text as="div" size="2" mb="4">
                {t('gdpr-description')}
              </Text>
              <Flex gap="3" mt="4" justify="end">
                <Dialog.Close>
                  <Button>{t('close')}</Button>
                </Dialog.Close>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>
        </Flex>
      </Flex>

      <Grid columns="4" gap="4" mb="5">
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">{t('active-customers')}</Text>
            <Heading size="7">24,589</Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">{t('avg-purchased-frequency')}</Text>
            <Heading size="7">89%</Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">{t('avg-satisfaction-level')}</Text>
            <Heading size="7">4.6/5</Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">{t('avg-rating')}</Text>
            <Heading size="7">4.6/5</Heading>
          </Flex>
        </Card>
      </Grid>

      <Flex gap="4" mb="5">
        <Card style={{ flex: 1 }}>
          <Heading size="4" mb="3">{t('purchased-frequency-over-time')}</Heading>
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
          <Heading size="4" mb="3">{t('customer-satisfaction')}</Heading>
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
            <Table.ColumnHeaderCell>{t('customer-id')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('product-purchased')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('purchased-frequency')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('satisfaction-level')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('rating')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('last-purchase-date')}</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {customers.map((customer) => (
            <Table.Row key={customer.id}>
              <Table.Cell>{customer.id}</Table.Cell>
              <Table.Cell>{customer.productPurchased}</Table.Cell>
              <Table.Cell>{customer.purchasedFrequency} {t('times')}</Table.Cell>
              <Table.Cell>
                <Badge variant="soft" color={
                  customer.satisfactionLevel === 'high' ? 'green' :
                  customer.satisfactionLevel === 'medium' ? 'amber' : 'red'
                }>
                  {t(customer.satisfactionLevel)}
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
