import { useState } from 'react';
import { authApi } from '../../services/authApi';
import { AuthForm, AuthFooterLinks, AuthLink } from '../../components/auth';
import { ROUTES } from '../../config/routes';

const forgotFields = [
  { name: 'email', label: 'Email', type: 'email', required: true, autoComplete: 'email' },
];

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    setError('');
    try {
      await authApi.forgotPassword({ email: values.email.trim() });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not send reset email.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div>
        <h1 className="font-display text-xl font-bold uppercase tracking-wide text-enugu-black">Check Your Email</h1>
        <p className="mt-3 text-sm text-gray-600">
          If an account exists for that email, we sent password reset instructions.
        </p>
        <AuthFooterLinks>
          <AuthLink to={ROUTES.LOGIN}>Back to sign in</AuthLink>
        </AuthFooterLinks>
      </div>
    );
  }

  return (
    <AuthForm
      title="Forgot Password"
      subtitle="We'll send you a reset link"
      fields={forgotFields}
      onSubmit={handleSubmit}
      submitLabel="Send Reset Link"
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

export default ForgotPasswordPage;
