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
  Box
} from '@radix-ui/themes';
import {
  PersonIcon,
  IdCardIcon,
  ClockIcon,
  CheckCircledIcon,
  FileTextIcon,
  RocketIcon
} from '@radix-ui/react-icons';
import { BarChart, Bar } from 'recharts';
import { useTranslation } from 'react-i18next';

const AuditTrailViewer = () => {
  const { t } = useTranslation('audit-trail');

  const auditLogs = [
    {
      id: 'AUD-02345',
      timestamp: '2023-07-15 14:23:45',
      user: 'QA Auditor 1',
      action: 'Batch Release Approved',
      entity: 'VC23001',
      signature: 'ES/23/0451'
    },
  ];

  return (
    <Box p="6">
      <Flex justify="between" align="center" mb="5">
        <Heading size="6">{t('title')}</Heading>
        <Flex gap="3">
          <Button variant="soft">
            <FileTextIcon /> {t('exportCSV')}
          </Button>
          <Button variant="soft">
            {t('advancedFilters')}
          </Button>
        </Flex>
      </Flex>

      <Grid columns="3" gap="4" mb="5">
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">{t('totalRecords')}</Text>
            <Heading size="7">24,589</Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">{t('last7Days')}</Text>
            <Heading size="7">1,245</Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">{t('dataIntegrity')}</Text>
            <Heading size="7">99.98%</Heading>
          </Flex>
        </Card>
      </Grid>

      <Flex gap="4" mb="5">
        <Card style={{ flex: 1 }}>
          <Heading size="4" mb="3">{t('activityTimeline')}</Heading>
          {/* <div className="h-64">
              <Timeline>
                {auditLogs.map((log) => (
                  <Timeline.Item key={log.id}>
                    <Text size="1">{log.timestamp}</Text>
                    <Text>{log.action}</Text>
                  </Timeline.Item>
                ))}
              </Timeline>
            </div> */}
        </Card>
        <Card style={{ flex: 1 }}>
          <Heading size="4" mb="3">{t('activityFrequency')}</Heading>
          <div className="h-64">
            <BarChart width={500} height={250} data={auditLogs}>
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </div>
        </Card>
      </Flex>

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>{t('tableHeaders.timestamp')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('tableHeaders.user')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('tableHeaders.action')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('tableHeaders.entity')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('tableHeaders.signature')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('tableHeaders.details')}</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {auditLogs.map((log) => (
            <Table.Row key={log.id}>
              <Table.Cell>{log.timestamp}</Table.Cell>
              <Table.Cell>
                <Badge variant="soft">
                  {log.user}
                </Badge>
              </Table.Cell>
              <Table.Cell>{log.action}</Table.Cell>
              <Table.Cell>{log.entity}</Table.Cell>
              <Table.Cell>{log.signature}</Table.Cell>
              <Table.Cell>
                <Button variant="ghost" size="1">
                  View Context
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>

      </Table.Root>

      <Flex mt="5" justify="end">
        <Text size="1" className="text-gray-400">
          {t('footerText')}
        </Text>
      </Flex>
    </Box>
  );
};

export default AuditTrailViewer