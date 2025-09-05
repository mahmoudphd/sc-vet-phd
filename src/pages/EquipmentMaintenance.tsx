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
  Progress,
  IconButton
} from '@radix-ui/themes';
import { 
  MixerHorizontalIcon, 
  Link2Icon,
  ExclamationTriangleIcon,
  InfoCircledIcon,
  DashboardIcon,
  BellIcon,
  CalendarIcon,
  ActivityLogIcon,
  Cross2Icon,
  ClockIcon,
  PersonIcon
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
  status: string;
}

interface Equipment {
  id: string;
  name: string;
  nameEn: string;
  criticality: string;
  lastService: string;
  status: string;
  nextDue: string;
  iot: boolean;
  sensorData: SensorData | null;
  maintenanceHistory: MaintenanceRecord[];
  maintenanceType: string;
  maintenanceFrequency: string;
  estimatedTime: string;
  partsCount: number;
}

interface IotStats {
  connectedDevices: number;
  totalDevices: number;
  uptime: number;
  alerts: number;
}

// Helper function to generate future dates based on frequency
const generateNextDueDate = (lastService: string, frequency: string): string => {
  const lastDate = new Date(lastService);
  const nextDate = new Date(lastDate);
  
  switch(frequency) {
    case 'Daily':
      nextDate.setDate(nextDate.getDate() + 1);
      break;
    case 'Weekly':
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case 'Monthly':
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case 'Semi-Annual':
      nextDate.setMonth(nextDate.getMonth() + 6);
      break;
    default:
      nextDate.setMonth(nextDate.getMonth() + 1);
  }
  
  return nextDate.toISOString().split('T')[0];
};

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

