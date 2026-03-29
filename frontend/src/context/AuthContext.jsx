import { createContext, useContext, useMemo, useState } from "react"

const AuthContext = createContext(null)

const STORAGE_KEY = "elibary-user"

function getInitialUser() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getInitialUser)

  const login = ({ email, role }) => {
    const namePart = email.split("@")[0] || "User"
    const roleDefaults = {
      admin: "Admin User",
      instructor: "Aisha Bello",
      student: "Student User",
    }

    const nextUser = {
      name:
        role === "instructor" && namePart.toLowerCase().includes("ibrahim")
          ? "Ibrahim Yusuf"
          : roleDefaults[role] ||
            namePart.charAt(0).toUpperCase() + namePart.slice(1),
      role,
      email,
    }
    setUser(nextUser)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      isAuthenticated: Boolean(user),
    }),
    [user],
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
