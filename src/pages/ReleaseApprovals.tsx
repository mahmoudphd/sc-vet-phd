import { 
  Table, 
  Badge, 
  Card, 
  Flex, 
  Heading, 
  Text, 
  Button,
  Dialog,
  TextField,
  ScrollArea,
  Select,
  Box
} from '@radix-ui/themes';
import { 
  CheckCircledIcon,
  CrossCircledIcon,
  FileTextIcon,
  LockClosedIcon,
  MagnifyingGlassIcon
} from '@radix-ui/react-icons';
import { useTranslation } from 'react-i18next';

const ReleaseApprovals = () => {
  const { t } = useTranslation('release-approvals');
  const batches = [
    {
      id: 'VC23001',
      product: 'Anthelmintic Oral Suspension',
      qcStatus: t('status-passed'),
      documents: t('documents-complete'),
      approver: 'QA Manager',
      releaseDate: '2023-08-15',
      signature: 'ES/23/0001'
    },
  ];

  return (
    <Box p="6">
      <Flex justify="between" align="center" mb="5">
        <Heading size="6">{t('batch-release-authorization')}</Heading>
        <Flex gap="3">
          <TextField.Root placeholder={t('search-batches-placeholder')} />
          <Select.Root defaultValue="all">
            <Select.Trigger />
            <Select.Content>
              <Select.Item value="all">{t('filter-all-products')}</Select.Item>
              <Select.Item value="pending">{t('filter-pending-release')}</Select.Item>
            </Select.Content>
          </Select.Root>
        </Flex>
      </Flex>

      <Flex gap="4" mb="5">
        <Card style={{ flex: 1 }}>
          <Flex direction="column" gap="1">
            <Text size="2">{t('pending-releases')}</Text>
            <Heading size="7">10 {t('batches-count')}</Heading>
          </Flex>
        </Card>
        <Card style={{ flex: 1 }}>
          <Flex direction="column" gap="1">
            <Text size="2">{t('oos-results')}</Text>
            <Heading size="7" className="text-red-500">
              {t('batch-count')}
            </Heading>
          </Flex>
        </Card>
      </Flex>

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>{t('table-headers.batch-id')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('table-headers.qc-status')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('table-headers.documentation')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('table-headers.approver')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('table-headers.release-date')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('table-headers.actions')}</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {batches.map((batch) => (
            <Table.Row key={batch.id}>
              <Table.Cell>{batch.id}</Table.Cell>
              <Table.Cell>
                <Badge 
                  color={batch.qcStatus === t('status-passed') ? 'green' : 'red'}
                  variant="soft"
                >
                  {batch.qcStatus}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <Flex gap="2" align="center">
                  <FileTextIcon />
                  {batch.documents}
                </Flex>
              </Table.Cell>
              <Table.Cell>{batch.approver}</Table.Cell>
              <Table.Cell>{batch.releaseDate}</Table.Cell>
              <Table.Cell>
                <Flex gap="2">
                <Dialog.Root>
                  <Dialog.Trigger>
                    <Button variant="soft" size="1">
                      <LockClosedIcon /> {t('approve-button')}
                    </Button>
                  </Dialog.Trigger>
                  <Dialog.Content>
                    <Dialog.Title>{t('approve-confirmation-title')}</Dialog.Title>
                    <Dialog.Description>
                      {t('approve-confirmation-message', { batchId: batch.id })}
                    </Dialog.Description>
                    
                    <Flex gap="3" mt="4" justify="end">
                      <Dialog.Close>
                        <Button variant="soft">{t('cancel-button')}</Button>
                      </Dialog.Close>
                      <Dialog.Close>
                        <Button color="green">{t('confirm-button')}</Button>
                      </Dialog.Close>
                    </Flex>
                  </Dialog.Content>
                </Dialog.Root>
                <Dialog.Root>
                  <Dialog.Trigger>
                    <Button variant="soft" size="1" color="red">
                      <CrossCircledIcon /> {t('reject-button')}
                    </Button>
                  </Dialog.Trigger>
                  <Dialog.Content>
                    <Dialog.Title>{t('reject-confirmation-title')}</Dialog.Title>
                    <Dialog.Description>
                      {t('reject-confirmation-message', { batchId: batch.id })}
                    </Dialog.Description>
                    
                    <TextField.Root
                      placeholder={t('rejection-reason-placeholder')}
                      mt="3"
                    />
                    
                    <Flex gap="3" mt="4" justify="end">
                      <Dialog.Close>
                        <Button variant="soft">{t('cancel-button')}</Button>
                      </Dialog.Close>
                      <Dialog.Close>
                        <Button color="red">{t('confirm-button')}</Button>
                      </Dialog.Close>
                    </Flex>
                  </Dialog.Content>
                </Dialog.Root>
                </Flex>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      {/* <Flex mt="5" gap="3">
        <Button variant="soft">
          <MagnifyingGlassIcon /> {t('audit-trail-button')}
        </Button>
        <Button variant="soft">
          {t('export-certificates-button')}
        </Button>
      </Flex> */}
    </Box>
  );
};

export default ReleaseApprovals;