import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react"
import { apiRequest } from "../lib/api"

const AuthContext = createContext(null)

const STORAGE_KEY = "elibary-auth"

function getStoredAuth() {
  const raw = localStorage.getItem(STORAGE_KEY)

  if (!raw) {
    return { token: null, user: null }
  }

  try {
    const parsed = JSON.parse(raw)
    return {
      token: parsed.token || null,
      user: parsed.user || null,
    }
  } catch {
    return { token: null, user: null }
  }
}

export function AuthProvider({ children }) {
  const initialAuthRef = useRef(getStoredAuth())
  const [authState, setAuthState] = useState(initialAuthRef.current)
  const [isLoading, setIsLoading] = useState(() => Boolean(initialAuthRef.current.token))

  useEffect(() => {
    if (authState.token) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authState))
      return
    }

    localStorage.removeItem(STORAGE_KEY)
  }, [authState])

  useEffect(() => {
    if (!initialAuthRef.current.token) {
      setIsLoading(false)
      return
    }

    let isCancelled = false

    const restoreSession = async () => {
      try {
        const data = await apiRequest("/api/auth/me", {
          token: initialAuthRef.current.token,
        })

        if (!isCancelled) {
          setAuthState((current) => ({ ...current, user: data.user }))
        }
      } catch {
        if (!isCancelled) {
          setAuthState({ token: null, user: null })
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    restoreSession()

    return () => {
      isCancelled = true
    }
  }, [])

  const login = async ({ email, password }) => {
    const data = await apiRequest("/api/auth/login", {
      method: "POST",
      body: { email, password },
    })

    setAuthState({
      token: data.token,
      user: data.user,
    })

    return data.user
  }

  const register = async ({ name, email, password, role }) => {
    const data = await apiRequest("/api/auth/register", {
      method: "POST",
      body: { name, email, password, role },
    })

    setAuthState({
      token: data.token,
      user: data.user,
    })

    return data.user
  }

  const logout = () => {
    setAuthState({ token: null, user: null })
    setIsLoading(false)
  }

  const value = useMemo(
    () => ({
      user: authState.user,
      token: authState.token,
      login,
      register,
      logout,
      isLoading,
      isAuthenticated: Boolean(authState.token && authState.user),
    }),
    [authState, isLoading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
