import React, { useState, useCallback, useMemo } from 'react';
import {
  Table,
  Badge,
  Button,
  Flex,
  Heading,
  Text,
  Progress,
  IconButton,
  Box,
  Dialog,
  TextField,
  Select,
  Tooltip
} from '@radix-ui/themes';
import {
  MixerHorizontalIcon,
  PauseIcon,
  CrossCircledIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  CubeIcon
} from '@radix-ui/react-icons';
import { LineChart, Line, ReferenceLine } from 'recharts';

const STAGE_OPTIONS = [
  'Weighting',
  'Mixing',
  'Granulation',
  'Compression',
  'Coating',
  'Liquid Filling',
  'Powder Filling',
  'Sterilization',
  'Quality Control',
  'Packaging'
] as const;

const PRODUCT_OPTIONS = [
  'A',
  'B',
  'C',
] as const;

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'High' }
] as const;

type BatchStage = typeof STAGE_OPTIONS[number];
type ProductType = typeof PRODUCT_OPTIONS[number];
type PriorityType = typeof PRIORITY_OPTIONS[number]['value'];

interface Batch {
  id: string;
  product: ProductType;
  stage: BatchStage;
  temp: number;
  status: 'status.onTrack' | 'status.delayed';
  progress: number;
  priority: PriorityType;
}

interface FormData {
  batchName: string;
  batchSize: string;
  selectedProduct: ProductType | '';
  priority: PriorityType;
}

const INITIAL_FORM_DATA: FormData = {
  batchName: '',
  batchSize: '',
  selectedProduct: '',
  priority: 'normal'
};

const TEMP_CHART_DATA = [
  { temp: 2 },
  { temp: 2.5 },
  { temp: 3 }
];

