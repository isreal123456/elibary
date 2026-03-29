import { useMemo, useState } from "react"
import AssessmentCard from "../components/AssessmentCard"
import Button from "../components/Button"
import FormInput from "../components/FormInput"
import { useAppData } from "../context/AppDataContext"
import { useAuth } from "../context/AuthContext"

function InstructorMyCoursesPage() {
  const { user } = useAuth()
  const { courses, assessments, addModuleToCourse, createAssessment } = useAppData()
  const myCourses = useMemo(
    () => courses.filter((course) => course.instructor === user?.name),
    [courses, user],
  )

  const [activeCourseId, setActiveCourseId] = useState("")
  const [form, setForm] = useState({
    title: "",
    description: "",
    videoUrl: "",
    pdfUrl: "",
  })
  const [assessmentForm, setAssessmentForm] = useState({
    courseId: "",
    moduleId: "",
    title: "",
    description: "",
    fileUrl: "",
    questionType: "mcq",
    questionText: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: "",
  })
  const [assessmentFileName, setAssessmentFileName] = useState("")

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleAssessmentChange = (field, value) => {
    setAssessmentForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddModule = (event) => {
    event.preventDefault()
    if (!activeCourseId || !form.title.trim() || !form.videoUrl.trim()) {
      return
    }

    addModuleToCourse({
      courseId: activeCourseId,
      title: form.title.trim(),
      description: form.description.trim(),
      videoUrl: form.videoUrl.trim(),
      pdfUrl:
        form.pdfUrl.trim() ||
        "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    })

    setForm({
      title: "",
      description: "",
      videoUrl: "",
      pdfUrl: "",
    })
    setActiveCourseId("")
  }

  const handleAddAssessment = (event) => {
    event.preventDefault()
    if (!assessmentForm.courseId || !assessmentForm.title.trim()) {
      return
    }

    const questionText = assessmentForm.questionText.trim()
    const correctAnswer = assessmentForm.correctAnswer.trim()

    const questions = questionText
      ? [
          {
            id: `q-${Date.now()}`,
            type: assessmentForm.questionType,
            question: questionText,
            options:
              assessmentForm.questionType === "mcq"
                ? [
                    assessmentForm.optionA,
                    assessmentForm.optionB,
                    assessmentForm.optionC,
                    assessmentForm.optionD,
                  ]
                    .map((option) => option.trim())
                    .filter(Boolean)
                : [],
            correctAnswer,
          },
        ]
      : []

    createAssessment({
      title: assessmentForm.title.trim(),
      description: assessmentForm.description.trim(),
      courseId: assessmentForm.courseId,
      moduleId: assessmentForm.moduleId || null,
      fileUrl: assessmentForm.fileUrl.trim(),
      fileName: assessmentFileName || "assessment-upload",
      questions,
      createdBy: user?.name,
    })

    setAssessmentForm({
      courseId: "",
      moduleId: "",
      title: "",
      description: "",
      fileUrl: "",
      questionType: "mcq",
      questionText: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctAnswer: "",
    })
    setAssessmentFileName("")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          My Courses
        </h1>
        <Button to="/instructor/create-course" className="w-full sm:w-auto">
          Create Course
        </Button>
      </div>

      <div className="grid gap-4">
        {myCourses.length ? (
          myCourses.map((course) => (
            <article
              key={course.id}
              className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">{course.title}</h2>
                  <p className="text-sm text-slate-600">
                    {course.modules.length} module(s)
                  </p>
                  <p className="text-sm text-slate-500">
                    {
                      assessments.filter((assessment) => assessment.courseId === course.id)
                        .length
                    }{" "}
                    assessment(s)
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary">Edit</Button>
                  <Button onClick={() => setActiveCourseId(course.id)}>Add Module</Button>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-lg bg-white p-6 text-sm text-slate-600 shadow-sm ring-1 ring-slate-200">
            You have not created any courses yet.
          </div>
        )}
      </div>

      <form
        onSubmit={handleAddModule}
        className="space-y-4 rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200"
      >
        <h2 className="text-xl font-semibold text-slate-900">Add Module</h2>
        <select
          value={activeCourseId}
          onChange={(event) => setActiveCourseId(event.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="">Select course</option>
          {myCourses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>

        <FormInput
          id="module-title"
          label="Module Title"
          value={form.title}
          onChange={(event) => handleChange("title", event.target.value)}
          placeholder="Week 1: Introduction"
        />
        <FormInput
          id="module-video"
          label="Video URL (YouTube embed URL)"
          value={form.videoUrl}
          onChange={(event) => handleChange("videoUrl", event.target.value)}
          placeholder="https://www.youtube.com/embed/..."
        />
        <FormInput
          id="module-pdf"
          label="PDF URL"
          value={form.pdfUrl}
          onChange={(event) => handleChange("pdfUrl", event.target.value)}
          placeholder="https://example.com/notes.pdf"
        />
        <div>
          <label className="mb-1.5 block text-sm text-slate-700" htmlFor="module-description">
            Description
          </label>
          <textarea
            id="module-description"
            rows={3}
            value={form.description}
            onChange={(event) => handleChange("description", event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            placeholder="Module summary..."
          />
        </div>
        <Button type="submit" className="w-full sm:w-auto">
          Add Module
        </Button>
      </form>

      <form
        onSubmit={handleAddAssessment}
        className="space-y-4 rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200"
      >
        <h2 className="text-xl font-semibold text-slate-900">Add Assessment</h2>
        <p className="text-sm text-slate-600">
          Create course or module assessments with optional questions and file
          attachments.
        </p>

        <select
          value={assessmentForm.courseId}
          onChange={(event) => handleAssessmentChange("courseId", event.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="">Select course</option>
          {myCourses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>

        <select
          value={assessmentForm.moduleId}
          onChange={(event) => handleAssessmentChange("moduleId", event.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="">Assign to course level</option>
          {(myCourses.find((course) => course.id === assessmentForm.courseId)?.modules || []).map(
            (module) => (
              <option key={module.id} value={module.id}>
                {module.title}
              </option>
            ),
          )}
        </select>

        <FormInput
          id="assessment-title"
          label="Assessment Title"
          value={assessmentForm.title}
          onChange={(event) => handleAssessmentChange("title", event.target.value)}
          placeholder="Week 2 Quiz"
        />
        <FormInput
          id="assessment-description"
          label="Assessment Description"
          value={assessmentForm.description}
          onChange={(event) =>
            handleAssessmentChange("description", event.target.value)
          }
          placeholder="Short assessment summary"
        />
        <FormInput
          id="assessment-file-url"
          label="Assessment File URL (PDF/DOC)"
          value={assessmentForm.fileUrl}
          onChange={(event) => handleAssessmentChange("fileUrl", event.target.value)}
          placeholder="https://example.com/assessment.pdf"
        />
        <div>
          <label className="mb-1.5 block text-sm text-slate-700" htmlFor="assessment-file">
            Or Upload Assessment File (Mock)
          </label>
          <input
            id="assessment-file"
            type="file"
            onChange={(event) =>
              setAssessmentFileName(event.target.files?.[0]?.name || "")
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-sm file:text-slate-700"
            accept=".pdf,.doc,.docx,.txt"
          />
          {assessmentFileName ? (
            <p className="mt-1 text-xs text-slate-500">Selected: {assessmentFileName}</p>
          ) : null}
        </div>

        <div className="rounded-lg bg-slate-50 p-4 ring-1 ring-slate-200">
          <h3 className="text-sm font-semibold text-slate-900">Optional Question</h3>
          <div className="mt-3 space-y-3">
            <select
              value={assessmentForm.questionType}
              onChange={(event) =>
                handleAssessmentChange("questionType", event.target.value)
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="mcq">MCQ</option>
              <option value="text">Text</option>
            </select>
            <FormInput
              id="assessment-question"
              label="Question"
              value={assessmentForm.questionText}
              onChange={(event) =>
                handleAssessmentChange("questionText", event.target.value)
              }
              placeholder="Enter a question"
            />
            {assessmentForm.questionType === "mcq" ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <FormInput
                  id="option-a"
                  label="Option A"
                  value={assessmentForm.optionA}
                  onChange={(event) =>
                    handleAssessmentChange("optionA", event.target.value)
                  }
                />
                <FormInput
                  id="option-b"
                  label="Option B"
                  value={assessmentForm.optionB}
                  onChange={(event) =>
                    handleAssessmentChange("optionB", event.target.value)
                  }
                />
                <FormInput
                  id="option-c"
                  label="Option C"
                  value={assessmentForm.optionC}
                  onChange={(event) =>
                    handleAssessmentChange("optionC", event.target.value)
                  }
                />
                <FormInput
                  id="option-d"
                  label="Option D"
                  value={assessmentForm.optionD}
                  onChange={(event) =>
                    handleAssessmentChange("optionD", event.target.value)
                  }
                />
              </div>
            ) : null}
            <FormInput
              id="correct-answer"
              label="Correct Answer"
              value={assessmentForm.correctAnswer}
              onChange={(event) =>
                handleAssessmentChange("correctAnswer", event.target.value)
              }
              placeholder="Used for mock auto-scoring"
            />
          </div>
        </div>

        <Button type="submit" className="w-full sm:w-auto">
          Save Assessment
        </Button>
      </form>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">Course Assessments</h2>
        {myCourses.map((course) => {
          const courseAssessments = assessments.filter(
            (assessment) => assessment.courseId === course.id,
          )

          return (
            <div key={course.id} className="space-y-3 rounded-lg bg-slate-50 p-4">
              <h3 className="text-base font-semibold text-slate-900">{course.title}</h3>
              {courseAssessments.length ? (
                <div className="grid gap-3">
                  {courseAssessments.map((assessment) => (
                    <AssessmentCard
                      key={assessment.id}
                      assessment={assessment}
                      status="Pending"
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-600">No assessments yet.</p>
              )}
            </div>
          )
        })}
      </section>
    </div>
  )
}

export default InstructorMyCoursesPage
