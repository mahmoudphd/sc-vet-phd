import React, { useState, ChangeEvent } from 'react';
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
  AlertDialog,
  TextArea
} from '@radix-ui/themes';
import {
  CubeIcon,
  MixerHorizontalIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CheckCircledIcon,
  CrossCircledIcon
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
  orderQuantity: number;
  pendingOrders: number;
  lastOrderDate?: string;
  unit: string;
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
}

// Utility functions
const generateId = (prefix: string) => `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
const today = new Date().toISOString().split('T')[0];

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
    orderQuantity: 100,
    pendingOrders: 0,
    unit: 'kg'
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
    orderQuantity: 120,
    pendingOrders: 0,
    unit: 'kg'
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
    orderQuantity: 80,
    pendingOrders: 0,
    unit: 'kg'
  }
];

const RawMaterialsInventory = () => {
  // State
  const [materials, setMaterials] = useState<RawMaterial[]>(initialMaterials);
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<RawMaterial | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [showReorderOnly, setShowReorderOnly] = useState(false);
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [showMaterialDialog, setShowMaterialDialog] = useState(false);
  const [newOrder, setNewOrder] = useState<Partial<PurchaseOrder>>({
    status: 'pending',
    orderDate: today
  });
  const [newMaterial, setNewMaterial] = useState<Partial<RawMaterial>>({
    unit: 'kg'
  });

  // Generate purchase orders automatically
  const generateAutoOrders = () => {
    const newOrders: PurchaseOrder[] = [];
    const updatedMaterials = [...materials];

    materials.forEach((material, index) => {
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

        newOrders.push(newOrder);
        updatedMaterials[index] = {
          ...material,
          pendingOrders: material.pendingOrders + orderQuantity,
          lastOrderDate: today
        };
      }
    });

    setOrders([...orders, ...newOrders]);
    setMaterials(updatedMaterials);
  };

  // Update order status
  const updateOrderStatus = (orderId: string, status: PurchaseOrder['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));
  };

  // Create manual order
  const createManualOrder = () => {
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
      notes: newOrder.notes
    };

    setOrders([...orders, order]);
    setMaterials(materials.map(m => 
      m.id === material.id ? { ...m, pendingOrders: m.pendingOrders + order.quantity } : m
    ));
    setShowOrderDialog(false);
    setNewOrder({ status: 'pending', orderDate: today });
  };

  // Add new material
  const addNewMaterial = () => {
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
      orderQuantity: newMaterial.orderQuantity || 0,
      pendingOrders: 0,
      unit: newMaterial.unit || 'kg'
    };

    setMaterials([...materials, material]);
    setShowMaterialDialog(false);
    setNewMaterial({ unit: 'kg' });
  };

  // Handle input changes with proper typing
  const handleMaterialInputChange = (e: ChangeEvent<HTMLInputElement>, field: keyof RawMaterial) => {
    if (!selectedMaterial) return;
    setSelectedMaterial({
      ...selectedMaterial,
      [field]: field === 'unit' ? e.target.value : Number(e.target.value)
    });
  };

  const handleNewMaterialInputChange = (e: ChangeEvent<HTMLInputElement>, field: keyof RawMaterial) => {
    setNewMaterial({
      ...newMaterial,
      [field]: field === 'unit' || field === 'name' || field === 'supplier' 
        ? e.target.value 
        : Number(e.target.value)
    });
  };

  const handleNewOrderInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof PurchaseOrder) => {
    setNewOrder({
      ...newOrder,
      [field]: field === 'notes' || field === 'supplier' || field === 'materialId'
        ? e.target.value
        : Number(e.target.value)
    });
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

  return (
    <Box p="4">
      {/* Inventory Dashboard */}
      <Grid columns="3" gap="4" mb="4">
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
      </Grid>

      {/* Action Buttons */}
      <Flex gap="3" mb="4">
        <Button onClick={generateAutoOrders}>
          Generate Auto Orders
        </Button>
        <Button onClick={() => setShowOrderDialog(true)}>
          Create Manual Order
        </Button>
        <Button onClick={() => setShowMaterialDialog(true)}>
          Add New Material
        </Button>
        <Switch 
          checked={showReorderOnly}
          onCheckedChange={setShowReorderOnly}
        />
        <Text>Show Only Materials Needing Reorder</Text>
      </Flex>

      {/* Materials Table */}
      <Card mb="4">
        <Heading size="5" mb="3">Raw Materials Inventory</Heading>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Material</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Current Stock</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Reserved</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Available</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Reorder Level</Table.ColumnHeaderCell>
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
                
                return (
                  <Table.Row key={material.id} style={{
                    backgroundColor: isCritical ? '#fee2e2' : needsReorder ? '#fef3c7' : 'inherit'
                  }}>
                    <Table.Cell>{material.name}</Table.Cell>
                    <Table.Cell>{material.currentStock} {material.unit}</Table.Cell>
                    <Table.Cell>{material.reserved} {material.unit}</Table.Cell>
                    <Table.Cell>{available} {material.unit}</Table.Cell>
                    <Table.Cell>{material.reorderLevel} {material.unit}</Table.Cell>
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
                      <Button size="1" onClick={() => setSelectedMaterial(material)}>
                        Configure
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
          </Table.Body>
        </Table.Root>
      </Card>

      {/* Purchase Orders Table */}
      <Card>
        <Heading size="5" mb="3">Purchase Orders</Heading>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Order ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Material</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Quantity</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Supplier</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Order Date</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Expected Delivery</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
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
                  <Table.Cell>{order.supplier}</Table.Cell>
                  <Table.Cell>{new Date(order.orderDate).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>{new Date(order.expectedDelivery).toLocaleDateString()}</Table.Cell>
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
            <Dialog.Title>Configure {selectedMaterial.name}</Dialog.Title>
            
            <Grid columns="2" gap="3" mt="3">
              <Box>
                <Text as="div" size="2" mb="1" weight="bold">Minimum Stock Level</Text>
                <TextField.Root>
                  <input
                    type="number"
                    value={selectedMaterial.minStockLevel}
                    onChange={(e) => handleMaterialInputChange(e, 'minStockLevel')}
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
                    onChange={(e) => handleMaterialInputChange(e, 'reorderLevel')}
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
                    onChange={(e) => handleMaterialInputChange(e, 'safetyStock')}
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
                    onChange={(e) => handleMaterialInputChange(e, 'leadTime')}
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
                    onChange={(e) => handleMaterialInputChange(e, 'orderQuantity')}
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
                    onChange={(e) => handleMaterialInputChange(e, 'unit')}
                    className="rt-TextFieldInput"
                  />
                </TextField.Root>
              </Box>
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
                onValueChange={(value) => setNewOrder({
                  ...newOrder,
                  materialId: value,
                  supplier: materials.find(m => m.id === value)?.supplier || ''
                })}
              >
                <Select.Trigger placeholder="Select material" />
                <Select.Content>
                  {materials.map(material => (
                    <Select.Item key={material.id} value={material.id}>
                      {material.name}
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
                  onChange={(e) => handleNewOrderInputChange(e, 'quantity')}
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
                  onChange={(e) => handleNewOrderInputChange(e, 'supplier')}
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
                onChange={(e) => handleNewOrderInputChange(e, 'notes')}
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
                  onChange={(e) => handleNewMaterialInputChange(e, 'name')}
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
                  onChange={(e) => handleNewMaterialInputChange(e, 'supplier')}
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
                  onChange={(e) => handleNewMaterialInputChange(e, 'currentStock')}
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
                  onChange={(e) => handleNewMaterialInputChange(e, 'unit')}
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
                  onChange={(e) => handleNewMaterialInputChange(e, 'minStockLevel')}
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
                  onChange={(e) => handleNewMaterialInputChange(e, 'reorderLevel')}
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
                  onChange={(e) => handleNewMaterialInputChange(e, 'safetyStock')}
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
                  onChange={(e) => handleNewMaterialInputChange(e, 'leadTime')}
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
                  onChange={(e) => handleNewMaterialInputChange(e, 'orderQuantity')}
                  className="rt-TextFieldInput"
                />
              </TextField.Root>
            </Box>
          </Grid>
          
          <Flex gap="3" mt="4" justify="end">
            <Button 
              variant="soft" 
              color="gray"
              onClick={() => {
                setShowMaterialDialog(false);
                setNewMaterial({ unit: 'kg' });
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
    </Box>
  );
};

export default RawMaterialsInventory;
