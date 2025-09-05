import React, { useState, useCallback } from 'react';
import {
  Table,
  Badge,
  Button,
  Flex,
  Heading,
  Select,
  TextField,
  Box,
  Dialog,
  Text,
  Tooltip,
  IconButton,
  Card
} from '@radix-ui/themes';
import {
  CubeIcon as BlockchainIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  Cross2Icon
} from '@radix-ui/react-icons';
import { toast } from 'sonner';

interface ScrapEntry {
  id: string;
  productName: string;
  batchId: string;
  scrapType: string;
  damageExtent: string;
  damageReason: string;
  handlingMethod: string;
  weight: number;
  date: string;
  detectedAt?: string;
}

const ScrapProducts = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrapData, setScrapData] = useState<ScrapEntry[]>([
    {
      id: '1',
      productName: 'Poultry Drug A',
      batchId: 'BR-001',
      scrapType: 'Product Only',
      damageExtent: 'Full',
      damageReason: 'Transportation Damage',
      handlingMethod: 'Recycling',
      weight: 0.5,
      date: '2025-09-24',
      detectedAt: '2025-09-24 14:30:45'
    },
    {
      id: '2',
      productName: 'Poultry Drug B',
      batchId: 'BR-002',
      scrapType: 'Packaging Only',
      damageExtent: 'Partial',
      damageReason: 'Expiration',
      handlingMethod: 'Safe Disposal',
      weight: 0.3,
      date: '2025-09-24',
      detectedAt: '2025-09-24 09:15:22'
    },
    {
      id: '3',
      productName: 'Poultry Drug C',
      batchId: 'BR-003',
      scrapType: 'Both',
      damageExtent: 'Full',
      damageReason: 'Contamination',
      handlingMethod: 'Incineration',
      weight: 0.75,
      date: '2025-09-23',
      detectedAt: '2025-09-23 16:45:30'
    },
  ]);

  const [newEntry, setNewEntry] = useState<ScrapEntry>({
    id: '',
    productName: '',
    batchId: '',
    scrapType: 'Product Only',
    damageExtent: 'Full',
    damageReason: 'Expiration',
    handlingMethod: 'Recycling',
    weight: 0,
    date: new Date().toISOString().split('T')[0],
  });

  // Scrap type options
  const scrapTypes = [
    { value: 'Product Only', label: 'Product Only' },
    { value: 'Packaging Only', label: 'Packaging Only' },
    { value: 'Both', label: 'Both' }
  ];

  // Damage extent options
  const damageExtents = [
    { value: 'Full', label: 'Full' },
    { value: 'Partial', label: 'Partial' }
  ];

  // Damage reason options
  const damageReasons = [
    { value: 'Expiration', label: 'Expiration' },
    { value: 'Transportation Damage', label: 'Transportation Damage' },
    { value: 'Contamination', label: 'Contamination' },
    { value: 'Manufacturing Defect', label: 'Manufacturing Defect' }
  ];

  // Handling method options
  const handlingMethods = [
    { value: 'Recycling', label: 'Recycling' },
    { value: 'Safe Disposal', label: 'Safe Disposal' },
    { value: 'Repackaging', label: 'Repackaging' },
    { value: 'Incineration', label: 'Incineration' }
  ];

  const filteredScraps = useCallback(() => {
    return scrapData.filter(scrap =>
      scrap.batchId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scrap.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scrap.scrapType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scrap.damageReason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scrap.handlingMethod.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [scrapData, searchQuery]);

  const handleAddEntry = () => {
    if (!newEntry.productName || !newEntry.batchId || !newEntry.weight) {
      toast.error('Please fill all required fields');
      return;
    }

    const newId = (scrapData.length + 1).toString();
    setScrapData([...scrapData, { 
      ...newEntry, 
      id: newId,
      detectedAt: new Date().toLocaleString()
    }]);
    setIsDialogOpen(false);
    setNewEntry({
      id: '',
      productName: '',
      batchId: '',
      scrapType: 'Product Only',
      damageExtent: 'Full',
      damageReason: 'Expiration',
      handlingMethod: 'Recycling',
      weight: 0,
      date: new Date().toISOString().split('T')[0],
    });
    toast.success('Scrap entry added successfully');
  };

  const handleSubmitToBlockchain = () => {
    toast.success('Scrap data submitted to blockchain successfully');
  };

  const handleFieldUpdate = (id: string, field: string, value: string) => {
    setScrapData(prevData => 
      prevData.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  // Minimal color scheme - only 2 colors for better professionalism
  const getScrapTypeColor = () => 'blue';
  const getDamageExtentColor = (extent: string) => extent === 'Full' ? 'red' : 'orange';
  const getDamageReasonColor = () => 'gray';
  const getMethodColor = (method: string) => method === 'Recycling' ? 'green' : 'orange';

  return (
    <Card className="p-6 rounded-lg shadow-sm">
      <Flex justify="between" align="center" mb="6">
        <Heading size="6">Scrap Products Management</Heading>
        
        <Flex gap="3" align="center">
          <TextField.Root
            placeholder="Search scraps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-56"
            variant="soft"
          >
            <TextField.Slot>
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
          
          <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <Dialog.Trigger>
              <Button variant="soft" className="shadow-sm">
                <PlusIcon className="mr-2" /> New Scrap
              </Button>
            </Dialog.Trigger>

            <Dialog.Content style={{ maxWidth: 600 }} className="p-6">
              <Flex justify="between" align="center" mb="4">
                <Dialog.Title className="font-bold">Add New Scrap Entry</Dialog.Title>
                <IconButton variant="ghost" onClick={() => setIsDialogOpen(false)}>
                  <Cross2Icon />
                </IconButton>
              </Flex>
              
              <Flex direction="column" gap="4">
                <Flex direction="column" gap="2">
                  <Text as="label" size="2" weight="bold">Product Name</Text>
                  <Select.Root
                    value={newEntry.productName}
                    onValueChange={(value) =>
                      setNewEntry({ ...newEntry, productName: value })
                    }
                  >
                    <Select.Trigger placeholder="Select product" />
                    <Select.Content>
                      <Select.Item value="Poultry Drug A">Poultry Drug A</Select.Item>
                      <Select.Item value="Poultry Drug B">Poultry Drug B</Select.Item>
                      <Select.Item value="Poultry Drug C">Poultry Drug C</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </Flex>

                <Flex direction="column" gap="2">
                  <Text as="label" size="2" weight="bold">Batch ID</Text>
                  <TextField.Root
                    placeholder="BR-001"
                    value={newEntry.batchId}
                    onChange={(e) =>
                      setNewEntry({ ...newEntry, batchId: e.target.value })
                    }
                  />
                </Flex>

                <Flex gap="3">
                  <Flex direction="column" gap="2" className="flex-1">
                    <Text as="label" size="2" weight="bold">Scrap Type</Text>
                    <Select.Root
                      value={newEntry.scrapType}
                      onValueChange={(value) =>
                        setNewEntry({ ...newEntry, scrapType: value })
                      }
                    >
                      <Select.Trigger />
                      <Select.Content>
                        {scrapTypes.map((type) => (
                          <Select.Item key={type.value} value={type.value}>
                            {type.label}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>
                  </Flex>

                  <Flex direction="column" gap="2" className="flex-1">
                    <Text as="label" size="2" weight="bold">Weight (kg)</Text>
                    <TextField.Root
                      type="number"
                      step="0.1"
                      placeholder="0.5"
                      value={newEntry.weight}
                      onChange={(e) =>
                        setNewEntry({ ...newEntry, weight: parseFloat(e.target.value) || 0 })
                      }
                    />
                  </Flex>
                </Flex>

                <Flex gap="3">
                  <Flex direction="column" gap="2" className="flex-1">
                    <Text as="label" size="2" weight="bold">Damage Extent</Text>
                    <Select.Root
                      value={newEntry.damageExtent}
                      onValueChange={(value) =>
                        setNewEntry({ ...newEntry, damageExtent: value })
                      }
                    >
                      <Select.Trigger />
                      <Select.Content>
                        {damageExtents.map((extent) => (
                          <Select.Item key={extent.value} value={extent.value}>
                            {extent.label}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>
                  </Flex>

                  <Flex direction="column" gap="2" className="flex-1">
                    <Text as="label" size="2" weight="bold">Damage Reason</Text>
                    <Select.Root
                      value={newEntry.damageReason}
                      onValueChange={(value) =>
                        setNewEntry({ ...newEntry, damageReason: value })
                      }
                    >
                      <Select.Trigger />
                      <Select.Content>
                        {damageReasons.map((reason) => (
                          <Select.Item key={reason.value} value={reason.value}>
                            {reason.label}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>
                  </Flex>
                </Flex>

                <Flex gap="3">
                  <Flex direction="column" gap="2" className="flex-1">
                    <Text as="label" size="2" weight="bold">Handling Method</Text>
                    <Select.Root
                      value={newEntry.handlingMethod}
                      onValueChange={(value) =>
                        setNewEntry({ ...newEntry, handlingMethod: value })
                      }
                    >
                      <Select.Trigger />
                      <Select.Content>
                        {handlingMethods.map((method) => (
                          <Select.Item key={method.value} value={method.value}>
                            {method.label}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>
                  </Flex>

                  <Flex direction="column" gap="2" className="flex-1">
                    <Text as="label" size="2" weight="bold">Date</Text>
                    <TextField.Root
                      type="date"
                      value={newEntry.date}
                      onChange={(e) =>
                        setNewEntry({ ...newEntry, date: e.target.value })
                      }
                    />
                  </Flex>
                </Flex>
              </Flex>

              <Flex gap="3" justify="end" mt="4" className="border-t border-gray-100 pt-4">
                <Button 
                  variant="soft" 
                  color="gray"
                  onClick={() => setIsDialogOpen(false)}
                  className="hover:bg-gray-100"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddEntry}
                  className="hover:bg-blue-600 transition-colors"
                >
                  Add Scrap
                </Button>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>
        </Flex>
      </Flex>

      <Table.Root variant="surface" className="rounded-lg shadow-sm border border-gray-200">
        <Table.Header className="bg-gray-50">
          <Table.Row className="[&>th]:font-semibold [&>th]:text-gray-700 [&>th]:py-3">
            <Table.ColumnHeaderCell>Batch ID / Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Scrap Type</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Damage Extent</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Damage Reason</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Weight (kg)</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Handling Method</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body className="divide-y divide-gray-100">
          {filteredScraps().map((entry) => (
            <Table.Row key={entry.id} className="hover:bg-gray-50/50">
              <Table.Cell className="font-medium">
                <Flex direction="column" gap="1">
                  <Text weight="bold">{entry.batchId}</Text>
                  <Text size="2" color="gray">{entry.productName}</Text>
                </Flex>
              </Table.Cell>
              
              <Table.Cell>
                <Select.Root
                  value={entry.scrapType}
                  onValueChange={(value) => handleFieldUpdate(entry.id, 'scrapType', value)}
                >
                  <Select.Trigger variant="ghost" className="w-full">
                    <Badge color={getScrapTypeColor()} variant="soft">
                      {entry.scrapType}
                    </Badge>
                  </Select.Trigger>
                  <Select.Content>
                    {scrapTypes.map((type) => (
                      <Select.Item key={type.value} value={type.value}>
                        {type.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </Table.Cell>
              
              <Table.Cell>
                <Select.Root
                  value={entry.damageExtent}
                  onValueChange={(value) => handleFieldUpdate(entry.id, 'damageExtent', value)}
                >
                  <Select.Trigger variant="ghost" className="w-full">
                    <Badge color={getDamageExtentColor(entry.damageExtent)} variant="soft">
                      {entry.damageExtent}
                    </Badge>
                  </Select.Trigger>
                  <Select.Content>
                    {damageExtents.map((extent) => (
                      <Select.Item key={extent.value} value={extent.value}>
                        {extent.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </Table.Cell>
              
              <Table.Cell>
                <Select.Root
                  value={entry.damageReason}
                  onValueChange={(value) => handleFieldUpdate(entry.id, 'damageReason', value)}
                >
                  <Select.Trigger variant="ghost" className="w-full">
                    <Badge color={getDamageReasonColor()} variant="soft">
                      {entry.damageReason}
                    </Badge>
                  </Select.Trigger>
                  <Select.Content>
                    {damageReasons.map((reason) => (
                      <Select.Item key={reason.value} value={reason.value}>
                        {reason.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </Table.Cell>
              
              <Table.Cell className="font-medium">
                {entry.weight.toFixed(2)} kg
              </Table.Cell>
              
              <Table.Cell>
                <Select.Root
                  value={entry.handlingMethod}
                  onValueChange={(value) => handleFieldUpdate(entry.id, 'handlingMethod', value)}
                >
                  <Select.Trigger variant="ghost" className="w-full">
                    <Badge color={getMethodColor(entry.handlingMethod)} variant="soft">
                      {entry.handlingMethod}
                    </Badge>
                  </Select.Trigger>
                  <Select.Content>
                    {handlingMethods.map((method) => (
                      <Select.Item key={method.value} value={method.value}>
                        {method.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </Table.Cell>
              
              <Table.Cell className="text-gray-700">
                {entry.date}
                {entry.detectedAt && (
                  <Tooltip content={`Detected at: ${entry.detectedAt}`}>
                    <Badge color="blue" variant="soft" className="ml-2 cursor-pointer">
                      Via IoT
                    </Badge>
                  </Tooltip>
                )}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Card>
  );
};

export default ScrapProducts;
