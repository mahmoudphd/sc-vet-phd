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
import { useState } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

const ActiveBatches = () => {
  const { t } = useTranslation('active-batches');
  const [open, setOpen] = useState(false);
  const [productName, setProductName] = useState('');
  const [batchSize, setBatchSize] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');

  const batches = [
    { 
      id: 'VC23001', 
      product: 'products.anthelminticOralSuspension',
      stage: 'stages.mixing',
      temp: 2.5,
      status: 'status.onTrack',
      progress: 65
    },
    { 
      id: 'VC23002', 
      product: 'products.anthelminticOralSuspension',
      stage: 'stages.mixing',
      temp: 2.5,
      status: 'status.onTrack',
      progress: 65
    },
  ];

  const handleNewBatch = () => {
    if (!productName || !batchSize || !selectedProduct) {
      toast.error(t('errors.fillAllFields'));
      return;
    }

    // Add your batch creation logic here
    setOpen(false);
    toast.success(t('success.batchCreated'));
  };

  return (
    <Box p="6" className="flex-1">
      <Flex justify="between" align="center" mb="5">
        <Heading size="6">{t('activeBatches.heading')}</Heading>
        
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger>
            <Button variant="soft">
              <MixerHorizontalIcon /> {t('buttons.newBatch')}
            </Button>
          </Dialog.Trigger>

          <Dialog.Content style={{ maxWidth: 500 }}>
            <Dialog.Title>{t('dialog.createBatchTitle')}</Dialog.Title>
            
            <Flex direction="column" gap="4" mt="4">
              <Select.Root 
                value={selectedProduct}
                onValueChange={setSelectedProduct}
              >
                <Select.Trigger placeholder={t('form.selectProduct')} />
                <Select.Content>
                  <Select.Item value="oral">
                    {t('products.oral')}
                  </Select.Item>
                  <Select.Item value="injectable">
                    {t('products.injectable')}
                  </Select.Item>
                  <Select.Item value="tablet">
                    {t('products.tablet')}
                  </Select.Item>
                </Select.Content>
              </Select.Root>

              <TextField.Root
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder={t('form.batchIdentifier')}
              />

              <TextField.Root
                type="number"
                value={batchSize}
                onChange={(e) => setBatchSize(e.target.value)}
                placeholder={t('form.batchSize')}
              />

              <Flex gap="3" justify="end" mt="4">
                <Button 
                  variant="soft" 
                  color="gray"
                  onClick={() => setOpen(false)}
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
              <Table.Cell>{t(batch.product)}</Table.Cell>
              <Table.Cell>{t(batch.stage)}</Table.Cell>
              <Table.Cell>
                <div className="w-24 h-12">
                  <LineChart width={100} height={40} data={[
                    { temp: 2 }, { temp: 2.5 }, { temp: 3 }
                  ]}>
                    <Line 
                      type="monotone" 
                      dataKey="temp" 
                      stroke={batch.temp > 5 ? "#ef4444" : "#3b82f6"} 
                      dot={false}
                    />
                    <ReferenceLine y={2} stroke="#10b981" strokeDasharray="3 3" />
                  </LineChart>
                </div>
              </Table.Cell>
              <Table.Cell>
                <Badge 
                  color={
                    batch.status === 'status.onTrack' ? 'green' :
                    batch.status === 'status.delayed' ? 'red' : 'amber'
                  }
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
                  <IconButton variant="ghost" color="red">
                    <CrossCircledIcon />
                  </IconButton>
                  <IconButton variant="ghost">
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

/*

  On-Track
  Pending

  Stages    
    - QC Testing
    - Packaging
    - Labeling
    - storage

*/