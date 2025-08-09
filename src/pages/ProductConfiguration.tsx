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
  Box,
  ScrollArea,
  Separator,
  RadioGroup,
  Tabs
} from '@radix-ui/themes';
import {
  PlusIcon,
  FileTextIcon,
  Cross2Icon,
  Pencil2Icon,
  CubeIcon,
  MagnifyingGlassIcon,
  GearIcon,
  MixerHorizontalIcon
} from '@radix-ui/react-icons';
import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const complianceOptions = [
  "ICH Q11",
  "Egyptian Drug Authority",
  "FDA Guidance",
  "EMEA",
  "WHO"
];

const ProductConfiguration = () => {
  const [products, setProducts] = useState([
    {
      id: 'DRG-045',
      name: 'Poultry Drug A',
      components: 12,
      status: 'Approved',
      version: 'v2.1',
      compliance: 'Egyptian Drug Authority',
      description: 'Vitamin complex for poultry nutrition',
      removalMethod: 'FIFO',
      formula: [
        { component: 'Vitamin B1', weight: '0.0010 kg', percentage: '1%', pricePerKg: 85 },
        { component: 'Vitamin B2', weight: '0.0060 kg', percentage: '6%', pricePerKg: 92 },
        { component: 'Vitamin B12', weight: '0.0010 kg', percentage: '1%', pricePerKg: 120 },
        { component: 'Nicotinamide (B3)', weight: '0.0100 kg', percentage: '10%', pricePerKg: 78 },
        { component: 'Pantothenic Acid', weight: '0.0040 kg', percentage: '4%', pricePerKg: 65 },
        { component: 'Vitamin B6', weight: '0.0015 kg', percentage: '1.5%', pricePerKg: 88 },
        { component: 'Leucine', weight: '0.0300 kg', percentage: '30%', pricePerKg: 42 },
        { component: 'Threonine', weight: '0.0100 kg', percentage: '10%', pricePerKg: 38 },
        { component: 'Taurine', weight: '0.0025 kg', percentage: '2.5%', pricePerKg: 55 },
        { component: 'Glycine', weight: '0.0025 kg', percentage: '2.5%', pricePerKg: 32 },
        { component: 'Arginine', weight: '0.0025 kg', percentage: '2.5%', pricePerKg: 48 },
        { component: 'Cynarine', weight: '0.0025 kg', percentage: '2.5%', pricePerKg: 115 }
      ],
      eda: {
        stability: '24 months',
        storage: '2-8°C',
        impurities: '<0.5%'
      },
      productionDesign: {
        packagingShape: 'Rectangular',
        packagingType: 'Bottle',
        capType: 'Screw Cap',
        viscosity: 'Medium',
        pH: '6.5',
        plasticReactivity: 'No',
        fillingTemp: '25°C'
      }
    },
    {
      id: 'DRG-046',
      name: 'Poultry Drug B',
      components: 8,
      status: 'Draft',
      version: 'v1.3',
      compliance: 'ICH Q11',
      description: 'Antiparasitic solution for poultry',
      removalMethod: 'LIFO',
      formula: [
        { component: 'Active Compound', weight: '0.0500 kg', percentage: '50%', pricePerKg: 200 },
        { component: 'Stabilizer', weight: '0.0250 kg', percentage: '25%', pricePerKg: 45 },
        { component: 'Solvent', weight: '0.0200 kg', percentage: '20%', pricePerKg: 30 },
        { component: 'Preservative', weight: '0.0050 kg', percentage: '5%', pricePerKg: 85 }
      ],
      eda: {
        stability: '18 months',
        storage: 'Room Temperature',
        impurities: '<1%'
      },
      productionDesign: {
        packagingShape: 'Round',
        packagingType: 'Pump',
        capType: 'Flip Top',
        viscosity: 'Low',
        pH: '7.0',
        plasticReactivity: 'Yes',
        fillingTemp: '30°C'
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
    formula: [{ component: '', weight: '', percentage: '', pricePerKg: 0 }],
    eda: {
      stability: '',
      storage: '',
      impurities: ''
    },
    productionDesign: {
      packagingShape: 'Rectangular',
      packagingType: 'Bottle',
      capType: 'Screw Cap',
      viscosity: '',
      pH: '',
      plasticReactivity: 'No',
      fillingTemp: ''
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
      (sum, item) => sum + parseFloat(item.percentage || '0'), 0);
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
      formula: [{ component: '', weight: '', percentage: '', pricePerKg: 0 }],
      eda: {
        stability: '',
        storage: '',
        impurities: ''
      },
      productionDesign: {
        packagingShape: 'Rectangular',
        packagingType: 'Bottle',
        capType: 'Screw Cap',
        viscosity: '',
        pH: '',
        plasticReactivity: 'No',
        fillingTemp: ''
      }
    });
    setNewConfigModalOpen(false);
  };

  const addFormulaRow = () => {
    setNewProduct({
      ...newProduct,
      formula: [...newProduct.formula, { component: '', weight: '', percentage: '', pricePerKg: 0 }]
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

  const updateFormulaRow = (index: number, field: string, value: string | number) => {
    const newFormula = [...newProduct.formula];
    newFormula[index] = { ...newFormula[index], [field]: value };
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
    <Table.Root variant="surface" className="my-4">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell colSpan={2} className="text-center">
            <Flex align="center" justify="center" gap="2">
              <CubeIcon /> Product Design Summary
            </Flex>
          </Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell className="font-bold">Packaging Shape</Table.Cell>
          <Table.Cell>{design.packagingShape}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell className="font-bold">Packaging Type</Table.Cell>
          <Table.Cell>{design.packagingType}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell className="font-bold">Cap Type</Table.Cell>
          <Table.Cell>{design.capType}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell className="font-bold">Viscosity</Table.Cell>
          <Table.Cell>{design.viscosity}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell className="font-bold">pH Level</Table.Cell>
          <Table.Cell>{design.pH}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell className="font-bold">Plastic Reactivity</Table.Cell>
          <Table.Cell>{design.plasticReactivity}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell className="font-bold">Filling Temperature</Table.Cell>
          <Table.Cell>{design.fillingTemp}</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  );

  const ComponentDistributionChart = ({ formula }: { formula: any }) => {
    const data = formula.map((item: any) => ({
      name: item.component,
      value: parseFloat(item.percentage),
      pricePerKg: item.pricePerKg
    }));

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

    return (
      <Card className="mt-4">
        <Heading size="4" mb="2">Component Distribution</Heading>
        <PieChart width={400} height={300}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }: { name: string, percent: number }) => `${name}: ${(percent * 100).toFixed(0)}%`}
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
      </Card>
    );
  };

  const NewConfigurationModal = () => (
    <Dialog.Root open={newConfigModalOpen} onOpenChange={setNewConfigModalOpen}>
      <Dialog.Content style={{ maxWidth: 800 }}>
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
            <Tabs.Trigger value="production">Production Design</Tabs.Trigger>
          </Tabs.List>

          <Box pt="3">
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
                    Total percentage: {totalPercentage}% (should be 100%)
                  </Text>
                )}
                
                <Table.Root variant="surface">
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeaderCell>Component</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Weight (kg)</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Percentage</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Price per kg (EGP)</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {newProduct.formula.map((row, index) => (
                      <Table.Row key={index}>
                        <Table.Cell>
                          <TextField.Root
                            placeholder="Component name"
                            value={row.component}
                            onChange={(e) => updateFormulaRow(index, 'component', e.target.value)}
                          />
                        </Table.Cell>
                        <Table.Cell>
                          <TextField.Root
                            placeholder="0.0000"
                            value={row.weight}
                            onChange={(e) => updateFormulaRow(index, 'weight', e.target.value)}
                          />
                        </Table.Cell>
                        <Table.Cell>
                          <TextField.Root
                            placeholder="0%"
                            value={row.percentage}
                            onChange={(e) => updateFormulaRow(index, 'percentage', e.target.value)}
                          />
                        </Table.Cell>
                        <Table.Cell>
                          <TextField.Root
                            placeholder="0.00"
                            value={row.pricePerKg}
                            onChange={(e) => updateFormulaRow(index, 'pricePerKg', parseFloat(e.target.value) || 0)}
                          />
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

                <Button variant="soft" onClick={addFormulaRow}>
                  <PlusIcon /> Add Component
                </Button>
              </Flex>
            </Tabs.Content>

            <Tabs.Content value="production">
              <Flex direction="column" gap="4">
                <Text weight="bold">Packaging Configuration</Text>
                
                <Grid columns="2" gap="3">
                  <Flex direction="column" gap="1">
                    <Text size="2">Packaging Shape</Text>
                    <Select.Root
                      value={newProduct.productionDesign.packagingShape}
                      onValueChange={(value) => setNewProduct({
                        ...newProduct,
                        productionDesign: {
                          ...newProduct.productionDesign,
                          packagingShape: value
                        }
                      })}
                    >
                      <Select.Trigger />
                      <Select.Content>
                        <Select.Item value="Round">Round</Select.Item>
                        <Select.Item value="Rectangular">Rectangular</Select.Item>
                        <Select.Item value="Oval">Oval</Select.Item>
                        <Select.Item value="Custom">Custom</Select.Item>
                      </Select.Content>
                    </Select.Root>
                  </Flex>

                  <Flex direction="column" gap="1">
                    <Text size="2">Packaging Type</Text>
                    <Select.Root
                      value={newProduct.productionDesign.packagingType}
                      onValueChange={(value) => setNewProduct({
                        ...newProduct,
                        productionDesign: {
                          ...newProduct.productionDesign,
                          packagingType: value
                        }
                      })}
                    >
                      <Select.Trigger />
                      <Select.Content>
                        <Select.Item value="Bottle">Bottle</Select.Item>
                        <Select.Item value="Pump">Pump</Select.Item>
                        <Select.Item value="Floater">Floater</Select.Item>
                        <Select.Item value="Sachet">Sachet</Select.Item>
                        <Select.Item value="Tube">Tube</Select.Item>
                      </Select.Content>
                    </Select.Root>
                  </Flex>

                  <Flex direction="column" gap="1">
                    <Text size="2">Cap Type</Text>
                    <Select.Root
                      value={newProduct.productionDesign.capType}
                      onValueChange={(value) => setNewProduct({
                        ...newProduct,
                        productionDesign: {
                          ...newProduct.productionDesign,
                          capType: value
                        }
                      })}
                    >
                      <Select.Trigger />
                      <Select.Content>
                        <Select.Item value="Safety Seal">Safety Seal</Select.Item>
                        <Select.Item value="Flip Top">Flip Top</Select.Item>
                        <Select.Item value="Screw Cap">Screw Cap</Select.Item>
                        <Select.Item value="Spray">Spray</Select.Item>
                        <Select.Item value="Nozzle">Nozzle</Select.Item>
                      </Select.Content>
                    </Select.Root>
                  </Flex>
                </Grid>

                <Separator my="3" />

                <Text weight="bold">Product Specifications</Text>
                
                <Grid columns="2" gap="3">
                  <Flex direction="column" gap="1">
                    <Text size="2">Viscosity</Text>
                    <TextField.Root
                      placeholder="e.g. Medium"
                      value={newProduct.productionDesign.viscosity}
                      onChange={(e) => setNewProduct({
                        ...newProduct,
                        productionDesign: {
                          ...newProduct.productionDesign,
                          viscosity: e.target.value
                        }
                      })}
                    />
                  </Flex>

                  <Flex direction="column" gap="1">
                    <Text size="2">pH Level</Text>
                    <TextField.Root
                      placeholder="e.g. 6.5"
                      value={newProduct.productionDesign.pH}
                      onChange={(e) => setNewProduct({
                        ...newProduct,
                        productionDesign: {
                          ...newProduct.productionDesign,
                          pH: e.target.value
                        }
                      })}
                    />
                  </Flex>

                  <Flex direction="column" gap="1">
                    <Text size="2">Filling Temperature</Text>
                    <TextField.Root
                      placeholder="e.g. 25°C"
                      value={newProduct.productionDesign.fillingTemp}
                      onChange={(e) => setNewProduct({
                        ...newProduct,
                        productionDesign: {
                          ...newProduct.productionDesign,
                          fillingTemp: e.target.value
                        }
                      })}
                    />
                  </Flex>

                  <Flex direction="column" gap="1">
                    <Text size="2">Plastic Reactivity</Text>
                    <Select.Root
                      value={newProduct.productionDesign.plasticReactivity}
                      onValueChange={(value) => setNewProduct({
                        ...newProduct,
                        productionDesign: {
                          ...newProduct.productionDesign,
                          plasticReactivity: value
                        }
                      })}
                    >
                      <Select.Trigger />
                      <Select.Content>
                        <Select.Item value="No">No</Select.Item>
                        <Select.Item value="Yes">Yes</Select.Item>
                      </Select.Content>
                    </Select.Root>
                  </Flex>
                </Grid>
              </Flex>
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
      <Dialog.Content style={{ maxWidth: 900 }}>
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
              <Tabs.Trigger value="design">Design</Tabs.Trigger>
            </Tabs.List>

            <Box pt="3">
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
                      <Table.ColumnHeaderCell>Weight</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Percentage</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Price per kg (EGP)</Table.ColumnHeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {selectedProduct.formula.map((comp: any, i: number) => (
                      <Table.Row key={i}>
                        <Table.Cell>{comp.component}</Table.Cell>
                        <Table.Cell>{comp.weight}</Table.Cell>
                        <Table.Cell>{comp.percentage}</Table.Cell>
                        <Table.Cell>{comp.pricePerKg.toFixed(2)}</Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
                <ComponentDistributionChart formula={selectedProduct.formula} />
              </Tabs.Content>

              <Tabs.Content value="design">
                <ProductionDesignTable design={selectedProduct.productionDesign} />
              </Tabs.Content>
            </Box>
          </Tabs.Root>
        )}
      </Dialog.Content>
    </Dialog.Root>
  );

  return (
    <Box p="6">
      <NewConfigurationModal />
      <ViewSpecModal />

      <Flex justify="between" align="center" mb="5">
        <Heading size="6">Product Configuration</Heading>
        <Flex gap="3">
          <TextField.Root
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-56"
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

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Product ID</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Components</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Compliance</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Removal Method</Table.ColumnHeaderCell>
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
                <Badge variant="soft">
                  {product.compliance}
                  {product.compliance === "Egyptian Drug Authority" && " (Default)"}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <Badge variant="soft">{product.removalMethod}</Badge>
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
                  <FileTextIcon /> View Details
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

export default ProductConfiguration;
