import React, { useState } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

type Product = {
  productId: string;
  name: string;
  components: string;
  packagingShape: "Round" | "Oval" | "Rectangular";
  packagingType: "Pump" | "Floater" | "Scroll" | "Tube";
  capType: "Safety Steel" | "Flip Top" | "Screw Cap";
  packWeight: number;
  compliance: string;
  status: string;
};

const initialData: Product[] = [
  {
    productId: "P001",
    name: "Poultry Product A",
    components: "Vitamin A, B1",
    packagingShape: "Round",
    packagingType: "Pump",
    capType: "Flip Top",
    packWeight: 100,
    compliance: "ISO 9001:2015 QMS",
    status: "Active",
  },
];

export default function BatchCostingPage() {
  const [tab, setTab] = useState("view");
  const [products, setProducts] = useState<Product[]>(initialData);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const complianceOptions = [
    "ISO 9001:2015 QMS",
    "ISO 14001:2015 EHS",
    "ISO 45001:2018 OHS",
    "ISO 22716:2007 GMP",
    "EDA",
  ];

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  return (
    <div className="p-4">
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="view">View Products</TabsTrigger>
          <TabsTrigger value="add">Add Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="view">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Components</TableHead>
                <TableHead>Packaging Shape</TableHead>
                <TableHead>Packaging Type</TableHead>
                <TableHead>Cap Type</TableHead>
                <TableHead>Pack Weight (grams)</TableHead>
                <TableHead>Compliance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.productId}>
                  <TableCell>{product.productId}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.components}</TableCell>
                  <TableCell>{product.packagingShape}</TableCell>
                  <TableCell>{product.packagingType}</TableCell>
                  <TableCell>{product.capType}</TableCell>
                  <TableCell>{product.packWeight}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          {product.compliance}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {complianceOptions.map((option) => (
                          <DropdownMenuItem key={option}>
                            {option}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell>{product.status}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(product)}
                    >
                      View / Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="add">
          <div className="space-y-4">
            <Input placeholder="Product ID" />
            <Input placeholder="Name" />
            <Input placeholder="Components" />
            <Input placeholder="Packaging Shape" />
            <Input placeholder="Packaging Type" />
            <Input placeholder="Cap Type" />
            <Input placeholder="Pack Weight (grams)" type="number" />
            <Input placeholder="Compliance" />
            <Input placeholder="Status" />
            <Button>Add Product</Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog for editing */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <h2 className="text-lg font-semibold mb-2">Edit Product</h2>
          {selectedProduct && (
            <div className="space-y-3">
              <Input
                value={selectedProduct.name}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    name: e.target.value,
                  })
                }
              />
              <Input
                value={selectedProduct.components}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    components: e.target.value,
                  })
                }
              />
              <Input
                value={selectedProduct.packagingShape}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    packagingShape: e.target.value as Product["packagingShape"],
                  })
                }
              />
              <Input
                value={selectedProduct.packagingType}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    packagingType: e.target.value as Product["packagingType"],
                  })
                }
              />
              <Input
                value={selectedProduct.capType}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    capType: e.target.value as Product["capType"],
                  })
                }
              />
              <Input
                type="number"
                value={selectedProduct.packWeight}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    packWeight: Number(e.target.value),
                  })
                }
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    {selectedProduct.compliance}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {complianceOptions.map((option) => (
                    <DropdownMenuItem
                      key={option}
                      onSelect={() =>
                        setSelectedProduct({
                          ...selectedProduct,
                          compliance: option,
                        })
                      }
                    >
                      {option}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Input
                value={selectedProduct.status}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    status: e.target.value,
                  })
                }
              />
              <Button
                onClick={() => {
                  setProducts((prev) =>
                    prev.map((p) =>
                      p.productId === selectedProduct.productId
                        ? selectedProduct
                        : p
                    )
                  );
                  setDialogOpen(false);
                }}
              >
                Save
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
