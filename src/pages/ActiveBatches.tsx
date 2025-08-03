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
  Select
} from '@radix-ui/themes';
import {
  MixerHorizontalIcon,
  PauseIcon,
  CrossCircledIcon,
  PlusIcon
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

type BatchStage = typeof STAGE_OPTIONS[number];
type ProductType = typeof PRODUCT_OPTIONS[number];

interface Batch {
  id: string;
  product: ProductType;
  stage: BatchStage;
  temp: number;
  status: 'status.onTrack' | 'status.delayed';
  progress: number;
}

interface FormData {
  productName: string;
  batchSize: string;
  selectedProduct: ProductType | '';
}

const INITIAL_FORM_DATA: FormData = {
  productName: '',
  batchSize: '',
  selectedProduct: '',
};

const TEMP_CHART_DATA = [
  { temp: 2 },
  { temp: 2.5 },
  { temp: 3 }
];

const ActiveBatches: React.FC = () => {
  const { t } = useTranslation('active-batches');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [batches, setBatches] = useState<Batch[]>([
    { 
      id: 'VC23001', 
      product: 'Poultry Drug 1',
      stage: 'Mixing',
      temp: 2.5,
      status: 'status.onTrack',
      progress: 65
    },
    { 
      id: 'VC23002', 
      product: 'Poultry Drug 1',
      stage: 'Mixing',
      temp: 2.5,
      status: 'status.onTrack',
      progress: 65
    },
  ]);

  const handleFormChange = useCallback((field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
  }, []);

  const validateForm = useCallback(() => {
    return formData.productName.trim() && 
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

  return (
    <Box p="6" className="flex-1">
      <Flex justify="between" align="center" mb="5">
        <Heading size="6">{t('activeBatches.heading')}</Heading>
        
        <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <Dialog.Trigger>
            <Button variant="soft">
              <MixerHorizontalIcon /> {t('buttons.newBatch')}
            </Button>
          </Dialog.Trigger>

          <Dialog.Content style={{ maxWidth: 500 }}>
            <Dialog.Title>{t('dialog.createBatchTitle')}</Dialog.Title>
            
            <Flex direction="column" gap="4" mt="4">
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

              <TextField.Root
                value={formData.productName}
                onChange={(e) => handleFormChange('productName', e.target.value)}
                placeholder={t('form.batchIdentifier')}
              />

              <TextField.Root
                type="number"
                value={formData.batchSize}
                onChange={(e) => handleFormChange('batchSize', e.target.value)}
                placeholder={t('form.batchSize')}
              />

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

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>{t('table.headers.batchId')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('table.headers.product')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('table.headers.stage')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('table.headers.temperature')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('table.headers.status')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('table.headers.progress')}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t('table.headers.actions')}</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {batches.map((batch) => (
            <Table.Row key={batch.id}>
              <Table.Cell>{batch.id}</Table.Cell>
              
              <Table.Cell>
                <Select.Root
                  value={batch.product}
                  onValueChange={(value) => handleProductChange(batch.id, value as ProductType)}
                >
                  <Select.Trigger />
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
                  <Select.Trigger />
                  <Select.Content>
                    {STAGE_OPTIONS.map(stage => (
                      <Select.Item key={stage} value={stage}>{stage}</Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </Table.Cell>

              <Table.Cell>
                <div style={{ width: 100, height: 40 }}>
                  {memoizedTempChart}
                </div>
              </Table.Cell>

              <Table.Cell>
                <Badge 
                  color={batch.status === 'status.onTrack' ? 'green' : 'red'}
                  variant="soft"
                >
                  {t(batch.status)}
                </Badge>
              </Table.Cell>

              <Table.Cell>
                <Flex align="center" gap="2">
                  <Progress value={batch.progress} />
                  <Text size="2">{batch.progress}%</Text>
                </Flex>
              </Table.Cell>

              <Table.Cell>
                <Flex gap="2">
                  <IconButton variant="ghost" color="red" aria-label={t('buttons.cancelBatch')}>
                    <CrossCircledIcon />
                  </IconButton>
                  <IconButton variant="ghost" aria-label={t('buttons.pauseBatch')}>
                    <PauseIcon />
                  </IconButton>
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
