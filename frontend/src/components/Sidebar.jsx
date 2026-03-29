import { NavLink } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth()

  const commonLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/courses", label: "Courses" },
    { to: "/library", label: "Library" },
  ]

  const roleLinks = {
    admin: [
      { to: "/admin/users", label: "All Users" },
      { to: "/admin/courses", label: "Manage Courses" },
    ],
    instructor: [
      { to: "/instructor/create-course", label: "Create Course" },
      { to: "/instructor/my-courses", label: "My Courses" },
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

      <aside
        className={[
          "fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200 bg-white p-4 transition-transform lg:sticky lg:top-0 lg:h-[calc(100vh-73px)] lg:translate-x-0",
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
                  "block rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                ].join(" ")
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}

export default Sidebar
