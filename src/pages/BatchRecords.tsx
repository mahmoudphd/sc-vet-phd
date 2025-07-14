import { 
  Table, 
  Badge, 
  Button, 
  Flex, 
  Heading, 
  Select,
  TextField,
  Box
} from '@radix-ui/themes';
import { useTranslation } from 'react-i18next';

const BatchRecords = () => {
  const { t } = useTranslation('master-batch-records');
  const records = [
    { 
      id: 'BR2023-045', 
      product: 'NSAID Injectable',
      approval: 'approved',
      date: '2023-07-15',
      author: 'QA Auditor 1'
    },
  ];

  return (
    <Box p="6" className="flex-1">
      <Flex justify="between" align="center" mb="5">
        <Heading size="6">{t('heading')}</Heading>
        <Flex gap="3">
          <TextField.Root placeholder={t('search-placeholder')} />
          <Select.Root defaultValue="all">
            <Select.Trigger />
            <Select.Content>
              <Select.Item value="all">{t('filter-all-products')}</Select.Item>
              <Select.Item value="oral">{t('filter-oral')}</Select.Item>
              <Select.Item value="injectable">{t('filter-injectable')}</Select.Item>
            </Select.Content>
          </Select.Root>
        </Flex>
      </Flex>

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>{t('table-id')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('table-product')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('table-approval-status')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('table-date')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('table-author')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('table-actions')}</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {records.map((record) => (
            <Table.Row key={record.id}>
              <Table.Cell>{record.id}</Table.Cell>
              <Table.Cell>{record.product}</Table.Cell>
              <Table.Cell>
                <Badge 
                  color={
                    record.approval === 'approved' ? 'green' :
                    record.approval === 'pending' ? 'amber' : 'red'
                  }
                >
                  {t(`approval-status.${record.approval}`)}
                </Badge>
              </Table.Cell>
              <Table.Cell>{record.date}</Table.Cell>
              <Table.Cell>{record.author}</Table.Cell>
              <Table.Cell>
                <Button variant="ghost">{t('view-pdf')}</Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

export default BatchRecords;