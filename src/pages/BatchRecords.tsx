import React, { useState, useCallback, useMemo } from 'react'; // Added useState import
import { useTranslation } from 'react-i18next';
import {
  Table,
  Badge,
  Button,
  Flex,
  Heading,
  Text,
  IconButton,
  Box,
  Dialog,
  TextField,
  Select,
  Tooltip
} from '@radix-ui/themes';
import {
  MagnifyingGlassIcon,
  CubeIcon as BlockchainIcon,
  FileTextIcon,
  MixerHorizontalIcon,
  PlusIcon
} from '@radix-ui/react-icons';

const PRODUCT_FILTER_OPTIONS = [
  { value: 'all', label: 'filter-all-products' },
  { value: 'oral', label: 'filter-oral' },
  { value: 'injectable', label: 'filter-injectable' }
] as const;

type ApprovalStatus = 'approved' | 'pending' | 'rejected';
type ProductFilter = typeof PRODUCT_FILTER_OPTIONS[number]['value'];

interface BatchRecord {
  id: string;
  product: string;
  approval: ApprovalStatus;
  date: string;
  author: string;
}

const BatchRecords: React.FC = () => {
  const { t } = useTranslation('master-batch-records');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<ProductFilter>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const records: BatchRecord[] = [
    { 
      id: 'BR2023-045', 
      product: 'Poultry Drug 1',
      approval: 'approved',
      date: '2025-07-25',
      author: 'QA Auditor 1'
    },
  ];

  const filteredRecords = useMemo(() => {
    return records.filter(record =>
      (filter === 'all' || record.product.toLowerCase().includes(filter)) &&
      (record.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
       record.product.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [records, searchQuery, filter]);

  const handleSubmitToBlockchain = useCallback(() => {
    console.log('Submitting to blockchain...');
    alert(t('blockchain.submit-success', 'Records submitted to blockchain successfully'));
  }, [t]);

  const getApprovalColor = (status: ApprovalStatus) => {
    switch (status) {
      case 'approved': return 'green';
      case 'pending': return 'amber';
      case 'rejected': return 'red';
      default: return 'gray';
    }
  };

  return (
    <Box p="6" className="flex-1">
      <Flex justify="between" align="center" mb="5" gap="4">
        <Heading size="6">{t('heading')}</Heading>
        
        <Flex gap="3" align="center">
          <TextField.Root
            placeholder={t('search-placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-48"
          >
            <TextField.Slot>
              <MagnifyingGlassIcon />
            </TextField.Slot>
          </TextField.Root>
          
          <Select.Root 
            value={filter}
            onValueChange={(value) => setFilter(value as ProductFilter)}
          >
            <Select.Trigger />
            <Select.Content>
              {PRODUCT_FILTER_OPTIONS.map(option => (
                <Select.Item key={option.value} value={option.value}>
                  {t(option.label)}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
          
          <Button variant="soft" className="whitespace-nowrap">
            <MixerHorizontalIcon /> {t('new-record')}
          </Button>
        </Flex>
      </Flex>

      <Table.Root variant="surface" className="rounded-lg shadow-sm">
        <Table.Header className="bg-gray-50">
          <Table.Row>
            <Table.ColumnHeaderCell className="font-semibold">
              {t('table-id')}
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="font-semibold">
              {t('table-product')}
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="font-semibold">
              {t('table-approval-status')}
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="font-semibold">
              {t('table-date')}
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="font-semibold">
              {t('table-author')}
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="font-semibold">
              {t('table-actions')}
            </Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body className="divide-y divide-gray-200">
          {filteredRecords.map((record) => (
            <Table.Row key={record.id} className="hover:bg-gray-50">
              <Table.Cell className="font-medium">{record.id}</Table.Cell>
              <Table.Cell>{record.product}</Table.Cell>
              <Table.Cell>
                <Badge 
                  color={getApprovalColor(record.approval)}
                  variant="soft"
                  className="capitalize"
                >
                  {t(`approval-status.${record.approval}`)}
                </Badge>
              </Table.Cell>
              <Table.Cell>{record.date}</Table.Cell>
              <Table.Cell>{record.author}</Table.Cell>
              <Table.Cell>
                <Tooltip content={t('view-pdf')}>
                  <IconButton variant="ghost">
                    <FileTextIcon />
                  </IconButton>
                </Tooltip>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <Flex mt="6" justify="center">
        <Button 
          variant="solid" 
          color="green"
          className="bg-green-700 hover:bg-green-800 transition-colors"
          onClick={handleSubmitToBlockchain}
        >
          <BlockchainIcon className="mr-2" />
          {t('submit-to-blockchain', 'Submit to Blockchain')}
        </Button>
      </Flex>

      <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog.Content>
          <Dialog.Title>{t('new-record-dialog.title')}</Dialog.Title>
          {/* Add your form fields here */}
        </Dialog.Content>
      </Dialog.Root>
    </Box>
  );
};

export default BatchRecords;
