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
  TextArea,
  Container,
  Progress,
  ScrollArea,
  AlertDialog,
  Em,
  Strong
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
  FileTextIcon,
  CheckCircledIcon,
  CrossCircledIcon,
  Pencil1Icon,
  CheckIcon,
  Cross1Icon,
  DownloadIcon,
  UpdateIcon,
  TrashIcon,
  PlusIcon,
  MagnifyingGlassIcon
} from '@radix-ui/react-icons';

// ==================== TYPES ====================
interface Supplier {
  id: string;
  name: string;
  rating: number;
  materialsSupplied: string[];
  leadTime: number;
  reliability: number;
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
  expiryDate?: string;
  lastUpdate?: string;
  blockchainTx?: string;
}

interface BlockchainTransaction {
  txHash: string;
  timestamp: string;
  materialId: string;
  action: string;
  participants: string[];
  quantity?: number;
}

interface MaterialEditLog {
  id: string;
  materialId: string;
  changes: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  editedBy: string;
  timestamp: string;
  blockchainTx?: string;
}

// ==================== MOCK DATA ====================
const initialSuppliers: Supplier[] = [
  {
    id: 'sup-1',
    name: 'Global Pharma',
    rating: 4.7,
    materialsSupplied: ['mat-1', 'mat-3'],
    leadTime: 7,
    reliability: 95
  },
  {
    id: 'sup-2',
    name: 'BioTech Solutions',
    rating: 4.3,
    materialsSupplied: ['mat-2', 'mat-4'],
    leadTime: 5,
    reliability: 92
  }
];

const initialMaterials: FinishedMaterial[] = [
  {
    id: 'mat-1',
    name: 'Vitamin B12 Injections',
    currentStock: 1500,
    reserved: 300,
    minStockLevel: 200,
    reorderLevel: 500,
    safetyStock: 100,
    leadTime: 7,
    supplierId: 'sup-1',
    orderQuantity: 1000,
    pendingOrders: 0,
    unit: 'vials',
    sensorConnected: true,
    batchNumber: 'BATCH-2023-001',
    expiryDate: '2024-06-30'
  },
  {
    id: 'mat-2',
    name: 'Insulin Pens',
    currentStock: 3000,
    reserved: 750,
    minStockLevel: 500,
    reorderLevel: 1000,
    safetyStock: 250,
    leadTime: 5,
    supplierId: 'sup-2',
    orderQuantity: 1500,
    pendingOrders: 0,
    unit: 'units',
    sensorConnected: false,
    batchNumber: 'BATCH-2023-002',
    expiryDate: '2024-12-31'
  }
];

// ==================== SERVICES ====================
class InventoryService {
  static async recordEdit(editLog: MaterialEditLog): Promise<void> {
    // In a real app, this would call your backend API
    return new Promise(resolve => setTimeout(resolve, 300));
  }

  static async getEditHistory(materialId: string): Promise<MaterialEditLog[]> {
    // Mock implementation
    return new Promise(resolve => setTimeout(() => resolve([]), 300));
  }
}

class BlockchainService {
  static async recordTransaction(
    materialId: string,
    action: string,
    participants: string[],
    quantity?: number
  ): Promise<string> {
    // Mock implementation - returns a fake transaction hash
    return new Promise(resolve => 
      setTimeout(() => resolve(`0x${Math.random().toString(16).substring(2, 18)}`), 500)
    );
  }
}

