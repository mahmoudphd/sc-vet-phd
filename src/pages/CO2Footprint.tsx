import { useState, useMemo, useEffect } from 'react';
import {
  Box, Button, Card, Flex, Grid, Heading, Progress, Select, Table, Text, TextField, Switch,
  Dialog
} from '@radix-ui/themes';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

// Constants
const CARBON_PRICE_PER_TON = 50; // USD per ton
const EXCHANGE_RATE = 50; // EGP per USD
const KG_PER_TON = 1000; // kg per ton

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6B6B'];

// Type definitions
interface StageItem {
  [key: string]: any;
  emissions: number;
}

interface EmissionDataItem {
  category: string;
  emissions: number;
  costEGP: number;
  costUSD: number;
  calculation: string;
  calculationEGP: string;
}

interface CostDetails {
  category: string;
  emissions: number;
  costEGP: string;
  costUSD: string;
  calculation: string;
}

interface ReductionItem {
  initiative: string;
  reduction: number;
}

// Original data structure
const stageData: Record<string, StageItem[]> = {
  'Raw Materials': [
    { material: 'Vitamin B1', quantity: 0.001, emissionFactor: 85, reference: '[IPCC 2023]', emissions: 0.085 },
    { material: 'Vitamin B2', quantity: 0.006, emissionFactor: 92, reference: '[Ecoinvent 3.8]', emissions: 0.552 },
    { material: 'Vitamin B12', quantity: 0.001, emissionFactor: 120, reference: '[Agri-footprint 5.0]', emissions: 0.120 },
  ],
  'Manufacturing': [
    { process: 'Water Mixing', quantity: 1, unit: 'kg', emissionFactor: 0.05, reference: '[Pharma LCA 2023]', emissions: 0.050 },
    { process: 'Equipment Cleaning', quantity: 3, unit: 'L', emissionFactor: 0.003, reference: '[WHO GMP 2022]', emissions: 0.009 },
  ],
  'Packaging': [
    { component: 'Plastic Bottle', quantity: 60, unit: 'g', material: 'HDPE', emissionFactor: 3.5, reference: '[EgyPack 2023]', emissions: 0.210 },
    { component: 'Metal Cap', quantity: 15, unit: 'g', material: 'Stainless Steel 304', emissionFactor: 7.0, reference: '[WorldSteel 2023]', emissions: 0.105 },
  ],
};

// Carbon cost calculation function
const calculateCarbonCost = (emissionsKg: number) => {
  const emissionsTon = emissionsKg / KG_PER_TON;
  const costUSD = emissionsTon * CARBON_PRICE_PER_TON;
  const costEGP = costUSD * EXCHANGE_RATE;
  
  return {
    costEGP: parseFloat(costEGP.toFixed(2)),
    costUSD: parseFloat(costUSD.toFixed(2)),
    calculation: `${emissionsKg.toFixed(2)} kg = ${emissionsTon.toFixed(4)} t × $${CARBON_PRICE_PER_TON}/t = $${costUSD.toFixed(2)}`,
    calculationEGP: `$${costUSD.toFixed(2)} × ${EXCHANGE_RATE} = EGP ${costEGP.toFixed(2)}`
  };
};

