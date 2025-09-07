import {
  Card,
  Flex,
  Heading,
  Table,
  Badge,
  Button,
  Grid,
  Text,
  Progress,
  Box,
  Dialog,
  Select,
  TextField,
} from "@radix-ui/themes";
import { 
  CheckCircledIcon, 
  DownloadIcon, 
  GlobeIcon,
  PieChartIcon,
  Pencil1Icon,
  Cross2Icon,
  CheckIcon,
  EyeOpenIcon,
} from "@radix-ui/react-icons";
import { useTranslation } from "react-i18next";
import { useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

// Validation Schemas
const distributorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  region: z.string().min(1, "Region is required"),
  compliance: z.enum(["gdp-certified", "pending"]),
  licenses: z.enum(["active", "inactive"]),
  onTimeDelivery: z.number().min(0).max(100),
  lastAudit: z.string().date(),
  contact: z.string().email(),
  phone: z.string().min(10)
});

const regionSchema = z.object({
  name: z.string().min(1, "Name is required")
});

const reportSchema = z.object({
  reportType: z.enum(["summary", "detailed"]),
  startDate: z.string().date(),
  endDate: z.string().date(),
  exportFormat: z.enum(["pdf", "excel", "csv"])
}).refine(data => new Date(data.endDate) > new Date(data.startDate), {
  message: "End date must be after start date",
  path: ["endDate"]
});

// Types
interface Distributor {
  id: string;
  name: string;
  region: string;
  compliance: "gdp-certified" | "pending";
  licenses: "active" | "inactive";
  onTimeDelivery: number;
  lastAudit: string;
  contact: string;
  phone: string;
}

