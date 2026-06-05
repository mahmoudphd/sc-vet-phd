import { useState, useMemo, useEffect } from 'react';
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
  Dialog,
  Badge,
  Separator,
} from '@radix-ui/themes';
import {
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
} from 'recharts';

const CARBON_PRICE_PER_TON = 50;
const EXCHANGE_RATE = 50;
const KG_PER_TON = 1000;
const BATCH_SIZE = 1000;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6B6B'];
const SCOPE_COLORS = ['#FF6B6B', '#0088FE'];

interface RawMaterial {
  material: string;
  quantity: number;
  unit: string;
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

interface StageData {
  [key: string]: any[];
  'Raw Materials': RawMaterial[];
  Manufacturing: ManufacturingProcess[];
  Packaging: PackagingComponent[];
  Transport: TransportActivity[];
  Distribution: DistributionActivity[];
  Use: UseAspect[];
  'End of Life': EndOfLifeMethod[];
}

interface EmissionDataItem {
  category: string;
  emissions: number;
  costEGP: number;
  costUSD: number;
  calculation: string;
  calculationEGP: string;
}

type CarbonCostDialogData = {
  title: string;
  subtitle?: string;
  emissions: number;
  carbonPricePerTon: number;
  carbonPricePerKg: number;
  calculationUSD: string;
  costUSD: string;
  exchangeRate: number;
  costEGP: string;
};

interface SimpleCarbonCostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: CarbonCostDialogData | null;
}

const initialStageData: StageData = {
  'Raw Materials': [
    { material: 'Vitamin B1', quantity: 0.001, unit: 'kg', emissionFactor: 50, emissions: 0.001 * 50 },
    { material: 'Vitamin B2', quantity: 0.006, unit: 'kg', emissionFactor: 70, emissions: 0.006 * 70 },
    { material: 'Vitamin B12', quantity: 0.001, unit: 'kg', emissionFactor: 110, emissions: 0.001 * 110 },
    { material: 'Nicotinamide B3', quantity: 0.01, unit: 'kg', emissionFactor: 70, emissions: 0.01 * 70 },
    { material: 'Pantothenic Acid', quantity: 0.004, unit: 'kg', emissionFactor: 65, emissions: 0.004 * 65 },
    { material: 'Vitamin B6', quantity: 0.0015, unit: 'kg', emissionFactor: 80, emissions: 0.0015 * 80 },
    { material: 'Leucine', quantity: 0.03, unit: 'kg', emissionFactor: 42, emissions: 0.03 * 42 },
    { material: 'Threonine', quantity: 0.01, unit: 'kg', emissionFactor: 38, emissions: 0.01 * 38 },
    { material: 'Taurine', quantity: 0.0025, unit: 'kg', emissionFactor: 55, emissions: 0.0025 * 55 },
    { material: 'Glycine', quantity: 0.0025, unit: 'kg', emissionFactor: 32, emissions: 0.0025 * 32 },
    { material: 'Arginine', quantity: 0.0025, unit: 'kg', emissionFactor: 48, emissions: 0.0025 * 48 },
    { material: 'Cynarin', quantity: 0.0025, unit: 'kg', emissionFactor: 115, emissions: 0.0025 * 115 },
    { material: 'Silymarin', quantity: 0.025, unit: 'kg', emissionFactor: 105, emissions: 0.025 * 105 },
    { material: 'Sorbitol', quantity: 0.01, unit: 'kg', emissionFactor: 22, emissions: 0.01 * 22 },
    { material: 'Carnitine', quantity: 0.005, unit: 'kg', emissionFactor: 95, emissions: 0.005 * 95 },
    { material: 'Betaine', quantity: 0.02, unit: 'kg', emissionFactor: 28, emissions: 0.02 * 28 },
    { material: 'Tween-80', quantity: 0.075, unit: 'kg', emissionFactor: 18, emissions: 0.075 * 18 },
    { material: 'Water', quantity: 0.571, unit: 'kg', emissionFactor: 0.05, emissions: 0.571 * 0.05 },
  ],

  Manufacturing: [
    { process: 'Equipment Cleaning', quantity: 3, unit: 'L', emissionFactor: 0.003, emissions: 3 * 0.003 },
    { process: 'Material Mixing', quantity: 0.5, unit: 'kWh', emissionFactor: 0.55, emissions: 0.5 * 0.55 },
    { process: 'Liquid Filling', quantity: 0.3, unit: 'kWh', emissionFactor: 0.55, emissions: 0.3 * 0.55 },
    {
      process: 'Sterilization/Microbial Control',
      quantity: 1.5,
      unit: 'kWh',
      emissionFactor: 0.55,
      emissions: 1.5 * 0.55,
    },
    { process: 'Primary Packaging', quantity: 0.2, unit: 'kWh', emissionFactor: 0.55, emissions: 0.2 * 0.55 },
    { process: 'Quality Inspection', quantity: 0.3, unit: 'kWh', emissionFactor: 0.55, emissions: 0.3 * 0.55 },
  ],

  Packaging: [
    {
      component: 'Plastic Bottle',
      quantity: 60.6,
      unit: 'g',
      material: 'HDPE',
      emissionFactor: 3.5,
      emissions: (60.6 * 3.5) / 1000,
    },
    {
      component: 'Metal Cap',
      quantity: 14.1,
      unit: 'g',
      material: 'Stainless Steel 304',
      emissionFactor: 7.0,
      emissions: (14.1 * 7.0) / 1000,
    },
    {
      component: 'Aluminum Seal',
      quantity: 2.1,
      unit: 'g',
      material: 'Aluminum',
      emissionFactor: 9.0,
      emissions: (2.1 * 9.0) / 1000,
    },
    {
      component: 'Paper Label',
      quantity: 4.9,
      unit: 'g',
      material: 'Recycled Paper',
      emissionFactor: 0.9,
      emissions: (4.9 * 0.9) / 1000,
    },
    {
      component: 'Secondary Packaging',
      quantity: 53.3,
      unit: 'g',
      material: 'Corrugated Cardboard',
      emissionFactor: 1.0,
      emissions: (53.3 * 1.0) / 1000,
    },
    {
      component: 'Adhesive',
      quantity: 3.0,
      unit: 'g',
      material: 'Chemical',
      emissionFactor: 2.5,
      emissions: (3.0 * 2.5) / 1000,
    },
  ],

  Transport: [
    {
      type: 'Refrigerated Storage',
      duration: 7,
      unit: 'days',
      emissionFactor: 0.0075,
      emissions: (7 * 0.0075) / BATCH_SIZE,
    },
    {
      type: 'Local Transport',
      distance: 50,
      unit: 'km',
      emissionFactor: 0.062,
      emissions: (50 * 0.062) / BATCH_SIZE,
    },
    {
      type: 'Long-Distance Transport',
      distance: 300,
      unit: 'km',
      emissionFactor: 0.062,
      emissions: (300 * 0.062) / BATCH_SIZE,
    },
  ],

  Distribution: [
    {
      activity: 'Warehouse Storage',
      duration: 3,
      unit: 'days',
      emissionFactor: 0.01,
      emissions: (3 * 0.01) / BATCH_SIZE,
    },
    {
      activity: 'Last-Mile Delivery',
      distance: 15,
      unit: 'km',
      emissionFactor: 0.18,
      emissions: (15 * 0.18) / BATCH_SIZE,
    },
    {
      activity: 'Retail Storage',
      duration: 2,
      unit: 'days',
      emissionFactor: 0.005,
      emissions: (2 * 0.005) / BATCH_SIZE,
    },
  ],

  Use: [
    {
      aspect: 'Consumer Transportation',
      distance: 5,
      unit: 'km',
      emissionFactor: 0.2,
      emissions: (5 * 0.2) / BATCH_SIZE,
    },
    {
      aspect: 'Product Refrigeration',
      duration: 14,
      unit: 'days',
      emissionFactor: 0.00752,
      emissions: (14 * 0.00752) / BATCH_SIZE,
    },
    {
      aspect: 'Product Preparation',
      quantity: 0,
      unit: 'kWh',
      emissionFactor: 0,
      emissions: 0,
    },
  ],

  'End of Life': [
    {
      method: 'Medical Waste Incineration',
      quantity: 0.1,
      unit: 'kg',
      emissionFactor: 3.5,
      emissions: 0.1 * 3.5,
    },
    {
      method: 'Recycling',
      quantity: 0.05,
      unit: 'kg',
      emissionFactor: -0.3,
      emissions: 0.05 * -0.3,
    },
    {
      method: 'Landfill',
      quantity: 0.03,
      unit: 'kg',
      emissionFactor: 1.5,
      emissions: 0.03 * 1.5,
    },
  ],
};

