import React, { useState, useEffect } from 'react';
import {
  Card,
  Flex,
  Heading,
  Table,
  Button,
  TextField,
  Box,
  Text,
  Badge,
  Dialog,
  Select,
  Grid,
  Switch,
  TextArea,
  Container,
  Progress
} from '@radix-ui/themes';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend
} from 'recharts';
import {
  CubeIcon,
  MixerHorizontalIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  LightningBoltIcon,
  LinkBreak2Icon,
  Link2Icon,
  TokensIcon,
  DownloadIcon
} from '@radix-ui/react-icons';

// Types
interface RawMaterial {
  id: string;
  name: string;
  currentStock: number;
  reserved: number;
  minStockLevel: number;
  reorderLevel: number;
  safetyStock: number;
  leadTime: number;
  supplier: string;
  supplierRating: number;
  orderQuantity: number;
  pendingOrders: number;
  lastOrderDate?: string;
  unit: string;
  sensorConnected: boolean;
  lastSensorUpdate?: string;
  sensorReadings?: {
    temperature?: number;
    humidity?: number;
    weight?: number;
  };
  blockchainTx?: string;
  location: string;
  category: 'A' | 'B' | 'C';
}

interface PurchaseOrder {
  id: string;
  materialId: string;
  materialName: string;
  quantity: number;
  supplier: string;
  expectedDelivery: string;
  status: 'pending' | 'approved' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  notes?: string;
  blockchainTx?: string;
  relatedTxHash?: string;
  shippingConditions?: {
    temperature?: number;
    humidity?: number;
  };
}

interface BlockchainTransaction {
  txHash: string;
  timestamp: string;
  materialId: string;
  action: 'order' | 'delivery' | 'adjustment';
  participants: string[];
  relatedTxHash?: string;
  quantity?: number;
}

// Mock IoT Service
class IoTSensorService {
  static async connectToSensor(materialId: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Math.random() > 0.2);
      }, 500);
    });
  }

  static async getSensorReadings(materialId: string): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          temperature: 22 + Math.floor(Math.random() * 10) - 5,
          humidity: 45 + Math.floor(Math.random() * 20) - 10,
          weight: 100 + Math.floor(Math.random() * 50) - 25
        });
      }, 800);
    });
  }
}

// Enhanced Blockchain Service
class BlockchainService {
  private static transactionHistory: Record<string, BlockchainTransaction[]> = {};

  static async recordTransaction(
    materialId: string,
    action: string,
    quantity: number,
    participants: string[],
    relatedTxHash?: string
  ): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
        const timestamp = new Date().toISOString();
        
        const transaction: BlockchainTransaction = {
          txHash,
          timestamp,
          materialId,
          action: action as any,
          participants,
          relatedTxHash,
          quantity
        };

        if (!this.transactionHistory[materialId]) {
          this.transactionHistory[materialId] = [];
        }
        
        this.transactionHistory[materialId].push(transaction);
        resolve(txHash);
      }, 1000);
    });
  }

  static async getTransactionHistory(materialId: string): Promise<BlockchainTransaction[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const history = this.transactionHistory[materialId] || [];
        const sortedHistory = [...history].sort((a, b) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        resolve(sortedHistory);
      }, 1200);
    });
  }
}

