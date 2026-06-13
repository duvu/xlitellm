import React, { useState } from "react";
import { Modal, Button, Input, Select, message, Typography } from "antd";
import { usePayment, PaymentIntent } from "../hooks/usePayment";
import { CheckCircleOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface TopUpModalProps {
  open: boolean;
  onClose: () => void;
  accessToken: string;
  onSuccess: () => void;
}

const PRESET_AMOUNTS = [50000, 100000, 200000, 500000, 1000000];

export const TopUpModal: React.FC<TopUpModalProps> = ({ open, onClose, accessToken, onSuccess }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [intent, setIntent] = useState<PaymentIntent | null>(null);
  
  const [amount, setAmount] = useState<number | null>(null);
  const [provider, setProvider] = useState<string>("payos");
  const [description, setDescription] = useState<string>("");

  const { createPayment } = usePayment();

  const handleCreate = async () => {
    if (!amount || amount < 10000) {
      message.error("Please enter a valid amount (min 10,000 ₫)");
      return;
    }
    
    setLoading(true);
    try {
      const res = await createPayment(accessToken, {
        provider,
        amount,
        description,
      });
      setIntent(res);
      setStep(2);
    } catch (err: any) {
      message.error(err.message || "Failed to create payment");
    } finally {
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setStep(1);
    setAmount(null);
    setDescription("");
    setIntent(null);
    onClose();
  };

  const handleDone = () => {
    onSuccess();
    resetAndClose();
  };

  return (
    <Modal
      title="Nạp tiền / Top Up"
      open={open}
      onCancel={resetAndClose}
      footer={null}
      destroyOnClose
    >
      {step === 1 && (
        <div className="flex flex-col gap-4 py-4">
          <div>
            <div className="mb-2 font-medium">Select Amount</div>
            <div className="flex flex-wrap gap-2 mb-4">
              {PRESET_AMOUNTS.map((amt) => (
                <Button 
                  key={amt} 
                  type={amount === amt ? "primary" : "default"}
                  onClick={() => setAmount(amt)}
                >
                  {amt.toLocaleString("vi-VN")} ₫
                </Button>
              ))}
            </div>
            <Input 
              type="number"
              placeholder="Or enter custom amount..."
              value={amount || ""}
              onChange={(e) => setAmount(Number(e.target.value))}
              prefix="₫"
              min={10000}
              step={10000}
            />
          </div>

          <div>
            <div className="mb-2 font-medium">Payment Provider</div>
            <Select 
              value={provider} 
              onChange={setProvider} 
              className="w-full"
              options={[
                { value: "payos", label: "PayOS (QR Code)" },
                { value: "sepay", label: "SePay" }
              ]}
            />
          </div>

          <div>
            <div className="mb-2 font-medium">Description (Optional)</div>
            <Input.TextArea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Payment description..."
              rows={2}
            />
          </div>

          <Button 
            type="primary" 
            size="large" 
            className="mt-4"
            loading={loading}
            onClick={handleCreate}
          >
            Create Payment
          </Button>
        </div>
      )}

      {step === 2 && intent && (
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="text-xl font-bold text-center">
            {intent.amount.toLocaleString("vi-VN")} ₫
          </div>
          
          {intent.qr_data && (
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={intent.qr_data} alt="Payment QR Code" className="w-[300px] h-[300px] object-contain" />
            </div>
          )}

          {intent.bank_info && Object.keys(intent.bank_info).length > 0 && (
            <div className="w-full bg-gray-50 p-4 rounded-lg text-sm">
              {Object.entries(intent.bank_info).map(([k, v]) => (
                <div key={k} className="flex justify-between mb-1">
                  <span className="text-gray-500 capitalize">{k.replace(/_/g, ' ')}:</span>
                  <span className="font-mono font-medium">{v}</span>
                </div>
              ))}
            </div>
          )}

          {intent.order_code && (
            <div className="text-center mb-4">
              <Text type="secondary">Mã đơn hàng / Order Code</Text>
              <div className="font-mono text-lg font-bold">{intent.order_code}</div>
            </div>
          )}

          <Button 
            type="primary" 
            size="large" 
            icon={<CheckCircleOutlined />}
            onClick={handleDone}
            className="w-full"
          >
            Đã thanh toán (I have paid)
          </Button>
        </div>
      )}
    </Modal>
  );
};