const getDefaultStageData = (): StageData => {
  return JSON.parse(JSON.stringify(initialStageData));
};

const calculateCarbonCost = (emissionsKg: number) => {
  const validEmissions = isNaN(emissionsKg) || !isFinite(emissionsKg) ? 0 : emissionsKg;

  const emissionsTon = validEmissions / KG_PER_TON;
  const costUSD = emissionsTon * CARBON_PRICE_PER_TON;
  const costEGP = costUSD * EXCHANGE_RATE;

  return {
    costEGP: parseFloat(costEGP.toFixed(2)),
    costUSD: parseFloat(costUSD.toFixed(4)),
    calculation: `${validEmissions.toFixed(3)} kg CO₂e × (${CARBON_PRICE_PER_TON} USD/ton ÷ ${KG_PER_TON})`,
    calculationEGP: `${costUSD.toFixed(4)} USD × ${EXCHANGE_RATE} EGP/USD`,
  };
};

const calculateItemCarbonCost = (emissionsKg: number) => {
  const validEmissions = isNaN(emissionsKg) || !isFinite(emissionsKg) ? 0 : emissionsKg;

  const costUSD = validEmissions * (CARBON_PRICE_PER_TON / KG_PER_TON);
  const costEGP = costUSD * EXCHANGE_RATE;

  return {
    costUSD: parseFloat(costUSD.toFixed(4)),
    costEGP: parseFloat(costEGP.toFixed(2)),
  };
};

const calculateStageCostFromItems = (items: any[]) => {
  const costUSD = items.reduce((sum: number, item: any) => {
    return sum + calculateItemCarbonCost(item.emissions).costUSD;
  }, 0);

  const costEGP = items.reduce((sum: number, item: any) => {
    return sum + calculateItemCarbonCost(item.emissions).costEGP;
  }, 0);

  return {
    costUSD: parseFloat(costUSD.toFixed(4)),
    costEGP: parseFloat(costEGP.toFixed(2)),
    calculation: 'Sum of item-level carbon costs',
    calculationEGP: 'Sum of item-level carbon costs in EGP',
  };
};

