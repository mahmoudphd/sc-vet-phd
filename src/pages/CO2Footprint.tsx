import { useState, useMemo } from 'react';
import {
  Box, Button, Card, Flex, Grid, Heading, Table, Text, TextField, Switch,
  Dialog, ScrollArea, Badge, Strong, Separator, Select
} from '@radix-ui/themes';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';

// Constants
const CARBON_PRICE_USD_PER_TON = 50;
const EXCHANGE_RATE = 50;
const KG_TO_TON = 0.001;

interface ProcessItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  emissionFactor: number;
  category?: string;
  type?: string;
  material?: string;
  reference?: string;
}

interface ProcessResult {
  emissionsKg: number;
  costUSD: number;
  costEGP: number;
  calculationSteps: string[];
}

interface StageData {
  name: string;
  items: ProcessItem[];
}

interface StageResult {
  name: string;
  items: (ProcessItem & ProcessResult)[];
  totalEmissionsKg: number;
  totalCostUSD: number;
  totalCostEGP: number;
}

const productStages: StageData[] = [
  {
    name: 'Raw Materials',
    items: [
      { id: 'rm-1', name: 'Vitamin B1', quantity: 0.0010, unit: 'kg', emissionFactor: 85, category: 'Vitamin', reference: 'IPCC 2023' },
      { id: 'rm-2', name: 'Vitamin B2', quantity: 0.0060, unit: 'kg', emissionFactor: 92, category: 'Vitamin', reference: 'Ecoinvent 3.8' },
      { id: 'rm-3', name: 'Vitamin B12', quantity: 0.0010, unit: 'kg', emissionFactor: 120, category: 'Vitamin', reference: 'Agri-footprint 5.0' },
      { id: 'rm-4', name: 'Nicotinamide (B3)', quantity: 0.0100, unit: 'kg', emissionFactor: 78, category: 'Vitamin', reference: 'US LCI Database' },
      { id: 'rm-5', name: 'Pantothenic Acid', quantity: 0.0040, unit: 'kg', emissionFactor: 65, category: 'Vitamin', reference: 'DEFRA 2022' },
      { id: 'rm-6', name: 'Vitamin B6', quantity: 0.0015, unit: 'kg', emissionFactor: 88, category: 'Vitamin', reference: 'IPCC 2023' },
      { id: 'rm-7', name: 'Leucine', quantity: 0.0300, unit: 'kg', emissionFactor: 42, category: 'Amino Acid', reference: 'FAO STAT 2023' },
      { id: 'rm-8', name: 'Threonine', quantity: 0.0100, unit: 'kg', emissionFactor: 38, category: 'Amino Acid', reference: 'FAO STAT 2023' },
      { id: 'rm-9', name: 'Taurine', quantity: 0.0025, unit: 'kg', emissionFactor: 55, category: 'Amino Acid', reference: 'LCA Food DK' },
      { id: 'rm-10', name: 'Glycine', quantity: 0.0025, unit: 'kg', emissionFactor: 32, category: 'Amino Acid', reference: 'EPD International' },
      { id: 'rm-11', name: 'Arginine', quantity: 0.0025, unit: 'kg', emissionFactor: 48, category: 'Amino Acid', reference: 'Agri-footprint 5.0' },
      { id: 'rm-12', name: 'Cynarine', quantity: 0.0025, unit: 'kg', emissionFactor: 115, category: 'Plant Extract', reference: 'USDA LCA Commons' },
      { id: 'rm-13', name: 'Silymarin', quantity: 0.0250, unit: 'kg', emissionFactor: 105, category: 'Plant Extract', reference: 'Egyptian LCA 2024' },
      { id: 'rm-14', name: 'Sorbitol', quantity: 0.0100, unit: 'kg', emissionFactor: 22, category: 'Sweetener', reference: 'EU PEF Guide' },
      { id: 'rm-15', name: 'Carnitine', quantity: 0.0050, unit: 'kg', emissionFactor: 95, category: 'Supplement', reference: 'World Food LCA' },
      { id: 'rm-16', name: 'Betaine', quantity: 0.0200, unit: 'kg', emissionFactor: 28, category: 'Supplement', reference: 'USDA ARS' },
      { id: 'rm-17', name: 'Tween-80', quantity: 0.0750, unit: 'kg', emissionFactor: 18, category: 'Emulsifier', reference: 'Chinese LCA Database' },
      { id: 'rm-18', name: 'Water', quantity: 0.5710, unit: 'kg', emissionFactor: 0.05, category: 'Solvent', reference: 'Water Footprint' }
    ]
  },
  {
    name: 'Manufacturing',
    items: [
      { id: 'mfg-1', name: 'Water Mixing', quantity: 1, unit: 'kg', emissionFactor: 0.05, reference: 'Pharma LCA 2023' },
      { id: 'mfg-2', name: 'Equipment Cleaning', quantity: 3, unit: 'L', emissionFactor: 0.003, reference: 'WHO GMP 2022' },
      { id: 'mfg-3', name: 'Material Mixing', quantity: 0.5, unit: 'kWh', emissionFactor: 0.55, reference: 'CAPMAS 2023' },
      { id: 'mfg-4', name: 'Liquid Filling', quantity: 0.3, unit: 'kWh', emissionFactor: 0.55, reference: 'ISO 14044' },
      { id: 'mfg-5', name: 'Sterilization', quantity: 1.5, unit: 'kWh', emissionFactor: 0.55, reference: 'USP Sterilization' },
      { id: 'mfg-6', name: 'Primary Packaging', quantity: 0.2, unit: 'kWh', emissionFactor: 0.55, reference: 'EgyPack 2023' },
      { id: 'mfg-7', name: 'Quality Inspection', quantity: 0.3, unit: 'kWh', emissionFactor: 0.55, reference: 'FDA Guidelines' }
    ]
  },
  {
    name: 'Packaging',
    items: [
      { id: 'pkg-1', name: 'Plastic Bottle', quantity: 60, unit: 'g', emissionFactor: 3.5, material: 'HDPE', reference: 'EgyPack 2023' },
      { id: 'pkg-2', name: 'Metal Cap', quantity: 15, unit: 'g', emissionFactor: 7.0, material: 'Stainless Steel 304', reference: 'WorldSteel 2023' },
      { id: 'pkg-3', name: 'Aluminum Seal', quantity: 2, unit: 'g', emissionFactor: 9.0, material: 'Aluminum', reference: 'IPCC 2023' },
      { id: 'pkg-4', name: 'Paper Label', quantity: 5, unit: 'g', emissionFactor: 0.9, material: 'Recycled Paper', reference: 'EEAA 2023' },
      { id: 'pkg-5', name: 'Secondary Packaging', quantity: 50, unit: 'g', emissionFactor: 1.0, material: 'Corrugated Cardboard', reference: 'EgyPack 2023' },
      { id: 'pkg-6', name: 'Adhesive', quantity: 3, unit: 'g', emissionFactor: 2.5, material: 'Chemical', reference: 'CAPMAS 2023' }
    ]
  },
  {
    name: 'Transport',
    items: [
      { id: 'trn-1', name: 'Refrigerated Storage', quantity: 7, unit: 'days', emissionFactor: 0.03, type: 'Cold Storage', reference: 'Egyptian Cold Chain 2023' },
      { id: 'trn-2', name: 'Local Transport', quantity: 50, unit: 'km', emissionFactor: 0.18, type: 'Diesel Truck', reference: 'CAPMAS 2023' },
      { id: 'trn-3', name: 'Long-Distance Transport', quantity: 300, unit: 'km', emissionFactor: 0.10, type: 'Heavy Truck', reference: 'EgyLogistics 2023' }
    ]
  },
  {
    name: 'Distribution',
    items: [
      { id: 'dis-1', name: 'Warehouse Storage', quantity: 3, unit: 'days', emissionFactor: 0.01, type: 'Cold Storage', reference: 'EgyLogistics 2023' },
      { id: 'dis-2', name: 'Last-Mile Delivery', quantity: 15, unit: 'km', emissionFactor: 0.12, type: 'Light Diesel Vehicle', reference: 'Cairo Air Quality' },
      { id: 'dis-3', name: 'Retail Storage', quantity: 2, unit: 'days', emissionFactor: 0.005, type: 'Shelved Storage', reference: 'Retail LCA 2023' }
    ]
  },
  {
    name: 'Use',
    items: [
      { id: 'use-1', name: 'Consumer Transportation', quantity: 5, unit: 'km', emissionFactor: 0.2, type: 'Private Vehicle', reference: 'WB 2023' },
      { id: 'use-2', name: 'Product Refrigeration', quantity: 14, unit: 'days', emissionFactor: 0.05, type: 'Domestic Refrigerator', reference: 'UNEP 2023' },
      { id: 'use-3', name: 'Product Preparation', quantity: 0.1, unit: 'kWh', emissionFactor: 0.5, type: 'Household Energy', reference: 'Household Energy' }
    ]
  },
  {
    name: 'End of Life',
    items: [
      { id: 'eol-1', name: 'Medical Waste Incineration', quantity: 0.1, unit: 'kg', emissionFactor: 3.5, reference: 'Egyptian EPA 2023' },
      { id: 'eol-2', name: 'Recycling', quantity: 0.05, unit: 'kg', emissionFactor: -0.3, reference: 'EgyWaste 2023' },
      { id: 'eol-3', name: 'Landfill', quantity: 0.03, unit: 'kg', emissionFactor: 1.5, reference: 'Cairo Waste Authority' }
    ]
  }
];

