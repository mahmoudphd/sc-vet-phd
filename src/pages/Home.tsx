import {
    Card,
    Flex,
    Grid,
    Heading,
    Text,
    Table,
    Badge,
    IconButton,
    SegmentedControl,
    Box,
    Progress,
    Button,
} from '@radix-ui/themes';
import {
    MixerHorizontalIcon
} from '@radix-ui/react-icons';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const Home = () => {
    const mockShipmentData = [
        { date: '01 Jan', temperature: 2, status: 'In Transit' },
        { date: '05 Jan', temperature: 5, status: 'Delayed' },
        { date: '10 Jan', temperature: -1, status: 'Destroyed' },
    ];
    return <Box className="h-fullflex-1">
        <Grid columns="5" gap="6" p="6" className="h-fullflex-1">
            {/* Main Content */}
            <Box className="col-span-4 space-y-6">
                {/* Key Metrics */}
                <Grid columns="4" gap="4">
                    <Card className="hover:bg-white/5 transition-colors">
                        <Flex direction="column" gap="2">
                            <Text size="2" className="text-black/60">Active Shipments</Text>
                            <Heading size="7" className="text-green-400">24</Heading>
                            <Progress value={65} color="green" size="1" />
                        </Flex>
                    </Card>

                    <Card>
                        <Flex direction="column" gap="2">
                            <Text size="2" className="text-black/60">Temperature Alerts</Text>
                            <Heading size="7" className="text-red-400">3</Heading>
                            <div className="h-20">
                                {/* <Gauge value={75} text={`${75}%`} /> */}
                            </div>
                        </Flex>
                    </Card>

                    <Card>
                        <Flex direction="column" gap="2">
                            <Text size="2" className="text-black/60">Product Approvals</Text>
                            <Heading size="7" className="text-indigo-400">98%</Heading>
                            <ResponsiveContainer width="100%" height={80}>
                                <LineChart data={[{ value: 4 }, { value: 6 }, { value: 8 }]}>
                                    <Line type="monotone" dataKey="value" stroke="#818cf8" />
                                </LineChart>
                            </ResponsiveContainer>
                        </Flex>
                    </Card>

                    <Card>
                        <Flex direction="column" gap="2">
                            <Text size="2" className="text-black/60">Recall Alerts</Text>
                            <Heading size="7" className="text-amber-400">2</Heading>
                            <SegmentedControl.Root defaultValue="week">
                                <SegmentedControl.Item value="week">Week</SegmentedControl.Item>
                                <SegmentedControl.Item value="month">Month</SegmentedControl.Item>
                            </SegmentedControl.Root>
                        </Flex>
                    </Card>
                </Grid>

                {/* Shipment Tracking */}
                <Card>
                    <Flex direction="column" gap="4">
                        <Flex justify="between" align="center">
                            <Heading size="5" className="text-black">Active Shipments</Heading>
                            <IconButton variant="ghost">
                                <MixerHorizontalIcon />
                            </IconButton>
                        </Flex>

                        <Table.Root variant="surface">
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeaderCell>Product ID</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>Last Temp</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>Location</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {mockShipmentData.map((shipment, index) => (
                                    <Table.Row key={index}>
                                        <Table.RowHeaderCell>VC#{Math.floor(Math.random() * 1000)}</Table.RowHeaderCell>
                                        <Table.Cell>
                                            <Badge color={shipment.temperature > 0 ? 'green' : 'red'}>
                                                {shipment.temperature}°C
                                            </Badge>
                                        </Table.Cell>
                                        <Table.Cell>Warehouse {index + 1}</Table.Cell>
                                        <Table.Cell>
                                            <Badge variant="soft" color={
                                                shipment.status === 'Destroyed' ? 'red' :
                                                    shipment.status === 'Delayed' ? 'amber' : 'green'
                                            }>
                                                {shipment.status}
                                            </Badge>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Root>
                    </Flex>
                </Card>
            </Box>

            {/* Sidebar */}
            <Box className="col-span-1 space-y-6">
                <Card>
                    <Flex direction="column" gap="4">
                        <Heading size="4" className="text-black">Quick Actions</Heading>
                        <Button variant="soft" className="w-full">
                            New Shipment
                        </Button>
                        <Button variant="soft">
                            Request Audit
                        </Button>
                        <Button variant="soft">
                            Report Incident
                        </Button>
                    </Flex>
                </Card>

                <Card>
                    <Flex direction="column" gap="3">
                        <Heading size="4" className="text-black">Recent Alerts</Heading>
                        <Flex direction="column" gap="2">
                            <Badge color="red" variant="surface">
                                Temperature Excursion: VC#224
                            </Badge>
                            <Badge color="amber" variant="surface">
                                Customs Delay: VC#587
                            </Badge>
                            <Badge color="green" variant="surface">
                                Delivery Confirmed: VC#901
                            </Badge>
                        </Flex>
                    </Flex>
                </Card>
            </Box>
        </Grid>
    </Box>
}

export default Home;