// ==================== MAIN COMPONENT ====================
const FinishedMaterialInventory: React.FC = () => {
  // State
  const [suppliers] = useState<Supplier[]>(initialSuppliers);
  const [materials, setMaterials] = useState<FinishedMaterial[]>(initialMaterials);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{
    currentStock: number;
    reserved: number;
  }>({ currentStock: 0, reserved: 0 });
  const [editLogs, setEditLogs] = useState<MaterialEditLog[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<FinishedMaterial | null>(null);
  const [showMaterialDialog, setShowMaterialDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter materials based on search
  const filteredMaterials = materials.filter(material =>
    material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.batchNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle edit changes
  const handleEditChange = (field: 'currentStock' | 'reserved', value: string) => {
    const numValue = parseInt(value) || 0;
    setEditValues(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  // Validate edit
  const validateEdit = (material: FinishedMaterial) => {
    return editValues.reserved <= editValues.currentStock;
  };

  // Save edit
  const saveEdit = async (materialId: string) => {
    const material = materials.find(m => m.id === materialId);
    if (!material) return;

    if (!validateEdit(material)) {
      alert('Reserved quantity cannot exceed current stock');
      return;
    }

    try {
      // Record blockchain transaction
      const txHash = await BlockchainService.recordTransaction(
        materialId,
        'manual_adjustment',
        ['System Admin'],
        editValues.currentStock - material.currentStock
      );

      // Create edit log
      const changes = [];
      if (material.currentStock !== editValues.currentStock) {
        changes.push({
          field: 'currentStock',
          oldValue: material.currentStock,
          newValue: editValues.currentStock
        });
      }
      if (material.reserved !== editValues.reserved) {
        changes.push({
          field: 'reserved',
          oldValue: material.reserved,
          newValue: editValues.reserved
        });
      }

      const newLog: MaterialEditLog = {
        id: `log-${Date.now()}`,
        materialId,
        changes,
        editedBy: 'Current User',
        timestamp: new Date().toISOString(),
        blockchainTx: txHash
      };

      // Save edit log
      await InventoryService.recordEdit(newLog);

      // Update state
      setMaterials(materials.map(m => 
        m.id === materialId ? { 
          ...m, 
          currentStock: editValues.currentStock,
          reserved: editValues.reserved,
          lastUpdate: new Date().toISOString()
        } : m
      ));
      setEditLogs([newLog, ...editLogs]);
      setEditingId(null);
    } catch (error) {
      console.error('Failed to save edit:', error);
      alert('Failed to save changes. Please try again.');
    }
  };

  // Load edit history when material is selected
  useEffect(() => {
    if (selectedMaterial) {
      const loadEditHistory = async () => {
        const logs = await InventoryService.getEditHistory(selectedMaterial.id);
        setEditLogs(logs);
      };
      loadEditHistory();
    }
  }, [selectedMaterial]);

  // Delete material
  const confirmDelete = async () => {
    if (!materialToDelete) return;
    
    try {
      // In a real app, you would call an API to delete
      setMaterials(materials.filter(m => m.id !== materialToDelete));
      setMaterialToDelete(null);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Failed to delete material:', error);
      alert('Failed to delete material. Please try again.');
    }
  };

  // ==================== UI COMPONENTS ====================

  // Dashboard Cards
  const renderDashboardCards = () => {
    const criticalCount = materials.filter(m => 
      (m.currentStock - m.reserved) <= m.safetyStock
    ).length;
    
    const reorderCount = materials.filter(m => 
      (m.currentStock - m.reserved) <= m.reorderLevel
    ).length;
    
    const connectedSensors = materials.filter(m => m.sensorConnected).length;

    return (
      <Grid columns="4" gap="4" mb="4">
        {[
          { 
            icon: <ExclamationTriangleIcon />, 
            label: 'Critical Stock', 
            value: criticalCount,
            color: 'red'
          },
          { 
            icon: <ClockIcon />, 
            label: 'Need Reorder', 
            value: reorderCount,
            color: 'orange'
          },
          { 
            icon: <CubeIcon />, 
            label: 'Total Materials', 
            value: materials.length,
            color: 'blue'
          },
          { 
            icon: <LightningBoltIcon />, 
            label: 'Connected Sensors', 
            value: `${connectedSensors}/${materials.length}`,
            color: 'green'
          }
        ].map((item, index) => (
          <Card key={index} style={{ 
            background: `var(--${item.color}-1)`,
            border: `1px solid var(--${item.color}-3)`
          }}>
            <Flex align="center" gap="3">
              <Box style={{
                background: `var(--${item.color}-3)`,
                padding: '12px',
                borderRadius: '50%',
                color: `var(--${item.color}-11)`
              }}>
                {item.icon}
              </Box>
              <Box>
                <Text as="div" size="2" color="gray">{item.label}</Text>
                <Heading size="5" style={{ color: `var(--${item.color}-11)` }}>
                  {item.value}
                </Heading>
              </Box>
            </Flex>
          </Card>
        ))}
      </Grid>
    );
  };

  // Materials Table
  const renderMaterialsTable = () => (
    <Table.Root variant="surface" style={{ borderRadius: 8 }}>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Material</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Current Stock</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Reserved</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Available</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {filteredMaterials.map(material => {
          const available = material.currentStock - material.reserved;
          const status = available <= material.safetyStock ? 'critical' : 
                        available <= material.reorderLevel ? 'reorder' : 'ok';

          return (
            <React.Fragment key={material.id}>
              <Table.Row>
                <Table.Cell>
                  <Flex direction="column">
                    <Text weight="bold">{material.name}</Text>
                    <Flex gap="2" mt="1">
                      <Badge variant="soft">{material.batchNumber}</Badge>
                      {material.expiryDate && (
                        <Badge 
                          color={getExpiryStatusColor(material.expiryDate)}
                          variant="soft"
                        >
                          Exp: {material.expiryDate}
                        </Badge>
                      )}
                    </Flex>
                  </Flex>
                </Table.Cell>
                
                {/* Current Stock */}
                <Table.Cell>
                  {editingId === material.id ? (
                    <TextField.Root>
                      <input
                        type="number"
                        value={editValues.currentStock}
                        onChange={(e) => handleEditChange('currentStock', e.target.value)}
                        className="rt-TextFieldInput"
                        min={0}
                      />
                    </TextField.Root>
                  ) : (
                    <Text 
                      onClick={() => {
                        setEditingId(material.id);
                        setEditValues({
                          currentStock: material.currentStock,
                          reserved: material.reserved
                        });
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      {material.currentStock} {material.unit}
                    </Text>
                  )}
                </Table.Cell>
                
                {/* Reserved */}
                <Table.Cell>
                  {editingId === material.id ? (
                    <TextField.Root>
                      <input
                        type="number"
                        value={editValues.reserved}
                        onChange={(e) => handleEditChange('reserved', e.target.value)}
                        className="rt-TextFieldInput"
                        min={0}
                        max={editValues.currentStock}
                      />
                    </TextField.Root>
                  ) : (
                    <Text 
                      onClick={() => {
                        setEditingId(material.id);
                        setEditValues({
                          currentStock: material.currentStock,
                          reserved: material.reserved
                        });
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      {material.reserved} {material.unit}
                    </Text>
                  )}
                </Table.Cell>
                
                {/* Available */}
                <Table.Cell>
                  <Text weight="bold">
                    {editingId === material.id 
                      ? editValues.currentStock - editValues.reserved
                      : available} {material.unit}
                  </Text>
                </Table.Cell>
                
                {/* Status */}
                <Table.Cell>
                  <Flex gap="2" align="center">
                    <Badge color={
                      status === 'critical' ? 'red' : 
                      status === 'reorder' ? 'orange' : 'green'
                    }>
                      {status.toUpperCase()}
                    </Badge>
                    {material.sensorConnected && (
                      <Badge color="green" variant="outline">
                        <Link2Icon /> IoT
                      </Badge>
                    )}
                  </Flex>
                </Table.Cell>
                
                {/* Actions */}
                <Table.Cell>
                  <Flex gap="2">
                    {editingId === material.id ? (
                      <>
                        <Button size="1" onClick={() => saveEdit(material.id)}>
                          <CheckIcon /> Save
                        </Button>
                        <Button 
                          size="1" 
                          variant="soft" 
                          color="gray" 
                          onClick={() => setEditingId(null)}
                        >
                          <Cross1Icon /> Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button 
                          size="1" 
                          variant="soft"
                          onClick={() => {
                            setSelectedMaterial(material);
                            setShowMaterialDialog(true);
                          }}
                        >
                          Details
                        </Button>
                        <Button 
                          size="1" 
                          variant="soft"
                          onClick={() => {
                            setEditingId(material.id);
                            setEditValues({
                              currentStock: material.currentStock,
                              reserved: material.reserved
                            });
                          }}
                        >
                          <Pencil1Icon /> Edit
                        </Button>
                        <Button 
                          size="1" 
                          variant="soft" 
                          color="red"
                          onClick={() => {
                            setMaterialToDelete(material.id);
                            setShowDeleteConfirm(true);
                          }}
                        >
                          <TrashIcon />
                        </Button>
                      </>
                    )}
                  </Flex>
                </Table.Cell>
              </Table.Row>
              
              {editingId === material.id && (
                <Table.Row style={{ background: 'var(--green-1)' }}>
                  <Table.Cell colSpan={6}>
                    <Flex align="center" gap="3" justify="center">
                      <Text color="green">
                        <Flex align="center" gap="1">
                          <UpdateIcon />
                          Editing this material
                        </Flex>
                      </Text>
                      <Text size="1" color="gray">
                        Available after edit: {editValues.currentStock - editValues.reserved} {material.unit}
                      </Text>
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              )}
            </React.Fragment>
          );
        })}
      </Table.Body>
    </Table.Root>
  );

  // Material Details Dialog
  const renderMaterialDialog = () => (
    <Dialog.Root open={showMaterialDialog} onOpenChange={setShowMaterialDialog}>
      <Dialog.Content style={{ maxWidth: 800 }}>
        <Dialog.Title>
          <Flex align="center" gap="2">
            <CubeIcon /> {selectedMaterial?.name} Details
          </Flex>
        </Dialog.Title>
        
        <Grid columns="2" gap="3" mt="3">
          <Box>
            <Text as="div" size="2" color="gray" mb="1">Batch Number</Text>
            <Text>{selectedMaterial?.batchNumber}</Text>
          </Box>
          <Box>
            <Text as="div" size="2" color="gray" mb="1">Expiry Date</Text>
            <Badge color={getExpiryStatusColor(selectedMaterial?.expiryDate)}>
              {selectedMaterial?.expiryDate || 'N/A'}
            </Badge>
          </Box>
          <Box>
            <Text as="div" size="2" color="gray" mb="1">Current Stock</Text>
            <Text>{selectedMaterial?.currentStock} {selectedMaterial?.unit}</Text>
          </Box>
          <Box>
            <Text as="div" size="2" color="gray" mb="1">Reserved</Text>
            <Text>{selectedMaterial?.reserved} {selectedMaterial?.unit}</Text>
          </Box>
          <Box>
            <Text as="div" size="2" color="gray" mb="1">Available</Text>
            <Text weight="bold">
              {(selectedMaterial?.currentStock || 0) - (selectedMaterial?.reserved || 0)} {selectedMaterial?.unit}
            </Text>
          </Box>
          <Box>
            <Text as="div" size="2" color="gray" mb="1">Supplier</Text>
            <Text>
              {suppliers.find(s => s.id === selectedMaterial?.supplierId)?.name || 'Unknown'}
            </Text>
          </Box>
        </Grid>
        
        {/* Edit History */}
        <Card mt="4">
          <Heading size="4" mb="3">Edit History</Heading>
          {editLogs.length > 0 ? (
            <ScrollArea style={{ maxHeight: 300 }}>
              <Table.Root>
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Changes</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Verified</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {editLogs.map(log => (
                    <Table.Row key={log.id}>
                      <Table.Cell>
                        {new Date(log.timestamp).toLocaleString()}
                      </Table.Cell>
                      <Table.Cell>
                        <Flex direction="column" gap="1">
                          {log.changes.map((change, i) => (
                            <Text key={i} size="2">
                              {change.field}: {change.oldValue} → {change.newValue}
                            </Text>
                          ))}
                        </Flex>
                      </Table.Cell>
                      <Table.Cell>
                        {log.blockchainTx ? (
                          <Badge color="green">
                            <TokensIcon /> Verified
                          </Badge>
                        ) : (
                          <Badge color="gray">Pending</Badge>
                        )}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </ScrollArea>
          ) : (
            <Text color="gray" style={{ fontStyle: 'italic' }}>
              No edit history available
            </Text>
          )}
        </Card>
        
        <Flex gap="3" mt="4" justify="end">
          <Button variant="soft" color="gray" onClick={() => setShowMaterialDialog(false)}>
            Close
          </Button>
          <Button onClick={() => {
            if (selectedMaterial) {
              setEditingId(selectedMaterial.id);
              setEditValues({
                currentStock: selectedMaterial.currentStock,
                reserved: selectedMaterial.reserved
              });
              setShowMaterialDialog(false);
            }
          }}>
            <Pencil1Icon /> Edit Material
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );

  // Delete Confirmation Dialog
  const renderDeleteDialog = () => (
    <AlertDialog.Root open={showDeleteConfirm}>
      <AlertDialog.Content style={{ maxWidth: 450 }}>
        <AlertDialog.Title>Confirm Deletion</AlertDialog.Title>
        <AlertDialog.Description size="2">
          Are you sure you want to delete this material? This action cannot be undone.
        </AlertDialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button variant="solid" color="red" onClick={confirmDelete}>
              Delete
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );

  // Helper function for expiry status color
  const getExpiryStatusColor = (expiryDate?: string) => {
    if (!expiryDate) return 'gray';
    
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'red'; // Expired
    if (diffDays < 30) return 'orange'; // Expiring soon
    if (diffDays < 90) return 'yellow'; // Near expiry
    return 'green'; // Good
  };

  return (
    <Container size="3" px="4" py="6">
      {/* Header */}
      <Flex justify="between" align="center" mb="4">
        <Heading size="7">Finished Material Inventory</Heading>
        <Flex gap="2">
          <Button variant="solid">
            <PlusIcon /> Add Material
          </Button>
          <Button variant="soft">
            <DownloadIcon /> Export
          </Button>
        </Flex>
      </Flex>
      
      {/* Search Bar */}
      <Box mb="4">
        <TextField.Root>
          <TextField.Slot>
            <MagnifyingGlassIcon />
          </TextField.Slot>
          <TextField.Input 
            placeholder="Search materials by name or batch number..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </TextField.Root>
      </Box>
      
      {/* Dashboard Cards */}
      {renderDashboardCards()}
      
      {/* Main Materials Table */}
      <Card>
        <Flex justify="between" align="center" mb="3">
          <Heading size="5">Materials Inventory</Heading>
          <Text color="gray">
            Showing {filteredMaterials.length} of {materials.length} materials
          </Text>
        </Flex>
        {renderMaterialsTable()}
      </Card>
      
      {/* Dialogs */}
      {renderMaterialDialog()}
      {renderDeleteDialog()}
    </Container>
  );
};

export default FinishedMaterialInventory;
