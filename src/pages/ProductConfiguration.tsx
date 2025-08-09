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
        // ... (all other components)
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
    <Table.Root variant="surface" className="w-full">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell colSpan={2} className="bg-blue-50">
            <Flex align="center" gap="2">
              <CubeIcon /> Standard Veterinary Packaging Design
            </Flex>
          </Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell className="font-bold w-1/3">Packaging Type</Table.Cell>
          <Table.Cell>{design.packagingType}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell className="font-bold">Dimensions</Table.Cell>
          <Table.Cell>{design.dimensions}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell className="font-bold">Closure System</Table.Cell>
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
          <Table.Cell className="font-bold">Filling Temperature</Table.Cell>
          <Table.Cell>{design.fillingTemp}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell className="font-bold">Special Features</Table.Cell>
          <Table.Cell>
            <ul className="list-disc pl-5">
              {design.features.map((feature: string, i: number) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
          </Table.Cell>
        </Table.Row>
        {design.notes && (
          <Table.Row>
            <Table.Cell className="font-bold">Additional Notes</Table.Cell>
            <Table.Cell>{design.notes}</Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table.Root>
  );

  const ComponentDistributionChart = ({ formula }: { formula: any }) => {
    const data = formula.map((item: any) => ({
      name: item.component,
      value: item.percentage,
      pricePerKg: item.pricePerKg
    }));

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#A4DE6C'];

    return (
      <Card className="w-full">
        <Heading size="4" mb="2">Component Distribution</Heading>
        <div className="w-full overflow-auto">
          <PieChart width={600} height={300}>
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
            <Legend layout="vertical" verticalAlign="middle" align="right" />
          </PieChart>
        </div>
      </Card>
    );
  };

  const NewConfigurationModal = () => (
    <Dialog.Root open={newConfigModalOpen} onOpenChange={setNewConfigModalOpen}>
      <Dialog.Content style={{ width: '90vw', height: '90vh', maxWidth: 'none' }}>
        <Flex justify="between" align="center" mb="5">
          <Dialog.Title>New Product Configuration</Dialog.Title>
          <Dialog.Close>
            <Button variant="ghost" color="gray">
              <Cross2Icon />
            </Button>
          </Dialog.Close>
        </Flex>

        <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Trigger value="details">Basic Details</Tabs.Trigger>
            <Tabs.Trigger value="formula">Formula Composition</Tabs.Trigger>
            <Tabs.Trigger value="production">Packaging Design</Tabs.Trigger>
          </Tabs.List>

          <Box pt="3" style={{ height: 'calc(90vh - 150px)', overflowY: 'auto' }}>
            <Tabs.Content value="details">
              <Flex direction="column" gap="4">
                <Grid columns="2" gap="4">
                  <TextField.Root
                    placeholder="Product ID *"
                    value={newProduct.id}
                    onChange={(e) => setNewProduct({...newProduct, id: e.target.value})}
                  />
                  <TextField.Root
                    placeholder="Product Name *"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  />
                </Grid>

                <TextArea
                  placeholder="Description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  style={{ minHeight: 100 }}
                />

                <Grid columns="2" gap="4">
                  <Select.Root
                    value={newProduct.compliance}
                    onValueChange={(value) => setNewProduct({...newProduct, compliance: value})}
                  >
                    <Select.Trigger placeholder="Compliance Standard" />
                    <Select.Content>
                      {complianceOptions.map(option => (
                        <Select.Item 
                          key={option} 
                          value={option}
                          className={option === "Egyptian Drug Authority" ? "font-bold bg-amber-50" : ""}
                        >
                          {option}
                          {option === "Egyptian Drug Authority" && " (Default)"}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>

                  <Select.Root
                    value={newProduct.removalMethod}
                    onValueChange={(value) => setNewProduct({...newProduct, removalMethod: value})}
                  >
                    <Select.Trigger placeholder="Removal Method" />
                    <Select.Content>
                      <Select.Item value="FIFO">FIFO</Select.Item>
                      <Select.Item value="LIFO">LIFO</Select.Item>
                      <Select.Item value="Closest Location">Closest Location</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </Grid>
              </Flex>
            </Tabs.Content>

            <Tabs.Content value="formula">
              <Flex direction="column" gap="3">
                <Text size="2" color="gray">
                  Define the components and their proportions in the product formula
                </Text>
                {totalPercentage !== 100 && (
                  <Text color="red" size="2">
                    Total percentage: {totalPercentage.toFixed(1)}% (should be 100%)
                  </Text>
                )}
                
                <Table.Root variant="surface">
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeaderCell>Component</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Weight (kg)</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Percentage</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Price/kg (EGP)</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Cost (EGP)</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {newProduct.formula.map((row, index) => (
                      <Table.Row key={index}>
                        <Table.Cell>
                          <Select.Root
                            value={row.component}
                            onValueChange={(value) => {
                              const selected = allComponents.find(c => c.name === value);
                              updateFormulaRow(index, 'component', value);
                              if (selected) {
                                updateFormulaRow(index, 'pricePerKg', selected.pricePerKg);
                              }
                            }}
                          >
                            <Select.Trigger placeholder="Select component" />
                            <Select.Content>
                              {allComponents.map(comp => (
                                <Select.Item key={comp.name} value={comp.name}>
                                  {comp.name} ({comp.pricePerKg} EGP/kg)
                                </Select.Item>
                              ))}
                            </Select.Content>
                          </Select.Root>
                        </Table.Cell>
                        <Table.Cell>
                          <TextField.Root
                            placeholder="0.000"
                            value={row.weight || ''}
                            onChange={(e) => updateFormulaRow(index, 'weight', parseFloat(e.target.value) || 0)}
                          />
                        </Table.Cell>
                        <Table.Cell>
                          <Text>{row.percentage.toFixed(1)}%</Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Text>{row.pricePerKg.toFixed(2)}</Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Text>{(row.weight * row.pricePerKg).toFixed(2)}</Text>
                        </Table.Cell>
                        <Table.Cell>
                          {newProduct.formula.length > 1 && (
                            <Button 
                              variant="ghost" 
                              color="red" 
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
                  <Button variant="soft" onClick={addFormulaRow}>
                    <PlusIcon /> Add Component
                  </Button>
                  <Text weight="bold">
                    Total Cost: {newProduct.formula.reduce((sum, item) => 
                      sum + (item.weight * item.pricePerKg), 0).toFixed(2)} EGP per 1 kg
                  </Text>
                </Flex>
              </Flex>
            </Tabs.Content>

            <Tabs.Content value="production">
              <Card className="mt-4">
                <Heading size="4" mb="4" className="text-blue-800">
                  <Flex align="center" gap="2">
                    <GearIcon /> Standard Veterinary Packaging Design
                  </Flex>
                </Heading>
                
                <ProductionDesignTable design={newProduct.productionDesign} />
                
                <Separator my="3" />
                
                <TextArea
                  placeholder="Additional packaging notes (optional)"
                  value={newProduct.productionDesign.notes}
                  onChange={(e) => setNewProduct({
                    ...newProduct,
                    productionDesign: {
                      ...newProduct.productionDesign,
                      notes: e.target.value
                    }
                  })}
                  style={{ minHeight: 100 }}
                />
              </Card>
            </Tabs.Content>
          </Box>
        </Tabs.Root>

        <Flex gap="3" justify="end" mt="4">
          <Button variant="soft" color="gray" onClick={() => setNewConfigModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddProduct}>
            <PlusIcon /> Create Product
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );

  const ViewSpecModal = () => (
    <Dialog.Root open={viewSpecModalOpen} onOpenChange={setViewSpecModalOpen}>
      <Dialog.Content style={{ width: '90vw', height: '90vh', maxWidth: 'none' }}>
        <Flex justify="between" align="center" mb="5">
          <Dialog.Title>Product Specification: {selectedProduct?.id}</Dialog.Title>
          <Dialog.Close>
            <Button variant="ghost" color="gray">
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

            <Box pt="3" style={{ height: 'calc(90vh - 100px)', overflowY: 'auto' }}>
              <Tabs.Content value="details">
                <Grid columns="2" gap="4">
                  <Flex direction="column" gap="1">
                    <Text color="gray">Product Name</Text>
                    <Text weight="bold">{selectedProduct.name}</Text>
                  </Flex>
                  <Flex direction="column" gap="1">
                    <Text color="gray">Status</Text>
                    <Badge color={selectedProduct.status === 'Approved' ? 'green' : 'blue'}>
                      {selectedProduct.status}
                    </Badge>
                  </Flex>
                  <Flex direction="column" gap="1">
                    <Text color="gray">Version</Text>
                    <Text>{selectedProduct.version}</Text>
                  </Flex>
                  <Flex direction="column" gap="1">
                    <Text color="gray">Compliance Standard</Text>
                    <Badge variant="soft">
                      {selectedProduct.compliance}
                      {selectedProduct.compliance === "Egyptian Drug Authority" && " (Default)"}
                    </Badge>
                  </Flex>
                  <Flex direction="column" gap="1">
                    <Text color="gray">Removal Method</Text>
                    <Text>{selectedProduct.removalMethod}</Text>
                  </Flex>
                </Grid>

                <Flex direction="column" gap="1" mt="3">
                  <Text color="gray">Description</Text>
                  <Text>{selectedProduct.description}</Text>
                </Flex>
              </Tabs.Content>

              <Tabs.Content value="formula">
                <Table.Root variant="surface">
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeaderCell>Component</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Weight (kg)</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Percentage</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Price/kg (EGP)</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Cost (EGP)</Table.ColumnHeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {selectedProduct.formula.map((comp: any, i: number) => (
                      <Table.Row key={i}>
                        <Table.Cell>{comp.component}</Table.Cell>
                        <Table.Cell>{comp.weight.toFixed(3)}</Table.Cell>
                        <Table.Cell>{comp.percentage.toFixed(1)}%</Table.Cell>
                        <Table.Cell>{comp.pricePerKg.toFixed(2)}</Table.Cell>
                        <Table.Cell>{(comp.weight * comp.pricePerKg).toFixed(2)}</Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
                <ComponentDistributionChart formula={selectedProduct.formula} />
                <Flex justify="end" mt="3">
                  <Text size="4" weight="bold">
                    Total Cost: {selectedProduct.formula.reduce(
                      (sum: number, item: any) => sum + (item.weight * item.pricePerKg), 0
                    ).toFixed(2)} EGP per 1 kg
                  </Text>
                </Flex>
              </Tabs.Content>

              <Tabs.Content value="production">
                <ProductionDesignTable design={selectedProduct.productionDesign} />
                <Card className="mt-4">
                  <div className="bg-gray-100 p-8 text-center rounded-lg">
                    <Text size="4" weight="bold" className="mb-4">1kg Veterinary Bottle Design</Text>
                    <div className="flex justify-center">
                      <div className="relative">
                        {/* Bottle illustration */}
                        <div className="w-40 h-64 bg-amber-100 rounded-t-full border-2 border-amber-300">
                          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-32 h-56 bg-amber-50 rounded-t-full border border-amber-200">
                            {/* Graduation marks */}
                            <div className="absolute left-0 w-full border-t border-amber-300" style={{ top: '10%' }}></div>
                            <div className="absolute left-0 w-full border-t border-amber-300" style={{ top: '30%' }}></div>
                            <div className="absolute left-0 w-full border-t border-amber-300" style={{ top: '50%' }}></div>
                            <div className="absolute left-0 w-full border-t border-amber-300" style={{ top: '70%' }}></div>
                            <div className="absolute left-0 w-full border-t border-amber-300" style={{ top: '90%' }}></div>
                          </div>
                        </div>
                        {/* Cap */}
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-16 h-8 bg-gray-300 rounded-t-lg border-2 border-gray-400"></div>
                        {/* Neck band */}
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-2 bg-red-100 border border-red-200"></div>
                      </div>
                    </div>
                    <Text size="2" color="gray" className="mt-4">Standard 1kg veterinary medicine bottle with safety features</Text>
                  </div>
                </Card>
              </Tabs.Content>
            </Box>
          </Tabs.Root>
        )}
      </Dialog.Content>
    </Dialog.Root>
  );

  return (
    <Container size="4" className="min-h-screen p-4">
      <NewConfigurationModal />
      <ViewSpecModal />

      <Flex direction="column" gap="4" className="h-full">
        <Card className="p-4 shadow-sm">
          <Flex justify="between" align="center">
            <Heading size="6">Product Configuration</Heading>
            <Flex gap="3">
              <TextField.Root
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
              >
                <TextField.Slot>
                  <MagnifyingGlassIcon />
                </TextField.Slot>
              </TextField.Root>
              <Button onClick={() => setNewConfigModalOpen(true)}>
                <PlusIcon /> New Product
              </Button>
            </Flex>
          </Flex>
        </Card>

        <Card className="flex-grow p-4 overflow-hidden">
          <Table.Root variant="surface" className="h-full">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Product ID</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Components</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Compliance</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body className="overflow-y-auto">
              {filteredProducts.map(product => (
                <Table.Row key={product.id}>
                  <Table.Cell>{product.id}</Table.Cell>
                  <Table.Cell>{product.name}</Table.Cell>
                  <Table.Cell>{product.components}</Table.Cell>
                  <Table.Cell>
                    <Badge variant="soft">
                      {product.compliance}
                      {product.compliance === "Egyptian Drug Authority" && " (Default)"}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge color={product.status === 'Approved' ? 'green' : 'blue'}>
                      {product.status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Button 
                      variant="ghost" 
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
        </Card>
      </Flex>
    </Container>
  );
};

export default ProductConfiguration;
