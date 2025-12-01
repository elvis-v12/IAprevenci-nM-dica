"use client"

import { createContext, useState, useEffect, type ReactNode } from "react"

export interface AuthContextType {
  user: any
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    birthDate: string,
    documentNumber: string,
    phone: string
  ) => Promise<void>
  logout: () => void
  loading: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem("jwtToken")
    const savedUser = localStorage.getItem("user")
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const response = await fetch(
      "http://localhost:8082/backend-ia-medico/patient/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    )
    if (!response.ok) throw new Error("Login failed")
    const data = await response.json()
    setToken(data.jwtToken)
    setUser(data.user)
    localStorage.setItem("jwtToken", data.jwtToken)
    localStorage.setItem("user", JSON.stringify(data.user))
  }

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    birthDate: string,
    documentNumber: string,
    phone: string
  ) => {
    const response = await fetch(
      "http://localhost:8082/backend-ia-medico/patient/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
          birthDate,
          documentNumber,
          phone,
        }),
      }
    )
    if (!response.ok) throw new Error("Register failed")
    const data = await response.json()
    setToken(data.jwtToken)
    setUser(data.user)
    localStorage.setItem("jwtToken", data.jwtToken)
    localStorage.setItem("user", JSON.stringify(data.user))
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("jwtToken")
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  )
}
