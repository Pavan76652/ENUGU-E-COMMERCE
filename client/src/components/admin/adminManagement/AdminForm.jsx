import { useState, useEffect } from 'react';
import {
  ADMIN_PERMISSION_GROUPS,
  ALL_ASSIGNABLE_PERMISSIONS,
  PERMISSION_LABELS,
} from '../../../constants/permissions';

const toFormValues = (admin) => ({
  firstName: admin?.firstName ?? '',
  lastName: admin?.lastName ?? '',
  email: admin?.email ?? '',
  phone: admin?.phone ?? '',
  password: '',
  permissions: admin?.permissions ?? [],
});

const AdminForm = ({ initialData, onSubmit, onCancel, isEditing = false, loading = false }) => {
  const [form, setForm] = useState(toFormValues(initialData));
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(toFormValues(initialData));
  }, [initialData]);

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const togglePermission = (permission) => {
    setForm((prev) => {
      const has = prev.permissions.includes(permission);
      return {
        ...prev,
        permissions: has
          ? prev.permissions.filter((p) => p !== permission)
          : [...prev.permissions, permission],
      };
    });
  };

  const toggleGroup = (groupPermissions, checked) => {
    setForm((prev) => {
      const withoutGroup = prev.permissions.filter((p) => !groupPermissions.includes(p));
      return {
        ...prev,
        permissions: checked ? [...withoutGroup, ...groupPermissions] : withoutGroup,
      };
    });
  };

  const isGroupFullySelected = (groupPermissions) =>
    groupPermissions.every((p) => form.permissions.includes(p));

  const validate = () => {
    const next = {};

    if (!form.firstName.trim() || form.firstName.trim().length < 2) {
      next.firstName = 'First name is required (min 2 characters)';
    }
    if (!isEditing) {
      if (!form.email.trim()) next.email = 'Email is required';
      if (!form.password || form.password.length < 8) {
        next.password = 'Password must be at least 8 characters';
      }
    }
    if (form.phone && !/^[6-9]\d{9}$/.test(form.phone)) {
      next.phone = 'Enter a valid 10-digit Indian mobile number';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      permissions: form.permissions.filter((p) => ALL_ASSIGNABLE_PERMISSIONS.includes(p)),
    };

    if (form.phone.trim()) payload.phone = form.phone.trim();
    if (!isEditing) {
      payload.email = form.email.trim().toLowerCase();
      payload.password = form.password;
    }

    onSubmit(payload);
  };

  const inputClass = (field) =>
    `w-full rounded border px-3 py-2 text-sm outline-none focus:border-enugu-gold ${
      errors[field] ? 'border-red-400' : 'border-gray-300'
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">First name</label>
          <input
            type="text"
            value={form.firstName}
            onChange={(e) => update('firstName', e.target.value)}
            className={inputClass('firstName')}
          />
          {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>}
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Last name</label>
          <input
            type="text"
            value={form.lastName}
            onChange={(e) => update('lastName', e.target.value)}
            className={inputClass('lastName')}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            disabled={isEditing}
            className={`${inputClass('email')} disabled:bg-gray-50 disabled:text-gray-500`}
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Phone (optional)</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
            placeholder="10-digit mobile"
            className={inputClass('phone')}
          />
          {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
        </div>
        {!isEditing && (
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-gray-600">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
              autoComplete="new-password"
              className={inputClass('password')}
            />
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
          </div>
        )}
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Permissions</p>
        <p className="mt-1 text-xs text-gray-400">
          Grant access to specific admin areas. Super-admin-only actions remain restricted.
        </p>
        <div className="mt-4 space-y-4">
          {Object.entries(ADMIN_PERMISSION_GROUPS).map(([key, group]) => (
            <div key={key} className="rounded border border-gray-200 p-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isGroupFullySelected(group.permissions)}
                  onChange={(e) => toggleGroup(group.permissions, e.target.checked)}
                  className="rounded border-gray-300 text-enugu-gold focus:ring-enugu-gold"
                />
                <span className="text-sm font-medium text-enugu-black">{group.label}</span>
              </label>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {group.permissions.map((perm) => (
                  <label key={perm} className="flex items-start gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={form.permissions.includes(perm)}
                      onChange={() => togglePermission(perm)}
                      className="mt-0.5 rounded border-gray-300 text-enugu-gold focus:ring-enugu-gold"
                    />
                    <span>{PERMISSION_LABELS[perm] ?? perm}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-gray-200 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-enugu-black px-6 py-2.5 text-xs font-medium uppercase tracking-wider text-white transition hover:bg-enugu-gold hover:text-enugu-black disabled:opacity-50"
        >
          {loading ? 'Saving...' : isEditing ? 'Update Admin' : 'Create Admin'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded border border-gray-300 px-6 py-2.5 text-xs font-medium uppercase tracking-wider text-gray-600 disabled:opacity-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default AdminForm;
