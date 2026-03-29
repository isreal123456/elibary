import { NavLink } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Button from "./Button"

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()

  const navItems = [{ path: "/", label: "Home" }]

  if (isAuthenticated) {
    navItems.push({ path: "/dashboard", label: "Dashboard" })
    navItems.push({ path: "/courses", label: "Courses" })
    navItems.push({ path: "/library", label: "Library" })
  }

  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <NavLink to="/" className="inline-flex items-center gap-2">
          <span className="rounded-lg bg-slate-900 px-2 py-1 text-sm font-semibold text-white">
            EL
          </span>
          <span className="text-lg font-semibold text-slate-900">E-Library</span>
        </NavLink>

        <nav className="flex items-center gap-2 sm:gap-3">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                [
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                ].join(" ")
              }
            >
              {item.label}
            </NavLink>
          ))}
          {isAuthenticated ? (
            <>
              <span className="hidden text-sm text-slate-500 sm:inline">
                {user?.role}
              </span>
              <Button variant="secondary" onClick={logout} className="ml-1">
                Logout
              </Button>
            </>
          ) : (
            <Button to="/login" variant="primary" className="ml-1">
              Login
            </Button>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar
