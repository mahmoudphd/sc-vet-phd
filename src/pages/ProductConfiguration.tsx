import React, { useState } from "react";
import {
  Card,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Button,
  TextField,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui";

const complianceOptions = [
  "ISO 9001:2015 (QMS)",
  "ISO 14001:2015 (EHS)",
  "ISO 45001:2018 (OHS)",
  "ISO 22716:2007",
  "EDA",
];

const removalMethods = ["FIFO", "LIFO", "Closest Location"];

const productNames = ["Poultry Product A", "Poultry Product B", "Poultry Product C"];

const ProductConfiguration = () => {
  const [selectedProduct, setSelectedProduct] = useState(productNames[0]);
  const [productCost, setProductCost] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [selectedRemovalMethod, setSelectedRemovalMethod] = useState(removalMethods[0]);
  const [components, setComponents] = useState([
    {
      name: "Vitamin B1",
      percentage: 20,
      weight: 5,
    },
    {
      name: "Vitamin B12",
      percentage: 10,
      weight: 2,
    },
  ]);
  const [selectedCompliance, setSelectedCompliance] = useState<string[]>([]);

  const handleComponentChange = (index: number, field: string, value: any) => {
    const updated = [...components];
    updated[index][field] = value;
    setComponents(updated);
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">New Product Configuration</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Product Name</label>
        <select
          className="border rounded px-2 py-1 w-full"
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
        >
          {productNames.map((name) => (
            <option key={name}>{name}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Compliance</label>
        <select
          multiple
          className="border rounded px-2 py-1 w-full h-32"
          value={selectedCompliance}
          onChange={(e) =>
            setSelectedCompliance(Array.from(e.target.selectedOptions, (opt) => opt.value))
          }
        >
          {complianceOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      <Tabs defaultValue="components" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="cost">Cost Info</TabsTrigger>
          <TabsTrigger value="removal">Removal Method</TabsTrigger>
        </TabsList>

        <TabsContent value="components">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Percentage (%)</TableHead>
                <TableHead>Weight (g)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {components.map((comp, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <TextField
                      value={comp.name}
                      onChange={(e) => handleComponentChange(index, "name", e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={comp.percentage}
                      onChange={(e) =>
                        handleComponentChange(index, "percentage", parseFloat(e.target.value))
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={comp.weight}
                      onChange={(e) =>
                        handleComponentChange(index, "weight", parseFloat(e.target.value))
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="cost">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Product Cost</label>
              <TextField
                type="number"
                value={productCost}
                onChange={(e) => setProductCost(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Product Price</label>
              <TextField
                type="number"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="removal">
          <div>
            <label className="block text-sm font-medium mb-1">Removal Method</label>
            <select
              className="border rounded px-2 py-1 w-full"
              value={selectedRemovalMethod}
              onChange={(e) => setSelectedRemovalMethod(e.target.value)}
            >
              {removalMethods.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-6">
        <Button>Submit Configuration</Button>
      </div>
    </Card>
  );
};

export default ProductConfiguration;
