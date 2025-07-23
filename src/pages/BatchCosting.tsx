import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

const ingredients = [
  'Vitamin B1',
  'Vitamin B2',
  'Vitamin B12',
  'Pantothenic Acid',
  'Vitamin B6',
  'Leucine',
  'Taurine',
  'Glycine',
];

const incentivesOptions = [
  'Greater volumes',
  'Longer contracts',
  'Technical support',
  'Marketing support',
];

const criticalityLevels = ['Low', 'Medium', 'High'];

export default function OpenBookAccounting() {
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Open Book Accounting Dashboard</h1>

      {/* Tabs on the right */}
      <div className="flex justify-end gap-4">
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Supplier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="supplier1">Supplier 1</SelectItem>
            <SelectItem value="supplier2">Supplier 2</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Product" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="product1">Product A</SelectItem>
            <SelectItem value="product2">Product B</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select Currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="usd">USD</SelectItem>
            <SelectItem value="egp">EGP</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Header Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-blue-100 border-blue-300 shadow">
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Supplier Tier</p>
            <p className="font-semibold">Tier 1</p>
          </CardContent>
        </Card>
        <Card className="bg-green-100 border-green-300 shadow">
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Transaction Volume</p>
            <p className="font-semibold">250,000 EGP</p>
          </CardContent>
        </Card>
        <Card className="bg-yellow-100 border-yellow-300 shadow">
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Component Criticality</p>
            <Select>
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select Criticality" />
              </SelectTrigger>
              <SelectContent>
                {criticalityLevels.map((level) => (
                  <SelectItem key={level} value={level.toLowerCase()}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        <Card className="bg-purple-100 border-purple-300 shadow">
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Supplier Incentives Offered</p>
            <Select>
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select Incentive" />
              </SelectTrigger>
              <SelectContent>
                {incentivesOptions.map((option) => (
                  <SelectItem key={option} value={option.toLowerCase().replace(/\s+/g, '-')}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {/* Editable Table */}
      <div className="overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Component</TableHead>
              <TableHead>Declared Price</TableHead>
              <TableHead>Actual Cost</TableHead>
              <TableHead>Variance</TableHead>
              <TableHead>Incentives</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ingredients.map((ingredient, index) => (
              <TableRow key={index}>
                <TableCell>{ingredient}</TableCell>
                <TableCell>
                  <input
                    type="number"
                    className="border p-1 w-24 rounded"
                    placeholder="EGP"
                  />
                </TableCell>
                <TableCell>
                  <input
                    type="number"
                    className="border p-1 w-24 rounded"
                    placeholder="EGP"
                  />
                </TableCell>
                <TableCell>
                  <input
                    type="number"
                    className="border p-1 w-24 rounded"
                    placeholder="EGP"
                  />
                </TableCell>
                <TableCell>
                  <Select>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {incentivesOptions.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
