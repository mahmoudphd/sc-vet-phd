import {
    Card,
    Flex,
    Heading,
    Table,
    Badge,
    Button,
    Grid,
    Text,
    TextField,
    DropdownMenu,
    Progress,
    Dialog,
    Select,
    TextArea,
    Checkbox,
    Box
} from '@radix-ui/themes';
import {
    PlusIcon,
    FileTextIcon,
    Cross2Icon,
    Pencil2Icon
} from '@radix-ui/react-icons';
import { PieChart, Pie } from 'recharts';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const ProductConfiguration = () => {
    const [newConfigModalOpen, setNewConfigModalOpen] = useState(false);
    const [viewSpecModalOpen, setViewSpecModalOpen] = useState(false);
    const [historyModalOpen, setHistoryModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const { t } = useTranslation('product-configuration-page');

    const products = [
        {
            id: 'FORM-045',
            name: 'Antiparasitic Oral Suspension',
            components: 8,
            status: 'Draft',
            version: 'v1.2',
            compliance: 'ICH Q11',
            cost: '$1200',
            price: '$2500',
            removalMethod: 'Chemical Dissolution',
            description: 'Veterinary antiparasitic suspension for oral administration',
            formula: [
                { component: 'Albendazole', width: '250mm' },
                { component: 'Suspending Agent', width: '120mm' }
            ]
        },
    ];

    const NewConfigurationModal = () => (
        <Dialog.Root open={newConfigModalOpen} onOpenChange={setNewConfigModalOpen}>
            <Dialog.Content style={{ maxWidth: 600 }}>
                <Flex justify="between" align="center" mb="5">
                    <Dialog.Title>{t('new-configuration-modal.title')}</Dialog.Title>
                    <Dialog.Close>
                        <Button variant="ghost" color="gray">
                            <Cross2Icon />
                        </Button>
                    </Dialog.Close>
                </Flex>

                <Flex direction="column" gap="4">
                    <TextField.Root placeholder={t('new-configuration-modal.product-name-placeholder')}>
                        <TextField.Slot>Name</TextField.Slot>
                    </TextField.Root>

                    <TextArea placeholder={t('new-configuration-modal.product-description-placeholder')} />

                    <Select.Root defaultValue="ich-q11">
                        <Select.Group>
                            <Select.Label>Compliance</Select.Label>
                            <Select.Trigger />
                            <Select.Content>
                                <Select.Item value="ich-q11">
                                    {t('new-configuration-modal.compliance-standards.ich-q11')}
                                </Select.Item>
                                <Select.Item value="ich-q8">
                                    {t('new-configuration-modal.compliance-standards.ich-q8')}
                                </Select.Item>
                                <Select.Item value="fda">
                                    {t('new-configuration-modal.compliance-standards.fda')}
                                </Select.Item>
                            </Select.Content>
                        </Select.Group>
                    </Select.Root>

                    <Flex direction="column" gap="2">
                        <Text weight="bold">{t('new-configuration-modal.product-components')}</Text>
                        {[1, 2, 3].map((_, i) => (
                            <Flex key={i} gap="3" align="center">
                                <TextField.Root style={{ flex: 2 }}>
                                    <input placeholder={t('new-configuration-modal.component-name-placeholder')} />
                                </TextField.Root>
                                <TextField.Root style={{ flex: 1 }}>
                                    <input placeholder={t('new-configuration-modal.percentage-placeholder')} />
                                </TextField.Root>
                                <Button variant="ghost" color="red">
                                    <Cross2Icon />
                                </Button>
                            </Flex>
                        ))}
                        <Button variant="soft">
                            <PlusIcon /> {t('new-configuration-modal.add-component')}
                        </Button>
                    </Flex>

                    <Flex gap="3" justify="end" mt="4">
                        <Button variant="soft" color="gray" onClick={() => setNewConfigModalOpen(false)}>
                            {t('new-configuration-modal.cancel')}
                        </Button>
                        <Button>
                            <Pencil2Icon /> {t('new-configuration-modal.save-draft')}
                        </Button>
                    </Flex>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );

    const ViewSpecModal = () => (
        <Dialog.Root open={viewSpecModalOpen} onOpenChange={setViewSpecModalOpen}>
            <Dialog.Content style={{ maxWidth: 800 }}>
                <Flex justify="between" align="center" mb="5">
                    <Dialog.Title>{t('view-spec-modal.title')}</Dialog.Title>
                    <Dialog.Close>
                        <Button variant="ghost" color="gray">
                            <Cross2Icon />
                        </Button>
                    </Dialog.Close>
                </Flex>

                {selectedProduct && (
                    <Flex direction="column" gap="4">
                        <Grid columns="2" gap="4">
                            <Flex direction="column" gap="1">
                                <Text color="gray">{t('view-spec-modal.product-id')}</Text>
                                <Text weight="bold">{selectedProduct.id}</Text>
                            </Flex>
                            <Flex direction="column" gap="1">
                                <Text color="gray">{t('view-spec-modal.compliance-standard')}</Text>
                                <Badge variant="soft">{selectedProduct.compliance}</Badge>
                            </Flex>
                        </Grid>

                        <Flex direction="column" gap="1">
                            <Text color="gray">{t('view-spec-modal.description')}</Text>
                            <Text>{selectedProduct.description}</Text>
                        </Flex>

                        <Flex direction="column" gap="2">
                            <Text weight="bold">{t('view-spec-modal.formula-composition')}</Text>
                            <Table.Root variant="surface">
                                <Table.Header>
                                    <Table.Row>
                                        <Table.ColumnHeaderCell>{t('view-spec-modal.component')}</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell>{t('view-spec-modal.percentage')}</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell>{t('view-spec-modal.specification')}</Table.ColumnHeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {selectedProduct.formula.map((comp: any, i: number) => (
                                        <Table.Row key={i}>
                                            <Table.Cell>{comp.component}</Table.Cell>
                                            <Table.Cell>{comp.percentage}k.g.</Table.Cell>
                                            <Table.Cell>
                                                <Badge variant="outline">{t('view-spec-modal.usp-standard')}</Badge>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Root>
                        </Flex>

                        <Flex gap="2" mt="4">
                            <Checkbox />
                            <Text size="2">{t('view-spec-modal.verification-text')}</Text>
                        </Flex>
                    </Flex>
                )}
            </Dialog.Content>
        </Dialog.Root>
    );

    const VersionHistoryModal = () => (
        <Dialog.Root open={historyModalOpen} onOpenChange={setHistoryModalOpen}>
            <Dialog.Content style={{ maxWidth: 800 }}>
                <Flex justify="between" align="center" mb="5">
                    <Dialog.Title>{t('version-history-modal.title')}</Dialog.Title>
                    <Dialog.Close>
                        <Button variant="ghost" color="gray">
                            <Cross2Icon />
                        </Button>
                    </Dialog.Close>
                </Flex>

                <Flex direction="column" gap="3">
                    {[1, 2, 3].map((v) => (
                        <Card key={v}>
                            <Flex justify="between" align="center">
                                <Flex direction="column" gap="1">
                                    <Flex align="center" gap="2">
                                        <Text weight="bold">v1.{v}</Text>
                                        <Badge color={v === 0 ? 'blue' : 'gray'}>
                                            {v === 0
                                                ? t('version-history-modal.current')
                                                : t('version-history-modal.archived')}
                                        </Badge>
                                    </Flex>
                                    <Text size="2" color="gray">
                                        {t('version-history-modal.modified')}: 2023-07-{15 + v}
                                    </Text>
                                </Flex>
                                <Button variant="soft">
                                    <FileTextIcon /> {t('main-section.actions.view-spec')}
                                </Button>
                            </Flex>
                        </Card>
                    ))}
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );

    return (
        <Box p="6">
            <NewConfigurationModal />
            <ViewSpecModal />
            <VersionHistoryModal />

            <Flex justify="between" align="center" mb="5">
                <Heading size="6">{t('main-section.title')}</Heading>
                <Flex gap="3">
                    <Button variant="soft" onClick={() => setNewConfigModalOpen(true)}>
                        <PlusIcon /> {t('main-section.new-configuration')}
                    </Button>
                    <Button variant="soft" onClick={() => setHistoryModalOpen(true)}>
                        {t('main-section.version-history')}
                    </Button>
                </Flex>
            </Flex>

            <Grid columns="3" gap="4" mb="5">
                <Card>
                    <Flex direction="column" gap="1">
                        <Text size="2">{t('main-section.active-configuration')}</Text>
                        <Heading size="7">24</Heading>
                        <Text size="1" className="text-green-500">3 New Drafts</Text>
                    </Flex>
                </Card>
                <Card>
                    <Flex direction="column" gap="1">
                        <Text size="2">{t('main-section.components-per-product')}</Text>
                        <Heading size="7">8.2</Heading>
                        <Progress value={65} />
                    </Flex>
                </Card>
                <Card>
                    <Flex direction="column" gap="1">
                        <Text size="2">{t('main-section.approval-rate')}</Text>
                        <Heading size="7">92%</Heading>
                        <Text size="1">{t('main-section.first-pass')}</Text>
                    </Flex>
                </Card>
            </Grid>

            <Table.Root variant="surface">
        <Table.Header>
            <Table.Row>
                <Table.ColumnHeaderCell>{t('main-section.table-headers.product-id')}</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>{t('main-section.table-headers.name')}</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>{t('main-section.table-headers.components')}</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>{t('main-section.table-headers.cost')}</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>{t('main-section.table-headers.price')}</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>{t('main-section.table-headers.removal-method')}</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>{t('main-section.table-headers.version')}</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>{t('main-section.table-headers.compliance')}</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>{t('main-section.table-headers.status')}</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>{t('main-section.table-headers.actions')}</Table.ColumnHeaderCell>
            </Table.Row>
        </Table.Header>
        <Table.Body>
            {products.map(product => (
                <Table.Row key={product.id}>
                    <Table.Cell>{product.id}</Table.Cell>
                    <Table.Cell>{product.name}</Table.Cell>
                    <Table.Cell>{product.components}</Table.Cell>
                    <Table.Cell>{product.cost}</Table.Cell>
                    <Table.Cell>{product.price}</Table.Cell>
                    <Table.Cell>{product.removalMethod}</Table.Cell>
                    <Table.Cell>{product.version}</Table.Cell>
                    <Table.Cell>
                        <Badge variant="soft">{product.compliance}</Badge>
                    </Table.Cell>
                    <Table.Cell>
                        <Badge color={product.status === 'Draft' ? 'blue' : 'green'}>
                            {t('main-section.status.draft')}
                        </Badge>
                    </Table.Cell>
                    <Table.Cell>
                        <DropdownMenu.Root>
                            <DropdownMenu.Trigger>
                                <Button variant="ghost">•••</Button>
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Content>
                                <DropdownMenu.Item>
                                    <FileTextIcon /> {t('main-section.actions.view-spec')}
                                </DropdownMenu.Item>
                                <DropdownMenu.Item>
                                    {t('main-section.actions.history')}
                                </DropdownMenu.Item>
                            </DropdownMenu.Content>
                        </DropdownMenu.Root>
                    </Table.Cell>
                </Table.Row>
            ))}
        </Table.Body>
    </Table.Root>
        </Box>
    );
};

export default ProductConfiguration;