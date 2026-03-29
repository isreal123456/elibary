function FormInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  ...props
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm text-slate-700">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        {...props}
      />
      {error ? <p className="mt-1.5 text-xs text-red-600">{error}</p> : null}
    </div>
  )
}

export default FormInput
