// src/pages/VeterinaryMaterials.tsx
import {
  Card,
  Flex,
  Heading,
  Table,
  Badge,
  Button,
  Dialog,
  Text,
  Box,
  TextField,
} from '@radix-ui/themes';
import { useState } from 'react';

const testData = [
  {
    name: 'Vitamin B1',
    supplier: 'Supplier A',
    status: 'Qualified',
    certificate: 'Cert123',
    expiry: '2025-12-31',
    tests: {
      Identity: 'Pass',
      Purity: 'Pass',
      Microbial: 'Pending',
      Endotoxins: 'Pass',
    },
  },
  {
    name: 'Vitamin B2',
    supplier: 'Supplier B',
    status: 'Pending',
    certificate: 'Cert456',
    expiry: '2026-03-15',
    tests: {
      Identity: 'Pass',
      Purity: 'Fail',
      Microbial: 'Pass',
      Endotoxins: 'Pending',
    },
  },
  {
    name: 'Nicotinamide',
    supplier: 'Supplier A',
    status: 'Qualified',
    certificate: 'Cert789',
    expiry: '2025-08-01',
    tests: {
      Identity: 'Pending',
      Purity: 'Pass',
      Microbial: 'Pass',
      Endotoxins: 'Pass',
    },
  },
];

const VeterinaryMaterials = () => {
  const [selectedMaterial, setSelectedMaterial] = useState<any | null>(null);

  return (
    <Box p="4">
      <Flex justify="between" align="center" mb="4">
        <Heading size="6">Veterinary Raw Materials</Heading>
        <Flex gap="3">
          <Button variant="outline">New Qualification</Button>
          <Button variant="outline">Supplier Audit</Button>
        </Flex>
      </Flex>

      <Card>
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
            {testData.map((item, index) => (
              <Table.Row key={index}>
                <Table.Cell>
                  <Button variant="ghost" onClick={() => setSelectedMaterial(item)}>
                    {item.name}
                  </Button>
                </Table.Cell>
                <Table.Cell>{item.supplier}</Table.Cell>
                <Table.Cell>
                  <Badge color={item.status === 'Qualified' ? 'green' : 'orange'}>
                    {item.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  {Object.entries(item.tests).map(([test, result]) => (
                    <Text key={test} size="1" mr="2">
                      {test}: {result}
                    </Text>
                  ))}
                </Table.Cell>
                <Table.Cell>{item.certificate}</Table.Cell>
                <Table.Cell>{item.expiry}</Table.Cell>
                <Table.Cell>
                  <Button size="1" variant="soft">
                    Edit
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Card>

      {/* Dialog */}
      {selectedMaterial && (
        <Dialog.Root open onOpenChange={() => setSelectedMaterial(null)}>
          <Dialog.Content maxWidth="500px">
            <Dialog.Title>{selectedMaterial.name}</Dialog.Title>
            <Dialog.Description mb="2">
              Supplier: {selectedMaterial.supplier}
            </Dialog.Description>

            {Object.entries(selectedMaterial.tests).map(([test, result]) => (
              <Box key={test} mb="3">
                <Flex justify="between" align="center">
                  <Text as="label" size="2" weight="bold">
                    {test} {test === 'Identity' && <Text color="blue">(via IoT)</Text>}
                  </Text>
                  <TextField
                    defaultValue={result}
                    placeholder="Enter result"
                    size="1"
                    style={{ width: 100 }}
                  />
                </Flex>
              </Box>
            ))}

            <Flex justify="end" gap="3" mt="4">
              <Dialog.Close>
                <Button variant="soft">Close</Button>
              </Dialog.Close>
              <Button variant="solid">Save</Button>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      )}

      <Flex justify="center" mt="6">
        <Button variant="solid" color="blue">
          Submit to Blockchain
        </Button>
      </Flex>
    </Box>
  );
};

export default VeterinaryMaterials;
