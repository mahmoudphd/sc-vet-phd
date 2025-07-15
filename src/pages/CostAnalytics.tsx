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
import { BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

const solutionOptions = [
  "Negotiating better prices with supplier",
  "Reducing waste in material usage",
  "Automation to reduce manual labor costs",
  "Optimizing machine usage",
  "Improving inventory management",
  "Minimize transportation costs",
  "Reduce rework costs",
  "Other"
];

const CostAnalysis = () => {
  const { t } = useTranslation('cost-analysis');

  const [costData, setCostData] = useState([
    {
      category: 'Direct Materials',
      value: 45,
      color: '#3b82f6',
      actual: '$1.4M',
      budget: '$1.3M',
      solution: 'Negotiating better prices with supplier',
      costAfter: '$1.25M'
    },
    {
      category: 'Packaging',
      value: 20,
      color: '#f59e0b',
      actual: '$700K',
      budget: '$650K',
      solution: 'Reducing waste in material usage',
      costAfter: '$630K'
    },
    {
      category: 'Labor',
      value: 10,
      color: '#ef4444',
      actual: '$400K',
      budget: '$350K',
      solution: 'Automation to reduce manual labor costs',
      costAfter: '$340K'
    }
  ]);

const handleSolutionChange = (index: number, newSolution: string) => {
    const updatedData = [...costData];
    updatedData[index].solution = newSolution;
    setCostData(updatedData);
  };

  return (
    <Box p="6">
      <Flex justify="between" align="center" mb="5">
        <Heading size="6">{t('Cost Analysis')}</Heading>
        <Flex gap="3">
          <Button variant="soft">
            $ {t('export-report')}
          </Button>
          <Select.Root defaultValue="quarter">
            <Select.Trigger />
          </Select.Root>
        </Flex>
      </Flex>

      <Grid columns="4" gap="4" mb="5">
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">{t('cogs')}</Text>
            <Heading size="7">$2.8M</Heading>
            <Text size="1" className="text-green-500">↓ 3.2% MoM</Text>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">{t('material-variance')}</Text>
            <Heading size="7" className="text-red-500">+7.1%</Heading>
            <Text size="1">{t('vs-usp-standard')}</Text>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">{t('yield-efficiency')}</Text>
            <Progress value={85} />
            <Text size="1">85% {t('theoretical-yield')}</Text>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">{t('waste-cost')}</Text>
            <Heading size="7">$124K</Heading>
            <Text size="1">0.8% {t('of-cogs')}</Text>
          </Flex>
        </Card>
      </Grid>

      <Flex gap="4" mb="5">
        <Card style={{ flex: 1 }}>
          <Heading size="4" mb="3">{t('cost-composition')}</Heading>
          <div className="h-64">
            <PieChart width={300} height={250}>
              <Pie
                data={costData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {costData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </div>
        </Card>
        <Card style={{ flex: 1 }}>
          <Heading size="4" mb="3">{t('cost-trend-analysis')}</Heading>
          <div className="h-64">
            <BarChart width={500} height={250} data={costData}>
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </div>
        </Card>
      </Flex>

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>{t('cost-category')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('actual')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('budget')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('variance')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('percent-of-total')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('solution')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('cost-after')}</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {costData.map((category, index) => (
            <Table.Row key={category.category}>
              <Table.Cell>{category.category}</Table.Cell>
              <Table.Cell>{category.actual}</Table.Cell>
              <Table.Cell>{category.budget}</Table.Cell>
              <Table.Cell>
                <Badge color={category.category === 'api' ? 'red' : 'green'}>
                  {t(`variance-values.${category.category === 'api' ? 'api' : 'default'}`)}
                </Badge>
              </Table.Cell>
              <Table.Cell>{category.value}%</Table.Cell>
              <Table.Cell>
                <Select.Root
                  defaultValue={category.solution}
                  onValueChange={(value) => handleSolutionChange(index, value)}
                >
                  <Select.Trigger />
                  <Select.Content>
                    {solutionOptions.map((option, i) => (
                      <Select.Item key={i} value={option}>
                        {option}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </Table.Cell>
              <Table.Cell>{category.costAfter}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

export default CostAnalysis;
