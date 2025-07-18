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
import { useTranslation } from 'react-i18next';

const customers = [
  { id: 'CUST-001', product: 'Pain Relief Tablets', purchaseFrequency: 3, satisfaction: 'high', rating: 4.7, lastPurchase: '2025-07-10' },
  { id: 'CUST-002', product: 'Vitamin Supplements', purchaseFrequency: 1, satisfaction: 'medium', rating: 4.1, lastPurchase: '2025-06-22' },
  { id: 'CUST-003', product: 'Cold & Flu Syrup', purchaseFrequency: 5, satisfaction: 'low', rating: 3.5, lastPurchase: '2025-07-15' },
];

const purchaseFrequencyData = [
  { month: 'Jan', frequency: 40 },
  { month: 'Feb', frequency: 35 },
  { month: 'Mar', frequency: 45 },
  { month: 'Apr', frequency: 50 },
  { month: 'May', frequency: 48 },
  { month: 'Jun', frequency: 52 },
];

const satisfactionData = [
  { name: 'High Satisfaction', value: 60, color: '#4caf50' },
  { name: 'Medium Satisfaction', value: 30, color: '#ff9800' },
  { name: 'Low Satisfaction', value: 10, color: '#f44336' },
];

const EndCustomers = () => {
  const { t } = useTranslation('end-customers');
  const [selectedReport, setSelectedReport] = useState('');

  return (
    <Box p="6">
      <Flex justify="between" align="center" mb="5">
        <Heading size="6">{t('end-customer-management')}</Heading>
        <Flex gap="3">
          <Dialog.Root>
            <Dialog.Trigger>
              <Button variant="soft">{t('submit-feedback')}</Button>
            </Dialog.Trigger>
            <Dialog.Content style={{ maxWidth: 450 }}>
              <Dialog.Title>{t('submit-feedback')}</Dialog.Title>
              <Dialog.Description mb="4">{t('feedback-instruction')}</Dialog.Description>
              <Flex direction="column" gap="3">
                <TextField.Root
                  placeholder={t('customer-id-placeholder')}
                  onChange={(e) => setSelectedReport(e.target.value)}
                />
                <TextField.Root
                  placeholder={t('feedback-description')}
                  onChange={(e) => setSelectedReport(e.target.value)}
                />
              </Flex>
              <Flex gap="3" mt="4" justify="end">
                <Dialog.Close>
                  <Button variant="soft" color="gray">{t('cancel')}</Button>
                </Dialog.Close>
                <Dialog.Close>
                  <Button>{t('submit')}</Button>
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
            <Heading size="7">15,742</Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">{t('avg-purchase-frequency')}</Text>
            <Heading size="7">3.2 {t('times')}</Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">{t('avg-satisfaction')}</Text>
            <Heading size="7">85%</Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">{t('avg-rating')}</Text>
            <Heading size="7">4.3/5</Heading>
          </Flex>
        </Card>
      </Grid>

      <Flex gap="4" mb="5">
        <Card style={{ flex: 1 }}>
          <Heading size="4" mb="3">{t('purchase-frequency-over-time')}</Heading>
          <div className="h-64">
            <LineChart width={800} height={250} data={purchaseFrequencyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="frequency" stroke="#4caf50" strokeWidth={2} />
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
            <Table.ColumnHeaderCell>{t('purchase-frequency')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('satisfaction')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('rating')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('last-purchase-date')}</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {customers.map((customer) => (
            <Table.Row key={customer.id}>
              <Table.Cell>{customer.id}</Table.Cell>
              <Table.Cell>{customer.product}</Table.Cell>
              <Table.Cell>{customer.purchaseFrequency}</Table.Cell>
              <Table.Cell>
                <Badge
                  variant="soft"
                  color={
                    customer.satisfaction === 'high'
                      ? 'green'
                      : customer.satisfaction === 'medium'
                      ? 'amber'
                      : 'red'
                  }
                >
                  {t(customer.satisfaction)}
                </Badge>
              </Table.Cell>
              <Table.Cell>{customer.rating}/5</Table.Cell>
              <Table.Cell>{customer.lastPurchase}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

export default EndCustomers;
