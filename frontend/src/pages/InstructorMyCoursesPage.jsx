import { useMemo, useState } from "react"
import Button from "../components/Button"
import FormInput from "../components/FormInput"
import { useAppData } from "../context/AppDataContext"
import { useAuth } from "../context/AuthContext"

function InstructorMyCoursesPage() {
  const { user } = useAuth()
  const { courses, addModuleToCourse } = useAppData()
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

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
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
    </div>
  )
}

export default InstructorMyCoursesPage
