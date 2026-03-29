import Button from "../components/Button"

function NotFoundPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      <div className="rounded-lg bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
        <h1 className="text-3xl font-semibold text-slate-900">Page not found</h1>
        <p className="mt-3 text-sm text-slate-600">
          The page you are looking for does not exist.
        </p>
        <div className="mt-5">
          <Button to="/">Go to Homepage</Button>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
