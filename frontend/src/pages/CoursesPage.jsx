import { useEffect, useMemo, useState } from "react"
import CourseCard from "../components/CourseCard"
import LoadingCard from "../components/LoadingCard"
import SearchBar from "../components/SearchBar"
import { useAppData } from "../context/AppDataContext"

function CoursesPage() {
  const { courses } = useAppData()
  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState("All")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 700)
    return () => clearTimeout(timer)
  }, [])

  const categories = useMemo(
    () => ["All", ...new Set(courses.map((course) => course.category))],
    [courses],
  )

  const filteredCourses = courses.filter((course) => {
    const matchesQuery =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = category === "All" || course.category === category
    return matchesQuery && matchesCategory
  })

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 sm:px-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Courses
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Find courses by topic and continue learning by module.
        </p>
      </div>

      <section className="grid gap-3 rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:grid-cols-[1fr_auto] sm:items-center">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search courses..."
        />
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </section>

      {isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <LoadingCard key={index} />
          ))}
        </div>
      ) : filteredCourses.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg bg-white p-8 text-center text-sm text-slate-600 shadow-sm ring-1 ring-slate-200">
          No courses found.
        </div>
      )}
    </div>
  )
}

export default CoursesPage
