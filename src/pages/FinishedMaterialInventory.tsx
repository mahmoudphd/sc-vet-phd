import React, { useState, ChangeEvent, useEffect } from 'react';
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
  MixerHorizontalIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CheckCircledIcon,
  CrossCircledIcon,
  LightningBoltIcon,
  LinkBreak2Icon,
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
  blockchainAddress?: string;
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
  expiryDate?: string;
  batchNumber: string;
  qualityStatus: 'approved' | 'pending' | 'rejected';
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

// Color scheme for UI
const statusColors = {
  critical: 'var(--red-3)',
  reorder: 'var(--orange-3)',
  ok: 'var(--green-3)',
  header: 'var(--gray-2)',
  rowEven: 'var(--gray-1)',
  rowOdd: 'white'
};

const FinishedMaterialInventory = () => {
  // Initial Suppliers Data
  const initialSuppliers: Supplier[] = [
    {
      id: generateId('SUP'),
      name: 'NutriSupplies Inc.',
      contactPerson: 'John Smith',
      email: 'john@nutrisupplies.com',
      rating: 4.5,
      materialsSupplied: [],
      leadTime: 7,
      reliability: 95,
      contractTerms: 'Net 30 days'
    },
    {
      id: generateId('SUP'),
      name: 'Vitamin World',
      contactPerson: 'Sarah Johnson',
      email: 'sarah@vitaminworld.com',
      rating: 4.2,
      materialsSupplied: [],
      leadTime: 5,
      reliability: 92,
      contractTerms: 'Net 45 days'
    }
  ];

  // Initial Materials Data
  const initialMaterials: FinishedMaterial[] = [
    {
      id: generateId('MAT'),
      name: 'Vitamin B1 (Thiamine) Capsules',
      currentStock: 5000,
      reserved: 1000,
      minStockLevel: 1000,
      reorderLevel: 2000,
      safetyStock: 500,
      leadTime: 7,
      supplierId: initialSuppliers[0].id,
      orderQuantity: 3000,
      pendingOrders: 0,
      unit: 'units',
      sensorConnected: false,
      batchNumber: 'BATCH-2023-001',
      expiryDate: '2024-12-31',
      qualityStatus: 'approved'
    },
    {
      id: generateId('MAT'),
      name: 'Vitamin B2 (Riboflavin) Tablets',
      currentStock: 8000,
      reserved: 2000,
      minStockLevel: 1500,
      reorderLevel: 3000,
      safetyStock: 750,
      leadTime: 5,
      supplierId: initialSuppliers[1].id,
      orderQuantity: 4000,
      pendingOrders: 0,
      unit: 'units',
      sensorConnected: false,
      batchNumber: 'BATCH-2023-002',
      expiryDate: '2025-06-30',
      qualityStatus: 'approved'
    }
  ];

  // Update suppliers with their materials
  initialSuppliers[0].materialsSupplied = [initialMaterials[0].id];
  initialSuppliers[1].materialsSupplied = [initialMaterials[1].id];

  // State
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [materials, setMaterials] = useState<FinishedMaterial[]>(initialMaterials);
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
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
  const [sensorStatus, setSensorStatus] = useState<Record<string, boolean>>({});
  const [isConnectingSensor, setIsConnectingSensor] = useState(false);

  // Helper functions
  const getSupplierName = (supplierId: string) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    return supplier ? supplier.name : 'Unknown Supplier';
  };

  const getSupplierDetails = (supplierId: string) => {
    return suppliers.find(s => s.id === supplierId);
  };

  const getMaterialsBySupplier = (supplierId: string) => {
    return materials.filter(m => m.supplierId === supplierId);
  };

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

        const supplier = getSupplierDetails(material.supplierId);
        if (!supplier) continue;

        const newOrder: PurchaseOrder = {
          id: generateId('PO'),
          materialId: material.id,
          materialName: material.name,
          quantity: orderQuantity,
          supplierId: material.supplierId,
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
          [supplier.name, 'Warehouse Manager']
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
              [supplier.name, 'Warehouse Manager'],
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

  // Update material quality status
  const updateQualityStatus = async (materialId: string, status: 'approved' | 'rejected') => {
    setMaterials(materials.map(m => 
      m.id === materialId ? { ...m, qualityStatus: status } : m
    ));

    const material = materials.find(m => m.id === materialId);
    if (material) {
      await recordBlockchainTransaction(
        materialId,
        'quality_check',
        0,
        ['Quality Control', 'Warehouse Manager'],
        material.blockchainTx
      );
    }
  };

  // Create manual order
  const createManualOrder = async () => {
    if (!newOrder.materialId || !newOrder.quantity) return;

    const material = materials.find(m => m.id === newOrder.materialId);
    if (!material) return;

    const supplier = getSupplierDetails(material.supplierId);
    if (!supplier) return;

    const order: PurchaseOrder = {
      id: generateId('PO'),
      materialId: material.id,
      materialName: material.name,
      quantity: Number(newOrder.quantity),
      supplierId: material.supplierId,
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
      [supplier.name, 'Warehouse Manager']
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
        [supplier.name, 'Warehouse Manager'],
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
    if (!newMaterial.name || !newMaterial.supplierId) return;

    const material: FinishedMaterial = {
      id: generateId('MAT'),
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
      sensorConnected: false,
      batchNumber: newMaterial.batchNumber || `BATCH-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
      expiryDate: newMaterial.expiryDate || new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      ).toISOString().split('T')[0],
      qualityStatus: newMaterial.qualityStatus || 'pending'
    };

    // Record initial stock on blockchain
    const txHash = await recordBlockchainTransaction(
      material.id,
      'adjustment',
      material.currentStock,
      ['System', 'Warehouse Manager']
    );
    material.blockchainTx = txHash;

    // Update supplier's materials list
    setSuppliers(suppliers.map(s => 
      s.id === material.supplierId 
        ? { ...s, materialsSupplied: [...s.materialsSupplied, material.id] }
        : s
    ));

    setMaterials([...materials, material]);
    setShowMaterialDialog(false);
    setNewMaterial({ unit: 'units', sensorConnected: false, qualityStatus: 'pending' });
  };

  // Add new supplier
  const addNewSupplier = () => {
    if (!newSupplier.name || !newSupplier.contactPerson) return;

    const supplier: Supplier = {
      ...newSupplier,
      id: generateId('SUP')
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

  // Handle input changes
  const handleMaterialInputChange = (e: ChangeEvent<HTMLInputElement>, field: keyof FinishedMaterial) => {
    if (!selectedMaterial) return;
    setSelectedMaterial({
      ...selectedMaterial,
      [field]: field === 'unit' || field === 'name' || field === 'batchNumber' || field === 'expiryDate'
        ? e.target.value 
        : Number(e.target.value)
    });
  };

  const handleNewMaterialInputChange = (e: ChangeEvent<HTMLInputElement>, field: keyof FinishedMaterial) => {
    setNewMaterial({
      ...newMaterial,
      [field]: field === 'unit' || field === 'name' || field === 'batchNumber' || field === 'expiryDate'
        ? e.target.value 
        : Number(e.target.value)
    });
  };

  const handleNewOrderInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof PurchaseOrder) => {
    setNewOrder({
      ...newOrder,
      [field]: field === 'notes' || field === 'materialId'
        ? e.target.value
        : Number(e.target.value)
    });
  };

  const handleSupplierInputChange = (e: ChangeEvent<HTMLInputElement>, field: keyof Supplier) => {
    if (selectedSupplier) {
      setSelectedSupplier({
        ...selectedSupplier,
        [field]: field === 'name' || field === 'contactPerson' || 
                field === 'email' || field === 'contractTerms'
          ? e.target.value
          : Number(e.target.value)
      });
    } else {
      setNewSupplier({
        ...newSupplier,
        [field]: field === 'name' || field === 'contactPerson' || 
                field === 'email' || field === 'contractTerms'
          ? e.target.value
          : Number(e.target.value)
      });
    }
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

  // Custom table row with styling
  const TableRowWithStatus = ({ 
    children, 
    status 
  }: { 
    children: React.ReactNode, 
    status?: 'critical' | 'reorder' | 'ok' 
  }) => {
    let backgroundColor = 'white';
    if (status === 'critical') backgroundColor = statusColors.critical;
    else if (status === 'reorder') backgroundColor = statusColors.reorder;
    else if (status === 'ok') backgroundColor = statusColors.ok;
    
    return (
      <Table.Row style={{ backgroundColor }}>
        {children}
      </Table.Row>
    );
  };

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

      {/* Suppliers Table */}
      <Card mb="4">
        <Flex justify="between" align="center" mb="3">
          <Heading size="5">Suppliers Management</Heading>
          <Button onClick={() => setShowSupplierDialog(true)}>
            Add New Supplier
          </Button>
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
            {suppliers.map((supplier, index) => (
              <TableRowWithStatus key={supplier.id} status={undefined}>
                <Table.Cell>
                  <Text weight="bold">{supplier.name}</Text>
                </Table.Cell>
                <Table.Cell>
                  <Flex direction="column">
                    <Text>{supplier.contactPerson}</Text>
                    <Text size="1" color="gray">{supplier.email}</Text>
                  </Flex>
                </Table.Cell>
                <Table.Cell>
                  <Badge color={
                    supplier.rating > 4 ? 'green' : 
                    supplier.rating > 3 ? 'yellow' : 'red'
                  }>
                    {supplier.rating.toFixed(1)}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <Text>
                    {supplier.materialsSupplied.length > 0 
                      ? supplier.materialsSupplied.map(id => 
                          materials.find(m => m.id === id)?.name
                        ).join(', ')
                      : 'No materials assigned'}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Flex align="center" gap="2">
                    <Progress value={supplier.reliability} />
                    <Text>{supplier.reliability}%</Text>
                  </Flex>
                </Table.Cell>
                <Table.Cell>
                  <Button size="1" onClick={() => setSelectedSupplier(supplier)}>
                    Details
                  </Button>
                </Table.Cell>
              </TableRowWithStatus>
            ))}
          </Table.Body>
        </Table.Root>
      </Card>

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
              .filter(material => !showReorderOnly || 
                (material.currentStock - material.reserved) <= material.reorderLevel)
              .map((material, index) => {
                const available = material.currentStock - material.reserved;
                const isCritical = available <= material.safetyStock;
                const needsReorder = available <= material.reorderLevel;
                const status = isCritical ? 'critical' : needsReorder ? 'reorder' : 'ok';
                const stockPercentage = (material.currentStock / (material.reorderLevel * 1.5)) * 100;
                
                return (
                  <TableRowWithStatus key={material.id} status={status}>
                    <Table.Cell>
                      <Flex align="center" gap="2">
                        {material.name}
                        {material.blockchainTx && <TokensIcon color="blue" />}
                      </Flex>
                    </Table.Cell>
                    <Table.Cell>
                      <Text>{material.batchNumber}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text>{material.expiryDate}</Text>
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
                      <Flex align="center" gap="2">
                        {getSupplierName(material.supplierId)}
                        <Badge color={
                          getSupplierDetails(material.supplierId)?.rating > 4 ? 'green' : 
                          getSupplierDetails(material.supplierId)?.rating > 3 ? 'yellow' : 'red'
                        }>
                          {getSupplierDetails(material.supplierId)?.rating.toFixed(1)}
                        </Badge>
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
                <TableRowWithStatus key={order.id} status={undefined}>
                  <Table.Cell>{order.id}</Table.Cell>
                  <Table.Cell>{order.materialName}</Table.Cell>
                  <Table.Cell>{order.quantity} {material?.unit}</Table.Cell>
                  <Table.Cell>
                    <Flex align="center" gap="1">
                      {supplier?.name}
                      {supplier?.rating && (
                        <Badge color={
                          supplier.rating > 4 ? 'green' : 
                          supplier.rating > 3 ? 'yellow' : 'red'
                        }>
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
                  <Badge color="green">
                    <Link2Icon /> IoT Connected
                  </Badge>
                )}
              </Flex>
            </Dialog.Title>
            
            <Grid columns="2" gap="3" mt="3">
              <Box>
                <Text as="div" size="2" mb="1" weight="bold">Batch Number</Text>
                <TextField.Root>
                  <input
                    type="text"
                    value={selectedMaterial.batchNumber}
                    onChange={(e) => handleMaterialInputChange(e, 'batchNumber')}
                    className="rt-TextFieldInput"
                  />
                </TextField.Root>
              </Box>
              
              <Box>
                <Text as="div" size="2" mb="1" weight="bold">Expiry Date</Text>
                <TextField.Root>
                  <input
                    type="date"
                    value={selectedMaterial.expiryDate}
                    onChange={(e) => handleMaterialInputChange(e, 'expiryDate')}
                    className="rt-TextFieldInput"
                  />
                </TextField.Root>
              </Box>
              
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
                      <Select.Item key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </Box>

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

              {selectedMaterial.sensorConnected && selectedMaterial.sensorReadings && (
                <>
                  <Box>
                    <Text as="div" size="2" mb="1" weight="bold">Temperature</Text>
                    <Text>{selectedMaterial.sensorReadings?.temperature || 'N/A'}°C</Text>
                  </Box>
                  <Box>
                    <Text as="div" size="2" mb="1" weight="bold">Humidity</Text>
                    <Text>{selectedMaterial.sensorReadings?.humidity || 'N/A'}%</Text>
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
              <Box>
                <Text as="div" size="2" color="gray">Contact Person</Text>
                <Text>{selectedSupplier.contactPerson}</Text>
              </Box>
              
              <Box>
                <Text as="div" size="2" color="gray">Email</Text>
                <Flex align="center" gap="1">
                  <EnvelopeClosedIcon />
                  <Text>{selectedSupplier.email}</Text>
                </Flex>
              </Box>
              
              <Box>
                <Text as="div" size="2" color="gray">Rating</Text>
                <Badge color={
                  selectedSupplier.rating > 4 ? 'green' : 
                  selectedSupplier.rating > 3 ? 'yellow' : 'red'
                }>
                  {selectedSupplier.rating.toFixed(1)}
                </Badge>
              </Box>
              
              <Box>
                <Text as="div" size="2" color="gray">Lead Time (days)</Text>
                <Text>{selectedSupplier.leadTime}</Text>
              </Box>
              
              <Box>
                <Text as="div" size="2" color="gray">Reliability</Text>
                <Flex align="center" gap="2">
                  <Progress value={selectedSupplier.reliability} />
                  <Text>{selectedSupplier.reliability}%</Text>
                </Flex>
              </Box>

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
                        <Badge key={materialId} variant="soft">
                          {material.name}
                        </Badge>
                      ) : null;
                    })}
                  </Flex>
                ) : (
                  <Text color="gray">No materials assigned</Text>
                )}
              </Box>
            </Grid>
            
            <Flex gap="3" mt="4" justify="end">
              <Button 
                variant="soft" 
                color="gray"
                onClick={() => setSelectedSupplier(null)}
              >
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
                <Text>{getSupplierName(selectedOrder.supplierId)}</Text>
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
                  onChange={(e) => handleNewOrderInputChange(e, 'quantity')}
                  className="rt-TextFieldInput"
                />
              </TextField.Root>
            </Box>
            
            <Box>
              <Text as="div" size="2" mb="1" weight="bold">Supplier</Text>
              <Select.Root
                value={newOrder.supplierId}
                onValueChange={(value) => setNewOrder({
                  ...newOrder,
                  supplierId: value
                })}
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
          <Dialog.Title>Add New Finished Material</Dialog.Title>
          
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
              <Select.Root
                value={newMaterial.supplierId}
                onValueChange={(value) => setNewMaterial({
                  ...newMaterial,
                  supplierId: value
                })}
              >
                <Select.Trigger placeholder="Select supplier" />
                <Select.Content>
                  {suppliers.map(supplier => (
                    <Select.Item key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
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
              <Text as="div" size="2" mb="1" weight="bold">Unit</Text>
              <TextField.Root>
                <input
                  type="text"
                  placeholder="Unit (units, kg, etc.)"
                  value={newMaterial.unit || ''}
                  onChange={(e) => handleNewMaterialInputChange(e, 'unit')}
                  className="rt-TextFieldInput"
                />
              </TextField.Root>
            </Box>
            
            <Box>
              <Text as="div" size="2" mb="1" weight="bold">Batch Number</Text>
              <TextField.Root>
                <input
                  type="text"
                  placeholder="Batch Number"
                  value={newMaterial.batchNumber || ''}
                  onChange={(e) => handleNewMaterialInputChange(e, 'batchNumber')}
                  className="rt-TextFieldInput"
                />
              </TextField.Root>
            </Box>
            
            <Box>
              <Text as="div" size="2" mb="1" weight="bold">Expiry Date</Text>
              <TextField.Root>
                <input
                  type="date"
                  placeholder="Expiry Date"
                  value={newMaterial.expiryDate || ''}
                  onChange={(e) => handleNewMaterialInputChange(e, 'expiryDate')}
                  className="rt-TextFieldInput"
                />
              </TextField.Root>
            </Box>
            
            <Box>
              <Text as="div" size="2" mb="1" weight="bold">Quality Status</Text>
              <Select.Root
                value={newMaterial.qualityStatus}
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
                setNewMaterial({ unit: 'units', sensorConnected: false, qualityStatus: 'pending' });
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

      {/* Add Supplier Dialog */}
      <Dialog.Root open={showSupplierDialog} onOpenChange={setShowSupplierDialog}>
        <Dialog.Content style={{ maxWidth: '700px' }}>
          <Dialog.Title>Add New Supplier</Dialog.Title>
          
          <Grid columns="2" gap="3" mt="3">
            <Box>
              <Text as="div" size="2" mb="1" weight="bold">Supplier Name</Text>
              <TextField.Root>
                <input
                  type="text"
                  placeholder="Supplier Name"
                  value={newSupplier.name}
                  onChange={(e) => handleSupplierInputChange(e, 'name')}
                  className="rt-TextFieldInput"
                />
              </TextField.Root>
            </Box>
            
            <Box>
              <Text as="div" size="2" mb="1" weight="bold">Contact Person</Text>
              <TextField.Root>
                <input
                  type="text"
                  placeholder="Contact Person"
                  value={newSupplier.contactPerson}
                  onChange={(e) => handleSupplierInputChange(e, 'contactPerson')}
                  className="rt-TextFieldInput"
                />
              </TextField.Root>
            </Box>
            
            <Box>
              <Text as="div" size="2" mb="1" weight="bold">Email</Text>
              <TextField.Root>
                <input
                  type="email"
                  placeholder="Email"
                  value={newSupplier.email}
                  onChange={(e) => handleSupplierInputChange(e, 'email')}
                  className="rt-TextFieldInput"
                />
              </TextField.Root>
            </Box>
            
            <Box>
              <Text as="div" size="2" mb="1" weight="bold">Rating (1-5)</Text>
              <TextField.Root>
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  placeholder="Rating"
                  value={newSupplier.rating}
                  onChange={(e) => handleSupplierInputChange(e, 'rating')}
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
                  value={newSupplier.leadTime}
                  onChange={(e) => handleSupplierInputChange(e, 'leadTime')}
                  className="rt-TextFieldInput"
                />
              </TextField.Root>
            </Box>
            
            <Box>
              <Text as="div" size="2" mb="1" weight="bold">Reliability (%)</Text>
              <TextField.Root>
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Reliability"
                  value={newSupplier.reliability}
                  onChange={(e) => handleSupplierInputChange(e, 'reliability')}
                  className="rt-TextFieldInput"
                />
              </TextField.Root>
            </Box>
            
            <Box style={{ gridColumn: '1 / -1' }}>
              <Text as="div" size="2" mb="1" weight="bold">Contract Terms</Text>
              <TextArea
                placeholder="Contract Terms"
                value={newSupplier.contractTerms}
                onChange={(e) => setNewSupplier({
                  ...newSupplier,
                  contractTerms: e.target.value
                })}
              />
            </Box>
          </Grid>
          
          <Flex gap="3" mt="4" justify="end">
            <Button 
              variant="soft" 
              color="gray"
              onClick={() => {
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
              }}
            >
              Cancel
            </Button>
            <Button onClick={addNewSupplier}>
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
                {blockchainData.map((tx, index) => (
                  <TableRowWithStatus key={index} status={undefined}>
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
                  </TableRowWithStatus>
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

export default FinishedMaterialInventory;
