"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { GuestLoginPrompt } from "@/components/auth/guest-login-prompt";

export function useAuthGuard() {
  const { user } = useAuth();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [promptConfig, setPromptConfig] = useState({
    title: "Yêu cầu đăng nhập",
    description: "Bạn cần đăng nhập để truy cập tính năng này",
    actionText: "tính năng này",
  });

  const requireAuth = (config?: {
    title?: string;
    description?: string;
    actionText?: string;
  }) => {
    if (!user) {
      if (config) {
        setPromptConfig({
          title: config.title || "Yêu cầu đăng nhập",
          description:
            config.description || "Bạn cần đăng nhập để truy cập tính năng này",
          actionText: config.actionText || "tính năng này",
        });
      }
      setShowLoginPrompt(true);
      return false;
    }
    return true;
  };

  const AuthGuard = () => (
    <GuestLoginPrompt
      isOpen={showLoginPrompt}
      onClose={() => setShowLoginPrompt(false)}
      title={promptConfig.title}
      description={promptConfig.description}
      actionText={promptConfig.actionText}
    />
  );

  return {
    user,
    isAuthenticated: !!user,
    requireAuth,
    AuthGuard,
  };
}
