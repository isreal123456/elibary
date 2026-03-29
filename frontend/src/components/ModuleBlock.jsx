import Button from "./Button"

function ModuleBlock({ module }) {
  return (
    <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
      <h3 className="text-xl font-semibold text-slate-900">{module.title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{module.description}</p>
      {module.lessons?.length ? (
        <ul className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
          {module.lessons.map((lesson) => (
            <li key={lesson} className="rounded-md bg-slate-100 px-3 py-2">
              {lesson}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-5 overflow-hidden rounded-lg bg-slate-100">
        <iframe
          title={module.title}
          src={module.videoUrl}
          className="aspect-video w-full"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>

      {module.pdfUrl ? (
        <div className="mt-5">
          <Button
            href={module.pdfUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto"
          >
            Download PDF
          </Button>
        </div>
      ) : (
        <p className="mt-5 text-sm text-slate-500">No PDF attached to this module yet.</p>
      )}
    </section>
  )
}

export default ModuleBlock
