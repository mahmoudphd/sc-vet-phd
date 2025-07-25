import {
  Table,
  Button,
  Dialog,
  Flex,
  Text,
  Heading,
  Box,
  Badge,
  Card,
} from '@radix-ui/themes';
import { useState } from 'react';

const materialsData = [
  {
    material: 'Vitamin B1',
    supplier: 'Supplier A',
    status: 'Approved',
    expiry: '2025-08-10',
    tests: {
      Identity: 'Passed',
      Purity: 'Passed',
      Microbial: 'Passed',
      Endotoxins: 'Passed',
    },
    certificate: 'Cert-001',
  },
  {
    material: 'Vitamin B2',
    supplier: 'Supplier B',
    status: 'Pending',
    expiry: '2025-12-15',
    tests: {
      Identity: 'Pending',
      Purity: 'Pending',
      Microbial: 'Pending',
      Endotoxins: 'Pending',
    },
    certificate: 'Cert-002',
  },
  {
    material: 'Nicotinamide',
    supplier: 'Supplier A',
    status: 'Approved',
    expiry: '2026-01-20',
    tests: {
      Identity: 'Passed',
      Purity: 'Passed',
      Microbial: 'Passed',
      Endotoxins: 'Passed',
    },
    certificate: 'Cert-003',
  },
];

export default function MaterialTable() {
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);

  return (
    <Box p="4">
      <Heading size="6" mb="4">Raw Materials Compliance Table</Heading>

      {/* Cards Row */}
      <Flex gap="4" mb="5">
        <Card variant="surface" style={{ flex: 1, padding: '16px' }}>
          <Flex direction="column" gap="4">
            <Text weight="bold" size="3">Qualification Progress</Text>
            <Text>Pending: 3</Text>
            <Text>Approved: 12</Text>
          </Flex>
        </Card>

        <Card variant="surface" style={{ flex: 1, padding: '16px' }}>
          <Flex direction="column" gap="4">
            <Text weight="bold" size="3">Compliance Score</Text>
            <Text size="6" color="green" weight="bold">98.4%</Text>
            <Text>ALCOA+ Compliant</Text>
          </Flex>
        </Card>

        <Card variant="surface" style={{ flex: 1, padding: '16px' }}>
          <Flex direction="column" gap="4">
            <Text weight="bold" size="3">Expiring Soon</Text>
            <Text size="6" color="red" weight="bold">2</Text>
            <Text>Materials</Text>
          </Flex>
        </Card>
      </Flex>

      {/* Table */}
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Material</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Supplier</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Test Results</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Certificate</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Expiry</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {materialsData.map((item, index) => (
            <Table.Row key={index}>
              <Table.Cell>
                <Dialog.Root>
                  <Dialog.Trigger>
                    <Button variant="ghost" onClick={() => setSelectedMaterial(item)}>
                      {item.material}
                    </Button>
                  </Dialog.Trigger>
                  <Dialog.Content maxWidth="500px">
                    <Dialog.Title>Test Results for {item.material}</Dialog.Title>
                    <Dialog.Description mb="4">
                      Detailed compliance results for each quality test.
                    </Dialog.Description>
                    <Flex direction="column" gap="3">
                      {Object.entries(item.tests).map(([testName, result]) => (
                        <Flex key={testName} justify="between">
                          <Text>
                            {testName}
                            {testName === 'Identity' && <Text color="gray"> (via IoT)</Text>}
                          </Text>
                          <Badge color={result === 'Passed' ? 'green' : result === 'Pending' ? 'yellow' : 'red'}>
                            {result}
                          </Badge>
                        </Flex>
                      ))}
                    </Flex>
                    <Flex justify="end" mt="4">
                      <Dialog.Close>
                        <Button>Close</Button>
                      </Dialog.Close>
                    </Flex>
                  </Dialog.Content>
                </Dialog.Root>
              </Table.Cell>
              <Table.Cell>{item.supplier}</Table.Cell>
              <Table.Cell>
                <Badge color={item.status === 'Approved' ? 'green' : 'yellow'}>{item.status}</Badge>
              </Table.Cell>
              <Table.Cell>
                {Object.values(item.tests).every(v => v === 'Passed') ? (
                  <Badge color="green">All Passed</Badge>
                ) : (
                  <Badge color="yellow">Pending</Badge>
                )}
              </Table.Cell>
              <Table.Cell>{item.certificate}</Table.Cell>
              <Table.Cell>{item.expiry}</Table.Cell>
              <Table.Cell>
                <Button size="1" variant="soft">Edit</Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <Flex justify="end" mt="4">
        <Button variant="solid" color="blue">
          Submit to Blockchain
        </Button>
      </Flex>
    </Box>
  );
}
