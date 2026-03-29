import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Button from "../components/Button"
import FormInput from "../components/FormInput"
import { useAppData } from "../context/AppDataContext"
import { useAuth } from "../context/AuthContext"

function InstructorCreateCoursePage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { createCourse } = useAppData()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [thumbnail, setThumbnail] = useState("")
  const [category, setCategory] = useState("General")
  const [error, setError] = useState("")

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!title.trim() || !description.trim()) {
      setError("Title and description are required.")
      return
    }

    createCourse({
      title: title.trim(),
      description: description.trim(),
      thumbnail: thumbnail.trim(),
      instructor: user?.name || "Instructor",
      category,
    })
    navigate("/instructor/my-courses")
  }

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
        Create Course
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200"
      >
        <FormInput
          id="course-title"
          label="Course Title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="e.g. Advanced React Patterns"
        />

        <div>
          <label
            htmlFor="course-description"
            className="mb-1.5 block text-sm text-slate-700"
          >
            Description
          </label>
          <textarea
            id="course-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            placeholder="Brief overview of the course"
          />
        </div>

        <FormInput
          id="thumbnail-url"
          label="Thumbnail URL"
          value={thumbnail}
          onChange={(event) => setThumbnail(event.target.value)}
          placeholder="https://placehold.co/800x500"
        />

        <div>
          <label htmlFor="course-category" className="mb-1.5 block text-sm text-slate-700">
            Category
          </label>
          <select
            id="course-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="General">General</option>
            <option value="Frontend">Frontend</option>
            <option value="Programming">Programming</option>
            <option value="Design">Design</option>
            <option value="Backend">Backend</option>
          </select>
        </div>

        {error ? <p className="text-xs text-red-600">{error}</p> : null}

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button type="submit" className="w-full sm:w-auto">
            Save Course
          </Button>
          <Button to="/instructor/my-courses" variant="secondary" className="w-full sm:w-auto">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}

export default InstructorCreateCoursePage
