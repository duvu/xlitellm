import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import React from "react";

vi.mock("./vector_store_management/VectorStoreSelector", () => ({
  __esModule: true,
  default: () => null,
}));
vi.mock("./mcp_server_management/MCPServerSelector", () => ({
  __esModule: true,
  default: () => null,
}));

import OrganizationsTable from "./organizations";

describe("OrganizationsTable", () => {
  it("should render the OrganizationsTable component", () => {
    const setOrganizations = vi.fn();

    const { getByText } = render(
      <OrganizationsTable
        organizations={[]}
        userRole="Admin"
        userModels={[]}
        accessToken={null}
        setOrganizations={setOrganizations}
        premiumUser={true}
      />,
    );

    expect(getByText("+ Create New Organization")).toBeInTheDocument();
  });

  it("hides create button for non-admin roles", () => {
    const setOrganizations = vi.fn();

    const { queryByText } = render(
      <OrganizationsTable
        organizations={[]}
        userRole="Viewer"
        userModels={[]}
        accessToken={null}
        setOrganizations={setOrganizations}
        premiumUser={true}
      />,
    );

    expect(queryByText("+ Create New Organization")).not.toBeInTheDocument();
  });

  it("shows enterprise gate message when premiumUser is false", () => {
    const setOrganizations = vi.fn();

    const { getByText } = render(
      <OrganizationsTable
        organizations={[]}
        userRole="Admin"
        userModels={[]}
        accessToken={null}
        setOrganizations={setOrganizations}
        premiumUser={false}
      />,
    );

    expect(getByText(/This is a LiteLLM Enterprise feature/i)).toBeInTheDocument();
  });

  it("should filter organizations by search query", () => {
    const setOrganizations = vi.fn();

    const { getByPlaceholderText, queryByText, getByText } = render(
      <OrganizationsTable
        organizations={[
          {
            organization_id: "org_alpha_123",
            organization_alias: "Alpha Org",
            budget_id: "b1",
            metadata: {},
            models: [],
            spend: 2,
            model_spend: {},
            created_at: new Date().toISOString(),
            created_by: "u1",
            updated_at: new Date().toISOString(),
            updated_by: "u1",
            litellm_budget_table: {},
            teams: [],
            users: [],
            members: [],
          },
          {
            organization_id: "org_beta_456",
            organization_alias: "Beta Org",
            budget_id: "b2",
            metadata: {},
            models: ["gpt-4"],
            spend: 5,
            model_spend: {},
            created_at: new Date().toISOString(),
            created_by: "u1",
            updated_at: new Date().toISOString(),
            updated_by: "u1",
            litellm_budget_table: {},
            teams: [],
            users: [],
            members: [],
          },
        ]}
        userRole="Admin"
        userModels={[]}
        accessToken={null}
        setOrganizations={setOrganizations}
        premiumUser={true}
      />,
    );

    expect(getByText("Alpha Org")).toBeInTheDocument();
    expect(getByText("Beta Org")).toBeInTheDocument();

    fireEvent.change(getByPlaceholderText("Search by organization name or ID"), {
      target: { value: "alpha" },
    });

    expect(getByText("Alpha Org")).toBeInTheDocument();
    expect(queryByText("Beta Org")).not.toBeInTheDocument();
  });

  it("shows empty state when search has no matches", () => {
    const setOrganizations = vi.fn();

    const { getByPlaceholderText, getByText } = render(
      <OrganizationsTable
        organizations={[
          {
            organization_id: "org_alpha_123",
            organization_alias: "Alpha Org",
            budget_id: "b1",
            metadata: {},
            models: [],
            spend: 2,
            model_spend: {},
            created_at: new Date().toISOString(),
            created_by: "u1",
            updated_at: new Date().toISOString(),
            updated_by: "u1",
            litellm_budget_table: {},
            teams: [],
            users: [],
            members: [],
          },
        ]}
        userRole="Admin"
        userModels={[]}
        accessToken={null}
        setOrganizations={setOrganizations}
        premiumUser={true}
      />,
    );

    fireEvent.change(getByPlaceholderText("Search by organization name or ID"), {
      target: { value: "zzz" },
    });

    expect(getByText("No organizations match your filters")).toBeInTheDocument();
  });
});
