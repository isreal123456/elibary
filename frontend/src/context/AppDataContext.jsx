import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { useAuth } from "./AuthContext"
import {
  assessments as initialAssessments,
  assessmentSubmissions as initialAssessmentSubmissions,
  courses as initialCourses,
  resources as initialResources,
} from "../data/mockData"
import { apiRequest } from "../lib/api"

const AppDataContext = createContext(null)

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function createLocalFileUrl(file) {
  if (!file || typeof URL === "undefined" || typeof URL.createObjectURL !== "function") {
    return ""
  }

  return URL.createObjectURL(file)
}

function createLocalCourseRecord({ title, description, thumbnail, instructor, category }, count) {
  const idBase = slugify(title) || `course-${count + 1}`

  return {
    id: `${idBase}-${Date.now()}`,
    title,
    description,
    thumbnail:
      thumbnail || "https://placehold.co/800x500/e2e8f0/334155?text=New+Course",
    instructor,
    category: category || "General",
    featured: false,
    modules: [],
  }
}

export function AppDataProvider({ children }) {
  const { token, user } = useAuth()
  const [courses, setCourses] = useState(initialCourses)
  const [assessments, setAssessments] = useState(initialAssessments)
  const [assessmentSubmissions, setAssessmentSubmissions] = useState(
    initialAssessmentSubmissions,
  )
  const [resources, setResources] = useState(initialResources)
  const [users, setUsers] = useState([])
  const [isUsersLoading, setIsUsersLoading] = useState(false)
  const [usersError, setUsersError] = useState("")

  useEffect(() => {
    let isCancelled = false

    const fetchPublicData = async () => {
      try {
        const [coursesData, resourcesData] = await Promise.all([
          apiRequest("/api/courses"),
          apiRequest("/api/resources"),
        ])

        if (!isCancelled) {
          setCourses(coursesData.courses || [])
          setResources(resourcesData.resources || [])
        }
      } catch {
        // Keep local starter data when the backend is unavailable.
      }
    }

    fetchPublicData()

    return () => {
      isCancelled = true
    }
  }, [])

  useEffect(() => {
    if (!token) {
      return
    }

    let isCancelled = false

    const fetchProtectedData = async () => {
      try {
        const [assessmentsData, submissionsData] = await Promise.all([
          apiRequest("/api/assessments", { token }),
          apiRequest("/api/submissions", { token }),
        ])

        if (!isCancelled) {
          setAssessments(assessmentsData.assessments || [])
          setAssessmentSubmissions(submissionsData.submissions || [])
        }
      } catch {
        // Keep fallback data if the API cannot be reached.
      }
    }

    fetchProtectedData()

    return () => {
      isCancelled = true
    }
  }, [token])

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
      const data = await apiRequest("/api/users", { token })
      setUsers(data.users || [])
    } catch (error) {
      setUsers([])
      setUsersError(error.message)
    } finally {
      setIsUsersLoading(false)
    }
  }

  useEffect(() => {
    refreshUsers()
  }, [token, user?.role])

  const createCourse = async ({ title, description, thumbnail, instructor, category }) => {
    if (token) {
      try {
        const data = await apiRequest("/api/courses", {
          method: "POST",
          token,
          body: { title, description, thumbnail, category },
        })

        setCourses((currentCourses) => [data.course, ...currentCourses])
        return data.course
      } catch {
        // Fall back to local state below when the API is unreachable.
      }
    }

    const localCourse = createLocalCourseRecord(
      { title, description, thumbnail, instructor, category },
      courses.length,
    )
    setCourses((currentCourses) => [localCourse, ...currentCourses])
    return localCourse
  }

  const updateCourse = async ({ courseId, title, description, thumbnail, category }) => {
    if (token) {
      try {
        const data = await apiRequest(`/api/courses/${courseId}`, {
          method: "PATCH",
          token,
          body: { title, description, thumbnail, category },
        })

        setCourses((currentCourses) =>
          currentCourses.map((course) => (course.id === courseId ? data.course : course)),
        )
        return data.course
      } catch {
        // Fall back to local state below when the API is unreachable.
      }
    }

    let updatedCourse = null

    setCourses((currentCourses) =>
      currentCourses.map((course) => {
        if (course.id !== courseId) {
          return course
        }

        updatedCourse = {
          ...course,
          title,
          description,
          thumbnail:
            thumbnail || "https://placehold.co/800x500/e2e8f0/334155?text=Updated+Course",
          category: category || course.category,
        }

        return updatedCourse
      }),
    )

    return updatedCourse
  }

  const addModuleToCourse = async ({
    courseId,
    title,
    description,
    videoUrl,
    pdfUrl,
    pdfFile,
    lessons,
  }) => {
    if (token) {
      try {
        const body = new FormData()
        body.append("title", title)
        body.append("description", description || "")
        body.append("videoUrl", videoUrl)
        body.append("pdfUrl", pdfUrl || "")
        body.append("lessons", JSON.stringify(lessons || []))
        if (pdfFile) {
          body.append("pdfFile", pdfFile)
        }

        const data = await apiRequest(`/api/courses/${courseId}/modules`, {
          method: "POST",
          token,
          body,
        })

        setCourses((currentCourses) =>
          currentCourses.map((course) => (course.id === courseId ? data.course : course)),
        )
        return data.module.id
      } catch {
        // Fall back to local state below when the API is unreachable.
      }
    }

    const moduleId = `${courseId}-module-${Date.now()}`

    setCourses((currentCourses) =>
      currentCourses.map((course) => {
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
              pdfUrl: pdfUrl || createLocalFileUrl(pdfFile),
              lessons: lessons?.length ? lessons : ["Lesson 1", "Lesson 2"],
            },
          ],
        }
      }),
    )

    return moduleId
  }

  const updateCourseModule = async ({
    courseId,
    moduleId,
    title,
    description,
    videoUrl,
    pdfUrl,
    pdfFile,
    lessons,
  }) => {
    if (token) {
      try {
        const body = new FormData()
        body.append("title", title)
        body.append("description", description || "")
        body.append("videoUrl", videoUrl)
        body.append("pdfUrl", pdfUrl || "")
        body.append("lessons", JSON.stringify(lessons || []))
        if (pdfFile) {
          body.append("pdfFile", pdfFile)
        }

        const data = await apiRequest(`/api/courses/${courseId}/modules/${moduleId}`, {
          method: "PATCH",
          token,
          body,
        })

        setCourses((currentCourses) =>
          currentCourses.map((course) => (course.id === courseId ? data.course : course)),
        )
        return data.module
      } catch {
        // Fall back to local state below when the API is unreachable.
      }
    }

    let updatedModule = null

    setCourses((currentCourses) =>
      currentCourses.map((course) => {
        if (course.id !== courseId) {
          return course
        }

        return {
          ...course,
          modules: course.modules.map((module) => {
            if (module.id !== moduleId) {
              return module
            }

            updatedModule = {
              ...module,
              title,
              description,
              videoUrl,
              pdfUrl: pdfUrl || createLocalFileUrl(pdfFile) || module.pdfUrl || "",
              lessons: lessons?.length ? lessons : [],
            }

            return updatedModule
          }),
        }
      }),
    )

    return updatedModule
  }

  const createAssessment = async ({
    courseId,
    moduleId,
    title,
    description,
    type,
    dueDate,
    fileUrl,
    attachmentFile,
    questionList,
    createdBy,
  }) => {
    if (token) {
      try {
        const body = new FormData()
        body.append("courseId", courseId)
        body.append("moduleId", moduleId)
        body.append("title", title)
        body.append("description", description || "")
        body.append("type", type || "assignment")
        body.append("dueDate", dueDate || "")
        body.append("fileUrl", fileUrl || "")
        body.append("fileName", attachmentFile?.name || `${slugify(title) || "assessment"}.pdf`)
        body.append("questionList", JSON.stringify(questionList || []))
        if (attachmentFile) {
          body.append("attachmentFile", attachmentFile)
        }

        const data = await apiRequest("/api/assessments", {
          method: "POST",
          token,
          body,
        })

        setAssessments((currentAssessments) => [data.assessment, ...currentAssessments])
        return data.assessment
      } catch {
        // Fall back to local state below when the API is unreachable.
      }
    }

    const localAssessment = {
      id: `${moduleId}-assessment-${Date.now()}`,
      title,
      description,
      courseId,
      moduleId,
      type: type || "assignment",
      dueDate: dueDate || "",
      fileUrl: fileUrl || createLocalFileUrl(attachmentFile),
      fileName: attachmentFile?.name || `${slugify(title) || "assessment"}.pdf`,
      questions: questionList.map((question, index) => ({
        id: `${moduleId}-assessment-q-${index + 1}-${Date.now()}`,
        type: question.type || "text",
        question: question.question,
        options: question.options || [],
        correctAnswer: question.correctAnswer || "",
      })),
      createdByName: createdBy,
    }

    setAssessments((currentAssessments) => [localAssessment, ...currentAssessments])
    return localAssessment
  }

  const submitAssessment = async ({
    assessmentId,
    studentName,
    answers,
    uploadedFileName,
    submissionFile,
  }) => {
    if (token) {
      try {
        const body = new FormData()
        body.append("answers", JSON.stringify(answers || {}))
        body.append("uploadedFileName", uploadedFileName || submissionFile?.name || "")
        if (submissionFile) {
          body.append("submissionFile", submissionFile)
        }

        const data = await apiRequest(`/api/submissions/${assessmentId}`, {
          method: "POST",
          token,
          body,
        })

        setAssessmentSubmissions((currentSubmissions) => {
          const filteredSubmissions = currentSubmissions.filter(
            (submission) =>
              !(
                submission.assessmentId === data.submission.assessmentId &&
                submission.studentName === data.submission.studentName
              ),
          )

          return [data.submission, ...filteredSubmissions]
        })

        return data.submission
      } catch {
        // Fall back to local state below when the API is unreachable.
      }
    }

    const assessment = assessments.find((item) => item.id === assessmentId)

    if (!assessment) {
      throw new Error("Assessment not found.")
    }

    const total = assessment.questions.length
    const score = assessment.questions.reduce((currentScore, question) => {
      if (!question.correctAnswer) {
        return currentScore
      }

      return answers[question.id] === question.correctAnswer
        ? currentScore + 1
        : currentScore
    }, 0)

    const localSubmission = {
      id: `submission-${assessmentId}-${Date.now()}`,
      assessmentId,
      studentName,
      answers,
      uploadedFileName:
        uploadedFileName || submissionFile?.name || `${slugify(studentName) || "student"}-submission.pdf`,
      uploadedFileUrl: createLocalFileUrl(submissionFile),
      score,
      total,
      percentage: total ? Math.round((score / total) * 100) : 0,
      status: "Completed",
      submittedAt: new Date().toISOString(),
      assessmentTitle: assessment.title,
    }

    setAssessmentSubmissions((currentSubmissions) => {
      const filteredSubmissions = currentSubmissions.filter(
        (submission) =>
          !(submission.assessmentId === assessmentId && submission.studentName === studentName),
      )

      return [localSubmission, ...filteredSubmissions]
    })

    return localSubmission
  }

  const updateUserRole = async ({ userId, role }) => {
    if (token) {
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

    throw new Error("You must be logged in to update user roles.")
  }

  const getAssessmentsForModule = (courseId, moduleId) =>
    assessments.filter(
      (assessment) =>
        assessment.courseId === courseId && assessment.moduleId === moduleId,
    )

  const getSubmissionsForAssessment = (assessmentId) =>
    assessmentSubmissions.filter(
      (submission) => submission.assessmentId === assessmentId,
    )

  const value = useMemo(
    () => ({
      courses,
      assessments,
      assessmentSubmissions,
      resources,
      users,
      isUsersLoading,
      usersError,
      refreshUsers,
      updateUserRole,
      createCourse,
      updateCourse,
      addModuleToCourse,
      updateCourseModule,
      createAssessment,
      submitAssessment,
      getAssessmentsForModule,
      getSubmissionsForAssessment,
    }),
    [courses, assessments, assessmentSubmissions, resources, users, isUsersLoading, usersError],
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
