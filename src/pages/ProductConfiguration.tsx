import React, { useState, useEffect } from 'react';
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
  Dialog,
  Select,
  TextArea,
  Box,
  ScrollArea,
  Separator,
  Tabs,
  Container
} from '@radix-ui/themes';
import {
  PlusIcon,
  FileTextIcon,
  Cross2Icon,
  CubeIcon,
  MagnifyingGlassIcon,
  GearIcon
} from '@radix-ui/react-icons';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const complianceOptions = [
  "ICH Q11",
  "Egyptian Drug Authority",
  "FDA Guidance",
  "EMEA",
  "WHO"
];

const allComponents = [
  { name: 'Vitamin B1', pricePerKg: 540 },
  { name: 'Vitamin B2', pricePerKg: 600 },
  { name: 'Vitamin B12', pricePerKg: 2300 },
  { name: 'Nicotinamide B3', pricePerKg: 400 },
  { name: 'Pantothenic Acid', pricePerKg: 1700 },
  { name: 'Vitamin B6', pricePerKg: 900 },
  { name: 'Leucine', pricePerKg: 200 },
  { name: 'Threonine', pricePerKg: 950 },
  { name: 'Taurine', pricePerKg: 3000 },
  { name: 'Glycine', pricePerKg: 4200 },
  { name: 'Arginine', pricePerKg: 5000 },
  { name: 'Cynarin', pricePerKg: 3900 },
  { name: 'Silymarin', pricePerKg: 700 },
  { name: 'Sorbitol', pricePerKg: 360 },
  { name: 'Carnitine', pricePerKg: 1070 },
  { name: 'Betaine', pricePerKg: 1250 },
  { name: 'Tween-80', pricePerKg: 90 },
  { name: 'Water', pricePerKg: 1 }
];

