import { useCallback } from "react";
import { proxyBaseUrl } from "@/components/networking";

export interface UserBalance {
  user_id: string;
  balance: number;
  currency: string;
  last_updated: string;
}

export interface PaymentIntent {
  id: string;
  provider: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "expired";
  user_id: string;
  payment_url?: string;
  qr_data?: string;
  bank_info?: { [key: string]: string };
  order_code?: string;
  created_at: string;
  expires_at?: string;
}

export interface PaymentTxn {
  id: string;
  provider: string;
  user_id: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "expired";
  payment_url?: string;
  qr_data?: string;
  order_code?: string;
  description?: string;
  created_at: string;
  completed_at?: string;
  expires_at?: string;
}

export interface PaymentListResponse {
  page: number;
  page_size: number;
  items: PaymentTxn[];
}

export const usePayment = () => {
  const fetchBalance = useCallback(async (accessToken: string): Promise<UserBalance> => {
    const url = proxyBaseUrl ? `${proxyBaseUrl}/payment/balance` : `/payment/balance`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }, []);

  const createPayment = useCallback(async (
    accessToken: string,
    body: { provider: string; amount: number; description?: string }
  ): Promise<PaymentIntent> => {
    const url = proxyBaseUrl ? `${proxyBaseUrl}/payment/create` : `/payment/create`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...body, currency: "VND" }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }, []);

  const fetchPaymentList = useCallback(async (accessToken: string, page = 1): Promise<PaymentListResponse> => {
    const url = proxyBaseUrl
      ? `${proxyBaseUrl}/payment/list?page=${page}&page_size=20`
      : `/payment/list?page=${page}&page_size=20`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }, []);

  const fetchAdminPaymentList = useCallback(async (
    accessToken: string,
    filters: { status?: string; provider?: string; user_id?: string; page?: number }
  ): Promise<PaymentListResponse> => {
    const params = new URLSearchParams();
    if (filters.status) params.append("status", filters.status);
    if (filters.provider) params.append("provider", filters.provider);
    if (filters.user_id) params.append("user_id", filters.user_id);
    params.append("page", (filters.page || 1).toString());
    params.append("page_size", "50");

    const qs = params.toString();
    const url = proxyBaseUrl ? `${proxyBaseUrl}/payment/admin/list?${qs}` : `/payment/admin/list?${qs}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }, []);

  const adminCreditUser = useCallback(async (
    accessToken: string,
    body: { user_id: string; amount: number; reason: string }
  ): Promise<UserBalance> => {
    const url = proxyBaseUrl ? `${proxyBaseUrl}/payment/admin/credit` : `/payment/admin/credit`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }, []);

  return {
    fetchBalance,
    createPayment,
    fetchPaymentList,
    fetchAdminPaymentList,
    adminCreditUser,
  };
};
