import { useState, useMemo, useEffect } from 'react';
import {
  Box, Button, Card, Flex, Grid, Heading, Select, Table, Text, TextField,
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

// Define interfaces for our data structures
interface RawMaterial {
  material: string;
  quantity: number;
  emissionFactor: number;
  emissions: number;
}

interface ManufacturingProcess {
  process: string;
  quantity: number;
  unit: string;
  emissionFactor: number;
  emissions: number;
}

interface PackagingComponent {
  component: string;
  quantity: number;
  unit: string;
  material: string;
  emissionFactor: number;
  emissions: number;
}

interface TransportActivity {
  type: string;
  distance?: number;
  duration?: number;
  unit: string;
  emissionFactor: number;
  emissions: number;
}

interface DistributionActivity {
  activity: string;
  distance?: number;
  duration?: number;
  unit: string;
  emissionFactor: number;
  emissions: number;
}

interface UseAspect {
  aspect: string;
  distance?: number;
  duration?: number;
  quantity?: number;
  unit: string;
  emissionFactor: number;
  emissions: number;
}

interface EndOfLifeMethod {
  method: string;
  quantity: number;
  unit: string;
  emissionFactor: number;
  emissions: number;
}

// Define the stage data with index signature
interface StageData {
  [key: string]: any[];
  'Raw Materials': RawMaterial[];
  'Manufacturing': ManufacturingProcess[];
  'Packaging': PackagingComponent[];
  'Transport': TransportActivity[];
  'Distribution': DistributionActivity[];
  'Use': UseAspect[];
  'End of Life': EndOfLifeMethod[];
}

// Original data structure with corrected calculations
const stageData: StageData = {
  'Raw Materials': [
    { material: 'Vitamin B1', quantity: 0.001, emissionFactor: 85, emissions: 0.001 * 85 },
    { material: 'Vitamin B2', quantity: 0.006, emissionFactor: 92, emissions: 0.006 * 92 },
    { material: 'Vitamin B12', quantity: 0.001, emissionFactor: 120, emissions: 0.001 * 120 },
    { material: 'Nicotinamide (B3)', quantity: 0.01, emissionFactor: 78, emissions: 0.01 * 78 },
    { material: 'Pantothenic Acid', quantity: 0.004, emissionFactor: 65, emissions: 0.004 * 65 },
    { material: 'Vitamin B6', quantity: 0.0015, emissionFactor: 88, emissions: 0.0015 * 88 },
    { material: 'Leucine', quantity: 0.03, emissionFactor: 42, emissions: 0.03 * 42 },
    { material: 'Threonine', quantity: 0.01, emissionFactor: 38, emissions: 0.01 * 38 },
    { material: 'Taurine', quantity: 0.0025, emissionFactor: 55, emissions: 0.0025 * 55 },
    { material: 'Glycine', quantity: 0.0025, emissionFactor: 32, emissions: 0.0025 * 32 },
    { material: 'Arginine', quantity: 0.0025, emissionFactor: 48, emissions: 0.0025 * 48 },
    { material: 'Cynarine', quantity: 0.0025, emissionFactor: 115, emissions: 0.0025 * 115 },
    { material: 'Silymarin', quantity: 0.025, emissionFactor: 105, emissions: 0.025 * 105 },
    { material: 'Sorbitol', quantity: 0.01, emissionFactor: 22, emissions: 0.01 * 22 },
    { material: 'Carnitine', quantity: 0.005, emissionFactor: 95, emissions: 0.005 * 95 },
    { material: 'Betaine', quantity: 0.02, emissionFactor: 28, emissions: 0.02 * 28 },
    { material: 'Tween-80', quantity: 0.075, emissionFactor: 18, emissions: 0.075 * 18 },
    { material: 'Water', quantity: 0.571, emissionFactor: 0.05, emissions: 0.571 * 0.05 },
  ],
  'Manufacturing': [
    { process: 'Water Mixing', quantity: 1, unit: 'kg', emissionFactor: 0.05, emissions: 1 * 0.05 },
    { process: 'Equipment Cleaning', quantity: 3, unit: 'L', emissionFactor: 0.003, emissions: 3 * 0.003 },
    { process: 'Material Mixing', quantity: 0.5, unit: 'kWh', emissionFactor: 0.55, emissions: 0.5 * 0.55 },
    { process: 'Liquid Filling', quantity: 0.3, unit: 'kWh', emissionFactor: 0.55, emissions: 0.3 * 0.55 },
    { process: 'Sterilization', quantity: 1.5, unit: 'kWh', emissionFactor: 0.55, emissions: 1.5 * 0.55 },
    { process: 'Primary Packaging', quantity: 0.2, unit: 'kWh', emissionFactor: 0.55, emissions: 0.2 * 0.55 },
    { process: 'Quality Inspection', quantity: 0.3, unit: 'kWh', emissionFactor: 0.55, emissions: 0.3 * 0.55 },
  ],
  'Packaging': [
    { component: 'Plastic Bottle', quantity: 60.6, unit: 'g', material: 'HDPE', emissionFactor: 3.5, emissions: 60.6 * 3.5 / 1000 },
    { component: 'Metal Cap', quantity: 14.1, unit: 'g', material: 'Stainless Steel 304', emissionFactor: 7.0, emissions: 14.1 * 7.0 / 1000 },
    { component: 'Aluminum Seal', quantity: 2.1, unit: 'g', material: 'Aluminum', emissionFactor: 9.0, emissions: 2.1 * 9.0 / 1000 },
    { component: 'Paper Label', quantity: 4.9, unit: 'g', material: 'Recycled Paper', emissionFactor: 0.9, emissions: 4.9 * 0.9 / 1000 },
    { component: 'Secondary Packaging', quantity: 53.3, unit: 'g', material: 'Corrugated Cardboard', emissionFactor: 1.0, emissions: 53.3 * 1.0 / 1000 },
    { component: 'Adhesive', quantity: 3.0, unit: 'g', material: 'Chemical', emissionFactor: 2.5, emissions: 3.0 * 2.5 / 1000 },
  ],
  'Transport': [
    { type: 'Refrigerated Storage', duration: 7, unit: 'days', emissionFactor: 0.03, emissions: 7 * 0.03 },
    { type: 'Local Transport', distance: 50, unit: 'km', emissionFactor: 0.18, emissions: 50 * 0.18 },
    { type: 'Long-Distance Transport', distance: 300, unit: 'km', emissionFactor: 0.10, emissions: 300 * 0.10 },
  ],
  'Distribution': [
    { activity: 'Warehouse Storage', duration: 3, unit: 'days', emissionFactor: 0.01, emissions: 3 * 0.01 },
    { activity: 'Last-Mile Delivery', distance: 15, unit: 'km', emissionFactor: 0.12, emissions: 15 * 0.12 },
    { activity: 'Retail Storage', duration: 2, unit: 'days', emissionFactor: 0.005, emissions: 2 * 0.005 },
  ],
  'Use': [
    { aspect: 'Consumer Transportation', distance: 5, unit: 'km', emissionFactor: 0.2, emissions: 5 * 0.2 },
    { aspect: 'Product Refrigeration', duration: 14, unit: 'days', emissionFactor: 0.05, emissions: 14 * 0.05 },
    { aspect: 'Product Preparation', quantity: 0.1, unit: 'kWh', emissionFactor: 0.5, emissions: 0.1 * 0.5 },
  ],
  'End of Life': [
    { method: 'Medical Waste Incineration', quantity: 0.1, unit: 'kg', emissionFactor: 3.5, emissions: 0.1 * 3.5 },
    { method: 'Recycling', quantity: 0.05, unit: 'kg', emissionFactor: -0.3, emissions: 0.05 * -0.3 },
    { method: 'Landfill', quantity: 0.03, unit: 'kg', emissionFactor: 1.5, emissions: 0.03 * 1.5 },
  ],
};

// Carbon cost calculation function
const calculateCarbonCost = (emissionsKg: number) => {
  const validEmissions = isNaN(emissionsKg) || !isFinite(emissionsKg) ? 0 : emissionsKg;
  
  const emissionsTon = validEmissions / KG_PER_TON;
  const costUSD = emissionsTon * CARBON_PRICE_PER_TON;
  const costEGP = costUSD * EXCHANGE_RATE;
  
  return {
    costEGP: parseFloat(costEGP.toFixed(2)),
    costUSD: parseFloat(costUSD.toFixed(2)),
    calculation: `${validEmissions.toFixed(2)} kg = ${emissionsTon.toFixed(4)} t × $${CARBON_PRICE_PER_TON}/t = $${costUSD.toFixed(2)}`,
    calculationEGP: `$${costUSD.toFixed(2)} × ${EXCHANGE_RATE} = EGP ${costEGP.toFixed(2)}`
  };
};

interface EmissionDataItem {
  category: string;
  emissions: number;
  costEGP: number;
  costUSD: number;
  calculation: string;
  calculationEGP: string;
}

const CO2Footprint = () => {
  // State management
  const [currency, setCurrency] = useState<'USD' | 'EGP'>('USD');
  const [selectedProduct, setSelectedProduct] = useState('Poultry Drug A');
  const [certifications, setCertifications] = useState<string[]>(Array(7).fill('ISO 14001'));
  const [mode, setMode] = useState<'manual' | 'auto' | 'iot'>('iot');
  const [openStage, setOpenStage] = useState<string | null>(null);
  const [currentStageData, setCurrentStageData] = useState<any[]>([]);
  const [costDetailsOpen, setCostDetailsOpen] = useState(false);
  const [currentCostDetails, setCurrentCostDetails] = useState<any>(null);
  const [iotData, setIotData] = useState<StageData>(stageData);

  // Set browser tab title
  useEffect(() => {
    document.title = "Sustainability Dashboard";
  }, []);

  // Initialize data with calculated carbon costs
  const getEmissionData = (): EmissionDataItem[] => {
    const sourceData = mode === 'iot' ? iotData : stageData;
    
    const calculateEmissions = (items: any[]): number => {
      return parseFloat(items.reduce((sum: number, item: any) => {
        const emissions = isNaN(item.emissions) || !isFinite(item.emissions) ? 0 : item.emissions;
        return sum + emissions;
      }, 0).toFixed(3));
    };
    
    return [
      { 
        category: 'Raw Materials', 
        emissions: calculateEmissions(sourceData['Raw Materials']),
        ...calculateCarbonCost(calculateEmissions(sourceData['Raw Materials']))
      },
      { 
        category: 'Manufacturing', 
        emissions: calculateEmissions(sourceData['Manufacturing']),
        ...calculateCarbonCost(calculateEmissions(sourceData['Manufacturing']))
      },
      { 
        category: 'Packaging', 
        emissions: calculateEmissions(sourceData['Packaging']),
        ...calculateCarbonCost(calculateEmissions(sourceData['Packaging']))
      },
      { 
        category: 'Transport', 
        emissions: calculateEmissions(sourceData['Transport']),
        ...calculateCarbonCost(calculateEmissions(sourceData['Transport']))
      },
      { 
        category: 'Distribution', 
        emissions: calculateEmissions(sourceData['Distribution']),
        ...calculateCarbonCost(calculateEmissions(sourceData['Distribution']))
      },
      { 
        category: 'Use', 
        emissions: calculateEmissions(sourceData['Use']),
        ...calculateCarbonCost(calculateEmissions(sourceData['Use']))
      },
      { 
        category: 'End of Life', 
        emissions: calculateEmissions(sourceData['End of Life']),
        ...calculateCarbonCost(calculateEmissions(sourceData['End of Life']))
      }
    ];
  };

  const [emissionData, setEmissionData] = useState<EmissionDataItem[]>(getEmissionData());

  // Simulate IoT data updates with minimal variations
  useEffect(() => {
    if (mode === 'iot') {
      const interval = setInterval(() => {
        const updatedData = {...iotData};
        
        // Simulate IoT data changes with very small variations (1-2%)
        Object.keys(updatedData).forEach((stage: string) => {
          updatedData[stage] = updatedData[stage].map((item: any) => {
            const randomFactor = 0.99 + Math.random() * 0.02; // Random factor between 0.99 and 1.01 (1% variation)
            
            let newQuantity, newDistance, newDuration;
            
            if (stage === 'Transport' || stage === 'Distribution' || stage === 'Use') {
              // For transport, distribution, and use stages, update distance/duration/quantity with minimal variation
              if (item.distance !== undefined) {
                newDistance = (item.distance || 0) * randomFactor;
                newDuration = item.duration; // Keep duration unchanged
                newQuantity = item.quantity; // Keep quantity unchanged
              } else if (item.duration !== undefined) {
                newDuration = (item.duration || 0) * randomFactor;
                newDistance = item.distance; // Keep distance unchanged
                newQuantity = item.quantity; // Keep quantity unchanged
              } else if (item.quantity !== undefined) {
                newQuantity = (item.quantity || 0) * randomFactor;
                newDistance = item.distance; // Keep distance unchanged
                newDuration = item.duration; // Keep duration unchanged
              } else {
                newQuantity = (item.quantity || 0) * randomFactor;
              }
            } else {
              newQuantity = (item.quantity || 0) * randomFactor;
            }
            
            // Calculate emissions correctly based on unit and type
            let newEmissions;
            if (stage === 'Packaging') {
              // For packaging, we need to divide by 1000 to convert from grams to kg
              newEmissions = newQuantity * (item.emissionFactor || 0) / 1000;
            } else if (stage === 'Transport' || stage === 'Distribution' || stage === 'Use') {
              if (newDistance !== undefined) {
                newEmissions = newDistance * (item.emissionFactor || 0);
              } else if (newDuration !== undefined) {
                newEmissions = newDuration * (item.emissionFactor || 0);
              } else if (newQuantity !== undefined) {
                newEmissions = newQuantity * (item.emissionFactor || 0);
              } else {
                newEmissions = item.emissions;
              }
            } else {
              newEmissions = newQuantity * (item.emissionFactor || 0);
            }
            
            return {
              ...item,
              quantity: newQuantity !== undefined ? parseFloat(newQuantity.toFixed(4)) : item.quantity,
              distance: newDistance !== undefined ? parseFloat(newDistance.toFixed(4)) : item.distance,
              duration: newDuration !== undefined ? parseFloat(newDuration.toFixed(4)) : item.duration,
              emissions: parseFloat(newEmissions.toFixed(3))
            };
          });
        });
        
        setIotData(updatedData);
      }, 3000); // Update every 3 seconds

      return () => clearInterval(interval);
    }
  }, [mode, iotData]);

  // Update emission data when mode or iotData changes
  useEffect(() => {
    setEmissionData(getEmissionData());
  }, [mode, iotData]);

  const handleStageClick = (stage: string) => {
    const sourceData = mode === 'iot' ? iotData : stageData;
    setCurrentStageData(sourceData[stage]);
    setOpenStage(stage);
  };

  const showCostDetails = (item: EmissionDataItem) => {
    const emissionsKg = isNaN(item.emissions) || !isFinite(item.emissions) ? 0 : item.emissions;
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

  const handleEmissionFactorChange = (stage: string, index: number, value: string) => {
    const newValue = parseFloat(value);
    if (!isNaN(newValue)) {
      const updatedData = {...iotData};
      updatedData[stage][index].emissionFactor = newValue;
      
      const item = updatedData[stage][index];
      if (stage === 'Packaging') {
        item.emissions = (item.quantity || 0) * newValue / 1000;
      } else if (stage === 'Transport' || stage === 'Distribution' || stage === 'Use') {
        if (item.distance !== undefined) {
          item.emissions = (item.distance || 0) * newValue;
        } else if (item.duration !== undefined) {
          item.emissions = (item.duration || 0) * newValue;
        } else if (item.quantity !== undefined) {
          item.emissions = (item.quantity || 0) * newValue;
        }
      } else {
        item.emissions = (item.quantity || 0) * newValue;
      }
      
      setIotData(updatedData);
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

  const totalEmissions = useMemo(() => {
    const total = emissionData.reduce((sum, item) => {
      const emissions = isNaN(item.emissions) || !isFinite(item.emissions) ? 0 : item.emissions;
      return sum + emissions;
    }, 0);
    return parseFloat(total.toFixed(3));
  }, [emissionData]);

  const totalCost = useMemo(() => {
    const total = emissionData.reduce((sum, item) => {
      const cost = currency === 'EGP' ? item.costEGP : item.costUSD;
      return sum + (isNaN(cost) || !isFinite(cost) ? 0 : cost);
    }, 0);
    return parseFloat(total.toFixed(2));
  }, [emissionData, currency]);

  const revenue = currency === 'EGP' ? 55000 : 1800;
  const carbonIntensity = totalEmissions / (revenue / 1000);
  const totalReduction = reductionData.reduce((sum, item) => sum + item.reduction, 0);

  const handleSubmit = () => {
    console.log('Submitted emission data:', emissionData);
    alert('Carbon report submitted successfully!');
  };

  // Data for charts
  const pieChartData = emissionData.map(item => ({
    name: item.category,
    value: isNaN(item.emissions) || !isFinite(item.emissions) ? 0 : item.emissions,
    cost: currency === 'EGP' ? 
      (isNaN(item.costEGP) || !isFinite(item.costEGP) ? 0 : item.costEGP) : 
      (isNaN(item.costUSD) || !isFinite(item.costUSD) ? 0 : item.costUSD)
  }));

  const barChartData = reductionData;

  return (
    <Box p="6">
      <Flex justify="between" align="center" mb="5">
        <Heading size="6">Sustainability Dashboard</Heading>
        <Flex gap="3">
          <Box>
            <Text size="1">Mode</Text>
            <Select.Root value={mode} onValueChange={val => setMode(val as 'manual' | 'auto' | 'iot')}>
              <Select.Trigger style={{ width: 100 }} />
              <Select.Content>
                <Select.Item value="auto">Auto</Select.Item>
                <Select.Item value="manual">Manual</Select.Item>
                <Select.Item value="iot">IoT Mode</Select.Item>
              </Select.Content>
            </Select.Root>
          </Box>
          <Box style={{ width: 180 }}>
            <Select.Root value={selectedProduct} onValueChange={val => setSelectedProduct(val)}>
              <Select.Trigger />
              <Select.Content>
                <Select.Item value="Poultry Drug A">Poultry Drug A</Select.Item>
                <Select.Item value="Poultry Drug B">Poultry Drug B</Select.Item>
                <Select.Item value="Poultry Drug C">Poultry Drug C</Select.Item>
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

      {mode === 'iot' && (
        <Card mb="5" style={{ background: 'linear-gradient(135deg, #2c974b 0%, #1e5128 100%)', color: 'white' }}>
          <Flex p="4" align="center" gap="3">
            <Box style={{ flex: 1 }}>
              <Heading size="5">IoT Mode Active</Heading>
              <Text size="2">Real-time data collection from sensors. Quantities are automatically updated with minimal variations.</Text>
            </Box>
            <Box style={{ background: 'rgba(255, 255, 255, 0.2)', padding: '8px', borderRadius: '50%' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 2H4V4H2V2ZM4 4H6V6H4V4ZM6 6H8V8H6V6ZM8 8H10V10H8V8ZM10 10H12V12H10V10ZM12 12H14V14H12V12ZM14 14H16V16H14V14ZM16 16H18V18H16V16ZM18 18H20V20H18V18ZM20 20H22V22H20V20Z" fill="currentColor"/>
                <path d="M2 14H4V16H2V14ZM4 16H6V18H4V16ZM6 18H8V20H6V18ZM8 20H10V22H8V20Z" fill="currentColor"/>
              </svg>
            </Box>
          </Flex>
        </Card>
      )}

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
            <Heading size="7"><strong>{isNaN(carbonIntensity) || !isFinite(carbonIntensity) ? '0.0000' : carbonIntensity.toFixed(4)} kg/{currency === 'USD' ? '$' : 'EGP '}K</strong></Heading>
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
                    <Text weight="bold">{isNaN(item.emissions) ? '0.000' : item.emissions.toFixed(3)}</Text>
                  )}
                </Table.Cell>
                <Table.Cell>
                  <Button 
                    variant="ghost" 
                    onClick={() => showCostDetails(item)}
                    style={{ padding: 0 }}
                  >
                    {currency === 'EGP' 
                      ? `${isNaN(item.costEGP) ? '0.00' : item.costEGP} EGP` 
                      : `${isNaN(item.costUSD) ? '0.00' : item.costUSD} USD`}
                  </Button>
                </Table.Cell>
                <Table.Cell><strong>{isNaN(item.emissions) || totalEmissions === 0 ? '0.0' : ((item.emissions / totalEmissions) * 100).toFixed(1)}%</strong></Table.Cell>
                <Table.Cell><strong>{(isNaN(item.emissions) ? 0 : item.emissions * 0.8).toFixed(3)}</strong></Table.Cell>
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
              <Table.Cell><strong>{(totalEmissions * 0.8).toFixed(3)}</strong></Table.Cell>
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
          
          <Box style={{ overflowY: 'auto', maxHeight: '70vh' }}>
            {openStage === 'Raw Materials' && (
              <Table.Root variant="surface">
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeaderCell>Material</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Quantity (kg)</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Emission Factor (kg CO₂e/kg)</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Emissions (kg CO₂e)</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {currentStageData.map((item: RawMaterial, index: number) => (
                    <Table.Row key={index}>
                      <Table.Cell>{item.material}</Table.Cell>
                      <Table.Cell>
                        {mode === 'iot' ? (
                          <Text weight="bold">{(item.quantity || 0).toFixed(4)}</Text>
                        ) : (
                          (item.quantity || 0).toFixed(4)
                        )}
                      </Table.Cell>
                      <Table.Cell>
                        <TextField.Root
                          size="1"
                          value={(item.emissionFactor || 0).toString()}
                          onChange={(e) => handleEmissionFactorChange(openStage!, index, e.target.value)}
                          style={{ maxWidth: 100 }}
                        />
                      </Table.Cell>
                      <Table.Cell>{(isNaN(item.emissions) ? 0 : item.emissions).toFixed(3)}</Table.Cell>
                    </Table.Row>
                  ))}
                  <Table.Row style={{ backgroundColor: 'var(--accent-a3)' }}>
                    <Table.RowHeaderCell colSpan={3}><strong>Total</strong></Table.RowHeaderCell>
                    <Table.Cell>
                      <strong>
                        {currentStageData.reduce((sum: number, item: RawMaterial) => {
                          const emissions = isNaN(item.emissions) || !isFinite(item.emissions) ? 0 : item.emissions;
                          return sum + emissions;
                        }, 0).toFixed(3)}
                      </strong>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table.Root>
            )}

            {openStage === 'Manufacturing' && (
              <Table.Root variant="surface">
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeaderCell>Process</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Quantity</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Unit</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Emission Factor (kg CO₂e/unit)</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Emissions (kg CO₂e)</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {currentStageData.map((item: ManufacturingProcess, index: number) => (
                    <Table.Row key={index}>
                      <Table.Cell>{item.process}</Table.Cell>
                      <Table.Cell>
                        {mode === 'iot' ? (
                          <Text weight="bold">{(item.quantity || 0).toFixed(2)}</Text>
                        ) : (
                          item.quantity || 0
                        )}
                      </Table.Cell>
                      <Table.Cell>{item.unit}</Table.Cell>
                      <Table.Cell>
                        <TextField.Root
                          size="1"
                          value={(item.emissionFactor || 0).toString()}
                          onChange={(e) => handleEmissionFactorChange(openStage!, index, e.target.value)}
                          style={{ maxWidth: 100 }}
                        />
                      </Table.Cell>
                      <Table.Cell>{(isNaN(item.emissions) ? 0 : item.emissions).toFixed(3)}</Table.Cell>
                    </Table.Row>
                  ))}
                  <Table.Row style={{ backgroundColor: 'var(--accent-a3)' }}>
                    <Table.RowHeaderCell colSpan={4}><strong>Total</strong></Table.RowHeaderCell>
                    <Table.Cell>
                      <strong>
                        {currentStageData.reduce((sum: number, item: ManufacturingProcess) => {
                          const emissions = isNaN(item.emissions) || !isFinite(item.emissions) ? 0 : item.emissions;
                          return sum + emissions;
                        }, 0).toFixed(3)}
                      </strong>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table.Root>
            )}

            {openStage === 'Packaging' && (
              <Table.Root variant="surface">
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeaderCell>Component</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Quantity (g)</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Material</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Emission Factor (kg CO₂e/g)</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Emissions (kg CO₂e)</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {currentStageData.map((item: PackagingComponent, index: number) => (
                    <Table.Row key={index}>
                      <Table.Cell>{item.component}</Table.Cell>
                      <Table.Cell>
                        {mode === 'iot' ? (
                          <Text weight="bold">{(item.quantity || 0).toFixed(1)}</Text>
                        ) : (
                          item.quantity || 0
                        )}
                      </Table.Cell>
                      <Table.Cell>{item.material}</Table.Cell>
                      <Table.Cell>
                        <TextField.Root
                          size="1"
                          value={(item.emissionFactor || 0).toString()}
                          onChange={(e) => handleEmissionFactorChange(openStage!, index, e.target.value)}
                          style={{ maxWidth: 100 }}
                        />
                      </Table.Cell>
                      <Table.Cell>{(isNaN(item.emissions) ? 0 : item.emissions).toFixed(3)}</Table.Cell>
                    </Table.Row>
                  ))}
                  <Table.Row style={{ backgroundColor: 'var(--accent-a3)' }}>
                    <Table.RowHeaderCell colSpan={4}><strong>Total</strong></Table.RowHeaderCell>
                    <Table.Cell>
                      <strong>
                        {currentStageData.reduce((sum: number, item: PackagingComponent) => {
                          const emissions = isNaN(item.emissions) || !isFinite(item.emissions) ? 0 : item.emissions;
                          return sum + emissions;
                        }, 0).toFixed(3)}
                      </strong>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table.Root>
            )}

            {openStage === 'Transport' && (
              <Table.Root variant="surface">
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeaderCell>Type</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Distance/Duration</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Unit</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Emission Factor</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Emissions (kg CO₂e)</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {currentStageData.map((item: any, index: number) => (
                    <Table.Row key={index}>
                      <Table.Cell>{item.type}</Table.Cell>
                      <Table.Cell>
                        {mode === 'iot' ? (
                          <Text weight="bold">
                            {item.distance !== undefined ? item.distance.toFixed(1) : item.duration.toFixed(1)}
                          </Text>
                        ) : (
                          item.distance !== undefined ? item.distance : item.duration
                        )}
                      </Table.Cell>
                      <Table.Cell>{item.unit}</Table.Cell>
                      <Table.Cell>
                        <TextField.Root
                          size="1"
                          value={(item.emissionFactor || 0).toString()}
                          onChange={(e) => handleEmissionFactorChange(openStage!, index, e.target.value)}
                          style={{ maxWidth: 100 }}
                        />
                      </Table.Cell>
                      <Table.Cell>{(isNaN(item.emissions) ? 0 : item.emissions).toFixed(3)}</Table.Cell>
                    </Table.Row>
                  ))}
                  <Table.Row style={{ backgroundColor: 'var(--accent-a3)' }}>
                    <Table.RowHeaderCell colSpan={4}><strong>Total</strong></Table.RowHeaderCell>
                    <Table.Cell>
                      <strong>
                        {currentStageData.reduce((sum: number, item: any) => {
                          const emissions = isNaN(item.emissions) || !isFinite(item.emissions) ? 0 : item.emissions;
                          return sum + emissions;
                        }, 0).toFixed(3)}
                      </strong>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table.Root>
            )}

            {openStage === 'Distribution' && (
              <Table.Root variant="surface">
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeaderCell>Activity</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Distance/Duration</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Unit</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Emission Factor</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Emissions (kg CO₂e)</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {currentStageData.map((item: any, index: number) => (
                    <Table.Row key={index}>
                      <Table.Cell>{item.activity}</Table.Cell>
                      <Table.Cell>
                        {mode === 'iot' ? (
                          <Text weight="bold">
                            {item.distance !== undefined ? item.distance.toFixed(1) : item.duration.toFixed(1)}
                          </Text>
                        ) : (
                          item.distance !== undefined ? item.distance : item.duration
                        )}
                      </Table.Cell>
                      <Table.Cell>{item.unit}</Table.Cell>
                      <Table.Cell>
                        <TextField.Root
                          size="1"
                          value={(item.emissionFactor || 0).toString()}
                          onChange={(e) => handleEmissionFactorChange(openStage!, index, e.target.value)}
                          style={{ maxWidth: 100 }}
                        />
                      </Table.Cell>
                      <Table.Cell>{(isNaN(item.emissions) ? 0 : item.emissions).toFixed(3)}</Table.Cell>
                    </Table.Row>
                  ))}
                  <Table.Row style={{ backgroundColor: 'var(--accent-a3)' }}>
                    <Table.RowHeaderCell colSpan={4}><strong>Total</strong></Table.RowHeaderCell>
                    <Table.Cell>
                      <strong>
                        {currentStageData.reduce((sum: number, item: any) => {
                          const emissions = isNaN(item.emissions) || !isFinite(item.emissions)                          return sum + emissions;
                        }, 0).toFixed(3)}
                      </strong>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table.Root>
            )}

            {openStage === 'Use' && (
              <Table.Root variant="surface">
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeaderCell>Aspect</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Distance/Duration/Quantity</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Unit</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Emission Factor</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Emissions (kg CO₂e)</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {currentStageData.map((item: any, index: number) => (
                    <Table.Row key={index}>
                      <Table.Cell>{item.aspect}</Table.Cell>
                      <Table.Cell>
                        {mode === 'iot' ? (
                          <Text weight="bold">
                            {item.distance !== undefined ? item.distance.toFixed(1) : 
                             item.duration !== undefined ? item.duration.toFixed(1) : 
                             item.quantity !== undefined ? item.quantity.toFixed(3) : 0}
                          </Text>
                        ) : (
                          item.distance !== undefined ? item.distance : 
                          item.duration !== undefined ? item.duration : 
                          item.quantity !== undefined ? item.quantity : 0
                        )}
                      </Table.Cell>
                      <Table.Cell>{item.unit}</Table.Cell>
                      <Table.Cell>
                        <TextField.Root
                          size="1"
                          value={(item.emissionFactor || 0).toString()}
                          onChange={(e) => handleEmissionFactorChange(openStage!, index, e.target.value)}
                          style={{ maxWidth: 100 }}
                        />
                      </Table.Cell>
                      <Table.Cell>{(isNaN(item.emissions) ? 0 : item.emissions).toFixed(3)}</Table.Cell>
                    </Table.Row>
                  ))}
                  <Table.Row style={{ backgroundColor: 'var(--accent-a3)' }}>
                    <Table.RowHeaderCell colSpan={4}><strong>Total</strong></Table.RowHeaderCell>
                    <Table.Cell>
                      <strong>
                        {currentStageData.reduce((sum: number, item: any) => {
                          const emissions = isNaN(item.emissions) || !isFinite(item.emissions) ? 0 : item.emissions;
                          return sum + emissions;
                        }, 0).toFixed(3)}
                      </strong>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table.Root>
            )}

            {openStage === 'End of Life' && (
              <Table.Root variant="surface">
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeaderCell>Method</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Quantity</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Unit</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Emission Factor</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Emissions (kg CO₂e)</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {currentStageData.map((item: EndOfLifeMethod, index: number) => (
                    <Table.Row key={index}>
                      <Table.Cell>{item.method}</Table.Cell>
                      <Table.Cell>
                        {mode === 'iot' ? (
                          <Text weight="bold">{(item.quantity || 0).toFixed(3)}</Text>
                        ) : (
                          item.quantity || 0
                        )}
                      </Table.Cell>
                      <Table.Cell>{item.unit}</Table.Cell>
                      <Table.Cell>
                        <TextField.Root
                          size="1"
                          value={(item.emissionFactor || 0).toString()}
                          onChange={(e) => handleEmissionFactorChange(openStage!, index, e.target.value)}
                          style={{ maxWidth: 100 }}
                        />
                      </Table.Cell>
                      <Table.Cell>{(isNaN(item.emissions) ? 0 : item.emissions).toFixed(3)}</Table.Cell>
                    </Table.Row>
                  ))}
                  <Table.Row style={{ backgroundColor: 'var(--accent-a3)' }}>
                    <Table.RowHeaderCell colSpan={4}><strong>Total</strong></Table.RowHeaderCell>
                    <Table.Cell>
                      <strong>
                        {currentStageData.reduce((sum: number, item: EndOfLifeMethod) => {
                          const emissions = isNaN(item.emissions) || !isFinite(item.emissions) ? 0 : item.emissions;
                          return sum + emissions;
                        }, 0).toFixed(3)}
                      </strong>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table.Root>
            )}
          </Box>

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
                  <Table.Cell>{isNaN(currentCostDetails?.emissions) ? '0.000' : currentCostDetails?.emissions} kg CO₂e</Table.Cell>
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
                      {isNaN(currentCostDetails?.costUSD) ? '0.00' : currentCostDetails?.costUSD} USD
                    </Text>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.RowHeaderCell>Cost in EGP</Table.RowHeaderCell>
                  <Table.Cell>
                    <Text weight="bold">
                      {isNaN(currentCostDetails?.costEGP) ? '0.00' : currentCostDetails?.costEGP} EGP
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
