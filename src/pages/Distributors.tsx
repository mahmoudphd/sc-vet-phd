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
import { CheckCircledIcon, DownloadIcon, GlobeIcon } from "@radix-ui/react-icons";
import { useTranslation } from "react-i18next";
import { useState } from "react";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";


// Zod schemas
const distributorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  region: z.string().min(1, "Region is required"),
  compliance: z.enum(["gdp-certified", "pending"]),
  licenses: z.enum(["active", "inactive"]),
  onTimeDelivery: z.number().min(0).max(100),
  lastAudit: z.string().date()
});

const regionSchema = z.object({
  name: z.string().min(1, "Name is required")
});

const reportSchema = z.object({
  reportType: z.enum(["summary", "detailed"]),
  startDate: z.string().date(),
  endDate: z.string().date()
}).refine(data => new Date(data.endDate) > new Date(data.startDate), {
  message: "End date must be after start date",
  path: ["endDate"]
});

const Distributors = () => {
  const { t } = useTranslation("distributors-page");
  
  const [isDistributorModalOpen, setIsDistributorModalOpen] = useState(false);
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);
  const [isComplianceReportModalOpen, setIsComplianceReportModalOpen] = useState(false);


  const [distributors, setDistributors] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);

  // Distributor Form
  const distributorForm = useForm<z.infer<typeof distributorSchema>>({
    resolver: zodResolver(distributorSchema),
    defaultValues: {
      name: "",
      region: "",
      compliance: "pending",
      licenses: "active",
      onTimeDelivery: 100,
      lastAudit: new Date().toISOString().split('T')[0]
    }
  });

  // Region Form
  const regionForm = useForm<z.infer<typeof regionSchema>>({
    resolver: zodResolver(regionSchema)
  });

  // Report Form
  const reportForm = useForm<z.infer<typeof reportSchema>>({
    resolver: zodResolver(reportSchema)
  });

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
      // Report generation logic
      toast.success(t("toast.report-generated"));
      setIsComplianceReportModalOpen(false);
      reportForm.reset();
    } catch (error) {
      toast.error(t("toast.error-generic"));
    }
  };

  return (
    <Box p="6" className="flex-1">
      <Flex justify="between" align="center" mb="5">
        <Heading size="6">{t("main-heading")}</Heading>
        <Flex gap="3">
          <Button 
            variant="soft" 
            onClick={() => setIsDistributorModalOpen(true)}
            className="hover:scale-105 transition-transform"
          >
            <CheckCircledIcon /> {t("actions.add-distributor")}
          </Button>
          <Button 
            variant="soft" 
            onClick={() => setIsRegionModalOpen(true)}
            className="hover:scale-105 transition-transform"
          >
            <GlobeIcon /> {t("actions.add-region")}
          </Button>
          <Button 
            variant="soft" 
            onClick={() => setIsComplianceReportModalOpen(true)}
            className="hover:scale-105 transition-transform"
          >
            <DownloadIcon /> {t("actions.compliance-report")}
          </Button>
        </Flex>
      </Flex>

      <Dialog.Root onOpenChange={setIsDistributorModalOpen} open={isDistributorModalOpen}>
        <Dialog.Content>
          <Dialog.Title>{t("add-distributor.title")}</Dialog.Title>
          
          <form onSubmit={distributorForm.handleSubmit(handleAddDistributor)}>
            <Flex direction="column" gap="3">
              <Controller
                name="name"
                control={distributorForm.control}
                render={({ field }) => (
                  <TextField.Root
                    placeholder={t("add-distributor.name-placeholder")}
                    {...field}
                  >
                    <TextField.Slot>Name</TextField.Slot>
                  </TextField.Root>
                )}
              />
              {distributorForm.formState.errors.name && (
                <Text color="red" size="1">
                  {distributorForm.formState.errors.name.message}
                </Text>
              )}

              <Controller
                name="region"
                control={distributorForm.control}
                render={({ field }) => (
                  <Select.Root
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <Select.Trigger placeholder={t("add-distributor.region-placeholder")} />
                    <Select.Content>
                      {regions.map(region => (
                        <Select.Item key={region} value={region}>
                          {region}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                )}
              />
              {distributorForm.formState.errors.region && (
                <Text color="red" size="1">
                  {distributorForm.formState.errors.region.message}
                </Text>
              )}

              {/* Other form fields */}

              <Flex gap="3" justify="end">
                <Button type="submit" disabled={distributorForm.formState.isSubmitting}>
                  {t("actions.save-distributor")}
                </Button>
              </Flex>
            </Flex>
          </form>
        </Dialog.Content>
      </Dialog.Root>

      {/* Add Region Modal */}
      <Dialog.Root onOpenChange={setIsRegionModalOpen} open={isRegionModalOpen}>
        <Dialog.Content>
          <Dialog.Title>{t("add-region.title")}</Dialog.Title>
          
          <form onSubmit={regionForm.handleSubmit(handleAddRegion)}>
            <Controller
              name="name"
              control={regionForm.control}
              render={({ field }) => (
                <TextField.Root
                  placeholder={t("add-region.name-placeholder")}
                  {...field}
                >
                  <TextField.Slot>Name</TextField.Slot>
                </TextField.Root>
              )}
            />
            {regionForm.formState.errors.name && (
              <Text color="red" size="1">
                {regionForm.formState.errors.name.message}
              </Text>
            )}

            <Button type="submit" disabled={regionForm.formState.isSubmitting}>
              {t("actions.save-region")}
            </Button>
          </form>
        </Dialog.Content>
      </Dialog.Root>

      {/* Compliance Report Modal */}
      <Dialog.Root onOpenChange={setIsComplianceReportModalOpen} open={isComplianceReportModalOpen}>
        <Dialog.Content>
          <Dialog.Title>{t("compliance-report.title")}</Dialog.Title>
          
          <form onSubmit={reportForm.handleSubmit(handleGenerateReport)}>
            <Controller
              name="reportType"
              control={reportForm.control}
              render={({ field }) => (
                <Select.Root
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <Select.Trigger />
                  <Select.Content>
                    <Select.Item value="summary">
                      {t("compliance-report.types.summary")}
                    </Select.Item>
                    <Select.Item value="detailed">
                      {t("compliance-report.types.detailed")}
                    </Select.Item>
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
              <Text color="red" size="1">
                {reportForm.formState.errors.endDate.message}
              </Text>
            )}

            <Button type="submit" disabled={reportForm.formState.isSubmitting}>
              {t("actions.generate-report")}
            </Button>
          </form>
        </Dialog.Content>
      </Dialog.Root>


      <Grid columns="4" gap="4" mb="5">
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">{t("metrics.certified-partners.title")}</Text>
            <Heading size="7">24</Heading>
            <Text size="1" className="text-green-500">
              {t("metrics.certified-partners.compliant-text")}
            </Text>
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
            <Heading size="7" className="text-red-500">
              3
            </Heading>
          </Flex>
        </Card>
        <Card>
          <Flex direction="column" gap="1">
            <Text size="2">{t("metrics.gdp-compliance.title")}</Text>
            <Progress value={98} />
          </Flex>
        </Card>
      </Grid>

      <Flex gap="4" mb="5">
        <Card style={{ flex: 1 }}>
          <Heading size="4" mb="3">
            {t("geo-coverage-title")}
          </Heading>
          {/* Map container remains unchanged */}
        </Card>
      </Flex>

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>
              {t("table-headers.distributor")}
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>
              {t("table-headers.region")}
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>
              {t("table-headers.compliance")}
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>
              {t("table-headers.otd")}
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>
              {t("table-headers.licenses")}
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>
              {t("table-headers.last-audit")}
            </Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {distributors.map((distributor) => (
            <Table.Row key={distributor.id}>
              <Table.Cell>{distributor.name}</Table.Cell>
              <Table.Cell>{distributor.region}</Table.Cell>
              <Table.Cell>
                <Badge variant="soft" color="green">
                  {t(`compliance-status.${distributor.compliance}`)}
                </Badge>
              </Table.Cell>
              <Table.Cell>{distributor.onTimeDelivery}%</Table.Cell>
              <Table.Cell>
                <Badge
                  color={distributor.licenses === "active" ? "green" : "red"}
                >
                  {t(`license-status.${distributor.licenses}`)}
                </Badge>
              </Table.Cell>
              <Table.Cell>{distributor.lastAudit}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

export default Distributors;
