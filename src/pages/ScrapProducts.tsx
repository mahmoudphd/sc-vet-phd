import React, { useState } from 'react';
import {
  Card,
  Flex,
  Heading,
  Button,
  Text,
  Table,
  Dialog,
  TextField,
  Select,
  Box,
} from '@radix-ui/themes';
import { PlusIcon } from '@radix-ui/react-icons';

interface ScrapEntry {
  batchId: string;
  productName: string;
  reason: string;
  type: string;
  weight: string;
  date: string;
  status: string;
  handling: string;
}

const initialScrapData: ScrapEntry[] = [
  {
    batchId: 'BATCH-001',
    productName: 'Poultry Product A',
    reason: 'Expiration',
    type: 'Liquid',
    weight: '12',
    date: '2025-07-25',
    status: 'Pending',
    handling: 'Incineration',
  },
  {
    batchId: 'BATCH-002',
    productName: 'Poultry Product B',
    reason: 'Damaged Packaging',
    type: 'Powder',
    weight: '8',
    date: '2025-07-24',
    status: 'Handled',
    handling: 'Recycling',
  },
];

export default function ScrapProducts() {
  const [scrapData, setScrapData] = useState<ScrapEntry[]>(initialScrapData);
  const [open, setOpen] = useState(false);
  const [newEntry, setNewEntry] = useState<ScrapEntry>({
    batchId: '',
    productName: '',
    reason: '',
    type: '',
    weight: '',
    date: '',
    status: '',
    handling: '',
  });

  const handleAddNew = () => {
    setScrapData([...scrapData, newEntry]);
    setOpen(false);
    setNewEntry({
      batchId: '',
      productName: '',
      reason: '',
      type: '',
      weight: '',
      date: '',
      status: '',
      handling: '',
    });
  };

  return (
    <Box p="4">
      <Flex justify="between" align="center" mb="4">
        <Heading size="6">Scrap Products Management</Heading>
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger>
            <Button variant="soft" color="green">
              <PlusIcon /> New Scrap +
            </Button>
          </Dialog.Trigger>
          <Dialog.Content maxWidth="450px">
            <Dialog.Title>Add New Scrap Entry</Dialog.Title>
            <Flex direction="column" gap="3" mt="3">
              <TextField.Input
                placeholder="Batch ID"
                value={newEntry.batchId}
                onChange={(e) =>
                  setNewEntry({ ...newEntry, batchId: e.target.value })
                }
              />
              <TextField.Input
                placeholder="Product Name"
                value={newEntry.productName}
                onChange={(e) =>
                  setNewEntry({ ...newEntry, productName: e.target.value })
                }
              />
              <Select.Root
                value={newEntry.reason}
                onValueChange={(value) =>
                  setNewEntry({ ...newEntry, reason: value })
                }
              >
                <Select.Trigger placeholder="Select Reason" />
                <Select.Content>
                  <Select.Item value="Expiration">Expiration</Select.Item>
                  <Select.Item value="Damaged Packaging">
                    Damaged Packaging
                  </Select.Item>
                  <Select.Item value="Contamination">Contamination</Select.Item>
                  <Select.Item value="Other">Other</Select.Item>
                </Select.Content>
              </Select.Root>
              <Select.Root
                value={newEntry.type}
                onValueChange={(value) =>
                  setNewEntry({ ...newEntry, type: value })
                }
              >
                <Select.Trigger placeholder="Select Type" />
                <Select.Content>
                  <Select.Item value="Liquid">Liquid</Select.Item>
                  <Select.Item value="Powder">Powder</Select.Item>
                  <Select.Item value="Solid">Solid</Select.Item>
                </Select.Content>
              </Select.Root>
              <TextField.Input
                placeholder="Weight (kg)"
                type="number"
                value={newEntry.weight}
                onChange={(e) =>
                  setNewEntry({ ...newEntry, weight: e.target.value })
                }
              />
              <TextField.Input
                placeholder="Date"
                type="date"
                value={newEntry.date}
                onChange={(e) =>
                  setNewEntry({ ...newEntry, date: e.target.value })
                }
              />
              <TextField.Input
                placeholder="Status"
                value={newEntry.status}
                onChange={(e) =>
                  setNewEntry({ ...newEntry, status: e.target.value })
                }
              />
              <TextField.Input
                placeholder="Handling Method"
                value={newEntry.handling}
                onChange={(e) =>
                  setNewEntry({ ...newEntry, handling: e.target.value })
                }
              />
            </Flex>
            <Flex mt="4" justify="end">
              <Button onClick={handleAddNew}>Add</Button>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      </Flex>

      <Card>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Batch ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Product Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Reason</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Type</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Weight (kg)</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Handling</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {scrapData.map((item, index) => (
              <Table.Row key={index}>
                <Table.Cell>{item.batchId}</Table.Cell>
                <Table.Cell>{item.productName}</Table.Cell>
                <Table.Cell>{item.reason}</Table.Cell>
                <Table.Cell>{item.type}</Table.Cell>
                <Table.Cell>{item.weight}</Table.Cell>
                <Table.Cell>{item.date}</Table.Cell>
                <Table.Cell>{item.status}</Table.Cell>
                <Table.Cell>{item.handling}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Card>

      <Flex justify="end" mt="4">
        <Button color="blue">Submit to Blockchain</Button>
      </Flex>
    </Box>
  );
}
