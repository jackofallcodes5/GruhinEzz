import "./FormField.css";

/**
 * Simple styled input used across the auth forms.
 */
export default function FormField({
  type = "text",
  placeholder,
  value,
  onChange,
  name,
  autoComplete,
}) {
  return (
    <input
      className="form-field"
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
    />
  );
}
