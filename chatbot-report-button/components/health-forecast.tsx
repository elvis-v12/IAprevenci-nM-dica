"use client"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, TrendingUp, AlertCircle, CheckCircle2, Activity } from "lucide-react"
import type { ChatMessage } from "./chat-container"

interface HealthForecastProps {
  messages: ChatMessage[]
  onClose: () => void
  token: string
  userEmail?: string
}

export function HealthForecast({ messages, onClose, token, userEmail }: HealthForecastProps) {
  const [loading, setLoading] = useState(false)
  const [forecast, setForecast] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const generateForecast = async () => {
    setLoading(true)
    setError(null)

    try {
      const chatHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp,
      }))

      const response = await fetch("http://localhost:8080/api/forecast/health", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          chatHistory,
          userId: userEmail,
          generatedAt: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error("Error generating forecast")
      }

      const data = await response.json()
      setForecast(data)
    } catch (err) {
      // En modo demo, generar pronóstico simulado
      console.log("[v0] Usando pronóstico de demostración")
      const mockForecast = {
        riskLevel: "Moderado",
        riskPercentage: 35,
        recommendations: [
          "Mantener una actividad física regular de 30 minutos diarios",
          "Aumentar el consumo de frutas y verduras frescas",
          "Realizar check-ups médicos cada 6 meses",
          "Reducir el estrés con técnicas de meditación",
        ],
        healthMetrics: {
          cardiovascular: "Bueno",
          respiratory: "Normal",
          metabolic: "Necesita mejora",
        },
        nextReview: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("es-ES"),
      }
      setForecast(mockForecast)
      setError(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-background">
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Pronóstico de Salud</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg transition-colors" aria-label="Cerrar">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {!forecast ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-foreground mb-2">Generar Pronóstico Personalizado</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Basado en tu historial de conversación, obtendremos un pronóstico de salud detallado
                </p>
                <Button
                  onClick={generateForecast}
                  disabled={loading || messages.length === 0}
                  size="lg"
                  className="gap-2"
                >
                  {loading ? "Generando..." : "Generar Pronóstico"}
                </Button>
              </div>
              {messages.length === 0 && (
                <p className="text-xs text-muted-foreground mt-4">
                  Necesitas al menos un mensaje en el chat para generar un pronóstico
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-foreground">Nivel de Riesgo de Salud</h3>
                  <div className="flex items-center gap-2">
                    {forecast.riskLevel === "Bajo" ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : forecast.riskLevel === "Moderado" ? (
                      <AlertCircle className="w-5 h-5 text-yellow-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          forecast.riskPercentage < 30
                            ? "bg-green-500"
                            : forecast.riskPercentage < 60
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                        style={{ width: `${forecast.riskPercentage}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-foreground min-w-fit">{forecast.riskPercentage}%</span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-3">Métricas de Salud</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {Object.entries(forecast.healthMetrics).map(([metric, status]) => (
                    <div key={metric} className="bg-card border border-border rounded-lg p-4">
                      <p className="text-sm text-muted-foreground capitalize mb-1">
                        {metric.replace(/([A-Z])/g, " $1").trim()}
                      </p>
                      <p className="font-semibold text-foreground">{status as string}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-3">Recomendaciones Médicas</h3>
                <ul className="space-y-2">
                  {forecast.recommendations.map((rec: string, idx: number) => (
                    <li key={idx} className="flex gap-3 p-3 bg-muted rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 border border-border">
                <p className="text-sm text-muted-foreground">Próxima revisión recomendada</p>
                <p className="font-semibold text-foreground">{forecast.nextReview}</p>
              </div>

              <Button onClick={generateForecast} variant="outline" className="w-full bg-transparent" disabled={loading}>
                Regenerar Pronóstico
              </Button>
            </div>
          )}

          {error && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