// Utility functions
const generateId = (prefix: string) => `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
const today = new Date().toISOString().split('T')[0];
const CATEGORY_COLORS = {
  A: '#3b82f6',
  B: '#10b981',
  C: '#6b7280'
};

const StatusCircle = ({ color }: { color: 'red' | 'green' | 'orange' }) => (
  <div style={{
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    backgroundColor: color,
    display: 'inline-block',
    marginRight: '8px'
  }} />
);

const RawMaterialsInventory = () => {
  // State
  const [materials, setMaterials] = useState<RawMaterial[]>([
    {
      id: generateId('MAT'),
      name: 'Vitamin B1',
      currentStock: 120,
      reserved: 40,
      minStockLevel: 50,
      reorderLevel: 80,
      safetyStock: 30,
      leadTime: 7,
      supplier: 'Supplier X',
      supplierRating: 4.5,
      orderQuantity: 100,
      pendingOrders: 0,
      unit: 'kg',
      sensorConnected: false,
      location: 'Zone 1',
      category: 'A'
    },
    {
      id: generateId('MAT'),
      name: 'Vitamin B2',
      currentStock: 90,
      reserved: 30,
      minStockLevel: 60,
      reorderLevel: 90,
      safetyStock: 40,
      leadTime: 5,
      supplier: 'Supplier Y',
      supplierRating: 3.8,
      orderQuantity: 120,
      pendingOrders: 0,
      unit: 'kg',
      sensorConnected: false,
      location: 'Zone 2',
      category: 'B'
    },
    {
      id: generateId('MAT'),
      name: 'Nicotinamide B3',
      currentStock: 70,
      reserved: 20,
      minStockLevel: 40,
      reorderLevel: 60,
      safetyStock: 20,
      leadTime: 10,
      supplier: 'Supplier Z',
      supplierRating: 4.2,
      orderQuantity: 80,
      pendingOrders: 0,
      unit: 'kg',
      sensorConnected: false,
      location: 'Zone 1',
      category: 'C'
    }
  ]);
  
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<RawMaterial | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [showReorderOnly, setShowReorderOnly] = useState(false);
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [showMaterialDialog, setShowMaterialDialog] = useState(false);
  const [showBlockchainDialog, setShowBlockchainDialog] = useState(false);
  const [newOrder, setNewOrder] = useState<Partial<PurchaseOrder>>({
    status: 'pending',
    orderDate: today
  });
  const [newMaterial, setNewMaterial] = useState<Partial<RawMaterial>>({
    unit: 'kg',
    sensorConnected: false,
    category: 'A'
  });
  const [blockchainData, setBlockchainData] = useState<BlockchainTransaction[]>([]);
  const [isLoadingBlockchain, setIsLoadingBlockchain] = useState(false);
  const [sensorStatus, setSensorStatus] = useState<Record<string, boolean>>({});
  const [isConnectingSensor, setIsConnectingSensor] = useState(false);
  const [locationFilter, setLocationFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState<{key: keyof RawMaterial, direction: 'asc' | 'desc'} | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  // Connect to IoT sensor
  const connectToSensor = async (materialId: string) => {
    setIsConnectingSensor(true);
    try {
      const connected = await IoTSensorService.connectToSensor(materialId);
      if (connected) {
        const readings = await IoTSensorService.getSensorReadings(materialId);
        
        setMaterials(materials.map(m => 
          m.id === materialId ? { 
            ...m, 
            sensorConnected: true,
            lastSensorUpdate: new Date().toISOString(),
            sensorReadings: readings
          } : m
        ));
        
        setSensorStatus(prev => ({ ...prev, [materialId]: true }));
        
        if (readings.weight) {
          const material = materials.find(m => m.id === materialId);
          if (material) {
            const newStock = Math.round(readings.weight);
            if (Math.abs(newStock - material.currentStock) > 5) {
              setMaterials(materials.map(m => 
                m.id === materialId ? { ...m, currentStock: newStock } : m
              ));
            }
          }
        }
      }
    } catch (error) {
      console.error('Sensor connection failed:', error);
    } finally {
      setIsConnectingSensor(false);
    }
  };

  // Record transaction on blockchain
  const recordBlockchainTransaction = async (
    materialId: string,
    action: string,
    quantity: number,
    participants: string[],
    relatedTxHash?: string
  ) => {
    const txHash = await BlockchainService.recordTransaction(
      materialId,
      action,
      quantity,
      participants,
      relatedTxHash
    );
    return txHash;
  };

  // Fetch blockchain history
  const fetchBlockchainHistory = async (materialId: string) => {
    setIsLoadingBlockchain(true);
    try {
      const history = await BlockchainService.getTransactionHistory(materialId);
      setBlockchainData(history);
      setShowBlockchainDialog(true);
    } catch (error) {
      console.error('Failed to fetch blockchain data:', error);
    } finally {
      setIsLoadingBlockchain(false);
    }
  };

  // Generate purchase orders automatically
  const generateAutoOrders = async () => {
    const newOrders: PurchaseOrder[] = [];
    const updatedMaterials = [...materials];

    for (const [index, material] of materials.entries()) {
      const availableStock = material.currentStock - material.reserved;
      if (availableStock <= material.reorderLevel && material.pendingOrders === 0) {
        const orderQuantity = Math.max(
          material.orderQuantity,
          material.minStockLevel + material.safetyStock - availableStock
        );

        const newOrder: PurchaseOrder = {
          id: generateId('PO'),
          materialId: material.id,
          materialName: material.name,
          quantity: orderQuantity,
          supplier: material.supplier,
          expectedDelivery: new Date(
            new Date().setDate(new Date().getDate() + material.leadTime)
          ).toISOString(),
          status: 'pending',
          orderDate: today
        };

        // Record order on blockchain
        const txHash = await recordBlockchainTransaction(
          material.id,
          'order',
          orderQuantity,
          [material.supplier, 'Warehouse Manager']
        );

        newOrder.blockchainTx = txHash;
        newOrders.push(newOrder);
        updatedMaterials[index] = {
          ...material,
          pendingOrders: material.pendingOrders + orderQuantity,
          lastOrderDate: today
        };

        // Simulate delivery after lead time (for demo purposes)
        setTimeout(async () => {
          if (newOrder.status === 'pending' || newOrder.status === 'approved') {
            const deliveryTxHash = await recordBlockchainTransaction(
              material.id,
              'delivery',
              orderQuantity,
              [material.supplier, 'Warehouse Manager'],
              txHash
            );
            
            setOrders(prevOrders => prevOrders.map(o => 
              o.id === newOrder.id ? { ...o, status: 'delivered', blockchainTx: deliveryTxHash } : o
            ));
            
            setMaterials(prevMaterials => prevMaterials.map(m => 
              m.id === material.id ? { 
                ...m, 
                currentStock: m.currentStock + orderQuantity,
                pendingOrders: m.pendingOrders - orderQuantity
              } : m
            ));
          }
        }, material.leadTime * 86400000);
      }
    }

    setOrders([...orders, ...newOrders]);
    setMaterials(updatedMaterials);
  };

  // Update order status
  const updateOrderStatus = async (orderId: string, status: PurchaseOrder['status']) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        const updatedOrder = { ...order, status };
        
        if (status === 'delivered' && order.blockchainTx) {
          recordBlockchainTransaction(
            order.materialId,
            'delivery',
            order.quantity,
            [order.supplier, 'Warehouse Manager'],
            order.blockchainTx
          ).then(txHash => {
            updatedOrder.blockchainTx = txHash;
          });
          
          setMaterials(materials.map(m => 
            m.id === order.materialId ? { 
              ...m, 
              currentStock: m.currentStock + order.quantity,
              pendingOrders: m.pendingOrders - order.quantity
            } : m
          ));
        }
        
        return updatedOrder;
      }
      return order;
    });

    setOrders(updatedOrders);
  };

  // Create manual order
  const createManualOrder = async () => {
    if (!newOrder.materialId || !newOrder.quantity) return;

    const material = materials.find(m => m.id === newOrder.materialId);
    if (!material) return;

    const order: PurchaseOrder = {
      id: generateId('PO'),
      materialId: material.id,
      materialName: material.name,
      quantity: Number(newOrder.quantity),
      supplier: newOrder.supplier || material.supplier,
      expectedDelivery: newOrder.expectedDelivery || 
        new Date(
          new Date().setDate(new Date().getDate() + material.leadTime)
        ).toISOString(),
      status: 'pending',
      orderDate: today,
      notes: newOrder.notes,
      shippingConditions: {
        temperature: material.sensorReadings?.temperature,
        humidity: material.sensorReadings?.humidity
      }
    };

    // Record order on blockchain
    const txHash = await recordBlockchainTransaction(
      material.id,
      'order',
      order.quantity,
      [order.supplier, 'Warehouse Manager']
    );
    order.blockchainTx = txHash;

    setOrders([...orders, order]);
    setMaterials(materials.map(m => 
      m.id === material.id ? { ...m, pendingOrders: m.pendingOrders + order.quantity } : m
    ));
    
    // Simulate delivery after lead time (for demo purposes)
    setTimeout(async () => {
      const deliveryTxHash = await recordBlockchainTransaction(
        material.id,
        'delivery',
        order.quantity,
        [order.supplier, 'Warehouse Manager'],
        txHash
      );
      
      setOrders(prevOrders => prevOrders.map(o => 
        o.id === order.id ? { ...o, status: 'delivered', blockchainTx: deliveryTxHash } : o
      ));
      
      setMaterials(prevMaterials => prevMaterials.map(m => 
        m.id === material.id ? { 
          ...m, 
          currentStock: m.currentStock + order.quantity,
          pendingOrders: m.pendingOrders - order.quantity
        } : m
      ));
    }, material.leadTime * 86400000);

    setShowOrderDialog(false);
    setNewOrder({ status: 'pending', orderDate: today });
  };

  // Add new material
  const addNewMaterial = async () => {
    if (!newMaterial.name || !newMaterial.supplier) return;

    const material: RawMaterial = {
      id: generateId('MAT'),
      name: newMaterial.name,
      currentStock: newMaterial.currentStock || 0,
      reserved: newMaterial.reserved || 0,
      minStockLevel: newMaterial.minStockLevel || 0,
      reorderLevel: newMaterial.reorderLevel || 0,
      safetyStock: newMaterial.safetyStock || 0,
      leadTime: newMaterial.leadTime || 0,
      supplier: newMaterial.supplier,
      supplierRating: 0,
      orderQuantity: newMaterial.orderQuantity || 0,
      pendingOrders: 0,
      unit: newMaterial.unit || 'kg',
      sensorConnected: false,
      location: newMaterial.location || 'Zone 1',
      category: newMaterial.category || 'A'
    };

    // Record initial stock on blockchain
    const txHash = await recordBlockchainTransaction(
      material.id,
      'adjustment',
      material.currentStock,
      ['System', 'Warehouse Manager']
    );
    material.blockchainTx = txHash;

    setMaterials([...materials, material]);
    setShowMaterialDialog(false);
    setNewMaterial({ unit: 'kg', sensorConnected: false, category: 'A' });
  };

  // Calculate inventory metrics
  const criticalMaterials = materials.filter(m => 
    (m.currentStock - m.reserved) <= m.safetyStock
  ).length;

  const reorderNeeded = materials.filter(m => 
    (m.currentStock - m.reserved) <= m.reorderLevel
  ).length;

  const pendingOrdersCount = orders.filter(o => 
    o.status === 'pending' || o.status === 'approved'
  ).length;

  const connectedSensors = materials.filter(m => m.sensorConnected).length;

  // Filter and sort data
  const filteredData = materials
    .filter(material => {
      if (showReorderOnly && (material.currentStock - material.reserved) > material.reorderLevel) {
        return false;
      }
      if (locationFilter !== 'all' && material.location !== locationFilter) {
        return false;
      }
      if (categoryFilter !== 'all' && material.category !== categoryFilter) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (!sortConfig) return 0;
      
      // Handle undefined values by providing defaults
      const aValue = a[sortConfig.key] ?? 0;
      const bValue = b[sortConfig.key] ?? 0;
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  const requestSort = (key: keyof RawMaterial) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Chart data
  const inventoryValueData = filteredData.map(item => ({
    name: item.name,
    value: item.currentStock * item.orderQuantity,
    category: item.category,
    fill: CATEGORY_COLORS[item.category]
  }));

  const stockLevelData = filteredData.map(item => ({
    name: item.name,
    currentStock: item.currentStock,
    reserved: item.reserved,
    available: item.currentStock - item.reserved,
    reorderLevel: item.reorderLevel,
    safetyStock: item.safetyStock
  }));

  return (
    <Container size="3" px="4" py="6">
      {/* Inventory Dashboard */}
      <Grid columns="4" gap="4" mb="4">
        <Card>
          <Flex align="center" gap="3">
            <Box style={{ background: '#f8f9fa', padding: '12px', borderRadius: '8px' }}>
              <ExclamationTriangleIcon width={24} height={24} color="red" />
            </Box>
            <Box>
              <Text as="div" size="2" color="gray">Critical Materials</Text>
              <Heading size="5">{criticalMaterials}</Heading>
            </Box>
          </Flex>
        </Card>
        
        <Card>
          <Flex align="center" gap="3">
            <Box style={{ background: '#f8f9fa', padding: '12px', borderRadius: '8px' }}>
              <ClockIcon width={24} height={24} />
            </Box>
            <Box>
              <Text as="div" size="2" color="gray">Need Reorder</Text>
              <Heading size="5">{reorderNeeded}</Heading>
            </Box>
          </Flex>
        </Card>
        
        <Card>
          <Flex align="center" gap="3">
            <Box style={{ background: '#f8f9fa', padding: '12px', borderRadius: '8px' }}>
              <CubeIcon width={24} height={24} />
            </Box>
            <Box>
              <Text as="div" size="2" color="gray">Pending Orders</Text>
              <Heading size="5">{pendingOrdersCount}</Heading>
            </Box>
          </Flex>
        </Card>
        
        <Card>
          <Flex align="center" gap="3">
            <Box style={{ background: '#f8f9fa', padding: '12px', borderRadius: '8px' }}>
              <LightningBoltIcon width={24} height={24} color="green" />
            </Box>
            <Box>
              <Text as="div" size="2" color="gray">Connected Sensors</Text>
              <Heading size="5">{connectedSensors}/{materials.length}</Heading>
            </Box>
          </Flex>
        </Card>
      </Grid>

      {/* Action Buttons */}
      <Flex gap="3" mb="4" wrap="wrap">
        <Button onClick={generateAutoOrders}>
          Generate Auto Orders
        </Button>
        <Button onClick={() => setShowOrderDialog(true)}>
          Create Manual Order
        </Button>
        <Button onClick={() => setShowMaterialDialog(true)}>
          Add New Material
        </Button>
        <Flex align="center" gap="2">
          <Switch 
            checked={showReorderOnly}
            onCheckedChange={setShowReorderOnly}
          />
          <Text>Show Only Materials Needing Reorder</Text>
        </Flex>
        
        <Select.Root value={locationFilter} onValueChange={setLocationFilter}>
          <Select.Trigger>
            <MixerHorizontalIcon />
            Location
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="all">All Locations</Select.Item>
            <Select.Item value="Zone 1">Zone 1</Select.Item>
            <Select.Item value="Zone 2">Zone 2</Select.Item>
          </Select.Content>
        </Select.Root>

        <Select.Root value={categoryFilter} onValueChange={setCategoryFilter}>
          <Select.Trigger>
            <MixerHorizontalIcon />
            Category
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="all">All Categories</Select.Item>
            <Select.Item value="A">Category A</Select.Item>
            <Select.Item value="B">Category B</Select.Item>
            <Select.Item value="C">Category C</Select.Item>
          </Select.Content>
        </Select.Root>

        <Button variant="soft" onClick={() => alert('Export functionality would go here')}>
          <DownloadIcon />
          Export Data
        </Button>
      </Flex>

      {/* Materials Table */}
      <Card mb="4">
        <Flex justify="between" align="center" mb="3">
          <Heading size="5">Raw Materials Inventory</Heading>
          <Text color="gray">{filteredData.length} materials filtered</Text>
        </Flex>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell onClick={() => requestSort('name')}>
                Material {sortConfig?.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell onClick={() => requestSort('currentStock')}>
                Current Stock {sortConfig?.key === 'currentStock' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell onClick={() => requestSort('reserved')}>
                Reserved {sortConfig?.key === 'reserved' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>
                Available
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>
                IoT Status
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>
                Status
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>
                Category
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>
                Location
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>
                Actions
              </Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredData.map(material => {
              const available = material.currentStock - material.reserved;
              const isCritical = available <= material.safetyStock;
              const needsReorder = available <= material.reorderLevel;
              const stockPercentage = (material.currentStock / (material.reorderLevel * 1.5)) * 100;
              
              return (
                <Table.Row 
                  key={material.id} 
                  style={{
                    backgroundColor: isCritical ? '#fee2e2' : needsReorder ? '#fef3c7' : 'inherit'
                  }}
                  onMouseEnter={() => setHoveredRow(material.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <Table.Cell>
                    <Flex align="center" gap="2">
                      {material.name}
                      {material.blockchainTx && <TokensIcon color="blue" />}
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>
                    <Flex direction="column" gap="1">
                      <Text>{material.currentStock} {material.unit}</Text>
                      <Progress value={Math.min(stockPercentage, 100)} />
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>{material.reserved} {material.unit}</Table.Cell>
                  <Table.Cell>{available} {material.unit}</Table.Cell>
                  <Table.Cell>
                    {material.sensorConnected ? (
                      <Flex align="center" gap="1">
                        <Link2Icon color="green" />
                        <Text color="green">Connected</Text>
                        {material.sensorReadings?.temperature && (
                          <Text color="gray" size="1">{material.sensorReadings.temperature}°C</Text>
                        )}
                      </Flex>
                    ) : (
                      <Button 
                        size="1" 
                        variant="soft"
                        onClick={() => connectToSensor(material.id)}
                        disabled={isConnectingSensor}
                      >
                        {isConnectingSensor ? 'Connecting...' : 'Connect Sensor'}
                      </Button>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {isCritical ? (
                      <Badge color="red">Critical</Badge>
                    ) : needsReorder ? (
                      <Badge color="orange">Reorder Needed</Badge>
                    ) : (
                      <Badge color="green">OK</Badge>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <Badge color={material.category === 'A' ? 'blue' : material.category === 'B' ? 'green' : 'gray'}>
                      {material.category}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    {material.location}
                  </Table.Cell>
                  <Table.Cell>
                    <Flex gap="2">
                      <Button size="1" onClick={() => setSelectedMaterial(material)}>
                        Configure
                      </Button>
                      <Button 
                        size="1" 
                        variant="soft" 
                        onClick={() => fetchBlockchainHistory(material.id)}
                      >
                        Blockchain
                      </Button>
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Root>
      </Card>

      {/* Charts Section */}
      <Grid columns="2" gap="4" mb="4">
        <Card>
          <Heading size="4" mb="3">Inventory Value by Category</Heading>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={inventoryValueData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {inventoryValueData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Legend />
              <ChartTooltip 
                formatter={(value: number) => [`${value.toLocaleString()} ${materials.find(m => m.name === name)?.unit}`, 'Value']}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <Heading size="4" mb="3">Stock Levels Overview</Heading>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stockLevelData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip />
              <Legend />
              <Bar dataKey="currentStock" fill="#3b82f6" name="Current Stock" />
              <Bar dataKey="reserved" fill="#f59e0b" name="Reserved" />
              <Bar dataKey="available" fill="#10b981" name="Available" />
              <Bar dataKey="reorderLevel" fill="#ef4444" name="Reorder Level" />
              <Bar dataKey="safetyStock" fill="#8b5cf6" name="Safety Stock" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </Grid>

      {/* Purchase Orders Table */}
      <Card>
        <Flex justify="between" align="center" mb="3">
          <Heading size="5">Purchase Orders</Heading>
          <Text color="gray">{orders.length} orders in system</Text>
        </Flex>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Order ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Material</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Quantity</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Supplier</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Order Date</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Blockchain</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {orders.map(order => {
              const material = materials.find(m => m.id === order.materialId);
              return (
                <Table.Row key={order.id}>
                  <Table.Cell>{order.id}</Table.Cell>
                  <Table.Cell>{order.materialName}</Table.Cell>
                  <Table.Cell>{order.quantity} {material?.unit}</Table.Cell>
                  <Table.Cell>
                    <Flex align="center" gap="1">
                      {order.supplier}
                      {material?.supplierRating && (
                        <Badge color={
                          material.supplierRating > 4 ? 'green' : 
                          material.supplierRating > 3 ? 'yellow' : 'red'
                        }>
                          {material.supplierRating.toFixed(1)}
                        </Badge>
                      )}
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>{new Date(order.orderDate).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>
                    <Badge color={
                      order.status === 'delivered' ? 'green' : 
                      order.status === 'shipped' ? 'blue' : 
                      order.status === 'approved' ? 'purple' : 
                      order.status === 'cancelled' ? 'red' : 'orange'
                    }>
                      {order.status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    {order.blockchainTx ? (
                      <Badge color="blue">
                        Verified
                      </Badge>
                    ) : (
                      <Badge color="gray">
                        Pending
                      </Badge>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <Button size="1" onClick={() => setSelectedOrder(order)}>
                      View
                    </Button>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Root>
      </Card>

      {/* Material Configuration Dialog */}
      {selectedMaterial && (
        <Dialog.Root open onOpenChange={() => setSelectedMaterial(null)}>
          <Dialog.Content style={{ maxWidth: '700px' }}>
            <Dialog.Title>
              <Flex align="center" gap="2">
                Configure {selectedMaterial.name}
                {selectedMaterial.sensorConnected && (
                  <Badge color="green">
                    <Link2Icon /> IoT Connected
                  </Badge>
                )}
              </Flex>
            </Dialog.Title>
            
            <Grid columns="2" gap="3" mt="3">
              <Box>
                <Text as="div" size="2" mb="1" weight="bold">Minimum Stock Level</Text>
                <TextField.Root>
                  <input
                    type="number"
                    value={selectedMaterial.minStockLevel}
                    onChange={(e) => setSelectedMaterial({
                      ...selectedMaterial,
                      minStockLevel: parseInt(e.target.value) || 0
                    })}
                    className="rt-TextFieldInput"
                  />
                </TextField.Root>
              </Box>
              
              <Box>
                <Text as="div" size="2" mb="1" weight="bold">Reorder Level</Text>
                <TextField.Root>
                  <input
                    type="number"
                    value={selectedMaterial.reorderLevel}
                    onChange={(e) => setSelectedMaterial({
                      ...selectedMaterial,
                      reorderLevel: parseInt(e.target.value) || 0
                    })}
                    className="rt-TextFieldInput"
                  />
                </TextField.Root>
              </Box>
              
              <Box>
                <Text as="div" size="2" mb="1" weight="bold">Safety Stock</Text>
                <TextField.Root>
                  <input
                    type="number"
                    value={selectedMaterial.safetyStock}
                    onChange={(e) => setSelectedMaterial({
                      ...selectedMaterial,
                      safetyStock: parseInt(e.target.value) || 0
                    })}
                    className="rt-TextFieldInput"
                  />
                </TextField.Root>
              </Box>
              
              <Box>
                <Text as="div" size="2" mb="1" weight="bold">Lead Time (days)</Text>
                <TextField.Root>
                  <input
                    type="number"
                    value={selectedMaterial.leadTime}
                    onChange={(e) => setSelectedMaterial({
                      ...selectedMaterial,
                      leadTime: parseInt(e.target.value) || 0
                    })}
                    className="rt-TextFieldInput"
                  />
                </TextField.Root>
              </Box>
              
              <Box>
                <Text as="div" size="2" mb="1" weight="bold">Order Quantity</Text>
                <TextField.Root>
                  <input
                    type="number"
                    value={selectedMaterial.orderQuantity}
                    onChange={(e) => setSelectedMaterial({
                      ...selectedMaterial,
                      orderQuantity: parseInt(e.target.value) || 0
                    })}
                    className="rt-TextFieldInput"
                  />
                </TextField.Root>
              </Box>
              
              <Box>
                <Text as="div" size="2" mb="1" weight="bold">Unit</Text>
                <TextField.Root>
                  <input
                    type="text"
                    value={selectedMaterial.unit}
                    onChange={(e) => setSelectedMaterial({
                      ...selectedMaterial,
                      unit: e.target.value
                    })}
                    className="rt-TextFieldInput"
                  />
                </TextField.Root>
              </Box>

              <Box>
                <Text as="div" size="2" mb="1" weight="bold">Location</Text>
                <Select.Root
                  value={selectedMaterial.location}
                  onValueChange={(value) => setSelectedMaterial({
                    ...selectedMaterial,
                    location: value
                  })}
                >
                  <Select.Trigger />
                  <Select.Content>
                    <Select.Item value="Zone 1">Zone 1</Select.Item>
                    <Select.Item value="Zone 2">Zone 2</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Box>

              <Box>
                <Text as="div" size="2" mb="1" weight="bold">Category</Text>
                <Select.Root
                  value={selectedMaterial.category}
                  onValueChange={(value) => setSelectedMaterial({
                    ...selectedMaterial,
                    category: value as 'A' | 'B' | 'C'
                  })}
                >
                  <Select.Trigger />
                  <Select.Content>
                    <Select.Item value="A">Category A</Select.Item>
                    <Select.Item value="B">Category B</Select.Item>
                    <Select.Item value="C">Category C</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Box>

              {selectedMaterial.sensorConnected && selectedMaterial.sensorReadings && (
                <>
                  <Box>
                    <Text as="div" size="2" mb="1" weight="bold">Temperature</Text>
                    <Text>{selectedMaterial.sensorReadings.temperature}°C</Text>
                  </Box>
                  <Box>
                    <Text as="div" size="2" mb="1" weight="bold">Humidity</Text>
                    <Text>{selectedMaterial.sensorReadings.humidity}%</Text>
                  </Box>
                  <Box>
                    <Text as="div" size="2" mb="1" weight="bold">Last Sensor Update</Text>
                    <Text>
                      {selectedMaterial.lastSensorUpdate ? 
                        new Date(selectedMaterial.lastSensorUpdate).toLocaleString() : 
                        'N/A'}
                    </Text>
                  </Box>
                </>
              )}
            </Grid>
            
            <Flex gap="3" mt="4" justify="end">
              <Button 
                variant="soft" 
                color="gray"
                onClick={() => setSelectedMaterial(null)}
              >
                Cancel
              </Button>
              <Button onClick={() => {
                setMaterials(materials.map(m => 
                  m.id === selectedMaterial.id ? selectedMaterial : m
                ));
                setSelectedMaterial(null);
              }}>
                Save Changes
              </Button>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      )}

      {/* Order Details Dialog */}
      {selectedOrder && (
        <Dialog.Root open onOpenChange={() => setSelectedOrder(null)}>
          <Dialog.Content style={{ maxWidth: '700px' }}>
            <Dialog.Title>Order {selectedOrder.id}</Dialog.Title>
            
            <Grid columns="2" gap="3" mt="3">
              <Box>
                <Text as="div" size="2" color="gray">Material</Text>
                <Text>{selectedOrder.materialName}</Text>
              </Box>
              
              <Box>
                <Text as="div" size="2" color="gray">Quantity</Text>
                <Text>{selectedOrder.quantity}</Text>
              </Box>
              
              <Box>
                <Text as="div" size="2" color="gray">Supplier</Text>
                <Text>{selectedOrder.supplier}</Text>
              </Box>
              
              <Box>
                <Text as="div" size="2" color="gray">Order Date</Text>
                <Text>{new Date(selectedOrder.orderDate).toLocaleDateString()}</Text>
              </Box>
              
              <Box>
                <Text as="div" size="2" color="gray">Expected Delivery</Text>
                <Text>{new Date(selectedOrder.expectedDelivery).toLocaleDateString()}</Text>
              </Box>
              
              <Box>
                <Text as="div" size="2" color="gray">Status</Text>
                <Text>
                  <Badge color={
                    selectedOrder.status === 'delivered' ? 'green' : 
                    selectedOrder.status === 'shipped' ? 'blue' : 
                    selectedOrder.status === 'approved' ? 'purple' : 
                    selectedOrder.status === 'cancelled' ? 'red' : 'orange'
                  }>
                    {selectedOrder.status}
                  </Badge>
                </Text>
              </Box>

              {selectedOrder.blockchainTx && (
                <Box style={{ gridColumn: '1 / -1' }}>
                  <Text as="div" size="2" color="gray">Blockchain Transaction</Text>
                  <Text style={{ wordBreak: 'break-all' }}>{selectedOrder.blockchainTx}</Text>
                </Box>
              )}

              {selectedOrder.shippingConditions && (
                <>
                  <Box>
                    <Text as="div" size="2" color="gray">Shipping Temperature</Text>
                    <Text>{selectedOrder.shippingConditions.temperature}°C</Text>
                  </Box>
                  <Box>
                    <Text as="div" size="2" color="gray">Shipping Humidity</Text>
                    <Text>{selectedOrder.shippingConditions.humidity}%</Text>
                  </Box>
                </>
              )}
            </Grid>
            
            {selectedOrder.notes && (
              <Box mt="3">
                <Text as="div" size="2" color="gray">Notes</Text>
                <Text>{selectedOrder.notes}</Text>
              </Box>
            )}
            
            <Flex gap="3" mt="4" justify="end">
              {selectedOrder.status === 'pending' && (
                <>
                  <Button 
                    color="green"
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, 'approved');
                      setSelectedOrder(null);
                    }}
                  >
                    Approve
                  </Button>
                  <Button 
                    color="red"
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, 'cancelled');
                      setSelectedOrder(null);
                    }}
                  >
                    Cancel
                  </Button>
                </>
              )}
              {selectedOrder.status === 'approved' && (
                <Button 
                  color="blue"
                  onClick={() => {
                    updateOrderStatus(selectedOrder.id, 'shipped');
                    setSelectedOrder(null);
                  }}
                >
                  Mark as Shipped
                </Button>
              )}
              {selectedOrder.status === 'shipped' && (
                <Button 
                  color="green"
                  onClick={() => {
                    updateOrderStatus(selectedOrder.id, 'delivered');
                    setSelectedOrder(null);
                  }}
                >
                  Mark as Delivered
                </Button>
              )}
              <Button 
                variant="soft" 
                color="gray"
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </Button>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      )}

      {/* Create Order Dialog */}
      <Dialog.Root open={showOrderDialog} onOpenChange={setShowOrderDialog}>
        <Dialog.Content style={{ maxWidth: '700px' }}>
          <Dialog.Title>Create Purchase Order</Dialog.Title>
          
          <Grid columns="2" gap="3" mt="3">
            <Box>
              <Text as="div" size="2" mb="1" weight="bold">Material</Text>
              <Select.Root
                value={newOrder.materialId}
                onValueChange={(value) => {
                  const material = materials.find(m => m.id === value);
                  setNewOrder({
                    ...newOrder,
                    materialId: value,
                    supplier: material?.supplier || ''
                  });
                }}
              >
                <Select.Trigger placeholder="Select material" />
                <Select.Content>
                  {materials.map(material => (
                    <Select.Item key={material.id} value={material.id}>
                      {material.name} ({material.currentStock - material.reserved} {material.unit} available)
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </Box>
            
            <Box>
              <Text as="div" size="2" mb="1" weight="bold">Quantity</Text>
              <TextField.Root>
                <input
                  type="number"
                  placeholder="Quantity"
                  value={newOrder.quantity || ''}
                  onChange={(e) => setNewOrder({
                    ...newOrder,
                    quantity: parseInt(e.target.value) || 0
                  })}
                  className="rt-TextFieldInput"
                />
              </TextField.Root>
            </Box>
            
            <Box>
              <Text as="div" size="2" mb="1" weight="bold">Supplier</Text>
              <TextField.Root>
                <input
                  type="text"
                  placeholder="Supplier"
                  value={newOrder.supplier || ''}
                  onChange={(e) => setNewOrder({
                    ...newOrder,
                    supplier: e.target.value
                  })}
                  className="rt-TextFieldInput"
                />
              </TextField.Root>
            </Box>
            
            <Box>
              <Text as="div" size="2" mb="1" weight="bold">Expected Delivery</Text>
              <TextField.Root>
                <input
                  type="date"
                  placeholder="Expected Delivery"
                  value={newOrder.expectedDelivery?.split('T')[0] || ''}
                  onChange={(e) => setNewOrder({
                    ...newOrder,
                    expectedDelivery: new Date(e.target.value).toISOString()
                  })}
                  className="rt-TextFieldInput"
                />
              </TextField.Root>
            </Box>
            
            <Box style={{ gridColumn: '1 / -1' }}>
              <Text as="div" size="2" mb="1" weight="bold">Notes (optional)</Text>
              <TextArea
                placeholder="Notes"
                value={newOrder.notes || ''}
                onChange={(e) => setNewOrder({
                  ...newOrder,
                  notes: e.target.value
                })}
              />
            </Box>
          </Grid>
          
          <Flex gap="3" mt="4" justify="end">
            <Button 
              variant="soft" 
              color="gray"
              onClick={() => {
                setShowOrderDialog(false);
                setNewOrder({ status: 'pending', orderDate: today });
              }}
            >
              Cancel
            </Button>
            <Button onClick={createManualOrder}>
              Create Order
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      {/* Add Material Dialog */}
      <Dialog.Root open={showMaterialDialog} onOpenChange={setShowMaterialDialog}>
        <Dialog.Content style={{ maxWidth: '700px' }}>
          <Dialog.Title>Add New Material</Dialog.Title>
          
          <Grid columns="2" gap="3" mt="3">
            <Box>
              <Text as="div" size="2" mb="1" weight="bold">Material Name</Text>
              <TextField.Root>
                <input
                  type="text"
                  placeholder="Material Name"
                  value={newMaterial.name || ''}
                  onChange={(e) => setNewMaterial({
                    ...newMaterial,
                    name: e.target.value
                  })}
                  className="rt-TextFieldInput"
                />
              </TextField.Root>
            </Box>
            
            <Box>
              <Text as="div" size="2" mb="1" weight="bold">Supplier</Text>
              <TextField.Root>
                <input
                  type="text"
                  placeholder="Supplier"
                  value={newMaterial.supplier || ''}
                  onChange={(e) => setNewMaterial({
                    ...newMaterial,
                    supplier: e.target.value
                  })}
                  className="rt-TextFieldInput"
                />
              </TextField.Root>
            </Box>
            
            <Box>
              <Text as="div" size="2" mb="1" weight="bold">Current Stock</Text>
              <TextField.Root>
                <input
                  type="number"
                  placeholder="Current Stock"
                  value={newMaterial.currentStock || ''}
                  onChange={(e) => setNewMaterial({
                    ...newMaterial,
                    currentStock: parseInt(e.target.value) || 0
                  })}
                  className="rt-TextFieldInput"
                />
              </TextField.Root>
            </Box>
            
            <Box>
              <Text as="div" size="2" mb="1" weight="bold">Unit (kg, g, L, etc.)</Text>
              <TextField.Root>
                <input
                  type="text"
                  placeholder="Unit"
                  value={newMaterial.unit || ''}
                  onChange={(e) => setNewMaterial({
                    ...newMaterial,
                    unit: e.target.value
                  })}
                  className="rt-TextFieldInput"
                />
              </TextField.Root>
            </Box>
            
            <Box>
              <Text as="div" size="2" mb="1" weight="bold">Minimum Stock Level</Text>
              <TextField.Root>
                <input
                  type="number"
                  placeholder="Minimum Stock Level"
                  value={newMaterial.minStockLevel || ''}
                  onChange={(e) => setNewMaterial({
                    ...newMaterial,
                    minStockLevel: parseInt(e.target.value) || 0
                  })}
                  className="rt-TextFieldInput"
                />
              </TextField.Root>
            </Box>
            
            <Box>
              <Text as="div" size="2" mb="1" weight="bold">Reorder Level</Text>
              <TextField.Root>
                <input
                  type="number"
                  placeholder="Reorder Level"
                  value={newMaterial.reorderLevel || ''}
                  onChange={(e) => setNewMaterial({
                    ...newMaterial,
                    reorderLevel: parseInt(e.target.value) || 0
                  })}
                  className="rt-TextFieldInput"
                />
              </TextField.Root>
            </Box>
            
            <Box>
              <Text as="div" size="2" mb="1" weight="bold">Safety Stock</Text>
              <TextField.Root>
                <input
                  type="number"
                  placeholder="Safety Stock"
                  value={newMaterial.safetyStock || ''}
                  onChange={(e) => setNewMaterial({
                    ...newMaterial,
                    safetyStock: parseInt(e.target.value) || 0
                  })}
                  className="rt-TextFieldInput"
                />
              </TextField.Root>
            </Box>
            
            <Box>
              <Text as="div" size="2" mb="1" weight="bold">Lead Time (days)</Text>
              <TextField.Root>
                <input
                  type="number"
                  placeholder="Lead Time"
                  value={newMaterial.leadTime || ''}
                  onChange={(e) => setNewMaterial({
                    ...newMaterial,
                    leadTime: parseInt(e.target.value) || 0
                  })}
                  className="rt-TextFieldInput"
                />
              </TextField.Root>
            </Box>
            
            <Box>
              <Text as="div" size="2" mb="1" weight="bold">Order Quantity</Text>
              <TextField.Root>
                <input
                  type="number"
                  placeholder="Order Quantity"
                  value={newMaterial.orderQuantity || ''}
                  onChange={(e) => setNewMaterial({
                    ...newMaterial,
                    orderQuantity: parseInt(e.target.value) || 0
                  })}
                  className="rt-TextFieldInput"
                />
              </TextField.Root>
            </Box>

            <Box>
              <Text as="div" size="2" mb="1" weight="bold">Location</Text>
              <Select.Root
                value={newMaterial.location || 'Zone 1'}
                onValueChange={(value) => setNewMaterial({
                  ...newMaterial,
                  location: value
                })}
              >
                <Select.Trigger />
                <Select.Content>
                  <Select.Item value="Zone 1">Zone 1</Select.Item>
                  <Select.Item value="Zone 2">Zone 2</Select.Item>
                </Select.Content>
              </Select.Root>
            </Box>

            <Box>
              <Text as="div" size="2" mb="1" weight="bold">Category</Text>
              <Select.Root
                value={newMaterial.category || 'A'}
                onValueChange={(value) => setNewMaterial({
                  ...newMaterial,
                  category: value as 'A' | 'B' | 'C'
                })}
              >
                <Select.Trigger />
                <Select.Content>
                  <Select.Item value="A">Category A</Select.Item>
                  <Select.Item value="B">Category B</Select.Item>
                  <Select.Item value="C">Category C</Select.Item>
                </Select.Content>
              </Select.Root>
            </Box>

            <Box>
              <Text as="div" size="2" mb="1" weight="bold">IoT Sensor</Text>
              <Flex gap="2" align="center">
                <Switch 
                  checked={newMaterial.sensorConnected || false}
                  onCheckedChange={(checked) => setNewMaterial({
                    ...newMaterial,
                    sensorConnected: checked
                  })}
                />
                <Text>Connect IoT Sensor</Text>
              </Flex>
            </Box>
          </Grid>
          
          <Flex gap="3" mt="4" justify="end">
            <Button 
              variant="soft" 
              color="gray"
              onClick={() => {
                setShowMaterialDialog(false);
                setNewMaterial({ unit: 'kg', sensorConnected: false, category: 'A' });
              }}
            >
              Cancel
            </Button>
            <Button onClick={addNewMaterial}>
              Add Material
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      {/* Blockchain History Dialog */}
      <Dialog.Root open={showBlockchainDialog} onOpenChange={setShowBlockchainDialog}>
        <Dialog.Content style={{ maxWidth: '700px' }}>
          <Dialog.Title>
            <Flex align="center" gap="2">
              <TokensIcon /> Blockchain History
              {isLoadingBlockchain && <Text size="2">Loading...</Text>}
            </Flex>
          </Dialog.Title>
          
          {isLoadingBlockchain ? (
            <Flex justify="center" py="5">
              <Text>Loading blockchain data...</Text>
            </Flex>
          ) : (
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Transaction Hash</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Action</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Quantity</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Participants</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Related TX</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {blockchainData.map((tx, index) => (
                  <Table.Row key={index}>
                    <Table.Cell style={{ wordBreak: 'break-all' }}>
                      <Text size="1">{tx.txHash}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge>
                        {tx.action}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      {new Date(tx.timestamp).toLocaleString()}
                    </Table.Cell>
                    <Table.Cell>
                      {tx.quantity || 'N/A'}
                    </Table.Cell>
                    <Table.Cell>
                      <Flex direction="column" gap="1">
                        {tx.participants.map((p, i) => (
                          <Text key={i} size="1">{p}</Text>
                        ))}
                      </Flex>
                    </Table.Cell>
                    <Table.Cell>
                      {tx.relatedTxHash ? (
                        <Text size="1" style={{ wordBreak: 'break-all' }}>
                          {tx.relatedTxHash}
                        </Text>
                      ) : (
                        <Text size="1" color="gray">None</Text>
                      )}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          )}
          
          <Flex gap="3" mt="4" justify="end">
            <Button 
              variant="soft" 
              color="gray"
              onClick={() => setShowBlockchainDialog(false)}
            >
              Close
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Container>
  );
};

export default RawMaterialsInventory;
