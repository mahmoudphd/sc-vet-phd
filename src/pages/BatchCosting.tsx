// src/pages/BatchCosting.tsx
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";

const vitaminData = [
  "Vitamin B1",
  "Vitamin B2",
  "Vitamin B6",
  "Vitamin B12",
  "Pantothenic Acid",
  "Leucine",
  "Taurine",
  "Glycine",
];

const BatchCosting = () => {
  const [supplier, setSupplier] = useState("");
  const [product, setProduct] = useState("");
  const [currency, setCurrency] = useState("USD");

  const [supplierTier, setSupplierTier] = useState("Tier 1");
  const [transactionVolume, setTransactionVolume] = useState("");
  const [criticality, setCriticality] = useState("High");
  const [incentives, setIncentives] = useState<string[]>([]);

  const [vitaminCosts, setVitaminCosts] = useState(
    vitaminData.map((name) => ({
      name,
      quantity: 0,
      unitCost: 0,
    }))
  );

  const handleCostChange = (index: number, field: "quantity" | "unitCost", value: number) => {
    const updated = [...vitaminCosts];
    updated[index][field] = value;
    setVitaminCosts(updated);
  };

  const getTotal = () =>
    vitaminCosts.reduce((sum, item) => sum + item.quantity * item.unitCost, 0).toFixed(2);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Open Book Accounting Overview</h1>

      {/* Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Select onValueChange={setSupplier}>
          <SelectTrigger>
            <SelectValue placeholder="Select Supplier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Supplier A">Supplier A</SelectItem>
            <SelectItem value="Supplier B">Supplier B</SelectItem>
            <SelectItem value="Supplier C">Supplier C</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={setProduct}>
          <SelectTrigger>
            <SelectValue placeholder="Select Product" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Product X">Product X</SelectItem>
            <SelectItem value="Product Y">Product Y</SelectItem>
          </SelectContent>
        </Select>

        <Select value={currency} onValueChange={setCurrency}>
          <SelectTrigger>
            <SelectValue placeholder="Select Currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USD">USD</SelectItem>
            <SelectItem value="EGP">EGP</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="space-y-2 pt-4">
            <label className="font-semibold">Supplier Tier</label>
            <Select value={supplierTier} onValueChange={setSupplierTier}>
              <SelectTrigger>
                <SelectValue placeholder="Tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tier 1">Tier 1</SelectItem>
                <SelectItem value="Tier 2">Tier 2</SelectItem>
                <SelectItem value="Tier 3">Tier 3</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-2 pt-4">
            <label className="font-semibold">Transaction Volume</label>
            <Input
              type="number"
              value={transactionVolume}
              onChange={(e) => setTransactionVolume(e.target.value)}
              placeholder="Enter volume"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-2 pt-4">
            <label className="font-semibold">Component Criticality</label>
            <Select value={criticality} onValueChange={setCriticality}>
              <SelectTrigger>
                <SelectValue placeholder="Criticality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-2 pt-4">
            <label className="font-semibold">Supplier Incentives Offered</label>
            <Select
              multiple
              value={incentives}
              onValueChange={(val) => setIncentives(val as string[])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select incentives" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Greater volumes">Greater volumes</SelectItem>
                <SelectItem value="Longer contracts">Longer contracts</SelectItem>
                <SelectItem value="Technical support">Technical support</SelectItem>
                <SelectItem value="Marketing support">Marketing support</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Component</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Unit Cost ({currency})</TableHead>
              <TableHead>Total Cost</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vitaminCosts.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.name}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleCostChange(index, "quantity", parseFloat(e.target.value) || 0)
                    }
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={item.unitCost}
                    onChange={(e) =>
                      handleCostChange(index, "unitCost", parseFloat(e.target.value) || 0)
                    }
                  />
                </TableCell>
                <TableCell>{(item.quantity * item.unitCost).toFixed(2)} {currency}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3} className="font-bold text-right">
                Total
              </TableCell>
              <TableCell className="font-bold">{getTotal()} {currency}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Export Button */}
      <div className="text-right">
        <Button onClick={() => alert("Exporting report...")}>Export Report</Button>
      </div>
    </div>
  );
};

export default BatchCosting;
