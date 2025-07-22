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
      <Flex justify="between" align="center" mb="4">
        <Heading as="h2" size="4">
          Open Book Accounting Analysis Overview
        </Heading>
        <Flex gap="3">
          <Select.Root value={selectedProduct} onValueChange={setSelectedProduct}>
            <Select.Trigger placeholder="Select Product" />
            <Select.Content>
              <Select.Item value="Poultry Feed">Poultry Feed</Select.Item>
              <Select.Item value="Cattle Feed">Cattle Feed</Select.Item>
              <Select.Item value="Fish Feed">Fish Feed</Select.Item>
            </Select.Content>
          </Select.Root>

          <Select.Root value={selectedCurrency} onValueChange={setSelectedCurrency}>
            <Select.Trigger placeholder="Currency" />
            <Select.Content>
              <Select.Item value="EGP">EGP</Select.Item>
              <Select.Item value="USD">USD</Select.Item>
            </Select.Content>
          </Select.Root>

          <Button onClick={exportReport}>Export Report</Button>
        </Flex>
      </Flex>

      <Grid columns="3" gap="4" mb="5">
        <Card>
          <Text size="2">Actual Cost</Text>
          <Text weight="bold">{formatCurrency(actualCost)}</Text>
        </Card>
        <Card>
          <Text size="2">Target Cost</Text>
          <Text weight="bold">{formatCurrency(targetCost)}</Text>
        </Card>
        <Card>
          <Text size="2">Benchmark Price</Text>
          <Text weight="bold">{formatCurrency(benchmarkPrice)}</Text>
        </Card>
      </Grid>

      <Grid columns="3" gap="4" mb="5">
        <Card>
          <Text size="2">Post-Optimization Estimate</Text>
          <Text weight="bold">{formatCurrency(optimizedCost)}</Text>
        </Card>
        <Card>
          <Text size="2">Progress to Target</Text>
          <Progress value={progressToTarget} />
          <Text size="1">{progressToTarget}%</Text>
        </Card>
        <Card>
          <Text size="2">Profit Margin</Text>
          <Text weight="bold">{profitMargin}%</Text>
        </Card>
      </Grid>
                  </Select.Root>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
        <Box mt="3" style={{ textAlign: 'right' }}>
          <Text weight="bold">
            Total: {formatCurrency(data.reduce((acc, item) => acc + item.cost, 0))}
          </Text>
        </Box>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default BatchCosting;
