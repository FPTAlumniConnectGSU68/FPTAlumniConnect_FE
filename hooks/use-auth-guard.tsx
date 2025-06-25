"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { GuestLoginPrompt } from "@/components/auth/guest-login-prompt"

export function useAuthGuard() {
  const { user } = useAuth()
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [promptConfig, setPromptConfig] = useState({
    title: "Login Required",
    description: "You need to sign in to access this feature",
    actionText: "this feature",
  })

  const requireAuth = (config?: {
    title?: string
    description?: string
    actionText?: string
  }) => {
    if (!user) {
      if (config) {
        setPromptConfig({
          title: config.title || "Login Required",
          description: config.description || "You need to sign in to access this feature",
          actionText: config.actionText || "this feature",
        })
      }
      setShowLoginPrompt(true)
      return false
    }
    return true
  }

  const AuthGuard = () => (
    <GuestLoginPrompt
      isOpen={showLoginPrompt}
      onClose={() => setShowLoginPrompt(false)}
      title={promptConfig.title}
      description={promptConfig.description}
      actionText={promptConfig.actionText}
    />
  )

  return {
    user,
    isAuthenticated: !!user,
    requireAuth,
    AuthGuard,
  }
}
