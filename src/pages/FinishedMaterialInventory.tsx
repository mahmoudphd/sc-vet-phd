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
  // Add more materials as needed
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
              <TextField.Root
                label="Minimum Stock Level"
                value={selectedMaterial.minStockLevel}
                onChange={(e) => setSelectedMaterial({
                  ...selectedMaterial,
                  minStockLevel: Number(e.target.value)
                })}
              />
              
              <TextField.Root
                label="Reorder Level"
                value={selectedMaterial.reorderLevel}
                onChange={(e) => setSelectedMaterial({
                  ...selectedMaterial,
                  reorderLevel: Number(e.target.value)
                })}
              />
              
              <TextField.Root
                label="Safety Stock"
                value={selectedMaterial.safetyStock}
                onChange={(e) => setSelectedMaterial({
                  ...selectedMaterial,
                  safetyStock: Number(e.target.value)
                })}
              />
              
              <TextField.Root
                label="Lead Time (days)"
                value={selectedMaterial.leadTime}
                onChange={(e) => setSelectedMaterial({
                  ...selectedMaterial,
                  leadTime: Number(e.target.value)
                })}
              />
              
              <TextField.Root
                label="Order Quantity"
                value={selectedMaterial.orderQuantity}
                onChange={(e) => setSelectedMaterial({
                  ...selectedMaterial,
                  orderQuantity: Number(e.target.value)
                })}
              />
              
              <TextField.Root
                label="Unit"
                value={selectedMaterial.unit}
                onChange={(e) => setSelectedMaterial({
                  ...selectedMaterial,
                  unit: e.target.value
                })}
              />
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
            
            <TextField.Root
              placeholder="Quantity"
              value={newOrder.quantity || ''}
              onChange={(e) => setNewOrder({
                ...newOrder,
                quantity: Number(e.target.value)
              })}
            />
            
            <TextField.Root
              placeholder="Supplier"
              value={newOrder.supplier || ''}
              onChange={(e) => setNewOrder({
                ...newOrder,
                supplier: e.target.value
              })}
            />
            
            <TextField.Root
              type="date"
              placeholder="Expected Delivery"
              value={newOrder.expectedDelivery?.split('T')[0] || ''}
              onChange={(e) => setNewOrder({
                ...newOrder,
                expectedDelivery: new Date(e.target.value).toISOString()
              })}
            />
            
            <TextArea
              placeholder="Notes (optional)"
              value={newOrder.notes || ''}
              onChange={(e) => setNewOrder({
                ...newOrder,
                notes: e.target.value
              })}
              style={{ gridColumn: '1 / -1' }}
            />
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
            <TextField.Root
              placeholder="Material Name"
              value={newMaterial.name || ''}
              onChange={(e) => setNewMaterial({
                ...newMaterial,
                name: e.target.value
              })}
            />
            
            <TextField.Root
              placeholder="Supplier"
              value={newMaterial.supplier || ''}
              onChange={(e) => setNewMaterial({
                ...newMaterial,
                supplier: e.target.value
              })}
            />
            
            <TextField.Root
              placeholder="Current Stock"
              type="number"
              value={newMaterial.currentStock || ''}
              onChange={(e) => setNewMaterial({
                ...newMaterial,
                currentStock: Number(e.target.value)
              })}
            />
            
            <TextField.Root
              placeholder="Unit (kg, g, L, etc.)"
              value={newMaterial.unit || ''}
              onChange={(e) => setNewMaterial({
                ...newMaterial,
                unit: e.target.value
              })}
            />
            
            <TextField.Root
              placeholder="Minimum Stock Level"
              type="number"
              value={newMaterial.minStockLevel || ''}
              onChange={(e) => setNewMaterial({
                ...newMaterial,
                minStockLevel: Number(e.target.value)
              })}
            />
            
            <TextField.Root
              placeholder="Reorder Level"
              type="number"
              value={newMaterial.reorderLevel || ''}
              onChange={(e) => setNewMaterial({
                ...newMaterial,
                reorderLevel: Number(e.target.value)
              })}
            />
            
            <TextField.Root
              placeholder="Safety Stock"
              type="number"
              value={newMaterial.safetyStock || ''}
              onChange={(e) => setNewMaterial({
                ...newMaterial,
                safetyStock: Number(e.target.value)
              })}
            />
            
            <TextField.Root
              placeholder="Lead Time (days)"
              type="number"
              value={newMaterial.leadTime || ''}
              onChange={(e) => setNewMaterial({
                ...newMaterial,
                leadTime: Number(e.target.value)
              })}
            />
            
            <TextField.Root
              placeholder="Order Quantity"
              type="number"
              value={newMaterial.orderQuantity || ''}
              onChange={(e) => setNewMaterial({
                ...newMaterial,
                orderQuantity: Number(e.target.value)
              })}
              style={{ gridColumn: '1 / -1' }}
            />
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
