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
  Switch
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
  MagnifyingGlassIcon
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

// Equipment data with Arabic part names only
const equipmentData: Equipment[] = [
  { 
    id: 'EQ00001', 
    name: 'سير العبوات', 
    criticality: 'Critical', 
    lastService: '2025-04-01', 
    status: 'Operational', 
    nextDue: 'Monthly', 
    iot: true,
    sensorData: generateSensorData(),
    maintenanceHistory: [
      { date: '2025-04-01', type: 'Preventive', technician: 'John Smith', duration: '2 hours' }
    ]
  },
  { 
    id: 'EQ00002', 
    name: 'بوابة حجز العبوات', 
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
    name: 'ماسك العبوات', 
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
    name: 'نوزل التعبئة', 
    criticality: 'Critical', 
    lastService: '2025-04-07', 
    status: 'Operational', 
    nextDue: 'Weekly', 
    iot: false,
    sensorData: null,
    maintenanceHistory: [
      { date: '2025-04-07', type: 'Cleaning', technician: 'Robert Wilson', duration: '1 hour' }
    ]
  }
];

const EquipmentMaintenance = () => {
  const [selectedDevice, setSelectedDevice] = useState<Equipment | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyConnected, setShowOnlyConnected] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const filteredEquipment = equipmentData.filter(equipment => {
    const matchesSearch = equipment.name.includes(searchTerm) || equipment.id.includes(searchTerm);
    const matchesFilter = showOnlyConnected ? equipment.iot : true;
    return matchesSearch && matchesFilter;
  });

  const sortedEquipment = [...filteredEquipment].sort((a, b) => {
    if (!sortConfig) return 0;
    
    const aValue = a[sortConfig.key as keyof Equipment];
    const bValue = b[sortConfig.key as keyof Equipment];
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const IotStatusBadge = ({ connected }: { connected: boolean }) => {
    return connected ? (
      <Badge color="green" variant="soft" style={{ padding: '4px 8px', fontSize: '12px' }}>
        <Link2Icon width="12" height="12" /> Connected
      </Badge>
    ) : (
      <Badge color="gray" variant="soft" style={{ padding: '4px 8px', fontSize: '12px' }}>
        ❌ Manual
      </Badge>
    );
  };

  return (
    <Box p="6" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <Flex justify="between" align="center" mb="6">
        <Flex direction="column" gap="1">
          <Heading size="7" weight="bold" style={{ color: '#1f2937' }}>
            Equipment Maintenance
          </Heading>
          <Text size="2" color="gray">
            Monitor and manage production line equipment
          </Text>
        </Flex>
        <Button color="blue" size="3">
          <ActivityLogIcon /> Dashboard
        </Button>
      </Flex>

      {/* Stats Cards */}
      <Grid columns="4" gap="4" mb="6">
        <Card style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)' }}>
          <Flex direction="column" gap="2">
            <Flex align="center" gap="2">
              <Box style={{ padding: '8px', background: '#3b82f620', borderRadius: '8px' }}>
                <DashboardIcon color="#3b82f6" />
              </Box>
              <Text size="2" weight="medium">Total Equipment</Text>
            </Flex>
            <Heading size="7" style={{ color: '#1e40af' }}>{equipmentData.length}</Heading>
          </Flex>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' }}>
          <Flex direction="column" gap="2">
            <Flex align="center" gap="2">
              <Box style={{ padding: '8px', background: '#22c55e20', borderRadius: '8px' }}>
                <Link2Icon color="#22c55e" />
              </Box>
              <Text size="2" weight="medium">IoT Connected</Text>
            </Flex>
            <Heading size="7" style={{ color: '#166534' }}>
              {equipmentData.filter(e => e.iot).length}
            </Heading>
          </Flex>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' }}>
          <Flex direction="column" gap="2">
            <Flex align="center" gap="2">
              <Box style={{ padding: '8px', background: '#f59e0b20', borderRadius: '8px' }}>
                <BellIcon color="#f59e0b" />
              </Box>
              <Text size="2" weight="medium">Maintenance Due</Text>
            </Flex>
            <Heading size="7" style={{ color: '#92400e' }}>3</Heading>
          </Flex>
        </Card>

        <Card style={{ background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)' }}>
          <Flex direction="column" gap="2">
            <Flex align="center" gap="2">
              <Box style={{ padding: '8px', background: '#ef444420', borderRadius: '8px' }}>
                <ExclamationTriangleIcon color="#ef4444" />
              </Box>
              <Text size="2" weight="medium">Critical Alerts</Text>
            </Flex>
            <Heading size="7" style={{ color: '#dc2626' }}>1</Heading>
          </Flex>
        </Card>
      </Grid>

      {/* Filters and Search */}
      <Card mb="5">
        <Flex justify="between" align="center" p="4">
          <Flex align="center" gap="4">
            <Text weight="medium">Filters:</Text>
            <Flex align="center" gap="2">
              <Switch 
                checked={showOnlyConnected}
                onCheckedChange={setShowOnlyConnected}
              />
              <Text size="2">Show only IoT connected</Text>
            </Flex>
          </Flex>
          
          <TextField.Root
            placeholder="Search equipment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '300px' }}
          >
            <TextField.Slot>
              <MagnifyingGlassIcon />
            </TextField.Slot>
          </TextField.Root>
        </Flex>
      </Card>

      {/* Equipment Table */}
      <Card>
        <Box style={{ overflowX: 'auto' }}>
          <Table.Root variant="ghost" size="2">
            <Table.Header>
              <Table.Row style={{ background: '#f8fafc' }}>
                <Table.ColumnHeaderCell 
                  style={{ fontWeight: 600, padding: '16px', cursor: 'pointer' }}
                  onClick={() => handleSort('id')}
                >
                  ID {sortConfig?.key === 'id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell 
                  style={{ fontWeight: 600, padding: '16px', cursor: 'pointer' }}
                  onClick={() => handleSort('name')}
                >
                  Equipment {sortConfig?.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell style={{ fontWeight: 600, padding: '16px' }}>
                  Status
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell style={{ fontWeight: 600, padding: '16px' }}>
                  IoT
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell style={{ fontWeight: 600, padding: '16px' }}>
                  Last Service
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell style={{ fontWeight: 600, padding: '16px' }}>
                  Next Due
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell style={{ fontWeight: 600, padding: '16px' }}>
                  Actions
                </Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {sortedEquipment.map((item, index) => (
                <Table.Row 
                  key={item.id}
                  style={{ 
                    background: index % 2 === 0 ? 'white' : '#fafafa',
                    borderBottom: '1px solid #f1f5f9'
                  }}
                >
                  <Table.Cell style={{ padding: '16px', fontFamily: 'monospace', fontWeight: 500 }}>
                    {item.id}
                  </Table.Cell>
                  
                  <Table.Cell style={{ padding: '16px' }}>
                    <Flex direction="column" gap="1">
                      <Text weight="medium" style={{ textAlign: 'right', direction: 'rtl' }}>
                        {item.name}
                      </Text>
                      <Text size="1" color="gray">
                        {item.criticality}
                      </Text>
                    </Flex>
                  </Table.Cell>
                  
                  <Table.Cell style={{ padding: '16px' }}>
                    <Badge color="green" variant="soft" style={{ fontSize: '12px' }}>
                      {item.status}
                    </Badge>
                  </Table.Cell>
                  
                  <Table.Cell style={{ padding: '16px' }}>
                    <IotStatusBadge connected={item.iot} />
                  </Table.Cell>
                  
                  <Table.Cell style={{ padding: '16px' }}>
                    <Text size="2">{item.lastService}</Text>
                  </Table.Cell>
                  
                  <Table.Cell style={{ padding: '16px' }}>
                    <Text size="2" weight="medium">{item.nextDue}</Text>
                  </Table.Cell>
                  
                  <Table.Cell style={{ padding: '16px' }}>
                    <Flex gap="2">
                      <Button 
                        size="1" 
                        variant="ghost"
                        onClick={() => setSelectedDevice(item)}
                      >
                        View
                      </Button>
                      <Button size="1" variant="soft">
                        Schedule
                      </Button>
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>

        {sortedEquipment.length === 0 && (
          <Box p="6" style={{ textAlign: 'center' }}>
            <Text color="gray">No equipment found matching your criteria</Text>
          </Box>
        )}
      </Card>

      {/* Equipment Details Dialog */}
      <Dialog.Root open={!!selectedDevice} onOpenChange={() => setSelectedDevice(null)}>
        {selectedDevice && (
          <Dialog.Content style={{ maxWidth: '600px' }}>
            <Dialog.Title>
              <Flex align="center" gap="2">
                Equipment Details - {selectedDevice.name}
              </Flex>
            </Dialog.Title>
            
            <Grid columns="2" gap="4" mt="4">
              <Box>
                <Text size="2" weight="bold" color="gray">Equipment ID</Text>
                <Text>{selectedDevice.id}</Text>
              </Box>
              <Box>
                <Text size="2" weight="bold" color="gray">Criticality</Text>
                <Text>{selectedDevice.criticality}</Text>
              </Box>
              <Box>
                <Text size="2" weight="bold" color="gray">Status</Text>
                <Text>{selectedDevice.status}</Text>
              </Box>
              <Box>
                <Text size="2" weight="bold" color="gray">IoT Connection</Text>
                <IotStatusBadge connected={selectedDevice.iot} />
              </Box>
              <Box>
                <Text size="2" weight="bold" color="gray">Last Service</Text>
                <Text>{selectedDevice.lastService}</Text>
              </Box>
              <Box>
                <Text size="2" weight="bold" color="gray">Next Due</Text>
                <Text>{selectedDevice.nextDue}</Text>
              </Box>
            </Grid>

            <Box mt="4" p="3" style={{ background: '#f8fafc', borderRadius: '8px' }}>
              <Text size="2" weight="bold" mb="2">Maintenance History</Text>
              {selectedDevice.maintenanceHistory.map((record, index) => (
                <Flex key={index} justify="between" mb="2">
                  <Text size="1">{record.date} - {record.type}</Text>
                  <Text size="1" color="gray">{record.duration}</Text>
                </Flex>
              ))}
            </Box>

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
