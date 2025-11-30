"use client"

import { Suspense } from "react"
import { AuthProvider } from "@/providers/auth-provider"
import { ChatContainer } from "@/components/chat-container"
import { LoginForm } from "@/components/login-form"
import { useAuth } from "@/hooks/use-auth"

function ChatPage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-foreground">Cargando...</div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  return <ChatContainer />
}

export default function Page() {
  return (
    <AuthProvider>
      <Suspense fallback={<div>Cargando...</div>}>
        <ChatPage />
      </Suspense>
    </AuthProvider>
  )
}
