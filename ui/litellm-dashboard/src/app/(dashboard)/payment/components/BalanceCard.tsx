import React from "react";
import { Card, Button, Spin } from "antd";
import { WalletOutlined, ReloadOutlined } from "@ant-design/icons";
import { UserBalance } from "../hooks/usePayment";

interface BalanceCardProps {
  balance: UserBalance | null;
  loading: boolean;
  onRefresh: () => void;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({ balance, loading, onRefresh }) => {
  return (
    <Card className="shadow-sm w-full md:w-96">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-gray-500 mb-2 flex items-center gap-2">
            <WalletOutlined />
            <span>Current Balance</span>
          </div>
          <Spin spinning={loading}>
            <div className="text-3xl font-bold">
              {balance ? balance.balance.toLocaleString("vi-VN") + " ₫" : "0 ₫"}
            </div>
          </Spin>
        </div>
        <Button 
          icon={<ReloadOutlined />} 
          onClick={onRefresh} 
          loading={loading}
          type="text"
        />
      </div>
    </Card>
  );
};
