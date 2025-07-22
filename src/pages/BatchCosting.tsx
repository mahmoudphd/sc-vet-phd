import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  Flex,
  Heading,
  Text,
  Table,
  Badge,
  Grid,
  Progress,
  Box,
  Select,
} from '@radix-ui/themes';
import { PieChart, Pie, BarChart, Bar } from 'recharts';

const OpenBookAccounting = () => {
  const { t } = useTranslation('open-book-accounting');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('');
  
  const transactions = [
    {
      id: 'TX-23001',
      date: '2023-05-15',
      product: 'Anthelmintic Oral Suspension',
      supplier: 'PharmaSource Inc.',
      amount: 24500,
      status: 'paid',
      reconciliation: 'completed',
      dueDate: '2023-06-14'
    },
    {
      id: 'TX-23002',
      date: '2023-05-18',
      product: 'Antibiotic Injection',
      supplier: 'Global Pharma Supplies',
      amount: 18700,
      status: 'pending',
      reconciliation: 'in-progress',
      dueDate: '2023-06-17'
    },
  ];

  const products = [
    { id: 'p1', name: 'Anthelmintic Oral Suspension' },
    { id: 'p2', name: 'Antibiotic Injection' },
    { id: 'p3', name: 'Pain Relief Tablets' },
  ];

  const suppliers = [
    { id: 's1', name: 'PharmaSource Inc.' },
    { id: 's2', name: 'Global Pharma Supplies' },
    { id: 's3', name: 'MediCorp International' },
  ];

  return (
    <Box p="6">
      <Flex justify="between" align="center" mb="5">
        <Heading size="6">المحاسبة المفتوحة - نظرة عامة</Heading>
        
        <Flex gap="3" align="center">
          <Select.Root 
            value={selectedSupplier}
            onValueChange={setSelectedSupplier}
          >
            <Select.Trigger placeholder="اختر المورد" />
            <Select.Content>
              {suppliers.map(supplier => (
                <Select.Item key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>

          <Select.Root 
            value={selectedProduct}
            onValueChange={setSelectedProduct}
          >
            <Select.Trigger placeholder="اختر المنتج" />
            <Select.Content>
              {products.map(product => (
                <Select.Item key={product.id} value={product.id}>
                  {product.name}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </Flex>
      </Flex>

      <Grid columns="4" gap="4" mb="5">
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">إجمالي المعاملات المفتوحة</Text>
            <Heading size="7">$43,200</Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">المدفوعات القادمة</Text>
            <Heading size="7">$18,700</Heading>
            <Text size="1" color="gray">مستحقة خلال 7 أيام</Text>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">متوسط شروط الدفع</Text>
            <Heading size="7">30 يوم</Heading>
            <Text size="1" color="gray">صافي 30 يوم</Text>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">علاقات الموردين</Text>
            <Progress value={88} />
            <Text size="1" color="gray">12 مورد نشط</Text>
          </Flex>
        </Card>
      </Grid>

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>رقم المعاملة</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>التاريخ</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>المنتج</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>المورد</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>المبلغ</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>الحالة</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>تاريخ الاستحقاق</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {transactions.map((tx) => (
            <Table.Row key={tx.id}>
              <Table.Cell>{tx.id}</Table.Cell>
              <Table.Cell>{tx.date}</Table.Cell>
              <Table.Cell>{tx.product}</Table.Cell>
              <Table.Cell>{tx.supplier}</Table.Cell>
              <Table.Cell>${tx.amount.toLocaleString()}</Table.Cell>
              <Table.Cell>
                <Badge color={tx.status === 'paid' ? 'green' : 'orange'}>
                  {tx.status === 'paid' ? 'تم الدفع' : 'قيد الانتظار'}
                </Badge>
              </Table.Cell>
              <Table.Cell>{tx.dueDate}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <Flex mt="5" gap="4">
        <Card style={{ flex: 1 }}>
          <Heading size="4" mb="3">الإنفاق حسب المورد</Heading>
          <div className="h-64">
            <BarChart width={500} height={250} data={[
              { name: 'PharmaSource', value: 24500 },
              { name: 'Global Pharma', value: 18700 },
              { name: 'BioSolutions', value: 9200 }
            ]}>
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </div>
        </Card>
        <Card style={{ flex: 1 }}>
          <Heading size="4" mb="3">توزيع حالة الدفع</Heading>
          <div className="h-64">
            <PieChart width={300} height={250}>
              <Pie
                data={[
                  { name: 'تم الدفع', value: 65 },
                  { name: 'قيد الانتظار', value: 25 },
                  { name: 'متأخر', value: 10 }
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

export default OpenBookAccounting;