// Equipment data with maintenance information
const equipmentData: Equipment[] = [
  { 
    id: 'EQ00001', 
    name: 'سير العبوات', 
    nameEn: 'Conveyor Belt',
    criticality: 'Critical', 
    lastService: '2025-09-05', 
    status: 'Operational', 
    nextDue: '', 
    iot: true,
    sensorData: generateSensorData(),
    maintenanceHistory: [
      { 
        date: '2025-09-05', 
        type: 'Lubrication', 
        technician: 'Mohamed Ahmed', 
        duration: '2 hours', 
        status: 'Completed'
      }
    ],
    maintenanceType: 'Lubrication',
    maintenanceFrequency: 'Monthly',
    estimatedTime: '1.5 hours',
    partsCount: 1
  },
  { 
    id: 'EQ00002', 
    name: 'بوابة حجز العبوات', 
    nameEn: 'Bottle Stopping Gate',
    criticality: 'Critical', 
    lastService: '2025-09-10', 
    status: 'Operational', 
    nextDue: '', 
    iot: true,
    sensorData: generateSensorData(),
    maintenanceHistory: [
      { 
        date: '2025-09-10', 
        type: 'Inspection', 
        technician: 'Mohamed Ahmed', 
        duration: '45 minutes', 
        status: 'Completed'
      }
    ],
    maintenanceType: 'Inspection',
    maintenanceFrequency: 'Weekly',
    estimatedTime: '45 minutes',
    partsCount: 2
  },
  { 
    id: 'EQ00003', 
    name: 'ماسك العبوات', 
    nameEn: 'Bottle Gripper',
    criticality: 'Critical', 
    lastService: '2025-09-12', 
    status: 'Needs Calibration', 
    nextDue: '', 
    iot: true,
    sensorData: generateSensorData(),
    maintenanceHistory: [
      { 
        date: '2025-09-12', 
        type: 'Inspection', 
        technician: 'Mohamed Ahmed', 
        duration: '30 minutes', 
        status: 'Completed'
      }
    ],
    maintenanceType: 'Inspection',
    maintenanceFrequency: 'Weekly',
    estimatedTime: '45 minutes',
    partsCount: 1
  },
  { 
    id: 'EQ00004', 
    name: 'نوزل التعبئة', 
    nameEn: 'Filling Nozzle',
    criticality: 'Critical', 
    lastService: '2025-09-15', 
    status: 'Operational', 
    nextDue: '', 
    iot: false,
    sensorData: null,
    maintenanceHistory: [
      { 
        date: '2025-09-15', 
        type: 'Inspection', 
        technician: 'Mohamed Ahmed', 
        duration: '1 hour', 
        status: 'Completed'
      }
    ],
    maintenanceType: 'Inspection',
    maintenanceFrequency: 'Weekly',
    estimatedTime: '1 hour',
    partsCount: 2
  },
  { 
    id: 'EQ00005', 
    name: 'بوابة مسار الخامة', 
    nameEn: 'Raw Material Path Gate',
    criticality: 'Critical', 
    lastService: '2025-09-14', 
    status: 'Operational', 
    nextDue: '', 
    iot: false,
    sensorData: null,
    maintenanceHistory: [
      { 
        date: '2025-09-14', 
        type: 'Inspection', 
        technician: 'Mohamed Ahmed', 
        duration: '45 minutes', 
        status: 'Completed'
      }
    ],
    maintenanceType: 'Inspection',
    maintenanceFrequency: 'Weekly',
    estimatedTime: '45 minutes',
    partsCount: 2
  },
  { 
    id: 'EQ00006', 
    name: 'بستم التعبئة', 
    nameEn: 'Filling Piston',
    criticality: 'Critical', 
    lastService: '2025-09-08', 
    status: 'Maintenance Needed', 
    nextDue: '', 
    iot: false,
    sensorData: null,
    maintenanceHistory: [
      { 
        date: '2025-09-08', 
        type: 'Inspection', 
        technician: 'Mohamed Ahmed', 
        duration: '2 hours', 
        status: 'Completed'
      }
    ],
    maintenanceType: 'Inspection',
    maintenanceFrequency: 'Weekly',
    estimatedTime: '1.5 hours',
    partsCount: 2
  },
  { 
    id: 'EQ00007', 
    name: 'أسطوانة التعبئة', 
    nameEn: 'Filling Cylinder',
    criticality: 'Critical', 
    lastService: '2025-06-15', 
    status: 'Operational', 
    nextDue: '', 
    iot: false,
    sensorData: null,
    maintenanceHistory: [
      { 
        date: '2025-06-15', 
        type: 'Inspection', 
        technician: 'Mohamed Ahmed', 
        duration: '4 hours', 
        status: 'Completed'
      }
    ],
    maintenanceType: 'Inspection',
    maintenanceFrequency: 'Semi-Annual',
    estimatedTime: '3 hours',
    partsCount: 2
  },
  { 
    id: 'EQ00008', 
    name: 'هوبر الماكينة', 
    nameEn: 'Machine Hopper',
    criticality: 'Critical', 
    lastService: '2025-06-20', 
    status: 'Operational', 
    nextDue: '', 
    iot: false,
    sensorData: null,
    maintenanceHistory: [
      { 
        date: '2025-06-20', 
        type: 'Inspection', 
        technician: 'Mohamed Ahmed', 
        duration: '2 hours', 
        status: 'Completed'
      }
    ],
    maintenanceType: 'Inspection',
    maintenanceFrequency: 'Semi-Annual',
    estimatedTime: '2 hours',
    partsCount: 1
  },
  { 
    id: 'EQ00009', 
    name: 'حساس العبوات', 
    nameEn: 'Bottle Sensor',
    criticality: 'Critical', 
    lastService: '2025-08-25', 
    status: 'Needs Cleaning', 
    nextDue: '', 
    iot: true,
    sensorData: generateSensorData(),
    maintenanceHistory: [
      { 
        date: '2025-08-25', 
        type: 'Calibration', 
        technician: 'Mohamed Ahmed', 
        duration: '1 hour', 
        status: 'Completed'
      }
    ],
    maintenanceType: 'Calibration',
    maintenanceFrequency: 'Monthly',
    estimatedTime: '45 minutes',
    partsCount: 2
  },
  { 
    id: 'EQ00010', 
    name: 'حساس الموضع', 
    nameEn: 'Position Sensor',
    criticality: 'Critical', 
    lastService: '2025-08-28', 
    status: 'Operational', 
    nextDue: '', 
    iot: true,
    sensorData: generateSensorData(),
    maintenanceHistory: [
      { 
        date: '2025-08-28', 
        type: 'Calibration', 
        technician: 'Mohamed Ahmed', 
        duration: '45 minutes', 
        status: 'Completed'
      }
    ],
    maintenanceType: 'Calibration',
    maintenanceFrequency: 'Monthly',
    estimatedTime: '45 minutes',
    partsCount: 4
  },
  { 
    id: 'EQ00011', 
    name: 'سيرفو موتور التعبئة', 
    nameEn: 'Filling Servo Motor',
    criticality: 'Critical', 
    lastService: '2025-08-30', 
    status: 'Operational', 
    nextDue: '', 
    iot: false,
    sensorData: null,
    maintenanceHistory: [
      { 
        date: '2025-08-30', 
        type: 'Inspection', 
        technician: 'Mohamed Ahmed', 
        duration: '1.5 hours', 
        status: 'Completed'
      }
    ],
    maintenanceType: 'Inspection',
    maintenanceFrequency: 'Monthly',
    estimatedTime: '1 hour',
    partsCount: 1
  },
  { 
    id: 'EQ00012', 
    name: 'سيرفو موتور النوزل', 
    nameEn: 'Nozzle Servo Motor',
    criticality: 'Critical', 
    lastService: '2025-08-30', 
    status: 'Operational', 
    nextDue: '', 
    iot: false,
    sensorData: null,
    maintenanceHistory: [
      { 
        date: '2025-08-30', 
        type: 'Inspection', 
        technician: 'Mohamed Ahmed', 
        duration: '1.5 hours', 
        status: 'Completed'
      }
    ],
    maintenanceType: 'Inspection',
    maintenanceFrequency: 'Monthly',
    estimatedTime: '1 hour',
    partsCount: 1
  }
];

