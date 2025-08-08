import React, { useState, useEffect, useMemo } from 'react';
import {
  Card, Flex, Heading, Table, Button, TextField,
  Box, Text, Badge, Dialog, Select, Grid, Switch,
  TextArea, Container, Progress
} from '@radix-ui/themes';
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer,
  Cell, PieChart, Pie, Legend, CartesianGrid, Tooltip
} from 'recharts';
import {
  CubeIcon, MixerHorizontalIcon, ExclamationTriangleIcon,
  ClockIcon, LightningBoltIcon, Link2Icon, TokensIcon,
  DownloadIcon, CheckCircledIcon, QuestionMarkCircledIcon,
  PrinterIcon
} from '@radix-ui/react-icons';

type MaterialCategory = 'A' | 'B' | 'C';
type OrderStatus = 'pending' | 'approved' | 'shipped' | 'delivered' | 'cancelled';

interface SensorReadings {
  temperature?: number;
  humidity?: number;
  weight?: number;
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
  expiryDate?: string;
  unit: string;
  sensorConnected: boolean;
  lastSensorUpdate?: string;
  sensorReadings?: SensorReadings;
  blockchainTx?: string;
  location: string;
  category: MaterialCategory;
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
  shippingConditions?: {
    temperature?: number;
    humidity?: number;
  };
}const generateId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
const today = new Date().toISOString().split('T')[0];

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case 'delivered': return 'green';
    case 'shipped': return 'blue';
    case 'approved': return 'purple';
    case 'cancelled': return 'red';
    default: return 'orange';
  }
};

const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

