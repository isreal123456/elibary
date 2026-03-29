import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import Button from "../components/Button"
import FormInput from "../components/FormInput"
import { useAuth } from "../context/AuthContext"

function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  })
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (field) => (event) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: event.target.value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const nextErrors = {}
    setSubmitError("")

    if (!form.name.trim()) {
      nextErrors.name = "Name is required."
    }

    if (!form.email.trim()) {
      nextErrors.email = "Email is required."
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      nextErrors.email = "Enter a valid email address."
    }

    if (!form.password.trim()) {
      nextErrors.password = "Password is required."
    } else if (form.password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters."
    }

    if (form.confirmPassword !== form.password) {
      nextErrors.confirmPassword = "Passwords do not match."
    }

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length) {
      return
    }

    setIsSubmitting(true)

    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      })
      navigate("/dashboard", { replace: true })
    } catch (error) {
      setSubmitError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl px-4 sm:px-6">
      <div className="mx-auto w-full max-w-md rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
        <h1 className="text-2xl font-semibold text-slate-900">Create Account</h1>
        <p className="mt-2 text-sm text-slate-600">
          Register with your real details and choose the role you need for the platform.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
          <FormInput
            id="name"
            label="Full Name"
            value={form.name}
            onChange={handleChange("name")}
            placeholder="Jane Doe"
            error={errors.name}
          />

          <FormInput
            id="email"
            type="email"
            label="Email"
            value={form.email}
            onChange={handleChange("email")}
            placeholder="you@example.com"
            error={errors.email}
          />

          <FormInput
            id="password"
            type="password"
            label="Password"
            value={form.password}
            onChange={handleChange("password")}
            placeholder="Create a password"
            error={errors.password}
          />

          <FormInput
            id="confirmPassword"
            type="password"
            label="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange("confirmPassword")}
            placeholder="Repeat your password"
            error={errors.confirmPassword}
          />

          <div>
            <label htmlFor="role" className="mb-1.5 block text-sm text-slate-700">
              Role
            </label>
            <select
              id="role"
              value={form.role}
              onChange={handleChange("role")}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
            </select>
          </div>

          {submitError ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">
              {submitError}
            </p>
          ) : null}

          <Button type="submit" fullWidth disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <p className="mt-4 text-sm text-slate-600">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-blue-700 hover:text-blue-800">
            Login here
          </Link>
          .
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
