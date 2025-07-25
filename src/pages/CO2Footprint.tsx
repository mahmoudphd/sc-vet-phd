import { useState, useMemo, useEffect } from 'react';
import {
  Box, Button, Card, Flex, Grid, Heading, Progress, Select, Table, Text, TextField, Switch
} from '@radix-ui/themes';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import { co2SimulatedData } from './co2SimulatedData';

const CO2Footprint = () => {
  const [currency, setCurrency] = useState<'USD' | 'EGP'>('USD');
  const [selectedProduct, setSelectedProduct] = useState('Poultry Product 1');
  const [certifications, setCertifications] = useState<string[]>(Array(7).fill('ISO 14001'));
  const [mode, setMode] = useState<'manual' | 'auto'>('manual');

  const defaultManualData = [
    { category: 'Raw Materials', emissions: 5.0 },
    { category: 'Manufacturing', emissions: 8.5 },
    { category: 'Packaging', emissions: 3.2 },
    { category: 'Transport', emissions: 4.0 },
    { category: 'Distribution', emissions: 2.5 },
    { category: 'Use', emissions: 1.5 },
    { category: 'End of Life', emissions: 2.3 }
  ];

  const [emissionData, setEmissionData] = useState(defaultManualData);

  useEffect(() => {
    if (mode === 'auto') {
      const mapped = co2SimulatedData.map(item => ({
        category: item.category,
        emissions: item.emissions
      }));
      setEmissionData(mapped);
    } else {
      setEmissionData(defaultManualData);
    }
  }, [mode]);

  const handleEmissionChange = (index: number, value: string) => {
    if (mode === 'manual') {
      const newValue = parseFloat(value);
      if (!isNaN(newValue)) {
        const newData = [...emissionData];
        newData[index].emissions = newValue;
        setEmissionData(newData);
      }
    }
  };

  const handleCertificationChange = (index: number, value: string) => {
    const newCerts = [...certifications];
    newCerts[index] = value;
    setCertifications(newCerts);
  };

  const reductionData = [
    { initiative: 'Solar Panel Installation', reduction: 2.5 },
    { initiative: 'LED Lighting', reduction: 1.2 },
    { initiative: 'Industrial Waste Recycling', reduction: 1.5 },
    { initiative: 'Fuel Consumption Optimization', reduction: 1.3 }
  ];

  const totalEmissions = useMemo(() => emissionData.reduce((sum, item) => sum + item.emissions, 0), [emissionData]);

  const emissionDataWithPercent = useMemo(() => {
    return emissionData.map(item => ({
      ...item,
      percentOfTotal: ((item.emissions / totalEmissions) * 100).toFixed(1),
      target: (item.emissions * 0.8).toFixed(1)
    }));
  }, [emissionData, totalEmissions]);

  const revenue = currency === 'EGP' ? 55000 : 1800;
  const carbonIntensity = totalEmissions / (revenue / 1000);
  const totalReduction = reductionData.reduce((sum, item) => sum + item.reduction, 0);

  const handleSubmit = () => {
    console.log('Submitted emission data:', emissionData);
  };

  return (
    <Box p="6">
      <Flex justify="between" align="center" mb="5">
        <Heading size="6">Sustainability Dashboard</Heading>
        <Flex gap="3">
          <Box>
            <Text size="1">Auto Mode</Text>
            <Switch checked={mode === 'auto'} onCheckedChange={(val) => setMode(val ? 'auto' : 'manual')} />
          </Box>
          <Box style={{ width: 180 }}>
            <Select.Root value={selectedProduct} onValueChange={val => setSelectedProduct(val)}>
              <Select.Trigger />
              <Select.Content>
                <Select.Item value="Poultry Product 1">Poultry Product 1</Select.Item>
              </Select.Content>
            </Select.Root>
          </Box>
          <Box style={{ width: 100 }}>
            <Select.Root value={currency} onValueChange={val => setCurrency(val as 'USD' | 'EGP')}>
              <Select.Trigger />
              <Select.Content>
                <Select.Item value="USD">USD</Select.Item>
                <Select.Item value="EGP">EGP</Select.Item>
              </Select.Content>
            </Select.Root>
          </Box>
        </Flex>
      </Flex>

      <Grid columns="4" gap="4" mb="5">
        <Card>
          <Flex direction="column" gap="1" p="4">
            <Text size="2"><strong>Total Emissions</strong></Text>
            <Heading size="7"><strong>{totalEmissions.toFixed(1)} tCO₂e</strong></Heading>
            <Text size="1" color="green">↓ 12% YoY</Text>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1" p="4">
            <Text size="2"><strong>RE100 Progress</strong></Text>
            <Heading size="7"><strong>68%</strong></Heading>
            <Progress value={68} />
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1" p="4">
            <Text size="2"><strong>Carbon Intensity</strong></Text>
            <Heading size="7"><strong>{carbonIntensity.toFixed(2)} t/{currency === 'USD' ? '$K' : 'EGP K'}</strong></Heading>
            <Text size="1">Scope 1, 2 & 3</Text>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1" p="4">
            <Text size="2"><strong>Emission Reduction Potential</strong></Text>
            <Heading size="7"><strong>{totalReduction.toFixed(1)} tCO₂e</strong></Heading>
            <Text size="1" color="gray">Estimated reduction from initiatives</Text>
          </Flex>
        </Card>
      </Grid>

      <Grid columns="2" gap="4" mb="5">
        <Card>
          <Heading size="4" mb="3">Emissions Breakdown</Heading>
          <Box height="250">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={emissionDataWithPercent}
                  dataKey="emissions"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {emissionDataWithPercent.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={["#3b82f6","#10b981","#f59e0b","#ef4444","#6366f1","#22c55e","#a855f7"][index % 7]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Card>

        <Card>
          <Heading size="4" mb="3">Reduction Initiatives</Heading>
          <Box height="250">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reductionData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <XAxis dataKey="initiative" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="reduction" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Card>
      </Grid>

      <Box mb="4" style={{ maxHeight: 400, overflowY: 'auto' }}>
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell><strong>Category</strong></Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell><strong>Emissions</strong></Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell><strong>% of Total</strong></Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell><strong>Target</strong></Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell><strong>Certification</strong></Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {emissionDataWithPercent.map((item, i) => (
              <Table.Row key={i}>
                <Table.Cell><strong>{item.category}</strong></Table.Cell>
                <Table.Cell>
                  {mode === 'manual' ? (
                    <Flex align="center" gap="2">
                      <TextField.Root
                        size="1"
                        value={item.emissions.toString()}
                        onChange={(e) => handleEmissionChange(i, e.target.value)}
                      />
                      <Text size="1" color="gray">tCO₂e</Text>
                    </Flex>
                  ) : (
                    <Text weight="bold">{item.emissions} tCO₂e</Text>
                  )}
                </Table.Cell>
                <Table.Cell><strong>{item.percentOfTotal}%</strong></Table.Cell>
                <Table.Cell><strong>{item.target} tCO₂e</strong></Table.Cell>
                <Table.Cell>
                  <Select.Root
                    value={certifications[i]}
                    onValueChange={(val) => handleCertificationChange(i, val)}
                  >
                    <Select.Trigger />
                    <Select.Content>
                      <Select.Item value="ISO 14001">ISO 14001</Select.Item>
                      <Select.Item value="ISO 50001">ISO 50001</Select.Item>
                      <Select.Item value="None">None</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </Table.Cell>
              </Table.Row>
            ))}
            <Table.Row>
              <Table.RowHeaderCell><strong>Total</strong></Table.RowHeaderCell>
              <Table.Cell><strong>{totalEmissions.toFixed(1)} tCO₂e</strong></Table.Cell>
              <Table.Cell><strong>100%</strong></Table.Cell>
              <Table.Cell><strong>{(totalEmissions * 0.8).toFixed(1)} tCO₂e</strong></Table.Cell>
              <Table.Cell />
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </Box>

      <Flex mt="4" justify="between" align="center">
        <Text size="1" color="gray">Verified by Blockchain</Text>
        <Button variant="solid" color="green" onClick={handleSubmit}>
          Submit
        </Button>
      </Flex>
    </Box>
  );
};

export default CO2Footprint;
