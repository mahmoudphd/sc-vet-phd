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
  type: string;
  weight: number;
  handlingMethod: string;
  reason: string;
  date: string;
}

const ScrapProducts = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrapData, setScrapData] = useState<ScrapEntry[]>([
    {
      id: '1',
      productName: 'Poultry Product A',
      batchId: 'BR-001',
      type: 'Full',
      weight: 500,
      handlingMethod: 'Recycled',
      reason: 'Expiration',
      date: '2025-07-24',
    },
    {
      id: '2',
      productName: 'Poultry Product B',
      batchId: 'BR-002',
      type: 'Partial',
      weight: 300,
      handlingMethod: 'Disposed',
      reason: 'Damage',
      date: '2025-07-24',
    },
  ]);

  const [newEntry, setNewEntry] = useState<ScrapEntry>({
    id: '',
    productName: '',
    batchId: '',
    type: 'Full',
    weight: 0,
    handlingMethod: 'Recycled',
    reason: 'Expiration',
    date: new Date().toISOString().split('T')[0],
  });

  const filteredScraps = useCallback(() => {
    return scrapData.filter(scrap =>
      scrap.batchId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scrap.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [scrapData, searchQuery]);

  const handleAddEntry = () => {
    if (!newEntry.productName || !newEntry.batchId || !newEntry.weight) {
      toast.error('Please fill all required fields');
      return;
    }

    const newId = (scrapData.length + 1).toString();
    setScrapData([...scrapData, { ...newEntry, id: newId }]);
    setIsDialogOpen(false);
    setNewEntry({
      id: '',
      productName: '',
      batchId: '',
      type: 'Full',
      weight: 0,
      handlingMethod: 'Recycled',
      reason: 'Expiration',
      date: new Date().toISOString().split('T')[0],
    });
    toast.success('Scrap entry added successfully');
  };

  const handleSubmitToBlockchain = () => {
    toast.success('Scrap data submitted to blockchain successfully');
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'Recycled': return 'green';
      case 'Disposed': return 'red';
      case 'Incinerated': return 'amber';
      default: return 'gray';
    }
  };

  return (
    <Card className="p-6">
      <Flex justify="between" align="center" mb="5">
        <Heading size="6">Scrap Products Management</Heading>
        
        <Flex gap="3" align="center">
          <TextField.Root
            placeholder="Search scraps..."
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
          
          <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <Dialog.Trigger>
              <Button variant="soft">
                <PlusIcon className="mr-2" /> New Scrap
              </Button>
            </Dialog.Trigger>

            <Dialog.Content style={{ maxWidth: 500 }}>
              <Flex justify="between" align="center" mb="4">
                <Dialog.Title>Add New Scrap Entry</Dialog.Title>
                <IconButton variant="ghost" onClick={() => setIsDialogOpen(false)}>
                  <Cross2Icon />
                </IconButton>
              </Flex>
              
              <Flex direction="column" gap="3">
                <TextField.Root
                  placeholder="Product Name"
                  value={newEntry.productName}
                  onChange={(e) =>
                    setNewEntry({ ...newEntry, productName: e.target.value })
                  }
                />

                <TextField.Root
                  placeholder="Batch ID"
                  value={newEntry.batchId}
                  onChange={(e) =>
                    setNewEntry({ ...newEntry, batchId: e.target.value })
                  }
                />

                <Select.Root
                  value={newEntry.type}
                  onValueChange={(value) =>
                    setNewEntry({ ...newEntry, type: value })
                  }
                >
                  <Select.Trigger placeholder="Type" />
                  <Select.Content>
                    <Select.Item value="Full">Full</Select.Item>
                    <Select.Item value="Partial">Partial</Select.Item>
                  </Select.Content>
                </Select.Root>

                <TextField.Root
                  type="number"
                  placeholder="Weight (g)"
                  value={newEntry.weight.toString()}
                  onChange={(e) =>
                    setNewEntry({ ...newEntry, weight: parseInt(e.target.value) || 0 })
                  }
                />

                <Select.Root
                  value={newEntry.handlingMethod}
                  onValueChange={(value) =>
                    setNewEntry({ ...newEntry, handlingMethod: value })
                  }
                >
                  <Select.Trigger placeholder="Handling Method" />
                  <Select.Content>
                    <Select.Item value="Recycled">Recycled</Select.Item>
                    <Select.Item value="Disposed">Disposed</Select.Item>
                    <Select.Item value="Incinerated">Incinerated</Select.Item>
                  </Select.Content>
                </Select.Root>

                <Select.Root
                  value={newEntry.reason}
                  onValueChange={(value) =>
                    setNewEntry({ ...newEntry, reason: value })
                  }
                >
                  <Select.Trigger placeholder="Reason" />
                  <Select.Content>
                    <Select.Item value="Expiration">Expiration</Select.Item>
                    <Select.Item value="Damage">Damage</Select.Item>
                    <Select.Item value="Quality Issue">Quality Issue</Select.Item>
                  </Select.Content>
                </Select.Root>

                <TextField.Root
                  type="date"
                  value={newEntry.date}
                  onChange={(e) =>
                    setNewEntry({ ...newEntry, date: e.target.value })
                  }
                />
              </Flex>

              <Flex gap="3" justify="end" mt="4">
                <Button 
                  variant="soft" 
                  color="gray"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddEntry}>
                  Add Scrap
                </Button>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>
        </Flex>
      </Flex>

      <Table.Root variant="surface" className="rounded-lg shadow-sm">
        <Table.Header className="bg-gray-50">
          <Table.Row>
            <Table.ColumnHeaderCell className="font-semibold">Batch ID / Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="font-semibold">Type</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="font-semibold">Weight (g)</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="font-semibold">Handling Method</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="font-semibold">Reason</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="font-semibold">Date</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body className="divide-y divide-gray-200">
          {filteredScraps().map((entry) => (
            <Table.Row key={entry.id} className="hover:bg-gray-50">
              <Table.Cell className="font-medium">
                {entry.batchId} / {entry.productName}
              </Table.Cell>
              <Table.Cell>
                <Badge variant="soft">
                  {entry.type}
                </Badge>
              </Table.Cell>
              <Table.Cell>{entry.weight.toLocaleString()}</Table.Cell>
              <Table.Cell>
                <Badge 
                  color={getMethodColor(entry.handlingMethod)}
                  variant="soft"
                >
                  {entry.handlingMethod}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <Flex direction="column" gap="1">
                  <Text>{entry.reason}</Text>
                  <Badge color="blue" variant="soft" className="w-fit">
                    Via IoT
                  </Badge>
                </Flex>
              </Table.Cell>
              <Table.Cell>{entry.date}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Card>
  );
};

export default ScrapProducts;
