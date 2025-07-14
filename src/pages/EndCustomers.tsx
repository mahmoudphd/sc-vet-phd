import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation('end-customers');
  const [selectedReport, setSelectedReport] = useState('');
  
  const customers = [
    { id: 'PAT-04578', therapy: 'Antiparasitic Treatment', adherence: 92, outcomes: 'positive', feedback: 4.7, lastOrder: '2023-07-01' },
    { id: 'PAT-04579', therapy: 'Antifungal Therapy', adherence: 85, outcomes: 'neutral', feedback: 4.2, lastOrder: '2023-07-05' },
    { id: 'PAT-04580', therapy: 'Antibiotic Course', adherence: 78, outcomes: 'negative', feedback: 3.9, lastOrder: '2023-07-10' },
  ];

  const adherenceData = [
    { month: t('jan'), adherence: 85 },
    { month: t('feb'), adherence: 88 },
    { month: t('mar'), adherence: 90 },
    { month: t('apr'), adherence: 87 },
    { month: t('may'), adherence: 91 },
    { month: t('jun'), adherence: 93 },
  ];

  const demographicsData = [
    { name: t('age-18-30'), value: 25, color: '#3b82f6' },
    { name: t('age-31-50'), value: 45, color: '#60a5fa' },
    { name: t('age-51-plus'), value: 30, color: '#93c5fd' },
  ];

  return (
    <Box p="6">
      <Flex justify="between" align="center" mb="5">
        <Heading size="6">{t('patient-therapy-management')}</Heading>
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
                  placeholder={t('patient-id-placeholder')}
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
            <Text size="2">{t('active-patients')}</Text>
            <Heading size="7">24,589</Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">{t('avg-adherence')}</Text>
            <Heading size="7">89%</Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">{t('ae-reports')}</Text>
            <Heading size="7" className="text-red-500">45</Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">{t('satisfaction')}</Text>
            <Heading size="7">4.6/5</Heading>
          </Flex>
        </Card>
      </Grid>

      <Flex gap="4" mb="5">
        <Card style={{ flex: 1 }}>
          <Heading size="4" mb="3">{t('therapy-adherence')}</Heading>
          <div className="h-64">
            <LineChart width={800} height={250} data={adherenceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="adherence" 
                stroke="#3b82f6" 
                strokeWidth={2}
              />
            </LineChart>
          </div>
        </Card>
        
        <Card style={{ flex: 1 }}>
          <Heading size="4" mb="3">{t('demographics')}</Heading>
          <div className="h-64">
            <PieChart width={400} height={250}>
              <Pie
                data={demographicsData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label
              >
                {demographicsData.map((entry, index) => (
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
            <Table.ColumnHeaderCell>{t('patient-id')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('therapy')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('adherence')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('outcomes')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('feedback')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('last-order')}</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {customers.map((customer) => (
            <Table.Row key={customer.id}>
              <Table.Cell>{customer.id}</Table.Cell>
              <Table.Cell>{customer.therapy}</Table.Cell>
              <Table.Cell>{customer.adherence}%</Table.Cell>
              <Table.Cell>
                <Badge variant="soft" color={customer.outcomes === 'positive' ? 'green' : 'red'}>
                  {t(customer.outcomes)}
                </Badge>
              </Table.Cell>
              <Table.Cell>{customer.feedback}/5</Table.Cell>
              <Table.Cell>{customer.lastOrder}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

export default EndCustomers;