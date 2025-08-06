import React, { useState, ChangeEvent, useEffect, useCallback } from 'react';
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
  Theme
} from '@radix-ui/themes';
import {
  CubeIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  LightningBoltIcon,
  Link2Icon,
  TokensIcon,
  SunIcon,
  MoonIcon,
  BarChartIcon,
  LockClosedIcon,
  PersonIcon
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
  unitPrice: number;
  sensorConnected: boolean;
  lastSensorUpdate?: string;
  sensorReadings?: {
    temperature?: number;
    humidity?: number;
    weight?: number;
  };
  blockchainTx?: string;
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

interface User {
  name: string;
  role: 'admin' | 'manager' | 'viewer';
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

  static async verifyTransaction(txHash: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 500);
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
const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
}).format(amount);

// Initial Data
const initialMaterials: RawMaterial[] = [
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
    unitPrice: 12.5,
    sensorConnected: false
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
    unitPrice: 14.2,
    sensorConnected: false
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
    unitPrice: 18.7,
    sensorConnected: false
  }
];

const InventoryChart = ({ materials }: { materials: RawMaterial[] }) => {
  const maxValue = Math.max(...materials.map(m => m.currentStock), 100);
  
  return (
    <Box className="chart-container" mt="4">
      <Flex direction="column" gap="2">
        {materials.map(material => {
          const percentage = (material.currentStock / maxValue) * 100;
          const reorderPercentage = (material.reorderLevel / maxValue) * 100;
          const safetyPercentage = (material.safetyStock / maxValue) * 100;
          
          return (
            <Box key={material.id}>
              <Flex justify="between" mb="1">
                <Text size="2" weight="bold">{material.name}</Text>
                <Text size="2">{material.currentStock} {material.unit}</Text>
              </Flex>
              <Box position="relative" height="20px" mb="4">
                <Box 
                  position="absolute" 
                  left={`${safetyPercentage}%`} 
                  height="100%" 
                  width="2px" 
                  style={{ background: '#ef4444', zIndex: 2 }}
                />
                <Box 
                  position="absolute" 
                  left={`${reorderPercentage}%`} 
                  height="100%" 
                  width="2px" 
                  style={{ background: '#f59e0b', zIndex: 2 }}
                />
                <Progress 
                  value={percentage} 
                  size="1" 
                  style={{ position: 'relative', zIndex: 1 }} 
                />
                <Flex justify="between" mt="1">
                  <Text size="1" color="red">Safety: {material.safetyStock}</Text>
                  <Text size="1" color="amber">Reorder: {material.reorderLevel}</Text>
                </Flex>
              </Box>
            </Box>
          );
        })}
      </Flex>
    </Box>
  );
};

const BlockchainVisualization = ({ transactions }: { transactions: BlockchainTransaction[] }) => {
  return (
    <Box className="blockchain-vis" mt="3">
      <Flex direction="column" gap="4">
        {transactions.map((tx, idx) => (
          <Flex key={tx.txHash} align="center" gap="3">
            <Box className="block-node" style={{
              padding: '8px 12px',
              borderRadius: '8px',
              background: '#f3f4f6',
              border: '1px solid #e5e7eb'
            }}>
              <Text weight="bold">{tx.action.toUpperCase()}</Text>
            </Box>
            
            {idx < transactions.length - 1 && (
              <Box style={{ width: '40px', height: '2px', background: '#d1d5db' }} />
            )}
          </Flex>
        ))}
      </Flex>
    </Box>
  );
};

