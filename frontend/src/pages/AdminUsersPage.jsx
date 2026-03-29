import { useState } from "react"
import { useAppData } from "../context/AppDataContext"
import { useAuth } from "../context/AuthContext"

function AdminUsersPage() {
  const { user } = useAuth()
  const { users, isUsersLoading, usersError, updateUserRole } = useAppData()
  const [activeUserId, setActiveUserId] = useState("")
  const [pageError, setPageError] = useState("")

  const handleRoleChange = async (userId, role) => {
    setPageError("")
    setActiveUserId(userId)

    try {
      await updateUserRole({ userId, role })
    } catch (error) {
      setPageError(error.message)
    } finally {
      setActiveUserId("")
    }
  }

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
        User Management
      </h1>
      <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
        {pageError ? (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">
            {pageError}
          </p>
        ) : null}
        {usersError ? <p className="mb-4 text-sm text-red-600">{usersError}</p> : null}
        <div className="overflow-x-auto">
          {isUsersLoading ? (
            <p className="text-sm text-slate-600">Loading users...</p>
          ) : (
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="py-2 pr-4 font-medium">Name</th>
                  <th className="py-2 pr-4 font-medium">Email</th>
                  <th className="py-2 pr-4 font-medium">Role</th>
                  <th className="py-2 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((row) => {
                  const isCurrentUser = row.id === user?.id
                  const isSaving = activeUserId === row.id

                  return (
                    <tr key={row.id} className="border-b border-slate-100">
                      <td className="py-2 pr-4 text-slate-900">{row.name}</td>
                      <td className="py-2 pr-4 text-slate-600">{row.email}</td>
                      <td className="py-2 pr-4">
                        <select
                          value={row.role}
                          disabled={isCurrentUser || isSaving}
                          onChange={(event) => handleRoleChange(row.id, event.target.value)}
                          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm capitalize text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-slate-100"
                        >
                          <option value="admin">Admin</option>
                          <option value="instructor">Instructor</option>
                          <option value="student">Student</option>
                        </select>
                      </td>
                      <td className="py-2 text-xs text-slate-500">
                        {isCurrentUser
                          ? "Current user"
                          : isSaving
                            ? "Saving..."
                            : "Role ready"}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminUsersPage
