// src/pages/OpenBookAccountingOverview.tsx
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';

const suppliers = ['Supplier A', 'Supplier B', 'Supplier C'];
const products = ['Product X', 'Product Y', 'Product Z'];
const currencies = ['USD', 'EGP'];
const tiers = ['Tier 1', 'Tier 2', 'Tier 3'];

const incentives = [
  'Greater volumes',
  'Longer contracts',
  'Technical support',
  'Marketing support',
];

export default function OpenBookAccountingOverview() {
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [supplierTier, setSupplierTier] = useState('Tier 1');
  const [transactionVolume, setTransactionVolume] = useState('');
  const [componentCriticality, setComponentCriticality] = useState('');
  const [selectedIncentives, setSelectedIncentives] = useState<string[]>([]);

  const handleIncentiveToggle = (incentive: string) => {
    if (selectedIncentives.includes(incentive)) {
      setSelectedIncentives(selectedIncentives.filter(i => i !== incentive));
    } else {
      setSelectedIncentives([...selectedIncentives, incentive]);
    }
  };

  const rows = [
    { category: 'Raw Materials', cost: 10000 },
    { category: 'Labor', cost: 5000 },
    { category: 'Overhead', cost: 3000 },
    { category: 'Logistics', cost: 2000 },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Open Book Accounting Overview</h1>

      {/* Dropdowns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium">Select Supplier</label>
          <Select onValueChange={setSelectedSupplier}>
            <SelectTrigger>
              <SelectValue placeholder="Choose Supplier" />
            </SelectTrigger>
            <SelectContent>
              {suppliers.map(s => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium">Select Product</label>
          <Select onValueChange={setSelectedProduct}>
            <SelectTrigger>
              <SelectValue placeholder="Choose Product" />
            </SelectTrigger>
            <SelectContent>
              {products.map(p => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium">Select Currency</label>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currencies.map(c => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Editable Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Supplier Tier</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={supplierTier} onValueChange={setSupplierTier}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tiers.map(t => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transaction Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="number"
              value={transactionVolume}
              onChange={e => setTransactionVolume(e.target.value)}
              placeholder="Enter amount"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Component Criticality</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="text"
              value={componentCriticality}
              onChange={e => setComponentCriticality(e.target.value)}
              placeholder="e.g. High / Medium / Low"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Supplier Incentives Offered</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {incentives.map(inc => (
              <label key={inc} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedIncentives.includes(inc)}
                  onChange={() => handleIncentiveToggle(inc)}
                />
                <span>{inc}</span>
              </label>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Cost Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Cost ({currency})</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.category}</TableCell>
                  <TableCell>{row.cost.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>Export Report</Button>
      </div>
    </div>
  );
}