const ActiveBatches: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [batches, setBatches] = useState<Batch[]>([
    { 
      id: 'VC23001', 
      product: 'A',
      stage: 'Mixing',
      temp: 2.5,
      status: 'status.onTrack',
      progress: 65,
      priority: 'normal'
    },
    { 
      id: 'VC23002', 
      product: 'B',
      stage: 'Compression',
      temp: 3.2,
      status: 'status.onTrack',
      progress: 35,
      priority: 'high'
    },
  ]);

  const filteredBatches = useMemo(() => {
    return batches.filter(batch =>
      batch.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [batches, searchQuery]);

  const handleFormChange = useCallback((field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
  }, []);

  const validateForm = useCallback(() => {
    return formData.batchName.trim() && 
           formData.batchSize.trim() && 
           formData.selectedProduct;
  }, [formData]);

  const handleNewBatch = useCallback(() => {
    if (!validateForm()) {
      alert('Please fill all fields');
      return;
    }

    const newBatch: Batch = {
      id: `VC${Math.floor(Math.random() * 90000) + 10000}`,
      product: formData.selectedProduct as ProductType,
      stage: STAGE_OPTIONS[0],
      temp: 0,
      status: 'status.onTrack',
      progress: 0,
      priority: formData.priority
    };

    setBatches(prev => [...prev, newBatch]);
    resetForm();
    setIsDialogOpen(false);
    alert('Batch created successfully');
  }, [formData, validateForm, resetForm]);

  const handleProductChange = useCallback((batchId: string, newProduct: ProductType) => {
    setBatches(prev => prev.map(batch => 
      batch.id === batchId ? { ...batch, product: newProduct } : batch
    ));
  }, []);

  const handleStageChange = useCallback((batchId: string, newStage: BatchStage) => {
    setBatches(prev => prev.map(batch => 
      batch.id === batchId ? { ...batch, stage: newStage } : batch
    ));
  }, []);

  const handleSubmitToBlockchain = useCallback(() => {
    alert('Data submitted to blockchain successfully');
  }, []);

  const memoizedTempChart = useMemo(() => (
    <LineChart width={100} height={40} data={TEMP_CHART_DATA}>
      <Line 
        type="monotone" 
        dataKey="temp" 
        stroke="#3b82f6" 
        dot={false}
      />
      <ReferenceLine y={2} stroke="#10b981" strokeDasharray="3 3" />
    </LineChart>
  ), []);

  const getPriorityColor = (priority: PriorityType) => {
    switch (priority) {
      case 'high': return 'red';
      case 'normal': return 'blue';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  return (
    <Box p="6" className="flex-1">
      <Flex justify="between" align="center" mb="5" gap="4">
        <Heading size="6">Active Batches</Heading>
        
        <Flex gap="3" align="center">
          <TextField.Root
            placeholder="Search batches..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-48"
          >
            <TextField.Slot>
              <MagnifyingGlassIcon />
            </TextField.Slot>
          </TextField.Root>
          
          <Button 
            onClick={handleSubmitToBlockchain}
            variant="solid" 
            color="green"
            className="bg-green-700 hover:bg-green-800 transition-colors"
          >
            <CubeIcon className="mr-2" />
            Submit to Blockchain
          </Button>
          
          <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <Dialog.Trigger>
              <Button variant="soft" className="whitespace-nowrap">
                <MixerHorizontalIcon /> New Batch
              </Button>
            </Dialog.Trigger>

            <Dialog.Content style={{ maxWidth: 500 }}>
              <Dialog.Title>Create New Batch</Dialog.Title>
              <Dialog.Description mb="4">
                Fill in the details for the new production batch
              </Dialog.Description>
              
              <Flex direction="column" gap="4">
                <Flex direction="column" gap="2">
                  <Text as="label" size="2" weight="bold">
                    Batch Identifier
                  </Text>
                  <TextField.Root
                    value={formData.batchName}
                    onChange={(e) => handleFormChange('batchName', e.target.value)}
                    placeholder="VC-2023-001"
                  />
                </Flex>

                <Select.Root 
                  value={formData.selectedProduct}
                  onValueChange={(value) => handleFormChange('selectedProduct', value)}
                >
                  <Select.Trigger placeholder="Select product" />
                  <Select.Content>
                    {PRODUCT_OPTIONS.map(prod => (
                      <Select.Item key={prod} value={prod}>{prod}</Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>

                <div className="grid grid-cols-2 gap-4">
                  <Flex direction="column" gap="2">
                    <Text as="label" size="2" weight="bold">
                      Batch Size
                    </Text>
                    <TextField.Root
                      type="number"
                      value={formData.batchSize}
                      onChange={(e) => handleFormChange('batchSize', e.target.value)}
                    />
                  </Flex>
                  <Select.Root 
                    value={formData.priority}
                    onValueChange={(value) => handleFormChange('priority', value)}
                  >
                    <Select.Trigger placeholder="Priority" />
                    <Select.Content>
                      {PRIORITY_OPTIONS.map(option => (
                        <Select.Item key={option.value} value={option.value}>
                          {option.label}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </div>

                <Flex gap="3" justify="end" mt="4">
                  <Button 
                    variant="soft" 
                    color="gray"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleNewBatch}>
                    <PlusIcon className="mr-2" /> Create Batch
                  </Button>
                </Flex>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>
        </Flex>
      </Flex>

      <Table.Root variant="surface" className="rounded-lg shadow-sm">
        <Table.Header className="bg-gray-50">
          <Table.Row>
            <Table.ColumnHeaderCell>Batch ID</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Product</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Stage</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>
              <Flex direction="column">
                <span>Temperature</span>
                <span className="text-xs text-gray-500">Via IoT</span>
              </Flex>
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Progress</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body className="divide-y divide-gray-200">
          {filteredBatches.map((batch) => (
            <Table.Row key={batch.id} className="hover:bg-gray-50">
              <Table.Cell className="font-medium">
                <Badge color={getPriorityColor(batch.priority)} variant="soft">
                  {batch.id}
                </Badge>
              </Table.Cell>
              
              <Table.Cell>
                <Select.Root
                  value={batch.product}
                  onValueChange={(value) => handleProductChange(batch.id, value as ProductType)}
                >
                  <Select.Trigger variant="soft" />
                  <Select.Content>
                    {PRODUCT_OPTIONS.map(prod => (
                      <Select.Item key={prod} value={prod}>{prod}</Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </Table.Cell>

              <Table.Cell>
                <Select.Root
                  value={batch.stage}
                  onValueChange={(value) => handleStageChange(batch.id, value as BatchStage)}
                >
                  <Select.Trigger variant="soft" />
                  <Select.Content>
                    {STAGE_OPTIONS.map(stage => (
                      <Select.Item key={stage} value={stage}>{stage}</Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </Table.Cell>

              <Table.Cell>
                <Flex direction="column" gap="1">
                  <div className="flex items-center gap-2">
                    <div style={{ width: 100, height: 40 }}>
                      {memoizedTempChart}
                    </div>
                    <span className={`text-sm font-medium ${
                      batch.temp > 5 ? 'text-red-600' : 'text-blue-600'
                    }`}>
                      {batch.temp}°C
                    </span>
                  </div>
                  <Text size="1" color="gray">Via IoT</Text>
                </Flex>
              </Table.Cell>

              <Table.Cell>
                <Badge 
                  color={batch.status === 'status.onTrack' ? 'green' : 'red'}
                  variant="soft"
                >
                  {batch.status === 'status.onTrack' ? 'On Track' : 'Delayed'}
                </Badge>
              </Table.Cell>

              <Table.Cell>
                <Flex align="center" gap="2">
                  <Progress 
                    value={batch.progress} 
                    className="h-2"
                    style={{
                      backgroundColor: batch.progress > 80 
                        ? '#10B981' 
                        : batch.progress > 50 
                        ? '#3B82F6' 
                        : '#F59E0B'
                    }}
                  />
                  <Text size="2" weight="medium">{batch.progress}%</Text>
                </Flex>
              </Table.Cell>

              <Table.Cell>
                <Flex gap="2">
                  <Tooltip content="Cancel batch">
                    <IconButton variant="soft" color="red" size="2">
                      <CrossCircledIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip content="Pause batch">
                    <IconButton variant="soft" color="amber" size="2">
                      <PauseIcon />
                    </IconButton>
                  </Tooltip>
                </Flex>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

export default ActiveBatches;