// Helper Components
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

const MaintenanceTypeBadge = ({ type }: { type: string }) => {
  let color: "red" | "green" | "blue" | "orange" | "purple" = "blue";
  
  if (type === 'Cleaning') color = "green";
  if (type === 'Lubrication') color = "orange";
  if (type === 'Calibration') color = "purple";
  if (type === 'Inspection') color = "blue";
  
  return (
    <Badge color={color} variant="soft" size="1">
      {type}
    </Badge>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  let color: "red" | "green" | "orange" = "green";
  let icon = "🟢";
  
  if (status === 'Maintenance Needed') {
    color = "red";
    icon = "🔴";
  } else if (status === 'Needs Cleaning' || status === 'Needs Calibration') {
    color = "orange";
    icon = "🟡";
  }
  
  return (
    <Badge color={color} variant="soft">
      {icon} {status}
    </Badge>
  );
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

// New Work Order Dialog Component
const NewWorkOrderDialog = () => (
  <Dialog.Root>
    <Dialog.Trigger>
      <Button variant="soft">
        <MixerHorizontalIcon /> New Work Order
      </Button>
    </Dialog.Trigger>
    <Dialog.Content style={{ maxWidth: '500px' }}>
      <Flex justify="between" align="center" mb="3">
        <Dialog.Title>Create New Work Order</Dialog.Title>
        <Dialog.Close>
          <Button variant="ghost" color="gray">
            <Cross2Icon />
          </Button>
        </Dialog.Close>
      </Flex>
      <Flex direction="column" gap="3">
        <label>
          <Text as="div" size="2" weight="bold" mb="1">Work Order Title</Text>
          <TextField.Root placeholder="Enter work order title" />
        </label>
        
        <label>
          <Text as="div" size="2" weight="bold" mb="1">Select Equipment</Text>
          <Select.Root>
            <Select.Trigger />
            <Select.Content>
              {equipmentData.map((item) => (
                <Select.Item key={item.id} value={item.id}>
                  {item.nameEn} ({item.id})
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </label>
        
        <label>
          <Text as="div" size="2" weight="bold" mb="1">Maintenance Type</Text>
          <Select.Root>
            <Select.Trigger />
            <Select.Content>
              <Select.Item value="cleaning">Cleaning</Select.Item>
              <Select.Item value="inspection">Inspection</Select.Item>
              <Select.Item value="lubrication">Lubrication</Select.Item>
              <Select.Item value="calibration">Calibration</Select.Item>
            </Select.Content>
          </Select.Root>
        </label>
        
        <label>
          <Text as="div" size="2" weight="bold" mb="1">Priority Level</Text>
          <Select.Root>
            <Select.Trigger />
            <Select.Content>
              <Select.Item value="high">High Priority</Select.Item>
              <Select.Item value="medium">Medium Priority</Select.Item>
              <Select.Item value="low">Low Priority</Select.Item>
            </Select.Content>
          </Select.Root>
        </label>
        
        <label>
          <Text as="div" size="2" weight="bold" mb="1">Scheduled Date</Text>
          <TextField.Root type="date" />
        </label>
        
        <Flex gap="3" justify="end" mt="3">
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
);

// Equipment Details Dialog Component
const EquipmentDetailsDialog = ({ selectedDevice, setSelectedDevice }: { 
  selectedDevice: Equipment | null; 
  setSelectedDevice: (device: Equipment | null) => void;
}) => (
  <Dialog.Root open={!!selectedDevice} onOpenChange={() => setSelectedDevice(null)}>
    {selectedDevice && (
      <Dialog.Content style={{ maxWidth: '800px' }}>
        <Flex justify="between" align="center" mb="3">
          <Dialog.Title>
            <Flex align="center" gap="2">
              {selectedDevice.iot && <Link2Icon />}
              {selectedDevice.nameEn} - {selectedDevice.id}
            </Flex>
          </Dialog.Title>
          <Dialog.Close>
            <Button variant="ghost" color="gray">
              <Cross2Icon />
            </Button>
          </Dialog.Close>
        </Flex>
        
        <Grid columns="2" gap="4" mt="4">
          <Card>
            <Heading size="4" mb="3">Maintenance Information</Heading>
            <Flex direction="column" gap="3">
              <Flex justify="between">
                <Text size="2">Maintenance Type</Text>
                <MaintenanceTypeBadge type={selectedDevice.maintenanceType} />
              </Flex>
              <Flex justify="between">
                <Text size="2">Frequency</Text>
                <Text weight="bold">{selectedDevice.maintenanceFrequency}</Text>
              </Flex>
              <Flex justify="between">
                <Text size="2">Estimated Time</Text>
                <Text weight="bold">{selectedDevice.estimatedTime}</Text>
              </Flex>
              <Flex justify="between">
                <Text size="2">Parts Count</Text>
                <Text weight="bold">{selectedDevice.partsCount}</Text>
              </Flex>
              <Flex justify="between">
                <Text size="2">Next Due</Text>
                <Badge color="blue" variant="soft">{selectedDevice.nextDue}</Badge>
              </Flex>
              <Flex justify="between">
                <Text size="2">Last Service</Text>
                <Text weight="bold">{selectedDevice.lastService}</Text>
              </Flex>
              <Flex justify="between">
                <Text size="2">Status</Text>
                <StatusBadge status={selectedDevice.status} />
              </Flex>
            </Flex>
          </Card>

          {selectedDevice.iot && selectedDevice.sensorData && (
            <Card>
              <Heading size="4" mb="3">Real-time Sensor Data</Heading>
              <Flex direction="column" gap="3">
                <Flex justify="between">
                  <Text size="2">Temperature</Text>
                  <Text weight="bold">{selectedDevice.sensorData.temperature}</Text>
                </Flex>
                <Flex justify="between">
                  <Text size="2">Vibration Level</Text>
                  <Text weight="bold" color={parseFloat(selectedDevice.sensorData.vibration) > 2.5 ? "red" : "green"}>
                    {selectedDevice.sensorData.vibration}
                  </Text>
                </Flex>
                <Flex justify="between">
                  <Text size="2">Pressure</Text>
                  <Text weight="bold">{selectedDevice.sensorData.pressure}</Text>
                </Flex>
                <Flex justify="between">
                  <Text size="2">Power Consumption</Text>
                  <Text weight="bold">{selectedDevice.sensorData.powerConsumption}</Text>
                </Flex>
                <Flex justify="between">
                  <Text size="2">Operational Hours</Text>
                  <Text weight="bold">{selectedDevice.sensorData.operationalHours.toLocaleString()} hours</Text>
                </Flex>
              </Flex>
            </Card>
          )}
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
                <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {selectedDevice.maintenanceHistory.map((record: MaintenanceRecord, index: number) => (
                <Table.Row key={index}>
                  <Table.Cell>{record.date}</Table.Cell>
                  <Table.Cell>
                    <Badge variant="soft">{record.type}</Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Flex align="center" gap="2">
                      <PersonIcon />
                      {record.technician}
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>
                    <Flex align="center" gap="2">
                      <ClockIcon />
                      {record.duration}
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge color="green" variant="soft">{record.status}</Badge>
                  </Table.Cell>
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
);

// IoT Statistics Cards Component
const IotStatisticsCards = ({ iotStats }: { iotStats: IotStats }) => (
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
);

// Main Component
const EquipmentMaintenance = () => {
  const [selectedDevice, setSelectedDevice] = useState<Equipment | null>(null);
  const [iotStats, setIotStats] = useState<IotStats>({
    connectedDevices: 0,
    totalDevices: 0,
    uptime: 0,
    alerts: 0
  });

  // Calculate next due dates and IoT statistics
  useEffect(() => {
    // Calculate next due dates for each equipment
    equipmentData.forEach(item => {
      item.nextDue = generateNextDueDate(item.lastService, item.maintenanceFrequency);
    });

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

  return (
    <Box p="6">
      <Flex justify="between" align="center" mb="5">
        <Flex align="center" gap="3">
          <Heading size="6">Equipment Maintenance Register</Heading>
          <Button color="green" variant="solid">
            <ActivityLogIcon /> IoT Dashboard
          </Button>
        </Flex>
        <Flex gap="3">
          <NewWorkOrderDialog />
        </Flex>
      </Flex>

      <IotStatisticsCards iotStats={iotStats} />

      {/* Main Equipment Table */}
      <Card mb="4">
        <Flex justify="between" align="center" mb="3">
          <Heading size="5">Liquid Filling and Packaging Machine Components</Heading>
          <Text color="gray">{equipmentData.length} total components</Text>
        </Flex>
        
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell width="8%">ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell width="22%">Component</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell width="15%">Maintenance</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell width="12%">Frequency</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell width="10%">
                <Flex align="center" gap="2">
                  <Link2Icon /> Status
                </Flex>
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell width="13%">Health</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell width="10%">Status</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell width="10%">Action</Table.ColumnHeaderCell>
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
                    cursor: 'pointer',
                    backgroundColor: item.iot ? '#f8fafc' : 'white'
                  }}
                  onClick={() => setSelectedDevice(item)}
                >
                  <Table.Cell>
                    <Text size="2" weight="bold">{item.id}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Flex direction="column">
                      <Text weight="medium">{item.nameEn}</Text>
                      <Text size="1" color="gray">{item.name}</Text>
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>
                    <MaintenanceTypeBadge type={item.maintenanceType} />
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="2">{item.maintenanceFrequency}</Text>
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
                  <Table.Cell>
                    <StatusBadge status={item.status} />
                  </Table.Cell>
                  <Table.Cell>
                    <Button size="1" variant="ghost">
                      <InfoCircledIcon /> Details
                    </Button>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Root>
      </Card>

      <EquipmentDetailsDialog selectedDevice={selectedDevice} setSelectedDevice={setSelectedDevice} />
    </Box>
  );
};

export default EquipmentMaintenance;
