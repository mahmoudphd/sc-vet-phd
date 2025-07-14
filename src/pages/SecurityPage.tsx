import {
  Flex,
  Text,
  Badge,
  IconButton,
  Box,
  DropdownMenu,
  Heading,
  Grid,
  Button,
  Card,
  Table
} from '@radix-ui/themes';
import {
  GlobeIcon,
  PersonIcon,
  BellIcon,
  LockClosedIcon,
  DashboardIcon,
  ExitIcon
} from '@radix-ui/react-icons';
import { useTranslation } from 'react-i18next';

const SecurityPage = () => {
const { t } = useTranslation('security-page');

return (
  <Card>
    <Flex direction="column" gap="4">
      <Heading size="6" className="flex items-center gap-2">
        <LockClosedIcon /> {t('blockchain-security')}
      </Heading>

      <Grid columns="2" gap="4">
        <Card>
          <Flex direction="column" gap="3">
            <Text size="2" className="text-gray-500">{t('private-key-management')}</Text>
            <Flex align="center" gap="2">
              <Text>*********</Text>
              <Badge color="amber" variant="soft">
                {t('backup-required')}
              </Badge>
            </Flex>
            <Button variant="soft" size="1" className="mt-2">
              {t('export-encrypted-key')}
            </Button>
          </Flex>
        </Card>

        <Card>
          <Flex direction="column" gap="3">
            <Text size="2" className="text-gray-500">{t('2fa-status')}</Text>
            <Flex align="center" gap="2">
              <Text>{t('authenticator-app')}</Text>
              <Badge color="green" variant="soft">
                {t('active')}
              </Badge>
            </Flex>
          </Flex>
        </Card>
      </Grid>

      <Card>
        <Heading size="4" mb="4">{t('active-sessions')}</Heading>
        <Table.Root variant="surface">
          <Table.Body>
            {['New York', 'London', 'Dubai'].map((location) => (
              <Table.Row key={location}>
                <Table.Cell>{location}</Table.Cell>
                <Table.Cell>Chrome • Windows</Table.Cell>
                <Table.Cell>2 hours ago</Table.Cell>
                <Table.Cell>
                  <Badge color="green" variant="soft">{t('active')}</Badge>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Card>

      <Card>
        <Heading size="4" mb="4">{t('smart-contract-permissions')}</Heading>
        <Flex direction="column" gap="2">
          {['InventoryManager', 'BatchTracker', 'QualityAudit'].map((contract) => (
            <Flex key={contract} justify="between" align="center">
              <Text className="font-mono">{contract}.sol</Text>
              <Badge variant="soft">{t('read-write')}</Badge>
            </Flex>
          ))}
        </Flex>
      </Card>
    </Flex>
  </Card>
);
};

export default SecurityPage;