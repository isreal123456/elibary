import { useState } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "../components/Sidebar"

function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="flex w-full px-4 sm:px-6">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <section className="w-full lg:ml-72 lg:pl-6">
        <button
          type="button"
          onClick={() => setIsSidebarOpen(true)}
          className="mb-4 inline-flex rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm lg:hidden"
        >
          Open Menu
        </button>
        <div className="mx-auto w-full max-w-5xl">
          <Outlet />
        </div>
      </section>
    </div>
  )
}

export default DashboardLayout
