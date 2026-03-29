import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function RoleGuard({ allowedRoles }) {
  const { user } = useAuth()

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}

export default RoleGuard
