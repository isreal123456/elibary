import { useEffect, useState } from "react"
import Button from "../components/Button"
import CourseCard from "../components/CourseCard"
import LoadingCard from "../components/LoadingCard"
import { useAppData } from "../context/AppDataContext"
import { useAuth } from "../context/AuthContext"

function HomePage() {
  const [isLoading, setIsLoading] = useState(true)
  const { courses } = useAppData()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 700)
    return () => clearTimeout(timer)
  }, [])

  const featuredCourses = courses.filter((course) => course.featured)

  return (
    <div className="mx-auto w-full max-w-6xl space-y-12 px-4 sm:px-6">
      <section className="rounded-lg bg-white px-6 py-10 shadow-sm ring-1 ring-slate-200 sm:px-10 sm:py-12">
        <div className="flex flex-col items-start gap-5">
          <span className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700">
            <span className="rounded-md bg-slate-900 px-2 py-1 text-xs font-semibold text-white">
              EL
            </span>
            Role-Based Learning Platform
          </span>
          <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Learn, teach, and manage courses with clarity.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-slate-600">
            Students explore courses and library resources, instructors build
            modules and upload learning materials, and admins manage platform access.
          </p>
          <div className="grid w-full gap-3 text-sm text-slate-600 sm:grid-cols-3">
            <div className="rounded-lg bg-slate-50 p-3 ring-1 ring-slate-200">
              <p className="font-medium text-slate-900">Admin</p>
              <p>Users, course governance, platform oversight.</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3 ring-1 ring-slate-200">
              <p className="font-medium text-slate-900">Instructor</p>
              <p>Create courses, add weekly modules, attach PDFs and videos.</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3 ring-1 ring-slate-200">
              <p className="font-medium text-slate-900">Student</p>
              <p>Watch lessons, download notes, and continue learning.</p>
            </div>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button to={isAuthenticated ? "/dashboard" : "/login"} className="w-full sm:w-auto">
              {isAuthenticated ? "Open Dashboard" : "Login"}
            </Button>
            <Button
              to={isAuthenticated ? "/courses" : "/register"}
              variant="secondary"
              className="w-full sm:w-auto"
            >
              {isAuthenticated ? "Browse Courses" : "Create Account"}
            </Button>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-900">Featured Courses</h2>
        </div>

        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, index) => (
              <LoadingCard key={index} />
            ))}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default HomePage
