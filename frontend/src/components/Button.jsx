import { Link } from "react-router-dom"

function Button({
  children,
  to,
  href,
  type = "button",
  variant = "primary",
  fullWidth = false,
  className = "",
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary:
      "bg-white text-slate-700 ring-1 ring-slate-300 hover:bg-slate-100",
    ghost: "bg-transparent text-blue-700 hover:bg-blue-50",
  }

  const widthClass = fullWidth ? "w-full" : ""
  const mergedClassName = [baseStyles, variants[variant], widthClass, className]
    .join(" ")
    .trim()

  if (to) {
    return (
      <Link to={to} className={mergedClassName} {...props}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={mergedClassName} {...props}>
        {children}
      </a>
    )
  }

  return (
    <button type={type} className={mergedClassName} {...props}>
      {children}
    </button>
  )
}

export default Button
