import React, { useEffect } from "react";
import { Modal, Form, Input, InputNumber, Button, message } from "antd";
import { usePayment } from "../hooks/usePayment";

interface AdminCreditModalProps {
  open: boolean;
  onClose: () => void;
  accessToken: string;
  onSuccess: () => void;
  defaultUserId?: string;
}

export const AdminCreditModal: React.FC<AdminCreditModalProps> = ({ 
  open, onClose, accessToken, onSuccess, defaultUserId 
}) => {
  const [form] = Form.useForm();
  const { adminCreditUser } = usePayment();
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (open) {
      form.setFieldsValue({ user_id: defaultUserId || "", amount: 0, reason: "" });
    }
  }, [open, defaultUserId, form]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await adminCreditUser(accessToken, {
        user_id: values.user_id,
        amount: values.amount,
        reason: values.reason,
      });
      message.success("Successfully credited user");
      onSuccess();
      onClose();
    } catch (err: any) {
      message.error(err.message || "Failed to credit user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Credit User Balance (Admin)"
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="mt-4"
      >
        <Form.Item
          name="user_id"
          label="User ID"
          rules={[{ required: true, message: "Please enter user ID" }]}
        >
          <Input placeholder="Enter user ID" />
        </Form.Item>

        <Form.Item
          name="amount"
          label="Amount (VND)"
          rules={[{ required: true, message: "Please enter amount" }]}
        >
          <InputNumber<number>
            className="w-full"
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => (value ? Number(value.replace(/\$\s?|(\.*)/g, '').replace(/,/g, '')) : 0)}
            min={0}
            step={10000}
            addonAfter="₫"
          />
        </Form.Item>

        <Form.Item
          name="reason"
          label="Reason"
          rules={[{ required: true, message: "Please enter reason" }]}
        >
          <Input.TextArea rows={3} placeholder="Reason for crediting..." />
        </Form.Item>

        <Form.Item className="mb-0 text-right">
          <Button onClick={onClose} className="mr-2">
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Confirm Credit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