const CarbonFootprintCalculator = () => {
  const [currency, setCurrency] = useState<'USD' | 'EGP'>('USD');
  const [selectedProduct, setSelectedProduct] = useState('Poultry Product 1');
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [detailedItem, setDetailedItem] = useState<(ProcessItem & ProcessResult) | null>(null);
  const [certifications, setCertifications] = useState<string[]>(Array(productStages.length).fill('ISO 14001'));

  const calculateProcess = (item: ProcessItem): ProcessResult => {
    const emissionsKg = item.quantity * item.emissionFactor;
    const emissionsTon = emissionsKg * KG_TO_TON;
    const costUSD = emissionsTon * CARBON_PRICE_USD_PER_TON;
    const costEGP = costUSD * EXCHANGE_RATE;

    return {
      emissionsKg,
      costUSD,
      costEGP,
      calculationSteps: [
        `Emissions: ${item.quantity} ${item.unit} × ${item.emissionFactor} kg CO₂e/${item.unit} = ${emissionsKg.toFixed(6)} kg CO₂e`,
        `Convert to tons: ${emissionsKg.toFixed(6)} kg × 0.001 = ${emissionsTon.toFixed(6)} t CO₂e`,
        `Carbon cost: ${emissionsTon.toFixed(6)} t × $${CARBON_PRICE_USD_PER_TON}/t = $${costUSD.toFixed(6)}`,
        `Convert to EGP: $${costUSD.toFixed(6)} × ${EXCHANGE_RATE} EGP/$ = ${costEGP.toFixed(2)} EGP`
      ]
    };
  };

  const results: StageResult[] = useMemo(() => {
    return productStages.map(stage => {
      const processedItems = stage.items.map(item => ({
        ...item,
        ...calculateProcess(item)
      }));

      const totalEmissionsKg = processedItems.reduce((sum, item) => sum + item.emissionsKg, 0);
      const totalCostUSD = processedItems.reduce((sum, item) => sum + item.costUSD, 0);
      const totalCostEGP = processedItems.reduce((sum, item) => sum + item.costEGP, 0);

      return {
        name: stage.name,
        items: processedItems,
        totalEmissionsKg,
        totalCostUSD,
        totalCostEGP
      };
    });
  }, []);

  const totalFootprint = useMemo(() => {
    return results.reduce((acc, stage) => ({
      emissionsKg: acc.emissionsKg + stage.totalEmissionsKg,
      costUSD: acc.costUSD + stage.totalCostUSD,
      costEGP: acc.costEGP + stage.totalCostEGP
    }), { emissionsKg: 0, costUSD: 0, costEGP: 0 });
  }, [results]);

  const emissionDataWithPercent = useMemo(() => {
    return results.map(stage => ({
      category: stage.name,
      emissions: stage.totalEmissionsKg,
      percentOfTotal: ((stage.totalEmissionsKg / totalFootprint.emissionsKg) * 100).toFixed(1),
      target: (stage.totalEmissionsKg * 0.8).toFixed(3),
      environmentalCost: stage.totalCostEGP
    }));
  }, [results, totalFootprint]);

  const handleEmissionChange = (index: number, value: string) => {
    if (mode === 'manual') {
      const newValue = parseFloat(value);
      if (!isNaN(newValue)) {
        const newData = [...emissionDataWithPercent];
        newData[index].emissions = newValue;
      }
    }
  };

  const handleCertificationChange = (index: number, value: string) => {
    const newCerts = [...certifications];
    newCerts[index] = value;
    setCertifications(newCerts);
  };

  const handleSubmit = () => {
    console.log('Submitted carbon footprint data:', {
      product: selectedProduct,
      currency,
      totalFootprint,
      stages: results,
      certifications
    });
  };

  const renderStageDetails = (stageName: string) => {
    const stage = results.find(s => s.name === stageName);
    if (!stage) return null;

    return (
      <Dialog.Content style={{ maxWidth: 900 }}>
        <Dialog.Title>{stageName} Stage Details</Dialog.Title>
        <ScrollArea type="always" scrollbars="vertical" style={{ maxHeight: '60vh' }}>
          <Table.Root variant="surface">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Process</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Quantity</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Unit</Table.ColumnHeaderCell>
                {['Transport', 'Distribution', 'Use'].includes(stageName) && <Table.ColumnHeaderCell>Type</Table.ColumnHeaderCell>}
                {stageName === 'Packaging' && <Table.ColumnHeaderCell>Material</Table.ColumnHeaderCell>}
                <Table.ColumnHeaderCell>Emission Factor</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Emissions (kg)</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Cost ({currency})</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {stage.items.map((item) => (
                <Table.Row key={item.id}>
                  <Table.Cell>{item.name}</Table.Cell>
                  <Table.Cell>{item.quantity}</Table.Cell>
                  <Table.Cell>{item.unit}</Table.Cell>
                  {['Transport', 'Distribution', 'Use'].includes(stageName) && <Table.Cell>{item.type}</Table.Cell>}
                  {stageName === 'Packaging' && <Table.Cell>{item.material}</Table.Cell>}
                  <Table.Cell>{item.emissionFactor} kg/{item.unit}</Table.Cell>
                  <Table.Cell>{item.emissionsKg.toFixed(6)}</Table.Cell>
                  <Table.Cell>
                    {currency === 'USD' ? 
                      `$${item.costUSD.toFixed(2)}` : 
                      `${item.costEGP.toFixed(2)} EGP`}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </ScrollArea>

        <Flex justify="between" mt="4">
          <Box>
            <Text><Strong>Total Emissions:</Strong> {stage.totalEmissionsKg.toFixed(3)} kg CO₂e</Text>
            <Text><Strong>Environmental Cost:</Strong> {
              currency === 'USD' ? 
                `$${stage.totalCostUSD.toFixed(2)}` : 
                `${stage.totalCostEGP.toFixed(2)} EGP`
            }</Text>
          </Box>
          <Dialog.Close>
            <Button variant="soft">Close</Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    );
  };

  return (
    <Box p="4">
      <Flex justify="between" align="center" mb="4">
        <Heading size="6">Veterinary Product Carbon Footprint</Heading>
        <Flex gap="3" align="center">
          <Box>
            <Text size="1">Calculation Mode</Text>
            <Switch 
              checked={mode === 'auto'} 
              onCheckedChange={(val) => setMode(val ? 'auto' : 'manual')} 
            />
          </Box>
          <Box style={{ width: 180 }}>
            <Select.Root value={selectedProduct} onValueChange={setSelectedProduct}>
              <Select.Trigger />
              <Select.Content>
                <Select.Item value="Poultry Product 1">Poultry Product 1</Select.Item>
                <Select.Item value="Poultry Product 2">Poultry Product 2</Select.Item>
                <Select.Item value="Dairy Product">Dairy Product</Select.Item>
              </Select.Content>
            </Select.Root>
          </Box>
          <Box style={{ width: 100 }}>
            <Select.Root value={currency} onValueChange={(val) => setCurrency(val as 'USD' | 'EGP')}>
              <Select.Trigger />
              <Select.Content>
                <Select.Item value="USD">USD</Select.Item>
                <Select.Item value="EGP">EGP</Select.Item>
              </Select.Content>
            </Select.Root>
          </Box>
        </Flex>
      </Flex>

      <Flex gap="2" mb="4">
        <Badge color="green">Carbon Price: ${CARBON_PRICE_USD_PER_TON}/t CO₂e</Badge>
        <Badge color="blue">Exchange Rate: 1 USD = {EXCHANGE_RATE} EGP</Badge>
      </Flex>

      <Grid columns="4" gap="4" mb="5">
        <Card>
          <Flex direction="column" gap="1" p="4">
            <Text size="2"><Strong>Total Emissions</Strong></Text>
            <Heading size="7">{totalFootprint.emissionsKg.toFixed(3)} kg CO₂e</Heading>
            <Text size="1" color="green">↓ 12% YoY</Text>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1" p="4">
            <Text size="2"><Strong>Carbon Cost</Strong></Text>
            <Heading size="7">
              {currency === 'USD' ? 
                `$${totalFootprint.costUSD.toFixed(2)}` : 
                `${totalFootprint.costEGP.toFixed(2)} EGP`}
            </Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1" p="4">
            <Text size="2"><Strong>Carbon Intensity</Strong></Text>
            <Heading size="7">
              {(totalFootprint.emissionsKg / 1000).toFixed(3)} t/{currency === 'USD' ? '$K' : 'EGP K'}
            </Heading>
            <Text size="1">Scope 1, 2 & 3</Text>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1" p="4">
            <Text size="2"><Strong>Reduction Potential</Strong></Text>
            <Heading size="7">{(totalFootprint.emissionsKg * 0.2).toFixed(1)} kg CO₂e</Heading>
            <Text size="1" color="gray">20% reduction target</Text>
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
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {emissionDataWithPercent.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={["#3b82f6","#10b981","#f59e0b","#ef4444","#6366f1","#22c55e","#a855f7"][index % 7]}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${value.toFixed(3)} kg CO₂e`, 'Emissions']}
                  labelFormatter={(label) => `Stage: ${label}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Card>

        <Card>
          <Heading size="4" mb="3">Stage Comparison</Heading>
          <Box height="250">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={emissionDataWithPercent}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [`${value} kg CO₂e`, 'Emissions']}
                  labelFormatter={(label) => `Stage: ${label}`}
                />
                <Bar dataKey="emissions" fill="#3b82f6" name="Emissions" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Card>
      </Grid>

      <Box mb="4">
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Lifecycle Stage</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Emissions (kg CO₂e)</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Cost ({currency})</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>% of Total</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Target (kg CO₂e)</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Certification</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {emissionDataWithPercent.map((item, i) => (
              <Table.Row key={i}>
                <Table.Cell>
                  <Button 
                    variant="ghost" 
                    onClick={() => setSelectedStage(item.category)}
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
                    <Text weight="bold">{Number(item.emissions).toFixed(3)}</Text>
                  )}
                </Table.Cell>
                <Table.Cell>
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      const stage = results.find(s => s.name === item.category);
                      if (stage) {
                        setDetailedItem({
                          ...stage.items[0],
                          ...calculateProcess(stage.items[0])
                        });
                      }
                    }}
                    style={{ padding: 0, fontWeight: 'bold' }}
                  >
                    {currency === 'USD' ? 
                      `$${results.find(s => s.name === item.category)?.totalCostUSD.toFixed(2)}` : 
                      `${results.find(s => s.name === item.category)?.totalCostEGP.toFixed(2)} EGP`}
                  </Button>
                </Table.Cell>
                <Table.Cell>{item.percentOfTotal}%</Table.Cell>
                <Table.Cell>{item.target}</Table.Cell>
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
              <Table.RowHeaderCell>Total</Table.RowHeaderCell>
              <Table.Cell>
                <Strong>{totalFootprint.emissionsKg.toFixed(3)}</Strong>
              </Table.Cell>
              <Table.Cell>
                <Strong>
                  {currency === 'USD' ? 
                    `$${totalFootprint.costUSD.toFixed(2)}` : 
                    `${totalFootprint.costEGP.toFixed(2)} EGP`}
                </Strong>
              </Table.Cell>
              <Table.Cell>100%</Table.Cell>
              <Table.Cell>{(totalFootprint.emissionsKg * 0.8).toFixed(3)}</Table.Cell>
              <Table.Cell />
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </Box>

      <Flex justify="between" align="center" mt="4">
        <Text size="1" color="gray">
          Last updated: {new Date().toLocaleDateString()}
        </Text>
        <Button variant="solid" color="green" onClick={handleSubmit}>
          Submit Carbon Report
        </Button>
      </Flex>

      {/* Stage Details Dialog */}
      <Dialog.Root open={!!selectedStage} onOpenChange={(open) => !open && setSelectedStage(null)}>
        {selectedStage && renderStageDetails(selectedStage)}
      </Dialog.Root>

      {/* Calculation Details Dialog */}
      <Dialog.Root open={!!detailedItem} onOpenChange={(open) => !open && setDetailedItem(null)}>
        {detailedItem && (
          <Dialog.Content style={{ maxWidth: 600 }}>
            <Dialog.Title>{detailedItem.name} Calculation</Dialog.Title>
            <Flex direction="column" gap="2">
              {detailedItem.calculationSteps.map((step, i) => (
                <Text key={i} as="div" size="2">
                  {step}
                </Text>
              ))}
            </Flex>
            <Separator my="4" />
            <Flex justify="between" align="center">
              <Text size="2" color="gray">
                Reference: {detailedItem.reference || 'Not specified'}
              </Text>
              <Dialog.Close>
                <Button variant="soft">Close</Button>
              </Dialog.Close>
            </Flex>
          </Dialog.Content>
        )}
      </Dialog.Root>
    </Box>
  );
};

export default CarbonFootprintCalculator;
