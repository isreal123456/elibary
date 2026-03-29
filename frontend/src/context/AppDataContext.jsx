import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { useAuth } from "./AuthContext"
import {
  courses as initialCourses,
  resources as initialResources,
} from "../data/mockData"
import { apiRequest } from "../lib/api"

const AppDataContext = createContext(null)

async function requestUsers(token) {
  const data = await apiRequest("/api/users", { token })
  return data.users || []
}

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export function AppDataProvider({ children }) {
  const { token, user } = useAuth()
  const [courses, setCourses] = useState(initialCourses)
  const [resources] = useState(initialResources)
  const [users, setUsers] = useState([])
  const [isUsersLoading, setIsUsersLoading] = useState(false)
  const [usersError, setUsersError] = useState("")

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

  const refreshUsers = async () => {
    if (!token || user?.role !== "admin") {
      setUsers([])
      setUsersError("")
      setIsUsersLoading(false)
      return
    }

    setIsUsersLoading(true)
    setUsersError("")

    try {
      const nextUsers = await requestUsers(token)
      setUsers(nextUsers)
    } catch (error) {
      setUsers([])
      setUsersError(error.message)
    } finally {
      setIsUsersLoading(false)
    }
  }

  useEffect(() => {
    let isCancelled = false

    const syncUsers = async () => {
      if (!token || user?.role !== "admin") {
        setUsers([])
        setUsersError("")
        setIsUsersLoading(false)
        return
      }

      setIsUsersLoading(true)
      setUsersError("")

      try {
        const nextUsers = await requestUsers(token)

        if (!isCancelled) {
          setUsers(nextUsers)
        }
      } catch (error) {
        if (!isCancelled) {
          setUsers([])
          setUsersError(error.message)
        }
      } finally {
        if (!isCancelled) {
          setIsUsersLoading(false)
        }
      }
    }

    syncUsers()

    return () => {
      isCancelled = true
    }
  }, [token, user?.role])

  const updateUserRole = async ({ userId, role }) => {
    if (!token) {
      throw new Error("You must be logged in to update user roles.")
    }

    const data = await apiRequest(`/api/users/${userId}/role`, {
      method: "PATCH",
      token,
      body: { role },
    })

    setUsers((currentUsers) =>
      currentUsers.map((currentUser) =>
        currentUser.id === userId ? data.user : currentUser,
      ),
    )

    return data.user
  }

  const value = useMemo(
    () => ({
      courses,
      resources,
      users,
      isUsersLoading,
      usersError,
      refreshUsers,
      updateUserRole,
      createCourse,
      addModuleToCourse,
    }),
    [courses, resources, users, isUsersLoading, usersError, token, user?.role],
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