const formatNumber = (value: number, digits = 3) => {
  if (isNaN(value) || !isFinite(value)) return Number(0).toFixed(digits);
  return value.toFixed(digits);
};

const SimpleCarbonCostDialog = ({
  open,
  onOpenChange,
  data,
}: SimpleCarbonCostDialogProps) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content style={{ maxWidth: 500 }}>
        <Dialog.Title>Carbon Cost Details</Dialog.Title>

        <Box>
          <Text as="div" size="3" weight="bold" mb="2">
            {data?.title}
          </Text>

          {data?.subtitle && (
            <Text as="div" size="2" color="gray" mb="3">
              {data.subtitle}
            </Text>
          )}

          <Table.Root>
            <Table.Body>
              <Table.Row>
                <Table.RowHeaderCell>Total Emissions</Table.RowHeaderCell>
                <Table.Cell>
                  {data ? `${data.emissions.toFixed(3)} kg CO₂e` : '0.000 kg CO₂e'}
                </Table.Cell>
              </Table.Row>

              <Table.Row>
                <Table.RowHeaderCell>Carbon Price</Table.RowHeaderCell>
                <Table.Cell>
                  {data ? `${data.carbonPricePerTon} USD/ton` : '0 USD/ton'}
                </Table.Cell>
              </Table.Row>

              <Table.Row>
                <Table.RowHeaderCell>Carbon Price (per kg)</Table.RowHeaderCell>
                <Table.Cell>
                  {data ? `${data.carbonPricePerKg.toFixed(4)} USD/kg` : '0.0000 USD/kg'}
                </Table.Cell>
              </Table.Row>

              <Table.Row>
                <Table.RowHeaderCell>Calculation</Table.RowHeaderCell>
                <Table.Cell>{data?.calculationUSD || '-'}</Table.Cell>
              </Table.Row>

              <Table.Row>
                <Table.RowHeaderCell>Cost (US Dollars)</Table.RowHeaderCell>
                <Table.Cell>
                  <Text weight="bold">{data ? `${data.costUSD} USD` : '0.00 USD'}</Text>
                </Table.Cell>
              </Table.Row>

              <Table.Row>
                <Table.RowHeaderCell>Exchange Rate</Table.RowHeaderCell>
                <Table.Cell>
                  {data ? `${data.exchangeRate} EGP/USD` : '0 EGP/USD'}
                </Table.Cell>
              </Table.Row>

              <Table.Row>
                <Table.RowHeaderCell>Cost (Egyptian Pounds)</Table.RowHeaderCell>
                <Table.Cell>
                  <Text weight="bold">{data ? `${data.costEGP} EGP` : '0.00 EGP'}</Text>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Root>
        </Box>

        <Flex justify="end" mt="4">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

