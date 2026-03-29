function LoadingCard() {
  return (
    <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="animate-pulse space-y-4">
        <div className="h-36 rounded-lg bg-slate-200" />
        <div className="h-3 w-1/3 rounded bg-slate-200" />
        <div className="h-4 w-3/4 rounded bg-slate-200" />
        <div className="h-4 w-full rounded bg-slate-200" />
        <div className="h-10 rounded-lg bg-slate-200" />
      </div>
    </div>
  )
}

export default LoadingCard
