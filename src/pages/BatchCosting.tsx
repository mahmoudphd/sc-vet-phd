// src/pages/BatchCosting.tsx

import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  Flex,
  Grid,
  Heading,
  Table,
  Text,
  TextField,
} from '@radix-ui/themes';

interface CostItem {
  name: string;
  value: number;
}

interface ComponentItem {
  name: string;
  qty: number;
  unit: string;
  unitPrice: number;
  cost: number;
}

const BatchCosting: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [components, setComponents] = useState<ComponentItem[]>([
    { name: 'Vitamin A', qty: 2, unit: 'kg', unitPrice: 100, cost: 200 },
    { name: 'Vitamin B1', qty: 1, unit: 'kg', unitPrice: 540, cost: 540 },
  ]);
  const calculateTotalCost = () => {
    return components.reduce((sum, item) => sum + item.cost, 0);
  };

  const handleComponentChange = (
    index: number,
    field: keyof ComponentItem,
    value: string
  ) => {
    const updatedComponents = [...components];
    const updatedItem = { ...updatedComponents[index] };

    if (field === 'qty' || field === 'unitPrice') {
      updatedItem[field] = parseFloat(value) || 0;
    } else {
      (updatedItem[field] as any) = value;
    }

    updatedItem.cost = updatedItem.qty * updatedItem.unitPrice;
    updatedComponents[index] = updatedItem;
    setComponents(updatedComponents);
  };

  const addComponent = () => {
    setComponents([
      ...components,
      { name: '', qty: 0, unit: 'kg', unitPrice: 0, cost: 0 },
    ]);
  };
  return (
    <Box p="4">
      <Heading size="6" mb="4">Batch Costing</Heading>

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Quantity</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Unit</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Unit Price</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Cost</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {components.map((item, index) => (
            <Table.Row key={index}>
              <Table.Cell>
                <TextField.Root
                  value={item.name}
                  onChange={(e) =>
                    handleComponentChange(index, 'name', e.target.value)
                  }
                />
              </Table.Cell>
              <Table.Cell>
                <TextField.Root
                  type="number"
                  value={item.qty}
                  onChange={(e) =>
                    handleComponentChange(index, 'qty', e.target.value)
                  }
                />
              </Table.Cell>
              <Table.Cell>
                <TextField.Root
                  value={item.unit}
                  onChange={(e) =>
                    handleComponentChange(index, 'unit', e.target.value)
                  }
                />
              </Table.Cell>
              <Table.Cell>
                <TextField.Root
                  type="number"
                  value={item.unitPrice}
                  onChange={(e) =>
                    handleComponentChange(index, 'unitPrice', e.target.value)
                  }
                />
              </Table.Cell>
              <Table.Cell>
                <Text>{item.cost.toFixed(2)}</Text>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      <Flex mt="3" gap="3">
        <Button onClick={addComponent}>Add Component</Button>
        <Text>Total Cost: {calculateTotalCost().toFixed(2)}</Text>
      </Flex>
    </Box>
  );
};

export default BatchCosting;
