import React, { useState } from "react";
import {
  Card,
  Flex,
  Heading,
  Table,
  Text,
  TextField,
  Button,
  DropdownMenu,
} from "@radix-ui/themes";

const productNames = ["Poultry Product A", "Poultry Product B", "Poultry Product C"];
const packagingShapes = ["Round", "Oval", "Rectangular"];
const packagingTypes = ["Pump", "Floater", "Scroll", "Tube"];
const capTypes = ["Safety Steel", "Flip Top", "Screw Cap"];
const complianceOptions = [
  "ISO 9001:2015 QMS",
  "ISO 14001:2015 EHS",
  "ISO 45001:2018 OHS",
  "ISO 22716:2007 GMP",
  "EDA",
];

type PackagingInfo = {
  productId: number;
  name: string;
  components: string;
  packagingShape: string;
  packagingType: string;
  capType: string;
  packWeight: number;
  compliance: string;
  status: string;
  component: number;
};

const initialData: PackagingInfo[] = [
  {
    productId: 1,
    name: "Poultry Product A",
    components: "",
    packagingShape: "",
    packagingType: "",
    capType: "",
    packWeight: 0,
    compliance: "",
    status: "Pending",
    component: 0,
  },
];

export default function PackagingTable() {
  const [data, setData] = useState<PackagingInfo[]>(initialData);

  const handleChange = (
    index: number,
    field: keyof PackagingInfo,
    value: string | number
  ) => {
    const newData = [...data];
    (newData[index][field] as any) = value;
    setData(newData);
  };

  const renderDropdown = (
    options: string[],
    value: string,
    onChange: (val: string) => void
  ) => (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button variant="soft">{value || "Select"}</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {options.map((opt, i) => (
          <DropdownMenu.Item key={i} onSelect={() => onChange(opt)}>
            {opt}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );

  return (
    <Card style={{ margin: 20 }}>
      <Heading size="5" mb="4">
        PRODUCTION DESIGN INFO
      </Heading>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Product ID</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Components</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Packaging Shape</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Packaging Type</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Cap Type</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Pack Weight (grams)</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Compliance</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Component</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.map((row, index) => (
            <Table.Row key={index}>
              <Table.Cell>{row.productId}</Table.Cell>
              <Table.Cell>
                {renderDropdown(productNames, row.name, (val) =>
                  handleChange(index, "name", val)
                )}
              </Table.Cell>
              <Table.Cell>
                <TextField.Root>
                  <TextField.Input
                    value={row.components}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleChange(index, "components", e.target.value)
                    }
                  />
                </TextField.Root>
              </Table.Cell>
              <Table.Cell>
                {renderDropdown(packagingShapes, row.packagingShape, (val) =>
                  handleChange(index, "packagingShape", val)
                )}
              </Table.Cell>
              <Table.Cell>
                {renderDropdown(packagingTypes, row.packagingType, (val) =>
                  handleChange(index, "packagingType", val)
                )}
              </Table.Cell>
              <Table.Cell>
                {renderDropdown(capTypes, row.capType, (val) =>
                  handleChange(index, "capType", val)
                )}
              </Table.Cell>
              <Table.Cell>
                <TextField.Root>
                  <TextField.Input
                    type="number"
                    value={row.packWeight}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleChange(index, "packWeight", parseFloat(e.target.value) || 0)
                    }
                  />
                </TextField.Root>
              </Table.Cell>
              <Table.Cell>
                {renderDropdown(complianceOptions, row.compliance, (val) =>
                  handleChange(index, "compliance", val)
                )}
              </Table.Cell>
              <Table.Cell>
                <Text>{row.status}</Text>
              </Table.Cell>
              <Table.Cell>
                <TextField.Root>
                  <TextField.Input
                    type="number"
                    value={row.component}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleChange(index, "component", parseFloat(e.target.value) || 0)
                    }
                  />
                </TextField.Root>
              </Table.Cell>
              <Table.Cell>
                <Button variant="outline" size="1">
                  View
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Card>
  );
}
