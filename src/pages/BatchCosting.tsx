// src/pages/BatchCosting.tsx

import React, { useState } from 'react';
import { Select, SelectItem } from '@radix-ui/themes';
import { Button } from '@radix-ui/themes';
import { Table } from '@radix-ui/themes';
import { Card } from '@radix-ui/themes';
import { TextField } from '@radix-ui/themes';

const componentOptions = [
  'Vitamin B1',
  'Vitamin B2',
  'Vitamin B12',
  'Pantothenic Acid',
  'Vitamin B6',
  'Leucine',
  'Taurine',
  'Glycine',
];

const criticalityOptions = ['High', 'Medium', 'Low'];
const incentiveOptions = [
  'Greater volumes',
  'Longer contracts',
  'Technical support',
  'Marketing support',
];

const BatchCosting = () => {
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [currency, setCurrency] = useState('EGP');

  const [tableData, setTableData] = useState([
    {
      component: 'Vitamin B1',
      declaredPrice: '',
      actualCost: '',
      variance: '',
      incentive: '',
    },
  ]);

  const handleInputChange = (index: number, field: string, value: string) => {
    const updatedData = [...tableData];
    updatedData[index][field] = value;
    setTableData(updatedData);
  };

  const addRow = () => {
    setTableData([
      ...tableData,
      {
        component: '',
        declaredPrice: '',
        actualCost: '',
        variance: '',
        incentive: '',
      },
    ]);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header Dropdowns */}
      <div className="flex justify-end gap-4">
        <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
          <Select.Trigger placeholder="Select Supplier" />
          <Select.Content>
            <SelectItem value="Supplier A">Supplier A</SelectItem>
            <SelectItem value="Supplier B">Supplier B</SelectItem>
          </Select.Content>
        </Select>

        <Select value={selectedProduct} onValueChange={setSelectedProduct}>
          <Select.Trigger placeholder="Select Product" />
          <Select.Content>
            <SelectItem value="Product X">Product X</SelectItem>
            <SelectItem value="Product Y">Product Y</SelectItem>
          </Select.Content>
        </Select>

        <Select value={currency} onValueChange={setCurrency}>
          <Select.Trigger placeholder="Select Currency" />
          <Select.Content>
            <SelectItem value="EGP">EGP</SelectItem>
            <SelectItem value="USD">USD</SelectItem>
          </Select.Content>
        </Select>
      </div>

      {/* KPIs Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-blue-100 p-4 rounded-2xl shadow">
          <h3 className="font-semibold">Supplier Tier</h3>
          <Select defaultValue="Tier 1">
            <Select.Trigger />
            <Select.Content>
              <SelectItem value="Tier 1">Tier 1</SelectItem>
              <SelectItem value="Tier 2">Tier 2</SelectItem>
              <SelectItem value="Tier 3">Tier 3</SelectItem>
            </Select.Content>
          </Select>
        </Card>
        <Card className="bg-green-100 p-4 rounded-2xl shadow">
          <h3 className="font-semibold">Transaction Volume</h3>
          <TextField.Input placeholder="Enter volume" />
        </Card>
        <Card className="bg-yellow-100 p-4 rounded-2xl shadow">
          <h3 className="font-semibold">Component Criticality</h3>
          <Select>
            <Select.Trigger placeholder="Select" />
            <Select.Content>
              {criticalityOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </Select.Content>
          </Select>
        </Card>
        <Card className="bg-red-100 p-4 rounded-2xl shadow">
          <h3 className="font-semibold">Supplier Incentives</h3>
          <Select>
            <Select.Trigger placeholder="Select" />
            <Select.Content>
              {incentiveOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </Select.Content>
          </Select>
        </Card>
      </div>

      {/* Editable Table */}
      <div>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Component</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Declared Price</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Actual Cost</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Variance</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Incentives</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {tableData.map((row, index) => (
              <Table.Row key={index}>
                <Table.Cell>
                  <Select
                    value={row.component}
                    onValueChange={(val) => handleInputChange(index, 'component', val)}
                  >
                    <Select.Trigger />
                    <Select.Content>
                      {componentOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </Select.Content>
                  </Select>
                </Table.Cell>
                <Table.Cell>
                  <TextField.Input
                    value={row.declaredPrice}
                    onChange={(e) =>
                      handleInputChange(index, 'declaredPrice', e.target.value)
                    }
                  />
                </Table.Cell>
                <Table.Cell>
                  <TextField.Input
                    value={row.actualCost}
                    onChange={(e) =>
                      handleInputChange(index, 'actualCost', e.target.value)
                    }
                  />
                </Table.Cell>
                <Table.Cell>
                  <TextField.Input
                    value={row.variance}
                    onChange={(e) =>
                      handleInputChange(index, 'variance', e.target.value)
                    }
                  />
                </Table.Cell>
                <Table.Cell>
                  <Select
                    value={row.incentive}
                    onValueChange={(val) => handleInputChange(index, 'incentive', val)}
                  >
                    <Select.Trigger />
                    <Select.Content>
                      {incentiveOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </Select.Content>
                  </Select>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>

        <div className="mt-4">
          <Button onClick={addRow}>Add Row</Button>
        </div>
      </div>
    </div>
  );
};

export default BatchCosting;
