import { useState, useMemo } from 'react';
import {
  Box, Button, Card, Flex, Grid, Heading, Progress, Select, Table, Text, TextField, Switch,
  Dialog
} from '@radix-ui/themes';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';

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

const CO2Footprint = () => {
  const [currency, setCurrency] = useState<'USD' | 'EGP'>('USD');
  const [selectedProduct, setSelectedProduct] = useState('Poultry Product 1');
  const [certifications, setCertifications] = useState<string[]>(Array(7).fill('ISO 14001'));
  const [mode, setMode] = useState<'manual' | 'auto'>('auto');
  const [openStage, setOpenStage] = useState<string | null>(null);
  const [currentStageData, setCurrentStageData] = useState<any[]>([]);

  // Constants for environmental cost calculation
  const CARBON_PRICE_USD = 50; // $ per ton
  const EXCHANGE_RATE = 50; // EGP per USD (updated from 30.90)
  const KG_TO_TON = 0.001; // kg to ton conversion

  const calculateEnvironmentalCost = (emissionsKg) => {
    const emissionsTon = emissionsKg * KG_TO_TON;
    const costUSD = emissionsTon * CARBON_PRICE_USD;
    const costEGP = costUSD * EXCHANGE_RATE;
    return costEGP.toFixed(2);
  };

  const showCalculationDetails = (item) => {
    let calculation = '';
    let itemName = '';
    let quantity = '';
    
    if (item.material) {
      calculation = `${item.quantity} kg × ${item.emissionFactor} kg CO₂e/kg = ${item.emissions} kg CO₂e`;
      itemName = item.material;
      quantity = `${item.quantity} kg`;
    } else if (item.process) {
      calculation = `${item.quantity} ${item.unit} × ${item.emissionFactor} kg CO₂e/${item.unit} = ${item.emissions} kg CO₂e`;
      itemName = item.process;
      quantity = `${item.quantity} ${item.unit}`;
    } else if (item.component) {
      calculation = `${item.quantity} ${item.unit} × ${item.emissionFactor} kg CO₂e/${item.unit} = ${item.emissions} kg CO₂e`;
      itemName = item.component;
      quantity = `${item.quantity} ${item.unit}`;
    } else if (item.type) {
      calculation = `${item.distance || item.duration} ${item.unit} × ${item.emissionFactor} kg CO₂e/${item.unit} = ${item.emissions} kg CO₂e`;
      itemName = item.type;
      quantity = `${item.distance || item.duration} ${item.unit}`;
    } else if (item.activity) {
      calculation = `${item.distance || item.duration} ${item.unit} × ${item.emissionFactor} kg CO₂e/${item.unit} = ${item.emissions} kg CO₂e`;
      itemName = item.activity;
      quantity = `${item.distance || item.duration} ${item.unit}`;
    } else if (item.aspect) {
      calculation = `${item.quantity || item.distance || item.duration} ${item.unit} × ${item.emissionFactor} kg CO₂e/${item.unit} = ${item.emissions} kg CO₂e`;
      itemName = item.aspect;
      quantity = `${item.quantity || item.distance || item.duration} ${item.unit}`;
    } else if (item.method) {
      calculation = `${item.quantity} ${item.unit} × ${item.emissionFactor} kg CO₂e/${item.unit} = ${item.emissions} kg CO₂e`;
      itemName = item.method;
      quantity = `${item.quantity} ${item.unit}`;
    }

    const cost = calculateEnvironmentalCost(item.emissions);
    alert(
      `تفاصيل حساب ${itemName}:\n\n` +
      `الكمية: ${quantity}\n` +
      `معامل الانبعاث: ${item.emissionFactor} kg CO₂e/${item.unit || 'kg'}\n` +
      `الانبعاثات: ${item.emissions} kg CO₂e\n\n` +
      `طريقة الحساب:\n${calculation}\n\n` +
      `التكلفة البيئية:\n` +
      `${item.emissions} kg × (${CARBON_PRICE_USD} دولار/طن × ${EXCHANGE_RATE} جنيه/دولار × 0.001 طن/كجم) = ${cost} جنيه مصري`
    );
  };

  const defaultManualData = [
    { 
      category: 'Raw Materials', 
      emissions: stageData['Raw Materials'].reduce((sum, item) => sum + item.emissions, 0) 
    },
    { 
      category: 'Manufacturing', 
      emissions: stageData['Manufacturing'].reduce((sum, item) => sum + item.emissions, 0) 
    },
    { 
      category: 'Packaging', 
      emissions: stageData['Packaging'].reduce((sum, item) => sum + item.emissions, 0) 
    },
    { 
      category: 'Transport', 
      emissions: stageData['Transport'].reduce((sum, item) => sum + item.emissions, 0) 
    },
    { 
      category: 'Distribution', 
      emissions: stageData['Distribution'].reduce((sum, item) => sum + item.emissions, 0) 
    },
    { 
      category: 'Use', 
      emissions: stageData['Use'].reduce((sum, item) => sum + item.emissions, 0) 
    },
    { 
      category: 'End of Life', 
      emissions: stageData['End of Life'].reduce((sum, item) => sum + item.emissions, 0) 
    }
  ];

  const [emissionData, setEmissionData] = useState(defaultManualData);

  const handleStageClick = (stage: string) => {
    setCurrentStageData(stageData[stage as keyof typeof stageData]);
    setOpenStage(stage);
  };

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

  const renderStageDetails = () => {
    if (!openStage) return null;

    return (
      <Dialog.Content style={{ maxWidth: 800, maxHeight: '90vh' }}>
        <Dialog.Title>{openStage} Detailed Emissions</Dialog.Title>
        <Dialog.Description mb="4">
          Detailed breakdown of emissions for {openStage} stage
        </Dialog.Description>
        
        <Box style={{ overflowY: 'auto', maxHeight: '70vh' }}>
          <Table.Root variant="surface">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Item</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Quantity</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Unit</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Emission Factor (kg CO₂e/unit)</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Emissions (kg CO₂e)</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Environmental Cost (EGP)</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {currentStageData.map((item, index) => (
                <Table.Row 
                  key={index} 
                  onClick={() => showCalculationDetails(item)}
                  style={{ cursor: 'pointer' }}
                >
                  <Table.Cell>
                    {item.material || item.process || item.component || 
                     item.type || item.activity || item.aspect || item.method}
                  </Table.Cell>
                  <Table.Cell>
                    {item.quantity?.toFixed(4) || item.distance || item.duration}
                  </Table.Cell>
                  <Table.Cell>{item.unit || 'kg'}</Table.Cell>
                  <Table.Cell>{item.emissionFactor}</Table.Cell>
                  <Table.Cell>{item.emissions.toFixed(3)}</Table.Cell>
                  <Table.Cell>{calculateEnvironmentalCost(item.emissions)}</Table.Cell>
                </Table.Row>
              ))}
              <Table.Row style={{ backgroundColor: 'var(--accent-a3)' }}>
                <Table.RowHeaderCell colSpan={5}><strong>Total</strong></Table.RowHeaderCell>
                <Table.Cell>
                  <strong>
                    {currentStageData.reduce((sum, item) => sum + item.emissions, 0).toFixed(3)}
                  </strong>
                </Table.Cell>
                <Table.Cell>
                  <strong>
                    {calculateEnvironmentalCost(
                      currentStageData.reduce((sum, item) => sum + item.emissions, 0)
                    )}
                  </strong>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Root>
        </Box>

        <Flex mt="4" justify="end">
          <Button variant="soft" onClick={() => setOpenStage(null)}>
            Close Details
          </Button>
        </Flex>
      </Dialog.Content>
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
                <Select.Item value="Dairy Product">Dairy Product</Select.Item>
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
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {emissionDataWithPercent.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={["#3b82f6","#10b981","#f59e0b","#ef4444","#6366f1","#22c55e","#a855f7"][index % 7]}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value} tCO₂e`, 'Emissions']}
                  labelFormatter={(label) => `Category: ${label}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Card>

        <Card>
          <Heading size="4" mb="3">Reduction Initiatives</Heading>
          <Box height="250">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={reductionData} 
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                layout="vertical"
              >
                <XAxis type="number" />
                <YAxis dataKey="initiative" type="category" width={100} />
                <Tooltip 
                  formatter={(value) => [`${value} tCO₂e`, 'Reduction']}
                  labelFormatter={(label) => `Initiative: ${label}`}
                />
                <Bar dataKey="reduction" fill="#10b981" name="Emission Reduction" />
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
              <Table.ColumnHeaderCell><strong>Emissions (tCO₂e)</strong></Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell><strong>% of Total</strong></Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell><strong>Target (tCO₂e)</strong></Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell><strong>Certification</strong></Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {emissionDataWithPercent.map((item, i) => (
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
                    <Flex align="center" gap="2">
                      <TextField.Root
                        size="1"
                        value={item.emissions.toString()}
                        onChange={(e) => handleEmissionChange(i, e.target.value)}
                        style={{ maxWidth: 80 }}
                      />
                    </Flex>
                  ) : (
                    <Text weight="bold">{item.emissions.toFixed(2)}</Text>
                  )}
                </Table.Cell>
                <Table.Cell><strong>{item.percentOfTotal}%</strong></Table.Cell>
                <Table.Cell><strong>{item.target}</strong></Table.Cell>
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
                      <Select.Item value="None">None</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </Table.Cell>
              </Table.Row>
            ))}
            <Table.Row style={{ backgroundColor: 'var(--accent-a3)' }}>
              <Table.RowHeaderCell><strong>Total</strong></Table.RowHeaderCell>
              <Table.Cell><strong>{totalEmissions.toFixed(2)}</strong></Table.Cell>
              <Table.Cell><strong>100%</strong></Table.Cell>
              <Table.Cell><strong>{(totalEmissions * 0.8).toFixed(2)}</strong></Table.Cell>
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
        {renderStageDetails()}
      </Dialog.Root>
    </Box>
  );
};

export default CO2Footprint;