const ProductConfiguration = () => {
  const [products, setProducts] = useState([
    {
      id: 'DRG-045',
      name: 'Poultry Drug A',
      components: 18,
      status: 'Approved',
      version: 'v2.1',
      compliance: 'Egyptian Drug Authority',
      description: 'Complete vitamin complex for poultry nutrition',
      removalMethod: 'FIFO',
      formula: [
        { component: 'Vitamin B1', weight: 0.001, percentage: 0.1, pricePerKg: 540 },
        { component: 'Vitamin B2', weight: 0.006, percentage: 0.6, pricePerKg: 600 },
        { component: 'Vitamin B12', weight: 0.001, percentage: 0.1, pricePerKg: 2300 },
        { component: 'Nicotinamide B3', weight: 0.010, percentage: 1.0, pricePerKg: 400 },
        { component: 'Pantothenic Acid', weight: 0.004, percentage: 0.4, pricePerKg: 1700 },
        { component: 'Vitamin B6', weight: 0.002, percentage: 0.2, pricePerKg: 900 },
        { component: 'Leucine', weight: 0.030, percentage: 3.0, pricePerKg: 200 },
        { component: 'Threonine', weight: 0.010, percentage: 1.0, pricePerKg: 950 },
        { component: 'Taurine', weight: 0.003, percentage: 0.3, pricePerKg: 3000 },
        { component: 'Glycine', weight: 0.003, percentage: 0.3, pricePerKg: 4200 },
        { component: 'Arginine', weight: 0.003, percentage: 0.3, pricePerKg: 5000 },
        { component: 'Cynarin', weight: 0.003, percentage: 0.3, pricePerKg: 3900 },
        { component: 'Silymarin', weight: 0.025, percentage: 2.5, pricePerKg: 700 },
        { component: 'Sorbitol', weight: 0.010, percentage: 1.0, pricePerKg: 360 },
        { component: 'Carnitine', weight: 0.005, percentage: 0.5, pricePerKg: 1070 },
        { component: 'Betaine', weight: 0.020, percentage: 2.0, pricePerKg: 1250 },
        { component: 'Tween-80', weight: 0.075, percentage: 7.5, pricePerKg: 90 },
        { component: 'Water', weight: 0.571, percentage: 57.1, pricePerKg: 1 }
      ],
      productionDesign: {
        packagingType: '1kg HDPE Plastic Bottle',
        dimensions: 'Ø80mm × 180mm',
        closure: '38mm Screw Cap with Foil Seal',
        color: 'Amber',
        viscosity: 'Medium (500-1000 cPs)',
        pH: '6.5-7.5',
        fillingTemp: '25°C ± 2°C',
        features: [
          'UV protection',
          'Tamper-evident neck band',
          'Graduated measuring marks'
        ]
      }
    }
  ]);

  const [newProduct, setNewProduct] = useState({
    id: '',
    name: '',
    components: 0,
    status: 'Draft',
    version: 'v1.0',
    compliance: 'Egyptian Drug Authority',
    description: '',
    removalMethod: 'FIFO',
    formula: [{ component: '', weight: 0, percentage: 0, pricePerKg: 0 }],
    productionDesign: {
      packagingType: '1kg HDPE Plastic Bottle',
      dimensions: 'Ø80mm × 180mm',
      closure: '38mm Screw Cap with Foil Seal',
      color: 'Amber',
      viscosity: 'Medium (500-1000 cPs)',
      pH: '6.5-7.5',
      fillingTemp: '25°C ± 2°C',
      features: [
        'UV protection',
        'Tamper-evident neck band',
        'Graduated measuring marks'
      ],
      notes: ''
    }
  });

  const [newConfigModalOpen, setNewConfigModalOpen] = useState(false);
  const [viewSpecModalOpen, setViewSpecModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('details');
  const [totalPercentage, setTotalPercentage] = useState(0);

  useEffect(() => {
    const total = newProduct.formula.reduce(
      (sum, item) => sum + (item.percentage || 0), 0);
    setTotalPercentage(total);
  }, [newProduct.formula]);

  const handleAddProduct = () => {
    if (!newProduct.id || !newProduct.name) {
      alert('Please fill in required fields');
      return;
    }
    setProducts([...products, newProduct]);
    setNewProduct({
      id: '',
      name: '',
      components: 0,
      status: 'Draft',
      version: 'v1.0',
      compliance: 'Egyptian Drug Authority',
      description: '',
      removalMethod: 'FIFO',
      formula: [{ component: '', weight: 0, percentage: 0, pricePerKg: 0 }],
      productionDesign: {
        packagingType: '1kg HDPE Plastic Bottle',
        dimensions: 'Ø80mm × 180mm',
        closure: '38mm Screw Cap with Foil Seal',
        color: 'Amber',
        viscosity: 'Medium (500-1000 cPs)',
        pH: '6.5-7.5',
        fillingTemp: '25°C ± 2°C',
        features: [
          'UV protection',
          'Tamper-evident neck band',
          'Graduated measuring marks'
        ],
        notes: ''
      }
    });
    setNewConfigModalOpen(false);
  };

  const addFormulaRow = () => {
    setNewProduct({
      ...newProduct,
      formula: [...newProduct.formula, { component: '', weight: 0, percentage: 0, pricePerKg: 0 }]
    });
  };

  const removeFormulaRow = (index: number) => {
    const newFormula = [...newProduct.formula];
    newFormula.splice(index, 1);
    setNewProduct({
      ...newProduct,
      formula: newFormula
    });
  };

  const updateFormulaRow = (index: number, field: string, value: any) => {
    const newFormula = [...newProduct.formula];
    newFormula[index] = { ...newFormula[index], [field]: value };
    
    if (field === 'weight') {
      const totalWeight = newFormula.reduce((sum, item) => sum + (item.weight || 0), 0);
      if (totalWeight > 0) {
        newFormula[index].percentage = parseFloat(((value / totalWeight) * 100).toFixed(1));
      }
    }
    
    setNewProduct({
      ...newProduct,
      formula: newFormula
    });
  };

  const filteredProducts = products.filter(product =>
    product.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ProductionDesignTable = ({ design }: { design: any }) => (
    <Table.Root variant="surface" size="1">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell colSpan={2} className="bg-blue-50">
            <Flex align="center" gap="2">
              <CubeIcon /> Packaging Design
            </Flex>
          </Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell className="font-bold">Type</Table.Cell>
          <Table.Cell>{design.packagingType}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell className="font-bold">Dimensions</Table.Cell>
          <Table.Cell>{design.dimensions}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell className="font-bold">Closure</Table.Cell>
          <Table.Cell>{design.closure}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell className="font-bold">Color</Table.Cell>
          <Table.Cell>{design.color}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell className="font-bold">Viscosity</Table.Cell>
          <Table.Cell>{design.viscosity}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell className="font-bold">pH Range</Table.Cell>
          <Table.Cell>{design.pH}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell className="font-bold">Filling Temp</Table.Cell>
          <Table.Cell>{design.fillingTemp}</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  );

  const ComponentDistributionChart = ({ formula }: { formula: any }) => {
    const data = formula.map((item: any) => ({
      name: item.component,
      value: item.percentage,
      pricePerKg: item.pricePerKg
    }));

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

    return (
      <div className="w-full h-64">
        <PieChart width={350} height={250}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
          >
            {data.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: any, name: any, props: any) => [
              `${value}%`, 
              `Price/kg: ${props.payload.pricePerKg} EGP`
            ]}
          />
          <Legend />
        </PieChart>
      </div>
    );
  };

  const NewConfigurationModal = () => (
    <Dialog.Root open={newConfigModalOpen} onOpenChange={setNewConfigModalOpen}>
      <Dialog.Content style={{ maxWidth: 600 }}>
        <Flex justify="between" align="center" mb="4">
          <Dialog.Title>New Product</Dialog.Title>
          <Dialog.Close>
            <Button variant="ghost" color="gray" size="1">
              <Cross2Icon />
            </Button>
          </Dialog.Close>
        </Flex>

        <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Trigger value="details">Details</Tabs.Trigger>
            <Tabs.Trigger value="formula">Formula</Tabs.Trigger>
            <Tabs.Trigger value="production">Packaging</Tabs.Trigger>
          </Tabs.List>

          <Box pt="3">
            <Tabs.Content value="details">
              <Flex direction="column" gap="3">
                <Grid columns="2" gap="3">
                  <TextField.Root
                    placeholder="Product ID"
                    size="1"
                    value={newProduct.id}
                    onChange={(e) => setNewProduct({...newProduct, id: e.target.value})}
                  />
                  <TextField.Root
                    placeholder="Product Name"
                    size="1"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  />
                </Grid>

                <TextArea
                  placeholder="Description"
                  size="1"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                />

                <Grid columns="2" gap="3">
                  <Select.Root
                    size="1"
                    value={newProduct.compliance}
                    onValueChange={(value) => setNewProduct({...newProduct, compliance: value})}
                  >
                    <Select.Trigger placeholder="Compliance" />
                    <Select.Content>
                      {complianceOptions.map(option => (
                        <Select.Item key={option} value={option}>
                          {option}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>

                  <Select.Root
                    size="1"
                    value={newProduct.removalMethod}
                    onValueChange={(value) => setNewProduct({...newProduct, removalMethod: value})}
                  >
                    <Select.Trigger placeholder="Removal Method" />
                    <Select.Content>
                      <Select.Item value="FIFO">FIFO</Select.Item>
                      <Select.Item value="LIFO">LIFO</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </Grid>
              </Flex>
            </Tabs.Content>

            <Tabs.Content value="formula">
              <Flex direction="column" gap="2">
                <Text size="1" color="gray">
                  Formula composition
                </Text>
                {totalPercentage !== 100 && (
                  <Text size="1" color="red">
                    Total: {totalPercentage.toFixed(1)}% (should be 100%)
                  </Text>
                )}
                
                <Table.Root variant="surface" size="1">
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeaderCell>Component</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Weight</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>%</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Price/kg</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {newProduct.formula.map((row, index) => (
                      <Table.Row key={index}>
                        <Table.Cell>
                          <Select.Root
                            size="1"
                            value={row.component}
                            onValueChange={(value) => {
                              const selected = allComponents.find(c => c.name === value);
                              updateFormulaRow(index, 'component', value);
                              if (selected) {
                                updateFormulaRow(index, 'pricePerKg', selected.pricePerKg);
                              }
                            }}
                          >
                            <Select.Trigger placeholder="Select" />
                            <Select.Content>
                              {allComponents.map(comp => (
                                <Select.Item key={comp.name} value={comp.name}>
                                  {comp.name}
                                </Select.Item>
                              ))}
                            </Select.Content>
                          </Select.Root>
                        </Table.Cell>
                        <Table.Cell>
                          <TextField.Root
                            size="1"
                            placeholder="0.000"
                            value={row.weight || ''}
                            onChange={(e) => updateFormulaRow(index, 'weight', parseFloat(e.target.value) || 0)}
                          />
                        </Table.Cell>
                        <Table.Cell>
                          <Text size="1">{row.percentage.toFixed(1)}</Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Text size="1">{row.pricePerKg.toFixed(2)}</Text>
                        </Table.Cell>
                        <Table.Cell>
                          {newProduct.formula.length > 1 && (
                            <Button 
                              variant="ghost" 
                              color="red" 
                              size="1"
                              onClick={() => removeFormulaRow(index)}
                            >
                              <Cross2Icon />
                            </Button>
                          )}
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>

                <Flex justify="between" align="center">
                  <Button variant="soft" size="1" onClick={addFormulaRow}>
                    <PlusIcon /> Add
                  </Button>
                  <Text size="1" weight="bold">
                    Total: {newProduct.formula.reduce((sum, item) => 
                      sum + (item.weight * item.pricePerKg), 0).toFixed(2)} EGP
                  </Text>
                </Flex>
              </Flex>
            </Tabs.Content>

            <Tabs.Content value="production">
              <ProductionDesignTable design={newProduct.productionDesign} />
              <TextArea
                placeholder="Additional notes"
                size="1"
                mt="3"
                value={newProduct.productionDesign.notes}
                onChange={(e) => setNewProduct({
                  ...newProduct,
                  productionDesign: {
                    ...newProduct.productionDesign,
                    notes: e.target.value
                  }
                })}
              />
            </Tabs.Content>
          </Box>
        </Tabs.Root>

        <Flex gap="2" justify="end" mt="4">
          <Button variant="soft" color="gray" size="1" onClick={() => setNewConfigModalOpen(false)}>
            Cancel
          </Button>
          <Button size="1" onClick={handleAddProduct}>
            <PlusIcon /> Create
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );

  const ViewSpecModal = () => (
    <Dialog.Root open={viewSpecModalOpen} onOpenChange={setViewSpecModalOpen}>
      <Dialog.Content style={{ maxWidth: 700 }}>
        <Flex justify="between" align="center" mb="4">
          <Dialog.Title>Product: {selectedProduct?.id}</Dialog.Title>
          <Dialog.Close>
            <Button variant="ghost" color="gray" size="1">
              <Cross2Icon />
            </Button>
          </Dialog.Close>
        </Flex>

        {selectedProduct && (
          <Tabs.Root defaultValue="details">
            <Tabs.List>
              <Tabs.Trigger value="details">Details</Tabs.Trigger>
              <Tabs.Trigger value="formula">Formula</Tabs.Trigger>
              <Tabs.Trigger value="production">Packaging</Tabs.Trigger>
            </Tabs.List>

            <Box pt="3">
              <Tabs.Content value="details">
                <Grid columns="2" gap="3">
                  <Flex direction="column" gap="1">
                    <Text size="1" color="gray">Name</Text>
                    <Text size="2">{selectedProduct.name}</Text>
                  </Flex>
                  <Flex direction="column" gap="1">
                    <Text size="1" color="gray">Status</Text>
                    <Badge color={selectedProduct.status === 'Approved' ? 'green' : 'blue'}>
                      {selectedProduct.status}
                    </Badge>
                  </Flex>
                  <Flex direction="column" gap="1">
                    <Text size="1" color="gray">Compliance</Text>
                    <Text size="2">{selectedProduct.compliance}</Text>
                  </Flex>
                  <Flex direction="column" gap="1">
                    <Text size="1" color="gray">Removal Method</Text>
                    <Text size="2">{selectedProduct.removalMethod}</Text>
                  </Flex>
                </Grid>

                <Flex direction="column" gap="1" mt="3">
                  <Text size="1" color="gray">Description</Text>
                  <Text size="2">{selectedProduct.description}</Text>
                </Flex>
              </Tabs.Content>

              <Tabs.Content value="formula">
                <Table.Root variant="surface" size="1">
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeaderCell>Component</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Weight</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>%</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Price/kg</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Cost</Table.ColumnHeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {selectedProduct.formula.map((comp: any, i: number) => (
                      <Table.Row key={i}>
                        <Table.Cell>{comp.component}</Table.Cell>
                        <Table.Cell>{comp.weight.toFixed(3)}</Table.Cell>
                        <Table.Cell>{comp.percentage.toFixed(1)}</Table.Cell>
                        <Table.Cell>{comp.pricePerKg.toFixed(2)}</Table.Cell>
                        <Table.Cell>{(comp.weight * comp.pricePerKg).toFixed(2)}</Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
                <ComponentDistributionChart formula={selectedProduct.formula} />
                <Flex justify="end" mt="2">
                  <Text size="2" weight="bold">
                    Total: {selectedProduct.formula.reduce(
                      (sum: number, item: any) => sum + (item.weight * item.pricePerKg), 0
                    ).toFixed(2)} EGP
                  </Text>
                </Flex>
              </Tabs.Content>

              <Tabs.Content value="production">
                <ProductionDesignTable design={selectedProduct.productionDesign} />
                <Card mt="3">
                  <Flex align="center" gap="2" p="2">
                    <div className="w-16 h-24 bg-amber-100 rounded-t-full border border-amber-300 relative">
                      <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-12 h-20 bg-amber-50 rounded-t-full border border-amber-200"></div>
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-8 h-4 bg-gray-300 rounded-t-sm border border-gray-400"></div>
                    </div>
                    <Text size="1" color="gray">1kg Veterinary Bottle</Text>
                  </Flex>
                </Card>
              </Tabs.Content>
            </Box>
          </Tabs.Root>
        )}
      </Dialog.Content>
    </Dialog.Root>
  );

  return (
    <Container size="2" className="p-4">
      <NewConfigurationModal />
      <ViewSpecModal />

      <Flex direction="column" gap="3">
        <Flex justify="between" align="center">
          <Heading size="5">Product Configuration</Heading>
          <Flex gap="2">
            <TextField.Root
              placeholder="Search..."
              size="1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48"
            >
              <TextField.Slot>
                <MagnifyingGlassIcon />
              </TextField.Slot>
            </TextField.Root>
            <Button size="1" onClick={() => setNewConfigModalOpen(true)}>
              <PlusIcon /> New
            </Button>
          </Flex>
        </Flex>

        <Table.Root variant="surface" size="1">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Components</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Compliance</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredProducts.map(product => (
              <Table.Row key={product.id}>
                <Table.Cell>{product.id}</Table.Cell>
                <Table.Cell>{product.name}</Table.Cell>
                <Table.Cell>{product.components}</Table.Cell>
                <Table.Cell>
                  <Text size="1">{product.compliance}</Text>
                </Table.Cell>
                <Table.Cell>
                  <Badge color={product.status === 'Approved' ? 'green' : 'blue'}>
                    {product.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <Button 
                    variant="ghost" 
                    size="1"
                    onClick={() => {
                      setSelectedProduct(product);
                      setViewSpecModalOpen(true);
                    }}
                  >
                    <FileTextIcon /> View
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Flex>
    </Container>
  );
};

export default ProductConfiguration;
