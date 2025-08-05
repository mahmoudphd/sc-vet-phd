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
  Switch
} from '@radix-ui/themes';
import {
  CubeIcon,
  MixerHorizontalIcon,
  ExclamationTriangleIcon,
  ClockIcon
} from '@radix-ui/react-icons';

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
}

interface PurchaseOrder {
  orderId: string;
  materialId: string;
  materialName: string;
  quantity: number;
  supplier: string;
  expectedDelivery: string;
  status: 'pending' | 'shipped' | 'delivered';
  orderDate: string;
}

const initialMaterials: RawMaterial[] = [
  {
    id: "RM001",
    name: "Vitamin B1",
    currentStock: 120,
    reserved: 40,
    minStockLevel: 50,
    reorderLevel: 80,
    safetyStock: 30,
    leadTime: 7,
    supplier: "Supplier X",
    orderQuantity: 100,
    pendingOrders: 0
  },
  {
    id: "RM002",
    name: "Vitamin B2",
    currentStock: 90,
    reserved: 30,
    minStockLevel: 60,
    reorderLevel: 90,
    safetyStock: 40,
    leadTime: 5,
    supplier: "Supplier Y",
    orderQuantity: 120,
    pendingOrders: 0
  },
  {
    id: "RM003",
    name: "Nicotinamide B3",
    currentStock: 70,
    reserved: 20,
    minStockLevel: 40,
    reorderLevel: 60,
    safetyStock: 20,
    leadTime: 10,
    supplier: "Supplier Z",
    orderQuantity: 80,
    pendingOrders: 0
  }
];

const generateOrderId = () => {
  return `PO-${Math.floor(Math.random() * 10000)}-${Date.now()}`;
};

const generatePurchaseOrders = (materials: RawMaterial[]): PurchaseOrder[] => {
  const today = new Date();
  const orders: PurchaseOrder[] = [];

  materials.forEach(material => {
    const availableStock = material.currentStock - material.reserved;
    const needsReorder = availableStock <= material.reorderLevel;
    const hasPendingOrder = material.pendingOrders > 0;
    
    if (needsReorder && !hasPendingOrder) {
      const requiredQuantity = Math.max(
        material.orderQuantity,
        material.minStockLevel + material.safetyStock - availableStock
      );
      
      orders.push({
        orderId: generateOrderId(),
        materialId: material.id,
        materialName: material.name,
        quantity: requiredQuantity,
        supplier: material.supplier,
        expectedDelivery: new Date(today.setDate(today.getDate() + material.leadTime)).toISOString(),
        status: "pending",
        orderDate: new Date().toISOString()
      });
    }
  });

  return orders;
};

const StockLevelSettings = ({ material, onSave }: {
  material: RawMaterial;
  onSave: (updated: RawMaterial) => void;
}) => {
  const [form, setForm] = useState({
    minStockLevel: material.minStockLevel,
    reorderLevel: material.reorderLevel,
    safetyStock: material.safetyStock,
    orderQuantity: material.orderQuantity
  });

  const calculateSuggestedLevels = () => {
    const suggestedReorder = Math.round(material.minStockLevel * 1.5);
    const suggestedSafety = Math.round(material.minStockLevel * 0.6);
    
    setForm({
      ...form,
      reorderLevel: suggestedReorder,
      safetyStock: suggestedSafety,
      orderQuantity: material.minStockLevel * 2
    });
  };

  return (
    <Card>
      <Heading size="4">Stock Level Settings</Heading>
      
      <Grid columns="2" gap="3" mt="3">
        <TextField.Root
          label="Minimum Stock Level"
          value={form.minStockLevel}
          onChange={(e) => setForm({...form, minStockLevel: Number(e.target.value)})}
        />
        
        <TextField.Root
          label="Reorder Level"
          value={form.reorderLevel}
          onChange={(e) => setForm({...form, reorderLevel: Number(e.target.value)})}
        />
        
        <TextField.Root
          label="Safety Stock"
          value={form.safetyStock}
          onChange={(e) => setForm({...form, safetyStock: Number(e.target.value)})}
        />
        
        <TextField.Root
          label="Fixed Order Quantity"
          value={form.orderQuantity}
          onChange={(e) => setForm({...form, orderQuantity: Number(e.target.value)})}
        />
      </Grid>
      
      <Flex gap="3" mt="4">
        <Button onClick={calculateSuggestedLevels}>
          Calculate Suggested Levels
        </Button>
        
        <Button onClick={() => onSave({ ...material, ...form })}>
          Save Settings
        </Button>
      </Flex>
    </Card>
  );
};

