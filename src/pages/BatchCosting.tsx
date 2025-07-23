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

  return (
    <Container size="3" px="4" py="6">
      <Flex direction="column" gap="6">
        {/* Header */}
        <Flex justify="between" align="center">
          <Heading size="8">Batch Cost Calculator</Heading>
          <Flex align="center" gap="3">
            <Text>Currency:</Text>
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
          {/* Batch Info */}
          <Card>
            <Flex direction="column" gap="4">
              <Heading size="5">Batch Details</Heading>
              
              <Flex direction="column" gap="2">
                <Text as="label" size="2">Batch Size</Text>
                <TextField.Root>
                  <TextField.Input
                    type="number"
                    value={batchSize}
                    onChange={(e) => setBatchSize(e.target.value)}
                  />
                </TextField.Root>
              </Flex>

              <Flex direction="column" gap="2">
                <Text as="label" size="2">Production Time</Text>
                <TextField.Root>
                  <TextField.Input
                    type="number"
                    value={productionTime}
                    onChange={(e) => setProductionTime(e.target.value)}
                  />
                </TextField.Root>
              </Flex>
            </Flex>
          </Card>

          {/* Cost Summary */}
          <Card>
            <Flex direction="column" gap="4">
              <Heading size="5">Cost Summary</Heading>
              
              <Flex direction="column" gap="3">
                <Flex justify="between">
                  <Text>Total Cost:</Text>
                  <Badge color="green">
                    {currency} {totalCost.toFixed(2)}
                  </Badge>
                </Flex>
                
                <Flex justify="between">
                  <Text>Unit Cost:</Text>
                  <Badge color="blue">
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

        {/* Cost Breakdown */}
        <Card>
          <Flex direction="column" gap="4">
            <Heading size="5">Cost Breakdown</Heading>
            
            <Grid columns={{ initial: '1', md: '3' }} gap="4">
              <Flex direction="column" gap="2">
                <Text as="label" size="2">Material Cost</Text>
                <TextField.Root>
                  <TextField.Input
                    type="number"
                    value={materialCost}
                    onChange={(e) => setMaterialCost(e.target.value)}
                  />
                </TextField.Root>
              </Flex>

              <Flex direction="column" gap="2">
                <Text as="label" size="2">Labor Cost</Text>
                <TextField.Root>
                  <TextField.Input
                    type="number"
                    value={laborCost}
                    onChange={(e) => setLaborCost(e.target.value)}
                  />
                </TextField.Root>
              </Flex>

              <Flex direction="column" gap="2">
                <Text as="label" size="2">Overhead</Text>
                <TextField.Root>
                  <TextField.Input
                    type="number"
                    value={overhead}
                    onChange={(e) => setOverhead(e.target.value)}
                  />
                </TextField.Root>
              </Flex>
            </Grid>
          </Flex>
        </Card>

        {/* Production Stages */}
        <Card>
          <Flex direction="column" gap="4">
            <Flex justify="between" align="center">
              <Heading size="5">Production Stages</Heading>
              <Button onClick={addNewStage}>+ Add Stage</Button>
            </Flex>

            <ScrollArea scrollbars="horizontal">
              <Table.Root variant="surface">
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeaderCell>Stage</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Time (hrs)</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Cost</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {stages.map((stage, index) => (
                    <Table.Row key={index}>
                      <Table.Cell>
                        <TextField.Root>
                          <TextField.Input
                            value={stage.name}
                            onChange={(e) => handleStageChange(index, 'name', e.target.value)}
                          />
                        </TextField.Root>
                      </Table.Cell>
                      
                      <Table.Cell>
                        <TextField.Root>
                          <TextField.Input
                            type="number"
                            value={stage.time}
                            onChange={(e) => handleStageChange(index, 'time', e.target.value)}
                          />
                        </TextField.Root>
                      </Table.Cell>
                      
                      <Table.Cell>
                        <TextField.Root>
                          <TextField.Input
                            type="number"
                            value={stage.cost}
                            onChange={(e) => handleStageChange(index, 'cost', e.target.value)}
                          />
                        </TextField.Root>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </ScrollArea>
          </Flex>
        </Card>

        {/* Notes */}
        <Card>
          <Flex direction="column" gap="3">
            <Heading size="5">Notes</Heading>
            <TextArea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes..."
            />
          </Flex>
        </Card>
      </Flex>
    </Container>
  );
};

export default BatchCosting;
