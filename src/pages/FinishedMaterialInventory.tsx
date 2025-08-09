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
};export class BlockchainService {
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
}export class IoTSensorService {
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
}import React from 'react';
import { Table, Flex, Badge, Progress, Button, Text } from '@radix-ui/themes';
import { RawMaterial } from '../../../types/inventoryTypes';
import { formatDate, getDaysRemaining } from '../../../utils/helpers';
import { Link2Icon, TokensIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';

interface MaterialRowProps {
  material: RawMaterial;
  onConnectSensor: (materialId: string) => void;
  onViewMaterial: (material: RawMaterial) => void;
  onViewBlockchain: (materialId: string) => void;
  loading: boolean;
}

export const MaterialRow: React.FC<MaterialRowProps> = ({
  material,
  onConnectSensor,
  onViewMaterial,
  onViewBlockchain,
  loading
}) => {
  const available = material.currentStock - material.reserved;
  const isCritical = available <= material.safetyStock;
  const needsReorder = available <= material.reorderLevel;
  const stockPercentage = (material.currentStock / (material.reorderLevel * 1.5)) * 100;
  const daysRemaining = getDaysRemaining(material.expiryDate);

  return (
    <Table.Row style={{
      backgroundColor: 'white',
      borderBottom: '1px solid #f0f0f0',
      borderLeft: isCritical ? '3px solid #ef4444' : needsReorder ? '3px solid #f59e0b' : '3px solid transparent'
    }}>
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
            onClick={() => onConnectSensor(material.id)}
            disabled={loading}
          >
            {loading ? 'Connecting...' : 'Connect Sensor'}
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
          <Button size="1" onClick={() => onViewMaterial(material)}>
            Configure
          </Button>
          <Button 
            size="1" 
            variant="soft" 
            onClick={() => onViewBlockchain(material.id)}
          >
            Blockchain
          </Button>
        </Flex>
      </Table.Cell>
    </Table.Row>
  );
};import React from 'react';
import { Table, Flex, Text } from '@radix-ui/themes';
import { MaterialRow } from './MaterialRow';
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

export const MaterialTable: React.FC<MaterialTableProps> = ({
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
};import React from 'react';
import { Card, Flex, Box, Heading, Text, Grid } from '@radix-ui/themes';
import { 
  ExclamationTriangleIcon, 
  ClockIcon, 
  CubeIcon, 
  LightningBoltIcon 
} from '@radix-ui/react-icons';

interface StatsCardsProps {
  criticalMaterials: number;
  reorderNeeded: number;
  pendingOrdersCount: number;
  connectedSensors: number;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  criticalMaterials,
  reorderNeeded,
  pendingOrdersCount,
  connectedSensors
}) => {
  return (
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
            <Heading size="5">{connectedSensors}</Heading>
          </Box>
        </Flex>
      </Card>
    </Grid>
  );
};import React from 'react';
import { Dialog, Flex, Grid, Box, Text, TextField, Select, Button, Badge } from '@radix-ui/themes';
import { RawMaterial } from '../types/inventoryTypes';
import { Link2Icon } from '@radix-ui/react-icons';

interface MaterialDetailsDialogProps {
  material: RawMaterial;
  onClose: () => void;
  onSave: (material: RawMaterial) => void;
}

export const MaterialDetailsDialog: React.FC<MaterialDetailsDialogProps> = ({ 
  material, 
  onClose, 
  onSave 
}) => {
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
          
          <Box>
            <Text as="div" size="2" mb="1" weight="bold">Reorder Level</Text>
            <TextField.Root>
              <input
                type="number"
                value={editedMaterial.reorderLevel}
                onChange={(e) => setEditedMaterial({
                  ...editedMaterial,
                  reorderLevel: parseInt(e.target.value) || 0
                })}
              />
            </TextField.Root>
          </Box>
          
          <Box>
            <Text as="div" size="2" mb="1" weight="bold">Safety Stock</Text>
            <TextField.Root>
              <input
                type="number"
                value={editedMaterial.safetyStock}
                onChange={(e) => setEditedMaterial({
                  ...editedMaterial,
                  safetyStock: parseInt(e.target.value) || 0
                })}
              />
            </TextField.Root>
          </Box>
          
          <Box>
            <Text as="div" size="2" mb="1" weight="bold">Lead Time (days)</Text>
            <TextField.Root>
              <input
                type="number"
                value={editedMaterial.leadTime}
                onChange={(e) => setEditedMaterial({
                  ...editedMaterial,
                  leadTime: parseInt(e.target.value) || 0
                })}
              />
            </TextField.Root>
          </Box>
          
          <Box>
            <Text as="div" size="2" mb="1" weight="bold">Order Quantity</Text>
            <TextField.Root>
              <input
                type="number"
                value={editedMaterial.orderQuantity}
                onChange={(e) => setEditedMaterial({
                  ...editedMaterial,
                  orderQuantity: parseInt(e.target.value) || 0
                })}
              />
            </TextField.Root>
          </Box>
          
          <Box>
            <Text as="div" size="2" mb="1" weight="bold">Unit</Text>
            <TextField.Root>
              <input
                type="text"
                value={editedMaterial.unit}
                onChange={(e) => setEditedMaterial({
                  ...editedMaterial,
                  unit: e.target.value
                })}
              />
            </TextField.Root>
          </Box>

          <Box>
            <Text as="div" size="2" mb="1" weight="bold">Location</Text>
            <Select.Root
              value={editedMaterial.location}
              onValueChange={(value) => setEditedMaterial({
                ...editedMaterial,
                location: value
              })}
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
                value={editedMaterial.expiryDate.split('T')[0]}
                onChange={(e) => setEditedMaterial({
                  ...editedMaterial,
                  expiryDate: e.target.value
                })}
              />
            </TextField.Root>
          </Box>

          {editedMaterial.sensorConnected && editedMaterial.sensorReadings && (
            <>
              <Box>
                <Text as="div" size="2" mb="1" weight="bold">Temperature</Text>
                <Text>{editedMaterial.sensorReadings.temperature}°C</Text>
              </Box>
              <Box>
                <Text as="div" size="2" mb="1" weight="bold">Humidity</Text>
                <Text>{editedMaterial.sensorReadings.humidity}%</Text>
              </Box>
              <Box>
                <Text as="div" size="2" mb="1" weight="bold">Last Sensor Update</Text>
                <Text>
                  {editedMaterial.lastSensorUpdate ? 
                    new Date(editedMaterial.lastSensorUpdate).toLocaleString() : 
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
};import React from 'react';
import { Dialog, Grid, Box, Text, TextField, Select, Button, TextArea } from '@radix-ui/themes';
import { RawMaterial } from '../types/inventoryTypes';

interface OrderFormDialogProps {
  materials: RawMaterial[];
  onClose: () => void;
  onSubmit: (order: Partial<PurchaseOrder>) => void;
}

export const OrderFormDialog: React.FC<OrderFormDialogProps> = ({ 
  materials, 
  onClose, 
  onSubmit 
}) => {
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
                  supplier: material?.supplier || '',
                  materialName: material?.name || ''
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
                value={order.quantity || ''}
                onChange={(e) => setOrder({
                  ...order,
                  quantity: parseInt(e.target.value) || 0
                })}
              />
            </TextField.Root>
          </Box>
          
          <Box>
            <Text as="div" size="2" mb="1" weight="bold">Supplier</Text>
            <TextField.Root>
              <input
                type="text"
                placeholder="Supplier"
                value={order.supplier || ''}
                onChange={(e) => setOrder({
                  ...order,
                  supplier: e.target.value
                })}
              />
            </TextField.Root>
          </Box>
          
          <Box>
            <Text as="div" size="2" mb="1" weight="bold">Expected Delivery</Text>
            <TextField.Root>
              <input
                type="date"
                placeholder="Expected Delivery"
                value={order.expectedDelivery?.split('T')[0] || ''}
                onChange={(e) => setOrder({
                  ...order,
                  expectedDelivery: new Date(e.target.value).toISOString()
                })}
              />
            </TextField.Root>
          </Box>
          
          <Box style={{ gridColumn: '1 / -1' }}>
            <Text as="div" size="2" mb="1" weight="bold">Notes (optional)</Text>
            <TextArea
              placeholder="Notes"
              value={order.notes || ''}
              onChange={(e) => setOrder({
                ...order,
                notes: e.target.value
              })}
            />
          </Box>
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
};import React from 'react';
import { Dialog, Table, Flex, Text, Button, Badge } from '@radix-ui/themes';
import { BlockchainTransaction } from '../types/inventoryTypes';

interface BlockchainDialogProps {
  transactions: BlockchainTransaction[];
  loading: boolean;
  onClose: () => void;
}

export const BlockchainDialog: React.FC<BlockchainDialogProps> = ({ 
  transactions, 
  loading, 
  onClose 
}) => {
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
};import React from 'react';
import { Dialog, Flex, Grid, Box, Text, Button, Badge } from '@radix-ui/themes';
import { PurchaseOrder } from '../types/inventoryTypes';
import { formatDate } from '../utils/helpers';

interface OrderDetailsDialogProps {
  order: PurchaseOrder;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
}

export const OrderDetailsDialog: React.FC<OrderDetailsDialogProps> = ({ 
  order, 
  onClose,
  onUpdateStatus
}) => {
  return (
    <Dialog.Root open onOpenChange={onClose}>
      <Dialog.Content style={{ maxWidth: '600px' }}>
        <Dialog.Title>Order Details: {order.id}</Dialog.Title>
        
        <Grid columns="2" gap="3" mt="3">
          <Box>
            <Text as="div" size="2" mb="1" weight="bold">Material</Text>
            <Text>{order.materialName}</Text>
          </Box>
          
          <Box>
            <Text as="div" size="2" mb="1" weight="bold">Quantity</Text>
            <Text>{order.quantity}</Text>
          </Box>
          
          <Box>
            <Text as="div" size="2" mb="1" weight="bold">Supplier</Text>
            <Text>{order.supplier}</Text>
          </Box>
          
          <Box>
            <Text as="div" size="2" mb="1" weight="bold">Order Date</Text>
            <Text>{formatDate(order.orderDate)}</Text>
          </Box>
          
          <Box>
            <Text as="div" size="2" mb="1" weight="bold">Expected Delivery</Text>
            <Text>{formatDate(order.expectedDelivery)}</Text>
          </Box>
          
          <Box>
            <Text as="div" size="2" mb="1" weight="bold">Status</Text>
            <Badge color={getStatusColor(order.status)}>
              {order.status}
            </Badge>
          </Box>
          
          {order.notes && (
            <Box style={{ gridColumn: '1 / -1' }}>
              <Text as="div" size="2" mb="1" weight="bold">Notes</Text>
              <Text>{order.notes}</Text>
            </Box>
          )}
          
          {order.blockchainTx && (
            <Box style={{ gridColumn: '1 / -1' }}>
              <Text as="div" size="2" mb="1" weight="bold">Blockchain Transaction</Text>
              <Text size="1" style={{ wordBreak: 'break-all' }}>{order.blockchainTx}</Text>
            </Box>
          )}
        </Grid>
        
        <Flex gap="3" mt="4" justify="end">
          {order.status === 'pending' && (
            <Button 
              variant="soft" 
              color="green"
              onClick={() => onUpdateStatus(order.id, 'approved')}
            >
              Approve
            </Button>
          )}
          {order.status === 'approved' && (
            <Button 
              variant="soft" 
              color="blue"
              onClick={() => onUpdateStatus(order.id, 'shipped')}
            >
              Mark as Shipped
            </Button>
          )}
          {order.status === 'shipped' && (
            <Button 
              variant="soft" 
              color="purple"
              onClick={() => onUpdateStatus(order.id, 'delivered')}
            >
              Mark as Delivered
            </Button>
          )}
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
};import React from 'react';
import { Dialog, Grid, Box, Text, TextField, Select, Button } from '@radix-ui/themes';
import { MaterialCategory } from '../types/inventoryTypes';

interface MaterialFormDialogProps {
  onClose: () => void;
  onSubmit: (material: Partial<RawMaterial>) => void;
}

export const MaterialFormDialog: React.FC<MaterialFormDialogProps> = ({ 
  onClose, 
  onSubmit 
}) => {
  const [newMaterial, setNewMaterial] = React.useState<Partial<RawMaterial>>({
    unit: 'kg',
    sensorConnected: false,
    category: 'A',
    expiryDate: '2025-12-31',
    currentStock: 0,
    reserved: 0,
    minStockLevel: 0,
    reorderLevel: 0,
    safetyStock: 0,
    leadTime: 0,
    orderQuantity: 0,
    pendingOrders: 0,
    location: 'Zone 1'
  });

  return (
    <Dialog.Root open onOpenChange={onClose}>
      <Dialog.Content style={{ maxWidth: '700px' }}>
        <Dialog.Title>Add New Material</Dialog.Title>
        
        <Grid columns="2" gap="3" mt="3">
          <Box>
            <Text as="div" size="2" mb="1" weight="bold">Material Name</Text>
            <TextField.Root>
              <input
                type="text"
                placeholder="Name"
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
              <input
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
            <Text as="div" size="2" mb="1" weight="bold">Initial Stock</Text>
            <TextField.Root>
              <input
                type="number"
                placeholder="Quantity"
                value={newMaterial.currentStock || 0}
                onChange={(e) => setNewMaterial({
                  ...newMaterial,
                  currentStock: parseInt(e.target.value) || 0
                })}
              />
            </TextField.Root>
          </Box>
          
          <Box>
            <Text as="div" size="2" mb="1" weight="bold">Unit</Text>
            <Select.Root
              value={newMaterial.unit || 'kg'}
              onValueChange={(value) => setNewMaterial({
                ...newMaterial,
                unit: value
              })}
            >
              <Select.Trigger />
              <Select.Content>
                <Select.Item value="kg">kg</Select.Item>
                <Select.Item value="g">g</Select.Item>
                <Select.Item value="L">L</Select.Item>
                <Select.Item value="mL">mL</Select.Item>
                <Select.Item value="units">units</Select.Item>
              </Select.Content>
            </Select.Root>
          </Box>
          
          <Box>
            <Text as="div" size="2" mb="1" weight="bold">Category</Text>
            <Select.Root
              value={newMaterial.category || 'A'}
              onValueChange={(value) => setNewMaterial({
                ...newMaterial,
                category: value as MaterialCategory
              })}
            >
              <Select.Trigger />
              <Select.Content>
                <Select.Item value="A">Category A</Select.Item>
                <Select.Item value="B">Category B</Select.Item>
                <Select.Item value="C">Category C</Select.Item>
              </Select.Content>
            </Select.Root>
          </Box>
          
          <Box>
            <Text as="div" size="2" mb="1" weight="bold">Location</Text>
            <Select.Root
              value={newMaterial.location || 'Zone 1'}
              onValueChange={(value) => setNewMaterial({
                ...newMaterial,
                location: value
              })}
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
                value={newMaterial.expiryDate?.split('T')[0] || ''}
                onChange={(e) => setNewMaterial({
                  ...newMaterial,
                  expiryDate: e.target.value
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
              <Text>{newMaterial.sensorConnected ? 'Connected' : 'Not Connected'}</Text>
            </Flex>
          </Box>
        </Grid>
        
        <Flex gap="3" mt="4" justify="end">
          <Button 
            variant="soft" 
            color="gray"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            onClick={() => onSubmit(newMaterial)}
            disabled={!newMaterial.name || !newMaterial.supplier}
          >
            Add Material
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};import React, { useState, useEffect, useMemo } from 'react';
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

import { MaterialTable } from '../components/MaterialTable';
import { StatsCards } from '../components/Dashboard/StatsCards';
import { MaterialDetailsDialog } from '../components/MaterialDetailsDialog';
import { OrderFormDialog } from '../components/OrderFormDialog';
import { BlockchainDialog } from '../components/BlockchainDialog';
import { OrderDetailsDialog } from '../components/OrderDetailsDialog';
import { MaterialFormDialog } from '../components/MaterialFormDialog';
import { RawMaterial, PurchaseOrder } from '../types/inventoryTypes';
import { BlockchainService } from '../services/BlockchainService';
import { IoTSensorService } from '../services/IoTSensorService';
import { 
  generateId, 
  formatDate, 
  getDaysRemaining, 
  CATEGORY_COLORS, 
  getStatusColor 
} from '../utils/helpers';

const FinishedMaterialInventory: React.FC = () => {
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
        orderDate: new Date().toISOString().split('T')[0],
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
        newOrder: { status: 'pending', orderDate: new Date().toISOString().split('T')[0] }
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
      <StatsCards 
        criticalMaterials={criticalMaterials}
        reorderNeeded={reorderNeeded}
        pendingOrdersCount={pendingOrdersCount}
        connectedSensors={connectedSensors}
      />

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

      <Card mb="4" style={{ overflow: 'hidden' }}>
        <Flex justify="between" align="center" mb="3">
          <Heading size="5">Raw Materials Inventory</Heading>
          <Text color="gray">{filteredMaterials.length} materials filtered</Text>
        </Flex>
        <MaterialTable
          materials={filteredMaterials}
          sortConfig={state.sortConfig}
          onRequestSort={handlers.requestSort}
          onConnectSensor={handlers.connectToSensor}
          onViewMaterial={(material) => setState(prev => ({ ...prev, selected: { ...prev.selected, material }}))}
          onViewBlockchain={handlers.fetchBlockchainHistory}
          loading={state.loading.sensor}
        />
      </Card>

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
                    <Button size="1" onClick={() => setState(prev => ({ ...prev, selected: { ...prev.selected, order }}))}>
                      View
                    </Button>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Root>
      </Card>

      {state.selected.material && (
        <MaterialDetailsDialog
          material={state.selected.material}
          onClose={() => setState(prev => ({ ...prev, selected: { ...prev.selected, material: null }}))}
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

      {state.selected.order && (
        <OrderDetailsDialog
          order={state.selected.order}
          onClose={() => setState(prev => ({ ...prev, selected: { ...prev.selected, order: null }}))}
          onUpdateStatus={handlers.updateOrderStatus}
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

      {state.dialogs.material && (
        <MaterialFormDialog
          onClose={() => setState(prev => ({
            ...prev,
            dialogs: { ...prev.dialogs, material: false },
            newMaterial: { unit: 'kg', sensorConnected: false, category: 'A', expiryDate: '2025-12-31' }
          }))}
          onSubmit={handlers.addNewMaterial}
        />
      )}

      {state.dialogs.blockchain && (
        <BlockchainDialog
          transactions={state.blockchainData}
          loading={state.loading.blockchain}
          onClose={() => setState(prev => ({ ...prev, dialogs: { ...prev.dialogs, blockchain: false }}))}
        />
      )}
    </Container>
  );
};

export default FinishedMaterialInventory;
