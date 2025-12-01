"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Activity, LogOut, Download, Loader2, Send, Heart } from "lucide-react"
import { HealthForecast } from "./health-forecast"

export interface ChatMessage {
  id: string
  role: "user" | "bot"
  content: string
  timestamp: string
}

export function ChatContainer() {
  const { user, token, logout } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [exportingReport, setExportingReport] = useState(false)
  const [showForecast, setShowForecast] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll al final
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      // Simulación de respuesta del bot
      // En producción, esto iría a tu endpoint de backend
      setTimeout(() => {
        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "bot",
          content: `Echo: ${input}`,
          timestamp: new Date().toISOString(),
        }
        setMessages((prev) => [...prev, botMessage])
        setLoading(false)
      }, 500)
    } catch (error) {
      console.error("Error sending message:", error)
      setLoading(false)
    }
  }

  const handlePrintReport = async () => {
    setExportingReport(true)
    try {
      const reportData = messages.map((msg) => ({
        timestamp: msg.timestamp,
        author: msg.role === "user" ? user?.email || "Usuario" : "Bot Médico",
        message: msg.content,
      }))

      // Llamar al endpoint de reporte
      const response = await fetch("http://localhost:8080/api/report/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          chatHistory: reportData,
          generatedAt: new Date().toISOString(),
          userId: user?.email,
        }),
      })

      if (!response.ok) {
        throw new Error("Error generating report")
      }

      const data = await response.json()
      console.log("Report generated:", data)
      alert("Reporte generado exitosamente")
    } catch (error) {
      console.error("Error generating report:", error)
      alert("Error al generar el reporte")
    } finally {
      setExportingReport(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="flex items-center justify-between px-6 py-4 bg-card border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Activity className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Prevención Médica Inteligente</h1>
            <p className="text-xs text-muted-foreground">Chat de Consultas y Asesoramiento</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{user?.email}</span>
          <Button
            onClick={() => setShowForecast(true)}
            disabled={messages.length === 0}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Heart className="w-4 h-4" />
            Pronóstico
          </Button>

          <Button
            onClick={handlePrintReport}
            disabled={messages.length === 0 || exportingReport}
            variant="default"
            size="sm"
            className="gap-2"
          >
            {exportingReport ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Imprimir Reporte
              </>
            )}
          </Button>

          <Button onClick={logout} variant="ghost" size="sm" className="gap-2">
            <LogOut className="w-4 h-4" />
            Salir
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Activity className="w-12 h-12 text-primary" />
                </div>
              </div>
              <h2 className="text-lg font-semibold text-foreground mb-2">Bienvenido a tu Asistente Médico</h2>
              <p className="text-muted-foreground text-sm">
                Inicia una conversación para recibir asesoramiento médico personalizado y generar reportes de consultas.
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-muted text-muted-foreground border border-border rounded-bl-none"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p className="text-xs mt-2 opacity-70">{new Date(message.timestamp).toLocaleTimeString("es-ES")}</p>
              </div>
            </div>
          ))
        )}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-muted text-muted-foreground px-4 py-3 rounded-lg border border-border rounded-bl-none">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 bg-card border-t border-border">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            type="text"
            placeholder="Escribe tu pregunta médica..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="flex-1"
          />
          <Button type="submit" disabled={loading || !input.trim()} size="icon" className="gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </form>
      </div>

      {showForecast && (
        <HealthForecast
          messages={messages}
          onClose={() => setShowForecast(false)}
          token={token || ""}
          userEmail={user?.email}
        />
      )}
    </div>
  )
}
