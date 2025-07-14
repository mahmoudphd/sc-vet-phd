import { 
  Card, 
  Flex, 
  Heading, 
  Text, 
  Table, 
  Badge, 
  Button,
  Grid,
  Progress,
  Select,
  Box
} from '@radix-ui/themes';
import { 
  PieChartIcon,
  BarChartIcon,
  MixerHorizontalIcon,
  GlobeIcon,
} from '@radix-ui/react-icons';
import { BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useTranslation } from 'react-i18next';

const SalesTrends = () => {
  const { t } = useTranslation('sales-trends');
  const salesData = [
    { month: 'Jan', current: 45, previous: 38 },
    { month: 'Feb', current: 52, previous: 45 },
    { month: 'Mar', current: 48, previous: 42 },
  ];

  return (
    <Box p="6">
      <Flex justify="between" align="center" mb="5">
        <Heading size="6">{t('pharmaceutical-sales-analytics')}</Heading>
        <Flex gap="3">
          <Button variant="soft">
            <BarChartIcon /> {t('compare-regions')}
          </Button>
          <Select.Root defaultValue={t('time-period-quarter')}>
            <Select.Trigger />
          </Select.Root>
        </Flex>
      </Flex>

      <Grid columns="3" gap="4" mb="5">
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">{t('ytd-sales')}</Text>
            <Heading size="7">$12.4M</Heading>
            <Text size="1" className="text-green-500">{t('yoy-increase')}</Text>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">{t('top-product')}</Text>
            <Heading size="7">{t('product-antiparasitic')}</Heading>
            <Text size="1">{t('percent-of-total', { percent: 22 })}</Text>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">{t('new-rx-rate')}</Text>
            <Heading size="7">68%</Heading>
            <Progress value={68} />
          </Flex>
        </Card>
      </Grid>

      <Flex gap="4" mb="5">
        <Card style={{ flex: 2 }}>
          <Heading size="4" mb="3">{t('sales-performance')}</Heading>
          <div className="h-64">
            <BarChart width={600} height={250} data={salesData}>
              <Bar dataKey="current" fill="#3b82f6" name={t('current-year')} />
              <Bar dataKey="previous" fill="#94a3b8" name={t('previous-year')} />
            </BarChart>
          </div>
        </Card>
        <Card style={{ flex: 1 }}>
          <Heading size="4" mb="3">{t('geographic-distribution')}</Heading>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <GlobeIcon className="w-16 h-16 text-gray-400" />
          </div>
        </Card>
      </Flex>

      <Flex gap="4">
        <Card style={{ flex: 1 }}>
          <Heading size="4" mb="3">{t('top-products')}</Heading>
          <Table.Root variant="surface">
            <Table.Body>
              {[t('product-antiparasitic'), t('product-antibiotic'), t('product-vaccine-adjuvant')].map((product) => (
                <Table.Row key={product}>
                  <Table.Cell>{product}</Table.Cell>
                  <Table.Cell>
                    <Badge variant="outline">$2.8M</Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Progress value={68} />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Card>
        <Card style={{ flex: 1 }}>
          <Heading size="4" mb="3">{t('channel-performance')}</Heading>
          <div className="h-64">
            <PieChart width={300} height={250}>
              <Pie
                data={[
                  { name: t('channel-hospital'), value: 45 },
                  { name: t('channel-retail'), value: 35 },
                  { name: t('channel-online'), value: 20 }
                ]}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              />
            </PieChart>
          </div>
        </Card>
      </Flex>
    </Box>
  );
};

export default SalesTrends;