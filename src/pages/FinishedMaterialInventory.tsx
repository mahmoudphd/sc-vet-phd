export type MaterialCategory = 'A' | 'B' | 'C';
export type OrderStatus = 'pending' | 'approved' | 'shipped' | 'delivered' | 'cancelled';
export type BlockchainAction = 'order' | 'delivery' | 'adjustment';

export interface SensorReadings {
  temperature?: number;
  humidity?: number;
  weight?: number;
}

export interface ShippingConditions {
  temperature?: number;
  humidity?: number;
}

export interface RawMaterial {
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

export interface PurchaseOrder {
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

export interface BlockchainTransaction {
  txHash: string;
  timestamp: string;
  materialId: string;
  action: BlockchainAction;
  participants: string[];
  relatedTxHash?: string;
  quantity?: number;
}

export interface InventoryValueItem {
  name: string;
  value: number;
  category: MaterialCategory;
  fill: string;
  unit: string;
}export const generateId = (prefix: string): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US');
};

export const getDaysRemaining = (expiryDate: string): number => {
  const expiry = new Date(expiryDate).getTime();
  const now = Date.now();
  return Math.floor((expiry - now) / (1000 * 60 * 60 * 24));
};

export const CATEGORY_COLORS = {
  A: '#3b82f6',
  B: '#10b981',
  C: '#6b7280'
};

export const getStatusColor = (status: OrderStatus): string => {
  switch (status) {
    case 'delivered': return 'green';
    case 'shipped': return 'blue';
    case 'approved': return 'purple';
    case 'cancelled': return 'red';
    default: return 'orange';
  }
};import { BlockchainTransaction, BlockchainAction } from '../types/inventoryTypes';

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
        const txHash = `0x${Array(64).fill(0).map(() => 
          Math.floor(Math.random() * 16).toString(16)).join('')}`;
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

export default BlockchainService;import React from 'react';
import { Table, Flex, Text } from '@radix-ui/themes';
import MaterialRow from './MaterialRow';
import { RawMaterial } from '../../types/inventoryTypes';

interface MaterialTableProps {
  materials: RawMaterial[];
  sortConfig: { key: keyof RawMaterial; direction: 'asc' | 'desc' } | null;
  onRequestSort: (key: keyof RawMaterial) => void;
  onConnectSensor: (materialId: string) => void;
  onViewMaterial: (material: RawMaterial) => void;
  onViewBlockchain: (materialId: string) => void;
  loading: boolean;
}

const MaterialTable: React.FC<MaterialTableProps> = ({
  materials,
  sortConfig,
  onRequestSort,
  onConnectSensor,
  onViewMaterial,
  onViewBlockchain,
  loading
}) => {
  return (
    <Table.Root style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
      <Table.Header>
        <Table.Row style={{ 
          backgroundColor: '#3b82f6', 
          color: 'white',
          fontWeight: 600,
          textTransform: 'uppercase'
        }}>
          <Table.ColumnHeaderCell 
            onClick={() => onRequestSort('name')}
            style={{ borderTopLeftRadius: '8px', padding: '12px 16px' }}
          >
            Material {sortConfig?.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell 
            onClick={() => onRequestSort('currentStock')}
            style={{ padding: '12px 16px' }}
          >
            Current Stock {sortConfig?.key === 'currentStock' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell 
            onClick={() => onRequestSort('reserved')}
            style={{ padding: '12px 16px' }}
          >
            Reserved {sortConfig?.key === 'reserved' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell style={{ padding: '12px 16px' }}>
            Available
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell style={{ padding: '12px 16px' }}>
            IoT Status
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell 
            onClick={() => onRequestSort('expiryDate')}
            style={{ padding: '12px 16px' }}
          >
            Expiry Date {sortConfig?.key === 'expiryDate' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
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
        {materials.map((material) => (
          <MaterialRow
            key={material.id}
            material={material}
            onConnectSensor={onConnectSensor}
            onViewMaterial={onViewMaterial}
            onViewBlockchain={onViewBlockchain}
            loading={loading}
          />
        ))}
      </Table.Body>
    </Table.Root>
  );
};

export default MaterialTable;import React, { useState, useEffect, useMemo } from 'react';
import {
  Card,
  Flex,
  Heading,
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
  DownloadIcon
} from '@radix-ui/react-icons';

import MaterialTable from './components/MaterialTable';
import { RawMaterial, PurchaseOrder } from './types/inventoryTypes';
import BlockchainService from './services/BlockchainService';
import { generateId, formatDate, getDaysRemaining, CATEGORY_COLORS, getStatusColor } from './utils/helpers';

const App: React.FC = () => {
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
      orderDate: new Date().toISOString().split('T')[0]
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

  useEffect(() => {
    // Initialize with sample data
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
        // More sample materials...
      ]
    }));
  }, []);

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
            orderDate: new Date().toISOString().split('T')[0]
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
            lastOrderDate: new Date().toISOString().split('T')[0]
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
    
    // Other handler functions...
  };

