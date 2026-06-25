import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../config/routes';

const AuthForm = ({
  title,
  subtitle,
  fields,
  onSubmit,
  submitLabel = 'Submit',
  loading = false,
  error = '',
  footer,
}) => {
  const [values, setValues] = useState(() =>
    Object.fromEntries(fields.map((field) => [field.name, '']))
  );
  const [fieldErrors, setFieldErrors] = useState({});

  const update = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = {};
    fields.forEach((field) => {
      if (field.required && !values[field.name]?.trim()) {
        nextErrors[field.name] = `${field.label} is required`;
      }
    });
    if (Object.keys(nextErrors).length) {
      setFieldErrors(nextErrors);
      return;
    }
    await onSubmit(values);
  };

  const inputClass =
    'w-full border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-enugu-gold';

  return (
    <div>
      <h1 className="font-display text-xl font-bold uppercase tracking-wide text-enugu-black">{title}</h1>
      {subtitle && <p className="mt-2 text-sm text-gray-500">{subtitle}</p>}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {fields.map((field) => (
          <div key={field.name}>
            <label htmlFor={field.name} className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-500">
              {field.label}
            </label>
            <input
              id={field.name}
              type={field.type || 'text'}
              value={values[field.name]}
              onChange={(e) => update(field.name, e.target.value)}
              placeholder={field.placeholder}
              autoComplete={field.autoComplete}
              disabled={loading}
              className={inputClass}
            />
            {fieldErrors[field.name] && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors[field.name]}</p>
            )}
          </div>
        ))}

        {error && (
          <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="enugu-btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Please wait…' : submitLabel}
        </button>
      </form>

      {footer}
    </div>
  );
};

export const AuthFooterLinks = ({ children }) => (
  <div className="mt-6 text-center text-sm text-gray-500">{children}</div>
);

export const AuthLink = ({ to, children }) => (
  <Link to={to} className="font-medium text-enugu-black hover:text-enugu-gold">
    {children}
  </Link>
);

export default AuthForm;