const RawMaterialsInventory = () => {
  const [state, setState] = useState({
    materials: [] as RawMaterial[],
    orders: [] as PurchaseOrder[],
    filters: {
      showReorderOnly: false,
      location: 'all',
      category: 'all',
      searchQuery: ''
    },
    sortConfig: null as { key: keyof RawMaterial, direction: 'asc' | 'desc' } | null,
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
      category: 'A' as MaterialCategory
    } as Partial<RawMaterial>,
    loading: {
      blockchain: false,
      sensor: false
    }
  });

  useEffect(() => {
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
        supplier: 'Supplier A',
        supplierRating: 4.5,
        orderQuantity: 100,
        pendingOrders: 0,
        expiryDate: '2024-12-31',
        unit: 'kg',
        sensorConnected: true,
        location: 'Zone 1',
        category: 'A',
        sensorReadings: { temperature: 22, humidity: 45, weight: 115 },
        lastSensorUpdate: today
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
        expiryDate: '2023-06-15',
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
        supplier: 'Supplier C',
        supplierRating: 4.2,
        orderQuantity: 80,
        pendingOrders: 0,
        unit: 'kg',
        sensorConnected: true,
        location: 'Zone 1',
        category: 'C',
        sensorReadings: { temperature: 24, humidity: 50, weight: 75 },
        lastSensorUpdate: today
      }
    ];

    const initialOrders: PurchaseOrder[] = [
      {
        id: 'PO-1',
        materialId: initialMaterials[0].id,
        materialName: initialMaterials[0].name,
        quantity: 100,
        supplier: initialMaterials[0].supplier,
        expectedDelivery: '2023-12-15',
        status: 'delivered',
        orderDate: '2023-11-10'
      },
      {
        id: 'PO-2',
        materialId: initialMaterials[1].id,
        materialName: initialMaterials[1].name,
        quantity: 120,
        supplier: initialMaterials[1].supplier,
        expectedDelivery: '2023-12-20',
        status: 'shipped',
        orderDate: '2023-11-15'
      }
    ];

    setState(prev => ({
      ...prev,
      materials: initialMaterials,
      orders: initialOrders
    }));
  }, []);const filteredMaterials = useMemo(() => {
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
  
  if (state.filters.searchQuery) {
    const query = state.filters.searchQuery.toLowerCase();
    result = result.filter(m => 
      m.name.toLowerCase().includes(query) || 
      m.id.toLowerCase().includes(query)
    );
  }
  
  if (state.sortConfig) {
    result.sort((a, b) => {
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
}, [state.materials, state.orders]);const handlers = {
  connectToSensor: async (materialId: string) => {
    setState(prev => ({ ...prev, loading: { ...prev.loading, sensor: true } }));
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const readings = {
        temperature: 20 + Math.floor(Math.random() * 10),
        humidity: 40 + Math.floor(Math.random() * 20),
        weight: 80 + Math.floor(Math.random() * 50)
      };
      
      setState(prev => ({
        ...prev,
        materials: prev.materials.map(m => 
          m.id === materialId ? { 
            ...m, 
            sensorConnected: true,
            lastSensorUpdate: new Date().toISOString(),
            sensorReadings: readings,
            currentStock: readings.weight || m.currentStock
          } : m
        )
      }));
    } finally {
      setState(prev => ({ ...prev, loading: { ...prev.loading, sensor: false } }));
    }
  },
  
  createManualOrder: () => {
    if (!state.newOrder.materialId) return;
    
    const material = state.materials.find(m => m.id === state.newOrder.materialId);
    if (!material) return;

    const newOrder: PurchaseOrder = {
      id: `PO-${state.orders.length + 1}`,
      materialId: material.id,
      materialName: material.name,
      quantity: Number(state.newOrder.quantity) || material.orderQuantity,
      supplier: state.newOrder.supplier || material.supplier,
      expectedDelivery: state.newOrder.expectedDelivery || 
        new Date(Date.now() + material.leadTime * 86400000).toISOString(),
      status: 'pending',
      orderDate: today,
      notes: state.newOrder.notes,
      shippingConditions: material.sensorReadings ? {
        temperature: material.sensorReadings.temperature,
        humidity: material.sensorReadings.humidity
      } : undefined
    };

    setState(prev => ({
      ...prev,
      orders: [...prev.orders, newOrder],
      materials: prev.materials.map(m => 
        m.id === material.id ? { 
          ...m, 
          pendingOrders: m.pendingOrders + newOrder.quantity 
        } : m
      ),
      dialogs: { ...prev.dialogs, order: false },
      newOrder: { status: 'pending', orderDate: today }
    }));
  },
  
  updateOrderStatus: (orderId: string, status: OrderStatus) => {
    setState(prev => {
      const updatedOrders = prev.orders.map(order => {
        if (order.id === orderId) {
          return { ...order, status };
        }
        return order;
      });
      
      if (status === 'delivered') {
        const order = prev.orders.find(o => o.id === orderId);
        if (order) {
          return {
            ...prev,
            orders: updatedOrders,
            materials: prev.materials.map(m => 
              m.id === order.materialId ? { 
                ...m, 
                currentStock: m.currentStock + order.quantity,
                pendingOrders: m.pendingOrders - order.quantity
              } : m
            )
          };
        }
      }
      
      return { ...prev, orders: updatedOrders };
    });
  },
  
  generatePDFReport: () => {
    alert("PDF report generated with current inventory data");
  },
  
  requestSort: (key: keyof RawMaterial) => {
    setState(prev => {
      let direction: 'asc' | 'desc' = 'asc';
      if (prev.sortConfig?.key === key && prev.sortConfig.direction === 'asc') {
        direction = 'desc';
      }
      return { ...prev, sortConfig: { key, direction } };
    });
  }
};const renderExpiryStatus = (expiryDate?: string) => {
  if (!expiryDate) {
    return (
      <Flex align="center" gap="2">
        <QuestionMarkCircledIcon color="var(--blue-9)" />
        <Text color="blue">Not set</Text>
      </Flex>
    );
  }

  const isExpired = new Date(expiryDate) < new Date();
  return (
    <Flex align="center" gap="2">
      {isExpired ? (
        <>
          <ExclamationTriangleIcon color="var(--red-9)" />
          <Text color="red">Expired</Text>
        </>
      ) : (
        <>
          <CheckCircledIcon color="var(--green-9)" />
          <Text color="green">Valid until {formatDate(expiryDate)}</Text>
        </>
      )}
    </Flex>
  );
};

const renderSortIndicator = (key: keyof RawMaterial) => {
  if (state.sortConfig?.key === key) {
    return state.sortConfig.direction === 'asc' ? '↑' : '↓';
  }
  return null;
};

const tableStyle = {
  backgroundColor: 'white',
  borderRadius: '12px',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
  overflow: 'hidden'
};

const headerStyle = {
  backgroundColor: 'var(--gray-2)',
  borderBottom: '1px solid var(--gray-5)'
};

const rowStyle = (index: number, isCritical: boolean, needsReorder: boolean) => ({
  backgroundColor: index % 2 === 0 ? 'white' : 'var(--gray-2)',
  borderBottom: '1px solid var(--gray-5)',
  ...(isCritical ? { backgroundColor: 'var(--red-2)' } : 
      needsReorder ? { backgroundColor: 'var(--amber-2)' } : {}),
  ':hover': { backgroundColor: 'var(--gray-3)' }
});return (
  <Container size="3" px="4" py="6">
    {/* Dashboard Cards */}
    <Grid columns="4" gap="4" mb="4">
      <Card>
        <Flex align="center" gap="3">
          <Box style={{ background: 'var(--red-2)', padding: '12px', borderRadius: '8px' }}>
            <ExclamationTriangleIcon width={24} height={24} color="var(--red-9)" />
          </Box>
          <Box>
            <Text as="div" size="2" color="gray">Critical Materials</Text>
            <Heading size="5">{criticalMaterials}</Heading>
          </Box>
        </Flex>
      </Card>
      
      <Card>
        <Flex align="center" gap="3">
          <Box style={{ background: 'var(--amber-2)', padding: '12px', borderRadius: '8px' }}>
            <ClockIcon width={24} height={24} />
          </Box>
          <Box>
            <Text as="div" size="2" color="gray">Reorder Needed</Text>
            <Heading size="5">{reorderNeeded}</Heading>
          </Box>
        </Flex>
      </Card>
      
      <Card>
        <Flex align="center" gap="3">
          <Box style={{ background: 'var(--blue-2)', padding: '12px', borderRadius: '8px' }}>
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
          <Box style={{ background: 'var(--green-2)', padding: '12px', borderRadius: '8px' }}>
            <LightningBoltIcon width={24} height={24} color="var(--green-9)" />
          </Box>
          <Box>
            <Text as="div" size="2" color="gray">Connected Sensors</Text>
            <Heading size="5">{connectedSensors}/{state.materials.length}</Heading>
          </Box>
        </Flex>
      </Card>
    </Grid>

    {/* Action Bar */}
    <Flex gap="3" mb="4" wrap="wrap">
      <Button onClick={() => setState(prev => ({ ...prev, dialogs: { ...prev.dialogs, order: true } }))}>
        Create Manual Order
      </Button>
      
      <Button onClick={() => setState(prev => ({ ...prev, dialogs: { ...prev.dialogs, material: true } }))}>
        Add New Material
      </Button>
      
      <Button variant="soft" onClick={handlers.generatePDFReport}>
        <PrinterIcon /> Generate Report
      </Button>
      
      <Flex align="center" gap="2">
        <Switch 
          checked={state.filters.showReorderOnly}
          onCheckedChange={(checked) => setState(prev => ({
            ...prev,
            filters: { ...prev.filters, showReorderOnly: checked }
          }))}
        />
        <Text>Show Reorder Items Only</Text>
      </Flex>
      
      <TextField.Root 
        placeholder="Search materials..."
        value={state.filters.searchQuery}
        onChange={(e) => setState(prev => ({
          ...prev,
          filters: { ...prev.filters, searchQuery: e.target.value }
        }))}
      />
    </Flex>

    {/* Materials Table */}
    <Card mb="4">
      <Flex justify="between" align="center" mb="3">
        <Heading size="5">Raw Materials Inventory</Heading>
        <Text color="gray">{filteredMaterials.length} materials found</Text>
      </Flex>
      
      <Table.Root style={tableStyle}>
        <Table.Header style={headerStyle}>
          <Table.Row>
            <Table.ColumnHeaderCell onClick={() => handlers.requestSort('name')}>
              Material {renderSortIndicator('name')}
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell onClick={() => handlers.requestSort('currentStock')}>
              Stock {renderSortIndicator('currentStock')}
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell onClick={() => handlers.requestSort('supplier')}>
              Supplier {renderSortIndicator('supplier')}
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>IoT Status</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Expiry Status</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Location</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        
        <Table.Body>
          {filteredMaterials.map((material, index) => {
            const available = material.currentStock - material.reserved;
            const isCritical = available <= material.safetyStock;
            const needsReorder = available <= material.reorderLevel;
            
            return (
              <Table.Row key={material.id} style={rowStyle(index, isCritical, needsReorder)}>
                <Table.Cell>
                  <Flex align="center" gap="2">
                    {material.name}
                    {material.blockchainTx && <TokensIcon color="blue" />}
                  </Flex>
                </Table.Cell>
                
                <Table.Cell>
                  <Flex direction="column" gap="1">
                    <Text>{material.currentStock} {material.unit}</Text>
                    <Progress 
                      value={(material.currentStock / (material.reorderLevel * 1.5)) * 100} 
                      color={isCritical ? 'red' : needsReorder ? 'amber' : 'green'}
                    />
                  </Flex>
                </Table.Cell>
                
                <Table.Cell>
                  <Flex align="center" gap="1">
                    {material.supplier}
                    <Badge color={
                      material.supplierRating > 4 ? 'green' : 
                      material.supplierRating > 3 ? 'yellow' : 'red'
                    }>
                      {material.supplierRating.toFixed(1)}
                    </Badge>
                  </Flex>
                </Table.Cell>
                
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
                      onClick={() => handlers.connectToSensor(material.id)}
                      disabled={state.loading.sensor}
                    >
                      {state.loading.sensor ? 'Connecting...' : 'Connect'}
                    </Button>
                  )}
                </Table.Cell>
                
                <Table.Cell>
                  {renderExpiryStatus(material.expiryDate)}
                </Table.Cell>
                
                <Table.Cell>
                  {material.location}
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Root>
    </Card>

    {/* Orders Table */}
    <Card>
      <Flex justify="between" align="center" mb="3">
        <Heading size="5">Purchase Orders</Heading>
        <Text color="gray">{state.orders.length} orders in system</Text>
      </Flex>
      
      <Table.Root style={tableStyle}>
        <Table.Header style={headerStyle}>
          <Table.Row>
            <Table.ColumnHeaderCell>Order ID</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Material</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Quantity</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Supplier</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        
        <Table.Body>
          {state.orders.map((order, index) => (
            <Table.Row key={order.id} style={rowStyle(index, false, false)}>
              <Table.Cell>{order.id}</Table.Cell>
              <Table.Cell>{order.materialName}</Table.Cell>
              <Table.Cell>
                {order.quantity} {
                  state.materials.find(m => m.id === order.materialId)?.unit || ''
                }
              </Table.Cell>
              <Table.Cell>{order.supplier}</Table.Cell>
              <Table.Cell>
                <Badge color={getStatusColor(order.status)}>
                  {order.status}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <Flex gap="2">
                  <Button 
                    size="1" 
                    onClick={() => setState(prev => ({
                      ...prev,
                      selected: { ...prev.selected, order }
                    }))}
                  >
                    View
                  </Button>
                </Flex>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Card>

    {/* Order Dialog */}
    {state.selected.order && (
      <Dialog.Root open onOpenChange={() => setState(prev => ({
        ...prev,
        selected: { ...prev.selected, order: null }
      }))}>
        <Dialog.Content style={{ maxWidth: '600px' }}>
          <Dialog.Title>Order Details: {state.selected.order.id}</Dialog.Title>
          
          <Grid columns="2" gap="3" mt="4">
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
              <Badge color={getStatusColor(state.selected.order.status)}>
                {state.selected.order.status}
              </Badge>
            </Box>
          </Grid>
          
          <Flex gap="3" mt="4" justify="end">
            {state.selected.order.status === 'pending' && (
              <>
                <Button 
                  color="green"
                  onClick={() => {
                    handlers.updateOrderStatus(state.selected.order!.id, 'approved');
                    setState(prev => ({
                      ...prev,
                      selected: { ...prev.selected, order: null }
                    }));
                  }}
                >
                  Approve
                </Button>
                <Button 
                  color="red"
                  onClick={() => {
                    handlers.updateOrderStatus(state.selected.order!.id, 'cancelled');
                    setState(prev => ({
                      ...prev,
                      selected: { ...prev.selected, order: null }
                    }));
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
                  setState(prev => ({
                    ...prev,
                    selected: { ...prev.selected, order: null }
                  }));
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
                  setState(prev => ({
                    ...prev,
                    selected: { ...prev.selected, order: null }
                  }));
                }}
              >
                Mark as Delivered
              </Button>
            )}
            
            <Button 
              variant="soft" 
              onClick={() => setState(prev => ({
                ...prev,
                selected: { ...prev.selected, order: null }
              }))}
            >
              Close
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    )}

    {/* Create Order Dialog */}
    <Dialog.Root open={state.dialogs.order} onOpenChange={(open) => setState(prev => ({
      ...prev,
      dialogs: { ...prev.dialogs, order: open }
    }))}>
      <Dialog.Content style={{ maxWidth: '600px' }}>
        <Dialog.Title>Create New Purchase Order</Dialog.Title>
        
        <Grid columns="2" gap="3" mt="4">
          <Box style={{ gridColumn: '1 / -1' }}>
            <Text as="div" size="2" mb="1" weight="bold">Material</Text>
            <Select.Root
              value={state.newOrder.materialId}
              onValueChange={(value) => setState(prev => ({
                ...prev,
                newOrder: {
                  ...prev.newOrder,
                  materialId: value,
                  supplier: state.materials.find(m => m.id === value)?.supplier || ''
                }
              }))}
            >
              <Select.Trigger placeholder="Select material" />
              <Select.Content>
                {state.materials.map(material => (
                  <Select.Item key={material.id} value={material.id}>
                    {material.name} (Stock: {material.currentStock - material.reserved} {material.unit})
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
                placeholder="Enter quantity"
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
                placeholder="Enter supplier"
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
            <Text as="div" size="2" mb="1" weight="bold">Notes</Text>
            <TextArea
              placeholder="Additional notes..."
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
  </Container>
);export default RawMaterialsInventory;
