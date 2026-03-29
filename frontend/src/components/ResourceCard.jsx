import Button from "./Button"

const typeToIcon = {
  PDF: "PDF",
  Slides: "SLD",
  Exercises: "EX",
}

function ResourceCard({ resource }) {
  return (
    <article className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-xs font-semibold text-slate-700">
          {typeToIcon[resource.type] ?? "FILE"}
        </div>
        <span className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600">
          {resource.type}
        </span>
      </div>

      <h3 className="text-base font-semibold text-slate-900">{resource.title}</h3>
      <p className="mt-1 text-sm text-slate-500">{resource.category}</p>

      <div className="mt-4">
        <Button
          href={resource.fileUrl}
          target="_blank"
          rel="noreferrer"
          fullWidth
        >
          Download
        </Button>
      </div>
    </article>
  )
}

export default ResourceCard
