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
  RadioGroup
} from '@radix-ui/themes';
import {
  PlusIcon,
  FileTextIcon,
  Cross2Icon,
  Pencil2Icon,
  CubeIcon,
  MagnifyingGlassIcon
} from '@radix-ui/react-icons';
import { useState } from 'react';

const ProductConfiguration = () => {
  // Sample products data with EGP pricing
  const [products, setProducts] = useState([
    {
      id: 'DRG-045',
      name: 'Poultry Drug A',
      components: 12,
      status: 'Approved',
      version: 'v2.1',
      compliance: 'ICH Q11',
      cost: { value: 45750, currency: 'EGP' }, // 1500 USD = 45750 EGP
      price: { value: 97600, currency: 'EGP' }, // 3200 USD = 97600 EGP
      removalMethod: 'FIFO',
      description: 'Vitamin complex for poultry nutrition',
      formula: [
        { component: 'Vitamin B1', weight: '0.0010 kg', percentage: '1%', pricePerKg: 2592.5 }, // 85 USD = 2592.5 EGP
        { component: 'Vitamin B2', weight: '0.0060 kg', percentage: '6%', pricePerKg: 2806 }, // 92 USD = 2806 EGP
        { component: 'Vitamin B12', weight: '0.0010 kg', percentage: '1%', pricePerKg: 3660 }, // 120 USD = 3660 EGP
        { component: 'Nicotinamide (B3)', weight: '0.0100 kg', percentage: '10%', pricePerKg: 2379 }, // 78 USD = 2379 EGP
        { component: 'Pantothenic Acid', weight: '0.0040 kg', percentage: '4%', pricePerKg: 1982.5 }, // 65 USD = 1982.5 EGP
        { component: 'Vitamin B6', weight: '0.0015 kg', percentage: '1.5%', pricePerKg: 2684 }, // 88 USD = 2684 EGP
        { component: 'Leucine', weight: '0.0300 kg', percentage: '30%', pricePerKg: 1281 }, // 42 USD = 1281 EGP
        { component: 'Threonine', weight: '0.0100 kg', percentage: '10%', pricePerKg: 1159 }, // 38 USD = 1159 EGP
        { component: 'Taurine', weight: '0.0025 kg', percentage: '2.5%', pricePerKg: 1677.5 }, // 55 USD = 1677.5 EGP
        { component: 'Glycine', weight: '0.0025 kg', percentage: '2.5%', pricePerKg: 976 }, // 32 USD = 976 EGP
        { component: 'Arginine', weight: '0.0025 kg', percentage: '2.5%', pricePerKg: 1464 }, // 48 USD = 1464 EGP
        { component: 'Cynarine', weight: '0.0025 kg', percentage: '2.5%', pricePerKg: 3507.5 } // 115 USD = 3507.5 EGP
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
      compliance: 'FDA',
      cost: { value: 54900, currency: 'EGP' }, // 1800 USD = 54900 EGP
      price: { value: 106750, currency: 'EGP' }, // 3500 USD = 106750 EGP
      removalMethod: 'LIFO',
      description: 'Antiparasitic solution for poultry',
      formula: [
        { component: 'Active Compound', weight: '0.0500 kg', percentage: '50%', pricePerKg: 6100 }, // 200 USD = 6100 EGP
        { component: 'Stabilizer', weight: '0.0250 kg', percentage: '25%', pricePerKg: 1372.5 }, // 45 USD = 1372.5 EGP
        { component: 'Solvent', weight: '0.0200 kg', percentage: '20%', pricePerKg: 915 }, // 30 USD = 915 EGP
        { component: 'Preservative', weight: '0.0050 kg', percentage: '5%', pricePerKg: 2592.5 } // 85 USD = 2592.5 EGP
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
    compliance: 'ICH Q11',
    cost: { value: 0, currency: 'EGP' },
    price: { value: 0, currency: 'EGP' },
    removalMethod: 'FIFO',
    description: '',
    formula: [],
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
      compliance: 'ICH Q11',
      cost: { value: 0, currency: 'EGP' },
      price: { value: 0, currency: 'EGP' },
      removalMethod: 'FIFO',
      description: '',
      formula: [],
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

  const handleCurrencyChange = (productId: string, field: 'cost' | 'price') => {
    const updatedProducts = products.map(product => {
      if (product.id === productId) {
        const currentValue = product[field].value;
        const newCurrency = product[field].currency === 'EGP' ? 'USD' : 'EGP';
        const exchangeRate = 30.5; // 1 USD = 30.5 EGP
        const newValue = newCurrency === 'EGP' 
          ? Math.round(currentValue * exchangeRate * 100) / 100
          : Math.round((currentValue / exchangeRate) * 100) / 100;
        
        return {
          ...product,
          [field]: {
            value: newValue,
            currency: newCurrency
          }
        };
      }
      return product;
    });
    setProducts(updatedProducts);
  };

  const formatCurrency = (value: number, currency: string) => {
    return currency === 'EGP' 
      ? `${value.toFixed(2)} EGP` 
      : `$${value.toFixed(2)}`;
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

        <ScrollArea type="always" scrollbars="vertical" style={{ height: 500 }}>
          <Flex direction="column" gap="4">
            <Grid columns="2" gap="4">
              <TextField.Root
                placeholder="Product ID"
                value={newProduct.id}
                onChange={(e) => setNewProduct({...newProduct, id: e.target.value})}
              />
              <TextField.Root
                placeholder="Product Name"
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
              <TextField.Root
                placeholder="Cost (EGP)"
                type="number"
                value={newProduct.cost.value}
                onChange={(e) => setNewProduct({
                  ...newProduct,
                  cost: {
                    ...newProduct.cost,
                    value: parseFloat(e.target.value) || 0
                  }
                })}
              />
              <TextField.Root
                placeholder="Price (EGP)"
                type="number"
                value={newProduct.price.value}
                onChange={(e) => setNewProduct({
                  ...newProduct,
                  price: {
                    ...newProduct.price,
                    value: parseFloat(e.target.value) || 0
                  }
                })}
              />
            </Grid>

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

            <Separator size="4" />

            <Heading size="4">Production Design Information</Heading>

            <Flex direction="column" gap="3">
              <Text weight="bold">Packaging Shape</Text>
              <RadioGroup.Root
                value={newProduct.productionDesign.packagingShape}
                onValueChange={(value) => setNewProduct({
                  ...newProduct,
                  productionDesign: {
                    ...newProduct.productionDesign,
                    packagingShape: value
                  }
                })}
              >
                <Flex gap="3">
                  <Text as="label" size="2">
                    <Flex gap="2">
                      <RadioGroup.Item value="Round" /> Round
                    </Flex>
                  </Text>
                  <Text as="label" size="2">
                    <Flex gap="2">
                      <RadioGroup.Item value="Rectangular" /> Rectangular
                    </Flex>
                  </Text>
                  <Text as="label" size="2">
                    <Flex gap="2">
                      <RadioGroup.Item value="Oval" /> Oval
                    </Flex>
                  </Text>
                  <Text as="label" size="2">
                    <Flex gap="2">
                      <RadioGroup.Item value="Custom" /> Custom
                    </Flex>
                  </Text>
                </Flex>
              </RadioGroup.Root>

              <Flex direction="column" gap="2">
                <Text weight="bold">Packaging Type</Text>
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
                    <Select.Item value="Scroll">Scroll</Select.Item>
                    <Select.Item value="Sachet">Sachet</Select.Item>
                    <Select.Item value="Tube">Tube</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Flex>

              <Flex direction="column" gap="2">
                <Text weight="bold">Cap Type</Text>
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

              <Flex direction="column" gap="2">
                <Text weight="bold">Product Specifications</Text>
                <Grid columns="2" gap="3">
                  <TextField.Root
                    placeholder="Viscosity"
                    value={newProduct.productionDesign.viscosity}
                    onChange={(e) => setNewProduct({
                      ...newProduct,
                      productionDesign: {
                        ...newProduct.productionDesign,
                        viscosity: e.target.value
                      }
                    })}
                  />
                  <TextField.Root
                    placeholder="pH Level"
                    value={newProduct.productionDesign.pH}
                    onChange={(e) => setNewProduct({
                      ...newProduct,
                      productionDesign: {
                        ...newProduct.productionDesign,
                        pH: e.target.value
                      }
                    })}
                  />
                </Grid>
                <Flex align="center" gap="2">
                  <Checkbox
                    checked={newProduct.productionDesign.plasticReactivity === 'Yes'}
                    onCheckedChange={(checked) => setNewProduct({
                      ...newProduct,
                      productionDesign: {
                        ...newProduct.productionDesign,
                        plasticReactivity: checked ? 'Yes' : 'No'
                      }
                    })}
                  />
                  <Text>Reactive with plastic</Text>
                </Flex>
                <TextField.Root
                  placeholder="Filling Temperature (°C)"
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
            </Flex>

            <Flex gap="3" justify="end" mt="4">
              <Button variant="soft" color="gray" onClick={() => setNewConfigModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddProduct}>
                <PlusIcon /> Add Configuration
              </Button>
            </Flex>
          </Flex>
        </ScrollArea>
      </Dialog.Content>
    </Dialog.Root>
  );

  const ViewSpecModal = () => (
    <Dialog.Root open={viewSpecModalOpen} onOpenChange={setViewSpecModalOpen}>
      <Dialog.Content style={{ maxWidth: 800 }}>
        <Flex justify="between" align="center" mb="5">
          <Dialog.Title>Product Specification</Dialog.Title>
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
                <Text color="gray">Product ID</Text>
                <Text weight="bold">{selectedProduct.id}</Text>
              </Flex>
              <Flex direction="column" gap="1">
                <Text color="gray">Compliance Standard</Text>
                <Badge variant="soft">{selectedProduct.compliance}</Badge>
              </Flex>
            </Grid>

            <Flex direction="column" gap="1">
              <Text color="gray">Description</Text>
              <Text>{selectedProduct.description}</Text>
            </Flex>

            <Flex direction="column" gap="2">
              <Text weight="bold">Financial Information</Text>
              <Grid columns="2" gap="3">
                <Flex direction="column" gap="1">
                  <Text color="gray">Production Cost</Text>
                  <Text weight="bold">{formatCurrency(selectedProduct.cost.value, selectedProduct.cost.currency)}</Text>
                </Flex>
                <Flex direction="column" gap="1">
                  <Text color="gray">Selling Price</Text>
                  <Text weight="bold">{formatCurrency(selectedProduct.price.value, selectedProduct.price.currency)}</Text>
                </Flex>
              </Grid>
            </Flex>

            <Flex direction="column" gap="2">
              <Text weight="bold">Formula Composition</Text>
              <Table.Root variant="surface">
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeaderCell>Component</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Weight</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Percentage</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Price per kg</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {selectedProduct.formula.map((comp: any, i: number) => (
                    <Table.Row key={i}>
                      <Table.Cell>{comp.component}</Table.Cell>
                      <Table.Cell>{comp.weight}</Table.Cell>
                      <Table.Cell>{comp.percentage}</Table.Cell>
                      <Table.Cell>{formatCurrency(comp.pricePerKg, 'EGP')}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Flex>

            <Flex direction="column" gap="2">
              <Text weight="bold">Production Design</Text>
              <Grid columns="2" gap="3">
                <Flex direction="column" gap="1">
                  <Text color="gray">Packaging Shape</Text>
                  <Text>{selectedProduct.productionDesign.packagingShape}</Text>
                </Flex>
                <Flex direction="column" gap="1">
                  <Text color="gray">Packaging Type</Text>
                  <Text>{selectedProduct.productionDesign.packagingType}</Text>
                </Flex>
                <Flex direction="column" gap="1">
                  <Text color="gray">Cap Type</Text>
                  <Text>{selectedProduct.productionDesign.capType}</Text>
                </Flex>
                <Flex direction="column" gap="1">
                  <Text color="gray">Viscosity</Text>
                  <Text>{selectedProduct.productionDesign.viscosity}</Text>
                </Flex>
                <Flex direction="column" gap="1">
                  <Text color="gray">pH Level</Text>
                  <Text>{selectedProduct.productionDesign.pH}</Text>
                </Flex>
                <Flex direction="column" gap="1">
                  <Text color="gray">Plastic Reactivity</Text>
                  <Text>{selectedProduct.productionDesign.plasticReactivity}</Text>
                </Flex>
                <Flex direction="column" gap="1">
                  <Text color="gray">Filling Temperature</Text>
                  <Text>{selectedProduct.productionDesign.fillingTemp}</Text>
                </Flex>
              </Grid>
            </Flex>

            <Flex direction="column" gap="2">
              <Text weight="bold">EDA Compliance</Text>
              <Grid columns="3" gap="3">
                <Flex direction="column" gap="1">
                  <Text color="gray">Stability</Text>
                  <Text>{selectedProduct.eda.stability}</Text>
                </Flex>
                <Flex direction="column" gap="1">
                  <Text color="gray">Storage</Text>
                  <Text>{selectedProduct.eda.storage}</Text>
                </Flex>
                <Flex direction="column" gap="1">
                  <Text color="gray">Impurities</Text>
                  <Text>{selectedProduct.eda.impurities}</Text>
                </Flex>
              </Grid>
            </Flex>
          </Flex>
        )}
      </Dialog.Content>
    </Dialog.Root>
  );

  const filteredProducts = products.filter(product =>
    product.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box p="6">
      <NewConfigurationModal />
      <ViewSpecModal />

      <Flex justify="between" align="center" mb="5">
        <Heading size="6">Pharmaceutical Product Configuration</Heading>
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
          <Button variant="soft" onClick={() => setNewConfigModalOpen(true)}>
            <PlusIcon /> New Configuration
          </Button>
        </Flex>
      </Flex>

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Product ID</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Components</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Cost (EGP)</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Price (EGP)</Table.ColumnHeaderCell>
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
                <Flex align="center" gap="2">
                  {formatCurrency(product.cost.value, product.cost.currency)}
                  <Button 
                    size="1" 
                    variant="soft"
                    onClick={() => handleCurrencyChange(product.id, 'cost')}
                  >
                    {product.cost.currency === 'EGP' ? 'USD' : 'EGP'}
                  </Button>
                </Flex>
              </Table.Cell>
              <Table.Cell>
                <Flex align="center" gap="2">
                  {formatCurrency(product.price.value, product.price.currency)}
                  <Button 
                    size="1" 
                    variant="soft"
                    onClick={() => handleCurrencyChange(product.id, 'price')}
                  >
                    {product.price.currency === 'EGP' ? 'USD' : 'EGP'}
                  </Button>
                </Flex>
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
                  <FileTextIcon /> View
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
