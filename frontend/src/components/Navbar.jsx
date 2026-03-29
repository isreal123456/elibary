import { NavLink } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Button from "./Button"

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <path
        d="M5 4.5A2.5 2.5 0 0 1 7.5 2H20v17H7.5A2.5 2.5 0 0 0 5 21.5V4.5Zm0 17A2.5 2.5 0 0 1 7.5 19H18V4H7.5A.5.5 0 0 0 7 4.5V17h1.5a.75.75 0 0 1 0 1.5H7.5a1 1 0 0 0-1 1v2Z"
        fill="currentColor"
      />
    </svg>
  )
}

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
          <span className="rounded-lg bg-slate-900 p-2 text-white">
            <BookIcon />
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
