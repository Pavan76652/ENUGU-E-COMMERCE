import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authApi } from '../../services/authApi';
import { setCredentials } from '../../store/slices/authSlice';
import { AuthForm, AuthFooterLinks, AuthLink } from '../../components/auth';
import { ROUTES } from '../../config/routes';

const registerFields = [
  { name: 'firstName', label: 'First Name', required: true, autoComplete: 'given-name' },
  { name: 'lastName', label: 'Last Name', required: true, autoComplete: 'family-name' },
  { name: 'email', label: 'Email', type: 'email', required: true, autoComplete: 'email' },
  { name: 'phone', label: 'Phone', type: 'tel', placeholder: '10-digit mobile', autoComplete: 'tel' },
  { name: 'password', label: 'Password', type: 'password', required: true, autoComplete: 'new-password' },
];

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (values) => {
    setLoading(true);
    setError('');
    try {
      const res = await authApi.register({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim(),
        phone: values.phone?.replace(/\D/g, '').slice(-10) || undefined,
        password: values.password,
      });
      const payload = res.data ?? res;
      dispatch(setCredentials({ user: payload.user, accessToken: payload.accessToken }));
      navigate(ROUTES.ACCOUNT, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm
      title="Create Account"
      subtitle="Join ENUGU — wear your identity"
      fields={registerFields}
      onSubmit={handleSubmit}
      submitLabel="Register"
      loading={loading}
      error={error}
      footer={
        <AuthFooterLinks>
          Already have an account? <AuthLink to={ROUTES.LOGIN}>Sign in</AuthLink>
        </AuthFooterLinks>
      }
    />
  );
};

export default RegisterPage;
