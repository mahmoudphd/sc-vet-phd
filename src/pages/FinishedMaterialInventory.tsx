import React, { useState } from 'react';
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
  Progress,
  Tabs
} from '@radix-ui/themes';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
  CartesianGrid,
  Tooltip,
  LabelList
} from 'recharts';
import {
  CubeIcon,
  MixerHorizontalIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  LightningBoltIcon,
  Link2Icon,
  TokensIcon,
  DownloadIcon,
  TriangleDownIcon,
  CheckCircledIcon,
  TruckIcon,
  ClipboardIcon,
  InfoCircledIcon,
  CrossCircledIcon
} from '@radix-ui/react-icons';

// Styles
import './styles.css';

// Interfaces
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

interface InventoryValueItem {
  name: string;
  value: number;
  category: 'A' | 'B' | 'C';
  fill: string;
  unit: string;
}

// Services
class IoTSensorService {
  static async connectToSensor(materialId: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Math.random() > 0.2);
      }, 500);
    });
  }

  static async getSensorReadings(materialId: string): Promise<{
    temperature?: number;
    humidity?: number;
    weight?: number;
  }> {
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

class BlockchainService {
  private static transactionHistory: Record<string, BlockchainTransaction[]> = {};

  static async recordTransaction(
    materialId: string,
    action: 'order' | 'delivery' | 'adjustment',
    quantity: number,
    participants: string[],
    relatedTxHash?: string
  ): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const txHash = `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
        const timestamp = new Date().toISOString();
        
        const transaction: BlockchainTransaction = {
          txHash,
          timestamp,
          materialId,
          action,
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
        resolve([...history].sort((a, b) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        ));
      }, 1200);
    });
  }
}

// Helper Functions
const generateId = (prefix: string) => `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
const today = new Date().toISOString().split('T')[0];
const CATEGORY_COLORS = {
  A: '#3b82f6',
  B: '#10b981',
  C: '#6b7280'
};

const RawMaterialsInventory = () => {
  // State initialization
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
  const [isConnectingSensor, setIsConnectingSensor] = useState(false);
  const [locationFilter, setLocationFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState<{key: keyof RawMaterial, direction: 'asc' | 'desc'} | null>(null);

  // Functions (same as original)
  const connectToSensor = async (materialId: string) => {
    setIsConnectingSensor(true);
    try {
      const connected = await IoTSensorService.connectToSensor(materialId);
      if (connected) {
        const readings = await IoTSensorService.getSensorReadings(materialId);
        setMaterials(prevMaterials => prevMaterials.map(m => 
          m.id === materialId ? { 
            ...m, 
            sensorConnected: true,
            lastSensorUpdate: new Date().toISOString(),
            sensorReadings: readings
          } : m
        ));
        
        if (readings.weight) {
          setMaterials(prevMaterials => {
            return prevMaterials.map(m => {
              if (m.id === materialId) {
                const newStock = Math.round(readings.weight!);
                if (Math.abs(newStock - m.currentStock) > 5) {
                  return { ...m, currentStock: newStock };
                }
              }
              return m;
            });
          });
        }
      }
    } catch (error) {
      console.error('Sensor connection failed:', error);
    } finally {
      setIsConnectingSensor(false);
    }
  };

  const recordBlockchainTransaction = async (
    materialId: string,
    action: 'order' | 'delivery' | 'adjustment',
    quantity: number,
    participants: string[],
    relatedTxHash?: string
  ) => {
    return await BlockchainService.recordTransaction(
      materialId,
      action,
      quantity,
      participants,
      relatedTxHash
    );
  };

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

        setTimeout(async () => {
          setOrders(prevOrders => {
            const orderExists = prevOrders.find(o => o.id === newOrder.id);
            if (!orderExists) return prevOrders;
            
            return prevOrders.map(o => {
              if (o.id === newOrder.id && (o.status === 'pending' || o.status === 'approved')) {
                recordBlockchainTransaction(
                  material.id,
                  'delivery',
                  orderQuantity,
                  [material.supplier, 'Warehouse Manager'],
                  txHash
                ).then(deliveryTxHash => {
                  setOrders(prev => prev.map(ord => 
                    ord.id === newOrder.id ? { ...ord, status: 'delivered', blockchainTx: deliveryTxHash } : ord
                  ));
                  
                  setMaterials(prev => prev.map(m => 
                    m.id === material.id ? { 
                      ...m, 
                      currentStock: m.currentStock + orderQuantity,
                      pendingOrders: m.pendingOrders - orderQuantity
                    } : m
                  ));
                });
              }
              return o;
            });
          });
        }, material.leadTime * 86400000);
      }
    }

    setOrders(prevOrders => [...prevOrders, ...newOrders]);
    setMaterials(updatedMaterials);
  };

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
            setOrders(prev => prev.map(o => 
              o.id === orderId ? { ...o, blockchainTx: txHash } : o
            ));
          });
          
          setMaterials(prev => prev.map(m => 
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

    const txHash = await recordBlockchainTransaction(
      material.id,
      'order',
      order.quantity,
      [order.supplier, 'Warehouse Manager']
    );
    order.blockchainTx = txHash;

    setOrders(prev => [...prev, order]);
    setMaterials(prev => prev.map(m => 
      m.id === material.id ? { ...m, pendingOrders: m.pendingOrders + order.quantity } : m
    ));
    
    setTimeout(async () => {
      setOrders(prev => {
        const existingOrder = prev.find(o => o.id === order.id);
        if (!existingOrder) return prev;
        
        return prev.map(o => {
          if (o.id === order.id && (o.status === 'pending' || o.status === 'approved')) {
            recordBlockchainTransaction(
              material.id,
              'delivery',
              order.quantity,
              [order.supplier, 'Warehouse Manager'],
              txHash
            ).then(deliveryTxHash => {
              setOrders(prevOrders => prevOrders.map(ord => 
                ord.id === order.id ? { ...ord, status: 'delivered', blockchainTx: deliveryTxHash } : ord
              ));
              
              setMaterials(prevMaterials => prevMaterials.map(m => 
                m.id === material.id ? { 
                  ...m, 
                  currentStock: m.currentStock + order.quantity,
                  pendingOrders: m.pendingOrders - order.quantity
                } : m
              ));
            });
          }
          return o;
        });
      });
    }, material.leadTime * 86400000);

    setShowOrderDialog(false);
    setNewOrder({ status: 'pending', orderDate: today });
  };

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

    const txHash = await recordBlockchainTransaction(
      material.id,
      'adjustment',
      material.currentStock,
      ['System', 'Warehouse Manager']
    );
    material.blockchainTx = txHash;

    setMaterials(prev => [...prev, material]);
    setShowMaterialDialog(false);
    setNewMaterial({ unit: 'kg', sensorConnected: false, category: 'A' });
  };

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
      
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue === undefined || bValue === undefined) return 0;
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      return 0;
    });

  const requestSort = (key: keyof RawMaterial) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const inventoryValueData: InventoryValueItem[] = filteredData.map(item => ({
    name: item.name,
    value: item.currentStock * item.orderQuantity,
    category: item.category,
    fill: CATEGORY_COLORS[item.category],
    unit: item.unit
  }));

  const stockLevelData = filteredData.map(item => ({
    name: item.name,
    currentStock: item.currentStock,
    reserved: item.reserved,
    available: item.currentStock - item.reserved,
    reorderLevel: item.reorderLevel,
    safetyStock: item.safetyStock
  }));

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

  return (
    <Container size="3" px={{ initial: '2', sm: '4' }} py="6">
      <Flex direction="column" gap="6">
        {/* Dashboard Cards */}
        <Grid columns={{ initial: '2', sm: '4' }} gap="4">
          <Card className="dashboard-card">
            <Flex align="center" gap="3">
              <Box className="card-icon-box" style={{ backgroundColor: 'var(--red-a2)', color: 'var(--red-9)' }}>
                <ExclamationTriangleIcon width={20} height={20} />
              </Box>
              <Box>
                <Text as="div" size="1" weight="bold" color="gray" className="card-label">
                  CRITICAL MATERIALS
                </Text>
                <Heading size="5" weight="bold" className="card-value">
                  {criticalMaterials}
                </Heading>
              </Box>
            </Flex>
          </Card>
          
          <Card className="dashboard-card">
            <Flex align="center" gap="3">
              <Box className="card-icon-box" style={{ backgroundColor: 'var(--amber-a2)', color: 'var(--amber-9)' }}>
                <ClockIcon width={20} height={20} />
              </Box>
              <Box>
                <Text as="div" size="1" weight="bold" color="gray" className="card-label">
                  NEED REORDER
                </Text>
                <Heading size="5" weight="bold" className="card-value">
                  {reorderNeeded}
                </Heading>
              </Box>
            </Flex>
          </Card>
          
          <Card className="dashboard-card">
            <Flex align="center" gap="3">
              <Box className="card-icon-box" style={{ backgroundColor: 'var(--blue-a2)', color: 'var(--blue-9)' }}>
                <CubeIcon width={20} height={20} />
              </Box>
              <Box>
                <Text as="div" size="1" weight="bold" color="gray" className="card-label">
                  PENDING ORDERS
                </Text>
                <Heading size="5" weight="bold" className="card-value">
                  {pendingOrdersCount}
                </Heading>
              </Box>
            </Flex>
          </Card>
          
          <Card className="dashboard-card">
            <Flex align="center" gap="3">
              <Box className="card-icon-box" style={{ backgroundColor: 'var(--green-a2)', color: 'var(--green-9)' }}>
                <LightningBoltIcon width={20} height={20} />
              </Box>
              <Box>
                <Text as="div" size="1" weight="bold" color="gray" className="card-label">
                  CONNECTED SENSORS
                </Text>
                <Heading size="5" weight="bold" className="card-value">
                  {connectedSensors}/{materials.length}
                </Heading>
              </Box>
            </Flex>
          </Card>
        </Grid>

        {/* Action Buttons */}
        <Flex gap="3" wrap="wrap" justify="between" align="center" px={{ initial: '0', md: '2' }}>
          <Flex gap="3" wrap="wrap">
            <Button variant="soft" onClick={generateAutoOrders} className="action-button">
              <LightningBoltIcon /> Auto Reorder
            </Button>
            <Button onClick={() => setShowOrderDialog(true)} className="action-button">
              <CubeIcon /> Manual Order
            </Button>
            <Button variant="soft" onClick={() => setShowMaterialDialog(true)} className="action-button">
              Add Material
            </Button>
          </Flex>

          <Flex gap="3" align="center">
            <Flex align="center" gap="2">
              <Switch 
                checked={showReorderOnly}
                onCheckedChange={setShowReorderOnly}
              />
              <Text size="2">Reorder Only</Text>
            </Flex>
            
            <Select.Root value={locationFilter} onValueChange={setLocationFilter}>
              <Select.Trigger variant="soft" className="filter-select">
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
              <Select.Trigger variant="soft" className="filter-select">
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
          </Flex>
        </Flex>

        {/* Tabs Navigation */}
        <Tabs.Root defaultValue="inventory">
          <Flex justify="between" align="center" mb="4">
            <Tabs.List>
              <Tabs.Trigger value="inventory" className="tab-trigger">
                <Flex align="center" gap="2">
                  <CubeIcon width="16" height="16" />
                  Inventory
                </Flex>
              </Tabs.Trigger>
              <Tabs.Trigger value="orders" className="tab-trigger">
                <Flex align="center" gap="2">
                  <ClipboardIcon width="16" height="16" />
                  Orders
                </Flex>
              </Tabs.Trigger>
            </Tabs.List>
            
            <Text size="2" color="gray" className="items-count">
              Showing {filteredData.length} of {materials.length} items
            </Text>
          </Flex>

          {/* Inventory Tab */}
          <Tabs.Content value="inventory">
            <Card className="inventory-card">
              <Table.Root variant="surface" className="inventory-table">
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeaderCell className="table-header-cell" style={{ width: '22%' }}>
                      <Flex align="center" gap="2" onClick={() => requestSort('name')}>
                        Material
                        <TriangleDownIcon 
                          className={`sort-icon ${sortConfig?.key === 'name' ? 'active' : ''}`}
                          style={{ 
                            transform: sortConfig?.key === 'name' && sortConfig.direction === 'desc' ? 'rotate(180deg)' : 'none'
                          }}
                        />
                      </Flex>
                    </Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell className="table-header-cell">
                      Current Stock
                    </Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell className="table-header-cell">
                      Reserved
                    </Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell className="table-header-cell">
                      Available
                    </Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell className="table-header-cell">
                      Status
                    </Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell className="table-header-cell">
                      Actions
                    </Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {filteredData.map(material => {
                    const available = material.currentStock - material.reserved;
                    const isCritical = available <= material.safetyStock;
                    const needsReorder = available <= material.reorderLevel;
                    
                    return (
                      <Table.Row 
                        key={material.id}
                        className={`table-row ${isCritical ? 'critical' : needsReorder ? 'reorder' : ''}`}
                      >
                        <Table.Cell className="material-cell">
                          <Flex align="center" gap="2">
                            <Text weight="medium">{material.name}</Text>
                            {material.blockchainTx && <TokensIcon className="blockchain-icon" />}
                          </Flex>
                        </Table.Cell>
                        <Table.Cell>
                          <Flex direction="column" gap="1">
                            <Text>
                              {material.currentStock} {material.unit}
                            </Text>
                            <Progress 
                              value={(material.currentStock / (material.reorderLevel * 1.5)) * 100}
                              className="stock-progress"
                            />
                          </Flex>
                        </Table.Cell>
                        <Table.Cell>
                          {material.reserved} {material.unit}
                        </Table.Cell>
                        <Table.Cell>
                          <Text weight="medium">
                            {available} {material.unit}
                          </Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Badge 
                            color={isCritical ? 'red' : needsReorder ? 'amber' : 'green'}
                            variant="soft"
                            highContrast
                            radius="full"
                            className="status-badge"
                          >
                            {isCritical ? 'Critical' : needsReorder ? 'Reorder' : 'In Stock'}
                          </Badge>
                        </Table.Cell>
                        <Table.Cell>
                          <Flex gap="2">
                            <Button 
                              size="1" 
                              variant="soft"
                              className="action-button"
                              onClick={() => setSelectedMaterial(material)}
                            >
                              Configure
                            </Button>
                            <Button 
                              size="1" 
                              variant="soft"
                              className="action-button"
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
          </Tabs.Content>

          {/* Orders Tab */}
          <Tabs.Content value="orders">
            <Card className="orders-card">
              <Table.Root variant="surface" className="orders-table">
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeaderCell className="table-header-cell">Order ID</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell className="table-header-cell">Material</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell className="table-header-cell">Status</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell className="table-header-cell">Actions</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {orders.map(order => {
                    const material = materials.find(m => m.id === order.materialId);
                    return (
                      <Table.Row key={order.id} className="table-row">
                        <Table.Cell>
                          <Text size="2" className="order-id">
                            {order.id}
                          </Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Text weight="medium" className="material-name">
                            {order.materialName}
                          </Text>
                          <Text size="2" color="gray" className="order-quantity">
                            {order.quantity} {material?.unit}
                          </Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Badge 
                            color={
                              order.status === 'delivered' ? 'green' : 
                              order.status === 'shipped' ? 'blue' : 
                              order.status === 'approved' ? 'purple' : 
                              order.status === 'cancelled' ? 'red' : 'orange'
                            }
                            variant="soft"
                            highContrast
                            radius="full"
                            className="status-badge"
                          >
                            <Flex align="center" gap="1">
                              {order.status === 'delivered' ? (
                                <CheckCircledIcon width="12" height="12" />
                              ) : order.status === 'shipped' ? (
                                <TruckIcon width="12" height="12" />
                              ) : order.status === 'approved' ? (
                                <CheckCircledIcon width="12" height="12" />
                              ) : order.status === 'cancelled' ? (
                                <CrossCircledIcon width="12" height="12" />
                              ) : (
                                <ClockIcon width="12" height="12" />
                              )}
                              {order.status}
                            </Flex>
                          </Badge>
                        </Table.Cell>
                        <Table.Cell>
                          <Button 
                            size="1" 
                            variant="soft"
                            className="action-button"
                            onClick={() => setSelectedOrder(order)}
                          >
                            View Details
                          </Button>
                        </Table.Cell>
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table.Root>
            </Card>
          </Tabs.Content>
        </Tabs.Root>

        {/* Charts Section */}
        <Grid columns={{ initial: '1', md: '2' }} gap="4">
          <Card className="chart-card">
            <Heading size="4" mb="3" className="chart-title">
              Inventory Value by Category
            </Heading>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={inventoryValueData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={40}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {inventoryValueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip 
                  content={({ active, payload }) => {
                    if (!active || !payload || payload.length === 0) return null;
                    
                    const data = payload[0].payload as InventoryValueItem;
                    
                    return (
                      <Card className="chart-tooltip">
                        <Text weight="bold">{data.name}</Text>
                        <Text>Value: {data.value.toLocaleString()}</Text>
                        <Text>Category: {data.category}</Text>
                      </Card>
                    );
                  }}
                />
                <Legend 
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  wrapperStyle={{ paddingTop: '20px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <Card className="chart-card">
            <Heading size="4" mb="3" className="chart-title">
              Stock Levels Overview
            </Heading>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stockLevelData}>
                <defs>
                  <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2}/>
                  </linearGradient>
                  <linearGradient id="colorReserved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--accent-a5)" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{
                    background: 'var(--color-panel)',
                    borderColor: 'var(--accent-a6)',
                    borderRadius: 'var(--radius-2)'
                  }}
                />
                <Legend />
                <Bar dataKey="currentStock" fill="url(#colorStock)" name="Current Stock" />
                <Bar dataKey="reserved" fill="url(#colorReserved)" name="Reserved" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        {/* Material Configuration Dialog */}
        {selectedMaterial && (
          <Dialog.Root open onOpenChange={() => setSelectedMaterial(null)}>
            <Dialog.Content className="material-dialog" style={{ maxWidth: '700px' }}>
              <Dialog.Title className="dialog-title">
                <Flex align="center" gap="2">
                  Configure {selectedMaterial.name}
                  {selectedMaterial.sensorConnected && (
                    <Badge color="green" variant="soft" className="sensor-badge">
                      <Link2Icon /> IoT Connected
                    </Badge>
                  )}
                </Flex>
              </Dialog.Title>
              
              <Grid columns="2" gap="3" mt="3">
                <Box>
                  <Text as="div" size="2" mb="1" weight="bold" className="dialog-label">
                    Minimum Stock Level
                  </Text>
                  <TextField.Root>
                    <TextField.Input
                      type="number"
                      value={selectedMaterial.minStockLevel}
                      onChange={(e) => setSelectedMaterial({
                        ...selectedMaterial,
                        minStockLevel: parseInt(e.target.value) || 0
                      })}
                      className="dialog-input"
                    />
                  </TextField.Root>
                </Box>
                
                {/* بقية حقول الإدخال بنفس النمط */}
                
              </Grid>
              
              <Flex gap="3" mt="4" justify="end" className="dialog-actions">
                <Button 
                  variant="soft" 
                  color="gray"
                  onClick={() => setSelectedMaterial(null)}
                  className="dialog-button"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => {
                    setMaterials(prev => prev.map(m => 
                      m.id === selectedMaterial.id ? selectedMaterial : m
                    ));
                    setSelectedMaterial(null);
                  }}
                  className="dialog-button"
                >
                  Save Changes
                </Button>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>
        )}

        {/* Order Details Dialog */}
        {selectedOrder && (
          <Dialog.Root open onOpenChange={() => setSelectedOrder(null)}>
            <Dialog.Content className="order-dialog" style={{ maxWidth: '700px' }}>
              <Dialog.Title className="dialog-title">
                Order {selectedOrder.id}
              </Dialog.Title>
              
              <Grid columns="2" gap="3" mt="3">
                <Box>
                  <Text as="div" size="2" color="gray" className="dialog-label">
                    Material
                  </Text>
                  <Text className="dialog-value">{selectedOrder.materialName}</Text>
                </Box>
                
                {/* بقية حقول عرض بيانات الطلب بنفس النمط */}
                
              </Grid>
              
              <Flex gap="3" mt="4" justify="end" className="dialog-actions">
                {selectedOrder.status === 'pending' && (
                  <>
                    <Button 
                      color="green"
                      onClick={() => {
                        updateOrderStatus(selectedOrder.id, 'approved');
                        setSelectedOrder(null);
                      }}
                      className="dialog-button"
                    >
                      Approve
                    </Button>
                    <Button 
                      color="red"
                      onClick={() => {
                        updateOrderStatus(selectedOrder.id, 'cancelled');
                        setSelectedOrder(null);
                      }}
                      className="dialog-button"
                    >
                      Cancel
                    </Button>
                  </>
                )}
                {/* بقية حالات الطلب */}
                <Button 
                  variant="soft" 
                  color="gray"
                  onClick={() => setSelectedOrder(null)}
                  className="dialog-button"
                >
                  Close
                </Button>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>
        )}

        {/* Create Order Dialog */}
        <Dialog.Root open={showOrderDialog} onOpenChange={setShowOrderDialog}>
          <Dialog.Content className="create-order-dialog" style={{ maxWidth: '700px' }}>
            <Dialog.Title className="dialog-title">
              Create Purchase Order
            </Dialog.Title>
            
            <Grid columns="2" gap="3" mt="3">
              <Box>
                <Text as="div" size="2" mb="1" weight="bold" className="dialog-label">
                  Material
                </Text>
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
                  <Select.Trigger placeholder="Select material" className="dialog-select" />
                  <Select.Content className="select-content">
                    {materials.map(material => (
                      <Select.Item 
                        key={material.id} 
                        value={material.id}
                        className="select-item"
                      >
                        {material.name} ({material.currentStock - material.reserved} {material.unit} available)
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </Box>
              
              {/* بقية حقول إنشاء الطلب بنفس النمط */}
              
            </Grid>
            
            <Flex gap="3" mt="4" justify="end" className="dialog-actions">
              <Button 
                variant="soft" 
                color="gray"
                onClick={() => {
                  setShowOrderDialog(false);
                  setNewOrder({ status: 'pending', orderDate: today });
                }}
                className="dialog-button"
              >
                Cancel
              </Button>
              <Button 
                onClick={createManualOrder}
                className="dialog-button"
              >
                Create Order
              </Button>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>

        {/* Add Material Dialog */}
        <Dialog.Root open={showMaterialDialog} onOpenChange={setShowMaterialDialog}>
          <Dialog.Content className="add-material-dialog" style={{ maxWidth: '700px' }}>
            <Dialog.Title className="dialog-title">
              Add New Material
            </Dialog.Title>
            
            <Grid columns="2" gap="3" mt="3">
              <Box>
                <Text as="div" size="2" mb="1" weight="bold" className="dialog-label">
                  Material Name
                </Text>
                <TextField.Root>
                  <TextField.Input
                    type="text"
                    placeholder="Material Name"
                    value={newMaterial.name || ''}
                    onChange={(e) => setNewMaterial({
                      ...newMaterial,
                      name: e.target.value
                    })}
                    className="dialog-input"
                  />
                </TextField.Root>
              </Box>
              
              {/* بقية حقول إضافة مادة جديدة بنفس النمط */}
              
            </Grid>
            
            <Flex gap="3" mt="4" justify="end" className="dialog-actions">
              <Button 
                variant="soft" 
                color="gray"
                onClick={() => {
                  setShowMaterialDialog(false);
                  setNewMaterial({ unit: 'kg', sensorConnected: false, category: 'A' });
                }}
                className="dialog-button"
              >
                Cancel
              </Button>
              <Button 
                onClick={addNewMaterial}
                className="dialog-button"
              >
                Add Material
              </Button>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>

        {/* Blockchain History Dialog */}
        <Dialog.Root open={showBlockchainDialog} onOpenChange={setShowBlockchainDialog}>
          <Dialog.Content className="blockchain-dialog" style={{ maxWidth: '700px' }}>
            <Dialog.Title className="dialog-title">
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
              <Table.Root variant="surface" className="blockchain-table">
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeaderCell className="table-header-cell">
                      Transaction Hash
                    </Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell className="table-header-cell">
                      Action
                    </Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell className="table-header-cell">
                      Date
                    </Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {blockchainData.map((tx, index) => (
                    <Table.Row key={index} className="table-row">
                      <Table.Cell className="blockchain-hash">
                        <Text size="1">{tx.txHash}</Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge className="blockchain-action">
                          {tx.action}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>
                        {new Date(tx.timestamp).toLocaleString()}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            )}
            
            <Flex gap="3" mt="4" justify="end" className="dialog-actions">
              <Button 
                variant="soft" 
                color="gray"
                onClick={() => setShowBlockchainDialog(false)}
                className="dialog-button"
              >
                Close
              </Button>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      </Flex>
    </Container>
  );
};

export default RawMaterialsInventory;