const InventoryDashboard = ({ materials }: { materials: RawMaterial[] }) => {
  const criticalMaterials = materials.filter(m => 
    (m.currentStock - m.reserved) <= m.safetyStock
  ).length;

  const reorderNeeded = materials.filter(m => 
    (m.currentStock - m.reserved) <= m.reorderLevel
  ).length;

  return (
    <Grid columns="3" gap="4">
      <Card>
        <Flex align="center" gap="3">
          <Box style={{ background: '#f8f9fa', padding: '12px', borderRadius: '8px' }}>
            <CubeIcon width={24} height={24} />
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
            <ExclamationTriangleIcon width={24} height={24} color="red" />
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
            <ClockIcon width={24} height={24} />
          </Box>
          <Box>
            <Text as="div" size="2" color="gray">Pending Orders</Text>
            <Heading size="5">
              {materials.reduce((sum, m) => sum + (m.pendingOrders > 0 ? 1 : 0), 0)}
            </Heading>
          </Box>
        </Flex>
      </Card>
    </Grid>
  );
};

const PurchaseOrderManager = () => {
  const [materials, setMaterials] = useState<RawMaterial[]>(initialMaterials);
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [showAutoOrders, setShowAutoOrders] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<RawMaterial | null>(null);

  const generateAutoOrders = () => {
    const newOrders = generatePurchaseOrders(materials);
    setOrders([...orders, ...newOrders]);
    
    const updatedMaterials = materials.map(material => {
      const order = newOrders.find(o => o.materialId === material.id);
      return order 
        ? { ...material, pendingOrders: material.pendingOrders + order.quantity }
        : material;
    });
    
    setMaterials(updatedMaterials);
  };

  const updateMaterial = (updatedMaterial: RawMaterial) => {
    setMaterials(materials.map(m => 
      m.id === updatedMaterial.id ? updatedMaterial : m
    ));
    setSelectedMaterial(null);
  };

  return (
    <Box p="4">
      <Card>
        <InventoryDashboard materials={materials} />
        
        <Flex direction="column" gap="4" mt="4">
          <Flex justify="between" align="center">
            <Heading size="5">Purchase Order System</Heading>
            
            <Flex gap="3">
              <Button onClick={generateAutoOrders}>
                Generate Auto Purchase Orders
              </Button>
              
              <Switch 
                checked={showAutoOrders}
                onCheckedChange={setShowAutoOrders}
              />
              <Text>Show Only Materials Needing Reorder</Text>
            </Flex>
          </Flex>

          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Material</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Available Stock</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Reorder Level</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Order Status</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {materials
                .filter(material => !showAutoOrders || 
                  (material.currentStock - material.reserved) <= material.reorderLevel)
                .map(material => {
                  const needsReorder = (material.currentStock - material.reserved) <= material.reorderLevel;
                  return (
                    <Table.Row key={material.id} style={{
                      backgroundColor: needsReorder ? '#fff3cd' : 'inherit'
                    }}>
                      <Table.Cell>{material.name}</Table.Cell>
                      <Table.Cell>{material.currentStock - material.reserved}</Table.Cell>
                      <Table.Cell>{material.reorderLevel}</Table.Cell>
                      <Table.Cell>
                        {needsReorder ? (
                          material.pendingOrders > 0 ? (
                            <Badge color="orange">Pending Order: {material.pendingOrders}</Badge>
                          ) : (
                            <Badge color="red">Needs Reorder</Badge>
                          )
                        ) : (
                          <Badge color="green">Stock OK</Badge>
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
          </Table.Row>

          <Heading size="5" mt="5">Current Purchase Orders</Heading>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Material</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Quantity</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Supplier</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Expected Delivery</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {orders.map(order => (
                <Table.Row key={order.orderId}>
                  <Table.Cell>{order.materialName}</Table.Cell>
                  <Table.Cell>{order.quantity}</Table.Cell>
                  <Table.Cell>{order.supplier}</Table.Cell>
                  <Table.Cell>{new Date(order.expectedDelivery).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>
                    <Badge color={
                      order.status === 'delivered' ? 'green' : 
                      order.status === 'shipped' ? 'blue' : 'orange'
                    }>
                      {order.status === 'pending' ? 'Pending' :
                       order.status === 'shipped' ? 'Shipped' : 'Delivered'}
                    </Badge>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Flex>
      </Card>

      {selectedMaterial && (
        <Dialog.Root open onOpenChange={() => setSelectedMaterial(null)}>
          <Dialog.Content style={{ maxWidth: '700px' }}>
            <Dialog.Title>Configure {selectedMaterial.name}</Dialog.Title>
            <StockLevelSettings 
              material={selectedMaterial} 
              onSave={updateMaterial} 
            />
          </Dialog.Content>
        </Dialog.Root>
      )}
    </Box>
  );
};

export default PurchaseOrderManager;
