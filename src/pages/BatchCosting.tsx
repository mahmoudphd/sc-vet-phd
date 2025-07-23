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
  // States for form inputs
  const [batchSize, setBatchSize] = useState<string>('1000');
  const [materialCost, setMaterialCost] = useState<string>('5000');
  const [laborCost, setLaborCost] = useState<string>('2000');
  const [overhead, setOverhead] = useState<string>('1500');
  const [productionTime, setProductionTime] = useState<string>('48');
  const [currency, setCurrency] = useState<string>('USD');
  const [notes, setNotes] = useState<string>('');

  // Production stages data
  const [stages, setStages] = useState([
    { name: 'Weighing', time: '2', cost: '200' },
    { name: 'Mixing', time: '4', cost: '400' },
    { name: 'Granulation', time: '6', cost: '600' },
    { name: 'Compression', time: '8', cost: '800' },
    { name: 'Coating', time: '10', cost: '1000' },
    { name: 'Packaging', time: '5', cost: '500' }
  ]);

  // Cost breakdown data for charts
  const costData = [
    { name: 'Materials', value: parseFloat(materialCost) || 0 },
    { name: 'Labor', value: parseFloat(laborCost) || 0 },
    { name: 'Overhead', value: parseFloat(overhead) || 0 }
  ];

  // Calculate total cost
  const totalCost = costData.reduce((sum, item) => sum + item.value, 0);
  const unitCost = totalCost / (parseFloat(batchSize) || 1);

  // Handle stage changes
  const handleStageChange = (index: number, field: string, value: string) => {
    const updatedStages = [...stages];
    updatedStages[index] = { ...updatedStages[index], [field]: value };
    setStages(updatedStages);
  };

  // Add new production stage
  const addNewStage = () => {
    setStages([...stages, { name: '', time: '', cost: '' }]);
  };

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

        {/* Main Input Cards */}
        <Grid columns={{ initial: '1', md: '2' }} gap="4">
          {/* Batch Information Card */}
          <Card>
            <Flex direction="column" gap="4">
              <Heading size="5">Batch Information</Heading>
              
              <Flex direction="column" gap="2">
                <Text as="label" size="2" weight="bold">
                  Batch Size (units)
                </Text>
                <TextField.Root>
                  <TextField.Input 
                    type="number" 
                    value={batchSize}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBatchSize(e.target.value)}
                    placeholder="Enter batch size"
                  />
                </TextField.Root>
              </Flex>

              <Flex direction="column" gap="2">
                <Text as="label" size="2" weight="bold">
                  Production Time (hours)
                </Text>
                <TextField.Root>
                  <TextField.Input
                    type="number"
                    value={productionTime}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProductionTime(e.target.value)}
                    placeholder="Enter production time"
                  />
                </TextField.Root>
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
                <BarChart data={costData}>
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
                <TextField.Root>
                  <TextField.Input
                    type="number"
                    value={materialCost}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMaterialCost(e.target.value)}
                    placeholder="Material cost"
                  />
                </TextField.Root>
              </Flex>

              <Flex direction="column" gap="2">
                <Text as="label" size="2" weight="bold">
                  Labor Cost ({currency})
                </Text>
                <TextField.Root>
                  <TextField.Input
                    type="number"
                    value={laborCost}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLaborCost(e.target.value)}
                    placeholder="Labor cost"
                  />
                </TextField.Root>
              </Flex>

              <Flex direction="column" gap="2">
                <Text as="label" size="2" weight="bold">
                  Overhead ({currency})
                </Text>
                <TextField.Root>
                  <TextField.Input
                    type="number"
                    value={overhead}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOverhead(e.target.value)}
                    placeholder="Overhead cost"
                  />
                </TextField.Root>
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
                        <TextField.Root>
                          <TextField.Input
                            value={stage.name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                              handleStageChange(index, 'name', e.target.value)
                            }
                            placeholder="Stage name"
                          />
                        </TextField.Root>
                      </Table.Cell>
                      
                      <Table.Cell>
                        <TextField.Root>
                          <TextField.Input
                            type="number"
                            value={stage.time}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                              handleStageChange(index, 'time', e.target.value)
                            }
                            placeholder="Time"
                          />
                        </TextField.Root>
                      </Table.Cell>
                      
                      <Table.Cell>
                        <TextField.Root>
                          <TextField.Input
                            type="number"
                            value={stage.cost}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                              handleStageChange(index, 'cost', e.target.value)
                            }
                            placeholder="Cost"
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
