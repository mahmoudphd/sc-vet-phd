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
  Dialog,
  Select,
} from '@radix-ui/themes';
import { Pencil2Icon } from '@radix-ui/react-icons';
import { useState } from 'react';

const FinishedGoodsInventory = () => {
  const [products, setProducts] = useState([
    {
      id: 'FG001',
      name: 'Poultry Product A',
      quantity: 150,
      location: 'Warehouse 1',
      status: 'Available',
    },
    {
      id: 'FG002',
      name: 'Poultry Product B',
      quantity: 80,
      location: 'Warehouse 2',
      status: 'Reserved',
    },
    {
      id: 'FG003',
      name: 'Poultry Product C',
      quantity: 200,
      location: 'Warehouse 1',
      status: 'Available',
    },
  ]);

  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const handleUpdate = () => {
    setProducts((prev) =>
      prev.map((p) => (p.id === selectedItem.id ? selectedItem : p))
    );
    setOpen(false);
  };

  return (
    <Card>
      <Flex direction="column" gap="4">
        <Heading size="6">Finished Goods Inventory</Heading>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Quantity</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Location</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {products.map((product) => (
              <Table.Row key={product.id}>
                <Table.RowHeaderCell>{product.id}</Table.RowHeaderCell>
                <Table.Cell>{product.name}</Table.Cell>
                <Table.Cell>{product.quantity}</Table.Cell>
                <Table.Cell>{product.location}</Table.Cell>
                <Table.Cell>
                  <Badge color={product.status === 'Available' ? 'green' : 'orange'}>
                    {product.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <Button
                    size="1"
                    variant="outline"
                    onClick={() => {
                      setSelectedItem(product);
                      setOpen(true);
                    }}
                  >
                    <Pencil2Icon />
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Flex>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Content style={{ maxWidth: 500 }}>
          <Dialog.Title>Edit Product</Dialog.Title>
          <Flex direction="column" gap="3" mt="4">
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Name
              </Text>
              <TextField
                value={selectedItem?.name || ''}
                onChange={(e) =>
                  setSelectedItem({ ...selectedItem, name: e.target.value })
                }
              />
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Quantity
              </Text>
              <TextField
                type="number"
                value={selectedItem?.quantity?.toString() || ''}
                onChange={(e) =>
                  setSelectedItem({
                    ...selectedItem,
                    quantity: parseInt(e.target.value),
                  })
                }
              />
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Location
              </Text>
              <TextField
                value={selectedItem?.location || ''}
                onChange={(e) =>
                  setSelectedItem({ ...selectedItem, location: e.target.value })
                }
              />
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Status
              </Text>
              <Select.Root
                value={selectedItem?.status || ''}
                onValueChange={(value) =>
                  setSelectedItem({ ...selectedItem, status: value })
                }
              >
                <Select.Trigger />
                <Select.Content>
                  <Select.Item value="Available">Available</Select.Item>
                  <Select.Item value="Reserved">Reserved</Select.Item>
                  <Select.Item value="Out of Stock">Out of Stock</Select.Item>
                </Select.Content>
              </Select.Root>
            </label>
          </Flex>

          <Flex gap="3" mt="4" justify="end">
            <Button variant="soft" color="gray" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Save</Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Card>
  );
};

export default FinishedGoodsInventory;