  return (
    <Container size="3" px="4" py="6">
      <Grid columns="4" gap="4" mb="4">
        {/* Stats Cards */}
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
        {/* Other stats cards... */}
      </Grid>

      {/* Action buttons and filters */}
      <Flex gap="3" mb="4" wrap="wrap">
        <Button onClick={handlers.generateAutoOrders}>
          Generate Auto Orders
        </Button>
        {/* Other buttons... */}
      </Flex>

      {/* Main Material Table */}
      <Card mb="4" style={{ overflow: 'hidden' }}>
        <Flex justify="between" align="center" mb="3">
          <Heading size="5">Raw Materials Inventory</Heading>
          <Text color="gray">{filteredMaterials.length} materials filtered</Text>
        </Flex>
        <MaterialTable
          materials={filteredMaterials}
          sortConfig={state.sortConfig}
          onRequestSort={(key) => setState(prev => ({
            ...prev,
            sortConfig: { 
              key, 
              direction: prev.sortConfig?.key === key && prev.sortConfig.direction === 'asc' 
                ? 'desc' 
                : 'asc' 
            }
          }))}
          onConnectSensor={handlers.connectToSensor}
          onViewMaterial={(material) => setState(prev => ({ ...prev, selected: { ...prev.selected, material } }))}
          onViewBlockchain={async (materialId) => {
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
          }}
          loading={state.loading.sensor}
        />
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
                formatter={(value: number) => [`Value: ${value}`, '']}
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

      {/* Orders Table */}
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

      {/* Dialogs and Modals */}
      {state.selected.material && (
        <MaterialDetailsDialog
          material={state.selected.material}
          onClose={() => setState(prev => ({ ...prev, selected: { ...prev.selected, material: null } }))}
          onSave={(updatedMaterial) => {
            setState(prev => ({
              ...prev,
              materials: prev.materials.map(m => 
                m.id === updatedMaterial.id ? updatedMaterial : m
              ),
              selected: { ...prev.selected, material: null }
            }));
          }}
        />
      )}

      {state.dialogs.order && (
        <OrderFormDialog
          materials={state.materials}
          onClose={() => setState(prev => ({
            ...prev,
            dialogs: { ...prev.dialogs, order: false },
            newOrder: { status: 'pending', orderDate: new Date().toISOString().split('T')[0] }
          }))}
          onSubmit={handlers.createManualOrder}
        />
      )}

      {state.dialogs.blockchain && (
        <BlockchainDialog
          transactions={state.blockchainData}
          loading={state.loading.blockchain}
          onClose={() => setState(prev => ({ ...prev, dialogs: { ...prev.dialogs, blockchain: false } }))}
        />
      )}
    </Container>
  );
};

export default App;import React from 'react';
import { Dialog, Flex, Grid, Box, Text, TextField, Select, Button, Badge } from '@radix-ui/themes';
import { RawMaterial } from '../types/inventoryTypes';
import { formatDate } from '../utils/helpers';
import { Link2Icon, ExclamationTriangleIcon } from '@radix-ui/react-icons';

