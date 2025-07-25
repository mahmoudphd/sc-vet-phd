// Modified CO2Footprint component
import { useTranslation } from 'react-i18next';
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
import { PieChart, Pie, Cell } from 'recharts';

const CO2Footprint = () => {
    const { t } = useTranslation('co2-footprint-page');
    const emissionData = [
      { category: 'manufacturing', value: 45, color: '#3b82f6' },
      { category: 'transport', value: 30, color: '#10b981' },
      { category: 'packaging', value: 15, color: '#f59e0b' },
      { category: 'energy', value: 10, color: '#ef4444' },
    ];
  
    return (
      <Box p="6">
        <Flex justify="between" align="center" mb="5">
          <Heading size="6">{t('sustainability-dashboard')}</Heading>
          <Flex gap="3">
            <Button variant="soft">
              {t('esg-report')}
            </Button>
            <Select.Root defaultValue="2023">
              <Select.Trigger />
            </Select.Root>
          </Flex>
        </Flex>
  
        <Grid columns="3" gap="4" mb="5">
          <Card>
            <Flex direction="column" gap="1">
              <Text size="2">{t('total-emissions')}</Text>
              <Heading size="7">24.5K tCO₂e</Heading>
              <Text size="1" className="text-green-500">{t('yoy-decrease')}</Text>
            </Flex>
          </Card>
          <Card>
            <Flex direction="column" gap="1">
              <Text size="2">{t('re100-progress')}</Text>
              <Heading size="7">68%</Heading>
              <Progress value={68} />
            </Flex>
          </Card>
          <Card>
            <Flex direction="column" gap="1">
              <Text size="2">{t('carbon-intensity')}</Text>
              <Heading size="7">0.45 t/$K</Heading>
              <Text size="1">{t('scope-1-2-3')}</Text>
            </Flex>
          </Card>
        </Grid>
  
        <Flex gap="4" mb="5">
          <Card style={{ flex: 1 }}>
            <Heading size="4" mb="3">{t('emission-breakdown')}</Heading>
            <div className="h-64">
              <PieChart width={300} height={250}>
                <Pie
                  data={emissionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {emissionData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </div>
          </Card>
          <Card style={{ flex: 1 }}>
            <Heading size="4" mb="3">{t('reduction-initiatives')}</Heading>
            {/* <div className="h-64">
              <Timeline>
                {['Solar Panel Installation (Q2)', 'Fleet Electrification (Q4)'].map((event) => (
                  <Timeline.Item key={event} status="upcoming">
                    {event}
                  </Timeline.Item>
                ))}
              </Timeline>
            </div> */}
          </Card>
        </Flex>
  
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>{t('category')}</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>{t('emissions')}</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>{t('target')}</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>{t('progress')}</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>{t('certification')}</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {emissionData.map((category) => (
              <Table.Row key={category.category}>
                <Table.Cell>{t(`emission-category.${category.category}`)}</Table.Cell>
                <Table.Cell>{category.value}%</Table.Cell>
                <Table.Cell>
                  {t('target-format', { value: Math.round(category.value * 0.8) })}
                </Table.Cell>
                <Table.Cell>
                  <Progress value={(category.value * 0.8)} />
                </Table.Cell>
                <Table.Cell>
                  <Badge variant="soft">{t('iso-certification')}</Badge>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
  
        <Flex mt="5" justify="end">
          <Text size="1" className="text-gray-400">
            {t('aligned-with')}
          </Text>
        </Flex>
      </Box>
    );
};

export default CO2Footprint;