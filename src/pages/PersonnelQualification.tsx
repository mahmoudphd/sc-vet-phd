import { useTranslation } from 'react-i18next';
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
  Select
} from '@radix-ui/themes';
import {
  PersonIcon,
  ClockIcon,
  RocketIcon
} from '@radix-ui/react-icons';
import { PieChart, Pie, Cell } from 'recharts';

const PersonnelQualification = () => {
  const { t } = useTranslation('personnel-qualification-page');
  const employees = [
    {
      id: 'EMP-0451',
      name: 'Dr. Ahmed Sami',
      role: 'quality-auditor-role',
      certifications: 4,
      trainingProgress: 85,
      expiry: '2024-03-15',
      status: 'qualified-status'
    },
  ];

  const complianceData = [
    { name: 'qualified-status', value: 85, color: '#10b981' },
    { name: 'pending-status', value: 10, color: '#f59e0b' },
    { name: 'expired-status', value: 5, color: '#ef4444' },
  ];

  return (
    <Box p="6">
      <Flex justify="between" align="center" mb="5">
        <Heading size="6">{t('gmp-title')}</Heading>
        <Flex gap="3">
          <Dialog.Root>
            <Dialog.Trigger>
              <Button variant="soft">
                <RocketIcon /> {t('new-training-plan-button')}
              </Button>
            </Dialog.Trigger>
            <Dialog.Content style={{ maxWidth: 450 }}>
              <Dialog.Title>{t('new-training-plan-button')}</Dialog.Title>
              <Flex direction="column" gap="3">
                <label>
                  <Text as="div" size="2" mb="1" weight="bold">
                    {t('training-plan-name-label')}
                  </Text>
                  <TextField.Root
                    placeholder={t('training-plan-name-placeholder')}
                  />
                </label>
                <label>
                  <Text as="div" size="2" mb="1" weight="bold">
                    {t('due-date-label')}
                  </Text>
                  <TextField.Root type="date" />
                </label>
                <Flex gap="3" mt="4" justify="end">
                  <Dialog.Close>
                    <Button variant="soft" color="gray">
                      {t('cancel-button')}
                    </Button>
                  </Dialog.Close>
                  <Dialog.Close>
                    <Button>
                      {t('create-button')}
                    </Button>
                  </Dialog.Close>
                </Flex>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>

          <Dialog.Root>
            <Dialog.Trigger>
              <Button variant="soft">
                {t('export-compliance-report-button')}
              </Button>
            </Dialog.Trigger>
            <Dialog.Content style={{ maxWidth: 450 }}>
              <Dialog.Title>{t('export-compliance-report-button')}</Dialog.Title>
              <Flex direction="column" gap="3">
                <label>
                  <Text as="div" size="2" mb="1" weight="bold">
                    {t('export-format-label')}
                  </Text>
                  <Select.Root defaultValue="pdf">
                    <Select.Trigger />
                    <Select.Content>
                      <Select.Item value="pdf">PDF</Select.Item>
                      <Select.Item value="csv">CSV</Select.Item>
                      <Select.Item value="xlsx">Excel</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </label>
                <label>
                  <Text as="div" size="2" mb="1" weight="bold">
                    {t('date-range-label')}
                  </Text>
                  <Flex gap="2">
                    <TextField.Root type="date" />
                    <TextField.Root type="date" />
                  </Flex>
                </label>
                <Flex gap="3" mt="4" justify="end">
                  <Dialog.Close>
                    <Button variant="soft" color="gray">
                      {t('cancel-button')}
                    </Button>
                  </Dialog.Close>
                  <Dialog.Close>
                    <Button>
                      {t('export-button')}
                    </Button>
                  </Dialog.Close>
                </Flex>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>
        </Flex>
      </Flex>

      <Grid columns="3" gap="4" mb="5">
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">{t('total-qualified-label')}</Text>
            <Heading size="7">142</Heading>
            <Text size="1" className="text-green-500">{t('compliance-percentage')}</Text>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">{t('training-due-label')}</Text>
            <Heading size="7" className="text-amber-500">15</Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">{t('certifications-expiring-label')}</Text>
            <Heading size="7" className="text-red-500">8</Heading>
          </Flex>
        </Card>
      </Grid>

      <Flex gap="4" mb="5">
        <Card style={{ flex: 1 }}>
          <Heading size="4" mb="3">{t('qualification-status-heading')}</Heading>
          <div className="h-64">
            <PieChart width={300} height={250}>
              <Pie
                data={complianceData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {complianceData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </div>
        </Card>
        <Card style={{ flex: 1 }}>
          <Heading size="4" mb="3">{t('training-timeline-heading')}</Heading>
        </Card>
      </Flex>

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>{t('employee-column')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('role-column')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('certifications-column')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('training-progress-column')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('expiry-date-column')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('status-column')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('actions-column')}</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {employees.map((employee) => (
            <Table.Row key={employee.id}>
              <Table.Cell>
                <Flex align="center" gap="2">
                  <PersonIcon />
                  {employee.name}
                </Flex>
              </Table.Cell>
              <Table.Cell>
                <Badge variant="soft">
                  {t(employee.role)}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <Badge variant="outline">
                  {employee.certifications} {t('active-label')}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <Flex align="center" gap="2">
                  <Progress value={employee.trainingProgress} />
                  <Text size="2">{employee.trainingProgress}%</Text>
                </Flex>
              </Table.Cell>
              <Table.Cell>
                <Flex align="center" gap="2">
                  <ClockIcon />
                  {employee.expiry}
                </Flex>
              </Table.Cell>
              <Table.Cell>
                <Badge
                  color={employee.status === 'qualified-status' ? 'green' : 'red'}
                  variant="soft"
                >
                  {t(employee.status)}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <Dialog.Root>
                  <Dialog.Trigger>
                    <Button variant="ghost" size="1">
                      {t('renew-certification-button')}
                    </Button>
                  </Dialog.Trigger>
                  <Dialog.Content style={{ maxWidth: 450 }}>
                    <Dialog.Title>{t('renew-certification-button')}</Dialog.Title>
                    <Dialog.Description size="2" mb="4">
                      {t('renew-certification-description', { name: employee.name })}
                    </Dialog.Description>
                    <Flex direction="column" gap="3">
                      <label>
                        <Text as="div" size="2" mb="1" weight="bold">
                          {t('expiry-date-label')}
                        </Text>
                        <TextField.Root
                          type="date"
                          defaultValue={employee.expiry}
                        />
                      </label>
                      <Flex gap="3" mt="4" justify="end">
                        <Dialog.Close>
                          <Button variant="soft" color="gray">
                            {t('cancel-button')}
                          </Button>
                        </Dialog.Close>
                        <Dialog.Close>
                          <Button>
                            {t('submit-button')}
                          </Button>
                        </Dialog.Close>
                      </Flex>
                    </Flex>
                  </Dialog.Content>
                </Dialog.Root>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

export default PersonnelQualification;