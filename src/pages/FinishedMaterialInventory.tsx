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
  Progress
} from '@radix-ui/themes';
import {
  CubeIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  LightningBoltIcon,
  Link2Icon,
  TokensIcon,
  PersonIcon,
  EnvelopeClosedIcon,
  FileTextIcon
} from '@radix-ui/react-icons';

// Types
interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  rating: number;
  materialsSupplied: string[];
  leadTime: number;
  reliability: number;
  contractTerms: string;
}

interface FinishedMaterial {
  id: string;
  name: string;
  currentStock: number;
  reserved: number;
  minStockLevel: number;
  reorderLevel: number;
  safetyStock: number;
  leadTime: number;
  supplierId: string;
  orderQuantity: number;
  pendingOrders: number;
  unit: string;
  sensorConnected: boolean;
  batchNumber: string;
  qualityStatus: 'approved' | 'pending' | 'rejected';
  expiryDate?: string;
  lastOrderDate?: string;
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
  supplierId: string;
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
  action: 'order' | 'delivery' | 'adjustment' | 'quality_check';
  participants: string[];
  relatedTxHash?: string;
  quantity?: number;
}

// Mock Data
const today = new Date().toISOString().split('T')[0];

const initialSuppliers: Supplier[] = [
  {
    id: 'SUP-1',
    name: 'Supplier A',
    contactPerson: 'John Smith',
    email: 'john@supplierA.com',
    rating: 4.5,
    materialsSupplied: ['MAT-1'],
    leadTime: 7,
    reliability: 95,
    contractTerms: 'Net 30 days'
  },
  {
    id: 'SUP-2',
    name: 'Supplier B',
    contactPerson: 'Sarah Johnson',
    email: 'sarah@supplierB.com',
    rating: 4.2,
    materialsSupplied: ['MAT-2'],
    leadTime: 5,
    reliability: 92,
    contractTerms: 'Net 45 days'
  }
];

const initialMaterials: FinishedMaterial[] = [
  {
    id: 'MAT-1',
    name: 'Vitamin B1 (Thiamine) Capsules',
    currentStock: 5000,
    reserved: 1000,
    minStockLevel: 1000,
    reorderLevel: 2000,
    safetyStock: 500,
    leadTime: 7,
    supplierId: 'SUP-1',
    orderQuantity: 3000,
    pendingOrders: 0,
    unit: 'units',
    sensorConnected: false,
    batchNumber: 'BATCH-2023-001',
    expiryDate: '2024-12-31',
    qualityStatus: 'approved'
  },
  {
    id: 'MAT-2',
    name: 'Vitamin B2 (Riboflavin) Tablets',
    currentStock: 8000,
    reserved: 2000,
    minStockLevel: 1500,
    reorderLevel: 3000,
    safetyStock: 750,
    leadTime: 5,
    supplierId: 'SUP-2',
    orderQuantity: 4000,
    pendingOrders: 0,
    unit: 'units',
    sensorConnected: false,
    batchNumber: 'BATCH-2023-002',
    expiryDate: '2025-06-30',
    qualityStatus: 'approved'
  }
];

const initialOrders: PurchaseOrder[] = [
  {
    id: 'PO-1',
    materialId: 'MAT-1',
    materialName: 'Vitamin B1 (Thiamine) Capsules',
    quantity: 3000,
    supplierId: 'SUP-1',
    expectedDelivery: new Date(Date.now() + 7 * 86400000).toISOString(),
    status: 'pending',
    orderDate: today
  },
  {
    id: 'PO-2',
    materialId: 'MAT-2',
    materialName: 'Vitamin B2 (Riboflavin) Tablets',
    quantity: 4000,
    supplierId: 'SUP-2',
    expectedDelivery: new Date(Date.now() + 5 * 86400000).toISOString(),
    status: 'approved',
    orderDate: today
  },
  {
    id: 'PO-3',
    materialId: 'MAT-1',
    materialName: 'Vitamin B1 (Thiamine) Capsules',
    quantity: 2000,
    supplierId: 'SUP-1',
    expectedDelivery: new Date(Date.now() - 3 * 86400000).toISOString(),
    status: 'delivered',
    orderDate: new Date(Date.now() - 10 * 86400000).toISOString(),
    blockchainTx: '0x1234567890abcdef'
  }
];

// Mock Services
class IoTSensorService {
  static async connectToSensor(materialId: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(Math.random() > 0.2), 500);
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
        resolve(this.transactionHistory[materialId] || []);
      }, 1200);
    });
  }
}

