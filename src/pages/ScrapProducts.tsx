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
    CrossCircledIcon,
    PlusIcon
} from '@radix-ui/react-icons';
import { useState } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

const ScrapProducts = () => {
    const { t } = useTranslation('scrap-products');
    const [open, setOpen] = useState(false);
    const [scrapReason, setScrapReason] = useState('');
    const [scrapWeight, setScrapWeight] = useState('');
    const [selectedBatch, setSelectedBatch] = useState('');
    const [scrapType, setScrapType] = useState('partial');
    const [removalMethod, setRemovalMethod] = useState('Recycled');

    // Sample scrap products data
    const scrapProducts = [
        {
            id: 'SCP001',
            batchId: 'VC23001',
            reason: 'reason.contamination',
            type: 'type.partial',
            status: 'status.pending',
            recordedWeight: 5.2,
            recordedDate: '2024-02-20',
            removalMethod: 'recycled'
        },
        {
            id: 'SCP002',
            batchId: 'VC23002',
            reason: 'reason.expired',
            type: 'type.full',
            status: 'status.approved',
            recordedWeight: 8.1,
            recordedDate: '2024-02-21',
            removalMethod: 'disposed'
        },
    ];

    const handleNewScrap = () => {
        if (!scrapReason || !scrapWeight || !selectedBatch) {
            toast.error(t('errors.fillAllFields'));
            return;
        }
        
        // Validation for Scrap Weight
        if (isNaN(scrapWeight as any)) {
            toast.error(t('errors.invalidWeight'));
            return;
        }

        // Validation for Removal Method
        if (!removalMethod) {
            toast.error(t('errors.missingRemovalMethod'));
            return;
        }

        // Add your scrap creation logic here
        
        setOpen(false);
        toast.success(t('success.scrapRecorded'));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'status.pending':
                return 'yellow';
            case 'status.approved':
                return 'green';
            case 'status.rejected':
                return 'red';
            default:
                return 'gray';
        }
    };

    return (
        <Box p="6" className="flex-1">
            <Flex justify="between" align="center" mb="8">
                <Heading size="6" mb="2">
                    {t('heading')}
                </Heading>

                <Button
                    variant="ghost"
                    color="amber"
                    onClick={() => setOpen(true)}
                    className="h-11"
                >
                    <PlusIcon className="mr-2 h-4 w-4" /> {t('buttons.newScrap')}
                </Button>
            </Flex>

            <Dialog.Root open={open} onOpenChange={setOpen}>
                <Dialog.Content style={{ maxWidth: 600, minWidth: 450 }}>
                    <Dialog.Title className="text-gray-800">
                        {t('dialog.recordScrapTitle')}
                    </Dialog.Title>

                    <Flex direction="column" gap="4" mt="4">
                        <Select.Root
                            value={selectedBatch}
                            onValueChange={setSelectedBatch}
                        >
                            <Select.Trigger
                                placeholder={t('form.selectBatch')}
                                className="bg-gray-100 rounded-lg"
                            />
                            <Select.Content>
                                <Select.Item value="VC23001">
                                    VC23001 - {t('products.anthelminticOralSuspension')}
                                </Select.Item>
                                <Select.Item value="VC23002">
                                    VC23002 - {t('products.anthelminticOralSuspension')}
                                </Select.Item>
                            </Select.Content>
                        </Select.Root>

                        <TextField.Root
                            value={scrapReason}
                            onChange={(e) => setScrapReason(e.target.value)}
                            placeholder={t('form.reason')}
                            className="w-full h-11 rounded-lg border-gray-300"
                        />

                        <TextField.Root
                            type="number"
                            value={scrapWeight}
                            onChange={(e) => setScrapWeight(e.target.value)}
                            placeholder={t('form.weight')}
                            className="w-full h-11 rounded-lg border-gray-300"
                        >
                            <TextField.Slot>
                                <Text className="ml-2">kg</Text>
                            </TextField.Slot>
                        </TextField.Root>

                        <Select.Root
                            value={scrapType}
                            onValueChange={setScrapType}
                        >
                            <Select.Trigger
                                placeholder={t('form.selectType')}
                                className="bg-gray-100 rounded-lg"
                            />
                            <Select.Content>
                                <Select.Item value="partial">
                                    {t('type.partial')}
                                </Select.Item>
                                <Select.Item value="full">
                                    {t('type.full')}
                                </Select.Item>
                            </Select.Content>
                        </Select.Root>

                        <Select.Root
                            value={removalMethod}
                            onValueChange={setRemovalMethod}
                        >
                            <Select.Trigger
                                placeholder={t('form.removalMethodStrategy')}
                                className="bg-gray-100 rounded-lg"
                            />
                            <Select.Content>
                                <Select.Item value="fifo">
                                    {t('removalMethods.fifo')}
                                </Select.Item>
                                <Select.Item value="lifo">
                                    {t('removalMethods.lifo')}
                                </Select.Item>
                                <Select.Item value="fefo">
                                    {t('removalMethods.fefo')}
                                </Select.Item>
                                <Select.Item value="erto">
                                    {t('removalMethods.erto')}
                                </Select.Item>
                                <Select.Item value="too">
                                    {t('removalMethods.too')}
                                </Select.Item>
                            </Select.Content>
                        </Select.Root>

                        <Flex gap="3" justify="end" mt="4">
                            <Button
                                variant="ghost"
                                color="gray"
                                onClick={() => setOpen(false)}
                                className="px-4 py-2 rounded-lg border-gray-300"
                            >
                                {t('buttons.cancel')}
                            </Button>
                            <Button
                                variant="solid"
                                color="amber"
                                onClick={handleNewScrap}
                                className="px-4 py-2 rounded-lg hover:bg-amber-600"
                            >
                                <PlusIcon className="mr-2 h-4 w-4" /> {t('buttons.recordScrap')}
                            </Button>
                        </Flex>
                    </Flex>
                </Dialog.Content>
            </Dialog.Root>

            <Table.Root variant="surface" className="rounded-xl shadow-sm">
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeaderCell className="text-gray-600 text-sm font-medium">
                            {t('table.headers.scrapId')}
                        </Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell className="text-gray-600 text-sm font-medium">
                            {t('table.headers.batch')}
                        </Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell className="text-gray-600 text-sm font-medium">
                            {t('table.headers.reason')}
                        </Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell className="text-gray-600 text-sm font-medium">
                            {t('table.headers.type')}
                        </Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell className="text-gray-600 text-sm font-medium">
                            {t('table.headers.weight')}
                        </Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell className="text-gray-600 text-sm font-medium">
                            {t('table.headers.status')}
                        </Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell className="text-gray-600 text-sm font_medium">
                            {t('table.headers.removalMethod')}
                        </Table.ColumnHeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {scrapProducts.map((scrap) => (
                        <Table.Row key={scrap.id} className="hover:bg-gray-50">
                            <Table.Cell className="text-gray-800 font-medium">
                                {scrap.id}
                            </Table.Cell>
                            <Table.Cell className="text-gray-800">
                                {scrap.batchId} <Text className="text-sm text-gray-500 ml-2">
                                    ({t('products.anthelminticOralSuspension')})
                                </Text>
                            </Table.Cell>
                            <Table.Cell className="text-gray-800">
                                {t(scrap.reason)}
                            </Table.Cell>
                            <Table.Cell className="text-gray-800">
                                {t(scrap.type)}
                            </Table.Cell>
                            <Table.Cell className="text-gray-800">
                                <Box className="flex items-center">
                                    <Text className="font-medium mr-2">{scrap.recordedWeight}</Text>
                                    <Text className="text-gray-500">kg</Text>
                                </Box>
                            </Table.Cell>
                            <Table.Cell>
                                <Badge
                                    color={getStatusColor(scrap.status)}
                                    variant="soft"
                                    className="text-sm"
                                >
                                    {t(scrap.status)}
                                </Badge>
                            </Table.Cell>
                            <Table.Cell className="text-gray-800">
                                {t(`removalMethods.${scrap.removalMethod}`)}
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
        </Box>
    );
};

export default ScrapProducts;
