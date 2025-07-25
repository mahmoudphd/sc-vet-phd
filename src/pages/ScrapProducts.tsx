import {
  Card,
  Heading,
  Table,
  Text,
  Flex,
  Button,
  TextField,
  Select,
} from '@radix-ui/themes';
import { useState } from 'react';

interface ScrapProduct {
  id: string;
  batchId: string;
  productName: string;
  reason: string;
  type: string;
  weight: number;
  date: string;
  status: string;
  handlingMethod: string;
}

export default function ScrapProducts() {
  const [scrapData, setScrapData] = useState<ScrapProduct[]>([
    {
      id: 'SCP001',
      batchId: 'VC23001',
      productName: 'Poultry Product A',
      reason: 'Contamination',
      type: 'Partial',
      weight: 5.2,
      date: '2025-07-20',
      status: 'Pending',
      handlingMethod: 'Recycled',
    },
    {
      id: 'SCP002',
      batchId: 'VC23002',
      productName: 'Poultry Product B',
      reason: 'Expiration',
      type: 'Full',
      weight: 8.1,
      date: '2025-07-22',
      status: 'Approved',
      handlingMethod: 'Disposed',
    },
  ]);

  const reasonOptions = [
    'Expiration',
    'Contamination',
    'Packaging Damage',
    'Labeling Error',
    'Other',
  ];

  const handlingOptions = ['Recycled', 'Disposed', 'Incinerated'];

  const handleChange = (
    index: number,
    field: keyof ScrapProduct,
    value: string
  ) => {
    const updated = [...scrapData];
    // @ts-ignore
    updated[index][field] = field === 'weight' ? parseFloat(value) : value;
    setScrapData(updated);
  };

  const handleSubmit = () => {
    console.log('Submitting to blockchain:', scrapData);
    alert('Data submitted to blockchain!');
  };

  return (
    <Card className="p-4 mt-4">
      <Heading mb="4">Scrap Products Handling</Heading>
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Scrap ID</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Batch ID</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Product Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Reason</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Type</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Weight (kg)</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Handling Method</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {scrapData.map((item, index) => (
            <Table.Row key={item.id}>
              <Table.Cell>{item.id}</Table.Cell>
              <Table.Cell>{item.batchId}</Table.Cell>
              <Table.Cell>{item.productName}</Table.Cell>
              <Table.Cell>
                <Select.Root
                  value={item.reason}
                  onValueChange={(value) =>
                    handleChange(index, 'reason', value)
                  }
                >
                  <Select.Trigger />
                  <Select.Content>
                    {reasonOptions.map((r) => (
                      <Select.Item key={r} value={r}>
                        {r}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </Table.Cell>
              <Table.Cell>
                <TextField.Root
                  value={item.type}
                  onChange={(e) =>
                    handleChange(index, 'type', e.target.value)
                  }
                />
              </Table.Cell>
              <Table.Cell>
                <TextField.Root
                  type="number"
                  value={item.weight.toString()}
                  onChange={(e) =>
                    handleChange(index, 'weight', e.target.value)
                  }
                />
              </Table.Cell>
              <Table.Cell>
                <TextField.Root
                  type="date"
                  value={item.date}
                  onChange={(e) => handleChange(index, 'date', e.target.value)}
                />
              </Table.Cell>
              <Table.Cell>{item.status}</Table.Cell>
              <Table.Cell>
                <Select.Root
                  value={item.handlingMethod}
                  onValueChange={(value) =>
                    handleChange(index, 'handlingMethod', value)
                  }
                >
                  <Select.Trigger />
                  <Select.Content>
                    {handlingOptions.map((method) => (
                      <Select.Item key={method} value={method}>
                        {method}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <Flex justify="end" mt="4">
        <Button onClick={handleSubmit}>Submit to Blockchain</Button>
      </Flex>
    </Card>
  );
}
