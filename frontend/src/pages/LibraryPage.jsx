import { useEffect, useMemo, useState } from "react"
import ResourceCard from "../components/ResourceCard"
import SearchBar from "../components/SearchBar"
import { useAppData } from "../context/AppDataContext"

function LibraryPage() {
  const { resources } = useAppData()
  const [searchTerm, setSearchTerm] = useState("")
  const [type, setType] = useState("All")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 700)
    return () => clearTimeout(timer)
  }, [])

  const fileTypes = useMemo(
    () => ["All", ...new Set(resources.map((resource) => resource.type))],
    [resources],
  )

  const filteredResources = resources.filter((resource) => {
    const matchesQuery =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = type === "All" || resource.type === type
    return matchesQuery && matchesType
  })

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 sm:px-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          E-Library
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Browse downloadable notes, slides, and exercises.
        </p>
      </div>

      <section className="grid gap-3 rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:grid-cols-[1fr_auto] sm:items-center">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search resources..."
        />
        <select
          value={type}
          onChange={(event) => setType(event.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        >
          {fileTypes.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </section>

      {isLoading ? (
        <div className="rounded-lg bg-white p-8 text-sm text-slate-600 shadow-sm ring-1 ring-slate-200">
          Loading resources...
        </div>
      ) : filteredResources.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredResources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg bg-white p-8 text-center text-sm text-slate-600 shadow-sm ring-1 ring-slate-200">
          No resources found.
        </div>
      )}
    </div>
  )
}

export default LibraryPage
