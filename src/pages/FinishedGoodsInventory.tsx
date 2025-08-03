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

// Product-specific turnover metrics
const productMetrics = {
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

// Calculate turnover rate for a specific product
const calculateTurnoverRate = (productName) => {
  const metrics = productMetrics[productName];
  if (!metrics) return 0;
  
  const baseTurnover = metrics.annualCOGS / metrics.avgInventoryValue;
  const shelfLifeAdjustment = 365 / metrics.shelfLifeDays;
  
  return (baseTurnover * shelfLifeAdjustment * metrics.seasonalityFactor).toFixed(1);
};

// Sample inventory data
const inventoryData = [
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
  const [data, setData] = useState(inventoryData);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredItem, setHoveredItem] = useState(null);

  const filteredData = data.filter(item =>
    item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate average turnover for all products
  const averageTurnover = (
    filteredData.reduce((sum, item) => {
      return sum + parseFloat(calculateTurnoverRate(item.name));
    }, 0) / filteredData.length
  ).toFixed(1);

  return (
    <Box p="4">
      <Card>
        <Flex direction="column" gap="4">
          {/* Header Section */}
          <Flex justify="between" align="center">
            <Heading size="6">Finished Goods Inventory</Heading>
            <Flex gap="3" align="center">
              <TextField.Root
                placeholder="Search inventory..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48"
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

          {/* Summary Cards */}
          <Grid columns="3" gap="4">
            {/* Inventory Turnover Card */}
            <Card 
              onMouseEnter={() => setHoveredItem('turnover')}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Flex direction="column" gap="1" position="relative">
                <Flex align="center" gap="2">
                  <Text size="2" color="gray">Inventory Turnover</Text>
                  <Tooltip content="Annual inventory turnover rate">
                    <InfoCircledIcon width="14" height="14" />
                  </Tooltip>
                </Flex>
                <Text size="5" weight="bold">{averageTurnover}x</Text>
                
                {hoveredItem === 'turnover' && (
                  <Box 
                    position="absolute" 
                    top="100%" 
                    left="0" 
                    p="3" 
                    className="bg-white shadow-lg rounded-md z-10"
                    style={{ width: '300px' }}
                  >
                    <Text size="2" weight="bold">Product Turnover Rates:</Text>
                    <ul className="mt-2 space-y-1">
                      {filteredData.map(item => (
                        <li key={item.id} className="flex justify-between">
                          <Text>{item.name}:</Text>
                          <Text weight="bold">
                            {calculateTurnoverRate(item.name)}x
                          </Text>
                        </li>
                      ))}
                    </ul>
                  </Box>
                )}
              </Flex>
            </Card>

            {/* Other Summary Cards */}
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

          {/* Inventory Table */}
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
                        calculateTurnoverRate(item.name) > 8 ? 'green' :
                        calculateTurnoverRate(item.name) > 4 ? 'amber' : 'red'
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

          {/* Product Details Tooltip */}
          {hoveredItem && hoveredItem !== 'turnover' && {
            const product = data.find(item => item.id === hoveredItem);
            return (
              <Box 
                position="absolute" 
                p="3" 
                className="bg-white shadow-lg rounded-md border"
                style={{
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '400px',
                  zIndex: 10
                }}
              >
                <Heading size="4" mb="2">{product.name} Analysis</Heading>
                <Grid columns="2" gap="2">
                  <Text>Annual COGS:</Text>
                  <Text weight="bold">${productMetrics[product.name]?.annualCOGS.toLocaleString()}</Text>
                  
                  <Text>Avg Inventory Value:</Text>
                  <Text weight="bold">${productMetrics[product.name]?.avgInventoryValue.toLocaleString()}</Text>
                  
                  <Text>Shelf Life:</Text>
                  <Text weight="bold">{productMetrics[product.name]?.shelfLifeDays} days</Text>
                  
                  <Text>Seasonality Factor:</Text>
                  <Text weight="bold">{productMetrics[product.name]?.seasonalityFactor}x</Text>
                </Grid>
              </Box>
            );
          }}

          {/* Inventory Distribution Chart */}
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
                  dataKey={(item) => item.quantity - item.reserved}
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
