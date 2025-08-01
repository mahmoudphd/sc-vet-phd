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

// Original data structure with grams where applicable
const stageData = {
  'Raw Materials': [
    { material: 'Vitamin B1', quantity: 0.001, emissionFactor: 85, reference: '[IPCC 2023]', emissions: 0.085 },
    { material: 'Vitamin B2', quantity: 0.006, emissionFactor: 92, reference: '[Ecoinvent 3.8]', emissions: 0.552 },
    { material: 'Vitamin B12', quantity: 0.001, emissionFactor: 120, reference: '[Agri-footprint 5.0]', emissions: 0.120 },
    { material: 'Nicotinamide (B3)', quantity: 0.01, emissionFactor: 78, reference: '[US LCI Database]', emissions: 0.780 },
    { material: 'Pantothenic Acid', quantity: 0.004, emissionFactor: 65, reference: '[DEFRA 2022]', emissions: 0.260 },
    { material: 'Vitamin B6', quantity: 0.0015, emissionFactor: 88, reference: '[IPCC 2023]', emissions: 0.132 },
    { material: 'Leucine', quantity: 0.03, emissionFactor: 42, reference: '[FAO STAT 2023]', emissions: 1.260 },
    { material: 'Threonine', quantity: 0.01, emissionFactor: 38, reference: '[FAO STAT 2023]', emissions: 0.380 },
    { material: 'Taurine', quantity: 0.0025, emissionFactor: 55, reference: '[LCA Food DK]', emissions: 0.138 },
    { material: 'Glycine', quantity: 0.0025, emissionFactor: 32, reference: '[EPD International]', emissions: 0.080 },
    { material: 'Arginine', quantity: 0.0025, emissionFactor: 48, reference: '[Agri-footprint 5.0]', emissions: 0.120 },
    { material: 'Cynarine', quantity: 0.0025, emissionFactor: 115, reference: '[USDA LCA Commons]', emissions: 0.288 },
    { material: 'Silymarin', quantity: 0.025, emissionFactor: 105, reference: '[Egyptian LCA 2024]', emissions: 2.625 },
    { material: 'Sorbitol', quantity: 0.01, emissionFactor: 22, reference: '[EU PEF Guide]', emissions: 0.220 },
    { material: 'Carnitine', quantity: 0.005, emissionFactor: 95, reference: '[World Food LCA]', emissions: 0.475 },
    { material: 'Betaine', quantity: 0.02, emissionFactor: 28, reference: '[USDA ARS]', emissions: 0.560 },
    { material: 'Tween-80', quantity: 0.075, emissionFactor: 18, reference: '[Chinese LCA Database]', emissions: 1.350 },
    { material: 'Water', quantity: 0.571, emissionFactor: 0.05, reference: '[Water Footprint]', emissions: 0.029 },
  ],
  'Manufacturing': [
    { process: 'Water Mixing', quantity: 1, unit: 'kg', emissionFactor: 0.05, reference: '[Pharma LCA 2023]', emissions: 0.050 },
    { process: 'Equipment Cleaning', quantity: 3, unit: 'L', emissionFactor: 0.003, reference: '[WHO GMP 2022]', emissions: 0.009 },
    { process: 'Material Mixing', quantity: 0.5, unit: 'kWh', emissionFactor: 0.55, reference: '[CAPMAS 2023]', emissions: 0.275 },
    { process: 'Liquid Filling', quantity: 0.3, unit: 'kWh', emissionFactor: 0.55, reference: '[ISO 14044]', emissions: 0.165 },
    { process: 'Sterilization', quantity: 1.5, unit: 'kWh', emissionFactor: 0.55, reference: '[USP Sterilization]', emissions: 0.825 },
    { process: 'Primary Packaging', quantity: 0.2, unit: 'kWh', emissionFactor: 0.55, reference: '[EgyPack 2023]', emissions: 0.110 },
    { process: 'Quality Inspection', quantity: 0.3, unit: 'kWh', emissionFactor: 0.55, reference: '[FDA Guidelines]', emissions: 0.165 },
  ],
  'Packaging': [
    { component: 'Plastic Bottle', quantity: 60, unit: 'g', material: 'HDPE', emissionFactor: 3.5, reference: '[EgyPack 2023]', emissions: 0.210 },
    { component: 'Metal Cap', quantity: 15, unit: 'g', material: 'Stainless Steel 304', emissionFactor: 7.0, reference: '[WorldSteel 2023]', emissions: 0.105 },
    { component: 'Aluminum Seal', quantity: 2, unit: 'g', material: 'Aluminum', emissionFactor: 9.0, reference: '[IPCC 2023]', emissions: 0.018 },
    { component: 'Paper Label', quantity: 5, unit: 'g', material: 'Recycled Paper', emissionFactor: 0.9, reference: '[EEAA 2023]', emissions: 0.0045 },
    { component: 'Secondary Packaging', quantity: 50, unit: 'g', material: 'Corrugated Cardboard', emissionFactor: 1.0, reference: '[EgyPack 2023]', emissions: 0.050 },
    { component: 'Adhesive', quantity: 3, unit: 'g', material: 'Chemical', emissionFactor: 2.5, reference: '[CAPMAS 2023]', emissions: 0.0075 },
  ],
  'Transport': [
    { type: 'Refrigerated Storage', duration: 7, unit: 'days', emissionFactor: 0.03, reference: '[Egyptian Cold Chain 2023]', emissions: 0.210 },
    { type: 'Local Transport', distance: 50, unit: 'km', emissionFactor: 0.18, reference: '[CAPMAS 2023]', emissions: 0.090 },
    { type: 'Long-Distance Transport', distance: 300, unit: 'km', emissionFactor: 0.10, reference: '[EgyLogistics 2023]', emissions: 0.300 },
  ],
  'Distribution': [
    { activity: 'Warehouse Storage', duration: 3, unit: 'days', emissionFactor: 0.01, reference: '[EgyLogistics 2023]', emissions: 0.030 },
    { activity: 'Last-Mile Delivery', distance: 15, unit: 'km', emissionFactor: 0.12, reference: '[Cairo Air Quality]', emissions: 0.018 },
    { activity: 'Retail Storage', duration: 2, unit: 'days', emissionFactor: 0.005, reference: '[Retail LCA 2023]', emissions: 0.010 },
  ],
  'Use': [
    { aspect: 'Consumer Transportation', distance: 5, unit: 'km', emissionFactor: 0.2, reference: '[WB 2023]', emissions: 0.010 },
    { aspect: 'Product Refrigeration', duration: 14, unit: 'days', emissionFactor: 0.05, reference: '[UNEP 2023]', emissions: 0.070 },
    { aspect: 'Product Preparation', quantity: 0.1, unit: 'kWh', emissionFactor: 0.5, reference: '[Household Energy]', emissions: 0.050 },
  ],
  'End of Life': [
    { method: 'Medical Waste Incineration', quantity: 0.1, unit: 'kg', emissionFactor: 3.5, reference: '[Egyptian EPA 2023]', emissions: 0.350 },
    { method: 'Recycling', quantity: 0.05, unit: 'kg', emissionFactor: -0.3, reference: '[EgyWaste 2023]', emissions: -0.015 },
    { method: 'Landfill', quantity: 0.03, unit: 'kg', emissionFactor: 1.5, reference: '[Cairo Waste Authority]', emissions: 0.045 },
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
  const [certifications, setCertifications] = useState<string[]>(Array(7).fill('ISO 14001'));
  const [mode, setMode] = useState<'manual' | 'auto'>('auto');
  const [openStage, setOpenStage] = useState<string | null>(null);
  const [currentStageData, setCurrentStageData] = useState<any[]>([]);
  const [costDetailsOpen, setCostDetailsOpen] = useState(false);
  const [currentCostDetails, setCurrentCostDetails] = useState<any>(null);
  const [editableTargets, setEditableTargets] = useState<number[]>([]);
  const [editableEmissions, setEditableEmissions] = useState<any>({});

  // Initialize data with calculated carbon costs
  const defaultManualData = [
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
    { 
      category: 'Transport', 
      emissions: parseFloat(stageData['Transport'].reduce((sum, item) => sum + item.emissions, 0).toFixed(3)),
      ...calculateCarbonCost(stageData['Transport'].reduce((sum, item) => sum + item.emissions, 0))
    },
    { 
      category: 'Distribution', 
      emissions: parseFloat(stageData['Distribution'].reduce((sum, item) => sum + item.emissions, 0).toFixed(3)),
      ...calculateCarbonCost(stageData['Distribution'].reduce((sum, item) => sum + item.emissions, 0))
    },
    { 
      category: 'Use', 
      emissions: parseFloat(stageData['Use'].reduce((sum, item) => sum + item.emissions, 0).toFixed(3)),
      ...calculateCarbonCost(stageData['Use'].reduce((sum, item) => sum + item.emissions, 0))
    },
    { 
      category: 'End of Life', 
      emissions: parseFloat(stageData['End of Life'].reduce((sum, item) => sum + item.emissions, 0).toFixed(3)),
      ...calculateCarbonCost(stageData['End of Life'].reduce((sum, item) => sum + item.emissions, 0))
    }
  ];

  const [emissionData, setEmissionData] = useState(defaultManualData);

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
    setCurrentStageData(stageData[stage as keyof typeof stageData]);
    setOpenStage(stage);
  };

  const showCostDetails = (item: any) => {
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

  // Handle target change
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

  // Handle emission edit in dialog
  const handleEmissionEdit = (index: number, field: string, value: string) => {
    const newValue = parseFloat(value);
    if (!isNaN(newValue)) {
      const newData = [...currentStageData];
      newData[index][field] = newValue;
      
      // Recalculate emissions if quantity or emissionFactor changed
      if (field === 'quantity' || field === 'emissionFactor') {
        newData[index].emissions = newData[index].quantity * newData[index].emissionFactor;
      }
      
      setCurrentStageData(newData);
      
      // Update main data if needed
      const updatedEmissionData = [...emissionData];
      const categoryIndex = emissionData.findIndex(item => item.category === openStage);
      if (categoryIndex >= 0) {
        updatedEmissionData[categoryIndex].emissions = newData.reduce((sum, item) => sum + item.emissions, 0);
        setEmissionData(updatedEmissionData);
      }
    }
  };

  const reductionData = [
    { initiative: 'Solar Panel Installation', reduction: 2.5 },
    { initiative: 'LED Lighting', reduction: 1.2 },
    { initiative: 'Industrial Waste Recycling', reduction: 1.5 },
    { initiative: 'Fuel Consumption Optimization', reduction: 1.3 }
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

  // Render editable target cell
  const renderTargetCell = (item: any, index: number) => {
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

  // Render editable dialog content
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
            {currentStageData.map((item: any, index: number) => (
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
                      <Text>{value}</Text>
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
                <Select.Item value="Poultry Product 3">Poultry Product 3</Select.Item>
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

      {/* Charts Section */}
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
                      <Select.Item value="ISO 14064">ISO 14064</Select.Item>
                      <Select.Item value="ISO 14067">ISO 14067 (Carbon Footprint)</Select.Item>
                      <Select.Item value="GHG Protocol">GHG Protocol</Select.Item>
                      <Select.Item value="C2C">Cradle to Cradle (C2C)</Select.Item>
                      <Select.Item value="None">None</Select.Item>
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
            Detailed breakdown of emissions for {openStage} stage
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
                    <TextField.Root
                      size="1"
                      value={currentCostDetails?.emissions?.toString() || ''}
                      onChange={(e) => setCurrentCostDetails({
                        ...currentCostDetails,
                        emissions: parseFloat(e.target.value) || 0,
                        ...calculateCarbonCost(parseFloat(e.target.value) || 0)
                      })}
                    />
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
