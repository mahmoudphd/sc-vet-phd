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
import { useTranslation } from 'react-i18next';
import HeatMapGrid from 'react-heatmap-grid';

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

const xLabels: string[] = new Array(7).fill(0).map((_, i) => `Day ${i + 1}`);
const yLabels: string[] = ['Store A', 'Store B', 'Store C', 'Store D', 'Store E'];

const heatmapData: number[][] = [
  [12, 5, 7, 10, 8, 9, 4],
  [6, 7, 3, 8, 10, 6, 7],
  [10, 15, 12, 13, 14, 10, 8],
  [5, 6, 7, 8, 9, 4, 6],
  [7, 8, 6, 5, 4, 3, 2],
];

const PharmacyPartners = () => {
  const { t, i18n } = useTranslation('pharmacy-partners');
  const [isStockMonitorOpen, setIsStockMonitorOpen] = useState(false);
  const [isRecallPortalOpen, setIsRecallPortalOpen] = useState(false);

  const getLocationName = (): string => {
    return i18n.language.startsWith('ar') ? 'مصر' : 'Egypt';
  };

  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([
    {
      id: 'PHARM-045',
      name: 'CarePlus Pharmacy',
      location: getLocationName(),
      license: 'Active',
      lastDelivery: '2025-07-18',
      stock: 'optimal',
      recallCompliance: 100,
    },
    {
      id: 'PHARM-046',
      name: 'HealthyLife Retailer',
      location: getLocationName(),
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
            {t('stock-monitor')}
          </Button>
          <Button variant="soft" onClick={() => setIsRecallPortalOpen(true)}>
            {t('recall-portal')}
          </Button>
        </Flex>
      </Flex>

      {/* Stock Monitor Modal */}
      <Dialog.Root open={isStockMonitorOpen} onOpenChange={setIsStockMonitorOpen}>
        <Dialog.Content style={{ maxWidth: 500 }}>
          <Dialog.Title>{t('stock-monitor.title')}</Dialog.Title>
          <Flex direction="column" gap="3">
            <Text size="2">{t('stock-monitor.description')}</Text>
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
                {t('close')}
              </Button>
            </Flex>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      {/* Recall Portal Modal */}
      <Dialog.Root open={isRecallPortalOpen} onOpenChange={setIsRecallPortalOpen}>
        <Dialog.Content style={{ maxWidth: 500 }}>
          <Dialog.Title>{t('recall-portal.title')}</Dialog.Title>
          <Flex direction="column" gap="3">
            <Text size="2">{t('recall-portal.description')}</Text>
            <Flex direction="column" gap="2">
              <Button variant="soft">{t('recall-portal.initiate')}</Button>
              <Button variant="soft">{t('recall-portal.history')}</Button>
            </Flex>
            <Flex gap="3" justify="end">
              <Button variant="soft" onClick={() => setIsRecallPortalOpen(false)}>
                {t('close')}
              </Button>
            </Flex>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      <Grid columns="4" gap="4" mb="5">
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">{t('network-size')}</Text>
            <Heading size="7">1,245</Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">{t('avg-stock-turn')}</Text>
            <Heading size="7">2.8 {t('days')}</Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">{t('recall-compliance')}</Text>
            <Heading size="7">99.1%</Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">{t('customer-ratings')}</Text>
            <Heading size="7">4.8/5</Heading>
          </Flex>
        </Card>
      </Grid>

      <Flex gap="4" mb="5">
        <Card style={{ flex: 1 }}>
