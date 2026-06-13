import React, { useEffect, useState, useCallback } from "react";
import { Tabs, Button, Typography, message } from "antd";
import { WalletOutlined, PlusOutlined } from "@ant-design/icons";
import { isAdminRole } from "@/utils/roles";

import { usePayment, UserBalance } from "./hooks/usePayment";
import { BalanceCard } from "./components/BalanceCard";
import { TopUpModal } from "./components/TopUpModal";
import { PaymentHistoryTable } from "./components/PaymentHistoryTable";
import { AdminCreditModal } from "./components/AdminCreditModal";

const { Title } = Typography;

interface PaymentViewProps {
  accessToken: string;
  userRole: string;
  userId: string;
}

export default function PaymentView({ accessToken, userRole, userId }: PaymentViewProps) {
  const [balance, setBalance] = useState<UserBalance | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [topUpModalOpen, setTopUpModalOpen] = useState(false);
  const [adminCreditModalOpen, setAdminCreditModalOpen] = useState(false);

  const { fetchBalance } = usePayment();
  const isAdmin = isAdminRole(userRole);

  const loadBalance = useCallback(async () => {
    setLoadingBalance(true);
    try {
      const res = await fetchBalance(accessToken);
      setBalance(res);
    } catch (err: any) {
      message.error(err.message || "Failed to load balance");
    } finally {
      setLoadingBalance(false);
    }
  }, [accessToken, fetchBalance]);

  useEffect(() => {
    loadBalance();
  }, [loadBalance]);

  const items = [
    {
      key: "history",
      label: "My Payment History",
      children: <PaymentHistoryTable accessToken={accessToken} isAdmin={false} />,
    },
  ];

  if (isAdmin) {
    items.push({
      key: "admin",
      label: "Admin Controls",
      children: (
        <div className="flex flex-col gap-4">
          <div className="flex justify-end">
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => setAdminCreditModalOpen(true)}
            >
              Credit User
            </Button>
          </div>
          <PaymentHistoryTable accessToken={accessToken} isAdmin={true} />
        </div>
      ),
    });
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6 lg:p-8 flex flex-col gap-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Title level={2} className="!mb-0 flex items-center gap-3">
            <WalletOutlined className="text-blue-500" />
            Payment
          </Title>
          <div className="text-gray-500 mt-1">Manage your balance and view payment history</div>
        </div>

        <Button 
          type="primary" 
          size="large" 
          icon={<PlusOutlined />}
          onClick={() => setTopUpModalOpen(true)}
          className="shadow-md bg-blue-600 hover:bg-blue-500"
        >
          Nạp tiền / Top Up
        </Button>
      </div>

      <BalanceCard 
        balance={balance} 
        loading={loadingBalance} 
        onRefresh={loadBalance} 
      />

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <Tabs items={items} />
      </div>

      <TopUpModal 
        open={topUpModalOpen}
        onClose={() => setTopUpModalOpen(false)}
        accessToken={accessToken}
        onSuccess={() => {
          loadBalance();
          // The table will auto-refresh if it's the active tab, or user can click refresh
        }}
      />

      {isAdmin && (
        <AdminCreditModal
          open={adminCreditModalOpen}
          onClose={() => setAdminCreditModalOpen(false)}
          accessToken={accessToken}
          onSuccess={() => {
            // Might want to reload balance if we credited ourselves, but usually it's for others
          }}
        />
      )}
    </div>
  );
}
