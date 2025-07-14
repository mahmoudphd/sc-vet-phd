import { useState } from 'react';

import {
    Card,
    Flex,
    Heading,
    Table,
    Badge,
    Button,
    Grid,
    Text,
    Progress,
    Dialog,
    TextField,
    Select,
    Separator,
    Box
} from '@radix-ui/themes';

import {
    LayersIcon,
    GlobeIcon,
    PlusIcon,
    CheckCircledIcon,
    Crosshair2Icon
} from '@radix-ui/react-icons';
import { useTranslation } from 'react-i18next';


const ComponentSpecification = () => {
    const { t } = useTranslation('material-specification-hub');
    const [newSpecOpen, setNewSpecOpen] = useState<any>(false);
    const [selectedComponent, setSelectedComponent] = useState<any>(null);
    const [components, setComponents] = useState<any>([
        {
            id: 'MAT-789',
            name: 'Albendazole USP',
            specification: 'Purity ≥99.8%',
            compliance: ['USP', 'EP'],
            suppliers: 3,
            status: 'Approved',
            revision: '1.2',
            created: '2023-07-15',
            lastUpdated: '2023-08-01'
        },
    ]);

    const complianceStandards = ['USP', 'EP', 'JP', 'IP', 'ICH Q7'];

    const handleCreateSpec = (newSpec: any) => {
        setComponents([...components, newSpec]);
        setNewSpecOpen(false);
    };

    return (
        <Box p="6" className="flex-1">
            <Flex justify="between" align="center" mb="5">
                <Heading size="6">{t('material-specification-hub')}</Heading>
                <Flex gap="3">
                    <Dialog.Root open={newSpecOpen} onOpenChange={setNewSpecOpen}>
                        <Dialog.Trigger>
                            <Button variant="soft">
                                <LayersIcon /> {t('new-spec')}
                            </Button>
                        </Dialog.Trigger>

                        <Dialog.Content style={{ maxWidth: 600 }}>
                            <Dialog.Title>{t('create-new-material-spec')}</Dialog.Title>
                            <Flex direction="column" gap="4" mt="4">
                                <TextField.Root>
                                    <input placeholder={t('material-name-placeholder')} />
                                </TextField.Root>

                                <TextField.Root>
                                    <input placeholder={t('spec-summary-placeholder')} />
                                </TextField.Root>

                                <Select.Root>
                                    <Select.Trigger placeholder={t('select-compliance-placeholder')} />
                                    <Select.Content>
                                        {complianceStandards.map(standard => (
                                            <Select.Item key={standard} value={standard}>
                                                {standard}
                                            </Select.Item>
                                        ))}
                                    </Select.Content>
                                </Select.Root>

                                <Flex gap="4">
                                    <TextField.Root style={{ flex: 1 }}>
                                        <input
                                            placeholder={t('target-purity-placeholder')}
                                            type="number"
                                        />
                                    </TextField.Root>
                                    <TextField.Root style={{ flex: 1 }}>
                                        <input placeholder={t('storage-conditions-placeholder')} />
                                    </TextField.Root>
                                </Flex>

                                <Flex justify="between" gap="4">
                                    <Button variant="soft" color="gray" onClick={() => setNewSpecOpen(false)}>
                                        {t('cancel')}
                                    </Button>
                                    <Button onClick={() => handleCreateSpec({ /* New spec data */ })}>
                                        <CheckCircledIcon /> {t('create-specification')}
                                    </Button>
                                </Flex>
                            </Flex>
                        </Dialog.Content>
                    </Dialog.Root>
                    <Button variant="soft">
                        <Crosshair2Icon /> {t('compliance-check')}
                    </Button>
                </Flex>
            </Flex>

            <Grid columns="3" gap="4" mb="5">
                <Card>
                    <Flex direction="column" gap="1">
                        <Text size="2">{t('active-materials')}</Text>
                        <Heading size="7">245</Heading>
                        <Text size="1" className="text-green-500">98% {t('compliant')}</Text>
                    </Flex>
                </Card>
                <Card>
                    <Flex direction="column" gap="1">
                        <Text size="2">{t('pending-reviews')}</Text>
                        <Heading size="7" className="text-amber-500">12</Heading>
                    </Flex>
                </Card>
                <Card>
                    <Flex direction="column" gap="1">
                        <Text size="2">{t('supplier-variance')}</Text>
                        <Heading size="7">2.1%</Heading>
                    </Flex>
                </Card>
            </Grid>

            <Flex gap="4" mb="5">
                <Card style={{ flex: 1 }}>
                    <Heading size="4" mb="3">{t('compliance-matrix')}</Heading>
                    <div className="grid grid-cols-2 gap-4 h-64 p-4">
                        {['USP', 'EP', 'JP', 'IP'].map(standard => (
                            <Badge
                                key={standard}
                                variant="soft"
                                className="h-12 flex items-center justify-center"
                            >
                                {standard} {t('compliance')}
                                <Progress value={95} size="1" className="mt-1" />
                            </Badge>
                        ))}
                    </div>
                </Card>
                <Card style={{ flex: 1 }}>
                    <Heading size="4" mb="3">{t('supplier-quality-heatmap')}</Heading>
                    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                            <GlobeIcon className="w-12 h-12 text-gray-400" />
                            <Text size="2" className="mt-2">{t('supplier-geography')}</Text>
                        </div>
                    </div>
                </Card>
            </Flex>

            <Table.Root variant="surface">
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeaderCell>{t('component-id')}</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>{t('material')}</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>{t('specification')}</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>{t('compliance')}</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>{t('suppliers')}</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>{t('status')}</Table.ColumnHeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {components.map((component: any) => (
                        <Table.Row key={component.id}>
                            <Table.Cell>{component.id}</Table.Cell>
                            <Table.Cell>{component.name}</Table.Cell>
                            <Table.Cell>{component.specification}</Table.Cell>
                            <Table.Cell>
                                <Flex gap="2">
                                    {component.compliance.map((comp: any) => (
                                        <Badge key={comp} variant="outline">{comp}</Badge>
                                    ))}
                                </Flex>
                            </Table.Cell>
                            <Table.Cell>{component.suppliers}</Table.Cell>
                            <Table.Cell>
                                <Badge color={component.status === 'Approved' ? 'green' : 'red'}>
                                    {component.status}
                                </Badge>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>

            <Dialog.Root open={!!selectedComponent} onOpenChange={() => setSelectedComponent(null)}>
                <Dialog.Content style={{ maxWidth: 800 }}>
                    {selectedComponent && (
                        <>
                            <Dialog.Title>{selectedComponent.name} Specification</Dialog.Title>
                            <Flex direction="column" gap="4" mt="4">
                                <Grid columns="3" gap="4">
                                    <Flex direction="column" gap="1">
                                        <Text size="1" color="gray">{t('component-id')}</Text>
                                        <Text weight="bold">{selectedComponent.id}</Text>
                                    </Flex>
                                    <Flex direction="column" gap="1">
                                        <Text size="1" color="gray">{t('revision')}</Text>
                                        <Text weight="bold">{selectedComponent.revision}</Text>
                                    </Flex>
                                    <Flex direction="column" gap="1">
                                        <Text size="1" color="gray">{t('last-updated')}</Text>
                                        <Text weight="bold">{selectedComponent.lastUpdated}</Text>
                                    </Flex>
                                </Grid>

                                <Separator size="4" />

                                <Flex direction="column" gap="2">
                                    <Text size="2" weight="bold">Compliance Standards</Text>
                                    <Flex gap="2">
                                        {selectedComponent.compliance.map((comp: any) => (
                                            <Badge key={comp} variant="outline">{comp}</Badge>
                                        ))}
                                    </Flex>
                                </Flex>

                                <Flex direction="column" gap="2">
                                    <Text size="2" weight="bold">Specification Details</Text>
                                    <Text>{selectedComponent.specification}</Text>
                                </Flex>

                                <Flex direction="column" gap="2">
                                    <Text size="2" weight="bold">Supplier Information</Text>
                                    <Grid columns="3" gap="4">
                                        <Flex direction="column">
                                            <Text size="1" color="gray">Approved Suppliers</Text>
                                            <Text weight="bold">{selectedComponent.suppliers}</Text>
                                        </Flex>
                                        <Flex direction="column">
                                            <Text size="1" color="gray">Lead Time</Text>
                                            <Text weight="bold">4-6 weeks</Text>
                                        </Flex>
                                        <Flex direction="column">
                                            <Text size="1" color="gray">Quality Rating</Text>
                                            <Progress value={95} />
                                        </Flex>
                                    </Grid>
                                </Flex>
                            </Flex>
                        </>
                    )}
                </Dialog.Content>
            </Dialog.Root>

            {/* Floating Action Button */}
            <div className="fixed bottom-8 right-8">
                <Dialog.Root>
                    <Dialog.Trigger>
                        <Button
                            size="3"
                            radius="full"
                            className="shadow-lg hover:shadow-xl transition-shadow"
                            onClick={() => setNewSpecOpen(true)}
                        >
                            <PlusIcon width="20" height="20" />
                        </Button>
                    </Dialog.Trigger>

                </Dialog.Root>
            </div>
        </Box>
    );
};

export default ComponentSpecification;