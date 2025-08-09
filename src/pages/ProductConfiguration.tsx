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
  ScrollArea
} from '@radix-ui/themes';
import {
  PlusIcon,
  FileTextIcon,
  Cross2Icon,
  Pencil2Icon,
  CubeIcon,
  MagnifyingGlassIcon,
  CurrencyDollarIcon
} from '@radix-ui/react-icons';
import { useState } from 'react';

const ProductConfiguration = () => {
  // Sample products data with detailed vitamin components
  const [products, setProducts] = useState([
    {
      id: 'DRG-045',
      name: 'Poultry Drug A',
      components: 12,
      status: 'Approved',
      version: 'v2.1',
      compliance: 'ICH Q11',
      cost: { value: 1500, currency: 'USD' },
      price: { value: 3200, currency: 'USD' },
      removalMethod: 'FIFO', // Kept original removal method
      description: 'Vitamin complex for poultry nutrition',
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
      }
    },
    {
      id: 'DRG-046',
      name: 'Poultry Drug B',
      components: 8,
      status: 'Draft',
      version: 'v1.3',
      compliance: 'FDA',
      cost: { value: 1800, currency: 'USD' },
      price: { value: 3500, currency: 'USD' },
      removalMethod: 'LIFO', // Kept original removal method
      description: 'Antiparasitic solution for poultry',
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
      }
    }
  ]);

  const [editingField, setEditingField] = useState<{
    productId: string;
    field: 'cost' | 'price';
    value: string;
    currency: 'USD' | 'EGP';
  } | null>(null);

  const [newConfigModalOpen, setNewConfigModalOpen] = useState(false);
  const [viewSpecModalOpen, setViewSpecModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Current exchange rate
  const exchangeRate = 30.5; // 1 USD = 30.5 EGP

  const handleCurrencyChange = (productId: string, field: 'cost' | 'price') => {
    const updatedProducts = products.map(product => {
      if (product.id === productId) {
        const currentValue = product[field].value;
        const newCurrency = product[field].currency === 'USD' ? 'EGP' : 'USD';
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
    return currency === 'USD' 
      ? `$${value.toFixed(2)}` 
      : `${Math.round(value).toFixed(2)} EGP`;
  };

  return (
    <Box p="6">
      <Flex justify="between" align="center" mb="5">
        <Heading size="6">Product Configuration Dashboard</Heading>
        <Flex gap="3">
          <Button variant="soft" onClick={() => setNewConfigModalOpen(true)}>
            <PlusIcon /> New Configuration
          </Button>
        </Flex>
      </Flex>

      {/* Products Table */}
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Product ID</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Components</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Cost</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Price</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Removal Method</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {products.map(product => (
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
                    {product.cost.currency === 'USD' ? 'EGP' : 'USD'}
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
                    {product.price.currency === 'USD' ? 'EGP' : 'USD'}
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
                  <FileTextIcon /> View Spec
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      {/* View Specification Modal */}
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
                        <Table.Cell>${comp.pricePerKg}</Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
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
    </Box>
  );
};

export default ProductConfiguration;
