import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import Button from "../components/Button"
import FormInput from "../components/FormInput"
import { useAuth } from "../context/AuthContext"

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("student")
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = {}

    if (!email.trim()) {
      nextErrors.email = "Email is required."
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      nextErrors.email = "Enter a valid email address."
    }

    if (!password.trim()) {
      nextErrors.password = "Password is required."
    }

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length) {
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      login({ email, role })
      setIsSubmitting(false)
      navigate(location.state?.from?.pathname || "/dashboard", { replace: true })
    }, 900)
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl px-4 sm:px-6">
      <div className="mx-auto w-full max-w-md rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
        <h1 className="text-2xl font-semibold text-slate-900">Login</h1>
        <p className="mt-2 text-sm text-slate-600">
          Access your role dashboard, courses, and library resources.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
          <FormInput
            id="email"
            type="email"
            label="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            error={errors.email}
          />

          <FormInput
            id="password"
            type="password"
            label="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            error={errors.password}
          />

          <div>
            <label htmlFor="role" className="mb-1.5 block text-sm text-slate-700">
              Role (Demo)
            </label>
            <select
              id="role"
              value={role}
              onChange={(event) => setRole(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="admin">Admin</option>
              <option value="instructor">Instructor</option>
              <option value="student">Student</option>
            </select>
          </div>

          <Button type="submit" fullWidth disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
