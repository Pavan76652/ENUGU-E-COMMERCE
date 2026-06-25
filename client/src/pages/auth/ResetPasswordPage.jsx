import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authApi } from '../../services/authApi';
import { AuthForm, AuthFooterLinks, AuthLink } from '../../components/auth';
import { ROUTES } from '../../config/routes';

const resetFields = [
  { name: 'password', label: 'New Password', type: 'password', required: true, autoComplete: 'new-password' },
  { name: 'confirmPassword', label: 'Confirm Password', type: 'password', required: true, autoComplete: 'new-password' },
];

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (values) => {
    if (values.password !== values.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!token) {
      setError('Invalid or missing reset token');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await authApi.resetPassword({ token, password: values.password });
      navigate(ROUTES.LOGIN, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not reset password.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div>
        <h1 className="font-display text-xl font-bold uppercase tracking-wide text-enugu-black">Invalid Link</h1>
        <p className="mt-3 text-sm text-gray-600">This password reset link is invalid or expired.</p>
        <AuthFooterLinks>
          <AuthLink to={ROUTES.FORGOT_PASSWORD}>Request a new link</AuthLink>
        </AuthFooterLinks>
      </div>
    );
  }

  return (
    <AuthForm
      title="Reset Password"
      subtitle="Enter your new password"
      fields={resetFields}
      onSubmit={handleSubmit}
      submitLabel="Update Password"
      loading={loading}
      error={error}
      footer={
        <AuthFooterLinks>
          <AuthLink to={ROUTES.LOGIN}>Back to sign in</AuthLink>
        </AuthFooterLinks>
      }
    />
  );
};

export default ResetPasswordPage;
