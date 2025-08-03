import React, { useState, useCallback, useMemo } from 'react';
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

type ApprovalStatus = 'approved' | 'pending' | 'rejected';

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const records: BatchRecord[] = [
    { 
      id: 'BR2023-045', 
      product: 'Poultry Drug 1',
      approval: 'approved',
      date: '2025-07-25',
      author: 'QA Auditor 1'
    },
    { 
      id: 'BR2023-046', 
      product: 'Poultry Drug 2',
      approval: 'pending',
      date: '2025-07-26',
      author: 'QA Auditor 2'
    },
  ];

  const filteredRecords = useMemo(() => {
    return records.filter(record =>
      record.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.product.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [records, searchQuery]);

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
          
          <Button 
            variant="solid" 
            color="green"
            className="bg-green-700 hover:bg-green-800 transition-colors"
            onClick={handleSubmitToBlockchain}
          >
            <BlockchainIcon className="mr-2" />
            Submit to Blockchain
          </Button>
          
          <Button 
            variant="soft" 
            className="whitespace-nowrap"
            onClick={() => setIsDialogOpen(true)}
          >
            <PlusIcon className="mr-2" />
            Add Record
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
              <Table.Cell>
                <Select.Root defaultValue={record.product}>
                  <Select.Trigger variant="soft" />
                  <Select.Content>
                    <Select.Item value="Poultry Drug 1">Poultry Drug 1</Select.Item>
                    <Select.Item value="Poultry Drug 2">Poultry Drug 2</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Table.Cell>
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

      <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog.Content>
          <Dialog.Title>Add New Record</Dialog.Title>
          {/* Add your form fields here for new record creation */}
        </Dialog.Content>
      </Dialog.Root>
    </Box>
  );
};

export default BatchRecords;
