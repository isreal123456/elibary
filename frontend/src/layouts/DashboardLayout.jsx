import { useState } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "../components/Sidebar"

function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="mx-auto flex w-full max-w-6xl gap-6 px-4 sm:px-6">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <section className="w-full">
        <button
          type="button"
          onClick={() => setIsSidebarOpen(true)}
          className="mb-4 inline-flex rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm lg:hidden"
        >
          Open Menu
        </button>
        <Outlet />
      </section>
    </div>
  )
}

export default DashboardLayout
