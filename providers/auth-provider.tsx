"use client"

import { createContext, useState, useEffect, type ReactNode } from "react"

export interface AuthContextType {
  user: any
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem("authToken")
    const savedUser = localStorage.getItem("authUser")
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      try {
        const response = await fetch("http://localhost:8080/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        })

        if (!response.ok) {
          throw new Error("Login failed")
        }

        const data = await response.json()
        const newToken = data.token
        const userData = { email }

        setToken(newToken)
        setUser(userData)
        localStorage.setItem("authToken", newToken)
        localStorage.setItem("authUser", JSON.stringify(userData))
      } catch (backendError) {
        console.warn("[v0] Backend no disponible, usando modo demo")
        // Fallback a modo demo/desarrollo
        const demoToken = `demo_token_${Date.now()}`
        const userData = { email }

        setToken(demoToken)
        setUser(userData)
        localStorage.setItem("authToken", demoToken)
        localStorage.setItem("authUser", JSON.stringify(userData))
      }
    } catch (error) {
      console.error("[v0] Login error:", error)
      throw error
    }
  }

  const register = async (email: string, password: string) => {
    try {
      try {
        const response = await fetch("http://localhost:8080/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        })

        if (!response.ok) {
          throw new Error("Register failed")
        }

        const data = await response.json()
        const newToken = data.token
        const userData = { email }

        setToken(newToken)
        setUser(userData)
        localStorage.setItem("authToken", newToken)
        localStorage.setItem("authUser", JSON.stringify(userData))
      } catch (backendError) {
        console.warn("[v0] Backend no disponible, usando modo demo")
        // Fallback a modo demo/desarrollo
        const demoToken = `demo_token_${Date.now()}`
        const userData = { email }

        setToken(demoToken)
        setUser(userData)
        localStorage.setItem("authToken", demoToken)
        localStorage.setItem("authUser", JSON.stringify(userData))
      }
    } catch (error) {
      console.error("[v0] Register error:", error)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("authToken")
    localStorage.removeItem("authUser")
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>{children}</AuthContext.Provider>
  )
}
