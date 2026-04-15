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
  'Poultry Drug A',
  'Poultry Drug B',
  'Poultry Drug C',
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
  status: 'onTrack' | 'delayed';
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
  const [batchCounter, setBatchCounter] = useState(3); // Starting from 3 as we have initial batches
  const [batches, setBatches] = useState<Batch[]>([
    { 
      id: 'BR-001', 
      product: 'Poultry Drug A',
      stage: 'Mixing',
      temp: 2.5,
      status: 'onTrack',
      progress: 65,
      priority: 'normal'
    },
    { 
      id: 'BR-002', 
      product: 'Poultry Drug B',
      stage: 'Compression',
      temp: 3.2,
      status: 'onTrack',
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

  const generateBatchId = useCallback(() => {
    const nextId = `BR-${String(batchCounter).padStart(3, '0')}`;
    setBatchCounter(prev => prev + 1);
    return nextId;
  }, [batchCounter]);

  const handleNewBatch = useCallback(() => {
    if (!validateForm()) {
      alert('Please fill all required fields');
      return;
    }

    const newBatch: Batch = {
      id: generateBatchId(),
      product: formData.selectedProduct as ProductType,
      stage: STAGE_OPTIONS[0],
      temp: 0,
      status: 'onTrack',
      progress: 0,
      priority: formData.priority
    };

    setBatches(prev => [...prev, newBatch]);
    resetForm();
    setIsDialogOpen(false);
    alert('Batch created successfully');
  }, [formData, validateForm, resetForm, generateBatchId]);

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
    alert('Batch data submitted to blockchain successfully');
  }, []);

  const getPriorityColor = (priority: PriorityType) => {
    switch (priority) {
      case 'high': return 'red';
      case 'normal': return 'blue';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return '#10B981';
    if (progress >= 50) return '#3B82F6';
    if (progress >= 30) return '#F97316';
    return '#EF4444';
  };

  return (
    <Box p="6" className="flex-1">
      <Flex justify="between" align="center" mb="6" gap="4">
        <div>
          <Heading size="6" className="text-gray-800 font-bold">Active Batches</Heading>
          <Text size="2" className="text-gray-500">Manage current production batches</Text>
        </div>
        
        <Flex gap="3" align="center">
          <TextField.Root
            placeholder="Search batches..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-56"
            variant="soft"
          >
            <TextField.Slot className="text-gray-500">
              <MagnifyingGlassIcon />
            </TextField.Slot>
          </TextField.Root>
          
          <Button 
            onClick={handleSubmitToBlockchain}
            variant="solid" 
            color="green"
            className="bg-green-700 hover:bg-green-800 transition-colors shadow-sm"
          >
            <CubeIcon className="mr-2" />
            Submit to Blockchain
          </Button>
          
          <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <Dialog.Trigger>
              <Button variant="soft" className="whitespace-nowrap shadow-sm">
                <MixerHorizontalIcon className="mr-2" /> New Batch
              </Button>
            </Dialog.Trigger>

            <Dialog.Content style={{ maxWidth: 500 }} className="p-6">
              <Dialog.Title className="text-xl font-bold text-gray-800 mb-2">Create New Batch</Dialog.Title>
              <Dialog.Description className="text-sm text-gray-600 mb-6">
                Fill in the details for the new production batch
              </Dialog.Description>
              
              <Flex direction="column" gap="4" className="mb-6">
                <Flex direction="column" gap="2">
                  <Text as="label" size="2" weight="bold" className="text-gray-700">
                    Batch Identifier
                  </Text>
                  <TextField.Root
                    value={formData.batchName}
                    onChange={(e) => handleFormChange('batchName', e.target.value)}
                    placeholder="Enter batch name"
                    className="w-full"
                  />
                </Flex>

                <Flex direction="column" gap="2">
                  <Text as="label" size="2" weight="bold" className="text-gray-700">
                    Product
                  </Text>
                  <Select.Root 
                    value={formData.selectedProduct}
                    onValueChange={(value) => handleFormChange('selectedProduct', value)}
                  >
                    <Select.Trigger placeholder="Select product" className="w-full" />
                    <Select.Content>
                      {PRODUCT_OPTIONS.map(prod => (
                        <Select.Item key={prod} value={prod}>{prod}</Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </Flex>

                <div className="grid grid-cols-2 gap-4">
                  <Flex direction="column" gap="2">
                    <Text as="label" size="2" weight="bold" className="text-gray-700">
                      Batch Size
                    </Text>
                    <TextField.Root
                      type="number"
                      value={formData.batchSize}
                      onChange={(e) => handleFormChange('batchSize', e.target.value)}
                      placeholder="1000"
                    />
                  </Flex>
                  <Flex direction="column" gap="2">
                    <Text as="label" size="2" weight="bold" className="text-gray-700">
                      Priority
                    </Text>
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
                  </Flex>
                </div>
              </Flex>

              <Flex gap="3" justify="end" className="border-t border-gray-100 pt-4">
                <Button 
                  variant="soft" 
                  color="gray"
                  onClick={() => setIsDialogOpen(false)}
                  className="hover:bg-gray-100"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleNewBatch}
                  className="hover:bg-blue-600 transition-colors"
                >
                  <PlusIcon className="mr-2" /> Create Batch
                </Button>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>
        </Flex>
      </Flex>

      <Table.Root variant="surface" className="rounded-lg shadow-sm border border-gray-200">
        <Table.Header className="bg-gray-50">
          <Table.Row>
            <Table.ColumnHeaderCell className="font-bold text-gray-800">Batch ID</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="font-bold text-gray-800">Product</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="font-bold text-gray-800">Stage</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="font-bold text-gray-800">Temperature</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="font-bold text-gray-800">Status</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="font-bold text-gray-800">Progress</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="font-bold text-gray-800">Actions</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body className="divide-y divide-gray-100">
          {filteredBatches.map((batch) => (
            <Table.Row key={batch.id} className="hover:bg-gray-50/50">
              <Table.Cell>
                <Badge 
                  color="blue" 
                  variant="soft"
                  className="px-2 py-1 rounded-full text-xs font-medium text-blue-700"
                >
                  {batch.id}
                </Badge>
              </Table.Cell>
              
              <Table.Cell>
                <Select.Root
                  value={batch.product}
                  onValueChange={(value) => handleProductChange(batch.id, value as ProductType)}
                >
                  <Select.Trigger variant="soft" className="w-full" />
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
                  <Select.Trigger variant="soft" className="w-full" />
                  <Select.Content>
                    {STAGE_OPTIONS.map(stage => (
                      <Select.Item key={stage} value={stage}>{stage}</Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </Table.Cell>

              <Table.Cell>
                <Flex direction="column" gap="1">
                  <Flex align="center" gap="2">
                    <div className="w-24 h-10">
                      <LineChart width={96} height={40} data={TEMP_CHART_DATA}>
                        <Line 
                          type="monotone" 
                          dataKey="temp" 
                          stroke={batch.temp > 5 ? '#ef4444' : '#3b82f6'} 
                          strokeWidth={2}
                          dot={false}
                        />
                        <ReferenceLine y={2} stroke="#10b981" strokeDasharray="3 3" />
                      </LineChart>
                    </div>
                    <Flex direction="column">
                      <span className={`text-sm font-medium ${batch.temp > 5 ? 'text-red-600' : 'text-blue-600'}`}>
                        {batch.temp}°C
                      </span>
                      <Badge color="gray" variant="soft" radius="full" className="w-fit text-xs">
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                          Via IoT
                        </span>
                      </Badge>
                    </Flex>
                  </Flex>
                </Flex>
              </Table.Cell>

              <Table.Cell>
                <Badge 
                  color={batch.status === 'onTrack' ? 'green' : 'red'}
                  variant="soft"
                  className="px-2 py-1 rounded-full text-xs font-medium"
                >
                  {batch.status === 'onTrack' ? (
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      On Track
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      Delayed
                    </span>
                  )}
                </Badge>
              </Table.Cell>

              <Table.Cell>
                <Flex align="center" gap="2">
                  <Progress 
                    value={batch.progress} 
                    className="h-2.5 rounded-full w-full"
                    style={{
                      backgroundColor: '#e5e7eb',
                      ['--accent-9' as any]: getProgressColor(batch.progress),
                    }}
                  />
                  <Text size="2" weight="medium" className="text-gray-700 min-w-[40px]">
                    {batch.progress}%
                  </Text>
                </Flex>
              </Table.Cell>

              <Table.Cell>
                <Flex gap="2">
                  <Tooltip content="Cancel batch" delayDuration={300}>
                    <IconButton 
                      variant="soft" 
                      color="red" 
                      size="2"
                      className="hover:bg-red-100 transition-colors"
                    >
                      <CrossCircledIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip content="Pause batch" delayDuration={300}>
                    <IconButton 
                      variant="soft" 
                      color="amber" 
                      size="2"
                      className="hover:bg-amber-100 transition-colors"
                    >
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
