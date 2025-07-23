import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Flex,
  Grid,
  Heading,
  Select,
  Table,
  Text,
  TextField,
  TextArea,
  Badge,
  Container,
  ScrollArea
} from '@radix-ui/themes';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

const BatchCosting = () => {
  // States
  const [batchSize, setBatchSize] = useState('1000');
  const [materialCost, setMaterialCost] = useState('5000');
  const [laborCost, setLaborCost] = useState('2000');
  const [overhead, setOverhead] = useState('1500');
  const [productionTime, setProductionTime] = useState('48');
  const [currency, setCurrency] = useState('USD');
  const [notes, setNotes] = useState('');

  // Production stages
  const [stages, setStages] = useState([
    { name: 'Weighing', time: '2', cost: '200' },
    { name: 'Mixing', time: '4', cost: '400' },
    { name: 'Granulation', time: '6', cost: '600' },
    { name: 'Compression', time: '8', cost: '800' },
    { name: 'Coating', time: '10', cost: '1000' },
    { name: 'Packaging', time: '5', cost: '500' }
  ]);

  // Calculations
  const totalCost = parseFloat(materialCost) + parseFloat(laborCost) + parseFloat(overhead);
  const unitCost = totalCost / (parseFloat(batchSize) || 1);

  // Handlers
  const handleStageChange = (index: number, field: string, value: string) => {
    const updated = [...stages];
    updated[index] = { ...updated[index], [field]: value };
    setStages(updated);
  };

  const addNewStage = () => {
    setStages([...stages, { name: '', time: '', cost: '' }]);
  };

  // Custom Input Component compatible with current Radix version
  const CustomInput = ({ 
    value, 
    onChange, 
    type = 'text', 
    placeholder = '' 
  }: {
    value: string;
    onChange: (value: string) => void;
    type?: string;
    placeholder?: string;
  }) => (
    <div style={{ width: '100%' }}>
      <TextField.Root>
        <input
          className="rt-TextFieldInput"
          type={type}
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: '0 10px',
            height: '35px',
            borderRadius: '4px',
            border: '1px solid var(--gray-a7)'
          }}
        />
      </TextField.Root>
    </div>
  );

  return (
    <Container size="3" px="4" py="6">
      <Flex direction="column" gap="6">
        {/* Header Section */}
        <Flex justify="between" align="center">
          <Heading size="8" weight="bold">Batch Costing Calculator</Heading>
          <Flex align="center" gap="3">
            <Text size="2" weight="bold">Currency:</Text>
            <Select.Root value={currency} onValueChange={setCurrency}>
              <Select.Trigger />
              <Select.Content>
                <Select.Item value="USD">USD</Select.Item>
                <Select.Item value="EUR">EUR</Select.Item>
                <Select.Item value="EGP">EGP</Select.Item>
              </Select.Content>
            </Select.Root>
          </Flex>
        </Flex>

        {/* Main Grid */}
        <Grid columns={{ initial: '1', md: '2' }} gap="4">
          {/* Batch Information Card */}
          <Card>
            <Flex direction="column" gap="4">
              <Heading size="5">Batch Information</Heading>
              
              <Flex direction="column" gap="2">
                <Text as="label" size="2" weight="bold">
                  Batch Size (units)
                </Text>
                <CustomInput
                  type="number"
                  value={batchSize}
                  onChange={setBatchSize}
                  placeholder="Enter batch size"
                />
              </Flex>

              <Flex direction="column" gap="2">
                <Text as="label" size="2" weight="bold">
                  Production Time (hours)
                </Text>
                <CustomInput
                  type="number"
                  value={productionTime}
                  onChange={setProductionTime}
                  placeholder="Enter production time"
                />
              </Flex>
            </Flex>
          </Card>

          {/* Cost Summary Card */}
          <Card>
            <Flex direction="column" gap="4">
              <Heading size="5">Cost Summary</Heading>
              
              <Flex direction="column" gap="3">
                <Flex justify="between">
                  <Text size="2">Total Batch Cost:</Text>
                  <Badge color="green" size="2">
                    {currency} {totalCost.toFixed(2)}
                  </Badge>
                </Flex>
                
                <Flex justify="between">
                  <Text size="2">Unit Cost:</Text>
                  <Badge color="blue" size="2">
                    {currency} {unitCost.toFixed(2)}
                  </Badge>
                </Flex>
              </Flex>

              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={[
                  { name: 'Materials', value: parseFloat(materialCost) },
                  { name: 'Labor', value: parseFloat(laborCost) },
                  { name: 'Overhead', value: parseFloat(overhead) }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </Flex>
          </Card>
        </Grid>

        {/* Cost Breakdown Section */}
        <Card>
          <Flex direction="column" gap="4">
            <Heading size="5">Cost Breakdown</Heading>
            
            <Grid columns={{ initial: '1', md: '3' }} gap="4">
              <Flex direction="column" gap="2">
                <Text as="label" size="2" weight="bold">
                  Material Cost ({currency})
                </Text>
                <CustomInput
                  type="number"
                  value={materialCost}
                  onChange={setMaterialCost}
                  placeholder="Material cost"
                />
              </Flex>

              <Flex direction="column" gap="2">
                <Text as="label" size="2" weight="bold">
                  Labor Cost ({currency})
                </Text>
                <CustomInput
                  type="number"
                  value={laborCost}
                  onChange={setLaborCost}
                  placeholder="Labor cost"
                />
              </Flex>

              <Flex direction="column" gap="2">
                <Text as="label" size="2" weight="bold">
                  Overhead ({currency})
                </Text>
                <CustomInput
                  type="number"
                  value={overhead}
                  onChange={setOverhead}
                  placeholder="Overhead cost"
                />
              </Flex>
            </Grid>
          </Flex>
        </Card>

        {/* Production Stages Section */}
        <Card>
          <Flex direction="column" gap="4">
            <Flex justify="between" align="center">
              <Heading size="5">Production Stages</Heading>
              <Button variant="soft" onClick={addNewStage}>
                + Add Stage
              </Button>
            </Flex>

            <ScrollArea type="always" scrollbars="horizontal" style={{ maxHeight: 440 }}>
              <Table.Root variant="surface">
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeaderCell>Stage Name</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Time (hours)</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Cost ({currency})</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {stages.map((stage, index) => (
                    <Table.Row key={index}>
                      <Table.Cell>
                        <CustomInput
                          value={stage.name}
                          onChange={(value) => handleStageChange(index, 'name', value)}
                          placeholder="Stage name"
                        />
                      </Table.Cell>
                      
                      <Table.Cell>
                        <CustomInput
                          type="number"
                          value={stage.time}
                          onChange={(value) => handleStageChange(index, 'time', value)}
                          placeholder="Time"
                        />
                      </Table.Cell>
                      
                      <Table.Cell>
                        <CustomInput
                          type="number"
                          value={stage.cost}
                          onChange={(value) => handleStageChange(index, 'cost', value)}
                          placeholder="Cost"
                        />
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </ScrollArea>
          </Flex>
        </Card>

        {/* Notes Section */}
        <Card>
          <Flex direction="column" gap="3">
            <Heading size="5">Additional Notes</Heading>
            <TextArea
              rows={4}
              value={notes}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
              placeholder="Enter any additional notes or comments..."
            />
          </Flex>
        </Card>

        {/* Time Series Chart */}
        <Card>
          <Flex direction="column" gap="3">
            <Heading size="5">Cost Over Time</Heading>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={[
                  { name: 'Jan', cost: 4000 },
                  { name: 'Feb', cost: 4200 },
                  { name: 'Mar', cost: 3800 },
                  { name: 'Apr', cost: 4500 },
                  { name: 'May', cost: 4100 },
                  { name: 'Jun', cost: 5000 }
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="cost" stroke="#3b82f6" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </Flex>
        </Card>
      </Flex>
    </Container>
  );
};

export default BatchCosting;
