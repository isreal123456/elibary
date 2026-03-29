import { useMemo, useState } from "react"
import Button from "../components/Button"
import FormInput from "../components/FormInput"
import { useAppData } from "../context/AppDataContext"
import { useAuth } from "../context/AuthContext"

function createQuestionDraft() {
  return {
    id: `question-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type: "text",
    question: "",
    correctAnswer: "",
    optionsText: "",
  }
}

function InstructorMyCoursesPage() {
  const { user } = useAuth()
  const { courses, assessments, updateCourse, addModuleToCourse, createAssessment } =
    useAppData()
  const myCourses = useMemo(
    () =>
      courses.filter(
        (course) => course.instructorId === user?.id || course.instructor === user?.name,
      ),
    [courses, user],
  )

  const [editingCourseId, setEditingCourseId] = useState("")
  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
    thumbnail: "",
    category: "General",
  })
  const [moduleForm, setModuleForm] = useState({
    courseId: "",
    title: "",
    description: "",
    videoUrl: "",
    pdfUrl: "",
    pdfFile: null,
    lessonsText: "",
  })
  const [assessmentForm, setAssessmentForm] = useState({
    courseId: "",
    moduleId: "",
    title: "",
    description: "",
    type: "assignment",
    dueDate: "",
    fileUrl: "",
    attachmentFile: null,
    questions: [createQuestionDraft()],
  })
  const [courseMessage, setCourseMessage] = useState("")
  const [moduleMessage, setModuleMessage] = useState("")
  const [assessmentMessage, setAssessmentMessage] = useState("")
  const [activeCourseAction, setActiveCourseAction] = useState({
    courseId: "",
    action: "",
  })

  const handleCourseFormChange = (field, value) => {
    setCourseForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleModuleChange = (field, value) => {
    setModuleForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleAssessmentChange = (field, value) => {
    setAssessmentForm((prev) => ({ ...prev, [field]: value }))
  }

  const resetMessages = () => {
    setCourseMessage("")
    setModuleMessage("")
    setAssessmentMessage("")
  }

  const closeActiveAction = () => {
    setEditingCourseId("")
    setActiveCourseAction({ courseId: "", action: "" })
    resetMessages()
  }

  const handleEditStart = (course) => {
    if (isActionOpen(course.id, "edit")) {
      closeActiveAction()
      return
    }

    resetMessages()
    setEditingCourseId(course.id)
    setActiveCourseAction({ courseId: course.id, action: "edit" })
    setCourseForm({
      title: course.title,
      description: course.description,
      thumbnail: course.thumbnail,
      category: course.category,
    })
  }

  const handleSaveCourse = async (event) => {
    event.preventDefault()

    if (!editingCourseId || !courseForm.title.trim() || !courseForm.description.trim()) {
      setCourseMessage("Course title and description are required.")
      return
    }

    await updateCourse({
      courseId: editingCourseId,
      title: courseForm.title.trim(),
      description: courseForm.description.trim(),
      thumbnail: courseForm.thumbnail.trim(),
      category: courseForm.category,
    })

    setCourseMessage("Course updated successfully.")
  }

  const openModuleForm = (course) => {
    if (isActionOpen(course.id, "module")) {
      closeActiveAction()
      return
    }

    resetMessages()
    setEditingCourseId("")
    setActiveCourseAction({ courseId: course.id, action: "module" })
    setModuleForm({
      courseId: course.id,
      title: "",
      description: "",
      videoUrl: "",
      pdfUrl: "",
      pdfFile: null,
      lessonsText: "",
    })
  }

  const handleAddModule = async (event) => {
    event.preventDefault()

    if (!moduleForm.courseId || !moduleForm.title.trim() || !moduleForm.videoUrl.trim()) {
      setModuleMessage("Select a course, add a module title, and provide a video URL.")
      return
    }

    const moduleId = await addModuleToCourse({
      courseId: moduleForm.courseId,
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

    setModuleMessage("Module added successfully.")
    setAssessmentForm((prev) => ({
      ...prev,
      courseId: moduleForm.courseId,
      moduleId,
    }))
    setModuleForm({
      courseId: "",
      title: "",
      description: "",
      videoUrl: "",
      pdfUrl: "",
      pdfFile: null,
      lessonsText: "",
    })
  }

  const openAssessmentForm = (course) => {
    if (isActionOpen(course.id, "assessment")) {
      closeActiveAction()
      return
    }

    resetMessages()
    setEditingCourseId("")
    setActiveCourseAction({ courseId: course.id, action: "assessment" })
    setAssessmentForm({
      courseId: course.id,
      moduleId: course.modules[0]?.id || "",
      title: "",
      description: "",
      type: "assignment",
      dueDate: "",
      fileUrl: "",
      attachmentFile: null,
      questions: [createQuestionDraft()],
    })
  }

  const handleAssessmentQuestionChange = (questionId, field, value) => {
    setAssessmentForm((prev) => ({
      ...prev,
      questions: prev.questions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              [field]: value,
              ...(field === "type" && value === "text"
                ? { optionsText: "" }
                : {}),
            }
          : question,
      ),
    }))
  }

  const handleAddQuestion = () => {
    setAssessmentForm((prev) => ({
      ...prev,
      questions: [...prev.questions, createQuestionDraft()],
    }))
  }

  const handleRemoveQuestion = (questionId) => {
    setAssessmentForm((prev) => ({
      ...prev,
      questions:
        prev.questions.length > 1
          ? prev.questions.filter((question) => question.id !== questionId)
          : prev.questions,
    }))
  }

  const handleAddAssessment = async (event) => {
    event.preventDefault()

    if (
      !assessmentForm.courseId ||
      !assessmentForm.moduleId ||
      !assessmentForm.title.trim()
    ) {
      setAssessmentMessage("Choose a course, module, and assessment title.")
      return
    }

    const preparedQuestions = assessmentForm.questions
      .map((question) => ({
        type: question.type,
        question: question.question.trim(),
        correctAnswer: question.correctAnswer.trim(),
        options:
          question.type === "mcq"
            ? question.optionsText
                .split("\n")
                .map((option) => option.trim())
                .filter(Boolean)
            : [],
      }))
      .filter((question) => question.question)

    if (!preparedQuestions.length) {
      setAssessmentMessage("Add at least one question before creating the assessment.")
      return
    }

    await createAssessment({
      courseId: assessmentForm.courseId,
      moduleId: assessmentForm.moduleId,
      title: assessmentForm.title.trim(),
      description: assessmentForm.description.trim(),
      type: assessmentForm.type,
      dueDate: assessmentForm.dueDate,
      fileUrl: assessmentForm.fileUrl.trim(),
      attachmentFile: assessmentForm.attachmentFile,
      questionList: preparedQuestions,
      createdBy: user?.name || "Instructor",
    })

    setAssessmentMessage("Assessment created successfully.")
    setAssessmentForm({
      courseId: "",
      moduleId: "",
      title: "",
      description: "",
      type: "assignment",
      dueDate: "",
      fileUrl: "",
      attachmentFile: null,
      questions: [createQuestionDraft()],
    })
  }

  const selectedAssessmentCourse = myCourses.find(
    (course) => course.id === assessmentForm.courseId,
  )

  const isActionOpen = (courseId, action) =>
    activeCourseAction.courseId === courseId && activeCourseAction.action === action

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
          myCourses.map((course) => {
            const courseAssessmentCount = assessments.filter(
              (assessment) => assessment.courseId === course.id,
            ).length

            return (
              <article
                key={course.id}
                className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <h2 className="text-lg font-semibold text-slate-900">{course.title}</h2>
                    <p className="text-sm text-slate-600">{course.description}</p>
                    <p className="text-xs uppercase tracking-wide text-blue-700">
                      {course.category}
                    </p>
                    <p className="text-sm text-slate-500">
                      {course.modules.length} module(s) and {courseAssessmentCount} assessment(s)
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="secondary" onClick={() => handleEditStart(course)}>
                      {isActionOpen(course.id, "edit") ? "Hide Edit" : "Edit"}
                    </Button>
                    <Button variant="secondary" onClick={() => openModuleForm(course)}>
                      {isActionOpen(course.id, "module") ? "Hide Module Form" : "Add Module"}
                    </Button>
                    <Button onClick={() => openAssessmentForm(course)}>
                      {isActionOpen(course.id, "assessment")
                        ? "Hide Assessment Form"
                        : "Add Assessment"}
                    </Button>
                    <Button to={`/courses/${course.id}`} variant="ghost">
                      View Course
                    </Button>
                  </div>
                </div>

                {activeCourseAction.courseId === course.id ? (
                  <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
                          Course Actions
                        </p>
                        <h3 className="text-lg font-semibold text-slate-900">
                          {activeCourseAction.action === "edit"
                            ? "Edit Course"
                            : activeCourseAction.action === "module"
                              ? "Add Module"
                              : "Create Assessment"}
                        </h3>
                      </div>
                      <Button type="button" variant="ghost" onClick={closeActiveAction}>
                        Close
                      </Button>
                    </div>

                    {isActionOpen(course.id, "edit") ? (
                      <form onSubmit={handleSaveCourse} className="space-y-4">
                        <FormInput
                          id="edit-course-title"
                          label="Course Title"
                          value={courseForm.title}
                          onChange={(event) => handleCourseFormChange("title", event.target.value)}
                          placeholder="Update the course title"
                        />
                        <div>
                          <label
                            htmlFor="edit-course-description"
                            className="mb-1.5 block text-sm text-slate-700"
                          >
                            Description
                          </label>
                          <textarea
                            id="edit-course-description"
                            rows={4}
                            value={courseForm.description}
                            onChange={(event) =>
                              handleCourseFormChange("description", event.target.value)
                            }
                            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            placeholder="Update the course summary"
                          />
                        </div>
                        <FormInput
                          id="edit-course-thumbnail"
                          label="Thumbnail URL"
                          value={courseForm.thumbnail}
                          onChange={(event) =>
                            handleCourseFormChange("thumbnail", event.target.value)
                          }
                          placeholder="https://placehold.co/800x500"
                        />
                        <div>
                          <label
                            htmlFor="edit-course-category"
                            className="mb-1.5 block text-sm text-slate-700"
                          >
                            Category
                          </label>
                          <select
                            id="edit-course-category"
                            value={courseForm.category}
                            onChange={(event) =>
                              handleCourseFormChange("category", event.target.value)
                            }
                            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                          >
                            <option value="General">General</option>
                            <option value="Frontend">Frontend</option>
                            <option value="Programming">Programming</option>
                            <option value="Design">Design</option>
                            <option value="Backend">Backend</option>
                          </select>
                        </div>
                        {courseMessage ? <p className="text-sm text-blue-700">{courseMessage}</p> : null}
                        <Button type="submit">Save Course Changes</Button>
                      </form>
                    ) : null}

                    {isActionOpen(course.id, "module") ? (
                      <form onSubmit={handleAddModule} className="space-y-4">
                        <FormInput
                          id="module-title"
                          label="Module Title"
                          value={moduleForm.title}
                          onChange={(event) => handleModuleChange("title", event.target.value)}
                          placeholder="Week 1: Introduction"
                        />
                        <FormInput
                          id="module-video"
                          label="Video URL (YouTube embed URL)"
                          value={moduleForm.videoUrl}
                          onChange={(event) => handleModuleChange("videoUrl", event.target.value)}
                          placeholder="https://www.youtube.com/embed/..."
                        />
                        <FormInput
                          id="module-pdf"
                          label="PDF URL"
                          value={moduleForm.pdfUrl}
                          onChange={(event) => handleModuleChange("pdfUrl", event.target.value)}
                          placeholder="https://example.com/notes.pdf"
                        />
                        <div>
                          <label
                            className="mb-1.5 block text-sm text-slate-700"
                            htmlFor="module-pdf-upload"
                          >
                            Upload PDF instead
                          </label>
                          <input
                            id="module-pdf-upload"
                            type="file"
                            accept=".pdf"
                            onChange={(event) =>
                              handleModuleChange("pdfFile", event.target.files?.[0] || null)
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
                          id="module-lessons"
                          label="Lessons (comma separated)"
                          value={moduleForm.lessonsText}
                          onChange={(event) =>
                            handleModuleChange("lessonsText", event.target.value)
                          }
                          placeholder="Lesson 1, Lesson 2, Lesson 3"
                        />
                        <div>
                          <label
                            className="mb-1.5 block text-sm text-slate-700"
                            htmlFor="module-description"
                          >
                            Description
                          </label>
                          <textarea
                            id="module-description"
                            rows={3}
                            value={moduleForm.description}
                            onChange={(event) =>
                              handleModuleChange("description", event.target.value)
                            }
                            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            placeholder="Module summary..."
                          />
                        </div>
                        {moduleMessage ? <p className="text-sm text-blue-700">{moduleMessage}</p> : null}
                        <Button type="submit" className="w-full sm:w-auto">
                          Add Module
                        </Button>
                      </form>
                    ) : null}

                    {isActionOpen(course.id, "assessment") ? (
                      <form onSubmit={handleAddAssessment} className="space-y-4">
                        <select
                          value={assessmentForm.moduleId}
                          onChange={(event) =>
                            handleAssessmentChange("moduleId", event.target.value)
                          }
                          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        >
                          <option value="">Select module</option>
                          {(selectedAssessmentCourse?.modules || []).map((module) => (
                            <option key={module.id} value={module.id}>
                              {module.title}
                            </option>
                          ))}
                        </select>
                        <FormInput
                          id="assessment-title"
                          label="Assessment Title"
                          value={assessmentForm.title}
                          onChange={(event) =>
                            handleAssessmentChange("title", event.target.value)
                          }
                          placeholder="Week 1 Quiz"
                        />
                        <div>
                          <label
                            htmlFor="assessment-type"
                            className="mb-1.5 block text-sm text-slate-700"
                          >
                            Assessment Type
                          </label>
                          <select
                            id="assessment-type"
                            value={assessmentForm.type}
                            onChange={(event) =>
                              handleAssessmentChange("type", event.target.value)
                            }
                            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                          >
                            <option value="assignment">Assignment</option>
                            <option value="quiz">Quiz</option>
                            <option value="exam">Exam</option>
                          </select>
                        </div>
                        <FormInput
                          id="assessment-due-date"
                          label="Due Date"
                          type="date"
                          value={assessmentForm.dueDate}
                          onChange={(event) =>
                            handleAssessmentChange("dueDate", event.target.value)
                          }
                        />
                        <FormInput
                          id="assessment-file"
                          label="Attachment URL"
                          value={assessmentForm.fileUrl}
                          onChange={(event) =>
                            handleAssessmentChange("fileUrl", event.target.value)
                          }
                          placeholder="https://example.com/assessment.pdf"
                        />
                        <div>
                          <label
                            className="mb-1.5 block text-sm text-slate-700"
                            htmlFor="assessment-file-upload"
                          >
                            Upload attachment instead
                          </label>
                          <input
                            id="assessment-file-upload"
                            type="file"
                            accept=".pdf"
                            onChange={(event) =>
                              handleAssessmentChange(
                                "attachmentFile",
                                event.target.files?.[0] || null,
                              )
                            }
                            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-sm file:text-slate-700"
                          />
                          {assessmentForm.attachmentFile ? (
                            <p className="mt-2 text-xs text-slate-500">
                              Selected file: {assessmentForm.attachmentFile.name}
                            </p>
                          ) : null}
                        </div>
                        <div>
                          <label
                            htmlFor="assessment-description"
                            className="mb-1.5 block text-sm text-slate-700"
                          >
                            Description
                          </label>
                          <textarea
                            id="assessment-description"
                            rows={3}
                            value={assessmentForm.description}
                            onChange={(event) =>
                              handleAssessmentChange("description", event.target.value)
                            }
                            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            placeholder="What should learners complete?"
                          />
                        </div>
                        <div className="space-y-4 rounded-xl border border-slate-200 bg-white/70 p-4">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <h4 className="text-sm font-semibold text-slate-900">
                                Questions and Answers
                              </h4>
                              <p className="text-xs text-slate-500">
                                Add as many questions as you need for assignments, quizzes, or exams.
                              </p>
                            </div>
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={handleAddQuestion}
                              className="w-full sm:w-auto"
                            >
                              Add Question
                            </Button>
                          </div>

                          {assessmentForm.questions.map((question, index) => (
                            <div
                              key={question.id}
                              className="space-y-4 rounded-lg border border-slate-200 bg-white p-4"
                            >
                              <div className="flex items-center justify-between gap-3">
                                <p className="text-sm font-semibold text-slate-900">
                                  Question {index + 1}
                                </p>
                                {assessmentForm.questions.length > 1 ? (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => handleRemoveQuestion(question.id)}
                                  >
                                    Remove
                                  </Button>
                                ) : null}
                              </div>

                              <div>
                                <label
                                  htmlFor={`question-type-${question.id}`}
                                  className="mb-1.5 block text-sm text-slate-700"
                                >
                                  Question Type
                                </label>
                                <select
                                  id={`question-type-${question.id}`}
                                  value={question.type}
                                  onChange={(event) =>
                                    handleAssessmentQuestionChange(
                                      question.id,
                                      "type",
                                      event.target.value,
                                    )
                                  }
                                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                >
                                  <option value="text">Text Answer</option>
                                  <option value="mcq">Multiple Choice</option>
                                </select>
                              </div>

                              <div>
                                <label
                                  htmlFor={`question-text-${question.id}`}
                                  className="mb-1.5 block text-sm text-slate-700"
                                >
                                  Question
                                </label>
                                <textarea
                                  id={`question-text-${question.id}`}
                                  rows={3}
                                  value={question.question}
                                  onChange={(event) =>
                                    handleAssessmentQuestionChange(
                                      question.id,
                                      "question",
                                      event.target.value,
                                    )
                                  }
                                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                  placeholder="Enter the question or task"
                                />
                              </div>

                              {question.type === "mcq" ? (
                                <div>
                                  <label
                                    htmlFor={`question-options-${question.id}`}
                                    className="mb-1.5 block text-sm text-slate-700"
                                  >
                                    Options (one per line)
                                  </label>
                                  <textarea
                                    id={`question-options-${question.id}`}
                                    rows={4}
                                    value={question.optionsText}
                                    onChange={(event) =>
                                      handleAssessmentQuestionChange(
                                        question.id,
                                        "optionsText",
                                        event.target.value,
                                      )
                                    }
                                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                    placeholder={"Option 1\nOption 2\nOption 3"}
                                  />
                                </div>
                              ) : null}

                              <FormInput
                                id={`question-answer-${question.id}`}
                                label="Correct Answer / Expected Answer"
                                value={question.correctAnswer}
                                onChange={(event) =>
                                  handleAssessmentQuestionChange(
                                    question.id,
                                    "correctAnswer",
                                    event.target.value,
                                  )
                                }
                                placeholder={
                                  question.type === "mcq"
                                    ? "Type the exact correct option"
                                    : "Type the expected answer"
                                }
                              />
                            </div>
                          ))}
                        </div>
                        {!course.modules.length ? (
                          <p className="text-sm text-amber-700">
                            Add at least one module before creating an assessment for this course.
                          </p>
                        ) : null}
                        {assessmentMessage ? (
                          <p className="text-sm text-blue-700">{assessmentMessage}</p>
                        ) : null}
                        <Button type="submit" className="w-full sm:w-auto">
                          Create Assessment
                        </Button>
                      </form>
                    ) : null}
                  </div>
                ) : null}
              </article>
            )
          })
        ) : (
          <div className="rounded-lg bg-white p-6 text-sm text-slate-600 shadow-sm ring-1 ring-slate-200">
            You have not created any courses yet.
          </div>
        )}
      </div>
    </div>
  )
}

export default InstructorMyCoursesPage
