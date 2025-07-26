import { useState } from 'react';
import {
  Card,
  Flex,
  Heading,
  Table,
  Badge,
  Button,
  Grid,
  Text,
  Box,
  Dialog,
} from '@radix-ui/themes';
import * as Select from '@radix-ui/react-select';

const stockOptions = ['optimal', 'low', 'critical'] as const;
type StockOption = typeof stockOptions[number];

interface Pharmacy {
  id: string;
  name: string;
  location: string;
  license: 'Active' | 'Inactive';
  lastDelivery: string;
  stock: StockOption;
  recallCompliance: number;
}

const PharmacyPartners = () => {
  const [isStockMonitorOpen, setIsStockMonitorOpen] = useState(false);
  const [isRecallPortalOpen, setIsRecallPortalOpen] = useState(false);

  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([
    {
      id: 'PHARM-045',
      name: 'CarePlus Pharmacy',
      location: 'Egypt',
      license: 'Active',
      lastDelivery: '2025-07-18',
      stock: 'optimal',
      recallCompliance: 100,
    },
    {
      id: 'PHARM-046',
      name: 'HealthyLife Retailer',
      location: 'Egypt',
      license: 'Inactive',
      lastDelivery: '2025-06-30',
      stock: 'low',
      recallCompliance: 87,
    },
  ]);

  const handleStockChange = (id: string, newStock: StockOption) => {
    setPharmacies((prev) =>
      prev.map((pharmacy) =>
        pharmacy.id === id ? { ...pharmacy, stock: newStock } : pharmacy
      )
    );
  };

  return (
    <Box p="6">
      <Flex justify="between" align="center" mb="5">
        <Heading size="6">Retail Network Management</Heading>
        <Flex gap="3">
          <Button variant="soft" onClick={() => setIsStockMonitorOpen(true)}>
            Stock Monitor
          </Button>
          <Button variant="soft" onClick={() => setIsRecallPortalOpen(true)}>
            Recall Portal
          </Button>
        </Flex>
      </Flex>

      {/* Stock Monitor Modal */}
      <Dialog.Root open={isStockMonitorOpen} onOpenChange={setIsStockMonitorOpen}>
        <Dialog.Content style={{ maxWidth: 500 }}>
          <Dialog.Title>Stock Monitor</Dialog.Title>
          <Flex direction="column" gap="3">
            <Text size="2">Current stock insights across the network.</Text>
            <Table.Root>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>Low Stock Items</Table.Cell>
                  <Table.Cell>
                    <Badge color="red">12</Badge>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Expiring Soon</Table.Cell>
                  <Table.Cell>
                    <Badge color="amber">5</Badge>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table.Root>
            <Flex gap="3" justify="end">
              <Button variant="soft" onClick={() => setIsStockMonitorOpen(false)}>
                Close
              </Button>
            </Flex>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      {/* Recall Portal Modal */}
      <Dialog.Root open={isRecallPortalOpen} onOpenChange={setIsRecallPortalOpen}>
        <Dialog.Content style={{ maxWidth: 500 }}>
          <Dialog.Title>Recall Portal</Dialog.Title>
          <Flex direction="column" gap="3">
            <Text size="2">Manage and track recall activities.</Text>
            <Flex direction="column" gap="2">
              <Button variant="soft">Initiate Recall</Button>
              <Button variant="soft">View Recall History</Button>
            </Flex>
            <Flex gap="3" justify="end">
              <Button variant="soft" onClick={() => setIsRecallPortalOpen(false)}>
                Close
              </Button>
            </Flex>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      <Grid columns="4" gap="4" mb="5">
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">Network Size</Text>
            <Heading size="7">1,245</Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">Avg. Stock Turn</Text>
            <Heading size="7">2.8 Days</Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">Recall Compliance</Text>
            <Heading size="7">99.1%</Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">Customer Ratings</Text>
            <Heading size="7">4.8/5</Heading>
          </Flex>
        </Card>
      </Grid>

      <Flex gap="4" mb="5">
        <Card style={{ flex: 1 }}>
          <Heading size="4" mb="3">Sales Heatmap</Heading>
          <Text size="2" color="gray">Coming soon...</Text>
        </Card>
      </Flex>

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Retailer</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Location</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>License</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Last Delivery</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Stock Level</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Recall Compliance</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {pharmacies.map((pharmacy) => (
            <Table.Row key={pharmacy.id}>
              <Table.Cell>{pharmacy.name}</Table.Cell>
              <Table.Cell>{pharmacy.location}</Table.Cell>
              <Table.Cell>
                <Badge color={pharmacy.license === 'Active' ? 'green' : 'red'}>
                  {pharmacy.license}
                </Badge>
              </Table.Cell>
              <Table.Cell>{pharmacy.lastDelivery}</Table.Cell>
              <Table.Cell>
                <Select.Root
                  value={pharmacy.stock}
                  onValueChange={(val: StockOption) => handleStockChange(pharmacy.id, val)}
                >
                  <Select.Trigger
                    aria-label="Stock Level"
                    style={{
                      all: 'unset',
                      cursor: 'pointer',
                      padding: '6px 12px',
                      borderRadius: 4,
                      border: '1px solid #ccc',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                    }}
                  >
                    <Select.Value />
                    <Select.Icon />
                  </Select.Trigger>

                  <Select.Content
                    style={{
                      background: 'white',
                      borderRadius: 6,
                      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                      padding: 5,
                    }}
                  >
                    <Select.ScrollUpButton />
                    <Select.Viewport>
                      {stockOptions.map((option) => (
                        <Select.Item
                          key={option}
                          value={option}
                          style={{
                            padding: '8px 12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                          }}
                        >
                          <Select.ItemText>{option}</Select.ItemText>
                        </Select.Item>
                      ))}
                    </Select.Viewport>
                    <Select.ScrollDownButton />
                  </Select.Content>
                </Select.Root>
              </Table.Cell>
              <Table.Cell>{pharmacy.recallCompliance}%</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

export default PharmacyPartners;
