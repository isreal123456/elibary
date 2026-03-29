import { useMemo, useState } from "react"
import Button from "../components/Button"
import CourseCard from "../components/CourseCard"
import FormInput from "../components/FormInput"
import ResultsTable from "../components/ResultsTable"
import { useAppData } from "../context/AppDataContext"
import { useAuth } from "../context/AuthContext"

function DashboardPage() {
  const { user, changePassword } = useAuth()
  const {
    courses,
    assessments,
    assessmentSubmissions,
    resources,
    users,
    isUsersLoading,
    usersError,
  } = useAppData()
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [passwordMessage, setPasswordMessage] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const assessmentTitles = useMemo(
    () =>
      assessments.reduce((accumulator, assessment) => {
        return {
          ...accumulator,
          [assessment.id]: assessment.title,
        }
      }, {}),
    [assessments],
  )

  const allResults = useMemo(
    () =>
      assessmentSubmissions.map((row) => ({
        ...row,
        assessmentTitle: assessmentTitles[row.assessmentId] || "Assessment",
      })),
    [assessmentSubmissions, assessmentTitles],
  )

  const instructorCourseIds = useMemo(
    () =>
      courses
        .filter(
          (course) =>
            course.instructorId === user?.id || course.instructor === user?.name,
        )
        .map((course) => course.id),
    [courses, user],
  )

  const instructorResults = allResults.filter((row) =>
    assessments.some(
      (assessment) =>
        assessment.id === row.assessmentId &&
        instructorCourseIds.includes(assessment.courseId),
    ),
  )

  const studentResults = allResults.filter((row) => row.studentName === user?.name)

  const handlePasswordChange = async (event) => {
    event.preventDefault()
    setPasswordMessage("")
    setPasswordError("")

    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      setPasswordError("Current password and new password are required.")
      return
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.")
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New password and confirmation do not match.")
      return
    }

    setIsChangingPassword(true)

    try {
      const response = await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      })
      setPasswordMessage(response.message)
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error) {
      setPasswordError(error.message)
    } finally {
      setIsChangingPassword(false)
    }
  }

  if (user?.role === "admin") {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Admin Dashboard
        </h1>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Total Users</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {isUsersLoading ? "..." : users.length}
            </p>
          </div>
          <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Total Courses</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{courses.length}</p>
          </div>
          <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Total Assessments</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{assessments.length}</p>
          </div>
        </div>

        <form
          onSubmit={handlePasswordChange}
          className="space-y-4 rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Admin Password</h2>
            <span className="text-xs uppercase tracking-wide text-blue-700">
              Custom admin access
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <FormInput
              id="admin-current-password"
              type="password"
              label="Current Password"
              value={passwordForm.currentPassword}
              onChange={(event) =>
                setPasswordForm((prev) => ({
                  ...prev,
                  currentPassword: event.target.value,
                }))
              }
              placeholder="Current password"
            />
            <FormInput
              id="admin-new-password"
              type="password"
              label="New Password"
              value={passwordForm.newPassword}
              onChange={(event) =>
                setPasswordForm((prev) => ({
                  ...prev,
                  newPassword: event.target.value,
                }))
              }
              placeholder="New password"
            />
            <FormInput
              id="admin-confirm-password"
              type="password"
              label="Confirm Password"
              value={passwordForm.confirmPassword}
              onChange={(event) =>
                setPasswordForm((prev) => ({
                  ...prev,
                  confirmPassword: event.target.value,
                }))
              }
              placeholder="Repeat password"
            />
          </div>
          {passwordError ? <p className="text-sm text-red-600">{passwordError}</p> : null}
          {passwordMessage ? <p className="text-sm text-blue-700">{passwordMessage}</p> : null}
          <Button type="submit" disabled={isChangingPassword}>
            {isChangingPassword ? "Updating Password..." : "Change Password"}
          </Button>
        </form>

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

        <ResultsTable rows={allResults} />
      </div>
    )
  }

  if (user?.role === "instructor") {
    const myCourses = courses.filter(
      (course) => course.instructorId === user.id || course.instructor === user.name,
    )
    const myAssessmentCount = assessments.filter((assessment) =>
      instructorCourseIds.includes(assessment.courseId),
    ).length

    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Instructor Dashboard
          </h1>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Button to="/instructor/create-course" className="w-full sm:w-auto">
              Create Course
            </Button>
            <Button to="/instructor/my-courses" variant="secondary" className="w-full sm:w-auto">
              Manage Courses
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">My Courses</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{myCourses.length}</p>
          </div>
          <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">My Assessments</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{myAssessmentCount}</p>
          </div>
          <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Submissions Received</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {instructorResults.length}
            </p>
          </div>
        </div>

        <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">My Courses</h2>
          <p className="mt-1 text-sm text-slate-600">
            Create courses, update modules, and publish assessments for your learners.
          </p>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {myCourses.length ? (
              myCourses.map((course) => <CourseCard key={course.id} course={course} />)
            ) : (
              <p className="text-sm text-slate-600">No courses yet.</p>
            )}
          </div>
        </div>

        <ResultsTable rows={instructorResults} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
        Student Dashboard
      </h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">Available Courses</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{courses.length}</p>
          <Button to="/courses" className="mt-4 w-full sm:w-auto">
            Continue Learning
          </Button>
        </div>
        <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">Learning Resources</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{resources.length}</p>
          <Button to="/library" variant="secondary" className="mt-4 w-full sm:w-auto">
            Open Library
          </Button>
        </div>
        <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">My Submissions</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{studentResults.length}</p>
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {courses.slice(0, 3).map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
      <ResultsTable rows={studentResults} />
    </div>
  )
}

export default DashboardPage
