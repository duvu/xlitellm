import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableHead,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  Card,
  Text,
  Badge,
  Icon,
  Grid,
  Col,
  Button,
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Title,
} from "@tremor/react";
import NumericalInput from "./shared/numerical_input";
import { Input } from "antd";
import { Alert, Empty, Modal, Form, Tooltip, Select as Select2 } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { RefreshIcon, ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/outline";
import { TextInput } from "@tremor/react";
import { getModelDisplayName } from "./key_team_helpers/fetch_available_models_team_key";
import OrganizationInfoView from "./organization/organization_view";
import { Organization, organizationListCall, organizationCreateCall, organizationDeleteCall } from "./networking";
import VectorStoreSelector from "./vector_store_management/VectorStoreSelector";
import MCPServerSelector from "./mcp_server_management/MCPServerSelector";
import { formatNumberWithCommas } from "../utils/dataUtils";
import NotificationsManager from "./molecules/notifications_manager";
import DeleteResourceModal from "./common_components/DeleteResourceModal";
import TableIconActionButton from "./common_components/IconActionButton/TableIconActionButtons/TableIconActionButton";

interface OrganizationsTableProps {
  organizations: Organization[];
  userRole: string;
  userModels: string[];
  accessToken: string | null;
  lastRefreshed?: string;
  handleRefreshClick?: () => void;
  currentOrg?: any;
  guardrailsList?: string[];
  setOrganizations: (organizations: Organization[]) => void;
  premiumUser: boolean;
}

export const fetchOrganizations = async (
  accessToken: string,
  setOrganizations: (organizations: Organization[]) => void,
) => {
  const organizations = await organizationListCall(accessToken);
  setOrganizations(organizations);
};

const OrganizationsTable: React.FC<OrganizationsTableProps> = ({
  organizations,
  userRole,
  userModels,
  accessToken,
  lastRefreshed,
  handleRefreshClick,
  currentOrg,
  guardrailsList = [],
  setOrganizations,
  premiumUser,
}) => {
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [editOrg, setEditOrg] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [orgToDelete, setOrgToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCreatingOrg, setIsCreatingOrg] = useState(false);
  const [isOrgModalVisible, setIsOrgModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [expandedAccordions, setExpandedAccordions] = useState<Record<string, boolean>>({});
  const [isFetchingOrgs, setIsFetchingOrgs] = useState(false);
  const [orgFetchError, setOrgFetchError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "spend_desc" | "name_asc">("newest");
  const [modelFilter, setModelFilter] = useState<"all" | "all_proxy" | "restricted">("all");
  const canManageOrganizations = userRole === "Admin" || userRole === "Org Admin";

  const refreshOrganizations = async () => {
    if (!accessToken) return;
    try {
      setIsFetchingOrgs(true);
      setOrgFetchError(null);
      await fetchOrganizations(accessToken, setOrganizations);
    } catch (error) {
      setOrgFetchError("Failed to load organizations. Please retry.");
      NotificationsManager.fromBackend("Failed to load organizations");
    } finally {
      setIsFetchingOrgs(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      refreshOrganizations();
    }
  }, [accessToken]);

  const filteredOrganizations = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let data = [...(organizations || [])];

    if (q.length > 0) {
      data = data.filter((org) => {
        const alias = (org.organization_alias || "").toLowerCase();
        const id = (org.organization_id || "").toLowerCase();
        return alias.includes(q) || id.includes(q);
      });
    }

    if (modelFilter === "all_proxy") {
      data = data.filter((org) => (org.models || []).length === 0);
    } else if (modelFilter === "restricted") {
      data = data.filter((org) => (org.models || []).length > 0);
    }

    data.sort((a, b) => {
      if (sortBy === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortBy === "oldest") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (sortBy === "spend_desc") return (b.spend || 0) - (a.spend || 0);
      return (a.organization_alias || "").localeCompare(b.organization_alias || "");
    });

    return data;
  }, [organizations, searchQuery, modelFilter, sortBy]);

  const handleDelete = (orgId: string | null) => {
    if (!orgId) return;

    setOrgToDelete(orgId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!orgToDelete || !accessToken) return;

    try {
      setIsDeleting(true);
      await organizationDeleteCall(accessToken, orgToDelete);
      NotificationsManager.success("Organization deleted successfully");

      setIsDeleteModalOpen(false);
      setOrgToDelete(null);
      // Refresh organizations list
      await fetchOrganizations(accessToken, setOrganizations);
    } catch (error) {
      NotificationsManager.fromBackend("Failed to delete organization");
      console.error("Error deleting organization:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setOrgToDelete(null);
  };

  const handleCreate = async (values: any) => {
    try {
      if (!accessToken) return;
      setIsCreatingOrg(true);

      console.log(`values in organizations new create call: ${JSON.stringify(values)}`);

      // Transform allowed_vector_store_ids and allowed_mcp_servers_and_groups into object_permission
      if (
        (values.allowed_vector_store_ids && values.allowed_vector_store_ids.length > 0) ||
        (values.allowed_mcp_servers_and_groups &&
          (values.allowed_mcp_servers_and_groups.servers?.length > 0 ||
            values.allowed_mcp_servers_and_groups.accessGroups?.length > 0))
      ) {
        values.object_permission = {};
        if (values.allowed_vector_store_ids && values.allowed_vector_store_ids.length > 0) {
          values.object_permission.vector_stores = values.allowed_vector_store_ids;
          delete values.allowed_vector_store_ids;
        }
        if (values.allowed_mcp_servers_and_groups) {
          if (values.allowed_mcp_servers_and_groups.servers?.length > 0) {
            values.object_permission.mcp_servers = values.allowed_mcp_servers_and_groups.servers;
          }
          if (values.allowed_mcp_servers_and_groups.accessGroups?.length > 0) {
            values.object_permission.mcp_access_groups = values.allowed_mcp_servers_and_groups.accessGroups;
          }
          delete values.allowed_mcp_servers_and_groups;
        }
      }

      await organizationCreateCall(accessToken, values);
      NotificationsManager.success("Organization created successfully");
      setIsOrgModalVisible(false);
      form.resetFields();
      // Refresh organizations list
      await refreshOrganizations();
    } catch (error) {
      NotificationsManager.fromBackend("Failed to create organization");
      console.error("Error creating organization:", error);
    } finally {
      setIsCreatingOrg(false);
    }
  };

  const handleCancel = () => {
    setIsOrgModalVisible(false);
    form.resetFields();
  };

  if (!premiumUser) {
    return (
      <div>
        <Text>
          This is a LiteLLM Enterprise feature, and requires a valid key to use. Get a trial key{" "}
          <a href="https://www.litellm.ai/#pricing" target="_blank" rel="noopener noreferrer">
            here
          </a>
          .
        </Text>
      </div>
    );
  }

  return (
    <div className="w-full mx-2 md:mx-4 h-[75vh]">
      <Grid numItems={1} className="gap-3 p-3 md:p-6 w-full mt-2">
        <Col numColSpan={1} className="flex flex-col gap-2">
          <Card className="w-full">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <Title>Organizations</Title>
                <Text>Manage organization access, budgets, and member roles from one place.</Text>
              </div>
              {canManageOrganizations && (
                <Button className="w-fit" onClick={() => setIsOrgModalVisible(true)}>
                  + Create New Organization
                </Button>
              )}
            </div>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
              <Card>
                <Text>Total Organizations</Text>
                <Title>{organizations?.length || 0}</Title>
              </Card>
              <Card>
                <Text>All Proxy Models</Text>
                <Title>{(organizations || []).filter((o) => (o.models || []).length === 0).length}</Title>
              </Card>
              <Card>
                <Text>Total Spend</Text>
                <Title>${formatNumberWithCommas((organizations || []).reduce((acc, cur) => acc + (cur.spend || 0), 0), 2)}</Title>
              </Card>
            </div>
          </Card>

          {selectedOrgId ? (
            <OrganizationInfoView
              organizationId={selectedOrgId}
              onClose={() => {
                setSelectedOrgId(null);
                setEditOrg(false);
              }}
              accessToken={accessToken}
              is_org_admin={true} // You'll need to implement proper org admin check
              is_proxy_admin={userRole === "Admin"}
              userModels={userModels}
              editOrg={editOrg}
            />
          ) : (
            <TabGroup className="gap-2 h-[75vh] w-full">
              <TabList className="flex justify-between mt-2 w-full items-center">
                <div className="flex">
                  <Tab>Your Organizations</Tab>
                </div>
                <div className="flex items-center space-x-2">
                  {lastRefreshed && <Text>Last Refreshed: {lastRefreshed}</Text>}
                  <Icon
                    icon={RefreshIcon}
                    variant="shadow"
                    size="xs"
                    className="self-center"
                    onClick={handleRefreshClick || refreshOrganizations}
                  />
                </div>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Text>Click on &ldquo;Organization ID&rdquo; to view organization details.</Text>

                  <Card className="mt-3">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 items-end">
                      <div>
                        <Text className="mb-1">Search</Text>
                        <Input
                          placeholder="Search by organization name or ID"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          allowClear
                        />
                      </div>
                      <div>
                        <Text className="mb-1">Sort</Text>
                        <Select2 value={sortBy} onChange={(v) => setSortBy(v)} style={{ width: "100%" }}>
                          <Select2.Option value="newest">Newest first</Select2.Option>
                          <Select2.Option value="oldest">Oldest first</Select2.Option>
                          <Select2.Option value="spend_desc">Highest spend</Select2.Option>
                          <Select2.Option value="name_asc">Name (A-Z)</Select2.Option>
                        </Select2>
                      </div>
                      <div>
                        <Text className="mb-1">Model Access</Text>
                        <Select2 value={modelFilter} onChange={(v) => setModelFilter(v)} style={{ width: "100%" }}>
                          <Select2.Option value="all">All</Select2.Option>
                          <Select2.Option value="all_proxy">All Proxy Models</Select2.Option>
                          <Select2.Option value="restricted">Restricted Models</Select2.Option>
                        </Select2>
                      </div>
                    </div>
                  </Card>

                  {orgFetchError && (
                    <Alert
                      className="mt-3"
                      type="error"
                      showIcon
                      message="Could not load organizations"
                      description={orgFetchError}
                      action={
                        <Button size="xs" variant="secondary" onClick={refreshOrganizations}>
                          Retry
                        </Button>
                      }
                    />
                  )}

                  <Grid numItems={1} className="gap-2 pt-2 pb-2 h-[75vh] w-full mt-2">
                    <Col numColSpan={1}>
                      <Card className="w-full mx-auto flex-auto overflow-y-auto max-h-[50vh]">
                        {isFetchingOrgs && <Text>Loading organizations...</Text>}
                        {!isFetchingOrgs && filteredOrganizations.length === 0 && (
                          <Empty
                            description="No organizations match your filters"
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                          >
                            {canManageOrganizations && (
                              <Button size="xs" onClick={() => setIsOrgModalVisible(true)}>
                                Create Organization
                              </Button>
                            )}
                          </Empty>
                        )}
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableHeaderCell>Organization ID</TableHeaderCell>
                              <TableHeaderCell>Organization Name</TableHeaderCell>
                              <TableHeaderCell>Created</TableHeaderCell>
                              <TableHeaderCell>Spend (USD)</TableHeaderCell>
                              <TableHeaderCell>Budget (USD)</TableHeaderCell>
                              <TableHeaderCell>Models</TableHeaderCell>
                              <TableHeaderCell>TPM / RPM Limits</TableHeaderCell>
                              <TableHeaderCell>Info</TableHeaderCell>
                              <TableHeaderCell>Actions</TableHeaderCell>
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            {filteredOrganizations.length > 0
                              ? filteredOrganizations.map((org: Organization) => (
                                    <TableRow key={org.organization_id}>
                                      <TableCell>
                                        <div className="overflow-hidden">
                                          <Tooltip title={org.organization_id}>
                                            <Button
                                              size="xs"
                                              variant="light"
                                              className="font-mono text-blue-500 bg-blue-50 hover:bg-blue-100 text-xs font-normal px-2 py-0.5 text-left overflow-hidden truncate max-w-[200px]"
                                              onClick={() => setSelectedOrgId(org.organization_id)}
                                            >
                                              {org.organization_id?.slice(0, 7)}
                                              ...
                                            </Button>
                                          </Tooltip>
                                        </div>
                                      </TableCell>
                                      <TableCell>{org.organization_alias}</TableCell>
                                      <TableCell>
                                        {org.created_at ? new Date(org.created_at).toLocaleDateString() : "N/A"}
                                      </TableCell>
                                      <TableCell>{formatNumberWithCommas(org.spend, 4)}</TableCell>
                                      <TableCell>
                                        {org.litellm_budget_table?.max_budget !== null &&
                                        org.litellm_budget_table?.max_budget !== undefined
                                          ? org.litellm_budget_table?.max_budget
                                          : "No limit"}
                                      </TableCell>
                                      <TableCell
                                        style={{
                                          maxWidth: "8rem",
                                          whiteSpace: "pre-wrap",
                                          overflow: "hidden",
                                        }}
                                        className={org.models.length > 3 ? "px-0" : ""}
                                      >
                                        <div className="flex flex-col">
                                          {Array.isArray(org.models) ? (
                                            <div className="flex flex-col">
                                              {org.models.length === 0 ? (
                                                <Badge size={"xs"} className="mb-1" color="red">
                                                  <Text>All Proxy Models</Text>
                                                </Badge>
                                              ) : (
                                                <>
                                                  <div className="flex items-start">
                                                    {org.models.length > 3 && (
                                                      <div>
                                                        <Icon
                                                          icon={
                                                            expandedAccordions[org.organization_id || ""]
                                                              ? ChevronDownIcon
                                                              : ChevronRightIcon
                                                          }
                                                          className="cursor-pointer"
                                                          size="xs"
                                                          onClick={() => {
                                                            setExpandedAccordions((prev) => ({
                                                              ...prev,
                                                              [org.organization_id || ""]:
                                                                !prev[org.organization_id || ""],
                                                            }));
                                                          }}
                                                        />
                                                      </div>
                                                    )}
                                                    <div className="flex flex-wrap gap-1">
                                                      {org.models.slice(0, 3).map((model, index) =>
                                                        model === "all-proxy-models" ? (
                                                          <Badge key={index} size={"xs"} color="red">
                                                            <Text>All Proxy Models</Text>
                                                          </Badge>
                                                        ) : (
                                                          <Badge key={index} size={"xs"} color="blue">
                                                            <Text>
                                                              {model.length > 30
                                                                ? `${getModelDisplayName(model).slice(0, 30)}...`
                                                                : getModelDisplayName(model)}
                                                            </Text>
                                                          </Badge>
                                                        ),
                                                      )}
                                                      {org.models.length > 3 &&
                                                        !expandedAccordions[org.organization_id || ""] && (
                                                          <Badge size={"xs"} color="gray" className="cursor-pointer">
                                                            <Text>
                                                              +{org.models.length - 3}{" "}
                                                              {org.models.length - 3 === 1
                                                                ? "more model"
                                                                : "more models"}
                                                            </Text>
                                                          </Badge>
                                                        )}
                                                      {expandedAccordions[org.organization_id || ""] && (
                                                        <div className="flex flex-wrap gap-1">
                                                          {org.models.slice(3).map((model, index) =>
                                                            model === "all-proxy-models" ? (
                                                              <Badge key={index + 3} size={"xs"} color="red">
                                                                <Text>All Proxy Models</Text>
                                                              </Badge>
                                                            ) : (
                                                              <Badge key={index + 3} size={"xs"} color="blue">
                                                                <Text>
                                                                  {model.length > 30
                                                                    ? `${getModelDisplayName(model).slice(0, 30)}...`
                                                                    : getModelDisplayName(model)}
                                                                </Text>
                                                              </Badge>
                                                            ),
                                                          )}
                                                        </div>
                                                      )}
                                                    </div>
                                                  </div>
                                                </>
                                              )}
                                            </div>
                                          ) : null}
                                        </div>
                                      </TableCell>
                                      <TableCell>
                                        <Text>
                                          TPM:{" "}
                                          {org.litellm_budget_table?.tpm_limit
                                            ? org.litellm_budget_table?.tpm_limit
                                            : "Unlimited"}
                                          <br />
                                          RPM:{" "}
                                          {org.litellm_budget_table?.rpm_limit
                                            ? org.litellm_budget_table?.rpm_limit
                                            : "Unlimited"}
                                        </Text>
                                      </TableCell>
                                      <TableCell>
                                        <Text>{org.members?.length || 0} Members</Text>
                                      </TableCell>
                                      <TableCell>
                                        {userRole === "Admin" && (
                                          <>
                                            <TableIconActionButton
                                              variant="Edit"
                                              tooltipText="Edit organization"
                                              onClick={() => {
                                                setSelectedOrgId(org.organization_id);
                                                setEditOrg(true);
                                              }}
                                            />
                                            <TableIconActionButton
                                              variant="Delete"
                                              tooltipText="Delete organization"
                                              onClick={() => handleDelete(org.organization_id)}
                                            />
                                          </>
                                        )}
                                      </TableCell>
                                    </TableRow>
                                  ))
                              : null}
                          </TableBody>
                        </Table>
                      </Card>
                    </Col>
                  </Grid>
                </TabPanel>
              </TabPanels>
            </TabGroup>
          )}
        </Col>
      </Grid>
      <Modal title="Create Organization" visible={isOrgModalVisible} width={800} footer={null} onCancel={handleCancel}>
        <Form form={form} onFinish={handleCreate} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} labelAlign="left">
          <Form.Item
            label="Organization Name"
            name="organization_alias"
            rules={[
              {
                required: true,
                message: "Please input an organization name",
              },
              {
                min: 3,
                message: "Organization name must be at least 3 characters",
              },
            ]}
          >
            <TextInput placeholder="" />
          </Form.Item>
          <Form.Item label="Models" name="models">
            <Select2 mode="multiple" placeholder="Select models" style={{ width: "100%" }}>
              <Select2.Option key="all-proxy-models" value="all-proxy-models">
                All Proxy Models
              </Select2.Option>
              {userModels &&
                userModels.length > 0 &&
                userModels.map((model) => (
                  <Select2.Option key={model} value={model}>
                    {getModelDisplayName(model)}
                  </Select2.Option>
                ))}
            </Select2>
          </Form.Item>

          <Form.Item label="Max Budget (USD)" name="max_budget">
            <NumericalInput step={0.01} precision={2} width={200} />
          </Form.Item>
          <Form.Item label="Reset Budget" name="budget_duration">
            <Select2 defaultValue={null} placeholder="n/a">
              <Select2.Option value="24h">daily</Select2.Option>
              <Select2.Option value="7d">weekly</Select2.Option>
              <Select2.Option value="30d">monthly</Select2.Option>
            </Select2>
          </Form.Item>
          <Form.Item label="Tokens per minute Limit (TPM)" name="tpm_limit">
            <NumericalInput step={1} width={400} />
          </Form.Item>
          <Form.Item label="Requests per minute Limit (RPM)" name="rpm_limit">
            <NumericalInput step={1} width={400} />
          </Form.Item>

          <Form.Item
            label={
              <span>
                Allowed Vector Stores{" "}
                <Tooltip title="Select which vector stores this organization can access by default. Leave empty for access to all vector stores">
                  <InfoCircleOutlined style={{ marginLeft: "4px" }} />
                </Tooltip>
              </span>
            }
            name="allowed_vector_store_ids"
            className="mt-4"
            help="Select vector stores this organization can access. Leave empty for access to all vector stores"
          >
            <VectorStoreSelector
              onChange={(values) => form.setFieldValue("allowed_vector_store_ids", values)}
              value={form.getFieldValue("allowed_vector_store_ids")}
              accessToken={accessToken || ""}
              placeholder="Select vector stores (optional)"
            />
          </Form.Item>

          <Form.Item
            label={
              <span>
                Allowed MCP Servers{" "}
                <Tooltip title="Select which MCP servers and access groups this organization can access by default.">
                  <InfoCircleOutlined style={{ marginLeft: "4px" }} />
                </Tooltip>
              </span>
            }
            name="allowed_mcp_servers_and_groups"
            className="mt-4"
            help="Select MCP servers and access groups this organization can access."
          >
            <MCPServerSelector
              onChange={(values) => form.setFieldValue("allowed_mcp_servers_and_groups", values)}
              value={form.getFieldValue("allowed_mcp_servers_and_groups")}
              accessToken={accessToken || ""}
              placeholder="Select MCP servers and access groups (optional)"
            />
          </Form.Item>

          <Form.Item
            label="Metadata"
            name="metadata"
            rules={[
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  try {
                    JSON.parse(value);
                    return Promise.resolve();
                  } catch {
                    return Promise.reject(new Error("Metadata must be valid JSON"));
                  }
                },
              },
            ]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <div style={{ textAlign: "right", marginTop: "10px" }}>
            <Button type="submit" loading={isCreatingOrg}>
              Create Organization
            </Button>
          </div>
        </Form>
      </Modal>

      <DeleteResourceModal
        isOpen={isDeleteModalOpen}
        title="Delete Organization?"
        message="Are you sure you want to delete this organization? This action cannot be undone."
        resourceInformationTitle="Organization Information"
        resourceInformation={[{ label: "Organization ID", value: orgToDelete, code: true }]}
        onCancel={cancelDelete}
        onOk={confirmDelete}
        confirmLoading={isDeleting}
      />
    </div>
  );
};

export default OrganizationsTable;
