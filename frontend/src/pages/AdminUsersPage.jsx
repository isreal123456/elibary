import { useAppData } from "../context/AppDataContext"

function AdminUsersPage() {
  const { users } = useAppData()

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
        User Management
      </h1>
      <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr>
                <th className="py-2 pr-4 font-medium">Name</th>
                <th className="py-2 pr-4 font-medium">Email</th>
                <th className="py-2 font-medium">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((row) => (
                <tr key={row.id} className="border-b border-slate-100">
                  <td className="py-2 pr-4 text-slate-900">{row.name}</td>
                  <td className="py-2 pr-4 text-slate-600">{row.email}</td>
                  <td className="py-2 capitalize text-slate-600">{row.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminUsersPage
