import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Flex, 
  Heading, 
  Text, 
  Badge, 
  Table, 
  Button, 
  Grid,
  Box,
  Dialog,
  TextField,
  Select,
  Tooltip,
  Progress
} from '@radix-ui/themes';
import { 
  MixerHorizontalIcon, 
  Link2Icon,
  ExclamationTriangleIcon,
  InfoCircledIcon,
  DashboardIcon,
  BellIcon,
  CalendarIcon,
  ActivityIcon
} from '@radix-ui/react-icons';

// Type definitions
interface SensorData {
  temperature: string;
  vibration: string;
  pressure: string;
  powerConsumption: string;
  lastUpdate: string;
  operationalHours: number;
}

interface MaintenanceRecord {
  date: string;
  type: string;
  technician: string;
  duration: string;
}

interface Equipment {
  id: string;
  name: string;
  criticality: string;
  lastService: string;
  status: string;
  nextDue: string;
  iot: boolean;
  sensorData: SensorData | null;
  maintenanceHistory: MaintenanceRecord[];
}

interface IotStats {
  connectedDevices: number;
  totalDevices: number;
  uptime: number;
  alerts: number;
}

// Mock IoT sensor data generator
const generateSensorData = (): SensorData => {
  return {
    temperature: `${Math.floor(20 + Math.random() * 15)}°C`,
    vibration: `${(0.5 + Math.random() * 3).toFixed(1)}mm/s`,
    pressure: `${(10 + Math.random() * 10).toFixed(1)}psi`,
    powerConsumption: `${(2 + Math.random() * 5).toFixed(1)}kW`,
    lastUpdate: `${Math.floor(1 + Math.random() * 10)} minutes ago`,
    operationalHours: Math.floor(100 + Math.random() * 5000)
  };
};

// Equipment data with realistic IoT information
const equipmentData: Equipment[] = [
  { 
    id: 'EQ00001', 
    name: 'Conveyor Belt System', 
    criticality: 'Critical', 
    lastService: '2025-04-01', 
    status: 'Operational', 
    nextDue: 'Monthly', 
    iot: true,
    sensorData: generateSensorData(),
    maintenanceHistory: [
      { date: '2025-04-01', type: 'Preventive', technician: 'John Smith', duration: '2 hours' },
      { date: '2025-03-01', type: 'Preventive', technician: 'Sarah Johnson', duration: '1.5 hours' }
    ]
  },
  { 
    id: 'EQ00002', 
    name: 'Bottle Gate Mechanism', 
    criticality: 'Critical', 
    lastService: '2025-04-05', 
    status: 'Operational', 
    nextDue: 'Weekly', 
    iot: true,
    sensorData: generateSensorData(),
    maintenanceHistory: [
      { date: '2025-04-05', type: 'Calibration', technician: 'Mike Chen', duration: '45 minutes' }
    ]
  },
  { 
    id: 'EQ00003', 
    name: 'Bottle Gripper Assembly', 
    criticality: 'Critical', 
    lastService: '2025-04-07', 
    status: 'Operational', 
    nextDue: 'Weekly', 
    iot: true,
    sensorData: generateSensorData(),
    maintenanceHistory: [
      { date: '2025-04-07', type: 'Lubrication', technician: 'Emily Davis', duration: '30 minutes' }
    ]
  },
  { 
    id: 'EQ00004', 
    name: 'Filling Nozzle', 
    criticality: 'Critical', 
    lastService: '2025-04-07', 
    status: 'Operational', 
    nextDue: 'Weekly', 
    iot: false,
    sensorData: null,
    maintenanceHistory: [
      { date: '2025-04-07', type: 'Cleaning', technician: 'Robert Wilson', duration: '1 hour' }
    ]
  },
  { 
    id: 'EQ00005', 
    name: 'Material Path Gate', 
    criticality: 'Critical', 
    lastService: '2025-04-07', 
    status: 'Operational', 
    nextDue: 'Weekly', 
    iot: false,
    sensorData: null,
    maintenanceHistory: [
      { date: '2025-04-07', type: 'Inspection', technician: 'Lisa Brown', duration: '45 minutes' }
    ]
  }
];

