import Button from "./Button"

function AssessmentCard({
  assessment,
  status = "Pending",
  scoreLabel = "",
  onStart,
  isStudent = false,
}) {
  return (
    <article className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{assessment.title}</h3>
          <p className="mt-1 text-sm text-slate-600">{assessment.description}</p>
          <p className="mt-2 text-xs text-slate-500">
            {assessment.questions.length} question(s)
            {assessment.moduleId ? " | Module linked" : " | Course level"}
          </p>
        </div>
        <div className="flex min-w-[150px] flex-col items-start gap-2 sm:items-end">
          <span
            className={[
              "rounded-md px-2 py-1 text-xs font-medium",
              status === "Completed"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-amber-100 text-amber-700",
            ].join(" ")}
          >
            {status}
          </span>
          {scoreLabel ? <p className="text-sm text-slate-600">{scoreLabel}</p> : null}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Button
          href={assessment.fileUrl}
          target="_blank"
          rel="noreferrer"
          variant="secondary"
          className="w-full sm:w-auto"
        >
          Download File
        </Button>
        {isStudent ? (
          <Button onClick={onStart} className="w-full sm:w-auto">
            {status === "Completed" ? "Resubmit" : "Submit Assessment"}
          </Button>
        ) : null}
      </div>
    </article>
  )
}

export default AssessmentCard
