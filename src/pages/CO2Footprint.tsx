PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';

interface StageItem {
  material?: string;
  process?: string;
  component?: string;
  type?: string;
  activity?: string;
  aspect?: string;
  method?: string;
  quantity: number;
  unit?: string;
  emissionFactor: number;
  reference: string;
  emissions: number;
}

interface EmissionData {
  category: string;
  emissions: number;
  percentOfTotal?: string;
  target?: string;
}

const stageData = {
  'Raw Materials': [
    { material: 'Vitamin B1', quantity: 0.001, emissionFactor: 85, reference: '[IPCC 2023]', emissions: 0.085 },
@@ -95,32 +73,9 @@ const CO2Footprint = () => {
  const [certifications, setCertifications] = useState<string[]>(Array(7).fill('ISO 14001'));
  const [mode, setMode] = useState<'manual' | 'auto'>('auto');
  const [openStage, setOpenStage] = useState<string | null>(null);
  const [currentStageData, setCurrentStageData] = useState<StageItem[]>([]);

  const CARBON_PRICE_USD = 50;
  const EXCHANGE_RATE = 50;
  const KG_TO_TON = 0.001;

  const calculateEnvironmentalCost = (emissionsKg: number): string => {
    const emissionsTon = emissionsKg * KG_TO_TON;
    const costUSD = emissionsTon * CARBON_PRICE_USD;
    const costEGP = costUSD * EXCHANGE_RATE;
    return costEGP.toFixed(2);
  };
  const [currentStageData, setCurrentStageData] = useState<any[]>([]);

  const showCalculationDetails = (item: StageItem): void => {
    let calculation = '';
    const itemName = item.material || item.process || item.component || 
                    item.type || item.activity || item.aspect || item.method;
    const quantity = `${item.quantity} ${item.unit || 'kg'}`;
    
    calculation = `${quantity} × ${item.emissionFactor} kg CO₂e/${item.unit || 'kg'} = ${item.emissions} kg CO₂e`;
    
    const cost = calculateEnvironmentalCost(item.emissions);
    alert(`Item: ${itemName}\nCalculation: ${calculation}\nEnvironmental Cost: ${cost} EGP`);
  };

  const defaultManualData: EmissionData[] = [
  const defaultManualData = [
    { 
      category: 'Raw Materials', 
      emissions: stageData['Raw Materials'].reduce((sum, item) => sum + item.emissions, 0) 
@@ -151,7 +106,7 @@ const CO2Footprint = () => {
    }
  ];

  const [emissionData, setEmissionData] = useState<EmissionData[]>(defaultManualData);
  const [emissionData, setEmissionData] = useState(defaultManualData);

  const handleStageClick = (stage: string) => {
    setCurrentStageData(stageData[stage as keyof typeof stageData]);
@@ -200,74 +155,6 @@ const CO2Footprint = () => {
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
                  <Table.Cell>{item.quantity?.toFixed(4) || item.distance || item.duration}</Table.Cell>
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
@@ -457,7 +344,265 @@ const CO2Footprint = () => {
      </Flex>

      <Dialog.Root open={!!openStage} onOpenChange={(open) => !open && setOpenStage(null)}>
        {renderStageDetails()}
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
                    <Table.ColumnHeaderCell>Reference</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Emissions (kg CO₂e)</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {currentStageData.map((item: any, index: number) => (
                    <Table.Row key={index}>
                      <Table.Cell>{item.material}</Table.Cell>
                      <Table.Cell>{item.quantity.toFixed(4)}</Table.Cell>
                      <Table.Cell>{item.emissionFactor}</Table.Cell>
                      <Table.Cell>{item.reference}</Table.Cell>
                      <Table.Cell>{item.emissions.toFixed(3)}</Table.Cell>
                    </Table.Row>
                  ))}
                  <Table.Row style={{ backgroundColor: 'var(--accent-a3)' }}>
                    <Table.RowHeaderCell colSpan={4}><strong>Total</strong></Table.RowHeaderCell>
                    <Table.Cell>
                      <strong>
                        {currentStageData.reduce((sum, item) => sum + item.emissions, 0).toFixed(3)}
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
                    <Table.ColumnHeaderCell>Reference</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Emissions (kg CO₂e)</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {currentStageData.map((item: any, index: number) => (
                    <Table.Row key={index}>
                      <Table.Cell>{item.process}</Table.Cell>
                      <Table.Cell>{item.quantity}</Table.Cell>
                      <Table.Cell>{item.unit}</Table.Cell>
                      <Table.Cell>{item.emissionFactor}</Table.Cell>
                      <Table.Cell>{item.reference}</Table.Cell>
                      <Table.Cell>{item.emissions.toFixed(3)}</Table.Cell>
                    </Table.Row>
                  ))}
                  <Table.Row style={{ backgroundColor: 'var(--accent-a3)' }}>
                    <Table.RowHeaderCell colSpan={5}><strong>Total</strong></Table.RowHeaderCell>
                    <Table.Cell>
                      <strong>
                        {currentStageData.reduce((sum, item) => sum + item.emissions, 0).toFixed(3)}
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
                    <Table.ColumnHeaderCell>Quantity</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Unit</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Material</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Emission Factor (kg CO₂e/unit)</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Reference</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Emissions (kg CO₂e)</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {currentStageData.map((item: any, index: number) => (
                    <Table.Row key={index}>
                      <Table.Cell>{item.component}</Table.Cell>
                      <Table.Cell>{item.quantity}</Table.Cell>
                      <Table.Cell>{item.unit}</Table.Cell>
                      <Table.Cell>{item.material}</Table.Cell>
                      <Table.Cell>{item.emissionFactor}</Table.Cell>
                      <Table.Cell>{item.reference}</Table.Cell>
                      <Table.Cell>{item.emissions.toFixed(3)}</Table.Cell>
                    </Table.Row>
                  ))}
                  <Table.Row style={{ backgroundColor: 'var(--accent-a3)' }}>
                    <Table.RowHeaderCell colSpan={6}><strong>Total</strong></Table.RowHeaderCell>
                    <Table.Cell>
                      <strong>
                        {currentStageData.reduce((sum, item) => sum + item.emissions, 0).toFixed(3)}
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
                    <Table.ColumnHeaderCell>Transport Type</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Distance/Duration</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Unit</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Emission Factor (kg CO₂e/unit)</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Reference</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Emissions (kg CO₂e)</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {currentStageData.map((item: any, index: number) => (
                    <Table.Row key={index}>
                      <Table.Cell>{item.type}</Table.Cell>
                      <Table.Cell>{item.distance || item.duration}</Table.Cell>
                      <Table.Cell>{item.unit}</Table.Cell>
                      <Table.Cell>{item.emissionFactor}</Table.Cell>
                      <Table.Cell>{item.reference}</Table.Cell>
                      <Table.Cell>{item.emissions.toFixed(3)}</Table.Cell>
                    </Table.Row>
                  ))}
                  <Table.Row style={{ backgroundColor: 'var(--accent-a3)' }}>
                    <Table.RowHeaderCell colSpan={5}><strong>Total</strong></Table.RowHeaderCell>
                    <Table.Cell>
                      <strong>
                        {currentStageData.reduce((sum, item) => sum + item.emissions, 0).toFixed(3)}
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
                    <Table.ColumnHeaderCell>Emission Factor (kg CO₂e/unit)</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Reference</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Emissions (kg CO₂e)</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {currentStageData.map((item: any, index: number) => (
                    <Table.Row key={index}>
                      <Table.Cell>{item.activity}</Table.Cell>
                      <Table.Cell>{item.distance || item.duration}</Table.Cell>
                      <Table.Cell>{item.unit}</Table.Cell>
                      <Table.Cell>{item.emissionFactor}</Table.Cell>
                      <Table.Cell>{item.reference}</Table.Cell>
                      <Table.Cell>{item.emissions.toFixed(3)}</Table.Cell>
                    </Table.Row>
                  ))}
                  <Table.Row style={{ backgroundColor: 'var(--accent-a3)' }}>
                    <Table.RowHeaderCell colSpan={5}><strong>Total</strong></Table.RowHeaderCell>
                    <Table.Cell>
                      <strong>
                        {currentStageData.reduce((sum, item) => sum + item.emissions, 0).toFixed(3)}
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
                    <Table.ColumnHeaderCell>Quantity/Distance/Duration</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Unit</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Emission Factor (kg CO₂e/unit)</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Reference</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Emissions (kg CO₂e)</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {currentStageData.map((item: any, index: number) => (
                    <Table.Row key={index}>
                      <Table.Cell>{item.aspect}</Table.Cell>
                      <Table.Cell>{item.quantity || item.distance || item.duration}</Table.Cell>
                      <Table.Cell>{item.unit}</Table.Cell>
                      <Table.Cell>{item.emissionFactor}</Table.Cell>
                      <Table.Cell>{item.reference}</Table.Cell>
                      <Table.Cell>{item.emissions.toFixed(3)}</Table.Cell>
                    </Table.Row>
                  ))}
                  <Table.Row style={{ backgroundColor: 'var(--accent-a3)' }}>
                    <Table.RowHeaderCell colSpan={5}><strong>Total</strong></Table.RowHeaderCell>
                    <Table.Cell>
                      <strong>
                        {currentStageData.reduce((sum, item) => sum + item.emissions, 0).toFixed(3)}
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
                    <Table.ColumnHeaderCell>Disposal Method</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Quantity</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Unit</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Emission Factor (kg CO₂e/unit)</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Reference</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Emissions (kg CO₂e)</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {currentStageData.map((item: any, index: number) => (
                    <Table.Row key={index}>
                      <Table.Cell>{item.method}</Table.Cell>
                      <Table.Cell>{item.quantity}</Table.Cell>
                      <Table.Cell>{item.unit}</Table.Cell>
                      <Table.Cell>{item.emissionFactor}</Table.Cell>
                      <Table.Cell>{item.reference}</Table.Cell>
                      <Table.Cell>{item.emissions.toFixed(3)}</Table.Cell>
                    </Table.Row>
                  ))}
                  <Table.Row style={{ backgroundColor: 'var(--accent-a3)' }}>
                    <Table.RowHeaderCell colSpan={5}><strong>Total</strong></Table.RowHeaderCell>
                    <Table.Cell>
                      <strong>
                        {currentStageData.reduce((sum, item) => sum + item.emissions, 0).toFixed(3)}
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
    </Box>
  );