const EquipmentMaintenance = () => {
  const [selectedDevice, setSelectedDevice] = useState<Equipment | null>(null);
  const [iotStats, setIotStats] = useState<IotStats>({
    connectedDevices: 0,
    totalDevices: 0,
    uptime: 0,
    alerts: 0
  });

  // Calculate IoT statistics
  useEffect(() => {
    const connected = equipmentData.filter(item => item.iot).length;
    const total = equipmentData.length;
    const uptime = Math.floor((connected / total) * 100);
    
    const alerts = equipmentData.filter(item => 
      item.iot && item.sensorData && parseFloat(item.sensorData.vibration) > 2.5
    ).length;

    setIotStats({
      connectedDevices: connected,
      totalDevices: total,
      uptime: uptime,
      alerts: alerts
    });
  }, []);

  const IotStatusBadge = ({ connected, sensorData }: { connected: boolean; sensorData: SensorData | null }) => {
    if (connected && sensorData) {
      const isAlert = parseFloat(sensorData.vibration) > 2.5;
      
      return (
        <Tooltip content={
          <Box p="2" style={{ maxWidth: '300px' }}>
            <Text size="1" weight="bold">Live IoT Sensor Data:</Text>
            <Text size="1">Temperature: {sensorData.temperature}</Text>
            <Text size="1">Vibration: {sensorData.vibration}</Text>
            <Text size="1">Pressure: {sensorData.pressure}</Text>
            <Text size="1">Power: {sensorData.powerConsumption}</Text>
            <Text size="1" color="gray">Last update: {sensorData.lastUpdate}</Text>
            {isAlert && (
              <Text size="1" color="red" weight="bold">
                <ExclamationTriangleIcon /> High vibration detected!
              </Text>
            )}
          </Box>
        }>
          <Badge color={isAlert ? "red" : "green"} variant="soft">
            <Link2Icon width="12" height="12" /> 
            {isAlert ? "Needs Attention" : "Connected"}
          </Badge>
        </Tooltip>
      );
    } else {
      return (
        <Tooltip content="This device requires manual inspection and data collection">
          <Badge color="gray" variant="soft">
            ❌ Manual Monitoring
          </Badge>
        </Tooltip>
      );
    }
  };

  const calculateHealthScore = (sensorData: SensorData | null): number => {
    if (!sensorData) return 0;
    
    let score = 100;
    
    // Deduct points for high temperature
    const temp = parseInt(sensorData.temperature);
    if (temp > 30) score -= (temp - 30) * 2;
    
    // Deduct points for high vibration
    const vibration = parseFloat(sensorData.vibration);
    if (vibration > 2.0) score -= (vibration - 2.0) * 10;
    
    return Math.max(0, Math.floor(score));
  };

  return (
    <Box p="6">
      <Flex justify="between" align="center" mb="5">
        <Flex align="center" gap="3">
          <Heading size="6">Equipment Maintenance Register</Heading>
          <Button color="green" variant="solid">
            <ActivityIcon /> IoT Dashboard
          </Button>
        </Flex>
        <Flex gap="3">
          <Dialog.Root>
            <Dialog.Trigger>
              <Button variant="soft">
                <MixerHorizontalIcon /> New Work Order
              </Button>
            </Dialog.Trigger>
            <Dialog.Content>
              <Dialog.Title>Create New Work Order</Dialog.Title>
              <Flex direction="column" gap="3">
                <TextField.Root placeholder="Work Order Title" />
                <Select.Root>
                  <Select.Trigger placeholder="Select Equipment" />
                  <Select.Content>
                    {equipmentData.map((item) => (
                      <Select.Item key={item.id} value={item.id}>
                        {item.name} ({item.id})
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
                <Select.Root>
                  <Select.Trigger placeholder="Priority Level" />
                  <Select.Content>
                    <Select.Item value="high">High Priority</Select.Item>
                    <Select.Item value="medium">Medium Priority</Select.Item>
                    <Select.Item value="low">Low Priority</Select.Item>
                  </Select.Content>
                </Select.Root>
                <TextField.Root type="date" placeholder="Scheduled Date" />
                <Flex gap="3" justify="end">
                  <Dialog.Close>
                    <Button variant="soft" color="gray">
                      Cancel
                    </Button>
                  </Dialog.Close>
                  <Button>Create Work Order</Button>
                </Flex>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>
        </Flex>
      </Flex>

      {/* IoT Statistics Cards */}
      <Grid columns="4" gap="4" mb="5">
        <Card>
          <Flex direction="column" gap="1">
            <Flex align="center" gap="2">
              <Link2Icon color="blue" />
              <Text size="2">IoT Connected Devices</Text>
            </Flex>
            <Heading size="7">{iotStats.connectedDevices}/{iotStats.totalDevices}</Heading>
            <Progress value={iotStats.uptime} />
            <Text size="1" color="gray">{iotStats.uptime}% IoT Coverage</Text>
          </Flex>
        </Card>
        
        <Card>
          <Flex direction="column" gap="1">
            <Flex align="center" gap="2">
              <DashboardIcon color="green" />
              <Text size="2">System Uptime</Text>
            </Flex>
            <Heading size="7">98.7%</Heading>
            <Text size="1" color="gray">Last 30 days</Text>
          </Flex>
        </Card>
        
        <Card>
          <Flex direction="column" gap="1">
            <Flex align="center" gap="2">
              <BellIcon color="orange" />
              <Text size="2">Active Alerts</Text>
            </Flex>
            <Heading size="7" style={{ color: iotStats.alerts > 0 ? '#ef4444' : 'inherit' }}>
              {iotStats.alerts}
            </Heading>
            <Text size="1" color="gray">Requiring attention</Text>
          </Flex>
        </Card>
        
        <Card>
          <Flex direction="column" gap="1">
            <Flex align="center" gap="2">
              <CalendarIcon color="purple" />
              <Text size="2">Preventive Maintenance</Text>
            </Flex>
            <Heading size="7">12</Heading>
            <Text size="1" color="gray">Scheduled this week</Text>
          </Flex>
        </Card>
      </Grid>

      {/* Main Equipment Table */}
      <Card mb="4">
        <Flex justify="between" align="center" mb="3">
          <Heading size="5">Production Line Equipment</Heading>
          <Text color="gray">{equipmentData.length} total devices</Text>
        </Flex>
        
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Equipment ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Equipment Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Criticality</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>
                <Flex align="center" gap="2">
                  <Link2Icon /> IoT Status
                  <Tooltip content="Internet of Things connection and monitoring status">
                    <InfoCircledIcon style={{ cursor: 'help' }} />
                  </Tooltip>
                </Flex>
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Health Score</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Last Service</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Next Due</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {equipmentData.map((item) => {
              const healthScore = calculateHealthScore(item.sensorData);
              const isHealthy = healthScore >= 80;
              const needsAttention = healthScore < 80 && healthScore >= 60;
              const isCritical = healthScore < 60;
              
              return (
                <Table.Row 
                  key={item.id} 
                  style={{ 
                    cursor: item.iot ? 'pointer' : 'default',
                    backgroundColor: item.iot ? '#f8fafc' : 'white'
                  }}
                  onClick={() => item.iot && setSelectedDevice(item)}
                >
                  <Table.Cell>{item.id}</Table.Cell>
                  <Table.Cell>
                    <Flex align="center" gap="2">
                      <Text>{item.name}</Text>
                      {item.iot && (
                        <Badge size="1" color="blue" variant="soft">
                          IoT
                        </Badge>
                      )}
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge color="red" variant="soft">{item.criticality}</Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <IotStatusBadge connected={item.iot} sensorData={item.sensorData} />
                  </Table.Cell>
                  <Table.Cell>
                    {item.iot && item.sensorData ? (
                      <Flex align="center" gap="2">
                        <Progress 
                          value={healthScore} 
                          color={
                            isCritical ? "red" : 
                            needsAttention ? "orange" : "green"
                          } 
                          style={{ width: '60px' }} 
                        />
                        <Text size="2" weight="bold">{healthScore}%</Text>
                      </Flex>
                    ) : (
                      <Text size="2" color="gray">N/A</Text>
                    )}
                  </Table.Cell>
                  <Table.Cell>{item.lastService}</Table.Cell>
                  <Table.Cell>
                    <Badge color="green" variant="soft">{item.status}</Badge>
                  </Table.Cell>
                  <Table.Cell>{item.nextDue}</Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Root>
      </Card>

      {/* IoT Device Details Dialog */}
      <Dialog.Root open={!!selectedDevice} onOpenChange={() => setSelectedDevice(null)}>
        {selectedDevice && (
          <Dialog.Content style={{ maxWidth: '800px' }}>
            <Dialog.Title>
              <Flex align="center" gap="2">
                <Link2Icon /> IoT Device Details - {selectedDevice.name}
              </Flex>
            </Dialog.Title>
            
            <Grid columns="2" gap="4" mt="4">
              <Card>
                <Heading size="4" mb="3">Real-time Sensor Data</Heading>
                <Flex direction="column" gap="3">
                  <Flex justify="between">
                    <Text size="2">Temperature</Text>
                    <Text weight="bold">{selectedDevice.sensorData?.temperature || 'N/A'}</Text>
                  </Flex>
                  <Flex justify="between">
                    <Text size="2">Vibration Level</Text>
                    <Text weight="bold" color={selectedDevice.sensorData && parseFloat(selectedDevice.sensorData.vibration) > 2.5 ? "red" : "green"}>
                      {selectedDevice.sensorData?.vibration || 'N/A'}
                    </Text>
                  </Flex>
                  <Flex justify="between">
                    <Text size="2">Pressure</Text>
                    <Text weight="bold">{selectedDevice.sensorData?.pressure || 'N/A'}</Text>
                  </Flex>
                  <Flex justify="between">
                    <Text size="2">Power Consumption</Text>
                    <Text weight="bold">{selectedDevice.sensorData?.powerConsumption || 'N/A'}</Text>
                  </Flex>
                  <Flex justify="between">
                    <Text size="2">Operational Hours</Text>
                    <Text weight="bold">{selectedDevice.sensorData?.operationalHours.toLocaleString() || 'N/A'} hours</Text>
                  </Flex>
                  <Flex justify="between">
                    <Text size="2">Last Data Update</Text>
                    <Text size="2" color="gray">{selectedDevice.sensorData?.lastUpdate || 'N/A'}</Text>
                  </Flex>
                </Flex>
              </Card>

              <Card>
                <Heading size="4" mb="3">Device Health & Analytics</Heading>
                <Flex direction="column" gap="3">
                  <Flex direction="column" gap="1">
                    <Flex justify="between">
                      <Text size="2">Health Score</Text>
                      <Text weight="bold">{calculateHealthScore(selectedDevice.sensorData)}%</Text>
                    </Flex>
                    <Progress 
                      value={calculateHealthScore(selectedDevice.sensorData)} 
                      color={
                        calculateHealthScore(selectedDevice.sensorData) < 60 ? "red" : 
                        calculateHealthScore(selectedDevice.sensorData) < 80 ? "orange" : "green"
                      } 
                    />
                  </Flex>
                  
                  <Box p="3" style={{ background: '#f0f9ff', borderRadius: '8px' }}>
                    <Text size="2" weight="bold" mb="2">IoT Benefits:</Text>
                    <Text size="1">• Real-time performance monitoring</Text>
                    <Text size="1">• Predictive maintenance alerts</Text>
                    <Text size="1">• 45% reduction in unplanned downtime</Text>
                    <Text size="1">• Automated maintenance scheduling</Text>
                    <Text size="1">• Remote diagnostics and troubleshooting</Text>
                  </Box>

                  <Button variant="soft">
                    <BellIcon /> Set Up Custom Alerts
                  </Button>
                </Flex>
              </Card>
            </Grid>

            <Card mt="4">
              <Heading size="4" mb="3">Maintenance History</Heading>
              <Table.Root>
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Type</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Technician</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Duration</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {selectedDevice.maintenanceHistory.map((record: MaintenanceRecord, index: number) => (
                    <Table.Row key={index}>
                      <Table.Cell>{record.date}</Table.Cell>
                      <Table.Cell>{record.type}</Table.Cell>
                      <Table.Cell>{record.technician}</Table.Cell>
                      <Table.Cell>{record.duration}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Card>

            <Flex gap="3" mt="4" justify="end">
              <Button variant="soft" color="gray" onClick={() => setSelectedDevice(null)}>
                Close
              </Button>
              <Button>
                <CalendarIcon /> Schedule Maintenance
              </Button>
            </Flex>
          </Dialog.Content>
        )}
      </Dialog.Root>
    </Box>
  );
};

export default EquipmentMaintenance;
