import React, { useEffect, useState, useCallback } from "react";
import { Table, Tag, Input, Select, Button, Space, message, Card } from "antd";
import type { ColumnsType } from "antd/es/table";
import { usePayment, PaymentTxn } from "../hooks/usePayment";
import { AdminCreditModal } from "./AdminCreditModal";

interface PaymentHistoryTableProps {
  accessToken: string;
  isAdmin?: boolean;
}

export const PaymentHistoryTable: React.FC<PaymentHistoryTableProps> = ({ accessToken, isAdmin = false }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PaymentTxn[]>([]);
  const [page, setPage] = useState(1);

  // Filters for admin
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterProvider, setFilterProvider] = useState<string>("");
  const [filterUserId, setFilterUserId] = useState<string>("");

  const [creditModalOpen, setCreditModalOpen] = useState(false);
  const [creditUserId, setCreditUserId] = useState<string>("");

  const { fetchPaymentList, fetchAdminPaymentList } = usePayment();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      if (isAdmin) {
        const res = await fetchAdminPaymentList(accessToken, {
          page,
          status: filterStatus || undefined,
          provider: filterProvider || undefined,
          user_id: filterUserId || undefined,
        });
        setData(res.items);
      } else {
        const res = await fetchPaymentList(accessToken, page);
        setData(res.items);
      }
    } catch (err: any) {
      message.error(err.message || "Failed to load payment history");
    } finally {
      setLoading(false);
    }
  }, [accessToken, isAdmin, page, filterStatus, filterProvider, filterUserId, fetchAdminPaymentList, fetchPaymentList]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const columns: ColumnsType<PaymentTxn> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (id: string) => <span className="font-mono text-xs">{id.substring(0, 8)}...</span>,
    },
    {
      title: "User ID",
      dataIndex: "user_id",
      key: "user_id",
      render: (uid: string) => <span className="font-mono text-xs text-gray-500">{uid}</span>,
    },
    {
      title: "Provider",
      dataIndex: "provider",
      key: "provider",
      render: (text: string) => <Tag>{text}</Tag>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => <span className="font-medium">{amount.toLocaleString("vi-VN")} ₫</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color = "blue";
        if (status === "completed") color = "green";
        if (status === "failed") color = "red";
        if (status === "expired") color = "gray";
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: PaymentTxn) => (
        <Button 
          size="small" 
          type="link" 
          onClick={() => {
            setCreditUserId(record.user_id);
            setCreditModalOpen(true);
          }}
        >
          Credit
        </Button>
      ),
    }
  ].filter(col => isAdmin ? true : col.key !== 'user_id' && col.key !== 'actions');

  return (
    <div className="flex flex-col gap-4">
      {isAdmin && (
        <Card size="small" className="bg-gray-50 shadow-sm border-gray-200">
          <Space className="flex-wrap">
            <Input 
              placeholder="Filter User ID" 
              value={filterUserId}
              onChange={(e) => setFilterUserId(e.target.value)}
              allowClear
              className="w-48"
            />
            <Select
              placeholder="Status"
              value={filterStatus || undefined}
              onChange={setFilterStatus}
              allowClear
              className="w-32"
              options={[
                { value: "pending", label: "Pending" },
                { value: "completed", label: "Completed" },
                { value: "failed", label: "Failed" },
                { value: "expired", label: "Expired" },
              ]}
            />
            <Select
              placeholder="Provider"
              value={filterProvider || undefined}
              onChange={setFilterProvider}
              allowClear
              className="w-32"
              options={[
                { value: "payos", label: "PayOS" },
                { value: "sepay", label: "SePay" },
              ]}
            />
            <Button onClick={() => setPage(1)}>Filter</Button>
          </Space>
        </Card>
      )}

      <Table
        dataSource={data}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{
          current: page,
          pageSize: isAdmin ? 50 : 20,
          onChange: (p) => setPage(p),
          showSizeChanger: false,
        }}
        size="small"
      />

      {isAdmin && (
        <AdminCreditModal
          open={creditModalOpen}
          onClose={() => setCreditModalOpen(false)}
          accessToken={accessToken}
          defaultUserId={creditUserId}
          onSuccess={() => {
            loadData();
          }}
        />
      )}
    </div>
  );
};
