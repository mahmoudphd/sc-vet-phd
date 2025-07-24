import React, { useState } from "react";
import {
  Dialog,
  Text,
  TextField,
  Button,
  Flex,
  Box,
  Heading,
  Table,
  Select,
  DropdownMenu,
} from "@radix-ui/themes";

const NewProductConfig = () => {
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState([
    {
      id: "001",
      name: "Poultry Product A",
      components: [
        { name: "Vitamin B1", percentage: "1%", weight: "0.5g" },
        { name: "Vitamin B2", percentage: "0.8%", weight: "0.3g" },
      ],
      shape: "Round",
      type: "PUmb",
      cap: "Safety Steel",
      weight: "50g",
      compliance:
        "ISO 9001:2015 (QMS) / ISO 14001:2015 (EHS) / ISO 45001:2018 (OHS) / ISO 22716:2007 / EDA",
      status: "Approved",
    },
  ]);

  const handleChange = (index: number, field: string, value: string) => {
    const updated = [...products];
    (updated[index] as any)[field] = value;
    setProducts(updated);
  };

  return (
    <Box p="4">
      <Flex justify="between" align="center" mb="4">
        <Heading size="6" color="indigo">
          Product Design Info
        </Heading>
        <Button onClick={() => setOpen(true)}>New Product Configuration</Button>
      </Flex>

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Product ID</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Components</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Packaging Shape</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Packaging Type</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Cap Type</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Weight</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Compliance</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {products.map((product, index) => (
            <Table.Row key={index}>
              <Table.Cell>{product.id}</Table.Cell>
              <Table.Cell>{product.name}</Table.Cell>
              <Table.Cell>
                {product.components.map((c, i) => (
                  <Text key={i}>
                    {c.name} – {c.percentage} – {c.weight}
                  </Text>
                ))}
              </Table.Cell>
              <Table.Cell>{product.shape}</Table.Cell>
              <Table.Cell>{product.type}</Table.Cell>
              <Table.Cell>{product.cap}</Table.Cell>
              <Table.Cell>{product.weight}</Table.Cell>
              <Table.Cell>{product.compliance}</Table.Cell>
              <Table.Cell>{product.status}</Table.Cell>
              <Table.Cell>
                <Button size="1" variant="soft" color="blue">
                  Edit
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Content maxWidth="600px">
          <Dialog.Title>New Product Configuration</Dialog.Title>
          <Flex direction="column" gap="3" mt="3">
            <TextField.Input placeholder="Product Name" />
            <TextField.Input placeholder="Component Name" />
            <Flex gap="3">
              <TextField.Input placeholder="Percentage" />
              <TextField.Input placeholder="Weight (g)" />
            </Flex>
            <Select.Root>
              <Select.Trigger placeholder="Packaging Shape" />
              <Select.Content>
                <Select.Item value="Round">Round</Select.Item>
                <Select.Item value="Oval">Oval</Select.Item>
                <Select.Item value="Rectangular">Rectangular</Select.Item>
              </Select.Content>
            </Select.Root>

            <Select.Root>
              <Select.Trigger placeholder="Packaging Type" />
              <Select.Content>
                <Select.Item value="PUmb">PUmb</Select.Item>
                <Select.Item value="Floater">Floater</Select.Item>
                <Select.Item value="Scroll">Scroll</Select.Item>
                <Select.Item value="Tube">Tube</Select.Item>
              </Select.Content>
            </Select.Root>

            <Select.Root>
              <Select.Trigger placeholder="Cap Type" />
              <Select.Content>
                <Select.Item value="Safety Steel">Safety Steel</Select.Item>
                <Select.Item value="Flip Top">Flip Top</Select.Item>
                <Select.Item value="Screw Cap">Screw Cap</Select.Item>
              </Select.Content>
            </Select.Root>

            <TextField.Input placeholder="Product Weight (e.g. 50g)" />

            <TextField.Input
              defaultValue="ISO 9001:2015 (QMS) / ISO 14001:2015 (EHS) / ISO 45001:2018 (OHS) / ISO 22716:2007 / EDA"
              disabled
            />

            <Select.Root>
              <Select.Trigger placeholder="Status" />
              <Select.Content>
                <Select.Item value="Approved">Approved</Select.Item>
                <Select.Item value="Pending">Pending</Select.Item>
                <Select.Item value="Rejected">Rejected</Select.Item>
              </Select.Content>
            </Select.Root>
          </Flex>

          <Flex gap="3" mt="4" justify="end">
            <Button variant="soft" color="gray" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="solid" color="green">
              Save
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Box>
  );
};

export default NewProductConfig;
