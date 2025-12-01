"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Activity } from "lucide-react"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [documentNumber, setDocumentNumber] = useState("")
  const [phone, setPhone] = useState("")
  const [error, setError] = useState("")
  const [isRegister, setIsRegister] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login, register } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (isRegister) {
        await register(email, password, firstName, lastName, birthDate, documentNumber, phone)
      } else {
        await login(email, password)
      }
    } catch (err: any) {
      setError(err.message || "Error de autenticación")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="w-full max-w-md p-8 bg-card rounded-xl shadow-lg border border-border">
        <div className="flex items-center justify-center mb-6">
          <Activity className="w-8 h-8 text-primary mr-3" />
          <h2 className="text-2xl font-bold text-foreground">
            Prevención<span className="text-accent ml-2">Médica</span>
          </h2>
        </div>

        <p className="text-center text-muted-foreground text-sm mb-6">Chat Inteligente de Consultas Médicas</p>

        <h1 className="text-xl font-semibold mb-6 text-foreground text-center">
          {isRegister ? "Crear Cuenta" : "Iniciar Sesión"}
        </h1>

        {error && <div className="mb-4 p-3 bg-destructive/20 text-destructive rounded-md text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {isRegister && (
            <>
              <Input
                type="text"
                placeholder="Nombres"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />

              <Input
                type="text"
                placeholder="Apellidos"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />

              <Input
                type="date"
                placeholder="Fecha de nacimiento"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
              />

              <Input
                type="text"
                placeholder="Número de documento"
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
                required
              />

              <Input
                type="tel"
                placeholder="Teléfono"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Cargando..." : isRegister ? "Registrarse" : "Entrar"}
          </Button>
        </form>

        <button
          type="button"
          onClick={() => setIsRegister(!isRegister)}
          className="w-full mt-4 text-sm text-muted-foreground hover:text-primary transition font-medium"
        >
          {isRegister ? "¿Ya tienes cuenta? Inicia sesión" : "¿No tienes cuenta? Regístrate"}
        </button>
      </div>
    </div>
  )
}
