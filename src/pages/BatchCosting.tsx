// src/pages/BatchCosting.tsx

import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  Flex,
  Grid,
  Heading,
  Select,
  Table,
  Text,
  Card,
  Progress,
} from '@radix-ui/themes';

interface MaterialItem {
  name: string;
  composition: number;
  pricePerKg: number;
  cost: number;
}

const rawMaterials: MaterialItem[] = [
  { name: 'Vitamin B1', composition: 0.001, pricePerKg: 540, cost: 0.54 },
  { name: 'Vitamin B2', composition: 0.006, pricePerKg: 600, cost: 3.6 },
  { name: 'Vitamin B12', composition: 0.001, pricePerKg: 2300, cost: 2.3 },
  { name: 'Nicotinamide B3', composition: 0.04, pricePerKg: 300, cost: 12 },
  { name: 'Vitamin B6', composition: 0.003, pricePerKg: 650, cost: 1.95 },
  { name: 'Vitamin E', composition: 0.001, pricePerKg: 900, cost: 0.9 },
  { name: 'Vitamin A', composition: 0.001, pricePerKg: 820, cost: 0.82 },
  { name: 'Vitamin D3', composition: 0.00025, pricePerKg: 2500, cost: 0.625 },
  { name: 'Vitamin K3', composition: 0.0015, pricePerKg: 450, cost: 0.675 },
  { name: 'Folic Acid', composition: 0.0002, pricePerKg: 1600, cost: 0.32 },
  { name: 'Biotin', composition: 0.00005, pricePerKg: 12500, cost: 0.625 },
  { name: 'Sodium Selenite', composition: 0.00015, pricePerKg: 2600, cost: 0.39 },
];

const BatchCosting = () => {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('EGP');

  const actualCost = rawMaterials.reduce((acc, item) => acc + item.cost, 0);
  const targetCost = 40; // example
  const benchmarkPrice = 42;
  const optimizedCost = 36;
  const profitMargin = 20;
  const progressToTarget = Math.min(100, Math.round((targetCost / actualCost) * 100));

  const formatCurrency = (value: number) => {
    const currency = selectedCurrency === 'USD' ? '$' : 'EGP ';
    return `${currency}${value.toFixed(2)}`;
  };

  const exportReport = () => {
    console.log('Exporting report...');
  };
          <Text as="span" color="gray">
            {item.solution || 'No solution selected'}
          </Text>
        </Table.Cell>
        <Table.Cell>
          <Button onClick={() => handleViewDetails(category)}>View Details</Button>
        </Table.Cell>
      </Table.Row>
    ))}
  </Table.Body>
</Table>

{selectedCategory && (
  <CostBreakdownDialog
    category={selectedCategory}
    open={dialogOpen}
    onClose={() => {
      setDialogOpen(false);
      setSelectedCategory(null);
    }}
    onSave={(updatedItems) => handleBreakdownSave(selectedCategory, updatedItems)}
    autoMode={autoModes[selectedCategory]}
    setAutoMode={(value) =>
      setAutoModes((prev) => ({
        ...prev,
        [selectedCategory]: value,
      }))
    }
  />
)}

<Button mt="4" onClick={handleSubmitAll} size="3">
  Submit All
</Button>
</Box>
);
}
