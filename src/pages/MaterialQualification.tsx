// Updated component
import { useTranslation } from 'react-i18next';
import { 
  Table, 
  Badge, 
  Card, 
  Flex, 
  Heading, 
  Text,
  Button,
  Progress,
  Box,
  Dialog,
  Select,
  TextField
} from '@radix-ui/themes';
import { CubeIcon } from '@radix-ui/react-icons';

const MaterialQualification = () => {
  const { t } = useTranslation('material-qualification');
  const materials = [
    { 
      id: 'RM4587',
      material: 'Albendazole API',
      supplier: 'PharmaChem Ltd.',
      status: 'Approved',
      tests: '4/5 Passed',
      certificate: 'CoA Available',
      expiry: '2025-06-01'
    },
  ];

  return (
    <Box p="6" className="flex-1">
      <Flex justify="between" align="center" mb="5">
        <Heading size="6">{t('dashboard-heading')}</Heading>
        <Flex gap="3">
            {/* New Qualification Modal */}
            <Dialog.Root>
            <Dialog.Trigger>
              <Button variant="soft">{t('new-qualification-button')}</Button>
            </Dialog.Trigger>
            <Dialog.Content>
              <Dialog.Title>{t('new-qualification.title')}</Dialog.Title>
              <Flex direction="column" gap="3">
                <TextField.Root placeholder={t('new-qualification.material')} />
                <TextField.Root placeholder={t('new-qualification.supplier')} />
                <Select.Root>
                  <Select.Trigger placeholder={t('new-qualification.type')} />
                  <Select.Content>
                    <Select.Item value="api">{t('new-qualification.types.api')}</Select.Item>
                    <Select.Item value="excipient">{t('new-qualification.types.excipient')}</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Flex>
              <Flex gap="3" mt="4" justify="end">
                <Dialog.Close>
                  <Button variant="soft">{t('cancel')}</Button>
                </Dialog.Close>
                <Button>{t('submit')}</Button>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>
          <Dialog.Root>
            <Dialog.Trigger>
              <Button variant="soft">{t('supplier-audit-button')}</Button>
            </Dialog.Trigger>
            <Dialog.Content>
              <Dialog.Title>{t('supplier-audit.title')}</Dialog.Title>
              <Flex direction="column" gap="3">
                <Select.Root>
                  <Select.Trigger placeholder={t('supplier-audit.select-supplier')} />
                  <Select.Content>
                    <Select.Item value="pharmachem">PharmaChem Ltd.</Select.Item>
                    <Select.Item value="other">Other Suppliers</Select.Item>
                  </Select.Content>
                </Select.Root>
                <TextField.Root  placeholder={t('supplier-audit.audit-date')} type="date" />
              </Flex>
              <Flex gap="3" mt="4" justify="end">
                <Dialog.Close>
                  <Button variant="soft">{t('cancel')}</Button>
                </Dialog.Close>
                <Button>{t('schedule-audit')}</Button>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>
        </Flex>
      </Flex>

      <Flex gap="4" mb="5">
        <Card style={{ flex: 1 }}>
          <Flex direction="column" gap="2">
            <Text size="2">{t('qualification-progress')}</Text>
            <Progress value={75} />
            <Flex justify="between">
              <Text size="1">{t('pending-label')}</Text>
              <Text size="1">{t('approved-label')}</Text>
            </Flex>
          </Flex>
        </Card>

        <Card style={{ flex: 1 }}>
          <Flex direction="column" gap="2">
            <Text size="2">{t('compliance-score')}</Text>
            <Heading size="7">98.4%</Heading>
            <Text size="1">{t('alcoa-compliant')}</Text>
          </Flex>
        </Card>

        <Card style={{ flex: 1 }}>
          <Flex direction="column" gap="2">
            <Text size="2">{t('expiring-soon')}</Text>
            <Heading size="7" className="text-amber-500">2</Heading>
            <Text size="1">{t('materials')}</Text>
          </Flex>
        </Card>
      </Flex>

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>{t('material-header')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('supplier-header')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('status-header')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('test-results-header')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('certificate-header')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('expiry-header')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('actions-header')}</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {materials.map((material) => (
            <Table.Row key={material.id}>
              <Table.Cell>
                <Flex align="center" gap="2">
                  <CubeIcon />
                  {material.material}
                </Flex>
              </Table.Cell>
              <Table.Cell>{material.supplier}</Table.Cell>
              <Table.Cell>
                <Badge 
                  color={material.status === 'Approved' ? 'green' : 'red'}
                  variant="soft"
                >
                  {t(`status.${material.status.toLowerCase()}`)}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <Progress value={80} />
                <Text size="1">{material.tests}</Text>
              </Table.Cell>
              <Table.Cell>
                <Badge variant="outline">
                  {t(`certificate.${material.certificate.toLowerCase().replace(/ /g, '-')}`)}
                </Badge>
              </Table.Cell>
              <Table.Cell>{material.expiry}</Table.Cell>
              <Table.Cell>
                <Flex gap="2">
                  <Button variant="soft" size="1">{t('view-coa-button')}</Button>
                  <Button variant="soft" size="1">{t('retest-button')}</Button>
                </Flex>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <Flex mt="5" direction="column" gap="3">
        <Heading size="5">{t('test-parameters-heading')}</Heading>
        <Flex gap="2">
          {['Identity', 'Purity', 'Microbial', 'Endotoxins'].map((test) => (
            <Badge key={test} variant="outline">
              {t(`test-parameters.${test.toLowerCase()}`)}
            </Badge>
          ))}
        </Flex>
      </Flex>
    </Box>
  );
};

export default MaterialQualification;

/*

  Status
    - Approved
    - Rejected
    - Pending

*/