const CO2Footprint = () => {
  // State management
  const [currency, setCurrency] = useState<'USD' | 'EGP'>('USD');
  const [selectedProduct, setSelectedProduct] = useState('Poultry Product 1');
  const [certifications, setCertifications] = useState<string[]>(['ISO 14001', 'ISO 14001', 'ISO 14001']);
  const [mode, setMode] = useState<'manual' | 'auto'>('auto');
  const [openStage, setOpenStage] = useState<string | null>(null);
  const [currentStageData, setCurrentStageData] = useState<StageItem[]>([]);
  const [costDetailsOpen, setCostDetailsOpen] = useState(false);
  const [currentCostDetails, setCurrentCostDetails] = useState<CostDetails | null>(null);
  const [editableTargets, setEditableTargets] = useState<number[]>([]);

  // Initialize data with calculated carbon costs
  const defaultManualData: EmissionDataItem[] = [
    { 
      category: 'Raw Materials', 
      emissions: parseFloat(stageData['Raw Materials'].reduce((sum, item) => sum + item.emissions, 0).toFixed(3)),
      ...calculateCarbonCost(stageData['Raw Materials'].reduce((sum, item) => sum + item.emissions, 0))
    },
    { 
      category: 'Manufacturing', 
      emissions: parseFloat(stageData['Manufacturing'].reduce((sum, item) => sum + item.emissions, 0).toFixed(3)),
      ...calculateCarbonCost(stageData['Manufacturing'].reduce((sum, item) => sum + item.emissions, 0))
    },
    { 
      category: 'Packaging', 
      emissions: parseFloat(stageData['Packaging'].reduce((sum, item) => sum + item.emissions, 0).toFixed(3)),
      ...calculateCarbonCost(stageData['Packaging'].reduce((sum, item) => sum + item.emissions, 0))
    },
  ];

  const [emissionData, setEmissionData] = useState<EmissionDataItem[]>(defaultManualData);

  // Initialize editable targets
  useEffect(() => {
    const initialTargets = emissionData.map(item => parseFloat((item.emissions * 0.8).toFixed(3)));
    setEditableTargets(initialTargets);
  }, [emissionData]);

  // Set browser tab title
  useEffect(() => {
    document.title = "Sustainability Dashboard";
  }, []);

  const handleStageClick = (stage: string) => {
    setCurrentStageData(stageData[stage]);
    setOpenStage(stage);
  };

  const showCostDetails = (item: EmissionDataItem) => {
    const emissionsKg = item.emissions;
    const costInEGP = emissionsKg * (CARBON_PRICE_PER_TON / 1000) * EXCHANGE_RATE;
    const costInUSD = emissionsKg * (CARBON_PRICE_PER_TON / 1000);
    
    setCurrentCostDetails({
      category: item.category,
      emissions: emissionsKg,
      costEGP: costInEGP.toFixed(2),
      costUSD: costInUSD.toFixed(2),
      calculation: `${emissionsKg.toFixed(3)} kg CO₂e × (${CARBON_PRICE_PER_TON} $/ton ÷ 1000) × ${EXCHANGE_RATE}`
    });
    setCostDetailsOpen(true);
  };

  const handleEmissionChange = (index: number, value: string) => {
    if (mode === 'manual') {
      const newValue = parseFloat(value);
      if (!isNaN(newValue)) {
        const newData = [...emissionData];
        newData[index].emissions = newValue;
        newData[index] = {
          ...newData[index],
          ...calculateCarbonCost(newValue)
        };
        setEmissionData(newData);
      }
    }
  };

  const handleTargetChange = (index: number, value: string) => {
    const newValue = parseFloat(value);
    if (!isNaN(newValue)) {
      const newTargets = [...editableTargets];
      newTargets[index] = newValue;
      setEditableTargets(newTargets);
    }
  };

  const handleCertificationChange = (index: number, value: string) => {
    const newCerts = [...certifications];
    newCerts[index] = value;
    setCertifications(newCerts);
  };

  const handleEmissionEdit = (index: number, field: string, value: string) => {
    const newValue = parseFloat(value);
    if (!isNaN(newValue)) {
      const newData = [...currentStageData];
      newData[index][field] = newValue;
      
      if (field === 'quantity' || field === 'emissionFactor') {
        newData[index].emissions = newData[index].quantity * newData[index].emissionFactor;
      }
      
      setCurrentStageData(newData);
      
      const updatedEmissionData = [...emissionData];
      const categoryIndex = emissionData.findIndex(item => item.category === openStage);
      if (categoryIndex >= 0) {
        updatedEmissionData[categoryIndex].emissions = newData.reduce((sum, item) => sum + item.emissions, 0);
        updatedEmissionData[categoryIndex] = {
          ...updatedEmissionData[categoryIndex],
          ...calculateCarbonCost(updatedEmissionData[categoryIndex].emissions)
        };
        setEmissionData(updatedEmissionData);
      }
    }
  };

  const reductionData: ReductionItem[] = [
    { initiative: 'Solar Panel Installation', reduction: 2.5 },
    { initiative: 'LED Lighting', reduction: 1.2 },
  ];

  const totalEmissions = useMemo(() => 
    parseFloat(emissionData.reduce((sum, item) => sum + item.emissions, 0).toFixed(3)), 
    [emissionData]
  );

  const totalCost = useMemo(() => {
    const total = emissionData.reduce((sum, item) => 
      sum + (currency === 'EGP' ? item.costEGP : item.costUSD), 0);
    return parseFloat(total.toFixed(2));
  }, [emissionData, currency]);

  const revenue = currency === 'EGP' ? 55000 : 1800;
  const carbonIntensity = totalEmissions / (revenue / 1000);
  const totalReduction = reductionData.reduce((sum, item) => sum + item.reduction, 0);

  const handleSubmit = () => {
    console.log('Submitted emission data:', emissionData);
  };

  // Data for charts
  const pieChartData = emissionData.map(item => ({
    name: item.category,
    value: item.emissions,
    cost: currency === 'EGP' ? item.costEGP : item.costUSD
  }));

  const barChartData = reductionData;

  const renderTargetCell = (item: EmissionDataItem, index: number) => {
    return (
      <Table.Cell>
        <TextField.Root
          size="1"
          value={editableTargets[index].toString()}
          onChange={(e) => handleTargetChange(index, e.target.value)}
          style={{ maxWidth: 100 }}
        />
      </Table.Cell>
    );
  };

  const renderEditableDialogContent = () => {
    if (!currentStageData || currentStageData.length === 0) return null;

    return (
      <Box style={{ overflowY: 'auto', maxHeight: '70vh' }}>
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              {Object.keys(currentStageData[0]).map((key) => (
                <Table.ColumnHeaderCell key={key}>{key}</Table.ColumnHeaderCell>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {currentStageData.map((item: StageItem, index: number) => (
              <Table.Row key={index}>
                {Object.entries(item).map(([key, value]) => (
                  <Table.Cell key={key}>
                    {typeof value === 'number' ? (
                      <TextField.Root
                        size="1"
                        value={value.toString()}
                        onChange={(e) => handleEmissionEdit(index, key, e.target.value)}
                        style={{ maxWidth: 100 }}
                      />
                    ) : (
                      <Text>{String(value)}</Text>
                    )}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
            <Table.Row style={{ backgroundColor: 'var(--accent-a3)' }}>
              <Table.RowHeaderCell colSpan={Object.keys(currentStageData[0]).length - 1}>
                <strong>Total</strong>
              </Table.RowHeaderCell>
              <Table.Cell>
                <strong>
                  {currentStageData.reduce((sum, item) => sum + item.emissions, 0).toFixed(3)}
                </strong>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </Box>
    );
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
                <Select.Item value="Poultry Product 2">Poultry Product 2</Select.Item>
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
            <Heading size="7"><strong>{totalEmissions.toFixed(3)} kg CO₂e</strong></Heading>
            <Text size="1" color="green">↓ 12% YoY</Text>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1" p="4">
            <Text size="2"><strong>Environmental Cost</strong></Text>
            <Heading size="7"><strong>{totalCost} {currency}</strong></Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1" p="4">
            <Text size="2"><strong>Carbon Intensity</strong></Text>
            <Heading size="7"><strong>{carbonIntensity.toFixed(4)} kg/{currency === 'USD' ? '$' : 'EGP '}K</strong></Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1" p="4">
            <Text size="2"><strong>Emission Reduction</strong></Text>
            <Heading size="7"><strong>{totalReduction.toFixed(1)} kg CO₂e</strong></Heading>
          </Flex>
        </Card>
      </Grid>

      <Grid columns="2" gap="4" mb="4">
        <Card>
          <Box p="3">
            <Heading size="4" mb="2">Emissions by Category</Heading>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number, name: string, props: any) => [
                    `${value.toFixed(3)} kg CO₂e`,
                    name,
                    `${currency} ${props.payload.cost.toFixed(2)}`
                  ]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Card>
        <Card>
          <Box p="3">
            <Heading size="4" mb="2">Emission Reduction Initiatives</Heading>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <XAxis dataKey="initiative" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [`${value} kg CO₂e`, 'Reduction']}
                  labelFormatter={(label) => label}
                />
                <Legend />
                <Bar dataKey="reduction" name="Reduction (kg CO₂e)" fill="#8884d8" />
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
              <Table.ColumnHeaderCell><strong>Emissions (kg CO₂e)</strong></Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell><strong>Environmental Cost ({currency})</strong></Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell><strong>% of Total</strong></Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell><strong>Target (kg CO₂e)</strong></Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell><strong>Certification</strong></Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {emissionData.map((item, i) => (
              <Table.Row key={i}>
                <Table.Cell>
                  <Button 
                    variant="ghost" 
                    onClick={() => handleStageClick(item.category)}
                    style={{ padding: 0, fontWeight: 'bold' }}
                  >
                    {item.category}
                  </Button>
                </Table.Cell>
                <Table.Cell>
                  {mode === 'manual' ? (
                    <TextField.Root
                      size="1"
                      value={item.emissions.toString()}
                      onChange={(e) => handleEmissionChange(i, e.target.value)}
                      style={{ maxWidth: 100 }}
                    />
                  ) : (
                    <Text weight="bold">{item.emissions.toFixed(3)}</Text>
                  )}
                </Table.Cell>
                <Table.Cell>
                  <Button 
                    variant="ghost" 
                    onClick={() => showCostDetails(item)}
                    style={{ padding: 0 }}
                  >
                    {currency === 'EGP' 
                      ? `${item.costEGP} EGP` 
                      : `${item.costUSD} USD`}
                  </Button>
                </Table.Cell>
                <Table.Cell><strong>{((item.emissions / totalEmissions) * 100).toFixed(1)}%</strong></Table.Cell>
                {renderTargetCell(item, i)}
                <Table.Cell>
                  <Select.Root
                    value={certifications[i]}
                    onValueChange={(val) => handleCertificationChange(i, val)}
                  >
                    <Select.Trigger />
                    <Select.Content>
                      <Select.Item value="ISO 14001">ISO 14001</Select.Item>
                      <Select.Item value="ISO 50001">ISO 50001</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </Table.Cell>
              </Table.Row>
            ))}
            <Table.Row style={{ backgroundColor: 'var(--accent-a3)' }}>
              <Table.RowHeaderCell><strong>Total</strong></Table.RowHeaderCell>
              <Table.Cell><strong>{totalEmissions.toFixed(3)}</strong></Table.Cell>
              <Table.Cell><strong>{totalCost} {currency}</strong></Table.Cell>
              <Table.Cell><strong>100%</strong></Table.Cell>
              <Table.Cell>
                <strong>
                  {editableTargets.reduce((sum, target) => sum + target, 0).toFixed(3)}
                </strong>
              </Table.Cell>
              <Table.Cell />
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </Box>

      <Flex mt="4" justify="between" align="center">
        <Text size="1" color="gray">Last updated: {new Date().toLocaleDateString()}</Text>
        <Button variant="solid" color="green" onClick={handleSubmit}>
          Submit Carbon Report
        </Button>
      </Flex>

      <Dialog.Root open={!!openStage} onOpenChange={(open) => !open && setOpenStage(null)}>
        <Dialog.Content style={{ maxWidth: 800, maxHeight: '90vh' }}>
          <Dialog.Title>{openStage} Detailed Emissions</Dialog.Title>
          <Dialog.Description mb="4">
            {`Detailed breakdown of emissions for ${openStage} stage`}
          </Dialog.Description>
          {renderEditableDialogContent()}
          <Flex mt="4" justify="end">
            <Button variant="soft" onClick={() => setOpenStage(null)}>
              Close Details
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      <Dialog.Root open={costDetailsOpen} onOpenChange={setCostDetailsOpen}>
        <Dialog.Content style={{ maxWidth: 500 }}>
          <Dialog.Title>Environmental Cost Details</Dialog.Title>
          <Box>
            <Text as="div" size="3" weight="bold" mb="2">
              {currentCostDetails?.category}
            </Text>
            <Table.Root>
              <Table.Body>
                <Table.Row>
                  <Table.RowHeaderCell>Total Emissions</Table.RowHeaderCell>
                  <Table.Cell>
                    {currentCostDetails?.emissions.toFixed(3)} kg CO₂e
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.RowHeaderCell>Carbon Price</Table.RowHeaderCell>
                  <Table.Cell>{CARBON_PRICE_PER_TON} USD/ton</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.RowHeaderCell>Calculation</Table.RowHeaderCell>
                  <Table.Cell>{currentCostDetails?.calculation}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.RowHeaderCell>Cost in USD</Table.RowHeaderCell>
                  <Table.Cell>
                    <Text weight="bold">
                      {currentCostDetails?.costUSD} USD
                    </Text>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.RowHeaderCell>Cost in EGP</Table.RowHeaderCell>
                  <Table.Cell>
                    <Text weight="bold">
                      {currentCostDetails?.costEGP} EGP
                    </Text>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table.Root>
          </Box>
          <Flex justify="end" mt="4">
            <Button onClick={() => setCostDetailsOpen(false)}>Close</Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Box>
  );
};

export default CO2Footprint;