const CO2Footprint = () => {
  const [currency, setCurrency] = useState<'USD' | 'EGP'>('USD');
  const [stageCostCurrency, setStageCostCurrency] = useState<'USD' | 'EGP'>('USD');
  const [selectedProduct, setSelectedProduct] = useState('Poultry Drug A');
  const [certifications, setCertifications] = useState<string[]>(Array(7).fill('ISO 14001'));
  const [mode, setMode] = useState<'manual' | 'auto' | 'iot'>('auto');

  const [openStage, setOpenStage] = useState<string | null>(null);

  const [costDetailsOpen, setCostDetailsOpen] = useState(false);
  const [currentCostDetails, setCurrentCostDetails] = useState<CarbonCostDialogData | null>(null);

  const [itemCostDetailsOpen, setItemCostDetailsOpen] = useState(false);
  const [currentItemCostDetails, setCurrentItemCostDetails] = useState<CarbonCostDialogData | null>(null);

  const [stageData, setStageData] = useState<StageData>(() => getDefaultStageData());

  useEffect(() => {
    document.title = 'Sustainability Dashboard';
  }, []);

  useEffect(() => {
    if (mode !== 'iot') {
      setStageData(getDefaultStageData());
    }
  }, [mode]);

  const calculateStageEmissions = (items: any[]) => {
    return parseFloat(
      items
        .reduce((sum: number, item: any) => {
          const emissions = isNaN(item.emissions) || !isFinite(item.emissions) ? 0 : item.emissions;
          return sum + emissions;
        }, 0)
        .toFixed(3)
    );
  };

  const getEmissionData = (): EmissionDataItem[] => {
    const categories = [
      'Raw Materials',
      'Manufacturing',
      'Packaging',
      'Transport',
      'Distribution',
      'Use',
      'End of Life',
    ];

    return categories.map((category) => {
      const emissions = calculateStageEmissions(stageData[category]);
      const stageCost = calculateStageCostFromItems(stageData[category]);

      return {
        category,
        emissions,
        ...stageCost,
      };
    });
  };

  const [emissionData, setEmissionData] = useState<EmissionDataItem[]>(getEmissionData());

  useEffect(() => {
    setEmissionData(getEmissionData());
  }, [stageData, mode]);

  useEffect(() => {
    if (mode !== 'iot') return;

    const interval = setInterval(() => {
      setStageData((previousData) => {
        const updatedData: StageData = JSON.parse(JSON.stringify(previousData));

        Object.keys(updatedData).forEach((stage: string) => {
          updatedData[stage] = updatedData[stage].map((item: any) => {
            const randomFactor = 0.99 + Math.random() * 0.02;
            const newQuantity = (item.quantity || 0) * randomFactor;

            let newEmissions = item.emissions;

            if (stage === 'Packaging') {
              newEmissions = (newQuantity * (item.emissionFactor || 0)) / 1000;
            } else if (stage === 'Transport' || stage === 'Distribution' || stage === 'Use') {
              if (item.distance !== undefined) {
                newEmissions = (item.distance * (item.emissionFactor || 0)) / BATCH_SIZE;
              } else if (item.duration !== undefined) {
                newEmissions = (item.duration * (item.emissionFactor || 0)) / BATCH_SIZE;
              } else {
                newEmissions = (newQuantity * (item.emissionFactor || 0)) / BATCH_SIZE;
              }
            } else {
              newEmissions = newQuantity * (item.emissionFactor || 0);
            }

            return {
              ...item,
              quantity: parseFloat(newQuantity.toFixed(4)),
              emissions: parseFloat(newEmissions.toFixed(6)),
            };
          });
        });

        return updatedData;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [mode]);

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

    return parseFloat(total.toFixed(currency === 'EGP' ? 2 : 4));
  }, [emissionData, currency]);

  const ghgScopeData = useMemo(() => {
    const scope12Emissions = emissionData
      .filter((item) => ['Manufacturing', 'Packaging'].includes(item.category))
      .reduce((sum, item) => sum + item.emissions, 0);

    const scope3Emissions = emissionData
      .filter((item) =>
        ['Raw Materials', 'Transport', 'Distribution', 'Use', 'End of Life'].includes(item.category)
      )
      .reduce((sum, item) => sum + item.emissions, 0);

    return [
      { name: 'Scope 1+2', value: parseFloat(scope12Emissions.toFixed(3)) },
      { name: 'Scope 3', value: parseFloat(scope3Emissions.toFixed(3)) },
    ];
  }, [emissionData]);

  const revenue = currency === 'EGP' ? 55000 : 1800;
  const carbonIntensity = totalEmissions / (revenue / 1000);

  const highestEmissionStage = useMemo(() => {
    if (emissionData.length === 0) return null;
    return [...emissionData].sort((a, b) => b.emissions - a.emissions)[0];
  }, [emissionData]);

  const pieChartData = emissionData.map((item) => ({
    name: item.category,
    value: isNaN(item.emissions) || !isFinite(item.emissions) ? 0 : item.emissions,
    cost:
      currency === 'EGP'
        ? isNaN(item.costEGP) || !isFinite(item.costEGP)
          ? 0
          : item.costEGP
        : isNaN(item.costUSD) || !isFinite(item.costUSD)
          ? 0
          : item.costUSD,
  }));

  const currentStageData = useMemo(() => {
    if (!openStage) return [];
    return stageData[openStage] || [];
  }, [openStage, stageData]);

  const totalStageEmissions = currentStageData.reduce((sum: number, item: any) => {
    const emissions = isNaN(item.emissions) || !isFinite(item.emissions) ? 0 : item.emissions;
    return sum + emissions;
  }, 0);

  const totalStageCostUSD = currentStageData.reduce((sum: number, item: any) => {
    return sum + calculateItemCarbonCost(item.emissions).costUSD;
  }, 0);

  const totalStageCostEGP = currentStageData.reduce((sum: number, item: any) => {
    return sum + calculateItemCarbonCost(item.emissions).costEGP;
  }, 0);

  const handleStageClick = (stage: string) => {
    setOpenStage(stage);
  };

  const showCostDetails = (item: EmissionDataItem) => {
    const emissionsKg = isNaN(item.emissions) || !isFinite(item.emissions) ? 0 : item.emissions;

    setCurrentCostDetails({
      title: item.category,
      subtitle: 'Calculated as the sum of item-level carbon costs',
      emissions: emissionsKg,
      carbonPricePerTon: CARBON_PRICE_PER_TON,
      carbonPricePerKg: CARBON_PRICE_PER_TON / KG_PER_TON,
      calculationUSD: 'Sum of item-level carbon costs',
      costUSD: item.costUSD.toFixed(4),
      exchangeRate: EXCHANGE_RATE,
      costEGP: item.costEGP.toFixed(2),
    });

    setCostDetailsOpen(true);
  };

  const showItemCostDetails = (item: any, stage: string) => {
    const emissionsKg = isNaN(item.emissions) || !isFinite(item.emissions) ? 0 : item.emissions;
    const costUSD = emissionsKg * (CARBON_PRICE_PER_TON / KG_PER_TON);
    const costEGP = costUSD * EXCHANGE_RATE;

    setCurrentItemCostDetails({
      title: `Item: ${getItemName(item, stage)}`,
      subtitle: stage,
      emissions: emissionsKg,
      carbonPricePerTon: CARBON_PRICE_PER_TON,
      carbonPricePerKg: CARBON_PRICE_PER_TON / KG_PER_TON,
      calculationUSD: `${emissionsKg.toFixed(3)} kg CO₂e × (${CARBON_PRICE_PER_TON} USD/ton ÷ ${KG_PER_TON})`,
      costUSD: costUSD.toFixed(2),
      exchangeRate: EXCHANGE_RATE,
      costEGP: costEGP.toFixed(2),
    });

    setItemCostDetailsOpen(true);
  };

  const handleEmissionChange = (index: number, value: string) => {
    if (mode !== 'manual') return;

    const newValue = parseFloat(value);

    if (!isNaN(newValue)) {
      const newData = [...emissionData];

      newData[index] = {
        ...newData[index],
        emissions: newValue,
        ...calculateCarbonCost(newValue),
      };

      setEmissionData(newData);
    }
  };

  const handleEmissionFactorChange = (stage: string, index: number, value: string) => {
    const newValue = parseFloat(value);

    if (isNaN(newValue)) return;

    const updatedData: StageData = JSON.parse(JSON.stringify(stageData));
    const item = updatedData[stage][index];

    item.emissionFactor = newValue;

    if (stage === 'Packaging') {
      item.emissions = ((item.quantity || 0) * newValue) / 1000;
    } else if (stage === 'Transport' || stage === 'Distribution' || stage === 'Use') {
      if (item.distance !== undefined) {
        item.emissions = ((item.distance || 0) * newValue) / BATCH_SIZE;
      } else if (item.duration !== undefined) {
        item.emissions = ((item.duration || 0) * newValue) / BATCH_SIZE;
      } else {
        item.emissions = ((item.quantity || 0) * newValue) / BATCH_SIZE;
      }
    } else {
      item.emissions = (item.quantity || 0) * newValue;
    }

    setStageData(updatedData);
  };

  const handleCertificationChange = (index: number, value: string) => {
    const newCertifications = [...certifications];
    newCertifications[index] = value;
    setCertifications(newCertifications);
  };

  const handleSubmit = () => {
    console.log('Submitted carbon report:', emissionData);
    alert('Carbon report submitted successfully!');
  };

  const handleBlockchainSubmit = () => {
    console.log('Submitted to blockchain:', emissionData);
    alert('Data submitted to blockchain successfully!');
  };

  const getItemName = (item: any, stage: string) => {
    if (stage === 'Raw Materials') return item.material;
    if (stage === 'Manufacturing') return item.process;
    if (stage === 'Packaging') return item.component;
    if (stage === 'Transport') return item.type;
    if (stage === 'Distribution') return item.activity;
    if (stage === 'Use') return item.aspect;
    if (stage === 'End of Life') return item.method;
    return 'Item';
  };

  const shouldShowUnitColumn = (stage: string | null) => {
    return stage === 'Manufacturing';
  };

  const getEmissionFactorColumnTitle = (stage: string | null) => {
    if (stage === 'Manufacturing') return 'Emission Factor (kg CO₂e/unit)';
    if (stage === 'Raw Materials') return 'Emission Factor (kg CO₂e/kg)';
    if (stage === 'Packaging') return 'Emission Factor';
    return 'Emission Factor';
  };

  const getFormattedQuantity = (item: any, stage: string) => {
    if (stage === 'Manufacturing') {
      return Number(item.quantity || 0).toFixed(2);
    }

    if (stage === 'Raw Materials') {
      return `${item.quantity ?? 0}`;
    }

    if (stage === 'Packaging') {
      return `${item.quantity ?? 0}`;
    }

    if (stage === 'Transport' || stage === 'Distribution' || stage === 'Use') {
      if (item.distance !== undefined) return `${item.distance}`;
      if (item.duration !== undefined) return `${item.duration}`;
      if (item.quantity !== undefined) return `${item.quantity}`;
      return 'N/A';
    }

    return `${item.quantity ?? 0}`;
  };

  const getNameColumnTitle = (stage: string | null) => {
    if (stage === 'Raw Materials') return 'Material';
    if (stage === 'Manufacturing') return 'Process';
    if (stage === 'Packaging') return 'Component';
    if (stage === 'Transport') return 'Activity';
    if (stage === 'Distribution') return 'Activity';
    if (stage === 'Use') return 'Aspect';
    if (stage === 'End of Life') return 'Method';
    return 'Item';
  };

  const getQuantityColumnTitle = (stage: string | null) => {
    if (stage === 'Raw Materials') return 'Quantity (kg)';
    if (stage === 'Manufacturing') return 'Quantity';
    if (stage === 'Packaging') return 'Quantity (g)';
    if (stage === 'Transport') return 'Distance / Duration';
    if (stage === 'Distribution') return 'Distance / Duration';
    if (stage === 'Use') return 'Distance / Duration / Quantity';
    if (stage === 'End of Life') return 'Quantity';
    return 'Quantity';
  };

  const modeDescription =
    mode === 'iot'
      ? 'Live simulated IoT readings are active. Quantities may change every 3 seconds.'
      : mode === 'manual'
        ? 'Manual mode is active. Category emissions can be edited manually.'
        : 'Auto mode is active. Default baseline values are used.';

  const softBlueHeaderStyle = {
    backgroundColor: '#E3EEFD',
    color: '#1E3A5F',
    fontWeight: 'bold',
    fontSize: '13px',
  };

  const compactNumberStyle = {
    fontSize: '13px',
    fontWeight: '600',
  };

  const compactButtonStyle = {
    padding: 0,
    fontWeight: '700',
    fontSize: '13px',
    color: '#2563eb',
    cursor: 'pointer',
  };

  return (
    <Box
      p="6"
      style={{
        background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
        minHeight: '100vh',
      }}
    >
      <Flex justify="between" align="center" mb="5" wrap="wrap" gap="4">
        <Box>
          <Heading size="7">Sustainability Dashboard</Heading>
          <Text size="2" color="gray">
            Carbon footprint, carbon cost, and item-level carbon cost analysis
          </Text>
        </Box>

        <Flex gap="3" wrap="wrap">
          <Box>
            <Text size="1" color="gray">
              Mode
            </Text>
            <Select.Root value={mode} onValueChange={(value) => setMode(value as 'manual' | 'auto' | 'iot')}>
              <Select.Trigger style={{ width: 120 }} />
              <Select.Content>
                <Select.Item value="auto">Auto</Select.Item>
                <Select.Item value="manual">Manual</Select.Item>
                <Select.Item value="iot">IoT Mode</Select.Item>
              </Select.Content>
            </Select.Root>
          </Box>

          <Box style={{ width: 180 }}>
            <Text size="1" color="gray">
              Product
            </Text>
            <Select.Root value={selectedProduct} onValueChange={(value) => setSelectedProduct(value)}>
              <Select.Trigger />
              <Select.Content>
                <Select.Item value="Poultry Drug A">Poultry Drug A</Select.Item>
                <Select.Item value="Poultry Drug B">Poultry Drug B</Select.Item>
                <Select.Item value="Poultry Drug C">Poultry Drug C</Select.Item>
              </Select.Content>
            </Select.Root>
          </Box>

          <Box style={{ width: 100 }}>
            <Text size="1" color="gray">
              Currency
            </Text>
            <Select.Root value={currency} onValueChange={(value) => setCurrency(value as 'USD' | 'EGP')}>
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
        <Card
          mb="5"
          style={{
            borderRadius: '16px',
            border: '1px solid #2563eb',
            background: 'linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%)',
            color: 'white',
          }}
        >
          <Flex p="4" justify="between" align="center" wrap="wrap" gap="3">
            <Flex align="center" gap="3">
              <Box
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255,255,255,0.18)',
                  fontSize: 24,
                }}
              >
                📡
              </Box>

              <Box>
                <Flex align="center" gap="2">
                  <Heading size="4">IoT Mode Active</Heading>
                  <Badge color="blue" variant="solid">
                    IOT
                  </Badge>
                </Flex>
                <Text size="2" style={{ opacity: 0.85 }}>
                  {modeDescription}
                </Text>
              </Box>
            </Flex>

            <Box>
              <Text size="1" style={{ opacity: 0.75 }}>
                Carbon Price
              </Text>
              <Text size="4" weight="bold">
                {CARBON_PRICE_PER_TON} USD / ton CO₂e
              </Text>
            </Box>
          </Flex>
        </Card>
      )}

      <Grid columns={{ initial: '1', sm: '2', lg: '4' }} gap="4" mb="5">
        <Card style={{ borderRadius: '16px' }}>
          <Flex direction="column" gap="1" p="4">
            <Text size="2" color="gray">
              Total Emissions
            </Text>
            <Heading size="7">{totalEmissions.toFixed(3)} kg CO₂e</Heading>
            <Badge color="green" variant="soft">
              Baseline target: {(totalEmissions * 0.8).toFixed(3)} kg CO₂e
            </Badge>
          </Flex>
        </Card>

        <Card style={{ borderRadius: '16px' }}>
          <Flex direction="column" gap="1" p="4">
            <Text size="2" color="gray">
              Carbon Cost
            </Text>
            <Heading size="7">
              {currency === 'EGP' ? totalCost.toFixed(2) : totalCost.toFixed(4)} {currency}
            </Heading>
            <Text size="1" color="gray">
              Converted using {EXCHANGE_RATE} EGP/USD
            </Text>
          </Flex>
        </Card>

        <Card style={{ borderRadius: '16px' }}>
          <Flex direction="column" gap="1" p="4">
            <Text size="2" color="gray">
              Carbon Intensity
            </Text>
            <Heading size="7">
              {isNaN(carbonIntensity) || !isFinite(carbonIntensity) ? '0.0000' : carbonIntensity.toFixed(4)}
            </Heading>
            <Text size="1" color="gray">
              kg CO₂e per {currency === 'USD' ? '$' : 'EGP'}K revenue
            </Text>
          </Flex>
        </Card>

        <Card style={{ borderRadius: '16px' }}>
          <Flex direction="column" gap="1" p="4">
            <Text size="2" color="gray">
              Highest Emission Stage
            </Text>
            <Heading size="5">{highestEmissionStage?.category || 'N/A'}</Heading>
            <Text size="2" weight="bold">
              {highestEmissionStage ? `${highestEmissionStage.emissions.toFixed(3)} kg CO₂e` : '0.000 kg CO₂e'}
            </Text>
          </Flex>
        </Card>
      </Grid>

      <Grid columns={{ initial: '1', lg: '2' }} gap="4" mb="4">
        <Card style={{ borderRadius: '16px' }}>
          <Box p="3">
            <Heading size="4" mb="2">
              Emissions by Category
            </Heading>

            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={100}
                  innerRadius={60}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`category-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value: number, name: string, props: any) => [
                    `${value.toFixed(3)} kg CO₂e`,
                    name,
                    `${currency} ${props.payload.cost.toFixed(currency === 'EGP' ? 2 : 4)}`,
                  ]}
                />

                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Card>

        <Card style={{ borderRadius: '16px' }}>
          <Box p="3">
            <Heading size="4" mb="2">
              GHG Protocol Scopes
            </Heading>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ghgScopeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={90}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {ghgScopeData.map((entry, index) => (
                    <Cell key={`scope-cell-${index}`} fill={SCOPE_COLORS[index % SCOPE_COLORS.length]} />
                  ))}
                </Pie>

                <Tooltip formatter={(value: number, name: string) => [`${value.toFixed(3)} kg CO₂e`, name]} />

                <Legend />
              </PieChart>
            </ResponsiveContainer>

            <Separator my="3" />

            <Box style={{ fontSize: '12px', textAlign: 'center', color: '#666' }}>
              <div>Scope 1+2: Manufacturing + Packaging</div>
              <div>Scope 3: Raw Materials + Transport + Distribution + Use + End of Life</div>
            </Box>
          </Box>
        </Card>
      </Grid>

      <Card mb="4" style={{ borderRadius: '16px' }}>
        <Box p="3">
          <Heading size="4" mb="2">
            Carbon Cost by Category
          </Heading>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pieChartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => [
                  `${value.toFixed(currency === 'EGP' ? 2 : 4)} ${currency}`,
                  'Carbon Cost',
                ]}
              />
              <Legend />
              <Bar dataKey="cost" name={`Carbon Cost (${currency})`} />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Card>

      <Card style={{ borderRadius: '16px' }}>
        <Box p="3">
          <Flex justify="between" align="center" mb="3" wrap="wrap" gap="2">
            <Box>
              <Heading size="4">Stage-Level Carbon Cost</Heading>
              <Text size="2" color="gray">
                Click any category to view item-level emissions and carbon cost.
              </Text>
            </Box>

            <Badge color="gray" variant="soft">
              Product: {selectedProduct}
            </Badge>
          </Flex>

          <Box style={{ maxHeight: 430, overflowY: 'auto' }}>
            <Table.Root variant="surface">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>
                    <strong>Category</strong>
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>
                    <strong>Emissions (kg CO₂e)</strong>
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>
                    <strong>Carbon Cost ({currency})</strong>
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>
                    <strong>% of Total</strong>
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>
                    <strong>Target (kg CO₂e)</strong>
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>
                    <strong>Certification</strong>
                  </Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {emissionData.map((item, index) => (
                  <Table.Row key={item.category}>
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
                          onChange={(event) => handleEmissionChange(index, event.target.value)}
                          style={{ maxWidth: 100 }}
                        />
                      ) : (
                        <Text weight="bold">{formatNumber(item.emissions, 3)}</Text>
                      )}
                    </Table.Cell>

                    <Table.Cell>
                      <Button variant="ghost" onClick={() => showCostDetails(item)} style={{ padding: 0 }}>
                        {currency === 'EGP'
                          ? `${item.costEGP.toFixed(2)} EGP`
                          : `${item.costUSD.toFixed(4)} USD`}
                      </Button>
                    </Table.Cell>

                    <Table.Cell>
                      <strong>
                        {totalEmissions === 0 ? '0.0' : ((item.emissions / totalEmissions) * 100).toFixed(1)}%
                      </strong>
                    </Table.Cell>

                    <Table.Cell>
                      <strong>{(item.emissions * 0.8).toFixed(3)}</strong>
                    </Table.Cell>

                    <Table.Cell>
                      <Select.Root value={certifications[index]} onValueChange={(value) => handleCertificationChange(index, value)}>
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
                  <Table.RowHeaderCell>
                    <strong>Total</strong>
                  </Table.RowHeaderCell>
                  <Table.Cell>
                    <strong>{totalEmissions.toFixed(3)}</strong>
                  </Table.Cell>
                  <Table.Cell>
                    <strong>
                      {currency === 'EGP' ? totalCost.toFixed(2) : totalCost.toFixed(4)} {currency}
                    </strong>
                  </Table.Cell>
                  <Table.Cell>
                    <strong>100%</strong>
                  </Table.Cell>
                  <Table.Cell>
                    <strong>{(totalEmissions * 0.8).toFixed(3)}</strong>
                  </Table.Cell>
                  <Table.Cell />
                </Table.Row>
              </Table.Body>
            </Table.Root>
          </Box>
        </Box>
      </Card>

      <Flex mt="4" justify="between" align="center" wrap="wrap" gap="3">
        <Text size="1" color="gray">
          Last updated: {new Date().toLocaleDateString()} | Default data is restored automatically outside IoT mode.
        </Text>

        <Flex gap="3">
          <Button variant="solid" color="green" onClick={handleSubmit}>
            Submit Carbon Report
          </Button>

          <Button
            variant="solid"
            style={{
              backgroundColor: '#006400',
              color: 'white',
              fontWeight: 'bold',
            }}
            onClick={handleBlockchainSubmit}
          >
            Submit to Blockchain
          </Button>
        </Flex>
      </Flex>

      <Dialog.Root open={!!openStage} onOpenChange={(open) => !open && setOpenStage(null)}>
        <Dialog.Content
          style={{
            maxWidth: 1050,
            maxHeight: '82vh',
            padding: '18px',
          }}
        >
          <Dialog.Title>{openStage} Detailed Emissions</Dialog.Title>

          <Dialog.Description mb="2">
            Detailed breakdown of emissions for {openStage} stage (per unit)
            {mode === 'iot' && (
              <Badge color="blue" variant="solid" ml="2" style={{ verticalAlign: 'middle' }}>
                Live Data
              </Badge>
            )}
          </Dialog.Description>

          <Box style={{ overflowY: 'auto', maxHeight: '62vh' }}>
            <Table.Root variant="surface">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell style={softBlueHeaderStyle}>
                    {getNameColumnTitle(openStage)}
                  </Table.ColumnHeaderCell>

                  <Table.ColumnHeaderCell style={softBlueHeaderStyle}>
                    {getQuantityColumnTitle(openStage)}
                  </Table.ColumnHeaderCell>

                  {shouldShowUnitColumn(openStage) && (
                    <Table.ColumnHeaderCell style={softBlueHeaderStyle}>
                      Unit
                    </Table.ColumnHeaderCell>
                  )}

                  {openStage === 'Packaging' && (
                    <Table.ColumnHeaderCell style={softBlueHeaderStyle}>
                      Material
                    </Table.ColumnHeaderCell>
                  )}

                  <Table.ColumnHeaderCell style={softBlueHeaderStyle}>
                    {getEmissionFactorColumnTitle(openStage)}
                  </Table.ColumnHeaderCell>

                  <Table.ColumnHeaderCell style={softBlueHeaderStyle}>
                    Emissions (kg CO₂e)
                  </Table.ColumnHeaderCell>

                  <Table.ColumnHeaderCell style={softBlueHeaderStyle}>
                    <Flex align="center" gap="2">
                      <Text weight="bold" size="2">
                        Carbon Cost
                      </Text>

                      <Select.Root
                        value={stageCostCurrency}
                        onValueChange={(value) => setStageCostCurrency(value as 'USD' | 'EGP')}
                      >
                        <Select.Trigger
                          variant="soft"
                          style={{
                            width: 72,
                            height: 26,
                            fontSize: '12px',
                            backgroundColor: 'white',
                          }}
                        />
                        <Select.Content>
                          <Select.Item value="USD">USD</Select.Item>
                          <Select.Item value="EGP">EGP</Select.Item>
                        </Select.Content>
                      </Select.Root>
                    </Flex>
                  </Table.ColumnHeaderCell>

                  <Table.ColumnHeaderCell style={softBlueHeaderStyle}>
                    Stage %
                  </Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {currentStageData.map((item: any, index: number) => {
                  const itemCost = calculateItemCarbonCost(item.emissions);
                  const itemShare =
                    totalStageEmissions > 0 ? ((item.emissions / totalStageEmissions) * 100).toFixed(1) : '0.0';

                  return (
                    <Table.Row key={`${openStage}-${index}`}>
                      <Table.Cell style={{ fontSize: '13px', fontWeight: '600' }}>
                        {getItemName(item, openStage || '')}
                      </Table.Cell>

                      <Table.Cell style={compactNumberStyle}>
                        {mode === 'iot' ? (
                          <Text weight="bold" style={compactNumberStyle}>
                            {getFormattedQuantity(item, openStage || '')}
                          </Text>
                        ) : (
                          getFormattedQuantity(item, openStage || '')
                        )}
                      </Table.Cell>

                      {shouldShowUnitColumn(openStage) && (
                        <Table.Cell style={compactNumberStyle}>
                          {item.unit}
                        </Table.Cell>
                      )}

                      {openStage === 'Packaging' && (
                        <Table.Cell style={{ fontSize: '13px' }}>
                          {item.material}
                        </Table.Cell>
                      )}

                      <Table.Cell>
                        <TextField.Root
                          size="1"
                          value={(item.emissionFactor || 0).toString()}
                          onChange={(event) => handleEmissionFactorChange(openStage!, index, event.target.value)}
                          style={{ maxWidth: 120, fontSize: '13px' }}
                        />
                      </Table.Cell>

                      <Table.Cell style={compactNumberStyle}>
                        {formatNumber(item.emissions, 3)}
                      </Table.Cell>

                      <Table.Cell style={compactNumberStyle}>
                        <Button
                          variant="ghost"
                          onClick={() => showItemCostDetails(item, openStage || '')}
                          style={compactButtonStyle}
                        >
                          {stageCostCurrency === 'USD'
                            ? `${itemCost.costUSD.toFixed(4)} USD`
                            : `${itemCost.costEGP.toFixed(2)} EGP`}
                        </Button>
                      </Table.Cell>

                      <Table.Cell style={compactNumberStyle}>
                        {itemShare}%
                      </Table.Cell>
                    </Table.Row>
                  );
                })}

                <Table.Row style={{ backgroundColor: '#EEF4FF' }}>
                  <Table.RowHeaderCell
                    colSpan={
                      openStage === 'Packaging'
                        ? 4
                        : shouldShowUnitColumn(openStage)
                          ? 4
                          : 3
                    }
                    style={{ fontWeight: 'bold', fontSize: '13px' }}
                  >
                    <strong>Total</strong>
                  </Table.RowHeaderCell>

                  <Table.Cell style={compactNumberStyle}>
                    <strong>{totalStageEmissions.toFixed(3)}</strong>
                  </Table.Cell>

                  <Table.Cell style={compactNumberStyle}>
                    <strong>
                      {stageCostCurrency === 'USD'
                        ? `${totalStageCostUSD.toFixed(4)} USD`
                        : `${totalStageCostEGP.toFixed(2)} EGP`}
                    </strong>
                  </Table.Cell>

                  <Table.Cell style={compactNumberStyle}>
                    <strong>100%</strong>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table.Root>
          </Box>

          <Flex mt="3" justify="end">
            <Button variant="soft" onClick={() => setOpenStage(null)}>
              Close Details
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      <SimpleCarbonCostDialog
        open={costDetailsOpen}
        onOpenChange={setCostDetailsOpen}
        data={currentCostDetails}
      />

      <SimpleCarbonCostDialog
        open={itemCostDetailsOpen}
        onOpenChange={setItemCostDetailsOpen}
        data={currentItemCostDetails}
      />
    </Box>
  );
};

export default CO2Footprint;
