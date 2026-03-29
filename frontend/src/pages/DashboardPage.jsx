import Button from "../components/Button"
import CourseCard from "../components/CourseCard"
import { useAppData } from "../context/AppDataContext"
import { useAuth } from "../context/AuthContext"

function DashboardPage() {
  const { user } = useAuth()
  const { courses, users, isUsersLoading, usersError } = useAppData()

  if (user?.role === "admin") {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Admin Dashboard
        </h1>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Total Users</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {isUsersLoading ? "..." : users.length}
            </p>
          </div>
          <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Total Courses</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {courses.length}
            </p>
          </div>
        </div>

        <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Users</h2>
            <Button to="/admin/courses">Manage Courses</Button>
          </div>
          <div className="overflow-x-auto">
            {usersError ? (
              <p className="text-sm text-red-600">{usersError}</p>
            ) : isUsersLoading ? (
              <p className="text-sm text-slate-600">Loading users...</p>
            ) : (
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
            )}
          </div>
        </div>
      </div>
    )
  }

  if (user?.role === "instructor") {
    const myCourses = courses.filter((course) => course.instructor === user.name)
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Instructor Dashboard
          </h1>
          <Button to="/instructor/create-course" className="w-full sm:w-auto">
            Create Course
          </Button>
        </div>

        <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">My Courses</h2>
          <p className="mt-1 text-sm text-slate-600">
            Manage your course modules and content links.
          </p>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {myCourses.length ? (
              myCourses.map((course) => <CourseCard key={course.id} course={course} />)
            ) : (
              <p className="text-sm text-slate-600">No courses yet.</p>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
        Student Dashboard
      </h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">Available Courses</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{courses.length}</p>
          <Button to="/courses" className="mt-4 w-full sm:w-auto">
            Continue Learning
          </Button>
        </div>
        <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">Learning Resources</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">Library</p>
          <Button to="/library" variant="secondary" className="mt-4 w-full sm:w-auto">
            Open Library
          </Button>
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {courses.slice(0, 3).map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  )
}

export default DashboardPage
