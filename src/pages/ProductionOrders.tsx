import React, { useState, useEffect } from "react";
import {
  Dialog,
  Button,
  TextField,
  Select,
  TextArea,
  Flex,
  Box,
  Table,
} from "@radix-ui/themes";
import {
  Pencil2Icon,
  Cross2Icon,
  PlusIcon,
} from "@radix-ui/react-icons";

interface Configuration {
  productId: string;
  name: string;
  components: string;
  packagingShape: string;
  packagingType: string;
  capType: string;
  weight: string;
  compliance: string;
  status: string;
}

const productNames = ["Poultry Product A", "Poultry Product B", "Poultry Product C"];
const packagingShapes = ["Round", "Oval", "Rectangular"];
const packagingTypes = ["Pump", "Floater", "Scroll", "Tube"];
const capTypes = ["Safety Steel", "Flip Top", "Screw Cap"];
const complianceList = [
  "ISO 9001:2015 QMS",
  "ISO 14001:2015 EHS",
  "ISO 45001:2018 OHS",
  "ISO 22716:2007 GMP",
  "EDA",
];
const statuses = ["Active", "Inactive"];

export default function ConfigurationManager() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Configuration>({
    productId: "",
    name: "",
    components: "",
    packagingShape: "",
    packagingType: "",
    capType: "",
    weight: "",
    compliance: "",
    status: "Active",
  });
  const [rows, setRows] = useState<Configuration[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleChange = (field: keyof Configuration, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setForm({
      productId: "",
      name: "",
      components: "",
      packagingShape: "",
      packagingType: "",
      capType: "",
      weight: "",
      compliance: "",
      status: "Active",
    });
    setEditIndex(null);
  };

  const handleSave = () => {
    if (editIndex !== null) {
      // تعديل صف موجود
      const updated = [...rows];
      updated[editIndex] = form;
      setRows(updated);
    } else {
      // إضافة صف جديد
      setRows([...rows, form]);
    }
    resetForm();
    setOpen(false);
  };

  const handleDelete = (index: number) => {
    const updated = [...rows];
    updated.splice(index, 1);
    setRows(updated);
    // لو كنت بتعدل صف حذفته، نرجع فورم فارغ
    if (editIndex === index) {
      resetForm();
      setOpen(false);
    }
  };

  const handleEdit = (index: number) => {
    const row = rows[index];
    setForm(row);
    setEditIndex(index);
    setOpen(true);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button variant="soft">
          <PlusIcon /> New Configuration
        </Button>
      </Dialog.Trigger>
      <Dialog.Content style={{ maxWidth: 1000 }}>
        <Dialog.Title>{editIndex !== null ? "Edit Configuration" : "New Product Configuration"}</Dialog.Title>
        <Flex direction="column" gap="3" mb="4">
          <Flex gap="3">
            <TextField.Root
              placeholder="Product ID"
              value={form.productId}
              onChange={(e) => handleChange("productId", e.target.value)}
            />
            <Select.Root
              value={form.name}
              onValueChange={(value) => handleChange("name", value)}
            >
              <Select.Trigger placeholder="Select Product Name" />
              <Select.Content>
                {productNames.map((name) => (
                  <Select.Item key={name} value={name}>
                    {name}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
            <TextField.Root
              placeholder="Pack Weight (g)"
              value={form.weight}
              inputMode="numeric"
              pattern="\d*"
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || /^\d+$/.test(value)) {
                  handleChange("weight", value);
                }
              }}
            />
          </Flex>

          <TextArea
            placeholder="Components"
            value={form.components}
            onChange={(e) => handleChange("components", e.target.value)}
          />

          <Flex gap="3">
            <Select.Root
              value={form.packagingShape}
              onValueChange={(value) => handleChange("packagingShape", value)}
            >
              <Select.Trigger placeholder="Packaging Shape" />
              <Select.Content>
                {packagingShapes.map((shape) => (
                  <Select.Item key={shape} value={shape}>
                    {shape}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>

            <Select.Root
              value={form.packagingType}
              onValueChange={(value) => handleChange("packagingType", value)}
            >
              <Select.Trigger placeholder="Packaging Type" />
              <Select.Content>
                {packagingTypes.map((type) => (
                  <Select.Item key={type} value={type}>
                    {type}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>

            <Select.Root
              value={form.capType}
              onValueChange={(value) => handleChange("capType", value)}
            >
              <Select.Trigger placeholder="Cap Type" />
              <Select.Content>
                {capTypes.map((cap) => (
                  <Select.Item key={cap} value={cap}>
                    {cap}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Flex>

          <Flex gap="3">
            <Select.Root
              value={form.compliance}
              onValueChange={(value) => handleChange("compliance", value)}
            >
              <Select.Trigger placeholder="Compliance" />
              <Select.Content>
                {complianceList.map((item) => (
                  <Select.Item key={item} value={item}>
                    {item}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>

            <Select.Root
              value={form.status}
              onValueChange={(value) => handleChange("status", value)}
            >
              <Select.Trigger placeholder="Status" />
              <Select.Content>
                {statuses.map((status) => (
                  <Select.Item key={status} value={status}>
                    {status}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Flex>

          <Button onClick={handleSave}>{editIndex !== null ? "Save Changes" : "Save Configuration"}</Button>
        </Flex>

        <Box mt="4">
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Product ID</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Components</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Packaging Shape</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Packaging Type</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Cap Type</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Weight (g)</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Compliance</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {rows.map((row, idx) => (
                <Table.Row key={idx}>
                  <Table.Cell>{row.productId}</Table.Cell>
                  <Table.Cell>{row.name}</Table.Cell>
                  <Table.Cell>{row.components}</Table.Cell>
                  <Table.Cell>{row.packagingShape}</Table.Cell>
                  <Table.Cell>{row.packagingType}</Table.Cell>
                  <Table.Cell>{row.capType}</Table.Cell>
                  <Table.Cell>{row.weight}</Table.Cell>
                  <Table.Cell>{row.compliance}</Table.Cell>
                  <Table.Cell>{row.status}</Table.Cell>
                  <Table.Cell>
                    <Flex gap="2">
                      <Pencil2Icon
                        style={{ cursor: "pointer" }}
                        onClick={() => handleEdit(idx)}
                        title="Edit"
                      />
                      <Cross2Icon
                        style={{ cursor: "pointer" }}
                        onClick={() => handleDelete(idx)}
                        title="Delete"
                      />
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      </Dialog.Content>
    </Dialog.Root>
  );
}