const FinishedMaterialInventory = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [materials, setMaterials] = useState<FinishedMaterial[]>(initialMaterials);
  const [orders, setOrders] = useState<PurchaseOrder[]>(initialOrders);
  const [selectedMaterial, setSelectedMaterial] = useState<FinishedMaterial | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [showReorderOnly, setShowReorderOnly] = useState(false);
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [showMaterialDialog, setShowMaterialDialog] = useState(false);
  const [showSupplierDialog, setShowSupplierDialog] = useState(false);
  const [showBlockchainDialog, setShowBlockchainDialog] = useState(false);
  const [newOrder, setNewOrder] = useState<Partial<PurchaseOrder>>({
    status: 'pending',
    orderDate: today
  });
  const [newMaterial, setNewMaterial] = useState<Partial<FinishedMaterial>>({
    unit: 'units',
    sensorConnected: false,
    qualityStatus: 'pending'
  });
  const [newSupplier, setNewSupplier] = useState<Omit<Supplier, 'id'>>({
    name: '',
    contactPerson: '',
    email: '',
    rating: 0,
    materialsSupplied: [],
    leadTime: 0,
    reliability: 0,
    contractTerms: ''
  });
  const [blockchainData, setBlockchainData] = useState<BlockchainTransaction[]>([]);
  const [isLoadingBlockchain, setIsLoadingBlockchain] = useState(false);
  const [isConnectingSensor, setIsConnectingSensor] = useState(false);

  const getSupplierName = (supplierId: string) => {
    return suppliers.find(s => s.id === supplierId)?.name || 'Unknown Supplier';
  };

  const getSupplierDetails = (supplierId: string): Supplier | undefined => {
    return suppliers.find(s => s.id === supplierId);
  };

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
      }
    } finally {
      setIsConnectingSensor(false);
    }
  };

  const recordBlockchainTransaction = async (
    materialId: string,
    action: string,
    quantity: number,
    participants: string[],
    relatedTxHash?: string
  ) => {
    return BlockchainService.recordTransaction(
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
    } finally {
      setIsLoadingBlockchain(false);
    }
  };

  const generateAutoOrders = async () => {
    const newOrders: PurchaseOrder[] = [];
    const updatedMaterials = [...materials];

    for (const material of materials) {
      const availableStock = material.currentStock - material.reserved;
      if (availableStock <= material.reorderLevel && material.pendingOrders === 0) {
        const orderQuantity = Math.max(
          material.orderQuantity,
          material.minStockLevel + material.safetyStock - availableStock
        );

        const supplier = getSupplierDetails(material.supplierId);
        if (!supplier) continue;

        const newOrder: PurchaseOrder = {
          id: `PO-${orders.length + newOrders.length + 1}`,
          materialId: material.id,
          materialName: material.name,
          quantity: orderQuantity,
          supplierId: material.supplierId,
          expectedDelivery: new Date(Date.now() + material.leadTime * 86400000).toISOString(),
          status: 'pending',
          orderDate: today
        };

        const txHash = await recordBlockchainTransaction(
          material.id,
          'order',
          orderQuantity,
          [supplier.name, 'Warehouse Manager']
        );

        newOrder.blockchainTx = txHash;
        newOrders.push(newOrder);
        
        const materialIndex = materials.findIndex(m => m.id === material.id);
        updatedMaterials[materialIndex] = {
          ...material,
          pendingOrders: material.pendingOrders + orderQuantity,
          lastOrderDate: today
        };

        setTimeout(async () => {
          if (newOrder.status === 'pending' || newOrder.status === 'approved') {
            const deliveryTxHash = await recordBlockchainTransaction(
              material.id,
              'delivery',
              orderQuantity,
              [supplier.name, 'Warehouse Manager'],
              txHash
            );
            
            setOrders(prev => prev.map(o => 
              o.id === newOrder.id ? { ...o, status: 'delivered', blockchainTx: deliveryTxHash } : o
            ));
            
            setMaterials(prev => prev.map(m => 
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

  const updateOrderStatus = async (orderId: string, status: PurchaseOrder['status']) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        const updatedOrder = { ...order, status };
        
        if (status === 'delivered' && order.blockchainTx) {
          const supplier = getSupplierDetails(order.supplierId);
          if (supplier) {
            recordBlockchainTransaction(
              order.materialId,
              'delivery',
              order.quantity,
              [supplier.name, 'Warehouse Manager'],
              order.blockchainTx
            ).then(txHash => {
              updatedOrder.blockchainTx = txHash;
            });
          }
          
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

  const createManualOrder = async () => {
    if (!newOrder.materialId || !newOrder.quantity) return;

    const material = materials.find(m => m.id === newOrder.materialId);
    const supplier = material && getSupplierDetails(material.supplierId);
    if (!material || !supplier) return;

    const order: PurchaseOrder = {
      id: `PO-${orders.length + 1}`,
      materialId: material.id,
      materialName: material.name,
      quantity: Number(newOrder.quantity),
      supplierId: material.supplierId,
      expectedDelivery: newOrder.expectedDelivery || 
        new Date(Date.now() + material.leadTime * 86400000).toISOString(),
      status: 'pending',
      orderDate: today,
      notes: newOrder.notes,
      shippingConditions: material.sensorConnected ? {
        temperature: material.sensorReadings?.temperature,
        humidity: material.sensorReadings?.humidity
      } : undefined
    };

    const txHash = await recordBlockchainTransaction(
      material.id,
      'order',
      order.quantity,
      [supplier.name, 'Warehouse Manager']
    );
    order.blockchainTx = txHash;

    setOrders([...orders, order]);
    setMaterials(materials.map(m => 
      m.id === material.id ? { ...m, pendingOrders: m.pendingOrders + order.quantity } : m
    ));
    
    setTimeout(async () => {
      const deliveryTxHash = await recordBlockchainTransaction(
        material.id,
        'delivery',
        order.quantity,
        [supplier.name, 'Warehouse Manager'],
        txHash
      );
      
      setOrders(prev => prev.map(o => 
        o.id === order.id ? { ...o, status: 'delivered', blockchainTx: deliveryTxHash } : o
      ));
      
      setMaterials(prev => prev.map(m => 
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

  const addNewMaterial = async () => {
    if (!newMaterial.name || !newMaterial.supplierId) return;

    const material: FinishedMaterial = {
      id: `MAT-${materials.length + 1}`,
      name: newMaterial.name,
      currentStock: newMaterial.currentStock || 0,
      reserved: newMaterial.reserved || 0,
      minStockLevel: newMaterial.minStockLevel || 0,
      reorderLevel: newMaterial.reorderLevel || 0,
      safetyStock: newMaterial.safetyStock || 0,
      leadTime: newMaterial.leadTime || 0,
      supplierId: newMaterial.supplierId,
      orderQuantity: newMaterial.orderQuantity || 0,
      pendingOrders: 0,
      unit: newMaterial.unit || 'units',
      sensorConnected: !!newMaterial.sensorConnected,
      batchNumber: newMaterial.batchNumber || `BATCH-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
      expiryDate: newMaterial.expiryDate || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      qualityStatus: newMaterial.qualityStatus || 'pending'
    };

    const txHash = await recordBlockchainTransaction(
      material.id,
      'adjustment',
      material.currentStock,
      ['System', 'Warehouse Manager']
    );
    material.blockchainTx = txHash;

    setSuppliers(suppliers.map(s => 
      s.id === material.supplierId 
        ? { ...s, materialsSupplied: [...s.materialsSupplied, material.id] }
        : s
    ));

    setMaterials([...materials, material]);
    setShowMaterialDialog(false);
    setNewMaterial({ unit: 'units', sensorConnected: false, qualityStatus: 'pending' });
  };

  const addNewSupplier = () => {
    if (!newSupplier.name || !newSupplier.contactPerson) return;

    const supplier: Supplier = {
      ...newSupplier,
      id: `SUP-${suppliers.length + 1}`
    };

    setSuppliers([...suppliers, supplier]);
    setShowSupplierDialog(false);
    setNewSupplier({
      name: '',
      contactPerson: '',
      email: '',
      rating: 0,
      materialsSupplied: [],
      leadTime: 0,
      reliability: 0,
      contractTerms: ''
    });
  };

  // Inventory metrics
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

  const statusColors = {
    critical: 'var(--red-3)',
    reorder: 'var(--orange-3)',
    ok: 'var(--green-3)',
    header: 'var(--gray-2)'
  };

  const TableRowWithStatus = ({ 
    children, 
    status 
  }: { 
    children: React.ReactNode, 
    status?: 'critical' | 'reorder' | 'ok' 
  }) => {
    const backgroundColor = status ? statusColors[status] : 'white';
    return <Table.Row style={{ backgroundColor }}>{children}</Table.Row>;
  };

  const renderShippingConditions = (shippingConditions?: {
    temperature?: number;
    humidity?: number;
  }) => {
    if (!shippingConditions) return null;

    return (
      <>
        <Box>
          <Text as="div" size="2" color="gray">Shipping Temperature</Text>
          <Text>{shippingConditions.temperature !== undefined ? `${shippingConditions.temperature}°C` : 'N/A'}</Text>
        </Box>
        <Box>
          <Text as="div" size="2" color="gray">Shipping Humidity</Text>
          <Text>{shippingConditions.humidity !== undefined ? `${shippingConditions.humidity}%` : 'N/A'}</Text>
        </Box>
      </>
    );
  };

  const renderSupplierRating = (supplierId: string) => {
    const supplier = getSupplierDetails(supplierId);
    const rating = supplier?.rating ?? 0;
    
    return (
      <Badge color={
        rating > 4 ? 'green' : 
        rating > 3 ? 'yellow' : 'red'
      }>
        {rating.toFixed(1)}
      </Badge>
    );
  };

  return (
    <Container size="3" px="4" py="6">
      {/* Inventory Dashboard */}
      <Grid columns="4" gap="4" mb="4">
        {[
          { icon: <ExclamationTriangleIcon color="red" />, label: 'Critical Materials', value: criticalMaterials },
          { icon: <ClockIcon />, label: 'Need Reorder', value: reorderNeeded },
          { icon: <CubeIcon />, label: 'Pending Orders', value: pendingOrdersCount },
          { icon: <LightningBoltIcon color="green" />, label: 'Connected Sensors', value: `${connectedSensors}/${materials.length}` }
        ].map((item, index) => (
          <Card key={index}>
            <Flex align="center" gap="3">
              <Box style={{ background: '#f8f9fa', padding: '12px', borderRadius: '8px' }}>
                {item.icon}
              </Box>
              <Box>
                <Text as="div" size="2" color="gray">{item.label}</Text>
                <Heading size="5">{item.value}</Heading>
              </Box>
            </Flex>
          </Card>
        ))}
      </Grid>

      {/* Suppliers Table */}
      <Card mb="4">
        <Flex justify="between" align="center" mb="3">
          <Heading size="5">Suppliers Management</Heading>
          <Button onClick={() => setShowSupplierDialog(true)}>Add New Supplier</Button>
        </Flex>
        <Table.Root>
          <Table.Header style={{ backgroundColor: statusColors.header }}>
            <Table.Row>
              <Table.ColumnHeaderCell>Supplier Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Contact</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Rating</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Materials Supplied</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Reliability</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {suppliers.map(supplier => (
              <TableRowWithStatus key={supplier.id}>
                <Table.Cell><Text weight="bold">{supplier.name}</Text></Table.Cell>
                <Table.Cell>
                  <Flex direction="column">
                    <Text>{supplier.contactPerson}</Text>
                    <Text size="1" color="gray">{supplier.email}</Text>
                  </Flex>
                </Table.Cell>
                <Table.Cell>
                  <Badge color={supplier.rating > 4 ? 'green' : supplier.rating > 3 ? 'yellow' : 'red'}>
                    {supplier.rating.toFixed(1)}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  {supplier.materialsSupplied.map(id => materials.find(m => m.id === id)?.name).join(', ') || 'None'}
                </Table.Cell>
                <Table.Cell>
                  <Flex align="center" gap="2">
                    <Progress value={supplier.reliability} />
                    <Text>{supplier.reliability}%</Text>
                  </Flex>
                </Table.Cell>
                <Table.Cell>
                  <Button size="1" onClick={() => setSelectedSupplier(supplier)}>Details</Button>
                </Table.Cell>
              </TableRowWithStatus>
            ))}
          </Table.Body>
        </Table.Root>
      </Card>

      {/* Action Buttons */}
      <Flex gap="3" mb="4" wrap="wrap">
        <Button onClick={generateAutoOrders}>Generate Auto Orders</Button>
        <Button onClick={() => setShowOrderDialog(true)}>Create Manual Order</Button>
        <Button onClick={() => setShowMaterialDialog(true)}>Add New Material</Button>
        <Flex align="center" gap="2">
          <Switch checked={showReorderOnly} onCheckedChange={setShowReorderOnly} />
          <Text>Show Only Materials Needing Reorder</Text>
        </Flex>
      </Flex>

      {/* Materials Table */}
      <Card mb="4">
        <Flex justify="between" align="center" mb="3">
          <Heading size="5">Finished Materials Inventory</Heading>
          <Text color="gray">{materials.length} materials registered</Text>
        </Flex>
        <Table.Root>
          <Table.Header style={{ backgroundColor: statusColors.header }}>
            <Table.Row>
              <Table.ColumnHeaderCell>Material</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Batch</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Expiry</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Current Stock</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Reserved</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Available</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Supplier</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Quality</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {materials
              .filter(material => !showReorderOnly || (material.currentStock - material.reserved) <= material.reorderLevel)
              .map(material => {
                const available = material.currentStock - material.reserved;
                const status = available <= material.safetyStock ? 'critical' : 
                              available <= material.reorderLevel ? 'reorder' : 'ok';
                const stockPercentage = (material.currentStock / (material.reorderLevel * 1.5)) * 100;
                
                return (
                  <TableRowWithStatus key={material.id} status={status}>
                    <Table.Cell>
                      <Flex align="center" gap="2">
                        {material.name}
                        {material.blockchainTx && <TokensIcon color="blue" />}
                      </Flex>
                    </Table.Cell>
                    <Table.Cell>{material.batchNumber}</Table.Cell>
                    <Table.Cell>{material.expiryDate}</Table.Cell>
                    <Table.Cell>
                      <Flex direction="column" gap="1">
                        <Text>{material.currentStock} {material.unit}</Text>
                        <Progress value={Math.min(stockPercentage, 100)} />
                      </Flex>
                    </Table.Cell>
                    <Table.Cell>{material.reserved} {material.unit}</Table.Cell>
                    <Table.Cell>{available} {material.unit}</Table.Cell>
                    <Table.Cell>
                      <Flex align="center" gap="2">
                        {getSupplierName(material.supplierId)}
                        {renderSupplierRating(material.supplierId)}
                      </Flex>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge color={
                        material.qualityStatus === 'approved' ? 'green' :
                        material.qualityStatus === 'rejected' ? 'red' : 'orange'
                      }>
                        {material.qualityStatus}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge color={
                        status === 'critical' ? 'red' : 
                        status === 'reorder' ? 'orange' : 'green'
                      }>
                        {status === 'critical' ? 'Critical' : 
                         status === 'reorder' ? 'Reorder Needed' : 'OK'}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Flex gap="2">
                        <Button size="1" onClick={() => setSelectedMaterial(material)}>Configure</Button>
                        <Button size="1" variant="soft" onClick={() => fetchBlockchainHistory(material.id)}>
                          Blockchain
                        </Button>
                      </Flex>
                    </Table.Cell>
                  </TableRowWithStatus>
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
          <Table.Header style={{ backgroundColor: statusColors.header }}>
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
              const supplier = getSupplierDetails(order.supplierId);
              
              return (
                <TableRowWithStatus key={order.id}>
                  <Table.Cell>{order.id}</Table.Cell>
                  <Table.Cell>{order.materialName}</Table.Cell>
                  <Table.Cell>{order.quantity} {material?.unit}</Table.Cell>
                  <Table.Cell>
                    <Flex align="center" gap="1">
                      {supplier?.name}
                      {supplier?.rating && (
                        <Badge color={supplier.rating > 4 ? 'green' : supplier.rating > 3 ? 'yellow' : 'red'}>
                          {supplier.rating.toFixed(1)}
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
                      <Badge color="blue">Verified</Badge>
                    ) : (
                      <Badge color="gray">Pending</Badge>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <Button size="1" onClick={() => setSelectedOrder(order)}>View</Button>
                  </Table.Cell>
                </TableRowWithStatus>
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
                  <Badge color="green"><Link2Icon /> IoT Connected</Badge>
                )}
              </Flex>
            </Dialog.Title>
            
            <Grid columns="2" gap="3" mt="3">
              {[
                { label: 'Batch Number', field: 'batchNumber', type: 'text' },
                { label: 'Expiry Date', field: 'expiryDate', type: 'date' },
                { label: 'Minimum Stock Level', field: 'minStockLevel', type: 'number' },
                { label: 'Reorder Level', field: 'reorderLevel', type: 'number' },
                { label: 'Safety Stock', field: 'safetyStock', type: 'number' },
                { label: 'Lead Time (days)', field: 'leadTime', type: 'number' },
                { label: 'Order Quantity', field: 'orderQuantity', type: 'number' },
                { label: 'Unit', field: 'unit', type: 'text' }
              ].map(({ label, field, type }) => (
                <Box key={field}>
                  <Text as="div" size="2" mb="1" weight="bold">{label}</Text>
                  <TextField.Root>
                    <input
                      type={type}
                      value={selectedMaterial[field as keyof FinishedMaterial] as string | number}
                      onChange={(e) => setSelectedMaterial({
                        ...selectedMaterial,
                        [field]: type === 'number' ? Number(e.target.value) : e.target.value
                      })}
                      className="rt-TextFieldInput"
                    />
                  </TextField.Root>
                </Box>
              ))}

              <Box>
                <Text as="div" size="2" mb="1" weight="bold">Quality Status</Text>
                <Select.Root
                  value={selectedMaterial.qualityStatus}
                  onValueChange={(value) => setSelectedMaterial({
                    ...selectedMaterial,
                    qualityStatus: value as 'approved' | 'pending' | 'rejected'
                  })}
                >
                  <Select.Trigger />
                  <Select.Content>
                    <Select.Item value="approved">Approved</Select.Item>
                    <Select.Item value="pending">Pending</Select.Item>
                    <Select.Item value="rejected">Rejected</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Box>
              
              <Box>
                <Text as="div" size="2" mb="1" weight="bold">Supplier</Text>
                <Select.Root
                  value={selectedMaterial.supplierId}
                  onValueChange={(value) => setSelectedMaterial({
                    ...selectedMaterial,
                    supplierId: value
                  })}
                >
                  <Select.Trigger />
                  <Select.Content>
                    {suppliers.map(supplier => (
                      <Select.Item key={supplier.id} value={supplier.id}>{supplier.name}</Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </Box>

              {selectedMaterial.sensorConnected && selectedMaterial.sensorReadings && (
                <>
                  <Box>
                    <Text as="div" size="2" mb="1" weight="bold">Temperature</Text>
                    <Text>{selectedMaterial.sensorReadings.temperature ?? 'N/A'}°C</Text>
                  </Box>
                  <Box>
                    <Text as="div" size="2" mb="1" weight="bold">Humidity</Text>
                    <Text>{selectedMaterial.sensorReadings.humidity ?? 'N/A'}%</Text>
                  </Box>
                  <Box>
                    <Text as="div" size="2" mb="1" weight="bold">Last Sensor Update</Text>
                    <Text>
                      {selectedMaterial.lastSensorUpdate ? 
                        new Date(selectedMaterial.lastSensorUpdate).toLocaleString() : 'N/A'}
                    </Text>
                  </Box>
                </>
              )}
            </Grid>
            
            <Flex gap="3" mt="4" justify="end">
              <Button variant="soft" color="gray" onClick={() => setSelectedMaterial(null)}>
                Cancel
              </Button>
              <Button onClick={() => {
                setMaterials(materials.map(m => m.id === selectedMaterial.id ? selectedMaterial : m));
                setSelectedMaterial(null);
              }}>
                Save Changes
              </Button>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      )}

      {/* Supplier Details Dialog */}
      {selectedSupplier && (
        <Dialog.Root open onOpenChange={() => setSelectedSupplier(null)}>
          <Dialog.Content style={{ maxWidth: '700px' }}>
            <Dialog.Title>
              <Flex align="center" gap="2">
                <PersonIcon /> {selectedSupplier.name}
              </Flex>
            </Dialog.Title>
            
            <Grid columns="2" gap="3" mt="3">
              {[
                { label: 'Contact Person', value: selectedSupplier.contactPerson },
                { label: 'Email', value: selectedSupplier.email, icon: <EnvelopeClosedIcon /> },
                { label: 'Rating', value: selectedSupplier.rating.toFixed(1) },
                { label: 'Lead Time (days)', value: selectedSupplier.leadTime.toString() },
                { label: 'Reliability', value: `${selectedSupplier.reliability}%` }
              ].map(({ label, value, icon }) => (
                <Box key={label}>
                  <Text as="div" size="2" color="gray">{label}</Text>
                  <Flex align="center" gap="1">
                    {icon}
                    <Text>{value}</Text>
                  </Flex>
                </Box>
              ))}

              <Box style={{ gridColumn: '1 / -1' }}>
                <Text as="div" size="2" color="gray">Contract Terms</Text>
                <Flex align="center" gap="1">
                  <FileTextIcon />
                  <Text>{selectedSupplier.contractTerms}</Text>
                </Flex>
              </Box>

              <Box style={{ gridColumn: '1 / -1' }}>
                <Text as="div" size="2" color="gray">Materials Supplied</Text>
                {selectedSupplier.materialsSupplied.length > 0 ? (
                  <Flex wrap="wrap" gap="2" mt="2">
                    {selectedSupplier.materialsSupplied.map(materialId => {
                      const material = materials.find(m => m.id === materialId);
                      return material ? (
                        <Badge key={materialId} variant="soft">{material.name}</Badge>
                      ) : null;
                    })}
                  </Flex>
                ) : (
                  <Text color="gray">No materials assigned</Text>
                )}
              </Box>
            </Grid>
            
            <Flex gap="3" mt="4" justify="end">
              <Button variant="soft" color="gray" onClick={() => setSelectedSupplier(null)}>
                Close
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
              {[
                { label: 'Material', value: selectedOrder.materialName },
                { label: 'Quantity', value: `${selectedOrder.quantity} ${materials.find(m => m.id === selectedOrder.materialId)?.unit}` },
                { label: 'Supplier', value: getSupplierName(selectedOrder.supplierId) },
                { label: 'Order Date', value: new Date(selectedOrder.orderDate).toLocaleDateString() },
                { label: 'Expected Delivery', value: new Date(selectedOrder.expectedDelivery).toLocaleDateString() },
                { 
                  label: 'Status', 
                  value: (
                    <Badge color={
                      selectedOrder.status === 'delivered' ? 'green' : 
                      selectedOrder.status === 'shipped' ? 'blue' : 
                      selectedOrder.status === 'approved' ? 'purple' : 
                      selectedOrder.status === 'cancelled' ? 'red' : 'orange'
                    }>
                      {selectedOrder.status}
                    </Badge>
                  ) 
                }
              ].map(({ label, value }) => (
                <Box key={label}>
                  <Text as="div" size="2" color="gray">{label}</Text>
                  <Text>{value}</Text>
                </Box>
              ))}

              {selectedOrder.blockchainTx && (
                <Box style={{ gridColumn: '1 / -1' }}>
                  <Text as="div" size="2" color="gray">Blockchain Transaction</Text>
                  <Text style={{ wordBreak: 'break-all' }}>{selectedOrder.blockchainTx}</Text>
                </Box>
              )}

              {renderShippingConditions(selectedOrder.shippingConditions)}
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
                  <Button color="green" onClick={() => {
                    updateOrderStatus(selectedOrder.id, 'approved');
                    setSelectedOrder(null);
                  }}>
                    Approve
                  </Button>
                  <Button color="red" onClick={() => {
                    updateOrderStatus(selectedOrder.id, 'cancelled');
                    setSelectedOrder(null);
                  }}>
                    Cancel
                  </Button>
                </>
              )}
              {selectedOrder.status === 'approved' && (
                <Button color="blue" onClick={() => {
                  updateOrderStatus(selectedOrder.id, 'shipped');
                  setSelectedOrder(null);
                }}>
                  Mark as Shipped
                </Button>
              )}
              {selectedOrder.status === 'shipped' && (
                <Button color="green" onClick={() => {
                  updateOrderStatus(selectedOrder.id, 'delivered');
                  setSelectedOrder(null);
                }}>
                  Mark as Delivered
                </Button>
              )}
              <Button variant="soft" color="gray" onClick={() => setSelectedOrder(null)}>
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
                    supplierId: material?.supplierId || ''
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
                  onChange={(e) => setNewOrder({ ...newOrder, quantity: Number(e.target.value) })}
                  className="rt-TextFieldInput"
                />
              </TextField.Root>
            </Box>
            
            <Box>
              <Text as="div" size="2" mb="1" weight="bold">Supplier</Text>
              <Select.Root
                value={newOrder.supplierId}
                onValueChange={(value) => setNewOrder({ ...newOrder, supplierId: value })}
                disabled={!newOrder.materialId}
              >
                <Select.Trigger placeholder={newOrder.materialId ? "Select supplier" : "Select material first"} />
                <Select.Content>
                  {newOrder.materialId && suppliers.filter(s => 
                    s.materialsSupplied.includes(newOrder.materialId as string)
                  ).map(supplier => (
                    <Select.Item key={supplier.id} value={supplier.id}>
                      {supplier.name} (Rating: {supplier.rating.toFixed(1)})
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
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
                onChange={(e) => setNewOrder({ ...newOrder, notes: e.target.value })}
              />
            </Box>
          </Grid>
          
          <Flex gap="3" mt="4" justify="end">
            <Button variant="soft" color="gray" onClick={() => {
              setShowOrderDialog(false);
              setNewOrder({ status: 'pending', orderDate: today });
            }}>
              Cancel
            </Button>
            <Button onClick={createManualOrder} disabled={!newOrder.materialId || !newOrder.quantity}>
              Create Order
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      {/* Add Material Dialog */}
      <Dialog.Root open={showMaterialDialog} onOpenChange={setShowMaterialDialog}>
        <Dialog.Content style={{ maxWidth: '700px' }}>
          <Dialog.Title>Add New Finished Material</Dialog.Title>
          
          <Grid columns="2" gap="3" mt="3">
            {[
              { label: 'Material Name', field: 'name', type: 'text' },
              { label: 'Current Stock', field: 'currentStock', type: 'number' },
              { label: 'Minimum Stock Level', field: 'minStockLevel', type: 'number' },
              { label: 'Reorder Level', field: 'reorderLevel', type: 'number' },
              { label: 'Safety Stock', field: 'safetyStock', type: 'number' },
              { label: 'Lead Time (days)', field: 'leadTime', type: 'number' },
              { label: 'Order Quantity', field: 'orderQuantity', type: 'number' },
              { label: 'Unit', field: 'unit', type: 'text', defaultValue: 'units' },
              { label: 'Batch Number', field: 'batchNumber', type: 'text' },
              { label: 'Expiry Date', field: 'expiryDate', type: 'date' }
            ].map(({ label, field, type, defaultValue }) => (
              <Box key={field}>
                <Text as="div" size="2" mb="1" weight="bold">{label}</Text>
                <TextField.Root>
                  <input
                    type={type}
                    placeholder={label}
                    value={(newMaterial[field as keyof typeof newMaterial] as string | number | undefined) || defaultValue || ''}
                    onChange={(e) => setNewMaterial({
                      ...newMaterial,
                      [field]: type === 'number' ? Number(e.target.value) : e.target.value
                    })}
                    className="rt-TextFieldInput"
                  />
                </TextField.Root>
              </Box>
            ))}

            <Box>
              <Text as="div" size="2" mb="1" weight="bold">Quality Status</Text>
              <Select.Root
                value={newMaterial.qualityStatus || 'pending'}
                onValueChange={(value) => setNewMaterial({
                  ...newMaterial,
                  qualityStatus: value as 'approved' | 'pending' | 'rejected'
                })}
              >
                <Select.Trigger />
                <Select.Content>
                  <Select.Item value="approved">Approved</Select.Item>
                  <Select.Item value="pending">Pending</Select.Item>
                  <Select.Item value="rejected">Rejected</Select.Item>
                </Select.Content>
              </Select.Root>
            </Box>
            
            <Box>
              <Text as="div" size="2" mb="1" weight="bold">Supplier</Text>
              <Select.Root
                value={newMaterial.supplierId || ''}
                onValueChange={(value) => setNewMaterial({ ...newMaterial, supplierId: value })}
              >
                <Select.Trigger placeholder="Select supplier" />
                <Select.Content>
                  {suppliers.map(supplier => (
                    <Select.Item key={supplier.id} value={supplier.id}>{supplier.name}</Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </Box>

            <Box>
              <Text as="div" size="2" mb="1" weight="bold">IoT Sensor</Text>
              <Flex gap="2" align="center">
                <Switch 
                  checked={newMaterial.sensorConnected || false}
                  onCheckedChange={(checked) => setNewMaterial({ ...newMaterial, sensorConnected: checked })}
                />
                <Text>Connect IoT Sensor</Text>
              </Flex>
            </Box>
          </Grid>
          
          <Flex gap="3" mt="4" justify="end">
            <Button variant="soft" color="gray" onClick={() => {
              setShowMaterialDialog(false);
              setNewMaterial({ unit: 'units', sensorConnected: false, qualityStatus: 'pending' });
            }}>
              Cancel
            </Button>
            <Button onClick={addNewMaterial} disabled={!newMaterial.name || !newMaterial.supplierId}>
              Add Material
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      {/* Add Supplier Dialog */}
      <Dialog.Root open={showSupplierDialog} onOpenChange={setShowSupplierDialog}>
        <Dialog.Content style={{ maxWidth: '700px' }}>
          <Dialog.Title>Add New Supplier</Dialog.Title>
          
          <Grid columns="2" gap="3" mt="3">
            {[
              { label: 'Supplier Name', field: 'name', type: 'text' },
              { label: 'Contact Person', field: 'contactPerson', type: 'text' },
              { label: 'Email', field: 'email', type: 'email' },
              { label: 'Rating (1-5)', field: 'rating', type: 'number', min: 1, max: 5, step: 0.1 },
              { label: 'Lead Time (days)', field: 'leadTime', type: 'number' },
              { label: 'Reliability (%)', field: 'reliability', type: 'number', min: 0, max: 100 }
            ].map(({ label, field, type, min, max, step }) => (
              <Box key={field}>
                <Text as="div" size="2" mb="1" weight="bold">{label}</Text>
                <TextField.Root>
                  <input
                    type={type}
                    placeholder={label}
                    value={newSupplier[field as keyof typeof newSupplier] as string | number}
                    onChange={(e) => setNewSupplier({
                      ...newSupplier,
                      [field]: type === 'number' ? Number(e.target.value) : e.target.value
                    })}
                    min={min}
                    max={max}
                    step={step}
                    className="rt-TextFieldInput"
                  />
                </TextField.Root>
              </Box>
            ))}

            <Box style={{ gridColumn: '1 / -1' }}>
              <Text as="div" size="2" mb="1" weight="bold">Contract Terms</Text>
              <TextArea
                placeholder="Contract Terms"
                value={newSupplier.contractTerms}
                onChange={(e) => setNewSupplier({ ...newSupplier, contractTerms: e.target.value })}
              />
            </Box>
          </Grid>
          
          <Flex gap="3" mt="4" justify="end">
            <Button variant="soft" color="gray" onClick={() => {
              setShowSupplierDialog(false);
              setNewSupplier({
                name: '',
                contactPerson: '',
                email: '',
                rating: 0,
                materialsSupplied: [],
                leadTime: 0,
                reliability: 0,
                contractTerms: ''
              });
            }}>
              Cancel
            </Button>
            <Button onClick={addNewSupplier} disabled={!newSupplier.name || !newSupplier.contactPerson}>
              Add Supplier
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
              <Table.Header style={{ backgroundColor: statusColors.header }}>
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
                {blockchainData.map((tx) => (
                  <Table.Row key={tx.txHash}>
                    <Table.Cell style={{ wordBreak: 'break-all' }}>
                      <Text size="1">{tx.txHash}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge>{tx.action}</Badge>
                    </Table.Cell>
                    <Table.Cell>
                      {new Date(tx.timestamp).toLocaleString()}
                    </Table.Cell>
                    <Table.Cell>
                      {tx.quantity ?? 'N/A'}
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
                        <Text size="1" style={{ wordBreak: 'break-all' }}>{tx.relatedTxHash}</Text>
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
            <Button variant="soft" color="gray" onClick={() => setShowBlockchainDialog(false)}>
              Close
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Container>
  );
};

export default FinishedMaterialInventory;
