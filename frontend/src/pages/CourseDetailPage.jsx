import { useEffect, useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import AssessmentCard from "../components/AssessmentCard"
import Button from "../components/Button"
import FormInput from "../components/FormInput"
import ModuleBlock from "../components/ModuleBlock"
import ResultsTable from "../components/ResultsTable"
import { useAppData } from "../context/AppDataContext"
import { useAuth } from "../context/AuthContext"

function CourseDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const { courses, assessments, assessmentSubmissions, submitAssessment, updateCourseModule } =
    useAppData()
  const [isLoading, setIsLoading] = useState(true)
  const [activeAssessmentId, setActiveAssessmentId] = useState("")
  const [answerDrafts, setAnswerDrafts] = useState({})
  const [uploadDrafts, setUploadDrafts] = useState({})
  const [isEditingModule, setIsEditingModule] = useState(false)
  const [moduleMessage, setModuleMessage] = useState("")
  const [moduleForm, setModuleForm] = useState({
    title: "",
    description: "",
    videoUrl: "",
    pdfUrl: "",
    lessonsText: "",
    pdfFile: null,
  })

  const course = useMemo(
    () => courses.find((item) => item.id === id),
    [courses, id],
  )
  const [selectedModuleId, setSelectedModuleId] = useState(course?.modules?.[0]?.id)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 700)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (course?.modules?.length) {
      setSelectedModuleId(course.modules[0].id)
      return
    }

    setSelectedModuleId("")
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

  const selectedModule = course.modules?.length
    ? course.modules.find((module) => module.id === selectedModuleId) ?? course.modules[0]
    : null
  const canEditModules =
    user?.role === "admin" ||
    (user?.role === "instructor" &&
      (course.instructorId === user.id || course.instructor === user.name))
  const courseAssessments = assessments.filter((assessment) => assessment.courseId === course.id)
  const assessmentIds = courseAssessments.map((assessment) => assessment.id)
  const courseResults = assessmentSubmissions
    .filter((row) => assessmentIds.includes(row.assessmentId))
    .map((row) => ({
      ...row,
      assessmentTitle:
        courseAssessments.find((assessment) => assessment.id === row.assessmentId)?.title ||
        "Assessment",
    }))

  const visibleResults =
    user?.role === "admin"
      ? courseResults
      : user?.role === "instructor" &&
          (course.instructorId === user.id || course.instructor === user.name)
        ? courseResults
        : courseResults.filter((row) => row.studentName === user?.name)

  const handleAnswerChange = (assessmentId, questionId, value) => {
    setAnswerDrafts((prev) => ({
      ...prev,
      [assessmentId]: {
        ...(prev[assessmentId] || {}),
        [questionId]: value,
      },
    }))
  }

  useEffect(() => {
    if (!selectedModule) {
      setModuleForm({
        title: "",
        description: "",
        videoUrl: "",
        pdfUrl: "",
        lessonsText: "",
        pdfFile: null,
      })
      setIsEditingModule(false)
      return
    }

    setModuleForm({
      title: selectedModule.title || "",
      description: selectedModule.description || "",
      videoUrl: selectedModule.videoUrl || "",
      pdfUrl: selectedModule.pdfUrl || "",
      lessonsText: (selectedModule.lessons || []).join(", "),
      pdfFile: null,
    })
    setIsEditingModule(false)
    setModuleMessage("")
  }, [selectedModule?.id])

  const handleModuleFormChange = (field, value) => {
    setModuleForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveModule = async (event) => {
    event.preventDefault()

    if (!selectedModule || !moduleForm.title.trim() || !moduleForm.videoUrl.trim()) {
      setModuleMessage("Module title and video URL are required.")
      return
    }

    await updateCourseModule({
      courseId: course.id,
      moduleId: selectedModule.id,
      title: moduleForm.title.trim(),
      description: moduleForm.description.trim(),
      videoUrl: moduleForm.videoUrl.trim(),
      pdfUrl: moduleForm.pdfUrl.trim(),
      pdfFile: moduleForm.pdfFile,
      lessons: moduleForm.lessonsText
        .split(",")
        .map((lesson) => lesson.trim())
        .filter(Boolean),
    })

    setModuleMessage("Module updated successfully.")
    setIsEditingModule(false)
  }

  const handleSubmitAssessment = async (assessment) => {
    if (!user || user.role !== "student") {
      return
    }

    await submitAssessment({
      assessmentId: assessment.id,
      studentName: user.name,
      answers: answerDrafts[assessment.id] || {},
      uploadedFileName: uploadDrafts[assessment.id] || "",
      submissionFile: uploadDrafts[`${assessment.id}-file`] || null,
    })
    setActiveAssessmentId("")
  }

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
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            <aside className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200 lg:sticky lg:top-6 lg:h-fit">
              <h2 className="mb-3 text-lg font-semibold text-slate-900">Modules</h2>
              <div className="flex gap-2 overflow-auto pb-1 lg:flex-col lg:overflow-visible">
                {course.modules?.length ? (
                  course.modules.map((module) => (
                    <button
                      key={module.id}
                      type="button"
                      onClick={() => setSelectedModuleId(module.id)}
                      className={[
                        "whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm transition-colors lg:whitespace-normal",
                        selectedModule?.id === module.id
                          ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                      ].join(" ")}
                    >
                      {module.title}
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No modules yet.</p>
                )}
              </div>
            </aside>

            <div className="space-y-4">
              {selectedModule ? (
                <div className="space-y-4">
                  <div className="flex flex-col gap-3 rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
                        Selected Module
                      </p>
                      <h2 className="text-lg font-semibold text-slate-900">
                        {selectedModule.title}
                      </h2>
                    </div>
                    {canEditModules ? (
                      <Button
                        type="button"
                        variant={isEditingModule ? "secondary" : "primary"}
                        onClick={() => {
                          setIsEditingModule((prev) => !prev)
                          setModuleMessage("")
                        }}
                        className="w-full sm:w-auto"
                      >
                        {isEditingModule ? "Close Editor" : "Edit Module"}
                      </Button>
                    ) : null}
                  </div>

                  {moduleMessage ? (
                    <div className="rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700 ring-1 ring-blue-100">
                      {moduleMessage}
                    </div>
                  ) : null}

                  <ModuleBlock module={selectedModule} />

                  {canEditModules && isEditingModule ? (
                    <form
                      onSubmit={handleSaveModule}
                      className="space-y-4 rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-lg font-semibold text-slate-900">Edit Module</h3>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => {
                            setIsEditingModule(false)
                            setModuleMessage("")
                            setModuleForm({
                              title: selectedModule.title || "",
                              description: selectedModule.description || "",
                              videoUrl: selectedModule.videoUrl || "",
                              pdfUrl: selectedModule.pdfUrl || "",
                              lessonsText: (selectedModule.lessons || []).join(", "),
                              pdfFile: null,
                            })
                          }}
                        >
                          Cancel
                        </Button>
                      </div>

                      <FormInput
                        id="edit-module-title"
                        label="Module Title"
                        value={moduleForm.title}
                        onChange={(event) =>
                          handleModuleFormChange("title", event.target.value)
                        }
                        placeholder="Week 1: Introduction"
                      />

                      <div>
                        <label
                          htmlFor="edit-module-description"
                          className="mb-1.5 block text-sm text-slate-700"
                        >
                          Description
                        </label>
                        <textarea
                          id="edit-module-description"
                          rows={3}
                          value={moduleForm.description}
                          onChange={(event) =>
                            handleModuleFormChange("description", event.target.value)
                          }
                          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                          placeholder="Module summary..."
                        />
                      </div>

                      <FormInput
                        id="edit-module-video"
                        label="Video URL (YouTube embed URL)"
                        value={moduleForm.videoUrl}
                        onChange={(event) =>
                          handleModuleFormChange("videoUrl", event.target.value)
                        }
                        placeholder="https://www.youtube.com/embed/..."
                      />

                      <FormInput
                        id="edit-module-pdf"
                        label="PDF URL"
                        value={moduleForm.pdfUrl}
                        onChange={(event) =>
                          handleModuleFormChange("pdfUrl", event.target.value)
                        }
                        placeholder="https://example.com/notes.pdf"
                      />

                      <div>
                        <label
                          className="mb-1.5 block text-sm text-slate-700"
                          htmlFor="edit-module-pdf-upload"
                        >
                          Upload PDF instead
                        </label>
                        <input
                          id="edit-module-pdf-upload"
                          type="file"
                          accept=".pdf"
                          onChange={(event) =>
                            handleModuleFormChange("pdfFile", event.target.files?.[0] || null)
                          }
                          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-sm file:text-slate-700"
                        />
                        {moduleForm.pdfFile ? (
                          <p className="mt-2 text-xs text-slate-500">
                            Selected file: {moduleForm.pdfFile.name}
                          </p>
                        ) : null}
                      </div>

                      <FormInput
                        id="edit-module-lessons"
                        label="Lessons (comma separated)"
                        value={moduleForm.lessonsText}
                        onChange={(event) =>
                          handleModuleFormChange("lessonsText", event.target.value)
                        }
                        placeholder="Lesson 1, Lesson 2, Lesson 3"
                      />

                      <Button type="submit" className="w-full sm:w-auto">
                        Save Module Changes
                      </Button>
                    </form>
                  ) : null}
                </div>
              ) : (
                <div className="rounded-lg bg-white p-6 text-sm text-slate-600 shadow-sm ring-1 ring-slate-200">
                  No module content available for this course yet.
                </div>
              )}
            </div>
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900">Assessments</h2>
            {courseAssessments.length ? (
              <div className="space-y-4">
                {courseAssessments.map((assessment) => {
                  const mySubmission = assessmentSubmissions.find(
                    (row) => row.assessmentId === assessment.id && row.studentName === user?.name,
                  )

                  return (
                    <div key={assessment.id} className="space-y-3">
                      <AssessmentCard
                        assessment={assessment}
                        isStudent={user?.role === "student"}
                        status={mySubmission ? "Completed" : "Pending"}
                        scoreLabel={
                          mySubmission
                            ? `Score: ${mySubmission.score}/${mySubmission.total} (${mySubmission.percentage}%)`
                            : ""
                        }
                        onStart={() => setActiveAssessmentId(assessment.id)}
                      />

                      {user?.role === "student" && activeAssessmentId === assessment.id ? (
                        <form
                          onSubmit={(event) => {
                            event.preventDefault()
                            handleSubmitAssessment(assessment)
                          }}
                          className="space-y-4 rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200"
                        >
                          <h3 className="text-base font-semibold text-slate-900">
                            Submit Answers
                          </h3>
                          {assessment.questions.length ? (
                            assessment.questions.map((question) => (
                              <div key={question.id} className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700">
                                  {question.question}
                                </label>
                                {question.type === "mcq" ? (
                                  <select
                                    value={answerDrafts[assessment.id]?.[question.id] || ""}
                                    onChange={(event) =>
                                      handleAnswerChange(
                                        assessment.id,
                                        question.id,
                                        event.target.value,
                                      )
                                    }
                                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                  >
                                    <option value="">Select answer</option>
                                    {question.options.map((option) => (
                                      <option key={option} value={option}>
                                        {option}
                                      </option>
                                    ))}
                                  </select>
                                ) : (
                                  <input
                                    type="text"
                                    value={answerDrafts[assessment.id]?.[question.id] || ""}
                                    onChange={(event) =>
                                      handleAnswerChange(
                                        assessment.id,
                                        question.id,
                                        event.target.value,
                                      )
                                    }
                                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                    placeholder="Type your answer"
                                  />
                                )}
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-slate-600">
                              No auto-graded questions were added. Upload your response file
                              to complete this assessment.
                            </p>
                          )}

                          <div>
                            <label
                              className="mb-1.5 block text-sm text-slate-700"
                              htmlFor={`file-${assessment.id}`}
                            >
                              Upload Response File (Optional)
                            </label>
                            <input
                              id={`file-${assessment.id}`}
                              type="file"
                              accept=".pdf,.doc,.docx,.txt"
                              onChange={(event) =>
                                setUploadDrafts((prev) => ({
                                  ...prev,
                                  [assessment.id]: event.target.files?.[0]?.name || "",
                                  [`${assessment.id}-file`]: event.target.files?.[0] || null,
                                }))
                              }
                              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-sm file:text-slate-700"
                            />
                          </div>

                          <div className="flex flex-col gap-2 sm:flex-row">
                            <Button type="submit" className="w-full sm:w-auto">
                              Submit Assessment
                            </Button>
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={() => setActiveAssessmentId("")}
                              className="w-full sm:w-auto"
                            >
                              Cancel
                            </Button>
                          </div>
                        </form>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="rounded-lg bg-white p-6 text-sm text-slate-600 shadow-sm ring-1 ring-slate-200">
                No assessments available for this course yet.
              </div>
            )}
          </section>

          <section>
            <ResultsTable rows={visibleResults} />
            <p className="mt-2 text-xs text-slate-500">
              {user?.role === "admin"
                ? "Admins can review every submission on the platform."
                : user?.role === "instructor" &&
                    (course.instructorId === user.id || course.instructor === user.name)
                  ? "You are viewing assessment results for your own course."
                  : "Students can only view their own assessment results."}
            </p>
          </section>
        </div>
      )}
    </div>
  )
}

export default CourseDetailPage
