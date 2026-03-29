const API_BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "")

export async function apiRequest(path, options = {}) {
  const { method = "GET", body, token, headers = {} } = options
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      ...(!isFormData && body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...(body
      ? { body: isFormData ? body : JSON.stringify(body) }
      : {}),
  })

  const contentType = response.headers.get("content-type") || ""
  const data = contentType.includes("application/json")
    ? await response.json()
    : null

  if (!response.ok) {
    throw new Error(data?.message || "Request failed.")
  }

  return data
}
