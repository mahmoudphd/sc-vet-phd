// src/pages/BatchCosting.tsx
import React from "react";
import { Select } from "@radix-ui/themes";
import { Card } from "@radix-ui/themes";
import { Table } from "@radix-ui/themes";
import { Button } from "@/components/ui/button";

const componentsList = [
  "Vitamin B1",
  "Vitamin B2",
  "Vitamin B12",
  "Pantothenic Acid",
  "Vitamin B6",
  "Leucine",
  "Taurine",
  "Glycine",
];

const incentivesList = [
  "Greater volumes",
  "Longer contracts",
  "Technical support",
  "Marketing support",
];

const criticalityList = ["High", "Medium", "Low"];

export default function BatchCosting() {
  return (
    <div className="p-4">
      {/* Top Tabs Section */}
      <div className="flex justify-end space-x-4 mb-4">
        <Select.Root defaultValue="Supplier A">
          <Select.Trigger className="bg-blue-100 text-blue-800 font-semibold rounded px-4 py-2">
            Select Supplier
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="Supplier A">Supplier A</Select.Item>
            <Select.Item value="Supplier B">Supplier B</Select.Item>
          </Select.Content>
        </Select.Root>

        <Select.Root defaultValue="Product X">
          <Select.Trigger className="bg-green-100 text-green-800 font-semibold rounded px-4 py-2">
            Select Product
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="Product X">Product X</Select.Item>
            <Select.Item value="Product Y">Product Y</Select.Item>
          </Select.Content>
        </Select.Root>

        <Select.Root defaultValue="USD">
          <Select.Trigger className="bg-purple-100 text-purple-800 font-semibold rounded px-4 py-2">
            Select Currency
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="USD">USD</Select.Item>
            <Select.Item value="EGP">EGP</Select.Item>
          </Select.Content>
        </Select.Root>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-blue-50 border border-blue-200">
          <div className="text-sm text-gray-500">Supplier Tier</div>
          <div className="font-bold text-lg">Tier 1</div>
        </Card>
        <Card className="p-4 bg-green-50 border border-green-200">
          <div className="text-sm text-gray-500">Transaction Volume</div>
          <div className="font-bold text-lg">12000 units</div>
        </Card>
        <Card className="p-4 bg-yellow-50 border border-yellow-200">
          <div className="text-sm text-gray-500">Component Criticality</div>
          <Select.Root defaultValue="High">
            <Select.Trigger className="bg-yellow-100 text-yellow-800 mt-2 rounded px-3 py-1 w-full">
              Select Criticality
            </Select.Trigger>
            <Select.Content>
              {criticalityList.map((level) => (
                <Select.Item key={level} value={level}>
                  {level}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </Card>
        <Card className="p-4 bg-pink-50 border border-pink-200">
          <div className="text-sm text-gray-500">Supplier Incentives Offered</div>
          <Select.Root defaultValue="Greater volumes">
            <Select.Trigger className="bg-pink-100 text-pink-800 mt-2 rounded px-3 py-1 w-full">
              Select Incentive
            </Select.Trigger>
            <Select.Content>
              {incentivesList.map((item) => (
                <Select.Item key={item} value={item}>
                  {item}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </Card>
      </div>

      {/* Table Section */}
      <Table.Root className="w-full border border-gray-200">
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
          {componentsList.map((component, idx) => (
            <Table.Row key={idx}>
              <Table.Cell>
                <Select.Root defaultValue={component}>
                  <Select.Trigger className="bg-white text-black border rounded px-2 py-1 w-full">
                    {component}
                  </Select.Trigger>
                  <Select.Content>
                    {componentsList.map((item) => (
                      <Select.Item key={item} value={item}>
                        {item}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </Table.Cell>
              <Table.Cell>
                <input
                  type="number"
                  className="border p-1 w-full rounded"
                  placeholder="Declared Price"
                />
              </Table.Cell>
              <Table.Cell>
                <input
                  type="number"
                  className="border p-1 w-full rounded"
                  placeholder="Actual Cost"
                />
              </Table.Cell>
              <Table.Cell>
                <input
                  type="number"
                  className="border p-1 w-full rounded"
                  placeholder="Variance"
                />
              </Table.Cell>
              <Table.Cell>
                <Select.Root defaultValue={incentivesList[0]}>
                  <Select.Trigger className="bg-white text-black border rounded px-2 py-1 w-full">
                    Select
                  </Select.Trigger>
                  <Select.Content>
                    {incentivesList.map((item) => (
                      <Select.Item key={item} value={item}>
                        {item}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <div className="mt-6 text-end">
        <Button>Submit</Button>
      </div>
    </div>
  );
}
