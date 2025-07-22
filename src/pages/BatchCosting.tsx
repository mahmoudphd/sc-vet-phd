// src/pages/OpenBookAccountingAnalytics.tsx

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
} from '@radix-ui/themes';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const packagingTypes = ['Pump', 'Floater', 'Scroll'];
const capTypes = ['Safety Seal'];
const bottleShapes = ['Round', 'Rectangular'];
const machineTypes = ['Automatic', 'Semi-Automatic', 'PLC Controlled'];

const OpenBookAccountingAnalytics = () => {
  const [selectedPackaging, setSelectedPackaging] = useState('Pump');
  const [selectedCap, setSelectedCap] = useState('Safety Seal');
  const [selectedShape, setSelectedShape] = useState('Round');
  const [selectedMachine, setSelectedMachine] = useState('Automatic');
  const rawMaterials = [
    { name: 'Vitamin B1', composition: 0.001, unitPrice: 540, cost: 0.54 },
    { name: 'Vitamin B2', composition: 0.006, unitPrice: 600, cost: 3.6 },
    { name: 'Vitamin B12', composition: 0.001, unitPrice: 2300, cost: 2.3 },
    { name: 'Nicotinamide B3', composition: 0.012, unitPrice: 315, cost: 3.78 },
    { name: 'Vitamin B5', composition: 0.01, unitPrice: 255, cost: 2.55 },
    { name: 'Vitamin B6', composition: 0.001, unitPrice: 550, cost: 0.55 },
    { name: 'Biotin B7', composition: 0.0002, unitPrice: 72000, cost: 14.4 },
    { name: 'Folic Acid B9', composition: 0.0002, unitPrice: 4750, cost: 0.95 },
    { name: 'Zinc Gluconate', composition: 0.03, unitPrice: 230, cost: 6.9 },
    { name: 'Honey Base', composition: 0.3, unitPrice: 48, cost: 14.4 },
    { name: 'Orange Flavor', composition: 0.01, unitPrice: 120, cost: 1.2 },
    { name: 'Sucralose', composition: 0.001, unitPrice: 1000, cost: 1 },
    { name: 'Sodium Benzoate', composition: 0.002, unitPrice: 30, cost: 0.06 },
    { name: 'Citric Acid', composition: 0.005, unitPrice: 40, cost: 0.2 },
    { name: 'Purified Water', composition: 0.62, unitPrice: 1, cost: 0.62 },
  ];
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Item</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Type</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Value</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Cost</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Disclosure</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {productDetails.map((item, index) => (
              <Table.Row key={index}>
                <Table.Cell>{item.name}</Table.Cell>
                <Table.Cell>{item.type}</Table.Cell>
                <Table.Cell>{item.value}</Table.Cell>
                <Table.Cell>
                  {item.type === 'Cost' ? formatCurrency(item.cost, selectedCurrency) : '-'}
                </Table.Cell>
                <Table.Cell>
                  <RadixSelect.Root
                    value={item.disclosure}
                    onValueChange={(value) =>
                      handleUpdateProductDetail(index, 'disclosure', value)
                    }
                  >
                    <RadixSelect.Trigger />
                    <RadixSelect.Content>
                      <RadixSelect.Item value="Supplier">Supplier</RadixSelect.Item>
                      <RadixSelect.Item value="Manufacturer">Manufacturer</RadixSelect.Item>
                    </RadixSelect.Content>
                  </RadixSelect.Root>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>

        <Box mt="4">
          <Button onClick={handleSubmitToBlockchain} color="green" size="3">
            Submit to Blockchain
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default OpenBookAccountingView;