interface MaterialDetailsDialogProps {
  material: RawMaterial;
  onClose: () => void;
  onSave: (material: RawMaterial) => void;
}

const MaterialDetailsDialog: React.FC<MaterialDetailsDialogProps> = ({ material, onClose, onSave }) => {
  const [editedMaterial, setEditedMaterial] = React.useState<RawMaterial>(material);

  return (
    <Dialog.Root open onOpenChange={onClose}>
      <Dialog.Content style={{ maxWidth: '700px' }}>
        <Dialog.Title>
          <Flex align="center" gap="2">
            Configure {material.name}
            {material.sensorConnected && (
              <Badge color="green">
                <Link2Icon /> IoT Connected
              </Badge>
            )}
          </Flex>
        </Dialog.Title>
        
        <Grid columns="2" gap="3" mt="3">
          {/* Form fields for editing material properties */}
          <Box>
            <Text as="div" size="2" mb="1" weight="bold">Minimum Stock Level</Text>
            <TextField.Root>
              <input
                type="number"
                value={editedMaterial.minStockLevel}
                onChange={(e) => setEditedMaterial({
                  ...editedMaterial,
                  minStockLevel: parseInt(e.target.value) || 0
                })}
              />
            </TextField.Root>
          </Box>
          
          {/* Other form fields... */}
        </Grid>
        
        <Flex gap="3" mt="4" justify="end">
          <Button 
            variant="soft" 
            color="gray"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button onClick={() => onSave(editedMaterial)}>
            Save Changes
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default MaterialDetailsDialog;import React from 'react';
import { Dialog, Grid, Box, Text, TextField, Select, Button, TextArea } from '@radix-ui/themes';
import { RawMaterial } from '../types/inventoryTypes';

interface OrderFormDialogProps {
  materials: RawMaterial[];
  onClose: () => void;
  onSubmit: (order: Partial<PurchaseOrder>) => void;
}

const OrderFormDialog: React.FC<OrderFormDialogProps> = ({ materials, onClose, onSubmit }) => {
  const [order, setOrder] = React.useState<Partial<PurchaseOrder>>({
    status: 'pending',
    orderDate: new Date().toISOString().split('T')[0]
  });

  return (
    <Dialog.Root open onOpenChange={onClose}>
      <Dialog.Content style={{ maxWidth: '700px' }}>
        <Dialog.Title>Create Purchase Order</Dialog.Title>
        
        <Grid columns="2" gap="3" mt="3">
          <Box>
            <Text as="div" size="2" mb="1" weight="bold">Material</Text>
            <Select.Root
              value={order.materialId}
              onValueChange={(value) => {
                const material = materials.find(m => m.id === value);
                setOrder({
                  ...order,
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
          
          {/* Other form fields... */}
        </Grid>
        
        <Flex gap="3" mt="4" justify="end">
          <Button 
            variant="soft" 
            color="gray"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button onClick={() => onSubmit(order)}>
            Create Order
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default OrderFormDialog;import React from 'react';
import { Dialog, Table, Flex, Text, Button, Badge } from '@radix-ui/themes';
import { BlockchainTransaction } from '../types/inventoryTypes';

interface BlockchainDialogProps {
  transactions: BlockchainTransaction[];
  loading: boolean;
  onClose: () => void;
}

const BlockchainDialog: React.FC<BlockchainDialogProps> = ({ transactions, loading, onClose }) => {
  return (
    <Dialog.Root open onOpenChange={onClose}>
      <Dialog.Content style={{ maxWidth: '700px' }}>
        <Dialog.Title>
          <Flex align="center" gap="2">
            Blockchain History
            {loading && <Text size="2">Loading...</Text>}
          </Flex>
        </Dialog.Title>
        
        {loading ? (
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
              {transactions.map((tx, index) => (
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
            onClick={onClose}
          >
            Close
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default BlockchainDialog;
