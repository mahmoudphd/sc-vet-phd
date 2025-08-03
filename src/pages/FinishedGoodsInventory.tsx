import {
  Card,
  Flex,
  Heading,
  Table,
  Button,
  TextField,
  Box,
  Grid,
  Text,
  Badge
} from '@radix-ui/themes';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useState } from 'react';
import { MagnifyingGlassIcon, CubeIcon } from '@radix-ui/react-icons';

const initialData = [
  {
    id: 'FGI001',
    name: 'Poultry Product A',
    quantity: 120,
    reserved: 40,
    storage: '4°C',
    expiry: '2025-08-10',
    location: 'Zone 1'
  },
  {
    id: 'FGI002',
    name: 'Poultry Product B',
    quantity: 100,
    reserved: 30,
    storage: '6°C',
    expiry: '2025-09-15',
    location: 'Zone 2'
  },
  {
    id: 'FGI003',
    name: 'Poultry Product C',
    quantity: 80,
    reserved: 20,
    storage: '8°C',
    expiry: '2025-07-28',
    location: 'Zone 2'
  }
];

const FinishedGoodsInventory = () => {
  const [data, setData] = useState(initialData);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = data.filter(item =>
    item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChange = (index: number, field: 'quantity' | 'reserved', value: number) => {
    const newData = [...data];
    newData[index][field] = value;
    setData(newData);
  };

  const getExpiryIndicator = (expiry: string) => {
    const today = new Date();
    const expiryDate = new Date(expiry);
    const diffDays = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const color = diffDays < 10 ? '#ef4444' : '#22c55e';
    return (
      <span
        style={{
          display: 'inline-block',
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          backgroundColor: color,
          marginLeft: '6px',
        }}
      />
    );
  };

  // Calculate inventory turnover ratio (simplified calculation)
  const totalQuantity = data.reduce((sum, item) => sum + item.quantity, 0);
  const totalReserved = data.reduce((sum, item) => sum + item.reserved, 0);
  const inventoryTurnoverRatio = totalQuantity > 0 ? (totalReserved / totalQuantity) * 100 : 0;

  return (
    <Box p="4">
      <Card>
        <Flex direction="column" gap="4">
          {/* Header with Search and Blockchain Button */}
          <Flex justify="between" align="center">
            <Heading size="6">Finished Goods Inventory</Heading>
            <Flex gap="3" align="center">
              <TextField.Root
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48"
              >
                <TextField.Slot>
                  <MagnifyingGlassIcon />
                </TextField.Slot>
              </TextField.Root>
              <Button
                variant="solid"
                color="green"
                onClick={() => alert('Inventory data submitted to blockchain!')}
              >
                <CubeIcon className="mr-2" />
                Submit to Blockchain
              </Button>
            </Flex>
          </Flex>

          {/* Summary Cards */}
          <Grid columns="3" gap="4">
            <Card>
              <Flex direction="column" gap="1">
                <Text size="2" color="gray">Total Products</Text>
                <Text size="5" weight="bold">{data.length}</Text>
              </Flex>
            </Card>
            <Card>
              <Flex direction="column" gap="1">
                <Text size="2" color="gray">Expiring Soon</Text>
                <Text size="5" weight="bold">
                  {data.filter(item => {
                    const today = new Date();
                    const expiry = new Date(item.expiry);
                    return (expiry.getTime() - today.getTime()) < 10 * 24 * 60 * 60 * 1000;
                  }).length}
                </Text>
              </Flex>
            </Card>
            <Card>
              <Flex direction="column" gap="1">
                <Text size="2" color="gray">Inventory Turnover</Text>
                <Flex align="center" gap="2">
                  <Text size="5" weight="bold">
                    {inventoryTurnoverRatio.toFixed(1)}%
                  </Text>
                  <Badge color={
                    inventoryTurnoverRatio > 50 ? 'green' :
                    inventoryTurnoverRatio > 30 ? 'amber' : 'red'
                  }>
                    {
                      inventoryTurnoverRatio > 50 ? 'High' :
                      inventoryTurnoverRatio > 30 ? 'Medium' : 'Low'
                    }
                  </Badge>
                </Flex>
              </Flex>
            </Card>
          </Grid>

          {/* Inventory Table */}
          <Table.Root style={{ fontWeight: 600 }}>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Product ID</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Product Name</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Quantity</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Reserved</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Available</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>
                  Storage
                  <div style={{ fontSize: '0.75rem', color: '#3b82f6' }}>Via IoT</div>
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>
                  Location
                  <div style={{ fontSize: '0.75rem', color: '#3b82f6' }}>Via IoT</div>
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Expiry Date</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredData.map((item, index) => (
                <Table.Row key={item.id}>
                  <Table.Cell><Text weight="medium">{item.id}</Text></Table.Cell>
                  <Table.Cell><Text weight="medium">{item.name}</Text></Table.Cell>
                  <Table.Cell>
                    <TextField.Root
                      value={item.quantity}
                      type="number"
                      onChange={(e) => handleChange(index, 'quantity', parseInt(e.target.value))}
                      style={{ width: '70px', fontWeight: 600 }}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <TextField.Root
                      value={item.reserved}
                      type="number"
                      onChange={(e) => handleChange(index, 'reserved', parseInt(e.target.value))}
                      style={{ width: '70px', fontWeight: 600 }}
                    />
                  </Table.Cell>
                  <Table.Cell><Text weight="medium">{item.quantity - item.reserved}</Text></Table.Cell>
                  <Table.Cell>
                    <Text weight="medium">{item.storage}</Text>
                    <div style={{ fontSize: '0.75rem', color: '#3b82f6' }}>Via IoT</div>
                  </Table.Cell>
                  <Table.Cell>
                    <Text weight="medium">{item.location}</Text>
                    <div style={{ fontSize: '0.75rem', color: '#3b82f6' }}>Via IoT</div>
                  </Table.Cell>
                  <Table.Cell>
                    <Flex align="center" gap="2">
                      <Text weight="medium">{item.expiry}</Text>
                      {getExpiryIndicator(item.expiry)}
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>

          {/* Inventory Chart */}
          <Box mt="6">
            <Heading size="5" mb="2">
              Inventory Distribution
            </Heading>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={filteredData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantity" fill="#3b82f6" name="Total Quantity" />
                <Bar dataKey="reserved" fill="#f59e0b" name="Reserved" />
                <Bar
                  dataKey={(entry) => entry.quantity - entry.reserved}
                  fill="#10b981"
                  name="Available"
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Flex>
      </Card>
    </Box>
  );
};

export default FinishedGoodsInventory;       

	      التانى
import React, { useState } from 'react';
import {
  Card,
  Flex,
  Heading,
  Table,
  Button,
  TextField,
  Box,
  Grid,
  Text,
  Badge,
  Tooltip
} from '@radix-ui/themes';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  ResponsiveContainer
} from 'recharts';
import { MagnifyingGlassIcon, CubeIcon, InfoCircledIcon } from '@radix-ui/react-icons';

interface ProductMetrics {
  annualCOGS: number;
  avgInventoryValue: number;
  shelfLifeDays: number;
  seasonalityFactor: number;
}

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  reserved: number;
  storage?: string;
  expiry?: string;
  location?: string;
}

const productMetrics: Record<string, ProductMetrics> = {
  'Poultry Product A': {
    annualCOGS: 75000,
    avgInventoryValue: 15000,
    shelfLifeDays: 90,
    seasonalityFactor: 1.2
  },
  'Poultry Product B': {
    annualCOGS: 50000,
    avgInventoryValue: 20000,
    shelfLifeDays: 180,
    seasonalityFactor: 1.0
  },
  'Poultry Product C': {
    annualCOGS: 30000,
    avgInventoryValue: 10000,
    shelfLifeDays: 60,
    seasonalityFactor: 1.5
  }
};

const inventoryData: InventoryItem[] = [
  {
    id: 'FGI001',
    name: 'Poultry Product A',
    quantity: 120,
    reserved: 40,
    storage: '4°C',
    expiry: '2025-08-10',
    location: 'Zone 1'
  },
  {
    id: 'FGI002',
    name: 'Poultry Product B',
    quantity: 100,
    reserved: 30,
    storage: '6°C',
    expiry: '2025-09-15',
    location: 'Zone 2'
  },
  {
    id: 'FGI003',
    name: 'Poultry Product C',
    quantity: 80,
    reserved: 20,
    storage: '8°C',
    expiry: '2025-07-28',
    location: 'Zone 2'
  }
];

const calculateTurnoverRate = (productName: string): string => {
  const metrics = productMetrics[productName];
  if (!metrics) return '0.0';
  
  const baseTurnover = metrics.annualCOGS / metrics.avgInventoryValue;
  const shelfLifeAdjustment = 365 / metrics.shelfLifeDays;
  
  return (baseTurnover * shelfLifeAdjustment * metrics.seasonalityFactor).toFixed(1);
};

const FinishedGoodsInventory: React.FC = () => {
  const [data, setData] = useState<InventoryItem[]>(inventoryData);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const filteredData = data.filter(item =>
    item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const averageTurnover = (
    filteredData.reduce((sum, item) => {
      return sum + parseFloat(calculateTurnoverRate(item.name));
    }, 0) / filteredData.length
  ).toFixed(1);

  const renderProductTooltip = (productId: string) => {
    const product = data.find(item => item.id === productId);
    if (!product) return null;

    const metrics = productMetrics[product.name] || {
      annualCOGS: 0,
      avgInventoryValue: 0,
      shelfLifeDays: 0,
      seasonalityFactor: 0
    };

    return (
      <Box 
        position="absolute" 
        p="3" 
        style={{
          backgroundColor: 'white',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          borderRadius: '0.375rem',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '400px',
          zIndex: 10
        }}
      >
        <Heading size="4" mb="2">{product.name} Analysis</Heading>
        <Grid columns="2" gap="2">
          <Text>Annual COGS:</Text>
          <Text weight="bold">${metrics.annualCOGS.toLocaleString()}</Text>
          <Text>Avg Inventory Value:</Text>
          <Text weight="bold">${metrics.avgInventoryValue.toLocaleString()}</Text>
          <Text>Shelf Life:</Text>
          <Text weight="bold">{metrics.shelfLifeDays} days</Text>
          <Text>Seasonality Factor:</Text>
          <Text weight="bold">{metrics.seasonalityFactor}x</Text>
        </Grid>
      </Box>
    );
  };

  return (
    <Box p="4">
      <Card>
        <Flex direction="column" gap="4">
          <Flex justify="between" align="center">
            <Heading size="6">Finished Goods Inventory</Heading>
            <Flex gap="3" align="center">
              <TextField.Root
                placeholder="Search inventory..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '192px' }}
              >
                <TextField.Slot>
                  <MagnifyingGlassIcon />
                </TextField.Slot>
              </TextField.Root>
              <Button variant="solid" color="green">
                <CubeIcon className="mr-2" />
                Submit to Blockchain
              </Button>
            </Flex>
          </Flex>

          <Grid columns="3" gap="4">
            <Card 
              onMouseEnter={() => setHoveredItem('turnover')}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Flex direction="column" gap="1" style={{ position: 'relative' }}>
                <Flex align="center" gap="2">
                  <Text size="2" color="gray">Inventory Turnover</Text>
                  <Tooltip content="Annual inventory turnover rate">
                    <InfoCircledIcon width="14" height="14" />
                  </Tooltip>
                </Flex>
                <Text size="5" weight="bold">{averageTurnover}x</Text>
                
                {hoveredItem === 'turnover' && (
                  <Box 
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      padding: '12px',
                      backgroundColor: 'white',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      borderRadius: '0.375rem',
                      width: '300px',
                      zIndex: 10
                    }}
                  >
                    <Text size="2" weight="bold">Product Turnover Rates:</Text>
                    <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {filteredData.map(item => (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Text>{item.name}:</Text>
                          <Text weight="bold">
                            {calculateTurnoverRate(item.name)}x
                          </Text>
                        </div>
                      ))}
                    </div>
                  </Box>
                )}
              </Flex>
            </Card>

            <Card>
              <Flex direction="column" gap="1">
                <Text size="2" color="gray">Total Products</Text>
                <Text size="5" weight="bold">{data.length}</Text>
              </Flex>
            </Card>
            <Card>
              <Flex direction="column" gap="1">
                <Text size="2" color="gray">Reserved Stock</Text>
                <Text size="5" weight="bold">
                  {data.reduce((sum, item) => sum + item.reserved, 0)}
                </Text>
              </Flex>
            </Card>
          </Grid>

          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Product ID</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Product Name</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Turnover Rate</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Quantity</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Reserved</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Available</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Storage</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Location</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Expiry Date</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredData.map((item) => (
                <Table.Row 
                  key={item.id}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <Table.Cell>{item.id}</Table.Cell>
                  <Table.Cell>{item.name}</Table.Cell>
                  <Table.Cell>
                    <Badge 
                      color={
                        parseFloat(calculateTurnoverRate(item.name)) > 8 ? 'green' :
                        parseFloat(calculateTurnoverRate(item.name)) > 4 ? 'amber' : 'red'
                      }
                    >
                      {calculateTurnoverRate(item.name)}x
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>{item.quantity}</Table.Cell>
                  <Table.Cell>{item.reserved}</Table.Cell>
                  <Table.Cell>{item.quantity - item.reserved}</Table.Cell>
                  <Table.Cell>{item.storage}</Table.Cell>
                  <Table.Cell>{item.location}</Table.Cell>
                  <Table.Cell>{item.expiry}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>

          {hoveredItem && hoveredItem !== 'turnover' && renderProductTooltip(hoveredItem)}

          <Box mt="6">
            <Heading size="5" mb="2">Inventory Distribution</Heading>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={filteredData}>
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip />
                <Bar dataKey="quantity" fill="#3b82f6" name="Quantity" />
                <Bar dataKey="reserved" fill="#f59e0b" name="Reserved" />
                <Bar 
                  dataKey={(item: InventoryItem) => item.quantity - item.reserved}
                  fill="#10b981"
                  name="Available" 
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Flex>
      </Card>
    </Box>
  );
};

export default FinishedGoodsInventory;

