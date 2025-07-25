// src/pages/ScrapProducts.tsx
import React, { useState } from 'react';
import {
  Card,
  Flex,
  Heading,
  Table,
  Button,
  Text,
  Dialog,
  TextField,
  Select,
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

export default function ScrapProducts() {
  const [scrapList, setScrapList] = useState<ScrapEntry[]>([
    {
      batchId: 'VC23001',
      productName: 'Poultry Product A',
      reason: 'Expiration',
      type: 'Full',
      weight: '15',
      date: '2024-07-01',
      status: 'Pending',
      handling: 'Disposed',
    },
    {
      batchId: 'VC23002',
      productName: 'Poultry Product B',
      reason: 'Damage',
      type: 'Partial',
      weight: '8',
      date: '2024-07-15',
      status: 'Approved',
      handling: 'Recycled',
    },
  ]);

  const [newScrap, setNewScrap] = useState<ScrapEntry>({
    batchId: '',
    productName: '',
    reason: 'Expiration',
    type: 'Full',
    weight: '',
    date: '',
    status: 'Pending',
    handling: 'Disposed',
  });

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAddScrap = () => {
    setScrapList([...scrapList, newScrap]);
    setNewScrap({
      batchId: '',
      productName: '',
      reason: 'Expiration',
      type: 'Full',
      weight: '',
      date: '',
      status: 'Pending',
      handling: 'Disposed',
    });
    setDialogOpen(false);
  };

  return (
    <Flex direction="column" gap="4" p="4">
      <Card>
        <Flex justify="between" align="center" mb="4">
          <Heading size="4">Scrap Products Records</Heading>
          <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
            <Dialog.Trigger>
              <Button variant="solid">
                <PlusIcon />
                New Scrap
              </Button>
            </Dialog.Trigger>
            <Dialog.Content style={{ maxWidth: 500 }}>
              <Dialog.Title>Add Scrap Record</Dialog.Title>
              <Flex direction="column" gap="3" mt="3">
                <TextField.Root
                  placeholder="Batch ID"
                  value={newScrap.batchId}
                  onChange={(e) =>
                    setNewScrap({ ...newScrap, batchId: e.target.value })
                  }
                />
                <TextField.Root
                  placeholder="Product Name"
                  value={newScrap.productName}
                  onChange={(e) =>
                    setNewScrap({ ...newScrap, productName: e.target.value })
                  }
                />
                <Select.Root
                  value={newScrap.reason}
                  onValueChange={(val) =>
                    setNewScrap({ ...newScrap, reason: val })
                  }
                >
                  <Select.Trigger placeholder="Reason" />
                  <Select.Content>
                    <Select.Item value="Expiration">Expiration</Select.Item>
                    <Select.Item value="Contamination">Contamination</Select.Item>
                    <Select.Item value="Damage">Damage</Select.Item>
                    <Select.Item value="Other">Other</Select.Item>
                  </Select.Content>
                </Select.Root>
                <Select.Root
                  value={newScrap.type}
                  onValueChange={(val) =>
                    setNewScrap({ ...newScrap, type: val })
                  }
                >
                  <Select.Trigger placeholder="Type" />
                  <Select.Content>
                    <Select.Item value="Full">Full</Select.Item>
                    <Select.Item value="Partial">Partial</Select.Item>
                  </Select.Content>
                </Select.Root>
                <TextField.Root
                  placeholder="Weight (kg)"
                  type="number"
                  value={newScrap.weight}
                  onChange={(e) =>
                    setNewScrap({ ...newScrap, weight: e.target.value })
                  }
                />
                <TextField.Root
                  placeholder="Date"
                  type="date"
                  value={newScrap.date}
                  onChange={(e) =>
                    setNewScrap({ ...newScrap, date: e.target.value })
                  }
                />
                <Select.Root
                  value={newScrap.status}
                  onValueChange={(val) =>
                    setNewScrap({ ...newScrap, status: val })
                  }
                >
                  <Select.Trigger placeholder="Status" />
                  <Select.Content>
                    <Select.Item value="Pending">Pending</Select.Item>
                    <Select.Item value="Approved">Approved</Select.Item>
                  </Select.Content>
                </Select.Root>
                <Select.Root
                  value={newScrap.handling}
                  onValueChange={(val) =>
                    setNewScrap({ ...newScrap, handling: val })
                  }
                >
                  <Select.Trigger placeholder="Handling Method" />
                  <Select.Content>
                    <Select.Item value="Recycled">Recycled</Select.Item>
                    <Select.Item value="Disposed">Disposed</Select.Item>
                    <Select.Item value="Incinerated">Incinerated</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Flex>
              <Flex justify="end" mt="4">
                <Button onClick={handleAddScrap}>Add Scrap</Button>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>
        </Flex>

        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.Column>Batch ID</Table.Column>
              <Table.Column>Product Name</Table.Column>
              <Table.Column>Reason</Table.Column>
              <Table.Column>Type</Table.Column>
              <Table.Column>Weight (kg)</Table.Column>
              <Table.Column>Date</Table.Column>
              <Table.Column>Status</Table.Column>
              <Table.Column>Handling</Table.Column>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {scrapList.map((entry, index) => (
              <Table.Row key={index}>
                <Table.Cell>{entry.batchId}</Table.Cell>
                <Table.Cell>{entry.productName}</Table.Cell>
                <Table.Cell>{entry.reason}</Table.Cell>
                <Table.Cell>{entry.type}</Table.Cell>
                <Table.Cell>{entry.weight}</Table.Cell>
                <Table.Cell>{entry.date}</Table.Cell>
                <Table.Cell>{entry.status}</Table.Cell>
                <Table.Cell>{entry.handling}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
        <Flex justify="end" mt="4">
          <Button variant="solid" color="green">
            Submit to Blockchain
          </Button>
        </Flex>
      </Card>
    </Flex>
  );
}