const Distributors = () => {
  const { t } = useTranslation("distributors-page");

  // Dialog states
  const [isDistributorModalOpen, setIsDistributorModalOpen] = useState(false);
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);
  const [isComplianceReportModalOpen, setIsComplianceReportModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedDistributor, setSelectedDistributor] = useState<Distributor | null>(null);

  // Inline editing states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempData, setTempData] = useState<Partial<Distributor>>({});

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Data states
  const [distributors, setDistributors] = useState<Distributor[]>([
    {
      id: 'DIST-001',
      name: 'Distributor 1',
      region: 'North Region',
      compliance: 'gdp-certified',
      licenses: 'active',
      onTimeDelivery: 96,
      lastAudit: '2025-05-12',
      contact: 'dist1@example.com',
      phone: '+201000000001'
    },
    {
      id: 'DIST-002',
      name: 'Distributor 2',
      region: 'South Region',
      compliance: 'pending',
      licenses: 'inactive',
      onTimeDelivery: 87,
      lastAudit: '2024-12-22',
      contact: 'dist2@example.com',
      phone: '+201000000002'
    },
    {
      id: 'DIST-003',
      name: 'Distributor 3',
      region: 'East Region',
      compliance: 'gdp-certified',
      licenses: 'active',
      onTimeDelivery: 99,
      lastAudit: '2025-03-30',
      contact: 'dist3@example.com',
      phone: '+201000000003'
    }
  ]);

  const [regions, setRegions] = useState<string[]>([
    'North Region',
    'South Region',
    'East Region',
    'West Region'
  ]);

  // Form handlers
  const distributorForm = useForm<z.infer<typeof distributorSchema>>({
    resolver: zodResolver(distributorSchema),
    defaultValues: {
      name: "",
      region: "",
      compliance: "pending",
      licenses: "active",
      onTimeDelivery: 100,
      lastAudit: new Date().toISOString().split('T')[0],
      contact: "",
      phone: ""
    }
  });

  const regionForm = useForm<z.infer<typeof regionSchema>>({
    resolver: zodResolver(regionSchema)
  });

  const reportForm = useForm<z.infer<typeof reportSchema>>({
    resolver: zodResolver(reportSchema)
  });

  // Data processing
  const paginatedDistributors = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return distributors.slice(start, start + itemsPerPage);
  }, [distributors, currentPage]);

  // Calculate performance metrics
  const averageDelivery = useMemo(() => {
    if (distributors.length === 0) return 0;
    return distributors.reduce((sum, d) => sum + d.onTimeDelivery, 0) / distributors.length;
  }, [distributors]);

  const complianceRate = useMemo(() => {
    if (distributors.length === 0) return 0;
    return (distributors.filter(d => d.compliance === 'gdp-certified').length / distributors.length) * 100;
  }, [distributors]);

  // CRUD operations
  const handleAddDistributor = async (data: z.infer<typeof distributorSchema>) => {
    try {
      const newDistributor: Distributor = {
        id: `DIST-${Math.random().toString(36).substring(2, 9)}`,
        ...data
      };
      setDistributors(prev => [...prev, newDistributor]);
      setIsDistributorModalOpen(false);
      toast.success("Distributor added successfully");
    } catch (error) {
      toast.error("Error adding distributor");
    }
  };

  const handleAddRegion = async (data: z.infer<typeof regionSchema>) => {
    if (regions.includes(data.name)) {
      toast.error("Region already exists");
      return;
    }
    setRegions(prev => [...prev, data.name]);
    toast.success("Region added successfully");
    setIsRegionModalOpen(false);
    regionForm.reset();
  };

  const handleGenerateReport = async (data: z.infer<typeof reportSchema>) => {
    try {
      toast.success("Report generated successfully");
      setIsComplianceReportModalOpen(false);
      reportForm.reset();
    } catch (error) {
      toast.error("Error generating report");
    }
  };

  // Inline editing functions
  const handleEdit = (distributor: Distributor) => {
    setEditingId(distributor.id);
    setTempData({ ...distributor });
  };

  const handleSave = (id: string) => {
    setDistributors(distributors.map(d => 
      d.id === id ? { ...d, ...tempData } as Distributor : d
    ));
    setEditingId(null);
    toast.success("Distributor updated successfully");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTempData({});
  };

  // View details function
  const handleViewDetails = (distributor: Distributor) => {
    setSelectedDistributor(distributor);
    setIsDetailsModalOpen(true);
  };

  // Update temp data for inline editing
  const handleUpdateTempData = (field: keyof Distributor, value: any) => {
    setTempData(prev => ({ ...prev, [field]: value }));
  };

  // Render compliance badge
  const renderComplianceBadge = (compliance: string) => (
    <Badge variant="soft" color={compliance === "gdp-certified" ? "green" : "orange"}>
      {compliance === "gdp-certified" ? "GDP Certified" : "Pending"}
    </Badge>
  );

  // Render license badge
  const renderLicenseBadge = (license: string) => (
    <Badge color={license === "active" ? "green" : "red"}>
      {license === "active" ? "Active" : "Inactive"}
    </Badge>
  );

  // Find top and bottom performers
  const { topPerformer, needsImprovement } = useMemo(() => {
    if (distributors.length === 0) {
      return { topPerformer: null, needsImprovement: null };
    }
    
    const sortedByPerformance = [...distributors].sort((a, b) => 
      b.onTimeDelivery - a.onTimeDelivery
    );
    
    return {
      topPerformer: sortedByPerformance[0],
      needsImprovement: sortedByPerformance[sortedByPerformance.length - 1]
    };
  }, [distributors]);

  return (
    <Box p="6" className="flex-1">
      {/* Header with actions */}
      <Flex justify="between" align="center" mb="5">
        <Heading size="6">Distributors Management</Heading>
        <Flex gap="3">
          <Button variant="soft" onClick={() => setIsDistributorModalOpen(true)}>
            <CheckCircledIcon /> Add Distributor
          </Button>
          <Button variant="soft" onClick={() => setIsRegionModalOpen(true)}>
            <GlobeIcon /> Add Region
          </Button>
          <Button variant="soft" onClick={() => setIsComplianceReportModalOpen(true)}>
            <DownloadIcon /> Compliance Report
          </Button>
        </Flex>
      </Flex>

      {/* Metrics Cards */}
      <Grid columns="4" gap="4" mb="5">
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">Certified Partners</Text>
            <Heading size="7">{distributors.length}</Heading>
            <Text size="1" style={{color: "green"}}>All compliant with regulations</Text>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">Avg. Delivery Time</Text>
            <Heading size="7">{averageDelivery.toFixed(1)}%</Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">License Expirations</Text>
            <Heading size="7" style={{color: "red"}}>
              {distributors.filter(d => d.licenses === 'inactive').length}
            </Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">GDP Compliance</Text>
            <Flex align="center" gap="2">
              <Progress value={complianceRate} style={{width: "100%"}} />
              <Text size="1">{complianceRate.toFixed(0)}%</Text>
            </Flex>
          </Flex>
        </Card>
      </Grid>

      {/* Performance Overview */}
      <Card mb="5">
        <Flex direction="column" gap="3">
          <Flex align="center" gap="2">
            <PieChartIcon />
            <Heading size="4">Performance Overview</Heading>
          </Flex>
          <Grid columns="2" gap="3">
            <Card>
              <Text size="2">Top Performer</Text>
              <Heading size="5">
                {topPerformer ? topPerformer.name : "N/A"}
              </Heading>
              <Text size="1" style={{color: "green"}}>
                {topPerformer ? `${topPerformer.onTimeDelivery}% OTD` : "No data"}
              </Text>
            </Card>
            <Card>
              <Text size="2">Needs Improvement</Text>
              <Heading size="5">
                {needsImprovement ? needsImprovement.name : "N/A"}
              </Heading>
              <Text size="1" style={{color: "red"}}>
                {needsImprovement ? `${needsImprovement.onTimeDelivery}% OTD` : "No data"}
              </Text>
            </Card>
          </Grid>
        </Flex>
      </Card>

      {/* Distributors Table - Simplified */}
      <Card mb="5">
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Distributor</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Compliance</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>OTD</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Licenses</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Last Audit</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {paginatedDistributors.map((distributor) => (
              <Table.Row key={distributor.id}>
                <Table.Cell>
                  {distributor.name}
                </Table.Cell>
                <Table.Cell>
                  {renderComplianceBadge(distributor.compliance)}
                </Table.Cell>
                <Table.Cell>
                  {`${distributor.onTimeDelivery}%`}
                </Table.Cell>
                <Table.Cell>
                  {renderLicenseBadge(distributor.licenses)}
                </Table.Cell>
                <Table.Cell>
                  {distributor.lastAudit}
                </Table.Cell>
                <Table.Cell>
                  <Flex gap="2">
                    <Button size="1" onClick={() => handleViewDetails(distributor)}>
                      <EyeOpenIcon /> Details
                    </Button>
                    <Button size="1" onClick={() => handleEdit(distributor)}>
                      <Pencil1Icon /> Edit
                    </Button>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
        
        {/* Custom Pagination */}
        <Flex justify="between" align="center" mt="3">
          <Text size="2">
            Showing {Math.min(currentPage * itemsPerPage, distributors.length)} of {distributors.length} distributors
          </Text>
          <Flex gap="2">
            <Button 
              variant="soft" 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button 
              variant="soft" 
              disabled={currentPage * itemsPerPage >= distributors.length}
              onClick={() => setCurrentPage(p => p + 1)}
            >
              Next
            </Button>
          </Flex>
        </Flex>
      </Card>

      {/* Distributor Details Modal */}
      <Dialog.Root open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <Dialog.Content>
          <Dialog.Title>Distributor Details</Dialog.Title>
          {selectedDistributor && (
            <Flex direction="column" gap="3">
              <Flex direction="column" gap="1">
                <Text weight="bold">Name:</Text>
                <Text>{selectedDistributor.name}</Text>
              </Flex>
              <Flex direction="column" gap="1">
                <Text weight="bold">Region:</Text>
                <Text>{selectedDistributor.region}</Text>
              </Flex>
              <Flex direction="column" gap="1">
                <Text weight="bold">Contact Email:</Text>
                <Text>{selectedDistributor.contact}</Text>
              </Flex>
              <Flex direction="column" gap="1">
                <Text weight="bold">Phone:</Text>
                <Text>{selectedDistributor.phone}</Text>
              </Flex>
              <Flex direction="column" gap="1">
                <Text weight="bold">Compliance Status:</Text>
                {renderComplianceBadge(selectedDistributor.compliance)}
              </Flex>
              <Flex direction="column" gap="1">
                <Text weight="bold">License Status:</Text>
                {renderLicenseBadge(selectedDistributor.licenses)}
              </Flex>
              <Flex direction="column" gap="1">
                <Text weight="bold">On-Time Delivery:</Text>
                <Text>{selectedDistributor.onTimeDelivery}%</Text>
              </Flex>
              <Flex direction="column" gap="1">
                <Text weight="bold">Last Audit:</Text>
                <Text>{selectedDistributor.lastAudit}</Text>
              </Flex>
              <Flex justify="end" mt="3">
                <Button onClick={() => setIsDetailsModalOpen(false)}>
                  Close
                </Button>
              </Flex>
            </Flex>
          )}
        </Dialog.Content>
      </Dialog.Root>

      {/* Add Distributor Modal */}
      <Dialog.Root open={isDistributorModalOpen} onOpenChange={setIsDistributorModalOpen}>
        <Dialog.Content>
          <Dialog.Title>Add New Distributor</Dialog.Title>
          <form onSubmit={distributorForm.handleSubmit(handleAddDistributor)}>
            <Flex direction="column" gap="3">
              <Controller
                name="name"
                control={distributorForm.control}
                render={({ field }) => (
                  <TextField.Root placeholder="Distributor name" {...field}>
                    <TextField.Slot>Name</TextField.Slot>
                  </TextField.Root>
                )}
              />
              {distributorForm.formState.errors.name && (
                <Text color="red" size="1">{distributorForm.formState.errors.name.message}</Text>
              )}

              <Controller
                name="region"
                control={distributorForm.control}
                render={({ field }) => (
                  <Select.Root value={field.value} onValueChange={field.onChange}>
                    <Select.Trigger placeholder="Select region" />
                    <Select.Content>
                      {regions.map(region => (
                        <Select.Item key={region} value={region}>{region}</Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                )}
              />
              {distributorForm.formState.errors.region && (
                <Text color="red" size="1">{distributorForm.formState.errors.region.message}</Text>
              )}

              <Controller
                name="contact"
                control={distributorForm.control}
                render={({ field }) => (
                  <TextField.Root placeholder="Email" {...field}>
                    <TextField.Slot>Contact Email</TextField.Slot>
                  </TextField.Root>
                )}
              />

              <Controller
                name="phone"
                control={distributorForm.control}
                render={({ field }) => (
                  <TextField.Root placeholder="Phone number" {...field}>
                    <TextField.Slot>Phone</TextField.Slot>
                  </TextField.Root>
                )}
              />

              <Flex gap="3" justify="end">
                <Button type="button" variant="soft" onClick={() => setIsDistributorModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" color="green">
                  Save Distributor
                </Button>
              </Flex>
            </Flex>
          </form>
        </Dialog.Content>
      </Dialog.Root>

      {/* Add Region Modal */}
      <Dialog.Root open={isRegionModalOpen} onOpenChange={setIsRegionModalOpen}>
        <Dialog.Content>
          <Dialog.Title>Add New Region</Dialog.Title>
          <form onSubmit={regionForm.handleSubmit(handleAddRegion)}>
            <Controller
              name="name"
              control={regionForm.control}
              render={({ field }) => (
                <TextField.Root placeholder="Region name" {...field}>
                  <TextField.Slot>Name</TextField.Slot>
                </TextField.Root>
              )}
            />
            {regionForm.formState.errors.name && (
              <Text color="red" size="1">{regionForm.formState.errors.name.message}</Text>
            )}
            <Flex justify="end" mt="3" gap="2">
              <Button type="button" variant="soft" onClick={() => setIsRegionModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" color="green">
                Save Region
              </Button>
            </Flex>
          </form>
        </Dialog.Content>
      </Dialog.Root>

      {/* Compliance Report Modal */}
      <Dialog.Root open={isComplianceReportModalOpen} onOpenChange={setIsComplianceReportModalOpen}>
        <Dialog.Content>
          <Dialog.Title>Generate Compliance Report</Dialog.Title>
          <form onSubmit={reportForm.handleSubmit(handleGenerateReport)}>
            <Flex direction="column" gap="3">
              <Controller
                name="reportType"
                control={reportForm.control}
                render={({ field }) => (
                  <Select.Root value={field.value} onValueChange={field.onChange}>
                    <Select.Trigger placeholder="Select report type" />
                    <Select.Content>
                      <Select.Item value="summary">Summary Report</Select.Item>
                      <Select.Item value="detailed">Detailed Report</Select.Item>
                    </Select.Content>
                  </Select.Root>
                )}
              />

              <Controller
                name="exportFormat"
                control={reportForm.control}
                render={({ field }) => (
                  <Select.Root value={field.value} onValueChange={field.onChange}>
                    <Select.Trigger placeholder="Select export format" />
                    <Select.Content>
                      <Select.Item value="pdf">PDF</Select.Item>
                      <Select.Item value="excel">Excel</Select.Item>
                      <Select.Item value="csv">CSV</Select.Item>
                    </Select.Content>
                  </Select.Root>
                )}
              />

              <Controller
                name="startDate"
                control={reportForm.control}
                render={({ field }) => (
                  <TextField.Root type="date" {...field}>
                    <TextField.Slot>Start Date</TextField.Slot>
                  </TextField.Root>
                )}
              />

              <Controller
                name="endDate"
                control={reportForm.control}
                render={({ field }) => (
                  <TextField.Root type="date" {...field}>
                    <TextField.Slot>End Date</TextField.Slot>
                  </TextField.Root>
                )}
              />
              {reportForm.formState.errors.endDate && (
                <Text color="red" size="1">{reportForm.formState.errors.endDate.message}</Text>
              )}

              <Flex justify="end" mt="3" gap="2">
                <Button type="button" variant="soft" onClick={() => setIsComplianceReportModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" color="green">
                  Generate Report
                </Button>
              </Flex>
            </Flex>
          </form>
        </Dialog.Content>
      </Dialog.Root>
    </Box>
  );
};

export default Distributors;
