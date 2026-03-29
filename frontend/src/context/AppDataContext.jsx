import { createContext, useContext, useMemo, useState } from "react"
import {
  courses as initialCourses,
  resources as initialResources,
  users as initialUsers,
} from "../data/mockData"

const AppDataContext = createContext(null)

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export function AppDataProvider({ children }) {
  const [courses, setCourses] = useState(initialCourses)
  const [resources] = useState(initialResources)
  const [users] = useState(initialUsers)

  const createCourse = ({ title, description, thumbnail, instructor }) => {
    const idBase = slugify(title) || `course-${courses.length + 1}`
    const exists = courses.some((course) => course.id === idBase)
    const id = exists ? `${idBase}-${Date.now()}` : idBase

    const nextCourse = {
      id,
      title,
      description,
      thumbnail:
        thumbnail ||
        "https://placehold.co/800x500/e2e8f0/334155?text=New+Course",
      instructor,
      category: "General",
      featured: false,
      modules: [],
    }

    setCourses((prev) => [nextCourse, ...prev])
  }

  const addModuleToCourse = ({ courseId, title, description, videoUrl, pdfUrl }) => {
    const moduleId = `${courseId}-module-${Date.now()}`

    setCourses((prev) =>
      prev.map((course) => {
        if (course.id !== courseId) {
          return course
        }

        return {
          ...course,
          modules: [
            ...course.modules,
            {
              id: moduleId,
              title,
              description,
              videoUrl,
              pdfUrl,
              lessons: ["Lesson 1", "Lesson 2"],
            },
          ],
        }
      }),
    )
  }

  const value = useMemo(
    () => ({
      courses,
      resources,
      users,
      createCourse,
      addModuleToCourse,
    }),
    [courses, resources, users],
  )

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

export function useAppData() {
  const context = useContext(AppDataContext)
  if (!context) {
    throw new Error("useAppData must be used within an AppDataProvider")
  }
  return context
}
