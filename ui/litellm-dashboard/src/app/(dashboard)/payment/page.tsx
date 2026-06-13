"use client";

import useAuthorized from "@/app/(dashboard)/hooks/useAuthorized";
import PaymentView from "./PaymentView";

const PaymentPage = () => {
  const { accessToken, userRole, userId } = useAuthorized();
  
  if (!accessToken) return null;
  
  return <PaymentView accessToken={accessToken} userRole={userRole} userId={userId ?? ""} />;
};

export default PaymentPage;
