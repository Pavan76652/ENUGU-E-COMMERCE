import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authApi } from '../../services/authApi';
import { setCredentials } from '../../store/slices/authSlice';
import { AuthForm, AuthFooterLinks, AuthLink } from '../../components/auth';
import { ROUTES } from '../../config/routes';

const loginFields = [
  { name: 'email', label: 'Email', type: 'email', required: true, autoComplete: 'email' },
  { name: 'password', label: 'Password', type: 'password', required: true, autoComplete: 'current-password' },
];

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (values) => {
    setLoading(true);
    setError('');
    try {
      const res = await authApi.loginCustomer(values);
      const payload = res.data ?? res;
      dispatch(setCredentials({ user: payload.user, accessToken: payload.accessToken }));
      const redirect = location.state?.from?.pathname || ROUTES.ACCOUNT;
      navigate(redirect, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm
      title="Sign In"
      subtitle="Welcome back to ENUGU"
      fields={loginFields}
      onSubmit={handleSubmit}
      submitLabel="Sign In"
      loading={loading}
      error={error}
      footer={
        <AuthFooterLinks>
          <p>
            New here? <AuthLink to={ROUTES.REGISTER}>Create account</AuthLink>
          </p>
          <p className="mt-2">
            <AuthLink to={ROUTES.FORGOT_PASSWORD}>Forgot password?</AuthLink>
          </p>
        </AuthFooterLinks>
      }
    />
  );
};

export default LoginPage;
