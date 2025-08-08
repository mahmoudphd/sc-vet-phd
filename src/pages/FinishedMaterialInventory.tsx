import React, { useState, useEffect, useMemo } from 'react';
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
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
  CartesianGrid,
  Tooltip
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
  CheckCircledIcon,
  CrossCircledIcon
} from '@radix-ui/react-icons';

/**
 * Inventory Management Types
 */
type MaterialCategory = 'A' | 'B' | 'C';
type OrderStatus = 'pending' | 'approved' | 'shipped' | 'delivered' | 'cancelled';
type BlockchainAction = 'order' | 'delivery' | 'adjustment';

interface SensorReadings {
  temperature?: number;
  humidity?: number;
  weight?: number;
}

interface ShippingConditions {
  temperature?: number;
  humidity?: number;
}

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
  sensorReadings?: SensorReadings;
  blockchainTx?: string;
  location: string;
  category: MaterialCategory;
  expiryDate: string;
}

interface PurchaseOrder {
  id: string;
  materialId: string;
  materialName: string;
  quantity: number;
  supplier: string;
  expectedDelivery: string;
  status: OrderStatus;
  orderDate: string;
  notes?: string;
  blockchainTx?: string;
  relatedTxHash?: string;
  shippingConditions?: ShippingConditions;
}

interface BlockchainTransaction {
  txHash: string;
  timestamp: string;
  materialId: string;
  action: BlockchainAction;
  participants: string[];
  relatedTxHash?: string;
  quantity?: number;
}

interface InventoryValueItem {
  name: string;
  value: number;
  category: MaterialCategory;
  fill: string;
  unit: string;
}

