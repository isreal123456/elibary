import Button from "../components/Button"
import { useAppData } from "../context/AppDataContext"

function AdminCoursesPage() {
  const { courses, assessments } = useAppData()

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Course Management
        </h1>
        <Button to="/courses" variant="secondary" className="w-full sm:w-auto">
          View Course Catalog
        </Button>
      </div>

      <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr>
                <th className="py-2 pr-4 font-medium">Course</th>
                <th className="py-2 pr-4 font-medium">Instructor</th>
                <th className="py-2 font-medium">Modules</th>
                <th className="py-2 font-medium">Assessments</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id} className="border-b border-slate-100">
                  <td className="py-2 pr-4 text-slate-900">{course.title}</td>
                  <td className="py-2 pr-4 text-slate-600">{course.instructor}</td>
                  <td className="py-2 text-slate-600">{course.modules.length}</td>
                  <td className="py-2 text-slate-600">
                    {
                      assessments.filter((assessment) => assessment.courseId === course.id)
                        .length
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminCoursesPage
