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
  Table,
  Select,
  TextField,
  Checkbox,
  Switch
} from '@radix-ui/themes';
import {
  GlobeIcon,
  MixerHorizontalIcon
} from '@radix-ui/react-icons';
import { useTranslation } from 'react-i18next';

const PreferencesPage = () => {
const { t } = useTranslation('preferences-page');

return (
  <Box p="6">
    <Flex direction="column" gap="4">
      <Heading size="6" className="flex items-center gap-2">
        <MixerHorizontalIcon /> {t('blockchain-preferences')}
      </Heading>

      <Card>
        <Heading size="4" mb="4">{t('network-configuration')}</Heading>
        <Grid columns="2" gap="4">
          <Select.Root defaultValue="mainnet">
            <Select.Trigger />
            <Select.Content>
              <Select.Item value="mainnet">
                <GlobeIcon /> {t('ethereum-mainnet')}
              </Select.Item>
              <Select.Item value="testnet">
                {/* <TestTubeIcon /> {t('goerli-testnet')} */}
              </Select.Item>
            </Select.Content>
          </Select.Root>

          <TextField.Root>
            <input placeholder={t('custom-rpc-endpoint')} />
          </TextField.Root>
        </Grid>
      </Card>

      <Card>
        <Heading size="4" mb="4">{t('transaction-preferences')}</Heading>
        <Flex direction="column" gap="3">
          <label className="flex items-center gap-2">
            <Checkbox />
            <Text size="2">{t('auto-sign-transactions')}</Text>
          </label>
          <label className="flex items-center gap-2">
            <Checkbox />
            <Text size="2">{t('gas-price-suggestions')}</Text>
          </label>
        </Flex>
      </Card>

      <Card>
        <Heading size="4" mb="4">{t('smart-contract-notifications')}</Heading>
        <Grid columns="3" gap="4">
          <label className="flex items-center gap-2">
            <Switch />
            <Text size="2">{t('inventory-updates')}</Text>
          </label>
          <label className="flex items-center gap-2">
            <Switch />
            <Text size="2">{t('quality-events')}</Text>
          </label>
          <label className="flex items-center gap-2">
            <Switch />
            <Text size="2">{t('batch-finalization')}</Text>
          </label>
        </Grid>
      </Card>

      <Flex gap="3" justify="end">
        <Button variant="soft">{t('reset-defaults')}</Button>
        <Button>{t('save-preferences')}</Button>
      </Flex>
    </Flex>
  </Box>
);
};

export default PreferencesPage;