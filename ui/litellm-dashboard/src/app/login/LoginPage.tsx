"use client";

import { useLogin } from "@/app/(dashboard)/hooks/login/useLogin";
import { useUIConfig } from "@/app/(dashboard)/hooks/uiConfig/useUIConfig";
import LoadingScreen from "@/components/common_components/LoadingScreen";
import { getProxyBaseUrl } from "@/components/networking";
import { getCookie } from "@/utils/cookieUtils";
import { isJwtExpired } from "@/utils/jwtUtils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Button, Card, Form, Input } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function LoginPageContent() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { data: uiConfig, isLoading: isConfigLoading } = useUIConfig();
  const loginMutation = useLogin();
  const router = useRouter();

  useEffect(() => {
    if (isConfigLoading) {
      return;
    }

    const rawToken = getCookie("token");
    if (rawToken && !isJwtExpired(rawToken)) {
      router.replace(`${getProxyBaseUrl()}/ui`);
      return;
    }

    if (uiConfig && uiConfig.auto_redirect_to_sso) {
      router.push(`${getProxyBaseUrl()}/sso/key/generate`);
      return;
    }

    setIsLoading(false);
  }, [isConfigLoading, router, uiConfig]);

  const handleSubmit = () => {
    loginMutation.mutate(
      { username, password },
      {
        onSuccess: (data) => {
          router.push(data.redirect_url);
        },
      },
    );
  };

  const isLoginLoading = loginMutation.isPending;

  if (isConfigLoading || isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-lg shadow-md">
        <Form onFinish={handleSubmit} layout="vertical" requiredMark={true}>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please enter your username" }]}
          >
            <Input
              placeholder="Enter your username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoginLoading}
              size="large"
              className="rounded-md border-gray-300"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password
              placeholder="Enter your password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoginLoading}
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoginLoading}
              disabled={isLoginLoading}
              block
              size="large"
            >
              {isLoginLoading ? "Logging in..." : "Login"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <LoginPageContent />
    </QueryClientProvider>
  );
}
