import Button from "./Button"

function CourseCard({ course }) {
  return (
    <article className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-slate-200">
      <img
        src={course.thumbnail}
        alt={course.title}
        className="h-44 w-full object-cover"
        loading="lazy"
      />
      <div className="space-y-3 p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-blue-700">
          {course.category}
        </p>
        <h3 className="text-lg font-semibold text-slate-900">{course.title}</h3>
        <p className="text-xs text-slate-500">Instructor: {course.instructor}</p>
        <p className="text-sm leading-6 text-slate-600">{course.description}</p>
        <Button to={`/courses/${course.id}`} fullWidth>
          View Course
        </Button>
      </div>
    </article>
  )
}

export default CourseCard
