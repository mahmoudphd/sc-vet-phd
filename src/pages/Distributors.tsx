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
  Pagination,
} from "@radix-ui/themes";
import { 
  CheckCircledIcon, 
  DownloadIcon, 
  GlobeIcon,
  BarChartIcon,
  LineChartIcon,
  Pencil1Icon,
  Cross2Icon,
  CheckIcon
} from "@radix-ui/react-icons";
import { useTranslation } from "react-i18next";
import { useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { BarChart, LineChart } from '@radix-ui/themes/charts';

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

const Distributors = () => {
  const { t } = useTranslation("distributors-page");

  // Dialog states
  const [isDistributorModalOpen, setIsDistributorModalOpen] = useState(false);
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);
  const [isComplianceReportModalOpen, setIsComplianceReportModalOpen] = useState(false);

  // Inline editing states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempData, setTempData] = useState<any>({});

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Data states
  const [distributors, setDistributors] = useState<any[]>([
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

  const [regions, setRegions] = useState<any[]>([
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

  const chartData = useMemo(() => {
    return distributors.map(d => ({
      name: d.name,
      performance: d.onTimeDelivery,
      compliance: d.compliance === 'gdp-certified' ? 100 : 50
    }));
  }, [distributors]);

  // CRUD operations
  const handleAddDistributor = async (data: z.infer<typeof distributorSchema>) => {
    try {
      const newDistributor = {
        id: `DIST-${Math.random().toString(36).substr(2, 9)}`,
        ...data
      };
      setDistributors(prev => [...prev, newDistributor]);
      setIsDistributorModalOpen(false);
      toast.success(t("toast.distributor-added"));
    } catch (error) {
      toast.error(t("toast.error-generic"));
    }
  };

  const handleAddRegion = async (data: z.infer<typeof regionSchema>) => {
    if (regions.includes(data.name)) {
      toast.error(t("validation.duplicate-region"));
      return;
    }
    setRegions(prev => [...prev, data.name]);
    toast.success(t("toast.region-added"));
    setIsRegionModalOpen(false)
    regionForm.reset();
  };

  const handleGenerateReport = async (data: z.infer<typeof reportSchema>) => {
    try {
      toast.success(t("toast.report-generated"));
      setIsComplianceReportModalOpen(false);
      reportForm.reset();
    } catch (error) {
      toast.error(t("toast.error-generic"));
    }
  };

  // Inline editing functions
  const handleEdit = (distributor: any) => {
    setEditingId(distributor.id);
    setTempData({ ...distributor });
  };

  const handleSave = (id: string) => {
    setDistributors(distributors.map(d => 
      d.id === id ? { ...tempData } : d
    ));
    setEditingId(null);
    toast.success("Distributor updated successfully");
  };

  return (
    <Box p="6" className="flex-1">
      {/* Header with actions */}
      <Flex justify="between" align="center" mb="5">
        <Heading size="6">{t("main-heading")}</Heading>
        <Flex gap="3">
          <Button variant="soft" onClick={() => setIsDistributorModalOpen(true)}>
            <CheckCircledIcon /> {t("actions.add-distributor")}
          </Button>
          <Button variant="soft" onClick={() => setIsRegionModalOpen(true)}>
            <GlobeIcon /> {t("actions.add-region")}
          </Button>
          <Button variant="soft" onClick={() => setIsComplianceReportModalOpen(true)}>
            <DownloadIcon /> {t("actions.compliance-report")}
          </Button>
        </Flex>
      </Flex>

      {/* Metrics Cards */}
      <Grid columns="4" gap="4" mb="5">
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">{t("metrics.certified-partners.title")}</Text>
            <Heading size="7">24</Heading>
            <Text size="1" className="text-green-500">{t("metrics.certified-partners.compliant-text")}</Text>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">{t("metrics.avg-delivery-time.title")}</Text>
            <Heading size="7">2.4 Days</Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">{t("metrics.license-expirations.title")}</Text>
            <Heading size="7" className="text-red-500">3</Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">{t("metrics.gdp-compliance.title")}</Text>
            <Progress value={98} />
          </Flex>
        </Card>
      </Grid>

      {/* Charts Section */}
      <Grid columns="2" gap="4" mb="5">
        <Card>
          <Flex align="center" gap="2" mb="3">
            <BarChartIcon />
            <Heading size="4">Delivery Performance</Heading>
          </Flex>
          <BarChart
            data={chartData}
            index="name"
            categories={['performance']}
            colors={['green']}
            yAxisWidth={30}
          />
        </Card>
        <Card>
          <Flex align="center" gap="2" mb="3">
            <LineChartIcon />
            <Heading size="4">Compliance Status</Heading>
          </Flex>
          <LineChart
            data={chartData}
            index="name"
            categories={['compliance']}
            colors={['blue']}
            curveType="monotone"
          />
        </Card>
      </Grid>

      {/* Distributors Table */}
      <Card mb="5">
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>{t("table-headers.distributor")}</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>{t("table-headers.region")}</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>{t("table-headers.contact")}</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>{t("table-headers.compliance")}</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>{t("table-headers.otd")}</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>{t("table-headers.licenses")}</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>{t("table-headers.last-audit")}</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {paginatedDistributors.map((distributor) => (
              <Table.Row key={distributor.id}>
                <Table.Cell>
                  {editingId === distributor.id ? (
                    <TextField.Root
                      value={tempData.name}
                      onChange={(e) => setTempData({...tempData, name: e.target.value})}
                    />
                  ) : (
                    distributor.name
                  )}
                </Table.Cell>
                <Table.Cell>
                  {editingId === distributor.id ? (
                    <Select.Root 
                      value={tempData.region}
                      onValueChange={(value) => setTempData({...tempData, region: value})}
                    >
                      <Select.Trigger />
                      <Select.Content>
                        {regions.map(region => (
                          <Select.Item key={region} value={region}>{region}</Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>
                  ) : (
                    distributor.region
                  )}
                </Table.Cell>
                <Table.Cell>
                  {editingId === distributor.id ? (
                    <TextField.Root
                      value={tempData.contact}
                      onChange={(e) => setTempData({...tempData, contact: e.target.value})}
                    />
                  ) : (
                    distributor.contact
                  )}
                </Table.Cell>
                <Table.Cell>
                  <Badge variant="soft" color={distributor.compliance === "gdp-certified" ? "green" : "orange"}>
                    {t(`compliance-status.${distributor.compliance}`)}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  {editingId === distributor.id ? (
                    <TextField.Root
                      type="number"
                      value={tempData.onTimeDelivery}
                      onChange={(e) => setTempData({...tempData, onTimeDelivery: Number(e.target.value)})}
                    />
                  ) : (
                    `${distributor.onTimeDelivery}%`
                  )}
                </Table.Cell>
                <Table.Cell>
                  <Badge color={distributor.licenses === "active" ? "green" : "red"}>
                    {t(`license-status.${distributor.licenses}`)}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  {editingId === distributor.id ? (
                    <TextField.Root
                      type="date"
                      value={tempData.lastAudit}
                      onChange={(e) => setTempData({...tempData, lastAudit: e.target.value})}
                    />
                  ) : (
                    distributor.lastAudit
                  )}
                </Table.Cell>
                <Table.Cell>
                  {editingId === distributor.id ? (
                    <Flex gap="2">
                      <Button size="1" color="green" onClick={() => handleSave(distributor.id)}>
                        <CheckIcon /> Save
                      </Button>
                      <Button size="1" variant="soft" onClick={() => setEditingId(null)}>
                        <Cross2Icon /> Cancel
                      </Button>
                    </Flex>
                  ) : (
                    <Button size="1" onClick={() => handleEdit(distributor)}>
                      <Pencil1Icon /> Edit
                    </Button>
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
        
        <Pagination
          count={Math.ceil(distributors.length / itemsPerPage)}
          page={currentPage}
          onChange={setCurrentPage}
          style={{ marginTop: '1rem' }}
        />
      </Card>

      {/* Add Distributor Modal */}
      <Dialog.Root open={isDistributorModalOpen} onOpenChange={setIsDistributorModalOpen}>
        <Dialog.Content>
          <Dialog.Title>{t("add-distributor.title")}</Dialog.Title>
          <form onSubmit={distributorForm.handleSubmit(handleAddDistributor)}>
            <Flex direction="column" gap="3">
              <Controller
                name="name"
                control={distributorForm.control}
                render={({ field }) => (
                  <TextField.Root placeholder={t("add-distributor.name-placeholder")} {...field}>
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
                    <Select.Trigger placeholder={t("add-distributor.region-placeholder")} />
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
                    <TextField.Slot>Contact</TextField.Slot>
                  </TextField.Root>
                )}
              />

              <Controller
                name="phone"
                control={distributorForm.control}
                render={({ field }) => (
                  <TextField.Root placeholder="Phone" {...field}>
                    <TextField.Slot>Phone</TextField.Slot>
                  </TextField.Root>
                )}
              />

              <Flex gap="3" justify="end">
                <Button type="submit" color="green" disabled={distributorForm.formState.isSubmitting}>
                  {t("actions.save-distributor")}
                </Button>
              </Flex>
            </Flex>
          </form>
        </Dialog.Content>
      </Dialog.Root>

      {/* Add Region Modal */}
      <Dialog.Root open={isRegionModalOpen} onOpenChange={setIsRegionModalOpen}>
        <Dialog.Content>
          <Dialog.Title>{t("add-region.title")}</Dialog.Title>
          <form onSubmit={regionForm.handleSubmit(handleAddRegion)}>
            <Controller
              name="name"
              control={regionForm.control}
              render={({ field }) => (
                <TextField.Root placeholder={t("add-region.name-placeholder")} {...field}>
                  <TextField.Slot>Name</TextField.Slot>
                </TextField.Root>
              )}
            />
            {regionForm.formState.errors.name && (
              <Text color="red" size="1">{regionForm.formState.errors.name.message}</Text>
            )}
            <Flex justify="end" mt="3">
              <Button type="submit" color="green" disabled={regionForm.formState.isSubmitting}>
                {t("actions.save-region")}
              </Button>
            </Flex>
          </form>
        </Dialog.Content>
      </Dialog.Root>

      {/* Compliance Report Modal */}
      <Dialog.Root open={isComplianceReportModalOpen} onOpenChange={setIsComplianceReportModalOpen}>
        <Dialog.Content>
          <Dialog.Title>{t("compliance-report.title")}</Dialog.Title>
          <form onSubmit={reportForm.handleSubmit(handleGenerateReport)}>
            <Flex direction="column" gap="3">
              <Controller
                name="reportType"
                control={reportForm.control}
                render={({ field }) => (
                  <Select.Root value={field.value} onValueChange={field.onChange}>
                    <Select.Trigger placeholder="Select report type" />
                    <Select.Content>
                      <Select.Item value="summary">{t("compliance-report.types.summary")}</Select.Item>
                      <Select.Item value="detailed">{t("compliance-report.types.detailed")}</Select.Item>
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

              <Flex justify="end" mt="3">
                <Button type="submit" color="green" disabled={reportForm.formState.isSubmitting}>
                  {t("actions.generate-report")}
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