// Helper Utilities
let poCounter = 1;
const generateId = (prefix: string) => {
  if (prefix === 'PO') {
    return `PO-${poCounter++}`;
  }
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

const today = new Date().toISOString().split('T')[0];

const CATEGORY_COLORS = {
  A: '#3b82f6',
  B: '#10b981',
  C: '#6b7280'
};

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case 'delivered': return 'green';
    case 'shipped': return 'blue';
    case 'approved': return 'purple';
    case 'cancelled': return 'red';
    default: return 'orange';
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

const getDaysRemaining = (expiryDate: string) => {
  const expiry = new Date(expiryDate).getTime();
  const now = Date.now();
  return Math.floor((expiry - now) / (1000 * 60 * 60 * 24));
};

// Services
class IoTSensorService {
  static async connectToSensor(materialId: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Math.random() > 0.2);
      }, 500);
    });
  }

  static async getSensorReadings(materialId: string): Promise<SensorReadings> {
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
    action: BlockchainAction,
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

const RawMaterialsInventory = () => {
  const [state, setState] = useState({
    materials: [] as RawMaterial[],
    orders: [] as PurchaseOrder[],
    filters: {
      showReorderOnly: false,
      location: 'all',
      category: 'all'
    },
    sortConfig: null as {key: keyof RawMaterial, direction: 'asc' | 'desc'} | null,
    dialogs: {
      order: false,
      material: false,
      blockchain: false
    },
    selected: {
      material: null as RawMaterial | null,
      order: null as PurchaseOrder | null
    },
    newOrder: {
      status: 'pending' as OrderStatus,
      orderDate: today
    } as Partial<PurchaseOrder>,
    newMaterial: {
      unit: 'kg',
      sensorConnected: false,
      category: 'A' as MaterialCategory,
      expiryDate: '2025-12-31'
    } as Partial<RawMaterial>,
    blockchainData: [] as BlockchainTransaction[],
    loading: {
      blockchain: false,
      sensor: false
    }
  });

  // Initialize with sample data
  useEffect(() => {
    poCounter = 1;
    setState(prev => ({
      ...prev,
      materials: [
        {
          id: generateId('MAT'),
          name: 'Vitamin B1',
          currentStock: 120,
          reserved: 40,
          minStockLevel: 50,
          reorderLevel: 80,
          safetyStock: 30,
          leadTime: 7,
          supplier: 'Supplier A',
          supplierRating: 4.5,
          orderQuantity: 100,
          pendingOrders: 0,
          unit: 'kg',
          sensorConnected: false,
          location: 'Zone 1',
          category: 'A',
          expiryDate: '2025-03-15'
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
          supplier: 'Supplier B',
          supplierRating: 3.8,
          orderQuantity: 120,
          pendingOrders: 0,
          unit: 'kg',
          sensorConnected: false,
          location: 'Zone 2',
          category: 'B',
          expiryDate: '2025-08-20'
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
          supplier: 'Supplier C',
          supplierRating: 4.2,
          orderQuantity: 80,
          pendingOrders: 0,
          unit: 'kg',
          sensorConnected: false,
          location: 'Zone 1',
          category: 'C',
          expiryDate: '2025-12-31'
        }
      ]
    }));
  }, []);

  // Filtered and sorted materials
  const filteredMaterials = useMemo(() => {
    let result = [...state.materials];
    
    if (state.filters.showReorderOnly) {
      result = result.filter(m => 
        (m.currentStock - m.reserved) <= m.reorderLevel
      );
    }
    
    if (state.filters.location !== 'all') {
      result = result.filter(m => m.location === state.filters.location);
    }
    
    if (state.filters.category !== 'all') {
      result = result.filter(m => m.category === state.filters.category);
    }
    
    if (state.sortConfig) {
      result.sort((a, b) => {
        if (state.sortConfig?.key === 'expiryDate') {
          const aDate = new Date(a.expiryDate).getTime();
          const bDate = new Date(b.expiryDate).getTime();
          return state.sortConfig.direction === 'asc' ? aDate - bDate : bDate - aDate;
        }
        
        const aValue = a[state.sortConfig!.key];
        const bValue = b[state.sortConfig!.key];
        
        if (aValue === undefined || bValue === undefined) return 0;
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return state.sortConfig!.direction === 'asc' 
            ? aValue - bValue 
            : bValue - aValue;
        }
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return state.sortConfig!.direction === 'asc' 
            ? aValue.localeCompare(bValue) 
            : bValue.localeCompare(aValue);
        }
        
        return 0;
      });
    }
    
    return result;
  }, [state.materials, state.filters, state.sortConfig]);

  // Derived statistics
  const { criticalMaterials, reorderNeeded, pendingOrdersCount, connectedSensors } = useMemo(() => {
    return {
      criticalMaterials: state.materials.filter(m => 
        (m.currentStock - m.reserved) <= m.safetyStock
      ).length,
      reorderNeeded: state.materials.filter(m => 
        (m.currentStock - m.reserved) <= m.reorderLevel
      ).length,
      pendingOrdersCount: state.orders.filter(o => 
        o.status === 'pending' || o.status === 'approved'
      ).length,
      connectedSensors: state.materials.filter(m => m.sensorConnected).length
    };
  }, [state.materials, state.orders]);

  // Chart data
  const { inventoryValueData, stockLevelData } = useMemo(() => {
    return {
      inventoryValueData: filteredMaterials.map(item => ({
        name: item.name,
        value: item.currentStock * item.orderQuantity,
        category: item.category,
        fill: CATEGORY_COLORS[item.category],
        unit: item.unit
      })),
      stockLevelData: filteredMaterials.map(item => ({
        name: item.name,
        currentStock: item.currentStock,
        reserved: item.reserved,
        available: item.currentStock - item.reserved,
        reorderLevel: item.reorderLevel,
        safetyStock: item.safetyStock
      }))
    };
  }, [filteredMaterials]);

  // Handlers
  const handlers = {
    connectToSensor: async (materialId: string) => {
      setState(prev => ({ ...prev, loading: { ...prev.loading, sensor: true } }));
      try {
        const connected = await IoTSensorService.connectToSensor(materialId);
        if (connected) {
          const readings = await IoTSensorService.getSensorReadings(materialId);
          
          setState(prev => ({
            ...prev,
            materials: prev.materials.map(m => 
              m.id === materialId ? { 
                ...m, 
                sensorConnected: true,
                lastSensorUpdate: new Date().toISOString(),
                sensorReadings: readings,
                ...(readings.weight ? { 
                  currentStock: Math.abs(Math.round(readings.weight) - m.currentStock) > 5 
                    ? Math.round(readings.weight) 
                    : m.currentStock 
                } : {})
              } : m
            )
          }));
        }
      } catch (error) {
        console.error('Sensor connection failed:', error);
      } finally {
        setState(prev => ({ ...prev, loading: { ...prev.loading, sensor: false } }));
      }
    },
    
    generateAutoOrders: async () => {
      const newOrders: PurchaseOrder[] = [];
      const updatedMaterials = [...state.materials];

      for (const [index, material] of state.materials.entries()) {
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

          const txHash = await BlockchainService.recordTransaction(
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
            setState(prev => {
              const orderExists = prev.orders.find(o => o.id === newOrder.id);
              if (!orderExists) return prev;
              
              const updatedOrders = prev.orders.map(o => {
                if (o.id === newOrder.id && (o.status === 'pending' || o.status === 'approved')) {
                  BlockchainService.recordTransaction(
                    material.id,
                    'delivery',
                    orderQuantity,
                    [material.supplier, 'Warehouse Manager'],
                    txHash
                  ).then(deliveryTxHash => {
                    setState(prev => ({
                      ...prev,
                      orders: prev.orders.map(ord => 
                        ord.id === newOrder.id ? { ...ord, status: 'delivered', blockchainTx: deliveryTxHash } : ord
                      ),
                      materials: prev.materials.map(m => 
                        m.id === material.id ? { 
                          ...m, 
                          currentStock: m.currentStock + orderQuantity,
                          pendingOrders: m.pendingOrders - orderQuantity
                        } : m
                      )
                    }));
                  });
                }
                return o;
              });
              
              return { ...prev, orders: updatedOrders };
            });
          }, material.leadTime * 86400000);
        }
      }

      setState(prev => ({
        ...prev,
        orders: [...prev.orders, ...newOrders],
        materials: updatedMaterials
      }));
    },
    
    createManualOrder: async () => {
      if (!state.newOrder.materialId || !state.newOrder.quantity) return;

      const material = state.materials.find(m => m.id === state.newOrder.materialId);
      if (!material) return;

      const order: PurchaseOrder = {
        id: generateId('PO'),
        materialId: material.id,
        materialName: material.name,
        quantity: Number(state.newOrder.quantity),
        supplier: state.newOrder.supplier || material.supplier,
        expectedDelivery: state.newOrder.expectedDelivery || 
          new Date(
            new Date().setDate(new Date().getDate() + material.leadTime)
          ).toISOString(),
        status: 'pending',
        orderDate: today,
        notes: state.newOrder.notes,
        shippingConditions: {
          temperature: material.sensorReadings?.temperature,
          humidity: material.sensorReadings?.humidity
        }
      };

      const txHash = await BlockchainService.recordTransaction(
        material.id,
        'order',
        order.quantity,
        [order.supplier, 'Warehouse Manager']
      );
      order.blockchainTx = txHash;

      setState(prev => ({
        ...prev,
        orders: [...prev.orders, order],
        materials: prev.materials.map(m => 
          m.id === material.id ? { ...m, pendingOrders: m.pendingOrders + order.quantity } : m
        ),
        dialogs: { ...prev.dialogs, order: false },
        newOrder: { status: 'pending', orderDate: today }
      }));
      
      setTimeout(async () => {
        setState(prev => {
          const existingOrder = prev.orders.find(o => o.id === order.id);
          if (!existingOrder) return prev;
          
          const updatedOrders = prev.orders.map(o => {
            if (o.id === order.id && (o.status === 'pending' || o.status === 'approved')) {
              BlockchainService.recordTransaction(
                material.id,
                'delivery',
                order.quantity,
                [order.supplier, 'Warehouse Manager'],
                txHash
              ).then(deliveryTxHash => {
                setState(prev => ({
                  ...prev,
                  orders: prev.orders.map(ord => 
                    ord.id === order.id ? { ...ord, status: 'delivered', blockchainTx: deliveryTxHash } : ord
                  ),
                  materials: prev.materials.map(m => 
                    m.id === material.id ? { 
                      ...m, 
                      currentStock: m.currentStock + order.quantity,
                      pendingOrders: m.pendingOrders - order.quantity
                    } : m
                  )
                }));
              });
            }
            return o;
          });
          
          return { ...prev, orders: updatedOrders };
        });
      }, material.leadTime * 86400000);
    },
    
    addNewMaterial: async () => {
      if (!state.newMaterial.name || !state.newMaterial.supplier) return;

      const material: RawMaterial = {
        id: generateId('MAT'),
        name: state.newMaterial.name,
        currentStock: state.newMaterial.currentStock || 0,
        reserved: state.newMaterial.reserved || 0,
        minStockLevel: state.newMaterial.minStockLevel || 0,
        reorderLevel: state.newMaterial.reorderLevel || 0,
        safetyStock: state.newMaterial.safetyStock || 0,
        leadTime: state.newMaterial.leadTime || 0,
        supplier: state.newMaterial.supplier,
        supplierRating: 0,
        orderQuantity: state.newMaterial.orderQuantity || 0,
        pendingOrders: 0,
        unit: state.newMaterial.unit || 'kg',
        sensorConnected: state.newMaterial.sensorConnected || false,
        location: state.newMaterial.location || 'Zone 1',
        category: state.newMaterial.category || 'A',
        expiryDate: state.newMaterial.expiryDate || '2025-12-31'
      };

      const txHash = await BlockchainService.recordTransaction(
        material.id,
        'adjustment',
        material.currentStock,
        ['System', 'Warehouse Manager']
      );
      material.blockchainTx = txHash;

      setState(prev => ({
        ...prev,
        materials: [...prev.materials, material],
        dialogs: { ...prev.dialogs, material: false },
        newMaterial: { unit: 'kg', sensorConnected: false, category: 'A', expiryDate: '2025-12-31' }
      }));
    },
    
    updateOrderStatus: async (orderId: string, status: OrderStatus) => {
      const updatedOrders = state.orders.map(order => {
        if (order.id === orderId) {
          const updatedOrder = { ...order, status };
          
          if (status === 'delivered' && order.blockchainTx) {
            BlockchainService.recordTransaction(
              order.materialId,
              'delivery',
              order.quantity,
              [order.supplier, 'Warehouse Manager'],
              order.blockchainTx
            ).then(txHash => {
              setState(prev => ({
                ...prev,
                orders: prev.orders.map(o => 
                  o.id === orderId ? { ...o, blockchainTx: txHash } : o
                )
              }));
            });
            
            setState(prev => ({
              ...prev,
              materials: prev.materials.map(m => 
                m.id === order.materialId ? { 
                  ...m, 
                  currentStock: m.currentStock + order.quantity,
                  pendingOrders: m.pendingOrders - order.quantity
                } : m
              )
            }));
          }
          
          return updatedOrder;
        }
        return order;
      });

      setState(prev => ({ ...prev, orders: updatedOrders }));
    },
    
    fetchBlockchainHistory: async (materialId: string) => {
      setState(prev => ({ ...prev, loading: { ...prev.loading, blockchain: true } }));
      try {
        const history = await BlockchainService.getTransactionHistory(materialId);
        setState(prev => ({
          ...prev,
          blockchainData: history,
          dialogs: { ...prev.dialogs, blockchain: true }
        }));
      } catch (error) {
        console.error('Failed to fetch blockchain data:', error);
      } finally {
        setState(prev => ({ ...prev, loading: { ...prev.loading, blockchain: false } }));
      }
    },
    
    requestSort: (key: keyof RawMaterial) => {
      let direction: 'asc' | 'desc' = 'asc';
      if (state.sortConfig?.key === key && state.sortConfig.direction === 'asc') {
        direction = 'desc';
      }
      setState(prev => ({ ...prev, sortConfig: { key, direction } }));
    }
  };

  return (
    <Container size="3" px="4" py="6">
      {/* Dashboard Cards */}
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
              <Heading size="5">{connectedSensors}/{state.materials.length}</Heading>
            </Box>
          </Flex>
        </Card>
      </Grid>

      {/* Action Buttons */}
      <Flex gap="3" mb="4" wrap="wrap">
        <Button onClick={handlers.generateAutoOrders}>
          Generate Auto Orders
        </Button>
        <Button onClick={() => setState(prev => ({ ...prev, dialogs: { ...prev.dialogs, order: true } }))}>
          Create Manual Order
        </Button>
        <Button onClick={() => setState(prev => ({ ...prev, dialogs: { ...prev.dialogs, material: true } }))}>
          Add New Material
        </Button>
        <Flex align="center" gap="2">
          <Switch 
            checked={state.filters.showReorderOnly}
            onCheckedChange={(checked) => setState(prev => ({
              ...prev,
              filters: { ...prev.filters, showReorderOnly: checked }
            }))}
          />
          <Text>Show Only Materials Needing Reorder</Text>
        </Flex>
        
        <Select.Root 
          value={state.filters.location}
          onValueChange={(value) => setState(prev => ({
            ...prev,
            filters: { ...prev.filters, location: value }
          }))}
        >
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

        <Select.Root 
          value={state.filters.category}
          onValueChange={(value) => setState(prev => ({
            ...prev,
            filters: { ...prev.filters, category: value as MaterialCategory }
          }))}
        >
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
      <Card mb="4" style={{ overflow: 'hidden' }}>
        <Flex justify="between" align="center" mb="3">
          <Heading size="5">Raw Materials Inventory</Heading>
          <Text color="gray">{filteredMaterials.length} materials filtered</Text>
        </Flex>
        <Table.Root style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
          <Table.Header>
            <Table.Row style={{ 
              backgroundColor: '#3b82f6', 
              color: 'white',
              fontWeight: 600,
              textTransform: 'uppercase'
            }}>
              <Table.ColumnHeaderCell 
                onClick={() => handlers.requestSort('name')}
                style={{ borderTopLeftRadius: '8px', padding: '12px 16px' }}
              >
                Material {state.sortConfig?.key === 'name' && (state.sortConfig.direction === 'asc' ? '↑' : '↓')}
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell 
                onClick={() => handlers.requestSort('currentStock')}
                style={{ padding: '12px 16px' }}
              >
                Current Stock {state.sortConfig?.key === 'currentStock' && (state.sortConfig.direction === 'asc' ? '↑' : '↓')}
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell 
                onClick={() => handlers.requestSort('reserved')}
                style={{ padding: '12px 16px' }}
              >
                Reserved {state.sortConfig?.key === 'reserved' && (state.sortConfig.direction === 'asc' ? '↑' : '↓')}
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell style={{ padding: '12px 16px' }}>
                Available
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell style={{ padding: '12px 16px' }}>
                IoT Status
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell 
                onClick={() => handlers.requestSort('expiryDate')}
                style={{ padding: '12px 16px' }}
              >
                Expiry D {state.sortConfig?.key === 'expiryDate' && (state.sortConfig.direction === 'asc' ? '↑' : '↓')}
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell style={{ padding: '12px 16px' }}>
                Location
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell style={{ borderTopRightRadius: '8px', padding: '12px 16px' }}>
                Actions
              </Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredMaterials.map((material, index) => {
              const available = material.currentStock - material.reserved;
              const isCritical = available <= material.safetyStock;
              const needsReorder = available <= material.reorderLevel;
              const stockPercentage = (material.currentStock / (material.reorderLevel * 1.5)) * 100;
              const daysRemaining = getDaysRemaining(material.expiryDate);
              
              return (
                <Table.Row 
                  key={material.id}
                  style={{
                    backgroundColor: index % 2 === 0 ? '#f9fafb' : 'white',
                    borderBottom: '1px solid #f0f0f0',
                    ':hover': {
                      backgroundColor: '#f5f7fa'
                    },
                    borderLeft: isCritical ? '3px solid #ef4444' : needsReorder ? '3px solid #f59e0b' : '3px solid transparent'
                  }}
                >
                  <Table.Cell style={{ padding: '12px 16px', borderRight: '1px solid #f0f0f0' }}>
                    <Flex align="center" gap="2">
                      {material.name}
                      {material.blockchainTx && <TokensIcon color="blue" />}
                    </Flex>
                  </Table.Cell>
                  <Table.Cell style={{ padding: '12px 16px', borderRight: '1px solid #f0f0f0' }}>
                    <Flex direction="column" gap="1">
                      <Text>{material.currentStock} {material.unit}</Text>
                      <Progress value={Math.min(stockPercentage, 100)} />
                    </Flex>
                  </Table.Cell>
                  <Table.Cell style={{ padding: '12px 16px', borderRight: '1px solid #f0f0f0' }}>
                    {material.reserved} {material.unit}
                  </Table.Cell>
                  <Table.Cell style={{ padding: '12px 16px', borderRight: '1px solid #f0f0f0' }}>
                    {available} {material.unit}
                  </Table.Cell>
                  <Table.Cell style={{ padding: '12px 16px', borderRight: '1px solid #f0f0f0' }}>
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
                        onClick={() => handlers.connectToSensor(material.id)}
                        disabled={state.loading.sensor}
                      >
                        {state.loading.sensor ? 'Connecting...' : 'Connect Sensor'}
                      </Button>
                    )}
                  </Table.Cell>
                  <Table.Cell style={{ padding: '12px 16px', borderRight: '1px solid #f0f0f0' }}>
                    <Badge 
                      color={
                        daysRemaining <= 90 ? 'red' :
                        daysRemaining <= 180 ? 'orange' : 'green'
                      }
                      style={{ 
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px'
                      }}
                    >
                      {formatDate(material.expiryDate)}
                      {daysRemaining <= 90 && <ExclamationTriangleIcon style={{ marginLeft: '4px' }} />}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell style={{ padding: '12px 16px', borderRight: '1px solid #f0f0f0' }}>
                    {material.location}
                  </Table.Cell>
                  <Table.Cell style={{ padding: '12px 16px' }}>
                    <Flex gap="2">
                      <Button size="1" onClick={() => setState(prev => ({ ...prev, selected: { ...prev.selected, material } })}>
                        Configure
                      </Button>
                      <Button 
                        size="1" 
                        variant="soft" 
                        onClick={() => handlers.fetchBlockchainHistory(material.id)}
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
              <Tooltip 
                content={({ active, payload }) => {
                  if (!active || !payload || payload.length === 0) return null;
                  
                  const data = payload[0].payload as InventoryValueItem;
                  
                  return (
                    <div style={{
                      backgroundColor: '#fff',
                      padding: '10px',
                      border: '1px solid #ccc',
                      borderRadius: '4px'
                    }}>
                      <p style={{ fontWeight: 'bold' }}>{data.name}</p>
                      <p>{`Value: ${data.value}`}</p>
                      <p>{`Unit: ${data.unit}`}</p>
                    </div>
                  );
                }}
              />
              <Legend />
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
              <Tooltip />
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
          <Text color="gray">{state.orders.length} orders in system</Text>
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
            {state.orders.map(order => {
              const material = state.materials.find(m => m.id === order.materialId);
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
                  <Table.Cell>{formatDate(order.orderDate)}</Table.Cell>
                  <Table.Cell>
                    <Badge color={getStatusColor(order.status)}>
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
                    <Button size="1" onClick={() => setState(prev => ({ ...prev, selected: { ...prev.selected, order } }))}>
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
      {state.selected.material && (
        <Dialog.Root open onOpenChange={() => setState(prev => ({ ...prev, selected: { ...prev.selected, material: null } }))}>
          <Dialog.Content style={{ maxWidth: '700px' }}>
            <Dialog.Title>
              <Flex align="center" gap="2">
                Configure {state.selected.material.name}
                {state.selected.material.sensorConnected && (
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
                    value={state.selected.material.minStockLevel}
                    onChange={(e) => setState(prev => ({
                      ...prev,
                      selected: {
                        ...prev.selected,
                        material: {
                          ...prev.selected.material!,
                          minStockLevel: parseInt(e.target.value) || 0
                        }
                      }
                    }))}
                  />
                </TextField.Root>
              </Box>
              
              <Box>
                <Text as="div" size="2" mb="1" weight="bold">Reorder Level</Text>
                <TextField.Root>
                  <input
                    type="number"
                    value={state.selected.material.reorderLevel}
                    onChange={(e) => setState(prev => ({
                      ...prev,
                      selected: {
                        ...prev.selected,
                        material: {
                          ...prev.selected.material!,
                          reorderLevel: parseInt(e.target.value) || 0
                        }
                      }
                    }))}
                  />
                </TextField.Root>
              </Box>
              
              <Box>
                <Text as="div" size="2" mb="1" weight="bold">Safety Stock</Text>
                <TextField.Root>
                  <input
                    type="number"
                    value={state.selected.material.safetyStock}
                    onChange={(e) => setState(prev => ({
                      ...prev,
                      selected: {
                        ...prev.selected,
                        material: {
                          ...prev.selected.material!,
                          safetyStock: parseInt(e.target.value) || 0
                        }
                      }
                    }))}
                  />
                </TextField.Root>
              </Box>
              
              <Box>
                <Text as="div" size="2" mb="1" weight="bold">Lead Time (days)</Text>
                <TextField.Root>
                  <input
                    type="number"
                    value={state.selected.material.leadTime}
                    onChange={(e) => setState(prev => ({
                      ...prev,
                      selected: {
                        ...prev.selected,
                        material: {
                          ...prev.selected.material!,
                          leadTime: parseInt(e.target.value) || 0
                        }
                      }
                    }))}
                  />
                </TextField.Root>
              </Box>
              
              <Box>
                <Text as="div" size="2" mb="1" weight="bold">Order Quantity</Text>
                <TextField.Root>
                  <input
                    type="number"
                    value={state.selected.material.orderQuantity}
                    onChange={(e) => setState(prev => ({
                      ...prev,
                      selected: {
                        ...prev.selected,
                        material: {
                          ...prev.selected.material!,
                          orderQuantity: parseInt(e.target.value) || 0
                        }
                      }
                    }))}
                  />
                </TextField.Root>
              </Box>
              
              <Box>
                <Text as="div" size="2" mb="1" weight="bold">Unit</Text>
                <TextField.Root>
                  <input
                    type="text"
                    value={state.selected.material.unit}
                    onChange={(e) => setState(prev => ({
                      ...prev,
                      selected: {
                        ...prev.selected,
                        material: {
                          ...prev.selected.material!,
                          unit: e.target.value
                        }
                      }
                    }))}
                  />
                </TextField.Root>
              </Box>

              <Box>
                <Text as="div" size="2" mb="1" weight="bold">Location</Text>
                <Select.Root
                  value={state.selected.material.location}
                  onValueChange={(value) => setState(prev => ({
                    ...prev,
                    selected: {
                      ...prev.selected,
                      material: {
                        ...prev.selected.material!,
                        location: value
                      }
                    }
                  }))}
                >
                  <Select.Trigger />
                  <Select.Content>
                    <Select.Item value="Zone 1">Zone 1</Select.Item>
                    <Select.Item value="Zone 2">Zone 2</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Box>

              <Box>
                <Text as="div" size="2" mb="1" weight="bold">Expiry Date</Text>
                <TextField.Root>
                  <input
                    type="date"
                    value={state.selected.material.expiryDate.split('T')[0]}
                    onChange={(e) => setState(prev => ({
                      ...prev,
                      selected: {
                        ...prev.selected,
                        material: {
                          ...prev.selected.material!,
                          expiryDate: e.target.value
                        }
                      }
                    }))}
                  />
                </TextField.Root>
              </Box>

              {state.selected.material.sensorConnected && state.selected.material.sensorReadings && (
                <>
                  <Box>
                    <Text as="div" size="2" mb="1" weight="bold">Temperature</Text>
                    <Text>{state.selected.material.sensorReadings.temperature}°C</Text>
                  </Box>
                  <Box>
                    <Text as="div" size="2" mb="1" weight="bold">Humidity</Text>
                    <Text>{state.selected.material.sensorReadings.humidity}%</Text>
                  </Box>
                  <Box>
                    <Text as="div" size="2" mb="1" weight="bold">Last Sensor Update</Text>
                    <Text>
                      {state.selected.material.lastSensorUpdate ? 
                        new Date(state.selected.material.lastSensorUpdate).toLocaleString() : 
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
                onClick={() => setState(prev => ({ ...prev, selected: { ...prev.selected, material: null } }))}
              >
                Cancel
              </Button>
              <Button onClick={() => {
                setState(prev => ({
                  ...prev,
                  materials: prev.materials.map(m => 
                    m.id === state.selected.material!.id ? state.selected.material! : m
                  ),
                  selected: { ...prev.selected, material: null }
                }));
              }}>
                Save Changes
              </Button>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      )}

      {/* Order Details Dialog */}
      {state.selected.order && (
        <Dialog.Root open onOpenChange={() => setState(prev => ({ ...prev, selected: { ...prev.selected, order: null } }))}>
          <Dialog.Content style={{ maxWidth: '700px' }}>
            <Dialog.Title>Order {state.selected.order.id}</Dialog.Title>
            
            <Grid columns="2" gap="3" mt="3">
              <Box>
                <Text as="div" size="2" color="gray">Material</Text>
                <Text>{state.selected.order.materialName}</Text>
              </Box>
              
              <Box>
                <Text as="div" size="2" color="gray">Quantity</Text>
                <Text>{state.selected.order.quantity}</Text>
              </Box>
              
              <Box>
                <Text as="div" size="2" color="gray">Supplier</Text>
                <Text>{state.selected.order.supplier}</Text>
              </Box>
              
              <Box>
                <Text as="div" size="2" color="gray">Order Date</Text>
                <Text>{formatDate(state.selected.order.orderDate)}</Text>
              </Box>
              
              <Box>
                <Text as="div" size="2" color="gray">Expected Delivery</Text>
                <Text>{formatDate(state.selected.order.expectedDelivery)}</Text>
              </Box>
              
              <Box>
                <Text as="div" size="2" color="gray">Status</Text>
                <Text>
                  <Badge color={getStatusColor(state.selected.order.status)}>
                    {state.selected.order.status}
                  </Badge>
                </Text>
              </Box>

              {state.selected.order.blockchainTx && (
                <Box style={{ gridColumn: '1 / -1' }}>
                  <Text as="div" size="2" color="gray">Blockchain Transaction</Text>
                  <Text style={{ wordBreak: 'break-all' }}>{state.selected.order.blockchainTx}</Text>
                </Box>
              )}

              {state.selected.order.shippingConditions && (
                <>
                  <Box>
                    <Text as="div" size="2" color="gray">Shipping Temperature</Text>
                    <Text>{state.selected.order.shippingConditions.temperature}°C</Text>
                  </Box>
                  <Box>
                    <Text as="div" size="2" color="gray">Shipping Humidity</Text>
                    <Text>{state.selected.order.shippingConditions.humidity}%</Text>
                  </Box>
                </>
              )}
            </Grid>
            
            {state.selected.order.notes && (
              <Box mt="3">
                <Text as="div" size="2" color="gray">Notes</Text>
                <Text>{state.selected.order.notes}</Text>
              </Box>
            )}
            
            <Flex gap="3" mt="4" justify="end">
              {state.selected.order.status === 'pending' && (
                <>
                  <Button 
                    color="green"
                    onClick={() => {
                      handlers.updateOrderStatus(state.selected.order!.id, 'approved');
                      setState(prev => ({ ...prev, selected: { ...prev.selected, order: null } }));
                    }}
                  >
                    Approve
                  </Button>
                  <Button 
                    color="red"
                    onClick={() => {
                      handlers.updateOrderStatus(state.selected.order!.id, 'cancelled');
                      setState(prev => ({ ...prev, selected: { ...prev.selected, order: null } }));
                    }}
                  >
                    Cancel
                  </Button>
                </>
              )}
              {state.selected.order.status === 'approved' && (
                <Button 
                  color="blue"
                  onClick={() => {
                    handlers.updateOrderStatus(state.selected.order!.id, 'shipped');
                    setState(prev => ({ ...prev, selected: { ...prev.selected, order: null } }));
                  }}
                >
                  Mark as Shipped
                </Button>
              )}
              {state.selected.order.status === 'shipped' && (
                <Button 
                  color="green"
                  onClick={() => {
                    handlers.updateOrderStatus(state.selected.order!.id, 'delivered');
                    setState(prev => ({ ...prev, selected: { ...prev.selected, order: null } }));
                  }}
                >
                  Mark as Delivered
                </Button>
              )}
              <Button 
                variant="soft" 
                color="gray"
                onClick={() => setState(prev => ({ ...prev, selected: { ...prev.selected, order: null } }))}
              >
                Close
              </Button>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      )}

      {/* Create Order Dialog */}
      <Dialog.Root open={state.dialogs.order} onOpenChange={(open) => setState(prev => ({ ...prev, dialogs: { ...prev.dialogs, order: open } }))}>
        <Dialog.Content style={{ maxWidth: '700px' }}>
          <Dialog.Title>Create Purchase Order</Dialog.Title>
          
          <Grid columns="2" gap="3" mt="3">
            <Box>
              <Text as="div" size="2" mb="1" weight="bold">Material</Text>
              <Select.Root
                value={state.newOrder.materialId}
                onValueChange={(value) => {
                  const material = state.materials.find(m => m.id === value);
                  setState(prev => ({
                    ...prev,
                    newOrder: {
                      ...prev.newOrder,
                      materialId: value,
                      supplier: material?.supplier || ''
                    }
                  }));
                }}
              >
                <Select.Trigger placeholder="Select material" />
                <Select.Content>
                  {state.materials.map(material => (
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
                  value={state.newOrder.quantity || ''}
                  onChange={(e) => setState(prev => ({
                    ...prev,
                    newOrder: {
                      ...prev.newOrder,
                      quantity: parseInt(e.target.value) || 0
                    }
                  }))}
                />
              </TextField.Root>
            </Box>
            
            <Box>
              <Text as="div" size="2" mb="1" weight="bold">Supplier</Text>
              <TextField.Root>
                <input
                  type="text"
                  placeholder="Supplier"
                  value={state.newOrder.supplier || ''}
                  onChange={(e) => setState(prev => ({
                    ...prev,
                    newOrder: {
                      ...prev.newOrder,
                      supplier: e.target.value
                    }
                  }))}
                />
              </TextField.Root>
            </Box>
            
            <Box>
              <Text as="div" size="2" mb="1" weight="bold">Expected Delivery</Text>
              <TextField.Root>
                <input
                  type="date"
                  placeholder="Expected Delivery"
                  value={state.newOrder.expectedDelivery?.split('T')[0] || ''}
                  onChange={(e) => setState(prev => ({
                    ...prev,
                    newOrder: {
                      ...prev.newOrder,
                      expectedDelivery: new Date(e.target.value).toISOString()
                    }
                  }))}
                />
              </TextField.Root>
            </Box>
            
            <Box style={{ gridColumn: '1 / -1' }}>
              <Text as="div" size="2" mb="1" weight="bold">Notes (optional)</Text>
              <TextArea
                placeholder="Notes"
                value={state.newOrder.notes || ''}
                onChange={(e) => setState(prev => ({
                  ...prev,
                  newOrder: {
                    ...prev.newOrder,
                    notes: e.target.value
                  }
                }))}
              />
            </Box>
          </Grid>
          
          <Flex gap="3" mt="4" justify="end">
            <Button 
              variant="soft" 
              color="gray"
              onClick={() => setState(prev => ({
                ...prev,
                dialogs: { ...prev.dialogs, order: false },
                newOrder: { status: 'pending', orderDate: today }
              }))}
            >
              Cancel
            </Button>
            <Button onClick={handlers.createManualOrder}>
              Create Order
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      {/* Add Material Dialog */}
      <Dialog.Root open={state.dialogs.material} onOpenChange={(open) => setState(prev => ({ ...prev, dialogs: { ...prev.dialogs, material: open } }))}>
        <Dialog.Content style={{ maxWidth: '700px' }}>
          <Dialog.Title>Add New Material</Dialog.Title>
          
          <Grid columns="2" gap="3" mt="3">
            <Box>
              <Text as="div" size="2" mb="1" weight="bold">Material Name</Text>
              <TextField.Root>
                <input
                  type="text"
                  placeholder="Material Name"
                  value={state.newMaterial.name || ''}
                  onChange={(e) => setState(prev => ({
                    ...prev,
                    newMaterial: {
                      ...prev.newMaterial,
                      name: e.target.value
                    }
                  }))}
                />
              </TextField.Root>
            </Box>
            
            <Box>
              <Text as="div" size="2" mb="1" weight="bold">Supplier</Text>
              <TextField.Root>
                <input
                  type="text"
                  placeholder="Supplier"
                  value={state.newMaterial.supplier || ''}
                  onChange={(e) => setState(prev => ({
                    ...prev,
                    newMaterial: {
                      ...prev.newMaterial,
                      supplier: e.target.value
                    }
                  }))}
                />
              </TextField.Root>
            </Box>
            
            <Box>
              <Text as="div" size="2" mb="1" weight="bold">Current Stock</Text>
              <TextField.Root>
                <input
                  type="number"
                  placeholder="Current Stock"
                  value={state.newMaterial.currentStock || ''}
                  onChange={(e) => setState(prev => ({
                    ...prev,
                    newMaterial: {
                      ...prev.newMaterial,
                      currentStock: parseInt(e.target.value) || 0
                    }
                  }))}
                />
              </TextField.Root>
            </Box>
            
            <Box>
              <Text as="div" size="2" mb="1" weight="bold">Unit (kg, g, L, etc.)</Text>
              <TextField.Root>
                <input
                  type="text"
                  placeholder="Unit"
                  value={state.newMaterial.unit || ''}
                  onChange={(e) => setState(prev => ({
                    ...prev,
                    newMaterial: {
                      ...prev.newMaterial,
                      unit: e.target.value
                    }
                  }))}
                />
              </TextField.Root>
            </Box>
            
            <Box>
              <Text as="div" size="2" mb="1" weight="bold">Minimum Stock Level</Text>
              <TextField.Root>
                <input
                  type="number"
                  placeholder="Minimum Stock Level"
                  value={state.newMaterial.minStockLevel || ''}
                  onChange={(e) => setState(prev => ({
                    ...prev,
                    newMaterial: {
                      ...prev.newMaterial,
                      minStockLevel: parseInt(e.target.value) || 0
                    }
                  }))}
                />
              </TextField.Root>
            </Box>
            
            <Box>
              <Text as="div" size="2" mb="1" weight="bold">Reorder Level</Text>
              <TextField.Root>
                <input
                  type="number"
                  placeholder="Reorder Level"
                  value={state.newMaterial.reorderLevel || ''}
                  onChange={(e) => setState(prev => ({
                    ...prev,
                    newMaterial: {
                      ...prev.newMaterial,
                      reorderLevel: parseInt(e.target.value) || 0
                    }
                  }))}
                />
              </TextField.Root>
            </Box>
            
            <Box>
              <Text as="div" size="2" mb="1" weight="bold">Safety Stock</Text>
              <TextField.Root>
                <input
                  type="number"
                  placeholder="Safety Stock"
                  value={state.newMaterial.safetyStock || ''}
                  onChange={(e) => setState(prev => ({
                    ...prev,
                    newMaterial: {
                      ...prev.newMaterial,
                      safetyStock: parseInt(e.target.value) || 0
                    }
                  }))}
                />
              </TextField.Root>
            </Box>
            
            <Box>
              <Text as="div" size="2" mb="1" weight="bold">Lead Time (days)</Text>
              <TextField.Root>
                <input
                  type="number"
                  placeholder="Lead Time"
                  value={state.newMaterial.leadTime || ''}
                  onChange={(e) => setState(prev => ({
                    ...prev,
                    newMaterial: {
                      ...prev.newMaterial,
                      leadTime: parseInt(e.target.value) || 0
                    }
                  }))}
                />
              </TextField.Root>
            </Box>
            
            <Box>
              <Text as="div" size="2" mb="1" weight="bold">Order Quantity</Text>
              <TextField.Root>
                <input
                  type="number"
                  placeholder="Order Quantity"
                  value={state.newMaterial.orderQuantity || ''}
                  onChange={(e) => setState(prev => ({
                    ...prev,
                    newMaterial: {
                      ...prev.newMaterial,
                      orderQuantity: parseInt(e.target.value) || 0
                    }
                  }))}
                />
              </TextField.Root>
            </Box>

            <Box>
              <Text as="div" size="2" mb="1" weight="bold">Location</Text>
              <Select.Root
                value={state.newMaterial.location || 'Zone 1'}
                onValueChange={(value) => setState(prev => ({
                  ...prev,
                  newMaterial: {
                    ...prev.newMaterial,
                    location: value
                  }
                }))}
              >
                <Select.Trigger />
                <Select.Content>
                  <Select.Item value="Zone 1">Zone 1</Select.Item>
                  <Select.Item value="Zone 2">Zone 2</Select.Item>
                </Select.Content>
              </Select.Root>
            </Box>

            <Box>
              <Text as="div" size="2" mb="1" weight="bold">Expiry Date</Text>
              <TextField.Root>
                <input
                  type="date"
                  value={state.newMaterial.expiryDate?.split('T')[0] || '2025-12-31'}
                  onChange={(e) => setState(prev => ({
                    ...prev,
                    newMaterial: {
                      ...prev.newMaterial,
                      expiryDate: e.target.value
                    }
                  }))}
                />
              </TextField.Root>
            </Box>

            <Box>
              <Text as="div" size="2" mb="1" weight="bold">IoT Sensor</Text>
              <Flex gap="2" align="center">
                <Switch 
                  checked={state.newMaterial.sensorConnected || false}
                  onCheckedChange={(checked) => setState(prev => ({
                    ...prev,
                    newMaterial: {
                      ...prev.newMaterial,
                      sensorConnected: checked
                    }
                  }))}
                />
                <Text>Connect IoT Sensor</Text>
              </Flex>
            </Box>
          </Grid>
          
          <Flex gap="3" mt="4" justify="end">
            <Button 
              variant="soft" 
              color="gray"
              onClick={() => setState(prev => ({
                ...prev,
                dialogs: { ...prev.dialogs, material: false },
                newMaterial: { unit: 'kg', sensorConnected: false, category: 'A', expiryDate: '2025-12-31' }
              }))}
            >
              Cancel
            </Button>
            <Button onClick={handlers.addNewMaterial}>
              Add Material
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      {/* Blockchain History Dialog */}
      <Dialog.Root open={state.dialogs.blockchain} onOpenChange={(open) => setState(prev => ({ ...prev, dialogs: { ...prev.dialogs, blockchain: open } }))}>
        <Dialog.Content style={{ maxWidth: '700px' }}>
          <Dialog.Title>
            <Flex align="center" gap="2">
              <TokensIcon /> Blockchain History
              {state.loading.blockchain && <Text size="2">Loading...</Text>}
            </Flex>
          </Dialog.Title>
          
          {state.loading.blockchain ? (
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
                {state.blockchainData.map((tx, index) => (
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
              onClick={() => setState(prev => ({ ...prev, dialogs: { ...prev.dialogs, blockchain: false } }))}
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
