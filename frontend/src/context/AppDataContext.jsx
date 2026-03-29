import { createContext, useContext, useMemo, useState } from "react"
import {
  assessments as initialAssessments,
  assessmentSubmissions as initialAssessmentSubmissions,
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
  const [assessments, setAssessments] = useState(initialAssessments)
  const [assessmentSubmissions, setAssessmentSubmissions] = useState(
    initialAssessmentSubmissions,
  )
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

  const createAssessment = ({
    title,
    description,
    courseId,
    moduleId,
    fileUrl,
    fileName,
    questions,
    createdBy,
  }) => {
    const id = `asm-${Date.now()}`

    setAssessments((prev) => [
      {
        id,
        title,
        description,
        courseId,
        moduleId: moduleId || null,
        fileUrl:
          fileUrl ||
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        fileName: fileName || "assessment-file.pdf",
        questions: questions || [],
        createdBy: createdBy || "Instructor",
      },
      ...prev,
    ])
  }

  const submitAssessment = ({
    assessmentId,
    studentName,
    answers,
    uploadedFileName,
  }) => {
    const assessment = assessments.find((item) => item.id === assessmentId)
    if (!assessment) {
      return
    }

    const questions = assessment.questions || []
    const total = questions.length || 1

    let score = 0
    if (!questions.length) {
      score = 1
    } else {
      questions.forEach((question) => {
        const userAnswer = String(answers?.[question.id] || "")
          .trim()
          .toLowerCase()
        const expected = String(question.correctAnswer || "")
          .trim()
          .toLowerCase()
        if (userAnswer && userAnswer === expected) {
          score += 1
        }
      })
    }

    const percentage = Math.round((score / total) * 100)

    setAssessmentSubmissions((prev) => {
      const existingIndex = prev.findIndex(
        (row) => row.assessmentId === assessmentId && row.studentName === studentName,
      )

      const nextItem = {
        id:
          existingIndex >= 0
            ? prev[existingIndex].id
            : `sub-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        assessmentId,
        studentName,
        answers,
        uploadedFileName: uploadedFileName || "",
        score,
        total,
        percentage,
        status: "Completed",
        submittedAt: new Date().toISOString(),
      }

      if (existingIndex >= 0) {
        const copy = [...prev]
        copy[existingIndex] = nextItem
        return copy
      }

      return [nextItem, ...prev]
    })
  }

  const value = useMemo(
    () => ({
      courses,
      assessments,
      assessmentSubmissions,
      resources,
      users,
      createCourse,
      addModuleToCourse,
      createAssessment,
      submitAssessment,
    }),
    [courses, assessments, assessmentSubmissions, resources, users],
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
