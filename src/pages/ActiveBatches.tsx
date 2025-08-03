import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
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

// Constants
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
  'Poultry Drug 1',
  'Poultry Drug 2',
  'Poultry Drug 3',
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
  const { t } = useTranslation('active-batches');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [batches, setBatches] = useState<Batch[]>([
    { 
      id: 'VC23001', 
      product: 'Poultry Drug 1',
      stage: 'Mixing',
      temp: 2.5,
      status: 'status.onTrack',
      progress: 65,
      priority: 'normal'
    },
    { 
      id: 'VC23002', 
      product: 'Poultry Drug 2',
      stage: 'Compression',
      temp: 3.2,
      status: 'status.onTrack',
      progress: 35,
      priority: 'high'
    },
  ]);

  const filteredBatches = useMemo(() => {
    return batches.filter(batch =>
      batch.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.product.toLowerCase().includes(searchQuery.toLowerCase())
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
      toast.error(t('errors.fillAllFields'));
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
    toast.success(t('success.batchCreated'));
  }, [formData, t, validateForm, resetForm]);

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
      <Flex justify="between" align="center" mb="5" className="gap-4">
        <Heading size="6">{t('activeBatches.heading')}</Heading>
        
        <Flex gap="3" className="w-full max-w-md">
          <TextField.Root
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          >
            <TextField.Slot>
              <MagnifyingGlassIcon />
            </TextField.Slot>
          </TextField.Root>
          
          <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <Dialog.Trigger>
              <Button variant="soft" className="whitespace-nowrap">
                <MixerHorizontalIcon /> {t('buttons.newBatch')}
              </Button>
            </Dialog.Trigger>

            <Dialog.Content style={{ maxWidth: 500 }}>
              <Dialog.Title>{t('dialog.createBatchTitle')}</Dialog.Title>
              
              <Flex direction="column" gap="4" mt="4">
                <TextField.Root
                  label={t('form.batchIdentifier')}
                  value={formData.batchName}
                  onChange={(e) => handleFormChange('batchName', e.target.value)}
                  placeholder="VC-2023-001"
                />

                <Select.Root 
                  value={formData.selectedProduct}
                  onValueChange={(value) => handleFormChange('selectedProduct', value)}
                >
                  <Select.Trigger placeholder={t('form.selectProduct')} />
                  <Select.Content>
                    {PRODUCT_OPTIONS.map(prod => (
                      <Select.Item key={prod} value={prod}>{prod}</Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>

                <div className="grid grid-cols-2 gap-4">
                  <TextField.Root
                    label={t('form.batchSize')}
                    type="number"
                    value={formData.batchSize}
                    onChange={(e) => handleFormChange('batchSize', e.target.value)}
                  />
                  <Select.Root 
                    value={formData.priority}
                    onValueChange={(value) => handleFormChange('priority', value)}
                  >
                    <Select.Trigger />
                    <Select.Content>
                      {PRIORITY_OPTIONS.map(option => (
                        <Select.Item key={option.value} value={option.value}>
                          {t(`priority.${option.value}`)}
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
                    {t('buttons.cancel')}
                  </Button>
                  <Button onClick={handleNewBatch}>
                    <PlusIcon className="mr-2" /> {t('buttons.createBatch')}
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
            <Table.ColumnHeaderCell className="font-semibold">
              {t('table.headers.batchId')}
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="font-semibold">
              {t('table.headers.product')}
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="font-semibold">
              {t('table.headers.stage')}
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="font-semibold">
              {t('table.headers.temperature')}
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="font-semibold">
              {t('table.headers.status')}
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="font-semibold">
              {t('table.headers.progress')}
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="font-semibold">
              {t('table.headers.actions')}
            </Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body className="divide-y divide-gray-200">
          {filteredBatches.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={7} className="py-12 text-center">
                <div className="flex flex-col items-center gap-3">
                  <CubeIcon className="w-8 h-8 text-gray-400" />
                  <Text color="gray">{t('noBatchesMessage')}</Text>
                  <Button onClick={() => setIsDialogOpen(true)}>
                    <PlusIcon /> {t('createFirstBatch')}
                  </Button>
                </div>
              </Table.Cell>
            </Table.Row>
          ) : (
            filteredBatches.map((batch, index) => (
              <Table.Row 
                key={batch.id} 
                className="hover:bg-gray-50 transition-colors animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
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
                  <div className="flex flex-wrap gap-2">
                    {STAGE_OPTIONS.map((stage) => (
                      <button
                        key={stage}
                        onClick={() => handleStageChange(batch.id, stage)}
                        className={`px-3 py-1 text-sm rounded-full border ${
                          batch.stage === stage
                            ? 'bg-blue-50 border-blue-500 text-blue-700'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {stage}
                      </button>
                    ))}
                  </div>
                </Table.Cell>

                <Table.Cell>
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
                </Table.Cell>

                <Table.Cell>
                  <Badge 
                    color={
                      batch.status === 'status.onTrack' 
                        ? 'green' 
                        : batch.progress < 30 
                        ? 'red' 
                        : 'amber'
                    }
                    variant="soft"
                    className="capitalize"
                  >
                    {t(batch.status)}
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
                    <Tooltip content={t('cancelBatch')}>
                      <IconButton variant="soft" color="red" size="2">
                        <CrossCircledIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip content={t('pauseBatch')}>
                      <IconButton variant="soft" color="amber" size="2">
                        <PauseIcon />
                      </IconButton>
                    </Tooltip>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

export default ActiveBatches;
