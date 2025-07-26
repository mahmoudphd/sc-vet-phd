import React, { useState } from 'react';
import {
  Card,
  Flex,
  Heading,
  Table,
  Button,
  TextField,
  Dialog,
  Select,
} from '@radix-ui/themes';
import { PlusIcon } from '@radix-ui/react-icons';

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

const initialScrapData: ScrapEntry[] = [
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
];

export default function ScrapProducts() {
  const [scrapData, setScrapData] = useState<ScrapEntry[]>(initialScrapData);
  const [dialogOpen, setDialogOpen] = useState(false);

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

  const handleAddEntry = () => {
    const newId = (scrapData.length + 1).toString();
    setScrapData([...scrapData, { ...newEntry, id: newId }]);
    setDialogOpen(false);
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
  };

  return (
    <Card className="p-4">
      <Flex justify="between" align="center" className="mb-4">
        <Heading size="5">Scrap Products</Heading>
        <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
          <Dialog.Trigger>
            <Button variant="soft" color="blue">
              <PlusIcon /> New Scrap
            </Button>
          </Dialog.Trigger>
          <Dialog.Content maxWidth="450px">
            <Dialog.Title>Add New Scrap</Dialog.Title>
            <Flex direction="column" gap="3" mt="3">
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
                  setNewEntry({ ...newEntry, weight: parseInt(e.target.value) })
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
            <Flex justify="end" mt="4">
              <Button onClick={handleAddEntry}>Add</Button>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      </Flex>

      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Batch ID / Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Type</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Weight (g)</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Handling Method</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Reason</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {scrapData.map((entry) => (
            <Table.Row key={entry.id}>
              <Table.Cell>
                {entry.batchId} / {entry.productName}
              </Table.Cell>
              <Table.Cell>{entry.type}</Table.Cell>
              <Table.Cell>{entry.weight}</Table.Cell>
              <Table.Cell>{entry.handlingMethod}</Table.Cell>
              <Table.Cell>{entry.reason}</Table.Cell>
              <Table.Cell>{entry.date}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <Flex justify="center" mt="5">
        <Button color="green">Submit to Blockchain</Button>
      </Flex>
    </Card>
  );
}
