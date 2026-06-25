import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAuth } from '../../hooks';
import { authApi } from '../../services/authApi';
import { clearCredentials } from '../../store/slices/authSlice';
import { ROLE_LABELS } from '../../constants/roles';
import { ROUTES } from '../../config/routes';

const AdminHeader = ({ onMenuToggle = () => {} }) => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // clear local session even if API fails
    }
    dispatch(clearCredentials());
    navigate(ROUTES.ADMIN_LOGIN, { replace: true });
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-enugu-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuToggle}
          className="inline-flex h-10 w-10 items-center justify-center rounded border border-gray-200 text-enugu-black md:hidden"
          aria-label="Toggle admin sidebar"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div>
        <h1 className="text-sm font-medium text-enugu-black">Admin Panel</h1>
        <p className="text-xs text-gray-500">Manage your ENUGU store</p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-enugu-black">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-xs text-enugu-gold">{ROLE_LABELS[user?.role]}</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-enugu-black text-sm font-medium text-enugu-white">
          {user?.firstName?.[0]}
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded border border-gray-200 px-2.5 py-1.5 text-[11px] font-medium uppercase tracking-wider text-gray-600 transition hover:border-enugu-black hover:text-enugu-black sm:px-3 sm:text-xs"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;