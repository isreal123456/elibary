import { useEffect, useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import Button from "../components/Button"
import ModuleBlock from "../components/ModuleBlock"
import { useAppData } from "../context/AppDataContext"

function CourseDetailPage() {
  const { id } = useParams()
  const { courses } = useAppData()
  const [isLoading, setIsLoading] = useState(true)

  const course = useMemo(() => courses.find((item) => item.id === id), [id])
  const [selectedModuleId, setSelectedModuleId] = useState(course?.modules?.[0]?.id)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 700)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (course?.modules?.length) {
      setSelectedModuleId(course.modules[0].id)
    }
  }, [course])

  if (!course) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="rounded-lg bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
          <h1 className="text-2xl font-semibold text-slate-900">Course not found</h1>
          <p className="mt-3 text-sm text-slate-600">
            The course you requested does not exist.
          </p>
          <div className="mt-5">
            <Button to="/courses">Back to Courses</Button>
          </div>
        </div>
      </div>
    )
  }

  const selectedModule =
    course.modules.find((module) => module.id === selectedModuleId) ??
    course.modules[0]

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 sm:px-6">
      <div>
        <p className="mb-3 text-sm text-slate-500">
          <Link to="/courses" className="hover:text-blue-700 hover:underline">
            Courses
          </Link>{" "}
          / {course.title}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          {course.title}
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          {course.description}
        </p>
      </div>

      {isLoading ? (
        <div className="rounded-lg bg-white p-8 text-sm text-slate-600 shadow-sm ring-1 ring-slate-200">
          Loading course modules...
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200 lg:sticky lg:top-6 lg:h-fit">
            <h2 className="mb-3 text-lg font-semibold text-slate-900">Modules</h2>
            <div className="flex gap-2 overflow-auto pb-1 lg:flex-col lg:overflow-visible">
              {course.modules.map((module) => (
                <button
                  key={module.id}
                  type="button"
                  onClick={() => setSelectedModuleId(module.id)}
                  className={[
                    "whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm transition-colors lg:whitespace-normal",
                    selectedModule.id === module.id
                      ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                  ].join(" ")}
                >
                  {module.title}
                </button>
              ))}
            </div>
          </aside>

          <div className="space-y-4">
            <ModuleBlock module={selectedModule} />
          </div>
        </div>
      )}
    </div>
  )
}

export default CourseDetailPage
