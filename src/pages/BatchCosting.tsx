// src/pages/OpenBookAccountingDashboard.tsx

import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Dialog,
  Flex,
  Grid,
  Heading,
  Select,
  Table,
  Text,
  TextField,
} from '@radix-ui/themes';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const supplierIncentiveOptions = [
  'Greater volumes',
  'Longer contracts',
  'Technical support',
  'Marketing support',
  'Negotiation support',
  'Joint problem solving teams',
];

const OpenBookAccountingDashboard = () => {
  const [supplier, setSupplier] = useState('');
  const [product, setProduct] = useState('');
  const [currency, setCurrency] = useState('EGP');
  const [cards, setCards] = useState({
    tier: 'Tier 1',
    volume: '12000',
    criticality: 'High',
    incentives: 'Longer contracts',
  });

  const handleCardChange = (key: string, value: string) => {
    setCards({ ...cards, [key]: value });
  };

  return (
    <Box p="4">
      {/* Header Section */}
      <Flex justify="between" align="center" mb="4">
        <Heading size="7">Open Book Accounting Dashboard</Heading>
        <Flex gap="3">
          <Select value={supplier} onValueChange={setSupplier}>
            <Select.Trigger placeholder="Select Supplier" />
            <Select.Content>
              <Select.Item value="Supplier A">Supplier A</Select.Item>
              <Select.Item value="Supplier B">Supplier B</Select.Item>
              <Select.Item value="Supplier C">Supplier C</Select.Item>
            </Select.Content>
          </Select>
          <Select value={product} onValueChange={setProduct}>
            <Select.Trigger placeholder="Select Product" />
            <Select.Content>
              <Select.Item value="Product X">Product X</Select.Item>
              <Select.Item value="Product Y">Product Y</Select.Item>
            </Select.Content>
          </Select>
          <Select value={currency} onValueChange={setCurrency}>
            <Select.Trigger />
            <Select.Content>
              <Select.Item value="EGP">EGP</Select.Item>
              <Select.Item value="USD">USD</Select.Item>
            </Select.Content>
          </Select>
        </Flex>
      </Flex>

      {/* KPI Cards */}
      <Grid columns={{ initial: '1', md: '4' }} gap="3" mb="4">
        <Card>
          <Text size="2" weight="bold">Supplier Tier</Text>
          <TextField value={cards.tier} onChange={(e) => handleCardChange('tier', e.target.value)} />
        </Card>
        <Card>
          <Text size="2" weight="bold">Transaction Volume</Text>
          <TextField value={cards.volume} onChange={(e) => handleCardChange('volume', e.target.value)} />
        </Card>
        <Card>
          <Text size="2" weight="bold">Component Criticality</Text>
          <TextField value={cards.criticality} onChange={(e) => handleCardChange('criticality', e.target.value)} />
        </Card>
        <Card>
          <Text size="2" weight="bold">Supplier Incentives Offered</Text>
          <Select value={cards.incentives} onValueChange={(val) => handleCardChange('incentives', val)}>
            <Select.Trigger />
            <Select.Content>
              {supplierIncentiveOptions.map((option) => (
                <Select.Item key={option} value={option}>{option}</Select.Item>
              ))}
            </Select.Content>
          </Select>
        </Card>
      </Grid>

      {/* Placeholder for next sections */}
      {/* سيتم الآن إضافة الجدول الاحترافي والتفاصيل بعد مراجعتك */}
    </Box>
  );
};

export default OpenBookAccountingDashboard;
{/* Production Design Info Section */}
<Box mt="5">
  <Heading size="4" mb="3">Production Design Info</Heading>
  <Text as="p" mb="2">
    Please describe or update key production parameters or processes.
  </Text>
  <textarea
    placeholder="e.g., Batch Size: 5000 units, Sterile Processing, etc."
    rows={3}
    style={{
      width: '100%',
      padding: '10px',
      fontSize: '14px',
      borderRadius: '8px',
      border: '1px solid #ccc',
      resize: 'vertical',
    }}
  />
</Box>

{/* Production Stages Table */}
<Box mt="6">
  <Heading size="4" mb="3">Production Stages</Heading>
  <Table.Root variant="surface">
    <Table.Header>
      <Table.Row>
        <Table.ColumnHeaderCell>Stage</Table.ColumnHeaderCell>
        <Table.ColumnHeaderCell>Editable Description</Table.ColumnHeaderCell>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {[
        "Weighing", "Mixing", "Granulation", "Compression",
        "Coating", "Liquid Filling", "Quality Control", "Packaging"
      ].map((stage, index) => (
        <Table.Row key={index}>
          <Table.RowHeaderCell>{stage}</Table.RowHeaderCell>
          <Table.Cell>
            <input
              type="text"
              defaultValue=""
              placeholder={`Describe ${stage.toLowerCase()}...`}
              style={{
                width: '100%',
                padding: '6px',
                borderRadius: '6px',
                border: '1px solid #ccc',
                fontSize: '14px'
              }}
            />
          </Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  </Table.Root>
</Box>
        <Flex gap="4" align="center">
          <Text size="2">Currency:</Text>
          <RadixSelect.Root value={currency} onValueChange={setCurrency}>
            <RadixSelect.Trigger />
            <RadixSelect.Content>
              <RadixSelect.Item value="USD">USD</RadixSelect.Item>
              <RadixSelect.Item value="EGP">EGP</RadixSelect.Item>
            </RadixSelect.Content>
          </RadixSelect.Root>
        </Flex>
      </Flex>

      {/* KPI Cards */}
      <Grid columns="4" gap="4" mt="4">
        <Card>
          <CardContent>
            <Text weight="bold">Supplier Tier</Text>
            <input
              className="border mt-2 px-2 py-1 w-full rounded"
              value={supplierTier}
              onChange={(e) => setSupplierTier(e.target.value)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Text weight="bold">Transaction Volume</Text>
            <input
              className="border mt-2 px-2 py-1 w-full rounded"
              value={transactionVolume}
              onChange={(e) => setTransactionVolume(e.target.value)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Text weight="bold">Component Importance</Text>
            <input
              className="border mt-2 px-2 py-1 w-full rounded"
              value={componentImportance}
              onChange={(e) => setComponentImportance(e.target.value)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Text weight="bold">Supplier Incentives</Text>
            <textarea
              className="border mt-2 px-2 py-1 w-full rounded h-24 resize-none"
              value={incentives}
              onChange={(e) => setIncentives(e.target.value)}
              placeholder="e.g., Greater volumes, longer contracts..."
            />
          </CardContent>
        </Card>
      </Grid>
      {/* Production Stages Table */}
      <Box mt="6">
        <Heading size="4" mb="3">
          Production Technical Breakdown
        </Heading>
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Stage</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Machine Type</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>PLC/Automation</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Cost Impact</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {productionStages.map((stage, index) => (
              <Table.Row key={index}>
                <Table.Cell>
                  <input
                    value={stage.stage}
                    onChange={(e) => handleStageChange(index, 'stage', e.target.value)}
                    className="border rounded px-2 py-1 w-full"
                  />
                </Table.Cell>
                <Table.Cell>
                  <input
                    value={stage.machineType}
                    onChange={(e) => handleStageChange(index, 'machineType', e.target.value)}
                    className="border rounded px-2 py-1 w-full"
                  />
                </Table.Cell>
                <Table.Cell>
                  <input
                    value={stage.plcType}
                    onChange={(e) => handleStageChange(index, 'plcType', e.target.value)}
                    className="border rounded px-2 py-1 w-full"
                  />
                </Table.Cell>
                <Table.Cell>
                  <input
                    value={stage.costImpact}
                    onChange={(e) => handleStageChange(index, 'costImpact', e.target.value)}
                    className="border rounded px-2 py-1 w-full"
                  />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
        <Button mt="3" onClick={addNewStage}>
          + Add Stage
        </Button>
      </Box>
      {/* Supplier Cost Details */}
      <Box mt="6">
        <Heading size="4" mb="3">
          Supplier Cost Disclosure
        </Heading>
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Supplier Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Material / Service</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Declared Cost</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Currency</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {supplierCosts.map((item, index) => (
              <Table.Row key={index}>
                <Table.Cell>
                  <input
                    value={item.supplier}
                    onChange={(e) => handleSupplierChange(index, 'supplier', e.target.value)}
                    className="border rounded px-2 py-1 w-full"
                  />
                </Table.Cell>
                <Table.Cell>
                  <input
                    value={item.material}
                    onChange={(e) => handleSupplierChange(index, 'material', e.target.value)}
                    className="border rounded px-2 py-1 w-full"
                  />
                </Table.Cell>
                <Table.Cell>
                  <input
                    type="number"
                    value={item.cost}
                    onChange={(e) => handleSupplierChange(index, 'cost', e.target.value)}
                    className="border rounded px-2 py-1 w-full"
                  />
                </Table.Cell>
                <Table.Cell>
                  <RadixSelect.Root
                    value={item.currency}
                    onValueChange={(value) => handleSupplierChange(index, 'currency', value)}
                  >
                    <RadixSelect.Trigger className="border rounded px-2 py-1 w-full">
                      <RadixSelect.Value />
                    </RadixSelect.Trigger>
                    <RadixSelect.Content>
                      <RadixSelect.Item value="USD">USD</RadixSelect.Item>
                      <RadixSelect.Item value="EUR">EUR</RadixSelect.Item>
                      <RadixSelect.Item value="EGP">EGP</RadixSelect.Item>
                    </RadixSelect.Content>
                  </RadixSelect.Root>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
        <Button mt="3" onClick={addSupplierCost}>
          + Add Supplier Cost
        </Button>
      </Box>

      {/* Contractual Details */}
      <Box mt="6">
        <Heading size="4" mb="3">
          Contract Terms Overview
        </Heading>
        <Grid columns="2" gap="4">
          <Box>
            <Text weight="bold">Contract Duration</Text>
            <input
              value={contractTerms.duration}
              onChange={(e) => setContractTerms({ ...contractTerms, duration: e.target.value })}
              className="border rounded px-2 py-1 w-full mt-1"
            />
          </Box>
          <Box>
            <Text weight="bold">Renewal Clause</Text>
            <input
              value={contractTerms.renewal}
              onChange={(e) => setContractTerms({ ...contractTerms, renewal: e.target.value })}
              className="border rounded px-2 py-1 w-full mt-1"
            />
          </Box>
          <Box>
            <Text weight="bold">Penalty for Delay</Text>
            <input
              value={contractTerms.penalty}
              onChange={(e) => setContractTerms({ ...contractTerms, penalty: e.target.value })}
              className="border rounded px-2 py-1 w-full mt-1"
            />
          </Box>
          <Box>
            <Text weight="bold">Currency & Payment Terms</Text>
            <input
              value={contractTerms.payment}
              onChange={(e) => setContractTerms({ ...contractTerms, payment: e.target.value })}
              className="border rounded px-2 py-1 w-full mt-1"
            />
          </Box>
        </Grid>
      </Box>
          <Select.Root value={selectedCurrency} onValueChange={setSelectedCurrency}>
            <Select.Trigger />
            <Select.Content>
              <Select.Item value="USD">USD</Select.Item>
              <Select.Item value="EGP">EGP</Select.Item>
            </Select.Content>
          </Select.Root>
        </Flex>

        {/* KPI Cards */}
        <Grid columns="4" gap="4" mt="4">
          <Card>
            <Text weight="bold">Supplier Tier</Text>
            <Input value={supplierTier} onChange={(e) => setSupplierTier(e.target.value)} />
          </Card>
          <Card>
            <Text weight="bold">Transaction Volume</Text>
            <Input value={transactionVolume} onChange={(e) => setTransactionVolume(e.target.value)} />
          </Card>
          <Card>
            <Text weight="bold">Component Criticality</Text>
            <Input value={componentCriticality} onChange={(e) => setComponentCriticality(e.target.value)} />
          </Card>
          <Card>
            <Text weight="bold">Incentives Offered</Text>
            <Textarea
              value={incentives}
              onChange={(e) => setIncentives(e.target.value)}
              placeholder="Greater volumes / longer contracts..."
            />
          </Card>
        </Grid>

        {/* Production Design Info */}
        <Box mt="6">
          <Heading size="4">Production Design Info</Heading>
          <Textarea
            value={productionDesign}
            onChange={(e) => setProductionDesign(e.target.value)}
            placeholder="Enter production design details here"
          />
        </Box>

        {/* Production Stages */}
        <Box mt="6">
          <Heading size="4">Production Stages</Heading>
          <Textarea
            value={productionStages}
            onChange={(e) => setProductionStages(e.target.value)}
            placeholder="weighting, mixing, granulation, compression, ..."
          />
        </Box>

        {/* Transactions Table */}
        <Box mt="6">
          <Heading size="4" mb="2">Detailed Transactions with Supplier</Heading>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Item</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Material</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Declared Cost (via Blockchain)</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Actual Cost</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Variance</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Incentives Offered</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {transactions.map((row, index) => (
                <Table.Row key={index}>
                  <Table.Cell>
                    <Input
                      value={row.date}
                      onChange={(e) => handleTransactionChange(index, "date", e.target.value)}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <Input
                      value={row.item}
                      onChange={(e) => handleTransactionChange(index, "item", e.target.value)}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <Input
                      value={row.material}
                      onChange={(e) => handleTransactionChange(index, "material", e.target.value)}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <Input
                      value={row.declaredCost}
                      onChange={(e) => handleTransactionChange(index, "declaredCost", e.target.value)}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <Input
                      value={row.actualCost}
                      onChange={(e) => handleTransactionChange(index, "actualCost", e.target.value)}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <Text>{calculateVariance(row.declaredCost, row.actualCost)}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Input
                      value={row.incentives}
                      onChange={(e) => handleTransactionChange(index, "incentives", e.target.value)}
                    />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
          <Button mt="2" onClick={addTransactionRow}>Add Transaction</Button>
        </Box>

        {/* Relationship Chart */}
        <Box mt="6">
          <Heading size="4">Supplier Relationship Quality</Heading>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={relationshipMetrics}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar name="Supplier" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </Box>

        {/* Submit All */}
        <Flex justify="end" mt="6">
          <Button onClick={handleSubmitAll}>Submit All</Button>
        </Flex>
      </Box>
    </Container>
  );
}
      <Box my="4">
        <Heading size="4" mb="2">Detailed Transactions Between Supplier</Heading>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Item</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Material</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Declared Cost (via Blockchain)</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Actual Cost</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Variance</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Incentives Offered</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {transactions.map((tx, index) => (
              <Table.Row key={index}>
                <Table.Cell>
                  <input
                    type="date"
                    value={tx.date}
                    onChange={(e) => handleTransactionChange(index, 'date', e.target.value)}
                    className="border rounded px-2 py-1 w-full"
                  />
                </Table.Cell>
                <Table.Cell>
                  <input
                    type="text"
                    value={tx.item}
                    onChange={(e) => handleTransactionChange(index, 'item', e.target.value)}
                    className="border rounded px-2 py-1 w-full"
                  />
                </Table.Cell>
                <Table.Cell>
                  <input
                    type="text"
                    value={tx.material}
                    onChange={(e) => handleTransactionChange(index, 'material', e.target.value)}
                    className="border rounded px-2 py-1 w-full"
                  />
                </Table.Cell>
                <Table.Cell>
                  <input
                    type="number"
                    value={tx.declaredCost}
                    onChange={(e) => handleTransactionChange(index, 'declaredCost', e.target.value)}
                    className="border rounded px-2 py-1 w-full"
                  />
                </Table.Cell>
                <Table.Cell>
                  <input
                    type="number"
                    value={tx.actualCost}
                    onChange={(e) => handleTransactionChange(index, 'actualCost', e.target.value)}
                    className="border rounded px-2 py-1 w-full"
                  />
                </Table.Cell>
                <Table.Cell>
                  <Text>{(parseFloat(tx.actualCost) - parseFloat(tx.declaredCost)).toFixed(2)}</Text>
                </Table.Cell>
                <Table.Cell>
                  <RadixSelect.Root
                    value={tx.incentive}
                    onValueChange={(value) => handleTransactionChange(index, 'incentive', value)}
                  >
                    <RadixSelect.Trigger className="border rounded px-2 py-1 w-full text-left">
                      <RadixSelect.Value />
                    </RadixSelect.Trigger>
                    <RadixSelect.Content>
                      {incentivesList.map((inc) => (
                        <RadixSelect.Item key={inc} value={inc}>
                          {inc}
                        </RadixSelect.Item>
                      ))}
                    </RadixSelect.Content>
                  </RadixSelect.Root>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
            <Card className="col-span-3 p-4">
              <Text className="text-sm text-muted-foreground mb-1">Declared Cost via Blockchain</Text>
              <Input
                type="number"
                value={row.declaredCost}
                onChange={(e) => updateRow(rowIndex, "declaredCost", parseFloat(e.target.value))}
              />
            </Card>

            <Card className="col-span-3 p-4">
              <Text className="text-sm text-muted-foreground mb-1">Actual Cost</Text>
              <Input
                type="number"
                value={row.actualCost}
                onChange={(e) => updateRow(rowIndex, "actualCost", parseFloat(e.target.value))}
              />
            </Card>

            <Card className="col-span-3 p-4">
              <Text className="text-sm text-muted-foreground mb-1">Variance</Text>
              <Input
                type="number"
                value={calculateVariance(row)}
                readOnly
              />
            </Card>

            <Card className="col-span-3 p-4">
              <Text className="text-sm text-muted-foreground mb-1">Incentives Offered</Text>
              <Select
                value={row.incentive}
                onValueChange={(value) => updateRow(rowIndex, "incentive", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Incentive" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Greater volumes">Greater volumes</SelectItem>
                  <SelectItem value="Longer contracts">Longer contracts</SelectItem>
                  <SelectItem value="Technical support">Technical support</SelectItem>
                  <SelectItem value="Marketing support">Marketing support</SelectItem>
                  <SelectItem value="Negotiation support">Negotiation support</SelectItem>
                  <SelectItem value="Joint problem solving teams">Joint problem solving teams</SelectItem>
                </SelectContent>
              </Select>
            </Card>
          </Grid>
        </div>
      ))}

      <Button className="mt-4" onClick={addNewRow}>
        + Add Transaction Row
      </Button>

      {/* Relationship Chart */}
      <div className="mt-10">
        <Heading className="mb-4">Supplier Relationship Score</Heading>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={relationshipMetrics}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <Radar
              name="Supplier A"
              dataKey="score"
              stroke="#0e7490"
              fill="#0e7490"
              fillOpacity={0.6}
            />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <Button className="mt-6" onClick={handleSaveAll} variant="outline">
        Save All Data
      </Button>
    </div>
  );
}

export default OpenBookAccountingDashboard;
