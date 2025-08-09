import React, { useState, useCallback, useMemo } from 'react';
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
  PlusIcon,
  CheckCircledIcon,
  ClockIcon,
  CrossCircledIcon
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
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const PRODUCT_OPTIONS = [
    'Poultry Drug A',
    'Poultry Drug B',
    'Poultry Drug C'
  ] as const;

  const records: BatchRecord[] = [
    { 
      id: 'BR2023-045', 
      product: 'Poultry Drug A',
      approval: 'approved',
      date: '2025-07-25',
      author: 'QA Auditor 1'
    },
    { 
      id: 'BR2023-046', 
      product: 'Poultry Drug B',
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
    alert('Records submitted to blockchain successfully');
  }, []);

  const getApprovalColor = (status: ApprovalStatus) => {
    switch (status) {
      case 'approved': return 'green';
      case 'pending': return 'amber';
      case 'rejected': return 'red';
      default: return 'gray';
    }
  };

  const getApprovalIcon = (status: ApprovalStatus) => {
    switch (status) {
      case 'approved': return <CheckCircledIcon className="mr-1" />;
      case 'pending': return <ClockIcon className="mr-1" />;
      case 'rejected': return <CrossCircledIcon className="mr-1" />;
      default: return null;
    }
  };

  return (
    <Box p="6" className="flex-1">
      <Flex justify="between" align="center" mb="6" gap="4">
        <Heading size="6" className="text-gray-800 font-bold">Batch Records</Heading>
        
        <Flex gap="3" align="center">
          <TextField.Root
            placeholder="Search records..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-56"
            variant="soft"
          >
            <TextField.Slot className="text-gray-500">
              <MagnifyingGlassIcon />
            </TextField.Slot>
          </TextField.Root>
          
          <Button 
            variant="solid" 
            color="green"
            className="bg-green-700 hover:bg-green-800 transition-colors shadow-sm"
            onClick={handleSubmitToBlockchain}
          >
            <BlockchainIcon className="mr-2" />
            Submit to Blockchain
          </Button>
          
          <Button 
            variant="soft" 
            className="whitespace-nowrap shadow-sm"
            onClick={() => setIsDialogOpen(true)}
          >
            <PlusIcon className="mr-2" />
            Add Record
          </Button>
        </Flex>
      </Flex>

      <Table.Root variant="surface" className="rounded-lg shadow-sm border border-gray-200">
        <Table.Header className="bg-gray-50">
          <Table.Row className="[&>th]:font-semibold [&>th]:text-gray-700">
            <Table.ColumnHeaderCell>Batch ID</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Product</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Author</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body className="divide-y divide-gray-100">
          {filteredRecords.map((record) => (
            <Table.Row key={record.id} className="hover:bg-gray-50/50">
              <Table.Cell className="font-medium">
                <Badge variant="soft" className="px-2 py-1">
                  {record.id}
                </Badge>
              </Table.Cell>
              
              <Table.Cell>
                <Select.Root defaultValue={record.product}>
                  <Select.Trigger variant="soft" className="w-full" />
                  <Select.Content>
                    {PRODUCT_OPTIONS.map(product => (
                      <Select.Item key={product} value={product}>{product}</Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </Table.Cell>
              
              <Table.Cell>
                <Badge 
                  color={getApprovalColor(record.approval)}
                  variant="soft"
                  className="px-2 py-1 rounded-full text-xs font-medium"
                >
                  {getApprovalIcon(record.approval)}
                  {record.approval.charAt(0).toUpperCase() + record.approval.slice(1)}
                </Badge>
              </Table.Cell>
              
              <Table.Cell className="text-gray-700">{record.date}</Table.Cell>
              <Table.Cell className="text-gray-700">{record.author}</Table.Cell>
              
              <Table.Cell>
                <Tooltip content="View PDF document">
                  <IconButton variant="soft" className="hover:bg-blue-100">
                    <FileTextIcon />
                  </IconButton>
                </Tooltip>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog.Content style={{ maxWidth: 500 }} className="p-6">
          <Dialog.Title className="text-xl font-bold text-gray-800 mb-2">Add New Batch Record</Dialog.Title>
          
          <Flex direction="column" gap="4" className="mb-6">
            <Flex direction="column" gap="2">
              <Text as="label" size="2" weight="bold" className="text-gray-700">
                Batch ID
              </Text>
              <TextField.Root placeholder="BR2023-XXX" />
            </Flex>

            <Flex direction="column" gap="2">
              <Text as="label" size="2" weight="bold" className="text-gray-700">
                Product
              </Text>
              <Select.Root>
                <Select.Trigger placeholder="Select product" className="w-full" />
                <Select.Content>
                  {PRODUCT_OPTIONS.map(product => (
                    <Select.Item key={product} value={product}>{product}</Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </Flex>
          </Flex>

          <Flex gap="3" justify="end" className="border-t border-gray-100 pt-4">
            <Button 
              variant="soft" 
              color="gray"
              onClick={() => setIsDialogOpen(false)}
              className="hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button className="hover:bg-blue-600 transition-colors">
              <PlusIcon className="mr-2" /> Add Record
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Box>
  );
};

export default BatchRecords;
