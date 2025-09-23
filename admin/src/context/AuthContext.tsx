import { createContext, useContext, useEffect, useMemo, useState } from "react"

interface AuthContextValue {
  isAuthenticated: boolean
  user: { email: string } | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<{ email: string } | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("auth_token")
    const email = localStorage.getItem("auth_email")
    if (stored) {
      setToken(stored)
      if (email) setUser({ email })
    }
  }, [])

  const login = async (email: string, password: string) => {
    // Demo-only auth: accept any non-empty email/password
    if (!email || !password) throw new Error("Email and password are required")
    const fakeToken = "demo-token"
    localStorage.setItem("auth_token", fakeToken)
    localStorage.setItem("auth_email", email)
    setToken(fakeToken)
    setUser({ email })
  }

  const logout = () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("auth_email")
    setToken(null)
    setUser(null)
  }

  const value = useMemo(
    () => ({ isAuthenticated: Boolean(token), user, login, logout }),
    [token, user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}


