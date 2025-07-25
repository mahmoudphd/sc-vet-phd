import {
  Card,
  Flex,
  Heading,
  Table,
  Text,
  Button,
  Select,
  TextField,
} from '@radix-ui/themes';
import { useState } from 'react';

const initialData = [
  {
    scrapId: 'SCP001',
    batchId: 'VC23001 (Anthelmintic Oral Suspension)',
    reason: 'Contamination',
    type: 'Partial',
    weight: '5.2',
    status: 'Pending',
    method: 'Recycled',
    date: '2025-07-24',
  },
  {
    scrapId: 'SCP002',
    batchId: 'VC23002 (Anthelmintic Oral Suspension)',
    reason: 'Expiration',
    type: 'Full',
    weight: '8.1',
    status: 'Approved',
    method: 'Disposed',
    date: '2025-07-23',
  },
];

const reasonOptions = ['Expiration', 'Contamination', 'Damaged Packaging', 'Improper Storage'];
const methodOptions = ['Recycled', 'Disposed', 'Incinerated'];
const statusOptions = ['Pending', 'Approved', 'Rejected'];

export default function ScrapManagement() {
  const [data, setData] = useState(initialData);

  const handleFieldChange = (index: number, field: string, value: string) => {
    const updated = [...data];
    updated[index][field] = value;
    setData(updated);
  };

  const handleSubmitToBlockchain = () => {
    // Placeholder for blockchain logic
    console.log('Submitting to blockchain:', data);
    alert('Submitted to blockchain (mock)');
  };

  return (
    <Card>
      <Flex direction="column" gap="4">
        <Heading size="6">Scrap Handling Records</Heading>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Scrap ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Batch ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Reason</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Type</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Weight (kg)</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Handling Method</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.map((row, index) => (
              <Table.Row key={index}>
                <Table.RowHeaderCell>{row.scrapId}</Table.RowHeaderCell>
                <Table.Cell>{row.batchId}</Table.Cell>
                <Table.Cell>
                  <Select.Root
                    value={row.reason}
                    onValueChange={(val) => handleFieldChange(index, 'reason', val)}
                  >
                    <Select.Trigger />
                    <Select.Content>
                      {reasonOptions.map((opt) => (
                        <Select.Item key={opt} value={opt}>
                          {opt}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </Table.Cell>
                <Table.Cell>{row.type}</Table.Cell>
                <Table.Cell>
                  <TextField.Input
                    type="number"
                    value={row.weight}
                    onChange={(e) =>
                      handleFieldChange(index, 'weight', e.target.value)
                    }
                  />
                </Table.Cell>
                <Table.Cell>
                  <Select.Root
                    value={row.status}
                    onValueChange={(val) => handleFieldChange(index, 'status', val)}
                  >
                    <Select.Trigger />
                    <Select.Content>
                      {statusOptions.map((opt) => (
                        <Select.Item key={opt} value={opt}>
                          {opt}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </Table.Cell>
                <Table.Cell>
                  <Select.Root
                    value={row.method}
                    onValueChange={(val) => handleFieldChange(index, 'method', val)}
                  >
                    <Select.Trigger />
                    <Select.Content>
                      {methodOptions.map((opt) => (
                        <Select.Item key={opt} value={opt}>
                          {opt}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </Table.Cell>
                <Table.Cell>
                  <TextField.Input
                    type="date"
                    value={row.date}
                    onChange={(e) =>
                      handleFieldChange(index, 'date', e.target.value)
                    }
                  />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        <Flex justify="end" mt="4">
          <Button onClick={handleSubmitToBlockchain} color="green" size="3">
            Submit to Blockchain
          </Button>
        </Flex>
      </Flex>
    </Card>
  );
}
