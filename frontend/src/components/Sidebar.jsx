import { NavLink } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function NavIcon({ type }) {
  const paths = {
    dashboard: "M3 13h8V3H3v10Zm10 8h8v-6h-8v6ZM3 21h8v-6H3v6Zm10-8h8V3h-8v10Z",
    courses:
      "M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5V5.5Zm2.5-1a1 1 0 0 0-1 1V19a3.9 3.9 0 0 1 1-.13H18V4.5H6.5Z",
    library:
      "M5 3h4v18H5V3Zm5 2h4v16h-4V5Zm5-1h4v17h-4V4ZM3 21h18v1H3v-1Z",
    users:
      "M16 11a4 4 0 1 0-3.999-4A4 4 0 0 0 16 11ZM8 10a3 3 0 1 0-3-3 3 3 0 0 0 3 3Zm8 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4ZM8 12c-2.33 0-7 1.17-7 3.5V18h5v-2c0-1.16.64-2.18 1.8-3A8.67 8.67 0 0 0 8 12Z",
    manage: "M3 17.25V21h3.75l11-11-3.75-3.75-11 11ZM20.71 7.04a1 1 0 0 0 0-1.41L18.37 3.3a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.84Z",
    create:
      "M19 11h-6V5h-2v6H5v2h6v6h2v-6h6v-2Z",
    mycourses:
      "M4 4h16v2H4V4Zm0 4h16v12H4V8Zm2 2v8h12v-8H6Z",
  }

  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path d={paths[type] || paths.dashboard} fill="currentColor" />
    </svg>
  )
}

function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth()

  const commonLinks = [
    { to: "/dashboard", label: "Dashboard", icon: "dashboard" },
    { to: "/courses", label: "Courses", icon: "courses" },
    { to: "/library", label: "Library", icon: "library" },
  ]

  const roleLinks = {
    admin: [
      { to: "/admin/users", label: "All Users", icon: "users" },
      { to: "/admin/courses", label: "Manage Courses", icon: "manage" },
    ],
    instructor: [
      { to: "/instructor/create-course", label: "Create Course", icon: "create" },
      { to: "/instructor/my-courses", label: "My Courses", icon: "mycourses" },
    ],
    student: [],
  }

  const links = [...commonLinks, ...(roleLinks[user?.role] ?? [])]

  return (
    <>
      <div
        className={[
          "fixed inset-0 z-30 bg-slate-900/35 transition-opacity lg:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={[
          "fixed inset-y-0 left-0 z-40 w-72 pl-4 pt-4 border-r border-slate-200 bg-white p-2 transition-transform lg:top-[73px] lg:bottom-0 lg:h-auto lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="mb-4 border-b border-slate-200 pb-4">
          <p className="text-sm font-semibold text-slate-900">
            {user?.name ?? "User"}
          </p>
          <p className="text-xs uppercase tracking-wide text-blue-700">{user?.role}</p>
        </div>

        <nav className="space-y-1">
          {links.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                [
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                ].join(" ")
              }
            >
              <NavIcon type={item.icon} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  )
}

export default Sidebar