const LoginScreen = ({ onLogin }: { onLogin: (user: User) => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple authentication
    if (username === 'admin' && password === 'SecurePass123!') {
      onLogin({ name: 'Admin User', role: 'admin' });
    } else if (username === 'manager' && password === 'ManagerPass456!') {
      onLogin({ name: 'Inventory Manager', role: 'manager' });
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };
  
  return (
    <Container size="1" className="login-container" style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh'
    }}>
      <Card style={{ width: '380px', padding: '24px' }}>
        <Flex direction="column" align="center" gap="4">
          <LockClosedIcon width={32} height={32} />
          <Heading size="5" mb="2">Inventory Management System</Heading>
          
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Flex direction="column" gap="3">
              <Box>
                <Text as="label" size="2" weight="bold" htmlFor="username">
                  Username
                </Text>
                <TextField.Root mt="1">
                  <TextField.Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                  />
                </TextField.Root>
              </Box>
              
              <Box>
                <Text as="label" size="2" weight="bold" htmlFor="password">
                  Password
                </Text>
                <TextField.Root mt="1">
                  <TextField.Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                  />
                </TextField.Root>
              </Box>
              
              {error && (
                <Text color="red" size="2">{error}</Text>
              )}
              
              <Button type="submit" mt="2">
                Sign In
              </Button>
            </Flex>
          </form>
          
          <Text size="2" color="gray" mt="3">
            Demo credentials: admin/SecurePass123! or manager/ManagerPass456!
          </Text>
        </Flex>
      </Card>
    </Container>
  );
};

const RawMaterialsInventory = () => {
  // State
  const [user, setUser] = useState<User | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [materials, setMaterials] = useState<RawMaterial[]>(initialMaterials);
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
    unitPrice: 0
  });
  const [blockchainData, setBlockchainData] = useState<BlockchainTransaction[]>([]);
  const [isLoadingBlockchain, setIsLoadingBlockchain] = useState(false);
  const [sensorStatus, setSensorStatus] = useState<Record<string, boolean>>({});
  const [isConnectingSensor, setIsConnectingSensor] = useState(false);
  const [sensorAlerts, setSensorAlerts] = useState<Record<string, string>>({});
  
  // Connect to IoT sensor
  const connectToSensor = useCallback(async (materialId: string) => {
    setIsConnectingSensor(true);
    try {
      const connected = await IoTSensorService.connectToSensor(materialId);
      if (connected) {
        const readings = await IoTSensorService.getSensorReadings(materialId);
        
        // Check for environmental alerts
        const alerts = [];
        if (readings.temperature && (readings.temperature < 15 || readings.temperature > 30)) {
          alerts.push(`Temperature out of range (${readings.temperature}°C)`);
        }
        if (readings.humidity && (readings.humidity < 30 || readings.humidity > 60)) {
          alerts.push(`Humidity out of range (${readings.humidity}%)`);
        }
        
        if (alerts.length > 0) {
          setSensorAlerts(prev => ({
            ...prev,
            [materialId]: alerts.join(', ')
          }));
        }
        
        setMaterials(materials.map(m => 
          m.id === materialId ? { 
            ...m, 
            sensorConnected: true,
            lastSensorUpdate: new Date().toISOString(),
            sensorReadings: readings
          } : m
        ));
        
        setSensorStatus(prev => ({ ...prev, [materialId]: true }));
        
        // Update stock if weight reading is available
        if (readings.weight) {
          const material = materials.find(m => m.id === materialId);
          if (material) {
            const newStock = Math.round(readings.weight);
            if (Math.abs(newStock - material.currentStock) > 5) {
              const adjustment = newStock - material.currentStock;
              
              // Record stock adjustment on blockchain
              await recordBlockchainTransaction(
                material.id,
                'adjustment',
                adjustment,
                ['IoT Sensor', 'System']
              );
              
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
  }, [materials]);

  // Record transaction on blockchain
  const recordBlockchainTransaction = useCallback(async (
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
  }, []);

  // Generate purchase orders automatically
  const generateAutoOrders = useCallback(async () => {
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

        // Simulate delivery after lead time
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
  }, [materials, orders, recordBlockchainTransaction]);

  // Update order status
  const updateOrderStatus = useCallback(async (orderId: string, status: PurchaseOrder['status']) => {
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
  }, [orders, materials, recordBlockchainTransaction]);

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
  
  const inventoryValue = materials.reduce((sum, m) => 
    sum + (m.currentStock * m.unitPrice), 0
  );

  // Show login screen if no user
  if (!user) {
    return <LoginScreen onLogin={setUser} />;
  }

  return (
    <Theme appearance={darkMode ? "dark" : "light"}>
      <Container size="3" px="4" py="6">
        {/* Header */}
        <Flex justify="between" align="center" mb="5">
          <Flex align="center" gap="4">
            <CubeIcon width={28} height={28} />
            <Heading size="6">PharmaSupply Inventory Manager</Heading>
          </Flex>
          
          <Flex align="center" gap="3">
            <Flex align="center" gap="1" className="user-info">
              <PersonIcon />
              <Text>{user.name} ({user.role})</Text>
            </Flex>
            <Button 
              variant="soft" 
              onClick={() => setDarkMode(!darkMode)}
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <SunIcon /> : <MoonIcon />}
            </Button>
            <Button 
              variant="soft" 
              color="red"
              onClick={() => setUser(null)}
            >
              Logout
            </Button>
          </Flex>
        </Flex>

        {/* Inventory Dashboard */}
        <Grid columns="4" gap="4" mb="5">
          <Card>
            <Flex align="center" gap="3">
              <Box className="metric-icon" style={{ background: '#fef2f2' }}>
                <ExclamationTriangleIcon width={24} height={24} color="#ef4444" />
              </Box>
              <Box>
                <Text as="div" size="2" color="gray">Critical Materials</Text>
                <Heading size="5">{criticalMaterials}</Heading>
              </Box>
            </Flex>
          </Card>
          
          <Card>
            <Flex align="center" gap="3">
              <Box className="metric-icon" style={{ background: '#fffbeb' }}>
                <ClockIcon width={24} height={24} color="#f59e0b" />
              </Box>
              <Box>
                <Text as="div" size="2" color="gray">Reorder Needed</Text>
                <Heading size="5">{reorderNeeded}</Heading>
              </Box>
            </Flex>
          </Card>
          
          <Card>
            <Flex align="center" gap="3">
              <Box className="metric-icon" style={{ background: '#eff6ff' }}>
                <CubeIcon width={24} height={24} color="#3b82f6" />
              </Box>
              <Box>
                <Text as="div" size="2" color="gray">Pending Orders</Text>
                <Heading size="5">{pendingOrdersCount}</Heading>
              </Box>
            </Flex>
          </Card>
          
          <Card>
            <Flex align="center" gap="3">
              <Box className="metric-icon" style={{ background: '#f0fdf4' }}>
                <LightningBoltIcon width={24} height={24} color="#22c55e" />
              </Box>
              <Box>
                <Text as="div" size="2" color="gray">Connected Sensors</Text>
                <Heading size="5">{connectedSensors}/{materials.length}</Heading>
              </Box>
            </Flex>
          </Card>
        </Grid>

        {/* Inventory Value Card */}
        <Card mb="5">
          <Flex align="center" gap="3">
            <Box className="metric-icon" style={{ background: '#f5f3ff' }}>
              <TokensIcon width={24} height={24} color="#8b5cf6" />
            </Box>
            <Box>
              <Text as="div" size="2" color="gray">Total Inventory Value</Text>
              <Heading size="5">{formatCurrency(inventoryValue)}</Heading>
            </Box>
          </Flex>
        </Card>

        {/* Inventory Visualization */}
        <Card mb="5">
          <Flex justify="between" align="center" mb="3">
            <Heading size="5">Inventory Levels</Heading>
            <BarChartIcon />
          </Flex>
          <InventoryChart materials={materials} />
        </Card>

        {/* Action Buttons */}
        <Flex gap="3" mb="5" wrap="wrap">
          <Button onClick={generateAutoOrders}>
            Generate Auto Orders
          </Button>
          
          {user.role !== 'viewer' && (
            <>
              <Button onClick={() => setShowOrderDialog(true)}>
                Create Manual Order
              </Button>
              <Button onClick={() => setShowMaterialDialog(true)}>
                Add New Material
              </Button>
            </>
          )}
          
          <Flex align="center" gap="2">
            <Switch 
              checked={showReorderOnly}
              onCheckedChange={setShowReorderOnly}
            />
            <Text>Show Only Materials Needing Reorder</Text>
          </Flex>
        </Flex>

        {/* Materials Table */}
        <Card mb="5">
          <Flex justify="between" align="center" mb="3">
            <Heading size="5">Raw Materials Inventory</Heading>
            <Text color="gray">{materials.length} materials registered</Text>
          </Flex>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Material</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Current Stock</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Reserved</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Available</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Value</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>IoT Status</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {materials
                .filter(material => !showReorderOnly || 
                  (material.currentStock - material.reserved) <= material.reorderLevel)
                .map(material => {
                  const available = material.currentStock - material.reserved;
                  const isCritical = available <= material.safetyStock;
                  const needsReorder = available <= material.reorderLevel;
                  const stockPercentage = (material.currentStock / (material.reorderLevel * 1.5)) * 100;
                  const materialValue = material.currentStock * material.unitPrice;
                  
                  return (
                    <Table.Row key={material.id} style={{
                      backgroundColor: isCritical ? '#fee2e2' : needsReorder ? '#fef3c7' : 'inherit'
                    }}>
                      <Table.Cell>
                        <Flex align="center" gap="2">
                          {material.name}
                          {material.blockchainTx && <TokensIcon color="blue" />}
                          {sensorAlerts[material.id] && (
                            <Badge color="red">Alert</Badge>
                          )}
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
                      <Table.Cell>{formatCurrency(materialValue)}</Table.Cell>
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
                        <Flex gap="2">
                          <Button 
                            size="1" 
                            onClick={() => setSelectedMaterial(material)}
                            disabled={user.role === 'viewer'}
                          >
                            Configure
                          </Button>
                          <Button 
                            size="1" 
                            variant="soft" 
                            onClick={() => {
                              fetchBlockchainHistory(material.id);
                            }}
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
                      <Button 
                        size="1" 
                        onClick={() => setSelectedOrder(order)}
                        disabled={user.role === 'viewer' && order.status !== 'pending'}
                      >
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
                  {sensorAlerts[selectedMaterial.id] && (
                    <Badge color="red">
                      <ExclamationTriangleIcon /> Alert: {sensorAlerts[selectedMaterial.id]}
                    </Badge>
                  )}
                </Flex>
              </Dialog.Title>
              
              <Grid columns="2" gap="3" mt="3">
                <Box>
                  <Text as="div" size="2" mb="1" weight="bold">Minimum Stock Level</Text>
                  <TextField.Root>
                    <TextField.Input
                      type="number"
                      value={selectedMaterial.minStockLevel}
                      onChange={(e) => setSelectedMaterial({
                        ...selectedMaterial,
                        minStockLevel: Number(e.target.value)
                      })}
                    />
                  </TextField.Root>
                </Box>
                
                <Box>
                  <Text as="div" size="2" mb="1" weight="bold">Reorder Level</Text>
                  <TextField.Root>
                    <TextField.Input
                      type="number"
                      value={selectedMaterial.reorderLevel}
                      onChange={(e) => setSelectedMaterial({
                        ...selectedMaterial,
                        reorderLevel: Number(e.target.value)
                      })}
                    />
                  </TextField.Root>
                </Box>
                
                <Box>
                  <Text as="div" size="2" mb="1" weight="bold">Safety Stock</Text>
                  <TextField.Root>
                    <TextField.Input
                      type="number"
                      value={selectedMaterial.safetyStock}
                      onChange={(e) => setSelectedMaterial({
                        ...selectedMaterial,
                        safetyStock: Number(e.target.value)
                      })}
                    />
                  </TextField.Root>
                </Box>
                
                <Box>
                  <Text as="div" size="2" mb="1" weight="bold">Lead Time (days)</Text>
                  <TextField.Root>
                    <TextField.Input
                      type="number"
                      value={selectedMaterial.leadTime}
                      onChange={(e) => setSelectedMaterial({
                        ...selectedMaterial,
                        leadTime: Number(e.target.value)
                      })}
                    />
                  </TextField.Root>
                </Box>
                
                <Box>
                  <Text as="div" size="2" mb="1" weight="bold">Order Quantity</Text>
                  <TextField.Root>
                    <TextField.Input
                      type="number"
                      value={selectedMaterial.orderQuantity}
                      onChange={(e) => setSelectedMaterial({
                        ...selectedMaterial,
                        orderQuantity: Number(e.target.value)
                      })}
                    />
                  </TextField.Root>
                </Box>
                
                <Box>
                  <Text as="div" size="2" mb="1" weight="bold">Unit Price</Text>
                  <TextField.Root>
                    <TextField.Input
                      type="number"
                      step="0.01"
                      value={selectedMaterial.unitPrice}
                      onChange={(e) => setSelectedMaterial({
                        ...selectedMaterial,
                        unitPrice: Number(e.target.value)
                      })}
                    />
                  </TextField.Root>
                </Box>
                
                <Box>
                  <Text as="div" size="2" mb="1" weight="bold">Unit</Text>
                  <TextField.Root>
                    <TextField.Input
                      type="text"
                      value={selectedMaterial.unit}
                      onChange={(e) => setSelectedMaterial({
                        ...selectedMaterial,
                        unit: e.target.value
                      })}
                    />
                  </TextField.Root>
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
                {selectedOrder.status === 'pending' && user.role !== 'viewer' && (
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
                {selectedOrder.status === 'approved' && user.role !== 'viewer' && (
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
                {selectedOrder.status === 'shipped' && user.role !== 'viewer' && (
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
                  <TextField.Input
                    type="number"
                    placeholder="Quantity"
                    value={newOrder.quantity || ''}
                    onChange={(e) => setNewOrder({
                      ...newOrder,
                      quantity: Number(e.target.value)
                    })}
                  />
                </TextField.Root>
              </Box>
              
              <Box>
                <Text as="div" size="2" mb="1" weight="bold">Supplier</Text>
                <TextField.Root>
                  <TextField.Input
                    type="text"
                    placeholder="Supplier"
                    value={newOrder.supplier || ''}
                    onChange={(e) => setNewOrder({
                      ...newOrder,
                      supplier: e.target.value
                    })}
                  />
                </TextField.Root>
              </Box>
              
              <Box>
                <Text as="div" size="2" mb="1" weight="bold">Expected Delivery</Text>
                <TextField.Root>
                  <TextField.Input
                    type="date"
                    placeholder="Expected Delivery"
                    value={newOrder.expectedDelivery?.split('T')[0] || ''}
                    onChange={(e) => setNewOrder({
                      ...newOrder,
                      expectedDelivery: new Date(e.target.value).toISOString()
                    })}
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
              <Button onClick={async () => {
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
                
                // Simulate delivery after lead time
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
              }}>
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
                  <TextField.Input
                    type="text"
                    placeholder="Material Name"
                    value={newMaterial.name || ''}
                    onChange={(e) => setNewMaterial({
                      ...newMaterial,
                      name: e.target.value
                    })}
                  />
                </TextField.Root>
              </Box>
              
              <Box>
                <Text as="div" size="2" mb="1" weight="bold">Supplier</Text>
                <TextField.Root>
                  <TextField.Input
                    type="text"
                    placeholder="Supplier"
                    value={newMaterial.supplier || ''}
                    onChange={(e) => setNewMaterial({
                      ...newMaterial,
                      supplier: e.target.value
                    })}
                  />
                </TextField.Root>
              </Box>
              
              <Box>
                <Text as="div" size="2" mb="1" weight="bold">Current Stock</Text>
                <TextField.Root>
                  <TextField.Input
                    type="number"
                    placeholder="Current Stock"
                    value={newMaterial.currentStock || ''}
                    onChange={(e) => setNewMaterial({
                      ...newMaterial,
                      currentStock: Number(e.target.value)
                    })}
                  />
                </TextField.Root>
              </Box>
              
              <Box>
                <Text as="div" size="2" mb="1" weight="bold">Unit (kg, g, L, etc.)</Text>
                <TextField.Root>
                  <TextField.Input
                    type="text"
                    placeholder="Unit"
                    value={newMaterial.unit || ''}
                    onChange={(e) => setNewMaterial({
                      ...newMaterial,
                      unit: e.target.value
                    })}
                  />
                </TextField.Root>
              </Box>
              
              <Box>
                <Text as="div" size="2" mb="1" weight="bold">Unit Price</Text>
                <TextField.Root>
                  <TextField.Input
                    type="number"
                    step="0.01"
                    placeholder="Unit Price"
                    value={newMaterial.unitPrice || ''}
                    onChange={(e) => setNewMaterial({
                      ...newMaterial,
                      unitPrice: Number(e.target.value)
                    })}
                  />
                </TextField.Root>
              </Box>
              
              <Box>
                <Text as="div" size="2" mb="1" weight="bold">Minimum Stock Level</Text>
                <TextField.Root>
                  <TextField.Input
                    type="number"
                    placeholder="Minimum Stock Level"
                    value={newMaterial.minStockLevel || ''}
                    onChange={(e) => setNewMaterial({
                      ...newMaterial,
                      minStockLevel: Number(e.target.value)
                    })}
                  />
                </TextField.Root>
              </Box>
              
              <Box>
                <Text as="div" size="2" mb="1" weight="bold">Reorder Level</Text>
                <TextField.Root>
                  <TextField.Input
                    type="number"
                    placeholder="Reorder Level"
                    value={newMaterial.reorderLevel || ''}
                    onChange={(e) => setNewMaterial({
                      ...newMaterial,
                      reorderLevel: Number(e.target.value)
                    })}
                  />
                </TextField.Root>
              </Box>
              
              <Box>
                <Text as="div" size="2" mb="1" weight="bold">Safety Stock</Text>
                <TextField.Root>
                  <TextField.Input
                    type="number"
                    placeholder="Safety Stock"
                    value={newMaterial.safetyStock || ''}
                    onChange={(e) => setNewMaterial({
                      ...newMaterial,
                      safetyStock: Number(e.target.value)
                    })}
                  />
                </TextField.Root>
              </Box>
              
              <Box>
                <Text as="div" size="2" mb="1" weight="bold">Lead Time (days)</Text>
                <TextField.Root>
                  <TextField.Input
                    type="number"
                    placeholder="Lead Time"
                    value={newMaterial.leadTime || ''}
                    onChange={(e) => setNewMaterial({
                      ...newMaterial,
                      leadTime: Number(e.target.value)
                    })}
                  />
                </TextField.Root>
              </Box>
              
              <Box>
                <Text as="div" size="2" mb="1" weight="bold">Order Quantity</Text>
                <TextField.Root>
                  <TextField.Input
                    type="number"
                    placeholder="Order Quantity"
                    value={newMaterial.orderQuantity || ''}
                    onChange={(e) => setNewMaterial({
                      ...newMaterial,
                      orderQuantity: Number(e.target.value)
                    })}
                  />
                </TextField.Root>
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
                  setNewMaterial({ unit: 'kg', sensorConnected: false, unitPrice: 0 });
                }}
              >
                Cancel
              </Button>
              <Button onClick={async () => {
                if (!newMaterial.name || !newMaterial.supplier) return;

                const material: RawMaterial = {
                  id: generateId('MAT'),
                  name: newMaterial.name || '',
                  currentStock: newMaterial.currentStock || 0,
                  reserved: newMaterial.reserved || 0,
                  minStockLevel: newMaterial.minStockLevel || 0,
                  reorderLevel: newMaterial.reorderLevel || 0,
                  safetyStock: newMaterial.safetyStock || 0,
                  leadTime: newMaterial.leadTime || 0,
                  supplier: newMaterial.supplier || '',
                  supplierRating: 0,
                  orderQuantity: newMaterial.orderQuantity || 0,
                  pendingOrders: 0,
                  unit: newMaterial.unit || 'kg',
                  unitPrice: newMaterial.unitPrice || 0,
                  sensorConnected: false
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
                setNewMaterial({ unit: 'kg', sensorConnected: false, unitPrice: 0 });
              }}>
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
              <>
                <BlockchainVisualization transactions={blockchainData} />
                
                <Table.Root mt="4">
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
              </>
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
    </Theme>
  );
};

export default RawMaterialsInventory;
