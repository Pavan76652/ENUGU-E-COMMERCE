import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authApi } from '../../services/authApi';
import { setCredentials } from '../../store/slices/authSlice';
import { AuthForm, AuthFooterLinks, AuthLink } from '../../components/auth';
import BrandLogo from '../../components/common/BrandLogo';
import { ROUTES } from '../../config/routes';
import { ADMIN_ROLES } from '../../constants/roles';

const loginFields = [
  { name: 'email', label: 'Email', type: 'email', required: true, autoComplete: 'email' },
  { name: 'password', label: 'Password', type: 'password', required: true, autoComplete: 'current-password' },
];

const AdminLoginPage = ({ superAdmin = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (values) => {
    setLoading(true);
    setError('');
    try {
      const loginFn = superAdmin ? authApi.loginSuperAdmin : authApi.loginAdmin;
      const res = await loginFn(values);
      const payload = res.data ?? res;

      if (!ADMIN_ROLES.includes(payload.user?.role) && !superAdmin) {
        throw new Error('Not an admin account');
      }

      dispatch(setCredentials({ user: payload.user, accessToken: payload.accessToken }));
      navigate(ROUTES.ADMIN_DASHBOARD, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Admin login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-enugu-black px-4 py-10">
      <div className="mb-8 text-center">
        <BrandLogo
          to={ROUTES.HOME}
          height={56}
          className="justify-center"
          imgClassName="mx-auto h-14 w-auto sm:h-16 brightness-0 invert"
        />
        <p className="mt-4 text-xs uppercase tracking-[0.3em] text-enugu-gold">
          Store Management
        </p>
      </div>

      <div className="w-full max-w-md rounded-lg bg-enugu-white p-8 shadow-xl">
        <AuthForm
          title={superAdmin ? 'Super Admin' : 'Admin Login'}
          subtitle="Sign in to manage your store"
          fields={loginFields}
        onSubmit={handleSubmit}
        submitLabel="Sign In"
        loading={loading}
        error={error}
        footer={
          <AuthFooterLinks>
            <AuthLink to={ROUTES.HOME}>← Back to store</AuthLink>
            {!superAdmin && (
              <p className="mt-2">
                <AuthLink to={ROUTES.SUPER_ADMIN_LOGIN}>Super admin login</AuthLink>
              </p>
            )}
          </AuthFooterLinks>
        }
      />
      </div>
    </div>
  );
};
export default AdminLoginPage;
